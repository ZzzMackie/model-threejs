import { storeToRefs } from 'pinia';
import { useSceneStore } from '@stores/scene.js';

export function useScene() {
  const scene = useSceneStore();
  return storeToRefs(scene);
}
