<template>
  <view>
    <view class="page-title flex-between">
      <view class="item flex-between" @click="$refs.timePop.open()">
        <text>{{ showDate(rangeData) }}</text>
        <image
          v-if="rangeData[1]"
          @click.stop="clearTime"
          class="pop-close"
          :src="require('@/assets/close-popup.png')"
          style="width: 30rpx; height: 30rpx"
        ></image>
        <text class="iconfont icon-xiala" style="font-size: 12rpx"></text>
      </view>
      <view class="item flex-between" @click="$refs.filterPop.open()">
        <text>{{ filterValue || '全部｜进行中｜全部' }}</text>
        <text class="iconfont icon-xiala" style="font-size: 12rpx"></text>
      </view>
    </view>
    <view class="signup-record">
      <template v-if="singData.length > 0">
        <view
          class="sign-item"
          v-for="v in singData"
          :key="v.id"
          @click="openDetailPop(v)"
        >
          <view class="top flex-between">
            <view class="info">
              <text class="name">{{ v.name }}</text>
              <text>{{ v.phone }}</text>
              <text v-if="v.severePatient" class="color-red">重精</text>
            </view>
            <view
              :class="
                'state ' +
                  (v.status == 1
                    ? 'succ'
                    : v.status == 2
                    ? 'error'
                    : v.status == 4
                    ? 'warn'
                    : '')
              "
              >{{ signState[v.status] }}</view
            >
          </view>
          <view class="body flex-between">
            <view class="filed">
              <template v-if="v.relList.length > 0">
                <view v-for="r in v.relList.slice(0, 2)" :key="r.id">{{
                  `${r.fieldName}：${r.fieldValue}`
                }}</view>
              </template>
              <view>报名时间：{{ v.signTime }}</view>
            </view>
            <view class="money">¥ {{ v.cost }}</view>
          </view>
          <view class="bottom">
            <view class="flex-between">
              <view class="title"
                >【{{ v.activityType }}】{{ v.activityName }}</view
              >
              <view :class="'state ' + (v.activityStatus == 2 ? '' : 'succ')">{{
                actState[v.activityStatus]
              }}</view>
            </view>
            <view>活动ID：{{ v.activityId }}</view>
          </view>
        </view>
      </template>
      <view class="noData" v-else>
        <image src="@/pages-zxs/static/noData.png" />
        <view>暂无数据</view>
      </view>
    </view>
    <pop-select-date
      ref="timePop"
      :date="rangeData"
      @confirm="dateChange"
    ></pop-select-date>
    <PickerPop title="报名详情" ref="detailPop" :showSubmit="false">
      <scroll-view :scroll-top="0" scroll-y="true" style="height:800rpx;">
        <RecordDetail
          :signId="signId"
          :actName="activityName"
          :actType="activityType"
          :status="activityStatus"
        />
      </scroll-view>
    </PickerPop>
    <TopFilterPop
      ref="filterPop"
      :dateTime="showDate(rangeData)"
      @confrim="filterRecord"
      @openTimePop="$refs.timePop.open()"
    />
  </view>
