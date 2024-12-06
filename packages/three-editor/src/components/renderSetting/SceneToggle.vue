<script setup>
import { computed, ref, h } from 'vue';
import { useEditorStore } from '@stores/editor.js';
import { useSceneStore } from '@stores/scene.js';
import { appendQueryParam, openScene } from '@use/utils.js';
import { useMessage } from '@use/message.js';
import { useModal } from '@use/useModal.js';
import AddCategory from '../AddCategory.vue';
const editorStore = useEditorStore();
const sceneStore = useSceneStore();
const canChangeScene = ref(true);
const changeScene = async uuid => {
  if (!canChangeScene.value) {
    useMessage().info('数据未更新完毕, 请稍后切换场景!');
    return;
  }
  appendQueryParam('scene', uuid);
  location.reload();
};
const sceneCategory = computed(() => {
  return editorStore.sceneCategory;
});
const addNewScene = async () => {
  openScene({ uuid: sceneStore.threeEngine.generateUUID(), target: '_self' });
};
const moveSceneCategory = (...args) => {
  editorStore.moveSceneCategory(...args);
};
// eslint-disable-next-line no-unused-vars
const addNewCategory = async () => {
  const category_name = ref('');
  useModal().open({
    title: '新建分类',
    closable: true,
    okText: '保存',
    content: () =>
      h(AddCategory, {
        onChange: val => {
          category_name.value = val;
        }
      }),
    onOk: () => {
      editorStore.addNewSceneCategory(category_name.value);
    },
    onBeforeOk: () => {
      if (!category_name.value) {
        useMessage().info('分类名称不能为空！');
        return false;
      }
      if (editorStore.hasSameCategoryName(category_name.value)) {
        useMessage().info('已有相同分类名称');
        return false;
      }
      return true;
    }
  });
};
</script>

<template>
  <div class="scenetoggle__wrap c_scrollbar c_scrollbar__x-none">
    <template v-for="(child, idx) in sceneCategory" :key="child.id">
      <arco-collapse class="scenetoggle__item" :default-active-key="[0]" accordion :bordered="false">
        <arco-collapse-item :key="idx">
          <template #header>
            <div class="scenetoggle__collapseitemheader c__font-bold">
              <div class="scenetoggle__collapseitemname">
                <span>{{ child.name }}</span>
              </div>
            </div>
          </template>
          <div v-if="child.data.length">
            <template v-for="scene in child.data" :key="scene.uuid">
              <arco-dropdown trigger="contextMenu" align-point :style="{ display: 'block' }">
                <div
                  class="scenetoggle__scene"
                  :class="{ 'scenetoggle__scene-active': editorStore.currentScene === scene.uuid }"
                  @click="changeScene(scene.uuid)"
                >
                  <arco-col :span="20" class="scenetoggle__name">
                    <span>{{ scene.name }}</span>
                  </arco-col>
                </div>
                <template #content>
                  <template v-for="category in sceneCategory" :key="category.id">
                    <arco-doption
                      v-if="child.id !== category.id && category.id !== -1 && category.id !== 0"
                      @click="moveSceneCategory(scene.uuid, category.id)"
                    >
                      移动到{{ category.name }}分类
                    </arco-doption>
                  </template>
                </template>
              </arco-dropdown>
            </template>
          </div>
          <arco-empty v-else />
        </arco-collapse-item>
      </arco-collapse>
    </template>
  </div>
  <div class="scenetoggle__add">
    <arco-col class="scenetoggle__addscene" @click="addNewScene">
      <span class="scenetoggle__text">新建场景</span>
      <svg-icon name="add" size="20"></svg-icon>
    </arco-col>
  </div>
</template>

<style lang="scss" scoped>
@import '@styles/sceneToggle/index.scss';
</style>
