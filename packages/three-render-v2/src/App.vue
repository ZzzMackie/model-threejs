<template>
  <div
    id="app"
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
    "
  >
    <div
      :class="{ 'progress-op': !loading }"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.5);
        filter: blur(4px);
      "
    ></div>
    <div
      :class="{ 'progress-op': !loading }"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <el-progress type="circle" :percentage="percentage"></el-progress>
    </div>
    <div style="display: flex; align-items: center">
      <el-select v-model="model" filterable placeholder="请选择">
        <el-option
          v-for="item in modelOptions"
          :key="item.scene.uuid"
          :label="item.scene.name"
          :value="item.scene.uuid"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="changeBaseModel">切换模型</el-button>
    </div>
    <div style="display: flex; align-items: center">
      <el-select v-model="part" filterable placeholder="请选择">
        <el-option v-for="item in options" :key="item.scene.uuid" :label="item.scene.name" :value="item.scene.uuid">
        </el-option>
      </el-select>
      <el-button type="primary" @click="changePart">切换配件</el-button>
    </div>
    <div style="display: flex; align-items: center">
      <el-upload class="avatar-uploader" action="/" :show-file-list="false" :on-change="handleAvatarSuccess">
        <img v-if="mapUrl" :src="mapUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-button type="primary" @click="changeMaterialMap">切换贴图</el-button>
    </div>

    <el-button type="primary" @click="exportModelFile">导出USDZ模型</el-button>
    <div>增强现实</div>
    <a v-if="file" rel="ar" :href="file">
      <img style="width: 100px; height: auto" :src="mapUrl" />
    </a>
    <div style="width: 100vw; height: calc(100vh - 460px)">
      <ThreeRender
        ref="ThreeRender"
        :camera-config="cameraConfig"
        :renderer-config="rendererConfig"
        :orbit-controls-config="orbitControlsConfig"
        :background="background"
        :environment="environment"
        :light-config="lightConfig"
        :scene="scene"
        @on-render-progress="onRenderProgress"
      ></ThreeRender>
    </div>
  </div>
</template>

<script>
import * as modulesComp from './main.js';
import { modelData, part1, part2, part3, modelData1, modelData2, modelData3 } from './modelData.js';
import axios from 'axios';
var service = axios.create({
  baseURL: 'https://fusenadminapi.dev.fusenpack.com', //正式
  timeout: 30000,
  adapter: 'fetch'
  // crossDomain: true
});

