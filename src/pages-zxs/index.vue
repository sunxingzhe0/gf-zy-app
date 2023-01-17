<template>
  <view class="container">
    <view class="homeTop">
      <image :src="FILE_URL_BUILT_IN('homeBg.png')"></image>
      <text class="msg-txt" @click="intoMsgList"
        >{{ getTimeState }}好 {{ userInfo.username }} 医生，{{
          `您有 ${unReadMsgNum || 0} 条新消息，请及时查收`
        }}</text
      >
      <text
        @click="outPage"
        style="color:#fff;margin-left: 20rpx;"
        class="iconfont icon-tuichubianji"
      ></text>
    </view>
    <view style="margin-top: -30rpx" class="app-card">
      <view class="flex flex-wrap" style="padding: 30rpx 0rpx">
        <view
          class="app-item"
          v-for="(item, index) in appointmentList"
          :key="index"
          :data-url="item.path"
          @click="go"
        >
          <image style="width: 80rpx; height: 80rpx" :src="item.img"></image>
          <text class="title">{{ item.title }}</text>
        </view>
      </view>
    </view>
    <view
      class="app-card listItem flex-between notice"
      v-if="notice"
      @click="toNotice"
    >
      <image :src="require('@/assets/user/notice.png')"></image>
      <view class="text-overflow noticeText">
        <uni-notice-bar
          background-color="#fff"
          style="padding: 0; margin-bottom: 0"
          color="#1A1A1A"
          scrollable="true"
          :speed="50"
          single="true"
          :text="notice"
        ></uni-notice-bar>
      </view>
      <uni-icons type="arrowright" size="18" color="#666"></uni-icons>
    </view>
    <view class="app-card" style="margin-bottom:20rpx">
      <view class="planTop flex-between">
        <view class="title">
          <image :src="require('@/assets/plan.png')"></image>
          <text>我的排班</text>
        </view>
        <view class="flex-between">
          <view class="type">心咨预约</view>
          <view class="dept" @click="openDept"
            ><text>{{ userInfo.deptList[deptIndex].name }}</text
            ><uni-icons type="forward" size="20"></uni-icons
          ></view>
        </view>
      </view>
      <view class="date">
        <view class="dateTop">
          <view class="dateTop-wrap">
            <view class="date-year">
              <text class="iconfont icon-zuo" @click="preYear"></text>
              <view class="text">{{ calendar.year }}年</view>
              <text class="iconfont icon-iconfont64" @click="nextYear"></text>
            </view>
            <view class="date-month">
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
              v-for="(item, index) in dayList"
              :key="index"
              @click="changeWeek(index)"
            >
              <view>{{ item.week }}</view>
              <view class="time">{{ item.date }}</view>
            </view>
          </scroll-view>
        </view>
        <view class="plan_main" v-if="scheduleData">
          <view
            class="flex-between planShow"
            v-show="!isPlan"
            style="margin-bottom: 20rpx"
          >
            <view class="total">{{ scheduleData.sourceNumber }}</view>
            <view class="names">
              <view
                class="patient"
                v-for="(f, i) in scheduleData.userList"
                :key="i"
                >{{ f.patientName }}</view
              >
            </view>
            <view class="left">
              剩余
              <text class="num">{{ scheduleData.remainSourceNumber }}</text>
            </view>
          </view>

          <view v-show="isPlan">
            <block
              v-for="(item, index) in scheduleData.scheduleDetailList"
              :key="index"
            >
              <view class="planShow paddt" :key="index">
                <view>
                  <view class="periodName list-item-top-box">
                    <view class="room">{{ item.roomName }}</view>
                    <view class="plan_item">
                      {{ item.itemName }} <text>￥{{ item.price }}</text></view
                    >
                    <view class="plan_user" v-if="item.reservedVO">
                      <view class="patient"
                        ><image
                          class="plan_user_status"
                          v-if="item.reservedVO.status === null"
                          :src="require('./static/xz_nopay.png')"
                        /><image
                          class="plan_user_status"
                          v-if="item.reservedVO.status == 3"
                          :src="require('./static/xz_askleave.png')"
                        /><image
                          class="plan_user_status"
                          v-if="item.reservedVO.status == 1"
                          :src="require('./static/xz_paid.png')"
                        />{{ item.reservedVO.patientName }}</view
                      >
                    </view>
                    <view class="planNum">
                      <!-- <view v-if="item.reservedVO">已满</view> -->
                      <view v-if="item.stop" style="color:#f74a4a">已停诊</view>
                      <!-- <view v-else>剩<text class="num">1</text></view> -->
                    </view>
                  </view>
                  <view class="list-item-bottom-box">
                    <view class="time-box">
                      <text class="label">{{ item.periodName || '' }}</text>
                      <text class="value"
                        >{{ item.startTime }}~{{ item.endTime }}</text
                      >
                    </view>
                    <view class="tag-box">
                      <image
                        class="plan_aloneAdd"
                        v-if="item.aloneAdd"
                        :src="require('./static/addSchedule.png')"
                      />
                      <image
                        class="plan_aloneAdd"
                        v-if="item.video"
                        :src="require('./static/video.png')"
                      />
                      <view
                        v-if="item.sex && item.sex != 9"
                        class="tag-box-item"
                        >{{
                          item.sex == 9
                            ? ''
                            : item.sex == 1
                            ? '男'
                            : item.sex == 2
                            ? '女'
                            : ''
                        }}</view
                      >
                      <view
                        v-if="item.ageGroup && item.ageGroup != '1,2,3'"
                        class="tag-box-item"
                      >
                        {{ ageGroupText(item.ageGroup) }}</view
                      >
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
          <view
            class="openIcon"
            v-if="scheduleData && scheduleData.sourceNumber > 0"
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
        <view class="noData" v-else>
          <image src="@/pages-zxs/static/noData.png" />
          <view>暂无数据</view>
        </view>
      </view>
    </view>
    <uni-popup ref="deptPop" type="bottom">
      <view class="pop-view">
        <view class="title"
          >选择科室
          <view class="icon" @click="cancelPop">
            <uni-icons :size="20" color="#e6e6e6" type="clear" />
          </view>
        </view>
        <picker-view
          :value="dept"
          style="height: 200px; text-align: center"
          indicator-style="height:80rpx"
          @change="deptChange"
        >
          <picker-view-column>
            <view
              v-for="(item, index) in userInfo.deptList"
              :key="index"
              class="item"
              >{{ item.name }}</view
            >
          </picker-view-column>
        </picker-view>

        <view @click="deptConfirm" class="confirm">确认</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import util from '@/common/util'
