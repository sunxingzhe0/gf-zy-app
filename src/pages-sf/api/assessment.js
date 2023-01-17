import sfRequest from './sfRequest'
/**
 * 评估问卷列表-and-评估结果列表
 * @param {String} token
 */
export function rebackResult(params) {
  return sfRequest('/api/v1/mobile/rebackResult', params, 'GET')
}

/**
 * 问卷详情
 * @param {String} token
 */
export function rebackDetail(params) {
  return sfRequest('/api/v1/mobile/rebackDetail', params, 'GET')
}

/**
 * 保存评估
 * @param {String} token
 */
export function saveResult(params) {
  return sfRequest('/api/v1/mobile/saveResult', params, 'POST')
}
