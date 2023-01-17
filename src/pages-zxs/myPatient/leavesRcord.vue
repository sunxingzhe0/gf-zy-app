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
            :src="FILE_URL(item.avatar)"
          ></image>
          <view class="flex-column">
            <text class="name" style="margin-right:5rpx">{{
              item.doctor
            }}</text>
            <text class="dept">{{ item.title }} | {{ item.dept }}</text>
          </view>
        </view>
        <view class="business" :class="item.status == 3 && 'primary'">{{
          statusTypes[item.status - 1]
        }}</view>
      </view>
      <view class="time"
        >{{ item.reservationDate && item.reservationDate.slice(0, 10) }}
        {{ item.reservationDtime || '' }}</view
      >
      <view class="orther flex-between">
        <text>门诊号:{{ item.cardNo }}</text>
        <text>诊查费：￥{{ item.cost }}</text>
      </view>
      <view class="leaves">
        <view class="item">请假理由：{{ item.remark || '-' }}</view>
        <view class="item">申请时间：{{ item.leaveTime || '-' }}</view>
      </view>

      <view class="leaves" v-if="item.status == 2 || item.status == 4">
        <view class="item"
          >审核结果：{{ item.approvalResult == 1 ? '已同意' : '已拒绝' }}</view
        >
        <view class="item"
          >是否退费：{{ item.refundRel == 1 ? '是' : '否' }}</view
        >
        <view v-if="item.delayDate" class="item"
          >顺延时间：{{ item.delayDate || '-' }}</view
        >
        <view v-if="item.opTime" class="item"
          >审核时间：{{ item.opTime || '-' }}</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import { leaveList } from '@/pages-zxs/api/leaveApproval'
export default {
  props: {
    patentInfo: Object,
  },
  data() {
    return {
      listData: [],
      /* 状态（1.已预约 2.已请假 3.请假中 4.已关闭） */
      statusTypes: ['已预约', '已请假', '请假中', '已关闭'],
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    async getListData(times) {
      const params = times
        ? {
            patientId: this.patentInfo.patientId,
            reservationDateLow: times[0],
            reservationDateHigh: times[1],
          }
        : { patientId: this.patentInfo.patientId }
      this.listData = (await leaveList(params)).list
    },
    toInfo(id) {
      uni.navigateTo({
        url: '/pages/pages-doctor/myPatient/orderListInfo?tabs=2',
      })
    },
    oepnHide(index) {
      this.listData.list[index].isOpen = !this.listData.list[index].isOpen
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  margin: 28rpx 28rpx 0rpx 28rpx;
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

    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #b3b3b3;
    background: rgba(178, 178, 178, 0.15);
  }
  .primary {
    background: rgba(10, 178, 193, 0.15);
    color: #0ab2c1;
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
.open-hide {
  display: flex;
  justify-content: center;
  margin-top: 10rpx;
  color: #0ab2c1;
  padding: 20rpx 0;
  .icon {
  }
}
.leaves {
  border-top: 1px solid #f2f2f2;
  padding: 20rpx;
  color: #666;
  .item {
    margin-top: 5rpx;
  }
}
</style>
