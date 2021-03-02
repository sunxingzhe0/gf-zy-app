import Vue from 'vue'
import Vuex from 'vuex'
import {
  loginInfo,
  menuList,
  miniUserRegLogin,
  miniProgramLogin,
  codeLogin,
  accountLogin,
  encryptedData,
  encryptedDataByApp,
  simLoginZy,
  getListByType,
  attriBute,
} from '@/common/request/index'
import { queryAnyData } from '@/common/request/userCenter.js'
import webSocket from '../common/websocket'
Vue.use(Vuex)

const state = {
  hasLogin: false,
  loginProvider: '',
  openid: null,
  testvuex: false,
  colorIndex: 0,
  colorList: ['#FF0000', '#00FF00', '#0000FF'],
  token: uni.getStorageSync('token'),
  userInfo: {},
  avatar: '',
  menuList: [],
  isLogin: 0,
  message: 0,
  registerNum: 0,
  messageTicket: {
    ticket: uni.getStorageSync('im_ticket') || 0,
    sequence: uni.getStorageSync('im_sequence') || 0,
    msgId: uni.getStorageSync('im_msgId') || -1,
  },
  //药品类型列表
  rPType: [],
  //剂型表
  pharmaceutical: [],
  //使用频率表
  frequency: [],
  //用药途径表
  channel: [],
  //疗程单位
  course: [],
  appointmentClinicDoctorId: '', //诊间预约复诊医生
  appointmentClinicDeptId: '', //诊间预约复诊医生科室
}
const mutations = {
  login(state, provider) {
    state.hasLogin = true
    state.loginProvider = provider
  },
  logout(state) {
    state.hasLogin = false
    state.openid = null
  },
  setOpenid(state, openid) {
    state.openid = openid
  },
  setTestTrue(state) {
    state.testvuex = true
  },
  setTestFalse(state) {
    state.testvuex = false
  },
  setColorIndex(state, index) {
    state.colorIndex = index
  },
  userInfo(state, info) {
    state.userInfo = info
  },
  avatar(state, avatar) {
    state.avatar = avatar
  },
  menuList(state, list) {
    state.menuList = list
  },
  upisLogin(state, num) {
    state.isLogin = num
  },
  message(state, num) {
    state.message = num
  },
  registerNum(state) {
    state.registerNum = state.registerNum + 1
  },
  SET_MESSAGETICKET(state, ticket) {
    state.messageTicket = ticket
  },
  //存储药品类型、使用频率、用药途径表
  setRpTypeList(state, datas) {
    state.rPType = datas.rPType
    state.frequency = datas.frequency
    state.channel = datas.channel
    state.pharmaceutical = datas.pharmaceutical
    state.course = datas.course
  },
  SET_APPOINTMENTCLINICDOCTORID(state, data) {
    state.appointmentClinicDoctorId = data
  },
  SET_APPOINTMENTCLINICDEPTID(state, data) {
    state.appointmentClinicDeptId = data
  },
}
const getters = {
  currentColor(state) {
    return state.colorList[state.colorIndex]
  },
}
const actions = {
  getMessge: async function({ commit }) {
    const num = await queryAnyData({
      readType: 1,
    })
    commit('message', num.total || 0)
  },
  /***
   *手机端绑定
   */
  h5MiniProgramLogin: async function({ commit }, info) {
    return await new Promise((resolve, reject) => {
      miniProgramLogin({
        code: info.loginCode,
        orgId: uni.getStorageSync('orgId'),
        loginType: 'APP',
      }).then(res => {
        uni.setStorageSync('token', res.token)
        resolve(res)
      })
    })
  },
  miniUserRegLogin: function() {
    return new Promise((resolve, reject) => {
      uni.checkSession({
        complete: async function() {
          uni.login({
            provider: 'weixin',
            success: ({ code }) => {
              miniUserRegLogin({
                code,
                orgId: uni.getStorageSync('orgId'),
              }).then(res => {
                uni.setStorageSync('token', res.token)
                resolve(res)
              })
            },
            fail: err => {
              console.log(
                'login 接口调用失败，将无法正常使用开放接口等服务',
                err,
              )
              reject(err)
            },
          })
        },
      })
    })
  },
  // lazy loading openid
  miniProgramLogin: async function({ commit }, orgId) {
    return await new Promise((resolve, reject) => {
      uni.checkSession({
        success: function() {
          uni.login({
            provider: 'weixin',
            success: data => {
              miniProgramLogin({
                code: data.code,
                orgId: uni.getStorageSync('orgId'),
              }).then(res => {
                uni.setStorageSync('token', res.token)
                resolve(res)
              })
            },
            fail: err => {
              console.log(
                'login 接口调用失败，将无法正常使用开放接口等服务',
                err,
              )
              reject(err)
            },
          })
        },
        fail: function() {
          uni.login({
            provider: 'weixin',
            success: data => {
              miniProgramLogin({
                code: data.code,
                orgId: uni.getStorageSync('orgId'),
              }).then(res => {
                uni.setStorageSync('token', res.token)
                resolve(res)
              })
            },
            fail: err => {
              console.log(
                'uni.login 接口调用失败，将无法正常使用开放接口等服务',
                err,
              )
              reject(err)
            },
          })
        },
      })
    })
  },
  encryptedData: function({ commit }, info) {
    return new Promise((resolve, reject) => {
      encryptedData({
        encryptedData: info.encryptedData,
        iv: info.iv,
      })
        .then(res => {
          commit('avatar', res.avatar || '')
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })

      // encryptedDataByApp(map).then(data=>{
      //     console.log(">>>>绑定结果"+data)
      // })
    })
  },

  // 账号密码登录
  accountLogin: function({ commit }, userInfo) {
    return new Promise(async (resolve, reject) =>
      accountLogin(userInfo)
        .then(async data => {
          uni.setStorageSync('token', data.token)
          uni.setStorageSync('imToken', data.imToken)
          uni.setStorageSync('userId', data.userId)
          uni.setStorageSync('clientType', data.clientType)
          uni.setStorageSync('setStatusIndexFunc', 0)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        }),
    )
  },
  // 验证码登录
  codeLogin: function({ commit }, userInfo) {
    const { phone, code } = userInfo
    return new Promise(async (resolve, reject) => {
      //#ifdef MP-WEIXIN
      await actions.miniProgramLogin({
        commit,
      })
      //#endif

      codeLogin({
        phone,
        code,
      })
        .then(async data => {
          console.log(data)
          uni.setStorageSync('token', data.token)
          uni.setStorageSync('imToken', data.imToken)
          uni.setStorageSync('userId', data.userId)
          uni.setStorageSync('clientType', data.clientType)
          uni.setStorageSync('setStatusIndexFunc', 0)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /***
   *移动端获取用户信息
   */
  h5LoginInfo: async function({ commit, state }, isto) {
    return await new Promise((resolve, reject) => {
      loginInfo()
        .then(async response => {
          if (response.roleList) {
            response.roleList.forEach(i => {
              i.value = i.id
              if (response.roleName == i.name) {
                i.checked = 1
                response.roleId = i.id
              } else {
                i.checked = 0
              }
            })
          }

          const { token, imToken, userId, avatar, clientType } = response
          if (!uni.getStorageSync('zyToken')) {
            await actions.getsimLoginZy(
              {
                commit,
                state,
              },
              {
                userId,
                wxNickName: response.username,
                sex: response.sex,
                avatar,
                orgId: response.orgId,
                openId: response.openId || '123',
              },
            )
          }
          uni.setStorageSync('token', token)
          uni.setStorageSync('imToken', imToken)
          uni.setStorageSync('userId', userId)
          uni.setStorageSync('clientType', clientType)

          commit('avatar', avatar || '')
          commit('userInfo', response)
          if (!isto) {
            if (clientType == 'USER') {
              //通知app获取详细信息

              // if (uni.getSystemInfoSync().platform == "android") {

              //   window.app.wxLoginInfo()
              // } else {
              //   window.webkit.messageHandlers.wxLoginInfo.postMessage()
              // }
              encryptedDataByApp().then(data => {
                console.log('>>>>绑定结果' + data)
              })
              uni.reLaunch({
                url: '/pages/index-user',
              })
            } else {
              if (
                clientType == 'DRUG_DOC' ||
                uni.getStorageSync('setStatusIndexFunc') == 2
              ) {
                uni.setStorageSync('setStatusIndexFunc', 1)
              }

              uni.reLaunch({
                url: '/pages/index-doctor',
              })
            }
          }
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 用户信息
  loginInfo: async function({ commit, state }, isto, redirect) {
    return await new Promise((resolve, reject) => {
      loginInfo()
        .then(async response => {
          if (response.roleList) {
            response.roleList.forEach(i => {
              i.value = i.id
              if (response.roleName == i.name) {
                i.checked = 1
                response.roleId = i.id
              } else {
                i.checked = 0
              }
            })
          }

          const { token, imToken, userId, avatar, clientType, orgId } = response

          uni.setStorageSync('token', token)
          uni.setStorageSync('imToken', imToken)
          uni.setStorageSync('userId', userId)
          uni.setStorageSync('clientType', clientType)
          uni.setStorageSync('orgId', orgId)

          commit('avatar', avatar || '')
          commit('userInfo', response)

          if (!uni.getStorageSync('zyToken')) {
            await actions.getsimLoginZy(
              {
                commit,
                state,
              },
              {
                userId,
                wxNickName: response.username,
                sex: response.sex,
                avatar,
                orgId: response.orgId,
                openId: response.openId || '123',
              },
            )
          }

          if (!isto) {
            if (clientType == 'USER') {
              uni.getUserInfo({
                provider: 'weixin',
                success: async function(infoRes) {
                  console.log('获取用户信息')
                  await actions.encryptedData(
                    {
                      commit,
                    },
                    infoRes,
                  )
                },
                fail: function(err) {
                  console.log(err)
                },
              })

              redirect
                ? uni.reLaunch({
                    url: redirect,
                  })
                : uni.reLaunch({
                    url: '/pages/index-user',
                  })
            } else {
              if (
                clientType == 'DRUG_DOC' ||
                uni.getStorageSync('setStatusIndexFunc') == 2
              ) {
                uni.setStorageSync('setStatusIndexFunc', 1)
              }

              uni.reLaunch({
                url: '/pages/index-doctor',
              })
            }
          }
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  reLoadLoginInfo: async function({ commit, state }, response) {
    return await new Promise((resolve, reject) => {
      if (response.roleList) {
        response.roleList.forEach(i => {
          i.value = i.id
          if (response.roleName == i.name) {
            i.checked = 1
            response.roleId = i.id
          } else {
            i.checked = 0
          }
        })
      }
      commit('avatar', response.avatar || '')
      commit('userInfo', response)
      if (response.clientType == 'USER') {
      } else {
        if (response.hasAuth && response.hasExamine) {
          if (uni.getStorageSync('setStatusIndexFunc') == 2) {
            uni.setStorageSync('setStatusIndexFunc', 1)
          }
        } else {
          uni.setStorageSync('setStatusIndexFunc', 1)
        }
        uni.reLaunch({
          url: '/pages/index-doctor',
        })
      }
      resolve(response)
    })
  },
  signOut() {
    webSocket.close()
    const clientType = uni.getStorageSync('clientType')

    return new Promise(resolve => {
      uni.getStorageInfoSync().keys.forEach(_ => uni.removeStorageSync(_))
      uni.setStorageSync('setStatusIndexFunc', 0)

      clientType == 'USER'
        ? uni.reLaunch({
            url: '/pages/login/userLogin',
          })
        : uni.reLaunch({
            url: '/pages/login/login',
          })
      resolve()
    })
  },
  // 权限
  menuList({ commit, state }) {
    return new Promise((resolve, reject) => {
      menuList()
        .then(response => {
          commit('menuList', response)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setMessageTicket({ commit }, payload) {
    commit('SET_MESSAGETICKET', payload)
    uni.setStorageSync('im_ticket', payload.ticket)
    uni.setStorageSync('im_sequence', payload.sequence)
    uni.setStorageSync('im_msgId', payload.msgId)
  },
  //掌医登录信息
  getsimLoginZy({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      simLoginZy(data)
        .then(response => {
          uni.setStorageSync('zyToken', response.token)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  //获取用药途径和频率表
  async getListByType(context) {
    let rPType = await getListByType({ type: 3 })
    let pharmaceutical = await getListByType({ type: 4 })
    let frequency = await getListByType({ type: 5 })
    let channel = await getListByType({ type: 6 })
    let course = await attriBute({ type: 5 })
    const datas = {
      rPType,
      pharmaceutical,
      frequency,
      channel,
      course,
    }
    context.commit('setRpTypeList', datas)
  },

  setAppointmentClinicDoctorId(context, payload) {
    context.commit('SET_APPOINTMENTCLINICDOCTORID', payload)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
