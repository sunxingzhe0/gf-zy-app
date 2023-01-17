<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="app-card">
      <view class="title">患者病历</view>
      <view class="flex-start-start mt-20">
        <view class="user-title">病历编号</view>
        <view class="content">{{ data.diseId }}</view>
      </view>
      <view class="flex-start-start mt-20">
        <view class="user-title">健康卡</view>
        <view class="content">{{ data.medicalName }}</view>
      </view>
      <view class="flex-start-start mt-20">
        <view class="user-title">诊疗类型</view>
        <view class="content">{{ data.medicalType }}</view>
      </view>
      <view class="flex-start-start mt-20">
        <view class="user-title">就诊时间</view>
        <view class="content">{{ data.medicalDate }}</view>
      </view>
    </view>

    <view class="app-card" v-for="item in dataList" :key="item.key">
      <view class="title">{{ item.title }}</view>
      <view class="content">{{ item.content }}</view>
    </view>
  </view>
</template>

<script>
import { findDiseaseByOrderId } from '@/common/request/index.js'
export default {
  data() {
    return {
      data: {},
      dataList: [
        // {
        //   key: 'mainSuit',
        //   title: '主诉'
        // },
        // {
        //   key: 'nowDisease',
        //   title: '现病史'
        // },
        // {
        //   key: 'hisDisease',
        //   title: '既往史'
        // },
        // {
        //   key: 'phyCheck',
        //   title: '体格检查'
        // },
        // {
        //   key: 'supCheck',
        //   title: '辅助检查'
        // },
        // {
        //   key: 'diagnosis',
        //   title: '诊断'
        // },
        // {
        //   key: 'dealIdea',
        //   title: '处理意见'
        // },
        {
          key: 'seeWay',
          title: '就诊方式',
        },
        {
          key: 'illness',
          title: '病情',
        },
        {
          key: 'supCheck',
          title: '辅助检查',
        },
        {
          key: 'diagnosis',
          title: '初次诊断',
        },
        {
          key: 'dealIdea',
          title: '处理意见',
        },
      ],
    }
  },
  onLoad(options) {
    const params = {
      orderId: options.orderId,
    }
    this.findDisease(params)
  },
  methods: {
    async findDisease(params) {
      const data = await findDiseaseByOrderId(params)

      this.data = data
      this.dataList = this.dataList.map(item =>
        Object.assign(item, {
          content: data[item.key],
        }),
      )
    },
  },
}
</script>

<style scoped lang="scss">
.app-card {
  margin: 20rpx;
  box-sizing: border-box;
}
.title {
  font-size: 30rpx;
  color: rgba(102, 102, 102, 1);
}
.content {
  font-size: 26rpx;
  color: #1a1a1a;
}
.user-title {
  width: 150rpx;
  font-size: 26rpx;
  color: rgba(102, 102, 102, 1);
}
</style>
