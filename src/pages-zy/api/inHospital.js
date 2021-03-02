import request from '@/common/request/request.js'
/**
 * 住院一日清单
 * @param {string} patientId		是	就诊人ID
 * @param {string} billType		是	就诊类型 1.门诊 2.住院
 * @param {string} startTime		是	开始时间
 * @param {string} endTime		是	结束时间
 * @param {string} cardType		是	卡类型
 * @param {string} itemType		是	费用类别
 * @returns {Promise<object>} res
 */
export function findBill(params){
  return request("zyApi/api/v1/zyList/findBill", params, "GET")
}

/**
 * 住院记录
 * @param {string} patientId		是	就诊人ID
 * @param {string} inSno		住院号
 * @param {string} startTime	开始时间
 * @param {string} endTime		结束时间
 * @param {string} inStatus		住院状态
 * @returns {Promise<object>} res
 */

export function findZyList(params){
  return request("zyApi/api/v1/zyList/findZyList", params, "GET")
}

/**
 * 住院押金
 * @param {string} payment 支付方式:WX-微信，UNION-银联
 * @param {string} patientId		是	就诊人ID
 * @param {string} doctorId		医生ID
 * @param {string} reserveId	预约时段ID
 * @param {string} payCard		银行卡号：银联支付是必传
 * @returns {Promise<object>} res
 */
export function rechargeIh(params){
  return request("zyApi/api/v1/order/rechargeIh", params, "POST")
}

/**
 * 住院余额
 * @param {string} patientId		是	就诊人ID
 * @returns {Promise<object>} res
 */
export function moneyBay(params){
  return request("zyApi/api/v1/order/moneyBay", params, "GET")
}

/**
 * 住院缴费记录
 * @param {string} patientId		是	就诊人ID
 * @param {string} type	类型：0线上缴费，1线下缴费；
 * @returns {Promise<object>} res
 */

export function zyRecord(params){
  return request("zyApi/api/v1/order/zyRecord", params, "GET")
}

/**
 * 医生排班
 * @param {string} startTime		排班时间-起
 * @param {string} endTime	排班时间-止
 * @param {dept} endTime	科室
 * @returns {Promise<object>} res
 */
export function userSearchRota(params){
  return request("zyApi/api/v1/rota/userSearchRota", params, "GET")
}

/**
 * 医生详情
 * @param {string} id		医生id
 * @returns {Promise<object>} res
 */
export function doctorIntro(params){
  return request("zyApi/api/v1/employee/doctorIntro", params, "GET")
}

