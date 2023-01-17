<template>
  <view class="date">
    <slot></slot>
    <view v-show="isopen" class="dateTop flex-start-center">
      <view class="flex-start-center flex_1">
        <view class="flex-start-center">
          <text class="iconfont icon-zuo" @click="preYear"></text>
          <view class="text">{{ calendar.year || '' }}年</view>
          <text class="iconfont icon-iconfont64" @click="nextYear"></text>
        </view>
        <view
          class="flex-start-center"
          style="border-left: 1px solid #CCCCCC;margin-left: 30rpx;padding-left: 30rpx;"
        >
          <text class="iconfont icon-zuo" @click="preweek"></text>
          <view class="text">{{ calendar.month || '' }}月</view>
          <text class="iconfont icon-iconfont64" @click="nextweek"></text>
        </view>
      </view>
      <image
        class="icon"
        :src="
          isopen ? require('@/assets/hide.png') : require('@/assets/show.png')
        "
        @click="isopen = !isopen"
      ></image>
    </view>
    <view v-show="isopen" style="position: relative;">
      <view
        style="font-size: 24rpx;color: #999;position: absolute;right: 30rpx;top: 20rpx;z-index: 11;"
        @click="clearDate"
        >清空</view
      >
      <uni-calendar
        ref="date"
        :insert="true"
        :range="true"
        :startDate="startDate"
        :showMonth="false"
        @monthSwitch="calendarInit"
        @change="changeCalendar"
      />
    </view>
    <view class="weekWrap" v-show="isopen">
      <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
        <view
          :class="['weekItem', item == isweek ? 'on' : '']"
          v-for="item in weekend"
          :key="item.day"
          @click="changeWeek(index)"
        >
          <view>周{{ weeks[item.day] }}</view>
          <view class="time"
            >{{ item.year }}-{{ item.month }}-{{ item.date }}</view
          >
        </view>
      </scroll-view>
    </view>
    <view class="plan_main" v-show="isopen">
      <view
        class="flex-between planShow paddt"
        v-for="item in rooms"
        :key="item.sessionId"
        :class="{ 'color-red': item.appointmentCountDown == 0 }"
      >
        <view class="flex-start-center plan-item">
          <view class="planTime">
            <view>{{
              item.appointmentPeriod
                ? FORMATDATE(item.appointmentPeriod.split('~')[0], 'hh:mm')
                : ''
            }}</view>
            <view>{{
              item.appointmentPeriod ? item.appointmentPeriod.split('~')[1] : ''
            }}</view>
          </view>
          <image
            class="ljIcon"
            :src="require('@/assets/timeRange.png')"
          ></image>
          <view class="flex-start-center" style="margin-left: 40rpx;">
            <view>患者</view>
            <view class="patient">{{ item.memberName }}</view>
          </view>
        </view>
        <view
          class="planNum"
          v-if="item.appointmentCountDown > -1"
          :class="
            item.appointmentCountDown <= 10
              ? 'color-red'
              : item.appointmentCountDown <= 30
              ? 'color-yellow'
              : ''
          "
        >
          距离复诊开始还有{{ item.appointmentCountDown }}分钟
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    sessionList: Array,
  },
  data() {
    return {
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      startDate: '',
      isopen: false,
      calendar: {},
      weekend: [],
      isweek: 0,
      rooms: [],
      date: '',
    }
  },
  watch: {
    calendar(calendar) {
      calendar.fullDate = calendar.fullDate || calendar.fulldate || ''
      if (!calendar.fullDate) {
        this.$emit('change', [null, null])
        return
      }
      let timestamp = new Date(calendar.fullDate.replace(/-/g, '/')).getTime()
      const arr = []
      let i = 0
      while (i < 7) {
        const _date = new Date(timestamp)
        const { year, month, date } = this.dateFormmat(_date)
        arr.push({
          day: _date.getDay(),
          year,
          month,
          date,
        })
        timestamp += 86400000
        i++
      }
      this.weekend = arr
      this.$emit('change', [arr[0], arr[6]])
    },
    sessionList(list) {
      this.rooms = list
        .filter(
          ({ bizType, status }) =>
            bizType && ['APPOINTMENT', 'WAIT_TREAT'].includes(status),
        )
        .reverse()
    },
  },
  methods: {
    dateFormmat(_date) {
      const year = _date.getFullYear()
      const month = ('0' + (_date.getMonth() + 1)).substr(-2)
      const date = ('0' + _date.getDate()).substr(-2)
      return {
        year,
        month,
        date,
        dateString: `${year}-${month}-${date}`,
      }
    },
    calendarInit(date) {
      this.calendar = date || {}
    },
    preYear() {
      const date = this.$refs.date.nowDate
      date.year--
      this.calendarInit(date)
    },
    nextYear() {
      const date = this.$refs.date.nowDate
      date.year++
      this.calendarInit(date)
    },
    preweek() {
      this.$refs.date.pre()
      this.calendarInit()
    },
    nextweek() {
      this.$refs.date.next()
      this.calendarInit()
    },
    changeWeek(i) {
      this.isweek = i
    },
    showFunc() {
      this.isopen = !this.isopen
    },
    changeCalendar(payload) {
      const date = payload.range.data
      this.date = payload.nowDate

      const start = date[0]
      const end = date[date.length - 1]

      if (!start || !end) return
      this.$emit('change', [
        {
          fullDate: start,
        },
        {
          fullDate: end,
        },
      ])
    },
    clearDate() {
      this.calendar = {}
      this.$refs.date.cale.cleanMultipleStatus()
      this.$refs.date.cale.setDate(this.date)
      this.$refs.date.init()
    },
    calendarToday() {
      const date = this.$refs.date.nowDate
      this.$emit('change', [date, date])
    },
  },
}
</script>
<style lang="scss" scoped>
.date {
  margin-top: 20rpx;
  padding-bottom: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);

  .dateTop {
    margin-top: 20rpx;
    padding: 0 30rpx;
    height: 80rpx;
    background-color: #f2f2f2;
    border-bottom: 1px solid #fff;

    .icon {
      width: 26rpx;
      height: 20rpx;
    }

    .iconfont {
      color: $uni-color-primary;
    }

    .text {
      font-size: 26rpx;
      color: #1a1a1a;
      padding: 0 30rpx;
    }
  }

  ::v-deep.uni-calendar__header {
    display: none;
  }

  ::v-deep.uni-calendar-item__weeks-lunar-text {
    display: none;
  }

  ::v-deep.uni-calendar__weeks {
    justify-content: space-between;
  }

  ::v-deep.uni-calendar__weeks-item {
    flex: none;
  }

  ::v-deep.uni-calendar-item__weeks-box {
    width: 56rpx;
    height: 56rpx;
    margin: 10rpx 18rpx;
    border-radius: 10rpx;
    overflow: hidden;
  }

  ::v-deep.uni-calendar-item--isDay-text {
    color: $uni-color-primary;
  }

  ::v-deep.uni-calendar-item__weeks-box-item {
    width: 56rpx;
    height: 56rpx;
  }

  ::v-deep.uni-calendar-item--isDay {
    background-color: $uni-color-primary;
    color: #fff;
  }

  ::v-deep.uni-calendar-item--checked {
    background-color: $uni-color-primary;
  }

  ::v-deep.uni-calendar__backtoday {
    display: none;
  }

  ::v-deep.uni-calendar__content {
    background-color: #f2f2f2;
    border-radius: 10rpx;
    padding: 20rpx 0;
  }

  .weekWrap {
    margin-top: 40rpx;
    padding: 0 20rpx;

    .scroll-view_H {
      white-space: nowrap;
    }

    .weekItem {
      display: inline-block;
      margin-right: 50rpx;
      font-size: 26rpx;
      text-align: center;
      color: #999;
      padding-bottom: 20rpx;

      .time {
        font-size: 20rpx;
      }

      &.on {
        color: #1a1a1a;
        font-weight: bold;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 30rpx;
          height: 4rpx;
          background: $uni-color-primary;
          bottom: 8rpx;
          left: 50%;
          margin-left: -15rpx;
          border-radius: 2rpx;
        }
      }
    }
  }

  .plan_main {
    padding: 0 20rpx;
  }
}

.patient {
  margin-left: 20rpx;
  width: 140rpx;
  text-align: center;
  border-radius: 20rpx;
  background-color: #f2f2f2;
}

.planNum {
  color: #1a1a1a;
}

.plan-item {
  position: relative;
}
.ljIcon {
  position: absolute;
  top: 24rpx;
  left: 72rpx;
  width: 19.5rpx;
  height: 45rpx;
}

.color-red {
  color: #e45c5c;
}

.color-yellow {
  color: #ff9c00;
}
</style>
