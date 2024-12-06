import request from '@axios/index.js';
import { EDITOR } from '@api/editor.js';

export const getEditorData = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_model3d_options_list'], param, hideLoad, type);

export const getMaterialCategory = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_materialquality_categorys'], param, hideLoad, type);

export const setMaterialquality = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/save_materialquality'], param, hideLoad, type);

export const deleteMaterialquality = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/delete_materialquality'], param, hideLoad, type);

export const getMaterialQuality = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_materialqualitys'], param, hideLoad, type);

export const setMaterialCategory = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/save_materialquality_category'], param, hideLoad, type);

// HDR
export const getHdr = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_hdrs'], param, hideLoad, type);

export const setHdr = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/save_hdr'], param, hideLoad, type);

export const getHdrCategory = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_hdr_categorys'], param, hideLoad, type);

export const deleteHdr = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/delete_hdr'], param, hideLoad, type);

export const setHdrCategory = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/save_hdr_category'], param, hideLoad, type);

// scene
export const getScene = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_model3d_scenes'], param, hideLoad, type);

export const setScene = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/save_model3d_scene'], param, hideLoad, type);

export const deleteScene = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/delete_model3d_scene'], param, hideLoad, type);

export const getSceneCategory = async (param, hideLoad = false, type = 1) =>
  await request.get(EDITOR['/api/model3d/get_model3d_scene_categorys'], param, hideLoad, type);

export const setSceneCategory = async (param, hideLoad = false, type = 1) =>
  await request.post(EDITOR['/api/model3d/save_model3d_scene_category'], param, hideLoad, type);
