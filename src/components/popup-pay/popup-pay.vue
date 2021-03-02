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
        <view class="typeTitle">订单支付</view>
        <view class="line"></view>
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
        <view class="confirm" @click="type ? payTap() : payTypeC()">付款</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { prepay, paySuccess } from '../../common/request/index.js'
export default {
  props: {
    type: {
      type: Boolean,
      default: false,
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
          type: 'WECHAT_PAY',
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
        //   type: ""
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
        this.getPaySuccess(this.orderId)
      } else if (state == 'ERR_USER_CANCEL') {
        //取消支付
        //取消提示过期时间 可继续支付
        this.paymentTips(this.countDownTime, this.currentTime)
      }
      return state
    },
    // 点击确认按钮
    payTap() {
      this.$emit('payTap', this.payTypes[this.payType].type)
    },
    //支付
    payTypeC(orderId, tradeType) {
      //订单预支付
      if (orderId) {
        this.orderId = orderId
      }
      //#ifdef H5 ||APP-PLUS
      //接口需要重新修改

      //#endif
      uni.showLoading({
        title: '正在调取支付',
      })
      prepay({
        orderId: this.orderId,
        payType: this.payTypes[this.payType].type,
        tradeType: tradeType || 'ORDER',
        //#ifdef H5 ||APP-PLUS
        clientType: 'NATIVE',
        //#endif
      })
        .then(data => {
          if (data) {
            console.log('》》》预支付参数' + JSON.stringify(data))

            //#ifdef H5 ||APP-PLUS
            this.countDownTime = data.countDownTime
            this.currentTime = data.currentTime

            if (uni.getSystemInfoSync().platform == 'android') {
              window.app.wxPay(JSON.stringify(data))
            } else {
              window.webkit.messageHandlers.wxPay.postMessage(
                JSON.stringify(data),
              )
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
                this.getPaySuccess(this.orderId)
              },
              fail: err => {
                //取消提示过期时间 可继续支付
                if (JSON.stringify(err).search('cancel') != -1) {
                  this.paymentTips(data.countDownTime, data.currentTime)
                }
              },
            })
            //#endif
          }
        })
        .finally(() => uni.hideLoading())

      this.$refs.paypopup.close()
    },
    payRadioChange(evt) {
      this.payType = parseInt(evt.target.value)
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
    /*
     *继续支付
     */
    paymentTips(countDownTime, currentTime) {
      if (!countDownTime || !currentTime) {
        this.$emit('cancel', this.orderId)
        return
      }

      uni.showModal({
        title: '系统消息',
        content:
          '您的订单在' +
          this.countdown(countDownTime, currentTime) +
          '内未支付将被取消，请尽快完成支付',
        cancelText: '确认离开',
        confirmText: '继续支付',
        confirmColor: '#0AB2C1',
        cancelColor: '#666666',
        success: res => {
          if (res.confirm) {
            this.payTypeC(this.orderId)
          } else if (res.cancel) {
            //取消
            this.$emit('cancel', this.orderId)
          }
        },
      })
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
    /***
     *付款时间倒计时
     */
    countdown(countDownTime, currentTime) {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date(countDownTime.replace('-', '/').replace('-', '/')) //到期时间
      var currentTime = new Date(
        currentTime.replace('-', '/').replace('-', '/'),
      ) //当前系统时间

      //测试时间
      // var dateEnd =new Date('2020-9-2 18:05:00')
      // var currentTime=new Date('2020-9-2 18:00:01')
      var dateDiff = dateEnd.getTime() - currentTime.getTime() //时间差的毫秒数
      if (!countDownTime || dateDiff < 0) {
        return ''
      }
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) //计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数

      var hours = dayDiff * 24 + hours
      return hours + '小时' + minutes + '分钟'
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
