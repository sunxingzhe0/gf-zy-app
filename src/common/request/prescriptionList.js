import request from './request'

//获取处方列表
export const getPrescriptionList = params => request('/api/v1/prescription/rpList', params, 'GET');
//获取订单详情
export const getOrderInfo = params => request('/api/v1/order/doctor/detail', params, 'GET');
//获取处方痕迹
export const getHisTory = params => request('/api/v1/prescription/rpTrace', params, 'GET');
//获取模板信息
export const getTemplateList = params => request('/api/v1/prescription/webPageRpTemplateList', params, 'GET');
//药品列表模糊查询
export const getQueryList = params => request('/api/v1/orgDrug/listDrug', params, 'GET');
//药品匹配药房
export const drugInPharmacy = params => request('/api/v1/drug/listDrug', params, 'GET');
//获取单药品详情
export const getDrugInfo = params => request('/api/v1/drug/singleDrug', params, 'GET');
//新增、删除、编辑药品
export const addAndEdit = params => request('/api/v1/prescription/editRp', params, 'POST');
//新增处方
export const addPrescription = params => request('/api/v1/prescription/saveRp', params, 'POST');
//删除处方
export const delPrescription = params => request('/api/v1/prescription/delRp', params, 'POST');
//撤回处方
export const withdraw = params => request('/api/v1/prescription/withdrawRp', params, 'POST');
//提交处方
export const submitRp = params => request('/api/v1/prescription/submitRp', params, 'POST');
//处方模板详情
export const getModelInfo = params => request('/api/v1/prescription/singleRpTemplate', params, 'GET');
//病例详情
export const findDiseaseByOrderId = params => request('/api/v1/etcDisease/findDiseaseByOrderId', params, 'GET');
//诊断名关键字查询
export const diagnosisKeywordSearch = params => request('/api/v1/diagnosis/keywordSearch', params, 'GET');
//新增处方模板
export const saveRpTemplate = params => request('/api/v1/prescription/saveRpTemplate', params, 'POST');
//查询诊断信息
export const findDiagnosisInClinic = params => request('/api/v1/diagnosis/findDiagnosisInClinic', params, 'GET');
//由处方号获取处方详情
export const singleRp = params => request('/api/v1/prescription/singleRp', params, 'GET');
//单位列表查询
export const listUnit = params => request('/api/v1/drug/listUnit', params, 'GET');












