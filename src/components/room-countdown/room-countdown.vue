<template>
  <!-- 诊室自动关闭倒计时 -->
  <view
    id="countdown"
    class="countdown"
    @click="expansion"
    :animation="animationData"
  >
    <image
      class="icon"
      :class="{ left: showState == 'retract' }"
      :src="require('@/assets/zhankaihui@2x.png')"
      mode="aspectFit"
    ></image>
    <text style="margin-left: 16rpx;">
      {{ status == 'IN_TREAT' ? '离服务结束' : '离诊室自动关闭' }}还剩</text
    >
    <text style="margin-left: 12rpx;color: #e45b5b;">{{ countDown }}</text>
  </view>
</template>

<script>
export default {
  props: {
    countDown: String,
    status: String,
  },
  data() {
    return {
      animationData: {},
      showState: 'expand',
    }
  },
  methods: {
    expansion() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('#countdown')
        .boundingClientRect(({ width }) => {
          const animation = uni.createAnimation({
            duration: 200,
          })

          if (this.showState == 'expand') {
            animation.translateX(width - 26).step()
            this.showState = 'retract'
          } else {
            animation.translateX(0).step()
            this.showState = 'expand'
          }

          this.animationData = animation.export()
        })
        .exec()
    },
  },
}
</script>

<style lang="scss">
.countdown {
  position: fixed;
  z-index: 3;
  right: 0;
  top: 160rpx;
  width: 410rpx;
  padding: 8rpx 20rpx;
  border-top-left-radius: 36rpx;
  border-bottom-left-radius: 36rpx;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
  color: #666;

  .icon {
    width: 28rpx;
    height: 24rpx;
    transform: rotate(-90deg);

    &.left {
      transform: rotate(90deg);
    }
  }
}
</style>
