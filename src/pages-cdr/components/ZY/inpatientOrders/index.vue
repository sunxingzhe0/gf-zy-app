<template>
  <view class="inpatient-orders">
    <view class="head">
      <view class="line"></view>
      <view class="title">住院医嘱</view>
      <view class="num">共计<span style="color:#f66666">{{' '+list.length+' '}}</span>条</view>
    </view>
    <view class="body" v-for="(item,zy) in list" :key="zy">
      <view class="title">{{item.index}}.{{item.drugFormName||'-'}}(规格:{{orderStd||'-'}})</view>
      <view class="box">
        <view class="left">{{item.orderTypeName}}</view>
        <view class="right">{{item.orderClassName}}</view>
      </view>
      <view class="use">{{item.orderUsageName||'-'}} {{item.drugFreqCn||'-'}}，{{item.singleDose||'-'}}/次，共{{item.totalDose||'-'}}</view>
      <view class="remark">备注：{{remark||'-'}}</view>
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
.inpatient-orders{
  width:100%;
  .head{
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .line{
      width: 2rpx;
      height: 30rpx;
      background: #0AB2C1;
      margin-right: 10rpx;
    }
    .title{
      width: 150rpx;
      font-size: 30rpx;
      color: #333333;
    }
    .num{
      flex: 1;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .body{
    width: 100%;
    padding: 20rpx;
    background: #FFFFFF;
    box-sizing: border-box;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    .title{
      margin-bottom: 20rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #333333;
      line-height: 24rpx;
    }
    .box{
      display: flex;
      width: 100%;
      text-align: center;
      font-weight: 500;
      margin-bottom: 20rpx;
      .left{
        height: 24rpx;
        background: rgba(0, 113, 227, 0.2);
        font-size: 22rpx;
        color: #0071E3;
        line-height: 24rpx;
        margin-right: 5rpx;
      }
      .right{
        height: 24rpx;
        background: rgba(10, 178, 193, 0.2);
        font-size: 22rpx;
        color: #0AB2C1;
        line-height: 24rpx;
      }
    }
    .use{
      width: 100%;
      font-size: 20rpx;
      color: #666;
      margin-bottom: 20rpx;
    }
    .remark{
      width: 100%;
      font-size: 20rpx;
      font-weight: 500;
      color: #333333;
    }
  }
}
</style>