import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

let faceDetector: FaceDetector | null = null;

export async function initializeFaceDetector() {
  if (faceDetector) return faceDetector;
  
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  
  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
      delegate: "GPU"
    },
    runningMode: "IMAGE"
  });
  
  return faceDetector;
}

export async function detectFace(imageElement: HTMLImageElement) {
  const detector = await initializeFaceDetector();
  const detections = detector.detect(imageElement);
  return detections;
}
