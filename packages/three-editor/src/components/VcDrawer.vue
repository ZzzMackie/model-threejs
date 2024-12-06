<!-- eslint-disable vue/valid-define-props -->
<script setup>
import { ref, inject } from 'vue';
const emit = defineEmits(['handleOk', 'handleCancel']);
const props = defineProps({
  mask: {
    type: Boolean,
    default: false
  },
  drawerVm: {
    type: Object,
    default: () => {}
  },
  defaultVisible: {
    type: Boolean,
    default: false
  },
  placement: {
    type: String,
    default: 'right'
  },
  title: {
    type: [String, Object],
    default: ''
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  okText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  okLoading: {
    type: Boolean,
    default: false
  },
  okButtonProps: {
    type: Object,
    default: () => {}
  },
  cancelButtonProps: {
    type: Object,
    default: () => {}
  },
  unmountOnClose: {
    type: Boolean,
    default: false
  },
  width: {
    type: [Number, String],
    default: 250
  },
  height: {
    type: [Number, String],
    default: 250
  },
  drawerStyle: {
    type: Object,
    default: () => {}
  },
  onBeforeOk: {
    type: Function,
    default: () => {
      return true;
    }
  },
  onBeforeCancel: {
    type: Function,
    default: () => {
      return true;
    }
  },
  escToClose: {
    type: Boolean,
    default: true
  },
  renderToBody: {
    type: Boolean,
    default: true
  },
  header: {
    type: Boolean,
    default: true
  },
  footer: {
    type: Boolean,
    default: true
  },
  hideCancel: {
    type: Boolean,
    default: false
  }
});
const visible = inject('$visibleDrawer');
const close = () => {
  props.drawerVm.close();
};
const handleOk = (...args) => {
  emit('handleOk', ...args);
  close();
};
const handleCancel = (...args) => {
  emit('handleCancel', ...args);
  close();
};
const id = ref(`vc_drawer__${props.drawerVm.key}`);
</script>

<template>
  <div :id class="vc_drawer__wrap">
    <arco-drawer
      :width
      :height
      :mask
      :placement
      :closable
      :ok-text
      :cancel-text
      :ok-loading
      :drawer-style
      :cancel-button-props
      :ok-button-props
      :mask-closable
      :visible
      :title
      :footer
      :header
      :hide-cancel
      :esc-to-close
      :on-before-cancel
      :on-before-ok
      :unmount-on-close
      :popup-container="`#${id}`"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> <slot name="title"></slot> </template>
      <slot name="content"></slot>
    </arco-drawer>
  </div>
</template>

<style lang="scss" scoped>
@import '@styles/vcDrawer.scss';
</style>
