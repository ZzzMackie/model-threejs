<script setup>
import SettingItem from '@components/SettingItem.vue';
import { useCameraSetting } from '@use/cameraSetting.js';
const {
  bgChange,
  camera,
  size,
  fovData,
  orthographicCameraData,
  bgData,
  sizeOptions,
  fovChange,
  orthographicCameraChange,
  sizeChange,
  change,
  onDownLoad,
  createScreenshot,
  positionData,
  positionChange,
  maxDistanceData,
  minDistanceData,
  maxPolarAngleData,
  minPolarAngleData,
  maxDistanceChange,
  minDistanceChange,
  maxPolarAngleChange,
  minPolarAngleChange,
  nearData,
  nearChange,
  farData,
  farChange,
  cameraNameData,
  cameraNameChange
} = useCameraSetting();
</script>

<template>
  <arco-col class="camerasetting__wrap">
    <arco-row class="camerasetting__screenshot">
      <arco-row class="camerasetting__setting">
        <p class="camerasetting__text c__font-black">相机组设置</p>
        <SettingItem :info="cameraNameData" @change="cameraNameChange" />
        <p class="camerasetting__text c__font-black">截图设置</p>
        <SettingItem :info="fovData" @change="fovChange" />
        <SettingItem :info="orthographicCameraData" @change="orthographicCameraChange" />
        <SettingItem :info="bgData" @change="bgChange" />
        <arco-col class="camerasetting__imgtype">
          <a-radio-group v-model="camera.screenshotType" type="button" size="large">
            <a-radio value="image/png">PNG</a-radio>
            <a-radio value="image/jpg">JPG</a-radio>
            <a-radio value="image/webp">WEBP</a-radio>
          </a-radio-group>
        </arco-col>
      </arco-row>
      <arco-row class="camerasetting__size">
        <p class="camerasetting__text c__font-black">尺寸设置</p>
        <arco-col class="camerasetting__sizeselect">
          <arco-select
            v-model="size"
            default-value="600x600"
            class="camerasetting__select"
            placeholder="Please select ..."
            allow-create
            @change="sizeChange"
          >
            <arco-option
              v-for="item in sizeOptions"
              :key="item"
              :style="item === 'space' ? 'color: transparent' : ''"
              :disabled="item === 'space'"
              >{{ item }}</arco-option
            >
            >
          </arco-select>
        </arco-col>
        <arco-col class="camerasetting__sizeinput">
          <arco-input-group class="camerasetting__inputgroup">
            <arco-input-number
              v-model="camera.screenshot.width"
              :min="50"
              :max="4096"
              hide-button
              :default-value="600"
              class="camerasetting__input"
              placeholder="width"
              @change="change"
            />
            <svg-icon name="close" size="20px" :disable-hover="true" class="camerasetting__close"></svg-icon>
            <arco-input-number
              v-model="camera.screenshot.height"
              :min="50"
              :max="4096"
              hide-button
              :default-value="600"
              class="camerasetting__input"
              placeholder="height"
              @change="change"
            />
          </arco-input-group>
        </arco-col>
        <arco-col class="camerasetting__image">
          <arco-image
            alt="请先创建截图"
            :src="camera.screenshot.url"
            class="camerasetting__imagecontainer"
            style="
              width: 100%;
              min-width: 250px;
              max-height: 250px;
              overflow: hidden;
              min-height: 250px;
              vertical-align: top;
            "
          >
            <template #extra>
              <div class="camerasetting__actions">
                <span class="camerasetting__action" @click="onDownLoad"><icon-download /></span>
              </div>
            </template>
          </arco-image>
        </arco-col>
        <arco-col class="camerasetting__btn">
          <arco-button class="camerasetting__button" size="large" type="primary" long @click="createScreenshot"
            >创建截图</arco-button
          >
        </arco-col>
      </arco-row>
    </arco-row>
    <arco-row class="camerasetting__position">
      <arco-col class="camerasetting__positioncontent c_scrollbar c_scrollbar__x-none">
        <arco-row class="camerasetting__positionsetting">
          <p class="camerasetting__text c__font-black">相机设置</p>
          <SettingItem :info="positionData" @change="positionChange" />
          <SettingItem :info="nearData" @change="nearChange" />
          <SettingItem :info="farData" @change="farChange" />
        </arco-row>
        <arco-row class="camerasetting__controls">
          <p class="camerasetting__text c__font-black">控制器限制</p>
          <SettingItem :info="maxDistanceData" @change="maxDistanceChange" />
          <SettingItem :info="minDistanceData" @change="minDistanceChange" />
          <SettingItem :info="maxPolarAngleData" @change="maxPolarAngleChange" />
          <SettingItem :info="minPolarAngleData" @change="minPolarAngleChange" />
        </arco-row>
      </arco-col>
    </arco-row>
  </arco-col>
</template>

<style lang="scss">
@import '@styles/panel/cameraSetting/index.scss';
</style>
