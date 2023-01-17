<template>
  <view style="padding: 20rpx;padding-top: 65px;">
    <!--主页按钮-->
    <homeIcom />
    <appCard styles="padding:20rpx;min-height:85px" class="img-box">
      <view class="success-img font15">
        <view class="img">
          <image
            style="width:100%"
            :src="require('@/assets/sucess-icon.png')"
            mode="widthFix"
          ></image>
        </view>
        <view style="font-size:16px;color:#0AB2C1">预约成功</view>
      </view>
    </appCard>
    <appCard styles="padding:20rpx 0 ">
      <AppListItem
        label="就诊人"
        :noBorder="true"
        valStyle="font-size:15px"
        textStyle="font-size:15px"
        >{{
          `${sucessInfo.name} ${
            sucessInfo.phone
              ? sucessInfo.phone.substr(0, 3) +
                '******' +
                sucessInfo.phone.substr(9)
              : ''
          }`
        }}</AppListItem
      >
    </appCard>
    <appCard styles="padding:20rpx;font-size:15px">
      <view class="font15" style="color:#666;margin:5px 0">预约信息</view>
      <view class="font15">医生：{{ sucessInfo.docName || '-' }}</view>
      <view class="font15">科室：{{ sucessInfo.deptName || '-' }}</view>
      <view class="font15"
        >预约时间：{{ sucessInfo.time || sucessInfo.orderTime || '-' }}</view
      >
    </appCard>
    <appCard styles="padding:20rpx">
      <view style="color:#666;margin:5px 0" class="font15">选择项目</view>
      <view class="flex-start-center">
        <checkbox-group style="width: auto;" @change="allCheckboxChange">
          <checkbox
            class="checkbox"
            style="transform: scale(0.8);"
            color="#0ab2c1"
            :value="1"
            :checked="isAll"
          />
        </checkbox-group>

        <view class="payTitle flex_1 font15">{{ sucessInfo.itemName }}</view>
        <view class="price font15" style="color:red"
          >￥{{ sucessInfo.price || sucessInfo.fee || 0 }}</view
        >
      </view>
    </appCard>

    <view class="fiexdBtn flex-between font30">
      <checkbox-group style="width: auto;" @change="allCheckboxChange">
        <label class="font15">
          <checkbox
            style="transform: scale(0.8);"
            class="checkbox"
            color="#0ab2c1"
            value="isAll"
            :checked="isAll"
          />全选
        </label>
      </checkbox-group>
      <view style="color:red" class="font15">
        <text>合计：</text>
        <text class="price"
          >￥{{ sucessInfo.price || sucessInfo.fee || 0 }}</text
        >
      </view>
      <view class="payBtn" @click="payTap">
        提交
      </view>
    </view>

    <!--选择支付方式-->
    <popup-pay
      ref="pay"
      :type="true"
      @success="paySuccess"
      @payTap="orderPay"
      @cancel="payCancel"
    ></popup-pay>
  </view>
</template>

<script>
import appCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item/index'
import { submitAppointment, findPayInfoById } from '../api/index'
export default {
  components: {
    appCard,
    AppListItem,
  },
  data() {
    return {
      orderPayInfo: null,
      isAll: true,
      bizId: null,
      sucessInfo: null,
      type: '',
      overdue: true,
      isClick: true,
    }
  },
  onLoad(options) {
    this.bizId = options.bizId || options.id
    this.sucessInfo = options.sucessInfo ? JSON.parse(options.sucessInfo) : ''
    options.type && options.type === 'nucleatePay' && this.getInfos()
    if (options.hasOwnProperty('overdue')) this.overdue = options.overdue
  },
  methods: {
    //获取详情
    async getInfos() {
      const res = await findPayInfoById({ id: this.bizId })
      console.log(res, '详情')
      this.sucessInfo = res
    },
    allCheckboxChange(e) {
      console.log(e)
      this.isAll = !this.isAll
    },
    payTap() {
      if (!this.isAll) {
        return uni.showToast({
          title: '请勾选项目',
          icon: 'none',
        })
      }
      console.log(this.overdue, '可支付状态')
      //是否超时不能支付
      if (!this.sucessInfo.overdue || this.sucessInfo.overdue === 'false') {
        uni.showToast({
          title: '当前订单已失效或已支付！',
          icon: 'none',
        })
        return
      }
      this.$refs.pay.show()
    },

    /***
     *订单支付
     */
    async orderPay() {
      // if (!this.isClick) {
      //   return uni.showToast({ title: '请勿重复点击', icon: 'none' })
      // }
      // this.isClick = false
      //已提交订单 不再重复提交
      if (this.orderPayInfo) {
        return this.$refs.pay.payTypeC(
          this.orderPayInfo.tradeId,
          this.orderPayInfo.tradeType,
          this.orderPayInfo.payFee,
          '',
          true,
        )
      }
      uni.showLoading()
      submitAppointment({
        userId: uni.getStorageSync('userId'),
        bizId: this.bizId,
        bizType: 'NUCLEATE',
        agreement: true,
      }).then(order => {
        this.orderPayInfo = order
        uni.hideLoading()
        // this.isClick = true
        console.log(order, 'order参数---------')
        if (!order) return
        this.$refs.pay.payTypeC(
          order.tradeId,
          order.tradeType,
          order.payFee,
          '',
          true,
        )
      })
    },

    paySuccess(value) {
      uni.showToast({
        title: '支付成功',
        icon: 'none',
      })
      setTimeout(() => {
        //跳详情
        uni.navigateTo({
          url: `/pages-user/nucleicAcidAppointment/record/detail?id=${this.bizId}`,
        })

        // uni.navigateTo({
        //   url: '/pages-user/nucleicAcidAppointment/record/index',
        // })
      }, 2000)
    },

    payCancel(value) {
      uni.navigateTo({
        url: '/pages-zy/outpatientPayment/list',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.img-box {
  position: relative;
  .success-img {
    width: 244rpx;
    position: absolute;
    top: -94rpx;
    left: 244rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    .img {
      width: 244rpx;
      height: 212rpx;
    }
  }
}
.fiexdBtn {
  height: 98rpx;
  width: 100%;
  background: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;

  .payBtn {
    height: 60rpx;
    width: 160rpx;
    background: $uni-color-primary;
    line-height: 60rpx;
    text-align: center;
    border-radius: 30rpx;
    color: #fff;
    font-size: 32rpx;

    &.disabled {
      opacity: 0.5;
    }
  }
}
.borderBt {
  border-bottom: 1px solid #e6e6e6;
  padding: 20rpx;
}
.font15 {
  font-size: 15px;
}
</style>
