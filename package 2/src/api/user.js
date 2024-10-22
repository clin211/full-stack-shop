import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/backend/sso/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/backend/sso/logout',
    method: 'post',
    data
  })
}
