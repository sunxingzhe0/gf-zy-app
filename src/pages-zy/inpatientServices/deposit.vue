<template>
  <view style="padding: 20rpx; padding-top: 190rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="[]">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="健康卡"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0 }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                :inperId="perId"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
        </view>

        <app-list-item
          label="入院日期"
          noBorder
          :styles="{ padding: '16rpx 30rpx' }"
        >
          <view
            :class="[
              'flex_1 text-right',
              infoData.admitDtime ? 'color666' : 'color999',
            ]"
            >{{ infoData.admitDtime || '暂无住院' }}</view
          >
        </app-list-item>
      </template>
    </topbar>
    <app-card class="moneyBox" styles="padding:30rpx;">
      <view class="title flex-between">
        <view>请选择充值金额</view>
        <view>
          余额：<text class="pricolor">￥{{ infoData.balance || '0.00' }}</text>
        </view>
      </view>
      <view class="nums">
        <view
          v-for="(item, index) in money"
          :key="index"
          :class="isActive == index ? 'numActive' : ''"
          @click="selMoney(item, index)"
        >
          ￥ {{ item }}
        </view>
      </view>
      <view class="input">
        <input
          v-model="inputMoney"
          type="number"
          @input="inputInp"
          @blur="inputBlur"
          placeholder="请输入充值金额"
        />
      </view>
      <!-- 立即充值 -->
      <view class="recharge">
        <view
          :class="['confirmButton', isPay ? 'disabled' : '']"
          @click="showPopup"
          >充值</view
        >
        <view class="pricolor font24 mt-20" @click="goto">充值记录</view>
      </view>
    </app-card>
    <!-- 支付列表 -->
    <pop-pay
      ref="pay"
      :type="1"
      @cancel="payErr"
      @success="paysuccess"
      @payTap="pay"
    >
      <view class="payInfo">
        <view class="inhosDate flex-start-center">
          <view class="title">就诊人</view>
          <view class="date">{{ perName }}</view>
        </view>
        <view class="inhosDate flex-start-center">
          <view class="title">充值金额</view>
          <view class="date price"
            >￥{{ parseFloat(putMoney).toFixed(2) }}</view
          >
        </view>
      </view>
    </pop-pay>
  </view>
</template>

