<template>
  <view class="preview">
    <app-card styles="margin: 20rpx; padding: 0">
      <view class="doctor-profile">
        <view class="doctor-avtar">
          <!-- <image
            class="avtar-img"
            v-if="info.img"
            :src="FILE_URL(info.img)"
          ></image> -->
          <default-img
            v-if="itemInfo.img"
            :url="FILE_URL(itemInfo.img)"
          ></default-img>
          <image
            class="avtar-img"
            v-else-if="userId == this.itemInfo.docId"
            :src="FILE_URL($store.state.avatar)"
          ></image>
          <image
            class="avtar-img"
            v-else
            :src="require('@/assets/user/user_d_head.png')"
          ></image>
        </view>
        <view class="doctor-info">
          <view class="info-texts">
            <view class="doctor-name">
              {{ itemInfo.docName || order.doctorName }}
            </view>
            <view class="doctor-title">
              {{ itemInfo.docTitle || order.titleName }} |
              {{ deptInfo.deptName || order.deptName }}
            </view>
          </view>
          <view class="toogle-btn" @click="changeDoctor">更换</view>
        </view>
      </view>
      <view class="doctor-goodat" v-show="introExpand">
        <view class="card-title">擅长</view>
        <view class="card-text">
          {{ itemInfo.good || '' }}
        </view>
      </view>
      <view class="doctor-introduce" v-show="introExpand">
        <view class="card-title">个人简介</view>
        <view class="card-text">{{ itemInfo.intro || '' }}</view>
      </view>
      <view class="toogle-explan" @click="introExpand = !introExpand">
        {{ introExpand ? '收起' : '更多医生详细信息' }}
        <image
          class="expand-icon"
          :class="{ up: introExpand }"
          :src="require('@/assets/zhankai@2x.png')"
        ></image>
      </view>
    </app-card>
    <app-card styles="margin: 20rpx; padding: 0">
      <app-list-item
        label="就诊人"
        :value="order.memberName"
        className="preview"
      ></app-list-item>
      <app-list-item
        label="就诊卡号"
        :value="order.patientCard"
        className="preview"
      ></app-list-item>
      <app-list-item label="号源类型" className="preview">
        <view class="flex-between" @click="$refs.noTypes.open()">
          <view>{{
            noType == 1 ? '普通号' : noType == 2 ? '专家号' : ''
          }}</view>
          <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
        </view>
      </app-list-item>
    </app-card>
    <app-card styles="margin: 20rpx; padding: 0">
      <!-- <app-list-item
        v-if="dateIndex > -1 && scheduleItem"
        label="就诊日期"
        className="preview"
        :value="
          scheduleItem.reverseDate +
            '（' +
            formatDay(scheduleItem.reverseDate) +
            '）' +
            (timeList[timeIndex].shiftName || '')
        "
      ></app-list-item> -->
      <app-list-item
        v-if="itemInfo.scheduleLists[0]"
        label="就诊日期"
        className="preview"
        :value="
          itemInfo.scheduleLists[0].reverseDate +
            '（' +
            formatDay(itemInfo.scheduleLists[0].reverseDate) +
            '）'
        "
      ></app-list-item>
      <app-list-item v-if="doctorIndex > -1" label="诊疗费" className="preview">
        <view class="red" v-if="itemInfo.scheduleLists[0]">
          {{
            noType == '普通'
              ? itemInfo.scheduleLists[0].regFee
              : itemInfo.scheduleLists[0].expertFee
          }}元
        </view>
      </app-list-item>
    </app-card>
    <app-card v-if="scheduleLists" styles="margin: 20rpx; padding: 0;">
      <!-- <day-of-week
        :dateDatas="scheduleLists"
        :value="scheduleItem.reverseDate || ''"
        @change="onDateChange"
      ></day-of-week> -->
      <view class="period-list">
        <view
          v-for="(item, index) in [timeList[0]]"
          :key="index"
          class="period-item"
          :class="{ active: timeIndex === index && item.leaveNo > 0 }"
          @click="
            item.leaveNo > 0 &&
              (timeIndex = Math.floor(Math.random() * timeList.length) || 0)
          "
        >
          <view class="period-item-left">
            <view class="period-date" v-if="itemInfo.scheduleLists[0]">
              {{ FORMATDATE(itemInfo.scheduleLists[0].reverseDate, 'MM-dd') }}
              ({{ formatDay(itemInfo.scheduleLists[0].reverseDate) }})
              {{ `  ${department.sbsj || ''}` }}
            </view>
            <view class="period-time">
              {{ item.shiftName || '' }}
              {{ item.beginTime }} -
              {{ item.endTime }}
            </view>
          </view>
          <view
            class="period-item-right"
            :style="{ color: !surplus ? '#ccc' : '' }"
          >
            {{ `剩余${surplus}` || '约满' }}
          </view>
        </view>
      </view>
    </app-card>
    <button class="btn-submit" @click="submit">提交</button>

    <uni-popup ref="noTypes" type="center">
      <SelectPopup :list="noTypes" @change="onChangeNoType" />
    </uni-popup>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card/index'
