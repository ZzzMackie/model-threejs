/* eslint-disable no-case-declarations */
// stores/scene.js
import { defineStore } from 'pinia';
import { useThreeEngineVm } from '@use/useThreeEngineVm.js';
import { toRaw } from 'vue';
import { useEditorStore } from '@stores/editor.js';
import { useMessage } from '@use/message.js';
const materialCnName = {
  MeshPhysicalMaterial: '物理材质',
  MeshStandardMaterial: '标准材质',
  MeshBasicMaterial: '基础材质'
};

export const useSceneStore = defineStore('scene', {
  state: () => {
    return {
      geometries: [],
      materials: [],
      object: {},
      images: [],
      modelMesh: [],
      partList: [],
      UV: {
        file: {
          url: '',
          name: ''
        },
        ai: {
          url: '',
          name: ''
        }
      },
      uuid: undefined,
      name: 'Scene',
      category_id: 0,
      category_name: '默认',
      model_type: 1,
      // 场景关联渲染数据
      camera: undefined,
      controls: undefined,
      environment: undefined,
      light: undefined,
      project: undefined
    };
  },
  actions: {
    setValue(key, value) {
      this[key] = value;
    },
    setUUid(value) {
      this.uuid = value;
    },
    setScene(prop, data) {
      for (const key of Object.keys(data)) {
        if (Array.isArray(data)) {
          this[prop].push(data[key]);
        } else {
          this[prop][key] = data[key];
        }
      }
    },
    setSelected(uuid, onClickSelectModel = false) {
      useEditorStore().setSelectedMesh(uuid);
      // 有用材质库则切换选中的材质选中态
      useEditorStore().setSelectedMaterialLibrary(this.currentMaterial.materialLibraryUUid || '');
      !onClickSelectModel && this.threeEngine?.attachTransformControls?.(uuid);
    },
    async setCurrentModelMaterial(key, value) {
      let val = value;
      if (key.endsWith('Map') || key == 'map') {
        if (this.currentMaterial[key]) {
          for (const image of this.images) {
            if (image.uuid === this.currentMaterial[key]) {
              image.url = val;
            }
          }
        } else {
          const uuid = this.threeEngine?.generateUUID?.();
          const image = {
            uuid,
            url: val
          };
          this.images.push(image);
          this.currentMaterial[key] = uuid;
        }
        await this.changeImage(this.currentMaterial[key], val);
        val = this.currentMaterial[key];
      } else {
        switch (key) {
          case 'normalScale':
          case 'clearcoatNormalScale':
          case 'iridescenceThicknessRange':
            for (const prop of Object.keys(val)) {
              if (this.currentMaterial[key]) {
                this.currentMaterial[key][prop] = val[prop];
              } else {
                this.currentMaterial[key] = {
                  [prop]: val[prop]
                };
              }
            }
            break;

          default:
            this.currentMaterial[key] = val;
            break;
        }
      }
      this.changeMaterial(key, val);
    },
    setModelMeshTransform(type, data) {
      for (const key of Object.keys(data)) {
        this.currentModel.transform[type][key] = data[key];
      }
      this.changeModelMeshTransform(this.selected, type, data);
    },
    setVisible(idx, index) {
      let uuid = '';
      if (index !== undefined) {
        this.modelMesh[idx].children[index].visible = !this.modelMesh[idx].children[index].visible;
        uuid = this.modelMesh[idx].children[index].uuid;
      } else {
        this.modelMesh[idx].visible = !this.modelMesh[idx].visible;
        uuid = this.modelMesh[idx].uuid;
      }
      this.threeEngine?.toggleModelVisible?.(uuid);
    },
    setUV(data) {
      for (const key of Object.keys(data)) {
        for (const prop of Object.keys(data[key])) {
          this.UV[key][prop] = data[key][prop];
        }
      }
    },
    async addModelMesh(file) {
      const startTime = new Date().getTime();
      const message = useMessage();
      const editorStore = useEditorStore();
      const fileName = file.name.split('.');
      const fileType = fileName[fileName.length - 1];
      editorStore.setPercentage(30);
      message.info('开始加载模型');
      this.threeEngine.loadFiles({ files: [file.file] });
      message.info('模型文件解析完成');
      editorStore.setPercentage(50);
      this.threeEngine.object3D__three.once('addObjectGroupUpdated', mesh => {
        for (const key of Object.keys(mesh)) {
          switch (key) {
            case 'materials':
              this[key].push(...mesh[key]);
              break;
            case 'object':
              const group = mesh[key];
              group.modelFileType = fileType;
              group.modelPath = file?.response?.data?.resource_url || file.file;
              group.modelResource_id = file?.response?.data?.resource_id || file.name;
              // 默认新增的模型组为1
              group.model_type = 1;
              this.modelMesh.push(mesh[key]);
              break;
            default:
              break;
          }
        }
        const endTime = new Date().getTime();
        const time = endTime - startTime;
        editorStore.setPercentage(100);
        message.success(` : ${time}ms`);
        this.setSelected(this.modelMesh[this.modelMesh.length - 1].uuid);
      });
      // eslint-disable-next-line no-unused-vars
      this.threeEngine.object3D__three.once('addModelObjectUpdated', _object => {
        const endTime = new Date().getTime();
        const time = endTime - startTime;
        editorStore.setPercentage(100);
        message.success(`模型加载完成__加载时间: ${time}ms`);
      });
      editorStore.setPercentage(70);
    },
    async changeImage(uuid, url) {
      await this.threeEngine?.addImageData?.(uuid, url);
    },
    async changeMaterial(key, value) {
      await this.threeEngine?.updateMaterial?.({ uuid: this.currentMaterial.uuid, key, value });
    },
    changeModelMeshTransform(uuid, type, data) {
      const { x, y, z } = data;
      this.threeEngine?.setModelMeshTransform?.({
        uuid,
        position: {
          x,
          y,
          z
        },
        type
      });
    },
    changeMaterialsEnvMapIntensity(envMapIntensity) {
      for (const material of this.materials) {
        material.envMapIntensity = envMapIntensity;
      }
      this.threeEngine?.updateMaterialsEnvMapIntensity?.({ envMapIntensity });
    },
    changeEnvironmentTextureMapping(mapping) {
      this.threeEngine?.updateEnvironmentTextureMapping?.({ mapping });
    },
    changeBackground(background) {
      const originBackground = toRaw(background);
      this.threeEngine?.setBackground?.(originBackground);
    },
    async changeEnvironment(environment) {
      const originEnvironment = toRaw(environment);
      await this.threeEngine?.setEnvironment?.(originEnvironment);
    },
    changeModelMeshOrder(order) {
      this.currentModel.renderOrder = order;
      this.threeEngine.setModelMeshProps(this.currentModel.uuid, {
        renderOrder: order
      });
    },
    // 变更材质
    async changeMaterialType(type) {
      const newMaterial = await this.threeEngine.changeMaterial({
        uuid: this.currentMaterial.uuid,
        originMaterial: this.currentMaterial,
        newMaterialType: type
      });
      this.currentMaterial.name = materialCnName[type];
      this.currentMaterial.type = type;
      for (const key of Object.keys(this.currentMaterial)) {
        if (newMaterial[key] === undefined || (key === 'envMap' && type === 'MeshBasicMaterial')) {
          if (key.endsWith('Map') || key == 'map') {
            this.deleteImage(this.currentMaterial[key]);
          }
          delete this.currentMaterial[key];
        }
      }
    },
    getCurrentMaterialImage(key) {
      let image = '';
      if (key.endsWith('Map') || key == 'map') {
        image = this.getCurrentImage(this.currentMaterial[key]);
      }
      return image;
    },
    getCurrentImage(uuid) {
      return this.images.find(value => value.uuid === uuid)?.url || '';
    },
    deleteModelMaterialMap(data) {
      const cloneData = { ...data };

      for (const key of Object.keys(cloneData)) {
        if (this.currentMaterial[key]) {
          this.deleteImage(this.currentMaterial[key]);
          this.threeEngine.deleteMaterial({ uuid: this.currentMaterial.uuid, deleteKeys: [key] });
          this.currentMaterial[key] = null;
        }
      }
    },
    deleteGroup(idx) {
      const group = this.modelMesh[idx];
      for (const child of group.children) {
        this.deleteMesh(child.uuid);
      }
      group && this.threeEngine.removeObject3D(group.uuid);
      this.modelMesh.splice(idx, 1);
    },
    deleteImage(deleteUuid) {
      const index = this.images.findIndex(({ uuid }) => uuid === deleteUuid);
      index != -1 && this.images.splice(index, 1);
    },
    deleteGeometry(geometryUUid) {
      const geometriesIdx = this.geometries.findIndex(({ uuid }) => geometryUUid === uuid);

      this.geometries.splice(geometriesIdx, 1);
    },
    deleteMaterialImage(materialUUid) {
      const materialIdx = this.materials.findIndex(({ uuid }) => materialUUid === uuid);
      for (const key of Object.keys(this.materials[materialIdx])) {
        if (key.endsWith('Map') || key == 'map') {
          this.deleteImage(this.materials[materialIdx][key]);
        }
      }
      this.materials.splice(materialIdx, 1);
    },
    deleteMesh(uuid) {
      for (const group of this.modelMesh) {
        const groupChildren = group.children;
        const idx = groupChildren.findIndex(mesh => mesh.uuid === uuid);
        const newMesh = group.children.filter(mesh => mesh.uuid !== uuid);
        if (idx !== -1) {
          if (groupChildren[idx]) {
            if (Array.isArray(groupChildren[idx].material)) {
              for (const materialUUid of groupChildren[idx].material) {
                this.deleteMaterialImage(materialUUid);
              }
            } else {
              this.deleteMaterialImage(groupChildren[idx].material);
            }
            this.deleteGeometry(groupChildren[idx].geometry);

            this.threeEngine.removeObject3D(uuid);
          }
          group.children = newMesh;
        }
      }
    },
    changeMesh(file) {
      const startTime = new Date().getTime();
      const message = useMessage();
      const fileName = file.name.split('.');
      const fileType = fileName[fileName.length - 1];
      this.threeEngine.changeObjectMesh({
        file,
        meshUUid: this.currentModel.uuid,
        swapIndex: this.currentModel.originIndex
      });
      this.threeEngine.object3D__three.once('swapObjectMeshUpdated', ({ object }) => {
        for (const group of this.modelMesh) {
          const groupChildren = group.children;
          const idx = groupChildren.findIndex(mesh => mesh.uuid === object.uuid);
          if (idx !== -1) {
            if (groupChildren[idx]) {
              groupChildren.splice(idx, 1, object);
              group.modelFileType = fileType;
              group.modelPath = file?.response?.data?.resource_url || file.file;
              group.modelResource_id = file?.response?.data?.resource_id || file.name;
            }
          }
        }
        const endTime = new Date().getTime();
        const time = endTime - startTime;
        message.success(`模型替换完成__加载时间: ${time}ms`);
      });
    },
    setCombineModelMesh(groupUUid, modelUUid) {
      const group = this.modelMesh.find(group => groupUUid === group.uuid);
      for (const childModel of group.children) {
        if (childModel.uuid === modelUUid) {
          childModel.isCombineMesh = true;
        } else if (childModel.isCombineMesh) {
          childModel.isCombineMesh = false;
        }
      }
    }
  },
  getters: {
    selected() {
      return useEditorStore().selectedMesh;
    },
    threeEngine() {
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return null;
      return threeEngine;
    },
    currentModel() {
      let model = null;
      for (const child of this.modelMesh) {
        if (child.type === 'Group') {
          for (const childModel of child.children) {
            if (childModel.uuid === this.selected) {
              model = childModel;
            }
          }
        }
        if (child.uuid === this.selected) {
          model = child;
        }
      }
      return model || {};
    },
    currentMaterial() {
      let uuid = Array.isArray(this.currentModel.material)
        ? this.currentModel.material[useEditorStore().selectedMaterial]
        : this.currentModel.material;
      return this.materials.find(material => material.uuid === uuid) || {};
    }
  }
});
