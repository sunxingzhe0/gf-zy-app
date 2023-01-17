<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />

    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view class="flex-between top-title" @click="$refs.popselect.open()">
          <view style="color: #666;">就诊人</view>
          <view>
            <text>{{ selectedPatient }}</text>
            <uni-icons type="arrowright" size="14" color="#666"></uni-icons>
          </view>
        </view>
      </template>
    </topbar>
    <view class="page-list">
      <view
        class="app-card"
        v-for="(item, index) in dataList"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <view class="tag red" v-if="item.cancel && item.state == 2"
          >已逾期</view
        >
        <view class="tag primary" v-else-if="isToday(item.visitDate)">
          今天
        </view>
        <view class="flex-between">
          <view>
            <checkbox-group
              @change="checkboxChange(index)"
              @click.stop="() => null"
            >
              <label>
                <checkbox
                  v-if="item.state == 1"
                  class="checkbox"
                  color="#0ab2c1"
                  :checked="item.checked"
                />门诊预约
              </label>
            </checkbox-group>
          </view>
          <view class="date">
            {{
              item.state == 3
                ? `取号时间：${item.getNoTime}`
                : item.state == 5
                ? `退费时间：${item.backTime}`
                : item.state == 1 || item.state == 2
                ? `${item.state == 2 ? '预约执行时间：' : ''}
                ${item.visitDate} ${item.startTime}~${item.endTime}`
                : ''
            }}
          </view>
        </view>
        <view class="flex-between content">
          <view class="flex-start-center">
            <view>
              <image
                :src="
                  item.img
                    ? FILE_URL(item.img)
                    : require('@/assets/user/user_d_head.png')
                "
                mode="scaleToFill"
                class="avatar"
              ></image>
            </view>
            <view style="margin-left: 20rpx;">
              <view class="doctor-name">{{ item.doctorName }}</view>
              <view class="position">{{ item.title }}|{{ item.deptName }}</view>
            </view>
          </view>
          <view class="cost">
            {{ item.state == 1 ? '诊查费' : '费用' }}：￥{{ item.fee }}
          </view>
        </view>
        <view class="flex-end-start">
          <button
            v-if="query.state == 5"
            type="mini"
            class="button"
            @click.stop="del(item.id)"
          >
            删除
          </button>
          <button
            v-else-if="
              query.state == 2 && !isToday(item.visitDate) && !item.cancel
            "
            type="mini"
            class="button"
            @click.stop="cancel(item)"
          >
            取消
          </button>
        </view>
      </view>
    </view>
    <view class="bottom-bar flex-between" v-if="query.state == 1">
      <view>
        <checkbox-group @change="checkedAll">
          <label>
            <checkbox
              class="checkbox"
              color="#0ab2c1"
              :checked="checkAll"
            />全选
          </label>
        </checkbox-group>
      </view>
      <view class="flex-justify-end">
        <view class="total-cost">￥{{ totalCost }}</view>
        <button
          class="button button-primary"
          :disabled="disabledButton"
          @click="openPay"
        >
          支付
        </button>
      </view>
    </view>

    <pop-select
      ref="popselect"
      title="就诊人"
      multi
      :list="patients"
      @change="patientChange"
      @submit="patientSubmit"
    ></pop-select>
    <!-- 支付列表 -->
    <popup-pay
      ref="pay"
      :type="true"
      @success="refresh"
      @payTap="orderPay"
    ></popup-pay>
  </view>
</template>

<script>
import popSelect from '@/components/pop-select'
import { patientList } from '@/common/request/userCenter'
import {
  getUserList,
  submitAppointment,
  delAppointment,
  verifyBack,
} from '@/common/request/userAppointment'
import { refund } from '@/common/request/order'

