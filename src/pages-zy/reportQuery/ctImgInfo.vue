<template>
  <view class="wrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="title">这是图片的名称，30个字全部显示完整，可以多行显示如此换行</view>
    <image style="width: 100%;" mode="widthFix" src="https://img.yzcdn.cn/vant/cat.jpeg" />
  </view>
</template>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  background: #fff;
  padding: 30rpx;
  .title {
    line-height: 48rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
  }
}
</style>
