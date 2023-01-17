// 开发环境
const dev = 'wxapp.chuntaoyisheng.com/'
// 测试环境
const test = 'miapp.chuntaoyisheng.com/'

// 精卫中心开发环境
const jw = 'test.cqsjwzx.com/'
// 精卫中心测试环境与试用环境
const jw_test = 'm.cqsjwzx.com/'
// 精卫生产环境
const jw_production = 'hlw.cqsjwzx.com/'

const wss_dev = `wss://${dev}wx_chat`
const wss_test = `wss://${test}wx_chat`

//精卫开发环境socket地址
const wss_jw = `wss://${jw}wx_chat`
//精卫测试环境socket地址
const wss_jw_test = `wss://${jw_test}wx_chat`
// 精卫生产环境socket地址
const wss_production = `wss://${jw_production}wx_chat`

const ENV_HOST = process.env.NODE_ENV === 'development' ? test : jw_production

export const host = `https://${ENV_HOST}`
export const webSocketUrl =
  process.env.NODE_ENV === 'development' ? wss_test : wss_production

export function downLoadUrl(fileId) {
  const token = uni.getStorageSync('token')
  return `${host}mi/api/v1/file/download?token=${token}&fileId=${fileId}`
}

export function downloadBuiltIn(fileName) {
  const token = uni.getStorageSync('token')
  const [fileId, ext] = fileName.split('.')

  return `${host}mi/api/v1/file/downloadBuiltIn?token=${token}&fileId=${fileId}&ext=${ext}`
}
