<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { useDropZone } from '@vueuse/core';
import { useCameraSetting } from '@use/cameraSetting.js';
import { useHelperStore } from '@stores/helper.js';
import { useSceneStore } from '@stores/scene.js';
import { usePanelStore } from '@stores/panel.js';
import { useCameraStore } from '@stores/camera.js';
import { useThreeEngineVm } from '@use/useThreeEngineVm';
import { useInitThreeRender, cameraAnimateReset, setAutoRotate, setOrbitControls } from '@use/threeRender';
import { useMessage } from '@use/message.js';
import { useEditorStore } from '@stores/editor.js';
const editorStore = useEditorStore();
const $message = useMessage();
const sceneStore = useSceneStore();
const { createScreenshot } = useCameraSetting();
const helperStore = useHelperStore();
const cameraStore = useCameraStore();
const panelStore = usePanelStore();
const canvasDom = ref(null);
const sceneWrap = ref(null);
const sceneThreeWrap = ref(null);
const viewHelperDom = ref(null);
const threewrapStyle = ref('');
const cameraAspectRatio = ref(null);
const hideCanvasRadius = ref(false);
const blackBg = ref(false);
const percentage = computed(() => {
  return editorStore.percentage;
});
const transformControlsModeOptions = ref([
  {
    value: 'translate',
    name: '位移'
  },
  {
    value: 'rotate',
    name: '旋转'
  },
  {
    value: 'scale',
    name: '缩放'
  }
]);
const option = ref([
  {
    value: 10,
    name: '慢'
  },
  {
    value: 30,
    name: '中'
  },
  {
    value: 60,
    name: '快'
  }
]);
const x = ref();
const y = ref();
const z = ref();

const select = autoRotateSpeed => {
  setOrbitControls({
    autoRotateSpeed
  });
};
const toggleGrid = () => {
  helperStore.toggleHelpers('grid');
};
const helperSelect = () => {
  helperStore.toggleHelpers(
    'Box3Helper, transformControls, DirectionalLightHelper, HemisphereLightHelper, PointLightHelper, RectAreaLightHelper, SpotLightHelper'
  );
};
// 调整相机宽高比
const handleThreeAspectRatio = (reset = false) => {
  if (!reset && panelStore.activeId === 'Camera') {
    const aspectRatio = cameraStore.camera.screenshot.width / cameraStore.camera.screenshot.height;
    cameraAspectRatio.value = aspectRatio;
    const { height: sceneWrapHeight, width: sceneWrapWidth } = sceneWrap.value.getBoundingClientRect();
    let threeWidth = sceneWrapWidth;
    let threeHeight = sceneWrapHeight;
    const sceneThreeWrapAspectRatio = sceneWrapWidth / sceneWrapHeight;
    if (aspectRatio != sceneThreeWrapAspectRatio) {
      if (sceneWrapWidth <= sceneWrapHeight) {
        threeHeight = sceneWrapWidth / aspectRatio;
        if (threeHeight > sceneWrapHeight) {
          threeHeight = sceneWrapHeight;
          threeWidth = threeHeight * aspectRatio;
        }
        threewrapStyle.value = `height:${threeHeight}px;`;
      } else {
        threeWidth = sceneWrapHeight * aspectRatio;
        if (threeWidth > sceneWrapWidth) {
          threeWidth = sceneWrapWidth;
          threeHeight = threeWidth / aspectRatio;
        }
        threewrapStyle.value = `height: ${threeHeight}px;width:${threeWidth}px;`;
      }
    }
    if (threeHeight < sceneWrapHeight || threeWidth < sceneWrapWidth) {
      hideCanvasRadius.value = true;
    } else {
      hideCanvasRadius.value = false;
    }
  } else {
    threewrapStyle.value = '';
  }
};
panelStore.$subscribe((_mutation, state) => {
  if (state.activeId === 'Camera') {
    handleThreeAspectRatio();
    blackBg.value = true;
  } else {
    handleThreeAspectRatio(true);
    blackBg.value = false;
  }
});
cameraStore.$subscribe(async (_mutation, state) => {
  const aspectRatio = state.camera.screenshot.width / state.camera.screenshot.height;
  cameraAspectRatio.value = aspectRatio;
  handleThreeAspectRatio();
});
useThreeEngineVm();
const setTransformControlsMode = value => {
  sceneStore.threeEngine.setTransformControlsMode(value);
};
const onDrop = async files => {
  try {
    if (files) {
      for (const file of files) {
        const fileName = file.name.split('.');
        const fileType = fileName[fileName.length - 1];
        if (['fbx', 'json', 'gbl'].includes(fileType)) {
          await sceneStore.addModelMesh({
            file,
            name: file.name
          });
        } else {
          $message.error(`暂时不支持此类模型文件: ${fileType}`);
        }
      }
    }
  } catch (error) {
    $message.error(error);
  }
};
useDropZone(sceneThreeWrap, {
  onDrop,
  // specify the types of data to be received.
  dataTypes: ['.fbx', '.json', '.gbl']
});
onMounted(async () => {
  await nextTick();
  handleThreeAspectRatio();
  const time = await useInitThreeRender(sceneThreeWrap, canvasDom, viewHelperDom);
  $message.success(`模型加载时间: ${time}ms`);
  sceneStore.threeEngine.renderer__three.on('cameraPositionUpdated', position => {
    x.value = Math.round(position.x);
    y.value = Math.round(position.y);
    z.value = Math.round(position.z);
  });
  sceneStore.threeEngine.on('resizeRendererUpdated', async () => {
    await nextTick();
    // handleThreeAspectRatio();
  });
});
const dragover = event => {
  event.dataTransfer.dropEffect = 'copy';
};
watch(percentage, val => {
  if (val >= 100) {
    setTimeout(() => {
      showProgress.value = false;
    }, 700);
  } else {
    !showProgress.value && (showProgress.value = true);
  }
});

