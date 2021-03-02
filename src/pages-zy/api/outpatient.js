import request from '@/common/request/request.js'
import apiV from './config.js'

/**
 * 检查报告详情
 * @param {String} visitNo 就诊流水号
 * @returns {Promise<object>} res
 */
export function inspect(params){
  return request("zyApi/api/v1/record/inspect", params, "GET")
}
/**
 * 检查报告
 * @param {object} params
 * @returns {Promise<object>} res
 */
export function inspectList(params){
  return request("zyApi/api/v1/record/inspectList", params, "GET")
}

/**
 * 检验报告
 * @param {object} params
 * @returns {Promise<object>} res
 */
export function examineList(params){
  return request("zyApi/api/v1/record/examineList", params, "GET")
}

/**
 * 检验报告-检验明细
 * @param {object} params
 * @returns {Promise<object>} res
 */
export function examine(params){
  return request("zyApi/api/v1/record/examine", params, "GET")
}

/**
 * 检验报告-详情
 * @param {object} params
 * @returns {Promise<object>} res
 */
export function examineDetail(params){
  return request("zyApi/api/v1/record/examineDetail", params, "GET")
}

/**
 * 报告查询
 * @param {String} type  检查/检验（可选/可不填）
 * @param {String} startTime  开始时间
 * @param {String} endTime  结束时间
 * @returns {Promise<object>} res
 */
export function recordStatistics(params){
  return request("zyApi/api/v1/record/recordStatistics", params, "GET")
}

/**
 * 获取预约挂号科室(合川二院)
 * @param {String} regtype  挂号类型：1-挂号，2-预约挂号
 * @param {String} day  预约日期,非预约则为空,YYYY-MM-DD
 * @param {String} rigstertype  挂号种类：普通、专家等，为空表示所有
 * @returns {Promise<object>} res
 */
export function findDept(params){
  return request("zyApi/api/v1/zyList/findDept", params, "GET")
}

/**
 * 获取号源(合川二院)
 * @param {String} regtype  挂号类型：1-挂号，2-预约挂号
 * @param {String} day  预约日期,非预约则为空,YYYY-MM-DD
 * @param {String} rigstertype  挂号种类：普通、专家等，为空表示所有
 * @param {String} deptid 科室ID
 * @param {String} feetype 费别（传中文）
 * @param {String} asrowid 号码
 * @returns {Promise<object>} res
 */
export function findHy(params){
  return request("zyApi/api/v1/zyList/findHy", params, "GET")
}

/**
 * 门诊预约
 * @param {string} payment    支付方式:WX-微信，UNION-银联
 * @param {string} patientId	就诊人ID
 * @param {string} doctorId		医生ID
 * @param {string} reserveId	预约时段ID(合川二院版传号源id)
 * @param {string} payCard		银行卡号：银联支付是必传
 * @param {string} fee		费用(合川二院版必传)
 * @param {string} noType		号源类型(合川二院版必传)
 * @param {string} deptId		挂号科室id(合川二院版必传)
 * @param {string} patientDate		预约日期(合川二院版必传)
 * @param {string} rangeTime		预约时段(合川二院版,有则必传)
 * @returns {Promise<object>} res
 */
export function regNo(params){
  return request(`zyApi/api/${apiV}/order/regNo`, params, "POST")
}

/**
 * 门诊缴费
 * @param {string} payment    支付方式:WX-微信，UNION-银联
 * @param {string} patientId	就诊人ID
 * @param {Object} doctorId		items
 * @returns {Promise<object>} res
 */
export function mzPayment(params){
  return request(`zyApi/api/${apiV}/order/mzPayment`, params, "POST")
}

/**
 * 门诊缴费-待支付
 * @param {String} patientId 就诊人ID
 * @param {String} cardId 就诊人ID(通过二维码进入该页面传)
 * @returns {Promise<object>} res
 */
export function mzRpWaitPayData(params){
  return request(`zyApi/api/${apiV}/order/mzRpWaitPayData`, params, "GET")
}

