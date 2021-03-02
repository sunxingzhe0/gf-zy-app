<template>
  <swiper class="swiper">
    <swiper-item v-for="_ in chatToolsLength" :key="_">
      <view class="flex-start-start wrapper">
        <template v-for="(item, index) in chatTools">
          <view
            class="bottom-bar__tool_item"
            v-if="index >= _ * 8"
            :key="item.event"
            :data-event="item.event"
            @click="toolListener"
          >
            <view class="app-card">
              <image
                class="tool-icon"
                :src="item.image"
                mode="aspectFit"
              ></image>
            </view>
            <view class="tool-title">{{ item.title }}</view>
          </view>
        </template>
      </view>
    </swiper-item>
  </swiper>
</template>

<script>
const toolArray = [
  //聊天工具栏
  {
    image: require('@/assets/xiangce@2x.png'),
    title: '相册',
    event: 'chooseImage',
  },
  {
    image: require('@/assets/paishe@2x.png'),
    title: '拍照',
    event: 'camera',
  },
  {
    image: require('@/assets/xingzhuang@2x.png'),
    title: '常用语',
    event: 'commonWordsFunc',
  },
  {
    image: require('@/assets/zhenduan@2x.png'),
    title: '诊断',
    event: 'diagnosis',
  },
  {
    image: require('@/assets/bingli@2x.png'),
    title: '病历',
    event: 'medical',
  },
  {
    image: require('@/assets/chufang@2x.png'),
    title: '处方',
    event: 'prescription',
  },
  {
    image: require('@/assets/chuzhi@2x.png'),
    title: '处置',
    event: 'treatment',
  },
  {
    image: require('@/assets/zhenjianyuyue@2x.png'),
    title: '诊间预约',
    event: 'appointment',
  },
]
export default {
  props: {
    order: Object,
  },
  data() {
    return {
      chatTools: [],
    }
  },
  computed: {
    chatToolsLength() {
      return (
        parseInt(this.chatTools.length / 8) +
        (this.chatTools.length % 8 > 0 ? 1 : 0)
      )
    },
  },
  watch: {
    'order.roomId': {
      handler() {
        this.chatTools = [...toolArray]

        if (this.order.bizType == 'CONSULT') {
          this.chatTools.splice(3, 3)
        }
        if (
          !this.chatTools.filter(item => item.event == 'video').length &&
          this.order.wayType == 'VIDEO' &&
          ['APPOINTMENT', 'WAIT_TREAT', 'IN_TREAT'].includes(this.order.status)
        ) {
          this.chatTools.unshift({
            image: require('@/assets/shipinliaotian@2x.png'),
            title: '视频',
            event: 'video',
          })
        } else if (
          this.order.status == 'FINISH' &&
          this.chatTools.filter(item =>
            ['deal', 'appointment'].includes(item.event),
          ).length == 2
        ) {
          this.chatTools.splice(-2)
        }
      },
    },
  },
  methods: {
    toolListener(e) {
      this.$emit('event', e.currentTarget.dataset.event)
    },
  },
}
</script>

<style lang="scss" scoped>
.swiper {
  height: 350rpx;
}
.wrapper {
  height: 180rpx;
  flex-wrap: wrap;
  padding-left: 60rpx;
}
.bottom-bar__tool_item {
  margin-top: 20rpx;
  margin-right: 70rpx;
}

.app-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60rpx;
  height: 60rpx;
}

.tool-icon {
  width: 44rpx;
  height: 44rpx;
}

.tool-title {
  margin-top: 8rpx;
  font-size: 24rpx;
  text-align: center;
  color: #666;
}
</style>
