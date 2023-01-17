<template>
  <view>
    <!-- <view class="tip" v-if="details.status == 1">
      {{
        compare
          ? "温馨提示：请假请至少提前24小时申请。"
          : "温馨提示：您的预约时间快到了，请及时前往取号。"
      }}</view
    >
    <view class="tip" v-if="details.status == 0 && intervalTime != '00:00'"
      >温馨提示：预约单将于<text class="time-interval">{{ intervalTime }}</text
      >后关闭，请及时付款。</view
    > -->
    <view class="card" style="margin-top: -25rpx">
      <view class="flex-between" style="position: relative">
        <image
          v-if="details.status == 2"
          src="@/static/leave_end.png"
          style="
            width: 100rpx;
            height: 100rpx;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          "
        ></image>

        <view>
          <view class="item">
            <view class="title">就诊人</view>
            <text class="context">{{ details.patientName }}</text>
          </view>
          <view class="item">
            <view class="title">医院</view>
            <text class="context">{{ details.hospital || '-' }}</text>
          </view>
        </view>
        <image
          v-if="details.avatar"
          style="
            width: 76rpx;
            height: 76rpx;
            border-radius: 50%;
            background: cornflowerblue;
          "
          :src="FILE_URL(details.avatar)"
        ></image>
      </view>

      <view class="item">
        <view class="title">科室</view>
        <text class="context">{{ details.dept }}</text>
      </view>
      <view class="item">
        <view class="title">医生</view>
        <text class="context">{{ details.doctor }} {{ details.title }}</text>
      </view>
      <view class="flex-between">
        <view class="item">
          <view class="title">预约时段</view>
          <text class="context" style="color: #f74a4a"
            >{{ details.reservationDate }} {{ details.reservationDtime }}</text
          >
        </view>
        <!-- <view class="state">当日</view> -->
      </view>
    </view>
    <view class="card">
      <view class="item">
        <view class="title">单据号</view>
        <text class="context">{{ details.id }}</text>
      </view>
      <view class="item">
        <view class="title">门诊号</view>
        <text class="context">{{ details.outNo || '-' }}</text>
      </view>
      <view class="item">
        <view class="title">就诊人</view>
        <text class="context">{{ details.patientName }}</text>
      </view>
      <!-- <view class="item">
        <view class="title">项目</view>
        <text class="context">{{ details.entryName }}</text>
      </view> -->
      <view class="item">
        <view class="title">项目名称</view>
        <text class="context">{{ details.entryName }}</text>
      </view>
      <view class="item">
        <view class="title">诊疗费</view>
        <text class="context" style="color: #f74a4a">￥{{ details.cost }}</text>
      </view>
      <view class="item">
        <view class="title">创建时间</view>
        <text class="context">{{ details.createTime || '-' }}</text>
      </view>
    </view>

    <view class="card">
      <view class="item">
        <view class="title">支付号</view>
        <text class="context">{{ details.payNo || '-' }}</text>
      </view>
      <view class="item">
        <view class="title">支付方式</view>
        <text class="context">{{
          details.payWay == 'WX_JSAPI' ? '微信支付' : '-'
        }}</text>
      </view>
      <view class="item">
        <view class="title">支付时间</view>
        <text class="context">{{ details.payTime || '-' }}</text>
      </view>
    </view>

    <view class="card" v-if="details.status == 2 || details.status == 1">
      <view class="item">
        <view class="title">请假理由</view>
        <text class="context">{{ details.remark || '-' }}</text>
      </view>
      <view class="item">
        <view class="title">请假时间</view>
        <text class="context">{{ details.leaveTime || '-' }}</text>
      </view>
      <view class="item">
        <view class="title">审批时间</view>
        <text class="context">{{ details.opTime || '-' }}</text>
      </view>
    </view>
    <view class="card">
      <view class="item">
        <view class="title">交易号</view>
        <text class="context">{{ details.tradeNo || '-' }}</text>
      </view>
      <view class="item">
        <view class="title">退款方式</view>
        <text class="context">{{
          refundWayTypes[details.refundWay] || '-'
        }}</text>
      </view>
      <view class="item">
        <view class="title">退款时间</view>
        <text class="context">{{ details.refundTime || '-' }}</text>
      </view>
    </view>

    <!-- <view class="btn" @click="intoPay" v-if="details.status == 0"
      >立即付款</view
    >
    <view class="btn" @click="leaveC" v-if="details.status == 1 && compare"
      >请假</view
    > -->
    <!-- <view class="btn" @click="revoke" v-if="details.status == 3">撤回请假</view> -->
    <uni-popup ref="popup" type="center">
      <view class="context-p">
        <view class="flex-between clear-title">
          <text></text>
          <text>就诊请假</text>
          <image class="clear-p"></image>
        </view>
        <view class="reason-title xrequired">请假理由</view>
        <textarea
          style="width: 90%"
          placeholder="请输入"
          class="reason"
          v-model="excuses"
        ></textarea>

        <view class="operation">
          <view class="cancel" @click="closeP">取消</view>
          <view class="confirm" @click="leavelC">确认</view>
        </view>
      </view>
    </uni-popup>
    <!-- <HcOrderPopPay
      ref="hcOrderPop"
      :orderId="orderId"
      :tradeId="tradeId"
      :tradeType="tradeType"
      :payFee="payFee"
    /> -->
  </view>
</template>
<script>
// import HcOrderPopPay from "@/components/hcOrderPopPay";
// import {
//   appointmentDesc,
//   revokeLeave,
//   delRegister,
//   submitAppointment,
// } from '@/api/appointment'
import { appointmentDesc } from '@/pages-zxs/api/myPatient'

