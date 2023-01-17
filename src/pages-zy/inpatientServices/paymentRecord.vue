<template>
  <view style="padding-top: 150rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="tabChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="健康卡"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0 }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                :inperId="perId"
                ref="selectPatient"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <view style="padding: 20rpx;">
      <block v-if="type == 0">
        <view>
          <template v-for="(lin, t) in list">
            <view class="date" :key="t">
              {{
                dayjs().format('YYYY') == lin.payTime.split('-')[0]
                  ? ''
                  : lin.payTime.split('-')[0] + '年'
              }}{{
                dayjs().format('YYYY-MM') ==
                lin.payTime.substring(0, lin.payTime.lastIndexOf('-'))
                  ? '本月'
                  : lin.payTime.split('-')[1] + '月'
              }}
            </view>
            <view
              class="list box-shadow listWrap"
              v-for="(item, index) in lin.list"
              :key="index"
            >
              <view class="flex-between listTop">
                <view class="info">支付号：{{ item.payId || '-' }}</view>
                <view :class="['state', type == 1 ? 'down' : '']">{{
                  type == 1 ? '线下' : '线上'
                }}</view>
              </view>
              <view class="listContent">
                <view class="flex-between">
                  <view class="name">{{ item.patientName }}</view>
                  <view class="price"
                    >￥{{ parseFloat(item.fee).toFixed(2) }}</view
                  >
                </view>
                <view class="info">
                  {{ item.inDept || '' }}
                </view>
                <view class="info">缴费时间：{{ item.payTime || '-' }}</view>
              </view>
            </view>
          </template>
          <uni-load-more
            v-if="list.length > 0"
            status="nomore"
            :contentText="{
              contentdown: '上拉显示更多',
              contentrefresh: '正在加载数据中',
              contentnomore: '没有更多数据了',
            }"
          ></uni-load-more>
          <no-data v-if="list.length == 0"></no-data>
        </view>
      </block>
      <block v-if="type == 1">
        <view>
          <template v-for="(lin, t) in list">
            <view class="date" :key="t">
              {{
                dayjs().format('YYYY') == lin.payTime.split('-')[0]
                  ? ''
                  : lin.payTime.split('-')[0] + '年'
              }}{{
                dayjs().format('YYYY-MM') ==
                lin.payTime.substring(0, lin.payTime.lastIndexOf('-'))
                  ? '本月'
                  : lin.payTime.split('-')[1] + '月'
              }}
            </view>
            <view
              class="list box-shadow listWrap"
              v-for="(item, index) in lin.list"
              :key="index"
            >
              <view class="flex-between listTop">
                <view class="info">支付号：{{ item.payId || '-' }}</view>
                <view :class="['state', type == 1 ? 'down' : '']">{{
                  type == 1 ? '线下' : '线上'
                }}</view>
              </view>
              <view class="listContent">
                <view class="flex-between">
                  <view class="name">{{ patientName }}</view>
                  <view class="price"
                    >￥{{ parseFloat(item.totalAmount).toFixed(2) }}</view
                  >
                </view>
                <view class="info">
                  {{ item.deptName || '' }}
                </view>
                <view class="info">缴费时间：{{ item.time || '-' }}</view>
              </view>
            </view>
          </template>
        </view>
        <uni-load-more
          v-if="list.length > 0"
          status="nomore"
          :contentText="{
            contentdown: '上拉显示更多',
            contentrefresh: '正在加载数据中',
            contentnomore: '没有更多数据了',
          }"
        ></uni-load-more>
        <no-data v-if="list.length == 0 || list == null"></no-data>
      </block>
    </view>
  </view>
</template>
<script>
import NoData from '../components/NoData'
import selectPatient from '../components/selectPatient.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import { zyRecord } from '../api/inHospital'
import dayjs from 'dayjs'
export default {
  components: {
    AppCard,
    selectPatient,
    AppListItem,
    NoData,
  },
  data() {
    return {
      perId: '',
      tabs: [
        {
          title: '线上缴费',
          key: 0,
        },
        {
          title: '线下缴费',
          key: 1,
        },
      ],
      currentNum: 1,
      pageSize: 10,
      type: 0,
      list: [],
      linList: [],
      pages: 1,
      showPer: false,
      patientId: '',
      patientName: '',
    }
  },
  onLoad(options) {
    this.perId = options.perId
  },
  methods: {
    dayjs,
    // 选择就诊人
    changePatient(item) {
      this.patientId = item.memberId
      this.patientName = item.name
      this.tabChange(this.type)
    },
    tabChange(state) {
      this.type = state
      this.list = []
      this.linList = []
      this.currentNum = 1
      this.pages = 1
      this.getzyRecord()
    },
    listRecombination(labels) {
      let alpha_dict = new Object()
      let factories = new Array()
      for (var i = 0; i < labels.length; i++) {
        let factory = labels[i]
        factory.showTime = factory.payTime
          ? dayjs(factory.payTime).format('YYYY-MM')
          : dayjs(factory.time).format('YYYY-MM')

        let label = factory.showTime

        if (alpha_dict[label] == undefined) {
          factories.push({
            payTime: label,
            list: [factory],
          })
          alpha_dict[label] = factories.length - 1
        } else {
          factories[alpha_dict[label]].list.push(factory)
        }
      }
      return factories
    },
    async getzyRecord() {
      uni.showLoading()
      let list = await zyRecord({
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        patientId: this.patientId,
        type: this.type,
      })
      uni.hideLoading()
      if (this.type == 1) {
        this.list = this.listRecombination(list)
        console.log(this.list)
      } else {
        this.linList = this.linList.concat(list.list)
        this.list = this.listRecombination(this.linList)
        console.log(this.list)
        this.pages = list.pages
      }
    },
  },
  onReachBottom() {
    if (this.type == 0) {
      if (this.currentNum < this.pages) {
        this.currentNum = this.currentNum + 1
        this.getzyRecord()
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.date {
  font-size: 24rpx;
  color: #666;
  line-height: 80rpx;
  padding-left: 20rpx;
}

.listWrap {
  background: #fff;
  overflow: hidden;
}

.list {
  background: #fff;
  padding-right: 0;
  /* border-bottom: 1px solid #f2f2f2; */
  padding-left: 20rpx;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  .listTop {
    border-bottom: 1px solid #e6e6e6;
    padding: 20rpx 0;

    .info {
      font-size: 26rpx;
      color: #666;
    }
  }

  .listContent {
    padding: 20rpx;
    padding-left: 0;
    /* padding-bottom: 30rpx; */

    .name {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .info {
      font-size: 24rpx;
      color: #666;
    }
  }

  .state {
    padding: 4rpx 18rpx;
    background: rgba(10, 178, 193, 0.2);
    color: #0ab2c1;
    font-size: 24rpx;

    &.down {
      background: rgba(255, 102, 0, 0.2);
      color: #ff6600;
    }
  }

  .price {
    color: $uni-color-primary;
  }
}
</style>
