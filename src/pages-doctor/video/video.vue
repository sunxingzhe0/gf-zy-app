<template>
  <view class="page-content">
    <preview-image
      ref="previewImage"
      :items="previewImages"
      :current="previewImageCurrent"
    />
    <Archives :order="roomInfo" @view="applyView" />
    <view class="video-container">
      <live-pusher
        v-if="authorize && pushUrl"
        id="live-pusher"
        :class="
          !playUrl || screenWindowUser == 'doctor'
            ? 'screen-full'
            : 'small-window'
        "
        mode="RTC"
        :url="pushUrl"
        :autopush="true"
        :enable-ans="true"
        @error="error"
        @click="screenWindowUser = 'doctor'"
      />
      <live-player
        v-if="playUrl"
        :class="
          !playUrl || screenWindowUser == 'user'
            ? 'screen-full'
            : 'small-window'
        "
        mode="RTC"
        orientation="vertical"
        object-fit="fillCrop"
        sound-mode="speaker"
        :src="playUrl"
        :autoplay="true"
        @click="screenWindowUser = 'user'"
      />
      <scroll-view
        class="message-box-container"
        :class="{ 'input-show': showKeyboard, 'tool-bar': toolBarShow }"
        :scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-anchoring="true"
        @scrolltoupper="getHistoryMessage"
      >
        <view
          id="message-box"
          class="message-box"
          :class="{ 'tool-show': toolBarShow }"
        >
          <video-message
            :messageBox="messageBox"
            :order="roomInfo"
            @previewImage="previewImage"
          />
        </view>
      </scroll-view>
      <!-- 底部输入栏 -->
      <view class="bottom-bar" v-show="showKeyboard">
        <view class="flex-between">
          <image
            v-if="roomInfo.status == 'IN_TREAT'"
            class="bottom-bar__icon"
            :src="require('@/assets/off38@2x.png')"
            mode="aspectFit"
            @click="finishService"
          ></image>
          <input
            class="bottom-bar__input"
            type="text"
            :value="inputValue"
            placeholder="请输入您要咨询的问题"
            confirm-type="send"
            @input="inputChange"
            @confirm="inputConfirm"
          />
          <image
            class="bottom-bar__icon"
            :src="require('@/assets/gengduo@2x.png')"
            mode="aspectFit"
            @click="toolBarShow = !toolBarShow"
          ></image>
          <image
            class="bottom-bar__icon"
            :src="require('@/assets/jianpan@2x.png')"
            mode="aspectFit"
            style="padding-left: 0;"
            @click="showKeyboard = false"
          ></image>
        </view>
        <view class="bottom-bar__toolbar" v-show="toolBarShow">
          <view class="flex-start-start" v-show="!commonWordsShow">
            <view
              class="bottom-bar__tool_item"
              v-for="(item, index) in chatTools"
              :key="index"
              :data-event="item.event"
              @click="toolListener"
            >
              <view class="app-card">
                <image
                  class="tool-icon"
                  :src="item.image"
                  mode="aspectFit"
                ></image>
              </view>
              <view class="tool-title">{{ item.title }}</view>
            </view>
          </view>
          <!-- 常用语列表 -->
          <view class="common-words-wrapper" v-show="commonWordsShow">
            <view
              class="common-words__item"
              v-for="(item, index) in commonWords"
              :key="index"
              @click="selectCommonWords(index)"
              >{{ item.content }}</view
            >
          </view>
        </view>
      </view>
      <view
        class="btn-suspended"
        :style="
          showKeyboard
            ? 'bottom:140rpx;height:88rpx;border-radius: 50%;padding: 0;'
            : ''
        "
      >
        <image
          class="btn-suspended__icon"
          :src="require('@/assets/shutdown1@2x.png')"
          mode="aspectFit"
          @click="shutDown"
        ></image>
        <image
          v-if="roomInfo.status == 'IN_TREAT' && !showKeyboard"
          class="btn-suspended__icon"
          :src="require('@/assets/off38@2x.png')"
          mode="aspectFit"
          @click="finishService"
        ></image>
        <image
          class="btn-suspended__icon"
          v-if="!showKeyboard"
          :src="require('@/assets/jianpan2@2x.png')"
          mode="aspectFit"
          @click="showKeyboard = true"
        ></image>
      </view>
    </view>
    <text v-if="roomInfo.acceptsTime" class="countdown"
      >距离结束还剩 {{ countText }} 时长</text
    >
  </view>
