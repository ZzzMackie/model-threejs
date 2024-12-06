// stores/camera.js
import { defineStore } from 'pinia';
import { useThreeEngineVm } from '@use/useThreeEngineVm.js';
import { camera } from '@examples/app.json';
export const useCameraStore = defineStore('camera', {
  state: () => {
    return {
      camera: {
        object: camera.object,
        screenshot: camera.screenshot,
        screenshotType: camera.screenshotType,
        orthographicCamera: camera.orthographicCamera,
        transparentBackground: camera.transparentBackground,
        uuid: undefined,
        name: camera.name,
        category_id: camera.category_id,
        category_name: camera.category_name
      }
    };
  },
  actions: {
    setValue(key, value) {
      this.camera[key] = value;
    },
    setUUid(value) {
      this.camera.uuid = value;
    },
    setCamera(camera) {
      for (const key of Object.keys(camera)) {
        this.camera[key] = camera[key];
      }
    },
    setCameraObject(cameraObject) {
      for (const key of Object.keys(cameraObject)) {
        this.camera.object[key] = cameraObject[key];
      }
      this.changeCameraObject(cameraObject);
    },
    setCameraScreenshot(screenshot) {
      for (const key of Object.keys(screenshot)) {
        this.camera.screenshot[key] = screenshot[key];
      }
    },
    setCameraObjectPosition(x, y, z) {
      this.camera.object['position']['x'] = x;
      this.camera.object['position']['y'] = y;
      this.camera.object['position']['z'] = z;
      this.changeCameraPosition();
    },
    changeCameraPosition() {
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return;
      threeEngine.toAnimateCamera({
        x: this.camera.object['position']['x'],
        y: this.camera.object['position']['y'],
        z: this.camera.object['position']['z']
      });
    },
    changeCameraObject(cameraObject) {
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return;
      threeEngine.cameraObjectChange(cameraObject);
    },
    setOrthographicCamera(val) {
      this.camera.orthographicCamera = val;
      const { threeEngine } = useThreeEngineVm();
      if (!threeEngine) return;
      threeEngine.changeCamera(val ? 'orthographicCamera' : 'perspectiveCamera');
    }
  }
});
