<template>
  <div ref="threewrap" class="md_threerender__wrap" draggable="false" style="display: flex; width: 100%; height: 100%">
    <canvas ref="canvasDom" class="md_threerender__canvas" style="width: 100%; height: 100%"></canvas>
  </div>
</template>

<script>
import { ThreeEngine } from '@model/three-core';
export default {
  name: 'ThreeRender',
  props: {
    // 该组件的所有数据结构和字段和模型编辑器的一致
    scene: {
      type: Object, // 数组中存放的是模型编辑器的模型数据对象
      require: true,
      default() {
        return {
          materials: [],
          images: [],
          modelMesh: []
        };
      }
    },
    lightConfig: {
      type: Array, // 对象是模型编辑器的的灯光数据
      default() {
        return [];
      }
    },
    cameraConfig: {
      type: Object, // 相机数据
      default() {
        return {};
      }
    },
    rendererConfig: {
      type: Object, // 渲染选项参数
      default() {
        return {};
      }
    },
    environment: {
      type: Object, // 环境参数  hdr
      default() {
        return {};
      }
    },
    background: {
      type: Object, // 背景
      default() {
        return {};
      }
    },
    orbitControlsConfig: {
      type: Object, // 对象是模型编辑器的控制器数据
      require: true,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      threeRenderInstance: null,
      percentage: 0,
      // 当前渲染的配件模型组
      currentPart: [],
      // 当前渲染的配件模型
      currentModel: [],
      currentLight: []
    };
  },
  async mounted() {
    // eslint-disable-next-line vue/require-explicit-emits
    this.$emit('on-before-render-init');
    await this.updateThreeRender();
    // eslint-disable-next-line vue/require-explicit-emits
    this.$emit('on-after-render-init', this.threeRenderInstance);
    this.initCurrentPart();
    this.initCurrentModel();
    this.initCurrentLight();
  },
  methods: {
    initCurrentLight(_light) {
      const light = _light ?? this.lightConfig;
      if (light.length) {
        this.currentLight = [];
        for (const lightItem of light) {
          this.currentLight.push(lightItem.uuid);
        }
      }
    },
    initCurrentModel(_model) {
      const scene = _model ?? this.scene;
      const model = scene.modelMesh;
      if (model.length) {
        this.currentModel = [];
        for (const modelItem of model) {
          this.currentModel.push(modelItem.uuid);
        }
      }
    },
    initCurrentPart(_part) {
      const scene = _part ?? this.scene;
      const part = scene.modelMesh.filter(group => group.model_type === 2 || scene.model_type === 2);
      if (part.length) {
        this.currentPart = [];
        for (const partItem of part) {
          this.currentPart.push(partItem.uuid);
        }
      }
    },
    updateCamera(camera) {
      this.threeRenderInstance.cameraObjectChange(camera);
    },
    // 渲染灯光
    async renderLight(scene) {
      const lights = scene?.light?.data?.lights ?? this.lightConfig;
      if (scene) {
        for (const light of this.currentLight) {
          this.threeRenderInstance.deleteLight(light);
        }
      }
      for (const light of lights) {
        this.threeRenderInstance.addLight({ lightClass: light.type, lightConfig: light });
      }
    },
    // 渲染hdr
    async renderHdr(scene) {
      if (scene) {
        const originEnvironment = scene.environment.data.environment;
        await this.threeRenderInstance?.setEnvironment?.(originEnvironment);
        await this.threeRenderInstance.updateEnvironmentProp(originEnvironment);
      } else {
        return this.environment && (await this.threeRenderInstance.initSceneHDR(this.environment));
      }
    },
    // 加载多个模型
    async renderModelList(scene) {
      if (scene) {
        for (const partItem of this.currentPart) {
          await this.threeRenderInstance.removeObject3D(partItem);
        }
        for (const modelItem of this.currentModel) {
          await this.threeRenderInstance.removeObject3D(modelItem);
        }
      }
      return await this.threeRenderInstance.loadMeshObject({
        data: {
          materials: scene ? scene.scene.data.materials : this.scene.materials,
          images: scene ? scene.scene.data.images : this.scene.images,
          modelMesh: scene ? scene.scene.data.modelMesh : this.scene.modelMesh
        }
      });
    },
    async initBackground(scene) {
      return (
        this.background &&
        (await this.threeRenderInstance.initBackground(scene ? scene.environment.data.background : this.background))
      );
    },
    // 创建轨道控制器
    async createOrbitControls(scene) {
      if (scene) {
        await this.threeRenderInstance.setOrbitControls(scene.controls.data);
        setTimeout(() => {
          this.updateCamera(scene.camera.data.object);
        });
      } else {
        return this.orbitControlsConfig && (await this.threeRenderInstance.initOrbitControls(this.orbitControlsConfig));
      }
    },
    initThreeEngine() {
      // 创建3d引擎对象
      this.threeRenderInstance = new ThreeEngine({
        renderOptions: { ...this.rendererConfig, canvas: this.$refs.canvasDom },
        cameraConfig: this.cameraConfig
      });
    },
    initThreeEngineApp() {
      // 创建3d引擎对象
      this.threeRenderInstance.initApp({});
    },
    async updateRenderer(scene = void 0) {
      // 创建轨道控制器
      await this.createOrbitControls(scene)
        .then(() => {
          this.emitRenderProgressType(10);
        })
        .catch(() => {
          this.emitRenderProgressType(10);
        });

      this.emitRenderProgressType(10);
      const promiseList = [
        // 渲染灯光
        this.renderLight(scene)
          .then(() => {
            this.emitRenderProgressType(10);
          })
          .catch(() => {
            this.emitRenderProgressType(10);
          }),
        // 初始化背景色
        this.initBackground(scene)
          .then(() => {
            this.emitRenderProgressType(10);
          })
          .catch(() => {
            this.emitRenderProgressType(10);
          }),
        // 渲染hdr
        this.renderHdr(scene)
          .then(() => {
            this.emitRenderProgressType(10);
          })
          .catch(() => {
            this.emitRenderProgressType(10);
          }),
        // 渲染模型列表
        this.renderModelList(scene)
          .then(() => {
            this.emitRenderProgressType(10);
          })
          .catch(() => {
            this.emitRenderProgressType(10);
          })
      ];
      await Promise.allSettled(promiseList);
    },
    // 初始化渲染
    async updateThreeRender(scene) {
      this.emitRenderProgressType(10);
      // 创建3d引擎对象
      !scene && this.initThreeEngine();
      this.emitRenderProgressType(10);
      // 初始化场景
      !scene && this.initThreeEngineApp();
      this.emitRenderProgressType(10);

      await this.updateRenderer(scene);
      this.emitRenderProgressType(10);
      // 监听resize，更新three视图
      !scene && this.watchWrapperResize();
    },
    // 切换整体模型
    async changeBaseModel(sceneModel) {
      try {
        if (sceneModel && this.currentModel.length) {
          this.percentage = 0;
          // eslint-disable-next-line vue/require-explicit-emits
          this.$emit('on-render-progress', this.percentage);
          await this.updateThreeRender(sceneModel);
          this.initCurrentPart(sceneModel.scene.data);
          this.initCurrentModel(sceneModel.scene.data);
          this.initCurrentLight(sceneModel.light.data.lights);
        }
      } catch (error) {
        this.percentage = 100;
      }
    },
    // 更新贴图 需要贴图的材质uuid 跟贴图链接
    async updateMaterialMap({ uuid, value, key = 'map' }) {
      if (uuid) {
        await this.threeRenderInstance?.updateMaterial?.({ uuid, key, value });
      }
    },
    // 根据需要贴在那个组的uuid 去找到组内被设置为合图面片的面片材质
    async updateBaseMap({ groupUUID, value, modelMesh }) {
      const group = modelMesh?.find?.(group => group.uuid === groupUUID);
      const mesh = group?.children?.find?.(mesh => mesh.isCombineMesh);
      if (Array.isArray(mesh?.material)) {
        for (const material of mesh.material) {
          await this.updateMaterialMap?.({ uuid: material, key: 'map', value });
        }
      } else {
        mesh.material && (await this.updateMaterialMap?.({ uuid: mesh.material, key: 'map', value }));
      }
    },
    // 切换配件模型
    async changePartModel(partModel) {
      try {
        this.percentage = 0;
        // eslint-disable-next-line vue/require-explicit-emits
        this.$emit('on-render-progress', this.percentage);
        this.emitRenderProgressType(10);
        for (const partItem of this.currentPart) {
          await this.threeRenderInstance.removeObject3D(partItem);
        }
        this.emitRenderProgressType(30);
        if (partModel && partModel.data) {
          await this.threeRenderInstance.loadMeshObject({
            data: {
              materials: partModel.data.materials,
              images: partModel.data.images,
              modelMesh: partModel.data.modelMesh
            }
          });
          this.emitRenderProgressType(60);
          this.initCurrentPart(partModel.data);
        } else {
          this.currentPart = [];
          this.emitRenderProgressType(60);
        }
      } catch (error) {
        this.percentage = 100;
      }
    },
    // 回到原点
    backToOrigin() {
      this.threeRenderInstance.cameraAnimateReset(this.cameraConfig.position);
    },
    watchWrapperResize() {
      const _this = this;
      const observer = new ResizeObserver(() => {
        // 渲染区域父级节点
        const threeWrap = _this.$refs.threewrap;
        let wrapWidth = threeWrap?.clientWidth;
        let wrapHeight = threeWrap?.clientHeight;
        // canvas渲染区域
        const canvasDom = _this.$refs.canvasDom;
        let canvasWidth = canvasDom?.clientWidth;
        let canvasHeight = canvasDom?.clientHeight;
        // 宽高不同，需要更新视图
        if (wrapWidth !== canvasWidth || wrapHeight !== canvasHeight) {
          _this.threeRenderInstance.resizeRendererAndCamera(wrapWidth, wrapHeight);
          // eslint-disable-next-line vue/require-explicit-emits
          this.$emit('on-render-resize', { wrapWidth, wrapHeight });
        }
      });
      observer.observe(this.$refs.threewrap);
    },
    emitRenderProgressType(percentage) {
      this.percentage += percentage;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
      // eslint-disable-next-line vue/require-explicit-emits
      this.$emit('on-render-progress', this.percentage);
    },
    cameraThree(w = 600, h = 600) {
      return this.threeRenderInstance?.screenshot?.(w, h);
    },
    async exportModelFile(data) {
      return await this.threeRenderInstance?.exportModelFile(data);
    }
  }
};
</script>

<style></style>
