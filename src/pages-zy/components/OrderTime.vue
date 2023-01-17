<template>
  <view class="orderTime">
    <!-- 查看可预约时间 -->
    <view class="dateBox">
      <!-- <div class="title">查看可预约时间</div> -->
      <scroll-view :scroll-x="true" :scroll-left="scrollLeft" class="timeBox">
        <template v-for="(item, index) in list">
          <view
            :class="[
              'weekBox',
              item.usable === false ? 'disabled' : '',
              cur == item.date ? 'on' : '',
            ]"
            :key="index"
            @click="changeActive(item, index)"
          >
            <view class="week">{{ item.week }}</view>
            <view class="dayItem">
              {{ item.day || '日期' }}
            </view>
          </view>
        </template>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import dayjs from 'dayjs'
import { getReverseDeptDate } from '@/common/request/doctorAppointment'
export default {
  props: {
    active: {
      type: String,
    },
    isToday: {
      type: Boolean,
      default: false,
    },
    deptId: String,
  },
  watch: {
    deptId() {
      this.getDates()
    },
    active() {
      this.cur = this.active
      this.$nextTick(() => {
        this.list.forEach((item, index) => {
          if (this.cur == item.date) {
            this.scrollLeft = index * 30
          }
        })
      })
    },
  },
  data() {
    return {
      // 挂号日期是否可以约列表
      list: [],
      cur: dayjs().format('YYYY-MM-DD'),
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      scrollLeft: 0,
      deptDates: [],
    }
  },
  created() {
    if (this.active) {
      this.cur = this.active
    }
  },
  methods: {
    async getDates() {
      if (!this.deptId) return

      this.deptDates = await getReverseDeptDate({
        orgId: this.$store.state.userInfo.platOrgId,
        deptId: this.deptId,
      })
      this.getweek()
    },
    getweek() {
      let date = []
      for (let i = 0; i < 8; i++) {
        date.push({
          day: dayjs()
            .add(i, 'day')
            .format('MM-DD'),
          date: dayjs()
            .add(i, 'day')
            .format('YYYY-MM-DD'),
          week:
            dayjs()
              .add(i, 'day')
              .format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')
              ? '当天'
              : dayjs()
                  .add(i, 'day')
                  .format('YYYY-MM-DD') ==
                dayjs()
                  .add(1, 'day')
                  .format('YYYY-MM-DD')
              ? '明天'
              : this.week[
                  dayjs()
                    .add(i, 'day')
                    .format('d')
                ],
        })
      }
      this.list = date.map((item, index) =>
        Object.assign(item, { usable: this.deptDates[index].state }),
      )
      console.log(this.list)
    },
    changeActive(item) {
      if (typeof item.usable == 'boolean' && !item.usable) return
      this.cur = item.date
      // let selDay = new Date().getFullYear() + '-' + item.day
      this.$emit('selectDay', item)
    },
  },
}
</script>
<style scoped lang="scss">
.dateBox {
  background: #fff;
  .title {
    font-size: 28rpx;
    color: #646464;
    font-weight: 400;
    margin: 0 0 10rpx 27rpx;
  }

  .timeBox {
    white-space: nowrap;
    overflow-x: auto;
    // height: 124rpx;
    padding: 30rpx 0;
    padding-right: 30rpx;
    box-sizing: border-box;

    .weekBox {
      display: inline-block;
      text-align: center;
      font-size: 28rpx;
      margin-left: 30rpx;
      width: 100rpx;
      height: 100rpx;
      background: #f1f1f1;
      color: #333;
      border-radius: 10px;
      padding: 15rpx 10rpx;
      box-sizing: border-box;
      position: relative;

      view {
        line-height: 34rpx;
      }
      .week {
        font-weight: bold;
      }

      &.disabled {
        color: #a2a2a2;
      }

      &.on {
        background: $uni-color-primary;
        color: #fff;

        &::after {
          position: absolute;
          content: '';
          width: 34rpx;
          height: 4rpx;
          bottom: 0;
          left: 50%;
          margin-left: -17rpx;
          background: #0ab2c1;
        }
      }
    }
  }
}
</style>
