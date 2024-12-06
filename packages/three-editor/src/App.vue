<script setup>
import { ref } from 'vue';
import SceneRender from '@components/sceneRender/SceneRender.vue';
import SceneHeader from '@components/sceneHeader/SceneHeader.vue';
import SelectNav from '@components/selectNav/SelectNav.vue';
import RenderMain from '@components/renderSetting/RenderMain.vue';
import PanelMain from '@components/panel/PanelMain.vue';
import SceneModel from '@components/sceneModel/SceneModel.vue';
import ModelSetting from '@components/modelSetting/ModelSetting.vue';
import { useEditor } from '@use/useEditorStore.js';
const collapsedLeft = ref(false);
const collapsedRight = ref(false);
const collapsedHeader = ref(false);
const collapsedModel = ref(false);
const { editorLoading } = useEditor();
const onCollapse = () => {
  collapsedLeft.value = !collapsedLeft.value;
};
const onCollapseRight = () => {
  collapsedRight.value = !collapsedRight.value;
};
const onCollapseHeader = () => {
  collapsedHeader.value = !collapsedHeader.value;
};
const onCollapseModel = () => {
  collapsedModel.value = !collapsedModel.value;
};
</script>

<template>
  <arco-spin class="app__spin" :size="32" :loading="editorLoading">
    <div class="app__mask"></div>
  </arco-spin>
  <div class="app__wrap c__font-medium" :class="{ 'app__wrap-blur': editorLoading }">
    <div class="app__content">
      <arco-layout class="app__maincontent">
        <arco-layout-sider class="app__sider" :width="collapsedLeft ? 0 : 350">
          <arco-col class="app__sidercol">
            <arco-row class="app__siderrow app__render">
              <RenderMain />
            </arco-row>
            <arco-row
              class="app__siderrow app__model app__collapseditem"
              :class="{ 'app__collapseditem-slide': collapsedModel }"
            >
              <ModelSetting v-if="!collapsedModel"></ModelSetting>
            </arco-row>
            <arco-button class="app__collapsedmodel" shape="round" @click="onCollapseModel">
              <IconCaretDown v-if="collapsedModel" />
              <IconCaretUp v-else />
            </arco-button>
            <arco-row class="app__siderrow app__scene"> <SceneModel></SceneModel> </arco-row>
          </arco-col>
        </arco-layout-sider>
        <arco-layout-content class="app__three">
          <arco-button class="app__collapsed app__collapsed-left" shape="round" @click="onCollapse">
            <IconCaretRight v-if="collapsedLeft" />
            <IconCaretLeft v-else />
          </arco-button>
          <arco-col class="app__sidercol">
            <arco-row
              class="app__siderrow app__threeheader"
              :style="collapsedHeader ? 'height:0;padding-top: 0;padding-bottom: 0;' : ''"
            >
              <SceneHeader />
            </arco-row>
            <arco-row class="app__siderrow app__threecontainer">
              <arco-button class="app__collapsedheader app__collapsed-center" shape="round" @click="onCollapseHeader">
                <IconCaretDown v-if="collapsedHeader" />
                <IconCaretUp v-else />
              </arco-button>
              <arco-row class="app__scenerender">
                <SceneRender />
              </arco-row>
            </arco-row>
          </arco-col>
          <arco-button class="app__collapsed app__collapsed-right" shape="round" @click="onCollapseRight">
            <IconCaretLeft v-if="collapsedRight" />
            <IconCaretRight v-else />
          </arco-button>
        </arco-layout-content>
        <arco-layout-sider class="app__sider" :width="collapsedRight ? 0 : 350">
          <arco-col class="app__sidercol">
            <arco-row class="app__siderrow app__type">
              <SelectNav />
            </arco-row>
            <arco-row class="app__siderrow app__panel">
              <PanelMain />
              <!-- <PanelMain></PanelMain> -->
            </arco-row>
          </arco-col>
        </arco-layout-sider>
      </arco-layout>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@styles/app.scss';
</style>
