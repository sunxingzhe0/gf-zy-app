<template>
  <view style="padding-top: 150rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar>
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="健康卡"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0 }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
        </view>

        <app-list-item label="选择时间" :styles="{ padding: '16rpx 30rpx' }">
          <view class="flex_1 text-right color666 flex-end-start">
            <select-date-range
              :date="rangeData"
              @confirm="dateChange"
            ></select-date-range>
          </view>
        </app-list-item>
      </template>
    </topbar>
    <!--左菜单栏-->
    <leftTab
      :tabs="tabs"
      styles="top:190rpx;"
      :active="tabs[0].key"
      @change="topbarChange"
    ></leftTab>
    <view class="sticky mt-20">
      <!--门诊-->
      <template v-if="active == 0">
        <app-card
          styles="padding:20rpx 0;position:relative;"
          v-for="(item, index) in outpatient"
          :key="index"
        >
          <app-list-item
            label="就诊人"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1 text-right flex-between">
              <text>{{ perName }}</text>
              <view class="perName">门诊</view>
            </view>
          </app-list-item>
          <app-list-item
            label="就诊时间"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.regDate"
            noBorder
          ></app-list-item>
          <app-list-item
            label="坐诊医生"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1">
              <view
                >{{ item.doctorName || '-' }} {{ item.docRank || '-' }}</view
              >
            </view>
          </app-list-item>
          <app-list-item
            label="就诊科室"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.deptName || '-'"
            noBorder
          ></app-list-item>
          <!-- :value="`￥${parseFloat(item.amount).toFixed(2) || '-'}`" -->
          <app-list-item
            label="门诊诊断"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.diag || '-'"
            noBorder
          ></app-list-item>
          <!-- <app-list-item label="支付状态" :styles="{padding:'5rpx 30rpx'}" noBorder>
            <view class="flex_1 flex-between">
              <view>{{getstate(item.payStatus)}}</view>
            </view>
          </app-list-item> -->
          <view
            class="goinfo"
            @click="
              goto(
                `/pages-zy/medicalRecords/detail?visitNo=${item.visitNo}&patientId=${perId}&regDate=${item.regDate}&doctorName=${item.doctorName}`,
              )
            "
            >查看详情</view
          >
        </app-card>
        <NoData v-if="outpatient.length == 0 || outpatient === true"></NoData>
      </template>
      <!--住院-->
      <template v-if="active == 1">
        <app-card
          styles="padding: 20rpx 0;position:relative;"
          v-for="(item, index) in hospitalList"
          :key="index"
        >
          <app-list-item
            label="就诊人"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1 text-right flex-between">
              <text>{{ perName }}</text>
              <view class="perName">住院</view>
            </view>
          </app-list-item>
          <app-list-item
            label="入院时间"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.admitDtime"
            noBorder
          ></app-list-item>
          <app-list-item
            label="出院时间"
            v-if="item.dischargeDtime"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.dischargeDtime || '-'"
            noBorder
          ></app-list-item>
          <app-list-item
            label="入院科室"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.deptAdmitName"
            noBorder
          ></app-list-item>
          <app-list-item
            label="出院科室"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.deptDischargeName || '-'"
            noBorder
          ></app-list-item>
          <app-list-item
            :label="item.admitDiag ? '入院诊断' : '出院诊断'"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.admitDiag || item.outDiag || '-'"
            noBorder
          ></app-list-item>
          <view
            class="goinfo"
            @click="
              goto(
                `/pages-zy/hospRecords/detail?inSno=${item.inSno}&times=${item.inTimes}&beginTime=${item.admitDtime}&endTime=${item.dischargeDtime}&cardNo=${cardNo}`,
              )
            "
            >查看详情</view
          >
        </app-card>
        <NoData
          v-if="hospitalList.length == 0 || hospitalList == true"
        ></NoData>
      </template>
      <!--体检-->
      <template v-if="active == 2">
        <app-card
          styles="padding: 20rpx 0;position:relative;"
          v-for="(item, index) in bodyList"
          :key="index"
        >
          <app-list-item
            label="就诊人"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1 text-right flex-between">
              <text>{{ perName }}</text>
              <view class="perName">体检</view>
            </view>
          </app-list-item>
          <app-list-item
            label="体检时间"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.regDate"
            noBorder
          ></app-list-item>
          <app-list-item
            label="体检单号"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.checkupNo"
            noBorder
          ></app-list-item>
          <app-list-item
            label="体检内容"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.packageName"
            noBorder
          ></app-list-item>
          <app-list-item
            label="报告时间"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.reportTime || '-'"
            noBorder
          ></app-list-item>
          <app-list-item
            label="体检费用"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="`￥${parseFloat(item.fee).toFixed(2) || '-'}`"
            noBorder
          ></app-list-item>
          <!-- <app-list-item label="支付状态" :styles="{padding:'5rpx 30rpx'}" noBorder>
            <view class="flex_1 flex-between">
              <view>{{item.payState}}</view>
            </view>
          </app-list-item> -->
          <view
            class="goinfo"
            @click="
              goto(
                `/pages-zy/physical/report/detail?checkupNo=${item.checkupNo}&patientId=${perId}`,
              )
            "
            >查看详情</view
          >
        </app-card>
        <NoData v-if="bodyList.length == 0"></NoData>
      </template>
      <!--在线咨询，在线复诊，慢病续方-->
      <template
        v-if="
          active == 'CONSULT' ||
            active == 'REPEAT_CLINIC' ||
            active == 'CARRYON_PRESC'
        "
      >
        <app-card
          styles="padding: 20rpx 0;position:relative;"
          v-for="(item, index) in olineList"
          :key="index"
        >
          <app-list-item
            label="就诊人"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1 text-right flex-between">
              <text>{{ item.patientName }}</text>
              <view class="perName">{{
                active == 'CONSULT'
                  ? '在线咨询'
                  : active == 'REPEAT_CLINIC'
                  ? '在线复诊'
                  : '慢病续方'
              }}</view>
            </view>
          </app-list-item>
          <!-- <app-list-item label="业务单号" :styles="{padding:'5rpx 30rpx'}" noBorder>
            <view class="flex_1" style="width: 300rpx; word-wrap:break-word;">{{item.id}}</view>
          </app-list-item> -->
          <app-list-item
            label="接诊医生"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1"
              >{{ item.doctorName }} {{ item.title }} {{ item.deptName }}</view
            >
          </app-list-item>
          <app-list-item
            label="接诊时间"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="item.visitDate"
            noBorder
          ></app-list-item>
          <app-list-item
            label="诊断内容"
            v-if="active != 3 && active != 'CONSULT'"
            :styles="{ padding: '5rpx 30rpx' }"
            noBorder
          >
            <view class="flex_1 flex-between">
              <view>{{ item.diagnose || '-' }}</view>
            </view>
          </app-list-item>
          <app-list-item
            label="就诊费用"
            :styles="{ padding: '5rpx 30rpx' }"
            :value="`￥${parseFloat(item.bizFee).toFixed(2) || '-'}`"
            noBorder
          ></app-list-item>
          <!-- <app-list-item label="支付状态" :styles="{padding:'5rpx 30rpx'}" noBorder>
            <view class="flex_1 flex-between">
              <view>{{getstate(item.bizStatus)}}</view>
            </view>
          </app-list-item> -->
          <view class="goinfo" @click="toChat(item)">查看详情</view>
        </app-card>
        <NoData v-if="olineList.length == 0"></NoData>
      </template>
    </view>
  </view>
