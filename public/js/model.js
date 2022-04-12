console.log("Model connected.");
const videoElement = document.getElementById('videoModel');
const canvasElement = document.getElementById('canvasModel');
const counterElement = document.getElementById('counter');
const leftCounterElement = document.getElementById('leftCounter');
const rightCounterElement = document.getElementById('rightCounter');
const startElement = document.getElementsByClassName('buttonPlay')[0];

var currentexercise;

startElement.onclick = function fun()
{   
    var location=window.location.href;
    if(location=="http://localhost:5000/models/bicepcurlmodel")
    {
        currentexercise="BicepCurl";
    }
    else if(location=="http://localhost:5000/models/squatsmodel")
    {
        currentexercise="Squats";
    }
    else if(location=="http://localhost:5000/models/pushupsmodel")
    {
        currentexercise="PushUp";
    }
    else if(location=="http://localhost:5000/models/lungesmodel")
    {
        currentexercise="Lunges";
    }
    else if(location=="http://localhost:5000/models/jumpingjacksmodel")
    {
        currentexercise="JumpingJacks";
    }
    else if(location=="http://localhost:5000/models/wall-push-ups-model")
    {
        currentexercise="WallPushUps";
    }
    startExercise = !startExercise;
    console.log("Toggled to ", startExercise);
    console.log("Current Exercise", currentexercise);
} 

canvasElement.style.width='100%';
canvasElement.style.height='100%';
canvasElement.width  = canvasElement.offsetWidth;
canvasElement.height = canvasElement.offsetHeight;

const canvasCtx = canvasElement.getContext('2d');
const repMeterHeight = 100;

let bicepAngle = 180;
let count = 0;
let eccentric = false;
let startExercise = false;
let leftBicepCount = -1;
let rightBicepCount = -1;
let leftEccentric = false;
let rightEccentric = false;

console.log(currentexercise);
// console.log(rad_to_deg(find_angle_rad({x:0, y:0, z:0}, {x:1, y:0, z:0}, {x:1.5, y:(Math.pow(3, 0.5) / 2), z:0})));

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

    if (startExercise){
        canvasCtx.rect(25, 25, 100, 100);
        canvasCtx.stroke();

        if(currentexercise=="BicepCurl")
        {   
            bicepCheck(results.poseLandmarks, results.poseWorldLandmarks);
        }
        else if(currentexercise=="Squats")
        {   
            squatCheck(results.poseLandmarks);
        }
        else if(currentexercise=="PushUp")
        {
            pushUpsCheck(results.poseLandmarks);
        }
        else if(currentexercise=="Lunges")
        {
            lungesCheck(results.poseLandmarks);
        }
        else if(currentexercise=="JumpingJacks")
        {
            jumpingJacksCheck(results.poseLandmarks);
        }
        else if(currentexercise=="WallPushUps")
        {
            wallPushUpsCheck(results.poseLandmarks);
        }

        if (currentexercise != "BicepCurl"){
            counterElement.innerHTML = count;
        }
        else{
            leftCounterElement.innerHTML = Math.max(0, leftBicepCount);
            rightCounterElement.innerHTML = Math.max(0, rightBicepCount);
        }
    }
    // console.log(results.poseWorldLandmarks[POSE_LANDMARKS.LEFT_WRIST].z);
    // console.log(distPointsXYZ(results.poseWorldLandmarks[POSE_LANDMARKS.LEFT_WRIST], results.poseWorldLandmarks[POSE_LANDMARKS.LEFT_SHOULDER]));
    // console.log((find_angle_rad_3D(results.poseWorldLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], results.poseWorldLandmarks[POSE_LANDMARKS.LEFT_ELBOW], results.poseWorldLandmarks[POSE_LANDMARKS.LEFT_WRIST])));
    
    // pushUpsCheck(results.poseLandmarks);

    canvasCtx.restore();

    // grid.updateLandmarks(results.poseWorldLandmarks, POSE_CONNECTIONS);

    // grid.updateLandmarks(results.poseLandmarks);
}

function toRange(amin, amax, rmin, rmax, v){
    return (((v - amin) / (amax - amin)) * rmax) + rmin;
}

