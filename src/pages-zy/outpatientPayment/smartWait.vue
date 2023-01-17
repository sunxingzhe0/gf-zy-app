<template>
  <view style="padding-top: 130rpx">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="params.businesType" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx">
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
      </template>
    </topbar>
    <view class="waitBox">
      <view
        class="mcard flex-between box-shadow"
        v-for="item in list"
        :key="item.memberId"
      >
        <view class="num">{{ item.number || '' }}</view>
        <view class="content">
          <view class="contentText">
            <view
              >当前排队： <text class="personNum">{{ item.personNum }}</text
              ><text class="personNum" style="font-size: 28rpx">人</text></view
            >
            <!-- <view
              >预计等待：<text style="color:#ff4500">{{
                item.personNum
                  ? `${(item.personNum * 3).toString().padStart(2, '0')} 分钟`
                  : '-'
              }}</text></view
            > -->
            <view>请前往：<text>门诊病区等候</text></view>
          </view>
          <view
            class="refresh"
            :class="disabled && 'disabled'"
            @click="refresh"
            >{{ countDown || '刷新' }}</view
          >
        </view>
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
      <noData
        v-if="list.length == 0"
        text="暂未获取到您的候诊排队信息"
      ></noData>
    </view>
  </view>
</template>
<script>
import AppListItem from '@/components/app/app-list-item'
import selectPatient from '../components/selectPatient.vue'
import noData from '../components/NoData.vue'
import { getWaitingList } from '../api/outpatient'
export default {
  components: { AppListItem, selectPatient, noData },
  data() {
    return {
      tabs: [
        {
          title: '门诊',
          key: 2,
        },
        {
          title: '检查',
          key: 0,
        },
        {
          title: '检验',
          key: 1,
        },
        {
          title: '取药',
          key: 3,
        },
      ],
      params: {
        hospCode: this.$store.state.userInfo.orgId,
        memberId: '',
        businesType: 2,
        cardNo: '',
        cardType: '7',
      },
      show: false,
      list: null,
      countDown: 0, //倒计时
      disabled: false, //是否禁用刷新
      timer: null, //定时器
    }
  },
  methods: {
    refresh() {
      if (this.disabled) return
      this.getList().then(() => this.$tip('已刷新当前数据'))
      this.disabled = true
      this.countDown = 29
      this.timer = setInterval(() => {
        this.countDown -= 1
        if (this.countDown === 0) {
          clearInterval(this.timer)
          this.disabled = false
        }
      }, 1000)
    },
    async getList() {
      const data = await getWaitingList(this.params)
      this.list =
        this.params.businesType == 2
          ? data.map(item =>
              Object.assign(item, {
                time: this.formatTime(item.expectedTime),
              }),
            )
          : []
    },
    topbarChange(state) {
      this.params.businesType = state
      this.getList()
    },
    changePatient(item) {
      this.params.memberId = item.memberId
      this.params.cardNo = item.patientCard
      this.getList()
    },
    showPop() {
      this.show = !this.show
      // 一秒后自动关闭
      setTimeout(() => {
        this.show = false
      }, 900)
    },
    formatTime(time) {
      const h = parseInt(time / 3600000)
      const m = parseInt(time / 60000)

      return (h ? `${h}小时` : '') + m ? `${m}分钟` : ''
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>
<style scoped lang="scss">
.waitBox {
  margin-top: 20rpx;
  padding: 20rpx;
  .mcard {
    padding: 34rpx 22rpx 34rpx 34rpx;
    margin-top: 20rpx;
    background: #fff;
    border-radius: 22rpx;
    .num {
      width: 142rpx;
      height: 142rpx;
      border-radius: 50%;
      background: #0ab2c1;
      color: #fff;
      font-weight: 600;
      font-size: 48rpx;
      line-height: 142rpx;
      text-align: center;
    }
    .content {
      width: 480rpx;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .contentText {
        font-size: 28rpx;
        color: #8c8c8c;
        .personNum {
          font-size: 42rpx;
          color: #ff4500;
        }
      }
      .refresh {
        font-size: 24rpx;
        color: #8c8c8c;
        width: 101rpx;
        height: 42rpx;
        text-align: center;
        line-height: 42rpx;
        border: 1rpx solid rgba(151, 151, 151, 1);
        border-radius: 10rpx;
      }
      .disabled {
        color: #ccc;
        border: 1rpx solid #ccc;
      }
    }
  }
  .noneData {
    margin: 188rpx auto;
    width: 370rpx;
    height: 281rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
