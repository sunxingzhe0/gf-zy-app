import request from './request'

/**
 * bizType {String} 业务类型(CONSULT:在线咨询,REPEAT_CLINIC:在线复诊,CARRYON_PRESC:慢病续方)
 * doctorId {String} 医生id
 */
export const findBizTypeState = params => request('/api/v1/bizConfig/findBizTypeState', params, 'GET');

/**
 * bizType {String} 业务类型(CONSULT:在线咨询,REPEAT_CLINIC:在线复诊,CARRYON_PRESC:慢病续方)
 * doctorId {String} 医生id
 * state {Number} 业务类型状态标识(0:离线/1:在线)
 */
export const updateBizTypeState = params => request('/api/v1/bizConfig/updateBizTypeState', params, 'GET');

/**
 * tab {String} CONSULT : 在线咨询；REPEAT_CLINIC : 在线复诊；CARRYON_PRESC : 慢病续方
 * status {String} 诊室状态：WAIT_TREAT 待接诊,IN_TREAT 接诊中,FINISH 结束
 * wayType {String} 业务开展方式，GRAPHIC 图文；VIDEO 视频；PHONE 电话
 * startTime {string} 开始时间,示例：20200101122323
 * endTime {string} 结束时间,示例：20200101122323
 * currentNum {Number} 当前页码
 * pageSize {NUmber} 每页数量
 * field {String}  create_time
 * sorted {String}  desc / asc
 */
export const doctorSessionData = params => request('/api/v1/im/doctorSessionData', params, 'GET');

/**
 * 4.5.1.1健康档案列表页
 * userId	string	否用户ID
 * orgId	string	机构ID
 * memberIds	string	档案成员
 * type	string outer：互联网/inner：院内
 * medicalType	string	否	就诊类型：门诊MZ/住院ZY/体检TJ
  orgId	string		机构ID
  currentNum	string	查询页
  pageSize	string	每页记录数
  field	string	排序字段
  sorted	string	排序规则：desc/asc
 */
export const archives = params => request('/api/v1/archive/list', params, 'GET');

/**
 * 5.2.3.4.接诊
 * orderId	string	订单ID
 */
export const receiving = params => request('/api/v1/clinic/doctor/receiving', params, 'GET');

/**
 * 5.1.8.结束服务
 * orderId	string	订单ID
 */
export const over = params => request('/api/v1/clinic/doctor/over', params, 'GET');

/**
 * 6.1.1.1.3.WEB/APP医生端聊天界面病情描述
 * @param {String} orderId 订单ID
 */
export const orderIllness = params => request('/api/v1/order/illness', params, 'GET')

/**
 * 6.4.8.3.3.常用语列表显示
 */
export const findCommonWords = params => request('/api/v1/phrase/findTemplateData', params, 'GET')

/**
 * 6.4.8.3.1.添加常用语
 */
export const addCommonWords = data => request('/api/v1/phrase/addTemplate', data, 'POST')

/**
 * 6.4.8.3.2.编辑常用语
 */
export const editCommonWords = data => request('/api/v1/phrase/editTemplate', data, 'POST')

/**
 * 6.4.8.3.2.编辑常用语
 */
export const delCommonWords = params => request('/api/v1/phrase/delTemplate', params, 'GET')

/**
 * 3.14.1.医生移动端诊室会话列表NAV统计值
 */
export const doctorSessionNavCount = params => request('/api/v1/im/doctorSessionNavCount', params, 'GET')

/**
 * 5.1.9.医生申请查看就诊记录
 */
export const applyAuth = data => request('/api/v1/archive/applyAuth', data, 'POST')

/**
 * 4.5.1.2.就诊记录详情
 */
export const medicalDetail = params => request('/api/v1/archive/medicalDetail', params, 'GET')

/**
 * 5.1.3诊室中查询诊断信息
 */
export const findDiagnosisInClinic = params => request('/api/v1/diagnosis/findDiagnosisInClinic', params, 'GET')

/**
 * 根据诊断id查询诊断
 */
export const findDiagByDiagId = params => request('/api/v1/diagnosis/findDiagByDiagId', params, 'GET')
/**
 * 保存临时诊断
 * @param {findDiagnosisInClinicResponse} data
 */
export const saveTemporaryDiag = (params,data) => request('/api/v1/diagnosis/saveTemporaryDiag', params, 'POST','json',data)

/**
 * @typedef {object} childDtos
 * @property {string} prefixName - 子诊断前缀
 * @property {string} diagnosisName - 子诊断名
 * @property {string} suffixName - 子诊断后缀
 * @property {string} indexCode - 同级索引
 *
 * 提交诊断
 * @param {object} params
 * @param {string} params.orderId - 订单id
 * @param {string} params.medicalId - 就诊记录id
 * @param {object} data
 * @param {string} data.diagnosisType - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @param {string} data.prefixName - 前缀
 * @param {string} data.diagnosisName - 诊断名
 * @param {string} data.suffixName - 后缀
 * @param {number} data.indexCode - 同级索引
 * @param {number} data.mainDiagnosis - 主索引标识(0:不是/1:主索引)
 * @param {childDtos[]} data.childDtos
 * @returns {Promise<string>} 返回诊断id
 */
export const submitDiagnosis = (params,data) => request('/api/v1/diagnosis/submitDiagnosis', params, 'POST','json',data)

