<template>
  <view class="checkup">
    <view class="head">
      <view class="line"></view>
        <view class="title">检查</view>
        <view class="num">共计<span style="color:#f66666">{{' '+examSnoBox.length+' '}}</span>条</view>
    </view>
    <view class="border" v-for="(one,sno) in examSnoBox" :key="sno">
    <view class="body" :style="one.isOpen?'height:auto':'height:280rpx'">
      <template v-if="one.checkUpList">
        <view style="margin-bottom:30rpx" v-for="(item,checkup) in one.checkUpList" :key="checkup">
          <view class="title">{{item.title||'-'}}</view>
          <view class="text">{{item.value||'-'}}</view>
        </view>
      </template>
      <template v-else>
          <view class="title">检查项目名称</view>
          <view class="text" style="margin-bottom:30rpx">{{one.itemCHName||'-'}}</view>
          <view class="title">检查时间</view>
          <view class="text" style="margin-bottom:30rpx">{{one.examDtime||'-'}}</view>
      </template>
    </view>
    <view class="button" @click="openDetail(one)">
        {{one.isOpen?'收起':'展开'}}
        <image 
          :src="require('../../../../assets/right11@2x.png')" 
          :class="one.isOpen?'icon active':'icon'"
        ></image>
    </view>
    </view> 
    </view>
</template>

<script>
  import { examSnoList,examDetailList } from '../../../api/index'
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
        examSnoBox:[]
      }
    },
    methods:{
      async geteExamSnoList(){
        let res = await examSnoList({
          mpiId: this.mpiId,
          ehrId: this.ehrId
        })
        this.examSnoBox=res
      },
      async getExamDetailList(item){
        let res = await examDetailList({
          mpiId: this.mpiId,
          ehrId: this.ehrId,
          examSno: item.examSno,
        })
        this.$set(item,'checkUpList',res.transBeanList)
      },
      openDetail(item){
        this.$set(item,'isOpen',!item.isOpen)
        if (item.isOpen) {
          this.getExamDetailList(item)
        }
      }
    },
    mounted(){
      this.geteExamSnoList()
    }
  }
</script>

<style lang="scss" scoped>
.checkup{
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
      .num{
        flex: 1;
        font-size: 24rpx;
        color: #666666;
        text-align: right;
      }
  }
  .border{
    width: 100%;
    background: #FFFFFF;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
  }
  .body{
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.3s;
    .title{
      width: 100%;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-bottom: 20rpx;
    }
    .text{
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
  }
  .button{
      position: relative;
      width: 100%;
      height: 60rpx;
      border-top: 1rpx solid #E6E6E6;
      background: #fff;
      border-radius: 0 0 10rpx 10rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #666666;
      text-align: center;
      line-height: 60rpx;
      .icon{
        position: absolute;
        width: 10rpx;
        height: 20rpx;
        top: 50%;
        transform: translate(10rpx,-50%) rotate(90deg);
        transition: all 0.3s;
      }
      .active{
        transform: translate(10rpx,-50%) rotate(-90deg);
        }
  }
}
</style>