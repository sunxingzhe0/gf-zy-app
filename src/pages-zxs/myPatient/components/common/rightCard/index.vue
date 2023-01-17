<template>
  <view style="width: 100%">
    <view class="right-view" v-if="activeType === 'MZ'">
      <view class="header">
        <view class="line"></view>
        <view class="title">诊断</view>
        <view class="other" @click="changeTab(1)">更多 ></view>
      </view>
      <view
        class="body"
        v-for="(item, diagnose) in diagnoseBox"
        :key="diagnose"
      >
        <view class="title">
          <view class="names">{{ item.diagType }}</view>
          <view class="times">{{
            dayjs(item.createDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.diagName }}</view>
          <view class="button" @click="detail(item, 'diagnose')">查看 ></view>
        </view>
      </view>
    </view>
    <view class="right-view" v-if="activeType === 'MZ'">
      <view class="header">
        <view class="line"></view>
        <view class="title">病历文书</view>
        <view class="other" @click="changeTab(2)">更多 ></view>
      </view>
      <view class="body" v-for="(item, medical) in medicalBox" :key="medical">
        <view class="title">
          <view class="names">{{ item.name }}</view>
          <view class="times">{{
            dayjs(item.recordDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.recordSno }}</view>
          <view class="button" @click="detail(item, 'casedoc')">查看 ></view>
        </view>
      </view>
    </view>
    <view class="right-view" v-if="activeType === 'TJ'">
      <view class="header">
        <view class="line"></view>
        <view class="title">体检报告</view>
        <view class="other" @click="changeTab(1)">更多 ></view>
      </view>
      <view class="body" v-for="(item, medical) in examination" :key="medical">
        <view class="title">
          <view class="names">{{ item.name }}</view>
          <view class="times">{{
            dayjs(item.recordDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.recordSno }}</view>
          <view class="button" @click="detail(item, 'tjreport')">查看 ></view>
        </view>
      </view>
    </view>
    <view class="right-view" v-if="activeType === 'MZ'">
      <view class="header">
        <view class="line"></view>
        <view class="title">门诊处方</view>
        <view class="other" @click="changeTab(3)">更多 ></view>
      </view>
      <view
        class="body"
        v-for="(item, prescDetail) in prescDetailBox"
        :key="prescDetail"
      >
        <view class="title">
          <view class="names">{{ item.drugName }}</view>
          <view class="times">{{
            dayjs(item.createDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.rpDeptName }}</view>
          <view class="button" @click="detail(item, 'presc')">查看 ></view>
        </view>
      </view>
    </view>
    <view class="right-view">
      <view class="header">
        <view class="line"></view>
        <view class="title">检验</view>
        <view class="other" @click="changeTab(activeType === 'MZ' ? 4 : 2)"
          >更多 ></view
        >
      </view>
      <view class="body" v-for="(item, lab) in labBox" :key="lab">
        <view class="title">
          <view class="names">{{ item.labCombName }}</view>
          <view class="times">{{
            dayjs(item.labReportDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.labDoctorSendName }}</view>
          <view class="button" @click="changeTab(activeType === 'MZ' ? 4 : 2)"
            >查看 ></view
          >
        </view>
      </view>
    </view>
    <view class="right-view">
      <view class="header">
        <view class="line"></view>
        <view class="title">检查</view>
        <view class="other" @click="changeTab(activeType === 'MZ' ? 5 : 3)"
          >更多 ></view
        >
      </view>
      <view
        class="body"
        v-for="(item, examPacs) in examPacsBox"
        :key="examPacs"
      >
        <view class="title">
          <view class="names">{{ item.itemCHName }}</view>
          <view class="times">{{
            dayjs(item.examDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.examDoctorSendName }}</view>
          <view class="button" @click="changeTab(activeType === 'MZ' ? 5 : 3)"
            >查看 ></view
          >
        </view>
      </view>
    </view>
    <view class="right-view">
      <view class="header">
        <view class="line"></view>
        <view class="title">费用</view>
        <view class="other" @click="changeTab(activeType === 'MZ' ? 6 : 4)"
          >更多 ></view
        >
      </view>
      <view class="body" v-for="(item, fee) in feeBox" :key="fee">
        <view class="title">
          <view class="names">{{ item.itemName }}</view>
          <view class="times">{{
            dayjs(item.createDtime).format("YYYY-MM-DD")
          }}</view>
        </view>
        <view class="text">
          <view class="msg">{{ item.amount }}</view>
          <view class="button" @click="changeTab(activeType === 'MZ' ? 6 : 4)"
            >查看 ></view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
// import { outpatientServList } from '../../../api/index'
export default {
  props: {
    ehrId: {
      type: String,
    },
    mpiId: {
      type: String,
    },
    activeType: {
      type: String,
    },
  },
  data() {
    return {
      flag: {
        diagnoseFlag: false, //诊断
        medicalFlag: false, //病历文书
        prescDetailFlag: false, //门诊处方
        labFlag: false, //检验
        examPacsFlag: false, //检查
        feeFlag: false, //费用
      },
      diagnoseBox: [
        {
          diagType: "X射线诊断",
          createDtime: "2020-12-14 14:22:54",
          diagName: "(F09.x00x003)器质性精神病",
        },
      ],
      medicalBox: [{ name: "门诊病历", recordDtime: "2020-10-28 15:25:14" }],
      examination: [{ name: "体检报告", recordDtime: "2020-10-28 15:25:14" }],
      prescDetailBox: [
        { drugName: "西药】维生素C针", createDtime: "2020-08-26" },
      ],
      labBox: [
        { labCombName: "AFP+CDA+CA125  ③", labReportDtime: "2021-03-05" },
      ],
      examPacsBox: [{ itemCHName: "彩超检查(门诊)", examDtime: "2021-03-05" }],
      feeBox: [{ itemName: "发票号：XXXXXXXXX", createDtime: "2021-03-05" }],
    };
  },
  methods: {
    dayjs,
    changeTab(nums) {
      this.$emit("change", nums);
    },
    async getPatientServList() {
      // let res = await outpatientServList({
      //   ehrId: this.ehrId,
      //   mpiId: this.mpiId
      // })
      // this.flag=res.flags
      // this.diagnoseBox=res.diagnoseDtoList
      // this.medicalBox=res.medicalDtoList
      // this.prescDetailBox=res.prescDetailDtoList
      // this.labBox=res.labDtoList
      // this.examPacsBox=res.examPacsDtoList
      // this.feeBox=res.feeDtoList
    },
    detail(item, type) {
      this.$emit("detail", item, type);
    },
  },
  mounted() {
    // this.getPatientServList()
  },
};
</script>

<style lang="scss" scoped>
.right-view {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 20rpx;
  .header {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 20rpx;
    .line {
      width: 2rpx;
      height: 30rpx;
      background: #0ab2c1;
      margin-right: 10rpx;
    }
    .title {
      flex: 1;
      font-size: 30rpx;
      color: #333333;
    }
    .other {
      width: 75rpx;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .body {
    width: 100%;
    background: #ffffff;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    .title {
      display: flex;
      width: 100%;
      align-items: center;
      margin-bottom: 20rpx;
      .names {
        width: 65%;
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .times {
        width: 35%;
        font-size: 24rpx;
        color: #666666;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .text {
      width: 100%;
      display: flex;
      .msg {
        flex: 1;
        font-size: 24rpx;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .button {
        width: 90rpx;
        font-size: 24rpx;
        text-align: right;
        color: #0ab2c1;
        cursor: pointer;
      }
    }
  }
}
</style>