function squatCheck(poseLandmarks){
    if (poseLandmarks[POSE_LANDMARKS.RIGHT_HIP].visibility > 0.75 && poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE].visibility > 0.75 && poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE].visibility > 0.75){
        leftKneeAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.LEFT_HIP], poseLandmarks[POSE_LANDMARKS.LEFT_KNEE], poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE]));
        rightKneeAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE], poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE]));

        let legDist = distPoints(poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE], poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE]);
        let shoulderDist = distPoints(poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER]);

        let leftKneeToToeDist = distPoints(poseLandmarks[POSE_LANDMARKS.LEFT_FOOT_INDEX], poseLandmarks[POSE_LANDMARKS.LEFT_KNEE]);
        let rightKneeToToeDist = distPoints(poseLandmarks[POSE_LANDMARKS.RIGHT_FOOT_INDEX], poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE]);
        
        console.log("Leg Distance:", legDist);
        
        console.log("Left Knee To Toe:", leftKneeToToeDist);
        console.log("Right Knee To Toe:", rightKneeToToeDist);
        // console.log("-------------------------------------------------------------------------------------------------------------------");

        if ((legDist / shoulderDist) >= 1.4 && (legDist / shoulderDist) <= 1.5){
            console.log("ALL GOOD");
        }
        else{
            console.log("INCREASE DISTANCE");
            return;
        }

        if (!eccentric && rightKneeAngle > 175){
            count += 1;
            eccentric = true;
        }
        else if (eccentric && rightKneeAngle < 90){
            eccentric = false;
        }

        console.log(legDist - shoulderDist);    

        canvasCtx.fillStyle = "#00FF00";
        console.log("RIGHT KNEE: ", rightKneeAngle);
        console.log("LEFT KNEE: ", leftKneeAngle);
        canvasCtx.fillRect(25, 25, 100, 100 - toRepMeter(rightKneeAngle, 100, 90, 180));

        // canvasCtx.fillStyle = "#00FF00";
        // canvasCtx.fillRect(25, 150, 100, 100 - toRepMeter(rightKneeAngle, 100, 90, 180));
    }
}

function lungesCheck(poseLandmarks){
    if (poseLandmarks[POSE_LANDMARKS.RIGHT_HIP].visibility > 0.75 && poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE].visibility > 0.75 && poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE].visibility > 0.75){
        rightKneeAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE], poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE]));

        canvasCtx.fillStyle = "#00FF00";
        canvasCtx.fillRect(25, 25, 100, 100 - toRepMeter(rightKneeAngle, 100, 90, 180));

        // canvasCtx.fillStyle = "#00FF00";
        // canvasCtx.fillRect(25, 150, 100, 100 - toRepMeter(rightKneeAngle, 100, 90, 180));
        let thighDist = distPoints(poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], poseLandmarks[POSE_LANDMARKS.RIGHT_KNEE]);
        let lowerDist = distPoints(poseLandmarks[POSE_LANDMARKS.LEFT_KNEE], poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE]);
        
        if (!eccentric && rightKneeAngle > 100){
            console.log(Math.abs(thighDist - lowerDist));
            console.log("One rep");
            count += 1;
            eccentric = true;
        }
        else if (eccentric && rightKneeAngle < 90){
            eccentric = false;
        }
    }
}

function bicepCheck(poseLandmarks, poseWorldLandmarks){
    let rightHandCheckVisibilityArray = [
        poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST],
        poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
        poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER]
    ];

    let leftHandCheckVisibilityArray = [
        poseLandmarks[POSE_LANDMARKS.LEFT_WRIST],
        poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
        poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER]
    ];

    // console.log(poseWorldLandmarks[POSE_LANDMARKS.LEFT_SHOULDER].z);
    // console.log(rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW], poseLandmarks[POSE_LANDMARKS.LEFT_WRIST])));
    // console.log(Math.abs(poseLandmarks[POSE_LANDMARKS.LEFT_WRIST].z - poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER].z));
    if (visibilityArrayCheck(leftHandCheckVisibilityArray) && visibilityArrayCheck(rightHandCheckVisibilityArray)){
        let leftBicepAngle = (find_angle_rad_3D(poseWorldLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseWorldLandmarks[POSE_LANDMARKS.LEFT_ELBOW], poseWorldLandmarks[POSE_LANDMARKS.LEFT_WRIST]));
        let rightBicepAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER], poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW], poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST]));

        let leftBicepXDiff = Math.abs(poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER].x - poseLandmarks[POSE_LANDMARKS.LEFT_WRIST].x);
        let rightBicepXDiff = Math.abs(poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER].x - poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST].x);

        // console.log(leftBicepXDiff);
        // console.log(rightBicepXDiff);
        // console.log("----------------------------");

        // console.log("right:", rightBicepAngle);
        // console.log("------------------------------------");
        
        if (leftBicepAngle < 45 && !leftEccentric){
            // console.log("REP DONE");
            leftEccentric = true;
        }
        else if (leftEccentric && leftBicepAngle > 50 && leftBicepXDiff > 0 && leftBicepXDiff < 0.1 && rightBicepXDiff > 0 && rightBicepXDiff < 0.1){
            // console.log("Left:", leftBicepXDiff);
            // console.log("Right:", rightBicepXDiff);
            leftBicepCount += 1;
            leftEccentric = false;
        }

        if (rightBicepAngle < 45 && !rightEccentric){
            rightEccentric = true;
        }
        else if (rightEccentric && rightBicepAngle > 150 && rightBicepXDiff > 0 && rightBicepXDiff < 0.1 && rightBicepXDiff > 0 && rightBicepXDiff < 0.1){
            rightBicepCount += 1;
            rightEccentric = false;
        }
    }

    // if (poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST].visibility > 0.75 && poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW].visibility > 0.75 && poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER].visibility > 0.75){
    //     console.log("TRUE");
    //     bicepAngle = rad_to_deg(find_angle_rad(shoulder, elbow, wrist));

    //     canvasCtx.fillStyle = "#00FF00";
    //     canvasCtx.fillRect(25, 25, 100, toRepMeter(bicepAngle, 100, 45, 150));
        
    //     if (bicepAngle < 45 && !eccentric){
    //         console.log("REP DONE");
    //         eccentric = true;
    //     }
    //     else if (eccentric && bicepAngle > 150){
    //         count += 1;
    //         eccentric = false;
    //     }
    // }
}

