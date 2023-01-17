<template>
    <view class="collapse-item" :style="isOpen?'height:auto':'height:80rpx'">
      <view class="item-head">
        <view class="title">{{title}}</view>
        <view class="img" @click="isOpen=!isOpen">
          <image :src="require('@/assets/right11@2x.png')" :class="isOpen?'active':''"></image>
        </view>
        <view class="nums" v-if="nums>0">{{nums+''}}条</view>
      </view>
      <view class="item-body">
        <slot></slot>
      </view>
    </view>
</template>

<script>
  export default {
    props:{
      title:{
        type:String
      },
      nums:{
        type:Number||String
      },
    },
    data(){
      return{
        isOpen:false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collapse-item{
    width: 100%;
    background: #FFFFFF;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
    .item-head{
      position: relative;
      display: flex;
      align-items: center;
      padding: 20rpx;
      box-sizing: border-box;
      .title{
        font-size: 26rpx;
        font-weight: 500;
        color: #333333;
      }
      .img{
        flex: 1;
        text-align: right;
        image{
          width: 10rpx;
          height: 20rpx;
          transform: rotate(90deg);
          transition: all .3s;
          margin-right: 10rpx;
        }
        .active{
          transform: rotate(-90deg);
        }
      }
      .nums{
        position: absolute;
        top: 50%;
        right: 55rpx;
        transform: translate(0,-50%);
        font-size: 24rpx;
        font-weight: 500;
        color: #666666;
      }
    }
    .item-body{
      width: 100%;
      padding: 20rpx 20rpx 0;
      box-sizing: border-box;
      border-top: 1rpx solid #E6E6E6;
    }
  }
</style>