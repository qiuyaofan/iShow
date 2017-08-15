import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ishowAPI from './ishow';
import loginAPI from './login';
const mock = new MockAdapter(axios);

// 编辑器相关
mock.onPost('/h5editor/getAudioFileList').reply(ishowAPI.getAudioList);
mock.onPost('/h5editor/getVideoFileList').reply(ishowAPI.getVideoList);
mock.onPost('/h5editor/getUploadFileList').reply(ishowAPI.getImgList);
mock.onPost('/h5editor/deleteFile').reply(ishowAPI.deleteImgList);
mock.onPost('/h5editor/wipeData').reply(ishowAPI.clearImgList);
mock.onGet('/h5editor/getDefaultField').reply(ishowAPI.getValidateList);
mock.onPost('/h5editor/uploadH5Page').reply(ishowAPI.postH5Page);
mock.onPost('/h5editor/getModuleList').reply(ishowAPI.getModuleList);
mock.onPost('/h5editor/getActivityList').reply(ishowAPI.getActivityList);
mock.onPost('/h5editor/savePageConfig').reply(ishowAPI.savePageConfig);
mock.onPost('/h5editor/getPageJson').reply(ishowAPI.getPageJson);

// 登录相关
mock.onPost('/h5editor/loginAuth').reply(loginAPI.loginByEmail);
mock.onPost('/login/logout').reply(loginAPI.logout);
// mock.onGet('/user/info').reply(loginAPI.getInfo);

// // 文章相关
// mock.onGet('/article/list').reply(articleAPI.getList);
// mock.onGet('/article/detail').reply(articleAPI.getArticle);

// // table example相关
// mock.onGet('/article_table/list').reply(article_tableAPI.getList);
// mock.onGet('/article_table/pv').reply(article_tableAPI.getPv);

// // 搜索相关
// mock.onGet('/search/user').reply(remoteSearchAPI.searchUser);

export default mock;
