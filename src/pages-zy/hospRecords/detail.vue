<template>
  <view>
    <view class="top-box">
      <view class="header">
        <view class="msg">
          <view class="names">{{ patientInfo.patientName || '-' }}</view>
          <view class="sex-age"
            >{{ patientInfo.sexName || '-' }} |
            {{ patientInfo.age || '-' }}</view
          >
          <view class="no">
            就诊号：{{
              patientInfo.patientId
                ? patientInfo.patientId + '_' + hospTimes
                : '-'
            }}
          </view>
        </view>
        <view class="addres">详细地址：{{ patientInfo.address || '-' }}</view>
      </view>
      <view class="tips">
        <view class="title">过敏史：</view>
        <view class="text">{{ patientInfo.allergy || '-' }}</view>
      </view>
      <view class="type">
        <view class="head">
          <view class="title" style="color: #0071E3;">住院</view>
          <view class="time">
            就诊时间：{{ changeTime(patientInfo.admitDeptDtime) }}
            <span class="zy-state">{{ patientInfo.status }}</span>
          </view>
        </view>
        <view class="body">
          医师：{{ patientInfo.doctorName || '-' }} | 诊断：{{
            diagName || '-'
          }}
          | 科室：{{ patientInfo.deptName || '-' }} | {{ ' ' }} 住院号：{{
            patientInfo.patientId || '-'
          }}
          | 床号：{{ patientInfo.bedNo || '-' }}床{{ ' ' }}
          <template v-if="patientInfo.status !== '出院'">
            | 护理等级：{{ patientInfo.nursingClass || '-' }}
          </template>
          | 病情状态：{{
            patientInfo.status !== '出院'
              ? patientInfo.patientCondition || '-'
              : '-'
          }}
          | 总费用： ¥ {{ patientInfo.totalCost || '-' }}
        </view>
      </view>
    </view>
    <view class="body-box" :style="'padding-top:' + topHeight + 'px'">
      <left-tab
        :tabs="tabs"
        :active="active"
        @change="leftbarChange"
        :styles="'top:' + topHeight + 'px'"
      ></left-tab>
      <view class="right-box">
        <!-- 首页 -->
        <!-- <template v-if="active==0">
          <template v-if="medicalType=='ZY'">
            住院首页
          </template>
        </template> -->
        <!-- 诊断 -->
        <template v-if="active == 0 && cardNo">
          <diagonsis-box
            :cardNo="cardNo"
            :begin="beginTime"
            :end="endTime"
            :times="hospTimes"
          ></diagonsis-box>
        </template>
        <!-- 病历文书 -->
        <!-- <template v-if="active==1">
            <zy-case-doc></zy-case-doc>
        </template> -->
        <!-- 住院医嘱  暂时隐藏医嘱-->
        <template v-if="active == 1 && false">
          <zy-inpatient-orders
            :cardNo="cardNo"
            :inSno="inSno"
            :begin="beginTime"
            :end="endTime"
            :times="hospTimes"
          ></zy-inpatient-orders>
        </template>
        <template v-if="active == 2">
          <!-- 住院检验 -->
          <inspect-table
            :cardNo="cardNo"
            :begin="beginTime"
            :end="endTime"
            :times="hospTimes"
          ></inspect-table>
        </template>
        <!-- 住院检查 -->
        <template v-if="active == 3">
          <check-up-list
            :cardNo="cardNo"
            :begin="beginTime"
            :end="endTime"
            :times="hospTimes"
          ></check-up-list>
        </template>
        <!-- 费用 -->
        <template v-if="active == 4">
          <medical-cost
            :cardNo="cardNo"
            :begin="beginTime"
            :end="endTime"
            :times="hospTimes"
          ></medical-cost>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import leftTab from '@/components/leftTab/index.vue'
import diagonsisBox from './components/diagnosisBox'
import inspectTable from './components/inspectTable'
import checkUpList from './components/checkUpList'
import medicalCost from './components/medicalCost'
import zyInpatientOrders from './components/inpatientOrders'
import zyCaseDoc from './components/zyCaseDoc'
import { zyTabs } from './tab'
import { hospPatientList } from '../api/hospitalCdr'
export default {
  components: {
    leftTab,
    diagonsisBox,
    inspectTable,
    checkUpList,
    medicalCost,
    zyInpatientOrders,
    zyCaseDoc,
  },
  data() {
    return {
      tabs: zyTabs,
      active: 0,
      topHeight: '',
      patientInfo: {},
      inSno: '',
      hospTimes: '',
      beginTime: '',
      endTime: '',
      cardNo: '',
      diagName: '',
    }
  },
  methods: {
    // 住院病人信息
    async getHospPatientList() {
      let res = await hospPatientList({
        hospCode: this.$store.state.userInfo.orgId,
        cardType: '1',
        cardNo: this.cardNo,
        inSno: this.inSno,
        times: this.hospTimes,
      })
      this.patientInfo = res
      this.diagName = res.diagnosisName.match(/,(\S*),/)[1] + '...'
      console.log('diagName=', this.diagName)
    },
    leftbarChange(state) {
      this.active = state
    },
    changeTab(i) {
      this.active = i
    },
    changeTopVal(className) {
      const query = uni.createSelectorQuery().in(this)
      query
        .select(className)
        .boundingClientRect(data => {
          this.topHeight = data.height + 15
          console.log(data.height)
        })
        .exec()
    },
    changeTime(times) {
      if (times) {
        return dayjs(times).format('YYYY-MM-DD')
      } else {
        return '-'
      }
    },
  },
  mounted() {
    this.changeTopVal('.top-box')
    this.getHospPatientList()
  },
  onLoad(options) {
    this.hospTimes = options.times
    this.inSno = options.inSno
    this.cardNo = options.cardNo
    this.beginTime = dayjs(options.beginTime).format('YYYY-MM-DD')
    this.endTime =
      options.endTime != 'null'
        ? dayjs(options.endTime).format('YYYY-MM-DD')
        : ''

    console.log(this.beginTime, options.endTime, '开始结束时间===')
  },
  watch: {
    patientInfo() {
      this.$nextTick(() => {
        this.changeTopVal('.top-box')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.top-box {
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  border-radius: 0 0 20rpx 20rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.15);
  z-index: 2;
  .header {
    width: 100%;
    padding: 30rpx;
    font-weight: 500;
    box-sizing: border-box;
    color: #666666;
    .msg {
      display: flex;
      width: 100%;
      height: 30rpx;
      align-items: center;
      margin-bottom: 30rpx;
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
          margin-left: 10rpx;
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
  padding: 545rpx 0 0 160rpx;
  box-sizing: border-box;
  .right-box {
    width: 100%;
    padding: 0 30rpx 20rpx;
    box-sizing: border-box;
  }
}
</style>
