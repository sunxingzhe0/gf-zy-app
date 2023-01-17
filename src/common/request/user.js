import request from './request'
/**
 * 轮播图显示
 * */
export function rotationChartDisplay(params) {
  return request('/api/v1/advertising/rotationChartDisplay', params, 'GET')
}
/**
 * 资讯列表
 * */
export function findInformationByPage(params) {
  return request('/api/v1/information/findInformationByPage', params, 'GET')
}
/**
 * 资讯详情页
 * */
export function informationDataPage(params) {
  return request('/api/v1/information/informationDataPage', params, 'GET')
}

/**
 * 业务订单列表
 * */
export function orderList(params) {
  return request('/api/v1/order/list', params, 'GET')
}
/**
 * 业务订单详情
 * */
export function orderDetail(params) {
  return request('/api/v1/order/detail', params, 'GET')
}

/**
 * 栏目标题显示
 *
 * */
export function findColumnTitle(params) {
  return request('/api/v1/column/findColumnTitle', params, 'GET')
}
/**
 * 首页栏目轮播图
 * */
export function columnPro(params) {
  return request('/api/v1/column/columnPro', params, 'GET')
}
/**
 * 在线咨询专家栏
 * */
export function onlineExpertList(params) {
  return request('/api/v1/bizConfig/h5OnlineExpertList', params, 'GET')
}

/**
 * 诊疗业务列表
 * */
export function bizTypeList(params) {
  return request('/api/v1/bizConfig/h5BizTypeList', params, 'POST')
}

/**
 * 科室选择(预约挂号科室)
 * */
export function deptChooseList(params) {
  return request('/api/v1/dept/chooseList', params, 'GET')
}
/**
 * 科室选择(互联网科室选择)
 * */
export function deptOuterChooseList(params) {
  return request('/api/v1/deptOuter/chooseList', params, 'GET')
}
/**
 * 职称选择
 * */
export function titleChooseList(params) {
  return request('/api/v1/title/chooseList', params, 'GET')
}

/**
 * 获取医院介绍
 * */
export function orgIntro(params) {
  return request('/api/v1/org/orgIntro', params, 'GET')
}
/**
 * 获取医生详情
 * */
export function doctorIntro(params) {
  return request('/api/v1/account/doctorIntro', params, 'GET')
}

/**
 * 患者可选时间段
 * */
export function chooseOrderTime(params) {
  return request('/api/v1/schedual/chooseOrderTime', params, 'GET')
}
/**
 * 患者可选时间段
 * */
export function h5DocBizInfo(params) {
  return request('/api/v1/bizConfig/h5DocBizInfo', params, 'GET')
}

/**
 * 就诊人列表
 * */
export function patientList(params) {
  return request('/api/v1/patient/list', params, 'GET')
}
/***
 *查看协议
 * */
export function showAgreement(params) {
  return request('/api/v1/agreement/showAgreement', params, 'GET')
}
/***
 *所有成员就诊列表
 * */
export function archiveList(params) {
  return request('/api/v1/archive/listAll', params, 'GET')
}

/***
 *提交订单
 * */
export function submit(params) {
  return request('/api/v1/order/submit', params, 'POST')
}

/***
 *订单预支付
 * */
export function prepay(params) {
  return request('/api/v1/order/prepay', params, 'POST')
}

/***
 *院内处方列表
 * */
export function userRpHospital(params) {
  return request('/api/v1/prescription/userRpHospital', params, 'GET')
}
/***
 *取消订单
 * */
export function orderCancel(params) {
  return request('/api/v1/order/cancel', params, 'POST')
}
/***
 *删除订单
 * */
export function orderDelete(params) {
  return request('/api/v1/order/delete', params, 'POST')
}

/***
 *退款订单
 * */
export function handelRpRefund(params) {
  return request('/api/v1/order/user/prescRefund', params, 'POST')
}

/***
 *添加评论
 * */
export function addEvaluate(params) {
  return request('/api/v1/evaluate/addEvaluate', params, 'POST')
}
/***
 *查看当前评价订单的详情
 * */
export function findEvaluate(params) {
  return request('/api/v1/evaluate/findEvaluate', params, 'GET')
}
/***
 *确认收货
 * */
export function orderConfirm(params) {
  return request('/api/v1/order/confirm', params, 'POST')
}
/**
 * 确认是否有权限跳转健康档案
 */
export function checkValid(params) {
  return request('/api/v1/archive/valid', params, 'GET')
}

/***
 *4.2.14.医生详情历史处方
 * */
export function userHistoryRp(params) {
  return request('/api/v1/prescription/userHistoryRp', params, 'GET')
}

/***
 *4.2.15 支付成功
 */
export function paySuccess(params) {
  return request('/api/v1/order/paySuccess', params, 'GET')
}

/***
 *明星专家
 */
export function startExperts(params) {
  return request('zyApi/api/v1/employee/startExperts', params, 'GET')
}

/***
 *4.2.16添加浏览人数
 */
export function addBrowseNum(params) {
  return request('/api/v1/bizConfig/addBrowseNum', params, 'GET')
}

/***
*进入预约挂号需要验证是否可挂号
memberId
*/
export function findHasError(params) {
  return request('/api/v1/nucleateReg/findHasError', params, 'GET')
}

/***
*要补关系的就诊人
memberId
*/
export function checkRelation(params) {
  return request('/api/v1/patient/checkRelation', params, 'GET')
}

/***
*更新就诊人关系
memberId
*/
export function updateRelation(data) {
  return request('/api/v1/patient/updateRelation', data, 'POST')
}

//保存系统信息
export function saveSystemInfo(data) {
  return request('/api/v1/patient/saveSystemInfo', data, 'POST')
}

//处方PDF下载(非流)
//rxId
export function downloadRxToUrl(data) {
  return request('/api/v1/rx/downloadRxToUrl', data, 'GET')
}

//用户自动更新健康卡
export function autoSyncUserCard(data) {
  return request('/api/v1/patient/autoSyncUserCard', data, 'GET')
}

//在线咨询复诊业务当前队列信息  doctorId()必填 orderId（诊室使用）
export function userQueue(data) {
  return request('/api/v1/clinic/user/queue', data, 'GET')
}

//在线咨询复诊业务验证是否可购买  bizType=    patientId=
export function validateExistClinic(data) {
  return request('/api/v1/clinic/validateExistClinic', data, 'GET')
}
