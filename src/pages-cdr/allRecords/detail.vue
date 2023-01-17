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
                <view class="title" v-if="medicalType=='MZ'">门诊</view>
                <view class="title" v-if="medicalType=='ZY'" style="color: #0071E3;">住院</view>
                <view class="title" v-if="medicalType=='TJ'" style="color: #42D36B;">体检</view>
                <view class="time">
                  {{medicalType=='MZ'?'日期：':'就诊时间：'}}
                  {{patientRecords.patientTime||'-'}}
                  <template v-if="medicalType=='ZY'">
                    <span v-if="patientRecords.zyState=='0'" class="zy-state">在院</span>
                    <span v-if="patientRecords.zyState=='1'" class="zy-state">出院</span>
                    <span v-if="patientRecords.zyState=='2'" class="zy-state">死亡</span>
                  </template>
                </view>
              </view>
              <view class="body">
                医师：{{patientRecords.docName||'-'}} | 诊断：{{patientRecords.diag||'-'}} | 科室：{{patientRecords.dept||'-'}} | {{' '}}
                <template v-if="medicalType=='MZ'">
                  门诊号：{{patientRecords.mzNum||'-'}} |
                </template>
                <template v-if="medicalType=='ZY'">
                  时长：{{patientRecords.longTime||'-'}} | 住院号：{{patientRecords.zyNum||'-'}} | 床号：{{patientRecords.bedNum||'-'}}床
                  <template v-if="patientRecords.nurseLevel">
                    | 护理等级：{{patientRecords.nurseLevel||'-'}}
                  </template>
                   | 病情状态：{{patientRecords.illState||'-'}} |
                </template>
                 总费用：{{patientRecords.totalFee||'-'}}¥
              </view>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <view class="body-box" :style="'padding-top:'+topHeight+'rpx'">
      <left-tab :tabs="tabs" :active="active" @change="leftbarChange"
      :styles="'top:'+topHeight+'rpx'"
      ></left-tab>
      <view class="right-box">
        <!-- 首页 -->
        <template v-if="active==0">
          <!-- 门诊、体检 -->
          <template v-if="medicalType=='MZ'">
            <right-card @change="changeTab" :ehrId='ehrId' :mpiId='mpiId' @detail="openDetail"></right-card>
          </template>
          <template v-if="medicalType=='TJ'">
            体检首页
          </template>
          <!-- 住院 -->
          <template v-if="medicalType=='ZY'">
            <zy-pdf-card></zy-pdf-card>
          </template>
        </template>
        <!-- 诊断、体检报告 -->
        <template v-if="active==1">
          <!-- 门诊、住院诊断 -->
          <template v-if="medicalType!='TJ'">
            <diagonsis-box :list="diagnosisBox"></diagonsis-box>
          </template>
          <template v-else>
            <tj-medical-report></tj-medical-report>
          </template>
        </template>
        <!-- 病历文书、体检检验 -->
        <template v-if="active==2">
          <!-- 门诊病历文书 -->
          <template v-if="medicalType=='MZ'">
            <mz-case-doc :ehrId="ehrId" :mpiId="mpiId"></mz-case-doc>
          </template>
          <!-- 住院病历文书 -->
          <template v-if="medicalType=='ZY'">
            <zy-case-doc :mpiId="mpiId" :ehrId="ehrId"></zy-case-doc>
          </template>
          <!-- 体检检验 -->
          <template v-if="medicalType=='TJ'">
            <inspect-table :mpiId="mpiId" :ehrId="ehrId"></inspect-table>
          </template>
        </template>
        <!-- 门诊处方、住院医嘱、体检检查 -->
        <template v-if="active==3">
          <!-- 门诊处方 -->
          <template v-if="medicalType=='MZ'">
            <mz-prescription :list="mzPrescList" :rpId="rpId"></mz-prescription>
          </template>
          <!-- 住院医嘱 -->
          <template v-if="medicalType=='ZY'">
            <zy-inpatient-orders :list="zyInpatientList"></zy-inpatient-orders>
          </template>
          <!-- 体检检查 -->
          <template v-if="medicalType=='TJ'">
            <check-up-list :mpiId="mpiId" :ehrId="ehrId"></check-up-list>
          </template>
        </template>
        <!-- 门诊住院检验、体检费用 -->
        <template v-if="active==4">
          <!-- 门诊、住院检验 -->
          <template v-if="medicalType!='TJ'">
            <inspect-table :mpiId="mpiId" :ehrId="ehrId"></inspect-table>
          </template>
          <!-- 体检费用 -->
          <template v-else>
            <medical-cost :ehrId="ehrId"></medical-cost>
          </template>
        </template>
        <!-- 门诊住院检查 -->
        <template v-if="active==5">
          <check-up-list  :mpiId="mpiId" :ehrId="ehrId"></check-up-list>
        </template>
        <!-- 费用 -->
        <template v-if="active==6">
          <medical-cost :ehrId="ehrId"></medical-cost>
          <!-- 手术 -->
          <!-- <template v-else>
            <zy-surgical></zy-surgical>
          </template> -->
        </template>
        <!-- 住院费用 -->
        <template v-if="active==7">
          <zy-nursing :mpiId="mpiId" :ehrId="ehrId"></zy-nursing>
          <!-- <medical-cost :ehrId="ehrId"></medical-cost> -->
        </template>
        <!-- 住院护理 -->
        <!-- <template v-if="active==8">
          <zy-nursing></zy-nursing>
        </template> -->
      </view>
    </view>
    <view class="footer" @click="makeOrder">预约挂号</view>
  </view>
