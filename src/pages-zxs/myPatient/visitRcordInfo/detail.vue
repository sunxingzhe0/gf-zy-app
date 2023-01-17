<template>
  <view>
    <template>
      <!-- topinfo -->
      <view class="top-box" ref="topbar">
        <view class="header">
          <view class="msg">
            <view class="names">{{ patientInfo.patientName || "-" }}</view>
            <view class="sex-age"
              >{{ patientInfo.sexName || "-" }} |
              {{ patientInfo.age || "-" }}</view
            >
            <view class="no">就诊号：{{ patientInfo.mpiId || "-" }}</view>
          </view>
          <view class="addres">详细地址：{{ patientInfo.address || "-" }}</view>
        </view>
        <view class="tips">
          <view class="title">过敏史：</view>
          <view class="text">{{ patientInfo.allergy || "-" }}</view>
        </view>
        <view class="type">
          <view class="head">
            <view class="title" v-if="activeType == 'MZ'">门诊</view>
            <view class="title" v-if="activeType == 'ZY'" style="color: #0071e3"
              >住院</view
            >
            <view class="title" v-if="activeType == 'TJ'" style="color: #42d36b"
              >体检</view
            >
            <view class="time">
              {{ activeType == "MZ" ? "日期：" : "就诊时间：" }}
              {{ patientInfo.admitDeptDtime || "-" }}
              <template v-if="activeType == 'ZY'">
                <span v-if="patientInfo.zyState == '0'" class="zy-state"
                  >在院</span
                >
                <span v-if="patientInfo.zyState == '1'" class="zy-state"
                  >出院</span
                >
                <span v-if="patientInfo.zyState == '2'" class="zy-state"
                  >死亡</span
                >
              </template>
            </view>
          </view>
          <view class="body">
            医师：{{ patientInfo.doctorName || "-" }} | 诊断：{{
              patientInfo.diagnosisName || "-"
            }}
            | 科室：{{ patientInfo.deptName || "-" }} | {{ " " }}
            <template v-if="activeType == 'MZ'">
              门诊号：{{ patientInfo.mzNum || "-" }} |
            </template>
            <template v-if="activeType == 'ZY'">
              时长：{{ patientInfo.longTime || "-" }} | 住院号：{{
                patientInfo.zyNum || "-"
              }}
              | 床号：{{ patientInfo.bedNum || "-" }}床
              <template v-if="patientInfo.nurseLevel">
                | 护理等级：{{ patientInfo.nurseLevel || "-" }}
              </template>
              | 病情状态：{{ patientInfo.illState || "-" }} |
            </template>
            总费用：{{ patientInfo.totalCost || "-" }}¥
          </view>
        </view>
      </view>
      <!-- topinfo -->
    </template>

    <view class="body-box" :style="'padding-top:' + topHeight + 'rpx'">
      <left-tab
        :tabs="tabs"
        :active="active"
        @change="leftbarChange"
        :styles="'top:' + topHeight + 'rpx'"
      ></left-tab>
      <view class="right-box">
        <!-- 首页 -->
        <template v-if="active == 0">
          <!-- 门诊、体检 -->
          <template v-if="activeType == 'MZ' || activeType == 'TJ'">
            <right-card
              @change="changeTab"
              :ehrId="ehrId"
              :mpiId="mpiId"
              :activeType="activeType"
              @detail="openDetail"
            ></right-card>
          </template>
          <!-- <template v-if="activeType == 'TJ'"> 体检首页 </template> -->
          <!-- 住院 -->
          <template v-if="activeType == 'ZY'">
            <zy-pdf-card></zy-pdf-card>
          </template>
        </template>
        <!-- 诊断、体检报告 -->
        <template v-if="active == 1">
          <!-- 门诊、住院诊断 -->
          <template v-if="activeType != 'TJ'">
            <diagonsis-box :list="diagnosisBox"></diagonsis-box>
          </template>
          <template v-else>
            <tj-medical-report></tj-medical-report>
          </template>
        </template>
        <!-- 病历文书、体检检验 -->
        <template v-if="active == 2">
          <!-- 门诊病历文书 -->
          <template v-if="activeType == 'MZ'">
            <mz-case-doc :ehrId="ehrId" :mpiId="mpiId"></mz-case-doc>
          </template>
          <!-- 住院病历文书 -->
          <template v-if="activeType == 'ZY'">
            <!-- <zy-case-doc :mpiId="mpiId" :ehrId="ehrId"></zy-case-doc> -->
            <mz-case-doc :ehrId="ehrId" :mpiId="mpiId"></mz-case-doc>
          </template>
          <!-- 体检检验 -->
          <template v-if="activeType == 'TJ'">
            <inspect-table :mpiId="mpiId" :ehrId="ehrId"></inspect-table>
          </template>
        </template>
        <!-- 门诊处方、住院医嘱、体检检查 -->
        <template v-if="active == 3">
          <!-- 门诊处方 -->
          <template v-if="activeType == 'MZ'">
            <mz-prescription :list="mzPrescList" :rpId="rpId"></mz-prescription>
          </template>
          <!-- 住院医嘱 -->
          <template v-if="activeType == 'ZY'">
            <zy-inpatient-orders :list="zyInpatientList"></zy-inpatient-orders>
          </template>
          <!-- 体检检查 -->
          <template v-if="activeType == 'TJ'">
            <check-up-list :mpiId="mpiId" :ehrId="ehrId"></check-up-list>
          </template>
        </template>
        <!-- 门诊住院检验、体检费用 -->
        <template v-if="active == 4">
          <!-- 门诊、住院检验 -->
          <template v-if="activeType != 'TJ'">
            <inspect-table :mpiId="mpiId" :ehrId="ehrId"></inspect-table>
          </template>
          <!-- 体检费用 -->
          <template v-else>
            <medical-cost :ehrId="ehrId"></medical-cost>
          </template>
        </template>
        <!-- 门诊住院检查 -->
        <template v-if="active == 5">
          <check-up-list :mpiId="mpiId" :ehrId="ehrId"></check-up-list>
        </template>
        <!-- 费用 -->
        <template v-if="active == 6">
          <medical-cost :ehrId="ehrId"></medical-cost>
          <!-- 手术 -->
          <!-- <template v-else>
            <zy-surgical></zy-surgical>
          </template> -->
        </template>
        <!-- 住院费用 -->
        <template v-if="active == 7">
          <zy-nursing :mpiId="mpiId" :ehrId="ehrId"></zy-nursing>
          <!-- <medical-cost :ehrId="ehrId"></medical-cost> -->
        </template>
        <!-- 住院护理 -->
        <!-- <template v-if="active==8">
          <zy-nursing></zy-nursing>
        </template> -->
      </view>
    </view>
    <!-- <view class="footer" @click="makeOrder">预约挂号</view> -->
  </view>