</template>
<script>
const AgoraSDK = require('../../common/mini-app-sdk-production.js')
import Archives from '../components/Archives.vue'
import dayjs from 'dayjs'
import {
  clinicInfo,
  video,
  historyMessage,
  over,
  applyAuth,
  findCommonWords,
  upload,
} from '@/common/request/index.js'
const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  PRESCRIPTION: 'prescription',
}
export default {
  components: {
    Archives,
  },
  data() {
    return {
      userId: uni.getStorageSync('userId'),
      fromNickName: this.$store.state.userInfo.username,
      time: '',
      showExpand: false,
      showKeyboard: false,
      toolBarShow: false, //聊天工具显示
      commonWordsShow: false, //常用语工具显示
      inputValue: '',
      messageBox: [],
      chatTools: [
        //聊天工具栏
        {
          image: require('@/assets/xiangce@2x.png'),
          title: '相册',
          event: 'chooseImage',
        },
        {
          image: require('@/assets/paishe@2x.png'),
          title: '拍照',
          event: 'camera',
        },
        {
          image: require('@/assets/xingzhuang@2x.png'),
          title: '常用语',
          event: 'commonWordsFunc',
        },
      ],
      // 常用语
      commonWords: [],
      client: null,
      authorize: null,
      roomInfo: {},
      pushUrl: '',
      playUrl: '',
      scrollTop: 0,
      screenWindowUser: 'user',
      systemInfo: uni.getSystemInfoSync(),
      previewImageCurrent: 0,
      initiativeLeave: true, //是否主动挂断视频，默认主动，收到对方离开的消息则改为被动
      timer: null, //定时器
      countText: '00:00:00',
    }
  },
  computed: {
    previewImages() {
      return this.messageBox
        .filter(
          ({ childMessageType }) =>
            childMessageType == this.$protobufMessageType.IMAGE,
        )
        .map(({ body }) => body)
    },
  },
  onLoad(options) {
    this.roomInfo = options

    this.getHistoryMessage()
    this.getClinicInfo()
    this.webSocket.sendMessageCallback(options.sessionId)
    uni.$emit('handelVideoPage', 1)
  },
  async onReady() {
    uni.$on('onMessage', this.messageHandler)
  },
  onShow() {
    uni.getSetting({
      success: ({ authSetting }) => {
        const camera = authSetting['scope.camera']
        const record = authSetting['scope.record']
        if (typeof camera == 'boolean' && !camera) {
          uni.showModal({
            title: '授权提醒',
            content: '该服务需要使用您的摄像头与麦克风',
            showCancel: false,
            confirmText: '打开设置',
            success() {
              uni.openSetting()
            },
          })
        } else if (typeof record == 'boolean' && !record) {
          uni.showModal({
            title: '授权提醒',
            content: '该服务需要使用您的摄像头与麦克风',
            showCancel: false,
            confirmText: '打开设置',
            success() {
              uni.openSetting()
            },
          })
        } else {
          this.authorize = true
        }
      },
    })
  },
  onHide() {
    // iPhone从后台切回到前台，pusher组件无法自动回流，
    // 所以页面进入后台的时候直接将pusher组件删了
    // 回到前台的时候再重新创建pusher组件
    if (this.systemInfo.system.indexOf('iOS') > -1) {
      this.authorize = false
    }
  },
  onUnload() {
    uni.$emit('handelVideoPage', 0)
    if (this.initiativeLeave) {
      this.sendMessage({
        value: 'leave',
        childMessageType: this.$protobufMessageType.CRVIDEO,
      })
    }
    this.client.leave()
    //清除倒计时
    clearInterval(this.timer)
  },
  methods: {
    getCountDownText() {
      //还剩多少秒
      const difference =
        dayjs(this.roomInfo.acceptsTime).add(30, 'minute') - dayjs()
      if (difference < 0) {
        return (this.countText = '00:00:00')
      }
      const minute = Math.floor((difference / 1000 / 60) % 60)
      const ss = Math.floor((difference / 1000) % 60)
      this.countText = `00:${minute < 10 ? '0' + minute : minute}:${
        ss < 10 ? '0' + ss : ss
      }`
    },
    agoraInit() {
      this.client = new AgoraSDK.Client()
      this.client.on(
        'stream-added',
        e => {
          const uid = e.uid
          console.log(`stream ${uid} added`)
          // 订阅相应 Url 地址的音视频流
          this.client.subscribe(
            uid,
            url => {
              console.log(`stream ${uid} subscribed successful`)
              this.playUrl = url
              // 将 Url 地址发送至 live-player
            },
            e => {
              console.log(`stream subscribed failed ${e} ${e.code} ${e.reason}`)
            },
          )
        },
        err => {
          console.log(`stream added failed ${JSON.stringify(err)}`)
        },
      )
      this.client.on('stream-removed', e => {
        console.log(`stream ${e.uid} removed`)

        this.initiativeLeave = false
        this.shutDown()
      })
      this.roomInit()
    },
    roomInit() {
      this.client.init(
        this.AGORA_APPID,
        () => {
          console.log(`client init success`)

          const channel = this.roomInfo.sessionId
          const uid = `${parseInt(Math.random() * 1000000)}`
          this.client.join(
            undefined,
            channel,
            uid,
            () => {
              console.log(`client join ${channel} success`)
              //发布本地音视频流并获取推流 url 地址
              this.client.publish(
                url => {
                  console.log(`client publish success`)
                  this.pushUrl = url
                },
                e => {
                  console.log(`client publish failed: ${JSON.stringify(e)}`)
                },
              )
            },
            e => {
              console.log(`client join ${channel} failed: ${JSON.stringify(e)}`)
            },
          )
        },
        e => {
          console.log(`client init failed: ${JSON.stringify(e)}`)
          this.roomInit()
        },
      )
    },
    async getClinicInfo() {
      this.roomInfo = await clinicInfo({
        orderId: this.roomInfo.orderId,
      })
      this.$nextTick(() => {
        this.agoraInit()
      })
      //开启倒计时
      this.timer = setInterval(() => {
        this.getCountDownText()
      }, 1000)
    },
    inputChange(event) {
      const value = event.detail.value
      if (!value) return
      this.inputValue = value
    },
    inputConfirm() {
      if (!this.inputValue) return
      this.sendMessage({
        value: this.inputValue,
      })
      this.inputValue = ''
    },
    selectCommonWords(index) {
      this.sendMessage({
        value: this.commonWords[index].content,
      })
      this.commonWordsShow = false
    },
    async applyView({ id, memberId }) {
      const params = {
        medicalId: id,
        memberId,
      }
      await applyAuth(params)
    },
    sendMessage({
      value,
      childMessageType = this.$protobufMessageType.DEFAULT,
    }) {
      const form = {
        fromNickName: this.fromNickName,
        to: this.roomInfo.sessionId,
        toNickName: this.roomInfo.memberName,
        body: value,
      }
      // 用户类型 医生
      const chatType = this.$protobufChatType.DOCTOR
      this.webSocket.sendMessage(form, childMessageType, chatType)
    },
    toolListener(e) {
      const event = e.currentTarget.dataset.event
      this[event]()
    },
    commonWordsFunc() {
      this.commonWordsShow = true
      this.getCommonWords()
    },
    // 结束服务
    finishService() {
      uni.showModal({
        title: '提示',
        content: '是否确认？',
        cancelText: '否',
        confirmText: '是',
        success: res => {
          if (res.confirm) {
            over({
              orderId: this.roomInfo.orderId,
            }).then(() => {
              this.shutDown()
            })
          }
        },
      })
    },
    // 挂断视频
    shutDown() {
      uni.navigateBack({
        delta: 1,
      })
    },
    messageHandler(payload) {
      const info = payload.info || payload
      if (info.to != `#${this.roomInfo.sessionId}`) return

      info.msgId && this.webSocket.sendMessageCallback({ ...payload })
      this.messageBox.push({ ...info })
      this.$nextTick(() => {
        const node = uni
          .createSelectorQuery()
          .in(this)
          .select('#message-box')
        node
          .boundingClientRect(({ height }) => {
            height > 300 && (this.scrollTop = height - 300)
          })
          .exec()
      })
    },
    async getHistoryMessage() {
      if (['APPOINTMENT', 'WAIT_TREAT'].includes(this.roomInfo.status)) return
      const params = {
        userId: this.userId,
        sessionId: this.roomInfo.sessionId,
        msgId: this.messageBox[0] ? this.messageBox[0].msgId : -1,
      }
      const data = await historyMessage(params)
      const list = data
        .map(item =>
          Object.assign(item, {
            childMessageType: this.$protobufMessageType[item.childMessageType],
            chatType: this.$protobufChatType[item.chatType],
          }),
        )
        .filter(
          ({ childMessageType }) =>
            childMessageType !== this.$protobufMessageType.ANY,
        )
        .reverse()
      this.messageBox = [...list, ...this.messageBox]
      this.$nextTick(() => {
        const node = uni
          .createSelectorQuery()
          .in(this)
          .select('#message-box')
        node
          .boundingClientRect(({ height }) => {
            height > 300 && (this.scrollTop = height - 300)
          })
          .exec()
      })
    },
    async getCommonWords() {
      const { list } = await findCommonWords({
        pageSize: 9999,
      })
      this.commonWords = list
    },
    chooseImage() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: async res => {
          const { body } = await upload(res.tempFilePaths[0])

          if (!body) return
          this.sendMessage({
            value: body,
            childMessageType: this.$protobufMessageType.IMAGE,
          })
        },
      })
    },
    camera() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], //使用相机
        success: async res => {
          const { body } = await upload(res.tempFilePaths[0])

          if (!body) return
          this.sendMessage({
            value: body,
            childMessageType: this.$protobufMessageType.IMAGE,
          })
        },
      })
    },
    previewImage(payload) {
      this.previewImageCurrent = payload.index
      this.$refs.previewImage.open()
    },
  },
}
</script>
<style>
/* 设置页面透明  配合pages.json使用*/
page {
  background: transparent;
}
</style>
<style lang="scss" scoped>
.container {
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.small-window {
  position: absolute;
  left: 12rpx;
  top: 120rpx;
  z-index: 1;
  width: 280rpx;
  height: 320rpx;
}

.screen-full {
  position: relative;
  top: 0;
  left: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
}

.message-box-container {
  position: fixed;
  z-index: 1;
  left: 12rpx;
  bottom: 12rpx;
  width: 70vw;
  height: 600rpx;

  &.input-show {
    bottom: 140rpx;

    &.tool-bar {
      bottom: 340rpx;
      height: 400rpx;
    }
  }
}

.message-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 600rpx;

  &.tool-show {
    min-height: 400rpx;
  }
}

