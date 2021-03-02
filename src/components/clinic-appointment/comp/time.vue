<template>
  <uni-popup type="bottom" ref="popup">
    <view class="popup">
      <view class="close" @click="close"
        ><uni-icons type="closeempty" class="closeIcon" color="#999"></uni-icons
      ></view>
      <view class="popup-title">选择复诊时间</view>
      <view class="line"></view>
      <picker-view
        class="picker-view"
        :indicator-style="indicatorStyle"
        :value="value"
        @change="timeChange"
      >
        <picker-view-column>
          <view class="item" v-for="(item, index) in times" :key="index">
            {{ item.year }}年
          </view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item, index) in getMonth" :key="index">
            {{ item.month }}月
          </view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item, index) in getDay" :key="index">
            {{ item }}日
          </view>
        </picker-view-column>
      </picker-view>
      <view class="rest" v-if="getTimeS.length <= 0">休息</view>
      <scroll-view scroll-x="true" class="time-slot">
        <view style="display: flex">
          <template v-for="(item, index) in getTimeS">
            <view
              class="time-slot-item"
              :key="index"
              v-if="item.state === 2"
              :class="{ s: timeSlot.rangeTime == item.rangeTime }"
              :style="{ flexShrink: 0, marginLeft: '20rpx' }"
              @click="timeSlot = item"
            >
              <view
                class="text"
                :class="{ o: item.state === 0 || item.state === 1 }"
                >{{ item.rangeTime }}</view
              >
              <view class="slot-not-optional" v-show="item.state == 1">满</view>
            </view>
          </template>
        </view>
      </scroll-view>
      <view class="time-confirm" @click="confirm">确定</view>
    </view>
  </uni-popup>
</template>
<script>
import { chooseOrderTime } from '@/common/request/index'
export default {
  props: {
    doctorId: String,
  },
  data() {
    return {
      indicatorStyle: `height: ${Math.round(
        uni.getSystemInfoSync().screenWidth / (750 / 100),
      )}px;`,
      value: [0, 0, 0],
      timeSlot: '', //时间段选择
      orderTimes: [], //患者可选复诊时间段
      times: [],
      year: '',
      month: '',
      day: '',
    }
  },
  computed: {
    getMonth() {
      if (this.year) return this.times.find(item => item.year === this.year).m
      return []
    },

    getDay() {
      if (this.year && this.month)
        return this.times
          .find(item => item.year === this.year)
          .m.find(item => item.month === this.month).d
      return []
    },
    /***
     *获取时间段
     */
    getTimeS() {
      if (this.orderTimes && this.year && this.month && this.day) {
        const time = this.year + '-' + this.month + '-' + this.day
        return this.orderTimes.find(item => item.date === time).timeRange
      }
      return []
    },
  },
  created() {
    this.getChooseOrderTime()
  },
  methods: {
    open() {
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
    timeChange(e) {
      const val = e.detail.value

      this.year = this.times[val[0]].year
      this.month = this.times[val[0]].m[val[1]].month
      this.day = this.times[val[0]].m[val[1]].d[val[2]]
    },
    confirm() {
      if (!this.timeSlot) {
        uni.showToast({
          title: '请选择时间段！',
        })
        return
      }

      const [startTime, endTime] = this.timeSlot.rangeTime.split('-')
      this.$emit('change', {
        date: `${this.year}-${this.month}-${this.day}`,
        startTime,
        endTime,
      })
      this.close()
    },
    getChooseOrderTime() {
      chooseOrderTime({
        doctorId: this.doctorId,
      }).then(data => {
        if (data && data.length > 0) {
          this.orderTimes = data
          const dates = this.orderTimes[0].date?.split('-')
          this.year = dates[0]
          this.month = dates[1]
          this.day = dates[2]

          this.resolveTime()
        }
      })
    },
    /***
     *拼接复诊时间数据
     */
    resolveTime() {
      this.orderTimes.forEach(item => {
        const dates = item.date?.split('-')
        const isYear = this.times.find(time => dates[0] === time.year)

        if (isYear) {
          const isMonth = this.times
            .find(time => dates[0] === time.year)
            .m.find(mTiem => dates[1] === mTiem.month)
          if (isMonth) {
            const isDay = this.times
              .find(time => dates[0] === time.year)
              .m.find(mTiem => dates[1] === mTiem.month)
              .d.find(day => dates[2] === day)
            if (!isDay) {
              //设置日
              this.times
                .find(time => dates[0] === time.year)
                .m.find(mTiem => dates[1] === mTiem.month)
                .d.push(dates[2])
            }
          } else {
            //设置月
            this.times
              .find(time => dates[0] == time.year)
              .m.push({
                month: dates[1],
                d: [dates[2]],
              })
          }
        } else {
          //设置年
          this.times.push({
            year: dates[0],
            m: [
              {
                month: dates[1],
                d: [dates[2]],
              },
            ],
          })
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.popup {
  width: 100vw;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  padding-bottom: 20rpx;
  position: relative;

  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;

    .closeIcon {
      font-size: 30rpx !important;
    }
  }

  .popup-title {
    line-height: 80rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    text-align: center;
    padding: 20rpx 24rpx;
  }

  .line {
    width: 750rpx;
    height: 2rpx;
    background: #e6e6e6;
    margin-bottom: 42rpx;
  }

  .rest {
    height: 100rpx;
    text-align: center;
    color: rgba(204, 204, 204, 1);
  }

  .picker-view {
    width: 98%;
    height: 500rpx;
    align-items: center;

    .item {
      text-align: center;
    }
  }

  .time-slot {
    width: 100%;

    .time-slot-item {
      min-width: 200rpx;
      height: 60rpx;
      margin: 40rpx 0rpx 40rpx 30rpx;
      background: rgba(242, 242, 242, 1);
      border-radius: 30rpx;
      position: relative;

      .text {
        line-height: 60rpx;
        text-align: center;
        font-size: 26rpx;
        font-weight: 500;
        padding: 0rpx 24rpx;

        &.o {
          color: rgba(204, 204, 204, 1);
        }
      }

      &.s {
        background: rgba(10, 178, 193, 1);
        color: rgba(255, 255, 255, 1);
      }

      .slot-not-optional {
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        width: 30rpx;
        height: 30rpx;
        background: rgba(228, 91, 91, 1);
        border-radius: 50%;
        line-height: 30rpx;
        text-align: center;
        font-size: 18rpx;
        color: rgba(255, 255, 255, 1);
      }
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
</style>
