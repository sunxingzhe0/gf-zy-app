<template>
  <view class="treatment-history">
    <app-card
      styles="margin-bottom: 0;padding: 20rpx; border-radius: 0 0 20rpx 20rpx;"
    >
      <!-- 时间选择器 -->
      <view
        class="flex-between"
        style=" border-bottom: 1px solid #E6E6E6; padding-bottom: 8px;"
      >
        <view>创建日期</view>
        <view class="flex-start-center">
          <picker
            mode="date"
            :value="query.startTime"
            @change="e => this.bindDateChange('startTime', e.target.value)"
          >
            <view class="date-picker-view">{{
              query.startTime || '开始日期'
            }}</view>
          </picker>
          <view style="padding: 0 12rpx;">~</view>
          <picker
            mode="date"
            :start="query.startTime"
            :value="query.endTime"
            @change="e => this.bindDateChange('endTime', e.target.value)"
          >
            <view class="date-picker-view">{{
              query.endTime || '结束日期'
            }}</view>
          </picker>
          <uni-icons
            type="arrowright"
            size="16"
            style="margin-left: 12rpx;"
          ></uni-icons>
        </view>
      </view>

      <app-tab :menus="menus" v-model="tabIndex"></app-tab>
    </app-card>
    <view class="tab-wrapper">
      <view class="tab-views" :style="style">
        <scroll-view
          class="tab-view"
          scroll-y
          v-for="(m, index) in menus"
          :key="index"
          :style="{ height: tabIndex === 0 ? ' 77vh' : '85vh' }"
        >
          <template v-if="tabIndex === index">
            <treatment-item
              v-for="(item, idx) in list"
              :key="item.id"
              :item="item"
              @change="list[idx].checked = !item.checked"
              @statusChange="getList"
            ></treatment-item>
          </template>
        </scroll-view>
      </view>
    </view>

    <view class="bottom-bar flex-between" v-if="tabIndex === 0">
      <view>
        <checkbox-group @change="toggleCheckedAll">
          <label>
            <checkbox
              class="checkbox"
              color="#0ab2c1"
              :checked="checkAll"
            />全选
          </label>
        </checkbox-group>
      </view>
      <view class="flex-justify-end">
        <button class="button" @click="handler(1)">删除</button>
        <button class="button button-primary" @click="handler(2)">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card/index.vue'
import AppTab from '@/pages-doctor/components/app-tab-view/app-tab.vue'
import TreatmentItem from '../../components/treatment-item/index.vue'
import { doctorAdviceList, doctorBatchOpera } from '@/common/request/advice'
export default {
  components: {
    AppTab,
    AppCard,
    TreatmentItem,
  },
  data() {
    const now = +new Date()
    return {
      tabIndex: 0,
      menus: ['草稿', '未缴费', '已缴费', '已失效'],
      query: {
        timeType: 1,
        doctorType: 1,
        startTime: this.FORMATDATE(now - 604800000, 'yyyy-MM-dd'),
        endTime: this.FORMATDATE(now, 'yyyy-MM-dd'),
      },
      list: [],
    }
  },
  watch: {
    tabIndex(value) {
      this.query.doctorType = value + 1
      this.getList()
    },
  },
  computed: {
    style() {
      return `transform: translate(-${this.tabIndex * 100}vw)`
    },
    checkAll() {
      return (
        this.list.length && this.list.filter(item => !item.checked).length === 0
      )
    },
  },
  onShow() {
    this.getList()
  },
  methods: {
    bindDateChange(key, value) {
      this.query[key] = value
      this.getList()
    },
    getList() {
      const { startTime, endTime } = this.query
      const params = Object.assign({}, this.query, {
        startTime: this.FORMATDATE(startTime, 'yyyyMMdd') + '000000',
        endTime: this.FORMATDATE(endTime, 'yyyyMMdd') + '235959',
      })
      doctorAdviceList(params).then(data => {
        this.list = data.list.map(item =>
          Object.assign(item, { checked: false }),
        )
      })
    },
    toggleCheckedAll(e) {
      const value = e.detail.value[0]
      this.list = this.list.map(item =>
        Object.assign(item, { checked: typeof value == 'string' }),
      )
    },
    handler(batchOperaType) {
      if (!this.list.filter(item => item.checked).length) return
      const params = {
        ids: this.list.filter(item => item.checked).map(item => item.id),
        batchOperaType,
      }
      doctorBatchOpera(params).then(() => this.getList())
    },
  },
}
</script>
<style lang="scss" scoped>
.date-picker-view {
  width: 160rpx;
  text-align: center;
}
.treatment-history {
  display: flex;
  flex-direction: column;
}
.tab-wrapper {
  width: 100vw;
  overflow: hidden;
}
.tab-views {
  display: flex;
  flex: 1;
  width: 400vw;
  overflow-y: auto;
  flex-direction: row;
  transition: all ease 0.3s;
}
.tab-view {
  width: 100vw;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
}
.button {
  width: 152rpx;
  line-height: 60rpx;
  margin: 0 0 0 12rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #333;

  &::after {
    border: none;
  }
}

.button-primary {
  border-width: 0;
  background-color: $uni-color-primary;
  color: #fff;
}

.checkbox {
  position: relative;
  top: -4rpx;
  transform: scale(0.6);
}
</style>
