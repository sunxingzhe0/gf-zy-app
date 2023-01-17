<template>
  <view>
    <view class="app-card info">
      <view class="dates">
        <view
          class="date-item"
          @click="changeDate(0)"
          :class="dateActive === 0 && 'active'"
          >今日</view
        >
        <view
          class="date-item"
          @click="changeDate(1)"
          :class="dateActive === 1 && 'active'"
          >近7日</view
        >
        <view
          class="date-item"
          @click="changeDate(2)"
          :class="dateActive === 2 && 'active'"
          >近30日</view
        >
      </view>
      <view>
        <view class="total-price">
          <view class="patient-num"
            >报名成功 <text class="num">{{ infoData.acSignNum }}</text
            >人</view
          >
          <view class="price-box"
            ><text class="price-msg">共计</text
            ><text class="price-num">￥{{ infoData.totalFee }} </text></view
          >
        </view>
        <view class="num-box">
          <view class="mini-num-box">
            <text class="num">{{ infoData.thNum }}</text>
            <text>团体活动(次)</text>
          </view>
          <view class="mini-num-box">
            <text class="num">{{ infoData.tzNum }}</text>
            <text>团体治疗(次)</text>
          </view>
          <view class="mini-num-box">
            <text class="num">{{ infoData.tdNum }}</text>
            <text>团体督导(次)</text>
          </view>
        </view>
      </view>
      <!-- 活动列表-->
      <view class="activity-list">
        <view class="list-item" v-for="(v, i) in infoData.acInfoList" :key="i">
          <view class="list-item-top">
            <text class="title-name">{{ `[${v.type}]${v.name}` }}</text>
            <text class="title-num">{{
              `${v.num} 人 ${v.accounted * 100}%`
            }}</text>
          </view>
          <view class="progress-box">
            <view
              class="progress"
              :style="{ width: `${v.accounted * 100}%` }"
            ></view>
          </view>
        </view>
      </view>
      <!-- 柱状 折线混合图 -->
      <view class="charts-histogram">
        <canvas canvas-id="myid" id="myid" class="charts" @tap="tap" />
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from './u-charts.min.js'
var uChartsInstance = {}
import { getMyActivityCount } from '../api/statistics'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      dateActive: 0,
      cWidth: 700,
      cHeight: 340,
      datesData: [],
      infoData: {},
    }
  },
  onReady() {
    //这里的 750 对应 css .charts 的 width
    this.cWidth = uni.upx2px(700)
    //这里的 500 对应 css .charts 的 height
    this.cHeight = uni.upx2px(340)
    this.changeDate(0)
  },
  methods: {
    //获取数据
    async getData() {
      uni.showLoading()
      try {
        const res = await getMyActivityCount({
          beginTime: `${this.datesData[0]}000000`,
          endTime: `${this.datesData[1]}235959`,
          unitType: this.dateActive,
        })
        this.infoData = res
        const xyData = this.initChartsData(res.acCountList)
        this.getServerDataColumnar(xyData)
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
      }
    },
    //切换时间
    changeDate(type) {
      this.dateActive = type
      const nowDate = dayjs().format('YYYYMMDD')
      const dates = {
        0: [nowDate, nowDate],
        1: [
          dayjs()
            .subtract(6, 'day')
            .format('YYYYMMDD'),
          nowDate,
        ],
        2: [
          dayjs()
            .subtract(30, 'day')
            .format('YYYYMMDD'),
          nowDate,
        ],
      }
      this.datesData = dates[type]
      this.getData()
    },

    //处理xy轴数据(y轴两条)
    initChartsData(data) {
      const indexs = [0, 4, 8, 12, 16, 20, 23]
      const newArr = data.reduce((pre, next, index) => {
        //今日 --有24条显示不完,按4小时一个周期统计合计数据
        if (this.dateActive === 0) {
          if (indexs.includes(index)) {
            pre.push({
              dateInfo: next.dateInfo,
              fee: data.slice(index - 4, index).reduce((p, n) => {
                p += Number(n.fee)
                return p
              }, 0),
              num: data.slice(index - 4, index).reduce((p, n) => {
                p += Number(n.num)
                return p
              }, 0),
            })
          }
        }
        //近7日|| 近30日
        if (this.dateActive === 1 || this.dateActive === 2) {
          pre.push({
            dateInfo:
              this.dateActive === 1 ? next.dateInfo.slice(5) : next.dateInfo,
            fee: Number(next.fee),
            num: next.num,
          })
        }
        return pre
      }, [])
      const xyData = {
        x: newArr.map(v => v.dateInfo),
        y: {
          fee: newArr.map(v => v.fee),
          num: newArr.map(v => v.num),
        },
      }
      console.log(xyData, 'xyData----')

      return xyData
    },
    //柱状-折线混合图
    getServerDataColumnar(data) {
      setTimeout(() => {
        let res = {
          categories: data.x,
          series: [
            {
              name: '报名人数',
              index: 1,
              type: 'column',
              data: data.y.num,
            },

            {
              name: '金额',
              type: 'line',
              data: data.y.fee,
            },
          ],
        }
        this.drawChartsColumnar('myid', res)
      }, 500)
    },
    drawChartsColumnar(id, data) {
      const ctx = uni.createCanvasContext(id, this)
      uChartsInstance[id] = new uCharts({
        type: 'mix',
        context: ctx,
        width: this.cWidth,
        height: this.cHeight,
        categories: data.categories,
        series: data.series,
        animation: true,
        background: '#FFFFFF',
        color: ['#0AB2C1', '#52AFEA'],
        padding: [15, 15, 0, 15],
        legend: {},
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: 'dash',
          dashLength: 4,
          gridColor: '#CCCCCC',
          padding: 10,
          showTitle: true,
          data: [
            {
              position: 'left',
              title: '金额',
              min: 0,
            },
            {
              position: 'right',
              min: 0,
              title: '报名人数',
              textAlign: 'left',
              titleOffsetX: -20,
            },
          ],
        },
        extra: {
          mix: {
            column: {
              width: 10,
            },
          },
        },
      })
    },
    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e)
      uChartsInstance[e.target.id].showToolTip(e)
    },
  },
}
</script>

