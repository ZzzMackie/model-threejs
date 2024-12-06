<script setup>
import { ref, h, onMounted } from 'vue';
import { useModal } from '@use/useModal.js';
import AddCategory from '../AddCategory.vue';
import { useMessage } from '@use/message.js';
import { useEditor } from '@use/useEditorStore.js';
import { useEditorStore } from '@stores/editor.js';
import { appendQueryParam, openScene } from '@use/utils.js';
import { useSceneStore } from '@stores/scene.js';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useSave } from '@use/save.js';

const editorStore = useEditorStore();
const { sceneCategoryOptions, sceneLibrary, currentScene, sceneLibraryCategory, searchSceneKeyword, hasChanged } =
  useEditor();
const sceneStore = useSceneStore();
const searchSceneLibrary = val => {
  editorStore.searchSceneLibrary(val);
};
const sceneLibraryChange = val => {
  if (!val) editorStore.searchSceneLibrary(val);
};
const deleteSceneLibrary = uuid => {
  useModal().open({
    title: '删除模型',
    closable: true,
    okText: '确定',
    content: '确定要删除该模型吗？',
    onOk: () => {
      editorStore.deleteSceneLibrary(uuid);
    }
  });
};
const addSceneCategory = () => {
  const category_name = ref('');
  useModal().open({
    title: '新建模型分类',
    closable: true,
    okText: '保存',
    content: () =>
      h(AddCategory, {
        onChange: val => {
          category_name.value = val;
        }
      }),
    onOk: () => {
      editorStore.addNewSceneCategory({ name: category_name.value });
    },
    onBeforeOk: () => {
      if (!category_name.value) {
        useMessage().info('分类名称不能为空！');
        return false;
      }
      if (editorStore.hasSameSceneCategoryName(category_name.value)) {
        useMessage().info('已有相同分类名称');
        return false;
      }
      return true;
    }
  });
};
const currentSceneLibrary = id => {
  if (id === -1) {
    return searchSceneKeyword.value
      ? sceneLibrary.value.filter(library => library.name.includes(searchSceneKeyword.value))
      : sceneLibrary.value;
  } else {
    return sceneLibrary.value.filter(library => library.category_id === id);
  }
};
const moveSceneCategory = (...args) => {
  editorStore.moveSceneCategory(...args);
};
const selectSceneLibrary = uuid => {
  if (hasChanged.value) {
    useModal().open({
      title: '切换模型',
      closable: true,
      okText: '保存',
      content: '是否保存当前场景',
      onOk: async () => {
        await useSave();
        appendQueryParam('scene', uuid);
        location.reload();
      }
    });
  } else {
    appendQueryParam('scene', uuid);
    location.reload();
  }
};
// eslint-disable-next-line no-unused-vars
const addLibraryToScene = _uuid => {
  editorStore.addLibraryToScene(_uuid);
};
const addNewScene = async () => {
  openScene({ uuid: sceneStore.threeEngine.generateUUID(), target: '_self' });
};
const changeSceneName = uuid => {
  editorStore.changeSceneLibraryName(uuid);
};
const editSceneCategory = item => {
  const category_name = ref(item.name);
  useModal().open({
    title: '编辑模型分类',
    closable: true,
    okText: '保存',
    content: () =>
      h(AddCategory, {
        title: category_name.value,
        onChange: val => {
          category_name.value = val;
        }
      }),
    onOk: () => {
      editorStore.addNewSceneCategory({ name: category_name.value, id: item.id });
    },
    onBeforeOk: () => {
      if (!category_name.value) {
        useMessage().info('分类名称不能为空！');
        return false;
      }
      if (editorStore.hasSameSceneCategoryName(category_name.value)) {
        useMessage().info('已有相同分类名称');
        return false;
      }
      return true;
    }
  });
};
const getPartScene = partList => {
  return sceneLibrary.value.filter(library => partList.includes(library.uuid));
};
const hidePart = scene => {
  scene.hidePart = !scene.hidePart;
};
const popupVisibleChange = () => {
  document.getElementsByClassName('scene_library__dropdown')?.[0]?.remove?.();
};
const draggableEle = element => {
  draggable({
    element,
    getInitialData({ element }) {
      return { id: element.getAttribute('data-uuid') };
    },
    // onDragStart(...args) {
    //   console.log('onDragStart', ...args);
    // },
    // onDropTargetChange(...args) {
    //   console.log('onDropTargetChange', ...args);
    // },
    async onDrop({ source, location }) {
      const { element: sourceElement } = source;
      const {
        current: { dropTargets: targetDropTargets }
      } = location;
      const sourceSceneUUid = sourceElement.getAttribute('data-uuid');
      const targetSceneUUid = targetDropTargets?.[0]?.element?.getAttribute?.('data-uuid');
      const previousSceneUUid = sourceElement.getAttribute('data-parent-uuid');
      await editorStore.dropSceneLibrary({ sourceSceneUUid, targetSceneUUid, previousSceneUUid });
      setTimeout(() => {
        // 拖拽完 dom变化 重新挂载
        draggableEle(document.getElementById(sourceSceneUUid));
      }, 700);
    }
  });
};
const initDrop = () => {
  for (const element of Array.from(document.getElementsByClassName('scene_library__card-drop'))) {
    draggableEle(element);
  }
  for (const element of Array.from(document.getElementsByClassName('scene_library__cardcontent'))) {
    dropTargetForElements({
      element
      // getInitialDataForExternal(...args) {
      //   console.log('getInitialData-dropTargetForElements', ...args);
      //   return { id: 'element11111111' };
      // },
      // onDragStart(...args) {
      //   console.log('onDragStart-dropTargetForElements', ...args);
      // },
      // onDropTargetChange(...args) {
      //   console.log('onDropTargetChange-dropTargetForElements', ...args);
      // },
      // onDrop(...args) {
      //   console.log('onDrop-dropTargetForElements', ...args);
      // }
    });
  }
};
onMounted(() => {
  initDrop();
});
</script>

