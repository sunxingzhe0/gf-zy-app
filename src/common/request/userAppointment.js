import request from './request'

/**
 * 预约下单
 * @param {Object} params
 */
export function submitAppointment (data) {
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
	return request('/api/v1/appointment/getUserDetail', data, 'GET')
}
//验证订单退费资格
export function verifyBack(data) {
	return request('/api/v1/appointment/verifyBack', data, 'GET')
}