/**
 * 门诊缴费-已完成
 * @param {String} patientId 就诊人ID
 * @returns {Promise<object>} res
 */
export function mzRpPaydData(params){
  return request(`zyApi/api/v1/order/mzRpPaydData`, params, "GET")
}

/**
 * 门诊缴费-已退费
 * @param {String} patientId 就诊人ID
 * @returns {Promise<object>} res
 */
export function mzRpRefundData(params){
  return request('zyApi/api/v1/order/mzRpRefundData', params, "GET")
}

/**
 * 3.5.6.门诊缴费详情信息
 * @param {String} patientId 就诊人ID
 * @param {Boolean} type 类型：0，待支付；1，已完成；2，已退款；
 * @param {String} billNo 处方号
 * @param {String} visitNo 就诊流水号
 * @returns {Promise<object>} res
 */
export function mzRpDetail(params){
  return request(`zyApi/api/${apiV}/order/mzRpDetail`, params, "GET")
}

/**
 * 挂号记录及详情
 * @param {String} patientId 就诊人ID
 * @returns {Promise<object>} res
 */
export function registrationRecord(params){
  return request(`zyApi/api/${apiV}/order/registrationRecord`, params, "GET")
}

/**
 * 订单-手动未支付执行取消
 * @param {String} orderNo 商户订单号
 * @returns {Promise<object>} res
 */
export function payCancel(params){
  return request('zyApi/api/v1/order/cancel', params, "GET")
}

/**
 * 订单-手动支付成功回调
 * @param {String} orderNo 商户订单号
 * @returns {Promise<object>} res
 */
export function payNotify(params){
  return request('zyApi/api/v1/order/payNotify', params, "GET")
}

/**
 * 获取预约科室列表
 * @param {String} orgId 机构id
 * @returns {Promise<object>} res
 */
export function getDeptList(params){
  return request('/api/v1/appointment/getDeptList', params, "GET")
}
/**
 * 根据条件查询科室
 * @param {String} orgId 机构id
 * @param {String} name 医生名字或者科室名称
 * @returns {Promise<object>} res
 */
export function getDeptByCondition(params){
  return request('/api/v1/appointment/getDeptByCondition', params, "GET")
}
/**
 * 获取诊间预约数据
 * @param {String} orgId 机构id
 * @param {String} deptId 科室id
 * @param {String} memberId 成员id
 * @returns {Promise<object>} res
 */
export function getReserveInfo(params){
  return request('/api/v1/appointment/getReserveInfo', params, "GET")
}
/**
 * 获取科室详细信息
 * @param {String} deptId 科室id
 * @returns {Promise<object>} res
 */
export function getDeptDetail(params){
  return request('/api/v1/appointment/getDeptDetail', params, "GET")
}

/**
 * 根据科室获取医生列表
 * @param {String} deptId 科室id
 * @param {String} orgId 机构id
 * @returns {Promise<object>} res
 */
export function getDoctorList(params){
  return request('/api/v1/appointment/getDoctorList', params, "GET")
}

/**
 * 获取预约医生信息
 * @param {String} deptId 科室id
 * @param {String} orgId 机构id
 * @param {String} doctorId 医生id（不是必填）
 * @param {String} beginDate 如果获取全部 则传递起始时间区间；若获取一天的信息，则起始时间相同
 * @param {String} endDate 如果获取全部 则传递起始时间区间；若获取一天的信息，则起始时间相同
 * @param {String} resource 来源 1、web 2、小程序
 * @returns {Promise<object>} res
 */
export function getReverseDocInfo(params){
  return request('/api/v1/appointment/getReverseDocInfo', params, "GET")
}

/**
 * 获取医生排班分时数据
 * @param {String} deptId 科室id
 * @param {String} orgId 机构id
 * @param {String} doctorId 医生id（不是必填）
 * @param {String} visitDate 预约时间
 * @returns {Promise<object>} res
 */
export function getDocFsInfo(params){
  return request('/api/v1/appointment/getDocFsInfo', params, "GET")
}
