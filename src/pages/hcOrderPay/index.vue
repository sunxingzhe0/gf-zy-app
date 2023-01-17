<template>
  <view>
    <view class="title">
      <view
        v-if="host === 'https://miapp.chuntaoyisheng.com/'"
        class="state-test"
        >debug</view
      >
      <view class="title-msg">
        <image
          style="width:100rpx;height:100rpx"
          :src="FILE_URL_BUILT_IN('logo_mini.png')"
        ></image>
        <view class="hosp-title">
          <view class="name">重庆市精神卫生中心</view>
          <view class="grade">三级</view>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="img-box">
        <image
          style="width:200rpx;height:200rpx"
          :src="
            FILE_URL_BUILT_IN(payStatus ? 'finish_mini.png' : 'load_mini.png')
          "
        ></image
      ></view>
      <view class="price">¥{{ payFee }}</view>
      <view class="status">{{ payStatus ? '支付成功' : '等待付款...' }}</view>
      <view class="btn" @click="handleSubmit">{{
        payStatus ? '返回' : '立即付款'
      }}</view>
    </view>
    <popup-pay
      ref="pay"
      :type="true"
      @success="paysuccess"
      @payTap="orderPay"
      @cancel="payCancel"
    ></popup-pay>
  </view>
</template>

<script>
import { host } from '@/urls'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      host,
      payStatus: 0,
      tradeId: '',
      tradeType: '',
      payFee: '-',
      orderId: '',
      expireTime: '',
    }
  },
  onLoad(options) {
    this.tradeId = options.tradeId
    this.tradeType = options.tradeType
    this.payFee = options.payFee
    this.orderId = options.orderId
    this.expireTime = options.expireTime
  },
  methods: {
    handleSubmit() {
      if (this.payStatus) {
        console.log('返回h5')
        wx.exitMiniProgram({
          success() {
            console.log('退出成功')
          },
        })
        return
      }
      //过期时间判断
      if (this.expireTime) {
        const passTime = this.expireTime
        if (dayjs(passTime) < dayjs()) {
          return uni.showToast({
            title: '当前订单已过期，请重新预约',
            icon: 'none',
          })
        }
      }
      //支付
      console.log('拉起支付')
      this.$refs.pay.show()
    },
    paysuccess() {
      this.payStatus = 1
    },
    //拉起支付
    orderPay() {
      if (this.tradeId) {
        this.$refs.pay.payTypeC(this.tradeId, this.tradeType, this.payFee)
      }
    },
    payCancel() {},
  },
}
</script>

<style lang="scss" scoped>
.title {
  height: 350rpx;
  background: #0ab2c1;
  display: felx;
  justify-content: center;
  align-content: center;
  color: #fff;
  padding-top: 80rpx;
  box-sizing: border-box;
  .title-msg {
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      background: #ccc;
      border-radius: 50%;
    }
    .hosp-title {
      margin-left: 20rpx;
      .name {
        font-size: 34rpx;
      }
      .grade {
        font-size: 24rpx;
      }
    }
  }
}
.content {
  height: 380rpx;
  background: #fff;
  padding: 0rpx 30rpx 0 30rpx;
  box-sizing: border-box;
  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  image {
    background: #ccc;
    position: relative;
    top: -100rpx;
    border-radius: 50%;
  }
  .price {
    font-size: 50rpx;
    color: #0ab2c1;
    text-align: center;
    margin-top: -40px;
  }
  .status {
    font-size: 30rpx;
    text-align: center;
  }
  .btn {
    width: 100%;
    height: 88rpx;
    background: #0ab2c1;
    border-radius: 44rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 30rpx;
    position: relative;
    bottom: -50rpx;
  }
}
.state-test {
  position: fixed;
  top: 6rpx;
  right: -34rpx;
  background: red;
  padding: 0 30rpx;
  color: #fff;
  z-index: 999;
  transform: rotate(45deg);
}
</style>
