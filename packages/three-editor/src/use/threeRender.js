/* eslint-disable no-case-declarations */
import { useResizeObserver } from '@vueuse/core';
import { toRaw } from 'vue';
import { useCamera } from '@use/cameraStore.js';
import { useControls } from '@use/controls.js';
import { useScene } from '@use/sceneStore.js';
import { useLight } from '@use/lightStore.js';
import { useSceneStore } from '@stores/scene.js';
import { useEnvironment } from './environmentStore.js';
import { useLightStore } from '@stores/light.js';
import { useEditorStore } from '@stores/editor.js';
import { useMessage } from '@use/message.js';
import { useThreeEngineVm } from './useThreeEngineVm.js';
import { usePanelStore } from '@stores/panel.js';
const message = str => {
  const message = useMessage();
  message.info({
    id: 'threeRender',
    content: str,
    duration: 5000
  });
};
const getThreeEngineVm = function () {
  let { threeEngine } = useThreeEngineVm();
  return threeEngine;
};

const renderModelList = async () => {
  console.time('渲染模型');
  message('开始渲染模型');
  let threeEngine = getThreeEngineVm();
  const { materials, images, modelMesh } = useScene();
  const originMaterials = toRaw(materials.value);
  const originImages = toRaw(images.value);
  const originModelMesh = toRaw(modelMesh.value);
  const p = await threeEngine.loadMeshObject({
    data: {
      materials: originMaterials,
      images: originImages,
      modelMesh: originModelMesh
    }
  });
  console.timeEnd('渲染模型');
  message('渲染模型完成');
  return p;
};
const renderLight = async () => {
  try {
    console.time('渲染灯光');
    message('开始渲染灯光');
    let threeEngine = getThreeEngineVm();
    const { lights } = useLight();
    const originLights = toRaw(lights.value);

    for (const light of originLights) {
      threeEngine.addLight({ lightClass: light.type, lightConfig: light });
    }
    console.timeEnd('渲染灯光');
    message('渲染灯光完成');
  } catch (error) {
    console.log(error);
  }
};

const renderHdr = async () => {
  console.time('渲染hdr');
  message('开始渲染hdr');
  let threeEngine = getThreeEngineVm();
  const { environment } = useEnvironment();
  const originEnvironment = toRaw(environment.value);
  const p = await threeEngine.initSceneHDR({
    ...originEnvironment
  });
  console.timeEnd('渲染hdr');
  message('渲染环境hdr完成');
  return p;
};
const createOrbitControls = async () => {
  console.time('渲染轨道控制器');
  message('初始化轨道控制器');
  let threeEngine = getThreeEngineVm();
  const {
    maxDistance,
    maxPolarAngle,
    minDistance,
    minPolarAngle,
    autoRotate,
    autoRotateSpeed,
    rotateSpeed,
    enabled,
    enablePan,
    enableDamping
  } = useControls();
  const p = await threeEngine.initOrbitControls({
    maxDistance: maxDistance.value,
    maxPolarAngle: maxPolarAngle.value,
    minDistance: minDistance.value,
    minPolarAngle: minPolarAngle.value,
    autoRotate: autoRotate.value,
    autoRotateSpeed: autoRotateSpeed.value,
    rotateSpeed: rotateSpeed.value,
    enabled: enabled.value,
    enablePan: enablePan.value,
    enableDamping: enableDamping.value
  });
  console.timeEnd('渲染轨道控制器');
  message('初始化轨道控制器完成');
  return p;
};

const watchWrapperResize = (sceneWrap, canvasDom) => {
  let threeEngine = getThreeEngineVm();
  useResizeObserver(sceneWrap, entries => {
    const entry = entries[0];
    // 渲染区域父级节点
    const { width, height } = entry.contentRect;
    threeEngine.emit('resizeRendererBeforeUpdated', { width, height });
    // canvas渲染区域
    let canvasWidth = canvasDom.value.clientWidth;
    let canvasHeight = canvasDom.value.clientHeight;
    // 宽高不同，需要更新视图
    if (width !== canvasWidth || height !== canvasHeight) {
      threeEngine.resizeRendererAndCamera(width, height);
    }
  });
};

