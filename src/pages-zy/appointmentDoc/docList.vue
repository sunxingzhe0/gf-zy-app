<template>
  <view class="container child_container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="main">
      <view class="erkeContatiner flex-between">
        <image :src="FILE_URL_BUILT_IN('selectDoctorBg.png')"></image>
        <view style="z-index: 1; position: relative;">
          <view class="title">{{deptInfo.deptName}}</view>
          <view>{{deptInfo.orgName}} · {{deptInfo.deptName}}</view>
        </view>
        <view class="flex-start-center" style="z-index: 1;position: relative;" @click="isTrue = !isTrue">
          <view>科室介绍</view>
          <uni-icons :type="isTrue?'arrowdown':'arrowright'" color="#fff" size="12"></uni-icons>
        </view>
      </view>
      <!-- 儿童内科介绍 -->
      <view :class="isTrue ? 'jieshao' : 'jieshao jieshaoHide'">
        <view class="font32 jieshaoTitle">科室介绍</view>
        <view class="deptInfo">{{ deptInfo.deptIntro || '暂无科室介绍' }}</view>
      </view>
      <!-- 依据日期来选择 -->
      <view class="basisDate">
        <view class="box-shadow">
          <OrderTime @selectDay="selectDay" :isAll="true"></OrderTime>
        </view>
        <!-- 列表区 -->
        <view class="docList">
          <block v-for="(item, index) in doctorsList" :key="index">
            <view class="docBox box-shadow">
              <view class="flex-start-start" style="padding: 30rpx;" @click="goTo(item)">
                <view class="icon">
                  <default-img :url="FILE_URL(item.img)"></default-img>
                </view>
                <view class="flex1 infoText">
                  <view class="font-weight font32">
                    {{ item.docName }}
                  </view>
                  <view class="font24 color666">{{ item.docTitle || ''}}</view>
                  <view class="font24 color666 text-overflow" v-if="item.good">擅长：{{ item.good || '-'}}</view>
                </view>
              </view>
              <view class="dateList">
                <view :class="['flex-between dateLI', parseInt(i.surplus) <1 ? 'dis' : '']" v-for="(i, h) in item.scheduleLists"
                  :key="h" @click.stop="goTo(item,i)">
                  <view class="flex1">{{ i.reverseDate}}（{{week[dayjs(i.reverseDate).format('d')]}}）</view>
                  <view class="flex-start-center">
                    <view v-if="parseInt(i.surplus) <1">约满</view>
                    <view v-else>剩余 {{ parseInt(i.surplus) }}</view>
                    <uni-icons type="arrowright" color="#666" size="12"></uni-icons>
                  </view>
                </view>
              </view>
            </view>
          </block>
          <NoData v-if="doctorsList.length == 0"></NoData>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import OrderTime from '../components/OrderTime.vue'
  import dayjs from 'dayjs'
  import NoData from '../components/NoData'
  import {
    getReverseDocInfo,
    getDeptDetail,
  } from '@/common/request/doctorAppointment'
  export default {
    components: {
      OrderTime,
      NoData
    },
    data() {
      return {
        // 是否展开
        isTrue: false,
        // 医生列表信息
        activeDate: '',
        dept: '',
        id: '',
        orgName: '',
        deptInfo: {},
        AllNumber: 0,
        week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        doctorsList: [],
        orgId:''
      }
    },
    onLoad(option) {
      this.id = option.deptId
      this.orgId = option.orgId
      this.getdeptInfo()
      this.getDocList()
    },
    methods: {
      dayjs,
      // 切换日期
      selectDay(day) {
        this.activeDate = day.date
        this.getDocList()
      },
      //获取科室详情
      async getdeptInfo() {
        this.deptInfo = await getDeptDetail({
          deptId: this.id,
          orgId:this.orgId
        })
      },
      //获取医生列表
      async getDocList() {
        this.doctorsList = await getReverseDocInfo({
          orgId: this.orgId,
          deptId: this.id,
          beginDate: this.activeDate ? this.activeDate : dayjs().format('YYYY-MM-DD'),
          endDate:this.activeDate?this.activeDate:dayjs().add(6,'day').format('YYYY-MM-DD'),
          resource:2
        })
      },
      goTo(item,i) {
        if(i&&i.surplus && parseInt(i.surplus)<1){
          return false
        }
        console.log(item,i)
        uni.navigateTo({
          url: `/pages-zy/appointmentDoc/appointmentInfo?docId=${item.docId}&date=${i?i.reverseDate:this.activeDate}&deptId=${this.id}&orgId=${this.orgId}`
        })
      },
    },
  }
</script>
<style scoped lang="scss">
  @import '~@/common/order.scss';

  .erkeContatiner {
    padding: 40rpx 30rpx;
    color: #fff;
    position: relative;

    image {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
      z-index: 0;
    }

    .title {
      font-size: 34rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
  }

  .jieshao {
    max-height: 800rpx;
    overflow: hidden;
    background-color: #fff;
    transition: max-height 0.9s;

    .jieshaoTitle {
      padding: 30rpx;
      padding-bottom: 0;
    }

    .deptInfo {
      padding: 30rpx;
      padding-top: 20rpx;
      font-size: 28rpx;
      color: #646464;
      line-height: 50rpx;
    }
  }

  .showMore {
    padding: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #646464;
    font-size: 24rpx;
    background: #fff;
    font-weight: 600;
  }

  .jieshaoHide {
    max-height: 0;
    transition: max-height 0.5s;
  }

  .date {
    height: 168rpx;
    background: #fff;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dateWeek {
      height: 68rpx;
      display: flex;
      border-bottom: 3rpx solid #f0f0f0;

      li {
        width: 12.5%;
        text-align: center;
        line-height: 68rpx;
        font-size: 28rpx;
        color: #646464;
      }
    }

    .isDate {
      height: 100rpx;
      display: flex;

      li {
        width: 12.5%;
        display: flex;
        justify-content: center;
        align-items: center;

        .activeNone {
          background: #fff;
          color: #333333;
        }

        .isActive {
          height: 68rpx;
          width: 68rpx;
          padding: 7rpx 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          border-radius: 50%;
          background: #0ab2c1;
          color: #fff;

          :nth-child(1) {
            font-size: 24rpx;
          }

          :nth-child(2) {
            font-size: 18rpx;
          }
        }
      }
    }
  }

  .docList {
    padding: 20rpx;
  }

  .docBox {
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 10rpx;

    .icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 30rpx;

      img {
        width: 100%;
      }
    }

    .infoText {
      width:520rpx;
      font-size: 28rpx;
      color: #373737;
      line-height: 50rpx;

      span {
        color: #333;
        font-size: 32rpx;
        margin-right: 34rpx;
      }
    }
  }

  .dateList {
    font-size: 28rpx;
    color: #373737;
    padding-left: 30rpx;
    border-top: 1px solid #E6E6E6;

    .dateLI {
      height: 88rpx;
      padding-right: 30rpx;
      border-bottom: 1px solid #E6E6E6;
    }

    .dis {
      color: #999;
    }
  }
</style>