.bottom-bar {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx 0 40rpx;
  box-sizing: border-box;
}

.bottom-bar__icon {
  flex-grow: 0;
  width: 50rpx;
  height: 50rpx;
  padding: 0 20rpx;
}

.bottom-bar__input {
  flex-grow: 1;
  height: 70rpx;
  line-height: 70rpx;
  padding-left: 12rpx;
  background-color: #f2f2f2;
}

.bottom-bar__toolbar {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;

  .bottom-bar__tool_item {
    margin-left: 40rpx;

    + .bottom-bar__tool_item {
      margin-left: 80rpx;
    }
  }

  .app-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60rpx;
    height: 60rpx;
  }

  .tool-icon {
    width: 44rpx;
    height: 44rpx;
  }

  .tool-title {
    margin-top: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #666;
  }
}

.common-words-wrapper {
  margin-top: 20rpx;
}

.common-words__item {
  height: 92rpx;
  line-height: 92rpx;
  padding-left: 20rpx;
  color: #666;
  border-top: 2rpx solid #eee;
}

.btn-suspended {
  position: fixed;
  z-index: 1;
  bottom: 24rpx;
  right: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 88rpx;
  background-color: rgba($color: #fff, $alpha: 0.8);
  border-radius: 40rpx;
  padding: 20rpx 0;
}

.btn-suspended__icon {
  width: 60rpx;
  height: 60rpx;
  margin: 12rpx 0;
}
.page-content {
  position: relative;
  .countdown {
    position: absolute;
    top: 125rpx;
    color: #fff;
    z-index: 99999;
    width: 100%;
    text-align: center;
  }
}
</style>
