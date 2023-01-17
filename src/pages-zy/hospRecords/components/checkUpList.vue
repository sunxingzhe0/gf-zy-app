<template>
  <view class="checkup">
    <view class="head">
      <view class="line"></view>
        <view class="title">检查</view>
        <view class="num">共计<span style="color:#f66666">{{' '+examSnoBox.length+' '}}</span>条</view>
    </view>
    <template v-if="examSnoBox.length>0">
    <view class="border" v-for="(one,sno) in examSnoBox" :key="sno">
    <view class="body" :style="one.isOpen?'max-height:6000rpx':'max-height:280rpx'">
      <view class="title">检查项目名称</view>
      <view class="text" style="margin-bottom:30rpx">{{one.inspectionName||'-'}}</view>
      <view class="title">检查部位</view>
      <view class="text" style="margin-bottom:30rpx">{{one.examPart||'-'}}</view>
      <view class="title">检查方法</view>
      <view class="text" style="margin-bottom:30rpx">{{one.inspectionMethod||'-'}}</view>
      <view class="title">检查医生</view>
      <view class="text" style="margin-bottom:30rpx">{{one.examDocName||'-'}}</view>
      <view class="title">检查时间</view>
      <view class="text" style="margin-bottom:30rpx">{{one.examDtime||'-'}}</view>
      <view class="title">检查科室</view>
      <view class="text" style="margin-bottom:30rpx">{{one.examDeptName||'-'}}</view>
      <view class="title">检查所见</view>
      <view class="text" style="margin-bottom:30rpx">{{one.examDesc||'-'}}</view>
      <view class="title">诊断意见</view>
      <view class="text" style="margin-bottom:30rpx">{{one.clinicDiag||'-'}}</view>
      <view class="title">报告医生</view>
      <view class="text" style="margin-bottom:30rpx">{{one.reportorName||'-'}}</view>
      <view class="title">报告时间</view>
      <view class="text" style="margin-bottom:30rpx">{{one.reportDtime||'-'}}</view>
      <view class="title">审核医生</view>
      <view class="text" style="margin-bottom:30rpx">{{one.auditorName||'-'}}</view>
      <view class="title">审核时间</view>
      <view class="text" style="margin-bottom:30rpx">{{one.auditDtime||'-'}}</view>
    </view>
    <view class="button" @click="openDetail(one)">
        {{one.isOpen?'收起':'展开'}}
        <image 
          :src="require('@/assets/right11@2x.png')" 
          :class="one.isOpen?'icon active':'icon'"
        ></image>
    </view>
    </view>
    </template>
    <no-data v-else></no-data>
    </view>
</template>

<script>
  import { examInfoList } from '../../api/hospitalCdr'
  import NoData from '../../components/NoData'
  export default {
  components: { NoData },
    props:{
      cardNo:{
        type:String
      },
      begin:{
        type:String
      },
      end:{
        type:String
      },
      times:{
        type:String
      }
    },
    data(){
      return{
        examSnoBox:[],
      }
    },
    methods:{
      async getExamInfoList(){
        uni.showLoading()
        let res = await examInfoList({
          cardNo:this.cardNo,
          beginDate:this.begin,
          endDate:this.end,
          times:this.times
        })
        this.examSnoBox=res
      uni.hideLoading()

      },
      openDetail(item){
        this.$set(item,'isOpen',!item.isOpen)
      }
    },
    mounted(){
      this.getExamInfoList()
    },
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
    transition: all 0.5s ease-in-out;
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
        transition: all 0.5s ease-in-out;
      }
      .active{
        transform: translate(10rpx,-50%) rotate(-90deg);
      }
  }
}
</style>