import request from './request'
// 3.7.历史消息接口
export const historyMessage = params =>
  request('/api/v1/im/historyMessage', params, 'GET')

/**
 * 4.4.6.邀请(接听)视频
 * orderId	string	订单ID
 */
export const video = params =>
  request('/api/v1/clinic/user/video', params, 'GET')

/**
 * 4.5.1.7就诊信息
 * orderId	medicalId  就诊记录ID
 */
export const getMedicalInfo = params =>
  request('/api/v1/archive/getMedicalInfo', params, 'GET')

/**
 * 判断用户在会话中是否说过话
 * @param {object} params
 * @param {string} params.sessionId - 会话ID
 * @param {string} params.userId - 用户ID
 * @returns {Promise<boolean>} 是否说过话
 */

export const sessionUserSpeak = params =>
  request('/api/v1/im/sessionUserSpeak', params, 'GET')
/**
 * 判断医生与患者是否接通过视频
 * @orderId {String}  订单号
 * @returns {AxiosPromise}
 */
export const getVideoStatus = params =>
  request('/api/v1/clinic/getVideoStatus', params, 'GET')

/**
 * 导诊-获取推荐诊室
 * @description {String}  病情描述
 * @patientInformation {Object}  基本信息
 */
export const getRecommendDept = data =>
  request('/api/v1/triage/getRecommendDept', data, 'POST')

/**
 * 导诊-添加导诊消息
 */
export const addMessage = data =>
  request('/api/v1/triage/addMessage', data, 'POST')

/**
 * 通知web端状态socket状态
 */
export const updateUserOnlineState = params =>
  request('/api/v1/im/updateUserOnlineState', params, 'GET')

/**
 * 获取用户socket状态
 */
export const getUserOnlineState = params =>
  request('/api/v1/im/getUserOnlineState', params, 'GET')