</template>

<script>
import leftTab from "../components/common/leftTab/index";
import rightCard from "../components/common/rightCard/index";
import diagonsisBox from "../components/common/diagnosisBox/index";
import mzCaseDoc from "../components/MZ/mzCaseDoc/index";
import mzPrescription from "../components/MZ/mzPrescription/index";
import inspectTable from "../components/common/inspectTable/index";
import checkUpList from "../components/common/checkUpList/index";
import medicalCost from "../components/common/medicalCost/index";
import zyPdfCard from "../components/ZY/pdfCard/index";
import zyInpatientOrders from "../components/ZY/inpatientOrders/index";
import zyCaseDoc from "../components/ZY/zyCaseDoc/index";
// import zySurgical from '../components/ZY/zySurgical/index'//手术
import zyNursing from "../components/ZY/zyNursing/index";
import tjMedicalReport from "../components/TJ/medicalReport/index";
// import tjRightCard from '../components/TJ/tjRightCard'
import { mzTabs, zyTabs, tjTabs } from "./tabs.js";
// import {
//   personInfo,
//   findRelaInfo,
//   zyHospitalInfo,
//   diagnosisList,
//   mzPrescDatalist,
// } from "../api/index";
export default {
  components: {
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
  data() {
    return {
      activeType: "MZ",
      active: 0,
      topHeight: "",
      ehrId: "",
      mpiId: "",
      rpId: "",
      patientInfo: {
        address: "重庆市沙坪坝区矿山坡99号",
        admitDeptDtime: "2022-04-08 14:29:00",
        admitDtime: "2022-04-08 14:29:00",
        age: "92岁",
        allergy: null,
        arrearFlag: "1",
        balance: "-1483.78",
        bedNo: "49",
        careerName: null,
        chargeType: "986",
        chargeTypeName: "职工医保",
        contactInfo: "13983489499",
        contactName: "黄建军",
        contactPhoneNo: "13983489499",
        country: null,
        dateOfBirth: "1929-11-12 00:00:00",
        deptCode: "6462",
        deptName: "老年四科",
        diagnosisName: "(F09.x00x003)器质性精神病",
        diet: null,
        dischargeDtime: null,
        doctorName: "张漫",
        height: null,
        homephone: null,
        icd10: null,
        id: "448052",
        idNo: "510212192911123112",
        mrnNo: "448052",
        nation: "中国",
        nursingClass: "4",
        patientCondition: "一般",
        patientId: "231014",
        patientName: "黄德轩",
        planVisitDate: null,
        postalcode: null,
        prePayment: "0",
        selfPayment: null,
        sexName: "男",
        status: "住院",
        times: "16",
        totalCost: "0",
        weight: null,
        wordCode: null,
        wordName: null,
      },
      patientRecords: {},
      diagnosisBox: [
        {
          dataType: "门诊",
          diagType: "初步诊断",
          diagSerialNo: 1,
          diagName: "心肌损害 ",
          outComeName: "好转",
          doctorName: "刘小锋",
          deptName: "内科",
          diagDtime: "2021-03-05 09:34:12",
        },
      ], //诊断列表
      diagnosisPages: null, //诊断列表总页数
      zyInpatientList: [], //住院医嘱列表
      zyInpatientPages: null, //住院医嘱列表页面总数
      mzPrescList: [], //门诊处方列表
      mzPrescPages: null,
      pageNum: 1,
    };
  },
  computed: {
    tabs() {
      switch (this.activeType) {
        case "MZ":
          return mzTabs;
        case "ZY":
          return zyTabs;
        case "TJ":
          return tjTabs;
      }
    },
  },
  methods: {
    // 顶部信息栏
    async getPersonInfo() {
      let res = await personInfo({
        ehrId: this.ehrId,
        mpiId: this.mpiId,
      });
      this.patientInfo = res;
    },
    // 门诊，住院，体检信息栏
    async getRelaInfo() {
      let res = await findRelaInfo({
        ehrId: this.ehrId,
        type: this.activeType,
      });
      this.patientRecords = res;
    },
    // 诊断
    async getDiagnosisList(pageNum) {
      // let res = await diagnosisList({
      //   type: this.activeType,
      //   mpiId: this.mpiId,
      //   ehrId: this.ehrId,
      //   pageNum: pageNum,
      // });
      // this.diagnosisBox = res.list;
      // this.diagnosisPages = res.pages;
    },
    // 住院医嘱
    async getZyInpatientList(pageNum) {
      // let res = await zyHospitalInfo({
      //   mpiId: this.mpiId,
      //   ehrId: this.ehrId,
      //   pageNum: pageNum,
      // });
      // this.zyInpatientList = res.list;
      // this.zyInpatientPages = res.pages;
    },
    //门诊处方
    async getMzPrescDatalist(pageNum) {
      // let res = await mzPrescDatalist({
      //   emergentFlag: 0,
      //   mpiId: this.mpiId,
      //   outSno: this.ehrId,
      //   pageNum: pageNum,
      // });
      // this.mzPrescList = res.list;
      // this.mzPrescPages = res.pages;
    },
    makeOrder() {
      console.log("预约挂号");
    },
    leftbarChange(state) {
      this.active = state;
      this.pageNum = 1;
      switch (state) {
        case 1:
          this.getDiagnosisList(1);
          break;
        case 3:
          this.activeType == "ZY" && this.getZyInpatientList(1);
          this.activeType == "MZ" && this.getMzPrescDatalist(1);
          break;
      }
    },
    changeTab(i) {
      this.active = i;
      switch (i) {
        case 1:
          this.getDiagnosisList(1);
          break;
        case 3:
          this.activeType == "MZ" && this.getMzPrescDatalist(1);
          break;
      }
    },
    changeTopVal(className) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(className)
        .boundingClientRect((data) => {
          this.topHeight = data.height * 2 + 66;
          console.log(data.height * 2);
        })
        .exec();
    },
    onLoad(options) {
      // this.activeType = options.type;
      this.activeType = options.activeType;
      this.ehrId = options.ehrId;
      this.mpiId = options.mpiId;
    },
    openDetail(item, type) {
      switch (type) {
        case "diagnose":
          this.active = 1;
          this.getDiagnosisList(1);
          break;
        case "casedoc":
          this.active = 2;
          break;
        case "presc":
          this.rpId = item.rpId;
          this.activeType == "MZ" && this.getMzPrescDatalist(1);
          this.active = 3;
          break;
        case "lab":
          this.active = 4;
          break;
        case "exam":
          this.active = 5;
          break;
        case "fee":
          this.active = 6;
          break;
        case "tjreport":
          this.active = 1;
          break;
      }
    },
  },
  mounted() {
    // this.getRelaInfo();
    // this.getPersonInfo();
  },
  onReachBottom() {
    if (this.active == 3 && this.pageNum < this.mzPrescPages) {
      this.pageNum++;
      this.getMzPrescDatalist(this.pageNum);
    }
    if (this.active == 3 && this.pageNum < this.zyInpatientPages) {
      this.pageNum++;
      this.getZyInpatientList(this.pageNum);
    }
    if (this.active == 1 && this.pageNum < this.diagnosisPages) {
      this.pageNum++;
      this.getDiagnosisList(this.pageNum);
    }
  },
  watch: {
    patientRecords() {
      this.changeTopVal(".top-box");
    },
  },
};
</script>

