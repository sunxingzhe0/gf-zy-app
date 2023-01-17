import request from './request'
// 列表
export function getDeptinfoList(data) {
  return request('/api/v1/dept/intro/list', data, 'GET')
}

// 详情
export function getDeptinfo(data) {
  return request(`/api/v1/dept/intro/get/${data}`, data, 'GET')
}
