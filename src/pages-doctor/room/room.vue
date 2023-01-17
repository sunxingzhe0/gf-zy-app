<template>
  <view class="container" :class="{ adapt: showTopTip }">
    <!--主页按钮-->
    <homeIcom />

    <topbar :active="status" :tabs="tabs" @change="topbarChange">
      <template v-slot:top>
        <view
          v-if="showTopTip"
          class="top-tip"
          :class="{ disabled: !switchState }"
        >
          <view style="font-size: 20rpx;">{{
            switchState
              ? '当前业务处于在线状态，患者可正常购买业务。'
              : '当前业务处于离线状态，患者不能购买业务。'
          }}</view>
          <view @click="showTopTip = false">x</view>
        </view>
      </template>
      <switch :checked="switchState" color="#0AB2C1" @change="switchChange" />
    </topbar>
    <view v-show="status != 'IN_TREAT'">
      <date ref="date" :sessionList="List" @change="dateChange">
        <view
          v-if="navTitle == 'REPEAT_CLINIC' && status == tabs[0].key"
          class="top-title__wraper"
        >
          <view
            class="top-title__item"
            :class="{ active: wayType == 1 }"
            @click="wayTypeFilter(1)"
          >
            视频({{ page.VIDEO }})
          </view>
          <view
            class="top-title__item"
            :class="{ active: wayType == 0 }"
            @click="wayTypeFilter(0)"
          >
            图文({{ page.GRAPHIC }})
          </view>
        </view>
        <view
          class="flex-between"
          style="padding: 32rpx 20rpx 8rpx;"
          @click="selectTime"
        >
          <view>选择日期</view>
          <view class="flex-start-center" style="color: #666;">
            <view style="margin-right: 16rpx;">{{ time }}</view>
            <image
              :src="require('@/assets/right11@2x.png')"
              mode="aspectFit"
              style="width: 16rpx;height: 28rpx;"
            ></image>
          </view>
        </view>
      </date>
    </view>
    <list-item v-for="item in List" :key="item.orderId" :item="item" />
  </view>
</template>

<script>
import date from './date.vue'
import {
  findBizTypeState,
  updateBizTypeState,
  doctorSessionData,
  doctorSessionNavCount,
} from '@/common/request/index.js'
import listItem from './list-item.vue'

const enums = {
  CONSULT: '在线咨询',
  REPEAT_CLINIC: '在线复诊',
  CARRYON_PRESC: '慢病续方',
}

