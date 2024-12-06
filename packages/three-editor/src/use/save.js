import { toRaw, isRef, isReactive } from 'vue';
import { useCamera } from './cameraStore.js';
import { useControls } from './controls.js';
import { useThreeEngineVm } from './useThreeEngineVm.js';
import { useEnvironment } from './environmentStore.js';
import { useCameraStore } from '@stores/camera.js';
import { useControlsStore } from '@stores/controls.js';
import { useEnvironmentStore } from '@stores/environment.js';
import { useLightStore } from '@stores/light.js';
import { useLight } from './lightStore.js';
import { useProjectStore } from '@stores/project.js';
import { useProject } from './projectStore.js';
import { useScene } from './sceneStore.js';
import { useSceneStore } from '@stores/scene.js';
import { save } from '@request/save.js';
import { upload, uploadBase64 } from './upload.js';
import { useMessage } from '@use/message.js';
import { appendQueryParam, openScene } from '@use/utils.js';
import { useEditorStore } from '../stores/editor.js';
const excludeKey = ['uuid', 'name', 'category_id', 'geometries', 'threeEngine'];
const sceneDataKey = [
  'UV',
  'camera',
  'controls',
  'environment',
  'images',
  'light',
  'materials',
  'modelMesh',
  'project',
  'partList',
  'model_type'
];
const generateNotDefinedData = (data, type) => {
  const { threeEngine } = useThreeEngineVm();
  let uuid = isRef(data.uuid) ? data.uuid.value : data.uuid;
  if (uuid === undefined) {
    uuid = threeEngine.generateUUID();
    switch (type) {
      case 'camera':
        useCameraStore().setUUid(uuid);
        break;
      case 'controls':
        useControlsStore().setUUid(uuid);
        break;
      case 'environment':
        useEnvironmentStore().setUUid(uuid);
        break;
      case 'light':
        useLightStore().setUUid(uuid);
        break;
      case 'project':
        useProjectStore().setUUid(uuid);
        break;
      case 'scene':
        useSceneStore().setUUid(uuid);
        appendQueryParam('scene', uuid);
        break;
      default:
        break;
    }
    useSceneStore().setValue(type, uuid);
  }
  return {
    uuid: uuid,
    name: isRef(data.name) ? data.name.value : data.name,
    category_id: isRef(data.category_id) ? data.category_id.value : data.category_id
  };
};
const getCameraSaveData = () => {
  const camera = useCamera();
  const originCamera = toRaw(camera.camera.value);
  const saveData = generateNotDefinedData(originCamera, 'camera');

  saveData.data = {
    object: originCamera.object,
    screenshot: originCamera.screenshot
  };
  return saveData;
};
const getControlsSaveData = () => {
  const controls = useControls();
  const originControls = toRaw(controls);
  const saveData = generateNotDefinedData(originControls, 'controls');

  saveData.data = {};
  for (const key of Object.keys(originControls)) {
    if (!excludeKey.includes(key)) {
      if (isRef(originControls[key])) {
        saveData.data[key] = originControls[key].value;
      } else if (isReactive(originControls[key])) {
        saveData.data[key] = toRaw(originControls[key].value);
      } else {
        saveData.data[key] = originControls[key].value;
      }
    }
  }
  return saveData;
};
const getEnvironmentSaveData = () => {
  const environment = useEnvironment();
  const originEnvironment = toRaw(environment);
  const saveData = generateNotDefinedData(originEnvironment, 'environment');

  saveData.data = {};
  for (const key of Object.keys(originEnvironment)) {
    if (!excludeKey.includes(key)) {
      if (isRef(originEnvironment[key])) {
        saveData.data[key] = originEnvironment[key].value;
      } else if (isReactive(originEnvironment[key])) {
        saveData.data[key] = toRaw(originEnvironment[key].value);
      } else {
        saveData.data[key] = originEnvironment[key];
      }
    }
  }
  return saveData;
};

const getLightSaveData = () => {
  const light = useLight();
  const originLight = toRaw(light);
  const saveData = generateNotDefinedData(originLight, 'light');

  saveData.data = {
    lights: toRaw(originLight['lights'].value)
  };
  return saveData;
};

