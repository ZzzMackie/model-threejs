// stores/light.js
import { defineStore } from 'pinia';
import { useThreeEngineVm } from '@use/useThreeEngineVm.js';
const getCharacter = function (flag = 'upper') {
  let character = '';
  if (flag === 'lower') {
    character = String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0));
  }
  if (flag === 'upper') {
    character = String.fromCharCode(Math.floor(Math.random() * 26) + 'A'.charCodeAt(0));
  }
  return character;
};
export const useLightStore = defineStore('light', {
  state: () => {
    return {
      lights: [],
      lightSelected: 0,
      uuid: undefined,
      name: 'light',
      category_id: 0,
      category_name: '默认'
    };
  },
  actions: {
    setValue(key, value) {
      this[key] = value;
    },
    setUUid(value) {
      this.uuid = value;
    },
    setLight(data) {
      if (!this.threeEngine) return;
      let len = this.lights.find(light => light.type === data.type)?.length || 0;
      if (len > 0) {
        const character = getCharacter();
        data.name = `${data.name}_${character}`;
      }
      for (const value of data) {
        this.lights.push(value);
        if (!value.uuid) {
          value.uuid = this.threeEngine.generateUUID();
        }
        this.addThreeLight(value);
      }
    },
    getLight(uuid) {
      return this.lights.find(light => light.uuid === uuid);
    },
    updatedLight(data) {
      const light = this.currentLight;
      for (const key of Object.keys(data)) {
        switch (key) {
          case 'position':
            this.setLightPosition(light.uuid, data[key]);
            break;
          case 'rotation':
            this.setLightPosition(light.uuid, data[key], 'rotation');
            break;
          default:
            light[key] = data[key];
            break;
        }
      }
      this.updatedThreeLight({ ...data, uuid: light.uuid });
    },
    setLightPosition(uuid, position, type = 'position') {
      const light = this.getLight(uuid);
      for (const key of Object.keys(position)) {
        if (!light[type]) {
          light[type] = {};
        }
        light[type][key] = position[key];
      }
      this.updatedThreeLight({ uuid, [type]: position });
    },
    changeSelectLight(val) {
      this.lightSelected = val;
      this.threeEngine?.attachTransformControls?.(this.lights?.[val]?.uuid);
    },
    deleteLight(idx) {
      this.deleteThreeLight(this.lights[idx].uuid);
      this.lights.splice(idx, 1);
      this.deleteThreeLight();
    },
    addThreeLight(lightConfig) {
      if (!this.threeEngine || !this.threeEngine.scene__three) return;
      return this.threeEngine.addLight({
        lightClass: lightConfig.type,
        lightConfig
      });
    },
    updatedThreeLight(lightConfig) {
      if (!this.threeEngine || !this.threeEngine.scene__three) return;
      this.threeEngine.updateLight(lightConfig);
    },
    deleteThreeLight(uuid) {
      if (!this.threeEngine) return;
      this.threeEngine.deleteLight(uuid);
    },
    changeEnvironmentTextureMapping(mapping) {
      if (!this.threeEngine) return;
      for (const texture of this.textures) {
        if (texture.uuid === this.object.environment) texture.mapping = mapping;
      }
      this.threeEngine.updateEnvironmentTextureMapping({ mapping });
    }
  },
  getters: {
    threeEngine() {
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return null;
      return threeEngine;
    },
    currentLight() {
      return this.lights[this.lightSelected];
    }
  }
});
