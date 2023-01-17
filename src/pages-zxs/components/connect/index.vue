<template>
  <view class="connect-item">
    <view class="upper"></view>
    <view class="centre"></view>
    <view class="below"></view>
  </view>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.connect-item{
    position: relative;
     width: 20rpx;
     z-index: 1;

}
.upper {
  width: 20rpx;
  height: 20rpx;
  background: #4551d8;
  border-radius: 10rpx;
}
.centre {
  position: absolute;
  width: 12rpx;
  height: 126rpx;
  background: #e1a422;
  border-radius: 6rpx;
  top: 10rpx;
  left: 4rpx;
}
.below {
  margin-top: 106rpx;
  width: 20rpx;
  height: 20rpx;
  background: #4551d8;
  border-radius: 10rpx;
}
</style>