<template>
  <view id="container">
    <!--主页按钮-->
    <homeIcom />
    <archives :order="order" ref="archives" @view="applyView" />
    <view
      class="container"
      :style="{ paddingBottom: !toolBarShow ? '180rpx' : '530rpx' }"
      @click="
        toolBarShow = false
        $refs.archives.showExpand = false
      "
    >
      <message-box
        :orderId="order.orderId"
        :messageBox="messageBox"
        :commonWords="commonWords"
        :avatar="order.userAvatar"
        :newMessage="newMessage"
        @onCommonWords="onCommonWords"
        @viewDIAS="viewDIAS"
      ></message-box>
    </view>

    <!-- 诊室自动关闭倒计时 -->
    <room-countdown
      v-if="showCountDown"
      :countDown="order.countDown"
      :status="order.status"
    />

    <!-- 发起视频患者悬浮头像 -->
    <view
      v-if="suspendedBtnShow"
      class="flex-start-center suspended"
      @click="videoWaitShow = true"
    >
      <image
        class="suspended-avatar"
        :src="FILE_URL(order.userAvatar)"
        mode="aspectFit"
      ></image>
      <view style="line-height: 32rpx;">等待接听</view>
    </view>

    <!-- 发起视频等待患者接受窗口 -->
    <view class="fade" v-if="videoWaitShow">
      <view class="flex-between-start">
        <image
          class="icon"
          :src="require('@/assets/suoxiao@2x.png')"
          mode="aspectFit"
          @click="minimize"
        ></image>
        <view class="flex-between">
          <view style="margin-right: 20rpx;">
            <view class="text-right" style="font-size: 34rpx;">{{
              userInfo.username
            }}</view>
            <view>{{ userInfo.titleName }}</view>
          </view>
          <image
            class="avatar"
            :src="FILE_URL(userInfo.avatar)"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
      <view class="text-center" style="font-size: 32rpx;color: #0AB2C1;"
        >正在等待对方接受邀请...</view
      >
      <view
        ><button class="btn btn-cancel" @click="cancelInvite">
          取消
        </button></view
      >
    </view>

    <template v-if="['APPOINTMENT', 'WAIT_TREAT'].includes(order.status)">
      <view
        v-if="order.bizType == 'CARRYON_PRESC'"
        class="text-right bottom-bar"
      >
        <button class="btn btn-small" @click="refuseDiagnose">拒绝</button>
        <button class="btn btn-small btn-invite" @click="startDiagnose">
          开始接诊
        </button>
      </view>
      <view v-else-if="order.wayType == 'VIDEO'" class="bottom-bar"
        ><button class="btn btn-invite" @click="startDiagnose">
          开始接诊
        </button></view
      >
    </template>

    <view
      v-else-if="order.close && (order.medical || order.rp || order.diagnosis)"
      class="bottom-bar flex-end-start"
    >
      <button
        v-if="order.diagnosis"
        class="button btn-small"
        @click="viewHandlers('DIAS')"
      >
        查看诊断
      </button>
      <button
        v-if="order.medical"
        class="button btn-small"
        @click="viewHandlers('EMH')"
      >
        查看病历
      </button>
      <button
        v-if="order.rp"
        class="button btn-small"
        @click="viewHandlers('RP')"
      >
        查看处方
      </button>
    </view>

    <view v-show="showInput" class="bottom-bar">
      <view class="flex-between">
        <image
          v-if="order.status == 'IN_TREAT'"
          class="bottom-bar__icon"
          :src="require('@/assets/off38@2x.png')"
          mode="aspectFit"
          style="width: 50rpx;"
          @click="finishWork"
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
          :src="require('@/assets/more@2x.png')"
          mode="aspectFit"
          @click="toolbarShowFunc"
        ></image>
      </view>
      <view class="bottom-bar__toolbar" v-show="toolBarShow">
        <view v-show="!commonWordsShow">
          <chat-tools
            :order="order"
            @event="event => this[event]()"
          ></chat-tools>
        </view>

        <!-- 常用语列表 -->
        <view class="uni-swipe-action" v-if="commonWordsShow">
          <uni-swipe-action>
            <view
              class="common-words__item"
              v-for="(item, index) in commonWords"
              :key="item.id"
            >
              <uni-swipe-action-item
                :options="options.map(item => ({ ...item, action: index }))"
                @click="swipeActionEvent"
              >
                <view
                  class="common-words__item_label"
                  @click="selectCommonWords(index)"
                  >{{ item.content }}</view
                >
              </uni-swipe-action-item>
            </view>
          </uni-swipe-action>
        </view>
      </view>

      <!-- 修改常用语 -->
      <uni-popup ref="popup" type="center">
        <view class="dialog-body">
          <view class="dialog-title">修改常用语</view>
          <textarea
            :value="editCommonWordsValue"
            :disable-default-padding="true"
            @input="inputCommonWords"
          />
          <view class="flex-between dialog-footer">
            <view class="dialog-footer_btn" @click="popupClose('popup')"
              >取消</view
            >
            <view class="dialog-footer_btn" @click="popupSave">保存</view>
          </view>
        </view>
      </uni-popup>

      <!-- 诊断内容 -->
      <uni-popup ref="diagnosisPopup" type="center">
        <view class="dialog-body">
          <view class="dialog-title">诊断内容</view>
          <textarea
            :value="editDiagnosisValue"
            :disable-default-padding="true"
            @input="inputDiagnosis"
          />
          <view class="flex-between dialog-footer">
            <view
              class="dialog-footer_btn"
              @click="popupClose('diagnosisPopup')"
              >取消</view
            >
            <view class="dialog-footer_btn" @click="diagnosisSave">保存</view>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import Archives from '../components/Archives.vue'
