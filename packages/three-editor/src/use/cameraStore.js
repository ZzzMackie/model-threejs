import { storeToRefs } from 'pinia';
import { useCameraStore } from '@stores/camera.js';

export function useCamera() {
  const camera = useCameraStore();

  return storeToRefs(camera);
}
