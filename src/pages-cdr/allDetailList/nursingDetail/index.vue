<template>
  <view>
    <topbar>
      <template v-slot:top>
        <view class="top-box" ref="topbar">
          <app-list-item :styles="{ padding: '16rpx 30rpx', paddingLeft: 0}">
            <view class="header">
              <view class="msg">
                <view class="names">{{patientInfo.name||'-'}}</view>
                <view class="sex-age">{{patientInfo.gender||'-'}} | {{patientInfo.age||'-'}}</view>
                <view class="no">就诊号：{{patientInfo.mpiId||'-'}}</view>
              </view>
              <view class="addres">详细地址：{{patientInfo.address||'-'}}</view>
            </view>
          </app-list-item>
          <app-list-item :styles="{ padding: '16rpx 30rpx', paddingLeft: 0}">
            <view class="tips">
              <view class="title">过敏史：</view>
              <view class="text">{{patientInfo.allergy||'-'}}</view>
            </view>
          </app-list-item>
          <app-list-item :styles="{ padding: '16rpx 30rpx', paddingLeft: 0}">
            <view class="type">
              <view class="head">
                <view class="title" style="color: #0071E3;">住院</view>
                <view class="time">
                  就诊时间：{{patientRecords.patientTime||'-'}}
                    <span v-if="patientRecords.zyState=='0'" class="zy-state">在院</span>
                    <span v-if="patientRecords.zyState=='1'" class="zy-state">出院</span>
                    <span v-if="patientRecords.zyState=='2'" class="zy-state">死亡</span>
                </view>
              </view>
              <view class="body">
                医师：{{patientRecords.docName||'-'}} | 诊断：{{patientRecords.diag||'-'}} | 科室：{{patientRecords.dept||'-'}} | {{' '}} | 
                时长：{{patientRecords.longTime||'-'}} | 住院号：{{patientRecords.zyNum||'-'}} | 床号：{{patientRecords.bedNum||'-'}}床
                  <template v-if="patientRecords.nurseLevel">
                    | 护理等级：{{patientRecords.nurseLevel||'-'}}
                  </template>
                   | 病情状态：{{patientRecords.illState||'-'}} |
                 总费用：{{patientRecords.totalFee||'-'}}¥
              </view>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <view class="nursing-photo">
      <view class="border">
      <web-view src="" :webview-styles="webview"></web-view>
      </view>
      <view class="footer">
          <view class="button">
            <view class="left" @click="backImg">
              上一条
              <image :src="require('../../../assets/right11@2x.png')"></image>
            </view>
            <view class="center"></view>
            <view class="right" @click="nextImg">
              下一条
              <image :src="require('../../../assets/right11@2x.png')"></image>
            </view>
          </view>
      </view>
    </view>
  </view>
</template>

<script>
import { personInfo ,findRelaInfo } from '../../api/index'
  export default {
    data(){
      return{
        mpiId:'',
        ehrId:'',
        patientInfo:{},
        patientRecords:{},
        currentIndex:0,
        iconBox:[
          {title:'体温单',img:'../../../assets/nuring1.png'},
          {title:'入院护理评估单',img:'../../../assets/nuring1.png'},
          {title:'入院宣教记录',img:'../../../assets/nuring1.png'},
          {title:'护理记录单',img:'../../../assets/nuring1.png'},
        ],
        webview:{
          automaticallyAdjustContentInsets:true
        }
      }
    },
    methods:{
        async getPersonInfo(){
        let res = await personInfo({
          ehrId:this.ehrId,
          mpiId:this.mpiId
        })
        this.patientInfo=res
      },
      // 门诊，住院，体检信息栏
      async getRelaInfo(){
        let res = await findRelaInfo({
          ehrId: this.ehrId,
          type: 'ZY'
        })
        this.patientRecords=res
      },
      backImg(){
        this.currentIndex--
        if(this.currentIndex < 0) {
          this.currentIndex = this.iconBox.length-1
        }
      },
      nextImg(){
        this.currentIndex++;
        if(this.currentIndex >= this.iconBox.length) {
          this.currentIndex = 0;
        }
      },
    },
    mounted(){
      this.getPersonInfo()
      this.getRelaInfo()
    },
    onLoad(options) {
        this.mpiId = options.mpiId
        this.ehrId = options.snoNo
    }
  }
</script>

<style lang="scss" scoped>
.top-box{
  .header{
    width: 100%;
    padding: 30rpx;
    font-weight: 500;
    box-sizing: border-box;
    color: #666666;
    .msg{
      display: flex;
      width: 100%;
      height: 30px;
      align-items: center;
      margin-bottom: 10rpx;
      .names{
        width: 120rpx;     
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }
      .sex-age{
        width: 100rpx;
        font-size: 24rpx;
      }
      .no{
        flex: 1;
        font-size: 26rpx;
        text-align: right;
      }
    }
    .addres{
      font-size: 24rpx;
    }
  }
  .tips{
    display: flex;
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    font-weight: 500;
    color: #F74A4A;
    border: 0 solid #E6E6E6;
    border-width: 2rpx 0;
    .title{
      width: 110rpx;
    }
    .text{
      flex: 1;
    }
  }
  .type{
    width: 100%;
    box-sizing: border-box;
    padding: 30rpx;
    .head{
      display: flex;
      width: 100%;
      height: 30rpx;
      align-items: center;
      .title{
        width: 60rpx;
        font-size: 30rpx;
        color: #0AB2C1;
      }
      .time{
        flex: 1;
        font-size: 26rpx;
        text-align: right;
        color:#666666;
      }
    }
    .body{
        width: 100%;
        margin-top: 20rpx;
        font-size: 24rpx;
        color: #666666;
    }
  }
}
.nursing-photo{
  position: absolute;
    width: 100%;
    height: 63vh;
    bottom: 0;
    right: 0;
    z-index: 10;
  .border{
    display: flex;
    width: 100%;
    height: 53vh;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30rpx;
    background: #fff;
    border-radius: 30rpx;
    overflow: scroll;
  }
  .footer{
    width: 100%;
    height: 110rpx;
    margin-top: 30rpx;
    background: #fff;
    .button{
      display: flex;
      width: 100%;
      height: 110rpx;
      justify-content: space-between;
      text-align: center;
      .left{
        position: relative;
        width: 100%;
        background: #fff;
        font-size: 30rpx;
        font-weight: 500;
        color: #666666;
        line-height: 90rpx;
        image{
          position: absolute;
          width: 10rpx;
          height: 20rpx;
          transform: translate(-115rpx,35rpx) rotateY(180deg);
        }
      }
      .center{
        width: 2rpx;
        height: 100%;
        background: #E6E6E6;
      }
      .right{
        position: relative;
        width: 100%;
        background: #fff;
        font-size: 30rpx;
        font-weight: 500;
        color: #666666;
        line-height: 90rpx;
        image{
          position: absolute;
          width: 10rpx;
          height: 20rpx;
          transform: translate(20rpx, 35rpx);
        }
      }
    }
  }
}
</style>