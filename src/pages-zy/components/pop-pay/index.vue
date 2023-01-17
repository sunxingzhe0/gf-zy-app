<template>
  <view>
    <uni-popup ref="paypopup" type="bottom" :maskClick="false">
      <view class="payType">
        <view class="close" @click="close">
          <uni-icons
            type="closeempty"
            class="closeIcon"
            color="#999"
          ></uni-icons>
        </view>
        <view class="typeTitle">{{ title }}</view>
        <view class="line"></view>
        <slot></slot>
        <radio-group @change="payRadioChange">
          <label
            class="pay-item"
            v-for="(item, index) in payTypes"
            :key="index"
          >
            <view class="item-text">
              <image :src="item.url"></image>
              <text class="text">{{ item.name }}</text>
            </view>

            <radio
              :value="index"
              :checked="index === payType"
              color="#0AB2C1"
            />
          </label>
        </radio-group>
        <!-- 确定按钮 -->
        <view class="confirm" @click="payTap()">付款</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { payCancel, payNotify } from '../../api/outpatient.js'
export default {
  props: {
    type: {
      type: Number,
      default: 1, //1.要手动调支付成功失败，2不用调
    },
    title: {
      type: String,
      default: '订单支付',
    },
  },
  data() {
    return {
      orderId: '', //订单id
      payType: 0,
      payTypes: [
        {
          url: require('@/assets/wx_pay.png'),
          name: '微信支付',
          type: 'WX',
        },
        // {
        //   url: require("../../../static/user/zfb_pay.png"),
        //   name: "支付宝支付",
        //   type: "ALI_PAY"
        // },
        // {
        //   url: require("../../../static/user/yb_pay.png"),
        //   name: "医保支付",
        //   type: ""
        // },
        // {
        //   url: require("../../../static/user/yl_pay.png"),
        //   name: "银联支付",
        //   type: "UNION"
        // }
      ],
      countDownTime: '', //用于手机端取消支付返回
      currentTime: '',
    }
  },
  created() {
    //手机端微信登录回调方法
    // #ifdef H5
    window.wxPay = state => this.wxPay(state)
    // #endif
  },

  methods: {
    wxPay(state) {
      if (state == 'ERR_OK') {
        //微信支付成功
        //调用接口通知后端支付成功
        if (this.type == 2) {
          this.$emit('success', this.orderId)
        } else {
          this.getpayNotify(this.orderId)
        }
      } else if (state == 'ERR_USER_CANCEL') {
        //取消支付
        //取消提示过期时间 可继续支付
        if (this.type == 2) {
          this.$emit('cancel', this.orderId)
        } else {
          this.getpayCancel(this.orderId)
        }
      }
      return state
    },
    // 点击确认按钮
    payTap() {
      uni.showLoading({
        title: '正在调取支付',
      })
      this.$emit('payTap', this.payTypes[this.payType].type)
    },
    //支付
    payTypeC(data) {
      this.orderId = data.orderNo
      if (data.appId) {
        console.log('》》》预支付参数' + JSON.stringify(data))

        //#ifdef H5 ||APP-PLUS
        if (uni.getSystemInfoSync().platform == 'android') {
          window.app.wxPay(JSON.stringify(data))
        } else {
          window.webkit.messageHandlers.wxPay.postMessage(JSON.stringify(data))
        }
        //#endif

        //#ifdef MP-WEIXIN
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign || data.sign,
          success: res => {
            //调用接口通知后端支付成功
            if (this.type == 2) {
              this.$emit('success', data.orderNo)
            } else {
              this.getpayNotify(data.orderNo)
            }
          },
          fail: err => {
            if (this.type == 2) {
              this.$emit('cancel', data.orderNo)
            } else {
              this.getpayCancel(data.orderNo)
            }
          },
          finally: () => uni.hideLoading(),
        })
        //#endif
      } else {
        if (data.orderNo) {
          if (this.type == 2) {
            this.$emit('success', data.orderNo)
          } else {
            this.getpayNotify(data.orderNo)
          }
        } else {
          uni.showToast({
            title: '预约失败',
            icon: 'none',
          })
        }
      }
      this.$refs.paypopup.close()
    },
    payRadioChange(evt) {
      this.payType = parseInt(evt.target.value)
    },
    //支付失败
    async getpayCancel(orderNo) {
      await payCancel({
        orderNo,
      })
      uni.showToast({
        title: '支付失败',
        icon: 'none',
        success: () => {
          this.$emit('cancel', orderNo)
          this.closePop()
        },
      })
    },
    //支付成功
    async getpayNotify(orderNo) {
      uni.showLoading({
        title: '请稍等',
      })
      const res = await payNotify({
        orderNo,
      })
      uni.hideLoading()
      if (res) {
        uni.showToast({
          title: '支付成功',
          success: () => {
            this.$emit('success', orderNo)
            this.closePop()
          },
        })
      }
    },
    getPaySuccess(orderId) {
      uni.showLoading({
        title: '请稍等',
      })
      paySuccess({
        orderId: orderId,
      })
        .then(data => {
          this.$emit('success', orderId)
        })
        .finally(() => uni.hideLoading())
    },

    show(orderId) {
      if (orderId) {
        this.orderId = orderId
      }

      this.$refs.paypopup.open()
    },

    closePop() {
      this.$refs.paypopup.close()
    },
    /**
     * 取消支付
     * */
    close() {
      this.$refs.paypopup.close()
      // this.$emit('cancel', this.orderId);
    },
  },
}
</script>

<style lang="scss" scoped>
.payType {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  padding-bottom: 20rpx;
  border-radius: 20px 20px 0px 0px;

  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;

    .closeIcon {
      font-size: 30rpx !important;
    }
  }

  .typeTitle {
    text-align: center;
    padding: 41rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
  }

  .line {
    height: 1rpx;
    background: rgba(230, 230, 230, 1);
  }

  .pay-item {
    display: flex;
    flex-direction: row;
    margin: 60rpx 60rpx 0rpx 60rpx;
    justify-content: space-between;
    align-items: center;

    .item-text {
      align-items: center;
      display: flex;

      image {
        width: 64rpx;
        height: 64rpx;
      }

      .text {
        margin-left: 29rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
      }
    }
  }

  .confirm {
    margin: 80rpx 20rpx 0rpx 20rpx;
    width: 710rpx;
    height: 88rpx;
    background: rgba(10, 178, 193, 1);
    border-radius: 44rpx;

    font-size: 30rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 88rpx;
    text-align: center;
  }
}
</style>
