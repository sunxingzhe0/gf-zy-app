import { host } from '@/urls.js'
import store from '../../store/index.js'
export default function(url, data, method = 'POST', form = 'json', params) {
  let token =
    url.indexOf('zyApi') > -1 && url != 'zyApi/api/v1/login/simLoginZy'
      ? uni.getStorageSync('zyToken')
      : uni.getStorageSync('token')
  if (url.indexOf('zyApi') > -1) {
    url = 'mz' + url.split('zyApi')[1]
  } else if (url.indexOf('api/v1/rx/downloadRxToUrl') > -1) {
    url = 'mi' + url
  } else {
    url = 'mi' + url
  }

  if (token) {
    if (method === 'POST') {
      url = `${url}?token=${token}`
      if (form == 'form') {
        for (let k in data) {
          let value = data[k] !== undefined ? data[k] : ''
          url += `&${k}=${encodeURIComponent(value)}`
        }
      }
      if (params) {
        for (let s in params) {
          let values = params[s] !== undefined ? params[s] : ''
          url += `&${s}=${encodeURIComponent(values)}`
        }
      }
    } else {
      data = Object.assign({}, { token }, data)
    }
  }
  return new Promise((resolve, reject) => {
    uni.request({
      //#ifdef  MP-WEIXIN
      url: host + url,
      //#endif

      //#ifdef  H5
      url: `/${url}`,
      //#endif
      data: form == 'form' ? '' : data,
      method,
      // #ifdef  MP-WEIXIN
      header: {
        'content-type': 'application/json;charset=UTF-8', // 默认转为json格式
      },
      // #endif
      success(res) {
        // console.log(res, '结果===')
        if (res.data.state) {
          const body = res.data.body
          resolve(
            (!body && typeof body == 'object') || typeof body == 'undefined'
              ? true
              : body,
          )
          if (url.indexOf('showAgreement') < 0) {
            store.commit('upisLogin', 0)
          }
        } else if (res.data.code === '0') {
          resolve(res.data.body)
        } else {
          if (
            res.data.message?.split(':')[0] == 'AUTHORITY-USER-INFO-ERROR-01' ||
            res.data.message?.split(':')[0] == 'AUTHORITY-ERROR-01'
          ) {
            store.commit('upisLogin', store.state.isLogin + 1)
            console.log(store.state.isLogin)
            let routes = getCurrentPages()
            let curRoute = routes[routes.length - 1]?.route
            console.log(curRoute, store.state.isLogin)
            if (store.state.isLogin == 1) {
              if (
                res.data.message?.split(':')[0] == 'AUTHORITY-ERROR-01' ||
                !curRoute ||
                curRoute == 'pages/login/login'
              ) {
                store.dispatch('signOut')
              } else {
                if (url.indexOf('showAgreement') < 0) {
                  if (uni.getStorageSync('isIncode')) {
                    return
                  }
                  uni.showModal({
                    showCancel: false,
                    content: '您的登录信息不存在，请重新登录!',
                    success() {
                      store.dispatch('signOut')
                    },
                  })
                }
              }
            }
          } else {
            setTimeout(() => {
              uni.showToast({
                icon: 'none',
                title: res.data.message?.split(':')[1],
                duration: 3000,
              })
            }, 100)
          }

          new Error(res.data)
          reject(res.data)
        }
      },
      fail(err) {
        console.error(err)
        new Error(err)
        reject(err)
      },
    })
  })
}