const initBackground = async () => {
  console.time('初始化背景色');
  message('初始化背景色');
  let threeEngine = getThreeEngineVm();
  const { background } = useEnvironment();
  const originBackground = toRaw(background.value);
  const p = await threeEngine.initBackground(originBackground);
  console.timeEnd('初始化背景色');
  message('初始化背景色完成');
  return p;
};
const initEventListener = () => {
  let threeEngine = getThreeEngineVm();
  // 选中模型监听
  threeEngine.renderer__three.on('intersectObjectSelected', intersectObject => {
    if (intersectObject.object.isMesh) {
      useSceneStore().setSelected(intersectObject.object.uuid, true);
      usePanelStore().changePanel('Materials');
    }
  });
  // 变换控制器位置变换监听
  threeEngine.control__three.on('transformControlsChange', (mode, object) => {
    try {
      let x, y, z;
      let radToDeg = threeEngine.getTHREE().MathUtils.radToDeg;
      switch (mode) {
        case 'translate':
          x = Number(object.position.x.toFixed(3));
          y = Number(object.position.y.toFixed(3));
          z = Number(object.position.z.toFixed(3));
          if (object.isLight) {
            useLightStore().setLightPosition(object.uuid, { x, y, z });
          }
          if (object.isMesh || object.isGroup) {
            useSceneStore().setModelMeshTransform('translate', { x, y, z });
          }
          break;
        case 'rotation':
          x = Number(object.rotation.x.toFixed(3));
          y = Number(object.rotation.y.toFixed(3));
          z = Number(object.rotation.z.toFixed(3));
          if (object.isLight) {
            x = radToDeg(Number(object.rotation.x.toFixed(3)));
            y = radToDeg(Number(object.rotation.y.toFixed(3)));
            z = radToDeg(Number(object.rotation.z.toFixed(3)));
            useLightStore().setLightPosition(object.uuid, { x, y, z }, 'rotation');
          }
          if (object.isMesh || object.isGroup) {
            useSceneStore().setModelMeshTransform('rotation', { x, y, z });
          }
          break;
        case 'scale':
          x = Number(object.scale.x.toFixed(3));
          y = Number(object.scale.y.toFixed(3));
          z = Number(object.scale.z.toFixed(3));
          if (object.isLight) {
            useLightStore().setLightPosition(object.uuid, { x, y, z }, 'scale');
          }
          if (object.isMesh || object.isGroup) {
            useSceneStore().setModelMeshTransform('scale', { x, y, z });
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export const cameraAnimateReset = () => {
  const { camera } = useCamera();
  const originCamera = toRaw(camera.value.object);
  let threeEngine = getThreeEngineVm();
  threeEngine.cameraAnimateReset(originCamera.position);
};
export const setAutoRotate = () => {
  let threeEngine = getThreeEngineVm();
  threeEngine.setAutoRotate();
};
export const setOrbitControls = config => {
  let threeEngine = getThreeEngineVm();
  threeEngine.setOrbitControls(config);
};
const emitRenderProgressType = val => {
  const editorStore = useEditorStore();
  let percentage = editorStore.percentage;
  percentage += val;
  if (percentage > 100) {
    percentage = 100;
  }
  editorStore.setPercentage(percentage);
};
export async function useInitThreeRender(sceneWrap, canvasDom, viewHelperDom, init = true) {
  const startTime = new Date().getTime();
  console.time('初始化3d模型');
  message('初始化3d渲染引擎');
  emitRenderProgressType(10);
  let threeEngine = getThreeEngineVm();
  console.timeEnd('初始化3d模型');
  emitRenderProgressType(10);

  console.time('初始化threeEngine实例');
  // 初始化场景
  init &&
    threeEngine.initApp({
      renderOptions: {
        canvas: canvasDom.value
      }
    });
  message('初始化3d场景');
  emitRenderProgressType(10);
  console.timeEnd('初始化threeEngine实例');

  // 创建轨道控制器
  createOrbitControls()
    .then(() => {
      emitRenderProgressType(10);
    })
    .catch(() => {
      emitRenderProgressType(10);
    });
  // 初始化变换控制器
  threeEngine
    .initTransformControls()
    .then(() => {
      emitRenderProgressType(10);
    })
    .catch(() => {
      emitRenderProgressType(10);
    });

  emitRenderProgressType(10);
  const promiseList = [
    // 渲染灯光
    renderLight()
      .then(() => {
        emitRenderProgressType(10);
      })
      .catch(() => {
        emitRenderProgressType(10);
      }),
    // 初始化背景色
    initBackground()
      .then(() => {
        emitRenderProgressType(10);
      })
      .catch(() => {
        emitRenderProgressType(10);
      }),
    // 渲染hdr
    renderHdr()
      .then(() => {
        emitRenderProgressType(10);
      })
      .catch(() => {
        emitRenderProgressType(10);
      }),
    // 渲染模型列表
    renderModelList()
      .then(() => {
        emitRenderProgressType(10);
      })
      .catch(() => {
        emitRenderProgressType(10);
      })
  ];
  await Promise.allSettled(promiseList);
  const endTime = new Date().getTime();
  const time = endTime - startTime;
  useEditorStore().setValue('editorLoading', false);
  init && initEventListener();
  // 监听resize，更新three视图
  init && watchWrapperResize(sceneWrap, canvasDom);
  // 初始化视口观察辅助线
  init && threeEngine.initViewHelper(sceneWrap.value, viewHelperDom.value);
  return time;
}
