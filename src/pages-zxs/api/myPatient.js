import request from '@/common/request/request.js'

/**
 * 我的分组列表
 * @param {String} doctorId 医生id
 */
export function myGroupList(data) {
  return request('/api/v1/xz/patient/myGroupList', data, 'GET')
}

/**
 * 分组+患者树
 */
export function patientGroupTree(data) {
  return request('/api/v1/xz/patient/patientGroupTree', data, 'GET')
}
/**
 * 新增分组
 * @param {String}   name 分组名
 */
export function addGroup(data) {
  return request('/api/v1/xz/patient/addGroup', data, 'POST')
}
/**
 * 编辑分组
 * @param {String}   name 分组名
 * id 分组id
 */
export function editGroup(data) {
  return request('/api/v1/xz/patient/editGroup', data, 'POST')
}
/**
 * 批量移动分组
 * @param   id
分组id 编辑/移动时不能为空
 * id 分组id
patientIds
批量移动患者id集合
 */
export function moveGroup(data) {
  return request('/api/v1/xz/patient/moveGroup', data, 'POST')
}
/**
 * 批量删除分组
 * @param  ids
 */
export function delGroup(data) {
  return request('/api/v1/xz/patient/delGroup', data, 'POST')
}

/**
 * 当前患者预约单
 * @param {String}   patientId 患者id
 */
export function queryReservation(data) {
  return request('/api/v1/counseling/reservation/queryReservation', data, 'GET')
}

/**
 * 患者详情
 * @param {String}   patientId 患者id
 */
export function getPatientInfo(data) {
  return request('/api/v1/myPatient/detail/info', data, 'GET')
}

/**
 * 预约单详情
 * @param {String}   id
 */
export function appointmentDesc(data) {
  return request('/api/v1/counseling/appointment/appointmentDesc', data, 'GET')
}

/**
 * 报名记录列表（患者来查询）
 * @param {String}   patientId
 */
export function recordlist(data) {
  return request('/api/v1/counseling/record/recordlist', data, 'GET')
}

/**
 * 我的报名-报名详情）
 * @param {String}   signId
 */
export function mySignDesc(data) {
  return request('/api/v1/counseling/sign/mySignDesc', data, 'GET')
}

/**
 * 就诊记录列表
 * @param {String}   patientId
 */
export function medicalList(data) {
  return request('/api/v1/myPatient/detail/medicalList', data, 'GET')
}