<style lang="scss" scoped>
.top-box {
  background-color: #fff;
  .header {
    width: 100%;
    padding: 30rpx;
    font-weight: 500;
    box-sizing: border-box;
    color: #666666;
    .msg {
      display: flex;
      width: 100%;
      height: 30px;
      align-items: center;
      margin-bottom: 10rpx;
      .names {
        width: 120rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }
      .sex-age {
        width: 100rpx;
        font-size: 24rpx;
      }
      .no {
        flex: 1;
        font-size: 26rpx;
        text-align: right;
      }
    }
    .addres {
      font-size: 24rpx;
    }
  }
  .tips {
    display: flex;
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    font-weight: 500;
    color: #f74a4a;
    border: 0 solid #e6e6e6;
    border-width: 2rpx 0;
    .title {
      width: 110rpx;
    }
    .text {
      flex: 1;
    }
  }
  .type {
    width: 100%;
    box-sizing: border-box;
    padding: 30rpx;
    .head {
      display: flex;
      width: 100%;
      height: 30rpx;
      align-items: center;
      .title {
        width: 60rpx;
        font-size: 30rpx;
        color: #0ab2c1;
      }
      .time {
        flex: 1;
        font-size: 26rpx;
        text-align: right;
        color: #666666;
        .zy-state {
          display: inline-block;
          width: 60rpx;
          background: #e6e6e6;
          text-align: center;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #666666;
        }
      }
    }
    .body {
      width: 100%;
      margin-top: 20rpx;
      font-size: 24rpx;
      color: #666666;
    }
  }
}
.body-box {
  display: flex;
  padding: 60rpx 0 0 160rpx;
  box-sizing: border-box;
  .right-box {
    width: 100%;
    padding: 0 30rpx 100rpx;
    box-sizing: border-box;
    height: 600px;
    overflow-y: scroll;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 88rpx;
  background: #0ab2c1;
  line-height: 88rpx;
  text-align: center;
  font-size: 30rpx;
  color: #fff;
  cursor: pointer;
  z-index: 2;
}
</style>
