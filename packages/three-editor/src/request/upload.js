import request from '@axios/index.js';
import { UPLOAD } from '@api/upload.js';

export const fileUpload = async (param, hideLoad = false, type = 3) =>
  await request.post(UPLOAD['/api/common/upload/upload-file'], param, hideLoad, type);

export const fileUploadBase64 = async (param, hideLoad = false, type = 3) =>
  await request.post(UPLOAD['/api/upload/upload-file-base'], param, hideLoad, type);
