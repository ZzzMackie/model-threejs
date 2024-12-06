import { createApp } from 'vue';
import './styles/var.css';
import './styles/style.css';
import './styles/arcoReset.css';
import './styles/font.scss';
import App from './App.vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.less';
import SvgIcon from './components/SvgIcon.vue';
import 'virtual:svg-icons-register';
import { createPinia } from 'pinia';
import { initStore } from '@use/initStore.js';
const pinia = createPinia();
const render = async () => {
  const threeEditorApp = createApp(App);
  threeEditorApp.use(pinia);
  threeEditorApp.component('SvgIcon', SvgIcon);
  threeEditorApp.use(ArcoVue, {
    // 用于改变使用组件时的前缀名称
    componentPrefix: 'arco'
  });
  threeEditorApp.provide('$message', ArcoVue.Message);
  threeEditorApp.provide('$drawer', ArcoVue.Drawer);
  await initStore();
  threeEditorApp.mount('#app');
  window.addEventListener('vite:preloadError', () => {
    window.location.reload(); // 例如，刷新页面
  });
};

render();
