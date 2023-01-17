import request from '@/common/request/request.js'
import sfRequest from './sfRequest'
/**
 * 获取就诊人列表
 * @param {String} token
 * @returns {Promise<object>} res
 */
export function patientList(params) {
  return request('zyApi/api/v1/patient/list', params, 'GET')
}
/**
 * 获取就诊人列表其他
 * @param {String} token
 * @param {String} payType 0 门诊，1 住院
 * @returns {Promise<object>} res
 */
export function otherPatient(params) {
  return request('zyApi/api/v1/order/otherPatient', params, 'GET')
}

/**
 * 获取随访code--原request
 * @param {String} token
 */
export function getSfCode(params) {
  return request('/api/v1/login/sf/loginCode', params, 'GET')
}

/* ******************************************************************* */
/**
 * 登录随访获取token
 * @param {String} token
 */
export function sfLogin(code) {
  return sfRequest(`/api/v1/login/userLogin/${code}`, 'POST')
}

/**
 * 完善用户信息
 * @param {String} token
 */
export function improveUserInfo(params) {
  return sfRequest(`/api/v1/login/improveUserInfo`, params, 'POST')
}
