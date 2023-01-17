<template>
  <uni-popup ref="filterPop" type="top" @change="maskClick">
    <view class="filter-pop">
      <view class="filter-head flex-between">
        <view class="item flex-between" @click="openTimePop">
          <text>{{ dateTime || '开始时间～结束时间' }}</text>
          <text class="iconfont icon-xiala icons"></text>
        </view>
        <view class="item flex-between" @click="cancel">
          <text>{{ showRight }}</text>
          <text class="iconfont icon-xiala icons"></text>
        </view>
      </view>
      <view class="filter-body">
        <view class="item">
          <view class="title">活动类型</view>
          <view class="select">
            <template v-for="(v, i) in typeRange">
              <view
                :key="i"
                :class="'option ' + (typeIndex == i ? 'active' : '')"
                @click="changeTypeOpt(i)"
                >{{ v.label }}</view
              >
            </template>
          </view>
        </view>
        <view class="item">
          <view class="title">活动状态</view>
          <view class="select">
            <template v-for="(v, i) in stateRange">
              <view
                :key="i"
                :class="'option ' + (stateIndex == i ? 'active' : '')"
                @click="changeStateOpt(i)"
                >{{ v.label }}</view
              >
            </template>
          </view>
        </view>
        <view class="item">
          <view class="title">报名状态</view>
          <view class="select">
            <template v-for="(v, i) in reportRange">
              <view
                :key="i"
                :class="'option ' + (reportIndex == i ? 'active' : '')"
                @click="changeReportOpt(i)"
                >{{ v.label }}</view
              >
            </template>
          </view>
        </view>
      </view>
      <view class="filter-foot flex-between">
        <view class="btns" @click="cancel">取消</view>
        <view class="border"></view>
        <view class="btns confrim" @click="submit">确定</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    dateTime: {
      type: String,
    },
  },
  data() {
    return {
      typeIndex: 0,
      typeRange: [
        { label: '全部', value: '' },
        { label: '团体活动', value: '团体活动' },
        { label: '团体治疗', value: '团体治疗' },
        { label: '团体督导', value: '团体督导' },
      ],
      stateIndex: 1,
      stateRange: [
        { label: '全部', value: '' },
        { label: '进行中', value: 1 },
        { label: '未开始', value: 4 },
        { label: '暂停', value: 3 },
        { label: '已结束', value: 2 },
      ],
      reportIndex: 0,
      reportRange: [
        { label: '全部', value: '' },
        { label: '报名成功', value: 1 },
        { label: '待审核', value: 2 },
        { label: '报名失败', value: 3 },
        { label: '待支付', value: 4 },
      ],
      laseIndex: {
        typeIndex: 0,
        stateIndex: 1,
        reportIndex: 0,
      },
      isEdit: false,
    }
  },
  computed: {
    showRight() {
      return this.showChoose()
    },
  },
  methods: {
    open() {
      this.$refs.filterPop.open()
    },
    close() {
      this.$refs.filterPop.close()
    },
    submit() {
      let data = {
        type: this.typeRange[this.typeIndex].value,
        state: this.stateRange[this.stateIndex].value,
        report: this.reportRange[this.reportIndex].value,
        filterValue: this.showChoose(),
      }
      let last = {
        typeIndex: this.typeIndex,
        stateIndex: this.stateIndex,
        reportIndex: this.reportIndex,
      }
      this.laseIndex = last
      this.isEdit = true
      this.$refs.filterPop.close()
      this.$emit('confrim', data)
    },
    cancel() {
      this.$refs.filterPop.close()
    },
    changeTypeOpt(i) {
      this.typeIndex = i
    },
    changeStateOpt(i) {
      this.stateIndex = i
    },
    changeReportOpt(i) {
      this.reportIndex = i
    },
    openTimePop() {
      this.cancel()
      this.$emit('openTimePop')
    },
    showChoose() {
      let type = this.typeRange[this.typeIndex].label
      let state = this.stateRange[this.stateIndex].label
      let report = this.reportRange[this.reportIndex].label
      return `${type}｜${state}｜${report}`
    },
    maskClick(e) {
      if (e.show) return (this.isEdit = false)
      if (this.isEdit) return
      this.typeIndex = this.laseIndex.typeIndex
      this.stateIndex = this.laseIndex.stateIndex
      this.reportIndex = this.laseIndex.reportIndex
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-pop {
  width: 100%;
  height: 540rpx;
  background: #ffffff;
  border-radius: 0 0 20rpx 20rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333;
}
.filter-head {
  font-size: 26rpx;
  padding: 20rpx 10rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #e6e6e6;
  .item {
    flex: 1;
    margin: 0rpx 10rpx;
  }
  .icons {
    font-size: 12rpx;
  }
}
.filter-body {
  padding: 15rpx 20rpx 5rpx;
  box-sizing: border-box;
  .item {
    width: 100%;
    .title {
      font-size: 26rpx;
      margin-bottom: 5rpx;
    }
    .select {
      display: flex;
      width: 100%;
      overflow-x: scroll;
      padding-bottom: 15rpx;
      .option {
        flex-shrink: 0;
        width: 180rpx;
        height: 55rpx;
        line-height: 55rpx;
        text-align: center;
        background: #f2f2f2;
        border-radius: 30rpx;
        margin-right: 20rpx;
      }
    }
  }
}
.filter-foot {
  width: 100%;
  height: 80rpx;
  border-top: 1rpx solid #e6e6e6;
  text-align: center;
  line-height: 86rpx;
  .btns {
    width: 50%;
    font-size: 28rpx;
    color: #999999;
  }
  .confrim {
    color: #0ab2c1;
  }
  .border {
    width: 1rpx;
    height: 100%;
    background: #e6e6e6;
  }
}
.active {
  background: #0ab2c1 !important;
  color: #fff;
}
</style>
