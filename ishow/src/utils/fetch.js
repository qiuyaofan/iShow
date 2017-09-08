import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';

export default function _fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: process.env.BASE_API,
      // timeout: 2000,
      headers: { 'X-Ivanka-Token': store.getters.token }
    });
    instance(options)
        .then(response => {
          const res = response.data;
          if (res.code !== 20000) {
            console.log(options); // for debug
            Message({
              message: res.message,
              type: 'error',
              duration: 5 * 1000
            });
            // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
            if (res.code === 50008 || res.code === 50014 || res.code === 50012) {
              Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
              });
              // 登出
              store.dispatch('FedLogOut').then(() => {
                router.push({ path: '/login' })
              });
            }
            reject(res);
          }
          resolve(res);
        })
        .catch(error => {
          Message({
            message: '发生异常错误,请刷新页面重试,或联系程序员',
            type: 'error',
            duration: 5 * 1000
          });

          console.log(error); // for debug
          reject(error);
        });
  });
}

export function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: 2000 // 超时
    });
    instance(options)
        .then(response => {
          const res = response.data;
          resolve(res);
        })
        .catch(error => {
          Message({
            message: error,
            type: 'error',
            duration: 5 * 1000
          });
          console.log(error); // for debug
          reject(error);
        });
  });
}


export function fetchToken(options) {
  // store.getters.token
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      params: {
        token: store.getters.token
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      baseURL: process.env.BASE_API,
      timeout: 5000 // 超时
    });
    instance(options)
    .then(response => {
      const res = response.data;
      //mock.js
      resolve(res);
      //没有mock
      // if (res.code === 40001) {
      //   // 登出
      //   store.dispatch('FedLogOut').then(() => {
      //     router.push({ path: '/login' })
      //   });
      // } else if (res.code !== 200) {
      //   Message({
      //     message: res.msg,
      //     type: 'error',
      //     duration: 5 * 1000
      //   });
      //   reject(res);
      // } else {
      //   resolve(res);
      // }
    })
    .catch(error => {
      Message({
        message: '发生异常错误,请刷新页面重试,或联系程序员',
        type: 'error',
        duration: 5 * 1000
      });
      console.log(options);
      console.log(error); // for debug
      reject(error);
    });
  });
}
