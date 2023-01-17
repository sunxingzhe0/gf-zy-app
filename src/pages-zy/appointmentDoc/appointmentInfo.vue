<template>
  <view style="padding: 20rpx; padding-bottom: 130rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 对应医生 -->
    <view class="docBox box-shadow">
      <view class="flex-start-start docInfo">
        <view class="icon">
          <default-img
            :url="FILE_URL(docInfo.img || docInfo.avatar)"
          ></default-img>
        </view>
        <view class="info">
          <view class="infoText">
            <view class="docName">
              <text class="mr-20 font-weight">{{
                docInfo.docName || docInfo.name
              }}</text
              >{{ docInfo.docTitle || '' }}
            </view>
            <p>{{ deptInfo.deptName || '' }}</p>
            <text>任职医院：{{ deptInfo.orgName || '' }}</text>
          </view>
        </view>
      </view>
      <view class="goodAt border_b" v-if="isgoodAt">
        <view class="border_b" style="padding-right: 30rpx;margin-top: 30rpx;">
          <view class="title" v-show="docInfo.good || docInfo.skilled"
            >擅长</view
          >
          <view
            :class="['content', isgoodAt ? '' : 'text-clamp']"
            v-show="docInfo.good || docInfo.skilled"
          >
            {{ docInfo.good || docInfo.skilled || '' }}
          </view>
        </view>
        <view style="padding-right: 30rpx;margin-top: 30rpx;">
          <view class="title">个人简介</view>
          <view class="content">
            {{ docInfo.intro || '暂无' }}
          </view>
        </view>
      </view>
      <view class="openbtn font28 flex-center" @click="isgoodAt = !isgoodAt">
        {{ isgoodAt ? '收起' : '更多医生详细信息' }}
        <uni-icons
          :type="isgoodAt ? 'arrowup' : 'arrowdown'"
          color="#0AB2C1"
          size="12"
        ></uni-icons>
      </view>
    </view>

    <!-- 明星专家的科室 -->
    <view
      v-if="fromDocList || starIn"
      class="docBox box-shadow goodAt"
      style="padding-right:30rpx"
    >
      <view class="depts">
        <view
          class="dept-item"
          :class="activeDept === i ? 'active' : ''"
          v-for="(item, i) in depts"
          :key="i"
          @click="selectDept(item, i)"
          >{{ item.name }}</view
        >
      </view>

      <view class="title">科室介绍</view>
      <view class="content">
        {{ introduce || '暂无' }}
      </view>
    </view>

    <app-card
      styles="padding: 0;padding-left:30rpx;"
      v-if="!starIn && !fromDocList"
    >
      <app-list-item
        label="就诊人"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
        textStyle="font-size:30rpx;color:#333"
      >
        <!-- 挂号付费页禁用就诊人选择 -->
        <view class="flex_1">
          <select-patient
            textStyle="color:#666;"
            :inperId="inperId"
            :disabled="true"
            @patientLoad="changePatient"
          ></select-patient>
        </view>
      </app-list-item>
      <app-list-item
        label="号源类型"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
        textStyle="font-size:30rpx;color:#333"
      >
        <view class="flex_1 text-right color666"
          >{{
            docInfo.scheduleLists[0].noType == 2
              ? '专家号'
              : docInfo.scheduleLists[0].noType == 1
              ? '普通号'
              : '核酸检测'
          }}<text class="colorred"></text
        ></view>
      </app-list-item>
      <!-- <app-list-item
        label="项目名称"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
        textStyle="font-size:30rpx;color:#333"
      >
        <view class="flex_1 text-right color666"
          >{{ docInfo.scheduleLists[0].itemName || '-'
          }}<text class="colorred"></text
        ></view>
      </app-list-item> -->
    </app-card>

    <app-card
      styles="padding: 0;padding-left:30rpx;"
      v-if="!starIn && !fromDocList"
    >
      <app-list-item
        label="就诊日期"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
        textStyle="font-size:30rpx;color:#333"
      >
        <view class="flex_1 text-right color666"
          >{{ activeDate }} （{{ week[dayjs(activeDate).format('d')] }}）
          {{ adtiveOrderTime.shiftName ? adtiveOrderTime.shiftName : '' }}</view
        >
      </app-list-item>
      <app-list-item
        label="诊疗费"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
        textStyle="font-size:30rpx;color:#333"
      >
        <view class="flex_1 text-right"
          ><text class="colorred"
            >{{
              (docInfo.scheduleLists[0].noType == '普通'
                ? docInfo.scheduleLists[0].regFee
                : docInfo.scheduleLists[0].expertFee) ||
                priceInfo ||
                '-'
            }}元</text
          ></view
        >
      </app-list-item>
    </app-card>

    <!-- 预约时段 -->
    <view
      class="mt-20 box-shadow"
      style="overflow: hidden;"
      v-if="!starIn && !fromDocList"
    >
      <!-- <OrderTime
        :deptId="deptId"
        :active="activeDate"
        @selectDay="showCurrentDate"
      ></OrderTime> -->
      <!-- 核酸挂号时段显示 -->
      <view class="nucleic-acid" v-if="deptInfo.deptName === '核酸检测门诊'">
        <view>{{ docInfo.sbsj || timeText || '' }}</view>
        <view>剩余 {{ docInfo.surplus || orderTimeList.length || '-' }}</view>
      </view>
      <!-- 门诊挂号时段显示 -->
      <view class="orderTimeBox" v-else>
        <view
          :class="[
            shiftIndex == index ? 'timePart activeBackground' : 'timePart',
          ]"
          v-for="(item, index) in orderTimeList"
          @click="changeDate(item, index)"
          :key="index"
        >
          <view style="width:100%">
            <view class="flex-between" style="width:100%">
              <view class="date"
                >{{ docInfo.sbsj || timeText || '' }}
                {{ item.beginTime + '-' + item.endTime }}</view
              >
              <!-- <view class="date">号源编号：{{ item.periodNo }}</view> -->
            </view>
            <view
              >{{ activeDate }}（{{
                week[dayjs(activeDate).format('d')]
              }}）</view
            >
          </view>
        </view>
        <view style="padding-top: 200rpx;" v-if="orderTimeList.length == 0">
          <NoData styles="margin-top:0;"></NoData>
        </view>
      </view>
    </view>
    <!-- 确认预约 -->
    <button
      class="submit_btn"
      type="primary"
      @click="showPopup"
      :disabled="!isSubmit"
      v-if="!starIn && !fromDocList"
    >
      确认预约
    </button>
    <!-- 立即预约 -->
    <button
      v-if="fromDocList || starIn"
      class="submit_btn"
      type="primary"
      :class="isNoScheduling && 'no-next'"
      @click="openTime"
    >
      立即预约
    </button>
    <uni-popup ref="notice">
      <view class="dialog-content">
        <view class="dialogTitle">{{
          deptId == '8323' ? '新冠核酸检测告知书' : '预约就诊须知'
        }}</view>
        <scroll-view class="textBox" :scroll-y="true" v-if="deptId == '8323'">
          <!-- <view v-html="noticeContent"></view> -->
          <!-- <u-parse :content="hsNotice.content"></u-parse> -->
          <view v-html="hsNotice.content"></view>
        </scroll-view>
        <scroll-view v-else class="textBox" :scroll-y="true">
          <view class="title" v-if="deptNotice.notice">{{
            '科室预约须知'
          }}</view>
          <view class="text" v-if="deptNotice.notice">{{
            deptNotice.notice
          }}</view>
          <view class="title">{{ ghNotice.title }}</view>
          <view class="text" v-html="ghNotice.content"> </view>
        </scroll-view>
        <view class="noticeBtn" @click="toPay">我已了解</view>
      </view>
    </uni-popup>

    <!-- 选择时间 -->
    <uni-popup ref="timePop" type="bottom">
      <view class="dialog-content time-pop">
        <view class="dialogTitle">选择预约时间</view>
        <view class="textBox">
          <view class="time-scroll">
            <OrderTime
              :deptId="deptId"
              :active="activeDate"
              @selectDay="showCurrentDate"
            ></OrderTime>
          </view>
          <view class="time-list">
            <view
              class="dateList"
              v-for="(item, index) in doctorsList"
              :key="index"
            >
              <view
                :class="[
                  'flex-between dateLI',
                  parseInt(i.surplus) < 1 ? 'dis' : '',
                  i.active == h ? 'active-time' : '',
                ]"
                v-for="(i, h) in item.scheduleLists"
                :key="h"
                @click="activeTime(i, h, item.sbsj)"
              >
                <view class="flex1"
                  >{{ i.reverseDate }}（{{
                    week[dayjs(i.reverseDate).format('d')]
                  }}）{{ ' ' }}{{ item.sbsj || '' }}{{ ' ' }}
                  {{ item.rangeTime || '' }}</view
                >
                <view class="flex-start-center">
                  <view v-if="parseInt(i.surplus) < 1">约满</view>
                  <view v-else>剩余 {{ parseInt(i.surplus) }}</view>
                  <!-- <uni-icons
                    type="arrowright"
                    color="#666"
                    size="12"
                  ></uni-icons> -->
                </view>
              </view>
            </view>
            <view style="padding-top: 50rpx;" v-if="doctorsList.length == 0">
              <NoData styles="margin-top:0;"></NoData>
            </view>
          </view>
        </view>
        <view class="noticeBtn submit-icon" @click="confirmTime">确认</view>
      </view>
    </uni-popup>
    <!-- 支付列表 -->
    <popup-pay
      ref="pay"
      :type="true"
      @success="paysuccess"
      @payTap="orderPay"
      @cancel="payCancel"
    ></popup-pay>
  </view>
