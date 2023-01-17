<template>
  <view>
    <uni-popup type="bottom" ref="popup">
      <view class="time-popup">
        <view class="time-popup-title">
          <text>选择自提时间</text>
          <icon :type="clear" size="26"></icon>
        </view>
        <view class="line"></view>

        <picker-view
          class="picker-view"
          :indicator-style="indicatorStyle"
          :value="value"
          @change="timeChange"
        >
          <picker-view-column>
            <view class="item" v-for="(item, index) in years" :key="index"
              >{{ item }}年</view
            >
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in months" :key="index"
              >{{ item }}月</view
            >
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in days" :key="index"
              >{{ item }}日</view
            >
          </picker-view-column>

          <picker-view-column>
            <view class="item" v-for="(item, index) in hours" :key="index"
              >{{ item }}时</view
            >
          </picker-view-column>

          <picker-view-column>
            <view class="item" v-for="(item, index) in minutes" :key="index"
              >{{ item }}分</view
            >
          </picker-view-column>
        </picker-view>

        <view class="time-confirm" @click="timeConfirm()"> 确定</view>
        <!-- <view>{{ year + "-" + month + "-" + day}}</view> -->
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    const date = new Date()
    const years = []
    const year = date.getFullYear()
    const months = []
    const allMonths = [] //完整月份
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    const weekdays = [] //平年
    const leapYearDays = [] //闰年
    const bigDays = [] //大月
    const smallDays = [] //小月

    const hours = [] //小时
    const allHours = [] //完整小时

    const hour = date.getHours()
    const minutes = [] //分钟
    const allMinutes = [] //分钟
    const minute = date.getMinutes()

    for (let i = date.getFullYear() + 3; i >= date.getFullYear(); i--) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
      allMonths.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      if (i <= 28) {
        weekdays.push(i)
      }
      if (i <= 29) {
        leapYearDays.push(i)
      }
      if (i <= 30) {
        smallDays.push(i)
      }
      bigDays.push(i)
    }
    for (let i = 0; i <= 23; i++) {
      hours.push(i)
      allHours.push(i)
    }
    for (let i = 1; i <= 59; i++) {
      minutes.push(i)
      allMinutes.push(i)
    }
    return {
      years,
      year,
      months,
      allMonths,
      month,
      days,
      day,
      weekdays,
      leapYearDays,
      bigDays,
      smallDays,
      hours,
      allHours,
      hour,
      minutes,
      allMinutes,
      minute,

      value: [3, 0, 0, 0, 0], //默认坐标
      time: '请选择', //最终选择的复诊时间
    }
  },
  mounted() {
    this.calculationDay(this.value)
  },
  methods: {
    timeChange(e) {
      const val = e.detail.value

      if (val) {
        this.calculationDay(val)
      }
    },
    calculationDay(val) {
      this.year = this.years[val[0]]

      var nowD = new Date()
      //过滤过期月
      if (this.year == nowD.getFullYear()) {
        this.months = this.allMonths.slice(nowD.getMonth())
      } else {
        this.months = this.allMonths
      }
      this.month = this.months[val[1]]

      if (this.month == 2) {
        if (this.year % 4 == 0) {
          this.days = this.leapYearDays
        } else {
          this.days = this.weekdays
        }
      } else {
        if (
          this.month == 1 ||
          this.month == 3 ||
          this.month == 5 ||
          this.month == 7 ||
          this.month == 8 ||
          this.month == 10 ||
          this.month == 12
        ) {
          this.days = this.bigDays
        } else {
          this.days = this.smallDays
        }
      }

      //过滤过期日期
      if (
        this.year == nowD.getFullYear() &&
        this.month == nowD.getMonth() + 1
      ) {
        this.days = this.days.slice(nowD.getDate() - 1)
      }
      this.day = this.days[val[2]]

      //过滤过期时
      this.hours = this.allHours
      if (
        this.year == nowD.getFullYear() &&
        this.month == nowD.getMonth() + 1 &&
        this.day == nowD.getDate()
      ) {
        this.hours = this.allHours.slice(nowD.getHours())
      }
      this.hour = this.hours[val[3]]

      //过滤过期分
      this.minutes = this.allMinutes
      if (
        this.year == nowD.getFullYear() &&
        this.month == nowD.getMonth() + 1 &&
        this.day == nowD.getDate() &&
        this.hour == nowD.getHours()
      ) {
        this.minutes = this.allMinutes.slice(nowD.getMinutes())
      }
      this.minute = this.minutes[val[4]]

      // console.log('date后》》》》',this.year,this.month,this.day,this.hour,this.minute)
    },
    show() {
      this.$refs.popup.open()
    },
    timeConfirm() {
      this.time = this.year + '-' + this.month + '-' + this.day
      let startTime = this.hour + ':' + this.minute

      //判断选择时间是否在当前时间前
      var nowD = new Date()
      var sTime =
        this.year +
        '/' +
        this.month +
        '/' +
        this.day +
        ' ' +
        this.hour +
        ':' +
        this.minute
      var now =
        nowD.getFullYear() +
        '/' +
        (nowD.getMonth() + 1) +
        '/' +
        nowD.getDate() +
        ' ' +
        nowD.getHours() +
        ':' +
        nowD.getMinutes()

      if (new Date(sTime).getTime() < new Date(now).getTime()) {
        uni.showToast({
          title: '提取时间已过时，请重新选择！',
          icon: 'none',
        })
        return
      }
      let endMinute = parseFloat(this.minute) + 30
      let endTime = this.hour + ':' + endMinute
      if (endMinute > 59) {
        endTime = parseFloat(this.hour) + 1 + ':' + (parseFloat(endMinute) - 60)
      }
      this.$emit('time', this.time, startTime, endTime)
      this.$refs.popup.close()
    },
  },
}
</script>

<style scoped lang="scss">
.time-popup {
  width: 100vw;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  padding-bottom: 20rpx;

  .time-popup-title {
    padding: 41rpx 0rpx;
    display: flex;
    justify-content: center;
    position: relative;

    text {
      font-size: 30rpx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
    }

    icon {
      position: absolute;
      right: 40rpx;
    }
  }

  .time-confirm {
    margin: 20rpx 20rpx 0rpx 20rpx;
    width: 710rpx;
    height: 88rpx;
    background: rgba(10, 178, 193, 1);
    border-radius: 44rpx;

    font-size: 30rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 88rpx;
    text-align: center;
  }
}

::v-deep.picker-view {
  width: 98%;
  height: 500rpx;
  align-items: center;

  .item {
    text-align: center;
  }
}
</style>
