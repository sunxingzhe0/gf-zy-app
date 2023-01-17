<template>
  <view>
    <view class="page-title flex-between">
      <view class="item flex-between" @click="$refs.typePop.open()">
        <text>{{ typeRange[typeIndex] }}</text>
        <text class="iconfont icon-xiala" style="font-size: 12rpx"></text>
      </view>
      <view class="item flex-between" @click="$refs.statePop.open()">
        <text>{{ stateRange[stateIndex].label }}</text>
        <text class="iconfont icon-xiala" style="font-size: 12rpx"></text>
      </view>
      <view class="item flex-between flex2" @click="$refs.timePop.open()">
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
    </view>
    <view class="my-active">
      <template v-if="activeData.length > 0">
        <view
          class="active-item"
          v-for="v in activeData"
          :key="v.id"
          @click="openDetail(v)"
        >
          <view class="body">
            <image
              class="image"
              :src="
                v.activityImgId.indexOf('.') > -1
                  ? FILE_URL_BUILT_IN(v.activityImgId)
                  : FILE_URL(v.activityImgId)
              "
            ></image>
            <view class="info">{{ showState(v.activityStatus) }}</view>
          </view>
          <view class="foot">
            <view class="text"
              >【{{ v.activityType }}】{{ v.activityName }}</view
            >
            <view class="flex-between">
              <text style="margin-left:10rpx;">{{ v.activityBeginTime }}</text>
              <text class="iconfont icon-wode-weixuanzhong icons">{{
                v.activityQuota || 0
              }}</text>
            </view>
          </view>
        </view>
      </template>
      <view class="noData" v-else>
        <image src="@/pages-zxs/static/noData.png" />
        <view>暂无数据</view>
      </view>
    </view>
    <!-- <uni-load-more :status="more"></uni-load-more> -->
    <pop-select-date
      ref="timePop"
      :date="rangeData"
      @confirm="dateChange"
    ></pop-select-date>
    <PickerPop title="选择类型" ref="typePop" @confrim="typeConfirm">
      <picker-view
        :value="actType"
        style="height: 200px; text-align: center"
        indicator-style="height:80rpx;"
        @change="typeChange"
      >
        <picker-view-column>
          <view v-for="(v, i) in typeRange" :key="i" class="picker-item">{{
            v
          }}</view>
        </picker-view-column>
      </picker-view>
    </PickerPop>
    <PickerPop title="选择状态" ref="statePop" @confrim="stateConfrim">
      <picker-view
        :value="stateVal"
        style="height: 200px; text-align: center"
        indicator-style="height:80rpx;"
        @change="stateChange"
      >
        <picker-view-column>
          <view v-for="(v, i) in stateRange" :key="i" class="picker-item">{{
            v.label
          }}</view>
        </picker-view-column>
      </picker-view>
    </PickerPop>
  </view>
</template>
<script>
import dayjs from 'dayjs'
import PopSelectDate from '@/pages-zxs/components/pop-select-date/index'
import PickerPop from './components/PickerPop/index'
import { queryActivity } from '../api/myActive'
export default {
  components: {
    PopSelectDate,
    PickerPop,
  },
  data() {
    return {
      rangeData: [],
      actType: [0],
      typeIndex: 0,
      typeRange: ['全部', '团体活动', '团体督导', '团体治疗'],
      stateVal: [1],
      stateIndex: 1,
      stateRange: [
        { label: '全部', value: '' },
        { label: '进行中', value: 1 },
        { label: '未开始', value: 4 },
        { label: '暂停', value: 3 },
        { label: '已结束', value: 2 },
      ],
      activeData: [],
      currentNum: 1,
      // pageSize: 10,
      // total: null,
      pages: null,
    }
  },
  mounted() {
    this.getActiveList()
  },
  onReachBottom() {
    // this.pageSize < this.total
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      this.getActiveList()
    }
  },
  methods: {
    clearTime() {
      this.rangeData = []

      this.getActiveList()
    },
    //获取活动列表
    async getActiveList() {
      try {
        uni.showLoading()
        let res = await queryActivity({
          timeType: 1,
          activityStatus: this.stateRange[this.stateIndex].value,
          activityType: this.typeIndex ? this.typeRange[this.typeIndex] : '',
          beginTime: this.rangeData[0] || '',
          endTime: this.rangeData[1] || '',
          currentNum: this.currentNum,
          pageSize: 10,
          doctorId: uni.getStorageSync('userId'),
        })
        this.activeData = res.list
        this.pages = res.pages
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
      }
      // this.total = res.total
    },
    //活动类型改变
    typeChange(e) {
      this.typeIndex = e.detail.value[0]
    },
    //确认活动类型
    typeConfirm() {
      this.actType = [this.typeIndex]
    },
    //活动状态改变
    stateChange(e) {
      this.stateIndex = e.detail.value[0]
    },
    //确认活动状态
    stateConfrim() {
      this.stateVal = [this.stateIndex]
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
      let begin = dayjs(rangeData[0]).format('YYYY-MM')
      let end = dayjs(rangeData[1]).format('YYYY-MM')
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
    openDetail(row) {
      uni.navigateTo({
        url: `/pages-zxs/my-active/detail?id=${row.id}&templateId=${row.activityTemplateId}`,
      })
    },
  },
  watch: {
    stateVal() {
      this.currentNum = 1
      this.getActiveList()
    },
    actType() {
      this.currentNum = 1
      this.getActiveList()
    },
    rangeData() {
      this.currentNum = 1
      this.getActiveList()
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
  padding: 20rpx 0;
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
    margin: 0rpx 20rpx;
  }
  .sort {
    width: 30rpx;
    height: 30rpx;
    margin-right: 30rpx;
  }
  .check {
    width: 220rpx;
  }
}
.my-active {
  padding: 88rpx 20rpx 20rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 400;
}
.active-item {
  width: 100%;
  padding-top: 20rpx;
  .body {
    position: relative;
    width: 100%;
    height: 300rpx;
    .image {
      width: 100%;
      height: 100%;
      border-radius: 20rpx 20rpx 0 0;
    }
    .info {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      padding: 0 20rpx;
      background: #0ab2c1;
      box-sizing: border-box;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #fff;
    }
  }
  .foot {
    padding: 20rpx;
    box-sizing: border-box;
    background: #fff;
    border-radius: 0 0 20rpx 20rpx;
    .text {
      font-size: 30rpx;
    }
    .icons {
      width: 100rpx;
      text-align: right;
    }
  }
}
.picker-item {
  line-height: 34px;
}
.flex2 {
  flex: 2 !important;
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
</style>
