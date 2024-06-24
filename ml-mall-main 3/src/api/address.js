import { query } from '@/utils/query';
import request from '@/utils/request';

/**
 * @description 获取收货地址列表
 * @param {{page: string,limit: string}} queryObj
 */
export const getAddressList = queryObj =>
  request({
    method: 'POST',
    url: '/frontend/consignee/list/'.concat('?', query(queryObj)),
  });

/**
 * @description 新增收货地址
 * @param {{is_default:string,name:string,phone:string,province:string,city:string,town:string,street:string,detail:string}} info
 */
export const addAddress = info =>
  request({
    method: 'POST',
    url: '/frontend/consignee/add/',
    data: (() => {
      const formData = new FormData();
      Object.keys(info).forEach(key => {
        formData.set(key, info[key]);
      });
      return formData;
    })(),
  });

/**
 * @description 编辑地址
 * @param {{id:string,is_default:string,name:string,phone:string,province:string,city:string,town:string,street:string,detail:string}} info
 */
export const updateAddress = info =>
  request({
    method: 'POST',
    url: '/frontend/consignee/update/',
    data: (() => {
      const formData = new FormData();
      Object.keys(info).forEach(key => {
        formData.set(key, info[key]);
      });
      return formData;
    })(),
  });

/**
 * @description 删除地址
 * @param {string} id
 */
export const deleteAddress = id =>
  request({
    method: 'POST',
    url: '/frontend/consignee/delete/',
    data: (() => {
      const formData = new FormData();
      formData.set('id', id);
      return formData;
    })(),
  });
