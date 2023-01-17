<template>
  <view class="medical-cost">
    <view class="head">
      <view class="line"></view>
      <view class="title">费用总额：</view>
      <view class="price">¥ {{totalCost}}</view>
      <view class="num">共计 <span style="color:#f66666">{{' '+feeBox.length+' '}}</span> 条</view>
    </view>
    <view class="body" v-for="(one,fee) in feeBox" :key="fee">
      <view class="number">
        <view class="no">发票号：{{one.billId}}</view>
        <view class="nums" @click="OpenClose(one)">
          {{one.costDetail.length}}项
            <image 
            :src="require('../../../../assets/right11@2x.png')" 
            :class="one.isOpen?'icon active':'icon'"
            ></image>
        </view>
      </view>
      <table cellspacing="0" :style="one.isOpen?'display:block':'display:none'">
          <thead>
            <tr>
              <td>检验项目</td>
              <td>费用名称</td>
              <td>金额</td>
              <td>费用类别</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,price) in one.costDetail" :key="price">
              <td>{{item.receiptNo}}</td>
              <td>{{item.feeSortName}}</td>
              <td>¥ {{item.feeAmount}}</td>
              <td>{{item.itemName}}</td>
            </tr>
          </tbody>
      </table>
      <view class="price" style="margin-bottom:20rpx">
        <view class="left">金额：￥{{one.payAmount}}</view>
        <view class="right">自付金额：￥{{one.outAmount}}</view>
      </view>
      <view class="price">医保金额：￥{{one.inAmount}}</view>
    </view>
  </view>
</template>

<script>
import { costListInfo } from "../../../api/index"
  export default {
    props:{
      ehrId:{
        type:String
      }
    },
    data(){
      return{
        feeBox:[],
        totalCost:0,
      }
    },
    methods:{
      async getCostListInfo(){
        let res = await costListInfo({
          ehrId:this.ehrId
        })
        this.feeBox=res.costList
        this.totalCost=res.totalCost
      },
      OpenClose(item){
       this.$set(item,'isOpen',!item.isOpen)
      }
    },
    mounted(){
      this.getCostListInfo()
    }
  }
</script>

<style lang="scss" scoped>
.medical-cost{
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
    .price{
      flex: 1;
      font-size: 30rpx;
      color: #0AB2C1;
    }
    .num{
      width: 150rpx;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .body{
    width: 100%;
    background: #FFFFFF;
    border-radius: 10rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-bottom: 10rpx;
    .number{
      display: flex;
      align-items: center;
      font-weight: 500;
      margin-bottom: 20rpx;
      .no{
        width: 75%;
        font-size: 26rpx;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .nums{
        position: relative;
        width: 25%;
        padding-right: 25rpx;
        text-align: right;
        box-sizing: border-box;
        font-size: 26rpx;
        color: #666666;
        .icon{
            position: absolute;
            width: 10rpx;
            height: 20rpx;
            top: 50%;
            right: 5rpx;
            transform: translate(0,-50%) rotate(90deg);
            transition: all 0.3s;
        }
        .active{
            transform: translate(0,-50%) rotate(-90deg);
        }
      }
    }
    table{
      width: 100%;
      border: 0.5rpx solid #E6E6E6;
      text-align: center;
      margin-bottom: 20rpx;
      overflow: hidden;
      transition: all 0.3s;
      thead{
        width: 100%;
        background: #F2F2F2;
        font-size: 20rpx;
        color: #666666;
      }
      tbody{
        width: 100%;
        font-size: 20rpx;
        color: #666666;
      }
      tr td{
        border: 0.5rpx solid #E6E6E6;
      }
      tr{
        display: flex;
      }
      td{
        width: 25%;
      }
    } 
    .price{
      display: flex;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 22rpx;
      color: #666666;
      .left{
        width: 40%;
        font-size: 22rpx;
      }
      .right{
        width: 60%;
        font-size: 22rpx;
        text-align: right;
      }
    }  
  }
}
</style>