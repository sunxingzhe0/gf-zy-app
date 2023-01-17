import request from './request'

// 用药提醒列表

export function drugWarnList(params) {
  return request('/api/v1/drugWarn/drugWarnList', params, 'GET')
}
// 新增用药提醒
export function saveDrugWarn(data) {
  return request(
    '/api/v1/drugWarn/saveDrugWarn',
    data)
}


// 编辑用药提醒
export function editDrugWarn(data) {
  return request('/api/v1/drugWarn/editDrugWarn',
    data
  )
}

// 删除提醒
export function delDrugWarn(params) {
  return request('/api/v1/drugWarn/delDrugWarn',
    params, 'GET'
  )
}
// 开启（关闭）提醒
export function editWarnState(params) {
  return request('/api/v1/drugWarn/editWarnState',
    params, 'GET'
  )
}
// 常用药列表
export function drugWarnCommonList(params) {
  return request('/api/v1/drugWarnCommon/list',
    params, 'GET'
  )
}
// 删除常用药
export function drugWarnCommonDel(params) {
  return request('/api/v1/drugWarnCommon/del',
    params, 'GET'
  )
}
