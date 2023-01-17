<template functional>
<view class="box">
  <view class="_switch"></view>
</view>
</template>
<style lang="scss" scoped>
.box {
  width: 90rpx;
}
._switch {
  position: relative;
  width: 60rpx;
  height: 34rpx;
  border-radius: 40rpx;
  background-color: #ccc;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 34rpx;
    height: 100%;
    border-radius: 50%;
    background-color: #fff;
  }
}
</style>
