import { useProject } from '@use/projectStore.js';
import { useCamera } from '@use/cameraStore.js';
import { ThreeEngine } from '@packages/threeModel-core/main.js';
import { toRaw } from 'vue';
const threeEngineMap = new Map();
window.threeEngineMap = threeEngineMap;
const getThreeEngineVm = function () {
  let threeEngineVm = threeEngineMap.get('threeEngineVm');
  if (!threeEngineVm) {
    const { shadows, shadowType, vr, toneMapping, toneMappingExposure, antialias, autoClear } = useProject();
    const { camera } = useCamera();
    const originCamera = toRaw(camera.value.object);
    threeEngineVm = new ThreeEngine({
      renderOptions: {
        antialias: antialias.value, //抗锯齿
        autoClear: autoClear.value,
        shadows: shadows.value,
        shadowType: shadowType.value,
        vr: vr.value,
        toneMapping: toneMapping.value,
        toneMappingExposure: toneMappingExposure.value
      },
      cameraConfig: originCamera
    });
    threeEngineMap.set('threeEngineVm', threeEngineVm);
  }
  return threeEngineVm;
};

export function useThreeEngineVm() {
  let threeEngine = getThreeEngineVm();

  return {
    threeEngine
  };
}
