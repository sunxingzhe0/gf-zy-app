<template>
  <view class="wrapper">
    <view class="homeTop">
      <image :src="FILE_URL_BUILT_IN('homeBg.png')"></image>
      <text
        >{{ getTimeState }}好 {{ userInfo.username }} 医生，欢迎登录{{
          userInfo.orgName
        }}。</text
      >
    </view>
    <view class="homeWrap">
      <view class="box-shadow listItem flex-between navWrap">
        <view
          class="navItem"
          @click="navigate('/pages-doctor/room/room?navTitle=CONSULT')"
        >
          <image
            class="icon"
            :src="require('@/assets/user/navIcon1.png')"
          ></image>
          <view class="title">在线咨询</view>
          <text v-if="messages.CONSULT">{{ messages.CONSULT }}</text>
        </view>
        <view
          class="navItem "
          @click="navigate('/pages-doctor/room/room?navTitle=REPEAT_CLINIC')"
        >
          <!-- <view class="navItem disabled" @click="msgInfo"> -->
          <image
            class="icon"
            :src="require('@/assets/user/navIcon3.png')"
          ></image>
          <view class="title">在线复诊</view>
          <text v-if="messages.REPEAT_CLINIC">{{
            messages.REPEAT_CLINIC
          }}</text>
        </view>
        <!-- <view
          class="navItem "
          @click="navigate('/pages-doctor/room/room?navTitle=CARRYON_PRESC')"
        > -->
        <view class="navItem disabled" @click="msgInfo">
          <image
            class="icon"
            :src="require('@/assets/user/navIcon2.png')"
          ></image>
          <view class="title">慢病续方</view>
          <text v-if="messages.CARRYON_PRESC">{{
            messages.CARRYON_PRESC
          }}</text>
        </view>
      </view>
      <view
        class="box-shadow listItem flex-between notice"
        v-if="notice"
        @click="toNotice"
      >
        <image :src="require('@/assets/user/notice.png')"></image>
        <view class="text-overflow noticeText">
          <uni-notice-bar
            background-color="#fff"
            style="padding: 0;margin-bottom:0;"
            color="#1A1A1A"
            scrollable="true"
            :speed="50"
            single="true"
            :text="notice"
          ></uni-notice-bar>
        </view>
        <uni-icons type="arrowright" size="18" color="#666"></uni-icons>
      </view>
      <view class="box-shadow listItem" style="padding-bottom: 0;">
        <view class="planTop flex-between">
          <view class="title flex-start-center">
            <image :src="require('@/assets/plan.png')"></image>
            <text>我的排班</text>
          </view>
          <view class="type">在线复诊(视频)</view>
        </view>
        <view class="date">
          <view class="dateTop flex-start-center">
            <view class="flex-start-center flex_1 p030">
              <view class="flex-start-center">
                <text class="iconfont icon-zuo" @click="preYear"></text>
                <view class="text">{{ calendar.year }}年</view>
                <text class="iconfont icon-iconfont64" @click="nextYear"></text>
              </view>
              <view
                class="flex-start-center"
                style="border-left: 1px solid #CCCCCC;margin-left: 30rpx;padding-left: 30rpx;"
              >
                <text class="iconfont icon-zuo" @click="preweek"></text>
                <view class="text">{{ calendar.month }}月</view>
                <text class="iconfont icon-iconfont64" @click="nextweek"></text>
              </view>
            </view>
            <view @click="dateOpen" class="p030">
              <image
                :src="
                  isdate
                    ? require('@/assets/hide.png')
                    : require('@/assets/show.png')
                "
              ></image>
            </view>
          </view>
          <view v-show="isdate">
            <uni-calendar
              :insert="true"
              :showMonth="false"
              ref="date"
              @change="change"
            />
          </view>
          <view class="weekWrap">
            <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
              <view
                :class="['weekItem', index == isweek ? 'on' : '']"
                v-for="(item, index) in weeks"
                :key="index"
                @click="changeWeek(index)"
              >
                <view>{{ item.week }}</view>
                <view class="time">{{ item.date.split(' ')[0] }}</view>
              </view>
            </scroll-view>
          </view>
          <view class="plan_main">
            <view
              style="font-size: 26rpx; text-align: center;color: #999;"
              v-if="!weeks[isweek].workDay"
              >{{ weeks[isweek].workDay ? '工作日' : '休息日' }}</view
            >
            <view
              class="flex-between planShow"
              v-show="!isPlan && weeks[isweek].workDay"
              style="margin-bottom: 20rpx;"
            >
              <view class="total">{{ weeks[isweek].hasOrder }}</view>
              <view class="names">
                <view
                  class="patient"
                  v-for="(f, i) in weeks[isweek].nameList"
                  :key="i"
                  >{{ f }}</view
                >
              </view>
              <view class="left">
                剩余
                <text class="num">{{ weeks[isweek].residueNum }}</text>
              </view>
            </view>

            <view v-show="isPlan">
              <block
                v-for="(item, index) in weeks[isweek].workTime"
                :key="index"
              >
                <view
                  class="flex-between planShow paddt"
                  :key="index"
                  v-if="item.freeType != '空闲'"
                >
                  <view class="flex-start-center planItem">
                    <view class="planTime">
                      <view>{{ item.timeRange.split('-')[0] }}</view>
                      <view>{{ item.timeRange.split('-')[1] }}</view>
                      <image
                        class="ljIcon"
                        :src="require('@/assets/timeRange.png')"
                      ></image>
                    </view>
                    <view class="flex-start-center">
                      <view
                        class="patient"
                        v-for="(f, i) in item.userName"
                        :key="i"
                        >{{ f }}</view
                      >
                    </view>
                  </view>
                  <view class="planNum">
                    <view>{{ item.freeType }}</view>
                  </view>
                </view>
              </block>
            </view>
            <view
              class="openIcon"
              v-if="weeks[isweek].hasOrder > 0"
              @click="isPlan = !isPlan"
            >
              <image
                :src="
                  isPlan
                    ? require('@/assets/hide.png')
                    : require('@/assets/show.png')
                "
              ></image>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  h5DocSchedual,
  announceAnyData,
  doctorSessionData,
  doctorSessionIdList,
} from '@/common/request/index'