<style lang="scss" scoped>
.charts-box {
  margin-bottom: 20rpx;
  .title {
    text-align: center;
    color: #1a1a1a;
  }
  .charts-line {
    min-height: 320rpx;
  }
}
.info {
  .dates {
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-around;
    .date-item {
      font-size: 26rpx;
      color: #4d4d4d;
      padding-bottom: 20rpx;
    }
    .active {
      color: #0ab2c1;
      border-bottom: 2px solid #0ab2c1;
    }
  }
  .total-price-box {
    display: flex;
    .total-price {
      flex: 1;
    }
  }
  .total-price {
    margin-top: 30rpx;
    border-radius: 10rpx;
    height: 160rpx;
    background-color: #e6f7f9;
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .patient-num {
      font-size: 30rpx;
      font-weight: bold;
      .num {
        color: #0ab2c1;
        margin: 0 10rpx;
      }
    }
    .price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price-msg {
        font-size: 24rpx;
        color: #4d4d4d;
      }
      .price-num {
        font-size: 40rpx;
        color: #0ab2c1;
      }
    }
  }
  .total-price-right {
    margin-top: 30rpx;
    margin-left: 12rpx;
    .mini-num-box {
      width: 160rpx;
    }
  }
  .num-box {
    display: flex;
    justify-content: space-between;
    margin-top: 12rpx;
  }
  .mini-num-box {
    width: 217rpx;
    height: 160rpx;
    background-color: #e6f7f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    .num {
      color: #0ab2c1;
    }
  }
  .gh-box {
    .num-box {
      .mini-num-box {
        width: 160rpx;
      }
    }
  }
}
.activity-list {
  .list-item {
    margin-top: 30rpx;
    .list-item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15rpx;
      .title-name {
        font-size: 30rpx;
        color: #1a1a1a;
      }
      .title-num {
        font-size: 24rpx;
        color: #666;
      }
    }
    .progress-box {
      height: 24rpx;
      border-radius: 12rpx;
      background-color: #f0f0f0;
      .progress {
        /* width: 76%; */
        height: 24rpx;
        border-radius: 12rpx;
        background-color: #0ab2c1;
      }
    }
  }
}
.charts-histogram {
  min-height: 290rpx;
  margin-top: 30rpx;
}
.charts {
  width: 670rpx;
  height: 340rpx;
}
.charts-line {
  width: 670rpx;
  height: 320rpx;
}
</style>
