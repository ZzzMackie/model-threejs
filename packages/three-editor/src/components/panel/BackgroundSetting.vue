<!-- eslint-disable no-case-declarations -->
<script setup>
import { computed, onActivated, onDeactivated, ref, defineAsyncComponent, nextTick, onMounted, watch } from 'vue';
import { useScene } from '@use/sceneStore.js';
import { useEnvironmentStore } from '@stores/environment.js';
import { useEnvironment } from '@use/environmentStore.js';
const FileUpload = defineAsyncComponent(() => import('../FileUpload.vue'));
const { background } = useEnvironment();
const environmentStore = useEnvironmentStore();
const isColor = computed(() => background.value.type === 'color');
const file = computed(() => {
  return {
    path: background.value.path
  };
});
const backgroundRotationXData = computed(() => {
  return {
    label: '旋转X轴',
    type: 'slider',
    value: background.value.backgroundRotation?.['x'],
    max: 360,
    min: 0,
    step: 1,
    showInput: true
  };
});
const backgroundRotationXChange = value => {
  const position = {
    x: background.value.backgroundRotation?.['x'],
    y: background.value.backgroundRotation?.['y'],
    z: background.value.backgroundRotation?.['z']
  };
  position.x = value;
  backgroundChange('backgroundRotation', position);
};
const backgroundRotationYData = computed(() => {
  return {
    label: '旋转Y轴',
    type: 'slider',
    value: background.value.backgroundRotation?.['y'],
    max: 360,
    min: 0,
    step: 1,
    showInput: true
  };
});
const backgroundRotationYChange = value => {
  const position = {
    x: background.value.backgroundRotation?.['x'],
    y: background.value.backgroundRotation?.['y'],
    z: background.value.backgroundRotation?.['z']
  };
  position.y = value;
  backgroundChange('backgroundRotation', position);
};
const backgroundRotationZData = computed(() => {
  return {
    label: '旋转Z轴',
    type: 'slider',
    value: background.value.backgroundRotation?.['z'],
    max: 360,
    min: 0,
    step: 1,
    showInput: true
  };
});
const backgroundRotationZChange = value => {
  const position = {
    x: background.value.backgroundRotation?.['x'],
    y: background.value.backgroundRotation?.['y'],
    z: background.value.backgroundRotation?.['z']
  };
  position.z = value;
  backgroundChange('backgroundRotation', position);
};
const backgroundIntensityData = computed(() => {
  return {
    label: '强度',
    value: background.value.backgroundIntensity,
    type: 'slider',
    max: 15,
    min: 0,
    step: 0.05,
    showInput: true
  };
});
const backgroundIntensityChange = val => {
  backgroundChange('backgroundIntensity', val);
};
const backgroundBlurrinessData = computed(() => {
  return {
    label: '模糊度',
    value: background.value.backgroundBlurriness,
    type: 'slider',
    max: 1,
    min: 0,
    step: 0.05,
    showInput: true
  };
});
const backgroundBlurrinessChange = val => {
  backgroundChange('backgroundBlurriness', val);
};
const showPreview = ref(false);
const uploadImgTexture = ref(null);
const success = (_, currentFile, value) => {
  const _file = { ...currentFile };
  switch (currentFile.status) {
    case 'error':
    case 'done':
      _file.url = value;
      const fileName = _file.name.split('.');
      const fileType = fileName[fileName.length - 1];
      environmentStore.setBackground({
        texture: _file,
        textureType: fileType
      });
      file.value.path = value;
      break;

    default:
      break;
  }
};
const backgroundChange = (key, val) => {
  environmentStore.updateBackgroundProp({
    [key]: val
  });
};
const change = val => {
  environmentStore.setBackground({
    color: val
  });
};
const typeChange = val => {
  environmentStore.setBackground({
    type: val
  });
};
const isHdr = computed(() => {
  return background.value.textureType === 'hdr';
});
const renderToCanvas = async () => {
  await nextTick();
  const { threeEngine } = useScene();
  setTimeout(() => {
    threeEngine.value.renderToCanvas(background.value.texture, uploadImgTexture.value);
  }, 300);
};
watch(isColor, newVal => {
  !newVal && isHdr.value && renderToCanvas();
});
onActivated(async () => {
  showPreview.value = true;
});
onDeactivated(async () => {
  showPreview.value = false;
});
onMounted(async () => {
  !isColor.value && isHdr.value && renderToCanvas();
});
</script>

<template>
  <arco-col class="backgroundsetting__wrap">
    <arco-row>
      <span class="c__font-black">背景</span>
    </arco-row>
    <arco-row class="backgroundsetting__tag">
      <arco-radio-group v-model="background.type" class="backgroundsetting__group" type="button" @change="typeChange">
        <arco-radio class="backgroundsetting__radio" value="color">
          <svg-icon name="color" size="20"></svg-icon>
        </arco-radio>
        <arco-radio class="backgroundsetting__radio" value="texture">
          <svg-icon name="upload" size="20"></svg-icon
        ></arco-radio>
      </arco-radio-group>
    </arco-row>
    <arco-row v-if="isColor">
      <arco-color-picker
        v-if="showPreview"
        :model-value="background.color"
        show-history
        format="hex"
        size="large"
        disabled-alpha
        hide-trigger
        show-preset
        :preset-colors="['#FFFFFF', '#F8F8F8', '#e0e0df']"
        @change="change"
      ></arco-color-picker>
    </arco-row>
    <arco-row v-else>
      <file-upload action="/" :show-file-list="false" draggable accept=".hdr, .jpg, .jpeg, .png" @change="success">
        <template #upload-button>
          <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`">
            <div
              v-if="file && file.path"
              class="backgroundsetting__upload arco-upload-list-picture custom-upload-avatar"
            >
              <img v-show="!isHdr" :src="file.path" />
              <canvas v-show="isHdr" ref="uploadImgTexture" class="backgroundsetting__canvas"></canvas>
              <div class="arco-upload-list-picture-mask backgroundsetting__mask">
                <IconEdit class="backgroundsetting__edit" />
              </div>
              <arco-progress
                v-if="file.status === 'uploading' && file.percent < 100"
                :percent="file.percent"
                type="circle"
                size="mini"
                :style="{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translateX(-50%) translateY(-50%)'
                }"
              />
            </div>
            <div v-else class="arco-upload-picture-card backgroundsetting__upload">
              <div class="arco-upload-picture-card-text">
                <svg-icon name="upload" size="50"></svg-icon>
                <div style="margin-top: 10px; font-weight: 600">
                  <p>将您的图片拖到此处或者点击</p>
                  <p class="backgroundsetting__des">支持JPG、PNG</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </file-upload>
      <template v-if="isHdr">
        <SettingItem :info="backgroundRotationXData" @change="backgroundRotationXChange" />
        <SettingItem :info="backgroundRotationYData" @change="backgroundRotationYChange" />
        <SettingItem :info="backgroundRotationZData" @change="backgroundRotationZChange" />
      </template>
      <SettingItem :info="backgroundIntensityData" @change="backgroundIntensityChange" />
      <SettingItem :info="backgroundBlurrinessData" @change="backgroundBlurrinessChange" />
    </arco-row>
  </arco-col>
</template>

<style lang="scss" scoped>
@import '@styles/panel/backgroundSetting/index.scss';
</style>
