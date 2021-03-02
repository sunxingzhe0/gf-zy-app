<template>
  <view style="padding: 20rpx; padding-bottom: 110rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 选择套餐类型（性别） -->
    <view class="genderBox box-shadow">
      <view class="title">{{title}}
      </view>
      <view class="gender flex-between">
        <view :class="isActive == item.value ? 'active' : ''" v-for="(item, index) in checkType" :key="index" @click="changeType(item.value)">
          {{ item.title }}
        </view>
      </view>
    </view>
    <!-- 查看可预约时间 -->
    <view class="yuyueDate box-shadow">
      <view class="yuyueTitle">
        <text>查看可预约时间</text><text class="tis">以预约时间为准</text>
      </view>

      <scroll-view class="scroll-view_H flex-start-center" :show-scrollbar="true" scroll-x="true">
        <view style="white-space:nowrap;padding-left: 30rpx;">
          <view class="dateList" v-for="(item, index) in dateList" :key="index">
            <view class="date">{{ item.reserveDate }}</view>
            <view class="week">{{ item.week}}</view>
            <view class="num">{{ item.leaveNum }}</view>
          </view>
        </view>
      </scroll-view>

    </view>
    <view class="contentBox box-shadow">
      <!-- 套餐项目 -->
      <view class="typeProject">
        <view class="objName">项目套餐</view>
        <view class="projectItem" v-for="(item, index) in infoData.itemInfo" :key="index">
          <view class="title">
            {{item.combName}}
          </view>
          <view class="content">
            <view class="name">{{item.combDetail}}</view>
            <view class="tips" v-if="item.remark">{{item.remark}}</view>
          </view>
        </view>
      </view>

    </view>
    <!-- 统计预约价格 -->
    <view class="total flex-between">
      <view class="font32 color666">费用金额：<text class="price">￥{{parseFloat(amount).toFixed(2)}}</text></view>
      <view class="btn">
        <view class="yuyue" @click="goTo">预约</view>
      </view>
    </view>
  </view>
</template>
<script>
  import {
    getTjPackageInfo
  } from '../../api/physical.js'
  import OrderTime from '../../components/OrderTime.vue'
  import dayjs from 'dayjs'
  export default {
    components: {
      OrderTime
    },
    data() {
      return {
        // 检查类型
        checkType: [{title:'男士',value:1},{title:'未婚女士',value:2},{title:'已婚女士',value:3}],
        weekList: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        // 是否激活选择检查类型
        isActive: 1,
        packageNo: '',
        infoData: {},
        activeDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        dateList: [],
        title:'',
        amount:''
      }
    },
    onLoad(option) {
      this.packageNo = option.packageNo
      this.amount = option.amount
      this.title = option.title
      this.getdate()
      if (this.packageNo) {
        this.getTjPackageInfo()
      }
    },
    methods: {
      getdate() {
        let date = []
        for (let i = 1; i < 8; i++) {
          date.push({
            day: dayjs()
              .add(i, 'day')
              .format('MM-DD'),
            reserveDate: dayjs()
              .add(i, 'day')
              .format('YYYY-MM-DD'),
            week: this.weekList[dayjs()
              .add(i, 'day')
              .format('d')],
          })
        }
        this.dateList = date
        console.log(this.list1)
      },
      //获取套餐信息
      async getTjPackageInfo() {
        this.infoData = await getTjPackageInfo({
          packageNo: this.packageNo
        })
      },
      goTo() {
        uni.navigateTo({
          url: `/pages-zy/physical/appointment/submit?packageNo=${this.packageNo}&title=${this.title}&amount=${this.amount}&marryType=${this.isActive}`
        })
      },
      // 切换就诊人类型
      changeType(i) {
        this.isActive = i
      },
      showCurrentDate(e) {
        this.activeDate = e
      }
    },
  }
</script>
<style scoped lang="scss">
  .main {
    display: flex;
    flex-direction: column;
  }

  .yuyueDate {
    padding: 30rpx 0;
    background: #fff;
    margin-top: 20rpx;

    .yuyueTitle {
      padding: 0 30rpx;
      font-size: 32rpx;
      color: #333;

      .tis {
        font-size: 24rpx;
        color: #666;
        margin-left: 35rpx;
      }
    }

    .dateList {
      margin-right: 40rpx;
      display: inline-block;
      text-align: center;
      padding-top: 20rpx;

      .date {
        font-size: 28rpx;
        color: #333;
        line-height: 34rpx;
      }

      .week {
        font-size: 28rpx;
        color: #666;

      }

      .num {
        font-size: 32rpx;
        color: $uni-color-primary;
      }
    }
  }

  .genderBox {
    background: #fff;
    padding: 30rpx;

    .title {
      font-size: 30rpx;
      line-height: 50rpx;
      color: #333333;

      text {
        background: $uni-color-primary;
        font-size: 22rpx;
        padding: 4rpx 10rpx;
        color: #fff;
        border-radius: 2px;
        margin-right: 15rpx;
      }
    }

    .gender {
      view {
        width: 180rpx;
        text-align: center;
        line-height: 60rpx;
        font-size: 28rpx;
        color: #333;
        background: rgb(243, 243, 243);
        margin-top: 30rpx;
        border-radius: 40rpx;
      }

      .active {
        background: $uni-color-primary;
        color: #fff;
      }
    }
  }

  .dateBox {
    height: 268rpx;
    background: #fff;
    margin-top: 20rpx;
    overflow: hidden;

    .title {
      font-size: 28rpx;
      color: #646464;
      font-weight: 400;
      margin: 24rpx 0 13rpx 27rpx;
    }

    .timeBox {
      white-space: nowrap;
      overflow-x: auto;
      height: 160rpx;

      .weekBox {
        display: inline-block;
        height: 160rpx;
        text-align: center;

        .week {
          line-height: 80rpx;
          width: 93rpx;
        }

        .dayItem {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: 93rpx;
          font-size: 12rpx;
          padding: 13rpx 10rpx;
        }
      }
    }
  }

  .total {
    width: 100%;
    height: 98rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 30rpx;
    background: #fff;
    box-sizing: border-box;

    .price {
      font-size: 32rpx;
      font-weight: 500;
      color: #FF4500;
    }

    .yuyue {
      width: 160rpx;
      height: 60rpx;
      background: $uni-color-primary;
      border-radius: 75rpx;
      font-size: 30rpx;
      color: #fff;
      text-align: center;
      line-height: 60rpx;
    }
  }

  .contentBox {
    margin-top: 20rpx;
    background: #fff;

    .typeProject {
      margin-bottom: 20rpx;
      padding: 30rpx;

      .objName {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 40rpx;
      }

      .projectItem {
        margin-top: 30rpx;

        .title {
          margin-bottom: 15rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: $uni-color-primary;
          line-height: 40rpx;
        }

        .content {
          background: #f2f2f2;
          font-size: 28rpx;
          padding: 30rpx;
          border-radius: 6rpx;
          margin-top: 20rpx;

          .name {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
            line-height: 40rpx;
          }

          .tips {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
</style>
