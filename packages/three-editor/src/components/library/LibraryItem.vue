<script setup>
import { ref, computed, isProxy, onMounted, nextTick } from 'vue';
import { useScene } from '@use/sceneStore.js';
import { watchArray } from '@vueuse/core';
const emit = defineEmits([
  'searchLibrary',
  'addLibrary',
  'deleteLibrary',
  'changeName',
  'moveLibrary',
  'selectLibrary',
  'categoryChange',
  'selectedLibraryChange',
  'deleteCategory',
  'addCategory',
  'changeLibraryTexture',
  'uploadChange'
]);
const props = defineProps({
  libraryList: {
    type: Array,
    default() {
      return [];
    }
  },
  options: {
    type: Array,
    default() {
      return [];
    }
  },
  info: {
    type: Object,
    default: () => {
      return {
        isTexture: false,
        selectLoading: false,
        selectedLibrary: 0,
        libraryCategory: 0
      };
    }
  },
  accept: {
    type: String,
    default: '.jpg, .jpeg, .png'
  }
});
const loading = ref(false);
const info = computed(() => (isProxy(props.info) ? props.info.value : props.info));
const libraryList = computed(() => props.libraryList);
const options = computed(() => props.options);
const { threeEngine } = useScene();
const uploadId = ref(threeEngine.value.generateUUID());
const addLibrary = () => {
  emit('addLibrary');
};
const selectLibrary = uuid => {
  if (uploadLoading.value) return;
  emit('selectLibrary', uuid);
};
const deleteLibrary = uuid => {
  emit('deleteLibrary', uuid);
};
const searchLibrary = val => {
  emit('searchLibrary', val);
};
const libraryChange = val => {
  if (!val) emit('searchLibrary', val);
};
const changeName = uuid => {
  emit('changeName', uuid);
};
const moveLibrary = (uuid, id) => {
  emit('moveLibrary', uuid, id);
};
const uuid = ref('');
const uploadLoading = ref(false);
const defaultLibraryUuid = ref('01a628c3b5ef4cafbe5b54d363dd81ce');
const changeLibraryTexture = _uuid => {
  document.getElementById(uploadId.value).click();
  uuid.value = _uuid;
};
const uploadChange = async (_, currentFile, url) => {
  switch (currentFile.status) {
    case 'done':
      emit('changeLibraryTexture', {
        uuid: uuid.value,
        currentFile,
        url: currentFile?.response?.data?.resource_url ?? url
      });
      if (isTexture.value) {
        const library = libraryList.value.find(library => library.uuid === uuid.value);

        await threeEngine.value.addImageData(library.data.texture, library.data.path);
        threeEngine.value.renderToCanvas(library.data.texture, document.getElementById(`${library.uuid}_texture`));
      }
      uploadLoading.value = false;
      break;
    default:
      uploadLoading.value = true;
      break;
  }
  emit('uploadChange', { currentFile, url });
};

// const deleteCategory = (...args) => {
//   emit('deleteCategory', ...args);
// };
const addCategory = (...args) => {
  emit('addCategory', ...args);
};
const libraryCategoryValue = ref(info.value.libraryCategory);
const libraryCategory = computed({
  get() {
    return info.value.libraryCategory;
  },
  set(val) {
    libraryCategoryValue.value = val;
    emit('categoryChange', val);
  }
});
const isTexture = computed(() => info.value.isTexture);
const renderToCanvas = async library => {
  await nextTick();
  if (isTexture.value) {
    if (library) {
      await threeEngine.value.addImageData(library.data.texture, library.data.path);
      threeEngine.value.renderToCanvas(library.data.texture, document.getElementById(`${library.uuid}_texture`));
    } else {
      for (const library of libraryList.value) {
        await threeEngine.value.addImageData(library.data.texture, library.data.path);
        threeEngine.value.renderToCanvas(library.data.texture, document.getElementById(`${library.uuid}_texture`));
      }
    }
  }
};
if (isTexture.value) {
  // eslint-disable-next-line no-unused-vars
  watchArray(libraryList, (newList, oldList, added, _removed) => {
    for (const library of added) {
      renderToCanvas(library);
    }
  });
}
onMounted(() => {
  renderToCanvas();
});
</script>

