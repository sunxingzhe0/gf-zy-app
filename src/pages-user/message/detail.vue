<template>
  <view class="container">
    <view class="text-center title">{{ info.title }}</view>
    <view class="text-center time">{{ info.createtime }}</view>
    <view class="content">{{ info.content }}</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      info: {},
    }
  },
  onLoad(options) {
    this.info = options
  },
}
</script>
<style>
page {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.container {
  padding: 0 20rpx;
}
.text-center {
  text-align: center;
}
.title {
  font-size: 34rpx;
  color: #1a1a1a;
}
.time {
  font-size: 24rpx;
  color: #666;
}
.content {
  font-size: 26rpx;
  color: #666;
}
</style>
