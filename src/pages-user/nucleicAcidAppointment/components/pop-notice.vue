<template>
  <uni-popup ref="notice">
    <view class="dialog-content">
      <view class="dialogTitle">{{ title }}</view>
      <scroll-view class="textBox" :scroll-y="true">
        <!-- <view class="title">{{ghNotice.title}}</view> -->
        <view class="text" v-html="content"> </view>
      </scroll-view>
      <view class="noticeBtn flex-center">
        <slot></slot>
        <view class="isok" @click="isOk">{{ btnText }}</view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    btnText: {
      type: String,
      default: '知道了',
    },
  },
  methods: {
    close() {
      this.$refs.notice.close()
    },
    open() {
      this.$refs.notice.open()
    },
    isOk() {
      this.close()
      this.$emit('isOk')
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-content {
  padding: 45rpx 0;
  width: 600rpx;
  background: #fff;
  border-radius: 30rpx;
  padding-bottom: 0;

  .dialogTitle {
    font-size: 32rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .textBox {
    font-size: 26rpx;
    line-height: 42rpx;
    color: #666;
    height: 600rpx;
    padding: 0 30rpx;
    box-sizing: border-box;

    .title {
      font-size: 28rpx;
      margin-bottom: 20rpx;
      color: #1a1a1a;
      margin-top: 40rpx;
    }

    .text {
      margin-bottom: 40rpx;
    }
  }

  .noticeBtn {
    width: 100%;
    height: 88rpx;
    border-top: 1rpx solid #e9eff4;
    line-height: 88rpx;
    .isok {
      text-align: center;
      color: $uni-color-primary;
      width: 50%;
    }
  }
}
</style>
