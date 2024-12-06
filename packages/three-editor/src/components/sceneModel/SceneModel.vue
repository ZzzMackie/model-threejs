<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useSceneModel } from '@use/sceneModel.js';

const FileUpload = defineAsyncComponent(() => import('../FileUpload.vue'));
const file = ref();
const accept = ref(
  '.fbx, .3dm, .3ds, .amf, .3mf, .dae, .drc, .glb, .gltf, .js, .json, .ifc, .ldr, .mpd, .md2, .obj, .pcd, .ply, .stl, .svg, .ysdz, .vox, .vtk, .vtp, .wrl, .xyz, .zip'
);
const {
  modelMesh,
  selected,
  visible,
  changeSelected,
  modelChange,
  modelError,
  deleteGroup,
  deleteMesh,
  modelMeshChange,
  openSceneLibrary,
  setCombineModelMesh
} = useSceneModel();
</script>

<template>
  <arco-col class="scenemodel__wrap">
    <arco-row class="scenemodel__header" align="center">
      <arco-col :span="12" class="scenemodel__title c__font-black">场景模型（SCENE）</arco-col>
      <arco-col :span="12" class="scenemodel__icon">
        <a-tooltip content="模型管理">
          <icon-code-sandbox class="scenemodel__manage" @click="openSceneLibrary" />
        </a-tooltip>
        <file-upload
          action="/"
          :accept="accept"
          :file-list="file ? [file] : []"
          :show-file-list="false"
          @change="modelChange"
          @error="modelError"
        >
          <template #upload-button>
            <svg-icon name="add"></svg-icon>
          </template>
        </file-upload>
      </arco-col>
    </arco-row>
    <arco-row class="scenemodel__container c_scrollbar c_scrollbar__x-none">
      <template v-for="(child, idx) in modelMesh" :key="child.uuid">
        <arco-collapse
          v-if="child.type === 'Group'"
          class="scenemodel__item"
          :default-active-key="[0]"
          accordion
          :bordered="false"
        >
          <arco-collapse-item :key="idx">
            <template #header>
              <div class="scenemodel__collapseitemheader c__font-bold" @click="changeSelected(child.uuid)">
                <div class="scenemodel__collapseitemname">
                  <arco-input
                    v-model="child.name"
                    class="scenemodel__input-transparent"
                    placeholder="Please enter something"
                    size="large"
                  />
                </div>
                <div class="scenemodel__delete" @click="deleteGroup(idx)">
                  <icon-delete />
                </div>
              </div>
            </template>
            <div>
              <arco-dropdown
                v-for="(model, index) in child.children"
                :key="model.uuid"
                trigger="contextMenu"
                align-point
                :style="{ display: 'block' }"
              >
                <div
                  class="scenemodel__model"
                  :class="{ 'scenemodel__model-active': selected === model.uuid }"
                  @click="changeSelected(model.uuid)"
                >
                  <arco-col :span="16" class="scenemodel__name">
                    <arco-input v-model="model.name" placeholder="Please enter something" size="large" />
                  </arco-col>
                  <arco-col class="scenemodel__collapseicon" :span="8">
                    <file-upload
                      action="/"
                      :accept="accept"
                      :file-list="file ? [file] : []"
                      :show-file-list="false"
                      @change="modelMeshChange"
                    >
                      <template #upload-button>
                        <icon-swap class="scenemodel__swap" />
                      </template>
                    </file-upload>
                    <svg-icon v-if="model.visible" name="visible" size="16" @click="visible(idx, index)"></svg-icon>
                    <svg-icon v-else name="hide" size="16" @click="visible(idx, index)"></svg-icon>
                    <div class="scenemodel__delete" @click="deleteMesh(model.uuid)">
                      <icon-delete />
                    </div>
                  </arco-col>
                </div>
                <template #content>
                  <arco-doption @click="setCombineModelMesh(child.uuid, model.uuid)"
                    >设为合图模型面片（组内只能有一个）</arco-doption
                  >
                </template>
              </arco-dropdown>
            </div>
          </arco-collapse-item>
        </arco-collapse>
        <div
          v-else
          class="scenemodel__item scenemodel__model"
          :class="{ 'scenemodel__model-active': selected === child.uuid }"
          @click="changeSelected(child.uuid)"
        >
          <arco-col :span="16" class="scenemodel__name">
            <arco-input v-model="child.name" placeholder="Please enter something" size="large" />
          </arco-col>
          <arco-col class="scenemodel__collapseicon" :span="8">
            <file-upload
              action="/"
              :accept="accept"
              :file-list="file ? [file] : []"
              :show-file-list="false"
              @change="modelMeshChange"
            >
              <template #upload-button>
                <icon-swap class="scenemodel__swap" />
              </template>
            </file-upload>
            <svg-icon v-if="child.visible" name="visible" size="16" @click="visible(idx)"></svg-icon>
            <svg-icon v-else name="hide" size="16" @click="visible(idx)"></svg-icon>
            <div class="scenemodel__delete" @click="deleteMesh(model.uuid)">
              <icon-delete />
            </div>
          </arco-col>
        </div>
      </template>
    </arco-row>
  </arco-col>
</template>

<style lang="scss" scoped>
@import '@styles/sceneModel/index.scss';
</style>
