<template>
  <view>
    <view
      class="card"
      v-for="(item, index) in listData"
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
              background: #ccc;
              margin-right: 20rpx;
            "
            :src="FILE_URL(item.docPicId)"
          ></image>
          <view class="flex-column" style="display: flex;align-items: center;">
            <text class="name">{{ item.doctor }}</text>
            <text class="dept">{{ item.title || '-' }} | {{ item.dept }}</text>
          </view>
        </view>
        <!-- 状态（1.已预约 2.已请假 3.请假中 4.已关闭） -->
        <view class="business" :class="item.status == 4 && 'close'">{{
          statusType[item.status - 1] || '-'
        }}</view>
      </view>
      <view class="time"
        >{{ `[${item.entryName}] `
        }}{{ item.reservationDate && item.reservationDate.slice(0, 10) }}
        {{ item.reservationDtime }}</view
      >
      <view class="orther flex-between">
        <text>门诊号:{{ item.cardNo }}</text>
        <text>诊查费：￥{{ item.cost }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { queryReservation } from '@/pages-zxs/api/myPatient'
export default {
  props: {
    patentInfo: Object,
  },
  data() {
    return {
      /* 状态（1.已预约 2.已请假 3.请假中 4.已关闭） */
      statusType: ['已预约', '已请假', '请假中', '已关闭'],
      listData: [],
    }
  },
  mounted() {
    setTimeout(() => {
      this.getListData()
    }, 1000)
  },
  methods: {
    toInfo(id) {
      uni.navigateTo({
        url: '/pages-zxs/myPatient/orderListInfo?id=' + id,
      })
    },
    async getListData(times) {
      const params = times
        ? {
            patientId: this.patentInfo.patientId,
            reservationDateLow: times[0],
            reservationDateHigh: times[1],
          }
        : {
            patientId: this.patentInfo.patientId,
          }
      this.listData = (await queryReservation(params)).list
    },
  },
  // watch: {
  //   patentInfo: {
  //     handler(newval, oldval) {
  //       console.log(newval)
  //       this.getListDate()
  //     },
  //     deep: true,
  //   },
  // },
}
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
  .name {
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
    margin-left: 10rpx;
  }
  .business {
    padding: 5rpx 10rpx;

    background: rgba(10, 178, 193, 0.15);

    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #0ab2c1;
  }
  .close {
    color: #b3b3b3;
    background: rgba(178, 178, 178, 0.15);
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
