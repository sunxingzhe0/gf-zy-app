<template>
  <view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
      <app-list-item label="就诊人" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right">{{infoData.patientName}}</view>
      </app-list-item>
      <app-list-item label="住院总费用" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right" v-if="infoData.feeAmount">{{'￥'+ parseFloat(infoData.feeAmount).toFixed(2)}}</view>
      </app-list-item>
      <app-list-item label="可用余额" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right" v-if="infoData.useMoney">{{'￥' + parseFloat(infoData.useMoney).toFixed(2)}}</view>
      </app-list-item>
      <app-list-item label="时间" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right color666 flex-end-start">
          <picker mode="date" :value="date" :end="maxDate" @change="confirm">
            <text :class="[date?'color666':'color999']">{{date ||  '选择时间'}}</text>
          </picker>
          <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
        </view>
      </app-list-item>
      <app-list-item label="费用" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right" v-if="infoData.moneyAnd">{{'￥' +parseFloat(infoData.moneyAnd).toFixed(2)}}</view>
      </app-list-item>
      <app-list-item label="费用类别" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right color666" @click="selecPayType">
          {{feeName}}
          <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
        </view>
      </app-list-item>

    </app-card>
    <app-card styles="padding: 30rpx;" class="detail">
      <view class="table">
        <view class="thbody">
          <view class="th">类别</view>
          <view class="th">名称</view>
          <view class="th">单价</view>
          <view class="th">数量</view>
          <view class="th">总价</view>
        </view>
        <view v-for="(item, index) in infoData.items" :key="index" class="tdbody">
          <view class="td">{{ item.itemType }}</view>
          <view class="td">{{ item.itemName }}</view>
          <view class="td">{{ item.price?'￥'+parseFloat(item.price).toFixed(2):'-' }}</view>
          <view class="td">{{ item.num }}</view>
          <view class="td">{{ item.money?'￥'+parseFloat(item.money).toFixed(2):'-' }}</view>
        </view>
      </view>
    </app-card>
    <!--费用类别-->
    <pop-select ref="popselect" title="费用类别" :list="feeList" @change="changePer"  @submit="changePer"></pop-select>
  </view>
</template>
<script>
  import dayjs from 'dayjs'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import popSelect from '@/components/pop-select'
  import itemList from './itemType.js'
  import {
    findBill
  } from '../api/inHospital.js'
  export default {
    components: {
      AppCard,
      AppListItem,
      popSelect
    },
    data() {
      return {
        isdate: false,
        maxDate: dayjs().format('YYYY-MM-DD'),
        date: dayjs().subtract(1,'day').format('YYYY-MM-DD'),
        minData:'',
        isFee: false,
        feeId: '',
        feeName: '全部',
        patientId: '',
        feeList: itemList,
        infoData: {},
      }
    },
    onLoad(option) {
      console.log(option)
      this.minData = option.admitDtime
      if (option.dischargeDtime) {
        this.date = option.dischargeDtime
        this.maxDate = option.dischargeDtime
      }
      if (option.patientId) {
        this.patientId = option.patientId
        this.getfindBill()
      }

    },
    methods: {
      async getfindBill() {
        this.infoData = await findBill({
          patientId: this.patientId,
          startTime: this.date,
          endTime: this.date,
          billType: 2,
          itemType: this.feeId,
        })
      },
      // 选择就费用类别
      changePer(e) {
        if (e) {
          this.feeId = e
          this.feeName = this.feeList.filter(item => item.value == e)[0].name
        } else {
          this.$refs.popselect.close()
          this.getfindBill()
        }
      },
      selecPayType() {
        this.$refs.popselect.open()
      },
      confirm(e) {
        console.log(e)
        this.date = e.detail.value
        this.getfindBill()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .detail {
    .table {
      width: 100%;
      display: table;
      border: 1px solid #e6e6e6;
      border-right: 0;
      border-bottom: 0;
      text-align: center;
      font-size: 24rpx;

      .thbody {
        display: table-header-group;

        .th {
          display: table-cell;
          border: 1px solid #e6e6e6;
          color: #666;
          border-top: 0;
          border-left: 0;
          padding: 10rpx;
        }
      }

      .tdbody {
        display: table-row-group;

        .td {
          padding: 10rpx;
          display: table-cell;
          border: 1px solid #e6e6e6;
          border-top: 0;
          border-left: 0;
        }
      }
    }
  }
</style>
