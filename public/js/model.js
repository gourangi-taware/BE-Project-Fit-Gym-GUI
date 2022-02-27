console.log("BicepCurl model connected.");
const videoElement = document.getElementById('videoModel');
const canvasElement = document.getElementById('canvasModel');
const counterElement = document.getElementById('counter');

canvasElement.style.width='100%';
canvasElement.style.height='100%';
canvasElement.width  = canvasElement.offsetWidth;
canvasElement.height = canvasElement.offsetHeight;

const canvasCtx = canvasElement.getContext('2d');

let bicepAngle = 180;
let count = 0;
let eccentric = false;

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (!results.poseLandmarks) {
        // grid.updateLandmarks([]);
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        return;
    }

    // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //                     canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    // canvasCtx.globalCompositeOperation = 'source-in';
    // canvasCtx.fillStyle = '#00FF00';
    // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});

    // console.log(results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW].visibility);

    if (results.poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST].visibility > 0.75 && results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW].visibility > 0.75 && results.poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER].visibility > 0.75){
        console.log("TRUE");
        bicepAngle = getBicepAngle(results.poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST], results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW], results.poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER]);
        canvasCtx.fillStyle = "#00FF00";
        canvasCtx.fillRect(25, 25, 100, toRepMeter(bicepAngle, toRepMeter(bicepAngle, 100)));
        canvasCtx.rect(25, 25, 100, 100);
        canvasCtx.stroke();
        
        if (bicepAngle < 45 && !eccentric){
            // console.log("REP DONE");
            count += 1;
            eccentric = true;
            counterElement.innerHTML = count;
        }
        else if (bicepAngle > 150){
            eccentric = false;
        }
    }

    // console.log(count);

    canvasCtx.restore();

    // grid.updateLandmarks(results.poseWorldLandmarks);

    // grid.updateLandmarks(results.poseLandmarks);
}

function getBicepAngle(shoulder, elbow, wrist){
    return rad_to_deg(find_angle_rad(shoulder, elbow, wrist));
}

function bicepCheck(poseLandmarks){
    bicepAngle = getBicepAngle(results.poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST], results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW], results.poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER]);
}

function toRepMeter(angle, height){
    if (angle < 45){
        angle = 45;
    }
    else if (angle > 150){
        angle = 150;
    }
    return ((angle - 45) / 105) * height;
}

function find_angle_rad(L,M,R) {
    var AB = Math.sqrt(Math.pow(M.x-L.x,2)+ Math.pow(M.y-L.y,2));    
    var BC = Math.sqrt(Math.pow(M.x-R.x,2)+ Math.pow(M.y-R.y,2)); 
    var AC = Math.sqrt(Math.pow(R.x-L.x,2)+ Math.pow(R.y-L.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}
function rad_to_deg(A)
{
    let X = A * 180/Math.PI;
    return X;
}

// const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// const grid = new LandmarkGrid(landmarkContainer);

const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

pose.onResults(onResults);
console.log(POSE_LANDMARKS);
    
const camera = new Camera(videoElement, {
    onFrame: async () => {
    await pose.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();

// var video;
// var poseNet;
// var pose;
// var skeleton;

// function setup() {
//   createCanvas(640, 480);
//   video = createCapture(VIDEO);
//   video.hide();
//   poseNet = ml5.poseNet(video, modelLoaded);
//   poseNet.on('pose', gotPoses);
// }

// function gotPoses(poses) {
//   //console.log(poses); 
//   if (poses.length > 0) {
//     pose = poses[0].pose;
//     skeleton = poses[0].skeleton;
//   }
// }


// function modelLoaded() {
//   console.log('poseNet ready');
// }

// function draw() {
//   image(video, 0, 0);

//   if (pose) {
//     let eyeR = pose.rightEye;
//     let eyeL = pose.leftEye;
//     let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
//     fill(255, 0, 0);
//     ellipse(pose.nose.x, pose.nose.y, d);
//     fill(0, 0, 255);
//     ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
//     ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
//     for (let i = 0; i < pose.keypoints.length; i++) {
//       let x = pose.keypoints[i].position.x;
//       let y = pose.keypoints[i].position.y;
//       fill(0,255,0);
//       ellipse(x,y,16,16);
//     }
    
//     for (let i = 0; i < skeleton.length; i++) {
//       let a = skeleton[i][0];
//       let b = skeleton[i][1];
//       strokeWeight(2);
//       stroke(255);
//       line(a.position.x, a.position.y,b.position.x,b.position.y);      
//     }
//   }
// }