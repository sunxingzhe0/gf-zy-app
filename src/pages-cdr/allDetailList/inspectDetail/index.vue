<template>
  <view class="inspect-report">
    <view class="project">
      <view class="title">检验项目</view>
      <view class="names">{{labName}}</view>
    </view>
    <view class="time-name">
      <view class="item-box" style="border-bottom: 1rpx solid #E6E6E6;">
        <view class="titles">报告时间</view>
        <view class="msg">{{labReportTime}}</view>
      </view>
      <view class="item-box">
        <view class="titles">报告医生</view>
        <view class="msg">{{doctorName}}</view>
      </view>
    </view>
    <view class="patient-msg" :style="isOpen?'height:auto':'height:110rpx'">
      <view class="head">
        <view class="line"></view>
        <view class="title">诊断详情</view>
        <view class="collapse" @click="isOpen=!isOpen">
          {{isOpen?'收起':'展开'}}
          <image 
            :src="require('../../../assets/right11@2x.png')"
            :class="isOpen?'icon active':'icon'"
          ></image>
        </view>
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
        <view class="left">检验号</view>
        <view class="right">{{labSno}}</view>
      </view>
      <view class="msg-item">
        <view class="left">检验时间</view>
        <view class="right">{{transList[7].value}}</view>
      </view>
      <view class="msg-item">
        <view class="left">标本类型</view>
        <view class="right">{{transList[1].value}}</view>
      </view>
      <view class="msg-item">
        <view class="left">申请科室</view>
        <view class="right">{{transList[0].value}}</view>
      </view>
      <view class="msg-item">
        <view class="left">申请医生</view>
        <view class="right">{{transList[2].value}}</view>
      </view>
      <view class="msg-item">
        <view class="left">申请时间</view>
        <view class="right">{{transList[5].value}}</view>
      </view>
      <!-- <view class="msg-item">
        <view class="left">临床诊断</view>
        <view class="right">{{transList[1].value}}</view>
      </view> -->
    </view>
    <view class="table">
      <view class="head">
        <view class="line"></view>
        <view class="title">诊断详情</view>
      </view>
      <table cellspacing="0">
          <thead>
            <tr>
              <td>NO</td>
              <td>检验单名称</td> 
              <td>结果值</td>
              <td>参考值</td>
              <td>单位</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,table) in labDtoList" :key="table">
              <td>{{table+1}}</td>
              <td>{{item.itemCHName||'-'}}</td> 
              <td>
                {{item.itemResultNum||'-'}}
                <template v-if="result==1">
                  <template v-if="itemResultPoint=='偏高'">
                    <image :src="require('../../../assets/piangao.png')"></image>
                  </template>
                  <template v-if="itemResultPoint=='偏低'">
                    <image class="down" :src="require('../../../assets/piangao.png')"></image>
                  </template>
                </template>
              </td>
              <td>{{item.itemResultReference||'-'}}</td>
              <td>{{item.itemResultUnit||'-'}}</td>
            </tr>
          </tbody>
      </table>
    </view>
  </view>
</template>

<script>
  import { labDetailList, personInfo} from '../../api/index'
  export default {
    data(){
      return{
        mpiId:'',
        ehrId:'',
        isOpen:false,
        labSno:'',
        upType:0,
        labName:'',
        labReportTime:'',
        doctorName:'',
        labDtoList:[],
        transList:[],
        patientInfo:{},
        result:null
      }
    },
    methods:{
      async getLabDetail(){
        let res = await labDetailList({
          labSno:this.labSno,
          upAnomaly:this.upType
        })
        this.labName=res.labCombName
        this.labDtoList=res.labDetailListDtoList
        this.transList=res.transBeanList
        this.result=res.result
      },
      async getPersonInfo(){
        let res = await personInfo({
          ehrId:this.ehrId,
          mpiId:this.mpiId
        })
        this.patientInfo=res
      },
      onLoad(options) {
        this.mpiId=options.mpiId
        this.ehrId=options.ehrId
        this.labSno=options.labSno
        this.labReportTime=options.time
        this.doctorName=options.doctor
      }
    },
    mounted(){
      this.getLabDetail()
      this.getPersonInfo()
    }
  }
</script>

<style lang="scss" scoped>
.inspect-report{
  .project{
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 0 0 20rpx 20rpx;
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
    .item-box{
      display: flex;
      padding: 30rpx 0;
      .titles{
        width: 40%;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #666666;
      }
      .msg{
        width: 60%;
        text-align: right;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #333333;
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
      .collapse{
        position: relative;
        flex: 1;
        padding-right: 30rpx;
        box-sizing: border-box;
        text-align: right;
        font-size: 24rpx;
        font-weight: 500;
        color: #666666;
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
        width: 60%;
        text-align: right;
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .table{
    width: 100%;
    background: #FFFFFF;
    box-sizing: border-box;
    border-radius: 20rpx;
    padding-bottom: 20rpx;
    margin-bottom: 30rpx;
    .head{
      display: flex;
      align-items: center;
      padding: 30rpx;
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
    table{
      width: 100%;
      border: 0.5rpx solid #E6E6E6;
      text-align: center;
      margin-bottom: 20rpx;
      background: #fff;
      thead{
        width: 100%;
        font-size: 24rpx;
        font-weight: 500;
        color: #666666;
      }
      tbody{
        width: 100%;
        font-size: 24rpx;
        font-weight: 500;
        color: #333;
      }
      tr td{
        border: 0.5rpx solid #E6E6E6;
      }
      tr{
        display: flex;
      }
      td{
        display: flex;
        width: 20%;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        image{
            width: 30rpx;
            height: 50rpx;
          }
          .down{
            transform: rotate(180deg);
          }
      }
    } 
  }
}
</style>