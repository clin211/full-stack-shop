import Cookies from 'js-cookie';

/**
 * token key
 */
const TokenKey = 'userToken';

/**
 * @description 获取本地token
 * @return {string}
 */
export const getToken = () => Cookies.get(TokenKey);

/**
 * @description 设置本地token
 * @param {string} token
 * @param {number} times 时间/秒
 */
export const setToken = (token, times) =>
  Cookies.set(TokenKey, token, { expires: new Date(Date.now() + times * 1000) });

/**
 * @description 删除本地token
 */
export const removeToken = () => Cookies.remove(TokenKey);
