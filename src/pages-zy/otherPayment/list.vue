<template>
  <view style="padding-top: 250rpx;">
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
      <view class="listTtem box-shadow" v-for="(item, index) in testList1" :key="index" :immediate-check="false">
        <view class="dateBox flex-between">
          <view class="name">支付号：{{ item.payId }}</view>
          <view>
            <view class="payType">{{ item.payWay }}</view>
          </view>
        </view>
        <view class="contentBox">
          <view class="name">
            <!-- 【门诊】{{ item.name }} -->
            {{ item.title }}
          </view>
          <view class="flex-between mt-20">
            <view>
              <view>创建时间：{{ item.visitDate }}</view>
              <view>{{ item.type ? '缴费' : '退费' }}时间：{{ item.time }}</view>
            </view>
            <view class="color666">{{ item.type ? '-' : '+' }}￥{{ parseFloat(item.totalAmount).toFixed(2) }}</view>
          </view>
        </view>
      </view>
    </view>
    <NoData v-if="testList1.length == 0"></NoData>
  </view>
</template>
<script>
  import dayjs from 'dayjs'
  import selectPatient from '../components/selectPatient.vue'
  import selectDateRange from '../components/selectDateRange.vue'
  import AppListItem from '@/components/app/app-list-item'
  import NoData from '../components/NoData'
  import {
    otherData
  } from '../api/user.js'
  export default {
    components: {
      selectPatient,
      selectDateRange,
      AppListItem,
      NoData
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
        ],
        active: 0,
        testList1: [{
            "payId": "8338153",        //交易ID
            "billNo": "8338153",        //单据ID
            "tradeNo": "",            //第三方交易流水号
            "orderNo": "",            //商户订单号
            "prescNo": "8338153",        //处方号
            "type": true,                //类型：true缴费；false退费；
            "totalAmount": "0.01",        //费用
            "title": "药品缴费",            //项目标题
            "payWay": "自费",            //支付方式
            "visitDate": "2020-7-12 10:0:0",        //就诊时间/创建时间
            "time": "2020-07-24 13:54:21",        //支付时间 / 退费时间
            "visitNo": "4093880",                //就诊流水号
            "deptCode": "55",            //科室编码
            "deptName": "中医科门诊"        //科室名称
        },],
        rangeData: [dayjs().subtract(1, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        loading: true,
        finished: false,
        refreshing: false,
        currentNum: 1,
        pageSize: 10,
        pages: 0,
        otherPatient:'',
        perId:''
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
      },
      changePatient(item) {
        this.perId = item.memberId
        this.cardNo = item.patientCard
      },
      dayjs,
      async getOtherData() {
        let list = await otherData({
          patientId: this.perId,
          startDate: this.rangeData[0]?this.rangeData[0]:'',
          endDate: this.rangeData[1]?this.rangeData[1]:'',
          type: this.active,
          currentNum: this.currentNum,
          pageSize: this.pageSize,
          // otherPatient: this.otherPatient,
        })
        this.testList1 = list
      },

      topbarChange(state) {
        this.active = state
        this.testList1 = []
        this.getOtherData()
      },
      goto() {
        // this.$router.push('/bodycheckpay/detail')
      },
    },
  }
</script>
<style scoped lang="scss">
  .listWrap {
    padding:20rpx;
  }

  .listTtem {
    background: #fff;
    border-radius: 22rpx;
    padding: 0 0 30rpx 0;

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
      .name{
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
      }
    }
  }
</style>
