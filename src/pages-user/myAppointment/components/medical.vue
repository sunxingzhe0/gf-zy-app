<template>
  <view>
    <view
      class="menzhenItemBox box-shadow"
      v-if="type == 0"
      v-for="(item, index) in list"
      :key="index"
    >
      <view class="contentBox flex-start-start">
        <view class="headerImg">
          <default-img
            :url="require('@/assets/user/doc-3.png') || ''"
          ></default-img>
        </view>
        <view class="content flex_1">
          <view class="name flex-between">
            <view>{{ item.doctorName }}</view>
            <text>{{
              item.orderState == 0
                ? '已支付'
                : item.orderState == 1
                ? '已退款'
                : '-'
            }}</text>
          </view>
          <view class="flex-between">
            <view class="doctor">{{ item.doctorTitle }}</view>
            <view class="doctor"> 内科5诊室（2楼）</view>
          </view>
          <view class="dateBox flex-between">
            <view class="doctor">{{ item.appointmentDate }}</view>
            <view class="icon" v-if="item.today">当日</view>
          </view>
          <view class="doctor"
            >诊查费：¥{{ parseFloat(item.fee).toFixed(2) }}</view
          >
          <view
            class="cancelBtn"
            v-if="item.cancel"
            @click.stop="showPop(item.recordId)"
            >取消</view
          >
        </view>
      </view>
    </view>
    <view
      class="menzhenItemBox box-shadow"
      v-if="type == 1"
      v-for="(item, index) in list"
      :key="index"
      @click="
        goto(
          `/pages-zy/myAppointment/detail?orderId=${item.orderId}&recordId=${item.recordId}`,
        )
      "
    >
      <view class="contentBox">
        <view class="name flex-between">
          <view style="width: 400rpx;">{{ item.packageName }}</view>
          <text>{{
            item.orderState == 0
              ? '已退款'
              : item.orderState == 1
              ? '已支付'
              : '-'
          }}</text>
        </view>
        <view class="flex-between">
          <view class="doctor">{{ item.patientName }} | {{ item.phone }}</view>
          <view class="doctor">¥ {{ parseFloat(item.fee).toFixed(2) }}</view>
        </view>
        <view class="dateBox flex-between">
          <view class="date">{{ item.appointmentDate }}</view>
          <view class="icon" v-if="item.today">当日</view>
          <view class="icon timeOut" v-if="item.outTime">超时</view>
        </view>
        <view
          class="cancelBtn"
          v-if="item.cancel && item.orderState == 1"
          @click.stop="showPop(item.recordId)"
          >取消预约</view
        >
        <view
          class="cancelBtn default"
          v-if="item.hasReport"
          @click.stop="
            goto(
              `/pages-zy/physical/report/detail?checkupNo=${item.reportNo}&patientId=${patientInfo.memberId}`,
            )
          "
          >体检报告</view
        >
      </view>
    </view>
    <NoData v-if="list.length == 0"></NoData>
  </view>
</template>

<script>
import NoData from '../../components/NoData'
import { myAppointment, orderRefund } from '../../api/user.js'
export default {
  props: {
    type: String, //0,预约挂号，1.体检预约
    patientInfo: Object,
    rangeData: Array,
  },
  components: {
    NoData,
  },
  data() {
    return {
      // 门诊数据列表
      list: [],
      currentNum: 1,
      pageSize: 10,
      pages: 1,
    }
  },
  watch: {
    rangeData() {
      this.init()
    },
    type() {
      this.init()
    },
  },
  methods: {
    //初始化数据
    init() {
      this.list = []
      this.currentNum = 1
      this.pages = 1
      this.getList()
    },
    async getList() {
      let list = await myAppointment({
        patientId: this.patientInfo.memberId,
        // startDate: this.rangeData[0] ? this.rangeData[0] : '',
        // endDate: this.rangeData[1] ? this.rangeData[1] : '',
        type: this.type,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      this.pages = list.pages
      this.list = this.list.concat(list.list || [])
    },
    getPageMore() {
      if (this.currentNum < this.pages) {
        this.currentNum = this.currentNum + 1
        this.getList()
      }
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      })
    },
    // 展示温馨提示
    showPop(recordId) {
      this.recordId = recordId
      uni.showModal({
        title: '提示',
        content: '是否确认取消该预约？',
        success: res => {
          if (res.confirm) {
            this.refund()
          }
        },
      })
    },
    // 取消预约
    async refund() {
      let res = await orderRefund({
        orderNo: this.recordId,
      })
      if (res) {
        uni.showToast({
          title: '取消成功',
        })
        this.init()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.menzhenItemBox {
  padding: 30rpx;
  background: #fff;
  overflow: hidden;
  margin: 20rpx auto 0;

  .dateBox {
    .date {
      font-size: 26rpx;
      color: #666;
    }

    .icon {
      width: 54rpx;
      line-height: 30rpx;
      background: #ea9d38;
      border-radius: 4rpx;
      text-align: center;
      font-size: 20rpx;
      color: #fff;

      &.timeOut {
        background: #f74a4a;
      }
    }
  }

  .contentBox {
    .headerImg {
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
      overflow: hidden;
    }

    .content {
      padding-left: 15rpx;
    }

    .name {
      view {
        font-size: 30rpx;
        color: #333333;
        font-weight: 600;
      }

      text {
        color: $uni-color-primary;
        font-size: 24rpx;
      }
    }

    .doctor {
      color: #666;
      font-size: 26rpx;
      font-weight: 400;
    }

    .cancelBtn {
      width: 152rpx;
      height: 60rpx;
      border: 1px solid #999999;
      border-radius: 30rpx;
      text-align: center;
      line-height: 58rpx;
      font-size: 26rpx;
      color: #333;
      margin-top: 20rpx;
      float: right;

      &.default {
        border-color: $uni-color-primary;
        color: $uni-color-primary;
      }

      &.disabled {
        border-color: #ccc;
        color: #999;
      }
    }
  }
}
</style>
