<template>
    <view class="diagonsis-view">
    <view class="header">
      <view class="line"></view>
      <view class="title">诊断</view>
      <view class="other">数量：{{list.length}}</view>
    </view>
      <view class="body" v-for="(item,zd) in list" :key="zd">
        <view class="title">
          <span>【{{item.dataType}}】</span>
          <span>【{{item.diagType}}】</span>
          <view class="main" v-if="item.diagSerialNo==1">主</view>
        </view>
        <view class="text">
          {{item.diagName}} | {{item.outComeName}} | {{item.doctorName}} | {{item.deptName}}
        </view>
        <view class="times">{{item.diagDtime}}</view>
    </view>
  </view>
</template>

<script>
  export default {
    props:{
      list:{
        type:Array
      }
    },
  }
</script>

<style lang="scss" scoped>
.diagonsis-view{
    width: 100%;
    .header{
      display: flex;
      width: 100%;
      align-items: center;
      margin-bottom: 20rpx;
      .line{
        width: 2rpx;
        height: 30rpx;
        background: #0AB2C1;
        margin-right: 10rpx;
      }
      .title{
        flex: 1;
        font-size: 30rpx;
        color: #333333;
      }
      .other{
        width: 130rpx;
        font-size: 24rpx;
        color: #666666;
        text-align: right;
      }
    }
    .body{
      width: 100%;
      padding: 30rpx;
      background: #FFFFFF;
      box-sizing: border-box;
      border-radius: 10rpx;
      margin-bottom: 10rpx;
      .title{
        position: relative;
        width: 100%;
        height: 30rpx;
        font-size: 30rpx;
        line-height: 30rpx;
        color: #333333;
        .main{
          position: absolute;
          top: 0;
          right: 0;
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          background: rgba(10, 178, 193, 0.2);
          text-align: center;
          line-height: 30rpx;
          font-size: 20rpx;
          color: #0AB2C1;
        }
      }
      .text,.times{
        width: 100%;
        font-size: 24rpx;
        color: #666666;
      }
      .text{
        margin: 10rpx 0;
      }
    }
  }
</style>