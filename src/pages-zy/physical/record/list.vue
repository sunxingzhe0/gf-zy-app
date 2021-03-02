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
          <view class="orderItem box-shadow" v-for="(item, index) in testList1" :key="index" @click="goInfo(item.billNo)">
            <view class="date flex-between">
              <view class="time">体检时间：{{ item.regDate }}</view>
              <text class="tag overtime" v-if="item.dayState == 0 || item.dayState == 1">{{item.dayState ==0 ?'当日':item.dayState ==1?'超时':''}}</text>
            </view>
            <view class="content flex-start-start">
              <view class="contentBox flex_1">
                <view class="contentText">
                  <view class="">
                    <view class="name">{{ item.packageName }}</view>
                    <view class="cost flex-between"><view>{{item.patientName}} | {{item.phone}}</view><text>￥{{ parseFloat(item.fee).toFixed(2) }}</text></view>
                    <view class="flex-end-start recodeBtnList">
                      <view v-if="(dayjs().subtract(1,'day')).isBefore(dayjs(item.regDate)) && active==0">取消预约</view>
                      <view v-if="active == 1 && item.hasReport==1" class="recodeBtn">体检报告</view>
                    </view>
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
  import NoData from '../../components/NoData'
  import selectPatient from '../../components/selectPatient.vue'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import dayjs from 'dayjs'
  import {
    getTjRegRecordList,countTjRecord
  } from '../../api/physical.js'
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
            key: 0,
            num:0
          },
          {
            title: '已体检',
            key: 1,
            num:0
          },
          {
            title: '已取消',
            key: 2,
            num:0
          },
        ],
        active: 0,
        testList1: [],
        perId: '',
        perName: '',
        patientCard: ''
      }
    },

    onLoad() {
      // this.topbarChange(0)
    },
    methods: {
      dayjs,
      changePatient(item) {
        this.perId = item.memberId
        this.perName = item.name
        this.patientCard = item.patientCard
        this.getcountTjRecord()
        this.topbarChange(this.active)
      },
      topbarChange(state) {
        this.active = state
        this.testList1 = []
        this.getRegistrationRecord()
      },
      //获取体检记录
      async getRegistrationRecord() {
        let list = await getTjRegRecordList({
          patientId: this.perId,
          type: this.active,
        })
        console.log(list)
        this.testList1 = list
      },
      //获取记录统计
      async getcountTjRecord(){
        let res = await countTjRecord({patientId:this.perId,type:0})
        this.tabs[0].num = res.regNum
        this.tabs[1].num = res.tjNum
        this.tabs[2].num = res.cancelNum
      },
      goInfo(billNo) {
        uni.navigateTo({
          url: `/pages-zy/physical/record/detail?billNo=${billNo}&patientId=${this.perId}&type=${this.active}`
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
        padding: 0 0 30rpx 0;

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
            background: rgba(10, 178, 193, 0.2);
            color: #0AB2C1;
            font-size: 24rpx;
            text-align: center;
            margin-right: -13rpx;
            &.overtime {
              background: rgba(255, 69, 0, 0.2);
              color: #FF4500;
            }
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
          .contentBox {
            width: 100%;
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
              }

              .cost {
                color: #666;
                font-size: 24rpx;
                margin-top: 10rpx;
                text{
                  font-size: 28rpx;
                  font-weight: bold;
                }
              }
              .recodeBtnList{
                margin-top: 20rpx;
                view{

                  border: 1px solid #CCCCCC;
                  border-radius: 15px;
                  width: 150rpx;
                  font-size: 24rpx;
                  color: #666;
                  text-align: center;
                  padding: 4rpx 0;
                }
                .recodeBtn{
                   color: #ccc;
                }
              }

            }
          }
        }
      }
    }
  }
</style>
