<template>
  <view style="padding-bottom:120rpx">
    <view>
      <view class="top-tip" v-if="info.cancel && info.orderState == 1">温馨提示：取消预约请至少提前一天，否则当日无法取消。</view>
      <view class="top-bg text-center" :style="{
          backgroundImage: `url(${FILE_URL_BUILT_IN(
            info.orderState == 0 ? 'orderIngoBg2_grey.png' : 'orderIngoBg2.png',
          )})`,
        }">
        <view>{{info.orderState == 0?'已退款':info.orderState == 1?'已支付':''}}</view>
      </view>
    </view>

    <view class="panWrap">
      <app-card styles="padding: 30rpx;">
        <app-list-item label="单据号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.billData" noBorder></app-list-item>
        <app-list-item label="项目" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.name" noBorder></app-list-item>
        <!-- <app-list-item label="号源类型" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.noTypeName" noBorder></app-list-item> -->
        <app-list-item label="金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="`￥${parseFloat(info.fee).toFixed(2)}`"
          noBorder></app-list-item>
        <app-list-item label="创建时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.createTime" noBorder></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;">
        <app-list-item label="支付号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hisPayId" noBorder></app-list-item>
        <app-list-item label="支付方式" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payWayName" noBorder></app-list-item>
        <app-list-item label="支付金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="`￥${parseFloat(info.payFee).toFixed(2)}`"
          noBorder></app-list-item>
        <app-list-item label="支付时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.createTime" noBorder></app-list-item>
        <app-list-item label="退费金额" v-if="info.refundFee" :styles="{padding:'10rpx',paddingLeft:0}" :value="`￥${parseFloat(info.refundFee).toFixed(2)}`"
          noBorder></app-list-item>
          <app-list-item label="退费方式" v-if="info.refundWayName" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.refundWayName" noBorder></app-list-item>
          <app-list-item label="退费时间" v-if="info.refundTime" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.refundTime" noBorder></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;">
        <app-list-item label="姓名" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.patientName" noBorder></app-list-item>
        <app-list-item label="手机号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.phone" noBorder></app-list-item>
        <app-list-item label="体检时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.reserveTime" noBorder></app-list-item>
        <app-list-item label="医院" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hospitalName" noBorder></app-list-item>
        <!-- <app-list-item label="科室" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.deptName" noBorder></app-list-item> -->
        <!-- <app-list-item label="医生" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.deptName" noBorder></app-list-item> -->
        <app-list-item label="体检套餐" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.reserveTime" noBorder>
          <view class="flex_1">
            {{info.packageName}}
          </view>
        </app-list-item>
      </app-card>
      <app-card styles="padding: 0;">
        <!-- 套餐项目 -->
        <view class="typeProject">
          <view class="objName">项目套餐</view>
          <view class="projectItem" v-for="(item, index) in info.itemInfo" :key="index">
            <view class="title">
              {{item.combName}}
            </view>
            <view class="content">
              <view class="name" v-if="item.combDetail">{{item.combDetail}}</view>
              <view class="tips" v-if="item.remark">{{item.remark}}</view>
            </view>
          </view>
        </view>
      </app-card>
    </view>
    <view class="fiexdBtn flex-between" v-if="info.orderState==1 && info.cancel">
      <view class="font32 color666">
        费用金额：<span class="price">￥{{ parseFloat(info.fee).toFixed(2) }}</span>
      </view>
      <view class="payBtn"  @click="showPop">取消预约</view>
    </view>
  </view>
</template>
<script>
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
import { appointmentDetail, orderRefund } from '../api/user.js'
export default {
  components:{
    AppCard,
    AppListItem
  },
  data() {
    return {
      isOpen: false,
      payType: '1',
      info: {},
      orderId: '',
      recordId:'',
    }
  },
  onLoad(option) {
    this.orderId = option.orderId
    this.recordId = option.recordId
    this.getRegistrationRecord()
  },
  methods: {
    async getRegistrationRecord() {
      let list = await appointmentDetail({
        orderId: this.orderId,
      })
      this.info = list || {}
    },
    showPop() {
      uni.showModal({
        title: '提示',
        content: '是否确认取消该预约？',
        success: res => {
          if (res.confirm) {
            this.refund()
          }
        }
      })
    },
    // 取消预约
    async refund() {
      let res = await orderRefund({ orderNo: this.recordId })
      if (res) {
        uni.showToast({
          title:'取消成功'
        })
        uni.navigateBack({
          delta:1
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
 .top-tip {
    height: 54rpx;
    line-height: 52rpx;
    padding-left: 20rpx;
    background-color: #fae2e2;
    color: #e45b5b;
  }
  .top-bg {
    height: 130rpx;
    background-size: contain;
    background-repeat: no-repeat;
    padding: 0 30rpx;
    padding-bottom: 15rpx;
    box-sizing: border-box;
    color: #fff;
    view {
      font-size: 32rpx;
      line-height: 110rpx;
    }
  }
  .fiexdBtn {
    height: 98rpx;
    width: 100%;
    background: #fff;
    padding:0 30rpx;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;

    .payBtn {
      height: 60rpx;
      width: 200rpx;
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
  .price {
    font-size: 28rpx;
    color: $uni-color-primary;
    text-align: right;
  }
.panWrap{
  padding:0 20rpx;
  margin-top: -20rpx;

}
    .typeProject {
      margin-bottom: 20rpx;
      padding: 30rpx;

      .objName {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 40rpx;
      }

      .projectItem {
        margin-top: 30rpx;

        .title {
          margin-bottom: 15rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: $uni-color-primary;
          line-height: 40rpx;
        }

        .content {
          background: #f2f2f2;
          font-size: 28rpx;
          padding: 30rpx;
          border-radius: 6rpx;
          margin-top: 20rpx;

          .name {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
            line-height: 40rpx;
          }

          .tips {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }

</style>
