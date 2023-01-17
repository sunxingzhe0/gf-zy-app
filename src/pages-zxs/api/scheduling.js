import request from '@/common/request/request.js'

/**
 * 我的工作日程
 * @param {String} deptId 科室id
 * @param {String} endDate 结束日期 格式：yyyy-MM-dd
 * @param {String} itemId 项目id
 * @param {String} userId 医生id
 * @param {String} startDate 结束日期 格式：yyyy-MM-dd
 * @returns {Promise<object>} res
 */
export function myWorkSchedule(params) {
  return request('/api/v1/counseling/schedule/myWorkSchedule', params, 'GET')
}

/***
 * 科室列表
 */
export function departments(data) {
  return request('/api/v1/counseling/appointment/departments', data, 'GET')
}