/**
 * @typedef {object} childDtos
 * @property {string} prefixName - 子诊断前缀
 * @property {string} diagnosisName - 子诊断名
 * @property {string} suffixName - 子诊断后缀
 * @property {number} indexCode - 同级索引
 *
 * @typedef {object} dtoList
 * @property {string} id
 * @property {string} diagnosisType - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @property {string} prefixName - 前缀
 * @property {string} diagnosisName - 诊断名
 * @property {string} suffixName - 后缀
 * @property {string} indexCode - 同级索引
 * @property {string} mainDiagnosis - 主索引标识(0:不是/1:是)
 * @property {childDtos[]} childDtos
 *
 * @typedef {object} historyTemp
 * @property {number} index
 * @property {string} diagTime - 诊断时间
 * @property {string} deptName - 科室
 * @property {string} diagnosisId
 * @property {dtoList[]} dtoList
 *
 * @typedef {object} commonTemp
 * @property {number} index
 * @property {string} diagType - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @property {string} diagName - 诊断名
 * @property {string} prefixName - 前缀
 * @property {string} suffixName - 后缀
 *
 * @typedef {object} importDiagTempResponse
 * @property {historyTemp} historyTemp - 历史诊断模板
 * @property {commonTemp[]} commonTemp - 常用模板列表
 *
 * 导入诊断列表
 * @param {object} params
 * @param {string} params.memberId - 患者id
 * @param {string} [params.startTime] - 开始时间(格式 20200102121212)
 * @param {string} [params.endTime] - 结束时间
 * @param {number} [params.type] - 时间类型 0:今日/1:近3日/2:近7日
 * @param {number} [params.currentNum] - 当前页
 * @param {number} [params.pageSize] - 每页显示内容数
 * @returns {Promise<importDiagTempResponse>}
 */
export const importDiagTemp = params => request('/api/v1/diagnosis/importDiagTemp', params, 'GET')


/**
 * 诊断名关键字查询
 * @param {object} params
 * @param {string} [params.searchKeywords] - 关键字
 * @param {number} params.currentNum - 分页页码
 * @param {number} params.pageSize - 分页页数
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export const diagnosisKeywordSearch = params => request('/api/v1/diagnosis/keywordSearch', params, 'GET')


/**
 * @typedef {object} findDiseaseInClinicResponse
 * @property {string} mainSuit - 主诉
 * @property {string} nowDisease - 现病史
 * @property {string} phyCheck - 体格检查
 * @property {string} supCheck - 辅助检查
 * @property {string} diagnosis - 诊断
 * @property {string} dealIdea - 处理意见
 * @property {string} diseId - 病历编号
 * @property {string} medicalTime - 就诊时间
 * @property {string} medicalName - 就诊人
 * @property {string} medicalType - 诊疗类型
 *
 * 查询病历信息
 * @param {object} params
 * @param {string} params.orderId - 订单id
 * @returns {Promise<findDiseaseInClinicResponse>}
 */
export const findDiseaseInClinic = params => request('/api/v1/etcDisease/findDiseaseInClinic', params, 'GET')


/**
 * 导入病历模板列表
 * @returns {Promise<{ dtoList: {}[], mainList: {}[], nowList: {}[], phyList: {}[], supList: {}[], dealList: {}[] }>}
 */
export const importDiseaseTemp = params => request('/api/v1/etcDisease/importDiseaseTemp', params, 'GET')

/**
 * 保存临时病历
 * @param {object} data
 * @param {string} data.orderId - 订单id
 * @param {string} [data.mainSuit] - 主诉
 * @param {string} [data.nowDisease] - 现病史
 * @param {string} [data.phyCheck] - 体格检查
 * @param {string} [data.supCheck] - 辅助检查
 * @param {string} [data.dealIdea] - 处理意见
 * @param {string} [data.diagnosis] - 诊断
 */
export const saveDiseaseTemp = params => request('/api/v1/etcDisease/saveDiseaseTemp', params, 'POST')

/**
 * 提交病历
 * @param {{phyCheck: string, supCheck: string, dealIdea: string, mainSuit: string, nowDisease: string, diagnosis: string} & {orderId: String, medicalTime: string, userId: string}} data
 * @param {string} data.orderId - 订单id
 * @param {string} data.userId - 患者id
 * @param {string} data.medicalTime - 就诊时间(date类型)
 * @param {string} data.medicalId - 就诊记录id
 * @param {string} data.mainSuit - 主诉
 * @param {string} data.nowDisease - 现病史
 * @param {string} data.phyCheck - 体格检查
 * @param {string} data.supCheck - 辅助检查
 * @param {string} data.dealIdea - 处理意见
 * @param {string} data.diagnosis - 诊断
 * @returns {Promise<string>} 病历编号
 */
export const submitDisease = params => request('/api/v1/etcDisease/submitDisease', params, 'POST')

// 添加病历修改记录
export const addChangeRecord = params => request('/api/v1/etcDisease/addChangeRecord', params, 'GET')

/**
 * 电子病历提交记录|修改记录
 * @param {string} data.diseaseId - 病历编号
 * @param {string} data.changeType - 查询的修改类型(DIAGNOSIS_INFO:诊断信息,MAIN_SUIT:主诉,NOW_DISEASE:现病史,PHYSICAL_CHECK:体格检查,SUPPORT_CHECK:辅助检查,DEAL_IDEA:处理意见)
 * @param {string} data.currentNum - 当前页
 * @param {string} data.pageSize - 每页内容数
 */
export const findSubjectRecord = params => request('/api/v1/etcDisease/findSubjectRecord', params, 'GET')

// 电子病历模板
export const findDiseaseTemplateList = params => request('/api/v1/etcDisease/findDiseaseTemplateList', params, 'POST')
// 查询病历模板信息
export const backDiseaseTempInfo = params => request('/api/v1/etcDisease/backDiseaseTempInfo', params, 'GET')
