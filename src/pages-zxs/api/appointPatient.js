import request from '@/common/request/request.js'

/**
 * 预约患者列表
 * @param {String} currentNum 当前页码
 * @param {String} doctorId 医生id
 * @param {String} endTimeout 是否超时 true：是/false：否
 * @param {String} field 字段名称
 * @param {String} pageSize 每页显示数量
 * @param {String} reservedEndTime 预约结束日期 格式：yyyyMMddHHmmss
 * @param {String} reservedStartTime 预约开始日期 格式：yyyyMMddHHmmss
 * @param {String} sorted 排序方向
 * @returns {Promise<object>} res
 */
export function reservedList(params) {
  return request('/api/v1/xz/patient/reservedList', params, 'GET')
}

/**
 * 我的预约-结束
 * @param {String} deptName 科室名称
 * @param {String} doctor 医生
 * @param {String} doctorId 医生Id
 * @param {String} entryId 预约项目编码
 * @param {String} entryName 预约项目名称
 * @param {String} memberId
 * @param {String} orgId 机构ID
 * @param {String} id 预约id/单据号
 * @returns {Promise<object>} res
 */
export function endVisit(data) {
  return request(`/api/v1/xz/patient/endVisit/${data.id}`, data, 'POST')
}

/**
 * 我的预约-接诊
 */
export function acceptVisit(id) {
  return request(`/api/v1/xz/patient/acceptVisit/${id}`, {}, 'POST')
}
/**
 * 预约详情
 */
export function queryReservationDetail(id) {
  return request(
    `/api/v1/counseling/appointment/appointmentDesc`,
    { id },
    'GET',
  )
}

/**
 * 预约患者-取消接诊
 */
export function cancelAccept(id) {
  return request(`/api/v1/xz/patient/cancelAccept/${id}`, {}, 'POST')
}