<template>
  <arco-col class="scene_library__wrap">
    <arco-row>
      <arco-input-search
        :style="{ height: '50px' }"
        placeholder="Please enter something"
        search-button
        allow-clear
        :loading
        @search="searchSceneLibrary"
        @change="sceneLibraryChange"
      />
    </arco-row>
    <arco-row class="scene_library__tabs">
      <arco-tabs
        v-model="sceneLibraryCategory"
        type="line"
        editable
        auto-switch
        justify
        show-add-button
        animation
        @add="addSceneCategory"
        @change="initDrop"
      >
        <arco-tab-pane
          v-for="item of sceneCategoryOptions"
          :key="item.id"
          class="c_scrollbar c_scrollbar__x-none scene_library__tabitem"
          :closable="false"
        >
          <template #title>
            <arco-dropdown trigger="contextMenu" align-point :style="{ display: 'block' }">
              <div>{{ item.name }}</div>
              <template #content>
                <arco-doption @click="editSceneCategory(item)">编辑分类名称</arco-doption>
              </template>
            </arco-dropdown>
          </template>
          <arco-row class="scene_library__card" :class="{ 'scene_library__card-loading': true }">
            <template v-if="sceneLibrary.length">
              <template v-for="scene in currentSceneLibrary(item.id)" :key="scene.uuid">
                <arco-col
                  class="scene_library__carditem"
                  :span="scene.data.partList?.length && !scene.hidePart ? 23 : 7"
                  :class="{ 'scene_library__carditem-active': scene.data.partList?.length && !scene.hidePart }"
                >
                  <arco-dropdown
                    class="scene_library__dropdown"
                    trigger="contextMenu"
                    align-point
                    :style="{ display: 'block', 'z-index': 1003 }"
                  >
                    <div class="scene_library__cardlist">
                      <arco-card
                        :id="scene.uuid"
                        :data-uuid="scene.uuid"
                        :style="{ width: '165px', 'min-height': '200px' }"
                        class="scene_library__cardcontent scene_library__card-drop"
                        :class="{ 'scene_library__card-active': scene.uuid === currentScene }"
                      >
                        <template #cover>
                          <div class="scene_library__cardcover">
                            <arco-spin class="scene_library__spin" :size="32" :loading="false">
                              <arco-image
                                show-loader
                                fit="contain"
                                class="scene_library__img"
                                :style="{ width: '100%', height: '163px' }"
                                :src="scene.camera_data.data.screenshot.url"
                              />
                            </arco-spin>
                            <div v-if="scene.data.model_type == 2" class="scene_library__parttext">配件</div>
                            <div
                              v-if="scene.data.partList?.length"
                              class="scene_library__cardcover-hidepart"
                              @click="hidePart(scene)"
                            >
                              <IconCaretLeft v-if="scene.hidePart" />
                              <IconCaretRight v-else />
                            </div>
                          </div>
                        </template>
                        <arco-card-meta>
                          <template #title>
                            <arco-input
                              v-model="scene.name"
                              :style="{ width: '100%', background: 'transparent', padding: 0 }"
                              placeholder="Please enter something"
                              @change="changeSceneName(scene.uuid)"
                            />
                          </template>
                        </arco-card-meta>
                      </arco-card>
                      <arco-layout-sider
                        v-if="scene.data.partList?.length"
                        hide-trigger
                        collapsible
                        :width="359"
                        :collapsed-width="0"
                        reverse-arrow
                        :collapsed="scene.hidePart"
                        class="c_scrollbar scene_library__partlist"
                        :style="{ backgroundColor: 'transparent' }"
                      >
                        <arco-card
                          v-for="partScene in getPartScene(scene.data.partList)"
                          :id="partScene.uuid"
                          :key="partScene.uuid"
                          :data-uuid="partScene.uuid"
                          :data-parent-uuid="scene.uuid"
                          :style="{ width: '120px', 'min-height': '155px' }"
                          class="scene_library__cardcontent scene_library__card-drop scene_library__cardcontent-part"
                          :class="{ 'scene_library__card-active': partScene.uuid === currentScene }"
                        >
                          <template #cover>
                            <arco-dropdown
                              trigger="contextMenu"
                              align-point
                              :style="{ display: 'block', 'z-index': 1005 }"
                              @select="popupVisibleChange"
                              @popup-visible-change="popupVisibleChange"
                            >
                              <div class="scene_library__cardcover">
                                <arco-spin class="scene_library__spin" :size="32" :loading="false">
                                  <arco-image
                                    show-loader
                                    fit="contain"
                                    class="scene_library__img"
                                    :style="{ width: '100%', height: '120px' }"
                                    :src="partScene.camera_data.data.screenshot.url"
                                  />
                                </arco-spin>
                                <div class="scene_library__parttext">配件</div>
                              </div>
                              <template #content>
                                <arco-dsubmenu value="移动至">
                                  <template #default>配件模型移动至</template>
                                  <template #content>
                                    <arco-doption
                                      v-for="option of sceneCategoryOptions"
                                      :key="option.name"
                                      :value="option.id"
                                      @click="moveSceneCategory(partScene.uuid, option.id)"
                                      >{{ option.name }}</arco-doption
                                    >
                                  </template>
                                </arco-dsubmenu>
                                <arco-doption
                                  v-if="partScene.uuid !== currentScene"
                                  @click="addLibraryToScene(partScene.uuid)"
                                  >新增配件模型到当前场景</arco-doption
                                >
                                <arco-doption
                                  v-if="partScene.uuid !== currentScene"
                                  @click="selectSceneLibrary(partScene.uuid)"
                                  >切换配件模型场景</arco-doption
                                >
                                <arco-doption
                                  v-if="partScene.uuid !== currentScene"
                                  @click="deleteSceneLibrary(partScene.uuid)"
                                  >删除配件模型</arco-doption
                                >
                              </template>
                            </arco-dropdown>
                            <arco-card-meta>
                              <template #title>
                                <arco-input
                                  v-model="partScene.name"
                                  :style="{ width: '100%', background: 'transparent', padding: 0 }"
                                  placeholder="Please enter something"
                                  @change="changeSceneName(partScene.uuid)"
                                />
                              </template>
                            </arco-card-meta>
                          </template>
                        </arco-card>
                      </arco-layout-sider>
                    </div>

                    <template #content>
                      <arco-dsubmenu value="移动至">
                        <template #default>{{ scene.data.partList?.length ? '主模型' : '模型' }}移动至</template>
                        <template #content>
                          <arco-doption
                            v-for="option of sceneCategoryOptions"
                            :key="option.name"
                            :value="option.id"
                            @click="moveSceneCategory(scene.uuid, option.id)"
                            >{{ option.name }}</arco-doption
                          >
                        </template>
                      </arco-dsubmenu>
                      <arco-doption v-if="scene.uuid !== currentScene" @click="addLibraryToScene(scene.uuid)"
                        >新增{{ scene.data.partList?.length ? '主模型' : '模型' }}到当前场景</arco-doption
                      >
                      <arco-doption v-if="scene.uuid !== currentScene" @click="selectSceneLibrary(scene.uuid)"
                        >切换{{ scene.data.partList?.length ? '主模型' : '模型' }}场景</arco-doption
                      >
                      <arco-doption v-if="scene.uuid !== currentScene" @click="deleteSceneLibrary(scene.uuid)"
                        >删除{{ scene.data.partList?.length ? '主模型' : '模型' }}</arco-doption
                      >
                    </template>
                  </arco-dropdown>
                </arco-col>
              </template>
            </template>
            <arco-empty v-if="!currentSceneLibrary(item.id).length" />
          </arco-row>
        </arco-tab-pane>
      </arco-tabs>
    </arco-row>

    <arco-row class="scene_library__addscene">
      <arco-button type="primary" shape="round" size="large" @click="addNewScene">新建模型</arco-button>
    </arco-row>
  </arco-col>
</template>

<style lang="scss">
@import '@styles/library/sceneLibrary/index.scss';
</style>
