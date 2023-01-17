<template>
  <uni-popup ref="pickerPop" type="bottom">
    <view class="pop-view">
      <view class="title">
        {{ title }}
        <view class="icon" @click="$refs.pickerPop.close()">
          <uni-icons :size="20" color="#e6e6e6" type="clear" />
        </view>
      </view>
      <slot />
      <view v-if="showSubmit" @click="pickerConfrim" class="confirm">确认</view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    pickerConfrim() {
      this.$emit('confrim')
      this.$refs.pickerPop.close()
    },
    open() {
      this.$refs.pickerPop.open()
    },
    close() {
      this.$refs.pickerPop.close()
    },
  },
}
</script>
<style lang="scss" scoped>
.pop-view {
  width: 100%;
  min-height: 700rpx;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .title {
    font-size: 32rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    .icon {
      position: absolute;
      top: 10rpx;
      height: 100%;
      right: 32rpx;
    }
  }
  .confirm {
    position: absolute;
    width: 100%;
    bottom: 0rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: $uni-color-primary;
    color: #fff;
  }
}
</style>
