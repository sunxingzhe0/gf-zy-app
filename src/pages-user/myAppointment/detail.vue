<template>
  <view :class="{ container: [2, 5].includes(info.state) }">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />

    <view class="top-tip" v-if="info.state == 2">
      温馨提示：当天的预约挂号无法取消。
    </view>
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
          {{ info.visitDate }} {{ info.startTime }}~{{ info.endTime }}
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
        <view class="value">{{ info.documentNo }}</view>
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
          {{ info.createTime }}
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
    <view class="bottom-bar flex-justify-end" v-if="showBottom">
      <button class="button" v-if="info.state == 5" @click="del">删除</button>
      <button
        class="button primary"
        v-else-if="info.state == 1"
        @click="openPay"
      >
        付款
      </button>
      <button class="button" v-if="showCancelButton" @click="cancel">
        取消
      </button>
    </view>

    <popup-pay
      ref="pay"
      :type="true"
      @success="back"
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
} from '@/common/request/userAppointment'
import { refund } from '@/common/request/order'
export default {
  data() {
    return {
      info: {},
    }
  },
  onLoad(options) {
    this.getData(options.id, options.orderId)
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
    async getData(id = '', orderId = '') {
      this.info = await getUserDetail({ id, orderId })
    },
    openPay() {
      this.$refs.pay.show(this.info.orderId)
    },
    async orderPay() {
      const params = {
        userId: uni.getStorageSync('userId'),
        bizId: this.info.id,
        bizType: 'RESERVE',
        agreement: true,
      }
      const data = await submitAppointment(params)
      if (data.isPay) {
        uni.navigateBack({
          delta: 1,
        })
      } else {
        this.$refs.pay.payTypeC(data.tradeId, data.tradeType)
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
              refund({ orderId: this.info.orderId })
                .then(() => this.getData(this.info.id))
                .finally(() => {
                  uni.hideLoading()
                  this.$tip('申请取消成功')
                })
            } else {
              uni.hideLoading()
              this.$tip('当前订单不能退费')
            }
          }
        },
      })
    },
    back() {
      uni.navigateBack({
        delta: 1,
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
