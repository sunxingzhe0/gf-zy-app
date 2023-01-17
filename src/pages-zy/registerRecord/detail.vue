<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="top-tip" v-if="tipsText"> 温馨提示：{{ tipsText }} </view>
    <view class="panWrap">
      <app-card styles="padding: 30rpx;position:relative;">
        <app-list-item
          label="姓名"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="perName"
          noBorder
        ></app-list-item>
        <app-list-item
          label="医院"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.hospitalName"
          noBorder
        ></app-list-item>
        <app-list-item
          label="科室"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.deptName"
          noBorder
        ></app-list-item>
        <app-list-item
          label="医生"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="`${info.doctorName}  ${info.doctorTitle || ''}`"
          noBorder
        ></app-list-item>
        <app-list-item
          label="预约时段"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          value="消化内科"
          noBorder
        >
          <view class="flex_1 flex-between">
            <view style="color:red">{{ info.appointmentDate }}</view>
            <text class="tag today" v-if="type == 1 && info.today">当日</text>
            <text class="tag on" v-if="type == 4">已退</text>
          </view>
        </app-list-item>

        <!-- <view class="headerImg">
          <default-img :url="FILE_URL(info.doctorAvatar)"></default-img>
        </view> -->
      </app-card>
      <app-card styles="padding: 30rpx;">
        <app-list-item
          label="单据号"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.billData"
          noBorder
        ></app-list-item>
        <app-list-item
          label="门诊号"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.outSno || '-'"
          noBorder
        ></app-list-item>
        <app-list-item
          label="项目"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.name"
          noBorder
        ></app-list-item>
        <app-list-item
          label="号源类型"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.noTypeName || '-'"
          noBorder
        ></app-list-item>
        <app-list-item
          label="金额"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="`￥${parseFloat(info.fee).toFixed(2)}`"
          noBorder
        >
          <view class="flex_1 flex-between">
            <view style="color:red">{{
              `￥${parseFloat(info.fee).toFixed(2)}`
            }}</view>
          </view>
        </app-list-item>
        <app-list-item
          label="创建时间"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.createTime"
          noBorder
        ></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;" v-if="type != 4">
        <app-list-item
          label="支付号"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.hisPayId || '-'"
          noBorder
        ></app-list-item>
        <app-list-item
          label="支付方式"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.payWay || '-'"
          noBorder
        ></app-list-item>
      </app-card>
      <app-card styles="padding: 30rpx;" v-if="type == 4">
        <app-list-item
          label="退费金额"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="`￥${parseFloat(info.fee).toFixed(2)}`"
          noBorder
        ></app-list-item>
        <app-list-item
          label="退费流水号"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.hisPayId || '-'"
          noBorder
        ></app-list-item>
        <app-list-item
          label="退费方式"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="info.payWay || '-'"
          noBorder
        ></app-list-item>
      </app-card>
    </view>
  </view>
</template>
<script>
import { registrationRecord } from '../api/outpatient'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import dayjs from 'dayjs'
import { getNoInfo } from '@/common/request/userAppointment'
export default {
  components: {
    AppCard,
    AppListItem,
  },
  data() {
    return {
      isOpen: false,
      payType: '1',
      info: {},
      type: '',
      perName: '',
      patientCard: '',
      id: '',
      patientId: '',
      lineUpInfo: null,
    }
  },
  onLoad(option) {
    this.type = option.type
    this.perName = option.perName
    this.patientCard = option.patientCard
    this.id = option.id
    this.patientId = option.patientId
    this.getRegistrationRecord()
  },
  computed: {
    tipsText() {
      let str = ''
      //1 核酸混检
      if (this.info.doctorName === '彭晶晶' && this.info.name === '核酸检测') {
        return '如需退号，请到门诊收费室咨询退费'
      }
      //3 当日且还未就诊
      if (this.info.today && this.type == 1) {
        str = this.lineUpInfo.currentNo
          ? `${this.lineUpInfo.currentNo}号正在就诊，您还需等待 ${this.lineUpInfo.waitCount} 位，请及时前往就诊。`
          : '如需退号，请到门诊收费室咨询退费'
        return str
      }
      //2 当日且预约开始时间半个小时以内 --带时段的不是核酸检测
      if (this.info.appointmentDate) {
        let [visitDate, rangTime] = this.info.appointmentDate.split(' ')
        if (
          this.info.today &&
          dayjs().isAfter(
            dayjs(visitDate + ' ' + rangTime.split('~')[0] + ':00').subtract(
              30,
              'minutes',
            ),
          ) &&
          dayjs().isBefore(
            dayjs(visitDate + ' ' + rangTime.split('~')[1] + ':00'),
          ) &&
          this.type == 2
        ) {
          return '您的预约时间快到了，请及时前往取号'
        }
      }
    },
  },
  methods: {
    //获取排队信息
    async getLineUp() {
      this.lineUpInfo = await getNoInfo({ cardNo: this.patientCard })
    },

    dayjs,
    async getRegistrationRecord() {
      uni.showLoading()
      let list = await registrationRecord({
        visitNo: this.id,
        patientId: this.patientId,
        type: this.type,
      })
      this.info = list[0] || {}
      uni.hideLoading()
      console.log(this.type, '=----------------')
      //获取详情后获取排队信息 ---- 当天且已取号
      if (this.info.today && this.type == 1) {
        this.getLineUp()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.panWrap {
  padding: 20rpx;

  .tag {
    width: 90rpx;
    height: 40rpx;
    background: #f0f0f0;
    font-size: 22rpx;
    text-align: center;
    line-height: 40rpx;

    &.on {
      color: #ff4500;
      background: rgba(255, 69, 0, 0.2);
    }
    &.today {
      background: #ffead6;
      color: #fe7e00;
    }
  }
}

.top-tip {
  height: 54rpx;
  line-height: 52rpx;
  padding-left: 20rpx;
  background-color: #fae2e2;
  color: #e45b5b;
  font-size: 24rpx;
}

.headerImg {
  position: absolute;
  right: 20rpx;
  top: 30rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
}
</style>
