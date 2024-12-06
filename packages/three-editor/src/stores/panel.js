// stores/panel.js
import { defineStore } from 'pinia';
import { clearDrawer } from '@feature/drawer/index.js';
export const usePanelStore = defineStore('panel', {
  state: () => {
    return {
      activeId: 'Materials'
    };
  },
  actions: {
    changePanel(activeId) {
      this.activeId = activeId;
      clearDrawer();
    }
  }
});
