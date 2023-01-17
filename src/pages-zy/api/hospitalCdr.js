import request from '@/common/request/request.js'

// ————————————————————————————————住院————————————————————————————————

// 住院记录列表
export function hospRecordList(params) {
  return request('/api/v1/hosp/inhosp/list',params,'GET')
}

// 住院病人信息
export function hospPatientList(params) {
  return request('/api/v1/hosp/inhosp/patient',params,'GET')
}

// 诊断记录列表
export function diagInfoList(params) {
  return request('/api/v1/hosp/listDiagInfos',params,'GET')
}

// 检查记录列表
export function examInfoList(params) {
  return request('/api/v1/hosp/listExamInfos',params,'GET')
}

// 费用列表
export function constList(params) {
  return request('/api/v1/hosp/listFeeBills',params,'GET')
}
// 费用总额
export function feeTotal(params) {
  return request('/api/v1/hosp/inhosp/listInHospFeeTotal',params,'GET')
}
// 住院医嘱列表
export function hospOrderInfoList(params) {
  return request('/api/v1/hosp/inhosp/listHospOrderInfos',params,'GET')
}

// 检验记录列表
export function labInfoList(params) {
  return request('/api/v1/hosp/listLabInfos',params,'GET')
}