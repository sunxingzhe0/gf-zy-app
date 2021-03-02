<template>
  <cover-view class="app-mask">
    <cover-view class="appointment-time app-pop-bottom">
      <cover-view class="appointment-time-header">
        预约执行时间
        <uni-icons
          size="15"
          type="clear"
          class="close"
          color="#E6E6E6"
          @click="close"
        ></uni-icons>
      </cover-view>
      <day-of-week v-model="date" week innerStyle="padding: 30rpx;">
        <cover-view class="appointment-time-title">
          <text class="title-text">选择日期</text>
        </cover-view>
      </day-of-week>
      <cover-view class="select-period">
        <cover-view class="appointment-time-title">
          <text class="title-text">选择时段</text>
          <text class="title-text">余号：<text class="linght">8</text></text>
        </cover-view>
        <cover-view class="period-list">
          <cover-view
            class="period-item"
            v-for="(item, index) in periods"
            :key="index"
            @click="toogleActive(index)"
            :class="{ active: index === activeActive, disabled: item.disabled }"
          >
            {{ item.start.substring(11) + "~" + item.end.substring(11) }}
          </cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
/*
@author     qiang
@name       'appointment-time'
@desc       '预约时间选择'
@props
            date      --   
@emit
            close     Object            {...}
*/
import DayOfWeek from "../day-of-week/index";
export default {
  components: {
    "day-of-week": DayOfWeek
  },
  data() {
    return {
      date: "",
      periods: [
        {
          disabled: true,
          end: "2020-10-15 10:00",
          start: "2020-10-15 09:00"
        },
        {
          disabled: false,
          end: "2020-10-15 10:00",
          start: "2020-10-15 11:00"
        },
        {
          disabled: false,
          end: "2020-10-15 11:00",
          start: "2020-10-15 12:00"
        },
        {
          disabled: false,
          end: "2020-10-15 14:00",
          start: "2020-10-15 15:00"
        },
        {
          disabled: false,
          end: "2020-10-15 15:00",
          start: "2020-10-15 16:00"
        },
        {
          disabled: false,
          end: "2020-10-15 16:00",
          start: "2020-10-15 17:00"
        }
      ],
      activeActive: null
    };
  },
  methods: {
    close() {
      this.$emit('close')
    },
    toogleActive(index) {
      if (this.periods[index].disabled) return;
      this.activeActive = index;
    },
    submit() {
      this.$emit('close', this.periods[index])
    }
  }
};
</script>

<style lang="scss" scoped>
.appointment-time {
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
}
.appointment-time-header {
  height: 110rpx;
  color: #191919;
  font-size: 30rpx;
  font-weight: 500;
  position: relative;
  text-align: center;
  line-height: 110rpx;
  font-family: PingFang SC;
  border-bottom: 1rpx solid #e5e5e5;
  .close {
    right: 40rpx;
    position: absolute;
  }
}
.appointment-time-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  justify-content: space-between;
  .title-text {
    height: 25rpx;
    color: #191919;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 25rpx;
    font-family: PingFang SC;
    &:nth-of-type(2) {
      color: #656565;
    }
  }
  .linght {
    color: #09b1c1;
  }
}
.select-period {
  padding: 30rpx;
  overflow: hidden;
  .period-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .period-item {
    width: 210rpx;
    height: 60rpx;
    color: #333333;
    font-size: 26rpx;
    font-weight: 500;
    text-align: center;
    line-height: 60rpx;
    border-radius: 30rpx;
    margin-bottom: 30rpx;
    background: #f1f1f1;
    font-family: PingFang SC;
    &.disabled {
      color: #cbcbcb;
      background: #f1f1f1;
    }
    &.active {
      color: #ffffff;
      background: #09b1c1;
    }
  }
}
</style>
