<script setup>
import { computed, ref, h } from 'vue';
import LibraryItem from './LibraryItem.vue';
import { useEditor } from '@use/useEditorStore.js';
import { useEditorStore } from '@stores/editor.js';
import { useModal } from '@use/useModal.js';
import AddCategory from '../AddCategory.vue';
import { useMessage } from '@use/message.js';
const { hdrLibraryList, hdrLibraryCategory, selectedHdrLibrary, selectHdrLoading, hdrCategory } = useEditor();
const editorStore = useEditorStore();
const addLibrary = () => {
  editorStore.addHdrLibrary();
};
const selectLibrary = uuid => {
  editorStore.selectHdrLibrary(uuid);
};
const deleteLibrary = uuid => {
  editorStore.deleteHdrLibrary(uuid);
};
const searchLibrary = val => {
  editorStore.searchHdrLibrary(val);
};
const info = computed(() => {
  return {
    selectLoading: selectHdrLoading.value,
    selectedLibrary: selectedHdrLibrary.value,
    libraryCategory: hdrLibraryCategory.value,
    isTexture: true
  };
});
const libraryList = computed(() => {
  return hdrLibraryList.value;
});
const options = computed(() => {
  return hdrCategory.value;
});
const changeName = uuid => {
  editorStore.changeHdrLibrary(uuid);
};
const moveLibrary = (uuid, id) => {
  editorStore.moveHdrLibrary(uuid, id);
};
const categoryChange = val => {
  editorStore.setValue('hdrLibraryCategory', val);
};
const changeLibraryTexture = data => {
  editorStore.changeHdrLibraryTexture(data);
};
const addCategory = async () => {
  const category_name = ref('');
  useModal().open({
    title: '新建HDR分类',
    closable: true,
    okText: '保存',
    content: () =>
      h(AddCategory, {
        onChange: val => {
          category_name.value = val;
        }
      }),
    onOk: () => {
      editorStore.addNewHdrCategory(category_name.value);
    },
    onBeforeOk: () => {
      if (!category_name.value) {
        useMessage().info('分类名称不能为空！');
        return false;
      }
      if (editorStore.hasSameHdrCategoryName(category_name.value)) {
        useMessage().info('已有相同分类名称');
        return false;
      }
      return true;
    }
  });
};
</script>

<template>
  <LibraryItem
    class="hdrlibrary__wrap"
    accept=".hdr"
    :info
    :options
    :library-list
    @category-change="categoryChange"
    @move-library="moveLibrary"
    @change-name="changeName"
    @add-library="addLibrary"
    @search-library="searchLibrary"
    @delete-library="deleteLibrary"
    @select-library="selectLibrary"
    @add-category="addCategory"
    @change-library-texture="changeLibraryTexture"
  ></LibraryItem>
</template>

<style lang="scss">
@import '@styles/library/hdrLibrary/index.scss';
</style>
