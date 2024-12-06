// stores/helper.js
import { defineStore } from 'pinia';
import { useSceneStore } from './scene.js';
export const useHelperStore = defineStore('helper', {
  state: () => {
    return {
      Box3Helper: false,
      transformControls: false,
      LightHelper: false,
      grid: false
    };
  },
  actions: {
    toggleHelpers(type) {
      const sceneStore = useSceneStore();
      if (type.includes('Box3Helper')) {
        this.Box3Helper = !this.Box3Helper;
        sceneStore.threeEngine.showHelper(this.Box3Helper, type);
      }
      if (type.includes('transformControls')) {
        this.transformControls = !this.transformControls;
        sceneStore.threeEngine.showHelper(this.transformControls, type);
      }
      if (type.includes('LightHelper')) {
        this.LightHelper = !this.LightHelper;
        sceneStore.threeEngine.showHelper(this.LightHelper, type);
      }
      if (type.includes('grid')) {
        this.grid = !this.grid;
        sceneStore.threeEngine.showGrid(this.grid);
      }
    }
  }
});
