<template>
    <view class="prescription">
      <view class="head">
          <view class="line"></view>
          <view class="title">门诊处方</view>
          <view class="num">共计<span style="color:#f66666">{{' '+lists.length+' '}}</span>条</view>
      </view>
      <!-- 外部 -->
      <view class="body" v-for="(one,body) in lists" :key="body">
          <view class="num">
            <view class="no">处方号：Rx1({{one.rpId}})</view>
            <view class="price">¥ {{one.sum||'-'}}</view>
          </view>
          <view class="doctor">数量：{{one.item.length}}
             <!-- | 医生：刘医生 副主任医师 -->
          </view>
          <!-- <view class="time">2018-04-07 12:01:48</view> -->
          <!-- <view class="result">诊断：诊断内容</view> -->
          <!-- <view class="names">药房名称</view> -->
          <!-- 内部 -->
          <view class="collspace" :style="one.isOpen?'height:auto':'height:210rpx'">
            <view class="section" v-for="(two,id) in one.item" :key="id">
              <view class="title">{{id+1}}.{{two.drugName}}(规格：{{two.drugStd}})</view>
              <view class="center">
                <view class="price">¥ {{two.amount||'-'}}</view>
                <view class="type">医保：{{two.feeSortName||'-'}}</view>
              </view>
              <view class="use">
                {{two.drugUsageName}}，{{two.frequency}}
                {{two.doseOnetime}}
                {{two.days}}天
                {{two.nums}}
                <!-- ￥8.9/盒 -->
              </view>
              <view class="time">开立时间：{{two.rpDtime||'-'}}</view>
              <view class="tips">备注：{{two.remark||'无'}}</view>
            </view>
          </view>
          <view class="button" @click="OpenClose(one)">
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
  export default {
    props:{
      list:{
        type:Array
      },
      rpId:{
        type:String
      }
    },
    data(){
      return{
        lists:[],
      }
    },
    methods:{
      OpenClose(item){
        this.$set(item,'isOpen',!item.isOpen)
      },
      changeState(){
        this.$nextTick(()=>{
          this.lists.forEach(v => {
            if (v.rpId==this.rpId) {
              this.$set(v,'isOpen',true)
            }
          });
        })
      },
      prescSum(){
        this.$nextTick(()=>{
          this.lists.forEach(l=>{
            let sum=0
            l.item.forEach(v=>{
              sum+=v.amount-0
            })
            this.$set(l,'sum',sum)
          })
        })
      }
    },
    created(){
      this.lists=this.list
    },
    mounted(){
      this.changeState()
      this.prescSum()
    },
    watch:{
      list(){
        this.lists=this.list
        this.changeState()
        this.prescSum()
      },
    }
  }
</script>

<style lang="scss" scoped>
.prescription{
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
      .body{
        width: 100%;
        padding: 20rpx;
        margin-bottom: 10rpx;
        box-sizing: border-box;
        border-radius: 10rpx;
        background: #fff;
        .num{
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;
          .no{
            width: 75%;
            font-size: 28rpx;
            color: #333333;
          }
          .price{
            width: 25%;
            font-size: 24rpx;
            color: #0AB2C1;
            text-align: right;
          }
        }
        .doctor{
          margin-bottom: 20rpx;
          font-size: 24rpx;
          line-height: 24rpx;
          color: #666666;
        }
        .time,.names{
          font-size: 24rpx;
          color: #666666;
          line-height: 24rpx;
          margin-bottom: 20rpx;
        }
        .result{
          font-size: 24rpx;
          color: #666666;
          margin-bottom: 20rpx;
        }
        .collspace{
          position: relative;
          overflow: hidden;
          background: #F2F2F2;
          transition: all .3s;
          .section{
            padding: 20rpx;
            box-sizing: border-box;
            font-family: PingFang SC;
            font-weight: 500;
            .title{
              width: 100%;
              font-size: 24rpx;
              line-height: 24rpx;
              color: #333333;
              margin-bottom: 20rpx;
            }
            .center{
              display: flex;
              width: 100%;
              margin-bottom: 20rpx;
              align-items: center;
              font-size: 24rpx;
              .price,.type{
                width: 50%;
                color: #0AB2C1;
              }
              .type{
                color: #666666;
                text-align: right;
              }
            }
            .use,.tips{
              width: 100%;
              margin-bottom: 20rpx;
              font-size: 22rpx;
              color: #666666;
              line-height: 28rpx;
            }
            .tips{
              margin-bottom: 0;
            }
            .time{
              font-size: 24rpx;
              color: #666666;
              line-height: 24rpx;
              margin-bottom: 20rpx;
            }
          }
        }
        .button{
          position: relative;
          width: 100%;
          height: 60rpx;
          border-top: 1rpx solid #E6E6E6;
          background: #F2F2F2;
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
    }
</style>