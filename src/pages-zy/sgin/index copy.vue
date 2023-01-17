<template>
  <view class="mini-page">
    <view class="bg-color">
      <view class="content">
        <image
          :src="FILE_URL_BUILT_IN('sign-success.png')"
          class="img-box"
        ></image>
        <view class="status-text">签到成功</view>
        <view class="btn" @click="back">知道了</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    back() {
      uni.navigateBack()
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  padding: 15px;
  display: flex;
  justify-content: center;
  .bg-color {
    width: 345px;
    height: 183px;
    background: #ffffff;
    border-radius: 10px;
    margin-top: 100px;
    position: relative;
    .content {
      width: 100%;
      position: absolute;
      left: 0;
      top: -50px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .img-box {
        width: 122px;
        height: 106px;
      }
      .status-text {
        font-size: 17px;
        color: #0ab2c1;
        margin: 10px 0 65px 0;
      }
      .btn {
        width: 220px;
        height: 44px;
        color: #fff;
        background: #0ab2c1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        box-shadow: 0px 9px 10px 0px rgba(2, 125, 136, 0.24);
      }
    }
  }
}
</style>
