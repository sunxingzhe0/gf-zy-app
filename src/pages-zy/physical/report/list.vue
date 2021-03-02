<template>
  <view style="padding-top: 80rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item label="就诊人" :styles="{padding:'16rpx 30rpx',paddingLeft:0}">
            <view class="flex_1 text-right color666">
              <select-patient textStyle="color:#666;" @patientLoad="changePatient"></select-patient>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <!-- 订单 -->
    <view class="listBox">
      <view class="finishList box-shadow" v-for="(item, index) in list" :key="index" @click="goTo(item.checkupNo)">
        <view class="numTitle flex-between">
          <view class="num">体检单号：{{item.bookingNo}}</view>
          <view class="icon wancheng" v-if="item.reportStatus==0 || item.reportStatus==1">{{item.reportStatus==0?'生成中':item.reportStatus==1?'已生成':''}}</view>
        </view>
        <view class="content">
          <view class="contentTitle">
            {{item.reportTitle}}
          </view>
          <view class="dateBox">
            <view class="time">
              <view>体检时间：{{item.reportDtime}}</view>
            </view>
          </view>
        </view>
      </view>
      <NoData v-if="list.length == 0"></NoData>
    </view>
  </view>
</template>
<script>
  import NoData from '../../components/NoData'
  import selectPatient from '../../components/selectPatient.vue'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import {
    tjReportList
  } from '../../api/physical.js'
  export default {
    components: {
      NoData,
      selectPatient,
      AppCard,
      AppListItem
    },
    data() {
      return {
        // 更多就诊人的弹出层
        isShow: false,
        // 复选框
        checked: true,
        perId: '',
        list: []
      }
    },
    methods: {
      changePatient(item) {
        this.perId = item.memberId
        this.gettjReportList()
      },
      //获取列表
      async gettjReportList() {
        this.list = await tjReportList({
          patientId: this.perId
        })
      },
      // 跳转体检报告详情页
      goTo(checkupNo) {
        uni.navigateTo({
          url: `/pages-zy/physical/report/detail?checkupNo=${checkupNo}&patientId=${this.perId}`
        })
      },
    },
  }
</script>
<style scoped lang="scss">
  .listBox {
    padding: 20rpx;
  }

  .finishList {
    background: #fff;
    margin-bottom: 20rpx;

    .numTitle {
      padding: 20rpx 0 20rpx 20rpx;
      // background: red;
      border-bottom: 1rpx solid #e9eff4;

      .icon {
        width: 96rpx;
        height: 42rpx;
        border-radius: 2rpx 0rpx 0rpx 2rpx;
        font-size: 24rpx;
        color: #fff;
        line-height: 42rpx;
        text-align: center;
        border-radius: 4rpx;
        background: #7197af;

        &.wancheng {

          background: $uni-color-primary;
        }
      }

      .num,
      span {
        color: #646464;
        font-size: 28rpx;
      }
    }

    .content {
      padding: 20rpx;

      .contentTitle {
        font-size: 30rpx;
        line-height: 50rpx;
        color: #333333;
      }

      .dateBox {
        margin-top: 10rpx;

        .time {
          font-size: 28rpx;
          color: #646464;
          font-weight: 400;
          line-height: 40rpx;
        }

        .price {
          font-size: 28rpx;
          font-weight: 600;
          color: #646464;
        }
      }
    }
  }
</style>
