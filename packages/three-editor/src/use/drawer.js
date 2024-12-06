import { inject } from 'vue';
import { Drawer } from '@arco-design/web-vue';
export function useDrawer() {
  const drawer = inject('$drawer') || Drawer;
  return drawer;
}
