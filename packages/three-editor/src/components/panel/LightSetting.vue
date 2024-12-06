<script setup>
import { useLightSetting } from '@use/lightSetting.js';
import { createDrawer } from '@feature/drawer/index.js';
import { defineAsyncComponent } from 'vue';
const HdrLibrary = defineAsyncComponent(() => import('@components/library/HdrLibrary.vue'));
const openHdrLibrary = e => {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'INPUT') return;
  createDrawer({
    key: 'HdrLibrary',
    popupContainer: '#sceneWrap',
    drawerOptions: {
      props: {
        title: 'HDR库',
        width: 400,
        footer: false
      }
    },
    slotVnodeFn: h => {
      return {
        content: () => h(HdrLibrary)
      };
    }
  });
};
const {
  environmentIntensityData,
  environmentIntensityChange,
  mappingTypeData,
  mappingTypeChange,
  fileImageData,
  lights,
  lightsData,
  addLight,
  deleteLight,
  lightType,
  hdrSuccess,
  changeSelectLight,
  environmentRotationXData,
  environmentRotationXChange,
  environmentRotationYData,
  environmentRotationYChange,
  environmentRotationZData,
  environmentRotationZChange,
  environmentNameData,
  environmentNameChange,
  lightsNameData,
  lightsNameChange,
  downloadFile
} = useLightSetting();
</script>

<template>
  <arco-col class="lightsetting__wrap">
    <arco-row class="lightsetting__hdr">
      <p class="lightsetting__text c__font-black">HDR</p>
      <SettingItem :info="environmentNameData" @change="environmentNameChange" />
      <arco-dropdown trigger="contextMenu" align-point :style="{ display: 'block' }">
        <upload-setting
          accept=".hdr"
          :info="fileImageData"
          @upload-wrap-click="openHdrLibrary"
          @upload-change="hdrSuccess"
        ></upload-setting>
        <!-- <SettingItem :info="fileImageData" accept=".hdr" @success="hdrSuccess" @error="hdrSuccess" /> -->
        <template #content>
          <arco-doption @click="downloadFile">下载</arco-doption>
        </template>
      </arco-dropdown>
      <SettingItem :info="environmentRotationXData" @change="environmentRotationXChange" />
      <SettingItem :info="environmentRotationYData" @change="environmentRotationYChange" />
      <SettingItem :info="environmentRotationZData" @change="environmentRotationZChange" />
      <SettingItem :info="environmentIntensityData" @change="environmentIntensityChange" />
      <SettingItem :info="mappingTypeData" @change="mappingTypeChange" />
    </arco-row>
    <arco-row class="lightsetting__light">
      <arco-col class="lightsetting__add">
        <arco-col :span="12" class="lightsetting__title c__font-black">灯光</arco-col>
        <arco-col :span="12" class="lightsetting__icon">
          <arco-dropdown @select="addLight">
            <svg-icon name="add"></svg-icon>
            <template #content>
              <arco-doption v-for="option in lightType" :key="option.value" :value="option">{{
                option.name
              }}</arco-doption>
            </template>
          </arco-dropdown>
        </arco-col>
      </arco-col>
      <arco-col class="lightsetting__lightparams c_scrollbar c_scrollbar__x-none">
        <SettingItem :info="lightsNameData" @change="lightsNameChange" />
        <arco-collapse accordion :bordered="false" @change="changeSelectLight">
          <div v-for="(light, idx) in lights" :key="light.uuid">
            <arco-collapse-item :key="idx">
              <template #header>
                <div class="lightsetting__collapseitemheader c__font-bold">
                  <span>{{ light.name }}</span>
                  <svg-icon name="close" @click="deleteLight(idx)"></svg-icon>
                </div>
              </template>
              <SettingItem
                v-for="(lightItem, prop) in lightsData"
                :key="prop"
                :info="lightItem.data"
                @change="lightItem.change"
              />
            </arco-collapse-item>
          </div>
        </arco-collapse>
      </arco-col>
    </arco-row>
  </arco-col>
</template>

<style lang="scss">
@import '@styles/panel/lightSetting/index.scss';
</style>
