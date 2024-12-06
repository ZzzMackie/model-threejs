// stores/controls.js
import { defineStore } from 'pinia';
import { controls } from '@examples/app.json';
export const useControlsStore = defineStore('controls', {
  state: () => {
    return {
      uuid: undefined,
      name: controls.name,
      category_id: controls.category_id,
      maxDistance: controls.maxDistance, // 相机向外移动最小
      maxPolarAngle: controls.maxPolarAngle, //垂直旋转的角度的上限
      minDistance: controls.minDistance, // 相机向内移动最小
      minPolarAngle: controls.minPolarAngle, // 垂直旋转的角度的下限
      autoRotate: controls.autoRotate, //自动旋转
      autoRotateSpeed: controls.autoRotateSpeed, //自动旋转速度
      rotateSpeed: controls.rotateSpeed, //鼠标拖拽效率
      enabled: controls.enabled, //响应用户交互
      enablePan: controls.enablePan, //平移
      enableDamping: controls.enableDamping, //惯性
      category_name: controls.category_name
    };
  },
  actions: {
    setUUid(value) {
      this.uuid = value;
    },
    setControls(controls) {
      for (const key of Object.keys(controls)) {
        this[key] = controls[key];
      }
    }
  }
});
