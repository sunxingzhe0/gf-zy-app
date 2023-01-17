<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="app-card">
      <view class="flex-between">
        <view class="flex-start-center">
          <view class="">
            <view class="cell-label">运单号</view>
            <view class="cell-label">物流公司</view>
          </view>
          <view class="ml-50">
            <view class="">{{ data.expressNo }}</view>
            <view class="">{{ data.corpName }}</view>
          </view>
        </view>
        <view class="">
          <button class="btn-tel" @click="call">联系公司</button>
        </view>
      </view>
    </view>
    <view
      class="flex-start-start"
      style="margin: 39rpx 0rpx 40rpx 100rpx;"
      v-if="data.receiverProvince"
    >
      <view class="collect">收</view>
      <view
        style="font-size:24rpx;
font-weight:bold;
color:rgba(134,134,134,1);"
        >{{ data.receiverProvince }} {{ data.receiverCity }}
        {{ data.receiverRegion }} {{ data.receiverDetailAddress }}</view
      >
    </view>
    <block v-for="(item, index) in tracesData" :key="index">
      <track-node
        :is-first="index === tracesData.length - 1"
        :is-newest="index === 0"
        :is-main-node="item.isMainNode"
        :node-data="item"
      ></track-node>
    </block>
  </view>
</template>

<script>
import { express } from '@/common/request/index.js'
export default {
  data() {
    return {
      id: '',
      data: {},
      tracesData: [
        {
          acceptStation: '物流轨迹内容1',
          createTime: '格式化后的时间',
          isMainNode: false,
        },
        {
          acceptStation: '物流轨迹内容2',
          createTime: '格式化后的时间',
          isMainNode: false,
        },
      ],
    }
  },
  onLoad(option) {
    if (option.id) {
      this.id = option.id
    }
    this.getLogisticsTrends()
  },
  methods: {
    async getLogisticsTrends() {
      //物流id
      const data = await express({
        id: this.id,
      })

      if (data) {
        this.data = data
        this.tracesData = data.nodeList.map(item => {
          return {
            acceptStation: item.context,
            createTime: item.ftime,
            isMainNode: false,
          }
        })
      }
    },
    call() {
      uni.makePhoneCall({
        phoneNumber: '023-67511695', //仅为示例
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.cell-label {
  color: #808080;
}

.btn-tel {
  width: 160rpx;
  height: 60rpx;
  line-height: 58rpx;
  border: 2rpx solid #ccc;
  border-radius: 30rpx;
  background-color: #fff;
  font-size: 24rpx;
  color: #666;

  &:after {
    border: none;
  }
}

.collect {
  width: 48rpx;
  height: 48rpx;
  background: rgba(205, 205, 205, 1);
  border-radius: 50%;

  font-size: 24rpx;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 48rpx;
  margin-right: 14rpx;
}
</style>
