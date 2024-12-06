import { ref, computed } from 'vue';
import { useCameraStore } from '@stores/camera.js';
import { useControlsStore } from '@stores/controls.js';
import { useCamera } from '@use/cameraStore.js';
import { useScene } from '@use/sceneStore.js';
import { useDownloadFile } from '@use/utils.js';
import { useControls } from '@use/controls.js';

import { useThreeEngineVm } from '@use/useThreeEngineVm.js';
import { useMessage } from '@use/message.js';
export function useCameraSetting() {
  const { threeEngine } = useThreeEngineVm();
  const { maxDistance, maxPolarAngle, minDistance, minPolarAngle } = useControls();
  const { camera } = useCamera();
  const { name } = useScene();
  const cameraStore = useCameraStore();
  const controlsStore = useControlsStore();
  const size = ref('custom');
  const cameraNameData = computed(() => {
    return {
      label: '相机组名',
      type: 'textInput',
      value: camera.value.name
    };
  });
  const cameraNameChange = value => {
    cameraStore.setValue('name', value);
  };
  const fovData = computed(() => {
    return {
      label: '视角',
      type: 'slider',
      value: camera.value.object.fov,
      showInput: true,
      max: 120,
      min: 10,
      step: 1
    };
  });
  const orthographicCameraData = computed(() => {
    return {
      label: '正交相机',
      type: 'switch',
      value: camera.value.orthographicCamera
    };
  });
  const bgData = computed(() => {
    return {
      label: '透明背景',
      type: 'switch',
      value: camera.value.transparentBackground
    };
  });
  const controlsData = ref(null);
  const maxDistanceData = computed(() => {
    return {
      label: '缩放范围（最远）',
      type: 'inputNumber',
      value: maxDistance.value,
      max: 10000,
      min: 0
    };
  });
  const minDistanceData = computed(() => {
    return {
      label: '缩放范围（最近）',
      type: 'inputNumber',
      value: minDistance.value,
      max: 10000,
      min: 0
    };
  });
  const maxPolarAngleData = computed(() => {
    return {
      label: '垂直翻转角度（最大）',
      type: 'inputNumber',
      value: maxPolarAngle.value,
      max: Math.PI,
      min: 0
    };
  });
  const minPolarAngleData = computed(() => {
    return {
      label: '垂直翻转角度（最小）',
      type: 'inputNumber',
      value: minPolarAngle.value,
      max: Math.PI,
      min: 0
    };
  });
  controlsData.value = {
    maxDistanceData,
    minDistanceData,
    maxPolarAngleData,
    minPolarAngleData
  };
  const maxDistanceChange = val => {
    controlsChange(val, 'maxDistance');
  };

  const minDistanceChange = val => {
    controlsChange(val, 'minDistance');
  };

  const maxPolarAngleChange = val => {
    controlsChange(val, 'maxPolarAngle');
  };

  const minPolarAngleChange = val => {
    controlsChange(val, 'minPolarAngle');
  };
  const controlsChange = (val, type) => {
    controlsStore.setControls({
      [type]: val
    });
    threeEngine.setOrbitControls({
      [type]: val
    });
  };

  const sizeOptions = ref(['custom', '600x600', 'space', '1920x1080', '2560x1600', 'space', '1080x1920', '1600x2560']);
  const positionData = computed(() => {
    return {
      label: '默认角度',
      type: 'position',
      xValue: camera.value.object?.position?.['x'] || 0,
      yValue: camera.value.object?.position?.['y'] || 0,
      zValue: camera.value.object?.position?.['z'] || 8
    };
  });
  const positionChange = ({ value, type }) => {
    positionData.value[`${type}Value`] = value;
    cameraStore.setCameraObjectPosition(
      positionData.value.xValue,
      positionData.value.yValue,
      positionData.value.zValue
    );
  };

  const fovChange = val => {
    cameraStore.setCameraObject({
      fov: val
    });
  };
  const orthographicCameraChange = val => {
    cameraStore.setOrthographicCamera(val);
  };
  const bgChange = val => {
    cameraStore.setCamera({
      transparentBackground: val
    });
  };
  const sizeChange = val => {
    if (val === 'custom') return;
    const arr = val.split('x');
    cameraStore.setCameraScreenshot({
      height: parseInt(arr[1]),
      width: parseInt(arr[0])
    });
  };

  const change = () => {
    size.value = 'custom';
  };
  const onDownLoad = () => {
    if (!camera.value.screenshot.url) {
      useMessage().warning('没有图片,请先创建截图');
      return;
    }
    const MathId = Math.random() * 1000;
    const fileType = camera.value.screenshotType.includes('png')
      ? 'png'
      : camera.value.screenshotType.includes('jpg')
        ? 'jpg'
        : 'webp';
    const fileName = `${name.value}__${MathId}.${fileType}`;
    const path = camera.value.screenshot.url;
    const canvasType = camera.value.screenshotType;
    const type = path.includes('base64') ? 'base64' : 'image';
    useDownloadFile({
      name: fileName,
      path,
      type, // FIXEME 换成base64
      canvasType
    });
  };
  const createScreenshot = () => {
    const screenshot = threeEngine.screenshot(
      camera.value.screenshot.width,
      camera.value.screenshot.height,
      camera.value.screenshotType,
      camera.value.transparentBackground
    );
    cameraStore.setCameraScreenshot({
      url: screenshot
    });
  };
  const nearData = computed(() => {
    return {
      label: '近点',
      type: 'inputNumber',
      value: camera.value.object.near,
      showInput: true,
      max: 100000,
      min: 0,
      step: 1
    };
  });
  const nearChange = val => {
    cameraStore.setCameraObject({
      near: val
    });
  };
  const farData = computed(() => {
    return {
      label: '远点',
      type: 'inputNumber',
      value: camera.value.object.far,
      showInput: true,
      max: 100000,
      min: 0,
      step: 1
    };
  });
  const farChange = val => {
    cameraStore.setCameraObject({
      far: val
    });
  };
  return {
    bgChange,
    cameraStore,
    camera,
    size,
    fovData,
    orthographicCameraData,
    bgData,
    sizeOptions,
    fovChange,
    orthographicCameraChange,
    sizeChange,
    change,
    onDownLoad,
    createScreenshot,
    positionData,
    positionChange,
    maxDistanceData,
    minDistanceData,
    maxPolarAngleData,
    minPolarAngleData,
    maxDistanceChange,
    minDistanceChange,
    maxPolarAngleChange,
    minPolarAngleChange,
    nearData,
    nearChange,
    farData,
    farChange,
    cameraNameData,
    cameraNameChange
  };
}
