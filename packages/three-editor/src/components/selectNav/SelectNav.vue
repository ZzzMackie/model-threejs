<script setup>
import { usePanelStore } from '@stores/panel.js';
import { storeToRefs } from 'pinia';
const panel = usePanelStore();
const { activeId } = storeToRefs(panel);
const panelList = [
  {
    id: 'Materials',
    name: 'materials-1'
  },
  {
    id: 'Background',
    name: 'background-1'
  },
  {
    id: 'Light',
    name: 'light'
  },
  {
    id: 'Camera',
    name: 'camera'
  }
];
</script>
<template>
  <arco-row class="selectnav__wrap" align="center">
    <arco-col
      v-for="item in panelList"
      :key="item.id"
      class="selectnav__col"
      :class="{ 'selectnav__col-active': item.id === activeId }"
      :span="6"
    >
      <svg-icon :name="item.name" @click="panel.changePanel(item.id)"></svg-icon>
    </arco-col>
  </arco-row>
</template>

<style lang="scss">
@import '@styles/selectNav/index.scss';
</style>
