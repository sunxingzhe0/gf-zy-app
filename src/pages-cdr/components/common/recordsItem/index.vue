<template>
  <view style="width:100%;heigth:100%">
      <view class="records-item-box" v-for="(item,box) in list" :key="box">
        <view class="child">
          <view class="top">{{item.tagName}}</view>
          <view class="bottom">
            <view class="text">{{item.relValue}}</view>
            <template v-if="button">
              <view class="button" @click="change(item)">查看</view>
            </template>
          </view>
        <view class="point"></view>
        </view>
        <view class="line"></view>
      </view>
  </view>
</template>

<script>
  export default {
    props:{
      list:{
        type:Array
      },
      button:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return{

      }
    },
    methods:{
      change(item){
        this.$emit('change',item)
      }
    }
  }
</script>

<style lang="scss" scoped>
.records-item-box{
  position: relative;
  width: 100%;
  padding-left: 40rpx;
  box-sizing: border-box;
  .child{
    position: relative;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    background: #F2F2F2;
    border-radius: 2rpx 10rpx 10rpx;
    margin: 8rpx 0 20rpx;
    .top{
      width: 100%;
      font-size: 20rpx;
      font-weight: 500;
      line-height: 20rpx;
      color: #666666;
      margin-bottom: 20rpx;
    }
    .bottom{
      display: flex;
      width: 100%;
      .text{
        width: 85%;
        font-size: 26rpx;
        font-weight: 500;
        color: #333333;
        line-height: 26rpx;
      }
      .button{
        width: 15%;
        font-size: 26rpx;
        font-weight: 500;
        color: #0AB2C1;
        line-height: 26rpx;
      }
    }
    .point{
      position: absolute;
      width: 16rpx;
      height: 16rpx;
      top: -10px;
      left: -17px;
      background: #FFFFFF;
      border: 2rpx solid #0AB2C1;
      border-radius: 50%;
      z-index: 1;
    }
  }
  .line{
    position: absolute;
    width: 2rpx;
    height: 100%;
    top: 0;
    left: 7px;
    background: #CCCCCC;
  }
}
</style>