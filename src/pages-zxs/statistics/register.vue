<template>
  <view>
    <!-- 趋势折线图 -->
    <view class="app-card charts-box">
      <view class="title">未来一个月的预约趋势</view>
      <view class="charts-line">
        <canvas canvas-id="line-id" id="line-id" class="charts" @tap="tap" />
      </view>
    </view>
    <!-- 详情 -->
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
      <view class="gh-box">
        <view class="total-price-box">
          <view class="total-price">
            <view class="patient-num"
              >接诊 <text class="num">{{ infodata.acceptNum }}</text
              >次</view
            >
            <view class="price-box"
              ><text class="price-msg">共计</text
              ><text class="price-num"
                >￥{{ infodata.totalFee || '-' }}</text
              ></view
            >
          </view>
          <view class="total-price-right">
            <view class="mini-num-box">
              <text class="num">{{ infodata.firstVisitNum }}</text>
              <text>新增初诊病人</text>
            </view>
          </view>
        </view>
        <view class="num-box">
          <view class="mini-num-box">
            <text class="num">{{ infodata.stopNum }}</text>
            <text>停诊次数</text>
          </view>
          <view class="mini-num-box">
            <text class="num">{{ infodata.leaveNum }}</text>
            <text>请假次数</text>
          </view>
          <view class="mini-num-box">
            <text class="num">{{ infodata.brokePromiseNum }}</text>
            <text>爽约次数</text>
          </view>
          <view class="mini-num-box">
            <text class="num">{{ infodata.timeoutNum }}</text>
            <text>超时次数</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from './u-charts.min.js'
var uChartsInstance = {}
import { getMyReserveCount } from '../api/statistics'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      dateActive: 0,
      cWidth: 700,
      cHeight: 340,
      datesData: [],
      infodata: {},
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
        const res = await getMyReserveCount({
          beginTime: `${this.datesData[0]}000000`,
          endTime: `${this.datesData[1]}235959`,
        })
        this.infodata = res
        const xyData = this.initChartsData(res.orderTrend)
        console.log(xyData, 'xy-轴')
        this.getServerDataLine(xyData)
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
            .subtract(7, 'day')
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
    //处理xy轴数据(30天)
    initChartsData(data) {
      if (!data || !data.length) return
      const newArr = data.reduce((pre, next, index) => {
        if ([0, 6, 12, 18, 24, 29].includes(index)) {
          //6天一个周期统计节点间数量和
          pre.push({
            //第一个节点直接取该节点数量,其余节点统计节点间数量和
            num:
              index === 0
                ? next.num
                : data.slice(index - 6, index).reduce((p, n) => {
                    p += n.num
                    return p
                  }, 0),
            dateInfo: next.dateInfo ? next.dateInfo.slice(5) : '', //节点显示时间
          })
        }
        return pre
      }, [])
      const xyData = {
        x: newArr.map(v => v.dateInfo), //x轴数据集合
        y: newArr.map(v => v.num), //y轴数据集合
      }
      return xyData
    },
    //区域图绘制
    getServerDataLine(data) {
      setTimeout(() => {
        let res = {
          categories: data.x,
          series: [
            {
              name: '预约量',
              data: data.y,
            },
          ],
        }
        this.drawChartsLine('line-id', res)
      }, 500)
    },
    drawChartsLine(id, data) {
      const ctx = uni.createCanvasContext(id, this)
      uChartsInstance[id] = new uCharts({
        type: 'area',
        context: ctx,
        width: this.cWidth,
        height: this.cHeight,
        categories: data.categories,
        series: data.series,
        animation: true,

        background: '#E6F7F9',
        color: ['#0AB2C1'],
        padding: [15, 10, 0, 15],
        legend: { show: false },
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          data: [{ min: 0 }],
          gridType: 'dash',
          dashLength: 2,
        },
        extra: {
          area: {
            type: 'curve',
            opacity: 0.1,
            addLine: true,
            width: 1,
          },
          tooltip: {},
        },
      })
    },
    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e)
      uChartsInstance[e.target.id].showToolTip(e, {
        //格式化弹窗显示内容
        formatter: (item, category, index, opts) => {
          if (index === 0) return category + '：' + item.data
          return (
            `${opts.categories[index - 1]}~${opts.categories[index]}` +
            '：' +
            item.data
          )
        },
      })
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
.charts {
  width: 670rpx;
  height: 340rpx;
}
.charts-line {
  width: 670rpx;
  height: 320rpx;
}
</style>
