import request from '@/common/request/request.js'
import apiV from './config.js'

/**
 * 获取就诊人列表
 * @param {String} token
 * @returns {Promise<object>} res
 */
export function patientList(params) {
  return request('zyApi/api/v1/patient/list', params, 'GET')
}
/**
 * 获取就诊人列表其他
 * @param {String} token
 * @param {String} payType 0 门诊，1 住院
 * @returns {Promise<object>} res
 */
export function otherPatient(params) {
  return request('zyApi/api/v1/order/otherPatient', params, 'GET')
}

/**
 * 预约缴费列表
 * @param {string} patientId 就诊人id
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} type 预约类型，0表示预约挂号，1表示预约体检
 * @param {string} currentNum 当前页码
 * @param {string} pageSize 每页数量
 * @returns {Promise<object>} res
 */
export function appointmentData(params) {
  return request('zyApi/api/v1/order/appointmentData', params, 'GET')
}

/**
 * 其他缴费列表
 * @param {string} patientId 就诊人id
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} type 预约类型，0表示门诊，1表示住院，2表示体检
 * @returns {Promise<object>} res
 */
export function otherData(params) {
  return request('zyApi/api/v1/order/otherData', params, 'GET')
}

/**
 * 我的预约列表
 * @param {string} patientId 就诊人id
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} type 预约类型，0表示预约挂号，1表示预约体检
 * @param {string} currentNum 当前页码
 * @param {string} pageSize 每页数量
 * @returns {Promise<object>} res
 */
export function myAppointment(params) {
  return request(`zyApi/api/${apiV}/order/myAppointment`, params, 'GET')
}

/**
 * 我的预约详情
 * @param {string} orderId 订单号
 * @returns {Promise<object>} res
 */
export function appointmentDetail(params) {
  return request(`zyApi/api/${apiV}/order/appointmentDetail`, params, 'GET')
}

/**
 * 取消预约
 * @param {string} orderNo 商户订单号
 * @returns {Promise<object>} res
 */
export function orderRefund(params) {
  return request(`zyApi/api/v1/order/orderRefund`, params, 'GET')
}

/**
 * 门诊就诊记录(门诊挂号记录列表)
 * @param {string} cardNo 就诊卡号
 * @param {string} beginDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} cardType 卡类型
 * @returns {Promise<object>} res
 */
export function outpatientRecord(params) {
  return request('zyApi/api/v1/record/outpatientRecord', params, 'GET')
}

/**
 * 住院就诊记录|住院病历
 * @param {string} cardNo 就诊卡号
 * @param {string} beginDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} cardType 卡类型
 * @returns {Promise<object>} res
 */
export function hospitalRecord(params) {
  return request('zyApi/api/v1/record/hospitalRecord', params, 'GET')
}

/**
 * 体检报告
 * @param {string} cardNo 就诊卡号
 * @param {string} beginDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} cardType 卡类型
 * @returns {Promise<object>} res
 */
export function phyList(params) {
  return request('zyApi/api/v1/record/phyList', params, 'GET')
}

/**
 * 门诊病历-详情
 * @param {string} cardNo 就诊卡号
 * @param {string} visitNo 就诊流水号
 * @param {string} cardType 卡类型
 * @returns {Promise<object>} res
 */
export function outpatient(params) {
  return request('zyApi/api/v1/record/outpatient', params, 'GET')
}

/**
 * 评价信息入库
 * @param {string} patientId 就诊人
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @param {string} inSno 流水号
 * @param {string} inStatus 住院状态
 * @returns {Promise<object>} res
 */
export function findEvaluateListZy(params) {
  return request('zyApi/api/v1/evaluate/findEvaluateList', params, 'GET')
}

/**
 * 添加评价
 * @param {string} diagResult 诊疗效果
 * @param {string} serviceAttitude 服务态度
 * @param {string} hospitalEnvironment 就医环境
 * @param {string} content 评价内容
 * @returns {Promise<object>} res
 */
export function addEvaluatezy(params) {
  return request('zyApi/api/v1/evaluate/addEvaluate', params, 'POST')
}

/**
 * 我的医生
 * @param {string} patientId 就诊人id
 * @param {string} searchKeywords
 * @returns {Promise<object>} res
 */
export function myRegDocList(params) {
  return request('/api/v1/appointment/myRegDocList', params, 'GET')
}
/**
 * 来院人员信息登记
 * @param {String} name 姓名
 * @param {String} idCard 身份证号
 * @param {String} relatives 陪同人员
 * @param {String} phone  手机号
 * @param {Boolean} sex 性别true:女，false:男
 * @param {String} reason 原因1.门/急诊就诊2.住院3.探视4.办公5.其他
 * @param {Boolean} no1 一周内有无发热true:有，false:无
 * @param {String} value 体温
 * @param {String} remark 备注
 * @returns {Promise<object>} res
 */
