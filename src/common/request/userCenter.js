import request from './request'
// 患者端健康档案列表页
export function archiveList(data) {
	return request('/api/v1/archive/list', data, 'GET')
}
// 患者端健康档案授权开关操作接口
export function changeAuth(data) {
	return request('/api/v1/archive/changeAuth', data, 'POST')
}
// 患者端健康档案就诊记录详情
export function medicalDetail(data) {
	return request('/api/v1/archive/medicalDetail', data, 'GET')
}
// 患者端我的医生列表
export function userdoctorList(data) {
	return request('/api/v1/user_doctor/list', data, 'GET')
}
// 患者端处方列表头部状态数量
export function getRpStatusNumber(data) {
	return request('/api/v1/order/getRpStatusNumber', data, 'GET')
}
// 患者端处方订单列表
export function listRp(data) {
	return request('/api/v1/order/listRp', data, 'GET')
}
 // 患者端待支付处方列表
 export function pageRp(data) {
 	return request('/api/v1/prescription/pageRp', data, 'GET')
 }
// 患者端处方订单详情
export function detailRp(data) {
	return request('/api/v1/order/detailRp', data, 'GET')
}
// 患者端获取处方核销二维码
export function getQrcode(data) {
	return request('/api/v1/code/getQrcode', data, 'GET')
}
// 患者端处方订单多包裹列表
export function getExpressInfo(data) {
	return request('/api/v1/express/getExpressInfo', data, 'GET')
}

// 地址列表
export function addressList(data) {
	return request('/api/v1/address/list', data, 'GET')
}
// 新增、修改地址
export function addressUpdate(data) {
	return request('/api/v1/address/addOrUpdate', data, 'POST')
}
// 设置默认地址
export function addresssetDefault(data) {
	return request('/api/v1/address/setDefault', data, 'GET')
}
// 获取用户默认地址
export function getDefaultAddress(data) {
	return request('/api/v1/address/getDefaultAddress', data, 'GET')
}
// 删除地址
export function addressDel(data) {
	return request('/api/v1/address/delete', data, 'POST','form')
}
// 患者端就诊人列表
export function patientList(data) {
	return request('/api/v1/patient/list', data, 'GET')
}
// 验证就诊人手机号 有效时间15分钟
export function validatePhone(data) {
	return request('/api/v1/patient/validatePhone', data, 'POST')
}
// 填写就诊人身份信息
export function fullPatientInfo(data) {
	return request('/api/v1/patient/fullPatientInfo', data, 'POST')
}
// 就诊人人脸核身回调
export function finishAuth(data) {
	return request('/api/v1/patient/finishAuth', data, 'GET')
}
// 确认就诊人信息
export function confirmPatientInfo(data) {
	return request('/api/v1/patient/confirmPatientInfo', data, 'POST')
}
// 选择就诊卡
export function confirmCard(data) {
	return request('/api/v1/patient/confirmCard', data, 'get')
}
// 填写健康资料
export function editPatientHistory(data) {
	return request('/api/v1/patient/editPatientHistory', data, 'POST')
}
// 修改就诊人资料变更默认状态
export function editPatientInfo(data) {
	return request('/api/v1/patient/editPatientInfo', data, 'POST')
}
// 患者端就诊人详情页
export function getPatientInfo(data) {
	return request('/api/v1/patient/getPatientInfo', data, 'GET')
}
// 患者端删除就诊人
export function deletePatient(data) {
	return request('/api/v1/patient/delete', data, 'POST')
}

// 医生端订单数量
export function orderCount(data) {
	return request('/api/v1/personal_center/doctor/count', data, 'GET')
}
// 医生端查询医生个人中心已开通业务
export function docFindMyConfig(data) {
	return request('/api/v1/bizConfig/docFindMyConfig', data, 'GET')
}
// 医生端修改已开通业务
export function updateH5DocBiz(data) {
	return request('/api/v1/bizConfig/updateH5DocBiz', data, 'GET')
}
// 医生端拉取资质认证信息
export function selfQualAuth(data) {
	return request('/api/v1/account/selfQualAuth', data, 'GET')
}
// 医生端提交资质认证信息
export function sendQualAuth(data) {
	return request('/api/v1/account/sendQualAuth', data, 'POST')
}
// 医生端撤回资质认证信息
export function recallAuth(data) {
	return request('/api/v1/account/recall', data, 'GET')
}
// 医生端实名手机验证
export function doctorValidatePhone(data) {
	return request('/api/v1/account/doctorValidatePhone', data, 'POST')
}
// 医生端确认信息并发起实名核身
export function doctorStartAuth(data) {
	return request('/api/v1/account/doctorStartAuth', data, 'POST')
}
// 实名核身回调
export function doctorFinAuth(data) {
	return request('/api/v1/account/doctorFinAuth', data, 'GET')
}
//获取医生详情
export function doctorIntro(data) {
	return request('/api/v1/account/doctorIntro', data, 'GET')
}
//修改医生文本信息
export function changeSelfText(data) {
	return request('/api/v1/login/changeSelfText', data, 'POST')
}
//医生修改头像
export function changeAvatar(data) {
	return request('/api/v1/login/changeAvatar', data, 'POST')
}
//系统消息
export function queryAnyData(data) {
	return request('/api/v1/notice/queryAnyData', data, 'GET')
}
//删除个人系统消息
export function delNotice(data) {
	return request('/api/v1/notice/delNotice', data, 'GET')
}
//系统消息已读
export function readNotice(data) {
	return request('/api/v1/notice/readNotice', data, 'GET')
}
//系统消息一键已读
export function batchRead(data) {
	return request('/api/v1/notice/batchRead', data, 'GET')
}

//医生端处方订单列表
export function h5RpList(data) {
	return request('/api/v1/prescription/h5RpList', data, 'GET')
}
//医生端处方详情
export function singleRp(data) {
	return request('/api/v1/prescription/singleRp', data, 'GET')
}

//患者查看评论列表
export function findEvaluateList(data) {
	return request('/api/v1/evaluate/findEvaluateList', data, 'GET')
}
//医生评论列表
export function findEvaluateData(data) {
	return request('/api/v1/evaluate/findEvaluateData', data, 'GET')
}
//医生评论详情
export function findEvaluatePage(data) {
	return request('/api/v1/evaluate/findEvaluatePage', data, 'GET')
}
//医生回复评论
export function addEvaluateAnswer(data) {
	return request('/api/v1/evaluate/addEvaluateAnswer', data, 'POST')
}

// 5.1.10.患者应答查看就诊记录
export function replyAuth(data) {
	return request('/api/v1/archive/replyAuth', data, 'POST')
}

