<template>
  <view class="wrap">
    <view class="title">{{info.title}}</view>
    <view class="content" v-html="info.content"></view>
  </view>
</template>

<script>
  import {getTjIns} from '../api/physical.js'
  export default{
    data(){
      return {
        info:{}
      }
    },
    onLoad() {
      this.getTjInsInfo()
    },
    methods:{
      //获取须知
      async getTjInsInfo(){
        this.info =  await getTjIns({type:1})
      }

    }
  }
</script>

<style lang="scss">
  .wrap{
    padding: 30rpx;
    background: #fff;
    .title{
      font-size: 32rpx;
      color: #333;
      text-align: center;
    }
    .content{
      font-size: 26rpx;
      color: #666;
      margin-top: 20rpx;
    }
  }
</style>
