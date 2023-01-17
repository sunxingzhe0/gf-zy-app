<template>
  <view class="page">
    <view class="app-card">
      <view style="fontSize:30rpx">
        <text class="border-left">|</text>患者信息</view
      >
      <view class="item flex-between">
        <view>
          <text style="fontSize:30rpx">{{ patentInfo.name }}</text>
          <text style="margin-left:10rpx">{{
            `  ${patentInfo.sex == 1 ? '男' : '女'} | ${patentInfo.age ||
              '-'}岁`
          }}</text>
          <text v-if="severePatient == 1" class="color-red">重精</text>
        </view>
        <view>{{ patentInfo.phone }}</view>
      </view>
      <view class="item">
        <view class="flex-between">
          <view class="lable">患者ID：</view>
          <view class="value">{{ patentInfo.patientId || '-' }}</view>
        </view>
        <view class="flex-between">
          <view class="lable">就诊卡号：</view>
          <view class="value">{{ patentInfo.cardNo || '-' }}</view>
        </view>
        <view class="flex-between">
          <view class="lable">就诊次数：</view>
          <view class="value">{{ diagCount || '-' }}</view>
        </view>
        <view class="flex-between">
          <view class="lable">出生日期：</view>
          <view class="value">{{ patentInfo.birthday || '-' }}</view>
        </view>
        <view class="flex-between">
          <view class="lable">身份证号：</view>
          <view class="value">{{ patentInfo.idCard || '-' }}</view>
        </view>
      </view>
    </view>
    <view class="tabs">
      <Tabs :tabList="tabList" @click="changeTab"></Tabs>
      <view class="flex-between filter">
        <view
          class="item border-right"
          @click="typeSelect"
          v-if="checkState == 1"
        >
          <text>{{ types[typeValue[0]] }}</text>
          <text
            class="iconfont icon-xiala"
            style="font-size: 20rpx;color:#666"
          ></text
        ></view>
        <view class="item date ">
          <text @click="timeSelect"
            >{{ rangeData[0] || '开始时间' }}~{{
              rangeData[1] || '结束时间'
            }}</text
          >
          <text
            class="iconfont icon-xiala"
            style="font-size: 20rpx;color:#666"
          ></text
        ></view>
      </view>
    </view>
    <view class="lists">
      <OrderList
        ref="OrderList"
        :patentInfo="patentInfo"
        v-if="checkState == 0"
      ></OrderList>
      <Activitys
        ref="Activitys"
        :patentInfo="patentInfo"
        v-if="checkState == 1"
      ></Activitys>
      <LeavesRcord
        ref="LeavesRcord"
        :patentInfo="patentInfo"
        v-if="checkState == 2"
      ></LeavesRcord>
      <!-- <HcRcord v-if="checkState == 3"></HcRcord> -->
      <VisitRcord
        ref="visitRcord"
        :patentInfo="patentInfo"
        v-if="checkState == 3"
      ></VisitRcord>
    </view>
    <pop-select-date
      ref="timePop"
      :date="rangeData"
      @confirm="dateChange"
    ></pop-select-date>

    <uni-popup ref="typtPop" type="bottom">
      <view class="pop-view">
        <view class="title"
          >选择项目
          <view class="icon" @click="cancelPop">
            <uni-icons :size="20" color="#e6e6e6" type="clear" />
          </view>
        </view>
        <picker-view
          :value="typeValue"
          style="height: 200px; text-align: center"
          :indicator-style="indicatorStyle"
          @change="bindChange"
        >
          <picker-view-column>
            <view v-for="(item, index) in types" :key="index" class="item">{{
              item
            }}</view>
          </picker-view-column>
        </picker-view>

        <view @click="confirm" class="confirm">确认</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { GetAgeAndSexByIDNum } from '@/common/util'
import Tabs from '@/pages-zxs/components/tabs/index'
import popSelectDate from '@/pages-zxs/components/pop-select-date/index.vue'
import OrderList from './orderList.vue'
import Activitys from './activitys.vue'
import LeavesRcord from './leavesRcord.vue'
import HcRcord from './hcRcord.vue'
import VisitRcord from './visitRcord.vue'
import { getPatientInfo } from '@/pages-zxs/api/myPatient'
export default {
  components: {
    Tabs,
    popSelectDate,
    OrderList,
    Activitys,
    LeavesRcord,
    HcRcord,
    VisitRcord,
  },
  data() {
    return {
      diagCount: '',
      tabList: [
        { title: '预约单', state: 0 },
        { title: '活动报名', state: 1 },
        { title: '请假记录', state: 2 },
        { title: '就诊记录 ', state: 3 },
      ],
      patentInfo: {},
      types: ['全部', '团体活动', '团体治疗'],
      typeValue: [0],
      rangeData: [],
      selectT: 0,
      indicatorStyle: `height: 80rpx;`,
      checkState: 0,
      severePatient: 0,
    }
  },
  onLoad(options) {
    this.getInfo(options.patientId)
    this.diagCount = options.diagCount
    this.severePatient = options.severePatient
  },
  methods: {
    async getInfo(patientId) {
      this.patentInfo = await getPatientInfo({ patientId })
      this.patentInfo.age = GetAgeAndSexByIDNum(this.patentInfo.idCard)
    },
    changeTab(item) {
      this.checkState = item.state
      this.rangeData = []
    },
    dateChange(e) {
      this.rangeData = e
      this.getList()
    },
    //调用组件接口
    getList() {
      switch (this.checkState) {
        case 0:
          this.$refs.OrderList.getListData(this.rangeData)
          break
        case 1:
          this.$refs.Activitys.getListData(this.rangeData)
          break
        case 2:
          this.$refs.LeavesRcord.getListData(this.rangeData)
          break
        case 3:
          this.$refs.visitRcord.getListData(this.rangeData)
          break

        default:
          break
      }
    },
    cancelPop() {
      this.$refs.typtPop.close()
    },
    bindChange(e) {
      this.selectT = e.detail.value[0]
    },
    confirm(e) {
      this.typeValue = [this.selectT]
      console.log(this.$refs)
      this.$refs.Activitys.getListData(
        '',
        this.selectT ? this.types[this.selectT] : '',
      )

      this.$refs.typtPop.close()
    },
    typeSelect() {
      this.$refs.typtPop.open()
    },
    timeSelect() {
      this.$refs.timePop.open()
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  font-size: 14px;
  padding: 20rpx;

  .app-card {
    padding: 20rpx;
    margin-top: 20rpx;
    .border-left {
      color: #0ab2c1;
      margin-right: 5rpx;
    }
    .item {
      margin-top: 20rpx;
      .lable {
        color: #666;
      }
    }
  }
  .tabs {
    // background: #fff;
    margin-top: 20rpx;
    .filter {
      // border-top: 1px solid #f2f2f2;
      // margin-top: 20rpx;
      padding: 0 10rpx;
    }
    .item {
      flex: 2;
      padding: 20rpx 0rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 0rpx 20rpx;
    }
    .date {
      flex: 3;
    }
  }
}
.pop-view {
  width: 100%;
  min-height: 700rpx;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .title {
    font-size: 32rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    .icon {
      position: absolute;
      top: 10rpx;
      height: 100%;
      right: 32rpx;
    }
  }

  .confirm {
    position: absolute;
    width: 100%;
    bottom: 0rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: $uni-color-primary;
    color: #fff;
  }
}
.color-red {
  background: rgba(247, 74, 74, 0.15);
  color: #f74a4a;
  font-size: 24rpx;
  border-radius: 6rpx;
  padding: 0 10rpx;
  height: 34rpx;
  line-height: 34rpx;
}
</style>
