import request from '@/common/request/request.js'

/**
 * 活动列表
 * @param {number} activityStatus 活动状态 1.进行中、2.已结束、3.暂停、4.未开始
 * @param {string} activityType 活动类型 全部/团体活动/督导/治疗
 * @param {string} beginTime 开始时间 格式：yyyyMMddHHmmss
 * @param {string} endTime 结束时间 格式：yyyyMMddHHmmss
 * @param {string} doctorId 医生id(我的预约-传医生id 全部预约-无需传参)
 * @param {number} timeType 时间类型 1.活动开始时间、2.活动结束时间、3.活动创建时间
 */
export function queryActivity(params) {
  return request('/api/v1/counseling/activity/queryActivity', params, 'GET')
}

/**
 * 活动详情
 * @param {string}  activityId 活动id
 */
export function activityDetail(params) {
  return request(
    `/api/v1/counseling/activity/getActivityDetail/${params.activityId}`,
    params,
    'GET',
  )
}
