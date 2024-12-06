/*
1.通过createPopup创建弹窗
2.可以通过getPopup(key)获取对应key值弹窗实例，未传key则随机生成key值
3.closePopup(key)关闭对应key值弹窗
4.已暴露弹窗对应的阶段的周期函数
beforeCreate：beforeCreatePopup
vue实例beforeCreate：vm_beforeCreate
vue实例created：vm_created
vue实例mounted: vm_mounted
mounted:mountedPopup
beforeDestroy:beforeDestroyPopup
destroyed:destroyedPopup
参数：
    1.slotVnodeFn：需要传入插槽slotVnodeFn构造插槽内容
    2.key:可以通过该key值get到对应的弹窗实例
    3.drawerOptions：传入控制弹窗的内容的props
*/
import { useEventBus } from '@vueuse/core';
import ArcoVue from '@arco-design/web-vue';
import '@styles/drawer.scss';
const eventBus = useEventBus('drawer');
import { defineAsyncComponent, createApp, h, ref } from 'vue';
const opt = Object.prototype.toString;
const querySelector = (selectors, container) => {
  var _a;
  return (_a = (container != null ? container : document).querySelector(selectors)) != null ? _a : void 0;
};
const isString = function (obj) {
  return opt.call(obj) === '[object String]';
};
const getElement = (target, container) => {
  if (isString(target)) {
    const selector = target[0] === '#' ? `[id='${target.slice(1)}']` : target;
    return querySelector(selector, container);
  }
  return target;
};
const VcDrawer = defineAsyncComponent(() => import('@components/VcDrawer.vue'));
const DrawerMap = new Map(); //存弹窗实例
class Drawer {
  constructor(options = {}) {
    const { key, drawerOptions, slotVnodeFn, closeDrawerInstance = false } = options;
    this.options = options;
    this.slotVnodeFn = slotVnodeFn;
    this.closeDrawerInstance = closeDrawerInstance;
    this.key = key || `drawer${Math.floor(Math.random() * 100)}`; //没有传入key则随机生成默认key
    this._vm = null;
    this.drawerOptions = drawerOptions;
    this.drawerOptions.props.drawerVm = this;
    this.popupContainer = null;
    this.mountApp = document.createElement('div');
    this.mountApp.setAttribute('class', 'drawer__wrap');
    this.mountApp.setAttribute('id', this.key);
    this.visibleDrawer = ref(true);
    this.init();
    DrawerMap.set(this.key, this);
  }
  // 关闭弹窗
  async close() {
    // 销毁之前
    this.emit('beforeDestroyDrawer');
    if (this.closeDrawerInstance) {
      await this.hide();
      this._vm.unmount();
      if (this.options.popupContainer) {
        this.popupContainer = getElement(this.options.popupContainer);
        this.popupContainer.removeChild(this.mountApp);
      } else {
        document.body.removeChild(this.mountApp);
      }
      DrawerMap.delete(this.key);
    } else {
      await this.hide();
    }
    // 销毁之后
    this.emit('destroyedDrawer');
  }
  async hide() {
    this.visibleDrawer.value = false;
    await new Promise(res => {
      setTimeout(() => {
        this.mountApp.style.display = 'none';
        res();
      }, 500);
    });
  }
  show() {
    this.mountApp.style.display = '';
    requestAnimationFrame(() => {
      this.visibleDrawer.value = true;
    });
  }
  // 初始化弹窗
  init() {
    this.emit('beforeCreateDrawer');
    const _this = this;
    this._vm = createApp({
      components: { VcDrawer },
      emits: {
        vm_beforeCreate: () => true,
        vm_created: () => true,
        vm_mounted: () => true
      },
      // 实例创建之前
      beforeCreate() {
        _this.emit('vm_beforeCreate', this);
      },
      // 实例创建之后
      created() {
        _this.emit('vm_created', this);
      },
      mounted() {
        _this.emit('vm_mounted', this);
      },
      render() {
        return h(VcDrawer, _this.drawerOptions.props, _this.slotVnodeFn(h));
      }
    });
    this._vm.use(ArcoVue, {
      // 用于改变使用组件时的前缀名称
      componentPrefix: 'arco'
    });
    this._vm.provide('$visibleDrawer', this.visibleDrawer);
    if (this.options.popupContainer) {
      this.popupContainer = getElement(this.options.popupContainer);
      this.popupContainer.appendChild(this.mountApp);
    } else {
      document.body.appendChild(this.mountApp);
    }
    this._vm.mount(this.mountApp);
    this.emit('mountedDrawer');
  }
  static DrawerMap = DrawerMap;
  emit(...event) {
    eventBus.emit(...event);
  }
  on(...event) {
    eventBus.on(...event);
  }
  off(...event) {
    eventBus.off(...event);
  }
}
// 创建弹窗
const createDrawer = options => {
  const drawerVm = getDrawer(options.key);
  if (drawerVm) {
    drawerVm.show();
    return drawerVm;
  }
  return new Drawer(options);
};

// 获取vue实例
const getDrawer = key => {
  return DrawerMap?.get?.(key);
};

// 关闭弹窗
const closeDrawer = key => {
  DrawerMap.get(key)?.close?.();
};

const clearDrawer = () => {
  for (const drawer of DrawerMap.values()) {
    drawer.close();
  }
};

export { createDrawer, getDrawer, closeDrawer, clearDrawer };
