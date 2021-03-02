<template>
  <view style="padding-bottom:100rpx">
	  <!-- 收到视频聊天邀请 -->
	  <video-invitation />
	  <!--主页按钮-->
	  <homeIcom />
    <view>
      <view class="top-tip" v-if="type==0">
        温馨提示：暂只支持自费，使用医保请倒窗口缴费。
      </view>
      <view class="top-bg flex-center" :style="{
          backgroundImage: `url(${FILE_URL_BUILT_IN(
            type != 0 ? 'orderIngoBg2_grey.png' : 'orderIngoBg2.png',
          )})`,
        }">
        <view>{{type==0?'未支付':type==1?'已完成':'已退费'}}</view>
      </view>
    </view>
    <view style="padding: 20rpx;margin-top: -40rpx;">
      <app-card class="panWrap" styles="padding: 30rpx;">
        <app-list-item label="单据号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.bookingNo" noBorder></app-list-item>
        <app-list-item label="项目" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.itemName" noBorder></app-list-item>
        <app-list-item label="金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="`￥${parseFloat(info.payFee).toFixed(2) || '-'}`" noBorder></app-list-item>
        <app-list-item label="就诊人" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.patientName" noBorder></app-list-item>
        <app-list-item label="手机号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.phone" noBorder></app-list-item>
        <app-list-item label="医院" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hospital || '-'" noBorder></app-list-item>
        <app-list-item label="创建时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.createTime" noBorder>
          <view class="flex_1 flex-between">
            <view>{{info.createTime}}</view>
            <!-- <view class="daozhenBtn">智能导诊</view> -->
          </view>
        </app-list-item>
      </app-card>
      <app-card class="panWrap" styles="padding: 30rpx;">
        <app-list-item label="发票号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.invoiceNo || '-'" noBorder></app-list-item>
        <app-list-item label="支付号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hisPayId || '-'" noBorder></app-list-item>
        <app-list-item label="支付方式" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payway || '-'" noBorder></app-list-item>
        <app-list-item label="支付金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payFee?`￥${parseFloat(info.payFee).toFixed(2)}`: '-'" noBorder></app-list-item>
        <app-list-item label="支付时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payTime || '-'" noBorder></app-list-item>
      </app-card>
      <app-card class="panWrap" styles="padding: 30rpx;" v-if="type==2">
        <app-list-item label="退费金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payFee?`￥${parseFloat(info.payFee).toFixed(2)}`: '-'" noBorder></app-list-item>
        <app-list-item label="退费流水号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hisPayId || '-'" noBorder></app-list-item>
        <app-list-item label="退费方式" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payway || '-'" noBorder></app-list-item>
        <app-list-item label="退费时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payTime || '-'" noBorder></app-list-item>
      </app-card>
      <app-card styles="padding: 0;">
        <app-list-item label="体检项目" :styles="{padding:'20rpx 30rpx'}"></app-list-item>
        <view class="objList" v-for="(item,index) in info.itemInfo" :key="index">
          <view class="objName">{{item.combName}}</view>
          <view class="objInfo" v-if="item.combDetail">{{item.combDetail}}</view>
          <view class="objInfo err" v-if="item.remark">{{item.remark}}</view>
        </view>
      </app-card>
    </view>
    <view class="fiexdBtn flex-between" v-if="type == 0">
      <view class="font30 color666">费用金额：<text class="colorred font-weight">￥{{info.payFee?parseFloat(info.payFee).toFixed(2):'-'}}</text></view>
      <view class="payBtn" @click="payShow">支付</view>
    </view>
    <!-- 支付列表 -->
    <popPay
      ref="pay"
      :type="true"
      @success="paySucces"
      @payTap="paySubmit"
    ></popPay>
  </view>
</template>
<script>
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import popPay from '../../components/pop-pay/index.vue'
  import { getTjPayRecordList,tjPayFee } from '../../api/physical.js'
  export default {
    components: {
      AppCard,
      AppListItem,
      popPay
    },
    data() {
      return {
        isOpen: false,
        payType: '1',
        state: 1,
        patientId: '',
        type: '', //0.未支付，1.已缴费，2.已退费
        billNo: '',
        visitNo: '',
        info: {},
      }
    },
    onLoad(option) {
      this.patientId = option.patientId
      this.type = option.type
      this.billNo = option.billNo
      this.visitNo = option.visitNo
      this.getmzRpDetail()
    },
    methods: {
       // 获取详情
      async getmzRpDetail() {
        let info = await getTjPayRecordList({
          patientId: this.patientId,
          type: this.type,
          checkupNo: this.billNo,
        })
        this.info = info[0]
      },
      // 智能导诊
      daoZhen() {
        uni.showModal({
          title: '智能导诊',
          content: '本院所有预约号不予取消。如确因病情好转、病情恶化、已住院或不可抗拒的自然因素等特殊情况需取消预约挂号时，可由患者本人于预约就诊日前的工作时间内持本人身份证原件，前往门诊一楼预约挂号咨询台办理相关手续；如由他人代办，需由代办人出示患者身份证原件、代办人身份证及预约成功短信截图进行办理',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      },
      payShow(){
        this.$refs.pay.show()
      },
      paySubmit(e) {
        //确认支付
        let that = this
        tjPayFee({
            payment: e,
            payInfo: [this.info.checkupNo],
            patientId: this.patientId,
            payCard: '',
          })
          .then(data => {
            this.$refs.pay.payTypeC(data)
          })
      },
      paySucces(){
        uni.navigateBack({
          delta:1
        })
      },

    },
  }
</script>
<style lang="scss" scoped>
  @import '~@/common/order.scss';

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

      &.btn {
        background: #fff;
        color: $uni-color-primary;
        font-size: 24rpx;
        border-radius: 30rpx;
        width: 150rpx;
        text-align: center;

      }
    }
  }

  .panWrap {
    .burg {
      padding: 10rpx 20rpx;
      line-height: 40rpx;
      background: #F1F1F1;
      .burgList {
        padding: 10rpx 0;
      }
    }
  }

  .minHeight {
    max-height: 44rpx;
    overflow: hidden;
    transition: max-height 0.3s;
  }

  .maxHeight {
    max-height: 300rpx;
    overflow: hidden;
    transition: max-height 0.3s;
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
      width: 160rpx;
      height: 60rpx;
      background: $uni-color-primary;
      line-height: 60rpx;
      border-radius: 30rpx;
      text-align: center;
      color: #fff;
      font-size: 32rpx;

      &.disabled {
        opacity: 0.5;
      }
    }
  }
  .objList {
    padding: 30rpx 0;
    padding-right: 30rpx;
    margin-left: 30rpx;
    border-bottom: 1px dashed #E6E6E6;

    .objName {
      font-size: 28rpx;
      color: #333;
    }

    .objInfo {
      font-size: 24rpx;
      color: #666;

      &.err {
        color: #FE7E00;
      }
    }
  }
  .daozhenBtn{
    padding: 2rpx 20rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: $uni-color-primary;
    border: 1px solid $uni-color-primary;
  }
</style>
