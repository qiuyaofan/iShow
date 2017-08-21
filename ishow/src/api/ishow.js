
import { fetchToken } from 'utils/fetch';
import qs from 'qs';
// import store from '../store/index.js';


// 获取上传的图片列表
export function getImgList() {
  return fetchToken({
    url: '/h5editor/getUploadFileList',
    method: 'post'
  });
}
// 获取上传的音频列表
export function getAudioList() {
  return fetchToken({
    url: '/h5editor/getAudioFileList',
    method: 'post'
  });
}

// 获取上传的视频列表
export function getVideoList() {
  return fetchToken({
    url: '/h5editor/getVideoFileList',
    method: 'post'
  });
}

// 删除文件（图片）
export function deleteImgList(data) {
  data = {
    filePath: JSON.stringify(data)
  }
  return fetchToken({
    url: '/h5editor/deleteFile',
    method: 'post',
    data: qs.stringify(data)
  });
}
// 清空文件（图片）
export function clearImgList(data) {
  data = {
    filePath: JSON.stringify(data)
  }
  return fetchToken({
    url: '/h5editor/wipeData',
    method: 'post',
    data: qs.stringify(data)
  });
}
// 获取默认验证列表
export function getValidateList() {
  return fetchToken({
    url: '/h5editor/getDefaultField',
    method: 'get'
  });
}
// 提交h5 json
export function postH5Page(data) {
  // const data = {
  //   data: JSON.stringify(json),
  //   type
  // };
  return fetchToken({
    url: '/h5editor/uploadH5Page',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 获取模版列表
export function getModuleList(pageSize, pageNum) {
  const data = {
    pageSize,
    pageNum
  };
  return fetchToken({
    url: '/h5editor/getModuleList',
    method: 'post',
    data: qs.stringify(data)
  });
}
// 获取活动列表
export function getActivityList(pageSize, pageNum) {
  const data = {
    pageSize,
    pageNum
  };
  return fetchToken({
    url: '/h5editor/getActivityList',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 提交配置信息
export function savePageConfig(data) {
  // id, paramJson
  // paramJson = JSON.stringify(paramJson);
  // const data = {
  //   id,
  //   paramJson
  // };
  return fetchToken({
    url: '/h5editor/savePageConfig',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 获取单个活动的json
export function getPageJson(id) {
  const data = {
    type: 1,
    id
  };
  return fetchToken({
    url: '/h5editor/getPageJson',
    method: 'post',
    data: qs.stringify(data)
  });
}