service.defaults.withCredentials = false;
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; //配置请求头
const CancelToken = axios.CancelToken;
const urlStringify = (param = {}) => {
  return new URLSearchParams(param).toString();
};
var unTime;
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    //添加Authorization
    config.headers['Authorization'] =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzIzMzY5NjExLCJncm91cF9pZCI6WzEwLDldLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNTR9.XJZP5d_wUKVsQwvPJpzvKiKOijBh8_bhytj2uR69M1A';
    //加密
    if (config.data || config.params) {
      let params = config.data || config.params;
      if (params.toKey_unTime) {
        unTime = params.toKey_unTime;
        config.headers.Bridge = unTime;
        delete params.toKey_unTime;
        if (config.data) {
          config.data = params;
        } else {
          config.params = params;
        }
      }
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
const request = {
  //get请求
  get(url, param, _hideLoad, type, config = {}) {
    const params = param;
    const data = {
      method: 'get',
      url,
      params,
      cancelToken: new CancelToken(() => {}),
      ...config
    };
    if (type === 'file') {
      if (data['headers']) {
        data['headers']['Content-Type'] = 'arraybuffer';
      } else {
        data['headers'] = {
          'Content-Type': 'arraybuffer'
        };
      }
    }
    return new Promise((resolve, reject) => {
      service(data)
        .then(res => {
          //axios返回的是一个promise对象
          resolve(res.data); //resolve在promise执行器内部
        })
        .catch(err => {
          console.log(err, '异常');
          reject(err);
        });
    });
  },
  post(url, param, _hideLoad, type = 1, config = {}) {
    let data = param;
    let serviceData = {
      method: 'post',
      url,
      data,
      cancelToken: new CancelToken(() => {}),
      ...config
    };
    switch (type) {
      case 1:
        if (serviceData.headers) {
          serviceData.headers['Content-Type'] = 'application/json';
        } else {
          serviceData.headers = {
            'Content-Type': 'application/json'
          };
        }
        break;
      case 2:
        data = urlStringify(param);
        break;
      case 3:
        if (serviceData.headers) {
          serviceData.headers['Content-Type'] = 'multipart/form-data';
        } else {
          serviceData.headers = {
            'Content-Type': 'multipart/form-data;'
          };
        }
        break;
      default:
        break;
    }
    return new Promise((resolve, reject) => {
      service(serviceData)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          console.log(err, '异常');
          reject(err);
        });
    });
  }
};
export default {
  name: 'App',
  components: { ThreeRender: modulesComp.modules.ThreeRender },
  data() {
    return {
      modelData: modelData3,
      mapUrl: '',
      part: '',
      model: '',
      percentage: 0,
      timeoutLoad: false,
      file: 'https://fusenstorage.s3.us-east-2.amazonaws.com/f528de18fbf25dcff40bc7cdb11cf8b960fe1d684a83cabf1b34607bfa54800b.usdz'
    };
  },
  computed: {
    cameraConfig() {
      return this.modelData.camera.data.object ?? void 0;
    },
    rendererConfig() {
      return this.modelData.project.data ?? void 0;
    },
    orbitControlsConfig() {
      return this.modelData.controls.data ?? void 0;
    },
    background() {
      return this.modelData.environment.data.background;
    },
    environment() {
      return this.modelData.environment.data.environment;
    },
    lightConfig() {
      return this.modelData.light.data.lights;
    },
    scene() {
      return this.modelData.scene.data;
    },
    options() {
      return [part1, part2, part3, { scene: { uuid: '11', name: 'none' } }];
    },
    loading() {
      return this.percentage <= 100 && !this.timeoutLoad;
    },
    modelOptions() {
      return [modelData, modelData1, modelData2, modelData3];
    }
  },
  mounted() {
    // const threeEngineExtendInstance = new ThreeRender.ThreeEngineExtend()
    // console.log(threeEngineExtendInstance)
  },
  methods: {
    changeMaterialMap() {
      const model = this.modelOptions.find(model => model.scene.uuid == this.model) ?? this.modelData;
      const groupUUID = model.scene.data.modelMesh[0].uuid;
      this.mapUrl &&
        this.$refs.ThreeRender.updateBaseMap({
          groupUUID,
          value: this.mapUrl,
          modelMesh: model.scene.data.modelMesh
        });
    },
    handleAvatarSuccess(res, file) {
      file?.[0]?.raw && (this.mapUrl = URL.createObjectURL(file?.[0]?.raw));
    },
    changePart() {
      const part = this.options.find(part => part.scene.uuid == this.part);
      this.$refs.ThreeRender.changePartModel(part?.scene ?? null);
    },
    changeBaseModel() {
      const model = this.modelOptions.find(model => model.scene.uuid == this.model);
      if (model) {
        this.$refs.ThreeRender.changeBaseModel(model);
      }
    },
    onRenderProgress(percentage) {
      this.percentage = percentage;
      if (percentage >= 100) {
        setTimeout(() => {
          this.timeoutLoad = true;
        }, 500);
      } else {
        this.timeoutLoad = false;
      }
    },
    async exportModelFile() {
      const file = await this.$refs.ThreeRender.exportModelFile({ type: 'USDZ', download: true });
      //
      const res = await this.upload(file.file);
      if (res) {
        this.file = res.data.resource_url;
      }
    },
    async upload(file) {
      const fileName = file.name.split('.');
      const fileType = fileName[fileName.length - 1];
      const metadata = {
        fileType
      };
      const data = {
        upload_bucket: 1,
        customer_dir: 'image/modelV2',
        prefix: 'printblock',
        backup_type: 'oss',
        source: '后台上传-新模型编辑器',
        refresh: 1,
        metadata,
        file
      };
      return await this.fileUpload(data);
    },
    async fileUpload(param, hideLoad = false, type = 3) {
      return await request.post('/api/common/upload/upload_file', param, hideLoad, type);
    }
  }
};
</script>
