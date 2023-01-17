<template>
  <view class="container">
    <view class="text-center title">预约执行时间</view>
    <view class="label" :style="{ margin: '0 0 20rpx 20rpx' }">选择日期</view>
    <day-of-week
      week
      tight
      :value="value.date || dates[activeDateIndex].date"
      :dateDatas="dates"
      @change="onDateChange"
    ></day-of-week>
    <view class="time-container" v-if="mode == 'time'">
      <view class="flex-between">
        <view class="label">选择时段</view>
        <view class="num" v-if="istimeNum">余号：{{ timeNum }}</view>
      </view>
      <scroll-view scroll-y>
        <view class=" time-wrapper">
          <text
            v-for="(item, index) in times"
            class="time-item"
            :class="{
              active: !isDisabled(item) && activeTimeIndex == index,
              disabled: isDisabled(item),
            }"
            :key="index"
            @click.stop="
              () => {
                ;(item.num > 0 || !istimeNum) && (this.activeTimeIndex = index)
              }
            "
          >
            {{ item.startTime }}~{{ item.endTime }}
          </text>
        </view>
      </scroll-view>
    </view>
    <view class="button-wrapper">
      <view class="button" @click.stop="confirm">
        确定
      </view>
    </view>
  </view>
</template>
<script>
import DayOfWeek from '@/components/app/day-of-week'
import { getDisDate } from '@/common/request/advice'
export default {
  components: {
    DayOfWeek,
  },
  props: {
    id: String,
    type: String,
    mode: String, //mode=time 精确到时间段选择
    value: Object,
    istimeNum: Object, //是否需要余数
  },
  data() {
    return {
      activeDateIndex: -1,
      activeTimeIndex: -1,
      dates: [],
    }
  },
  computed: {
    timeNum() {
      return (
        this.dates?.[this.activeDateIndex]?.list?.[this.activeTimeIndex]?.num ??
        0
      )
    },

    times() {
      return (
        this.dates.find(
          item => item.date == this.dates?.[this.activeDateIndex].date,
        )?.list ?? []
      )
    },
  },
  watch: {
    id() {
      this.getDates()
    },
  },
  created() {
    this.getDates()
  },
  methods: {
    isDisabled(item) {
      return (
        new Date(
          `${this.dates?.[this.activeDateIndex]?.date} ${item.endTime}`,
        ) < new Date()
      )
    },
    getDates() {
      const params = {
        id: this.id,
        type: this.type,
      }

      getDisDate(params).then(data => {
        this.dates = data

        data.forEach((item, index) => {
          if (item.sumNum > 0 && this.activeDateIndex < 0) {
            this.activeDateIndex = index
          }
        })

        if (this.type == 'EXAMINE') {
          if (this.value.start) {
            this.activeTimeIndex =
              data[this.activeDateIndex]?.list
                ?.map(_ => _.startTime)
                ?.indexOf(this.value.start) || -1
          } else {
            data[this.activeDateIndex]?.list?.forEach((item, index) => {
              if (item.num > 0 && this.activeTimeIndex < 0) {
                this.activeTimeIndex = index
              }
            })
          }
        }
      })
    },
    onDateChange(date) {
      this.activeDateIndex = this.dates
        .map(item => item.date)
        .indexOf(date.fullDate)
    },
    confirm() {
      const time = this.dates[this.activeDateIndex]?.list?.[
        this.activeTimeIndex
      ]
      this.$emit(
        'confirm',
        this.dates[this.activeDateIndex]?.date +
          (time ? ` ${time.startTime}~${time.endTime}` : ''),
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  background-color: #fff;
}

.text-center {
  text-align: center;
}

.title {
  margin-bottom: 12rpx;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e6e6e6;
  font-size: 32rpx;
  color: #1a1a1a;
}

.label {
  font-size: 26rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.num {
  color: $uni-color-primary;
}

.time-container {
  padding: 20rpx;
}

.time-wrapper {
  word-break: break-all;
  max-height: 150px;
}

.time-item {
  margin: 12rpx;
  width: 210rpx;
  display: inline-block;
  line-height: 78rpx;
  border-radius: 40rpx;
  text-align: center;
  background-color: #f2f2f2;
  color: #333;

  &.active {
    background-color: $uni-color-primary;
    color: #fff;
  }

  &.disabled {
    color: #ccc;
  }
}

.button-wrapper {
  padding: 24rpx 0;
}

.button {
  margin: 0 auto;
  width: 80vw;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  background-color: $uni-color-primary;
  color: #fff;
}
</style>
