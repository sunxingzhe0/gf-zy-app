<template>
  <view class="container">
    <topbar :active="active" :tabs="tabs" @change="topBarChange">
      <view
        @click="sort"
        style="width: 60rpx; height: 60rpx;line-height: 68rpx; text-align: center;"
        ><image
          class="top-bar__item top-bar__item_icon"
          :src="require('@/assets/paixu(1)@2x.png')"
          mode="aspectFit"
        ></image
      ></view>
    </topbar>
    <view class="page-body">
      <view
        class="app-card"
        :class="{ finished: item.status == 'FINISH' }"
        v-for="item in dataList"
        :key="item.orderId"
        @click="toChat(item)"
      >
        <view class="flex-start-start">
          <view class="doctor-avatar">
            <image
              :src="
                item.avatar
                  ? FILE_URL(item.avatar)
                  : require('@/assets/user/user_d_head.png')
              "
              mode="scaleToFill"
            ></image>
            <view class="unreadmessage" v-if="item.unReadMessage">{{
              item.unReadMessage
            }}</view>
          </view>
          <view class="ml-20" style="flex-grow: 1;">
            <view class="flex-between-start">
              <view>
                <text class="doctor-name">{{ item.name }}</text>
                <text>{{ item.title }} {{ item.deptName }}</text>
              </view>
              <view
                class="tag"
                :class="item.bizType === 1 ? 'video' : 'text'"
                style="margin-top: 8rpx;"
                >{{ item.bizTypeName }}</view
              >
            </view>
            <view class="time" v-if="item.showTime">
              {{
                !item.bizType
                  ? '创建'
                  : ['APPOINTMENT', 'WAIT_TREAT'].includes(item.status)
                  ? '预约'
                  : ['FINISH', 'IN_TREAT'].includes(item.status)
                  ? '接诊'
                  : '创建'
              }}时间：{{ item.showTime }}
            </view>
            <view v-if="item.countDown">
              距离{{
                item.status == 'APPOINTMENT'
                  ? '复诊开始'
                  : item.status == 'IN_TREAT'
                  ? '服务结束'
                  : '诊室关闭'
              }}还剩：
              <text style="color: #E45b5b;" v-if="item.countDown">
                {{ item.countDown }}
              </text>
            </view>
          </view>
        </view>
        <view class="btn-wrapper" v-if="active != 'CONSULT'">
          <button
            class="btn"
            :class="{ s: item.medical }"
            @click.stop="toMedical(item.medical, item.orderId)"
          >
            病历
          </button>
          <button
            class="btn"
            :class="{ s: item.rp }"
            @click.stop="toPrescription(item.rp, item.orderId)"
          >
            处方
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userSessionData } from '@/common/request/index.js'
export default {
  data() {
    return {
      tabs: [
        {
          title: '在线咨询',
          key: 'CONSULT',
        },
        {
          title: '在线复诊',
          key: 'REPEAT_CLINIC',
        },
        {
          title: '慢病续方',
          key: 'CARRYON_PRESC',
        },
      ],
      active: 'CONSULT',
      currentNum: 1,
      pageSize: 10,
      sorted: '',
      dataList: [],
      interval: null,
    }
  },
  created() {
    this.getUserSessionData()
    this.openMonitor()
  },
  beforeDestroy() {
    this.destroyMonitor()
  },
  methods: {
    openMonitor() {
      uni.setNavigationBarTitle({
        title: this.webSocket.getSocketConnect() || '我的诊室',
      })

      uni.$on('SocketConnect', this.onSocketConnect)
      uni.$on('onMessage', this.messageHandler)
    },
    destroyMonitor() {
      uni.$off('SocketConnect', this.onSocketConnect)
      uni.$off('onMessage', this.messageHandler)

      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    async onPullDown() {
      this.currentNum = 1
      this.getUserSessionData()
    },
    async onBottom() {
      this.dataList.length === this.currentNum * this.pageSiz &&
        this.currentNum++ &&
        (await this.getUserSessionData())
    },
    async getUserSessionData() {
      const params = {
        tab: this.active,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        sorted: this.sorted,
      }

      const { list } = await userSessionData(params)
      const listMap =
        list?.map(item => {
          Object.assign(item, {
            unReadMessage: this.webSocket.getUnread(item.sessionId)?.length,
          })

          return item.closeTime
            ? Object.assign(item, {
                closeTimestamp: +new Date(item.closeTime.replace(/-/g, '/')),
              })
            : item
        }) || []

      const closeTimestampLength = listMap.filter(_ => _.closeTimestamp).length
      if (closeTimestampLength) {
        this.countDown([
          ...(this.currentNum > 1 ? this.dataList : []),
          ...listMap,
        ])

        if (this.interval) return

        this.interval = setInterval(() => {
          const closeTimestampLength = this.dataList.filter(
            _ => _.closeTimestamp,
          ).length
          if (closeTimestampLength) {
            this.countDown()
          } else {
            clearInterval(this.interval)
            this.interval = null
          }
        }, 1000)
      } else {
        this.dataList = [
          ...(this.currentNum > 1 ? this.dataList : []),
          ...listMap,
        ]
      }
    },
    countDown(dataList) {
      this.dataList = (dataList || this.dataList).map(item => {
        let time = item.closeTimestamp - +new Date()

        if (!time || time <= 0) {
          return Object.assign(item, { countDown: null, closeTimestamp: null })
        }

        time /= 1000
        const h = parseInt(time / 60 / 60)
        const m = parseInt((time / 60) % 60)
        const s = parseInt((time % 60) % 60)

        return Object.assign(item, {
          countDown: `${('0' + h).substr(-2)}:${('0' + m).substr(-2)}:${(
            '0' + s
          ).substr(-2)}`,
        })
      })
    },
    topBarChange(active) {
      this.active = active
      this.currentNum = 1
      this.dataList = []
      this.getUserSessionData()
    },
    toChat({ orderId }) {
      uni.navigateTo({
        url: `/pages-user/chat/chat?orderId=${orderId}`,
      })
    },
    toPrescription(state, orderId) {
      if (state)
        uni.navigateTo({
          url: '/pages-user/prescription/prescription?orderId=' + orderId,
        })
    },
    toMedical(state, orderId) {
      if (state)
        uni.navigateTo({
          url: '/pages-user/medical/detail?orderId=' + orderId,
        })
    },
    sort() {
      this.sorted = this.sorted == 'asc' ? 'desc' : 'asc'
      this.dataList = []
      this.currentNum = 1
      this.getUserSessionData()
    },
    messageHandler(payload) {
      const sessionId = (payload.info || payload).to.substr(1)
      const index = this.dataList
        .map(({ sessionId }) => sessionId)
        .indexOf(sessionId)

      if (index > -1)
        this.dataList[index].unReadMessage =
          this.webSocket.getUnread(sessionId)?.length || 0
    },
    onSocketConnect() {
      uni.setNavigationBarTitle({
        title: this.webSocket.getSocketConnect() || '我的诊室',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 80rpx;
}

.top-bar__item_icon {
  width: 30rpx;
  height: 30rpx;
}

.page-body {
  padding: 0 20rpx 120rpx;
}

.app-card {
  margin-top: 12px;
  padding: 30rpx 20rpx;
  color: #666;
}

.doctor-name {
  margin-right: 20rpx;
  font-size: 30rpx;
  font-weight: bolder;
}

.doctor-avatar {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 110rpx;
  height: 110rpx;
  background-color: rgba(10, 178, 193, 0.2);
  box-shadow: 0 0 8rpx 12rpx rgba(26, 255, 189, 0.1);
  border-radius: 50%;

  image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
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

.tag {
  width: 60rpx;
  border-radius: 4rpx;
  padding: 4rpx 0;
  text-align: center;
  font-size: 20rpx;

  &.text {
    background: rgba(10, 178, 193, 0.1);
    color: $uni-color-primary;
  }

  &.video {
    background: rgba(10, 96, 193, 0.1);
    color: #0a60c1;
  }
}

.finished {
  background-color: #f8f8f8;
  color: #999;

  .doctor-name {
    color: #999;
  }

  .tag {
    background-color: #e6e6e6;
    color: #666;
  }
}

.time {
  font-size: 24rpx;
  color: #666;
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 50rpx;
}

.btn {
  margin-left: 20rpx;
  color: #cbcbcb;
  border: 1px solid rgba(203, 203, 203, 1);
  border-radius: 30px;

  &.s {
    color: #0ab1c0;
    border: 1px solid rgba(10, 177, 193, 1);
  }
}
</style>
