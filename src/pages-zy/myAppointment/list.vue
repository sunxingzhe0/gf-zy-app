<template>
  <view style="padding-top: 60rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar>
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

        <!-- <app-list-item label="选择时间" :styles="{padding:'16rpx 30rpx'}">
          <view class="flex_1 text-right color666 flex-end-start">
            <select-date-range :date="rangeData" @confirm="dateChange"></select-date-range>
          </view>
        </app-list-item> -->
      </template>
    </topbar>
    <!--左菜单栏-->
    <leftTab
      :tabs="tabs"
      styles="top:100rpx;"
      :active="active"
      @change="topbarChange"
    ></leftTab>
    <view style="padding: 20rpx;padding-left: 180rpx;">
      <medical
        :patientInfo="patient"
        ref="medical"
        v-if="patient.memberId && active == 1"
        :type="active"
      ></medical>
      <online :patientInfo="patient" ref="online" v-if="active == 2"></online>
      <inspection
        :patientInfo="patient"
        ref="inspection"
        v-if="patient.memberId && (active == 3 || active == 4)"
        :type="active == 3 ? 'EXAMINE' : 'LAB'"
      ></inspection>
      <register
        :patientInfo="patient"
        :type="state"
        ref="register"
        v-if="active === 0 && patient.memberId"
      ></register>
    </view>
  </view>
</template>
<script>
import dayjs from 'dayjs'
import selectPatient from '../components/selectPatient.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import selectDateRange from '../components/selectDateRange.vue'
import leftTab from '@/components/leftTab/index.vue'
import medical from './components/medical.vue'
import online from './components/online.vue'
import inspection from './components/inspection.vue'
import register from './components/register.vue'
import { myAppointment, orderRefund } from '../api/user.js'
export default {
  components: {
    selectPatient,
    selectDateRange,
    AppCard,
    AppListItem,
    leftTab,
    medical,
    online,
    inspection,
    register,
  },
  data() {
    return {
      tabs: [
        {
          title: '预约挂号',
          key: 0,
        },
        // {
        //   title: '体检预约',
        //   key: 1,
        // },
        {
          title: '线上预约',
          key: 2,
        },
        {
          title: '检查预约',
          key: 3,
        },
        {
          title: '检验预约',
          key: 4,
        },
      ],
      active: 0,
      rangeData: [
        dayjs().format('YYYY-MM-DD'),
        dayjs()
          .add(7, 'day')
          .format('YYYY-MM-DD'),
      ],
      recordId: '',
      perId: '',
      patient: {},
      state: 1,
    }
  },
  onLoad(option) {
    if (option.type) {
      this.active = parseInt(option.type)
    }
    if (option.state) {
      this.state = parseInt(option.state)
    }
    uni.$on('SYNC_MY_RESERVE', this.init)
  },
  onShow() {
    // if (this.perId) {
    //   this.init()
    // }
  },
  onUnload() {
    uni.$off('SYNC_MY_RESERVE')
  },
  onReachBottom() {
    if (this.active == 1) {
      this.$refs.medical.getPageMore()
    } else if (this.active == 3 || this.active == 4) {
      this.$refs.inspection.getPageMore()
    } else if (this.active == 2) {
      this.$refs.online.getPageMore()
    }
  },
  methods: {
    init() {
      if (this.active == 1) {
        this.$refs.medical.init()
      } else if (this.active > 2) {
        this.$refs.inspection.init()
      } else if (this.active == 2) {
        this.$refs.online.init()
      } else {
        this.$refs.register.init()
      }
    },
    changePatient(item) {
      this.perId = item.memberId
      this.patient = item
      this.$nextTick(this.init)
    },
    topbarChange(e) {
      this.active = e
      console.log(e, '------------')
      this.$nextTick(() => {
        if (this.active > 2) {
          this.$refs.inspection.current = 1
        }
        this.init()
      })
    },
  },
}
</script>
<style scoped lang="scss">
.menzhenItemBox {
  padding: 7rpx 0 20rpx 20rpx;
  background: #fff;
  overflow: hidden;
  margin: 20rpx auto 0;
  border-radius: 22rpx;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .dateBox {
    padding: 15rpx 0 15rpx 15rpx;
    border-bottom: 1rpx solid #e9eff4;
    margin-bottom: 15rpx;

    .date {
      font-size: 28rpx;
      color: #333333;
      font-weight: 600;
    }

    .icon {
      width: 96rpx;
      line-height: 42rpx;
      background: #0ab2c1;
      border-radius: 4rpx;
      text-align: center;
      font-size: 24rpx;
      color: #fff;
    }
  }

  .contentBox {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headerImg {
      width: 130rpx;
      height: 130rpx;
      border-radius: 50%;
      overflow: hidden;
    }

    .content {
      padding-left: 15rpx;

      .contentItem {
        .name {
          font-size: 34rpx;
          color: #333333;
          font-weight: 600;
        }

        .pay {
          font-size: 28rpx;
          color: #646464;
          font-weight: 500;
        }

        .doctor {
          color: #373737;
          font-size: 28rpx;
          font-weight: 400;
        }
      }

      .icon {
        width: 101rpx;
        line-height: 42rpx;
        border-radius: 4rpx;
        border: 1rpx solid #979797;
        font-size: 24rpx;
        color: #8c8c8c;
        text-align: center;
        margin-right: 22rpx;
      }

      .popTips {
        width: 500rpx;
        height: 400rpx;
        border-radius: 15rpx;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .tipsTitle {
          width: 100%;
          font-size: 30rpx;
          font-weight: 500;
          color: rgba(42, 42, 42, 1);
          padding: 30rpx 0 0;
          text-align: center;
        }

        .tips {
          padding: 0 30rpx 20rpx;
          line-height: 45rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }

        .isok {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1rpx solid #e9eff4;

          .cancel {
            width: 50%;
            padding: 20rpx 0 25rpx 0;
            text-align: center;
            font-size: 32rpx;
            color: #646464;
            border-right: 1rpx solid #e9eff4;
          }
        }
      }
    }
  }
}
</style>