export function outsiderRegister(params) {
  return request('zyApi/api/v1/outsider/outsiderRegister', params, 'POST')
}
/**
 * 体温登记
 * @param {String} phone 电话
 * @param {String} value 温度
 * @param {String} remark 备注
 * @returns {Promise<object>} res
 */
export function bodyTemperature(params) {
  return request('zyApi/api/v1/outsider/bodyTemperature', params, 'POST')
}

/**
 * 查看凭证
 * @param {String} phone 电话
 * @returns {Promise<object>} res
 */
export function certificate(params) {
  return request('zyApi/api/v1/outsider/certificate', params, 'GET')
}

/**
 * 体温查询
 * @param {String} phone 电话
 * @returns {Promise<object>} res
 */
export function outsiderCheck(params) {
  return request('zyApi/api/v1/outsider/check', params, 'GET')
}

/**
 * 3.4.查询体检须知和医院介绍
 * @returns {Promise<object>} res
 */
export function queryOrgData(params) {
  return request('zyApi/api/v1/introduce/queryOrgData', params, 'GET')
}

/**
 * 我的预约线上预约
 * @param {string} userId  用户ID
 * @param {string} orgId 机构ID
 * @param {string} orderType 业务类型：CONSULT("在线咨询"), REPEAT_CLINIC("在线复诊"), CARRYON_PRESC("慢病续方")
 * @param {string} orderStatus 订单状态：UNPAID("待付款"),PAID("已支付"),WAIT_TREAT("待接诊"),IN_TREAT("接诊中"),WAIT_TAKE("待自提"),WAIT_SEND("待发货"),WAIT_RECEIVE("待收货"),TO_EVALUATE("待评价"),FINISHED("已完成"),CLOSED("已关闭"),
 * @param {string} inStatus 住院状态
 * @returns {Promise<object>} res
 */
export function onlineList(params) {
  return request('/api/v1/order/list', params, 'GET')
}

/**
 * 处置单列表
 * @param {string} memberId  就诊人ID
 * @param {string} userType //类型 (1:未缴费 2:未执行 3:已执行 4:已退费)
 * @returns {Promise<object>} res
 */
export function disposeList(params) {
  return request('/api/v1/dispose/userList', params, 'GET')
}

/**
 * 首页明星专家
 * @param {string} searchKeywords  关键字内容
 * @returns {Promise<object>} res
 */
export function startExperts(params) {
  return request('zyApi/api/v1/employee/startExperts', params, 'GET')
}

/**
 * 就诊记录（服务类型：CONSULT咨询,REPEAT_CLINIC-复诊,CARRYON_PRESC-续方）
 * @param {string} userId  用户ID
 * @param {string} orgId  机构ID
 * @param {string} memberIds  档案成员ID
 * @param {string} bizType //服务类型：CONSULT咨询,REPEAT_CLINIC-复诊,CARRYON_PRESC-续方
 * @returns {Promise<object>} res
 */
export function webMedicalList(params) {
  return request('/api/v1/archive/webMedicalList', params, 'GET')
}

/**
 * 门诊病历详情
 * @param {string} patientId  就诊人id
 * @param {string} cardType  卡类型
 * @param {string} visitNo  就诊流水号 2
 * @returns {Promise<object>} res
 */
export function outpatientRecordInfo(params) {
  return request('zyApi/api/v1/record/outpatient', params, 'GET')
}

/**
 * 患者端提交意见反馈
 * @param {string} name  姓名
 * @param {string} reason  反馈原因
 * @param {string} backContent  反馈内容
 * @param {string} phone  联系电话
 * @param {Array} picIds  图片id集合
 * @returns {Promise<object>} res
 */
export function submitFeedBack(params) {
  return request('zyApi/api/v1/record/submitFeedBack', params, 'POST')
}

/**
 * 患者端查看历史记录
 * @param {string} currentNum  当前页
 * @param {string} pageSize  每页内容数
 * @returns {Promise<object>} res
 */
export function getHistoryList(params) {
  return request('zyApi/api/v1/record/getHistoryList', params, 'GET')
}

/**
 * 患者端删除历史记录
 * @param {string} id
 * @returns {Promise<object>} res
 */
export function delUserFeedBack(params) {
  return request(
    `zyApi/api/v1/record/delUserFeedBack/${params.id}`,
    params,
    'POST',
  )
}
