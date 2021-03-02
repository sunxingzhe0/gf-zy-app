import Vue from 'vue'
import App from './App'

import pageHead from './components/page-head.vue'
import pageFoot from './components/page-foot.vue'
import uLink from '@/components/uLink.vue'
import homeIcom from '@/components/homeIcom.vue'
import store from './store'
import {
  enumChatType,
  enumChildMessageTypeEnum,
} from './common/protobuf/enums.js'
import webSocket from './common/websocket.js'
import VueClipboard from 'vue-clipboard2'
import { downLoadUrl, downloadBuiltIn } from '@/urls.js'
Vue.config.productionTip = false
Vue.use(VueClipboard)
Vue.prototype.$store = store
Vue.prototype.$backgroundAudioData = {
  playing: false,
  playTime: 0,
  formatedPlayTime: '00:00:00',
}
Vue.prototype.AGORA_APPID = 'ffe8c1cf7d284b559b65b7891cb879ae'
Vue.prototype.$protobufChatType = enumChatType
Vue.prototype.$protobufMessageType = enumChildMessageTypeEnum
Vue.prototype.webSocket = webSocket
Vue.prototype.FILE_URL = function(fileId) {
  return downLoadUrl(fileId)
}

// 内置网络图片接口
Vue.prototype.FILE_URL_BUILT_IN = function(fileName) {
  return downloadBuiltIn(fileName)
}
Vue.prototype.FORMATDATE = function(value, fmt) {
  const getDate = new Date(value)
  const o = {
    'y+': getDate.getFullYear(),
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    S: getDate.getMilliseconds(),
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (getDate.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length),
      )
    }
  }
  return fmt
}
Vue.prototype.$tip = function(title) {
  uni.showToast({
    icon: 'none',
    title,
  })
}

Vue.component('page-head', pageHead)
Vue.component('page-foot', pageFoot)
Vue.component('uLink', uLink)
Vue.component('homeIcom', homeIcom)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()
