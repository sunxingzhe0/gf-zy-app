<template>
  <view style="padding-top: 80rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="[]">
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
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
        </view>

        <!-- <app-list-item
          label="选择时间"
          noBorder
          :styles="{ padding: '16rpx 30rpx' }"
        >
          <view class="flex_1 text-right color666">
            <select-date-range
              :date="rangeData"
              @confirm="dateChange"
            ></select-date-range>
          </view>
        </app-list-item> -->
      </template>
    </topbar>
    <view style="padding: 20rpx;">
      <app-card
        styles="padding: 30rpx;position:relative;"
        v-for="(item, index) in list"
        :key="index"
        @click="
          goto(
            `/pages-zy/inpatientServices/listInfo?patientName=${
              item.patientName
            }&inTimes=${item.inTimes}&inSno=${
              item.inSno
            }&patientId=${perId}&admitDtime=${item.admitDtime}${
              item.dischargeDtime
                ? '&dischargeDtime=' + item.dischargeDtime
                : ''
            }`,
          )
        "
      >
        <app-list-item
          label="健康卡"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.patientName"
          noBorder
        ></app-list-item>
        <app-list-item
          label="住院号"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.inSno"
          noBorder
        ></app-list-item>
        <app-list-item
          label="医院"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.orgName || '-'"
          noBorder
        ></app-list-item>
        <app-list-item
          label="科室"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.deptName"
          noBorder
        ></app-list-item>
        <app-list-item
          label="病区"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.wardName"
          noBorder
        ></app-list-item>
        <app-list-item
          label="床号"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.bedNo"
          noBorder
        ></app-list-item>
        <app-list-item
          label="诊断"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.admitDiag || '-'"
          noBorder
        ></app-list-item>
        <app-list-item
          label="入院时间"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.admitDtime"
          noBorder
        ></app-list-item>
        <app-list-item
          label="出院时间"
          v-if="item.dischargeDtime"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          :value="item.dischargeDtime"
          noBorder
        ></app-list-item>
        <app-list-item
          label="入院天数"
          :styles="{ padding: '10rpx', paddingLeft: 0 }"
          noBorder
        >
          <view class="colorred">{{ item.days }}天</view>
        </app-list-item>
        <view :class="['state', item.dischargeDtime ? 'no' : '']">{{
          item.dischargeDtime ? '已出院' : '住院中'
        }}</view>
      </app-card>
      <!-- <uni-load-more
        v-if="list.length > 0"
        status="nomore"
        :contentText="{
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载数据中',
          contentnomore: '没有更多数据了',
        }"
      ></uni-load-more> -->
      <!-- <noData v-if="list.length == 0"></noData> -->
      <view v-if="list.length == 0" class="noneData">
        <image :src="require('@/pages-zy/images/nohospit.png')" alt="" />
        <text>近六个月无住院记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import noData from '../components/NoData.vue'
import dayjs from 'dayjs'
import selectPatient from '../components/selectPatient.vue'
// import selectDateRange from '../components/selectDateRange.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import { findZyList } from '../api/inHospital'
export default {
  components: {
    selectPatient,
    // selectDateRange,
    AppCard,
    AppListItem,
    noData,
  },
  data() {
    return {
      rangeData: [
        dayjs()
          .subtract(6, 'months')
          .format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD'),
      ],
      perId: '',
      list: [],
    }
  },
  onLoad(options) {
    this.perId = options.perId
  },
  methods: {
    // dateChange(e) {
    //   this.rangeData = e
    //   this.getfindZyList()
    // },
    changePatient(item) {
      this.perId = item.memberId
      this.getfindZyList()
    },
    // 获取列表
    async getfindZyList() {
      uni.showLoading()
      const res = await findZyList({
        patientId: this.perId,
        startTime: this.rangeData[0] || '',
        endTime: this.rangeData[1] || '',
      })
      uni.hideLoading()
      const sortList = res.sort((a, b) => {
        return new Date(b.admitDtime) - new Date(a.admitDtime)
      })
      if (sortList.length > 1) {
        this.list = [sortList[0]]
        return
      }
      this.list = sortList
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/common/order.scss';

.state {
  position: absolute;
  right: 0;
  top: 34rpx;
  width: 140rpx;
  height: 46rpx;
  background: rgba(10, 178, 193, 0.2);
  color: $uni-color-primary;
  line-height: 46rpx;
  text-align: center;

  &.no {
    background: #f0f0f0;
    color: #666;
  }
}
.noneData {
  margin: 200rpx auto;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text {
    display: inline-block;
    font-size: 28rpx;
    color: #999;
    margin-top: 10rpx;
    width: 200px;
  }
  image {
    height: 221rpx;
    width: 221rpx;
  }
}
</style>