import DayOfWeek from '@/components/app/day-of-week/index'
import AppListItem from '@/components/app/app-list-item/index'
import SelectPopup from '@/components/treatment/commons/selectPopup'
import {
  getAppointmentInfo,
  getReverseDocInfo,
  saveAppointment,
  refreshDoctorNo,
  getDeptDetail,
  getDocFsInfo,
  getSyncCode,
} from '@/common/request/doctorAppointment'
export default {
  components: {
    AppCard,
    DayOfWeek,
    AppListItem,
    SelectPopup,
  },
  props: {
    order: Object,
    department: {
      type: Object,
      default: {},
    },
    doctorIndexArr: Array,
    docInfo: Object,
  },
  data() {
    return {
      isSubmit: true,
      isChangeUrl: false,
      userId: uni.getStorageSync('userId'),
      doctorIndex: -1,
      dateIndex: -1,
      timeIndex: 0,
      date: '',
      noType: '',
      org: {},
      deptInfo: {},
      info: {},
      timeList: [],
      introExpand: false,
    }
  },
  computed: {
    noTypes() {
      return Array.from(
        new Set(this.info?.scheduleLists?.map(_ => _.noType)),
      ).map(value => ({
        value: value == 1 ? '普通号' : value == 2 ? '专家号' : '',
        checked: this.noType == value ? true : false,
      }))
    },
    scheduleLists() {
      return this.info?.scheduleLists
        ?.filter(_ => _.noType == this.noType)
        .map(_ => Object.assign(_, { date: _.reverseDate }))
    },
    scheduleItem() {
      const reverseDate =
        this.info.scheduleLists?.[this.dateIndex]?.reverseDate || ''
      return this.scheduleLists?.find(_ => _.reverseDate == reverseDate) || {}
    },
    orgId() {
      return this.department?.orgCode || this.org.orgCode
    },
    orgName() {
      return this.department?.orgName || this.org.orgName
    },
    deptId() {
      return this.department?.id || this.org.deptCode
    },
    doctorId() {
      return this.org.doctorCode || this.info.docId
    },
    doctorTitle() {
      return this.department?.docTitle || this.order.titleName
    },
    surplus() {
      return this.department?.surplus
    },
    itemInfo() {
      console.log(this.docInfo, '========')
      return this.docInfo
    },
  },
  async created() {
    this.doctorIndex = this.doctorIndexArr?.[0] ?? -1
    this.dateIndex = this.doctorIndexArr?.[1] ?? -1

    await this.getOrgCode()
    this.getInfo()
    this.getDept()
  },
  methods: {
    async getOrgCode() {
      if (this.department?.orgCode) return
      this.org = await getSyncCode({
        orgId: uni.getStorageSync('orgId'),
        deptId: this.order.deptId,
        doctorId: this.order.doctorId,
      })
      if (!this.org.orgCode) {
        this.$tip('该医生或科室不具备挂号资格')
        this.isChangeUrl = true
      }
    },
    async getInfo() {
      if (!this.orgId || !this.deptId) return

      const params = {
        deptId: this.deptId,
        orgId: this.orgId,
        beginDate: this.FORMATDATE(new Date(), 'yyyy-MM-dd'),
        // 结束时间：当前时间往后推7天
        endDate: this.FORMATDATE(
          +new Date() + 6 * 24 * 60 * 60 * 1000,
          'yyyy-MM-dd',
        ),
        resource: 2,
      }

      if (typeof this.doctorIndexArr?.[0] == 'undefined') {
        Object.assign(params, {
          doctorId: this.order.doctorId,
        })
      }
      const data = await getReverseDocInfo(params)

      if (typeof this.doctorIndexArr?.[0] == 'undefined') {
        const now = this.FORMATDATE(new Date(), 'yyyy-MM-dd')
        data.forEach((item, index) =>
          item.scheduleLists.forEach(({ reverseDate }, idx) => {
            if (now == reverseDate) {
              this.doctorIndex = index
              this.dateIndex = idx
              return
            }
          }),
        )
      }
      this.info = data[this.doctorIndex] ?? {}
      this.fetchDocFsInfo()
      this.noType = this.info.scheduleLists[this.dateIndex].noType
    },
    async fetchDocFsInfo() {
      console.log(this.orgId, this.deptId, '1')
      if (!this.orgId || !this.deptId) return
      const params = {
        scheduleNo:
          this.itemInfo.scheduleLists[0].scheduleNo ||
          this.scheduleItem.scheduleNo,
        deptId: this.deptId,
        orgId: this.orgId,
        doctorId: this.itemInfo.docId || this.info.docId || this.order.doctorId,
        // visitDate:
        //   this.itemInfo.scheduleLists[0].reverseDate || this.dateIndex > -1
        //     ? this.info.scheduleLists[this.dateIndex].reverseDate
        //     : this.FORMATDATE(new Date(), 'yyyy-MM-dd'),
        visitDate: this.itemInfo.scheduleLists[0].reverseDate,
      }
      this.timeList = await getDocFsInfo(params)
    },
    async getDept() {
      if (!this.orgId || !this.deptId) return

      this.deptInfo = await getDeptDetail({
        orgId: this.orgId,
        deptId: this.deptId,
      })
    },
    changeDoctor() {
      uni.navigateTo({
        url: this.isChangeUrl
          ? `/pages-doctor/appointment/selectDept?orderId=${this.order.orderId}`
          : `/pages-doctor/appointment/selectDoctor?orderId=${
              this.order.orderId
            }&department=${JSON.stringify(this.department)}`,
      })
    },
    onDateChange(date) {
      this.dateIndex = this.scheduleLists
        ?.map(item => item.reverseDate)
        .indexOf(date.fullDate)
      this.fetchDocFsInfo()
    },
    formatDay(date) {
      if (!date) return ''
      const week = ['周天', '周一', '周二', '周三', '周四', '周五', '周六']
      return week[new Date(date).getDay()]
    },
    submit() {
      if (this.doctorIndex < 0 || this.dateIndex < 0) return

      const {
        reverseDate,
        noType,
        regFee,
        expertFee,
        scheduleNo,
      } = this.itemInfo.scheduleLists[0]

      //随机取一个时段索引
      this.timeIndex = Math.floor(Math.random() * this.timeList.length) || 0
      console.log(this.timeList, '时段')
      console.log(this.docInfo, '医生信息')
      const params = {
        deptId: this.deptId,
        roomId: this.order.roomId,
        orgId: this.orgId,
        orgName: this.orgName,
        creator: this.userId,
        memberId: this.order.memberId,
        patientName: this.order.memberName,
        doctorId: this.docInfo.docId || this.doctorId,
        doctorName: this.docInfo.docName,
        doctorTitle: this.doctorTitle,
        deptName: this.department?.name || this.deptInfo.deptName,
        userId: this.order.userId,
        diagnoseNo: this.order.patientCard,
        resourceNo: noType == 1 ? '普通' : '专家',
        visitDate: reverseDate,
        startTime: this.timeList[this.timeIndex].beginTime,
        endTime: this.timeList[this.timeIndex].endTime,
        fee: noType == '普通' ? regFee : expertFee,
        numberCode: scheduleNo,
        scheduleNo,
        shiftCode: this.timeList[this.timeIndex].shiftCode || '',
        periodNo: this.timeList[this.timeIndex].periodNo,
        origin: 1,
        resource: '2',
        doctorTitle:
          this.docInfo.docTitle || this.info.docTitle || this.order.titleName,
      }
      if (!this.isSubmit) return
      this.isSubmit = false
      uni.showLoading()
      saveAppointment(params)
        .then(() => {
          const routes = getCurrentPages()
          const chatIndex = routes
            .map(item => item.route)
            .indexOf('pages-doctor/chat/chat')
          uni.navigateBack({
            delta: routes.length - chatIndex - 1,
          })
        })
        .finally(() => {
          this.isSubmit = true
          uni.hideLoading()
        })
    },
    onChangeNoType(option) {
      this.noType = option?.value == '普通号' ? 1 : 2 || ''
      this.$refs.noTypes.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.expand-icon {
  margin-left: 8rpx;
  width: 32rpx;
  height: 22rpx;

  &.up {
    transform: rotate(180deg);
  }
}
.doctor-profile {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;

  .doctor-avtar {
    width: 76rpx;
    height: 76rpx;
    border-radius: 50%;
    overflow: hidden;
  }

  .avtar-img {
    width: 76rpx;
    height: 76rpx;
  }

  .doctor-info {
    flex: 1;
    display: flex;
    margin-left: 20rpx;
    align-items: center;
    justify-content: space-between;
  }

  .doctor-name {
    height: 31rpx;
    color: #333333;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 31rpx;
    font-family: PingFang SC;
  }

  .doctor-title {
    height: 25rpx;
    color: #656565;
    font-size: 24rpx;
    font-weight: 500;
    margin-top: 20rpx;
    line-height: 25rpx;
    font-family: PingFang SC;
  }

  .toogle-btn {
    width: 112rpx;
    height: 60rpx;
    color: #333333;
    font-size: 24rpx;
    font-weight: 500;
    text-align: center;
    line-height: 60rpx;
    border-radius: 30rpx;
    background: #ffffff;
    font-family: PingFang SC;
    border: 1rpx solid #cbcbcb;
  }
}

.doctor-goodat,
.doctor-introduce {
  margin-left: 30rpx;
  padding: 0 30rpx 40rpx 0;
  border-bottom: 1rpx solid #e5e5e5;
}

.doctor-introduce {
  margin-top: 40rpx;
}

.card-title {
  height: 28rpx;
  display: flex;
  color: #333333;
  font-size: 30rpx;
  font-weight: bold;
  line-height: 36rpx;
  align-items: center;
  margin-bottom: 42rpx;
  font-family: PingFang SC;

  &::before {
    content: '';
    width: 3rpx;
    height: 30rpx;
    margin-right: 10rpx;
    background: #0ab1c1;
  }
}

.card-text {
  color: #656565;
  font-size: 26rpx;
  font-weight: 500;
  line-height: 36rpx;
  font-family: PingFang SC;
}

.toogle-explan {
  height: 80rpx;
  display: flex;
  color: #0ab1c1;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 23rpx;
  align-items: center;
  justify-content: center;
  font-family: PingFang SC;
}

.source-type,
.red {
  color: #191919;
  font-size: 30rpx;
  font-weight: 500;
  font-family: PingFang SC;
}

.red {
  color: #e35b5b;
}

.period-list {
  padding: 20rpx;
  overflow: hidden;
}

.period-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 20rpx;
  padding: 20rpx;
  background: #f1f1f1;
  box-sizing: border-box;
  justify-content: space-between;
  border-radius: 10rpx;

  &.active {
    background-color: $uni-color-primary;

    .period-date,
    .period-time,
    .period-item-right {
      color: #fff;
    }
  }
}

.period-date {
  height: 29rpx;
  color: #333333;
  font-size: 30rpx;
  font-weight: bold;
  line-height: 29rpx;
  font-family: PingFang SC;
}

.period-time {
  height: 23rpx;
  color: #656565;
  font-size: 24rpx;
  font-weight: 500;
  margin-top: 10rpx;
  line-height: 23rpx;
  font-family: PingFang SC;
}

.period-item-right {
  height: 28rpx;
  color: #333333;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 28rpx;
  font-family: PingFang SC;

  &.disabled {
    color: #999999;
  }
}
.btn-submit {
  margin-bottom: 20rpx;
  width: 80vw;
  height: 80rpx;
  border-radius: 60rpx;
  background-color: $uni-color-primary;
  font-size: 32rpx;
  color: #fff;

  &::after {
    border: none;
  }
}
</style>
