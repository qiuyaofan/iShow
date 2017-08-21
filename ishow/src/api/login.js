import { fetchToken } from 'utils/fetch';

// 验证token有效性接口
export function verifyToken() {
  return fetchToken({
    url: '/h5editor/verifyToken',
    method: 'post'
  });
}

export function loginByEmail(loginName, password) {
  const data = {
    loginName,
    password
  };
  console.info(loginName, password)
  return fetchToken({
    url: '/h5editor/loginAuth',
    method: 'post',
    params: data
  });
}

export function logout() {
  return fetchToken({
    url: '/login/logout',
    method: 'post'
  });
}


export function getInfo(token) {
  return fetchToken({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}

