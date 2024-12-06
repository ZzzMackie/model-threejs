<script setup>
import { useFps } from '@vueuse/core';
import { useScene } from '@use/sceneStore.js';
import { computed } from 'vue';
import { useSave, useSaveAs } from '@use/save.js';
import { useMessage } from '@use/message.js';
import { useEditorStore } from '@stores/editor.js';
import { useUndoRedo } from '@use/undoRedo.js';
const { name } = useScene();
const fps = useFps();
const fpsClass = computed(() => {
  return fps.value >= 50
    ? 'sceneheader__fps-smooth'
    : 50 > fps.value >= 30
      ? 'sceneheader__fps-slow'
      : 'sceneheader__fps-stuck';
});
const save = () => {
  useSave();
};
const saveAs = () => {
  useSaveAs();
};
const change = val => {
  if (!val) {
    useMessage().info(`场景名不能为空: ${val}`);
    name.value = 'Scene';
    useEditorStore().setSceneName('Scene');
  } else {
    useEditorStore().setSceneName(val);
  }
};
const { hasChanged } = useUndoRedo();
</script>
<template>
  <arco-row class="sceneheader__wrap" align="center">
    <arco-col :span="2" class="sceneheader__col">
      <div>
        fps: <span :class="fpsClass">{{ fps }}</span>
      </div>
    </arco-col>
    <arco-col :span="8" class="sceneheader__col c__font-black">
      <arco-input v-model="name" class="sceneheader__textarea c__font-bold" auto-size allow-clear @change="change" />
    </arco-col>
    <arco-col :span="14" class="sceneheader__col sceneheader__save">
      <!-- <arco-button type="primary" shape="round" class="sceneheader__undo" :disabled="!canUndo" @click="undo"
        >Undo</arco-button
      >
      <arco-button type="primary" shape="round" class="sceneheader__redo" :disabled="!canRedo" @click="redo"
        >Redo</arco-button
      > -->
      <arco-button type="primary" shape="round" class="sceneheader__saveas" @click="saveAs">Save As</arco-button>
      <!-- <arco-button type="primary" shape="round" @click="save">Save</arco-button> -->
      <arco-button type="primary" shape="round" :disabled="!hasChanged" @click="save">Save</arco-button>
    </arco-col>
  </arco-row>
</template>

<style lang="scss">
@import '@styles/sceneHeader/index.scss';
</style>
