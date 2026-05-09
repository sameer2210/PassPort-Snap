import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

let faceDetector: FaceDetector | null = null;

export async function initializeFaceDetector() {
  if (faceDetector) return faceDetector;
  
  const vision = await FilesetResolver.forVisionTasks(
    "/assets/models/mediapipe"
  );
  
  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "/assets/models/mediapipe/blaze_face_short_range.tflite",
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
