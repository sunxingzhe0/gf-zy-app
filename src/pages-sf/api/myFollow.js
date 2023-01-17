import sfRequest from './sfRequest'
/**
 * 随访单和记录列表  （sign:1）
 * @param {String} token
 */
export function getPatientCorrespondenceByCardNo(params) {
  return sfRequest(
    '/api/v1/mobile/getPatientCorrespondenceByCardNo',
    params,
    'GET',
  )
}

/**
 * 满意度调查和记录列表  （sign:1）
 * @param {String} token
 */
export function getPatientQuestionnaireByCardNo(params) {
  return sfRequest(
    '/api/v1/mobile/getPatientQuestionnaireByCardNo',
    params,
    'GET',
  )
}

/**
 * 随访单详情
 * @param {String} token
 */
export function getSheetDetailById(params) {
  return sfRequest('/api/v1/mobile/getSheetDetailById', params, 'GET')
}

/**
 * 满意度问卷详情
 * @param {String} token
 */
export function getQuestionnaireDetailById(params) {
  return sfRequest('/api/v1/mobile/getQuestionnaireDetailById', params, 'GET')
}
/**
 * 保存随访单
 * @param {String} token
 */
export function saveSel(params) {
  return sfRequest('/api/v1/mobile/saveSel', params, 'POST')
}
