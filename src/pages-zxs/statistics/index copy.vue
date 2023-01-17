<template>
  <view class="page-statis">
    <view class="top-bar">
      <view class="left">
        <image :src="FILE_URL(userInfo.avatar)" class="avatar"></image>
        <text class="doc-name">{{ userInfo.username }}</text>
        <text class="dept">{{ userInfo.deptName }}</text>
      </view>
      <view class="right">
        <view
          class="mini-btn"
          @click="changeActive(0)"
          :class="active === 0 ? 'active' : ''"
          >心咨预约</view
        >
        <view
          class="mini-btn"
          @click="changeActive(1)"
          :class="active === 1 ? 'active' : ''"
          >团体业务</view
        >
      </view>
    </view>
    <!-- 趋势折线图 -->
    <view class="app-card charts-box" v-if="active === 0">
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
      <view v-if="active === 1">
        <view class="total-price">
          <view class="patient-num"
            >报名成功 <text class="num">30</text>人</view
          >
          <view class="price-box"
            ><text class="price-msg">共计</text
            ><text class="price-num">￥21231.00 </text></view
          >
        </view>
        <view class="num-box">
          <view class="mini-num-box">
            <text class="num">3</text>
            <text>团体活动(次)</text>
          </view>
          <view class="mini-num-box">
            <text class="num">5</text>
            <text>团体治疗(次)</text>
          </view>
          <view class="mini-num-box">
            <text class="num">0</text>
            <text>团体督导(次)</text>
          </view>
        </view>
      </view>
      <view v-else class="gh-box">
        <view class="total-price-box">
          <view class="total-price">
            <view class="patient-num">接诊 <text class="num">3</text>次</view>
            <view class="price-box"
              ><text class="price-msg">共计</text
              ><text class="price-num">￥21231.00 </text></view
            >
          </view>
          <view class="total-price-right">
            <view class="mini-num-box">
              <text class="num">2</text>
              <text>新增初诊病人</text>
            </view>
          </view>
        </view>
        <view class="num-box">
          <view class="mini-num-box">
            <text class="num">3</text>
            <text>停诊次数</text>
          </view>
          <view class="mini-num-box">
            <text class="num">20</text>
            <text>请假次数</text>
          </view>
          <view class="mini-num-box">
            <text class="num">20</text>
            <text>爽约次数</text>
          </view>
          <view class="mini-num-box">
            <text class="num">20</text>
            <text>超时次数</text>
          </view>
        </view>
      </view>
      <!-- 活动列表-->
      <view class="activity-list" v-if="active === 1">
        <view class="list-item">
          <view class="list-item-top">
            <text class="title-name">[团体活动]心理治疗</text>
            <text class="title-num">30 人 76%</text>
          </view>
          <view class="progress-box">
            <view class="progress" :style="{ width: '76%' }"></view>
          </view>
        </view>
        <view class="list-item">
          <view class="list-item-top">
            <text class="title-name">[团体活动]心理治疗</text>
            <text class="title-num">30 人 26%</text>
          </view>
          <view class="progress-box">
            <view class="progress" :style="{ width: '26%' }"></view>
          </view>
        </view>
      </view>
      <!-- 柱状图 -->
      <view class="charts-histogram" v-if="active === 1">
        <canvas canvas-id="myid" id="myid" class="charts" @tap="tap" />
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from './u-charts.min.js'
var uChartsInstance = {}
export default {
  data() {
    return {
      active: 0,
      dateActive: 0,
      userInfo: uni.getStorageSync('userInfo'),
      cWidth: 700,
      cHeight: 340,
    }
  },
  onReady() {
    //这里的 750 对应 css .charts 的 width
    this.cWidth = uni.upx2px(700)
    //这里的 500 对应 css .charts 的 height
    this.cHeight = uni.upx2px(340)
    this.getServerDataColumnar() //团体业务混合图
    this.getServerDataLine() //心咨预约区域图
  },
  methods: {
    //切换筛选类型
    changeActive(type) {
      this.active = type
      this.dateActive = 0
      type ? this.getServerDataColumnar() : this.getServerDataLine()
    },
    //切换时间
    changeDate(type) {
      this.dateActive = type
    },
    //区域图
    getServerDataLine() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        let res = {
          categories: [
            '01',
            '04',
            '07',
            '10',
            '13',
            '16',
            '19',
            '22',
            '25',
            '28',
            '31',
          ],
          series: [
            {
              name: '预约量',
              data: [50, 80, 150, 170, 100, 190, 140, 160, 70, 110, 40],
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
          data: [{ min: 0, max: 200 }],
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
        },
      })
    },
    //柱状-折线混合图
    getServerDataColumnar() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
          series: [
            {
              name: '报名人数',
              index: 1,
              type: 'column',
              data: [25, 30, 15, 11, 18, 22],
            },

            {
              name: '金额',
              type: 'line',
              data: [1200, 1400, 1005, 1700, 950, 1600],
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
              max: 100,
              title: '报名人数',
              textAlign: 'left',
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
.page-statis {
  padding: 155rpx 20rpx 0 20rpx;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  align-items: center;
  z-index: 9999;
  .left {
    display: flex;
    align-items: center;
    .avatar {
      width: 74rpx;
      height: 74rpx;
      border-radius: 50%;
      background-color: #f2f2f2;
    }
    .doc-name {
      font-size: 30rpx;
      color: #1a1a1a;
      margin: 0 20rpx;
    }
    .dept {
      font-size: 24rpx;
      color: #4d4d4d;
    }
  }
  .right {
    display: flex;
    align-items: center;
    background: #f1f1f1;
    border-radius: 6rpx;
    height: 56rpx;
    border: 1px solid #f1f1f1;
    .mini-btn {
      width: 140rpx;
      height: 56rpx;
      border-radius: 5rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      color: #4d4d4d;
    }
    .active {
      background-color: #fff;
      color: #0ab2c1;
    }
  }
}
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