import ChatTools from '../components/chatTools.vue'
import {
  upload,
  historyMessage,
  receiving,
  clinicInfo,
  over,
  doctorOrderAudit,
  findCommonWords,
  addCommonWords,
  editCommonWords,
  delCommonWords,
  applyAuth,
  doctorSessionData,
  findDiagnosisInClinic,
  findDiagByDiagId,
} from '@/common/request/index.js'
import { getOrderInfo } from '@/common/request/prescriptionList.js'
export default {
  components: {
    Archives,
    ChatTools,
  },
  data() {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
      userId: uni.getStorageSync('userId'),
      userInfo: this.$store.state.userInfo,
      bizTypeEnums: {
        CONSULT: '在线咨询',
        REPEAT_CLINIC: '在线复诊',
        CARRYON_PRESC: '慢病续方',
      },
      wayTypeEnums: {
        VIDEO: '视频',
        GRAPHIC: '图文',
        PHONE: '电话',
      },
      // 常用语列表
      commonWords: [],
      // swipeAction滑动菜单
      options: [
        {
          text: '修改',
          style: {
            backgroundColor: '#0ab2c1',
          },
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#e45b5b',
          },
        },
      ],
      showExpand: false, //顶部患者档案显示
      suspendedBtnShow: false, //悬浮按钮显示
      videoWaitShow: false, //邀请患者视频等待弹窗
      chatType: '', //聊天类型，图文，视频
      inputValue: '', //输入框内容
      currentEditCommonWordsIndex: null,
      editCommonWordsValue: '', //修改常用语 textarea值
      editDiagnosisValue: '', //发送诊断内容 textarea值
      toolBarShow: false, //聊天工具显示
      commonWordsShow: false, //常用语工具显示
      messageBox: [], //聊天记录
      order: {},
      newMessage: null,
      interval: null,
      orderInfo: {},
    }
  },
  computed: {
    showCountDown() {
      if (this.order.close === 0 && this.order.countDown) {
        return true
      } else {
        return false
      }
    },
    showInput() {
      return (
        this.order.close === 0 &&
        (this.order.speak ||
          this.order.bizType == 'CONSULT' ||
          (this.order.bizType == 'REPEAT_CLINIC' &&
            this.order.wayType == 'GRAPHIC'))
      )
    },
  },
  async onLoad(options) {
    console.log(options,'参数')
    uni.$on('MESSAGE_EVENT_HANDLER', this.messageEventHandler)
    uni.$on('SocketConnect', this.onSocketConnect)
    uni.$on('onMessage', this.messageHandler)

    this.order = options

    this.getCommonWords()
    await this.getClinicInfo()
    this.getHistoryMessage()

    uni.setNavigationBarTitle({
      title:
        this.webSocket.getSocketConnect() ||
        `${this.bizTypeEnums[this.order.bizType]}(${
          this.wayTypeEnums[this.order.wayType]
        })`,
    })

    // 清除未读消息
    const unReadList = this.webSocket.getUnread(this.order.sessionId)
    if (unReadList.length) {
      this.webSocket.sendMessageCallback(this.order.sessionId)
      this.newMessage = unReadList[0].info
    }
    this.getOrderInfo()
  },
  onShow() {
    this.getClinicInfo()
  },
  onHide() {
    if (this.interval) {
      this.deleteInterval('interval')
    }
  },
  onUnload() {
    uni.$off('MESSAGE_EVENT_HANDLER')
    uni.$off('SocketConnect', this.onSocketConnect)
    uni.$off('onMessage', this.messageHandler)
    if (this.interval) {
      this.deleteInterval('interval')
    }
  },
  onPullDownRefresh() {
    this.getHistoryMessage().then(function() {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    deleteInterval(interval) {
      clearInterval(this[interval])
      this[interval] = null
    },
    async getClinicInfo() {
      const params = {
        orderId: this.order.orderId,
      }
      const order = await clinicInfo(params)
      this.order = { ...order }

      const { status, startTime, closeTime, bizType } = order

      let countDownTime = null
      if (bizType == 'REPEAT_CLINIC' && status == 'APPOINTMENT' && startTime) {
        countDownTime = +new Date(startTime.replace(/-/g, '/'))
      } else if (
        ['WAIT_TREAT', 'IN_TREAT', 'FINISH'].includes(status) &&
        closeTime
      ) {
        countDownTime = +new Date(closeTime.replace(/-/g, '/'))
      }

      this.interval && this.deleteInterval('interval')

      if (countDownTime) {
        this.interval = setInterval(() => {
          const time = countDownTime - +new Date()

          if (time <= 0) {
            this.deleteInterval('interval')
            this.$set(this.order, 'countDown', null)
          } else {
            const h = parseInt(time / 1000 / 60 / 60)
            const m = parseInt((time / 1000 / 60) % 60)
            const s = parseInt(((time / 1000) % 60) % 60)

            this.$set(
              this.order,
              'countDown',
              `${('0' + h).substr(-2)}:${('0' + m).substr(-2)}:${(
                '0' + s
              ).substr(-2)}`,
            )
          }
        }, 1000)
      }
    },
    async getHistoryMessage() {
      const params = {
        userId: this.userId,
        sessionId: this.order.sessionId,
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
        .reverse()

      this.messageBox = [...list, ...this.messageBox]

      if (this.messageBox.length <= 15) {
        this.pageScroll()
      }
    },
    async refuseDiagnose() {
      const params = {
        orderId: this.order.orderId,
        reply: false,
      }
      await doctorOrderAudit(params)
      uni.navigateBack({
        delta: 1,
      })
    },
    async startDiagnose() {
      if (!['WAIT_TREAT', 'APPOINTMENT'].includes(this.order.status)) return

      await receiving({ orderId: this.order.orderId })
      await this.getClinicInfo()

      if (['GRAPHIC', 'PHONE'].includes(this.order.wayType)) return

      uni.showModal({
        title: '提示',
        content: '是否向患者发起视频通话？',
        cancelText: '否',
        confirmText: '是',
        success: ({ confirm }) => {
          if (confirm) {
            this.sendMessage({
              childMessageType: this.$protobufMessageType.CRVIDEO,
            })
            this.videoWaitShow = true
          }
        },
      })
    },
    finishWork() {
      uni.showModal({
        title: '提示',
        content: '是否确认？',
        cancelText: '否',
        confirmText: '是',
        success: async ({ confirm }) => {
          if (confirm) {
            const params = {
              orderId: this.order.orderId,
            }
            await over(params)
            this.suspendedBtnShow = false
            if (this.order.wayType == 'VIDEO') {
              const params = {
                tab: this.order.bizType,
                status: 'WAIT_TREAT',
                currentNum: 1,
                pageSize: 9999,
                wayType: 'VIDEO',
              }
              const { list } = await doctorSessionData(params)
              if (list.length > 0) {
                uni.showModal({
                  title: '提示',
                  content: '服务已结束，是否继续下一个?',
                  cancelText: '否',
                  confirmText: '是',
                  success: async ({ confirm, cancel }) => {
                    if (confirm) {
                      this.order = { ...list[0] }
                      await this.getClinicInfo()
                      this.startDiagnose()
                    } else if (cancel) {
                      uni.navigateBack({
                        delta: 1,
                      })
                    }
                  },
                })
              } else {
                this.getClinicInfo()
              }
            } else {
              this.getClinicInfo()
            }
          }
        },
      })
    },
    cancelInvite() {
      this.videoWaitShow = false
      this.suspendedBtnShow = false
      this.sendMessage({
        value: 'cancel',
        childMessageType: this.$protobufMessageType.CRVIDEO,
      })
    },
    minimize() {
      this.suspendedBtnShow = true
      this.videoWaitShow = false
    },
    toolbarShowFunc() {
      this.toolBarShow = !this.toolBarShow
      this.commonWordsShow = false

      if (this.toolBarShow) {
        this.pageScroll()
      }
    },
    // 修改常用语
    inputCommonWords(event) {
      this.editCommonWordsValue = event.detail.value
    },
    inputDiagnosis(event) {
      this.editDiagnosisValue = event.detail.value
    },
    inputChange({ detail }) {
      const value = detail.value
      if (!value) return

      this.inputValue = value
    },
    inputConfirm() {
      if (!this.inputValue || this.webSocket.getSocketConnect()) return

      const value = this.inputValue
      this.inputValue = ''
      this.sendMessage({ value })
    },
    async applyView({ id, memberId, open }) {
      if (open) {
        uni.navigateTo({
          url: '/pages-user/healthRecords/detail?id=' + id,
        })
      } else {
        const params = {
          medicalId: id,
          memberId,
          roomId: this.order.roomId,
        }
        await applyAuth(params)
      }
    },
    sendMessage({
      value,
      childMessageType = this.$protobufMessageType.DEFAULT,
    }) {
      this.startDiagnose()
      this.newMessage && (this.newMessage = null)

      const form = {
        fromNickName: this.userInfo.username,
        to: this.order.sessionId,
        toNickName: this.order.memberName,
        body: value,
      }

      // 用户类型 医生
      const chatType = this.$protobufChatType.DOCTOR
      this.webSocket.sendMessage(form, childMessageType, chatType)
    },
    pageScroll() {
      this.$nextTick(() => {
        const node = uni
          .createSelectorQuery()
          .in(this)
          .select('#container')

        node
          .boundingClientRect(data => {
            if (
              data.height >=
              this.windowHeight - (this.toolBarShow ? 265 : 100)
            ) {
              uni.pageScrollTo({
                scrollTop: data.height,
                duration: 100,
              })
            }
          })
          .exec()
      })
    },
    onCommonWords(payload) {
      if (payload.index > -1) {
        this.$refs.popup.open()
        this.editCommonWordsValue = this.commonWords[payload.index].content
        this.currentEditCommonWordsIndex = payload.index
      } else {
        this.addCommonWords(payload.words)
      }
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
    video() {
      this.videoWaitShow = true
      this.sendMessage({ childMessageType: this.$protobufMessageType.CRVIDEO })
    },
    commonWordsFunc() {
      this.commonWordsShow = true
    },
    selectCommonWords(index) {
      this.sendMessage({ value: this.commonWords[index].content })
      this.commonWordsShow = false
    },
    swipeActionEvent({ content, index }) {
      const { action } = content
      if (index == 1) {
        uni.showModal({
          title: '提示',
          content: '是否确认操作',
          cancelText: '否',
          confirmText: '是',
          confirmColor: '#0AB2C1',
          success: ({ confirm }) => {
            if (confirm) {
              this.delCommonWords(this.commonWords[action].id)
            }
          },
        })
      } else {
        this.currentEditCommonWordsIndex = action
        this.editCommonWordsValue = this.commonWords[action].content
        this.$refs.popup.open()
      }
    },
    popupClose(popup) {
      this.$refs[popup].close()
    },
    async popupSave() {
      if (!this.editCommonWordsValue) return

      await this.editCommonWords({
        id: this.commonWords[this.currentEditCommonWordsIndex].id,
        content: this.editCommonWordsValue,
      })

      this.popupClose('popup')
      uni.showToast({
        icon: 'success',
        title: '修改成功',
        duration: 2000,
      })
    },
    diagnosisSave() {
      this.sendMessage({
        value: this.editDiagnosisValue,
        childMessageType: this.$protobufMessageType.DIAS,
      })
    },
    messageEventHandler(options) {
      if (options.optContent == '已同意') {
        this.$refs?.archives?.getArchiveList()
      }
    },
    messageHandler(payload) {
      const info = payload.info || payload
      if (info.to != `#${this.order.sessionId}`) return

      info.msgId && this.webSocket.sendMessageCallback(this.order.sessionId)

      this.messageBox.push({ ...info })
      this.pageScroll()

      if (info.childMessageType == this.$protobufMessageType.CRVIDEO) {
        if (['accept', 'refuse'].includes(info.body)) {
          this.videoWaitShow = false
          this.suspendedBtnShow = false
        }

        if (info.body == 'accept') {
          // 进入视频通话页面
          const { orderId, sessionId } = this.order
          //#ifdef H5 || APP-PLUS
          uni.navigateTo({
            url: `/pages-doctor/video/h5video?orderId=${orderId}&sessionId=${sessionId}`,
          })
          //#endif
          //#ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pages-doctor/video/video?orderId=${orderId}&sessionId=${sessionId}`,
          })
          //#endif
        }
      }
    },
    onSocketConnect() {
      uni.setNavigationBarTitle({
        title:
          this.webSocket.getSocketConnect() ||
          `${this.bizTypeEnums[this.order.bizType]}(${
            this.wayTypeEnums[this.order.wayType]
          })`,
      })
    },
    async getCommonWords() {
      const { list } = await findCommonWords({ pageSize: 9999 })
      this.commonWords = list
    },
    async addCommonWords(content) {
      await addCommonWords({ content })
      this.getCommonWords()

      uni.showToast({
        title: '设置成功',
      })
    },
    async editCommonWords(params) {
      await editCommonWords(params)
      this.getCommonWords()

      uni.showToast({
        title: '修改成功',
      })
    },
    async delCommonWords(id) {
      await delCommonWords({ id })
      this.getCommonWords()
    },
    viewHandlers(handle) {
      switch (handle) {
        case 'RP':
          uni.navigateTo({
            url: `/pages-doctor/user/prescription/info?id=${this.order.orderId}`,
          })
          break
        case 'EMH':
          uni.navigateTo({
            url: `/pages-user/medical/detail?orderId=${this.order.orderId}`,
          })
          break
        case 'DIAS':
          this.viewDIAS()
      }
    },
    async viewDIAS(diagId) {
      const content =
        (await (diagId
          ? findDiagByDiagId({
              diagId,
            })
          : findDiagnosisInClinic({
              orderId: this.order.orderId,
            }))) ?? ''

      uni.showModal({
        title: '查看诊断',
        content: content
          .map(
            c =>
              (c.mainDiagnosis ? '主诊断：' : '诊断：') +
              c.prefixName +
              c.diagnosisName +
              c.suffixName +
              ' ' +
              c.childDtos
                .map(
                  child =>
                    '子诊断：' +
                    child.prefixName +
                    child.diagnosisName +
                    c.suffixName,
                )
                .join(),
          )
          .join('；'),
        showCancel: false,
      })
    },
    treatment() {
      if (this.order.status == 'FINISH') {
        uni.showToast({
          icon: 'none',
          title: '该服务已结束，不能进行处置单预约',
        })
        return
      }
      uni.navigateTo({
        url: `/pages-doctor/treatment/add?orderId=${this.order.orderId}`,
      })
    },
    appointment() {
      if (this.order.status == 'FINISH') {
        uni.showToast({
          icon: 'none',
          title: '该服务已结束，不能进行诊间预约',
        })
        return
      }
      uni.navigateTo({
        url: `/pages-doctor/appointment/add?orderId=${this.order.orderId}&deptId=${this.order.deptId}`,
      })
    },
    diagnosis() {
      uni.navigateTo({
        url: `/pages-doctor/diagnosis/diagnosisList?orderId=${this.order.orderId}&memberId=${this.order.memberId}&sessionId=${this.order.sessionId}&userId=${this.userId}&wayType=${this.order.wayType}`,
      })
    },
    medical() {
      uni.navigateTo({
        url: `/pages-doctor/emr/index?orderId=${this.order.orderId}&memberId=${this.order.memberId}&sessionId=${this.order.sessionId}&userId=${this.userId}&wayType=${this.order.wayType}&memberName=${this.order.memberName}&username=${this.userInfo.username}&createTime=${this.order.createTime}`,
      })
    },
    prescription() {
      console.log(this.order.diagnosis)
      if (!this.order.diagnosis) {
        uni.showToast({
          title: '请先开诊断',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      /*  if (!this.order.medical) {
        uni.showToast({
          title: '请先开病历',
          icon: 'none',
          duration: 1500,
        })
        return
      } */
      uni.navigateTo({
        url: `/pages-doctor/prescription/prescriptionList?orderId=${this.order.orderId}`,
      })
    },
    //获取订单详情
    async getOrderInfo() {
      this.orderInfo = await getOrderInfo({ orderId: this.order.orderId })
    },
  },
}
</script>
<style>
page {
  height: auto;
}
</style>
<style lang="scss" scoped>
.container {
  padding: 90rpx 10rpx 0;
}
.suspended {
  position: fixed;
  right: 0;
  top: 20vh;
  width: 120rpx;
  line-height: 40rpx;
  background-color: #0ab2c1;
  box-shadow: 0px 5px 20px 0px rgba(10, 178, 193, 1);
  border-top-left-radius: 50rpx;
  border-bottom-left-radius: 50rpx;
  padding: 12rpx 16rpx;
  color: #fff;
}
.suspended-avatar {
  flex-shrink: 0;
  margin-right: 12rpx;
  width: 50rpx;
  height: 50rpx;
  border: 2rpx solid #fff;
  border-radius: 50%;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx 0;
  box-sizing: border-box;
}
.bottom-bar__toolbar {
  margin-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;
}
.bottom-bar__icon {
  flex-grow: 0;
  width: 60rpx;
  height: 60rpx;
  padding: 0 20rpx;
}
.bottom-bar__input {
  flex-grow: 1;
  margin-left: 20rpx;
  height: 70rpx;
  line-height: 70rpx;
  padding-left: 12rpx;
  background-color: #f2f2f2;
}
.button {
  height: 68rpx;
  line-height: 66rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  &::after {
    border: none;
  }
}
.btn {
  width: 600rpx;
  height: 68rpx;
  line-height: 68rpx;
  margin: 0 auto;

  &::after {
    border: none;
  }
}
.btn-small {
  display: inline-block;
  margin-left: 0;
  margin-right: 20rpx;
  width: 160rpx;
  background-color: #eee;
  color: #333;
}
.btn-invite {
  background-color: $uni-color-primary;
  color: #fff;
}
.fade {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 4;
  width: 100vw;
  height: 100vh;
  padding: 32rpx 20rpx;
  box-sizing: border-box;
  background-color: rgba($color: #000, $alpha: 0.8);
  color: #fff;

  .icon {
    width: 35rpx;
    height: 35rpx;
  }
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
  }
  .btn-cancel {
    background-color: #e45b5b;
    color: #fff;
  }
}
.common-words__item {
  border-bottom: 2rpx solid #eee;
}
.common-words__item_label {
  width: 100%;
  box-sizing: border-box;
  padding: 24rpx 12rpx;
  color: #666;
}
.dialog-body {
  border-radius: 20rpx;
  background-color: #fff;
}
.dialog-title {
  padding: 20rpx 0;
  text-align: center;
  font-size: 32rpx;
}
textarea {
  margin: 0 20rpx;
  height: 120rpx;
  background-color: #f2f2f2;
  border: none;
  padding: 20rpx;
  color: #666;
}
.dialog-footer {
  margin-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;
}
.dialog-footer_btn {
  width: 50%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #666;

  + .dialog-footer_btn {
    border-left: 2rpx solid #e6e6e6;
    color: #0ab2c1;
  }
}
.uni-swipe-action {
  max-height: 600rpx;
  overflow-y: auto;
}
</style>
