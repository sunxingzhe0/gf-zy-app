import request from './request'

/**
 * tab {String} CONSULT : 在线咨询；REPEAT_CLINIC : 在线复诊；CARRYON_PRESC : 慢病续方
 * currentNum {Number} 当前页码
 * pageSize {NUmber} 每页数量
 * field {String}  create_time
 * sorted {String}  desc / asc
 */
export const userSessionData = params => request('/api/v1/im/userSessionData', params, 'GET');

/**
 * 4.4.2.诊室业务信息
 * orderId {String} 订单ID
 */
export const clinicBizInfo = params => request('/api/v1/clinic/bizInfo', params, 'GET');

/**
 * 1.2.快递单号物流信息查询
 * expressId {String} 	物流公司Id
 * courierNumber {String} 物流单号
 */
export const logisticsTrends = params => request('/api/v1/express/logisticsTrends', params, 'GET');

/**
 * 6.4.3.1.3病历详情
 * orderId	string	是订单id
 */
export const findDiseaseByOrderId = params => request('/api/v1/etcDisease/findDiseaseByOrderId', params, 'GET')

/**
 * 4.4.7.诊室信息
 * orderId	string	订单ID
 */
export const clinicInfo = params => request('/api/v1/clinic/info', params, 'GET')

/***
*4.5.3.5.物流信息
* id：物流ID
*/
export const express = params => request('/api/v1/express/get', params, 'GET')

/**
 * 4.4.5查看诊断信息
 * diagId	string	业务ID(诊断id)
 */
export const findDiagContentById = params => request('/api/v1/diagnosis/findDiagContentById', params, 'GET')
