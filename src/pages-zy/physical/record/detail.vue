<template>
  <view style="padding-bottom:120rpx">
    <view>
      <view class="top-tip" v-if="info.dayState ==0 && type == 0">温馨提示：您的预约时间快到了，请及时前往体检。</view>
      <view class="top-tip" v-if="info.dayState ==1 && type == 0">温馨提示：您的预约已超时，请及时联系医院进行处理。</view>
      <view class="top-tip" v-if="type == 0 && (dayjs().subtract(1,'day')).isBefore(dayjs(info.regDate))">温馨提示：取消预约请至少提前24小时，否则无法取消。</view>
      <view class="top-tip" v-if="type == 1 && info.hasReport != 1">温馨提示：您的体检报告将在体检后3-7个工作日生成。</view>

      <view class="top-bg text-center" :style="{
          backgroundImage: `url(${FILE_URL_BUILT_IN(
            type != 0 ? 'orderIngoBg2_grey.png' : 'orderIngoBg2.png',
          )})`,
        }">
        <view>{{type == 0?'已预约':type == 1?'已体检':type == 2?'已取消':''}}</view>
      </view>
    </view>

    <view class="panWrap">
      <app-card styles="padding: 30rpx;">
        <app-list-item label="单据号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.checkupNo" noBorder>
          <view class="flex_1 flex-between">
            <view>{{info.checkupNo || '-'}}</view>
            <text class="tag today" v-if="info.dayState == 0 && type == 0">当日</text>
            <text class="tag on" v-if="info.dayState == 1 && type == 0">超时</text>
          </view>
        </app-list-item>
        <app-list-item label="来源" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.sourceName" noBorder></app-list-item>
        <app-list-item label="创建时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.createTime" noBorder></app-list-item>
        <app-list-item v-if="info.checkupTime" label="体检时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.checkupTime" noBorder></app-list-item>
        <app-list-item v-if="info.cancelTime" label="取消时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.cancelTime" noBorder></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;">
        <app-list-item label="体检人" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.patientName" noBorder></app-list-item>
        <app-list-item label="手机号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.phone" noBorder></app-list-item>
        <app-list-item label="预约体检时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.regDate"
          noBorder></app-list-item>
        <app-list-item label="医院" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hospital" noBorder></app-list-item>
        <app-list-item label="体检套餐" :styles="{padding:'10rpx',paddingLeft:0}" noBorder>
          <view class="flex_1">{{info.packageName}}</view>
        </app-list-item>
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
    <view v-if="type == 0 && (dayjs().subtract(1,'day')).isBefore(dayjs(info.regDate))" class="fiexdBtn del" @click="showPop">
      取消预约
    </view>
    <view v-if="type == 1 && info.hasReport == 1" class="fiexdBtn del" @click="goto(``)">
      体检报告
    </view>
    <view v-if="type == 2" class="fiexdBtn del" @click="goto(``)">
      退费单
    </view>
  </view>
</template>
<script>
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import dayjs from 'dayjs'
  import {
    getTjRecordInfo,
    orderRefund
  } from '../../api/physical.js'
  export default {
    components: {
      AppCard,
      AppListItem
    },
    data() {
      return {
        info: {},
        billNo: '',
        patientId: '',
        type: 0
      }
    },
    onLoad(option) {
      this.billNo = option.billNo
      this.patientId = option.patientId
      this.type = option.type
      this.getRegistrationRecord()
    },
    methods: {
      dayjs,
      // 获取详情
      async getRegistrationRecord() {
        let list = await getTjRecordInfo({
          billNo: this.billNo,
          patientId:this.patientId
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
        });
      },
      // 取消预约
      async refund() {
        let res = await orderRefund({
          orderNo: this.recordId
        })
        if (res) {
          this.TIP('取消成功')
          uni.navigateBack({
            delta: 1
          })
          // this.getRegistrationRecord()
        }
      },
      goto(url){
        uni.navigateTo({
          url:url
        })
      }
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
    height: 88rpx;
    width: 710rpx;
    position: fixed;
    bottom: 20rpx;
    left: 50%;
    margin-left: -355rpx;
    border-radius: 44rpx;
    background: $uni-color-primary;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;

    &.del {
      background: #fff;
      color: $uni-color-primary;
    }
  }

  .panWrap {
    padding: 0 20rpx;
    margin-top: -20rpx;

    .tag {
      width: 90rpx;
      height: 40rpx;
      background: #F0F0F0;
      font-size: 22rpx;
      text-align: center;
      line-height: 40rpx;

      &.on {
        color: #FF4500;
        background: rgba(255, 69, 0, 0.2);
      }

      &.today {
        background: #FFEAD6;
        color: #FE7E00;
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
</style>
