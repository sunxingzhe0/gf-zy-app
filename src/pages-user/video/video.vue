<template>
  <view class="page-content">
    <preview-image
      ref="previewImage"
      :items="previewImages"
      :current="previewImageCurrent"
    />
    <view class="top-bar">
      <view class="top-bar__title">
        <view class="flex-start-center">
          <view>{{ order.bizTypeValue }}</view>
          <view class="ml-50 doctor-name">{{ order.doctorName }}</view>
        </view>
        <view @click="showExpand = !showExpand">{{
          showExpand ? '收回' : '展开'
        }}</view>
      </view>
      <view v-show="showExpand" class="top-bar__expand">
        <view class="flex-start-start" style="padding: 20rpx 0;">
          <view class="avatar-wrapper">
            <image
              class="avatar"
              :src="require('@/assets/user/doc-3.png') || ''"
              mode="aspectFit"
            ></image>
          </view>
          <view class="ml-30">
            <view class="flex-start-center">
              <view class="top-bar__expand_doctor">{{ order.doctorName }}</view>
              <view>{{ order.biz.sex ? '男' : '女' }}</view>
            </view>
            <view class=""
              >{{ order.deptName }} {{ order.titleName }}
              {{ order.biz.orgName }}</view
            >
            <view class="">擅长：{{ order.skilled }}</view>
          </view>
        </view>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">就诊人</view>
          <view class="top-bar__expand_cell_value">{{ order.memberName }}</view>
        </view>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">类型</view>
          <view class="top-bar__expand_cell_value">{{
            order.bizTypeValue
          }}</view>
        </view>
        <view
          class="top-bar__expand_cell flex-between"
          v-if="order.historyMedicalInfo"
          @click="viewHistorical"
        >
          <view class="top-bar__expand_cell_label">历史就诊记录</view>
          <view class="top-bar__expand_cell_value">{{
            order.historyMedicalInfo.visitDate
          }}</view>
          <view>
            <image
              class="arrow-expand"
              :class="{ desc: historicalShow }"
              :src="require('@/assets/right11@2x.png')"
              mode="aspectFit"
              style="width: 16rpx;height: 28rpx;"
            ></image>
          </view>
        </view>
        <view v-if="order.historyMedicalInfo" v-show="historicalShow">
          <view
            >住院记录 {{ order.historyMedicalInfo.admitDate }} -
            {{ order.historyMedicalInfo.dischargeDate }}</view
          >
          <view style="font-size: 32rpx;color: #1a1a1a;">{{
            order.historyMedicalInfo.patientName
          }}</view>
          <view
            >{{ order.historyMedicalInfo.deptName }}
            {{ order.historyMedicalInfo.doctorName }}
            {{ order.historyMedicalInfo.title }}</view
          >
          <view>
            入院诊断：
            <text style="color: #333;">{{
              order.historyMedicalInfo.inDiagnose
            }}</text>
          </view>
          <view>
            出院诊断：
            <text style="color: #333;">{{
              order.historyMedicalInfo.outDiagnose
            }}</text>
          </view>
        </view>
        <view
          class="top-bar__expand_cell flex-between"
          v-if="order.historyRpList"
        >
          <view class="top-bar__expand_cell_label">续方处方</view>
          <view>
            <image
              class="arrow-expand"
              :src="require('@/assets/right11@2x.png')"
              mode="aspectFit"
              style="width: 16rpx;height: 28rpx;"
            ></image>
          </view>
        </view>
        <view v-for="item in order.historyRpList" :key="item.rpNo">
          <view class="flex-between">
            <view class="prescription-no">处方号：{{ item.rpNo }}</view>
            <view class="price">￥{{ item.fee }}</view>
          </view>
          <view class="">{{ item.doctorName }} {{ item.title }}</view>
          <view class="flex-between">
            <view class="">{{ item.orgName }} {{ item.deptName }}</view>
            <view class="">{{ item.createTime }}</view>
          </view>
          <view class="text-center">
            <image
              :src="require('@/assets/zhankaihui@2x.png')"
              mode="aspectFit"
              style="width: 40rpx; height: 20rpx;"
            ></image>
          </view>
          <view class="detail" v-show="show">
            <template v-for="ite in item.contentList">
              <view class="flex-between" :key="ite.id">
                <view class="medicine-name">{{ ite.name }} {{ ite.spec }}</view>
                <view class="medicare">医保：{{ ite.medicare }}</view>
              </view>
              <view class="ml-20" :key="ite.id">
                <view class="use"
                  >{{ ite.useWays }} 每日{{ ite.useFrequency }}
                  {{ ite.singleDose }}/次 ￥{{ ite.price }}/盒x{{
                    ite.total
                  }}</view
                >
                <view class="price">￥{{ ite.totalPrice }}</view>
                <view class="remark">备注：{{ ite.remark }}</view>
              </view>
            </template>
          </view>
        </view>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">诊疗形式</view>
          <view class="top-bar__expand_cell_value">{{
            order.wayTypeValue
          }}</view>
        </view>
        <view
          class="top-bar__expand_cell flex-start-center"
          v-if="order.bizType == 'REPEAT_CLINIC'"
        >
          <view class="top-bar__expand_cell_label">复诊时间</view>
          <view class="top-bar__expand_cell_value">{{ order.startTime }}</view>
        </view>
      </view>
    </view>

    <view class="video-container">
      <live-pusher
        v-if="authorize && pushUrl"
        id="live-pusher"
        :class="
          !playUrl || screenWindowUser == 'user'
            ? 'screen-full'
            : 'small-window'
        "
        mode="RTC"
        :url="pushUrl"
        :autopush="true"
        :enable-ans="true"
        @error="error"
        @click="screenWindowUser = 'user'"
      />
      <live-player
        v-if="playUrl"
        :class="
          !playUrl || screenWindowUser == 'doctor'
            ? 'screen-full'
            : 'small-window'
        "
        mode="RTC"
        orientation="vertical"
        object-fit="fillCrop"
        sound-mode="speaker"
        :src="playUrl"
        :autoplay="true"
        @click="screenWindowUser = 'doctor'"
      />
      <scroll-view
        class="message-box-container"
        :class="{ 'input-show': showKeyboard }"
        :scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-anchoring="true"
        @scrolltoupper="getHistoryMessage"
      >
        <view id="message-box" class="message-box">
          <video-message
            :messageBox="messageBox"
            :order="order"
            @previewImage="previewImage"
          />
        </view>
      </scroll-view>

      <!-- 底部输入栏 -->
      <view class="bottom-bar" :class="{ show: showKeyboard }">
        <view class="input-bar">
          <image
            class="bottom-bar__icon"
            :src="require('@/assets/shutdown@2x.png')"
            mode="aspectFit"
            @click="back"
          ></image>
          <input
            class="bottom-bar__input"
            type="text"
            :value="inputValue"
            placeholder="请输入"
            confirm-type="send"
            @input="inputChange"
            @confirm="inputConfirm"
          />
          <image
            class="bottom-bar__icon"
            :src="require('@/assets/gengduo@2x.png')"
            mode="aspectFit"
            @click="toolBarShowFunc"
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
          <view class="flex-start-start">
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
        </view>
      </view>
      <view class="btn-suspended">
        <image
          class="btn-suspended__icon"
          :src="require('@/assets/jianpan@2x.png')"
          mode="aspectFit"
          style="padding-left: 0;"
          @click="showKeyboard = true"
        ></image>
      </view>
    </view>
    <text v-if="order.acceptsTime" class="countdown"
      >距离结束还剩 {{ countText }} 时长</text
    >
  </view>
