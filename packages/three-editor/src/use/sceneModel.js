import { useScene } from '@use/sceneStore.js';
import { useSceneStore } from '@stores/scene.js';
import { useEditorStore } from '@stores/editor.js';
import { createDrawer } from '@feature/drawer/index.js';
import { defineAsyncComponent } from 'vue';
const SceneLibrary = defineAsyncComponent(() => import('@components/library/SceneLibrary.vue'));
export function useSceneModel() {
  const { modelMesh, selected } = useScene();
  const sceneStore = useSceneStore();
  const editorStore = useEditorStore();
  const visible = (idx, index) => {
    sceneStore.setVisible(idx, index);
  };
  const changeSelected = uuid => {
    sceneStore.setSelected(uuid);
  };
  const modelChange = (_, cFile) => {
    switch (cFile.status) {
      case 'init':
        editorStore.setPercentage(0);
        break;
      case 'uploading':
        if (editorStore.percentage < 10) {
          editorStore.setPercentage(10);
        }
        break;
      case 'done':
        editorStore.setPercentage(20);
        sceneStore.addModelMesh(cFile);
        break;
      case 'error':
        editorStore.setPercentage(100);
        sceneStore.addModelMesh(cFile);
        break;
      default:
        break;
    }
  };
  // 上传失败 FIXEME
  const modelError = file => {
    console.log(file);
  };
  const deleteGroup = idx => {
    sceneStore.deleteGroup(idx);
  };
  const deleteMesh = uuid => {
    sceneStore.deleteMesh(uuid);
  };
  const modelMeshChange = (_, cFile) => {
    switch (cFile.status) {
      case 'done':
      case 'error':
        sceneStore.changeMesh(cFile);
        break;
      default:
        break;
    }
  };
  const openSceneLibrary = () => {
    createDrawer({
      key: 'SceneLibrary',
      popupContainer: '#sceneWrap',
      drawerOptions: {
        props: {
          title: '模型管理',
          width: 600,
          footer: false,
          placement: 'left'
        }
      },
      slotVnodeFn: h => {
        return {
          content: () => h(SceneLibrary)
        };
      }
    });
  };
  const setCombineModelMesh = (group, model) => {
    sceneStore.setCombineModelMesh(group, model);
  };
  return {
    modelMesh,
    selected,
    visible,
    changeSelected,
    modelChange,
    modelError,
    deleteGroup,
    deleteMesh,
    modelMeshChange,
    openSceneLibrary,
    setCombineModelMesh
  };
}
