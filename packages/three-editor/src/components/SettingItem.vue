<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { computed, ref, isProxy, onMounted, nextTick, defineAsyncComponent } from 'vue';
import { ThreeColor } from '@packages/threeModel-core/main.js';
import { useScene } from '@use/sceneStore.js';
import { useDownloadFile } from '@use/utils';
const FileUpload = defineAsyncComponent(() => import('./FileUpload.vue'));
const emit = defineEmits([
  'change',
  'selectChange',
  'switchChange',
  'success',
  'progress',
  'inputChange',
  'delete',
  'error'
]);
const props = defineProps({
  info: {
    type: Object,
    required: true,
    default() {
      return {};
    }
  },
  labelSpan: {
    type: Number,
    default: 6
  },
  tooltip: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'lt'
  },
  accept: {
    type: String,
    default: '.jpg, .jpeg, .png'
  }
});
const imgTexture = ref(null);
const uploadImgTexture = ref(null);
const info = computed(() => (isProxy(props.info) ? props.info.value : props.info));
const isTextInput = computed(() => info.value?.type?.includes?.('textInput'));
const isSlider = computed(() => info.value?.type?.includes?.('slider'));
const isSwitch = computed(() => info.value?.type?.includes?.('switch'));
const isSelect = computed(() => info.value?.type?.includes?.('select'));
const isPosition = computed(() => info.value?.type?.includes?.('position'));
const isInputNumber = computed(() => info.value?.type?.includes?.('inputNumber'));
const isFileImage = computed(() => info.value?.type?.includes?.('fileImage'));
const isColor = computed(() => info.value?.type?.includes?.('color'));
const isSelectSwitch = computed(() => info.value?.type?.includes?.('switch') && info.value?.type?.includes?.('select'));
const isUpload = computed(() => info.value?.type?.includes?.('upload'));

const componentSpan = computed(() => (isInputNumber.value ? 10 : info.value.label ? 24 - props.labelSpan : 24));
const switchVal = ref();
const switchValue = computed({
  // getter
  get() {
    return info.value.value !== undefined ? info.value.value : info.value.switchValue;
  },
  // setter
  set(newValue) {
    switchVal.value = newValue;
  }
});
const selectVal = ref();
const selectValue = computed({
  // getter
  get() {
    return info.value.value !== undefined ? info.value.value : info.value.selectValue;
  },
  // setter
  set(newValue) {
    selectVal.value = newValue;
  }
});
const sliderVal = ref();
const sliderValue = computed({
  // getter
  get() {
    return info.value.value !== undefined ? info.value.value : info.value.sliderValue;
  },
  // setter
  set(newValue) {
    sliderVal.value = newValue;
    emit('change', newValue);
  }
});
const colorVal = ref(`#${new ThreeColor(info.value.value).getHexString()}`);
const colorValue = computed({
  // getter
  get() {
    return `#${new ThreeColor(info.value.value).getHexString()}`;
  },
  // setter
  set(newValue) {
    colorVal.value = newValue;
    emit('change', newValue);
  }
});
const modelValue = computed({
  // getter
  get() {
    return info.value.value;
  },
  // setter
  set(newValue) {
    emit('change', newValue);
  }
});
const x = ref(info.value.xValue);
const y = ref(info.value.yValue);
const z = ref(info.value.zValue);
const xValue = computed({
  // getter
  get() {
    return info.value.xValue;
  },
  // setter
  set(newValue) {
    x.value = newValue;
  }
});
const zValue = computed({
  // getter
  get() {
    return info.value.zValue;
  },
  // setter
  set(newValue) {
    z.value = newValue;
  }
});
const yValue = computed({
  // getter
  get() {
    return info.value.yValue;
  },
  // setter
  set(newValue) {
    y.value = newValue;
  }
});
const componentClass = computed(() => `settingitem__${info.value.type}`);
const selectChange = val => {
  emit('selectChange', val);
  emit('change', val);
};
const switchChange = val => {
  emit('switchChange', val);
  emit('change', val);
};
const xChange = val => {
  emit('change', { value: val, type: 'x' });
};
const yChange = val => {
  emit('change', { value: val, type: 'y' });
};
const zChange = val => {
  emit('change', { value: val, type: 'z' });
};
const renderToCanvas = async () => {
  await nextTick();
  if ((isFileImage.value || isUpload.value) && info.value.texture) {
    const { threeEngine } = useScene();
    setTimeout(() => {
      threeEngine.value.renderToCanvas(info.value.value, isUpload.value ? uploadImgTexture.value : imgTexture.value);
    }, 300);
  }
};
const uploadFile = ref();
const file = computed({
  // getter
  get() {
    let url = info.value.value;
    if (url.file && url.file instanceof File) {
      return info.value.value;
    }
    return { url };
  },
  // setter
  async set(newValue) {
    uploadFile.value = newValue;
    renderToCanvas();
  }
});
const inputXValue = computed({
  // getter
  get() {
    return info.value.inputValue;
  },
  // setter
  set(newValue) {
    x.value = newValue;
  }
});
const inputYValue = computed({
  // getter
  get() {
    return info.value.input2Value;
  },
  // setter
  set(newValue) {
    y.value = newValue;
  }
});
const onChange = (_, currentFile) => {
  let url = URL.createObjectURL(currentFile.file);
  const file = {
    ...currentFile,
    url
  };
  emit('change', { _, currentFile: file, value: file });
};
const success = currentFile => {
  let url = URL.createObjectURL(currentFile.file);
  if (currentFile.response.data) {
    url = currentFile.response.data.resource_url;
    file.value = {
      ...currentFile,
      url
    };
  } else {
    file.value = {
      ...currentFile,
      url: URL.createObjectURL(currentFile.file)
    };
  }
  emit('success', { currentFile, value: url });
};
const onProgress = currentFile => {
  emit('progress', { currentFile, value: URL.createObjectURL(currentFile.file) });
};
const onError = currentFile => {
  file.value = {
    ...currentFile,
    url: URL.createObjectURL(currentFile.file)
  };
  emit('error', { currentFile, value: URL.createObjectURL(currentFile.file) });
};
const inputXChange = value => {
  emit('inputChange', { value, type: 'x' });
};
const inputYChange = value => {
  emit('inputChange', { value, type: 'y' });
};
const deleteFile = e => {
  emit('delete', e);
};
const downloadFile = () => {
  const MathId = Math.random() * 1000;
  useDownloadFile({
    name: file.value.file ? file.value.file.name : `download_${MathId}`,
    path: file.value.url,
    content: file.value.url
  });
};
onMounted(async () => {
  renderToCanvas();
});
</script>

