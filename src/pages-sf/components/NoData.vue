<template>
  <view class="noneData" :style="styles">
    <image :src="imgUrl" alt="" />
    <text>暂无数据</text>
  </view>

</template>
<script>
  export default {
    name: 'NoData',
    props: {
      imgUrl: {
        type: String,
        default: require('@/assets/nodata.png')
      },
      styles:String
    }
  }
</script>
<style lang="scss" scoped>
  .noneData {
    width: 221rpx;
    height: 203rpx;
    margin: 200rpx auto;
    text-align: center;
    text{
      font-size: 28rpx;
      color: #999;
      margin-top: 10rpx;

    }
    image {
      width: 100%;
      height: 100%;
    }
  }
</style>
