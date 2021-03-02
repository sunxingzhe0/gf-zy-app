<template>
  <view style="padding-top:250rpx ;">
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

        <app-list-item label="选择时间" :styles="{padding:'16rpx 30rpx'}">
          <view class="flex_1 text-right color666 flex-end-start">
            <select-date-range :date="rangeData" @confirm="dateChange"></select-date-range>
          </view>
        </app-list-item>
      </template>
    </topbar>
    <!-- 列表 -->
    <view class="listWrap">
      <view class="listTtem box-shadow" v-for="(item, index) in testList1" :key="index">
        <view class="dateBox flex-between">
          <view class="name">支付号：{{ item.payId }}</view>
          <view>
            <view class="payType" size="large">{{
                  item.payment == 'WX' ? '微信' : '银联'
                }}</view>
          </view>
        </view>
        <view class="contentBox">
          <view class="nameType flex-start-center">
            <view class="name">{{ item.name }}</view>
            <view class="type">{{ item.noType | noTypeFilter }}</view>
          </view>
          <view class="flex-between">
            <view>
              <view>创建时间：{{ item.createTime }}</view>
              <view>缴费时间：{{ item.paySuccessTime }}</view>
            </view>
            <view class="color666">{{ item.tag }}￥{{parseFloat(item.totalMoney).toFixed(2)}}</view>
          </view>
        </view>
      </view>
      <NoData v-if="testList1.length == 0"></NoData>
    </view>
  </view>
</template>
<script>
  import dayjs from 'dayjs'
  import selectPatient from '../components/selectPatient.vue'
  import selectDateRange from '../components/selectDateRange.vue'
  import AppListItem from '@/components/app/app-list-item'
  import NoData from '../components/NoData'
  import {
    appointmentData
  } from '../api/user.js'
  export default {
    components: {
      AppListItem,
      selectPatient,
      selectDateRange,
      NoData
    },
    data() {
      return {
        tabs: [{
            title: '预约挂号',
            key: 0,
          },
          {
            title: '预约体检',
            key: 1,
          },
        ],
        active: 0,
        perId: '',
        testList1: [{
          "index": 1,
          "id": "AfFbqvzXpEicTZEfEolUKtXAwVRsLNhH", //订单ID
          "orderNo": "KFJpAUicvhViSdtiTmOhYketRcCtLCdp", //商户订单号或者商户退款单号
          "payId": "42000007082020072", //支付平台交易或者退款流水ID
          "detailId": "F75E141E2F9846EA85C106C92AC2203E", //明细记录ID
          "totalFee": 1, //金额整形单位
          "tag": "-", //减号表示支付，+表示退款
          "totalMoney": "0.01", //金额显示
          "name": "预约挂号", //项目名称
          "noType": "GENERAL", //挂号类型GENERAL("普通"),PROFICIENT("专家"),EMERGENCY("急诊"),SPECIAL("特需"),CONVENIENCE("便民门诊"),
          "payment": "WX", //支付方式   WX微信支付，UNION银联支付
          "createTime": "2020-07-21 15:40:37", //创建时间
          "paySuccessTime": "2020-07-21 15:41:26" //支付或退款成功时间
        }, ],
        rangeData: [dayjs().subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        currentNum: 1,
        pageSize: 10,
        pages: 0,
      }
    },
    filters: {
      noTypeFilter(value) {
        //挂号类型GENERAL("普通"),PROFICIENT("专家"),EMERGENCY("急诊"),SPECIAL("特需"),CONVENIENCE("便民门诊")
        if (value == 'PROFICIENT') {
          return '专家'
        } else if (value == 'EMERGENCY') {
          return '急诊'
        } else if (value == 'SPECIAL') {
          return '特需'
        } else if (value == 'CONVENIENCE') {
          return '便民门诊'
        } else {
          {
            return '普通'
          }
        }
      },
    },
    onLoad() {
      // this.topbarChange(0)
    },
    methods: {
      dateChange(e) {
        this.rangeData = e
      },
      changePatient(item) {
        this.perId = item.memberId
        this.cardNo = item.patientCard
        this.topbarChange(this.active)
      },
      dayjs,
      async getAppointmentData() {
        let list = await appointmentData({
          patientId: this.perId,
          startDate: this.rangeData[0] || '',
          endDate: this.rangeData[1] || '',
          type: this.active,
          currentNum: this.currentNum,
          pageSize: this.pageSize,
        })
        this.testList1 = this.testList1.concat(list.list)
      },
      topbarChange(state) {
        this.active = state
        this.currentNum = 1
        this.testList1 = []
        this.getAppointmentData()
      },
    },
    onReachBottom() {
      if (this.currentNum < this.pages) {
        this.topbarChange(this.active)
      }
    }
  }
</script>
<style scoped lang="scss">
  .sticky {
    position: sticky;
    top: 0;
    z-index: 3;
  }

  .listWrap {
    padding: 20rpx;
  }

  .listTtem {
    padding: 0 0 30rpx 0;
    background: #fff;

    .dateBox {
      padding: 30rpx 0;
      border-bottom: 1rpx solid #e9eff4;
      margin-bottom: 30rpx;
      font-size: 28rpx;
      padding-left: 30rpx;

      .name {
        color: #8c8c8c;
      }

      .payType {
        width: 96rpx;
        height: 42rpx;
        font-size: 24rpx;
        line-height: 42rpx;
        text-align: center;
        background: rgba(10, 178, 193, 0.2);
        color: $uni-color-primary;
      }
    }

    .contentBox {
      padding: 0 30rpx;
      line-height: 44rpx;
      font-size: 28rpx;
      color: #666;

      .nameType {
        margin-bottom: 20rpx;

        .name {
          font-size: 32rpx;
          color: #333;
          font-weight: 600;
        }

        .type {
          padding: 4rpx 10rpx;
          border: 1px solid $uni-color-primary;
          border-radius: 4px;
          color: $uni-color-primary;
          font-size: 22rpx;
          margin-left: 25rpx;
          line-height: 26rpx;
        }
      }

    }
  }
</style>
