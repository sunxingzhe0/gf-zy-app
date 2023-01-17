import sfRequest from './sfRequest'
/**
 * 设备列表
 * @param {String} token
 */
export function deviceList(params) {
  return sfRequest('/api/v1/device/deviceList', params, 'GET')
}

/**
 * 设备添加
 * @param {String} token
 */
export function addEquipment(params) {
  return sfRequest('/api/v1/device/addEquipment', params, 'GET')
}

/**
 * 测量信息
 * @param {String} token
 */
export function devMeasure(params) {
  return sfRequest('/api/v1/device/devMeasure', params, 'GET')
}
/**
 * 设备-设备类型选择
 * @param {String} token
 */
export function deviceTypes(params) {
  return sfRequest('/api/v1/device/deviceTypes', params, 'POST')
}
/**
 * 解绑设备
 * @param {String} token
 */
export function delBind(params) {
  return sfRequest('/api/v1/device/patient', params, 'GET')
}

/**
 * 设备录入
 * @param {String} token
 */
export function entryDevice(params) {
  return sfRequest('/api/v1/device/entryDevice', params, 'GET')
}