const getProjectSaveData = () => {
  const project = useProject();
  const originProject = toRaw(project);
  const saveData = generateNotDefinedData(originProject, 'project');

  saveData.data = {};
  for (const key of Object.keys(originProject)) {
    if (!excludeKey.includes(key)) {
      if (isRef(originProject[key])) {
        saveData.data[key] = originProject[key].value;
      } else if (isReactive(originProject[key])) {
        saveData.data[key] = toRaw(originProject[key].value);
      } else {
        saveData.data[key] = originProject[key];
      }
    }
  }
  return saveData;
};
const getSceneSaveData = () => {
  const scene = useScene();
  const originScene = toRaw(scene);
  const saveData = generateNotDefinedData(originScene, 'scene');
  saveData.data = {};
  for (const key of sceneDataKey) {
    if (!excludeKey.includes(key)) {
      if (isRef(originScene[key])) {
        saveData.data[key] = originScene[key].value;
      } else if (isReactive(originScene[key])) {
        saveData.data[key] = toRaw(originScene[key].value);
      } else {
        saveData.data[key] = originScene[key];
      }
    }
  }
  return saveData;
};
const handleImageUpload = async (scene, canSave) => {
  const $message = useMessage();
  for (const image of scene.data.images) {
    if (image.url.file && image.url.file instanceof File) {
      $message.clear();
      $message.info(`有本地资源未上传, 开始上传资源`);
      const { resource_url } = await upload(image.url.file);
      if (resource_url) {
        image.url = resource_url;
        $message.clear();
        $message.success(`上传文件成功; ${resource_url}`);
      } else {
        $message.clear();
        $message.error(`上传文件失败，保存模型失败;`);
        canSave = false;
      }
    }
  }
  return canSave;
};
const handleCameraUpload = async (camera, canSave) => {
  const $message = useMessage();
  if (camera?.data?.screenshot?.url?.includes?.('base64')) {
    $message.info(`有本地资源未上传, 开始上传资源`);
    const { resource_url } = await uploadBase64(camera?.data?.screenshot?.url);
    if (resource_url) {
      $message.clear();
      $message.success(`上传文件成功; ${resource_url}`);
      camera.data.screenshot.url = resource_url;
    } else {
      $message.clear();
      $message.error(`上传文件失败，保存失败`);
      canSave = false;
    }
  }
  return canSave;
};
const handleModelUpload = async (scene, canSave) => {
  const $message = useMessage();
  // 模型资源文件上传
  for (const model of scene.data.modelMesh) {
    if (model.modelPath && model.modelPath instanceof File) {
      $message.clear();
      $message.info(`有本地模型资源未上传, 开始上传资源`);
      const { resource_url, resource_id } = await upload(model.modelPath);
      if (resource_url) {
        model.modelPath = resource_url;
        model.modelResource_id = resource_id;
        $message.clear();
        $message.success(`上传模型文件成功; ${resource_url}`);
      } else {
        $message.clear();
        $message.error(`上传模型文件失败，保存模型失败;`);
        canSave = false;
      }
    }
  }
  // 材质封面资源上传
  for (const material of scene.data.materials) {
    if (material.image?.file && material.image.file instanceof File) {
      $message.clear();
      $message.info(`有本地材质封面资源未上传, 开始上传资源`);
      const { resource_url } = await upload(material.image.file);
      if (resource_url) {
        material.image = resource_url;
        $message.clear();
        $message.success(`上传材质封面文件成功; ${resource_url}`);
      } else {
        $message.clear();
        $message.error(`上传材质封面文件失败，保存模型失败;`);
        canSave = false;
      }
    }
  }
  return canSave;
};
const handleEnvironmentUpload = async (environment, canSave) => {
  const $message = useMessage();
  if (environment?.data?.environment?.path?.file) {
    $message.info(`有本地hdr资源未上传, 开始上传资源`);
    const { resource_url } = await upload(environment?.data?.environment?.path?.file);
    if (resource_url) {
      $message.clear();
      $message.success(`上传hdr文件成功; ${resource_url}`);
      environment.data.environment.path = resource_url;
    } else {
      $message.clear();
      $message.error(`上传hdr文件失败，保存失败`);
      canSave = false;
    }
  }
  if (environment?.data?.background?.path?.file) {
    $message.info(`有本地背景资源未上传, 开始上传资源`);
    const { resource_url } = await upload(environment?.data?.background?.path?.file);
    if (resource_url) {
      $message.clear();
      $message.success(`上传背景文件成功; ${resource_url}`);
      environment.data.background.path = resource_url;
    } else {
      $message.clear();
      $message.error(`上传背景文件失败，保存失败`);
      canSave = false;
    }
  }
  return canSave;
};

