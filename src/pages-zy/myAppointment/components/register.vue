<template>
  <view :style="{ paddingBottom: active == 1 ? '80rpx' : '' }">
    <view class="flex-between tabWrap">
      <view
        :class="active == item.key ? 'tabItem on' : 'tabItem'"
        v-for="(item, index) in tabs"
        :key="index"
        @click="topbarChange(item.key)"
        >{{ item.title }}</view
      >
    </view>
    <view class="page-list">
      <checkbox-group @change="checkboxChange" @click.stop="() => null">
        <view
          class="app-card"
          v-for="(item, index) in dataList"
          :key="item.id"
          @click="goDetail(item.id, item.state, item.deptId)"
        >
          <view class="tag red" v-if="item.cancel && item.state == 2"
            >已逾期</view
          >
          <view class="tag primary" v-else-if="isToday(item)">
            今天
          </view>
          <view>
            <view :style="{ width: active == 1 ? '200rpx' : '152rpx' }">
              <label @click.stop="() => null">
                <checkbox
                  :value="item.id"
                  :checked="item.checked"
                  :disabled="compare(item)"
                  v-if="active == 1"
                  class="checkbox"
                  color="#0ab2c1"
                />门诊预约
              </label>
            </view>
            <!-- <view class="date">
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
            </view> -->
          </view>
          <view class="content">
            <view class="flex-start-start">
              <view class="avatar">
                <default-img :url="FILE_URL(item.img)"></default-img>
              </view>
              <view style="margin-left: 20rpx;">
                <view class="doctor-name">{{ item.doctorName || '-' }}</view>
                <view class="position"
                  >{{ item.title || '-' }}|{{ item.deptName || '-' }}</view
                >
                <view class="flex-between">
                  <view class="position">
                    {{
                      item.state == 3
                        ? `${item.getNoTime || ''}`
                        : item.state == 5
                        ? `${item.backTime || ''}`
                        : item.state == 1 || item.state == 2
                        ? `${item.state == 2 ? '' : ''}
                ${item.visitDate || ''} ${item.startTime}~${item.endTime}`
                        : ''
                    }}
                  </view>
                </view>
                <view class="position">诊查费：￥{{ item.fee }}</view>
              </view>
            </view>
          </view>
          <view class="flex-end-start">
            <!-- <button
              v-if="item.deptId === '8323' && active == 2"
              class="button primary"
              @click.stop="acidSignIn(item)"
              type="mini"
            >
              签到
            </button> -->
            <button
              v-if="active == 1"
              type="mini"
              class="button"
              @click.stop="closeOrder(item)"
            >
              关闭
            </button>
            <button
              v-if="active == 1"
              type="mini"
              class="button"
              :class="compare(item) && 'is-disabled'"
              @click.stop="pay(index)"
            >
              支付
            </button>
            <button
              v-if="active == 5"
              type="mini"
              class="button"
              @click.stop="del(item.id)"
            >
              删除
            </button>
            <button
              v-else-if="
                active == 2 &&
                  !isToday(item) &&
                  !item.cancel &&
                  item.deptId != 8323
              "
              type="mini"
              class="button"
              :class="compare(item) && 'is-disabled'"
              @click.stop="cancel(item)"
            >
              取消
            </button>
          </view>
        </view>
      </checkbox-group>
      <noData v-if="dataList.length == 0"></noData>
    </view>
    <view class="fiexdBtn flex-between" v-if="active == 1">
      <view>
        <checkbox-group @change="allCheckboxChange">
          <label>
            <checkbox class="checkbox" color="#0ab2c1" :checked="isAll" />全选
          </label>
        </checkbox-group>
      </view>
      <view class="heji font30" v-if="alltotal > 0">
        <text class="price">￥{{ alltotal }}</text>
      </view>
      <view v-if="checkedList.length > 0" class="payBtn" @click="openPay(1)">
        支付
      </view>
      <view v-else class="payBtn disabled">
        支付
      </view>
    </view>
    <!-- 支付列表 -->
    <popup-pay
      ref="pay"
      :type="true"
      @success="init"
      @payTap="orderPay"
    ></popup-pay>
  </view>