const showProgress = ref(true);
</script>
<template>
  <div id="sceneWrap" ref="sceneWrap" class="scenerender__wrap" :style="blackBg ? 'background-color: #000' : ''">
    <arco-progress
      v-show="showProgress"
      type="line"
      color="#ff7f00"
      class="scenerender__progress"
      :percent="percentage / 100"
      :show-text="false"
    />
    <div ref="sceneThreeWrap" :style="threewrapStyle" class="scenerender__threewrap" @dragover.stop.prevent="dragover">
      <canvas
        ref="canvasDom"
        :class="{ 'scenerender__canvas-hideradius': hideCanvasRadius }"
        class="scenerender__canvas"
      ></canvas>
    </div>
  </div>
  <arco-menu class="scenerender__action" mode="popButton" :tooltip-props="{ position: 'left' }" show-collapse-button>
    <arco-menu-item key="1" @click="cameraAnimateReset">
      <template #icon>
        <icon-refresh></icon-refresh>
      </template>
      恢复相机默认位置
    </arco-menu-item>
    <arco-menu-item key="2" @click="setAutoRotate">
      <template #icon>
        <arco-dropdown position="bl" trigger="click" @select="select">
          <icon-caret-right></icon-caret-right>
          <template #content>
            <arco-doption v-for="item in option" :key="item.name" :value="item.value">{{ item.name }}</arco-doption>
          </template>
        </arco-dropdown>
      </template>
      自动旋转(点击切换旋转速度)
    </arco-menu-item>
    <arco-menu-item key="3" @click="createScreenshot">
      <template #icon>
        <icon-camera />
      </template>
      截图
    </arco-menu-item>

    <arco-menu-item key="4" @click="toggleGrid">
      <template #icon>
        <icon-mosaic />
      </template>
      网格
    </arco-menu-item>
    <arco-menu-item key="5" @click="helperSelect">
      <template #icon>
        <icon-scissor />
      </template>
      辅助线(点击切换辅助线)
    </arco-menu-item>
    <arco-menu-item key="6">
      <template #icon>
        <arco-dropdown position="bl" trigger="click" @select="setTransformControlsMode">
          <icon-tool></icon-tool>
          <template #content>
            <arco-doption v-for="item in transformControlsModeOptions" :key="item.name" :value="item.value">{{
              item.name
            }}</arco-doption>
          </template>
        </arco-dropdown>
      </template>
      切换辅助器手柄模式
    </arco-menu-item>
  </arco-menu>
  <div class="scenerender__position">
    <span>相机位置：</span>
    <span>X__{{ x }}</span>
    <span>Y__{{ y }}</span>
    <span>Z__{{ z }}</span>
  </div>
  <div ref="viewHelperDom" class="scenerender__viewhelper"></div>
</template>

<style lang="scss">
@import '@styles/scenerender/index.scss';
</style>
