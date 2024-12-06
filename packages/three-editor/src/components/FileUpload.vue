<script setup>
import { ref } from 'vue';
import { useMessage } from '@use/message.js';
import { getQueryParam } from '@use/utils.js';
const message = useMessage();
const emit = defineEmits(['change']);
const change = (_, currentFile) => {
  message.clear();
  switch (currentFile.status) {
    case 'init':
      message.info('开始上传文件');
      break;
    case 'uploading':
      message.info('文件上传中...');
      break;
    case 'done':
      message.info('文件上传成功');
      break;
    case 'error':
      message.error('s3文件上传失败, 返回本地资源');
      break;
    default:
      break;
  }
  if (!currentFile.url) {
    currentFile.url = URL.createObjectURL(currentFile.file);
  }
  emit('change', _, currentFile, URL.createObjectURL(currentFile.file));
};
const requestData = ref(null);
const action = ref(`${import.meta.env.VITE_APP_AXIOS_URL}/api/common/upload/upload_file`);
const beforeUpload = file => {
  const fileName = file.name.split('.');
  const fileType = fileName[fileName.length - 1];
  const metadata = {
    fileType
  };
  requestData.value = {
    upload_bucket: 1,
    customer_dir: 'image/modelV2',
    prefix: 'printblock',
    backup_type: 'oss',
    source: '后台上传-新模型编辑器',
    refresh: 1,
    metadata: JSON.stringify(metadata)
  };
  return true;
};
const headers = ref();
let token = getQueryParam('auth_key');
if (token) {
  headers.value = {
    Authorization: token
  };
} else {
  switch (import.meta.env.VITE_BUILD_ENV) {
    case 'development':
      headers.value = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzE3MDM1NjM1LCJncm91cF9pZCI6WzBdLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNTR9.11U2bxxs2fhtbLp_L8T4ZritWIfL7iEtX1o-y1ZfWbE`
      };
      break;
    case 'production':
      headers.value = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzE3ODI5NzUwLCJncm91cF9pZCI6WzBdLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNDh9.R9SY-EnD1L1tgZUecxR16pCrvdgJVS67uMR8G6I0suY`
      };
      break;
    case 'test':
      headers.value = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzE3ODMwNDU3LCJncm91cF9pZCI6WzBdLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNDR9.-f421T9sxvpAMk3c7x4_Pgt5fQGXAr2kA-EZFm-9QXo`
      };
      break;

    default:
      break;
  }
}
</script>

<template>
  <arco-upload
    :action="action"
    :data="requestData"
    :headers
    :on-before-upload="beforeUpload"
    @change="change"
    v-on="$attrs"
  >
    <template #upload-button>
      <slot name="upload-button"></slot>
    </template>
    <template #upload-item>
      <slot name="upload-item"></slot>
    </template>
    <template #image>
      <slot name="image"></slot>
    </template>
    <template #extra-button>
      <slot name="extra-button"></slot>
    </template>
  </arco-upload>
</template>
