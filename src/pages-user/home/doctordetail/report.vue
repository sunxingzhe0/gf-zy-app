<template>
  <uni-popup ref="pop" type="bottom">
    <view class="container">
      <view class="flex-between">
        <view class="title">选择报告（{{ checkedList.length }}）</view>
        <view class="close" @click="close"
          ><uni-icons
            type="closeempty"
            class="closeIcon"
            color="#999"
          ></uni-icons
        ></view>
      </view>
      <view class="flex-around tab">
        <view
          class="tab-item"
          :class="{ active: active == 0 }"
          @click="active = 0"
          >检查报告</view
        >
        <view
          class="tab-item"
          :class="{ active: active == 1 }"
          @click="active = 1"
          >检验报告</view
        >
      </view>
      <scroll-view scroll-y class="scroll-view">
        <checkbox-group class="checkbox-group" @change="e => this.checkedList = e.detail.value">
          <view
            class="item"
            v-for="item in active ? examines : inspects"
            :key="item.visitNo"
          >
            <view class="flex-between">
              <view>
                <text class="tag">检查报告</text>
                <text
                  >报告编号：{{ active ? item.reportNo : item.visitNo }}</text
                >
              </view>
              <view class="name">{{ item.name }}</view>
            </view>
            <view class="name">{{ item.labItemName }}</view>
            <view
              >申请医生：{{ item.applyDocName }} | 申请时间：{{
                timeFormat(item.applyDtime)
              }}</view
            >
            <view
              >报告医生：{{
                active ? item.reportDocName : item.examDoctorName
              }}
              | 报告时间：{{
                timeFormat(active ? item.reportDtime : item.reportDtime)
              }}</view
            >
            <label class="checkbox-label">
              <checkbox
                class="checkbox"
                color="#0ab2c1"
                :value="item.visitNo"
              />
            </label>
          </view>
        </checkbox-group>
      </scroll-view>
      <view class="button" @click="submit">确定</view>
    </view>
  </uni-popup>
</template>
<script>
import { inspectList, examineList } from '@/pages-zy/api/outpatient'
export default {
  props: {
    patientCard: String,
  },
  data() {
    return {
      active: 0,
      inspects: [],
      examines: [],
      checkedList: [],
    }
  },
  watch: {
    patientCard() {
      this.getInspect()
      this.getExamines()
    },
  },
  methods: {
    open() {
      this.$refs.pop.open()
    },
    close() {
      this.$refs.pop.close()
    },
    timeFormat(time) {
      return this.FORMATDATE(time, 'yyyy-MM-dd')
    },
    getInspect() {
      const params = {
        cardNo: this.patientCard,
        beginDate: '',
        endDate: '',
      }
      inspectList(params).then(data => (this.inspects = data))
    },
    getExamines() {
      const params = {
        cardNo: this.patientCard,
        beginDate: '',
        endDate: '',
      }
      examineList(params).then(data => (this.examines = data))
    },
    submit() {
      this.$emit('submit', [...this.checkedList])
      this.$refs.pop.close()
    }
  },
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  height: 100vh;
  padding: 12rpx 32rpx 100rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
}
.title {
  font-size: 32rpx;
}
.close {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #f2f2f2;
  text-align: center;
  line-height: 40rpx;
}
.tab {
  padding-top: 20rpx;
  font-size: 26rpx;
}
.tab-item {
  padding-bottom: 20rpx;
  border-bottom: 4rpx solid #fff;

  &.active {
    border-bottom-color: $uni-color-primary;
    color: $uni-color-primary;
  }
}
.scroll-view {
  height: 85%;
  margin-top: 20rpx;
}
.item {
  box-sizing: border-box;
  padding: 0 20rpx 20rpx;
  color: #666;

  + .item {
    padding: 20rpx;
    border-top: 4rpx solid rgba(0, 0, 0, 0.1);
  }
}
.tag {
  margin-right: 12rpx;
  padding: 4rpx;
  background: rgba(10, 178, 193, 0.2);
  color: $uni-color-primary;
}
.name {
  font-size: 32rpx;
  color: #1a1a1a;
}
.checkbox-label {
  display: block;
  width: 30rpx;
  margin: -50rpx 0 0 auto;
}
.checkbox {
  transform: scale(0.8);
}
.button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88rpx;
  line-height: 86rpx;
  background-color: $uni-color-primary;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
}
</style>
