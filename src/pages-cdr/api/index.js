import request from '@/common/request/request.js'

//就诊记录列表
export function recordsList(params) {
  return request('/api/v1/archive/webMedicalList',params,'GET')
}

//就诊首页横条信息
export function findRelaInfo(params) {
  return request('/cdr-proxy/api/v1/homePage/findRelaInfo',params,'GET')
}

//获取患者信息
export function personInfo(params) {
  return request('/cdr-proxy/api/v1/homePage/getPersonInfo',params,'GET')
}

//病人个人记录
export function patientRecord(params) {
  return request('/cdr-proxy/api/v1/homePage/patientRecord',params,'GET')
}

//门诊首页
export function outpatientServList(params) {
  return request('/cdr-proxy/api/v1/treatmentView/outpatientServList',params,'GET')
}

// --------------------------------门诊处方-----------------------

//门诊处方
export function mzPrescDatalist(params) {
  return request('/cdr-proxy/api/v1/presc/findMzPrescDatalist',params,'GET')
}

// --------------------------------诊断-----------------------

//获取诊断信息
export function diagnosisList(params) {
  return request('/cdr-proxy/api/v1/diagnose/diagnosisList',params,'GET')
}

//单个诊断信息
export function diagnoseBySno(params) {
  return request('/cdr-proxy/api/v1/diagnose/findDiagnoseBySno',params,'GET')
}

// --------------------------------病例文书-----------------------

//获取病历文书
export function caseDoc(params) {
  return request('/cdr-proxy/api/v1/diseaseText/findDisText',params,'GET')
}
//病历文书首页
export function parsCaseDoc(params) {
  return request('/cdr-proxy/api/v1/parsing/findParsingdata',params,'GET')
}
//病历文书列表
export function dataCaseDoc(params) {
  return request('/cdr-proxy/api/v1/parsing/finddata',params,'GET')
}
//体检病历文书
export function tjCaseDoc(params) {
  return request('/cdr-proxy/api/v1/diseaseText/findZyDisDetail',params,'GET')
}
// --------------------------------检验-----------------------

// 获取labSno流水号
export function labSnoList(params) {
  return request('/cdr-proxy/api/v1/lab/leftList',params,'GET')
}
// 获取检验项目详情
export function labDetailList(params) {
  return request('/cdr-proxy/api/v1/lab/rightDetail',params,'GET')
}

// --------------------------------检查-----------------------

// 获取examSno
export function examSnoList(params) {
  return request('/cdr-proxy/api/v1/examine/list',params,'GET')
}
// 获取检查内容详情
export function examDetailList(params) {
  return request('/cdr-proxy/api/v1/examine/detail',params,'GET')
}

// --------------------------------费用-----------------------
//费用明细集合
export function costListInfo(params) {
  return request('/cdr-proxy/api/v1/expense/costListInfo',params,'GET')
}

// --------------------------------住院医嘱-----------------------
//住院医嘱
export function zyHospitalInfo(params) {
  return request('/cdr-proxy/api/v1/advice/hospitalAdviceInfo',params,'GET')
}

// --------------------------------护理-----------------------
//护理信息列表
export function nurseDatao(params) {
  return request('/cdr-proxy/api/v1/nurse/findNurseData',params,'GET')
}