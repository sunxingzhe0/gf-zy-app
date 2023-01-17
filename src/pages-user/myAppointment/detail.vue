<template>
  <view :class="{ container: [2, 5].includes(info.state) }">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="top-tip" v-if="tipsText()"> 温馨提示：{{ tipsText() }} </view>
    <view
      class="top-bg"
      :style="{
        backgroundImage: `url(${FILE_URL_BUILT_IN(
          info.state == 5 ? 'orderIngoBg2_grey.png' : 'orderIngoBg2.png',
        )})`,
      }"
    >
      {{
        info.state == 1
          ? '未缴费'
          : info.state == 2
          ? '已预约'
          : info.state == 3
          ? '已取号'
          : info.state == 4
          ? '退费中'
          : info.state == 5
          ? '已退费'
          : info.state == 6
          ? '已关闭'
          : ''
      }}
    </view>
    <view class="app-card" style="margin-top: -24rpx;">
      <view class="flex-between">
        <view>
          <view class="cell">
            <view class="label">姓名</view>
            <view class="value">{{ info.name }}</view>
          </view>
          <view class="cell">
            <view class="label">医院</view>
            <view class="value">{{ info.orgName || '' }}</view>
          </view>
        </view>
        <view>
          <image
            class="avatar"
            :src="FILE_URL(info.img)"
            mode="scaleToFill"
          ></image>
        </view>
      </view>

      <view class="cell">
        <view class="label">科室</view>
        <view class="value">{{ info.deptName }}</view>
      </view>
      <view class="cell">
        <view class="label">医生</view>
        <view class="value"
          >{{ info.doctorName }}
          <text style="margin-left: 24rpx;">{{ info.title || '' }}</text></view
        >
      </view>
      <view class="cell">
        <view class="label">预约时段</view>
        <view class="value color-red">
          {{ info.visitDate || '' }} {{ info.startTime }}~{{ info.endTime }}
        </view>
        <view class="tag red" v-if="info.cancel && info.state == 2"
          >已逾期</view
        >
        <view class="tag" v-else-if="isToday">今天</view>
      </view>
      <view class="cell" v-if="info.getNoTime">
        <view class="label">取号时间</view>
        <view class="value">
          {{ info.getNoTime }}
        </view>
      </view>
    </view>

    <view class="app-card">
      <view class="cell">
        <view class="label">单据号</view>
        <view class="value">{{ info.documentNo || '-' }}</view>
      </view>
      <view class="cell">
        <view class="label">项目</view>
        <view class="value">预约挂号</view>
      </view>
      <view class="cell">
        <view class="label">号源类型</view>
        <view class="value">{{ info.resourceNo }}</view>
      </view>
      <view class="cell">
        <view class="label">金额</view>
        <view class="value color-red">￥{{ info.fee }}</view>
      </view>
      <view class="cell">
        <view class="label">创建时间</view>
        <view class="value">
          {{ info.createTime || '' }}
        </view>
      </view>
    </view>

    <view class="app-card" v-if="info.payNo">
      <view class="cell">
        <view class="label">支付号</view>
        <view class="value">{{ info.payNo }}</view>
      </view>
      <view class="cell">
        <view class="label">支付方式</view>
        <view class="value">{{ info.payType }}</view>
      </view>
    </view>

    <view class="app-card" v-if="info.backFeeNo">
      <view class="cell">
        <view class="label">退费号</view>
        <view class="value">{{ info.backFeeNo }}</view>
      </view>
      <view class="cell">
        <view class="label">退费方式</view>
        <view class="value">{{ info.backType }}</view>
      </view>
      <view class="cell">
        <view class="label">退费金额</view>
        <view class="value">￥{{ info.backFee }}</view>
      </view>
    </view>
    <!-- <view class="bottom-bar flex-justify-end" v-if="showBottom"> -->
    <view class="bottom-bar flex-justify-end" v-if="info.state == 1">
      <!-- <button class="button" v-if="info.state == 5" @click="del">删除</button> -->
      <!-- <button
        class="button primary"
        v-else-if="info.state == 1"
        :disabled="compare(info)"
        @click="openPay"
      >
        付款
      </button> -->
      <!-- <button class="button" v-if="showCancelButton" @click="cancel">
        取消
      </button> -->
      <button
        class="button primary"
        v-if="info.state == 1"
        :disabled="info.cancel"
        @click="openPay"
      >
        付款
      </button>
    </view>
    <!-- <view
      class="bottom-bar flex-justify-end"
      v-if="deptId === 8323 && state === 2"
    >
      <button class="button primary" style="width: 100%;" @click="acidSignIn">
        签到
      </button>
    </view> -->

    <popup-pay
      ref="pay"
      :type="true"
      @success="back"
      @cancel="cancelPay"
      @payTap="orderPay"
    ></popup-pay>
  </view>
</template>