</template>

<script>

import leftTab from '../components/common/leftTab/index'
import rightCard from '../components/common/rightCard/index'
import diagonsisBox from '../components/common/diagnosisBox/index'
import mzCaseDoc from '../components/MZ/mzCaseDoc/index'
import mzPrescription from '../components/MZ/mzPrescription/index'
import inspectTable from '../components/common/inspectTable/index'
import checkUpList from '../components/common/checkUpList/index'
import medicalCost from '../components/common/medicalCost/index'
import zyPdfCard from '../components/ZY/pdfCard/index'
import zyInpatientOrders from '../components/ZY/inpatientOrders/index'
import zyCaseDoc from '../components/ZY/zyCaseDoc/index'
// import zySurgical from '../components/ZY/zySurgical/index'//手术
import zyNursing from '../components/ZY/zyNursing/index'
import tjMedicalReport from '../components/TJ/medicalReport/index'
// import tjRightCard from '../components/TJ/tjRightCard'
import { mzTabs , zyTabs , tjTabs } from './tabs.js'
import { personInfo ,findRelaInfo ,zyHospitalInfo, diagnosisList,mzPrescDatalist } from '../api/index'
  export default {
    components:{
      rightCard,
      leftTab,
      diagonsisBox,
      mzCaseDoc,
      mzPrescription,
      inspectTable,
      checkUpList,
      medicalCost,
      zyPdfCard,
      zyInpatientOrders,
      zyCaseDoc,
      // zySurgical,
      zyNursing,
      tjMedicalReport,
      // tjRightCard
    },
    data(){
      return{
        active: 0,
        topHeight:'',
        medicalType:'',
        ehrId:'',
        mpiId:'',
        rpId:'',
        patientInfo:{},
        patientRecords:{},
        diagnosisBox:[],//诊断列表
        diagnosisPages:null,//诊断列表总页数
        zyInpatientList:[],//住院医嘱列表
        zyInpatientPages:null,//住院医嘱列表页面总数
        mzPrescList:[],//门诊处方列表
        mzPrescPages:null,
        pageNum:1
      }
    },
    computed:{
      tabs(){
        switch (this.medicalType) {
          case 'MZ':
            return mzTabs
          case 'ZY':
            return zyTabs
          case 'TJ':
            return tjTabs
        }
      }
    },
    methods:{
      // 顶部信息栏
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
          type: this.medicalType
        })
        this.patientRecords=res
      },
      // 诊断
      async getDiagnosisList(pageNum){
        let res = await diagnosisList({
          type:this.medicalType,
          mpiId:this.mpiId,
          ehrId:this.ehrId,
          pageNum:pageNum
        })
        this.diagnosisBox=res.list
        this.diagnosisPages=res.pages
      },
      // 住院医嘱
      async getZyInpatientList(pageNum){
        let res = await zyHospitalInfo({
          mpiId:this.mpiId,
          ehrId:this.ehrId,
          pageNum: pageNum
        })
        this.zyInpatientList=res.list
        this.zyInpatientPages=res.pages
      },
      //门诊处方
      async getMzPrescDatalist(pageNum){
        let res = await mzPrescDatalist({
          emergentFlag:0,
          mpiId:this.mpiId,
          outSno:this.ehrId,
          pageNum:pageNum
        })
        this.mzPrescList = res.list
        this.mzPrescPages = res.pages
      },
      makeOrder(){
        console.log('预约挂号');
      },
      leftbarChange(state) {
          this.active = state
          this.pageNum=1
          switch (state) {
            case 1:
              this.getDiagnosisList(1)
              break;
            case 3:
              this.medicalType=='ZY'&&this.getZyInpatientList(1)
              this.medicalType=='MZ'&&this.getMzPrescDatalist(1)
              break;
          }
      },
      changeTab(i){
        this.active=i
        switch (i) {
            case 1:
              this.getDiagnosisList(1)
              break;
            case 3:
              this.medicalType=='MZ'&&this.getMzPrescDatalist(1)
              break;
        }
      },
      changeTopVal(className){
        const query = uni.createSelectorQuery().in(this);
            query.select(className).boundingClientRect(data => {
                this.topHeight = data.height*2+66
                console.log(data.height*2);
            }).exec();   
      },
      onLoad(options) {
        this.medicalType = options.type
        this.ehrId = options.ehrId
        this.mpiId = options.mpiId
      },
      openDetail(item,type){
        switch (type) {
          case 'diagnose':
            this.active = 1
            this.getDiagnosisList(1)
            break;
          case 'casedoc':
            this.active = 2
            break;
          case 'presc':
            this.rpId=item.rpId
            this.medicalType=='MZ'&&this.getMzPrescDatalist(1)
            this.active = 3
            break;
          case 'lab':
            uni.navigateTo({ 
              url: '/pages-cdr/allDetailList/inspectDetail/index?labSno='
              +item.labSno+'&doctor='+item.labDoctorSendName+'&time='+item.labReportDtime
              +'&mpiId='+this.mpiId+'&ehrId='+item.ehrId
            })
            break;
          case 'exam':
            uni.navigateTo({ 
              url: '/pages-cdr/allDetailList/examPacsDetail/index?examSno'
              +item.examSno+'&mpiId='+this.mpiId+'&ehrId='+item.ehrId
            })
            break;
          case 'fee':
            this.active = 6
            break;
        }
      }
    },
    mounted(){
      this.getRelaInfo()
      this.getPersonInfo()
    },
    onReachBottom() {
      if(this.active==3&&this.pageNum < this.mzPrescPages){
        this.pageNum++
        this.getMzPrescDatalist(this.pageNum)
      }
      if (this.active==3&&this.pageNum < this.zyInpatientPages) {
        this.pageNum++
        this.getZyInpatientList(this.pageNum)
      }
      if(this.active==1&&this.pageNum < this.diagnosisPages){
        this.pageNum++
        this.getDiagnosisList(this.pageNum)
      }
    },
    watch:{
      patientRecords(){
        this.changeTopVal('.top-box')
      },
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
        .zy-state{
          display: inline-block;
          width: 60rpx;
          background: #E6E6E6;
          text-align: center;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #666666;
        }
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
.body-box{
  display: flex;
  padding: 545rpx 0 0 160rpx;
  box-sizing: border-box;
  .right-box{
    width: 100%;
    padding: 0 30rpx 100rpx;
    box-sizing: border-box;
  }
}
.footer{
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 88rpx;
  background: #0AB2C1;
  line-height: 88rpx;
  text-align: center;
  font-size: 30rpx;
  color: #fff;
  cursor: pointer;
  z-index: 2;
}
</style>