export default {
  // components: { HcOrderPopPay },
  data() {
    return {
      refundWayTypes: {
        ORIGINAL: '原路退回',
        OFFLINE: '线下退款',
        ACCOUNT: '账户退款',
      },
      id: '',
      details: {},
      excuses: '',
      intervalTime: '59:59',
      timer: null,
      orderId: '', //订单id
      tradeId: '',
      tradeType: '',
      payFee: '',
      againIntoPage: false,
      tabs: '',
    }
  },
  onLoad(options) {
    this.id = options.id

    this.getDesc()
    this.tabs = options.tabs
  },
  created() {},
  onShow() {
    // this.getDesc()
  },
  onUnload() {
    // clearInterval(this.timer)
  },
  computed: {
    //是否距离预约时段开始时间大于24小时
    compare() {
      const timeDifference =
        new Date(
          `${
            this.details?.reservationDate
          } ${this.details?.reservationDtime?.substr(0, 5)}`.replace(/-/g, '/'),
        ) - new Date()
      return timeDifference > 24 * 60 * 60 * 1000
    },
  },
  methods: {
    //开启付款倒计时
    openInterVal() {
      this.timer = setInterval(() => {
        const createTime = this.details.createTime.replace(/-/g, '/')
        //60分钟减去当前时间和创建时间差
        const difference = 60 * 60 * 1000 - (new Date() - new Date(createTime))
        const m = Math.floor((difference / 1000 / 60) % 60)
          .toString()
          .padStart(2, '0')
        const s = Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, '0')
        this.intervalTime = `${m}:${s}`
        if (this.intervalTime == '00:00' || difference < 0) {
          this.intervalTime = '00:00'
          clearInterval(this.timer)
        }
        console.log(this.intervalTime, difference)
      }, 1000)
    },

    //详情
    async getDesc() {
      this.details = await appointmentDesc({ id: this.id })
      // if (this.details.status == 0 && !this.againIntoPage) {
      //   //状态为待支付且 为第一次进入页面
      //   this.openInterVal();
      //   this.againIntoPage = true;
      // }
    },
    leaveC() {
      this.$refs.popup.open()
    },
    //
    //撤销请假
    async revoke() {
      await revokeLeave({ id: this.id, status: 1 })
      uni.showToast({
        title: '撤销成功！',
        icon: 'none',
      })
      this.getDesc()
    },
    //请假
    async leavelC() {
      if (!this.excuses)
        return uni.showToast({
          title: '请输入请假理由',
          icon: 'none',
        })
      await revokeLeave({
        id: this.id,
        status: 3,
        leaveDesc: this.excuses,
      })
      uni.showToast({
        title: '操作成功！',
        icon: 'none',
      })
      this.$refs.popup.close()
      this.getDesc()
    },
    closeP() {
      this.$refs.popup.close()
    },
    //立即付款
    intoPay() {
      this.submitOrder()
    },
    //提交订单
    async submitOrder() {
      const orderQury = {
        userId: uni.getStorageSync('userId'),
        bizId: this.details.id,
        bizType: 'RESERVE_PSYCHE_CONSULT', //RESERVE_PSYCHE_CONSULT 挂号 ACTIVITY_PSYCHE_CONSULT 活动
        agreement: true,
      }
      try {
        const data = await submitAppointment(orderQury)
        this.tradeId = data.tradeId
        this.tradeType = data.tradeType
        this.payFee = data.payFee
        this.orderId = data.orderId
        uni.hideLoading()
        this.$refs.hcOrderPop.open()
      } catch (error) {
        uni.hideLoading()
        // await delRegister({ reserveId: this.details.id }); //取消预约挂号
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.xrequired:before {
  content: '*';
  color: red;
}
.tip {
  padding-left: 30rpx;
  padding-top: 19rpx;
  height: 80rpx;
  background: rgba(241, 145, 73, 0.1);
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #f19149;
  text-align: center;
}
.card {
  padding: 0rpx 30rpx 30rpx 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  margin-top: 20rpx;
  .item {
    display: flex;
    padding-top: 30rpx;
    .title {
      min-width: 200rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
    .context {
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .state {
    background: rgba(10, 178, 193, 0.1);
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #0ab2c1;
    padding: 5rpx 12rpx;
  }
}
.btn {
  text-align: center;
  margin-top: 30rpx;
  height: 88rpx;
  background: #ffffff;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #0ab2c1;
  line-height: 88rpx;
}
.context-p {
  width: 660rpx;
  height: 650rpx;
  background: #ffffff;
  border-radius: 20rpx;
}
.clear-p {
  width: 30rpx;
  height: 30rpx;
  background: #e6e6e6;
  border-radius: 50%;
}
.clear-title {
  padding: 30rpx;
  border-bottom: 1rpx solid #e6e6e6;
}
.reason-title {
  padding: 30rpx 20rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
.reason {
  margin: 0rpx 30rpx;
  height: 300rpx;
  background: #f7f7f7;
  border: 1rpx solid #cccccc;
  border-radius: 2rpx;
}
.operation {
  width: 660rpx;
  border-top: 1rpx solid #e6e6e6;
  height: 88rpx;
  bottom: 0rpx;
  position: absolute;
  display: flex;
}
.cancel {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  flex: 1;
  border-right: 1rpx solid #e6e6e6;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
}
.confirm {
  line-height: 88rpx;
  height: 88rpx;
  text-align: center;
  flex: 1;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #0ab2c1;
}
.time-interval {
  color: red;
  font-size: 36rpx;
  margin: 0 10rpx;
}
</style>
