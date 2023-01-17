import request from '@/common/request/request.js'
/**
 * 患者端核酸预约登记
 */
export function userNucleateReg(data) {
  return request('/api/v1/nucleateReg/userNucleateReg', data, 'POST')
}

/**
 * 验证是否有未付款
 */
export function checkRegNum(data) {
  return request('/api/v1/nucleateReg/checkRegNum', data, 'POST')
}

/**
 * 查询剩余数量
 * @param {String} date 日期
 * @param {range} date 时间段
 */
export function findRegNum(params) {
  return request('/api/v1/nucleateReg/findRegNum', params, 'GET')
}
/**
 * 创建订单
 * @param {String} userId
 * @param {String} bizId 业务ID：(服务订单必填)
 * @param {String} bizType 业务类型：//RESERVE("预约")，DISPOSAL("医嘱")
 * @param {boolean} agreement 是否同意
 */
export function submitAppointment(data) {
  return request('/api/v1/order/submit', data, 'POST')
}
/**
 * 用户预约记录
 */
export function userRegList(params) {
  return request('/api/v1/nucleateReg/userRegList', params, 'GET')
}

/**
 * 预约记录详情
 * @param {String} id 主键id
 */
export function userRegDetail(params) {
  return request('/api/v1/nucleateReg/userRegDetail', params, 'GET')
}

/**
 * 获取当前科室
 */
export function getNucleateDept(params) {
  return request('/api/v1/nucleateReg/getNucleateDept', params, 'GET')
}

/**
 * 获取预约日期排班
 * @param {String} regDate 预约日期yyyy-MM-dd
 * @param {String} deptId 科室id
 */
export function getPriceAndTime(params) {
  return request('/api/v1/nucleateReg/getPriceAndTime', params, 'GET')
}

/**
 * 问题列表获取
 */
export function getQuesList(params) {
  return request('/api/v1/nucleateReg/getQuesList', params, 'GET')
}

/**
 * 流调表提交
 */
export function fillInBasins(data) {
  return request('/api/v1/nucleateReg/fillInBasins', data, 'POST')
}

/**
 * 核酸预约支付成功详情
 */
export function findPayInfoById(data) {
  return request('/api/v1/nucleateReg/findPayInfoById', data, 'GET')
}

/**
 * 获取核酸预约号源
 * params regDate   deptId   docId  scheduleNo  shiftCode  shiftName
 */
export function getTimeRangeInfo(data) {
  return request('/api/v1/nucleateReg/getTimeRangeInfo', data, 'GET')
}
