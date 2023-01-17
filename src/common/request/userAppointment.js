import request from './request'

/**
 * 预约下单
 * @param {Object} params
 */
export function submitAppointment(data) {
  return request('/api/v1/order/submit', data, 'POST')
}

//预约列表信息
export function getUserList(data) {
  return request('/api/v1/appointment/getUserList', data, 'GET')
}

//退费成功之后删除订单
export function delAppointment(data) {
  return request('/api/v1/appointment/delById', data, 'GET')
}

//获取订单详情
export function getUserDetail(data) {
  // id为空时不传，后台报错
  if (data.id === '') delete data.id
  return request('/api/v1/appointment/getUserDetail', data, 'GET')
}
//验证订单退费资格
export function verifyBack(data) {
  return request('/api/v1/appointment/verifyBack', data, 'GET')
}
//医技预约列表
export function userDisposeList(data) {
  return request('/api/v1/dispose/userDisposeList', data, 'GET')
}

// 核酸检测签到
export function acidSignIn(data) {
  return request('/api/v1/appointment/specialCanceled', data, 'GET')
}

// 获取排队信息 cardNo  token
export function getNoInfo(data) {
  return request('zyApi/api/v1/order/getNoInfo', data, 'GET')
}

/**
 * 关闭预约挂号订单
 * @param {Object} params id
 */
export function closeOrder(data) {
  return request(`/api/v1/appointment/closeOrder/${data.id}`, data, 'POST')
}
