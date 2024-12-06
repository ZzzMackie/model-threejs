import { storeToRefs } from 'pinia';
import { useLightStore } from '@stores/light.js';

export function useLight() {
  const light = useLightStore();

  return storeToRefs(light);
}