import { myWorkSchedule, departments } from './api/scheduling'
import { announceAnyData, unreadQuantity } from '@/common/request/index'

import dayjs from 'dayjs'
export default {
  data() {
    return {
      appointmentList: [
        {
          img: require('@/pages-zxs/static/yy_xz.png'),
          title: '预约患者',
          path: '/pages-zxs/appoint-patient/index',
        },
        {
          img: require('@/pages-zxs/static/yy_tthd.png'),
          title: '心理咨询',
          path: '/pages-zxs/psychological-consulting/index',
        },
        {
          img: require('@/pages-zxs/static/yy_ttzl.png'),
          title: '患者请假',
          path: '/pages-zxs/patient-leave/index',
        },
        {
          img: require('@/pages-zxs/static/yy_jzk.png'),
          title: '停诊申请',
          path: '/pages-zxs/suspension-apply/index',
        },
        {
          img: require('@/pages-zxs/static/yy_main.png'),
          title: '我的患者',
          path: '/pages-zxs/myPatient/list',
        },
        {
          img: require('@/pages-zxs/static/yy_bm.png'),
          title: '我的活动',
          path: '/pages-zxs/my-active/index',
        },
        {
          img: require('@/pages-zxs/static/yy_xiaoxi.png'),
          title: '报名记录',
          path: '/pages-zxs/singRecord/index',
        },
        {
          img: require('@/pages-zxs/static/yy_mytj.png'),
          title: '我的统计',
          path: '/pages-zxs/statistics/index',
        },
      ],
      getTimeState: util.getTimeState(),
      notice: '',
      calendar: {},
      isdate: false,
      isPlan: false,
      isweek: 0,
      dayList: [],

      dept: [0],
      deptIndex: 0,
      scheduleData: null,
      unReadMsgNum: '', //未读消息数量
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  created() {
    this.getannounceAnyData()
  },
  onShow() {
    this.getunreadQuantity()
  },
  onReady() {
    this.calendar = this.$refs.date.nowDate
    this.getDayList()
    this.getmyWorkSchedule(this.$refs.date.nowDate.fullDate)
  },
  methods: {
    async getunreadQuantity() {
      this.unReadMsgNum = await unreadQuantity()
    },
    intoMsgList() {
      uni.navigateTo({
        url: '/pages-doctor/message/list',
      })
    },
    ageGroupText(ageGroup) {
      if (ageGroup.split(',').length === 3) return ''
      const types = {
        1: '儿童',
        2: '青少年',
        3: '成人',
      }
      return ageGroup
        .split(',')
        .map(v => types[v])
        .join('、')
    },
    outPage() {
      uni.showModal({
        title: '提示',
        content: '是否确认退出？',
        success: confirm => {
          if (confirm.confirm) {
            this.$store.dispatch('signOut').then(() => {
              uni.reLaunch({
                url: '/pages/login/login',
              })
            })
          }
        },
      })
    },
    getDayList(data) {
      let newData = data || this.$refs.date.nowDate.fullDate
      let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let list = []
      for (let index = 0; index < 7; index++) {
        const data = dayjs(newData).add(index, 'day')

        list.push({
          week: week[data.day()],
          date: data.format('YYYY-MM-DD'),
        })
      }
      this.dayList = list
      this.isweek = 0
    },
    go(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      })
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
    //获取排班信息
    async getmyWorkSchedule(fulldate) {
      let res = await myWorkSchedule({
        deptId: this.userInfo.deptList[this.deptIndex].id,
        userId: this.userInfo.userId,
        endDate: fulldate,
        startDate: fulldate,
      })

      if (res.length == 0) {
        this.scheduleData = null
      } else {
        let userList = res[0].scheduleDetailList
          .filter(item => item.reservedVO)
          .map(t => t.reservedVO)
        this.scheduleData = { ...res[0], userList: userList }
      }
      console.log(this.scheduleData)
    },
    toNotice() {
      uni.navigateTo({
        url: '/pages-doctor/notice/list',
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
      // this.getmyWorkSchedule(e.fulldate)
      this.getDayList(e.fulldate)
      this.isdate = false
    },
    dateOpen() {
      this.isdate = !this.isdate
    },
    changeWeek(i) {
      this.isweek = i
      this.getmyWorkSchedule(this.dayList[i].date)
    },
    deptChange(e) {
      console.log(e)
      this.dept = e.detail.value
    },
    deptConfirm(e) {
      console.log(e)

      this.deptIndex = this.dept[0]
      this.$refs.deptPop.close()
    },
    cancelPop() {
      this.$refs.deptPop.close()
    },
    openDept() {
      this.$refs.deptPop.open()
    },
  },
}
</script>
<style lang="scss" scoped>
.homeTop {
  height: 120rpx;

  background-size: 100%;
  padding: 0 20rpx;
  padding-top: 25rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  color: #fff;
  .msg-txt {
    max-width: 680rpx;
  }
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
  .icon-tuichubianji {
    position: absolute;
    right: 30rpx;
    top: 25rpx;
  }
}
.app-card {
  margin: 20rpx 20rpx 0 20rpx;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
  border-radius: 10rpx;
  background: #ffffff;
  position: relative;
  z-index: 2;
  padding: 0;
  .card-title {
    padding: 30rpx;
    text-align: center;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #333333;
  }
}
.notice {
  padding: 30rpx;
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
.container {
  margin-top: 2rpx;
}

.app-item {
  margin-bottom: 30rpx;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    margin-top: 20rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #1a1a1a;
  }
}
.planTop {
  padding: 20rpx;
  image {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
  }

  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .type {
    background: rgba(10, 178, 193, 0.1);
    padding: 0 26rpx;
    color: $uni-color-primary;
    border-radius: 20rpx;
    font-size: 24rpx;
  }
  .dept {
    /* background: rgba(158, 159, 159, 0.1); */
    padding: 2rpx 26rpx;
    padding-right: 4rpx;
    color: #333;
    border-radius: 20rpx;
    font-size: 24rpx;
    /* width: 200rpx; */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.date {
  margin-top: 30rpx;
  padding: 0 20rpx;
  .dateTop {
    height: 80rpx;
    background-color: #f2f2f2;
    border-bottom: 1px solid #fff;
    display: flex;
    width: 100%;
    .dateTop-wrap {
      display: flex;
      flex: 1;
      padding-left: 20rpx;
      .date-year,
      .date-month {
        flex: 1;
        display: flex;
        align-items: center;
        .uni-icons {
          color: $uni-color-primary !important;
        }
      }
      .date-month {
        border-left: 1px solid #cccccc;
        margin-left: 30rpx;
        padding-left: 30rpx;
      }
    }
    .p030 {
      padding: 0 30rpx;
      line-height: 80rpx;
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
    /* padding: 0 30rpx; */
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
    /* margin-bottom: 20rpx; */
    display: flex;
    align-items: center;
  }

  .planTime {
    font-size: 20rpx;
    color: #1a1a1a;
    margin-right: 60rpx;
    position: relative;
    .periodName {
      font-size: 30rpx;
      margin-bottom: 10rpx;
      font-weight: bold;
    }
    .ljIcon {
      width: 19.5rpx;
      height: 45rpx;
      position: absolute;
      right: -28rpx;
      top: 40rpx;
      // margin-top: -12rpx;
    }

    view {
      line-height: 28rpx;
    }
  }
  .room {
    margin-right: 10rpx;
  }
  .plan_item {
    font-size: 24rpx;
    margin-right: 20rpx;
    text {
      color: $uni-color-primary;
    }
  }
  .plan_user_status {
    width: 24rpx;
    height: 24rpx;
    margin-right: 6rpx;
  }
  .patient {
    width: 130rpx;
    height: 36rpx;
    background: #f2f2f2;
    border-radius: 18rpx;
    font-size: 24rpx;
    color: #666666;
    line-height: 36rpx;
    text-align: center;
    margin: 0 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
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
    /* padding-top: 30rpx; */
    padding-bottom: 20rpx;
  }
}
.noData {
  text-align: center;
  color: #999;
  margin-top: 30rpx;
  padding-bottom: 30rpx;
  image {
    width: 129rpx;
    height: 124rpx;
    margin: 0 auto;
  }
}
.pop-view {
  width: 100%;
  min-height: 700rpx;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .title {
    font-size: 32rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    .icon {
      position: absolute;
      top: 10rpx;
      height: 100%;
      right: 32rpx;
    }
  }

  .confirm {
    position: absolute;
    width: 100%;
    bottom: 0rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: $uni-color-primary;
    color: #fff;
  }
}
.flex-wrap {
  flex-wrap: wrap;
}
.list-item-top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.list-item-bottom-box {
  display: flex;
  align-items: center;
}
.label {
  color: #1a1a1a;
}
.value {
  color: #666;
}
.time-box {
  margin-right: 20rpx;
}
.tag-box {
  display: flex;
  align-items: center;
  .plan_aloneAdd {
    width: 32rpx;
    height: 32rpx;
    margin-right: 20rpx;
  }
  .tag-box-item {
    background-color: rgba(10, 178, 193, 0.1);
    color: #0ab2c1;
    margin-left: 20rpx;
  }
}
</style>