function jumpingJacksCheck(poseLandmarks){
    let visibilityArray = [
        poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE], poseLandmarks[POSE_LANDMARKS.LEFT_HIP], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], 
        poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], poseLandmarks[POSE_LANDMARKS.LEFT_HIP], 
        poseLandmarks[POSE_LANDMARKS.LEFT_WRIST], poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseLandmarks[POSE_LANDMARKS.LEFT_HIP],
        poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST], poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP]
    ];

    let visibility = visibilityArrayCheck(visibilityArray);

    if (visibility){
        let leftHipAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.LEFT_ANKLE], poseLandmarks[POSE_LANDMARKS.LEFT_HIP], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP]));
        let rightHipAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.RIGHT_ANKLE], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], poseLandmarks[POSE_LANDMARKS.LEFT_HIP]));

        let leftArmpitAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.LEFT_WRIST], poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseLandmarks[POSE_LANDMARKS.LEFT_HIP]));
        let rightArmpitAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS.RIGHT_WRIST], poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP]));
        
        console.log("Left hip", leftHipAngle);
        console.log("Right Hip", rightHipAngle);
        console.log("Left Armpit", leftArmpitAngle);
        console.log("Right Armpit", rightArmpitAngle);
        console.log("Eccentric", eccentric);
        console.log("-----------------------------------------------------------------------------------------------");

        if (eccentric && leftArmpitAngle < 12 && rightArmpitAngle < 12 && leftHipAngle < 90 && rightHipAngle < 90){
            console.log("REP DONE");
            count += 1;
            eccentric = false;
        }
        else if (!eccentric && leftArmpitAngle > 150 && rightArmpitAngle > 150 && leftHipAngle > 100 && rightHipAngle > 100){
            eccentric = true;
        }
    }
}

function pushUpsCheck(poseLandmarks){
    let direction = "RIGHT";

    let visibilityArray = [
        poseLandmarks[POSE_LANDMARKS[`${direction}_SHOULDER`]], poseLandmarks[POSE_LANDMARKS[`${direction}_ELBOW`]], poseLandmarks[POSE_LANDMARKS[`${direction}_WRIST`]],
        poseLandmarks[POSE_LANDMARKS[`${direction}_SHOULDER`]], poseLandmarks[POSE_LANDMARKS[`${direction}_HIP`]], poseLandmarks[POSE_LANDMARKS[`${direction}_ANKLE`]]
    ];

    let visibility = visibilityArrayCheck(visibilityArray);
    
    if (visibility){
        let elbowAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS[`${direction}_SHOULDER`]], poseLandmarks[POSE_LANDMARKS[`${direction}_ELBOW`]], poseLandmarks[POSE_LANDMARKS[`${direction}_WRIST`]]));
        let torsoAngle = rad_to_deg(find_angle_rad(poseLandmarks[POSE_LANDMARKS[`${direction}_SHOULDER`]], poseLandmarks[POSE_LANDMARKS[`${direction}_HIP`]], poseLandmarks[POSE_LANDMARKS[`${direction}_ANKLE`]]));
        
        // console.log("Elbow Angle:", elbowAngle); // Start - 165 End - (70 - 85)
        // console.log("Torso Angle:", torsoAngle); // Start - 165 - 175 // Avg - 170
        // console.log("-------------------------------------------------------------------------------------------");

        if (eccentric && elbowAngle < 85 && torsoAngle < 175 && torsoAngle > 165){
            eccentric = false;
        }
        else if (!eccentric && elbowAngle > 165 && torsoAngle < 175 && torsoAngle > 165){
            count += 1;
            eccentric = true;
        }
    }
}

