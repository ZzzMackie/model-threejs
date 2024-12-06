import { computed } from 'vue';
import { useScene } from '@use/sceneStore.js';
import { useSceneStore } from '@stores/scene.js';
export function useModelSetting() {
  const { currentModel } = useScene();
  const sceneStore = useSceneStore();
  const data = computed(() => {
    return {
      translate: {
        label: '位置',
        type: 'position',
        xValue: currentModel?.value?.transform?.translate?.x,
        yValue: currentModel?.value?.transform?.translate?.y,
        zValue: currentModel?.value?.transform?.translate?.z
      },
      scale: {
        label: '缩放',
        type: 'position',
        xValue: currentModel?.value?.transform?.scale?.x,
        yValue: currentModel?.value?.transform?.scale?.y,
        zValue: currentModel?.value?.transform?.scale?.z
      },
      rotation: {
        label: '旋转',
        type: 'position',
        xValue: currentModel?.value?.transform?.rotation?.x,
        yValue: currentModel?.value?.transform?.rotation?.y,
        zValue: currentModel?.value?.transform?.rotation?.z
      },
      order: {
        label: '渲染次序',
        type: 'inputNumber',
        value: currentModel?.value?.renderOrder || 0
      }
    };
  });
  const orderChange = value => {
    sceneStore.changeModelMeshOrder(value);
  };
  const translateChange = ({ type, value }) => {
    data.value['translate'][`${type}Value`] = value;
    setModelMeshTransform('translate');
  };
  const scaleChange = ({ type, value }) => {
    data.value['scale'][`${type}Value`] = value;
    setModelMeshTransform('scale');
  };
  const rotationChange = ({ type, value }) => {
    data.value['rotation'][`${type}Value`] = value;
    setModelMeshTransform('rotation');
  };
  const setModelMeshTransform = type => {
    sceneStore.setModelMeshTransform(type, {
      x: data.value[`${type}`].xValue,

      y: data.value[`${type}`].yValue,

      z: data.value[`${type}`].zValue
    });
  };
  return {
    data,
    translateChange,
    scaleChange,
    rotationChange,
    currentModel,
    orderChange
  };
}
