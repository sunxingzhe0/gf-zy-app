<template>
  <view class="sign-detail">
    <view class="patient">
      <text class="name">{{ data.name }}</text>
      <text>{{ data.phone }}</text>
    </view>
    <view class="content">
      <view class="label">状态：</view>
      <view class="value">{{ reportState[data.status] }}</view>
    </view>
    <view class="content" v-if="actType !== '团体治疗'">
      <view class="label">报名费：</view>
      <view class="value">¥ {{ data.cost || '-' }}</view>
    </view>
    <view class="content">
      <view class="label">是否退款：</view>
      <view class="value">{{ showRefundRel(data) }}</view>
    </view>
    <view class="content">
      <view class="label">退款金额：</view>
      <view class="value">¥ {{ data.refundeFee || '-' }}</view>
    </view>
    <view class="top-border" v-if="data.relList.length > 0">
      <view class="content" v-for="v in data.relList" :key="v.id">
        <view class="label">{{ v.fieldName }}：</view>
        <view class="value">{{ v.fieldValue || '-' }}</view>
      </view>
    </view>
    <view class="top-border">
      <view class="content">
        <view class="label">支付金额：</view>
        <view class="value">¥ {{ data.payCost || '-' }}</view>
      </view>
      <view class="content">
        <view class="label">支付方式：</view>
        <view class="value">{{ showPayway(data) }}</view>
      </view>
      <view class="content">
        <view class="label">支付时间：</view>
        <view class="value">{{ data.payTime || '-' }}</view>
      </view>
    </view>
    <view class="top-border">
      <view class="content">
        <view class="label">审核人：</view>
        <view class="value">{{ data.approver || '-' }}</view>
      </view>
      <view class="content">
        <view class="label">审核结果：</view>
        <view class="value">{{ showResult(data) }}</view>
      </view>
      <view class="content">
        <view class="label">审核时间：</view>
        <view class="value">{{ data.approvalTime || '-' }}</view>
      </view>
      <view class="content">
        <view class="label">备注：</view>
        <view class="value">{{ data.remark || '-' }}</view>
      </view>
    </view>
    <view class="top-border" v-if="actType === '团体治疗'">
      <view v-for="(v, i) in data.itemFeeList" :key="i">
        <view class="content">
          <view class="label" style="width:150rpx;"
            >项目收费{{ v.feeType || '' }}：</view
          >
          <view class="value">{{ v.itemName }}</view>
        </view>
        <view class="content">
          <view class="label">{{ v.feeType == 1 ? '报名' : '咨询' }}费：</view>
          <view class="value"
            >¥ {{ parseFloat(parseFloat(v.price) * v.nums.toFixed()) }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { signDetail } from '../../../api/signupOrder'
export default {
  props: {
    signId: {
      type: String,
    },
    actType: {
      type: String,
    },
  },
  data() {
    return {
      data: {},
      reportState: {
        1: '报名成功',
        2: '审核中',
        3: '报名失败',
        4: '活动费待支付',
      },
    }
  },
  mounted() {
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail() {
      if (!this.signId) return
      let res = await signDetail({ signId: this.signId })
      this.data = res
    },
    //审核结果
    showResult(data) {
      return data.approvalResult === 1
        ? '同意'
        : data.approvalResult === 2
        ? '拒绝'
        : '-'
    },
    //是否退款
    showRefundRel(data) {
      return data.refundRel === 1 ? '是' : data.refundRel === 2 ? '否' : '-'
    },
    //支付方式
    showPayway(data) {
      if (!data.payWay) return '-'
      return data.payWay === 'WX_JSAPI' ? '微信支付' : data.payWay
    },
  },
  watch: {
    signId() {
      this.getOrderDetail()
    },
  },
}
</script>

<style lang="scss" scoped>
.sign-detail {
  padding: 20rpx 20rpx 10rpx;
  box-sizing: border-box;
  background: #fff;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666;
  .patient {
    .name {
      font-size: 30rpx;
      margin-right: 10rpx;
      font-weight: 500;
      color: #1a1a1a;
    }
  }
  .report {
    flex-wrap: wrap;
    padding-bottom: 5rpx;
  }
}
.state {
  padding: 4rpx 10rpx;
  background: rgba(191, 196, 196, 0.15);
  border-radius: 6rpx;
  font-size: 22rpx;
}
.content {
  display: flex;
  margin-bottom: 10rpx;
  flex-shrink: 0;
  .label {
    width: 130rpx;
    flex-shrink: 0;
  }
  .value {
    flex: 1;
    text-align: right;
    color: #333;
  }
}
.width50 {
  width: 50%;
}
.top-border {
  padding-top: 15rpx;
  border-top: 2rpx solid #ccc;
}
.text-left {
  text-align: left !important;
}
</style>
