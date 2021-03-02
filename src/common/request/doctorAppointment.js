import request from './request'

/**
 * 获取预约科室列表
 * @param {Object} params
 */
export function getDeptList (params) {
  return request('/api/v1/appointment/getDeptList', params, 'GET')
}

/**
 * 根据条件查询科室
 * @param {Object} params
 */
export function getDeptByCondition (params) {
  return request('/api/v1/appointment/getDeptByCondition', params, 'GET')
}

/**
 * 获取科室详细信息
 * @param {Object} params
 */
export function getDeptDetail (params) {
  return request('/api/v1/appointment/getDeptDetail', params, 'GET')
}

/**
 * 获取诊间预约数据
 * @param {Object} data
 */
export function getAppointmentInfo (params) {
  return request('/api/v1/appointment/getReserveInfo', params, 'GET')
}

/**
 * 保存诊间预约信息
 * @param {Object} data
 */
export function saveAppointment (data) {
  return request('/api/v1/appointment/save', data, 'POST')
}

/**
 * 获取预约科室可预约日期
 * @param {Object} params
 */
export function getReverseDeptDate (params) {
  return request('/api/v1/appointment/getReverseDeptDate', params, 'GET')
}

/**
 * 获取预约医生信息
 * @param {Object} params
 */
export function getReverseDocInfo (params) {
  return request('/api/v1/appointment/getReverseDocInfo', params, 'GET')
}

/**
 * 刷新医生号源
 * @param {Object} params
 */
export function refreshDoctorNo (params) {
  return request('/api/v1/appointment/refreshDoctorNo', params, 'GET')
}

/**
 * 获取医生排班分时数据
 * @param {Object} params
 */
export function getDocFsInfo (params) {
  return request('/api/v1/appointment/getDocFsInfo', params, 'GET')
}

/**
 * 获取院内编码
 * @param {Object} params
 */
export function getSyncCode (params) {
  return request('/api/v1/appointment/getSyncCode', params, 'GET')
}

/**
 * 获取院区列表
 * @param {Object} params
 */
export function getHospInfo (params) {
  return request('/api/v1/appointment/getHospInfo', params, 'GET')
}
