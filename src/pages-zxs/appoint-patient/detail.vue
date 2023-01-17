<template>
  <view style="padding:20rpx;">
    <view class="card">
      <view class="flex-between" style="position: relative">
        <view>
          <view class="item">
            <view class="title">就诊人</view>
            <text class="context">{{ details.patientName }}</text>
          </view>
          <view class="item">
            <view class="title">医院</view>
            <text class="context">{{ details.hospital || '-' }}</text>
          </view>
        </view>
        <image
          v-if="details.avatar"
          style="
            width: 76rpx;
            height: 76rpx;
            border-radius: 50%;
            background: cornflowerblue;
          "
          :src="FILE_URL(details.avatar)"
        ></image>
      </view>

      <view class="item">
        <view class="title">科室</view>
        <text class="context">{{ details.dept }}</text>
      </view>
      <view class="item">
        <view class="title">医生</view>
        <text class="context">{{ details.doctor }} {{ details.title }}</text>
      </view>
      <view class="flex-between">
        <view class="item">
          <view class="title">预约时段</view>
          <text class="context" style="color: #f74a4a">{{
            `${details.reservationDate.split(' ')[0]} ${
              details.reservationDtime
            }`
          }}</text>
        </view>
        <!-- <view class="state">当日</view> -->
      </view>
    </view>
    <view class="card">
      <view class="item">
        <view class="title">单据号</view>
        <text class="context">{{ details.id }}</text>
      </view>
      <view class="item">
        <view class="title">门诊号</view>
        <text class="context">{{ details.outNo || '-' }}</text>
      </view>
      <!-- <view class="item">
        <view class="title">项目</view>
        <text class="context">{{ details.entryName }}</text>
      </view> -->
      <view class="item">
        <view class="title">项目名称</view>
        <text class="context">{{ details.entryName }}</text>
      </view>
      <view class="item">
        <view class="title">诊疗费</view>
        <text class="context" style="color: #f74a4a">￥{{ details.cost }}</text>
      </view>
      <view class="item">
        <view class="title">创建时间</view>
        <text class="context">{{ details.creatTime || '-' }}</text>
      </view>
    </view>

    <view class="card">
      <view class="item">
        <view class="title">支付号</view>
        <text class="context">{{ details.payNo || '-' }}</text>
      </view>
      <view class="item">
        <view class="title">支付方式</view>
        <text class="context">{{
          details.payWay == 'WX_JSAPI' ? '微信支付' : '-'
        }}</text>
      </view>
      <view class="item">
        <view class="title">支付时间</view>
        <text class="context">{{ details.payTime || '-' }}</text>
      </view>
    </view>
  </view>
</template>
<script>
import { queryReservationDetail } from '../api/appointPatient'
export default {
  data() {
    return {
      refundWayTypes: {
        ORIGINAL: '原路退回',
        OFFLINE: '线下退款',
        ACCOUNT: '账户退款',
      },
      id: '',
      details: {},
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.getDesc()
    }
  },

  methods: {
    //详情
    async getDesc() {
      this.details = await queryReservationDetail(this.id)
    },
  },
}
</script>
<style lang="scss" scoped>
.xrequired:before {
  content: '*';
  color: red;
}
.tip {
  padding-left: 30rpx;
  padding-top: 19rpx;
  height: 80rpx;
  background: rgba(241, 145, 73, 0.1);
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #f19149;
  text-align: center;
}
.card {
  padding: 0rpx 30rpx 30rpx 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  margin-top: 20rpx;
  .item {
    display: flex;
    padding-top: 30rpx;
    .title {
      min-width: 200rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
    .context {
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .state {
    background: rgba(10, 178, 193, 0.1);
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #0ab2c1;
    padding: 5rpx 12rpx;
  }
}
.btn {
  text-align: center;
  margin-top: 30rpx;
  height: 88rpx;
  background: #ffffff;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #0ab2c1;
  line-height: 88rpx;
}
.context-p {
  width: 660rpx;
  height: 650rpx;
  background: #ffffff;
  border-radius: 20rpx;
}
.clear-p {
  width: 30rpx;
  height: 30rpx;
  background: #e6e6e6;
  border-radius: 50%;
}
.clear-title {
  padding: 30rpx;
  border-bottom: 1rpx solid #e6e6e6;
}
.reason-title {
  padding: 30rpx 20rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
.reason {
  margin: 0rpx 30rpx;
  height: 300rpx;
  background: #f7f7f7;
  border: 1rpx solid #cccccc;
  border-radius: 2rpx;
}
.operation {
  width: 660rpx;
  border-top: 1rpx solid #e6e6e6;
  height: 88rpx;
  bottom: 0rpx;
  position: absolute;
  display: flex;
}
.cancel {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  flex: 1;
  border-right: 1rpx solid #e6e6e6;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
}
.confirm {
  line-height: 88rpx;
  height: 88rpx;
  text-align: center;
  flex: 1;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #0ab2c1;
}
.time-interval {
  color: red;
  font-size: 36rpx;
  margin: 0 10rpx;
}
</style>
