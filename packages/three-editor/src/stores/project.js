// stores/project.js
import { defineStore } from 'pinia';
import { useThreeEngineVm } from '@use/useThreeEngineVm.js';
import { project } from '@/examples/app.json';
export const useProjectStore = defineStore('project', {
  state: () => {
    return {
      shadows: project.shadows,
      shadowType: project.shadowType,
      vr: project.vr,
      toneMapping: project.toneMapping,
      toneMappingExposure: project.toneMappingExposure,
      antialias: project.antialias,
      autoClear: project.autoClear,
      name: project.name,
      category_id: project.category_id,
      category_name: project.category_name,
      uuid: undefined
    };
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    setValue(key, value) {
      this[key] = value;
    },
    setUUid(value) {
      this.uuid = value;
    },
    setProject(project, change = true) {
      for (const key of Object.keys(project)) {
        this[key] = project[key];
        change && this.changeProjectRender(key, project[key]);
      }
    },
    changeProjectRender(key, value) {
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return;
      switch (key) {
        case 'antialias':
          threeEngine.resetRenderer({
            [key]: value
          });
          threeEngine.setToneMappingExposure({
            toneMappingExposure: this.toneMappingExposure,
            toneMapping: this.toneMapping
          });
          threeEngine.setShadowMap({
            shadows: this.shadows,
            shadowType: this.shadowType
          });
          break;
        case 'toneMapping':
          threeEngine.setToneMappingExposure({
            [key]: value
          });
          break;
        case 'toneMappingExposure':
          threeEngine.setToneMappingExposure({
            [key]: value,
            toneMapping: this.toneMapping
          });
          break;
        case 'shadows':
        case 'shadowType':
          threeEngine.setShadowMap({
            [key]: value
          });
          break;
        case 'autoClear':
          threeEngine.setAutoClear(value);
          break;
        default:
          break;
      }
    }
  }
});