</template>
<script>
import dayjs from 'dayjs'
import TopFilterPop from './components/TopFilterPop/index'
import PopSelectDate from '@/pages-zxs/components/pop-select-date/index'
import PickerPop from '../my-active/components/PickerPop/index'
import RecordDetail from './components/RecordDetail/index'
import { recordlist } from '../api/signRecord'
export default {
  components: {
    PopSelectDate,
    PickerPop,
    RecordDetail,
    TopFilterPop,
  },
  data() {
    return {
      signId: null,
      activityName: null,
      activityType: null,
      activityStatus: null,
      filterValue: null,
      rangeData: [],
      actType: '',
      stateVal: 1,
      reportVal: '',
      currentNum: 1,
      // pageSize: 10,
      // total: null,
      pages: null,
      singData: [],
      signState: {
        1: '报名成功',
        2: '审核中',
        3: '报名失败',
        4: '活动费待支付',
      },
      actState: {
        1: '进行中',
        2: '已结束',
        3: '暂停',
        4: '未开始',
      },
      lastFilter: null,
    }
  },
  mounted() {
    this.getRecordlist()
  },
  onReachBottom() {
    // this.pageSize < this.total
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      this.getRecordlist()
    }
  },
  methods: {
    clearTime() {
      this.rangeData = []

      this.getRecordlist()
    },
    //获取活动列表
    async getRecordlist() {
      uni.showLoading()
      let res = await recordlist({
        activityStatus: this.stateVal,
        activityType: this.actType || '',
        signStatus: this.reportVal,
        signStartTime: this.rangeData[0] || '',
        signEndTime: this.rangeData[1] || '',
        currentNum: this.currentNum,
        pageSize: 10,
      })
      this.singData = res.list
      this.pages = res.pages
      // this.total = res.total
      uni.hideLoading()
    },
    //打开详情弹出层
    openDetailPop(item) {
      this.signId = item.id
      this.activityName = item.activityName
      this.activityType = item.activityType
      this.activityStatus = item.activityStatus
      this.$refs.detailPop.open()
    },
    //右侧筛选
    filterRecord(data) {
      this.filterValue = data.filterValue
      this.actType = data.type
      this.stateVal = data.state
      this.reportVal = data.report
    },
    //日期改变
    dateChange(e) {
      let begin = dayjs(e[0]).format('YYYYMMDD000000')
      let end = dayjs(e[1]).format('YYYYMMDD235959')
      this.rangeData = [begin, end]
    },
    //展示日期
    showDate(rangeData) {
      if (rangeData.length <= 0) return '开始时间~结束时间'
      let begin = dayjs(rangeData[0]).format('YYYY-MM-DD')
      let end = dayjs(rangeData[1]).format('YYYY-MM-DD')
      if (dayjs(begin).year() == dayjs(end).year()) {
        let endData = dayjs(end).format('MM-DD')
        return `${begin}~${endData}`
      }
      return `${begin}~${end}`
    },
    //展示状态
    showState(num) {
      return num === 1
        ? '进行中'
        : num === 2
        ? '已结束'
        : num === 3
        ? '暂停'
        : num === 4
        ? '未开始'
        : '-'
    },
    //打开详情页面
    openDetail(id) {
      uni.navigateTo({ url: `/pages-zxs/my-active/detail?id=${id}` })
    },
  },
  watch: {
    stateVal() {
      this.currentNum = 1
      this.getRecordlist()
    },
    actType() {
      this.currentNum = 1
      this.getRecordlist()
    },
    rangeData() {
      this.currentNum = 1
      this.getRecordlist()
    },
    reportVal() {
      this.currentNum = 1
      this.getRecordlist()
    },
  },
}
</script>
<style lang="scss" scoped>
.page-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20rpx 10rpx;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  box-shadow: 0 5rpx 20rpx 0 rgba(0, 0, 0, 0.15);
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333;
  z-index: 1;
  .item {
    flex: 1;
    margin: 0rpx 10rpx;
  }
}
.signup-record {
  padding: 88rpx 20rpx 20rpx;
  box-sizing: border-box;
  font-family: PingFang SC;
  font-size: 24rpx;
  color: #666;
  .sign-item {
    padding: 20rpx;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0 5rpx 20rpx 0 rgba(0, 0, 0, 0.15);
    border-radius: 20rpx;
    margin-top: 20rpx;
    .top {
      margin-bottom: 10rpx;
      .info {
        flex: 1;
        .name {
          font-size: 30rpx;
          margin-right: 10rpx;
          font-weight: 500;
          color: #1a1a1a;
        }
      }
      .succ {
        background: rgba(44, 195, 24, 0.15);
        color: #2cc318;
      }
      .warn {
        background: rgba(248, 205, 96, 0.15);
        color: orange;
      }
      .error {
        background: rgba(247, 74, 74, 0.15);
        color: #f74a4a;
      }
    }
    .body {
      padding-bottom: 15rpx;
      border-bottom: 2rpx solid #ccc;
      .filed {
        flex: 1;
      }
      .money {
        flex-shrink: 0;
        color: #0ab2c1;
      }
    }
    .bottom {
      padding-top: 15rpx;
      .title {
        font-size: 30rpx;
        font-weight: 500;
        color: #1a1a1a;
      }
      .succ {
        background: rgba(10, 178, 193, 0.15);
        color: #0ab2c1;
      }
    }
  }
}
.state {
  padding: 4rpx 10rpx;
  background: rgba(191, 196, 196, 0.15);
  border-radius: 6rpx;
  font-size: 22rpx;
}
.noData {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  image {
    width: 129rpx;
    height: 124rpx;
    margin: 0 auto;
  }
}
.color-red {
  background: rgba(247, 74, 74, 0.15);
  color: #f74a4a;
  font-size: 24rpx;
  border-radius: 6rpx;
  padding: 0 10rpx;
  height: 34rpx;
  line-height: 34rpx;
}
</style>
