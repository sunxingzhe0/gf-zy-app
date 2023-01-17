const TYPE = {
  DISPOSAL: '医嘱',
  RESERVE: '预约挂号',
  PRESCRIPTION: '处方',
  CONSULT: '在线咨询',
  REPEAT_CLINIC: '在线复诊',
  CARRYON_PRESC: '慢病续方',
  REPORT_READ: '报告解读',
  NUCLEATE: '核酸预约',
}
const ENUM = {
  USER_01: [
    {
      DISPOSAL: '/pages-user/doctorAdvice/detail',
      RESERVE: '/pages-user/myAppointment/detail',
      PRESCRIPTION: '/pages-user/prescriptionOrder/detail',
      CONSULT: '/pages-user/serviceOrder/detail',
      REPEAT_CLINIC: '/pages-user/serviceOrder/detail',
      CARRYON_PRESC: '/pages-user/serviceOrder/detail',
      REPORT_READ: '/pages-user/serviceOrder/detail',
      NUCLEATE: '/pages-user/nucleicAcidAppointment/record/detail',
    },
  ],
  USER_02: [
    {
      DISPOSAL: '/pages-user/doctorAdvice/detail',
      RESERVE: '/pages-user/myAppointment/detail',
      PRESCRIPTION: '/pages-user/prescriptionOrder/detail',
      CONSULT: '/pages-user/serviceOrder/detail',
      REPEAT_CLINIC: '/pages-user/serviceOrder/detail',
      CARRYON_PRESC: '/pages-user/serviceOrder/detail',
      REPORT_READ: '/pages-user/serviceOrder/detail',
      NUCLEATE: '/pages-user/nucleicAcidAppointment/record/detail',
    },
  ],
  USER_03: [
    {
      DISPOSAL: '/pages-user/doctorAdvice/detail',
      RESERVE: '/pages-user/myAppointment/detail',
      PRESCRIPTION: '/pages-user/prescriptionOrder/detail',
      CONSULT: '/pages-user/serviceOrder/detail',
      REPEAT_CLINIC: '/pages-user/serviceOrder/detail',
      CARRYON_PRESC: '/pages-user/serviceOrder/detail',
      REPORT_READ: '/pages-user/serviceOrder/detail',
      NUCLEATE: '/pages-user/nucleicAcidAppointment/record/detail',
    },
  ],
  USER_04: '/pages-user/serviceOrder/detail',
  USER_05: '/pages-user/chat/chat',
  USER_06: '/pages-user/chat/chat',
  USER_07: '/pages-user/chat/chat',
  USER_08: '/pages-user/chat/chat',
  USER_09: '/pages-user/chat/chat',
  USER_10: '/pages-user/chat/chat',
  USER_11: '/pages-user/prescriptionOrder/detail',
  USER_12: '/pages-user/prescriptionOrder/detail',
  USER_13: '/pages-user/prescriptionOrder/detail',
  USER_14: '/pages-user/chat/chat',
  USER_15: '/pages-user/chat/chat',
  USER_16: '/pages-user/chat/chat',
  USER_17: '',
  USER_18: '/pages-user/chat/chat',
  USER_19: '/pages-user/chat/chat',
  USER_20: '/pages-user/message/detail',
  USER_21: '/pages-user/chat/chat',
  USER_22: '',
  USER_23: '',
  USER_24: '',
  USER_231: '',
  USER_241: '',
  USER_251: '',
  USER_252: '/pages-user/serviceOrder/detail',

  ZY_USER_01: '',
  ZY_USER_02: '',
  ZY_USER_03: '',
  ZY_USER_04: '/pages-zy/inpatientServices/deposit',
  ZY_USER_05: '',
  ZY_USER_06: '',
  ZY_USER_07: '',
  ZY_USER_08: '',
  ZY_USER_09: '',
  ZY_USER_10: '',
  ZY_USER_11: '',
  ZY_USER_12: '',
  ZY_USER_13: '',
  ZY_USER_14: '',
  ZY_USER_15: '',
  ZY_USER_16: '',
  ZY_USER_17: '',
  ZY_USER_18: '',
  ZY_USER_19: '',
  ZY_USER_20: '',
  ZY_USER_21: '',
  ZY_USER_22: '',
  ZY_USER_23: '',
  ZY_USER_24: '',
  ZY_USER_25: '',
  ZY_USER_26: '/pages-zy/feedBack/index',
}

//筛选跳转路径
export function getToUrl(item, type) {
  const params = !ENUM[item.notice]
    ? `?title=${item.title}&createtime=${item.createTime}&content=${item.content}`
    : `?bizId=${item.bizId}`
  if (!ENUM[item.notice]) return ENUM.USER_20 + params
  if (!Array.isArray(ENUM[item.notice])) return ENUM[item.notice] + params
  return ENUM[item.notice][0][type] + params
}

//终止诊室消息跳转路径pages-user/serviceOrder/detail
