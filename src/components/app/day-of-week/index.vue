<template>
  <view class="day-of-week" :style="innerStyle">
    <slot></slot>
    <view class="toogle-week" v-if="week">
      <view class="prev-week" @click="toogleWeek(-7)">上一周</view>
      <view class="next-week" @click="toogleWeek(7)">下一周</view>
    </view>
    <scroll-view :class="{ week }" scroll-x :scroll-left="scrollLeft" class="date-wrapper">
      <!-- <view class="date-wrapper"> -->
        <view
          class="date-item"
          :class="{ active: allActive }"
          v-if="showAll"
          style="padding:12rpx 0;"
          @click="toogleActive('all')"
        >
          <!-- <view class="date-day" :style="{ padding: '0 16rpx' }"> -->
            <view class="date-day">全部</view>
            <view class="date-day">日期</view>
          <!-- </view> -->
        </view>
        <view
          v-for="(item, index) in dates"
          :key="index"
          class="date-item"
          :class="{
            tight,
            active: item.active && !item.disabled,
            disabled: item.disabled,
          }"
          @click="toogleActive(index)"
        >
          <view class="date-day">{{ item.day }}</view>
          <view class="date-date">{{ item.date }}</view>
        </view>
      <!-- </view> -->
    </scroll-view>
  </view>
</template>

<script>
/*
@author     qiang
@name       'day-of-week'
@desc       '周日期选择'
@slot       slot
@props
            value       string['']        yyyy-mm-dd     选中日期[默认当天]
            dateDatas  array       []                       额外的日期数据
            week        boolean[false]    false          是否可以切换星期[默认不能，可切换星期是开始日期为周一]
            innerStyle  string            padding: 30rpx style样式
            tight        boolean        false               样式紧凑
            showAll    boolean       false                是否显示全部日期选项
@emit
            input    string            yyyy-mm-dd
            change   Object            {...}
*/
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    dateDatas: {
      type: Array,
      default: [],
    },
    week: {
      type: Boolean,
      default: false,
    },
    innerStyle: {
      type: String,
      default: '',
    },
    tight: {
      type: Boolean,
      default: false,
    },
    showAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dates: [],
      start: new Date().getTime(),
      allActive: false,
      scrollLeft:0
    }
  },
  computed: {
    days() {
      const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

      weeks[new Date().getDay()] = '当天'
      weeks[new Date().getDay() + 1] = '明天'

      return weeks
    },
  },
  mounted() {
    if (this.week) {
      let disDay
      let _start = this.date || this.start
      disDay = new Date(_start).getDay() - 1
      disDay = disDay < 0 ? 6 : disDay
      this.start = new Date(_start).getTime() - disDay * 24 * 3600 * 1000
    }
    this.init()
  },
  methods: {
    init() {
      let propsDate
      let dates = []
      if (this.date) propsDate = this.date.substring(5)
      for (let i = 0; i < 7; i++) {
        const dateObj = new Date(this.start + i * 24 * 3600 * 1000)
        const month = this.zoreFill(dateObj.getMonth() + 1)
        const _date = this.zoreFill(dateObj.getDate())
        const day = this.days[dateObj.getDay()]
        const date = month + '-' + _date
        if (!propsDate) propsDate = date
        dates.push({
          day,
          date,
          active: propsDate === date,
          fullDate: dateObj.getFullYear() + '-' + date,
        })
      }

      this.dates = dates.map(item =>
        this.dateDatas.length &&
        !this.dateDatas.map(_ => _.date).includes(item.fullDate)
          ? Object.assign(item, { disabled: true })
          : Object.assign(item, { active: item.fullDate === this.value }),
      )
      this.$nextTick(()=>{
            this.dates.forEach((item,index)=>{
                if(item.fullDate == this.value){
                    this.scrollLeft = index*30
                    console.log(this.scrollLeft )
                }
            })
      })

    },
    zoreFill(val) {
      return val > 9 ? val : '0' + String(val)
    },
    toogleWeek(val) {
      this.start = this.start + val * 24 * 3600 * 1000
      this.init()
    },
    toogleActive(index) {
      if (index == 'all') {
        this.allActive = true
        this.dates = this.dates.map(item =>
          Object.assign(item, { active: false }),
        )
        this.$emit('change', 'all')
        return
      }

      if (this.dates[index].disabled) return

      this.allActive = false
      this.dates = this.dates.map((item, _index) =>
        Object.assign(item, { active: index === _index }),
      )

      this.$emit('input', this.dates[index].fullDate)
      this.$emit('change', this.dates[index])
    },
  },
  watch: {
    value(val) {
      if (!val) return
      this.dates = this.dates.map(item => ({
        ...item,
        active: item.fullDate === val,
      }))
    //   this.dates.forEach((item,index)=>{
    //     if(item.fullDate == val){
    //       this.scrollLeft = index*50
    //       console.log(this.scrollLeft)
    //     }
    //   })
    },
    dateDatas(value) {
      this.dates = this.dates.map(item =>
        !value.map(item => item.date).includes(item.fullDate)
          ? Object.assign(item, { disabled: true })
          : item,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.day-of-week {
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
}
.toogle-week {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0 20rpx 20rpx;
  justify-content: space-between;

  .prev-week,
  .next-week {
    width: 110rpx;
    height: 52rpx;
    color: #333333;
    font-size: 24rpx;
    font-weight: 500;
    text-align: center;
    line-height: 52rpx;
    border-radius: 2rpx;
    background: #ffffff;
    font-family: PingFang SC;
    border: 1rpx solid #cbcbcb;
  }
}

.date-wrapper {
  // display: flex;
  overflow-x: auto;
  margin-right: 20rpx;
  white-space: nowrap;
  &.week {
    width: 100%;
    .date-item {
      box-sizing: border-box;
      border-right: 1rpx solid #fff;

      &:last-child {
        border: none;
      }
    }
    .date-day {
      font-size: 26rpx;
    }
  }
}
.date-item {
  display: inline-block;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // flex-shrink: 0;
  box-sizing: border-box;
  width: 116rpx;
  height: 100rpx;
  padding:15rpx 0;
  margin: 20rpx 12rpx;
  align-items: center;
  border-radius: 10rpx;
  background: #f1f1f1;
  text-align: center;
  color: #333;

  &.disabled {
    color: #ccc;
  }

  &.tight {
    border-radius: 0;
    margin: 20rpx 2rpx;
    background-color: #f2f2f2;

    &:first-child {
      margin-left: 16rpx;
    }
  }

  &.active {
    background: #0ab1c1;

    .date-day,
    .date-date {
      color: #fff;
    }
  }

  .date-wrapper {
    display: flex;
    justify-content: flex-start;
    width: 940rpx;
  }

  .date-day {
    font-size: 30rpx;
    font-weight: bold;
    line-height: 38rpx;
    font-family: PingFang SC;
  }

  .date-date {
    margin-top: 10rpx;
    height: 19rpx;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 19rpx;
    font-family: PingFang SC;
  }
}
</style>
