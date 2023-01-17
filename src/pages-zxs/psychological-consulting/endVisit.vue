<template>
  <view class="page-end-visit">
    <!-- 基本信息 -->
    <view class="headerTop">
      <view class="form-item">
        <view class="label">医生：</view>
        <view class="value">{{ rowData.docName || '-' }}</view>
      </view>
      <view class="form-item">
        <view class="label">咨询时段：</view>
        <view class="value"
          >{{ rowData.itemName || '-' }} |
          {{ rowData.scheduleDate || '-' }}</view
        >
      </view>
      <view class="form-item">
        <view class="label"></view>
        <view class="value"
          >{{ rowData.reservedTime || '-' }} | ￥{{
            rowData.price || '-'
          }}</view
        >
      </view>
      <view class="form-item">
        <view class="label">就诊人：</view>
        <view class="value">{{
          `[${rowData.cardNo || '-'}]${rowData.name || '-'} | ${getsex(
            rowData.sex,
          )}`
        }}</view>
      </view>
      <view class="form-item" v-if="rowData.phone">
        <view class="label"></view>
        <view class="value">{{ rowData.phone }}</view>
      </view>
    </view>
    <view class="content-box">
      <view class="content app-card">
        <view class="form-item">
          <view class="label">就诊人类型</view>
          <view class="value select-type">
            <view
              class="type-btn"
              :class="activePatientType === 7 ? 'active' : ''"
              @click="handelActiveTab(7, 0)"
              >按周</view
            >
            <view
              class="type-btn"
              :class="activePatientType === 14 ? 'active' : ''"
              @click="handelActiveTab(14, 0)"
              >隔周</view
            >
            <view
              class="type-btn"
              :class="activePatientType === 30 ? 'active' : ''"
              @click="handelActiveTab(30, 0)"
              >按月</view
            >
          </view>
        </view>
        <view class="form-item no-border">
          <view class="label">下次就诊时间</view>
          <view
            class="value flex-between"
            :class="activeDate ? '' : 'c999'"
            @click="openRefDate"
          >
            <view style="display:flex;align-items:center">
              <text>{{ activeDate || '请选择日期' }}</text>
              <view v-if="activeDate" @click.stop="clearDateTime">
                <uni-icons
                  type="close"
                  color="#ccc"
                  style="margin-left:10rpx"
                  size="16"
                ></uni-icons>
              </view>
            </view>
            <uni-icons type="forward" color="#ccc" size="14"></uni-icons>
          </view>
        </view>
        <view class="form-item no-border" v-if="activeDate">
          <view class="label"></view>
          <view class="value">
            <picker
              @change="changeTime"
              :value="timeIndex"
              :range="timeList"
              range-key="label"
            >
              <view style="font-size: 24rpx;color: #999" class="flex-between">
                <text>{{ timeList[timeIndex].label || '请选择时段' }}</text>
                <uni-icons type="forward" color="#ccc" size="14"></uni-icons>
              </view>
            </picker>
          </view>
        </view>
        <view class="form-item" v-if="timeInfo">
          {{
            `${timeInfo.itemName} | ${timeInfo.scheduleDate} | ${timeInfo.startTime}-${timeInfo.endTime} | ￥${timeInfo.price}`
          }}
        </view>
        <view class="form-item no-border" v-if="timeInfo">
          <view class="label">支付方式</view>
          <view class="value select-type">
            <view
              class="type-btn"
              :class="payType === 'ONLINE_PAY' ? 'active' : ''"
              @click="handelActiveTab('ONLINE_PAY', 1)"
              >在线支付</view
            >
            <!-- <view class="type-btn " :class="payType === 'OFFLINE_PAY' ? 'active' : ''"  @click="handelActiveTab('OFFLINE_PAY',1)">线下支付</view> -->
            <view
              class="type-btn "
              :class="payType === 'FREE_PAY' ? 'active' : ''"
              @click="handelActiveTab('FREE_PAY', 1)"
              >线下支付</view
            >
          </view>
        </view>
      </view>
      <view class="btns">
        <view class="mini-btn" @click="navigateBack">取消</view>
        <view class="mini-btn primary" @click="comfirmEnd">确认</view>
      </view>
    </view>
    <!-- 日历  -->
    <uni-calendar
      :date="activeDate"
      :insert="false"
      :showMonth="false"
      :isDisableAll="true"
      :optional="optional"
      ref="refDate"
      @confirm="confirmCalendar"
    />
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { getScheduleListByDeptDoctorPeriod } from '@/pages-zxs/api/closeApply'
import { endVisit } from '../api/appointPatient'
export default {
  data() {
    return {
      rowData: {},
      activePatientType: 7, //默认选中按周
      payType: 'ONLINE_PAY', //默认选中在线支付
      canPassTimeList: [], //可延诊排班列表
      optional: [], //日历可选日期
      activeDate: '', //日历选中日期
      timeInfo: null, //时段详情
      timeList: [], //时段可选项
      timeIndex: 0, //时段选中项
    }
  },
  onLoad(options) {
    this.rowData = JSON.parse(options.rowData)
    this.getPostDateList()
    console.log(this.rowData, '传入数据--------------------')
  },
  methods: {
    getsex(sex) {
      return sex == 0 ? '女' : sex == 1 ? '男' : ''
    },
    //清除选中日期时段数据
    clearDateTime() {
      this.activeDate = ''
      this.timeInfo = null
      this.timeIndex = 0
      this.timeList = []
    },
    //选中tab
    handelActiveTab(num, type) {
      //type 0 就诊人类型 1 支付方式
      if (type) {
        return (this.payType = num)
      }
      //选中就诊人类型（先清除选中日期）
      this.clearDateTime()
      this.activePatientType = num
      this.checkDate(num)
    },
    openRefDate() {
      this.$refs.refDate.open()
    },
    //筛选日历可选项(今日之后的)
    filterDateList() {
      this.optional = [
        ...new Set(this.canPassTimeList.map(v => v.scheduleDate)),
      ].filter(item => dayjs(item).isAfter(dayjs()))
    },
    //选中日历日期
    confirmCalendar(e) {
      console.log(e.fulldate, '选中时间')
      if (!this.optional.includes(e.fulldate)) {
        return false
      }
      this.activeDate = e.fulldate
      this.checkTime(e.fulldate)
    },
    //选择时段
    changeTime(e) {
      console.log(e.detail.value, '时段选中项--')
      this.timeIndex = e.detail.value
      this.timeInfo = this.timeList[e.detail.value]
    },
    //获取顺延排班数据list
    async getPostDateList() {
      const params = {
        deptId: this.rowData.deptId,
        doctorId: this.rowData.doctorId,
        itemId: this.rowData.itemId,
      }
      this.canPassTimeList = await getScheduleListByDeptDoctorPeriod(params) //查找同时段同医生的可延诊时间
      //日历可选项
      this.filterDateList()
      this.checkDate(7)
    },
    //根据传入时间间隔选择日期 （默认选中当前就诊时间7天之后的日期）
    checkDate(num) {
      //num天后的日期
      let defDate = dayjs(this.rowData.scheduleDate)
        .add(num, 'day')
        .format('YYYY-MM-DD')
      //num天后的日期是否存在日历可选项中
      const isIncludsDefDate = this.optional.includes(defDate)
      if (isIncludsDefDate) {
        this.activeDate = defDate //赋值选中日期
        this.checkTime(defDate)
      }
    },
    //自动选中时段
    checkTime(date) {
      //根据选中日期筛选出可选时段的排班列表
      let canCheckTimeList = this.canPassTimeList.filter(
        v => v.scheduleDate === date,
      )
      //可选时段列表并排序
      this.timeList = canCheckTimeList
        .map(v => {
          return {
            ...v,
            label: `${v.startTime}-${v.endTime}`,
          }
        })
        .sort(
          (a, b) =>
            dayjs(`${a.scheduleDate} ${a.startTime}-${a.endTime}`) -
            dayjs(`${b.scheduleDate} ${b.startTime}-${b.endTime}`),
        )
      //与当前订单同时段排班(可能为空)
      const withTimeList = this.timeList.filter(
        v => this.rowData.reservedTime.indexOf(v.label) > -1,
      )
      //选中排班项详情
      this.timeInfo = withTimeList.length ? withTimeList[0] : this.timeList[0]
      //选中时段的索引
      this.timeList.forEach((v, i) => {
        if (v.id === this.timeInfo.id) {
          this.timeIndex = i
        }
      })
    },
    navigateBack() {
      uni.navigateBack({ delta: 1 })
    },
    //确认结束
    async comfirmEnd() {
      const row = this.rowData
      let params = {
        deptName: row.deptName,
        doctor: row.docName,
        doctorId: row.doctorId,
        entryId: row.itemId,
        entryName: row.itemName,
        memberId: row.memberId,
        patientId: row.patientId,
        orgId: row.orgId,
        id: row.id,
        payType: this.payType,
      }
      if (this.timeInfo) {
        params = {
          ...params,
          cost: this.timeInfo.price,
          periodName: this.timeInfo.periodName,
          reservationDate: this.timeInfo.scheduleDate,
          reservationDtime:
            this.timeInfo.startTime + '-' + this.timeInfo.endTime,
          scheduleId: this.timeInfo.id,
        }
      }
      try {
        console.log('【调试】请求参数', params)
        await endVisit(params)
        uni.showToast({
          title: '操作成功',
          icon: 'success',
        })
        setTimeout(() => {
          this.navigateBack()
        }, 1000)
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.page-end-visit {
  font-size: 30rpx;
}
.form-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1px solid #e6e6e6;
  .label {
    min-width: 180rpx;
    color: #4d4d4d;
  }
  .value {
    width: 100%;
  }
  .c999 {
    color: #999;
  }
  .select-type {
    flex: 1;
    display: flex;
    .type-btn {
      width: 128rpx;
      height: 54rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 26rpx;
      background: #f2f2f2;
      margin-right: 30rpx;
      font-size: 24rpx;
      color: #333;
    }
    .active {
      background: #0ab2c1;
      color: #fff;
    }
  }
}
.no-border {
  border-bottom: none;
}
.headerTop {
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  padding: 10rpx 20rpx;
  position: fixed;
  z-index: 2;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  .form-item {
    border-bottom: none;
    padding: 10rpx 20rpx;
  }
}
.content-box {
  padding: 20rpx;
  padding-top: 360rpx;
}

.btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30rpx;
  .mini-btn {
    width: 340rpx;
    height: 88rpx;
    background: #ffffff;
    color: #4d4d4d;
    border-radius: 44rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .primary {
    background: #0ab2c1;
    color: #fff;
  }
}
/* .uni-fixed-top:nth-child(2) {
.uni-calendar__header-text {
    color: #0ab2c1 !important;
  }
} */
</style>
