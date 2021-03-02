import request from './request'

/**
 * 4.5.8.1医嘱列表
 * @param {Object} params
 */
export function adviceList(params) {
  return request('/api/v1/dispose/userList', params, 'GET')
}

/**
 * 5.2.6.3医嘱详情
 * @param {Object} params
 */
export function adviceDetail(params) {
  return request('/api/v1/dispose/detail', params, 'GET')
}

/**
 * 5.2.6.8选择处置字典
 * @param {Object} params
 */
export function chooseList(params) {
  return request('/api/v1/dictDispose/chooseList', params, 'GET')
}

/**
 * 5.2.6.9选择标本、部位
 * @param {Object} params
 */
export function choosePart(params) {
  return request('/api/v1/dictDispose/choosePart', params, 'GET')
}

/**
 * 5.2.6.11选择执行科室
 * @param {Object} params
 */
export function chooseDisDept(params) {
  return request('/api/v1/dictDispose/chooseDisDept', params, 'GET')
}

/**
 * 5.2.6.10选择检查方法
 * @param {Object} params
 */
export function chooseMethod(params) {
  return request('/api/v1/dictDispose/chooseMethod', params, 'GET')
}

/**
 * 5.2.6.1新增处置单
 * @param {Object} data
 */
export function insertDispose(data) {
  return request('/api/v1/dispose/insert', data, 'POST')
}

/**
 * 5.2.6.2处置单列表
 * @param {Object} params
 */
export function doctorAdviceList(params) {
  return request('/api/v1/dispose/doctorList', params, 'GET')
}

/**
 * 5.2.6.6修改未缴费类型状态
 * @param {Object} data
 */
export function doctorUpdateStatus(data) {
  return request('/api/v1/dispose/doctorUpdateStatus', data, 'POST')
}

/**
 * 5.2.6.5修改、提交草稿
 * @param {Object} data
 */
export function doctorUpdateDetail(data) {
  return request('/api/v1/dispose/doctorUpdateDetail', data, 'POST')
}

/**
 * 4.5.8.2删除已退费处置单
 * @param {Object} data
 */
export function userDelete(data) {
  return request('/api/v1/dispose/userDelete', data, 'POST')
}

/**
 * 5.2.6.4批量操作草稿
 * @param {Object} data
 */
export function doctorBatchOpera(data) {
  return request('/api/v1/dispose/doctorBatchOpera', data, 'POST')
}

/**
 * 4.5.8.5处置单退费
 * @param {Object} data
 */
export function userRefund(data) {
  return request('/api/v1/dispose/userRefund', data, 'POST')
}

/**
 * 5.2.6.12获取价格
 * @param {Object} data
 */
export function getPrice(data) {
  return request('/api/v1/dictDispose/getPrice', data, 'GET')
}

/**
 * 5.2.6.13获取预约时间、号源数
 * @param {Object} data
 */
export function getDisDate(data) {
  return request('/api/v1/dictDispose/getDisDate', data, 'GET')
}

/**
 * 4.5.8.2修改预约时间
 * @param {Object} data
 */
export function userUpdateTime(data) {
  return request('/api/v1/dispose/userUpdateTime', data, 'POST')
}

/**
 * 6.1.1.3.2同业务订单号的处置草稿
 * @param {Object} data
 */
export function hasDisDraft(data) {
  return request('/api/v1/dispose/hasDisDraft', data, 'GET')
}
