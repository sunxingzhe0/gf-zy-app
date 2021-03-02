<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />

    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view
          class="flex-between top-title"
          @click="() => this.$refs.popselect.open()"
        >
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
        <view class="flex-between">
          <view>
            <checkbox-group
              @change="checkboxChange(index)"
              @click.stop="() => null"
            >
              <label>
                <checkbox
                  v-if="item.payStatus == 'NONPAID'"
                  class="checkbox"
                  :checked="item.checked"
                  color="#0ab2c1"
                />
                {{
                  item.type == 'EXAMINE'
                    ? '检查'
                    : item.type == 'LAB'
                    ? '检验'
                    : '治疗'
                }}单
              </label>
            </checkbox-group>
          </view>
          <view class="date">
            {{
              item.status == 'EXECUTED'
                ? `执行时间：${item.executedTime || ''}`
                : item.payStatus == 'RETURNPAID'
                ? `退费时间：${item.refundTime || ''}`
                : `预约执行时间：${item.start.split(' ')[0] || ''}`
            }}
            <text v-if="item.anxious" class="tag">急</text>
          </view>
        </view>
        <view class="content">
          <view>
            <text class="doctor-name">{{ item.name }}-</text>
            <text class="doctor-name">
              {{ item | part }}
            </text>
          </view>
          <view class="flex-between">
            <view class="position">执行科室：{{ item | dept }}</view>
            <view
              class="cost"
              :style="{ color: item.payStatus == 'NONPAID' ? '#e45b5b' : '' }"
            >
              {{ item.payStatus == 'NONPAID' ? '' : '费用：' }}
              <text>￥{{ item.price }}</text>
            </view>
          </view>
        </view>
        <view class="flex-end-start" style="margin-top: 20rpx;">
          <button
            v-if="query.userType == 2"
            type="mini"
            class="button button-primary"
            @click.stop="refund(item.id)"
          >
            退款
          </button>
          <button
            v-if="query.userType == 4"
            type="mini"
            class="btn button"
            @click.stop="del(item.id)"
          >
            删除
          </button>
        </view>
      </view>
    </view>
    <view class="bottom-bar flex-between" v-if="query.userType == 1">
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
        <button class="button button-primary plain" @click="pay">支付</button>
      </view>
    </view>

    <pop-select
      ref="popselect"
      title="就诊人"
      :multi="true"
      :list="patients"
      @change="patientChange"
      @submit="$refs.popselect.close()"
    ></pop-select>

    <!-- 支付列表 -->
    <popup-pay
      ref="pay"
      :type="true"
      @success="getList"
      @payTap="orderPay"
    ></popup-pay>
  </view>
</template>