import util from '@/common/util'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      isdate: false,
      isPlan: false,
      calendar: {},
      isweek: 0,
      weeks: [
        {
          date: '2020-00-00 00:00:00',
          hasOrder: 0,
          nameList: [],
          residueNum: 16,
          restTimeList: ['00:00-09:00', '17:00-23:59'],
          week: '',
          workDay: true,
          workTime: [
            {
              beginTime: '00:00',
              configType: 1,
              currentNum: 0,
              endTimeS: 32400,
              freeType: '',
              grade: null,
              orderId: null,
              timeConfId: '44841858A79D491F9D44C2F96EEEA986',
              timeRange: '00:00-00:00',
              userName: [],
            },
          ],
        },
      ],
      getTimeState: util.getTimeState(),
      notice: '',
      messages: {},
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  created() {
    this.getSessionMessage()
    // this.getNoReceive('CONSULT')
    // this.getNoReceive('REPEAT_CLINIC')
    // this.getNoReceive('CARRYON_PRESC')
    uni.$on(
      'onMessage',
      /* this.getSessionMessage */ () => {
        // this.getNoReceive('CONSULT')
        // this.getNoReceive('REPEAT_CLINIC')
        // this.getNoReceive('CARRYON_PRESC')
      },
    )
  },
  onShow() {
    this.getSessionMessage()
  },
  onReady() {
    this.calendar = this.$refs.date.nowDate
    this.geth5DocSchedual(this.$refs.date.nowDate.fullDate)
    this.getannounceAnyData()
  },
  methods: {
    msgInfo() {
      uni.showToast({
        title: '该模块未开通，敬请期待…',
        icon: 'none',
      })
    },
    dateOpen() {
      this.isdate = !this.isdate
    },
    // 通知
    async getannounceAnyData() {
      let list = await announceAnyData()
      let title = []
      list.list.forEach(i => {
        title.push(i.title)
      })
      this.notice = title.join(' ')
    },
    // 获取排班信息
    async geth5DocSchedual(date) {
      this.weeks = await h5DocSchedual({
        doctorId: uni.getStorageSync('userId'),
        date: date,
      })
    },
    navigate(url) {
      uni.navigateTo({
        url,
      })
    },
    preweek() {
      this.$refs.date.pre()
      this.calendar = this.$refs.date.nowDate
    },
    nextweek() {
      this.$refs.date.next()
      this.calendar = this.$refs.date.nowDate
    },
    preYear() {
      this.$refs.date.setDate(dayjs(this.calendar.fullDate).subtract(1, 'year'))
      this.calendar = this.$refs.date.nowDate
    },
    nextYear() {
      this.$refs.date.setDate(dayjs(this.calendar.fullDate).add(1, 'year'))
      this.calendar = this.$refs.date.nowDate
    },
    change(e) {
      this.geth5DocSchedual(e.fulldate)
      this.isdate = false
    },
    changeWeek(i) {
      this.isweek = i
    },
    toNotice() {
      uni.navigateTo({
        url: '/pages-doctor/notice/list',
      })
    },
    //诊室消息
    async getSessionMessage() {
      if (this.$store.state.userInfo.clientType == 'DOC_MOBILE') {
        const sessionList = await doctorSessionIdList()
        const TYPES = ['CONSULT', 'REPEAT_CLINIC', 'CARRYON_PRESC']
        const MESSAGES = {}

        TYPES.forEach(type =>
          Object.assign(MESSAGES, {
            [type]: sessionList[type]
              ?.map(({ sessionId }) => sessionId)
              .reduce(
                (num, id) => num + this.webSocket.getUnread(id)?.length,
                0,
              ),
          }),
        )
        this.messages = MESSAGES
        console.log(this.messages, '----消息数量')
      }
    },
    //未接诊统计
    // async getNoReceive(type) {
    //   const params = {
    //     tab: type,
    //     status: 'WAIT_TREAT',
    //     currentNum: 1,
    //     pageSize: 9999,
    //     startTime: '',
    //     endTime: '',
    //   }
    //   const res = await doctorSessionData(params)
    //   this.messages[type] = res.list.length
    // },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-bottom: 80rpx;
}

