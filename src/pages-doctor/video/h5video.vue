<template>
  <view>
    <preview-image
      ref="previewImage"
      :items="previewImages"
      :current="previewImageCurrent"
    />
    <Archives :order="roomInfo" @view="applyView" />
    <view class="video-container">
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
  </view>
</template>
<script>
// const AgoraSDK = require('../../common/mini-app-sdk-production.js');
import Archives from '../components/Archives.vue'
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
      scrollTop: 0,
      screenWindowUser: 'user',
      systemInfo: uni.getSystemInfoSync(),
      previewImageCurrent: 0,
      initiativeLeave: true, //是否主动挂断视频，默认主动，收到对方离开的消息则改为被动
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
  },
  async onReady() {
    uni.$on('onMessage', this.messageHandler)
  },

  onHide() {
    // 所以页面进入后台的时候直接将pusher组件删了
    // 回到前台的时候再重新创建pusher组件
    if (this.systemInfo.system.indexOf('iOS') > -1) {
      this.authorize = false
    }
  },
  onUnload() {
    if (this.initiativeLeave) {
      this.sendMessage({
        value: 'leave',
        childMessageType: this.$protobufMessageType.CRVIDEO,
      })
    }
    //#ifdef APP-PLUS|| H5
    //调用手机端结束视频
    switch (uni.getSystemInfoSync().platform) {
      case 'android':
        window.app.leaveVideo(this.roomInfo.sessionId)

        break

      case 'ios':
        window.webkit.messageHandlers.leaveVideo.postMessage(
          this.roomInfo.sessionId,
        )
        break
    }
    //#endif
    // this.client.leave()
    // this.client.destroy()

    uni.$off('onMessage', this.messageHandler)
  },
  methods: {
    async getClinicInfo() {
      this.roomInfo = await clinicInfo({
        orderId: this.roomInfo.orderId,
      })
      this.$nextTick(() => {
        //#ifdef APP-PLUS|| H5
        //调用手机端开启视频
        switch (uni.getSystemInfoSync().platform) {
          case 'android':
            window.app.startVideo(this.roomInfo.sessionId)

            break

          case 'ios':
            window.webkit.messageHandlers.startVideo.postMessage(
              this.roomInfo.sessionId,
            )
            break
        }
        //#endif
      })
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
    // pushStateChange(e) {
    //    console.log('statechange:' + JSON.stringify(e));
    //  },
    //  pushNetsSatus(e) {
    //    console.log('netstatus:' + JSON.stringify(e));
    //  },
    //  playerStateChange(e) {
    //    console.log('live-player code:', JSON.stringify(e));
    //  },
    //  playerError(e) {
    //    console.log('live-player error:', JSON.stringify(e));
    //  },
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
      if (
        info.childMessageType == this.$protobufMessageType.CRVIDEO &&
        info.body == 'leave'
      ) {
        this.initiativeLeave = false
        uni.navigateBack({
          delta: 1,
        })
      }
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
</style>
