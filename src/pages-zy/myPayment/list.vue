<template>
  <view style="padding-top: 170rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar>
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
    <!--左菜单栏-->
    <leftTab :tabs="tabs" styles="top:190rpx;" :active="tabs[0].key" @change="topbarChange"></leftTab>
    <!-- 列表 -->
    <view style="padding-left: 160rpx;">
      <template v-if="active<3">
        <view class="listWrap">
          <view class="listTtem box-shadow" v-for="(item, index) in testList1" :key="index" :immediate-check="false"
            @click="goto(active==0?`/pages-zy/outpatientPayment/detail?patientId=${perId}&type=${item.payState}&billNo=${item.prescNo}&visitNo=${item.visitNo}&title=${item.title}`:active==2?`/pages-zy/physical/payment/detail?patientId=${perId}&type=${item.payState}&billNo=${item.visitNo}&title=${item.title}`:'')">
            <view class="dateBox flex-between">
              <view class="name">支付号：{{ item.payId }}</view>
              <view>
                <view class="payType">{{ item.payWay }}</view>
              </view>
            </view>
            <view class="contentBox">
              <view class="name flex-between">
                <view>{{ item.title }}</view>
                <view class="payNum">{{ item.type ? '-' : '+' }}￥{{ parseFloat(item.totalAmount).toFixed(2) }}</view>
              </view>
              <view class="flex-between mt-20">
                <view>
                  <view>创建时间：{{ item.visitDate }}</view>
                  <view>{{ item.type ? '缴费' : '退费' }}时间：{{ item.time }}</view>
                </view>

              </view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="listWrap">
          <view class="listTtem box-shadow" v-for="(item, index) in testList1" :key="index" @click="goto(active=='y-0'?`/pages-user/myAppointment/detail?id=${item.id}`:`/pages-zy/myAppointment/detail?orderId=${item.id}&recordId=${item.orderNo}`)">
            <view class="dateBox flex-between">
              <view class="name">支付号：{{ item.payId }}</view>
              <view>
                <view class="payType" size="large">{{
                      item.payment == 'WX' ? '微信' : '银联'
                    }}</view>
              </view>
            </view>
            <view class="contentBox">
              <view class="name flex-between">
                <view>{{ item.name }}</view>
                <!-- <view class="type">{{ item.noType | noTypeFilter }}</view> -->
                <view class="payNum">{{ item.tag }}￥{{parseFloat(item.totalMoney).toFixed(2)}}</view>
              </view>
              <view class="flex-between">
                <view>
                  <view>创建时间：{{ item.createTime }}</view>
                  <view>缴费时间：{{ item.paySuccessTime }}</view>
                </view>

              </view>
            </view>
          </view>

        </view>
      </template>
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
  import leftTab from '../components/leftTab/index.vue'
  import {
    otherData,
    appointmentData
  } from '../api/user.js'
  export default {
    components: {
      selectPatient,
      selectDateRange,
      AppListItem,
      NoData,
      leftTab
    },
    data() {
      return {
        tabs: [{
            title: '门诊',
            key: 0,
          },
          {
            title: '住院',
            key: 1,
          },
          {
            title: '体检',
            key: 2,
          },
          {
            title: '预约挂号',
            key: 'y-0',
          },
          {
            title: '预约体检',
            key: 'y-1',
          },
        ],
        active: 0,
        testList1: [],
        rangeData: [dayjs().subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        loading: true,
        finished: false,
        refreshing: false,
        currentNum: 1,
        pageSize: 10,
        pages: 0,
        otherPatient: '',
        perId: ''
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

    },
    methods: {
      dateChange(e) {
        this.rangeData = e
        this.topbarChange(this.active)
      },
      changePatient(item) {
        this.perId = item.memberId
        this.cardNo = item.patientCard
        this.topbarChange(this.active)
      },
      dayjs,
      //其他缴费
      async getOtherData() {
        let list = await otherData({
          patientId: this.perId,
          startDate: this.rangeData[0] ? this.rangeData[0] : '',
          endDate: this.rangeData[1] ? this.rangeData[1] : '',
          type: this.active,
          currentNum: this.currentNum,
          pageSize: this.pageSize,
          otherPatient: 0,
        })
        this.testList1 = list
      },
      //预约缴费
      async getAppointmentData() {
        let list = await appointmentData({
          patientId: this.perId,
          startDate: this.rangeData[0] || '',
          endDate: this.rangeData[1] || '',
          type: this.active == 'y-0' ? 0 : 1,
          currentNum: this.currentNum,
          pageSize: this.pageSize,
        })
        this.testList1 = this.testList1.concat(list.list)
      },
      topbarChange(state) {
        this.active = state
        this.testList1 = []
        this.currentNum = 1
        this.pages = 1
        if (this.active < 3) {
          this.getOtherData()
        } else {
          this.getAppointmentData()
        }

      },
      goto(url) {
        uni.navigateTo({
          url:url
        })
      },
    },
    onReachBottom() {
      if (this.active == 'y-0' || this.active == 'y-1') {
        if (this.currentNum < this.pages) {
          this.currentNum = this.currentNum + 1
          this.getAppointmentData()
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .listWrap {
    padding: 20rpx;
  }

  .listTtem {
    background: #fff;
    border-radius: 22rpx;
    padding: 0 0 30rpx 0;
    margin-bottom: 20rpx;

    .dateBox {
      padding: 30rpx 0;
      border-bottom: 1px solid #e9eff4;
      margin-bottom: 20rpx;
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

      .name {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;

        .payNum {
          color: #666;
          font-size: 28rpx;
          font-weight: normal;
        }
      }
    }
  }
</style>