export default {
  components: {
    date,
    listItem,
  },
  data() {
    const today = this.FORMATDATE(new Date(), 'yyyy-MM-dd')
    return {
      doctorId: uni.getStorageSync('userId'),
      tabs: [
        {
          title: '待接诊',
          key: 'WAIT_TREAT',
        },
        {
          title: '接诊中',
          key: 'IN_TREAT',
        },
        {
          title: '已结束',
          key: 'FINISH',
        },
      ],
      showTopTip: false,
      time: `${today} ~ ${today}`,
      navTitle: '',
      status: 'WAIT_TREAT', //接诊状态
      wayType: '', // 1 图文；0 视频
      startTime: `${today.split('-').join('')}000000`,
      endTime: `${today.split('-').join('')}235959`,
      currentNum: 1,
      switchState: false,
      dataList: [],
      List: [], //过滤后的列表数据
      page: {
        VIDEO: 0,
        GRAPHIC: 0,
      },
      interval: null,
    }
  },
  onLoad(option) {
    const navTitle = option.navTitle

    if (navTitle == 'REPEAT_CLINIC') {
      this.wayType = 1
    }

    this.navTitle = navTitle

    this.getBizTypeState()
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.webSocket.getSocketConnect() || enums[this.navTitle],
    })

    this.doctorSessionNavCount()
    this.getDoctorSessionData()

    uni.$on('SocketConnect', this.onSocketConnect)
    uni.$on('onMessage', this.messageHandler)
    //监听同步指令更新诊室会话列表
    uni.$on('sync', data => {
      if (data === 'SYNC_SESSION') {
        console.log(data, '同步指令更新会话列表')
        this.getDoctorSessionData()
      }
    })
  },
  onHide() {
    uni.$off('SocketConnect', this.onSocketConnect)
    uni.$off('onMessage', this.messageHandler)
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  onUnload() {
    uni.$off('SocketConnect', this.onSocketConnect)
    uni.$off('onMessage', this.messageHandler)
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  async onPullDownRefresh() {
    this.currentNum = 1
    await this.getDoctorSessionData()
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    if (this.dataList.length < this.currentNum * this.pageSize) return

    this.currentNum++
    this.getDoctorSessionData()
  },
  methods: {
    async getDoctorSessionData() {
      const params = {
        tab: this.navTitle,
        status: this.status,
        currentNum: this.currentNum,
        pageSize: 9999,
        startTime: this.startTime,
        endTime: this.endTime,
        wayType: '',
      }
      const { list } = await doctorSessionData(params)

      this.dataList = [
        ...(this.currentNum > 1 ? this.dataList : []),
        ...list,
      ].map(item => {
        Object.assign(item, {
          unReadMessage: this.webSocket
            .getUnread(item.sessionId)
            .filter(_ => (_.info?.from || _.form) == item.userId).length,
        })

        return Object.assign(item, {
          wayType: item.bizType,
          closeTimeStamp: item.closeTime
            ? +new Date(item.closeTime.replace(/-/g, '/'))
            : null,
          appointmentTimeStamp: item.appointmentPeriod
            ? item.appointmentPeriod -
              +new Date(item.appointmentPeriod.split('~')[0].replace(/-/g, '/'))
            : 0,
        })
      })

      if (this.navTitle == 'REPEAT_CLINIC' && this.status == 'WAIT_TREAT') {
        Object.assign(this.page, {
          VIDEO: this.dataList.filter(({ wayType }) => wayType === 1).length,
          GRAPHIC: this.dataList.filter(({ wayType }) => wayType === 0).length,
        })
      }

      const List =
        typeof this.wayType == 'number'
          ? this.dataList.filter(({ wayType }) => wayType == this.wayType)
          : [...this.dataList]

      if (this.status == 'FINISH') {
        List.reverse()
      }

      this.countDown(List)

      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.countDown(this.List)
      }, 1000)

      if (!list.length && this.currentNum > 1) {
        this.currentNum--
      }
    },
    countDown(list) {
      this.List = list.map(item => {
        const now = +new Date()
        const appointmentTime = item.appointmentTimeStamp - now
        const time = item.closeTimeStamp - now

        if (time > 0) {
          const h = parseInt(time / 1000 / 60 / 60)
          const m = parseInt((time / 1000 / 60) % 60)
          const s = parseInt(((time / 1000) % 60) % 60)

          Object.assign(item, {
            countDown: `${('0' + h).substr(-2)}:${('0' + m).substr(-2)}:${(
              '0' + s
            ).substr(-2)}`,
          })
        } else {
          Object.assign(item, {
            countDown: null,
          })
        }

        const appointmentCountDown =
          appointmentTime > 0 ? parseInt(appointmentTime / 1000 / 60) : 0
        return Object.assign(item, {
          appointmentCountDown,
        })
      })
    },
    async doctorSessionNavCount() {
      const params = {
        tab: this.navTitle,
        status: '',
        currentNum: this.currentNum,
        startTime: '',
        endTime: '',
        pageSize: 9999,
        wayType: '',
      }

      const data = await doctorSessionNavCount(params)
      this.tabs = this.tabs.map(item =>
        Object.assign(item, {
          num: data[item.key] || '',
        }),
      )
    },
    async getBizTypeState() {
      const params = {
        bizType: this.navTitle,
        doctorId: this.doctorId,
      }
      const data = await findBizTypeState(params)

      if (typeof data == 'number') {
        this.showTopTip = true
        this.switchState = data
      }
    },
    topbarChange(status) {
      this.wayType =
        this.navTitle == 'REPEAT_CLINIC' && status == 'WAIT_TREAT' ? 1 : ''
      this.status = status
      this.currentNum = 1
      this.interval && clearInterval(this.interval)

      status == 'WAIT_TREAT' || status == 'FINISH'
        ? this.$refs.date.calendarToday()
        : this.$refs.date.clearDate()
    },
    async switchChange(event) {
      const value = event.target.value
      const params = {
        bizType: this.navTitle,
        doctorId: this.doctorId,
        state: value ? 1 : 0,
      }

      try {
        this.switchState = value
        await updateBizTypeState(params)
      } catch (e) {
        //TODO handle the exception
        this.switchState = !value
      }
    },
    async wayTypeFilter(type) {
      this.wayType = type
      this.List = this.dataList.filter(({ wayType }) => wayType == type)
    },
    dateChange(payload) {
      const [date1, date2] = payload
      if (!date1 || !date2) {
        if (['FINISH', 'WAIT_TREAT'].includes(this.status)) {
          this.$refs.date.calendarToday()
          return
        }

        this.time = ''
        this.startTime = ''
        this.endTime = ''
      } else {
        this.time = `${date1.fullDate} ~ ${date2.fullDate}`
        this.startTime = date1.fullDate?.split('-').join('') + '000000'
        this.endTime = date2.fullDate?.split('-').join('') + '235959'
      }
      this.currentNum = 1
      this.List = []
      this.getDoctorSessionData()
    },
    selectTime() {
      this.$refs.date.showFunc()
    },
    messageHandler(payload) {
      const info = payload.info || payload
      const sessionId = info.to.substr(1)
      const index = this.List.map(({ sessionId }) => sessionId).indexOf(
        sessionId,
      )

      if (index > -1) {
        this.List[index].unReadMessage = this.webSocket.getUnread(
          sessionId,
        )?.length
      }
    },
    onSocketConnect() {
      if (this.webSocket.getSocketConnect()) {
        uni.setNavigationBarTitle({
          title: this.webSocket.getSocketConnect() || '我的诊室',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.top-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20rpx;
  width: 100%;
  line-height: 24px;
  background-color: rgba(10, 178, 193, 0.2);
  color: $uni-color-primary;

  &.disabled {
    background-color: rgba(228, 91, 91, 0.2);
    color: #e45b5b;
  }
}

.container {
  //#ifdef H5
  padding-top: 70rpx;
  //#endif
  //#ifndef H5
  padding: 90rpx 20rpx 40rpx;
  //#endif

  &.adapt {
    padding-top: 126rpx;
  }
}

switch {
  transform: scale(0.7);
}

.top-title__wraper {
  display: flex;
  justify-content: space-around;
  border-bottom: 2rpx solid #e6e6e6;

  .top-title__item {
    padding: 20rpx 0;
    border-bottom: 4rpx solid transparent;
    color: #666;

    &.active {
      border-bottom-color: $uni-color-primary;
      color: $uni-color-primary;
    }
  }
}

.app-card {
  background-color: red;
  position: relative;
  overflow: hidden;
  margin-top: 12rpx;
  color: #666;

  &.finish {
    background-color: #f8f8f8;
  }
}

.status-sign {
  position: absolute;
  right: -36rpx;
  top: -24rpx;
  width: 140rpx;
  height: 110rpx;
  line-height: 130rpx;
  border-radius: 50%;
  text-align: center;
  transform: rotate(0.1turn);

  &.wait {
    background-color: rgba(10, 178, 193, 0.1);
    color: #0ab2c1;
  }

  &.ing {
    background-color: #0ab2c1;
    color: #fff;
  }

  &.end {
    background-color: #ccc;
    color: #fff;
  }
}

.avatar-wrapper {
  position: relative;
  width: 100rpx;
  height: 100rpx;
}

.unreadmessage {
  position: absolute;
  top: 0;
  right: 0;
  width: 32rpx;
  height: 32rpx;
  line-height: 30rpx;
  border-radius: 50%;
  text-align: center;
  background-color: #e35b5b;
  font-size: 24rpx;
  color: #fff;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.username {
  font-weight: bolder;
  font-size: 32rpx;
  color: #1a1a1a;
}

.tag {
  margin-left: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  font-size: 20rpx;

  &.video {
    background: rgba(10, 96, 193, 0.1);
    color: #0a60c1;
  }

  &.text {
    background: rgba(10, 178, 193, 0.1);
    color: $uni-color-primary;
  }

  &.call {
    background: rgba(115, 70, 217, 0.1);
    color: #7346d9;
  }
}

.diagnosis-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.icon-expand {
  width: 60rpx;
  height: 40rpx;
  margin: auto;
}
</style>
