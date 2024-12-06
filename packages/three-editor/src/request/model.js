import request from '@axios/index.js';
import { MODEL } from '@api/model.js';

export const getScene = async (param, hideLoad = false, type = 1) =>
  await request.get(MODEL['/api/model3d/get_model3d_info'], param, hideLoad, type);