</template>
<script>
import OrderTime from '../components/OrderTime.vue'
import NoData from '../components/NoData'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import selectPatient from '../components/selectPatient.vue'
import popPay from '../components/pop-pay/index.vue'
import dayjs from 'dayjs'
import {
  saveAppointment,
  getDocFsInfo,
  getDeptDetail,
  getRegDocPrice,
  getReverseDocInfo,
  getDeptInfoBySyncId,
  getRegDocDept,
} from '@/common/request/doctorAppointment'
import { submitAppointment } from '@/common/request/userAppointment.js'
import { getTjIns } from '../api/physical.js'
import { patientList } from '@/common/request/index.js'

export default {
  components: {
    OrderTime,
    NoData,
    AppCard,
    AppListItem,
    selectPatient,
    popPay,
  },
  data() {
    return {
      orderPayInfo: null,
      patientList: [],
      isSubmit: true,
      isClick: true,
      cbizId: '',
      priceInfo: '', //诊疗费
      timeText: '', //上下午
      noRepeats: [],
      fromDocList: false,
      docId: '',
      deptId: '',
      orgName: '',
      scheduleNo: '',
      isgoodAt: true,
      starIn: '',
      perId: '', // 就诊人id
      patientName: '',
      patientCard: '',
      ispay: false,
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      docInfo: {},
      adtiveOrderTime: {}, //选中时段
      activeDate: dayjs().format('YYYY-MM-DD'),
      payType: '1',
      // 预约时间段列表
      orderTimeList: [],
      shiftIndex: null,
      ghNotice: {},
      hsNotice: {},
      orgId: '',
      deptInfo: {},
      doctorsList: [],
      inperId: '',
      patienInfo: {},
      deptNotice: {},
      activeDept: 0,
      depts: [],
      introduce: '',
      isNoScheduling: false,
      hospId: '',
      //       noticeContent: `
      //       <p>一、受检人群:</p>
      //       <p style="text-indent:2em">1.来院人员请主动向工作人员出示渝康码、行程卡。</p>
      //       <p style="text-indent:2em">2.有发热症状（体温≥37.3℃）或中高风险地区旅居史患者请主动告知工作人员，前往发热门诊就诊。</p>
      //       <p style="text-indent:2em">3.黄码(渝康码黄色)、弹窗人员在“黄码”检测区采集核酸;</p>
      //       <p style="text-indent:2em">4.无发热等新冠相关症状和中高风险地区旅居史等健康码及行程码无异常的人员在“愿检尽检”核酸检测点采集核酸。</p>
      //       <p>二、标本采集时间:</p>
      //       <p style="text-indent:2em">我中心暂不提供核酸检测预约服务，
      // 对外提供核酸检测服务时间：绿码、橙色弹窗人员采集时间周一至周五9：00-12：00，18：00-22：00；周六、周日9：00-12：00，14：00-22：00。</br>
      // 黄码及渝康码异常人员核酸采集时间周一至周日9：00-12：00，16：00-21：00。</p>
      //       <p>三、结果查询及报告领取：</p>
      //       <p style="text-indent:2em">1.“应检尽检(单采单检)”采样后12小时内出具报告;“愿检尽检(混检10:1) ”采样后24小时内出具报告，采样后请务必保持电话畅通。</p>
      //       <p style="text-indent:2em">2.核酸检测结果可通过渝康码查询。需要纸质报告单的前往检验科打印纸质报告。</p>
      //       `,
    }
  },
  onLoad(option) {
    if (option) {
      //参数接收
      this.docId = option.docId
      this.deptId = option.deptId
      this.orgId = option.orgId
      this.starIn = option.starIn
      this.inperId = option.inperId
      this.basinsId = option.basinsId
      if (option.starIn) {
        uni.setNavigationBarTitle({
          title: '专家介绍',
        })
        this.getRegDocDept()
      }
      if (option.fromDocList) {
        uni.setNavigationBarTitle({
          title: '我的医生',
        })
        this.fromDocList = option.fromDocList
        this.getRegDocDept()
      }
      this.docInfo = JSON.parse(option.item)
      console.log(this.docInfo, '接收参数- 医生详情----------')
      this.scheduleNo = option.scheduleNo
      this.activeDate = option.date || dayjs().format('YYYY-MM-DD')
      this.getdeptInfo()
      // this.getdoctorIntro()
      this.getDeptNotice() //科室预约须知
      this.getDocFsInfoData()
      this.getPatientList()
    }
    this.getTjInsInfo()
  },
  mounted() {
    uni.$on('updateCard', async () => {
      console.log('更新就诊卡')
      this.patientList = await patientList()
    })
  },
  methods: {
    //获取就诊人列表
    async getPatientList() {
      this.patientList = await patientList()
    },
    //openTime 弹出选择时间
    openTime() {
      if (this.isNoScheduling) return
      this.$refs.timePop.open()
      this.getDocList()
    },
    //获取此医生科室列表
    async getRegDocDept() {
      this.depts = await getRegDocDept({ docId: this.docId })
      console.log('diaole=========')
      this.introduce = this.depts[0]?.intro
      this.deptId = this.depts[0]?.id
      this.hospId = this.depts[0]?.orgName
      this.searchScheduling()
    },
    //选择科室
    selectDept(item, i) {
      this.activeDept = i
      this.introduce = item.intro
      this.searchScheduling()
    },
    dayjs,
    changePatient(item) {
      this.perId = item.memberId
      this.patientCard = item.patientCard
      this.patientName = item.name
      this.patienInfo = item
    },
    //确认选择时间
    confirmTime() {
      //判断是否存在就诊人
      if (!this.patientList.length) {
        return uni.showModal({
          title: '系统提醒',
          content: '还未添加健康卡，是否立即前往添加？',
          success: res => {
            res.confirm &&
              uni.navigateTo({
                url: '/pages-user/patientManagement/add',
              })
          },
        })
      }
      // if (!this.scheduleNo) {
      //   uni.showToast({ title: '请选择预约时段', icon: 'none' })
      //   return
      // }
      // this.$refs.timePop.close()
      // this.fromDocList = false //显示其他模块
      // this.starIn = 0 //显示其他模块
      // this.getDocFsInfoData()

      // uni.setNavigationBarTitle({
      //   title: '预约挂号选择时间',
      // })
      //加入流调表流程
      const infoParams = {
        docId: this.docId,
        scheduleNo: this.scheduleNo,
        date: this.activeDate,
        deptId: this.deptId,
        orgId: this.orgId,
        item: JSON.stringify(this.docInfo),
        inperId: this.perId, //就诊人memberId
        hospId: this.hospId,
      }
      uni.navigateTo({
        url: `/pages-user/nucleicAcidAppointment/flowform/index?infoParams=${JSON.stringify(
          infoParams,
        )}&isform=3`,
      })
    },

    //查询是否存在排班
    async searchScheduling() {
      uni.showLoading()
      const res = await getRegDocPrice({
        docId: this.docId,
        deptId: this.deptId || '',
      })
      uni.hideLoading()
      console.log(res, '排班信息--------')
      // if (!res) {
      //   uni.showModal({
      //     title: '提示',
      //     content: '该医生暂无排班，是否更换预约？',
      //     success: res => {
      //       if (!res.confirm) return
      //       console.log(123)
      //       uni.navigateTo({ url: '/pages-zy/appointmentDoc/deptList' })
      //     },
      //   })
      //   return
      // }

      //有排班
      // this.$refs.timePop.open()
      // this.getDocList()
      if (!res) {
        this.isNoScheduling = true
      } else {
        this.isNoScheduling = false
      }
    },
    //选中上下午
    activeTime(i, h, timeText) {
      this.$set(i, 'active', h)
      this.scheduleNo = i.scheduleNo
      this.priceInfo = i.expertFee
      this.timeText = timeText
    },
    //挂号须知 核酸检测预约须知
    async getTjInsInfo() {
      this.ghNotice = await getTjIns({
        type: 0,
      })
      if (this.ghNotice.content) {
        this.ghNotice.content = this.ghNotice.content.replace(/&nbsp;/g, '\xa0')
      }
      this.hsNotice = await getTjIns({
        type: 3,
      })
      if (this.hsNotice.content) {
        this.hsNotice.content = this.hsNotice.content.replace(/&nbsp;/g, '\xa0')
      }
    },
    //科室预约须知
    async getDeptNotice() {
      this.deptNotice = await getDeptInfoBySyncId({
        syncId: this.deptId,
      })
    },
    //获取科室详情
    async getdeptInfo() {
      this.deptInfo = await getDeptDetail({
        deptId: this.deptId,
        orgId: this.orgId,
      })
    },

    // 获取医生详情
    // async getdoctorIntro() {
    //   let list = await getReverseDocInfo({
    //     orgId: this.orgId,
    //     deptId: this.deptId,
    //     beginDate: this.activeDate,
    //     endDate: this.activeDate,
    //     doctorId: this.docId,
    //     resource: 2,
    //   })

    //   // this.docInfo = list[0]
    //   console.log(this.docInfo)
    // },

    // 获取时间段
    async getDocFsInfoData() {
      uni.showLoading()
      this.isSubmit = false
      this.adtiveOrderTime = {}
      this.shiftIndex = null
      let list = await getDocFsInfo({
        //新增参数
        scheduleNo: this.scheduleNo,
        deptId: this.deptId,
        orgId: this.orgId,
        doctorId: this.docId,
        visitDate: this.activeDate,
      })
      list.forEach((item, index) => {
        if (parseInt(item.leaveNo) > 0) {
          if (JSON.stringify(this.adtiveOrderTime) == '{}') {
            this.adtiveOrderTime = item
            this.shiftIndex = index
            return
          }
        }
      })
      this.orderTimeList = list
      uni.hideLoading()
      this.isSubmit = true
      // //去重
      // let obj = {}
      // list.forEach(val => {
      //   if (!obj[`${val.beginTime}-${val.endTime}`]) {
      //     obj[`${val.beginTime}-${val.endTime}`] = val.periodNo
      //   }
      // })
      // this.noRepeats = Object.keys(obj)
    },
    orderPay(e) {
      //取消支付后再次付款不需再次提交信息
      if (this.orderPayInfo) {
        return this.$refs.pay.payTypeC(
          this.orderPayInfo.tradeId,
          this.orderPayInfo.tradeType,
          this.orderPayInfo.payFee,
        )
      }
      //确认支付
      uni.showLoading()
      saveAppointment({
        deptId: this.deptId,
        deptName: this.deptInfo.deptName,
        orgId: this.orgId,
        doctorId: this.docId,
        doctorName: this.docInfo.docName || this.docInfo.name,
        doctorTitle: this.docInfo.docTitle || this.docInfo.titleName,
        orgName: this.deptInfo.orgName,
        memberId: this.perId,
        patientName: this.patientName,
        userId: uni.getStorageSync('userId'),
        diagnoseNo: this.patientCard,
        resourceNo:
          this.docInfo.scheduleLists[0].noType == '2'
            ? '专家'
            : this.docInfo.scheduleLists[0].noType == '3'
            ? '核酸检测'
            : '普通',
        visitDate: this.activeDate,
        startTime: this.adtiveOrderTime.beginTime,
        endTime: this.adtiveOrderTime.endTime,
        fee:
          this.docInfo.scheduleLists[0].noType == '普通'
            ? this.docInfo.scheduleLists[0].regFee
            : this.docInfo.scheduleLists[0].expertFee,
        creator: uni.getStorageSync('userId'),
        numberCode: this.docInfo.scheduleLists[0].scheduleNo,
        scheduleNo: this.docInfo.scheduleLists[0].scheduleNo,
        shiftCode: this.adtiveOrderTime.shiftCode,
        periodNo: this.adtiveOrderTime.periodNo,
        origin: 2, //来源 1-医生 2-患者
        resource: 2,
        basinsId: this.basinsId,
        entryType: this.basinsId ? true : false, //是否需要流调表id
      })
        .then(async res => {
          this.cbizId = res
          const params = {
            userId: uni.getStorageSync('userId'),
            bizId: res,
            bizType: 'RESERVE',
            agreement: true,
          }
          if (!this.isClick) {
            return uni.showToast({ title: '请勿重复点击', icon: 'none' })
          }
          this.isClick = false
          const data = await submitAppointment(params)
          uni.hideLoading()
          this.isClick = true
          if (data) {
            if (data.tradeId) {
              this.orderPayInfo = data //提交订单后保存支付信息
              this.$refs.pay.payTypeC(data.tradeId, data.tradeType, data.payFee)
            } else if (data.orderId) {
              this.$refs.pay.close()

              this.paysuccess(data.orderId)
            }
          }
        })
        .catch(err => {
          setTimeout(() => {
            uni.hideLoading()
          }, 2000)
        })
    },
    changeDate(item, index) {
      this.adtiveOrderTime = item
      this.shiftIndex = index
    },
    // 弹出层
    showPopup() {
      //随机选中时段一个
      if (this.deptInfo.deptName === '核酸检测门诊') {
        this.adtiveOrderTime = this.orderTimeList[
          Math.floor(Math.random() * this.orderTimeList.length) || 0
        ]
      }

      if (!this.adtiveOrderTime.beginTime) {
        uni.showToast({
          title: '请选择预约时段',
          icon: 'none',
        })
        return
      }
      this.$refs.notice.open()
    },
    async toPay() {
      this.$refs.notice.close()

      this.$refs.pay.show()
    },

    // 展示当前选中日期 title
    showCurrentDate(date) {
      this.activeDate = date.date
      // this.getdoctorIntro()
      // this.getDocFsInfoData()
      this.getDocList()
    },
    //获取医生列表
    async getDocList() {
      let res = await getReverseDocInfo({
        orgId: this.$store.state.userInfo.platOrgId,
        deptId: this.deptId,
        beginDate: this.activeDate
          ? this.activeDate
          : dayjs().format('YYYY-MM-DD'),
        endDate: this.activeDate
          ? this.activeDate
          : dayjs()
              .add(6, 'day')
              .format('YYYY-MM-DD'),
        resource: 2,
      })
      res.sort((a, b) => {
        return (
          new Date(`1970-01-01 ${a.rangeTime.split('-')[0]}`) -
          new Date(`1970-01-01 ${b.rangeTime.split('-')[0]}`)
        )
      })
      // console.log(res, '排序结果-----------')
      // 筛选出当前医生的排班

      this.doctorsList = res.filter(val => {
        return val.docId === this.docId
      })
      // console.log(this.doctorsList)
      this.docInfo.scheduleLists = this.doctorsList[0]?.scheduleLists
    },
    paysuccess(data) {
      uni.showToast({
        title: '支付成功！',
      })
      //跳详情
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages-user/myAppointment/detail?id=${this.cbizId}`,
        })
      }, 2000)
      // uni.redirectTo({
      //   url: '/pages-zy/myAppointment/list?state=2',
      // })
    },
    payCancel(value) {
      uni.navigateTo({
        url: '/pages-zy/myAppointment/list',
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import '~@/common/order.scss';

.docBox {
  padding: 30rpx 0 30rpx 0;
  background: #fff;
  margin-bottom: 20rpx;

  .icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
  }

  .docInfo {
    padding: 0 30rpx;
    margin-bottom: 20rpx;
  }

  .info {
    background: #fff;
    margin-left: 30rpx;

    .infoText {
      flex: 1;
      line-height: 50rpx;
      font-size: 28rpx;
      color: #373737;

      .docName {
        span {
          font-size: 32rpx;
          color: #333333;
          margin-right: 30rpx;
        }
      }
    }
  }

  .openbtn {
    color: $uni-color-primary;
    width: 100%;
    font-size: 24rpx;
  }

  .border_b {
    border-bottom: 1px solid #e6e6e6;
  }
}
.pl30 {
  padding-left: 30rpx;
}
.goodAt {
  margin-bottom: 20rpx;
  padding-left: 30rpx;

  .title {
    font-size: 30rpx;
    border-left: 4rpx solid #0ab2c1;
    line-height: 30rpx;
    padding-left: 10rpx;
    color: #333;
    font-weight: bold;
  }

  .content {
    font-size: 26rpx;
    color: #666;
    line-height: 38rpx;
    margin: 30rpx 0;
  }
}

.priceBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75rpx;
  padding: 0 20rpx;
  background: #fff;
  font-size: 28rpx;
  margin-bottom: 15rpx;

  .priceName {
    color: #646464;
  }

  .priceNum {
    color: #ff4500;
  }
}

.changeDate {
  padding: 20rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #e9eff4;

  .showDate {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(100, 100, 100, 1);
  }

  img {
    width: 20rpx;
    height: 10rpx;
  }
}
.nucleic-acid {
  padding: 30rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
}
.orderTimeBox {
  padding: 30rpx;
  background: #fff;

  .timePart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    color: #666;
    font-size: 24rpx;
    background: #f1f1f1;

    .date {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .num {
      font-size: 30rpx;
      color: #333;
    }

    .full {
      color: #999;
    }
  }

  .activeBackground {
    background: $uni-color-primary;
    color: #fff;

    .date {
      color: #fff;
    }

    .num {
      color: #fff;
    }
  }
}

.zhifu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75rpx;
  padding: 0 20rpx;
  background: #fff;
  font-size: 28rpx;
  margin-bottom: 15rpx;

  .zhifuTitle {
    position: relative;
    margin-left: 15rpx;

    span {
      position: absolute;
      top: 0;
      left: -15rpx;
      color: #ff4500;
      font-size: 28rpx;
    }
  }

  .zhifuNameBox {
    width: 300rpx;
    height: 75rpx;
    line-height: 75rpx;
    font-weight: 600 !important;
  }
}

.dialog-content {
  padding: 45rpx 0;
  width: 600rpx;
  background: #fff;
  border-radius: 30rpx;
  padding-bottom: 0;

  .dialogTitle {
    font-size: 32rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .textBox {
    font-size: 26rpx;
    line-height: 42rpx;
    color: #666;
    height: 600rpx;
    padding: 0 30rpx;
    box-sizing: border-box;

    .title {
      font-size: 28rpx;
      margin-bottom: 20rpx;
      color: #1a1a1a;
      margin-top: 40rpx;
      font-weight: bold;
    }

    .text {
      margin-bottom: 40rpx;
    }
  }

  .noticeBtn {
    width: 100%;
    height: 88rpx;
    border-top: 1rpx solid #e9eff4;
    line-height: 88rpx;
    text-align: center;
    color: $uni-color-primary;
  }
}
.time-pop {
  width: 100%;
  .dialogTitle {
    padding-bottom: 15px;
    border-bottom: 1px solid #f2f2f2;
  }
  .dateList {
    font-size: 28rpx;
    color: #373737;
    // padding-left: 30rpx;
    border-top: 1px solid #e6e6e6;

    .dateLI {
      height: 88rpx;
      padding-right: 30rpx;
      border-bottom: 1px solid #e6e6e6;
    }
    .active-time {
      color: #0ab2c1;
    }
    .dis {
      color: #999;
    }
  }
  .submit-icon {
    background-color: #0ab2c1;
    color: #fff;
  }
}
.depts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 30rpx;
  .dept-item {
    width: 310rpx;
    height: 60rpx;
    border-radius: 30rpx;
    background: #f2f2f2;
    color: #4d4d4d;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30rpx;
  }
  .active {
    background: #0ab2c1;
    color: #fff;
  }
}
.no-next {
  background: #ccc !important;
  color: #fff;
}
</style>
