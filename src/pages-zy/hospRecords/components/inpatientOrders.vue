<template>
  <view class="inpatient-orders">
    <view class="head">
      <view class="line"></view>
      <view class="title">住院医嘱</view>
      <view class="num"
        >共计<span style="color:#f66666">{{ ' ' + list.length + ' ' }}</span
        >条</view
      >
    </view>
    <view class="check-box">
      <view class="button">
        <block v-for="(item, btn) in btnBox" :key="btn">
          <view
            :class="btnState == btn ? 'item active' : 'item'"
            @click="changeOrder(btn)"
            >{{ item }}</view
          >
        </block>
      </view>
      <view class="check">
        <label @click="changeCheck" style="color:#333">
          <checkbox
            :checked="checkState"
            style="transform:scale(0.7)"
          />只显示有效医嘱
        </label>
      </view>
    </view>
    <template v-if="list.length > 0">
      <view class="body" v-for="(item, zy) in list" :key="zy">
        <view class="title"
          >{{ zy + 1 }}.{{ item.drugName || '-' }}(规格:{{
            orderStd || '-'
          }})</view
        >
        <view class="box">
          <!-- <view class="left">{{item.orderClassName}}</view> -->
          <view class="right">{{ item.orderType }}</view>
        </view>
        <view class="use"
          >{{ item.supplyName || '-' }}{{ ' ' }}{{ item.dosage || '-' }}/{{
            item.dosageUnit || '-'
          }}，共{{ item.dosageTotal || '-' }}，{{
            item.orderStatus || '-'
          }}</view
        >
        <view class="times">
          <view class="begin">开始时间：{{ changeDay(item.startDTime) }}</view>
          <view class="end">停止时间：{{ changeDay(item.stopDTime) }}</view>
        </view>
        <view class="remark">备注：{{ remark || '-' }}</view>
      </view>
    </template>
    <no-data v-else></no-data>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { hospOrderInfoList } from '../../api/hospitalCdr'
import NoData from '../../components/NoData'
export default {
  props: {
    inSno: {
      type: String,
    },
    begin: {
      type: String,
    },
    end: {
      type: String,
    },
    times: {
      type: String,
    },
    cardNo: {
      type: String,
    },
  },
  components: {
    NoData,
  },
  data() {
    return {
      list: [],
      btnState: 0,
      checkState: true,
      orderStatus: 0, // 0正在使用 1停用
      orderType: 1, // 0临时医嘱 1长期医嘱
      btnBox: ['长期医嘱', '临时医嘱'],
    }
  },
  methods: {
    async getHospOrderInfoList() {
      uni.showLoading()
      let res = await hospOrderInfoList({
        hospCode: this.$store.state.userInfo.orgId,
        cardNo: this.cardNo,
        inSno: this.inSno,
        orderStatus: this.orderStatus, // 0正在使用 1停用
        orderType: this.orderType, // 0临时医嘱 1长期医嘱
        beginDate: this.begin,
        endDate: this.end,
        times: this.times,
      })
      this.list = res
      uni.hideLoading()
    },
    changeOrder(i) {
      this.btnState = i
      switch (i) {
        case 0:
          this.orderType = 1
          break
        case 1:
          this.orderType = 0
          break
      }
    },
    changeCheck() {
      this.checkState = !this.checkState
      switch (this.checkState) {
        case true:
          this.orderStatus = 0
          break
        case false:
          this.orderStatus = 1
          break
      }
    },
    changeDay(times) {
      if (times) {
        return dayjs(times).format('YYYY-MM-DD')
      } else {
        return '-'
      }
    },
  },
  mounted() {
    this.getHospOrderInfoList()
  },
  watch: {
    orderStatus() {
      this.getHospOrderInfoList()
    },
    orderType() {
      this.getHospOrderInfoList()
    },
  },
}
</script>

<style lang="scss" scoped>
.inpatient-orders {
  width: 100%;
  .head {
    display: flex;
    align-items: center;
    .line {
      width: 2rpx;
      height: 30rpx;
      background: #0ab2c1;
      margin-right: 10rpx;
    }
    .title {
      width: 150rpx;
      font-size: 30rpx;
      color: #333333;
    }
    .num {
      flex: 1;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .check-box {
    display: flex;
    width: 100%;
    margin-bottom: 10rpx;
    font-size: 24rpx;
    .button {
      display: flex;
      width: 55%;
      align-items: center;
      .item {
        width: 110rpx;
        height: 36rpx;
        margin-left: 10rpx;
        border-radius: 10rpx;
        background: #dedbdb;
        text-align: center;
        line-height: 36rpx;
        color: #666;
      }
      .active {
        background: rgba(10, 178, 193, 0.2);
        color: #0ab2c1;
      }
    }
    .check {
      width: 45%;
    }
  }
  .body {
    width: 100%;
    padding: 20rpx;
    background: #ffffff;
    box-sizing: border-box;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    .title {
      margin-bottom: 20rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #333333;
      line-height: 24rpx;
    }
    .box {
      display: flex;
      width: 100%;
      text-align: center;
      font-weight: 500;
      margin-bottom: 20rpx;
      .left {
        height: 24rpx;
        background: rgba(0, 113, 227, 0.2);
        font-size: 22rpx;
        color: #0071e3;
        line-height: 24rpx;
        margin-right: 5rpx;
      }
      .right {
        height: 24rpx;
        background: rgba(10, 178, 193, 0.2);
        font-size: 22rpx;
        color: #0ab2c1;
        line-height: 24rpx;
      }
    }
    .use {
      width: 100%;
      font-size: 20rpx;
      color: #666;
      margin-bottom: 10rpx;
    }
    .times {
      display: flex;
      width: 100%;
      margin-bottom: 10rpx;
      align-items: center;
      .begin,
      .end {
        width: 50%;
        font-size: 20rpx;
        font-weight: 500;
        color: #333;
      }
      // .end{
      //   text-align: right;
      // }
    }
    .remark {
      width: 100%;
      font-size: 20rpx;
      font-weight: 500;
      color: #333333;
    }
  }
}
</style>
