import { fileUpload } from '@request/upload.js';
export const upload = async file => {
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
  return await fileUpload(data);
};
const base64ToFile = (dataUrl, filename) => {
  let arr = dataUrl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  if (!filename) {
    filename = `${new Date().getTime()}.${mime.substr(mime.indexOf('/') + 1)}`;
  }
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const uploadBase64 = async base64 => {
  const file = base64ToFile(base64);
  const fileName = file.name.split('.');
  const fileType = fileName[fileName.length - 1];
  const metadata = {
    fileType
  };
  const data = {
    customer_dir: 'image/modelV2/thumbnail',
    source: '后台上传-新模型编辑器-相机截图',
    upload_bucket: 1,
    prefix: 'modelV2',
    backup_type: 'oss',
    refresh: 1,
    metadata,
    file
  };
  return await fileUpload(data);
};
