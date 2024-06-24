import { query } from '@/utils/query';
import request from '@/utils/request';

/**
 * @description 获取商品详情
 * @param {number} id 商品id
 */
export const getGoodsDetail = id =>
  request({
    method: 'POST',
    url: '/frontend/goods/detail'.concat('?', query({ id })),
  });
export const getCategory = id =>
    request({
        method: 'POST',
        url: '/frontend/category/list',
        data:{parent_id:id}
    });