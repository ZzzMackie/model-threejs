import { computed, ref } from 'vue';
import { useCameraStore } from '@stores/camera.js';
import { useSceneStore } from '@stores/scene.js';
import { useControlsStore } from '@stores/controls.js';
import { useEditorStore } from '@stores/editor.js';
// import { useHelperStore } from '@stores/helper.js';
import { useLightStore } from '@stores/light.js';
import { useProjectStore } from '@stores/project.js';
import { useEnvironmentStore } from '@stores/environment.js';

const canRedoData = ref({
  cameraCanRedo: false,
  controlsCanRedo: false,
  sceneCanRedo: false,
  // editorCanRedo: false,
  environmentCanRedo: false,
  // helperCanRedo: false,
  lightCanRedo: false,
  projectCanRedo: false
});
const canUndoData = ref({
  cameraCanUndo: false,
  controlsCanUndo: false,
  sceneCanUndo: false,
  // editorCanUndo: false,
  environmentCanRedo: false,
  // helperCanRedo: false,
  lightCanRedo: false,
  projectCanRedo: false
});
const hasChanged = computed(() => {
  return useEditorStore().hasChanged;
});
const canUndo = computed(() => {
  let can = false;
  for (const key of Object.keys(canUndoData.value)) {
    canUndoData.value[key] && (can = true);
  }
  return can;
});
const canRedo = computed(() => {
  let can = false;
  for (const key of Object.keys(canRedoData.value)) {
    canRedoData.value[key] && (can = true);
  }
  return can;
});
const storeHasChanged = () => {
  useEditorStore().setValue('hasChanged', true);
};
const storeSubscribe = ({ store, canUndo, canRedo }) => {
  store.$subscribe((mutation, state) => {
    canUndoData.value[canUndo] = store?.stack?.canUndo?.();
    canRedoData.value[canRedo] = store?.stack?.canRedo?.();
    storeHasChanged();
    console.log(store.$id, store, mutation, state);
  });
};
// const helperStoreSubscribe = () => {
//   const helperStore = useHelperStore();
//   storeSubscribe({ store: helperStore, canUndo: 'helperCanUndo', canRedo: 'helperCanRedo' });
// };
const lightStoreSubscribe = () => {
  const lightStore = useLightStore();
  storeSubscribe({ store: lightStore, canUndo: 'lightCanUndo', canRedo: 'lightCanRedo' });
};
const projectStoreSubscribe = () => {
  const projectStore = useProjectStore();
  storeSubscribe({ store: projectStore, canUndo: 'projectCanUndo', canRedo: 'projectCanRedo' });
};

const environmentStoreSubscribe = () => {
  const environmentStore = useEnvironmentStore();
  storeSubscribe({ store: environmentStore, canUndo: 'environmentCanUndo', canRedo: 'environmentCanRedo' });
};

// const editorStoreSubscribe = () => {
//   const editorStore = useEditorStore();
//   storeSubscribe({ store: editorStore, canUndo: 'editorCanUndo', canRedo: 'editorCanRedo' });
// };

const cameraStoreSubscribe = () => {
  const cameraStore = useCameraStore();
  storeSubscribe({ store: cameraStore, canUndo: 'cameraCanUndo', canRedo: 'cameraCanRedo' });
};
const controlsStoreSubscribe = () => {
  const controlsStore = useControlsStore();
  storeSubscribe({ store: controlsStore, canUndo: 'controlsCanUndo', canRedo: 'controlsCanRedo' });
};
const sceneStoreSubscribe = () => {
  const sceneStore = useSceneStore();
  storeSubscribe({ store: sceneStore, canUndo: 'sceneCanUndo', canRedo: 'sceneCanRedo' });
};

// 辅助线undo
// const helperStoreUndo = () => {
//   const helperStore = useHelperStore();
//   canUndoData.value['helperCanUndo'] && helperStore.undo();
// };
// 灯光undo
const lightStoreUndo = () => {
  const lightStore = useLightStore();
  canUndoData.value['lightCanUndo'] && lightStore.undo();
};
// 渲染设置undo
const projectStoreUndo = () => {
  const projectStore = useProjectStore();
  canUndoData.value['projectCanUndo'] && projectStore.undo();
};
// 编辑器undo
// const editorStoreUndo = () => {
//   const editorStore = useEditorStore();
//   canUndoData.value['editorCanUndo'] && editorStore.undo();
// };
// 相机undo
const cameraStoreUndo = () => {
  const cameraStore = useCameraStore();
  canUndoData.value['cameraCanUndo'] && cameraStore.undo();
};
// 控制器undo
const controlsStoreUndo = () => {
  const controlsStore = useControlsStore();
  canUndoData.value['controlsCanUndo'] && controlsStore.undo();
};
// 场景undo
const sceneStoreUndo = () => {
  const sceneStore = useSceneStore();
  canUndoData.value['sceneCanUndo'] && sceneStore.undo();
};
// 场景undo
const environmentStoreUndo = () => {
  const environmentStore = useEnvironmentStore();
  if (canUndoData.value['environmentCanUndo']) {
    environmentStore.undo();
  }
};

// 编辑器redo
// const editorStoreRedo = () => {
//   const editorStore = useEditorStore();
//   canRedoData.value['editorCanRedo'] && editorStore.redo();
// };
// 相机redo
const cameraStoreRedo = () => {
  const cameraStore = useCameraStore();
  canRedoData.value['cameraCanRedo'] && cameraStore.redo();
};
// 控制器redo
const controlsStoreRedo = () => {
  const controlsStore = useControlsStore();
  canRedoData.value['controlsCanRedo'] && controlsStore.redo();
};
// 场景redo
const sceneStoreRedo = () => {
  const sceneStore = useSceneStore();
  canRedoData.value['sceneCanRedo'] && sceneStore.redo();
};
// 场景redo
const environmentStoreRedo = () => {
  const environmentStore = useEnvironmentStore();
  canRedoData.value['environmentCanRedo'] && environmentStore.redo();
};
// 辅助线undo
// const helperStoreRedo = () => {
//   const helperStore = useHelperStore();
//   canRedoData.value['helperCanRedo'] && helperStore.redo();
// };
// 灯光Redo
const lightStoreRedo = () => {
  const lightStore = useLightStore();
  canRedoData.value['lightCanRedo'] && lightStore.redo();
};
// 渲染设置Redo
const projectStoreRedo = () => {
  const projectStore = useProjectStore();
  canRedoData.value['projectCanRedo'] && projectStore.redo();
};

export function useUndoRedo() {
  cameraStoreSubscribe();
  controlsStoreSubscribe();
  sceneStoreSubscribe();
  // editorStoreSubscribe();
  environmentStoreSubscribe();
  // helperStoreSubscribe();
  lightStoreSubscribe();
  projectStoreSubscribe();
  const undo = () => {
    cameraStoreUndo();
    controlsStoreUndo();
    sceneStoreUndo();
    // editorStoreUndo();
    environmentStoreUndo();
    // helperStoreUndo();
    lightStoreUndo();
    projectStoreUndo();
  };
  const redo = () => {
    cameraStoreRedo();
    controlsStoreRedo();
    sceneStoreRedo();
    // editorStoreRedo();
    environmentStoreRedo();
    // helperStoreRedo();
    lightStoreRedo();
    projectStoreRedo();
  };
  return {
    undo,
    redo,
    canUndo,
    canRedo,
    hasChanged
  };
}