</template>

<script>
const AgoraSDK = require('../../common/mini-app-sdk-production.js')
import {
  clinicInfo,
  clinicBizInfo,
  video,
  historyMessage,
  upload,
} from '@/common/request/index.js'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      userId: uni.getStorageSync('userId'),
      fromNickName: this.$store.state.userInfo.username,
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
      ],
      showExpand: false,
      showKeyboard: true,
      inputValue: '',
      messageBox: [],
      client: null,
      authorize: null,
      pushUrl: '',
      playUrl: '',
      bizInfo: {},
      order: {
        biz: {},
      },
      scrollTop: 0,
      historicalShow: false,
      screenWindowUser: 'doctor',
      toolBarShow: false, //聊天工具显示
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
  async onLoad(options) {
    const { orderId, sessionId } = options

    this.bizInfo = options

    this.getClinicInfo(orderId)
    this.getBizInfo(orderId)
    this.getHistoryMessage()
    this.webSocket.sendMessageCallback(this.bizInfo.sessionId)
  },
  onReady() {
    uni.$on('onMessage', this.messageHandle)
    this.agoraInit()
    video({
      orderId: this.bizInfo.orderId,
    })
  },
  onShow() {
    // #ifndef  APP-PLUS || H5
    uni.getSetting({
      success: ({ authSetting }) => {
        const camera = authSetting['scope.camera']
        const record = authSetting['scope.record']
        if (typeof camera == 'boolean' && !camera) {
          uni.showModal({
            title: '授权提醒',
            content: '该服务需要使用您的摄像头',
            showCancel: false,
            confirmText: '打开设置',
            success() {
              uni.openSetting()
            },
          })
        } else if (typeof record == 'boolean' && !record) {
          uni.showModal({
            title: '授权提醒',
            content: '该服务需要使用您的录音功能',
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
    // #endif
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
    this.client.leave()
    if (this.initiativeLeave) {
      this.sendMessage({
        value: 'leave',
        childMessageType: this.$protobufMessageType.CRVIDEO,
      })
    }
    //清除倒计时
    clearInterval(this.timer)
  },
  methods: {
    getCountDownText() {
      //还剩多少秒
      const difference =
        dayjs(this.order.acceptsTime).add(30, 'minute') - dayjs()
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
              // 将 Url 地址发送至 live-player
              this.playUrl = url
            },
            e => {
              console.log(`stream subscribed failed ${JSON.stringify(e)}`)
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
        this.back()
      })

      this.roomInit()
    },
    roomInit() {
      this.client.init(
        this.AGORA_APPID,
        () => {
          console.log(`client init success`)

          const channel = this.bizInfo.sessionId
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
        },
      )
    },
    async getClinicInfo(orderId) {
      this.bizInfo = await clinicInfo({
        orderId,
      })
    },
    // 业务信息
    async getBizInfo(orderId) {
      const bizTypeEnums = {
        CONSULT: '在线咨询',
        REPEAT_CLINIC: '在线复诊',
        CARRYON_PRESC: '慢病续方',
        PRESCRIPTION: '处方',
      }
      const wayTypeEnums = {
        GRAPHIC: '图文',
        VIDEO: '视频',
        PHONE: '电话',
      }

      const order = await clinicBizInfo({
        orderId,
      })

      this.order = Object.assign(order, {
        bizTypeValue: bizTypeEnums[order.bizType],
        wayTypeValue: wayTypeEnums[order.wayType],
      })
      //开启倒计时
      this.timer = setInterval(() => {
        this.getCountDownText()
      }, 1000)
    },
    back() {
      uni.navigateBack({
        delta: 1,
      })
    },
    inputChange(event) {
      event.detail.value && (this.inputValue = event.detail.value)
    },
    inputConfirm() {
      console.log(this.inputValue, '=====')
      if (!this.inputValue) return

      this.sendMessage({
        value: this.inputValue,
      })

      this.inputValue = ''
    },
    viewHistorical() {
      this.historicalShow = !this.historicalShow
    },
    sendMessage({
      value,
      childMessageType = this.$protobufMessageType.DEFAULT,
    }) {
      const form = {
        fromNickName: this.fromNickName,
        to: this.bizInfo.sessionId,
        toNickName: this.bizInfo.doctorName,
        body: value,
      }

      // 用户类型 患者
      const chatType = this.$protobufChatType.USER
      this.webSocket.sendMessage(form, childMessageType, chatType)
    },
    messageHandle(payload) {
      const info = payload.info || payload
      if (info.to != `#${this.bizInfo.sessionId}`) return

      this.webSocket.sendMessageCallback(this.bizInfo.sessionId)
      this.messageBox.push({ ...info })

      this.pageToBottom()
    },
    async getHistoryMessage() {
      if (['APPOINTMENT', 'WAIT_TREAT'].includes(this.bizInfo.status)) return

      const params = {
        userId: this.userId,
        sessionId: this.bizInfo.sessionId,
        msgId: this.messageBox[0]?.msgId || -1,
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

      this.pageToBottom()
    },
    pageToBottom() {
      this.$nextTick(() =>
        uni
          .createSelectorQuery()
          .in(this)
          .select('#message-box')
          .boundingClientRect(({ height }) => {
            height > 300 && (this.scrollTop = height - 300)
          })
          .exec(),
      )
    },
    toolBarShowFunc() {
      this.toolBarShow = !this.toolBarShow
    },
    toolListener(e) {
      const event = e.currentTarget.dataset.event
      this[event]()
    },
    chooseImage() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: async res => {
          const { body } = await upload(res.tempFilePaths[0])

          if (!body) return
          this.toolBarShowFunc()
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
          this.toolBarShowFunc()
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
page {
  overflow: hidden;
}

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

.btn-back {
  background-color: #fff;
  color: #333;
}

.top-bar {
  z-index: 5;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
}

.doctor-name {
  color: $uni-color-primary;
}

.top-bar__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
}

.top-bar__expand {
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.avatar-wrapper {
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
}

.top-bar__expand_doctor {
  margin-right: 20rpx;
  font-size: 34rpx;
  font-weight: bolder;
  color: #1a1a1a;
}

.top-bar__expand_cell {
  padding: 20rpx 0;
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.top-bar__expand_cell_label {
  width: 180rpx;
  font-size: 28rpx;
}

.top-bar__expand_cell_value {
  margin-left: 70rpx;
  font-size: 28rpx;
  color: #1a1a1a;
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
  }
}

.message-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 600rpx;
}

.bottom-bar {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  display: none;

  width: 100%;
  background-color: #fff;
  padding: 20rpx 0 32rpx;
  box-sizing: border-box;

  &.show {
    display: block;
  }

  .input-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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

.btn-suspended {
  position: fixed;
  z-index: 1;
  bottom: 24rpx;
  right: 2rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 88rpx;
  height: 88rpx;
  background-color: #fff;
  border-radius: 50%;
}

.btn-suspended__icon {
  width: 50rpx;
  height: 50rpx;
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
