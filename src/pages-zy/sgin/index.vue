<template>
  <view style="padding-top: 40px;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar>
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="就诊人"
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

    <view class="orderList">
      <template>
        <view class="orderListBox">
          <view
            class="orderItem box-shadow"
            v-for="(item, index) in testList1"
            :key="index"
            @click="goInfo(item.billData)"
          >
            <view class="date flex-between">
              <view class="time">{{ item.appointmentDate }}</view>
              <text class="tag" v-if="item.today" type="warning">当日</text>
            </view>
            <view class="content flex-start-start">
              <view class="headerImg">
                <default-img :url="FILE_URL(item.doctorAvatar)"></default-img>
              </view>
              <view class="contentBox flex_1">
                <view class="contentText">
                  <view class="card-lists">
                    <view>
                      <view class="name">{{ item.name }}</view>
                      <view
                        >{{ item.deptName }} {{ item.doctorTitle || '' }}</view
                      >
                    </view>
                    <view
                      class="submit-btns"
                      :class="item.register ? 'disabled-state' : ''"
                      @click="submit(item.register, item.billData)"
                      >{{ item.register ? '已签到' : '签到' }}</view
                    >
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <uni-load-more
        v-if="testList1.length > 0"
        status="nomore"
        :contentText="{
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载数据中',
          contentnomore: '没有更多数据了',
        }"
      ></uni-load-more>
      <NoData v-if="testList1.length == 0"></NoData>
    </view>
  </view>
</template>
<script>
import NoData from '../components/NoData'
import selectPatient from '../components/selectPatient.vue'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import { getRegRecordList, regRecordData } from '../api/outpatient'
export default {
  components: {
    selectPatient,
    NoData,
    AppCard,
    AppListItem,
  },
  data() {
    return {
      testList1: [],
      type1Num: 0,
      perId: '',
      perName: '',
      patientCard: '',
    }
  },

  methods: {
    changePatient(item) {
      this.perId = item.memberId
      this.perName = item.name
      this.patientCard = item.patientCard
      this.getRegRecordList(item.memberId)
    },
    async getRegRecordList(patientId) {
      this.testList1 = await getRegRecordList({ patientId })
    },
    async submit(state, billData) {
      if (state) return
      await regRecordData({ patientId: this.perId, billData })
      uni.showToast({
        title: '签到成功',
      })
      this.getRegRecordList(this.perId)
    },
  },
}
</script>
<style scoped lang="scss">
.orderList {
  padding: 20rpx;

  .orderListBox {
    .orderItem {
      display: flex;
      flex-direction: column;
      width: 100%;
      background: #fff;
      border-radius: 22rpx;
      padding-left: 10rpx;
      margin-bottom: 20rpx;
      padding: 0 0 20rpx 0;

      .date {
        padding: 15rpx;
        border-bottom: 1px solid #e9eff4;
        margin-bottom: 30rpx;

        .time {
          font-size: 30rpx;
          color: #333333;
          font-weight: 700;
        }

        .tag {
          width: 96rpx;
          height: 42rpx;
          background: #ff8600;
          color: #fff;
          font-size: 24rpx;
          color: #fff;
          text-align: center;
          margin-right: -13rpx;
        }

        .icon {
          width: 96rpx;
          height: 42rpx;
          background: rgba(255, 192, 55, 1);
          border-radius: 4rpx 0rpx 0rpx 4rpx;
          color: #fff;
          font-size: 24rpx;
          font-weight: 600;
          text-align: center;
          line-height: 42rpx;
        }
      }

      .content {
        padding: 0 20rpx;

        .headerImg {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          overflow: hidden;
        }

        .contentBox {
          width: 100%;
          margin-left: 25rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;

          .contentText {
            background: #fff;
            width: 100%;

            .name {
              font-weight: 600;
              font-size: 32rpx;
              color: #333333;
              margin-bottom: 15px;
            }

            view {
              font-size: 28rpx;
              color: #646464;
              font-weight: 400;
              line-height: 32rpx;
            }

            .cost {
              color: #343434;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
.card-lists {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-lists {
    .name {
      margin-bottom: 15px;
    }
  }
}
.submit-btns {
  width: 152rpx;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 12rpx;
  border: 1rpx solid #0ab2c1;
  color: #0ab2c1 !important;
  border-radius: 30rpx;
  font-size: 24rpx;
}
.disabled-state {
  width: 152rpx;
  line-height: 60rpx;
  margin: 0 0 0 12rpx;
  background-color: #fff;
  border: 1rpx solid #999;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #999 !important;
}
</style>
