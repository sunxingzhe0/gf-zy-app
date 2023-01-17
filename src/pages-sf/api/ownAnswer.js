import sfRequest from './sfRequest'
/**
 * @name 咨询问答列表
 * @param {String} token
 */
export function consultList(params) {
  return sfRequest('/api/v1/consult/consultList', params, 'GET')
}
