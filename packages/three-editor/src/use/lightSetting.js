import { ref, computed } from 'vue';
import { useEnvironment } from '@use/environmentStore.js';
import { useEnvironmentStore } from '@stores/environment.js';
import { useLightStore } from '@stores/light.js';
import { useLight } from '@use/lightStore.js';
import { useDownloadFile } from '@use/utils';
import Config from '@packages/threeModel-core/core/Config.js';
const config = new Config();
export function useLightSetting() {
  const { lights, currentLight, name: lightName } = useLight();
  const lightStore = useLightStore();
  const { environment, name, category_name } = useEnvironment();
  const environmentStore = useEnvironmentStore();
  const mappingTypeOptions = ref([
    {
      value: config.getKey('THREE/EquirectangularReflectionMapping'),
      label: 'EquirectangularReflectionMapping'
    },
    {
      value: config.getKey('THREE/CubeUVReflectionMapping'),
      label: 'CubeUVReflectionMapping'
    }
  ]);
  const lightType = ref([
    {
      value: 'SpotLight',
      name: '聚光灯'
    },
    {
      value: 'PointLight',
      name: '点光源'
    },
    {
      value: 'DirectionalLight',
      name: '平行光'
    },
    {
      value: 'RectAreaLight',
      name: '平面光'
    },
    {
      value: 'HemisphereLight',
      name: '半球形光源'
    },
    {
      value: 'AmbientLight',
      name: '环境光'
    }
  ]);
  const position = computed(() => {
    return {
      label: '位置',
      type: 'position',
      xValue: currentLight.value?.position?.['x'],
      yValue: currentLight.value?.position?.['y'],
      zValue: currentLight.value?.position?.['z']
    };
  });

  const intensity = computed(() => {
    return {
      label: '强度',
      type: 'slider',
      value: currentLight.value?.intensity,
      showInput: true,
      max: 5000,
      min: 0,
      step: 1
    };
  });
  const visible = computed(() => {
    return {
      label: '可见性',
      type: 'switch',
      value: currentLight.value?.visible
    };
  });
  const color = computed(() => {
    return {
      label: '颜色',
      type: 'color',
      value: currentLight.value?.color
    };
  });
  const distance = computed(() => {
    return {
      label: '距离',
      type: 'slider',
      value: currentLight.value?.distance,
      showInput: true,
      max: 500,
      min: 1,
      step: 1
    };
  });
  const decay = computed(() => {
    return {
      label: '衰减',
      type: 'slider',
      value: currentLight.value?.decay,
      showInput: true,
      max: 10,
      min: 1,
      step: 0.1
    };
  });
  const angle = computed(() => {
    return {
      label: '角度',
      type: 'slider',
      value: currentLight.value?.angle,
      showInput: true,
      max: Math.PI / 2,
      min: 0,
      step: 0.01
    };
  });
  const penumbra = computed(() => {
    return {
      label: '边缘',
      type: 'slider',
      value: currentLight.value?.penumbra,
      showInput: true,
      max: 1,
      min: 0,
      step: 0.01
    };
  });
  const height = computed(() => {
    return {
      label: '高度',
      type: 'slider',
      value: currentLight.value?.height != undefined ? currentLight.value?.height : 10,
      showInput: true,
      max: 50,
      min: 0,
      step: 0.01
    };
  });
  const width = computed(() => {
    return {
      label: '宽度',
      type: 'slider',
      value: currentLight.value?.width != undefined ? currentLight.value?.width : 10,
      showInput: true,
      max: 50,
      min: 0,
      step: 0.01
    };
  });
  //光源的功率。单位为流明（lm）。
  const power = computed(() => {
    return {
      label: '功率',
      type: 'slider',
      value: currentLight.value?.power,
      showInput: true,
      max: Math.PI,
      min: 0,
      step: 0.01
    };
  });
  const rotation = computed(() => {
    return {
      label: '旋转',
      type: 'position',
      xValue: currentLight.value?.rotation?.['x'],
      yValue: currentLight.value?.rotation?.['y'],
      zValue: currentLight.value?.rotation?.['z']
    };
  });
  const rotationChange = ({ value, type }) => {
    const rotation = {
      x: currentLight.value?.rotation?.['x'],
      y: currentLight.value?.rotation?.['y'],
      z: currentLight.value?.rotation?.['z']
    };
    rotation[type] = value;
    lightStore.updatedLight({
      rotation
    });
  };
  const positionChange = ({ value, type }) => {
    const position = {
      x: currentLight.value?.position?.['x'],
      y: currentLight.value?.position?.['y'],
      z: currentLight.value?.position?.['z']
    };
    position[type] = value;
    lightStore.updatedLight({
      position
    });
  };
  const intensityChange = val => {
    lightStore.updatedLight({
      intensity: val
    });
  };
  const visibleChange = val => {
    lightStore.updatedLight({
      visible: val
    });
  };
  const colorChange = val => {
    lightStore.updatedLight({
      color: val
    });
  };
  const distanceChange = val => {
    lightStore.updatedLight({
      distance: val
    });
  };
  const decayChange = val => {
    lightStore.updatedLight({
      decay: val
    });
  };
  const angleChange = val => {
    lightStore.updatedLight({
      angle: val
    });
  };
  const penumbraChange = val => {
    lightStore.updatedLight({
      penumbra: val
    });
  };
  const powerChange = val => {
    lightStore.updatedLight({
      power: val
    });
  };
  const widthChange = val => {
    lightStore.updatedLight({
      width: val
    });
  };
  const heightChange = val => {
    lightStore.updatedLight({
      height: val
    });
  };

  const lightsData = computed(() => {
    const data = [
      {
        data: position,
        change: positionChange
      },
      {
        data: intensity,
        change: intensityChange
      },
      {
        data: visible,
        change: visibleChange
      },
      {
        data: color,
        change: colorChange
      }
    ];
    if (currentLight.value?.type === 'RectAreaLight') {
      data.push(
        {
          data: width,
          change: widthChange
        },
        {
          data: height,
          change: heightChange
        },
        {
          data: rotation,
          change: rotationChange
        }
      );
    }

    if (currentLight.value?.type === 'SpotLight' || currentLight.value?.type === 'PointLight') {
      data.push(
        {
          data: distance,
          change: distanceChange
        },
        {
          data: decay,
          change: decayChange
        }
      );
    }
    if (currentLight.value?.type === 'SpotLight') {
      data.push(
        {
          data: angle,
          change: angleChange
        },
        {
          data: penumbra,
          change: penumbraChange
        },
        {
          data: power,
          change: powerChange
        }
      );
    }
    return data;
  });

  const addLight = val => {
    const lightData = {
      type: val.value,
      name: val.value,
      color: 16777215,
      intensity: 1,
      position: {
        x: 0,
        y: 1,
        z: 0
      },
      visible: true
    };
    if (val.value === 'SpotLight' || val.value === 'PointLight') {
      lightData.distance = 100;
      lightData.decay = 2;
    }
    if (val.value === 'SpotLight') {
      lightData.angle = Math.PI / 3;
      lightData.penumbra = 0;
      lightData.power = Math.PI;
    }
    if (val.value === 'RectAreaLight') {
      lightData.width = 10;
      lightData.height = 10;
      lightData.rotation = {
        x: 0,
        y: 0,
        z: 0
      };
    }
    lightStore.setLight([lightData]);
  };

  const deleteLight = val => {
    lightStore.deleteLight(val);
  };
  const changeSelectLight = val => {
    lightStore.changeSelectLight(val?.[0]);
  };
  const lightsNameData = computed(() => {
    return {
      label: '灯光组名',
      type: 'textInput',
      value: lightName.value
    };
  });
  const lightsNameChange = value => {
    lightStore.setValue('name', value);
  };
  const environmentNameData = computed(() => {
    return {
      label: '环境名',
      type: 'textInput',
      value: environmentStore.name
    };
  });
  const environmentNameChange = value => {
    environmentStore.setValue('name', value);
  };

  const mappingTypeData = computed(() => {
    return {
      label: '映射类型',
      type: 'select',
      value: environment.value.mapping,
      options: mappingTypeOptions.value,
      allowSearch: true,
      bordered: false
    };
  });
  const mappingTypeChange = val => {
    mappingTypeData.value.value = val;
    environmentChange('mapping', val);
  };
  const environmentIntensityData = computed(() => {
    return {
      label: '强度',
      value: environment.value.environmentIntensity,
      type: 'slider',
      max: 15,
      min: 0,
      step: 0.05,
      showInput: true
    };
  });
  const environmentIntensityChange = val => {
    environmentChange('environmentIntensity', val);
  };

  const environmentChange = (key, val) => {
    environmentStore.setEnvironment({
      [key]: val
    });
  };
  const environmentRotationXData = computed(() => {
    return {
      label: '旋转X轴',
      type: 'slider',
      value: environment.value.environmentRotation?.['x'],
      max: 360,
      min: 0,
      step: 1,
      showInput: true
    };
  });
  const environmentRotationXChange = value => {
    const position = {
      x: environment.value.environmentRotation?.['x'],
      y: environment.value.environmentRotation?.['y'],
      z: environment.value.environmentRotation?.['z']
    };
    position.x = value;
    environmentChange('environmentRotation', position);
  };
  const environmentRotationYData = computed(() => {
    return {
      label: '旋转Y轴',
      type: 'slider',
      value: environment.value.environmentRotation?.['y'],
      max: 360,
      min: 0,
      step: 1,
      showInput: true
    };
  });
  const environmentRotationYChange = value => {
    const position = {
      x: environment.value.environmentRotation?.['x'],
      y: environment.value.environmentRotation?.['y'],
      z: environment.value.environmentRotation?.['z']
    };
    position.y = value;
    environmentChange('environmentRotation', position);
  };
  const environmentRotationZData = computed(() => {
    return {
      label: '旋转Z轴',
      type: 'slider',
      value: environment.value.environmentRotation?.['z'],
      max: 360,
      min: 0,
      step: 1,
      showInput: true
    };
  });
  const environmentRotationZChange = value => {
    const position = {
      x: environment.value.environmentRotation?.['x'],
      y: environment.value.environmentRotation?.['y'],
      z: environment.value.environmentRotation?.['z']
    };
    position.z = value;
    environmentChange('environmentRotation', position);
  };
  const hdrSuccess = (_, currentFile) => {
    const file = { ...currentFile };
    switch (currentFile.status) {
      case 'error':
      case 'done':
        file.name && environmentStore.setValue('name', file.name);
        environmentStore.setEnvironmentTexture('environment', {
          texture: file
        });
        break;

      default:
        break;
    }
  };
  const fileImageData = computed(() => {
    return {
      value: environment.value.texture,
      isTexture: true,
      title: name.value,
      des: category_name.value
    };
  });

  // 下载hdr文件
  const downloadFile = () => {
    const url = environment.value.path.file ? environment.value.path.url : environment.value.path;
    useDownloadFile({
      name: environment.value.path.file
        ? environment.value.path.file.name
        : `download_${environment.value.texture}.hdr`,
      path: url,
      content: url
    });
  };
  return {
    environmentIntensityData,
    environmentIntensityChange,
    environmentChange,
    mappingTypeOptions,
    mappingTypeData,
    mappingTypeChange,
    fileImageData,
    lights,
    lightsData,
    addLight,
    deleteLight,
    lightType,
    hdrSuccess,
    changeSelectLight,
    environmentRotationXData,
    environmentRotationXChange,
    environmentRotationYData,
    environmentRotationYChange,
    environmentRotationZData,
    environmentRotationZChange,
    environmentNameData,
    environmentNameChange,
    lightsNameData,
    lightsNameChange,
    downloadFile
  };
}
