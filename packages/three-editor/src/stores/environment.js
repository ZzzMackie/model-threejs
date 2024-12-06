// stores/environment.js
import { defineStore } from 'pinia';
import { useSceneStore } from './scene.js';
import { background, name, category_id, environment, category_name } from '@examples/environment.json';
import Config from '@packages/threeModel-core/core/Config.js';
import { useThreeEngineVm } from '@use/useThreeEngineVm.js';
const config = new Config();
export const useEnvironmentStore = defineStore('environment', {
  state: () => {
    return {
      background: {
        type: background.type,
        texture: background.texture,
        textureType: '',
        color: config.getKey('project/renderer/ClearColor/backgroundColor'),
        path: background.path,
        backgroundRotation: background.backgroundRotation,
        backgroundIntensity: background.backgroundIntensity, // 背景强度
        backgroundBlurriness: background.backgroundBlurriness
      },
      uuid: undefined,
      name,
      category_id,
      category_name,
      environment: {
        mapping: config.getKey('THREE/EquirectangularReflectionMapping'),
        envMapIntensity: environment.envMapIntensity, // 材质的环境光强度跟场景强度一起影响
        environmentIntensity: environment.environmentIntensity, // 场景强度
        texture: environment.texture,
        path: `${import.meta.env.VITE_APP_URL}/studio_small_08_2k.hdr`, //场景环境贴图
        environmentRotation: environment.environmentRotation
      }
    };
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    setValue(key, value) {
      switch (key) {
        case 'environment':
        case 'background':
          for (const prop of Object.keys(value)) {
            this[key][prop] = value[prop];
          }
          break;
        default:
          this[key] = value;
          break;
      }
    },
    setUUid(value) {
      this.uuid = value;
    },
    async setEnvironment(environment, change = true) {
      for (const key of Object.keys(environment)) {
        this.environment[key] = environment[key];
        change && (await this.changeEnvironment(key));
      }
    },
    setBackground(background) {
      this.setEnvironmentTexture('background', background);
    },
    updateBackgroundProp(background) {
      for (const key of Object.keys(background)) {
        this.background[key] = background[key];
        this.threeEngine.updateBackgroundProp({
          [key]: this.background[key]
        });
      }
    },
    setEnvironmentTexture(type, data) {
      for (const key of Object.keys(data)) {
        if (key === 'texture') {
          if (this[type][key]) {
            this[type]['path'] = data[key];
          } else {
            const uuid = this.threeEngine?.generateUUID?.();
            this[type][key] = uuid;
            this[type]['path'] = data[key];
          }
        } else {
          this[type][key] = data[key];
        }
      }
      this.changeEnvironment(type);
    },
    async changeEnvironment(key) {
      const scene = useSceneStore();
      switch (key) {
        case 'envMapIntensity':
          scene.changeMaterialsEnvMapIntensity(this.environment[key]);
          break;
        case 'mapping':
          scene.changeEnvironmentTextureMapping(this.environment[key]);
          break;
        case 'background':
          if (!(this.background.type === 'texture' && !this.background.texture)) {
            scene.changeBackground(this.background);
          }
          break;
        case 'environment':
          await scene.changeEnvironment(this.environment);
          break;
        default:
          this.threeEngine.updateEnvironmentProp({
            [key]: this.environment[key]
          });
          break;
      }
    }
  },
  getters: {
    threeEngine() {
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return null;
      return threeEngine;
    }
  }
});
