<script setup>
import { useModelSetting } from '@use/modelSetting.js';
const { data, translateChange, scaleChange, rotationChange, currentModel, orderChange } = useModelSetting();
</script>

<template>
  <arco-col class="modelsetting__wrap">
    <arco-row class="modelsetting__header" align="center">
      <arco-col class="modelsetting__title c__font-black">模型设置（MODEL）</arco-col>
    </arco-row>
    <template v-if="currentModel.type">
      <arco-row class="modelsetting__position" align="center">
        <arco-col class="modelsetting__title">
          <SettingItem :info="data.translate" @change="translateChange" />
        </arco-col>
      </arco-row>

      <arco-row class="modelsetting__rotation" align="center">
        <arco-col class="modelsetting__title"> <SettingItem :info="data.rotation" @change="rotationChange" /></arco-col>
      </arco-row>

      <arco-row class="modelsetting_scale" align="center">
        <arco-col class="modelsetting__title"> <SettingItem :info="data.scale" @change="scaleChange" /></arco-col>
      </arco-row>
      <arco-row class="modelsetting_order" align="center">
        <arco-col class="modelsetting__title">
          <SettingItem :info="data.order" @change="orderChange" />
        </arco-col>
      </arco-row>
    </template>
  </arco-col>
</template>

<style lang="scss" scoped>
@import '@styles/modelSetting/index.scss';
</style>