</template>
<script>
import dayjs from 'dayjs'
import selectPatient from '../components/selectPatient.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import NoData from '../components/NoData'
import selectDateRange from '../components/selectDateRange.vue'
import leftTab from '@/components/leftTab/index.vue'
import {
  outpatientRecord,
  hospitalRecord,
  phyList,
  webMedicalList,
} from '../api/user.js'
export default {
  components: {
    selectPatient,
    AppCard,
    AppListItem,
    NoData,
    selectDateRange,
    leftTab,
  },
  data() {
    return {
      tabs: [
        {
          title: '门诊',
          key: 0,
        },
        {
          title: '住院',
          key: 1,
        },
        // {
        //   title: '体检',
        //   key: 2,
        // },
        // {
        //   title: '在线咨询',
        //   key: 'CONSULT',
        // },
        // {
        //   title: '在线复诊',
        //   key: 'REPEAT_CLINIC',
        // },
        // {
        //   title: '慢病续方',
        //   key: 'CARRYON_PRESC',
        // },
      ],
      active: 0,
      perId: '',
      cardNo: '',
      perName: '',
      rangeData: [
        dayjs()
          .subtract(1, 'months')
          .format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD'),
      ],
      outpatient: [], //门诊
      hospitalList: [], //住院
      bodyList: [], // 体检
      olineList: [], //互联网
      isquick: true,
      pageSize: 10,
      currentNum: 1,
      pages: 1,
    }
  },
  methods: {
    dateChange(e) {
      this.rangeData = e
      this.topbarChange(this.active)
    },
    changePatient(item) {
      this.perId = item.memberId
      this.cardNo = item.patientCard
      this.perName = item.name
      this.topbarChange(this.active)
    },
    getstate(state) {
      if (state == 0) {
        return '未支付'
      } else if (state == 1) {
        return '已支付'
      } else if (state == 2) {
        return '已退款'
      }
    },
    //门诊
    async getoutpatientRecord() {
      uni.showLoading()
      this.outpatient = await outpatientRecord({
        cardNo: this.cardNo,
        beginDate: this.rangeData[0] || '',
        endDate: this.rangeData[1] || '',
      })
      uni.hideLoading()
    },
    //住院
    async gethospitalRecord() {
      uni.showLoading()
      this.hospitalList = await hospitalRecord({
        cardNo: this.cardNo,
        beginDate: this.rangeData[0] || '',
        endDate: this.rangeData[1] || '',
      })
      uni.hideLoading()
    },
    //体检
    async getphyList() {
      this.bodyList = await phyList({
        cardNo: this.cardNo,
        beginDate: this.rangeData[0] || '',
        endDate: this.rangeData[1] || '',
      })
    },
    //互联网业务
    async getwebMedicalList() {
      let data = await webMedicalList({
        userId: uni.getStorageSync('userId'),
        orgId: this.$store.state.userInfo.orgId,
        type: 'outer',
        bizType: this.active,
        memberIds: this.perId,
        startDate: this.rangeData[0] || '',
        endDate: this.rangeData[1] || '',
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        status: true,
      })
      this.olineList = this.olineList.concat(data.data)
      this.pages = data.pages
    },
    toChat({ orderId }) {
      uni.navigateTo({
        url: `/pages-user/chat/chat?orderId=${orderId}`,
      })
    },
    topbarChange(state) {
      this.active = state
      if (this.active == 0) {
        this.getoutpatientRecord()
      }
      if (this.active == 1) {
        this.gethospitalRecord()
      }
      if (this.active == 2) {
        this.getphyList()
      }
      if (
        this.active == 'CONSULT' ||
        this.active == 'REPEAT_CLINIC' ||
        this.active == 'CARRYON_PRESC'
      ) {
        this.olineList = []
        this.currentNum = 1
        this.pages = 1
        this.getwebMedicalList()
      }
    },
    // 选择就诊人
    changePer(e) {
      this.loading = false
      this.perId = e.id
      this.cardNo = e.patientCard
      this.perName = e.name
      this.tabChange()
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      })
    },
  },
  onReachBottom() {
    if (
      this.active == 'CONSULT' ||
      this.active == 'REPEAT_CLINIC' ||
      this.active == 'CARRYON_PRESC'
    ) {
      if (this.currentNum < this.pages) {
        this.currentNum = this.currentNum + 1
        this.getwebMedicalList()
      }
    }
  },
}
</script>
<style scoped lang="scss">
.sticky {
  padding: 20rpx;
  padding-left: 180rpx;

  .perName {
    font-size: 26rpx;
    color: $uni-color-primary;
  }

  .goinfo {
    color: $uni-color-primary;
    font-size: 28rpx;
    text-align: center;
    padding-top: 20rpx;
    border-top: 1px solid #e6e6e6;
    margin-top: 20rpx;
  }
}
</style>
