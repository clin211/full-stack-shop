import request from '@/utils/request';
import {query} from "@/utils/query";

export const getComments = object_id =>
  request({
    method: 'POST',
    url: '/frontend/comment/detail/'.concat('?', query({ object_id })),
  });

export const listComments = queyObj =>
    request({
        method: 'POST',
        url: '/frontend/comment/list/'.concat('?', query(queyObj)),
    });

export const addCommentApi = info =>
  request({
    method: 'POST',
    url: '/frontend/comment/add/',
    data: (() => {
      const data = new FormData();
      Object.keys(info).forEach(key => {
        data.append(key, info[key]);
      });
      return data;
    })(),
  });
