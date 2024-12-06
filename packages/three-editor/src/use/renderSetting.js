import { ref, computed } from 'vue';
import { useProject } from '@use/projectStore.js';
import { useProjectStore } from '@stores/project.js';
export function useRenderSetting() {
  const { shadows, shadowType, toneMapping, toneMappingExposure, antialias, name } = useProject();
  const projectStore = useProjectStore();
  const shadowOptions = ref([
    {
      value: 0,
      label: 'Basic'
    },
    {
      value: 1,
      label: 'PCF'
    },
    {
      value: 2,
      label: 'PCF Soft'
    }
  ]);
  const toneMappingOptions = ref([
    {
      value: 0, // THREE.NoToneMapping
      label: 'No'
    },
    {
      value: 1, // THREE.LinearToneMapping
      label: 'Linear'
    },
    {
      value: 2, // THREE.ReinhardToneMapping
      label: 'Reinhard'
    },
    {
      value: 3, // THREE.CineonToneMapping
      label: 'Cineon'
    },
    {
      value: 4, // THREE.ACESFilmicToneMapping
      label: 'ACESFilmic'
    },
    {
      value: 6, // THREE.AgXToneMapping
      label: 'AgX'
    },
    {
      value: 7, // THREE.NeutralToneMapping
      label: 'Neutral'
    }
  ]);
  const antialiasData = computed(() => {
    return {
      label: '抗锯齿',
      type: 'switch',
      value: antialias.value
    };
  });
  const toneMappingExposureData = computed(() => {
    return {
      label: '曝光',
      type: 'slider',
      value: toneMappingExposure.value,
      max: 5,
      min: 0,
      step: 0.05,
      showInput: true
    };
  });
  const toneMappingData = computed(() => {
    return {
      label: '色调',
      type: 'select',
      value: toneMapping.value,
      options: toneMappingOptions.value,
      allowSearch: true,
      bordered: false
    };
  });
  const shadowData = computed(() => {
    return {
      label: '阴影',
      type: 'select switch',
      switchValue: shadows.value,
      selectValue: shadowType.value,
      options: shadowOptions.value,
      allowSearch: true,
      bordered: false
    };
  });
  const antialiasChange = val => {
    projectChange('antialias', val);
  };
  const toneMappingExposureChange = val => {
    projectChange('toneMappingExposure', val);
  };
  const toneMappingChange = val => {
    projectChange('toneMapping', val);
  };
  const shadowSwitchChange = val => {
    projectChange('shadows', val);
  };
  const shadowSelectChange = val => {
    projectChange('shadowType', parseInt(val));
  };
  const projectNameData = computed(() => {
    return {
      label: '渲染组名',
      type: 'textInput',
      value: name.value
    };
  });
  const projectNameChange = value => {
    projectStore.setValue('name', value);
  };

  const projectChange = (key, val) => {
    projectStore.setProject({
      [key]: val
    });
  };

  return {
    shadowOptions,
    toneMappingOptions,
    antialiasData,
    shadowData,
    toneMappingExposureData,
    toneMappingData,
    antialiasChange,
    toneMappingExposureChange,
    toneMappingChange,
    shadowSwitchChange,
    shadowSelectChange,
    projectNameData,
    projectNameChange
  };
}
