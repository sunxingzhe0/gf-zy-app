import request from '@/common/request/request.js'

/**
 * 报名名单列表
 * @param {string} activityId 活动id
 * @param {boolean} type 仅看退款的 true 是 false.否
 * @param {string} userId 用户id
 * @param {number} status 状态1.报名成功 2. 报名审核 3.报名失败
 * @param {string} doctorId 医生id(我的预约-传医生id 全部预约-无需传参)
 * @param {number} timeType 时间类型 1.活动开始时间、2.活动结束时间、3.活动创建时间
 */
export function signList(params) {
  return request('/api/v1/counseling/sign/list', params, 'GET')
}
// 统计
export function getCount(params) {
  return request('/api/v1/counseling/sign/getCount', params, 'GET')
}

/**
 * 报名名单详情
 * @param {string}  signId 名单id
 */
export function signDetail(params) {
  return request(
    `/api/v1/counseling/sign/getSignById/${params.signId}`,
    params,
    'GET',
  )
}

/**
 * 同意拒绝
 * @param {number}  approvalResult 状态 1.同意 2.拒绝
 * @param {string}  refundWay 退款方式
 * @param {string}  remark 备注
 * @param {string}  signId id
 * @param {number}  status 状态（1.报名成功 2. 报名审核 3.报名失败）
 */

//同意
export function signAgree(data) {
  return request('/api/v1/counseling/sign/agree', data, 'POST')
}

//拒绝
export function signRefuse(data) {
  return request('/api/v1/counseling/sign/refuse', data, 'POST')
}