export async function useSave() {
  const $message = useMessage();
  try {
    const camera = getCameraSaveData();
    const controls = getControlsSaveData();
    const environment = getEnvironmentSaveData();
    const light = getLightSaveData();
    const project = getProjectSaveData();
    const scene = getSceneSaveData();
    const saveData = {
      camera,
      controls,
      environment,
      light,
      project,
      scene
    };
    let canSave = true;
    canSave = await handleImageUpload(scene, canSave);
    canSave = await handleCameraUpload(camera, canSave);
    canSave = await handleModelUpload(scene, canSave);
    canSave = await handleEnvironmentUpload(environment, canSave);
    if (canSave) {
      //   const response = await save(saveData);
      await save(saveData).then(() => {
        $message.success('保存成功');
        useEditorStore().setValue('hasChanged', false);
      });
    }
    return saveData;
  } catch (error) {
    $message.success('保存失败');
  }
}

const copySaveData = saveData => {
  const sceneStore = useSceneStore();
  for (const key of Object.keys(saveData)) {
    saveData[key].uuid = sceneStore.threeEngine.generateUUID();
    saveData[key].name = `${saveData[key].name}_clone`;
    if (key !== 'scene') {
      saveData.scene.data[key] = saveData[key].uuid;
    }
  }
  for (const group of saveData.scene.data.modelMesh) {
    group.uuid = sceneStore.threeEngine.generateUUID();
    if (group.children) {
      for (const mesh of group.children) {
        const newGeometry = sceneStore.threeEngine.generateUUID();
        const newMaterial = sceneStore.threeEngine.generateUUID();
        const oldMaterial = mesh.material;
        mesh.uuid = sceneStore.threeEngine.generateUUID();
        if (Array.isArray(oldMaterial)) {
          oldMaterial.forEach((oldMaterialUuid, index) => {
            mesh.material[index] = newMaterial;
            const material = saveData.scene.data.materials.find(item => item.uuid === oldMaterialUuid);
            material.uuid = newMaterial;
            const materialMapKeyList = Object.keys(material).filter(key => key.endsWith('Map') || key == 'map');
            for (const key of materialMapKeyList) {
              const oldMap = material[key];
              const newMap = sceneStore.threeEngine.generateUUID();
              if (oldMap) {
                const imageData = saveData.scene.data.images.find(item => item.uuid === oldMap);
                material[key] = newMap;
                imageData.uuid = newMap;
              }
            }
          });
        } else {
          mesh.material = newMaterial;
          const material = saveData.scene.data.materials.find(item => item.uuid === oldMaterial);
          material.uuid = newMaterial;
          const materialMapKeyList = Object.keys(material).filter(key => key.endsWith('Map') || key == 'map');
          for (const key of materialMapKeyList) {
            const oldMap = material[key];
            const newMap = sceneStore.threeEngine.generateUUID();
            if (oldMap) {
              const imageData = saveData.scene.data.images.find(item => item.uuid === oldMap);
              material[key] = newMap;
              imageData.uuid = newMap;
            }
          }
        }
        mesh.geometry = newGeometry;
      }
    }
  }

  for (const light of saveData.light.data.lights) {
    light.uuid = sceneStore.threeEngine.generateUUID();
  }
  saveData.environment.data.environment.texture &&
    (saveData.environment.data.environment.texture = sceneStore.threeEngine.generateUUID());
  saveData.environment.data.background.texture &&
    (saveData.environment.data.background.texture = sceneStore.threeEngine.generateUUID());
  return saveData;
};

export async function useSaveAs() {
  const $message = useMessage();
  try {
    const camera = getCameraSaveData();
    const controls = getControlsSaveData();
    const environment = getEnvironmentSaveData();
    const light = getLightSaveData();
    const project = getProjectSaveData();
    const scene = getSceneSaveData();
    const saveData = {
      camera,
      controls,
      environment,
      light,
      project,
      scene
    };
    copySaveData(saveData);
    let canSave = true;
    canSave = await handleImageUpload(scene, canSave);
    canSave = await handleCameraUpload(camera, canSave);
    canSave = await handleModelUpload(scene, canSave);
    canSave = await handleEnvironmentUpload(environment, canSave);
    if (canSave) {
      //   const response = await save(saveData);
      save(saveData).then(() => {
        $message.success('保存成功');
        openScene({ uuid: saveData.scene.uuid, target: '_blank' });
      });
    }
    return saveData;
  } catch (error) {
    console.log(error);
    $message.success('保存失败');
  }
}
