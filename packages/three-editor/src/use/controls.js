import { storeToRefs } from 'pinia';
import { useControlsStore } from '@stores/controls.js';

export function useControls() {
  const controls = useControlsStore();
  return storeToRefs(controls);
}
