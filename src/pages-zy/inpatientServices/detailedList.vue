<template>
  <view style="padding-top: 170rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="[]">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item label="就诊人" :styles="{padding:'16rpx 30rpx',paddingLeft:0}">
            <view class="flex_1 text-right color666">
              <select-patient textStyle="color:#666;" @patientLoad="changePatient"></select-patient>
            </view>
          </app-list-item>
        </view>

        <app-list-item label="选择时间" noBorder :styles="{padding:'16rpx 30rpx'}">
          <view class="flex_1 text-right color666">
            <select-date-range :date="rangeData" @confirm="dateChange"></select-date-range>
          </view>
        </app-list-item>
      </template>
    </topbar>
    <view style="padding: 20rpx;">
      <app-card styles="padding: 30rpx;position:relative;" v-for="(item,index) in list" :key="index" @click="goto(`/pages-zy/inpatientServices/listInfo?patientId=${perId}&admitDtime=${item.admitDtime}${
          item.dischargeDtime ? '&dischargeDtime=' + item.dischargeDtime : ''
        }`)">
        <app-list-item label="就诊人" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.patientName " noBorder></app-list-item>
        <app-list-item label="住院号" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.inSno" noBorder></app-list-item>
        <app-list-item label="医院" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.orgName || '-'" noBorder></app-list-item>
        <app-list-item label="科室" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.deptName" noBorder></app-list-item>
        <app-list-item label="病区" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.wardName" noBorder></app-list-item>
        <app-list-item label="病床" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.bedNo" noBorder></app-list-item>
        <app-list-item label="诊断" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.admitDiag" noBorder></app-list-item>
        <app-list-item label="入院时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.admitDtime" noBorder></app-list-item>
        <app-list-item label="出院时间" v-if="item.dischargeDtime" :styles="{padding:'10rpx',paddingLeft:0}" :value="item.dischargeDtime"
          noBorder></app-list-item>
        <app-list-item label="入院天数" :styles="{padding:'10rpx',paddingLeft:0}" noBorder>
          <view class="colorred">{{item.days}}天</view>
        </app-list-item>
        <view :class="['state',item.dischargeDtime?'':'no']">{{item.dischargeDtime?'已出院':'住院中'}}</view>
      </app-card>
      <noData v-if="list.length == 0"></noData>
    </view>
  </view>
</template>

<script>
  import noData from '../components/NoData.vue'
  import dayjs from 'dayjs'
  import selectPatient from '../components/selectPatient.vue'
  import selectDateRange from '../components/selectDateRange.vue'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import {
    findZyList
  } from '../api/inHospital'
  export default {
    components: {
      selectPatient,
      selectDateRange,
      AppCard,
      AppListItem,
      noData
    },
    data() {
      return {
        rangeData: [dayjs().subtract(3, 'months').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        perId: '',
        list: []
      }
    },
    methods: {
      dateChange(e) {
        this.rangeData = e
        this.getfindZyList()
      },
      changePatient(item) {
        this.perId = item.memberId
        this.getfindZyList()
      },
      // 获取列表
      async getfindZyList() {
        this.list = await findZyList({
          patientId: this.perId,
          startTime: this.rangeData[0] || '',
          endTime: this.rangeData[1] || ''
        })
      },
      goto(url) {
        uni.navigateTo({
          url: url
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/common/order.scss';

  .state {
    position: absolute;
    right: 0;
    top: 34rpx;
    width: 140rpx;
    height: 46rpx;
    background: rgba(10, 178, 193, 0.2);
    color: $uni-color-primary;
    line-height: 46rpx;
    text-align: center;

    &.no {
      background: #F0F0F0;
      color: #666;
    }
  }
</style>
