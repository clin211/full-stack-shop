import request from '@/utils/request';

/**
 * @description 登录
 * @param {string} name 用户
 * @param {string} password 密码
 */
export const login = ({ name, password }) =>
  request({
    method: 'POST',
    url: '/frontend/sso/login',
    data: (() => {
      const auth = new FormData();
      auth.append('name', name);
      auth.append('password', password);
      return auth;
    })(),
  });

/**
 * @description 注册
 * @param {{name:string, password:string,avatar:string,sex:number,sign:string,secret_answer:string}} userInfo 用户信息
 */
export const register = userInfo =>
  request({
    method: 'POST',
    url: '/frontend/sso/register',
    data: (() => {
      const formData = new FormData();
      Object.keys(userInfo).forEach(key => {
        formData.set(key, userInfo[key]);
      });
      return formData;
    })(),
  });

/**
 * @description 重置密码
 * @param {string} password 密码
 * @param {string} secret_answer 验证
 */
export const resetPwd = (password, secret_answer) =>
  request({
    method: 'POST',
    url: '/frontend/sso/password/update',
    data: (() => {
      const formData = new FormData();
      formData.set('password', password);
      formData.set('secret_answer', secret_answer);
      return formData;
    })(),
  });

/**
 * @description 注销登录
 * @param {string} token
 */
export const logout = token =>
  request({
    method: 'POST',
    url: '/frontend/sso/logout',
    data: (() => {
      const formData = new FormData();
      formData.set('token', token);
      return formData;
    })(),
  });

/**
 * @description 获取用户信息
 * @param {{name: string, password: string}} info
 */
export const getUserInfo = info =>
  request({
    method: 'POST',
    url: '/frontend/my/info/',
    data: (() => {
      const formData = new FormData();
      formData.append('name', info.name);
      formData.append('password', info.password);
      return formData;
    })(),
  });