</template>

<script>
import noData from '../../components/NoData.vue'
import { patientList } from '@/common/request/userCenter'
import {
  getUserList,
  submitAppointment,
  delAppointment,
  verifyBack,
  acidSignIn,
  closeOrder,
} from '@/common/request/userAppointment'
import { appointmentRefund } from '@/common/request/order'

const userId = uni.getStorageSync('userId')
export default {
  components: {
    noData,
  },
  props: {
    type: Number,
    patientInfo: Object,
  },
  data() {
    return {
      isClick: true,
      payType: 0,
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
      ],
      active: 1,
      currentNum: 1,
      pageSize: 50,
      pages: 1,
      isAll: false,
      dataList: [],
    }
  },
  watch: {
    type() {
      this.active = this.type
    },
    regitrNum() {
      this.init()
    },
  },

  created() {
    if (this.type) {
      this.active = this.type
    }
  },
  computed: {
    regitrNum() {
      return this.$store.state.registerNum
    },
    alltotal() {
      let allnum = 0
      this.dataList.forEach(item => {
        if (item.checked) {
          allnum = (parseFloat(allnum) + parseFloat(item.fee)).toFixed(2)
        }
      })
      return allnum
    },
    checkedList() {
      return this.dataList.filter(({ checked }) => checked).map(({ id }) => id)
    },
  },
  methods: {
    closeOrder({ id }) {
      uni.showModal({
        title: '提示',
        content: '是否确认关闭该订单？',
        confirmColor: '#0AB2C1',
        success: async ({ confirm }) => {
          if (confirm) {
            await closeOrder({ id })
            uni.showToast({
              title: '操作成功！',
              icon: 'none',
            })
            setTimeout(() => {
              this.getList()
            }, 800)
          }
        },
      })
    },
    compare(item) {
      console.log(String.replaceAll)
      console.log(item, 'item=')

      return (
        new Date(`${item.visitDate.replace(/-/g, '/')} ${item.endTime}`) <
        new Date()
      )

      // return item.cancel
    },
    //初始化数据
    init() {
      this.dataList = []
      this.currentNum = 1
      this.pages = 1
      this.isAll = false
      this.getList()
    },
    async getList() {
      const params = {
        memberId: this.patientInfo.memberId,
        userId: uni.getStorageSync('userId'),
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        state: this.active,
      }
      uni.showLoading()
      try {
        this.dataList = (await getUserList(params)).list
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
      }
    },
    isToday(item) {
      // 核酸检测科室
      if (Number(item.deptId) === 8323) {
        return false
      } else {
        return this.FORMATDATE(new Date(), 'yyyy-MM-dd') == item.visitDate
      }
    },
    // state,deptId 用于核酸签到
    goDetail(id, state, deptId) {
      uni.navigateTo({
        url: `/pages-user/myAppointment/detail?id=${id}&deptId=${deptId}&state=${state}&patientCard=${this.patientInfo.patientCard}`,
      })
    },
    topbarChange(state) {
      this.active = state
      this.init()
    },

    //全选
    allCheckboxChange(e) {
      if (e.detail.value.length == 0) {
        this.dataList.forEach(item => this.$set(item, 'checked', false))
        this.isAll = false
      } else {
        //先筛选出预约时间大于当前时间的
        this.dataList
          .filter(val => !this.compare(val))
          .forEach(item => this.$set(item, 'checked', true))
        this.isAll = true
      }
    },

    checkboxChange(e) {
      const items = this.dataList,
        values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        this.$set(this.dataList[i], 'checked', values.includes(items[i].id))
      }
      //  商品是否全部勾选，判断全选与否状态
      this.isAll = items.every(item => item.checked == true)
    },
    getPageMore() {
      if (this.currentNum < this.pages) {
        this.currentNum += 1
        this.getList()
      }
    },
    pay(index) {
      console.log(this.dataList[index], '==============')
      if (this.compare(this.dataList[index])) {
        uni.showToast({
          title: '已超过支付时间，当前订单不可支付',
          icon: 'none',
        })
        return
      }
      this.dataList[index].checked = true
      this.payOrderItem = this.dataList[index] //支付订单
      this.openPay(0)
    },
    openPay(type) {
      this.payType = type //全选或单选 1全选 0单选
      console.log('支付------------')
      const checked = this.dataList.filter(({ checked }) => checked).length
      if (!checked) return
      this.$refs.pay.show()
    },
    async orderPay() {
      //全选支付
      if (this.payType) {
        //只有一个选项
        const slectList = this.dataList.filter(({ checked }) => checked)
        if (slectList.length == 1) {
          this.$refs.pay.payTypeC(slectList[0].orderId, 'ORDER')
          return
        }
        //多个选项
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
        if (data) {
          if (data.tradeId && data.tradeType) {
            this.$refs.pay.payTypeC(data.tradeId, data.tradeType)
          } else {
            if (data.orderId) {
              this.$refs.pay.close()
              uni.showToast({
                title: '支付成功！',
              })
              this.init()
            }
          }
        }
      } else {
        //单选支付
        const data = this.payOrderItem
        if (data) {
          if (data.orderId) {
            this.$refs.pay.payTypeC(data.orderId, 'ORDER')
          }
        }
      }
    },
    del(id) {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            await delAppointment({
              id,
            })
            this.init()
          }
        },
      })
    },
    isVerifyBack(orderId) {
      verifyBack({ orderId })
    },
    cancel(item) {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            let res = await verifyBack({ orderId: item.id })
            if (res) {
              uni.showLoading()
              await appointmentRefund({
                id: item.id,
                documentNo: item.documentNo,
              })
              uni.hideLoading()
              uni.showToast({
                icon: 'none',
                title: '申请取消成功',
                duration: 2000,
              })
              setTimeout(() => {
                this.init() //延时刷新列表 toast被顶掉
              }, 1500)
            } else {
              uni.showToast({
                icon: 'none',
                title: '当日及之前的订单无法退费',
              })
            }
          }
        },
      })
    },
    // 核酸检测签到
    async acidSignIn(item) {
      uni.showModal({
        content: '确认签到后将无法退款，请确认是否签到？',
        success: async res => {
          if (res.confirm) {
            await acidSignIn({ id: item.id })
            this.init()
            this.$tip('签到成功！')
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
.is-disabled {
  border: 1px solid #ccc;
  color: #ccc;
}
.tabWrap {
  padding: 20rpx 30rpx;

  .tabItem {
    font-size: 26rpx;
    color: #666;
    height: 60rpx;
    box-sizing: border-box;

    &.on {
      border-bottom: 2px solid $uni-color-primary;
      color: $uni-color-primary;
    }
  }
}

.top-title {
  margin-left: 40rpx;
  padding: 20rpx 20rpx 20rpx 0;
  border-bottom: 1rpx solid #e6e6e6;
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
  overflow: hidden;
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
  &.primary {
    background-color: $uni-color-primary;
    border-color: $uni-color-primary;
    color: #fff;
  }
}
.is-disabled {
  border: 1px solid #ccc;
  color: #ccc;
}

.button-primary {
  border-width: 0;
  background-color: $uni-color-primary;
  color: #fff;
}

.price {
  font-size: 28rpx;
  color: $uni-color-primary;
  text-align: right;
}

.fiexdBtn {
  height: 98rpx;
  width: 550rpx;
  background: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  right: 20;
  box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 20rpx 20rpx 0px 0px;

  .payBtn {
    height: 60rpx;
    width: 160rpx;
    background: $uni-color-primary;
    line-height: 60rpx;
    text-align: center;
    border-radius: 30rpx;
    color: #fff;
    font-size: 32rpx;

    &.disabled {
      opacity: 0.5;
    }
  }
}

.checkbox {
  position: relative;
  top: -4rpx;
  transform: scale(0.7);
}
</style>