const userId = uni.getStorageSync('userId')
export default {
  components: {
    popSelect,
  },
  data() {
    return {
      isClick: true,
      tabs: [
        {
          title: '未缴费',
          key: 1,
        },
        {
          title: '已预约',
          key: 2,
        },
        {
          title: '已取号',
          key: 3,
        },
        {
          title: '已退费',
          key: 5,
        },
        {
          title: '已关闭',
          key: 6,
        },
      ],
      query: {
        pageSize: 10,
        currentNum: 1,
        memberId: [],
        state: 1,
      },
      patients: [],
      dataList: [],
    }
  },
  computed: {
    checkAll() {
      const length = this.dataList.length
      return (
        length && length === this.dataList.filter(item => item.checked).length
      )
    },
    disabledButton() {
      return this.dataList.filter(({ checked }) => checked).length === 0
    },
    selectedPatient() {
      return this.patients
        .filter(({ memberId }) => this.query.memberId.indexOf(memberId) > -1)
        .map(item => item.name)
        .join(',')
    },
    totalCost() {
      return this.dataList
        .filter(({ checked }) => checked)
        .map(({ fee }) => Number(fee))
        .reduce((_, p) => {
          return _ + p
        }, 0)
        .toFixed(2)
    },
  },
  onShow() {
    if (!this.patients.length) {
      this.getPatientList()
    } else {
      this.refresh()
    }
  },
  onPullDownRefresh() {
    this.refresh()
  },
  onReachBottom() {
    if (this.dataList.length === this.query.currentNum * this.query.pageSize) {
      this.query.currentNum++
      this.getList()
    }
  },
  methods: {
    async getPatientList() {
      const list = await patientList()
      this.patients = list.map(item =>
        Object.assign(item, {
          value: item.memberId,
          checked: item.def,
        }),
      )
      this.query.memberId =
        list.find(item => item.def)?.memberId ?? list?.[0].memberId
      this.refresh()
    },
    refresh() {
      this.query.currentNum = 1
      if (this.dataList.length > 10) {
        this.query.pageSize = this.dataList.length
      } else {
        this.query.pageSize = 10
      }
      this.getList()
    },
    async getList() {
      const params = {
        ...this.query,
        userId,
        origin: 1,
      }
      this.dataList = [
        ...(this.query.currentNum > 1 ? this.dataList : []),
        ...(await getUserList(params)).list.map(item =>
          Object.assign(item, {
            checked: false,
          }),
        ),
      ]

      this.query.pageSize = 10
    },
    isToday(visitDate) {
      return this.FORMATDATE(new Date(), 'yyyy-MM-dd') == visitDate
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages-user/myAppointment/detail?id=${id}`,
      })
    },
    topbarChange(state) {
      this.dataList = []
      Object.assign(this.query, {
        state: state || this.query.state,
      })
      this.refresh()
    },
    patientChange(memberIds) {
      if (memberIds[0] == 'all') {
        memberIds.shift()
      }
      Object.assign(this.query, {
        memberId: memberIds.join(','),
        currentNum: 1,
      })
    },
    patientSubmit() {
      this.$refs.popselect.close()
      this.refresh()
    },
    checkboxChange(index) {
      this.dataList[index].checked = !this.dataList[index].checked
      this.checkAll =
        this.dataList.filter(({ checked }) => !checked).length === 0
    },
    checkedAll(e) {
      this.dataList = this.dataList.map(item =>
        Object.assign(item, {
          checked: typeof e.detail.value[0] == 'string' ? true : false,
        }),
      )
    },
    openPay() {
      const checked = this.dataList.filter(({ checked }) => checked).length

      if (!checked) return
      this.$refs.pay.show()
    },
    async orderPay() {
      const params = {
        userId: uni.getStorageSync('userId'),
        bizId: this.dataList
          .filter(({ checked }) => checked)
          .map(({ id }) => id)
          .join(','),
        bizType: 'RESERVE',
        agreement: true,
      }
      if (!this.isClick) {
        return uni.showToast({ title: '请勿重复点击', icon: 'none' })
      }
      this.isClick = false
      const data = await submitAppointment(params)
      this.isClick = true
      this.$refs.pay.payTypeC(data.tradeId, data.tradeType)
    },
    del(id) {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            await delAppointment({ id })
            this.refresh()
          }
        },
      })
    },
    cancel(val) {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            const valid = await verifyBack({ orderId: val.orderId })

            if (!valid) {
              uni.showToast({
                icon: 'none',
                title: '该订单当前不能退费',
              })
              return
            }
            await refund({ orderId: val.orderId })
            this.refresh()
            uni.showToast({
              icon: 'none',
              title: '申请取消成功',
            })
          }
        },
      })
    },
  },
}
</script>

<style>
page {
  height: auto;
}
</style>
<style lang="scss" scoped>
.top-title {
  margin-left: 40rpx;
  padding: 20rpx 20rpx 20rpx 0;
  border-bottom: 1rpx solid #e6e6e6;
}

.page-list {
  margin-top: 186rpx;
  padding: 0 20rpx 100rpx;
}

.app-card {
  position: relative;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.tag {
  position: absolute;
  right: -16px;
  top: 4px;
  width: 110rpx;
  height: 34rpx;
  line-height: 32rpx;
  text-align: center;
  transform: rotate(45deg);
  font-size: 20rpx;
  color: #fff;

  &.red {
    background-color: #f74a4a;
  }
  &.primary {
    background-color: $uni-color-primary;
  }
}

.date {
  margin-right: 12rpx;
  font-size: 24rpx;
  color: #9a9a9a;
}

.content {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;
}

.avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
}

.doctor-name {
  font-size: 32rpx;
  color: #333;
}

.date {
  font-size: 24rpx;
  color: #999;
}

.position {
  font-size: 24rpx;
  color: #666;
}

.cost {
  font-size: 30rpx;
  color: #e45c5c;
}

.total-cost {
  margin-right: 12rpx;
  font-size: 32rpx;
  color: #e45c5c;
}

.button {
  width: 152rpx;
  line-height: 60rpx;
  margin: 0 0 0 12rpx;
  background-color: #fff;
  border: 1rpx solid #999;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #333;

  &::after {
    border: none;
  }
}

.button-primary {
  border-width: 0;
  background-color: $uni-color-primary;
  color: #fff;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
}

.checkbox {
  position: relative;
  top: -4rpx;
  transform: scale(0.7);
}
</style>
