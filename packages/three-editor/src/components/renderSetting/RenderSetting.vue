<script setup>
import SettingItem from '@components/SettingItem.vue';
import { useRenderSetting } from '@use/renderSetting.js';
const {
  antialiasData,
  shadowData,
  toneMappingExposureData,
  toneMappingData,
  antialiasChange,
  toneMappingExposureChange,
  toneMappingChange,
  shadowSwitchChange,
  shadowSelectChange,
  projectNameData,
  projectNameChange
} = useRenderSetting();
</script>
<template>
  <arco-col class="rendersetting__wrap c_scrollbar c_scrollbar__x-none">
    <arco-row class="rendersetting__row" align="center">
      <SettingItem :info="projectNameData" @change="projectNameChange" />
    </arco-row>
    <arco-row class="rendersetting__row" align="center">
      <SettingItem :info="antialiasData" @change="antialiasChange" />
    </arco-row>
    <arco-row class="rendersetting__row" align="center">
      <SettingItem :info="shadowData" @switch-change="shadowSwitchChange" @select-change="shadowSelectChange" />
    </arco-row>
    <arco-row class="rendersetting__row rendersetting__toneMapping" align="center">
      <SettingItem :info="toneMappingData" @change="toneMappingChange" />
    </arco-row>
    <arco-row class="rendersetting__row" align="center">
      <SettingItem :info="toneMappingExposureData" @change="toneMappingExposureChange" />
    </arco-row>
  </arco-col>
</template>

<style lang="scss">
@import '@styles/renderSetting/index.scss';
</style>
