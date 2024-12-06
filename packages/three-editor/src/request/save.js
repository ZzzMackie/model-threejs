import request from '@axios/index.js';
import { SAVE } from '@api/save.js';

export const save = async (param, hideLoad = false, type = 1) =>
  await request.post(SAVE['/api/model3d/save_model3d_info'], param, hideLoad, type);
