<template>
  <view class="medical-cost">
    <view class="head">
      <view class="line"></view>
      <view class="title">费用总额：</view>
      <view class="price">
        <template v-if="feeBox.length > 0">¥ {{ totalCost }}</template>
        <template v-else>-</template>
      </view>
      <view class="num"
        >共计<span style="color:#f66666">{{ ' ' + feeBox.length + ' ' }}</span
        >项</view
      >
    </view>
    <template v-if="feeBox.length > 0">
      <view class="body">
        <view class="number">
          <view class="no">费用明细</view>
          <view class="nums" @click="isOpen = !isOpen">
            {{ isOpen ? '收起' : '展开' }}
            <image
              :src="require('@/assets/right11@2x.png')"
              :class="isOpen ? 'icon active' : 'icon'"
            ></image>
          </view>
        </view>
        <table
          cellspacing="0"
          :style="isOpen ? 'display:block' : 'display:none'"
        >
          <thead>
            <tr>
              <td>费用日期</td>
              <td>费用名称</td>
              <td>金额</td>
              <td>费用类别</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(one, fee) in feeBox" :key="fee">
              <td>{{ one.feeDtime || '-' }}</td>
              <td>{{ one.itemName || '-' }}</td>
              <td>¥ {{ one.price * 1 }}</td>
              <td>{{ one.feeType || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <view class="price" style="margin-bottom:20rpx">
        <view class="left">住院总费用：￥{{totalFee.payAmount}}</view>
        <view class="right">自付金额：￥{{totalFee.outAmount}}</view>
      </view>
      <view class="price">医保金额：￥{{totalFee.inAmount}}</view> -->
        <view class="price">总金额：￥{{ totalCost }}</view>
      </view>
    </template>
    <no-data v-else></no-data>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { constList, feeTotal } from '../../api/hospitalCdr'
import NoData from '../../components/NoData'
export default {
  props: {
    cardNo: {
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
  },
  components: { NoData },
  data() {
    return {
      feeBox: [],
      totalFee: {},
      isOpen: false,
      totalCost: '',
    }
  },
  methods: {
    // OpenClose(item){
    //  this.$set(item,'isOpen',!item.isOpen)
    // },
    async getConstList() {
      uni.showLoading()
      let res = await constList({
        cardNo: this.cardNo,
        itemType: 2,
        beginDate: this.begin,
        endDate: this.end || dayjs().format('YYYY-MM-DD'),
        times: this.times,
      })
      this.feeBox = res
      uni.hideLoading()
      let sum = 0
      res.forEach(v => {
        //  sum+=(v.price-0)
        sum += v.price * 1
      })
      console.log('总价：', sum.toFixed(2))
      this.totalCost = sum.toFixed(2)
    },
    async getFeeTotal() {
      let res = await feeTotal({
        cardNo: this.cardNo,
        itemType: 2,
        beginDate: this.begin,
        endDate: this.end,
        times: this.times,
      })
      this.totalFee = res
    },
  },
  mounted() {
    this.getConstList()
    this.getFeeTotal()
    console.log('当前时间：', dayjs().format('YYYY-MM-DD hh:mm'))
  },
}
</script>

<style lang="scss" scoped>
.medical-cost {
  width: 100%;
  .head {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
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
    .price {
      flex: 1;
      font-size: 30rpx;
      color: #0ab2c1;
    }
    .num {
      width: 150rpx;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .body {
    width: 100%;
    background: #ffffff;
    border-radius: 10rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-bottom: 10rpx;
    .number {
      display: flex;
      align-items: center;
      font-weight: 500;
      margin-bottom: 20rpx;
      .no {
        width: 75%;
        font-size: 26rpx;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .nums {
        position: relative;
        width: 25%;
        padding-right: 25rpx;
        text-align: right;
        box-sizing: border-box;
        font-size: 26rpx;
        color: #666666;
        .icon {
          position: absolute;
          width: 10rpx;
          height: 20rpx;
          top: 50%;
          right: 5rpx;
          transform: translate(0, -50%) rotate(90deg);
          transition: all 0.3s;
        }
        .active {
          transform: translate(0, -50%) rotate(-90deg);
        }
      }
    }
    table {
      width: 100%;
      border: 0.5rpx solid #e6e6e6;
      text-align: center;
      margin-bottom: 20rpx;
      overflow: hidden;
      transition: all 0.3s;
      thead {
        width: 100%;
        background: #f2f2f2;
        font-size: 20rpx;
        color: #666666;
      }
      tbody {
        width: 100%;
        font-size: 20rpx;
        color: #666666;
      }
      tr td {
        border: 0.5rpx solid #e6e6e6;
      }
      tr {
        display: flex;
      }
      td {
        display: flex;
        width: 25%;
        align-items: center;
        justify-content: center;
      }
    }
    .price {
      display: flex;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 22rpx;
      color: #666666;
      .left {
        width: 40%;
        font-size: 22rpx;
      }
      .right {
        width: 60%;
        font-size: 22rpx;
        text-align: right;
      }
    }
  }
}
</style>
