<script setup>
import { computed, isProxy, onMounted, nextTick, ref, watch } from 'vue';
import { useScene } from '@use/sceneStore.js';
const emit = defineEmits(['uploadWrapClick', 'uploadChange']);
const props = defineProps({
  accept: {
    type: String,
    default: '.jpg, .jpeg, .png'
  },
  info: {
    type: Object,
    default: () => {
      return {
        title: '上传头像',
        des: '支持jpg、jpeg、png格式，大小不超过2M',
        isTexture: false
      };
    }
  }
});
watch(
  () => props.info.value,
  () => {
    renderToCanvas();
  }
);
const info = computed(() => (isProxy(props.info) ? props.info.value : props.info));
const file = computed(() => {
  let url = info.value.value;
  if (url.file && url.file instanceof File) {
    url = info.value.value.url;
  }
  return url;
});
const canRenderCanvas = ref(true);
const clickUpload = e => {
  emit('uploadWrapClick', e);
};
const uploadChange = async (...args) => {
  emit('uploadChange', ...args);
  if (args[1]) {
    switch (args[1].status) {
      case 'error':
      case 'done':
        await renderToCanvas();
        break;

      default:
        break;
    }
  }
};
const uploadImgTexture = ref(null);
const renderToCanvas = async () => {
  await nextTick();
  if (info.value.isTexture) {
    if (!canRenderCanvas.value) return;
    canRenderCanvas.value = false;
    const { threeEngine } = useScene();
    setTimeout(async () => {
      await threeEngine.value.renderToCanvas(info.value.value, uploadImgTexture.value);
      canRenderCanvas.value = true;
    }, 300);
  }
};
onMounted(() => {
  renderToCanvas();
});
</script>

<template>
  <arco-col class="uploadsetting__wrap custom-upload-avatar" @click="clickUpload">
    <arco-col class="uploadsetting__file">
      <arco-col class="uploadsetting__img" :span="21">
        <arco-col class="uploadsetting__imgcol" :span="10">
          <file-upload
            class="uploadsetting__imgupload"
            :accept
            draggable
            :show-file-list="false"
            @change="uploadChange"
          >
            <template #upload-button>
              <canvas
                v-if="info.isTexture"
                ref="uploadImgTexture"
                width="100"
                height="70"
                class="uploadsetting__canvas"
              ></canvas>
              <arco-avatar v-else class="uploadsetting__imgavatar" :size="80" :image-url="file" shape="circle">
              </arco-avatar>
            </template>
          </file-upload>
        </arco-col>
        <arco-col class="uploadsetting__des" :span="14">
          <arco-row class="uploadsetting__text">{{ info.title }}</arco-row>
          <arco-row class="uploadsetting__text">{{ info.des }}</arco-row>
        </arco-col>
      </arco-col>
      <arco-col class="uploadsetting__fileicon" :span="3">
        <icon-right />
      </arco-col>
    </arco-col>
  </arco-col>
</template>

<style lang="scss">
@import '@styles/uploadSetting.scss';
</style>
