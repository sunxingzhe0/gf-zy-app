<template>
  <view>
    <view
      class="card"
      v-for="(item, index) in orderList"
      :key="index"
      @click="toInfo(item.id)"
    >
      <view class="flex-between doctor">
        <view class="flex">
          <image
            style="
              width: 76rpx;
              height: 76rpx;
              border-radius: 50%;
              background: red;
              margin-right: 20rpx;
            "
            :src="FILE_URL(item.avatar)"
          ></image>
          <view class="flex-column">
            <text class="name">{{ item.doctor }}</text>
            <text class="dept">{{ item.title }} | {{ item.dept }}</text>
          </view>
        </view>
        <view class="business">家庭业务</view>
      </view>
      <view class="time"
        >{{ item.reservationDate }} {{ item.reservationDtime }}</view
      >
      <view class="orther flex-between">
        <text>门诊号:{{ item.outNo }}</text>
        <text>诊查费：￥{{ item.cost }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderList: [
        {
          avatar: "0F7FEA3907074704936EBADC1F25F986",
          cost: "300.00",
          delay: null,
          dept: "心咨中心",
          doctor: "彭莉",
          doctorId: "71AF59438BEB4853B2306F03D90E40DB",
          entryName: "家庭心里治疗",
          id: "7CC00652F7744E18B45BA38C6B9D6360",
          itemId: null,
          outNo: "200122190",
          periodName: "下午",
          reservationDate: "2022-07-29",
          reservationDtime: "15:10-16:10",
          status: 1,
          title: "副主任医师",
        },
        {
          avatar: "0F7FEA3907074704936EBADC1F25F986",
          cost: "0.00",
          delay: 2,
          dept: "心咨中心",
          doctor: "郝医生",
          doctorId: "DFA822BCA661416683A042B4CFEC3A27",
          entryName: "门诊诊察",
          id: "81E9D8E8E5CE46C797E3C24F8F260E6D",
          itemId: null,
          outNo: "200122190",
          periodName: "上午",
          reservationDate: "2022-07-29",
          reservationDtime: "08:00-08:20",
          status: 1,
          title: "主任医师",
        },
      ],
    };
  },
  methods: {
    toInfo(id) {
      uni.navigateTo({
        url: "/pages/pages-doctor/myPatient/orderListInfo",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  margin: 28rpx 28rpx 0rpx 28rpx;
  height: 300rpx;
  background: #ffffff;
  border-radius: 20rpx;
}
.doctor {
  padding: 30rpx;
  border-bottom: 1rpx solid #e6e6e6;
  .neme {
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #333333;
  }
  .dept {
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    margin-top: 20rpx;
  }
  .business {
    padding: 5rpx 10rpx;
    background: rgba(0, 153, 68, 0.1);

    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #009944;
  }
}
.time {
  padding: 20rpx 30rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
.orther {
  padding: 0rpx 30rpx;
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
}
</style>
