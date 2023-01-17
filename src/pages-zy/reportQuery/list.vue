<template>
  <view style="padding-top: 240rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="健康卡"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0 }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
        </view>

        <app-list-item label="选择时间" :styles="{ padding: '16rpx 30rpx' }">
          <view class="flex_1 text-right color666 flex-end-start">
            <select-date-range
              :date="rangeData"
              @confirm="dateChange"
            ></select-date-range>
          </view>
        </app-list-item>
      </template>
    </topbar>
    <!-- 标签导航 -->
    <view class="checkNavgate">
      <template v-if="active == 0">
        <view
          class="finishList box-shadow"
          v-for="(item, index) in testList1"
          :key="index"
          @click="
            goto(
              '/pages-zy/reportQuery/detail?visitNo=' +
                item.visitNo +
                '&labNo=' +
                item.reportNo +
                '&type=' +
                active +
                '&cardNo=' +
                cardNo +
                '&beginDate=' +
                rangeData[0] +
                '&endDate=' +
                rangeData[1],
            )
          "
        >
          <!-- <view class="listTitle flex-between">
            <view class="num">报告编号：{{ item.reportNo || '-' }}</view>
            <view class="name">{{ item.name }}</view>
          </view> -->
          <view class="listContent">
            <view class="contentLeft">
              <view class="leftTop">
                <view class="title text-overflow">{{
                  item.reportTitle || '-'
                }}</view>
              </view>
              <view class="group1">
                <view class="Item1"
                  >申请医生：{{ item.applyDocName || '-' }}</view
                >
                <view class="Item2"
                  >申请时间：{{ item.applyDtime || '-' }}</view
                >
              </view>
              <view class="group2">
                <view class="Item1"
                  >报告医生：{{ item.reportorName || '-' }}</view
                >
                <view class="Item2"
                  >报告时间：{{ item.reportDtime || '-' }}</view
                >
              </view>
            </view>
          </view>
        </view>
        <uni-load-more
          v-if="testList1.length > 0"
          status="nomore"
          :contentText="{
            contentdown: '上拉显示更多',
            contentrefresh: '正在加载数据中',
            contentnomore: '没有更多数据了',
          }"
        ></uni-load-more>
        <NoData v-if="testList1.length == 0 || testList1 == true"></NoData>
      </template>
      <template v-else>
        <view
          class="finishList box-shadow"
          v-for="(item, index) in testList2"
          :key="index"
          @click="
            goto(
              '/pages-zy/reportQuery/detail?labType=' +
                item.labType +
                '&labNo=' +
                item.reportNo +
                '&type=' +
                active +
                '&cardNo=' +
                cardNo +
                '&beginDate=' +
                rangeData[0] +
                '&endDate=' +
                rangeData[1],
            )
          "
        >
          <!--  <view class="listTitle flex-between">
            <view class="num">报告编号：{{ item.reportNo }}</view>
            <view class="name"
              >{{ item.name
              }}</view
            >
          </view> -->
          <view class="listContent">
            <view class="contentLeft">
              <view class="leftTop">
                <view class="text-overflow title">{{ item.labItemName }}</view>
                <!-- <view class="unhealth" v-show="!item.type">异常</view>
                  <view class="health" v-show="item.type">正常</view> -->
              </view>
              <view class="group1">
                <view class="Item1">申请医生：{{ item.applyDocName }}</view>
                <view class="Item2">申请时间：{{ item.applyDtime }}</view>
              </view>
              <view class="group2">
                <view class="Item1">报告医生：{{ item.reportDocName }}</view>
                <view class="Item2">报告时间：{{ item.reportDtime }}</view>
              </view>
            </view>
          </view>
        </view>
        <uni-load-more
          v-if="testList2.length > 0"
          status="nomore"
          :contentText="{
            contentdown: '上拉显示更多',
            contentrefresh: '正在加载数据中',
            contentnomore: '没有更多数据了',
          }"
        ></uni-load-more>
        <NoData v-if="testList2.length == 0 || testList2 == true"></NoData>
      </template>
    </view>
  </view>
</template>
<script>
import dayjs from 'dayjs'
import selectPatient from '../components/selectPatient.vue'
import selectDateRange from '../components/selectDateRange.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import NoData from '../components/NoData'
import { inspectList, examineList } from '../api/outpatient'
export default {
  components: {
    selectPatient,
    selectDateRange,
    AppCard,
    AppListItem,
    NoData,
  },
  data() {
    return {
      tabs: [
        {
          title: '检查',
          key: 0,
        },
        {
          title: '检验',
          key: 1,
        },
      ],
      active: 0,
      rangeData: [
        dayjs()
          .subtract(1, 'months')
          .format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD'),
      ],
      // 检查数据列表
      testList1: [],
      // 检验数据列表
      testList2: [],
      cardNo: '',
      perId: '',
    }
  },
  onLoad() {},
  methods: {
    dateChange(e) {
      this.rangeData = e
      this.topbarChange(this.active)
    },
    changePatient(item) {
      this.perId = item.memberId
      this.cardNo = item.patientCard
      this.topbarChange(this.active)
    },
    goto(url) {
      uni.navigateTo({
        url,
      })
    },
    //获取检查列表
    async getinspectList() {
      uni.showLoading()
      this.testList1 = await inspectList({
        cardNo: this.cardNo,
        cardType: '2',
        beginDate: this.rangeData[0] ? this.rangeData[0] + ' 00:00:00' : '',
        endDate: this.rangeData[1] ? this.rangeData[1] + ' 23:59:59' : '',
      })
      uni.hideLoading()
    },
    // 获取检验报告
    async getexamineList() {
      uni.showLoading()
      this.testList2 = await examineList({
        cardType: '2',
        cardNo: this.cardNo,
        beginDate: this.rangeData[0] ? this.rangeData[0] + ' 00:00:00' : '',
        endDate: this.rangeData[1] ? this.rangeData[1] + ' 23:59:59' : '',
      })
      uni.hideLoading()
    },
    topbarChange(state) {
      this.active = state
      state == 1 ? this.getexamineList() : this.getinspectList()
    },
  },
}
</script>
<style scoped lang="scss">
@import '~@/common/order.scss';
.checkNavgate {
  padding: 20rpx;
}
.finishList {
  padding: 0 0 20rpx 20rpx;
  margin: 0 auto;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  .listTitle {
    height: 84rpx;
    // background: red;
    border-bottom: 1rpx solid #e9eff4;
    padding-right: 20rpx;
    .num,
    span {
      color: #646464;
      font-size: 28rpx;
    }

    .name {
      font-size: 34rpx;
      color: #333333;
      font-weight: 400;
    }
  }

  .listContent {
    padding-right: 20rpx;

    .contentLeft {
      padding: 15rpx 0;
      font-size: 28rpx;

      .leftTop {
        word-wrap: break-word;

        .title {
          font-size: 32rpx;
          color: #333333;
          margin-bottom: 20rpx;
          margin-top: 20rpx;
        }

        .health {
          font-size: 24rpx;
          padding: 7rpx 27rpx;
          background: rgba(10, 178, 193, 1);
          border-radius: 4rpx 0rpx 0rpx 4rpx;
          text-align: center;
          color: #fff;
          font-weight: 600;
        }

        .unhealth {
          background: #fe5578;
          font-size: 24rpx;
          padding: 7rpx 27rpx;
          border-radius: 4rpx 0rpx 0rpx 4rpx;
          text-align: center;
          color: #fff;
          font-weight: 600;
        }
      }

      .group1,
      .group2 {
        font-size: 26rpx;
        font-weight: 400;
        color: #646464;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10rpx;
      }
    }
  }
}
</style>
