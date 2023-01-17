<template>
  <view class="zy-nursing">
    <view class="head">
      <view class="line"></view>
      <view class="title">护理</view>
    </view>
    <view class="nursing-item" v-for="(item,nursing) in nursBox" :key="nursing">
      <view class="title">{{item.deptName}}</view>
      <image 
        :src="require('../../../../assets/right11@2x.png')"
        @click="openDeatil"
        ></image>
    </view>
    <!-- <view :class="isShow?'show':'hidden'" @click="isShow=false">
      123
    </view> -->
  </view>
</template>

<script>
  import { nurseDatao } from '../../../api/index'
  export default {
    props:{
      mpiId:{
        type:String
      },
      ehrId:{
        type:String
      }
    },
    data(){
      return{
        nursBox:[]
      }
    },
    methods:{
      openDeatil(){
        // this.isShow=true
        uni.navigateTo({
           url: '/pages-cdr/allDetailList/nursingDetail/index?mpiId='+this.mpiId+'&snoNo='+this.ehrId 
        })
      },
      async getNurseDatao(){
        let res = await nurseDatao({
          mpiId:this.mpiId,
          snoNo:this.ehrId,
          type:'ZY'
        })
        this.nursBox=res
      }
    },
    mounted(){
      this.getNurseDatao()
    }
  }
</script>

<style lang="scss" scoped>
.zy-nursing{
  width: 100%;
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
  }
  .nursing-item{
    display: flex;
    width: 100%;
    height: 80rpx;
    padding: 20rpx;
    align-items: center;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    .title{
      flex: 1;
      font-size: 26rpx;
      font-weight: 500;
      color: #333333;
    }
    image{
      width: 10rpx;
      height: 20rpx;
      padding-left: 20rpx;
    }
  }
  .show{
    position: absolute;
    width: 100%;
    height: 63vh;
    bottom: 0;
    right: 0;
    background: #fff;
    transform: translate(0,0);
    transition: all .3s;
    border-radius: 30rpx 30rpx 0 0;
    padding: 30rpx 30rpx 0;
    box-sizing: border-box;
    z-index: 99;
  }
  .hidden{
    position: absolute;
    width: 100%;
    height: 63vh;
    bottom: 0;
    right: 0;
    background: #fff;
    transform: translate(0,70vh);
    transition: all .3s;
  }
}
</style>