<script>
import {
  submitAppointment,
  delAppointment,
  getUserDetail,
  verifyBack,
  acidSignIn,
} from '@/common/request/userAppointment'
// import {
//   orderDetail,
// } from '../../common/request/index.js'
import { refund } from '@/common/request/order'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      info: {},
      id: '',
      state: 0, // 单据状态(用于核酸预约签到)
      deptId: 0, // 科室id(用于核酸预约签到)
      orderId: '',
      patientCard: '',
    }
  },
  onLoad(options) {
    this.id = options.id
    this.orderId = options.bizId
    this.state = Number(options.state)
    this.deptId = Number(options.deptId)
    this.getData(options.id, options.bizId)
    this.patientCard = options.patientCard
  },
  computed: {
    isToday() {
      return this.FORMATDATE(new Date(), 'yyyy-MM-dd') == this.info.visitDate
    },
    showCancelButton() {
      return this.info.state == 2 && !this.isToday && !this.info.cancel
    },
    showBottom() {
      return (
        this.info.state == 1 || this.info.state == 5 || this.showCancelButton
      )
    },
  },
  methods: {
    //我的预约里没有取his数据，不需要显示排队信息
    tipsText() {
      let str = ''
      //1 核酸混检
      if (
        (this.info.deptName === '核酸检测门诊' || this.isToday) &&
        this.info.state == 2
      ) {
        str = '如需退号，请到门诊收费室咨询退费'
      }
      //2 当日且预约开始时间半个小时以内
      if (
        this.isToday &&
        dayjs().isAfter(
          dayjs(
            this.info.visitDate + ' ' + this.info.startTime + ':00',
          ).subtract(30, 'minutes'),
        ) &&
        dayjs().isBefore(
          dayjs(this.info.visitDate + ' ' + this.info.endTime + ':00'),
        ) &&
        this.info.state == 2
      ) {
        str = '您的预约时间快到了，请及时前往取号'
      }

      return str
    },
    cancelPay() {
      this.getData(this.id, this.orderId)
    },
    compare(item) {
      return (
        new Date(`${item.visitDate.replace(/-/g, '/')} ${item.endTime}`) <
        new Date()
      )
    },
    async getData(id = '', orderId = '') {
      this.info = await getUserDetail({ id, orderId })
      // this.info = await orderDetail({ id, orderId })
    },
    openPay() {
      this.info.orderId
        ? this.$refs.pay.show(this.info.orderId)
        : this.$refs.pay.show()
    },
    async orderPay() {
      const params = {
        userId: uni.getStorageSync('userId'),
        bizId: this.info.id,
        bizType: 'RESERVE',
        agreement: true,
      }

      let data = this.info
      if (!data.orderId) {
        //没有支付单id 需要先提交生成支付单
        data = await submitAppointment(params)
      }
      if (data.isPay) {
        uni.navigateBack({
          delta: 1,
        })
      } else {
        // this.$refs.pay.payTypeC(data.tradeId, data.tradeType)
        this.$refs.pay.payTypeC(data.orderId, 'ORDER')
      }
    },
    del() {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            await delAppointment({ id: this.info.id })
            uni.navigateBack({
              delta: 1,
            })
          }
        },
      })
    },
    cancel() {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            uni.showLoading({
              title: '正在申请取消订单',
            })
            const ok = await verifyBack({ orderId: this.info.id })
            if (ok) {
              refund({
                orderId: this.info.orderId,
              })
                .then(() => this.getData(this.info.id))
                .finally(() => {
                  uni.hideLoading()
                  this.$tip('申请取消成功')
                })
            } else {
              uni.hideLoading()
              this.$tip('当日及之前的订单无法退费')
            }
          }
        },
      })
    },
    back() {
      this.getData(this.id, this.orderId)
      uni.navigateBack({
        delta: 1,
      })
    },
    // 核酸检测签到
    async acidSignIn() {
      uni.showModal({
        content: '确认签到后将无法退款，请确认是否签到？',
        success: async res => {
          if (res.confirm) {
            await acidSignIn({ id: this.id })
            this.getData(this.id, this.orderId)
            this.state = 3
            this.$tip('签到成功！')
            uni.$emit('SYNC_MY_RESERVE')
          }
        },
      })
    },
  },
}
</script>

<style lang="scss">
.container {
  padding-bottom: 100rpx;
}
.top-tip {
  height: 54rpx;
  line-height: 52rpx;
  padding-left: 20rpx;
  background-color: #fae2e2;
  color: #e45b5b;
}
.top-bg {
  height: 130rpx;
  line-height: 104rpx;
  background-size: contain;
  background-repeat: no-repeat;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
}

.app-card {
  margin: 0 20rpx 20rpx;
}

.avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
}

.cell {
  display: flex;
  justify-content: flex-start;
  margin-top: 20rpx;
  font-size: 26rpx;
}

.label {
  width: 110rpx;
  color: #666;
}

.value {
  margin-left: 12rpx;
  color: #1a1a1a;
}

.tag {
  margin-left: 40rpx;
  padding: 0 12rpx;
  background-color: $uni-color-primary;
  color: #fff;

  &.red {
    background-color: #f74a4a;
  }
}

.color-red {
  color: #e45c5c;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  text-align: right;
}

.button {
  width: 152rpx;
  line-height: 60rpx;
  margin: 0 0 0 12rpx;
  text-align: center;
  background-color: #f2f2f2;
  border-width: 0;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #333;

  &::after {
    border: none;
  }
  &.primary {
    background-color: $uni-color-primary;
    color: #fff;
  }
}
</style>
