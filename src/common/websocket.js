// #ifdef MP-WEIXIN
const protobuf = require('./protobuf/protobuf')
const Long = require('./protobuf/src/long')
// #endif

// #ifdef H5
import protobuf from 'protobufjs'
// #endif
import { v4 as uuid } from 'uuid'
import configJson from './protobuf/imessage'
import store from '../store/index'
import { userImSequence, userSyncData } from './request/im'
import { webSocketUrl } from '@/urls'

const IMessage = protobuf.Root.fromJSON(configJson).lookupType('IMessage')
// socket实例
let socketTask = null

// 心跳检测
let heartCheckInterval = null

// 网络连接
let internetConnected = true

// socket重连次数
let reconnectTime = 1

// 未读消息
const unRead = {}

// 待发送消息列表
const waitSendList = []

//监听网络状态变化
uni.onNetworkStatusChange(function(res) {
  console.log('网络：', res.isConnected)

  internetConnected = res.isConnected
  reconnect()

  uni.$emit('SocketConnect')
})

/**
 * 打开socket
 */
function connectSocket() {
  const imToken = uni.getStorageSync('imToken')

  if (socketTask?.readyState < 2 || !internetConnected || !imToken) return

  socketTask = uni.connectSocket({
    url: webSocketUrl,
    success: function(res) {
      console.log(JSON.stringify(res))
    },
  })

  socketTask.onOpen(function() {
    console.log('Socket已连接')
    reconnectTime = 1
    // 登录IM
    login()
  })

  socketTask.onMessage(function(message) {
    const data = IMessage.decode(new Uint8Array(message.data))
    handleMessage(data)
  })

  socketTask.onClose(function(res) {
    console.log('Socket关闭', JSON.stringify(res))

    if (res.code == 1000) {
      if (heartCheckInterval) {
        clearInterval(heartCheckInterval)
        heartCheckInterval = null
      }
      if (reconnectTime === 1) {
        uni.$emit('SocketConnect')
      }
    } else {
      reconnect()
    }
  })

  socketTask.onError(function(error) {
    console.error('Socket连接打开失败', JSON.stringify(error))

    if (heartCheckInterval) {
      clearInterval(heartCheckInterval)
      heartCheckInterval = null
    }
    if (reconnectTime === 1) {
      uni.$emit('SocketConnect')
    }
  })
}

// 登录IM
function login() {
  const token = uni.getStorageSync('imToken')
  const data = encode(
    IMessage.create({
      RequestType: 1,
      login: {
        token,
        timestamp: +new Date(),
        systemType: 'WX',
        deviceType: 'WX',
      },
    }),
  )
  socketTask.send({
    data,
    fail(err) {
      console.error(err)
    },
  })
}

function close() {
  socketTask && socketTask.close()
}

/**
 * 心跳检测
 */
function heartCheck() {
  heartCheckInterval = setInterval(() => {
    if (socketTask?.readyState == 1) {
      socketTask.send({
        data: encode({
          RequestType: 3,
          ticket: store.state.messageTicket.ticket,
        }),
        fail(err) {
          console.error('发送心跳失败', JSON.stringify(err))
          clearInterval(heartCheckInterval)
          heartCheckInterval = null
        },
      })
    } else {
      clearInterval(heartCheckInterval)
      heartCheckInterval = null
    }
  }, 20000)
}

//重新连接IM
let timer = null
function reconnect() {
  if (timer) {
    return
  }

  const imToken = uni.getStorageSync('imToken')
  timer = setTimeout(function() {
    timer = null

    // 已经连接 || 没有网络 || 没有imToken 均不作重连
    if (socketTask?.readyState < 2 || !internetConnected || !imToken) return

    console.log(`Socket重连第${reconnectTime++}次`)
    socketTask = null
    connectSocket()
  }, 1000)
}

/**
 * 发送socket消息
 * @param {Object} data
 */
function sendMessage(data, childMessageType, chatType) {
  const params = IMessage.create({
    RequestType: 4,
    ticket: store.state.messageTicket.ticket,
    info: {
      messageType: 0, //消息
      childMessageType, //消息内容类型
      from: uni.getStorageSync('userId'), //发送者
      fromNickName: data.fromNickName, //发送者昵称
      toNickName: data.toNickName, //接受者昵称
      to: `#${data.to}`, //会话ID
      body: data.body, //消息内容
      sequence: store.state.messageTicket.sequence, //消息发送序号。
      chatType, //用户端标识
      clientTime: +new Date(),
      conferenceId: uuid().replace(/-/g, ''),
    },
  })

  console.log('Socket发送数据：', params)
  socketTask.send({
    data: encode(params),
    success(res) {
      uni.$emit('onMessage', {
        ...params.info,
      })
    },
    fail(err) {
      console.log('发送失败', JSON.stringify(err))
      waitSendList.push({
        data,
        childMessageType,
        chatType,
      })
      reconnect()
    },
  })
}

/**
 * 处理接收消息
 * @param {Object} data
 */
function handleMessage(data) {
  console.log('Socket:', data)
  if (!data.RequestType) data.RequestType = 0
  switch (data.RequestType) {
    case 0:
      sync(data)
      break
    case 101:
      loginSuccess(data)
      break
    case 102:
      occupy(data)
      break
    case 103:
      receivedHeart(data)
      break
    case 104:
      sendSuccess(data)
      break
    case 5:
      initMessage(data)
      break
    case 6:
      receivedMessage(data)
      break
    default:
      break
  }
}

/**
 * 处理同步指令
 * @param {Object} data
 */
