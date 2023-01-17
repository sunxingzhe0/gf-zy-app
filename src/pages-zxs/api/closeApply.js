import request from '@/common/request/request.js'

/**
 * 工作日程
 * @param
 */
export function myWorkSchedule(data) {
  return request('/api/v1/counseling/schedule/myWorkSchedule', data, 'GET')
}

/**
 * 可延诊日期
 * @param 
 *  deptId: H000000001T000000212
    doctorId: C39BB036982A4DA09BDB460471A477D2
    itemId: L61AE16M
    startTime: 14:00
    endTime: 14:20
    token: 1924EFA64222470DB15BB60861158962
 */
export function getScheduleListByDeptDoctorPeriod(data) {
  return request(
    '/api/v1/counseling/schedule/getScheduleListByDeptDoctorPeriod',
    data,
    'GET',
  )
}

/**
 * 停诊申请
 * @param 
 *  applyRemark: 停诊原因
    memberId: memberId
    newScheduleId: 顺延排班id
    patientId: patientId
    scheduleId: 排班id
 */
export function stopApply(data) {
  return request('/api/v1/counseling/scheduleStop/stopApply', data, 'POST')
}
/**
 * 停诊记录
 * @param
 */
export function stopPageList(data) {
  return request('/api/v1/counseling/scheduleStop/stopPageList', data, 'GET')
}

/**
 * 停诊撤回
 * @param
 * stopId
 */
export function stopWithdraw(data) {
  return request('/api/v1/counseling/scheduleStop/stopWithdraw', data, 'POST')
}
