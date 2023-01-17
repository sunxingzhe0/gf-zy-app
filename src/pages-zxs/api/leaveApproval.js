import request from '@/common/request/request.js'

/**
 * 我的请假审核
 * @param {String} doctor 医生id
 */
export function leaveList(data) {
  return request('/api/v1/counseling/leave/leaveList', data, 'GET')
}

/**
 * 请假审核（同意/拒绝）
 * @param
 */
export function agreeOrRefuse(data) {
  return request('/api/v1/counseling/leave/agreeOrRefuse', data, 'POST')
}
