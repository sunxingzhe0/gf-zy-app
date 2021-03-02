<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="top-tip" v-if="!dayjs(info.appointmentDate.split(' ')[0]).isBefore() && type == 1">
      {{info.today ? '温馨提示：取消预约请至少提前一天，否则当日无法取消。' : '温馨提示：您的预约时间快到了，请及时前往取号。'}}
    </view>
    <view class="panWrap">
      <app-card styles="padding: 30rpx;position:relative;">
        <app-list-item label="姓名" :styles="{padding:'10rpx',paddingLeft:0}" :value="perName" noBorder></app-list-item>
        <app-list-item label="医院" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hospitalName" noBorder></app-list-item>
        <app-list-item label="科室" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.deptName" noBorder></app-list-item>
        <app-list-item label="医生" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.doctorName" noBorder></app-list-item>
        <app-list-item label="预约时段" :styles="{padding:'10rpx',paddingLeft:0}" value="消化内科" noBorder>
          <view class="flex_1 flex-between">
            <view>{{info.appointmentDate}}</view>
            <text class="tag today" v-if="type == 1 && info.today">当日</text>
            <text class="tag on" v-if="type == 4">已退</text>
          </view>
        </app-list-item>

        <view class="headerImg">
          <default-img :url="FILE_URL(info.doctorAvatar)"></default-img>
        </view>
      </app-card>
      <app-card styles="padding: 30rpx;">
        <app-list-item label="单据号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.billData" noBorder></app-list-item>
        <app-list-item label="项目" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.name" noBorder></app-list-item>
        <app-list-item label="号源类型" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.noTypeName" noBorder></app-list-item>
        <app-list-item label="金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="`￥${parseFloat(info.fee).toFixed(2)}`"
          noBorder></app-list-item>
        <app-list-item label="创建时间" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.createTime" noBorder></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;" v-if="type!=4">
        <app-list-item label="支付号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hisPayId || '-'" noBorder></app-list-item>
        <app-list-item label="支付方式" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payWay || '-'" noBorder></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;" v-if="type==4">
        <app-list-item label="退费金额" :styles="{padding:'10rpx',paddingLeft:0}" :value="`￥${parseFloat(info.fee).toFixed(2)}`" noBorder></app-list-item>
        <app-list-item label="退费流水号" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.hisPayId || '-'" noBorder></app-list-item>
        <app-list-item label="退费方式" :styles="{padding:'10rpx',paddingLeft:0}" :value="info.payWay || '-'" noBorder></app-list-item>
      </app-card>
    </view>
  </view>
</template>
<script>
  import {
    registrationRecord
  } from '../api/outpatient'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import dayjs from 'dayjs'
  export default {
    components: {
      AppCard,
      AppListItem
    },
    data() {
      return {
        isOpen: false,
        payType: '1',
        info: {},
        type: '',
        perName: '',
        patientCard: '',
        id: '',
        patientId: ''
      }
    },
    onLoad(option) {
      this.type = option.type
      this.perName = option.perName
      this.patientCard = option.patientCard
      this.id = option.id
      this.patientId = option.patientId
      this.getRegistrationRecord()
    },
    methods: {
      dayjs,
      async getRegistrationRecord() {
        let list = await registrationRecord({
          visitNo: this.id,
          patientId: this.patientId,
          type: this.type,
        })
        this.info = list[0] || {}
      },
    },
  }
</script>
<style lang="scss" scoped>
  .panWrap {
    padding: 20rpx;

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
      &.today{
        background: #FFEAD6;
        color: #FE7E00;
      }
    }
  }

  .top-tip {
    height: 54rpx;
    line-height: 52rpx;
    padding-left: 20rpx;
    background-color: #fae2e2;
    color: #e45b5b;
  }

  .headerImg {
    position: absolute;
    right: 20rpx;
    top: 30rpx;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    overflow: hidden;
  }
</style>
