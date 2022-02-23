console.log("BicepCurl model connected.");
const videoElement = document.getElementById('videoModel');
const canvasElement = document.getElementById('canvasModel');

canvasElement.style.width='100%';
canvasElement.style.height='100%';
canvasElement.width  = canvasElement.offsetWidth;
canvasElement.height = canvasElement.offsetHeight;

const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    if (!results.poseLandmarks) {
        // grid.updateLandmarks([]);
        return;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
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
    canvasCtx.restore();
    console.log("moz kardi");
    // grid.updateLandmarks(results.poseWorldLandmarks);
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
    
const camera = new Camera(videoElement, {
    onFrame: async () => {
    await pose.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();