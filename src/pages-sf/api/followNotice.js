import sfRequest from './sfRequest'
/**
 * @name 查询消息列表数据
 * @param {String} token
 */
export function massageList(params) {
  return sfRequest('/api/v1/massage/massageList', params, 'GET')
}

/**
 * @name 消息修改状态或批量修改状态
 * @param {String} token
 */
export function editMassage(params) {
  return sfRequest('/api/v1/massage/editMassage', params, 'GET')
}

/**
 * @name 查询消息内容
 * @param {String} token
 */
export function massageDetail(params) {
  return sfRequest('/api/v1/massage/massageDetail', params, 'GET')
}
