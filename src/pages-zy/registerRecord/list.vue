<template>
  <view style="padding-top: 170rpx;">
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

    <view class="orderList">
      <template>
        <view class="orderListBox">
          <view class="orderItem box-shadow" v-for="(item, index) in testList1" :key="index" @click="goInfo(item.billData)">
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
                  <view class="">
                    <view class="name">{{ item.name }}</view>
                    <view class="cost">诊查费：￥{{ parseFloat(item.fee).toFixed(2) }}</view>
                    <view>{{ item.deptName }} {{ item.doctorTitle || '' }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <NoData v-if="testList1.length == 0"></NoData>
    </view>

  </view>
</template>
<script>
  import NoData from '../components/NoData'
  import selectPatient from '../components/selectPatient.vue'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import {
    registrationRecord
  } from '../api/outpatient'
  export default {
    components: {
      selectPatient,
      NoData,
      AppCard,
      AppListItem
    },
    data() {
      return {
        tabs: [{
            title: '已预约',
            key: 1,
          },
          {
            title: '已取号',
            key: 2,
          },
          {
            title: '已退号',
            key: 4,
          },
        ],
        active: 1,
        testList1: [],
        type1Num: 0,
        perId: '',
        perName: '',
        patientCard: ''
      }
    },

    onLoad() {
      // this.topbarChange(0)
    },
    methods: {
      changePatient(item) {
        this.perId = item.memberId
        this.perName = item.name
        this.patientCard = item.patientCard
        this.topbarChange(this.active)
      },
      topbarChange(state) {
        this.active = state
        this.testList1 = []
        this.getRegistrationRecord()
      },
      async getRegistrationRecord() {
        let list = await registrationRecord({
          patientId: this.perId,
          type: this.active,
        })
        this.testList1 = list
        if (this.active == 0) {
          this.type1Num = list.length
        }
      },
      goInfo(id) {
        uni.navigateTo({
          url: `/pages-zy/registerRecord/detail?id=${id}&patientId=${this.perId}&patientCard=${this.patientCard}&perName=${this.perName}&type=${this.active}`
        })
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
            background: #FF8600;
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
              }

              view {
                font-size: 28rpx;
                color: #646464;
                font-weight: 400;
                line-height: 28rpx;
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
</style>
