<script setup>
import { computed } from 'vue';
import { useEditorStore } from '@stores/editor.js';
import RenderSetting from './RenderSetting.vue';
import SceneToggle from './SceneToggle.vue';
const tabs = {
  SceneToggle,
  RenderSetting
};
const editorStore = useEditorStore();
const componentId = computed(() => {
  return `${editorStore.renderTriggerId}`;
});
const renderTriggerIdChange = val => {
  editorStore.setRenderTriggerId(val);
};
</script>

<template>
  <arco-col class="rendermain__wrap">
    <arco-row class="rendermain__tag">
      <arco-radio-group
        v-model="editorStore.renderTriggerId"
        class="rendermain__group c__font-black"
        type="button"
        @change="renderTriggerIdChange"
      >
        <arco-radio class="rendermain__radio" value="RenderSetting">
          <span>渲染设置</span>
        </arco-radio>
        <arco-radio class="rendermain__radio" value="SceneToggle">
          <span>场景切换</span>
        </arco-radio>
      </arco-radio-group>
    </arco-row>
    <keep-alive>
      <component :is="tabs[componentId]"></component>
    </keep-alive>
  </arco-col>
</template>

<style lang="scss" scoped>
@import '@styles/renderMain/index.scss';
</style>
