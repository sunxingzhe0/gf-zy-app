import request from '@/common/request/request.js'
import apiV from './config.js'

/**
 * 体检预约
 * @param {String} payment 支付方式:WX-微信，UNION-银联
 * @param {String} patientId  就诊人
 * @param {String} packageNo  套餐编号
 * @param {String} reserveDate  预约日期
 * @param {String} phone  预约手机号
 * @param {String} payCard  银行卡号：银联支付时必传
 * @returns {Promise<object>} res
 */
export function regTj(params) {
  return request('zyApi/api/v1/tj/regTj', params, 'POST')
}

/**
 * 体检套餐列表
 * @param {String} orgPlatCode 支付方式:WX-微信，UNION-银联
 * @returns {Promise<object>} res
 */
export function tjPackageList(params) {
  return request('zyApi/api/v1/tj/tjPackageList', params, 'GET')
}

/**
 * 3.6.3获取院区信息
 * @returns {Promise<object>} res
 */
export function getHospInfo(params) {
  return request('zyApi/api/v1/tj/getHospInfo', params, 'GET')
}

/**
 * 3.6.4体检项目信息|排班信息
 * @returns {Promise<object>} res
 */
export function getTjPackageInfo(params) {
  return request('zyApi/api/v1/tj/getTjPackageInfo', params, 'GET')
}

/**
 * 3.6.5体检记录
 * @param {String} patientId 就诊人id
 * @param {String} type 0:已预约/1:已体检/2:已取消
 * @returns {Promise<object>} res
 */
export function getTjRegRecordList(params) {
  return request('zyApi/api/v1/tj/getTjRegRecordList', params, 'GET')
}

/**
 * 3.6.7体检记录统计
 * @param {String} patientId 就诊人id
 * @param {String} type 统计类型(0:体检记录/1:体检缴费)
 * @returns {Promise<object>} res
 */
export function countTjRecord(params) {
  return request('zyApi/api/v1/tj/countTjRecord', params, 'GET')
}

/**
 * 3.6.8体检记录详情
 * @param {String} patientId 就诊人id
 * @param {String} billNo 单据号
 * @returns {Promise<object>} res
 */
export function getTjRecordInfo(params) {
  return request('zyApi/api/v1/tj/getTjRecordInfo', params, 'GET')
}

/**
 * 体检缴费记录(包含详情)
 * @param {String} patientId 就诊人id
 * @param {String} type 0:未缴费/1:已缴费/2:已退费
 * @returns {Promise<object>} res
 */
export function getTjPayRecordList(params) {
  return request('zyApi/api/v1/tj/getTjPayRecordList', params, 'GET')
}

/**
 * 3.6.10体检缴费
 * @param {String} payment 支付方式:WX-微信，UNION-银联
 * @param {String} patientId  就诊人
 * @param {String} billNos  his单据号集合
 * @param {String} payCard  银行卡号：银联支付时必传
 * @returns {Promise<object>} res
 */
export function tjPayFee(params) {
  return request('zyApi/api/v1/tj/tjPayFee', params, 'POST')
}

/**
 * 3.6.11体检报告列表
 * @param {String} patientId  就诊人
 * @returns {Promise<object>} res
 */
export function tjReportList(params) {
  return request('zyApi/api/v1/tj/tjReportList', params, 'GET')
}

/**
 * 3.6.12体检结果项目及明细
 * @param {String} checkupNo  体检单号
 * @returns {Promise<object>} res
 */
export function tjResultItem(params) {
  return request('zyApi/api/v1/tj/tjResultItem', params, 'GET')
}

/**
 * 3.6.16体检报告基本信息
 * @param {String} checkupNo  体检单号
 * @param {String} patientId 就诊人id
 * @returns {Promise<object>} res
 */
export function tjReportInfo(params) {
  return request('zyApi/api/v1/tj/tjReportInfo', params, 'GET')
}

/**
 * 查询上次手机号
 * @param {String} patientId  就诊人
 * @param {String} packageNo  套餐编码
 * @returns {Promise<object>} res
 */
export function getLastPhone(params) {
  return request('zyApi/api/v1/tj/getLastPhone', params, 'GET')
}

/**
 * 报告查询汇总分析
 * @param {String} patientId  就诊人
 * @param {String} checkupNo  体检流水号
 * @returns {Promise<object>} res
 */
export function getAnalysis(params) {
  return request('zyApi/api/v1/tj/getAnalysis', params, 'GET')
}

/**
 * 体检挂号须知/温馨提示
 * @param {String} type 0.挂号，1.体检
 * @returns {Promise<object>} res
 */
export function getTjIns(params) {
  return request('zyApi/api/v1/notice/getTjIns', params, 'GET')
}
