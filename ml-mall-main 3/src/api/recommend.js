import { query } from '@/utils/query';
import request from '@/utils/request';

/**
 * @description 文章列表
 * @param {{limit:number,page:number}} queyObj
 */
export const getArticleList = (queyObj, id) =>
  request({
    method: 'POST',
    url: '/frontend/article/list'.concat('?', query(queyObj)),
    data: (async () => {
      const data = new FormData();
      data.set('id', id);
      return data;
    })(),
  });

/**
 * @description 添加种草文章
 * @param {{title: string,desc:string,pic_url:string,detail:string}} articleInfo 文章信息
 */
export const addArticle = articleInfo =>
  request({
    method: 'POST',
    url: '/frontend/article/add',
    data: (() => {
      const formData = new FormData();
      Object.keys(articleInfo).forEach(key =>
        formData.set(key, articleInfo[key])
      );
      return formData;
    })(),
  });

/**
 * @description 我的文章列表
 * @param {{limit:number,page:number}} queyObj
 */
export const myArticleList = queyObj =>
  request({
    method: 'POST',
    url: '/frontend/article/list'.concat('?', query(queyObj)),
  });

export const getArticleInfo = id =>
  request({
    method: 'POST',
    url: '/frontend/article/detail/'.concat('?', query({ id })),
  });
