// stores/editor.js
import { defineStore } from 'pinia';
import { toRaw } from 'vue';
import defaultMaterial from '@examples/originMaterial.json';
// import { IndexDb } from '@packages/threeModel-core/core/IndexDb.js';
// IndexDb.createStore('editorMaterialLibraryStore');
import { useSceneStore } from './scene.js';
import { useEnvironmentStore } from './environment.js';
import { useCloned } from '@vueuse/core';
import { useMessage } from '@use/message.js';
import { upload } from '@use/upload.js';
import {
  setMaterialquality,
  deleteMaterialquality,
  setHdr,
  deleteHdr,
  setHdrCategory,
  setMaterialCategory,
  setSceneCategory,
  setScene,
  deleteScene
} from '@request/editor.js';
window.setScene = setScene;
const message = (str, type = 'info') => {
  const message = useMessage();
  message[type]({
    id: 'addMaterialLibrary',
    content: str,
    duration: 3000
  });
};
export const useEditorStore = defineStore('editor', {
  state: () => {
    return {
      percentage: 0,
      renderTriggerId: 'RenderSetting',
      historyStep: 1,
      selectedMesh: '',
      editorLoading: true,
      currentScene: '',

      selectedMaterial: 0,
      materialLibrary: [defaultMaterial],
      selectedMaterialLibrary: '',
      materialLibraryCategory: -1,
      searchMaterialKeyword: '',
      selectMaterialLoading: false,
      materialCategory: [],

      hdrCategory: [],
      hdrLibrary: [],
      selectedHdrLibrary: '',
      hdrLibraryCategory: -1,
      searchHdrKeyword: '',
      selectHdrLoading: false,

      sceneList: [],
      sceneLibrary: [],
      sceneCategoryOptions: [],
      searchSceneKeyword: '',
      sceneLibraryCategory: -1,

      hasChanged: false
    };
  },
  actions: {
    setValue(key, value) {
      this[key] = value;
    },
    setSelectedMaterial(value) {
      this.selectedMaterial = value;
    },
    setSelectedMaterialLibrary(val) {
      this.selectedMaterialLibrary = val;
    },
    setPercentage(value) {
      this.percentage = value;
    },
    setSceneName(name) {
      if (this.getCurrentSceneData) {
        const sceneLibrary = this.sceneLibrary.find(library => library.uuid === this.getCurrentSceneData.uuid);
        this.getCurrentSceneData.name = name;
        sceneLibrary && (sceneLibrary.name = name);
      }
    },
    setRenderTriggerId(value) {
      this.renderTriggerId = value;
    },
    setSceneList(list) {
      this.sceneList.push(...list);
    },
    setCurrentScene(uuid) {
      this.currentScene = uuid;
    },
    setSelectedMesh(uuid) {
      this.selectedMesh = uuid;
    },
    addScene(data) {
      this.sceneList.push(data);
    },
    async addMaterialLibrary() {
      const sceneStore = useSceneStore();
      let library = {};
      const { cloned } = useCloned(sceneStore.currentMaterial);
      let material = toRaw(cloned.value);
      const libraryUUid = sceneStore.threeEngine.generateUUID();
      library.uuid = libraryUUid;
      material.materialLibraryUUid = libraryUUid;
      library.category_id = this.materialLibraryCategory == -1 ? 0 : this.materialLibraryCategory;
      const mapList = Object.keys(material).filter(key => material[key] && (key.endsWith('Map') || key == 'map'));
      const images = [];
      if (mapList.length) {
        for (const key of mapList) {
          let imageData = sceneStore.images.find(value => value.uuid === material[key]);
          let newImageData = { ...imageData };
          newImageData.uuid = sceneStore.threeEngine.generateUUID();
          material[key] = newImageData.uuid;
          images.push(newImageData);
        }
      }
      for (const image of images) {
        if (image.url.file && image.url.file instanceof File) {
          message(`有本地资源未上传, 开始上传资源`);
          const { resource_url } = await upload(image.url.file);
          if (resource_url) {
            image.url = resource_url;
            message(`上传文件成功; ${resource_url}`, 'success');
          } else {
            message(`上传文件失败，保存模型失败;`, 'error');
          }
        }
      }
      library.data = material;
      library.images = images;
      library.name = material.name;
      setMaterialquality(library);
      // IndexDb['editorMaterialLibraryStore'].setItem(libraryUUid, JSON.stringify(library));
      this.setMaterialLibrary(library);
    },
    // 选择材质球
    async selectMaterialLibrary(uuid) {
      if (this.selectedMaterialLibrary === uuid || this.selectMaterialLoading) return;
      this.selectMaterialLoading = true;
      const sceneStore = useSceneStore();
      this.setSelectedMaterialLibrary(uuid);
      const { cloned } = useCloned(this.selectedMaterialLibraryData);
      const currentMaterial = sceneStore.currentMaterial;
      const materialLibrary = cloned.value;
      const { cloned: newMaterialDataCloned } = useCloned(materialLibrary.data);
      const newMaterialData = newMaterialDataCloned.value;
      const imagePr = [];
      const materialPr = [];
      // 删除旧资源图片
      for (const key of Object.keys(currentMaterial)) {
        if ((key.endsWith('Map') || key == 'map') && currentMaterial[key]) {
          sceneStore.deleteModelMaterialMap({
            [key]: currentMaterial[key]
          });
        }
      }
      if (newMaterialData.type !== currentMaterial.type) {
        await sceneStore.changeMaterialType(newMaterialData.type);
      }
      newMaterialData.uuid = currentMaterial.uuid;
      // 图片资源添加
      for (const image of materialLibrary.images) {
        sceneStore.images.push(image);
        imagePr.push(sceneStore.changeImage(image.uuid, image.url));
      }
      await Promise.allSettled(imagePr);
      for (const key of Object.keys(newMaterialData)) {
        if (key.endsWith('Map') || key == 'map') {
          materialPr.push(sceneStore.changeMaterial(key, newMaterialData[key]));
          currentMaterial[key] = newMaterialData[key];
        } else {
          switch (key) {
            case 'type':
            case 'uuid':
              break;
            case 'image':
            case 'rotation':
            case 'repeat':
            case 'mapRotation':
            case 'mapRepeat':
            case 'aoMapRotation':
            case 'aoMapRepeat':
              currentMaterial[key] = newMaterialData[key];
              break;

            default:
              sceneStore.changeMaterial(key, newMaterialData[key]);
              currentMaterial[key] = newMaterialData[key];
              break;
          }
        }
      }
      await Promise.allSettled(materialPr);
      // 需要等纹理加载完再设置上
      for (const key of sceneStore.threeEngine.material__three.rotationRepeatKey) {
        currentMaterial[key] !== undefined && sceneStore.changeMaterial(key, newMaterialData[key]);
      }
      this.selectMaterialLoading = false;
    },
    deleteMaterialLibrary(uuid) {
      if (this.selectedMaterialLibrary === uuid) {
        this.selectedMaterialLibrary = '';
      }
      // 默认材质不给删除
      if (uuid == '01a628c3b5ef4cafbe5b54d363dd81ce') {
        return;
      }
      const index = this.materialLibrary.findIndex(library => library.uuid === uuid);
      index !== -1 && this.materialLibrary.splice(index, 1);
      // IndexDb['editorMaterialLibraryStore'].removeItem(uuid);
      deleteMaterialquality({ uuid });
    },
    moveMaterialLibrary(uuid, id) {
      const library = this.materialLibrary.find(library => library.uuid === uuid);
      library.category_id = id;
      setMaterialquality({
        category_id: id,
        uuid
      });
    },
    changeMaterialLibrary(uuid) {
      const library = this.materialLibrary.find(library => library.uuid === uuid);
      setMaterialquality({
        data: toRaw(library.data),
        uuid
      });
    },
    searchMaterialLibrary(val) {
      if (val) {
        if (this.materialLibraryCategory !== -1) {
          this.materialLibraryCategory = -1;
        }
        this.searchMaterialKeyword = val;
      } else {
        this.searchMaterialKeyword = val;
      }
    },
    setMaterialLibrary(library) {
      library && this.materialLibrary.push(library);
    },
    async addNewMaterialCategory(name) {
      const result = await setMaterialCategory({ name });
      if (result) {
        this.materialCategory.push({
          id: result.id,
          name
        });
      }
    },
    hasSameMaterialCategoryName(category_name) {
      return this.materialCategory.some(category => category.name === category_name);
    },
    async changeMaterialLibraryTexture({ uuid, url }) {
      this.selectMaterialLoading = true;
      const library = this.materialLibrary.find(library => library.uuid === uuid);
      if (library) {
        library.data.image = url;
        let material = toRaw(library);
        await setMaterialquality({
          uuid: uuid,
          data: material.data
        });
      }
      this.selectMaterialLoading = false;
    },
    async addHdrLibrary() {
      const environmentStore = useEnvironmentStore();
      const sceneStore = useSceneStore();
      const { cloned } = useCloned(environmentStore.environment);
      let hdr = toRaw(cloned.value);
      let library = {};
      const libraryUUid = sceneStore.threeEngine.generateUUID();
      library.uuid = libraryUUid;
      library.category_id = this.hdrLibraryCategory == -1 ? 0 : this.hdrLibraryCategory;
      library.name = environmentStore.name;
      library.images = [];
      if (environmentStore.environment?.path?.file) {
        message(`有本地hdr资源未上传, 开始上传资源`);
        const { resource_url } = await upload(environmentStore.environment?.path?.file);
        if (resource_url) {
          message(`上传hdr文件成功; ${resource_url}`, 'success');
          hdr.path = resource_url;
        } else {
          message(`上传hdr文件失败，保存失败`, 'error');
        }
      }
      library.data = hdr;
      library.data.texture = sceneStore.threeEngine.generateUUID();
      this.hdrLibrary.push(library);
      setHdr(library);
      console.log(library);
      console.log('addHdrLibrary');
    },
    async selectHdrLibrary(uuid) {
      if (this.selectedHdrLibrary === uuid || this.selectHdrLoading) return;
      this.selectHdrLoading = true;
      this.selectedHdrLibrary = uuid;
      const { cloned } = useCloned(this.selectedHdrLibraryData);
      const hdrLibrary = cloned.value;
      const environmentStore = useEnvironmentStore();

      environmentStore.setValue('name', hdrLibrary.name);
      environmentStore.setValue('category_id', hdrLibrary.category_id);
      const sceneStore = useSceneStore();
      await sceneStore.threeEngine.addImageData(hdrLibrary.data.texture, hdrLibrary.data.path);
      await environmentStore.setEnvironment(hdrLibrary.data, true);
      this.selectHdrLoading = false;
    },
    deleteHdrLibrary(uuid) {
      if (this.selectedHdrLibrary === uuid) {
        this.selectedHdrLibrary = '';
      }
      const index = this.hdrLibrary.findIndex(library => library.uuid === uuid);
      index !== -1 && this.hdrLibrary.splice(index, 1);
      // IndexDb['editorMaterialLibraryStore'].removeItem(uuid);
      deleteHdr({ uuid });
    },
    searchHdrLibrary(val) {
      if (val) {
        if (this.hdrLibraryCategory !== -1) {
          this.hdrLibraryCategory = -1;
        }
        this.searchHdrKeyword = val;
      } else {
        this.searchHdrKeyword = val;
      }
    },
    changeHdrLibrary(uuid) {
      const library = this.hdrLibrary.find(library => library.uuid === uuid);
      setHdr({
        name: library.name,
        uuid
      });
    },
    moveHdrLibrary(uuid, id) {
      const library = this.hdrLibrary.find(library => library.uuid === uuid);
      library.category_id = id;
      setHdr({
        category_id: id,
        uuid
      });
    },
    async addNewHdrCategory(name) {
      const result = await setHdrCategory({ name });
      if (result) {
        this.hdrCategory.push({
          id: result.id,
          name,
          data: []
        });
      }
    },
    hasSameHdrCategoryName(category_name) {
      return this.hdrCategory.some(category => category.name === category_name);
    },
    async changeHdrLibraryTexture({ uuid, url }) {
      this.selectHdrLoading = true;
      const library = this.hdrLibrary.find(library => library.uuid === uuid);
      if (library) {
        library.data.path = url;
        let material = toRaw(library);
        await setHdr({
          uuid: uuid,
          data: material.data
        });
      }
      this.selectHdrLoading = false;
    },
    async addNewSceneCategory({ name, id }) {
      const result = await setSceneCategory(id ? { name, id } : { name });
      if (id) {
        const sceneCategoryOption = this.sceneCategoryOptions.find(sceneCategoryOption => sceneCategoryOption.id == id);
        sceneCategoryOption.name = name;
      } else {
        if (result) {
          this.sceneCategoryOptions.push({
            id: result.id,
            name,
            data: []
          });
        }
      }
    },
    hasSameSceneCategoryName(category_name) {
      return this.sceneCategoryOptions.some(category => category.name === category_name);
    },
    async moveSceneCategory(uuid, id) {
      const library = this.sceneList.find(library => library.uuid === uuid);
      const sceneLibrary = this.sceneLibrary.find(library => library.uuid === uuid);

      if (library) {
        for (const category of this.sceneCategoryOptions) {
          const index = category.data.findIndex(scene => scene?.uuid === uuid);
          if (index !== -1) {
            category.data.splice(index, 1);
          }
        }
        sceneLibrary.category_id = id;
        library.category_id = id;
        await setScene({
          uuid: uuid,
          category_id: id
        });
      }
    },
    deleteSceneLibrary(uuid) {
      const index = this.sceneLibrary.findIndex(scene => scene?.uuid === uuid);
      const idx = this.sceneList.findIndex(scene => scene?.uuid === uuid);
      if (index !== -1) {
        this.sceneLibrary.splice(index, 1);
      }
      if (idx !== -1) {
        this.sceneList.splice(index, 1);
      }
      deleteScene({
        uuid
      });
    },
    changeSceneLibraryName(uuid) {
      const library = this.sceneLibrary.find(library => library.uuid === uuid);
      if (uuid === this.currentScene) {
        this.getCurrentSceneData.name = library.name;
        useSceneStore().setValue('name', library.name);
      }
      setScene({
        name: library.name,
        uuid
      });
    },
    searchSceneLibrary(val) {
      if (val) {
        if (this.sceneLibraryCategory !== -1) {
          this.sceneLibraryCategory = -1;
        }
        this.searchSceneKeyword = val;
      } else {
        this.searchSceneKeyword = val;
      }
    },
    async addLibraryToScene(_uuid) {
      this.editorLoading = true;
      const {
        data: { images, materials, modelMesh, model_type = 1 }
      } = this.sceneLibrary.find(({ uuid }) => uuid === _uuid);
      const { cloned: materialsCloned } = useCloned(materials);
      const { cloned: imagesCloned } = useCloned(images);
      const { cloned: modelMeshCloned } = useCloned(modelMesh);
      const originMaterials = toRaw(materialsCloned.value);
      const originImages = toRaw(imagesCloned.value);
      const originModelMesh = toRaw(modelMeshCloned.value);
      this.cloneModelToScene({ originMaterials, originImages, originModelMesh, model_type });
      await this.threeEngine.loadMeshObject({
        data: {
          materials: originMaterials,
          images: originImages,
          modelMesh: originModelMesh
        }
      });
      this.editorLoading = false;
    },
    cloneModelToScene({ originMaterials, originImages, originModelMesh, model_type }) {
      const sceneStore = useSceneStore();
      for (const group of originModelMesh) {
        group.uuid = this.threeEngine.generateUUID();
        if (group.children) {
          for (const mesh of group.children) {
            const newGeometry = this.threeEngine.generateUUID();
            const oldMaterial = mesh.material;
            mesh.uuid = this.threeEngine.generateUUID();
            if (Array.isArray(oldMaterial)) {
              oldMaterial.forEach((oldMaterialUuid, index) => {
                mesh.material[index] = this.cloneMaterial({ originMaterials, oldMaterialUuid, originImages });
              });
            } else {
              mesh.material = this.cloneMaterial({ originMaterials, oldMaterialUuid: oldMaterial, originImages });
            }
            mesh.geometry = newGeometry;
          }
        }
        group.model_type = model_type;
        group.name = `${group.name}_cloned`;
        sceneStore.modelMesh.push(group);
      }
    },
    getMaterialMapKeyList(material) {
      return Object.keys(material).filter(key => key.endsWith('Map') || key == 'map');
    },
    cloneMaterial({ originMaterials, oldMaterialUuid, originImages }) {
      const sceneStore = useSceneStore();
      const newMaterial = this.threeEngine.generateUUID();
      const material = originMaterials.find(item => item.uuid === oldMaterialUuid);
      material.uuid = newMaterial;
      const materialMapKeyList = this.getMaterialMapKeyList(material);
      for (const key of materialMapKeyList) {
        const oldMap = material[key];
        this.cloneImage({ originImages, oldMap, material, materialKey: key });
      }
      sceneStore.materials.push(material);
      return newMaterial;
    },
    cloneImage({ originImages, oldMap, material, materialKey }) {
      const sceneStore = useSceneStore();
      const newMap = this.threeEngine.generateUUID();
      if (oldMap) {
        const imageData = originImages.find(item => item.uuid === oldMap);
        material[materialKey] = newMap;
        imageData.uuid = newMap;
        sceneStore.images.push(imageData);
      }
      return newMap;
    },
    async dropSceneLibrary({ sourceSceneUUid, targetSceneUUid, previousSceneUUid }) {
      if (sourceSceneUUid !== targetSceneUUid) {
        const targetScene = this.sceneLibrary.find(library => library.uuid === targetSceneUUid);
        const sourceScene = this.sceneLibrary.find(library => library.uuid === sourceSceneUUid);
        const previousScene = this.sceneLibrary.find(library => library.uuid === previousSceneUUid);
        if (targetScene?.data?.model_type && targetScene?.data?.model_type !== 1) {
          message(`不能添加配件模型${sourceScene.name}到配件模型${targetScene.name}`, 'error');
        } else {
          if (targetScene) {
            sourceScene.data.model_type = 2;
            if (targetSceneUUid === this.currentScene) {
              const sceneStore = useSceneStore();
              !sceneStore.partList.includes(sourceSceneUUid) && sceneStore.partList.push(sourceSceneUUid);
            }
            if (targetScene.data.partList) {
              !targetScene.data.partList.includes(sourceSceneUUid) && targetScene.data.partList.push(sourceSceneUUid);
            } else {
              targetScene.data.partList = [sourceSceneUUid];
            }
            if (previousSceneUUid && previousSceneUUid !== targetSceneUUid) {
              previousScene.data.partList = previousScene.data.partList.filter(part => part !== sourceSceneUUid);
            }
            message(`添加配件模型${sourceScene.name}到主模型${targetScene.name}`, 'success');
            await setScene({
              uuid: sourceSceneUUid,
              data: sourceScene.data
            });
            await setScene({
              uuid: targetSceneUUid,
              data: targetScene.data
            });
            previousScene?.data &&
              (await setScene({
                uuid: previousSceneUUid,
                data: previousScene.data
              }));
          } else {
            if (sourceScene.data.model_type && sourceScene.data.model_type === 2) {
              sourceScene.data.model_type = 1;
              if (previousSceneUUid && previousSceneUUid !== targetSceneUUid) {
                previousScene.data.partList = previousScene.data.partList.filter(part => part !== sourceSceneUUid);
              }
              await setScene({
                uuid: sourceSceneUUid,
                data: sourceScene.data
              });
              previousScene?.data &&
                (await setScene({
                  uuid: previousSceneUUid,
                  data: previousScene.data
                }));
            }
          }
        }
      }
    }
  },
  getters: {
    threeEngine() {
      const sceneStore = useSceneStore();
      return sceneStore.threeEngine;
    },
    getCurrentSceneData() {
      return this.sceneList.find(scene => this.currentScene === scene.uuid);
    },
    selectedMaterialLibraryData() {
      return this.materialLibrary.find(library => library.uuid === this.selectedMaterialLibrary);
    },
    materialLibraryList() {
      if (this.materialLibraryCategory === -1) {
        return this.searchMaterialKeyword
          ? this.materialLibrary.filter(library => library.data.name.includes(this.searchMaterialKeyword))
          : this.materialLibrary;
      } else {
        return this.materialLibrary.filter(library => library.category_id === this.materialLibraryCategory);
      }
    },
    hdrLibraryList() {
      if (this.hdrLibraryCategory === -1) {
        return this.searchHdrKeyword
          ? this.hdrLibrary.filter(library => library.name.includes(this.searchHdrKeyword))
          : this.hdrLibrary;
      } else {
        return this.hdrLibrary.filter(library => library.category_id === this.hdrLibraryCategory);
      }
    },
    selectedHdrLibraryData() {
      return this.hdrLibrary.find(library => library.uuid === this.selectedHdrLibrary);
    },
    currentMaterialDes() {
      const sceneStore = useSceneStore();
      const currentMaterial = sceneStore.currentMaterial;
      let des = currentMaterial.type;
      if (currentMaterial.materialLibraryUUid) {
        const currentCategory = this.materialCategory.find(
          category => category.id === this.selectedMaterialLibraryData?.category_id
        );
        currentCategory && (des = currentCategory.name);
      }
      return des;
    },
    sceneCategory() {
      const sceneCategoryOptions = this.sceneCategoryOptions;
      for (const scene of this.sceneList) {
        const allIdx = sceneCategoryOptions.findIndex(category => category?.id === -1);
        if (allIdx != -1) {
          const hasSame = sceneCategoryOptions?.[allIdx]?.data.some(sceneCategory => sceneCategory.uuid === scene.uuid);
          !hasSame && sceneCategoryOptions?.[allIdx]?.data?.push?.(scene);
        }
        const index = sceneCategoryOptions.findIndex(category => category?.id === scene.category_id);
        if (index !== -1) {
          const sceneIndex = sceneCategoryOptions[index].data.findIndex(sceneOpt => sceneOpt.uuid === scene.uuid);
          if (sceneIndex === -1) {
            sceneCategoryOptions[index].data.push(scene);
          }
        } else {
          const option = {
            name: scene.category_name || '默认',
            id: scene.category_id,
            data: [scene]
          };
          sceneCategoryOptions.push(option);
        }
      }
      return sceneCategoryOptions;
    }
  }
});
