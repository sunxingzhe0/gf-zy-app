import request from '@/common/request/request.js'

/**
 * 报名记录列表
 * @param {number} activityStatus 活动状态 1.进行中、2.已结束、3.暂停、4.未开始
 * @param {string} activityType 活动类型
 * @param {string} signEndTime 报名结束时间 格式：yyyyMMddHHmmss
 * @param {string} signStartTime 报名开始时间 格式：yyyyMMddHHmmss
 * @param {string} doctorId 医生id(我的预约-传医生id 全部预约-无需传参)
 * @param {number} signStatus 报名状态状态1.报名成功 2. 报名审核 3.报名失败
 */
export function recordlist(params) {
  return request('/api/v1/counseling/record/recordlist', params, 'GET')
}
/**
 * 报名名单详情
 * @param {string}  signId 名单id
 */
export function signRecordDetail(params) {
  return request(
    `/api/v1/counseling/record/getRecordById/${params.signId}`,
    params,
    'GET',
  )
}