<template>
  <arco-col class="library_item__wrap">
    <arco-row>
      <arco-input-search
        :style="{ height: '50px' }"
        placeholder="Please enter something"
        search-button
        allow-clear
        :loading
        @search="searchLibrary"
        @change="libraryChange"
      />
    </arco-row>
    <arco-dropdown trigger="contextMenu" align-point :style="{ display: 'block' }">
      <arco-row class="library_item__category">
        <arco-select
          v-model="libraryCategory"
          allow-create
          :style="{ height: '50px' }"
          placeholder="Please select ..."
          allow-search
        >
          <template v-for="option of options" :key="option.name">
            <!-- <arco-dropdown
              v-if="option.id !== -1 && option.id !== 0"
              trigger="contextMenu"
              align-point
              :style="{ display: 'block' }"
            >
              <arco-option :value="option.id">{{ option.name }}</arco-option>
              <template #content>
                <arco-doption @click="deleteCategory(option.id)">删除</arco-doption>
              </template>
            </arco-dropdown> -->
            <arco-option :value="option.id">{{ option.name }}</arco-option>
          </template>
        </arco-select>
      </arco-row>
      <template #content>
        <arco-doption @click="addCategory">新增分类</arco-doption>
      </template>
    </arco-dropdown>

    <arco-row class="library_item__card" :class="{ 'library_item__card-loading': info.selectLoading || uploadLoading }">
      <template v-if="libraryList.length">
        <arco-col
          v-for="material in libraryList"
          :key="material.uuid"
          class="library_item__carditem"
          :span="isTexture ? 11 : 5"
          @click="selectLibrary(material.uuid)"
        >
          <arco-dropdown trigger="contextMenu" align-point :style="{ display: 'block' }">
            <arco-card
              :style="{ width: isTexture ? '175px' : '80px' }"
              class="library_item__cardcontent"
              :class="{ 'library_item__card-active': info.selectedLibrary === material.uuid }"
            >
              <template #cover>
                <div class="library_item__cardcover">
                  <arco-spin
                    class="library_item__spin"
                    :size="32"
                    :loading="
                      (info.selectedLibrary === material.uuid && info.selectLoading) ||
                      (uploadLoading && uuid === material.uuid)
                    "
                  >
                    <img v-if="!isTexture" :style="{ width: '100%', height: '80px' }" :src="material.data.image" />
                    <canvas
                      v-else
                      :id="`${material.uuid}_texture`"
                      width="150"
                      height="80"
                      class="library_item__canvas"
                    ></canvas>
                  </arco-spin>
                </div>
              </template>
              <arco-card-meta>
                <template #title>
                  <arco-input
                    v-if="isTexture"
                    v-model="material.name"
                    :disabled="material.uuid === defaultLibraryUuid"
                    :style="{ width: '100%', background: 'transparent', padding: 0 }"
                    placeholder="Please enter something"
                    @change="changeName(material.uuid)"
                  />
                  <arco-input
                    v-else
                    v-model="material.data.name"
                    :disabled="material.uuid === defaultLibraryUuid"
                    :style="{ width: '100%', background: 'transparent', padding: 0 }"
                    placeholder="Please enter something"
                    @change="changeName(material.uuid)"
                  />
                </template>
              </arco-card-meta>
            </arco-card>
            <template #content>
              <arco-doption v-if="material.uuid !== defaultLibraryUuid" @click="changeLibraryTexture(material.uuid)"
                >替换预览文件</arco-doption
              >
              <arco-doption @click="selectLibrary(material.uuid)">应用</arco-doption>
              <arco-dsubmenu v-if="material.uuid !== defaultLibraryUuid" value="移动至">
                <template #default>移动至</template>
                <template #content>
                  <arco-doption
                    v-for="option of options"
                    :key="option.name"
                    :value="option.id"
                    @click="moveLibrary(material.uuid, option.id)"
                    >{{ option.name }}</arco-doption
                  >
                </template>
              </arco-dsubmenu>
              <arco-doption v-if="material.uuid !== defaultLibraryUuid" @click="deleteLibrary(material.uuid)"
                >删除</arco-doption
              >
            </template>
          </arco-dropdown>
        </arco-col>
        <file-upload :id="uploadId" class="library_item__upload" :accept :show-file-list="false" @change="uploadChange">
        </file-upload>
      </template>
      <arco-col class="library_item__carditem">
        <div class="library_item__addmaterial" @click="addLibrary">
          <svg-icon name="addMaterial" size="40"></svg-icon>
        </div>
      </arco-col>
      <arco-empty v-if="!libraryList.length" />
    </arco-row>
  </arco-col>
</template>
<style lang="scss">
@import '@styles/library/libraryItem/index.scss';
</style>