function wallPushUpsCheck(poseLandmarks){
    pushUpsCheck(poseLandmarks);
}

function visibilityArrayCheck(visibilityArray){
    let visibility = true;
    for(let i = 0; i < visibilityArray.length; i++){
        if (visibilityArray[i].visibility < 0.75){
            visibility = false;
            break;
        }   
    }
    return visibility;
}

function toRepMeter(angle, height, angleMin, angleMax){
    if (angle < angleMin){
        angle = angleMin;
    }
    else if (angle > angleMax){
        angle = angleMax;
    }
    return ((angle - angleMin) / (angleMax - angleMin)) * height;
}

function find_angle_rad_3D(L, M, R)
{   
    x1 = L.x; y1 = L.y; z1 = -L.z;
    x2 = M.x; y2 = M.y; z2 = -M.z;
    x3 = R.x; y3 = R.y; z3 = -R.z;

    // console.log(x1, y1, z1);
    // console.log(x2, y2, z2);
    // console.log(x3, y3, z3);

    // Find direction ratio of line AB
    var ABx = x1 - x2;
    var ABy = y1 - y2;
    var ABz = z1 - z2;
 
    // Find direction ratio of line BC
    var BCx = x3 - x2;
    var BCy = y3 - y2;
    var BCz = z3 - z2;
 
    // Find the dotProduct
    // of lines AB & BC
    var dotProduct
        = ABx * BCx
          + ABy * BCy
          + ABz * BCz;
 
    // Find magnitude of
    // line AB and BC
    var magnitudeAB
        = ABx * ABx
          + ABy * ABy
          + ABz * ABz;
    var magnitudeBC
        = BCx * BCx
          + BCy * BCy
          + BCz * BCz;
 
    // Find the cosine of
    // the angle formed
    // by line AB and BC
    var angle = dotProduct;
    angle /= Math.sqrt(
        magnitudeAB * magnitudeBC);
 
    // Find angle in radian
    angle = (angle * 180) / Math.PI;
 
    // Print the angle
    return (Math.abs(angle).toFixed(4));
}

// function find_angle_rad_3D(L, M, R){
//     L.x = toRange(-1, 1, 0, 10, L.x);
//     L.y = toRange(-1, 1, 0, 10, L.y);
//     L.z = toRange(-1, 1, 0, 10, L.z);

//     M.x = toRange(-1, 1, 0, 10, M.x);
//     M.y = toRange(-1, 1, 0, 10, M.y);
//     M.z = toRange(-1, 1, 0, 10, M.z);

//     R.x = toRange(-1, 1, 0, 10, R.x);
//     R.y = toRange(-1, 1, 0, 10, R.y);
//     R.z = toRange(-1, 1, 0, 10, R.z);


//     let AB = {x: L.x - M.x, y: L.y - M.y, z: L.z - M.z};
//     let BC = {x: R.x - M.x, y: R.y - M.y, z: R.z - M.z};

//     let magAB = Math.sqrt(Math.pow(M.x - L.x, 2) + Math.pow(M.y - L.y, 2) + Math.pow(M.z - L.z, 2));
//     let magBC = Math.sqrt(Math.pow(R.x - M.x, 2) + Math.pow(R.y - M.y, 2) + Math.pow(R.z - M.z, 2));

//     num = (AB.x * BC.x) + (AB.y * BC.y) + (AB.z * BC.z);

//     console.log(num);

//     return Math.acos(num / magAB * magBC);
// }

function find_angle_rad(L,M,R) {
    var AB = Math.sqrt(Math.pow(M.x - L.x, 2) + Math.pow(M.y - L.y, 2));    
    var BC = Math.sqrt(Math.pow(M.x - R.x, 2) + Math.pow(M.y - R.y, 2)); 
    var AC = Math.sqrt(Math.pow(R.x - L.x, 2) + Math.pow(R.y - L.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

function distPointsXYZ(P1, P2){
    return Math.sqrt(Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2) + Math.pow(P1.z - P2.z, 2));
}

function distPoints(P1, P2){
    return Math.sqrt(Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2));
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