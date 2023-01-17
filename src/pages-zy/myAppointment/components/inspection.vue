<template>
  <view>
    <view class="flex-between tabWrap">
      <view
        :class="current == item.key ? 'tabItem on' : 'tabItem'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="tabChange(item.key)"
        >{{ item.title }}</view
      >
    </view>
    <!--待支付-->
    <template v-if="current == 1">
      <view style="padding-bottom: 80rpx;">
        <checkbox-group @change="checkboxChange">
          <view
            class="toPayBox box-shadow"
            v-for="(item, index) in list"
            :key="index"
            @click="goto(`/pages-user/doctorAdvice/detail?id=${item.id}`)"
          >
            <view class="listBt flex-between">
              <view>
                <checkbox
                  class="checkbox"
                  style="transform: scale(0.7);"
                  color="#0ab2c1"
                  :value="item.id"
                  :checked="item.checked"
                  @click.stop="() => null"
                />{{
                  item.type == 'EXAMINE'
                    ? '检查单'
                    : item.type == 'LAB'
                    ? '检验单'
                    : item.type == 'CURE'
                    ? '治疗单'
                    : ''
                }}</view
              >
              <text v-if="item.anxious">急</text>
            </view>
            <view class="contentBox">
              <view class="contentTitle">
                <view class="payTitle">{{ item.name }}</view>
              </view>
              <view class="flex-between">
                <view>
                  <view class="createTime"
                    >执行科室：{{ item.dictDisList[0].execDeptName }}</view
                  >
                </view>
                <view class="price"
                  >￥{{ parseFloat(item.price).toFixed(2) }}</view
                >
              </view>
              <view class="createTime"
                >预约执行时间：{{
                  item.type == 'LAB' ? item.start.split(' ')[0] : item.start
                }}</view
              >
            </view>
          </view>
        </checkbox-group>
      </view>

      <!-- 合计 -->
      <view class="fiexdBtn flex-between font30" v-if="current == 1">
        <checkbox-group style="width: auto;" @change="allCheckboxChange">
          <label>
            <checkbox
              style="transform: scale(0.7);"
              class="checkbox"
              color="#0ab2c1"
              value="isAll"
              :checked="isAll"
            />全选
          </label>
        </checkbox-group>
        <view class="heji font30" v-if="alltotal > 0">
          <text class="price">￥{{ alltotal }}</text>
        </view>
        <view
          v-if="checkedList.length > 0"
          class="payBtn"
          @click="$refs.pay.show()"
        >
          支付
        </view>
        <view v-else class="payBtn disabled">
          支付
        </view>
      </view>
    </template>
    <!--已完成、已退费-->
    <template v-if="current > 1">
      <view
        class="finishList box-shadow toPayBox"
        v-for="(item, index) in list"
        :key="index"
        @click="goto(`/pages-user/doctorAdvice/detail?id=${item.id}`)"
      >
        <view class="listBt flex-between">
          <view>{{
            item.type == 'EXAMINE'
              ? '检查'
              : item.type == 'LAB'
              ? '检验'
              : item.type == 'CURE'
              ? '治疗'
              : ''
          }}</view>
          <text v-if="item.anxious">急</text>
        </view>
        <view class="contentBox mt-20">
          <view class="contentTitle">
            <view class="payTitle">{{ item.name }}</view>
          </view>
          <view class="flex-between">
            <view>
              <view class="createTime"
                >执行科室：{{ item.dictDisList[0].execDeptName }}</view
              >
            </view>
            <view class="price">￥{{ parseFloat(item.price).toFixed(2) }}</view>
          </view>
          <view class="createTime" v-if="current == 2"
            >预约执行时间：{{
              item.type == 'LAB' ? item.start.split(' ')[0] : item.start
            }}</view
          >
          <view class="createTime" v-if="current == 3"
            >执行时间：{{ item.executedTime }}</view
          >
          <view class="createTime" v-if="current == 4"
            >退费时间：{{ item.refundTime }}</view
          >
          <view class="flex-end-start">
            <view
              class="cancelBtn"
              v-if="current == 2"
              @click.stop="refund(item.id)"
              >退款</view
            >
            <view
              class="cancelBtn"
              v-if="current == 4"
              @click.stop="del(item.id)"
              >删除</view
            >
          </view>
        </view>
      </view>
    </template>

    <NoData v-if="list.length == 0"></NoData>
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
import NoData from '../../components/NoData'
import {
  adviceList,
  doctorUpdateStatus,
  userRefund,
  userDelete,
} from '@/common/request/advice'
import { submitAppointment } from '@/common/request/userAppointment'
export default {
  props: {
    type: String,
    patientInfo: Object,
  },
  components: {
    NoData,
  },
  data() {
    return {
      isClick: true,
      current: 1,
      tabList: [
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
      // 门诊数据列表
      list: [],
      currentNum: 1,
      pageSize: 10,
      pages: 1,
      isAll: false,
    }
  },
  computed: {
    alltotal() {
      let allnum = 0
      this.list.forEach(item => {
        if (item.checked) {
          allnum = (parseFloat(allnum) + parseFloat(item.price)).toFixed(2)
        }
      })
      return allnum
    },
    checkedList() {
      return this.list.filter(({ checked }) => checked).map(({ id }) => id)
    },
  },
  methods: {
    //初始化数据
    init() {
      this.list = []
      this.currentNum = 1
      this.pages = 1
      this.isAll = false
      this.getList()
    },
    tabChange(e) {
      this.current = e
      this.init()
    },
    async getList() {
      const list = await adviceList({
        memberId: this.patientInfo.memberId,
        userType: this.current,
        type: this.type,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      this.pages = list.pages
      this.list = this.list.concat(list.list || [])
    },
    //支付
    async orderPay() {
      const params = {
        userId: uni.getStorageSync('userId'),
        bizId: this.list
          .filter(({ checked }) => checked)
          .map(({ id }) => id)
          .join(','),
        bizType: 'DISPOSAL',
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
    },
    goto(url) {
      uni.navigateTo({
        url,
      })
    },
    //全选
    allCheckboxChange(e) {
      if (e.detail.value.length == 0) {
        this.list.forEach(item => this.$set(item, 'checked', false))
        this.isAll = false
      } else {
        this.list.forEach(item => this.$set(item, 'checked', true))
        this.isAll = true
      }
    },

    checkboxChange(e) {
      const items = this.list,
        values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        this.$set(this.list[i], 'checked', values.includes(items[i].id))
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
    //删除
    del(id) {
      uni.showModal({
        title: '是否确认操作？',
        success: ({ confirm }) => {
          if (confirm) {
            userDelete({ id }).then(() => this.init())
          }
        },
      })
    },
    //退款
    refund(id) {
      uni.showModal({
        title: '是否确认操作？',
        success: async ({ confirm }) => {
          if (confirm) {
            await userRefund({ id })
            this.init()
            uni.showToast({
              icon: 'none',
              title: '申请退款成功',
            })
          }
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
.price {
  font-size: 28rpx;
  color: $uni-color-primary;
  text-align: right;
}

.toPayBox {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx 0;

  .listBt {
    border-bottom: 1px solid #e6e6e6;
    padding: 30rpx;
    padding-top: 0;
    padding-bottom: 20rpx;
    font-size: 28rpx;
    color: #666;

    view {
      font-size: 28rpx;
    }

    text {
      width: 38rpx;
      height: 38rpx;
      background: rgba(247, 74, 74, 0.1);
      border-radius: 50%;
      font-size: 22rpx;
      color: #f74a4a;
      text-align: center;
      line-height: 38rpx;
    }
  }

  .contentBox {
    padding: 0 30rpx;

    .contentTitle {
      position: relative;

      .payTitle {
        font-size: 30rpx;
        color: #333333;
        font-weight: 400;
        margin-top: 10rpx;

        text {
          color: $uni-color-primary;
        }
      }
    }

    .createTime {
      font-size: 24rpx;
      color: #646464;
    }
  }

  .cancelBtn {
    width: 152rpx;
    height: 60rpx;
    border: 1px solid #999999;
    border-radius: 30rpx;
    text-align: center;
    line-height: 58rpx;
    font-size: 26rpx;
    color: #333;
    margin-top: 20rpx;
    float: right;

    &.default {
      border-color: $uni-color-primary;
      color: $uni-color-primary;
    }

    &.disabled {
      border-color: #ccc;
      color: #999;
    }
  }
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
</style>
