<template>
  <view class="exam-detail">
    <view class="project">
      <view class="title">检查项目</view>
      <view class="names">{{transList[0].value||'-'}}</view>
    </view>
    <view class="patient-msg">
      <view class="head">
        <view class="line"></view>
        <view class="title">诊断报告</view>
      </view>
      <view class="msg-item">
        <view class="left">报告时间</view>
        <view class="right">{{transList[11].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">报告医生</view>
        <view class="right">{{transList[10].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">检查描述</view>
          <view class="right" @click="isOpenOne=!isOpenOne">
            <template v-if="transList[8].value">
              <image 
                :src="require('../../../assets/right11@2x.png')"
                :class="isOpenOne?'icon active':'icon'"
              ></image>
            </template>
            <template v-else>-</template>
          </view>
      </view>
      <template v-if="transList[8].value">
          <view class="bottom" v-if="isOpenOne">
            {{transList[8].value}}
          </view>
        </template>
      <view class="msg-item">
        <view class="left">报告诊断</view>
        <view class="right" @click="isOpenTwo=!isOpenTwo">
          <template v-if="transList[9].value">
            <image 
              :src="require('../../../assets/right11@2x.png')"
              :class="isOpenTwo?'icon active':'icon'"
            ></image>
          </template>
          <template v-else>-</template>
        </view>
      </view>
      <template v-if="transList[9].value">
          <view class="bottom" v-if="isOpenTwo">
            {{transList[9].value}}
          </view>
      </template>
    </view>
    <!-- <view class="time-name">
      <view class="head">
        <view class="line"></view>
        <view class="title">检查影像</view>
      </view>
      <view class="item-box">
        <view class="titles">CT影像</view>
        <view class="msg">
          0张
          <image :src="require('../../../assets/right11@2x.png')"></image>
        </view>
      </view>
    </view> -->
    <view class="patient-msg">
      <view class="head">
        <view class="line"></view>
        <view class="title">检查信息</view>
      </view>
      <view class="msg-item">
        <view class="left">患者姓名</view>
        <view class="right">{{patientInfo.name||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">性别</view>
        <view class="right">{{patientInfo.gender||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">年龄</view>
        <view class="right">{{patientInfo.age||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left" style="width:20%">检查号</view>
        <view class="right" style="width:80%">{{examSno}}</view>
      </view>
      <view class="msg-item">
        <view class="left">检查时间</view>
        <view class="right">{{transList[4].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">设备类型</view>
        <view class="right">{{transList[15].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">检查科室</view>
        <view class="right">{{transList[5].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">检查医生</view>
        <view class="right">{{transList[3].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">送检科室</view>
        <view class="right">{{transList[7].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">送检医院</view>
        <view class="right">{{transList[6].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">审核医生</view>
        <view class="right">{{transList[12].value||'-'}}</view>
      </view>
      <view class="msg-item">
        <view class="left">审核时间</view>
        <view class="right">{{transList[13].value||'-'}}</view>
      </view>
      <!-- <view class="msg-item">
        <view class="left">病人主诉</view>
        <view class="right">头晕、摔倒、右膝疼，一周</view>
      </view>
      <view class="msg-item">
        <view class="left">临床诊断</view>
        <view class="right">晕厥，脑出血</view>
      </view> -->
    </view>
  </view>
</template>

<script>
import { examDetailList,personInfo } from '../../api/index'
  export default {
    data(){
      return{
        isOpenOne:false,
        isOpenTwo:false,
        // examSno:'5307204_5307203_201904220002',
        // mpiId:'131',
        // ehrId:'259986',
        examSno:'',
        mpiId:'',
        ehrId:'',
        patientInfo:{},
        transList:[]
      }
    },
    methods:{
      async getExamDetailList(){
        let res = await examDetailList({
          ehrId:this.ehrId,
          mpiId:this.mpiId,
          examSno:this.examSno
        })
        this.transList=res.transBeanList
      },
      async getPersonInfo(){
        let res = await personInfo({
          ehrId:this.ehrId,
          mpiId:this.mpiId
        })
        this.patientInfo=res
      },
    },
    onLoad(options) {
        this.examSno=options.examSno
        this.mpiId=options.mpiId
        this.ehrId=options.ehrId
    },
    mounted(){
      this.getPersonInfo()
      this.getExamDetailList()
    }
  }
</script>

<style lang="scss" scoped>
.exam-detail{
  .project{
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 0 0 20rpx 20rpx;
    margin-bottom: 20rpx;
    .title{
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 500;
      color: #666666;
      margin-bottom: 30rpx;
    }
    .names{
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 500;
      color: #333333;
    }
  }
  .time-name{
    width: 100%;
    padding: 0 30rpx;
    margin: 20rpx 0;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 20rpx;
    .head{
      display: flex;
      align-items: center;
      padding: 30rpx 0;
      box-sizing: border-box;
      .line{
        width: 2rpx;
        height: 30rpx;
        background: #0AB2C1;
        margin-right: 10rpx;
      }
      .title{
        font-size: 30rpx;
        color: #333333;
      }
    }
    .item-box{
      display: flex;
      padding: 30rpx 0;
      border-top: 1rpx solid #E6E6E6;
      .titles{
        width: 40%;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #666666;
      }
      .msg{
        position: relative;
        width: 60%;
        padding-right: 20rpx;
        box-sizing: border-box;
        text-align: right;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #333333;
        image{
          position: absolute;
          width: 10rpx;
          height: 20rpx;
          top: 50%;
          transform: translate(10rpx,-50%);
          transition: all 0.3s;
        }
      }
    }
  }
  .patient-msg{
    width: 100%;
    padding: 0 30rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 20rpx;
    overflow: hidden;
    .head{
      display: flex;
      align-items: center;
      padding: 30rpx 0;
      box-sizing: border-box;
      .line{
        width: 2rpx;
        height: 30rpx;
        background: #0AB2C1;
        margin-right: 10rpx;
      }
      .title{
        font-size: 30rpx;
        color: #333333;
      }
    }
    .msg-item{
      display: flex;
      width: 100%;
      padding: 30rpx 0;
      border-top: 1rpx solid #E6E6E6;
      .left{
        width: 40%;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #666666;
      }
      .right{
        position: relative;
        width: 60%;
        text-align: right;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #333333;
        .icon{
            position: absolute;
            width: 10rpx;
            height: 20rpx;
            top: 50%;
            right: 10rpx;
            transform: translate(0,-50%);
            transition: all 0.3s;
        }
        .active{
            transform: translate(0,-50%) rotate(90deg);
        }
      }
    }
    .bottom{
        width: 100%;
        padding: 20rpx 20rpx 20rpx 20%;
        box-sizing: border-box;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #333333;
    }
  }
}
</style>