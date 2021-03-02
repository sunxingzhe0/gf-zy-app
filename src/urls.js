// 开发环境
const dev = 'wxapp.chuntaoyisheng.com/'
// 测试环境
const test = 'miapp.chuntaoyisheng.com/';
// 海南医院环境
const show = 'hlw.guanfangyiliao.com/'

const wss_dev = 'wss://wxapp.chuntaoyisheng.com/wx_chat'
const wss_test = 'wss://miapp.chuntaoyisheng.com/wx_chat';
const wss_show = 'wss://hlw.guanfangyiliao.com/wx_chat'

// //#ifdef H5
// //测试的时候使用 预防 uni.uploadFile 上传图片时代理不了的问题
// const dev = '192.168.8.42:10002/mi';
// //#endif

// //#ifndef H5
// const dev = 'demo.chuntaoyisheng.com:10002/mi';
// //#endif

// const dev = '192.168.8.63:11031/'

let ENV_HOST = process.env.NODE_ENV === 'development' ? dev : test

//用于打包后运行在手机端
//#ifdef H5
ENV_HOST = dev
//#endif
export const host = `https://${ENV_HOST}`

//#ifdef MP-WEIXIN
export const webSocketUrl =
  process.env.NODE_ENV === 'development' ? wss_dev : wss_test
//#endif

//用于测试环境打包后运行在手机端
//#ifdef H5
export const webSocketUrl = wss_dev
//#endif

export function downLoadUrl(fileId) {
  const token = uni.getStorageSync('token')
  return `${host}mi/api/v1/file/download?token=${token}&fileId=${fileId}`
}

export function downloadBuiltIn(fileName) {
  const token = uni.getStorageSync('token')
  const [fileId, ext] = fileName.split('.')

  return `${host}mi/api/v1/file/downloadBuiltIn?token=${token}&fileId=${fileId}&ext=${ext}`
}
