<template>
  <view class="empty-doctor">
    <image class="empty-doctor-img" :src="require('@/assets/no-doctor.png')"></image>
    <view class="empty-doctor-text">暂无医生当班</view>
  </view>
</template>

<style lang="scss" scoped>
.empty-doctor {
  width: 100%;
  display: flex;
  overflow: hidden;
  margin-top: 80rpx;
  align-items: center;
  flex-direction: column;
  .empty-doctor-img {
    width: 220rpx;
    height: 202rpx;
  }
  .empty-doctor-text {
    height: 25rpx;
    color: #999999;
    font-size: 26rpx;
    font-weight: 500;
    margin-top: 20rpx;
    line-height: 25rpx;
    font-family: PingFang SC;
  }
}
</style>