async function sync(data) {
  const userId = uni.getStorageSync('userId')
  const version = uni.getStorageSync('im_version')

  if (!userId || !version) return

  const { maxVersion, syncData } = await userSyncData({
    userId,
    version,
  })
  uni.setStorageSync('im_version', maxVersion)

  if (syncData && syncData.length) {
    syncData.forEach(item => {
      uni.$emit('sync', item.command)
      handleSync(item)
    })
  }

  console.log('Sync', syncData)
}

async function handleSync({ command, body }) {
  switch (command) {
    // 资质审核通过
    case 'SYNC_AUDIT_001':
      store.dispatch('loginInfo', true)
      break
    case 'SYNC_MESSAGE_ANS':
      uni.$emit('MESSAGE_EVENT_HANDLER', { ...body })
      break
    case 'SYNC_MY_RESERVE':
      store.commit('registerNum')
      uni.$emit('SYNC_MY_RESERVE')
      break
    case 'SYNC_MESSAGE':
      if (!body.to) {
        body.to = body.sessionId
      }

      const sessionId = body.to.substr(1)

      if (!sessionId) return

      if (unRead[sessionId]) {
        unRead[sessionId].filter(({ msgId }) => msgId === body.msgId).length ==
          0 &&
          unRead[sessionId].push({
            ...body,
          })
      } else {
        unRead[sessionId] = [
          {
            ...body,
          },
        ]
      }

      uni.$emit('onMessage', {
        ...body,
      })
      break
    case 'SYNC_SYS_NOTICE':
      store.dispatch('getMessge', true)
      break
    default:
  }
}

// 初始化同步信息
async function syncInit() {
  const userId = uni.getStorageSync('userId')
  const version = await userImSequence({
    userId,
  })
  uni.setStorageSync('im_version', version)
  console.log('IM: 初始化同步版本号:' + version)
}

/**
 * 登录成功
 * @param {Object} data
 */
async function loginSuccess(data) {
  if (data.status.message != '登录成功') {
    return
  }

  syncInit()

  await store.dispatch('setMessageTicket', {
    ticket: data.ticket,
    sequence: long2Number(data.status.sequence),
    msgId: long2Number(data.status.msgId),
  })

  uni.$emit('SocketConnect')

  waitSendList.forEach(msg =>
    sendMessage(msg.data, msg.childMessageType, msg.chatType),
  )
  waitSendList.length = 0

  // 登录成功后开始发送心跳
  heartCheck()
}

/**
 * 心跳回执
 */
function receivedHeart(data) {}

/**
 * 消息发送成功回执
 * @param {Object} data
 */
function sendSuccess({ status }) {
  if (status.sequence < 0) return

  const ticket = store.state.messageTicket
  store.dispatch('setMessageTicket', {
    ...ticket,
    sequence: status.sequence,
  })
}

/**
 * 初始消息
 * @param {Object} data
 */
function initMessage(data) {
  const params = IMessage.create({
    RequestType: 105,
    ticket: store.state.messageTicket.ticket,
    status: {
      state: true,
      msgId: store.state.messageTicket.msgId,
      sequence: store.state.messageTicket.sequence,
    },
  })

  socketTask.send({
    data: encode(params),
  })
}

/**
 * 接收消息
 * @param {Object} data
 */
function receivedMessage(data) {
  Object.assign(data.info, {
    msgId: long2Number(data.info.msgId),
    sequence: long2Number(data.info.sequence),
    clientTime: long2Number(data.info.clientTime),
  })

  const userId = uni.getStorageSync('userId')
  const sessionId = data.info.to.substr(1)
  if (!unRead[sessionId]) {
    unRead[sessionId] = [
      {
        ...data,
      },
    ]
  } else {
    const has =
      unRead[sessionId].filter(message => {
        return data.info.msgId === (message?.info?.msgId ?? message.msgId)
      }).length > 0

    !has &&
      unRead[sessionId].push({
        ...data,
      })
  }

  if (data.info.from == userId) {
    sendMessageCallback(sessionId)
  }

  uni.$emit('onMessage', {
    ...data,
  })
}

// 接收消息回执
function sendMessageCallback(sessionId) {
  if (!unRead[sessionId]) return

  unRead[sessionId].forEach(message => {
    if (!message.ticket) return
    const params = {
      RequestType: 106,
      ticket: message.ticket,
      status: {
        state: true,
        msgId: message.info.msgId,
      },
    }

    console.log('接收消息回执：', params)

    socketTask.send({
      data: encode(params),
    })
  })

  unRead[sessionId] = []
}

// 获取未读消息
function getUnread(sessionId) {
  return unRead[sessionId] || []
}

// 获取Socket连接状态
function getSocketConnect() {
  return internetConnected && socketTask?.readyState < 2 ? '' : '未连接'
}

/**
 * 踢端
 * @param {Object} data
 */
async function occupy() {
  socketTask = null
  await store.dispatch('signOut')
  uni.showModal({
    showCancel: false,
    content: '您在其他设备上进行了登录!',
  })
}

function encode(data) {
  const uni8 = IMessage.encode(data).finish()
  // #ifdef H5
  return uni8
  // #endif

  // #ifdef MP-WEIXIN
  return uni8.slice().buffer
  // #endif
}

// long类型转Number
function long2Number(value) {
  // #ifdef H5
  return value
  // #endif

  // #ifdef MP-WEIXIN
  return Long.longToNumber(value)
  // #endif
}

export default {
  connectSocket,
  close,
  sendMessage,
  sendMessageCallback,
  getUnread,
  getSocketConnect,
}
