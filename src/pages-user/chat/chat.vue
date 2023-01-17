<template>
  <view id="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 正在排队 -->
    <view
      class="container wait-container"
      v-if="
        order.wayType == 'VIDEO' &&
          ['APPOINTMENT', 'WAIT_TREAT'].includes(order.status) &&
          order.queue == 0 &&
          order.status !== 'WAIT_TREAT'
      "
    >
      <view class="container-bg">
        <template v-if="order.status == 'APPOINTMENT'">
          <view class="wait-text">距离您复诊还有</view>
          <view class="time-down">{{ order.countDown || '00:00:00' }}</view>
        </template>
        <view v-else class="wait-text">
          前面还有
          <text style="font-size: 50rpx;color: #0AB2C1;">{{
            order.queue || 0
          }}</text>
          位
        </view>
      </view>
      <button class="btn btn-back" @click="back">返回</button>
    </view>

    <!-- 诊室自动关闭倒计时 -->
    <room-countdown
      v-if="showCountDown"
      :countDown="order.countDown"
      :status="order.status"
    />

    <view class="top-bar">
      <view class="top-bar__title">
        <view class="flex-start-center">
          <view>{{ bizTypeEnums[bizInfo.bizType] }}</view>
          <view class="ml-50">
            健康卡：
            <text class="doctor-name">{{ bizInfo.memberName }}</text>
          </view>
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
              :src="
                bizInfo.avatar
                  ? FILE_URL(bizInfo.avatar)
                  : require('@/assets/user/user_d_head.png')
              "
              mode="scaleToFill"
            ></image>
          </view>
          <view class="ml-30">
            <view>
              <text class="top-bar__expand_doctor">{{
                bizInfo.doctorName
              }}</text>
              <text>{{ bizInfo.biz.sex == 1 ? '男' : '女' }}</text>
            </view>
            <view class=""
              >{{ bizInfo.biz.deptName }} {{ bizInfo.biz.titleName }}
              {{ bizInfo.biz.orgName }}</view
            >
            <view class="">擅长：{{ bizInfo.biz.skilled }}</view>
          </view>
        </view>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">健康卡</view>
          <view class="top-bar__expand_cell_value">{{
            bizInfo.memberName
          }}</view>
        </view>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">类型</view>
          <view class="top-bar__expand_cell_value">{{
            bizTypeEnums[bizInfo.bizType]
          }}</view>
        </view>
        <view
          class="top-bar__expand_cell flex-start-center"
          v-if="bizInfo.historyMedicalInfo"
          @click="historicalShow = !historicalShow"
        >
          <view class="top-bar__expand_cell_label">历史就诊记录</view>
          <view class="top-bar__expand_cell_value  flex_1">{{
            bizInfo.historyMedicalInfo.visitDate || '-'
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
        <view v-if="bizInfo.historyMedicalInfo" v-show="historicalShow">
          <view class="flex-between">
            <view>
              {{
                bizInfo.historyMedicalInfo.medicalType == 'ZY'
                  ? '住院记录 ' +
                    bizInfo.historyMedicalInfo.admitDate +
                    '-' +
                    bizInfo.historyMedicalInfo.dischargeDate
                  : bizInfo.historyMedicalInfo.medicalType == 'MZ'
                  ? '门诊记录 ' + bizInfo.historyMedicalInfo.visitDate
                  : bizInfo.historyMedicalInfo.medicalType == 'TJ'
                  ? '体检报告 ' + bizInfo.historyMedicalInfo.visitDate
                  : ''
              }}
            </view>
            <view class="biaoshi">互联网</view>
          </view>

          <view style="font-size: 32rpx;color: #1a1a1a;">
            {{ bizInfo.historyMedicalInfo.patientName }}
          </view>
          <view>
            {{ bizInfo.historyMedicalInfo.deptName }}
            {{ bizInfo.historyMedicalInfo.doctorName }}
            {{ bizInfo.historyMedicalInfo.title }}
          </view>
          <view v-if="bizInfo.historyMedicalInfo.inDiagnose">
            入院诊断：
            <text style="color: #333;">{{
              bizInfo.historyMedicalInfo.inDiagnose
            }}</text>
          </view>
          <view v-if="bizInfo.historyMedicalInfo.outDiagnose">
            出院诊断：
            <text style="color: #333;">{{
              bizInfo.historyMedicalInfo.outDiagnose
            }}</text>
          </view>
          <view v-if="bizInfo.historyMedicalInfo.diagnose">
            初步诊断：
            <text style="color: #333;">{{
              bizInfo.historyMedicalInfo.diagnose
            }}</text>
          </view>
          <view v-if="bizInfo.historyMedicalInfo.disposeAdvise">
            治疗意见：
            <text style="color: #333;">{{
              bizInfo.historyMedicalInfo.disposeAdvise
            }}</text>
          </view>
          <view v-if="bizInfo.historyMedicalInfo.content">
            体检内容：
            <text style="color: #333;">{{
              bizInfo.historyMedicalInfo.content
            }}</text>
          </view>
          <view
            v-if="
              bizInfo.historyMedicalInfo.medicalType == 'TJ' &&
                bizInfo.historyMedicalInfo.visitDate
            "
          >
            体检时间：
            <text style="color: #333;">{{
              bizInfo.historyMedicalInfo.visitDate
            }}</text>
          </view>
        </view>
        <view
          class="top-bar__expand_cell flex-between"
          v-if="bizInfo.historyRpList"
          @click="isAllRp = !isAllRp"
        >
          <view class="top-bar__expand_cell_label">续方处方</view>
          <view>
            <image
              class="arrow-expand"
              :class="{ desc: isAllRp }"
              :src="require('@/assets/right11@2x.png')"
              mode="aspectFit"
              style="width: 16rpx;height: 28rpx;"
            ></image>
          </view>
        </view>
        <block v-if="isAllRp">
          <view v-for="(item, index) in bizInfo.historyRpList" :key="item.id">
            <view class="flex-between" v-if="item.id">
              <view class="prescription-no">处方号：{{ item.id }}</view>
              <view class="price">￥{{ item.rpFee }}</view>
            </view>
            <view class="">{{ item.doctorName }} {{ item.title }}</view>
            <view class="flex-between">
              <view class="">{{ item.orgName }} {{ item.deptName }}</view>
              <view class="">{{ item.createTime }}</view>
            </view>
            <view
              class="detail"
              v-show="item.isRpshow"
              v-for="ite in item.contentList"
              :key="ite.id"
            >
              <view class="flex-between">
                <view class="medicine-name">{{ ite.name }} {{ ite.spec }}</view>
                <view class="medicare">
                  医保：{{
                    ite.medicare == 'A'
                      ? '甲'
                      : ite.medicare == 'B'
                      ? '乙'
                      : ite.medicare == 'C'
                      ? '丙'
                      : ite.medicare == 'ME_FEE'
                      ? '自费'
                      : '-'
                  }}
                </view>
              </view>
              <view class="ml-20">
                <view class="use">
                  {{ ite.useWays }} {{ ite.useFrequency }} {{ ite.singleDose
                  }}{{ ite.singleDoseUnit }}/次 ￥{{ ite.price }}/{{
                    ite.totalUnit
                  }}x{{ ite.total }}
                </view>
                <view class="price">￥{{ ite.totalPrice }}</view>
                <view class="remark">备注：{{ ite.remark }}</view>
              </view>
            </view>
            <view class="text-center" @click="openRp(item.isRpshow, index)">
              <image
                mode="aspectFit"
                style="width: 40rpx; height: 20rpx;"
                :class="{ desc: item.isRpshow }"
                :src="require('@/assets/zhankaihui@2x.png')"
              ></image>
            </view>
          </view>
        </block>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">诊疗形式</view>
          <view class="top-bar__expand_cell_value">{{
            wayTypeEnums[bizInfo.wayType]
          }}</view>
        </view>
        <view
          class="top-bar__expand_cell flex-start-center"
          v-if="bizInfo.bizType == 'REPEAT_CLINIC' && bizInfo.startTime"
        >
          <view class="top-bar__expand_cell_label">复诊时间</view>
          <view class="top-bar__expand_cell_value">{{
            bizInfo.date + ' ' + bizInfo.startTime
          }}</view>
        </view>
      </view>
    </view>
    <view
      id="page-body"
      class="page-body"
      :style="{
        paddingBottom: !toolBarShow ? '160rpx' : '360rpx',
        minHeight: !toolBarShow
          ? 'calc(100vh - 260rpx)'
          : 'calc(100vh - 460rpx)',
      }"
      @click="
        toolBarShow = false
        showExpand = false
      "
    >
      <view v-if="order.bizType == 'CONSULT'" class="question-tip">
        <!-- 本次服务，您可以向医生咨询
        <text style="color: #e45c5c;">{{ order.questionNum || 0 }}</text>
        个问题 -->
        {{
          order.wayType === 'VIDEO'
            ? '本次服务，咨询时长25～30分钟，请您等待咨询师发起视频'
            : '请您耐心等待咨询师回复，本次服务回复内容供您参考。'
        }}
      </view>
      <view
        v-if="order.status == 'WAIT_TREAT' && queueInfo.sortNum > 0"
        class="question-tip"
      >
        {{
          `当前队列 ${
            queueInfo.sortNum
          }，预计等候时长为 ${queueInfo.expectPeriod / 60} 分钟。`
        }}
      </view>
      <message-box
        :messageBox="messageBox"
        :orderId="order.orderId"
        :roomId="order.roomId"
        :avatar="bizInfo.avatar"
        :newMessage="newMessage"
        :memberId="order.memberId"
        @viewDIAS="viewDIAS"
      ></message-box>
    </view>

    <view
      v-if="order.close && (order.medical || order.rp || order.diagnosis)"
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
        class="button btn-small btn-primary"
        @click="viewHandlers('RP')"
      >
        查看处方
      </button>
    </view>
    <view class="bottom-bar" v-else-if="showInput">
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
          :value="inputValue"
          type="text"
          placeholder="请输入您要咨询的问题"
          confirm-type="send"
          @input="inputChange"
          @confirm="inputConfirm"
        />
        <image
          class="bottom-bar__icon"
          :src="require('@/assets/gengduo@2x.png')"
          mode="aspectFit"
          @click="toolbarShowFunc"
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
  </view>
</template>

<script>
import {
  upload,
  historyMessage,
  clinicBizInfo,
  clinicInfo,
  findDiagContentById,
  findDiagByDiagId,
  over,
  usersTopChat,
  userQueue,
} from '@/common/request/index.js'
export default {
  data() {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
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
        {
          image: require('@/assets/quxiaowenzhen.png'),
          title: '取消问诊',
          event: 'endroom',
        },
      ],
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
      statusEnums: {
        WAIT_TREAT: '待接诊',
        IN_TREAT: '接诊中',
        FINISH: '已结束',
      },
      order: {},
      waiting: false, //排队窗口
      inviting: false, //邀请视频窗口
      showExpand: false,
      inputValue: '',
      messageBox: [],
      toolBarShow: false, //聊天工具显示
      bizInfo: {
        biz: {},
      },
      diagnosContent: '',
      historicalShow: false,
      interval: null,
      newMessage: null,
      isAllRp: false,
      queueInfo: {}, //排队信息
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
            (this.order.wayType == 'GRAPHIC' || this.order.wayType == 'VIDEO')))
      )
    },
  },
  async onLoad(options) {
    this.order = options
    if (options.bizId && !options.orderId) {
      Object.assign(this.order, { orderId: options.bizId })
    }

    await this.getBizInfo()
    this.getHistoryMessage()

    uni.setNavigationBarTitle({
      title:
        this.webSocket.getSocketConnect() || `${this.bizInfo.doctorName}的诊室`,
    })

    // 清除未读消息
    const unReadList = this.webSocket.getUnread(this.bizInfo.sessionId)
    if (unReadList.length) {
      this.webSocket.sendMessageCallback(this.bizInfo.sessionId)
      this.newMessage = unReadList[0]
    }
  },
  onShow() {
    if (this.webSocket.getSocketConnect()) {
      this.webSocket.connectSocket()
      setTimeout(() => {
        uni.setNavigationBarTitle({
          title:
            this.webSocket.getSocketConnect() ||
            `${this.bizInfo.doctorName}的诊室`,
        })
      }, 1000)
    }
    this.getClinicInfo()
    uni.$on('SocketConnect', this.onSocketConnect)
    uni.$on('onMessage', this.messageHandler)
  },
  onHide() {
    this.interval && clearInterval(this.interval)
    uni.$off('SocketConnect', this.onSocketConnect)
    uni.$off('onMessage', this.messageHandler)
  },
  onUnload() {
    this.interval && clearInterval(this.interval)
    uni.$off('SocketConnect', this.onSocketConnect)
    uni.$off('onMessage', this.messageHandler)
    uni.$off('sync')
  },
  async onPullDownRefresh() {
    try {
      await this.getHistoryMessage()
    } catch (error) {}

    uni.stopPullDownRefresh()
  },
  methods: {
    //获取排队数量时间
    async getQueueInfo(doctorId, orderId) {
      this.queueInfo = await userQueue({ doctorId, orderId })
    },
    openRp(show, index) {
      this.$set(this.bizInfo.historyRpList[index], 'isRpshow', !show)
    },
    async getHistoryMessage() {
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
        .reverse()

      this.messageBox = [...list, ...this.messageBox]

      if (this.messageBox.length <= 15) {
        this.$nextTick(() => {
          this.pageScroll()
        })
      }
    },
    // 业务信息
    async getBizInfo() {
      this.bizInfo = await clinicBizInfo({
        orderId: this.order.orderId,
      })
    },
    // 诊室信息
    async getClinicInfo() {
      const params = {
        orderId: this.order.orderId,
      }
      const order = await clinicInfo(params)
      //获取排队信息
      this.getQueueInfo(order.doctorId, order.orderId)
      this.order = { ...order }

      const { status, startTime, closeTime, bizType } = order

      let countDownTimestamp = ''
      if (bizType == 'REPEAT_CLINIC' && status == 'APPOINTMENT' && startTime) {
        countDownTimestamp = +new Date(startTime.replace(/-/g, '/'))
      } else if (['WAIT_TREAT', 'IN_TREAT'].includes(status) && closeTime) {
        countDownTimestamp = +new Date(closeTime.replace(/-/g, '/'))
      }

      if (countDownTimestamp) {
        this.countDownFunc(countDownTimestamp)
        this.interval = setInterval(() => {
          this.countDownFunc(countDownTimestamp)
        }, 1000)
      } else {
        this.interval && clearInterval(this.interval)
      }

      //诊室状态判读是否需要取消问诊按钮
      if (this.order.status !== 'WAIT_TREAT') {
        this.chatTools = this.chatTools.filter(i => i.event !== 'endroom')
      }
    },
    toolbarShowFunc() {
      ;(this.toolBarShow = !this.toolBarShow) && this.pageScroll()
    },
    inputChange(event) {
      const value = event.detail.value
      value && (this.inputValue = value)
    },
    inputConfirm(event) {
      if (!this.inputValue || this.webSocket.getSocketConnect()) return

      this.sendMessage({
        value: this.inputValue.trim(),
      })
      this.inputValue = ''
    },
    sendMessage({
      value,
      childMessageType = this.$protobufMessageType.DEFAULT,
    }) {
      this.newMessage && (this.newMessage = null)
      const form = {
        fromNickName: this.fromNickName,
        to: this.order.sessionId,
        toNickName: this.bizInfo.doctorName,
        body: value,
      }
      // 用户类型 用户
      const chatType = this.$protobufChatType.USER
      this.webSocket.sendMessage(form, childMessageType, chatType)
    },
    pageScroll() {
      this.$nextTick(() => {
        const node = uni
          .createSelectorQuery()
          .in(this)
          .select('#container')

        node
          .boundingClientRect(({ height }) => {
            if (height >= this.windowHeight - 66) {
              uni.pageScrollTo({
                scrollTop: height,
                duration: 100,
              })
            }
          })
          .exec()
      })
    },
    toolListener(e) {
      const event = e.currentTarget.dataset.event
      if (event === 'endroom') {
        //取消问诊调用
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
              await usersTopChat(params)
              uni.showToast({
                title: '取消成功！',
                icon: 'none',
              })
              setTimeout(this.getClinicInfo, 100)
            }
          },
        })
        return
      }
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
    onSocketConnect() {
      uni.setNavigationBarTitle({
        title:
          this.webSocket.getSocketConnect() ||
          `${this.bizInfo.doctorName}的诊室`,
      })
    },
    back() {
      uni.navigateBack({
        delta: 1,
      })
    },
    countDownFunc(countDownTimestamp) {
      const time = countDownTimestamp - +new Date()
      time <= 0 && clearInterval(this.interval)
      const h = parseInt(time / 1000 / 60 / 60)
      const m = parseInt((time / 1000 / 60) % 60)
      const s = parseInt(((time / 1000) % 60) % 60)

      this.$set(
        this.order,
        'countDown',
        `${('0' + h).substr(-2)}:${('0' + m).substr(-2)}:${('0' + s).substr(
          -2,
        )}`,
      )
    },
    viewHandlers(handle) {
      switch (handle) {
        case 'RP':
          this.goTopersion()
          break
        case 'EMH':
          uni.navigateTo({
            url: `/pages-user/medical/detail?orderId=${this.order.orderId}`,
          })
          break
        case 'DIAS':
          this.viewDIAS()
          break
        default:
      }
    },
    // 查看诊断
    async viewDIAS(diagId) {
      let content = ''
      if (diagId) {
        const list = await findDiagByDiagId({
          diagId,
        })
        content = list
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
          .join('；')
      } else {
        content = await findDiagContentById({
          diagId: this.order.orderId,
        })
      }
      uni.showModal({
        title: '查看诊断',
        content: content,
        showCancel: false,
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
            setTimeout(this.getClinicInfo, 100)
          }
        },
      })
    },
    onSocketConnect() {
      uni.setNavigationBarTitle({
        title:
          this.webSocket.getSocketConnect() ||
          `${this.bizInfo.doctorName}的诊室`,
      })
    },
    messageHandler(payload) {
      const info = payload.info || payload
      //开了病历 刷新诊室
      if (info.childMessageType === 'EMH') {
        this.getClinicInfo()
      }
      //判断是否接收到当前诊室的终止服务消息-确认弹窗提示退出诊室
      if (
        (info.childMessageType === 'SV' || info.childMessageType === 33) &&
        info.to === `#${this.order.sessionId}`
      ) {
        uni.showModal({
          title: '提示',
          content: '当前服务已结束，请退出诊室！',
          success: e => {
            uni.navigateBack({
              delta: 1,
            })
          },
        })
      }
      if (info.to != `#${this.order.sessionId}`) return

      this.messageBox.push({ ...info })
      this.pageScroll()

      info.msgId && this.webSocket.sendMessageCallback(this.order.sessionId)
    },
    back() {
      uni.navigateBack({
        delta: 1,
      })
    },
    countDownFunc(countDownTimestamp) {
      const time = countDownTimestamp - +new Date()
      time <= 0 && clearInterval(this.interval)
      const h = parseInt(time / 1000 / 60 / 60)
      const m = parseInt((time / 1000 / 60) % 60)
      const s = parseInt(((time / 1000) % 60) % 60)

      this.$set(
        this.order,
        'countDown',
        `${('0' + h).substr(-2)}:${('0' + m).substr(-2)}:${('0' + s).substr(
          -2,
        )}`,
      )
    },
    goTopersion() {
      uni.navigateTo({
        url: `/pages-user/prescription/prescription?orderId=${this.order.orderId}`,
      })
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
.talking {
  display: block;
}

.container {
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.container-bg {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
}

.wait-container {
  z-index: 4;
}

.wait-text {
  text-align: center;
  font-size: 30rpx;
  color: #fff;
}

.btn {
  position: absolute;
  left: 50%;
  margin-left: -35%;
  width: 70%;
  line-height: 80rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
}

.btn-back {
  bottom: 40rpx;
  background-color: #fff;
}

.time-down {
  margin: 40rpx 0;
  width: 440rpx;
  height: 100rpx;
  line-height: 100rpx;
  background-color: $uni-color-primary;
  border-radius: 50rpx;
  text-align: center;
  font-size: 50rpx;
  color: #fff;
}

.top-bar {
  /* #ifdef H5 */
  padding-top: 80rpx;
  /* #endif */
  z-index: 2;
  max-height: 80vh;
  overflow-y: auto;
  padding-bottom: 20rpx;
}

.doctor-name {
  color: $uni-color-primary;
}

.top-bar__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  color: #666;
}

.top-bar__expand {
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.avatar-wrapper {
  flex-shrink: 0;
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
  width: 200rpx;
  font-size: 28rpx;
}

.top-bar__expand_cell_value {
  margin-left: 120rpx;
  font-size: 28rpx;
  color: #1a1a1a;
}

.page-body {
  margin-top: 100rpx;
  padding: 2rpx 20rpx 0;
  min-height: 100%;
}

.bottom-bar {
  position: fixed;
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
  margin-left: 20rpx;
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

.arrow-expand {
  transform: rotate(90deg);

  &.desc {
    transform: rotate(-90deg);
  }
}

.prescription-no {
  font-size: 32rpx;
  color: #333;
}

.detail {
  margin-top: 32rpx;
  padding: 20rpx;
  background-color: #eee;
}

.medicine-name {
  color: #333;
}

.use {
  color: #e45b5b;
}

.price {
  font-size: 32rpx;
  color: #0ab2c1;
}

.dialog-body {
  width: 70vw;
  border-radius: 20rpx;
  background-color: #fff;
}

.dialog-title {
  padding: 20rpx 0;
  text-align: center;
  font-size: 32rpx;
}

.dialog-footer {
  margin-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;
}

.dialog-footer_btn {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #0ab2c1;
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

.btn-small {
  margin-left: 0;
  margin-right: 20rpx;
  background-color: #f2f2f2;
  color: #333;
}

.btn-primary {
  background-color: $uni-color-primary;
  color: #fff;
}

.question-tip {
  width: 70%;
  margin: 40rpx auto 0;
  padding: 12rpx 10rpx;
  border-radius: 40rpx;
  text-align: center;
  font-size: 24rpx;
  background-color: #e6e6e6;
  color: #343434;
}

.biaoshi {
  background-color: $uni-color-primary;
  font-size: 24rpx;
  color: #fff;
  padding: 4rpx 8rpx;
  border-radius: 5rpx;
  margin-right: -20rpx;
}

.desc {
  transform: rotate(180deg);
}
</style>