.homeTop {
  height: 120rpx;

  background-size: 100%;
  padding: 0 40rpx;
  padding-top: 34rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  color: #fff;

  image {
    width: 100%;
    height: 120rpx;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
  }

  text {
    position: relative;
    z-index: 2;
  }
}

.homeWrap {
  padding: 0 20rpx;
  margin-top: -20rpx;
  padding-bottom: 20rpx;
  position: relative;
  z-index: 3;

  .listItem {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
  }

  .navWrap {
    padding: 60rpx 66rpx;
  }

  .navItem {
    position: relative;

    .icon {
      width: 80rpx;
      height: 80rpx;
      display: block;
      margin: 0 auto;
    }

    .title {
      font-size: 26rpx;
      color: #1a1a1a;
      text-align: center;
      margin-top: 20rpx;
    }

    text {
      position: absolute;
      background: #e45b5b;
      color: #fff;
      font-size: 20rpx;
      top: -6rpx;
      right: 6rpx;
      width: 26rpx;
      height: 26rpx;
      text-align: center;
      line-height: 26rpx;
      border-radius: 50%;
    }
  }
  .disabled {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

  .notice {
    image {
      width: 50rpx;
      height: 50rpx;
      margin-right: 20rpx;
    }

    .noticeText {
      font-size: 26rpx;
      color: #1a1a1a;
      flex: 1;

      ::v-deep.uni-noticebar {
        margin-bottom: 0;
        padding: 0;
      }
    }
  }

  .planTop {
    image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }

    .title {
      font-size: 30rpx;
      color: #1a1a1a;
      font-weight: bold;
    }

    .type {
      background: rgba(10, 178, 193, 0.1);
      padding: 0 26rpx;
      color: $uni-color-primary;
      border-radius: 20rpx;
      font-size: 24rpx;
    }
  }

  .date {
    margin-top: 40rpx;

    .dateTop {
      height: 80rpx;
      background-color: #f2f2f2;
      border-bottom: 1px solid #fff;

      .p030 {
        padding: 0 30rpx;
      }

      image {
        width: 26rpx;
        height: 20rpx;
      }

      .iconfont {
        color: $uni-color-primary;
      }

      .text {
        font-size: 26rpx;
        color: #1a1a1a;
        padding: 0 30rpx;
      }
    }

    ::v-deep.uni-calendar__header {
      display: none;
    }

    ::v-deep.uni-calendar-item__weeks-lunar-text {
      display: none;
    }

    ::v-deep.uni-calendar__weeks {
      justify-content: space-between;
    }

    ::v-deep.uni-calendar__weeks-item {
      flex: none;
    }

    ::v-deep.uni-calendar-item__weeks-box {
      width: 56rpx;
      height: 56rpx;
      margin: 10rpx 18rpx;
      border-radius: 10rpx;
      overflow: hidden;
    }

    ::v-deep.uni-calendar-item--isDay-text {
      color: $uni-color-primary;
    }

    ::v-deep.uni-calendar-item__weeks-box-item {
      width: 56rpx;
      height: 56rpx;
    }

    ::v-deep.uni-calendar-item--isDay {
      background-color: $uni-color-primary;
      color: #fff;
    }

    ::v-deep.uni-calendar-item--checked {
      background-color: $uni-color-primary;
    }

    ::v-deep.uni-calendar__backtoday {
      display: none;
    }

    ::v-deep.uni-calendar__content {
      background-color: #f2f2f2;
      border-radius: 10rpx;
      padding: 20rpx 0;
    }

    .weekWrap {
      margin-top: 40rpx;

      .scroll-view_H {
        white-space: nowrap;
      }

      .weekItem {
        display: inline-block;
        margin-right: 50rpx;
        font-size: 26rpx;
        text-align: center;
        color: #999;
        padding-bottom: 20rpx;

        .time {
          font-size: 20rpx;
        }

        &.on {
          color: #1a1a1a;
          font-weight: bold;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            width: 30rpx;
            height: 4rpx;
            background: $uni-color-primary;
            bottom: 8rpx;
            left: 50%;
            margin-left: -15rpx;
            border-radius: 2rpx;
          }
        }
      }
    }
  }

  .plan_main {
    margin-top: 40rpx;
    padding-bottom: 20rpx;

    .planShow {
      .total {
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(10, 178, 193, 1);
        line-height: 50rpx;
        padding-left: 20rpx;
        padding-right: 100rpx;
      }

      .names {
        display: flex;
        flex-wrap: wrap;
      }

      .left {
        font-size: 30rpx;
        font-weight: 500;
        line-height: 50rpx;
        padding-right: 20rpx;
        color: rgba(102, 102, 102, 1);

        .num {
          color: rgba(10, 178, 193, 1);
        }
      }
    }

    .planItem {
      margin-bottom: 20rpx;
    }

    .planTime {
      font-size: 20rpx;
      color: #1a1a1a;
      margin-right: 90rpx;
      position: relative;

      .ljIcon {
        width: 19.5rpx;
        height: 45rpx;
        position: absolute;
        right: -28rpx;
        top: 6rpx;
        // margin-top: -12rpx;
      }

      view {
        line-height: 28rpx;
      }
    }

    .patient {
      width: 120rpx;
      height: 36rpx;
      background: #f2f2f2;
      border-radius: 18rpx;
      font-size: 24rpx;
      color: #666666;
      line-height: 36rpx;
      text-align: center;
      margin-right: 30rpx;
      margin-bottom: 12rpx;
    }

    .planNum {
      font-size: 30rpx;
      color: #666;
      text-align: right;

      text {
        color: $uni-color-primary;
        margin-left: 10rpx;
      }
    }

    .openIcon {
      border-top: 1px solid #e6e6e6;
      padding-top: 30rpx;
      padding-bottom: 30rpx;

      image {
        width: 26rpx;
        height: 20rpx;
        display: block;
        margin: 0 auto;
      }
    }

    .paddt {
      padding-top: 30rpx;
      padding-bottom: 10rpx;
    }
  }
}
</style>
