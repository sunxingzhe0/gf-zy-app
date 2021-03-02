<template>
  <view style="padding-top: 130rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item label="就诊人" :styles="{padding:'16rpx 30rpx',paddingLeft:0}">
            <view class="flex_1 text-right color666">
              <select-patient textStyle="color:#666;" @patientLoad="changePatient"></select-patient>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
      <view class="waitBox">
        <view class="mcard flex-between box-shadow" v-for="(item,index) in 4" :key="index">
          <view class="num">A501</view>
          <view class="content">
            <view class="contentText">
              <view>当前排队： <text class="personNum">5</text><text class="personNum" style="font-size: 28rpx;">人</text></view>
              <view>预计等待：<text>40分</text></view>
              <view>请前往：<text>儿科5号候诊室等候</text></view>
            </view>
            <view class="refresh">刷新</view>
          </view>
        </view>
        <noData v-if="list.length == 0"></noData>
      </view>
  </view>
</template>
<script>
import AppListItem from '@/components/app/app-list-item'
  import selectPatient from '../components/selectPatient.vue'
  import noData from '../components/NoData.vue'
export default {
  components: { AppListItem ,selectPatient,noData},
  data() {
    return {
      tabs: [{
          title: '门诊',
          key: 0,
          num: 0
        },
        {
          title: '取药',
          key: 1,
          num: 0
        },
        {
          title: '医技',
          key: 2,
          num: 0
        },
        {
          title: '治疗',
          key: 3,
          num: 0
        },
      ],
      current: 0,
      show: false,
      perId:'',
      list:[]
    }
  },
  methods: {
    topbarChange(state) {
      this.current = state
    },
    changePatient(item) {
      this.perId = item.memberId
    },
    showPop() {
      this.show = !this.show
      // 一秒后自动关闭
      setTimeout(() => {
        this.show = false
      }, 900)
    },
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
        border-radius: 30rpx;
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