<template>
  <a-tooltip :content="tooltip" :class="!tooltip ? 'settingitem__tooltip-hide' : ''" :position="position" mini>
    <arco-col v-if="!isFileImage" class="settingitem__item">
      <arco-col v-if="info.label" class="settingitem__label c__font-bold" :span="isInputNumber ? 14 : labelSpan">
        {{ info.label }}
      </arco-col>
      <arco-col class="settingitem__comp" :class="componentClass" :span="componentSpan">
        <arco-slider
          v-if="isSlider"
          v-model="sliderValue"
          class="settingitem__slider"
          :max="info.max || 999999"
          :min="info.min || 0"
          :step="info.step"
          :show-input="info.showInput"
        />
        <template v-else-if="isSwitch || isSelect">
          <arco-col v-if="isSelect" class="settingitem__selectswitch" :span="isSelectSwitch ? 20 : 24">
            <arco-select
              v-model="selectValue"
              :bordered="!!info.bordered"
              :placeholder="info.placeholder || 'Please select ...'"
              :allow-search="info.allowSearch"
              @change="selectChange"
            >
              <arco-option v-for="item in info.options" :key="item.label" :value="item.value">{{
                item.label
              }}</arco-option>
            </arco-select>
          </arco-col>
          <arco-col v-if="isSwitch" class="settingitem__selectswitch" :span="isSelectSwitch ? 4 : 24">
            <arco-switch v-model="switchValue" @change="switchChange" />
          </arco-col>
        </template>
        <template v-else-if="isPosition">
          <arco-col class="settingitem__selectposition" :span="7">
            <arco-input-number
              v-model="xValue"
              placeholder="Please enter something"
              size="large"
              hide-button
              @change="xChange"
            ></arco-input-number>
          </arco-col>
          <arco-col class="settingitem__selectposition" :span="7">
            <arco-input-number
              v-model="yValue"
              placeholder="Please enter something"
              size="large"
              hide-button
              @change="yChange"
            ></arco-input-number>
          </arco-col>
          <arco-col class="settingitem__selectposition" :span="7">
            <arco-input-number
              v-model="zValue"
              placeholder="Please enter something"
              size="large"
              hide-button
              @change="zChange"
            ></arco-input-number>
          </arco-col>
        </template>
        <arco-input-number
          v-else-if="isInputNumber"
          v-model="modelValue"
          :max="info.max || Infinity"
          :min="info.min || -Infinity"
          placeholder="Please enter something"
          size="large"
          hide-button
        ></arco-input-number>
        <template v-else-if="isColor">
          <arco-color-picker :key="info.key" v-model="colorValue" format="hex" disabled-alpha></arco-color-picker>
        </template>
        <template v-else-if="isUpload">
          <arco-col class="settingitem__uploadcol" :span="info.showInput ? 6 : 12">
            <arco-dropdown trigger="contextMenu" align-point :style="{ display: 'block' }">
              <file-upload
                action="/"
                draggable
                :show-file-list="false"
                :accept="accept"
                @success="success"
                @progress="onProgress"
                @error="onError"
                @change="onChange"
              >
                <template #upload-button>
                  <div
                    :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`"
                  >
                    <div
                      v-if="file && file.url"
                      class="settingitem__uploadavatar arco-upload-list-picture custom-upload-avatar"
                    >
                      <img v-show="!info.texture" :src="file.url" />
                      <canvas v-show="info.texture" ref="uploadImgTexture" class="settingitem__canvas"></canvas>
                      <div class="arco-upload-list-picture-mask settingitem__mask">
                        <IconEdit class="settingitem__edit" />
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
                    <div v-else class="arco-upload-picture-card settingitem__uploadimg">
                      <div class="arco-upload-picture-card-text">
                        <svg-icon name="upload" size="14"></svg-icon>
                      </div>
                    </div>
                  </div>
                </template>
              </file-upload>
              <template #content>
                <arco-doption @click="downloadFile">下载</arco-doption>
              </template>
            </arco-dropdown>
          </arco-col>
          <arco-col v-if="info.showInput" class="settingitem__uploadinput" :span="14">
            <arco-col :span="info.input2Value != undefined ? 11 : 24">
              <arco-input-number
                v-model="inputXValue"
                :max="info.max || Infinity"
                :min="info.min || -Infinity"
                placeholder="Please enter something"
                size="large"
                hide-button
                @change="inputXChange"
              ></arco-input-number>
            </arco-col>
            <arco-col v-if="info.input2Value != undefined" class="settingitem__uploadinputy" :span="11">
              <arco-input-number
                v-model="inputYValue"
                :max="info.max || Infinity"
                :min="info.min || -Infinity"
                placeholder="Please enter something"
                size="large"
                hide-button
                @change="inputYChange"
              ></arco-input-number>
            </arco-col>
          </arco-col>
          <arco-col class="settingitem__uploaddelete" :span="info.showInput ? 3 : 12" @click="deleteFile">
            <icon-delete class="settingitem__delete" />
          </arco-col>
        </template>
        <arco-input v-else-if="isTextInput" v-model="modelValue" placeholder="Please enter something" allow-clear />
      </arco-col>
    </arco-col>
    <file-upload
      v-else
      action="/"
      draggable
      :show-file-list="false"
      :accept="accept"
      @change="onChange"
      @success="success"
      @progress="onProgress"
      @error="onError"
    >
      <template #upload-button>
        <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`">
          <div class="settingitem__uploadavatar settingitem__uploadfile arco-upload-list-picture custom-upload-avatar">
            <arco-col class="settingitem__file settingitem__item">
              <arco-col class="settingitem__img" :span="20">
                <arco-col class="settingitem__imgcol" :span="10">
                  <arco-avatar v-show="!info.texture" :size="80" :image-url="file.url" shape="circle"> </arco-avatar>
                  <canvas
                    v-show="info.texture"
                    ref="imgTexture"
                    class="settingitem__canvas"
                    width="100"
                    height="70"
                  ></canvas>
                </arco-col>
                <arco-col class="settingitem__des" :span="14">
                  <arco-row>{{ info.title }}</arco-row>
                  <arco-row>{{ info.des }}</arco-row>
                </arco-col>
              </arco-col>
              <arco-col class="settingitem__icon" :span="4">
                <icon-right />
              </arco-col>
            </arco-col>
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
        </div>
      </template>
    </file-upload>
  </a-tooltip>
</template>

<style lang="scss" scoped>
@import '@styles/settingItem.scss';
</style>