<script>
import PopSelect from '@/components/pop-select'
import { submitAppointment } from '@/common/request/userAppointment'
import { patientList } from '@/common/request/userCenter'
import {
  adviceList,
  doctorUpdateStatus,
  userRefund,
  userDelete,
} from '@/common/request/advice'
export default {
  components: {
    PopSelect,
  },
  data() {
    return {
      tabs: [
        {
          title: '未缴费',
          key: 1,
        },
        {
          title: '未执行',
          key: 2,
        },
        {
          title: '已执行',
          key: 3,
        },
        {
          title: '已退费',
          key: 4,
        },
      ],
      patients: [],
      dataList: [],
      query: {
        pageSize: 10,
        currentNum: 1,
        userType: 1,
        memberId: '',
      },
      checkAll: false,
    }
  },
  filters: {
    part(value) {
      return value?.dictDisList?.[0]?.specimenPartName || ''
    },
    dept(value) {
      return value?.dictDisList?.[0]?.execDeptName || ''
    },
  },
  computed: {
    selectedPatient() {
      return this.patients
        .filter(({ memberId }) => this.query.memberId.includes(memberId))
        .map(item => item.name)
        .join(',')
    },
    totalCost() {
      return this.dataList
        .filter(({ checked }) => checked)
        .map(({ price }) => Number(price))
        .reduce((_, p) => {
          return _ + p
        }, 0)
    },
  },
  onShow() {
    if (!this.patients.length) {
      this.getPatientList()
    } else {
      this.getList()
    }
  },
  onPullDownRefresh() {
    this.query.currentNum = 1
    this.getList()
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
      this.query.memberId = [list[0].memberId]
      this.getList()
    },
    getList() {
      adviceList({
        ...this.query,
        memberId: this.query.memberId.join(','),
      }).then(data => {
        this.dataList = data.list.map(item =>
          Object.assign(item, { checked: false }),
        )
      })
    },
    topbarChange(state) {
      this.query.userType = state
      this.getList()
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages-user/doctorAdvice/detail?id=${id}`,
      })
    },
    checkboxChange(index) {
      this.dataList[index].checked = !this.dataList[index].checked
      this.checkAll =
        this.dataList.filter(({ checked }) => !checked).length === 0
    },
    checkedAll(e) {
      this.checkAll = typeof e.detail.value[0] == 'string' ? true : false
      this.dataList = this.dataList.map(item =>
        Object.assign(item, { checked: this.checkAll }),
      )
    },
    patientChange(memberIds) {
      if (memberIds[0] == 'all') {
        memberIds.shift()
      }
      this.query.memberId = memberIds

      if (!this.query.memberId.length) {
        this.dataList = []
        return
      }

      this.query.currentNum = 1
      this.getList()
    },
    del(id) {
      uni.showModal({
        title: '是否确认操作？',
        success: ({ confirm }) => {
          if (confirm) {
            userDelete({ id }).then(() => this.getList())
          }
        },
      })
    },
    refund(id) {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            await userRefund({ id })
            this.getList()
            uni.showToast({
              icon: 'none',
              title: '申请退款成功',
            })
          }
        },
      })
    },
    pay() {
      if (!this.dataList.filter(({ checked }) => checked).length) {
        uni.showToast({
          icon: 'none',
          title: '请先勾选要支付的订单',
        })
        return
      }
      this.$refs.pay.show()
    },
    async orderPay() {
      const params = {
        userId: uni.getStorageSync('userId'),
        bizId: this.dataList
          .filter(({ checked }) => checked)
          .map(({ id }) => id)
          .join(','),
        bizType: 'DISPOSAL',
        agreement: true,
      }
      const order = await submitAppointment(params)
      if (!order) return
      if (order.isPay) {
        this.getData()
        this.$refs.pay.close()
      } else {
        this.$refs.pay.payTypeC(order.tradeId, order.tradeType)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.top-title {
  margin-left: 40rpx;
  padding: 20rpx 20rpx 20rpx 0;
  border-bottom: 1rpx solid #e6e6e6;
}

.page-list {
  padding: 200rpx 20rpx 100rpx;
}

.app-card {
  margin-bottom: 20rpx;
}

.date {
  margin-right: 12rpx;
  font-size: 24rpx;
  color: #9a9a9a;
}

.tag {
  margin-left: 12rpx;
  padding: 4rpx 10rpx 6rpx;
  background: rgba(228, 91, 91, 0.2);
  border-radius: 50%;
  font-size: 24rpx;
  color: #e45b5b;
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
  color: #666;
}

.total-cost {
  margin-right: 12rpx;
  font-size: 32rpx;
  color: $uni-color-primary;
}

.btn {
  border: 2rpx solid #999;
  background-color: #fff;
}
.button {
  width: 152rpx;
  line-height: 60rpx;
  margin: 0 0 0 12rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #333;

  &::after {
    border: none;
  }
}

.button-primary {
  border-width: 0;
  background-color: #fff;
  border: 2rpx solid $uni-color-primary;
  color: $uni-color-primary;

  &.plain {
    background-color: $uni-color-primary;
    color: #fff;
  }
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
  transform: scale(0.6);
}
</style>
