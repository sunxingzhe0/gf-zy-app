import request from '@/common/request/request.js'

/**
 * 我的统计-心咨预约
 * @param {String} beginTime 开始时间
 * @param {String} endTime 结束时间
 */
export function getMyReserveCount(data) {
  return request('/api/v1/counseling/order/getMyReserveCount', data, 'GET')
}

/**
 * 我的统计-心咨预约(团体统计)
 * @param {String} beginTime 开始时间
 * @param {String} endTime 结束时间
 * @param {String} unitType 单位类型(0-小时/1-天/2-周)
 *
 */
export function getMyActivityCount(data) {
  return request('/api/v1/counseling/order/getMyActivityCount', data, 'GET')
}
