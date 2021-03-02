import request from './request'
//查询医生排班信息
export function h5DocSchedual(data) {
	return request('/api/v1/schedual/h5DocSchedual', data, 'GET')
}
/***
*订单列表
*/
export function doctorOrderList(data) {
	return request('/api/v1/order/doctor/list', data, 'GET')
}
/***
*订单列表
*/
export function doctorOrderDetail(data) {
	return request('/api/v1/order/doctor/detail', data, 'GET')
}
//公告列表
export function announceAnyData(data) {
	return request('/api/v2/announce/announceAnyData', data, 'GET')
}
//公告详情
export function queryAnnounce(data) {
	return request('/api/v2/announce/queryAnnounce', data, 'GET')
}
//公告读取
export function readAnnounce(data) {
	return request('/api/v2/announce/readAnnounce', data, 'GET')
}
//公告一键已读
export function batchReadAnnounce(data) {
	return request('/api/v2/announce/batchReadAnnounce', data, 'GET')
}

/***
*H5医生端订单审核
*/
export function doctorOrderAudit(data) {
	return request('/api/v1/order/audit', data, 'POST')
}

/***
*H5医生端接诊
*/
export function doctorReceiving(data) {
	return request('/api/v1/clinic/doctor/receiving', data, 'GET')
}


/***
*处方新增
*/
export function saveRp(data) {
	return request('/api/v1/prescription/saveRp', data, 'POST')
}

/***
*处方删除
*/
export function delRp(data) {
	return request('/api/v1/prescription/delRp', data, 'POST')
}
/***
*处方撤回
*/
export function withdrawRp(data) {
	return request('/api/v1/prescription/withdrawRp', data, 'POST')
}

/***
*处方提交
*/
export function submitRp(data) {
	return request('/api/v1/prescription/submitRp', data, 'POST')
}

// 3.16.医生分类会话栏目会话列表
export function doctorSessionIdList(data) {
	return request('/api/v1/im/doctorSessionIdList', data, 'GET')
}

/***
*药品属性字典
*/
export function getListByType(data) {
	return request('/api/v1/syncInfo/getListByType', data, 'GET')
}
//疗程单位获取
export function attriBute(data) {
	return request('/api/v1/drug/searchQuery', data, 'GET')
}
