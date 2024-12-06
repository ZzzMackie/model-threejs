<script setup>
import { computed, ref, h } from 'vue';
import LibraryItem from './LibraryItem.vue';
import { useEditor } from '@use/useEditorStore.js';
import { useEditorStore } from '@stores/editor.js';
import { useModal } from '@use/useModal.js';
import AddCategory from '../AddCategory.vue';
import { useMessage } from '@use/message.js';
const {
  materialLibraryList,
  materialLibraryCategory,
  selectedMaterialLibrary,
  selectMaterialLoading,
  materialCategory
} = useEditor();
const editorStore = useEditorStore();
const addLibrary = () => {
  editorStore.addMaterialLibrary();
};
const selectLibrary = uuid => {
  editorStore.selectMaterialLibrary(uuid);
};
const deleteLibrary = uuid => {
  editorStore.deleteMaterialLibrary(uuid);
};
const searchLibrary = val => {
  editorStore.searchMaterialLibrary(val);
};
const info = computed(() => {
  return {
    selectLoading: selectMaterialLoading.value,
    selectedLibrary: selectedMaterialLibrary.value,
    libraryCategory: materialLibraryCategory.value,
    isTexture: false
  };
});
const libraryList = computed(() => {
  return materialLibraryList.value;
});
const options = computed(() => {
  return materialCategory.value;
});
const changeName = uuid => {
  editorStore.changeMaterialLibrary(uuid);
};
const moveLibrary = (uuid, id) => {
  editorStore.moveMaterialLibrary(uuid, id);
};
const categoryChange = val => {
  editorStore.setValue('materialLibraryCategory', val);
};
const changeLibraryTexture = data => {
  editorStore.changeMaterialLibraryTexture(data);
};
const addCategory = async () => {
  const category_name = ref('');
  useModal().open({
    title: '新建材质分类',
    closable: true,
    okText: '保存',
    content: () =>
      h(AddCategory, {
        onChange: val => {
          category_name.value = val;
        }
      }),
    onOk: () => {
      editorStore.addNewMaterialCategory(category_name.value);
    },
    onBeforeOk: () => {
      if (!category_name.value) {
        useMessage().info('分类名称不能为空！');
        return false;
      }
      if (editorStore.hasSameMaterialCategoryName(category_name.value)) {
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
    class="material_library__wrap"
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
@import '@styles/library/materialLibrary/index.scss';
</style>