<script>
import selectPatient from '../components/selectPatient.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import popPay from '../components/pop-pay/index.vue'
import { rechargeIh, moneyBay } from '../api/inHospital.js'
export default {
  components: {
    selectPatient,
    AppCard,
    AppListItem,
    popPay,
  },
  data() {
    return {
      isClick: true,
      perId: '',
      payType: 'WX',
      perName: '',
      date: '',
      // 选择金额
      money: [500, 1000, 2000],
      // 选中金额的激活索引
      isActive: null,
      //当前选中金额的值
      inputMoney: null,
      infoData: {},
      isPay: true,
      putMoney: null,
    }
  },
  onLoad(options) {
    this.perId = options.bizId
    console.log(options.bizId, '就诊人id---------')
  },

  methods: {
    changePatient(item) {
      this.perId = item.memberId
      this.perName = item.name
      this.getmoneyBay()
    },
    // 获取住院余额
    async getmoneyBay() {
      await moneyBay({
        patientId: this.perId,
      })
        .then(res => {
          console.log(res, 'jieguo---------')
          if (res) {
            this.infoData = res
            this.isPay = false
          } else {
            this.isPay = true
          }
        })
        .catch(err => {
          uni.hideToast()
          uni.showModal({
            title: '系统提示',
            content: err.message.split(':')[1],
            confirmColor: '#0AB2C1',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
          uni.hideToast()
        })
    },
    // 选择金额
    selMoney(item, i) {
      this.putMoney = item
      this.isActive = i
      this.inputMoney = item
    },
    inputInp() {
      this.putMoney = this.inputMoney
    },
    inputBlur(e) {
      console.log(this.inputMoney)
      if (this.inputMoney && this.inputMoney <= 0) {
        uni.showToast({
          title: '输入金额不能小于0',
          icon: 'none',
        })
        this.inputMoney = null
      } else {
        this.isActive = null
        this.putMoney = this.inputMoney
      }
    },
    showPopup() {
      if (this.isPay) {
        return
      }
      if (this.perId == '') {
        uni.showToast({
          title: '请选择就诊人',
          icon: 'none',
        })
        return false
      }
      if (this.putMoney == null || this.putMoney == '' || this.putMoney == 0) {
        uni.showToast({
          title: '请输入或选择充值金额',
          icon: 'none',
        })
        return false
      }
      if (isNaN(Number(this.inputMoney))) {
        uni.showToast({
          title: '请输入数字',
          icon: 'none',
        })
        return false
      }
      // const reg = /^[1-9]+[0-9]*00$/
      // if (
      //   (this.inputMoney && !reg.test(this.putMoney)) ||
      //   (this.inputMoney && this.inputMoney < 2000)
      // ) {
      //   uni.showToast({
      //     title: '请输入大于两千元的整百金额',
      //     icon: 'none',
      //   })
      //   return false
      // }
      this.$refs.pay.show()
    },
    pay(e) {
      const that = this
      if (!this.isClick) {
        uni.showToast({ title: '请勿重复点击', icon: 'none' })
        this.isClick = true
        return
      }
      this.isClick = false
      rechargeIh({
        patientId: this.perId,
        fee: parseFloat(this.inputMoney) * 100,
        payment: e,
      }).then(data => {
        console.log(data, 'data')
        this.isClick = true
        this.$refs.pay.payTypeC(data)
      })
    },
    //支付成功
    paysuccess() {
      this.isActive = null
      this.inputMoney = ''
      this.putMoney = 0
      this.getmoneyBay()
      uni.showToast({
        title: '支付成功',
      })
    },
    // 支付失败
    payErr() {
      let that = this
      uni.showToast({
        title: '支付失败',
        icon: 'none',
      })
      setTimeout(() => {
        that.getmoneyBay()
      }, 3000)
    },
    changePayMode(index) {
      this.isActive = index
    },
    goto() {
      uni.navigateTo({
        url: `/pages-zy/inpatientServices/paymentRecord?perId=${this.perId}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/common/order.scss';

.payInfo {
  padding: 40rpx 30rpx;
  line-height: 58rpx;
  border-bottom: 1px solid #e6e6e6;
}

.inhosDate {
  width: 100%;
  background: #fff;
  padding: 0 25rpx;
  font-size: 28rpx;

  .title {
    width: 140rpx;
    color: #666;
    text-align: left;
  }
}

.moneyBox {
  .title {
    line-height: 75rpx;
    color: #666;
    font-size: 28rpx;
    font-weight: 400;
  }

  input {
    margin-top: 20rpx;
    border: 1px solid #999;
    border-radius: 40rpx;
    text-align: center;
    height: 76rpx;
    line-height: 74rpx;

    label {
      font-size: 48rpx;
      color: #646464;
      margin-right: 20rpx;
    }
  }

  .nums {
    height: 88rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    view {
      width: 180rpx;
      height: 60rpx;
      text-align: center;
      line-height: 58rpx;
      border: 1px solid #999;
      border-radius: 30rpx;
    }

    .numActive {
      background: $uni-color-primary;
      color: #fff;
      border-color: $uni-color-primary;
    }
  }
}

.recharge {
  margin-top: 30rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  .confirmButton {
    width: 100%;
    height: 76rpx;
    background: $uni-color-primary;
    color: #fff;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 400;
    text-align: center;
    line-height: 76rpx;

    &.disabled {
      opacity: 0.5;
    }
  }

  .rechargeRecord {
    color: #646464;
    font-size: 28rpx;
    font-weight: 400;
  }
}
</style>
