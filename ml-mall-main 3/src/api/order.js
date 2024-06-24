import { query } from '@/utils/query';
import request from '@/utils/request';

/**
 * @description 我的订单
 * @param {{page:number;limit:number;status:string}} queryObj
 */
export const getOrder = queryObj =>
  request({
    method: 'POST',
    url: '/frontend/order/list/'.concat('?', query(queryObj)),
  });

/**
 * @description 创建订单
 * @param {{ order_goods_infos: { count: string;goods_id: string}[],consignee_phone:string;consignee_name:string; consignee_address:string;pay_type: number,price: number,remark: string,status: string}} info
 */
export const createOrder = info =>
  request({
    method: 'POST',
    url: '/frontend/order/add/',
    data: JSON.stringify(info),
  });

/**
 * @description
 * @param {{id: string,pay_type:string,pay_at:string,status:string}} info
 */
export const editOrderStatus = info =>
  request({
    method: 'POST',
    url: '/frontend/order/add/',
    data: JSON.stringify(info),
  });
