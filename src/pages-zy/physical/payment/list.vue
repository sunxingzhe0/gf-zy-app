<template>
  <view
    :style="{
      paddingTop: '170rpx',
      paddingBottom: current == 0 ? '120rpx' : '20rpx',
    }"
  >
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="就诊人"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0 }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <view style="padding: 20rpx;">
      <!--待支付-->
      <template v-if="current == 0">
        <checkbox-group @change="checkboxChange">
          <view
            class="toPayBox box-shadow"
            v-for="(item, index) in waitPayList"
            :key="index"
          >
            <view class="listBt">
              <checkbox
                class="checkbox"
                style="transform: scale(0.7);"
                color="#0ab2c1"
                :value="item.checkupNo"
                :checked="item.checked"
              />单据号:{{ item.bookingNo }}</view
            >
            <view class="contentBox">
              <view class="contentTitle">
                <view
                  class="payTitle"
                  @click="
                    goto(
                      `/pages-zy/physical/payment/detail?patientId=${perId}&type=0&billNo=${item.checkupNo}&title=${item.title}`,
                    )
                  "
                  >{{ item.packageName }}<text>详情</text></view
                >
              </view>
              <view class="flex-between">
                <view>
                  <view class="createTime">体检时间：{{ item.regDate }}</view>
                </view>
                <view class="price"
                  >￥{{ parseFloat(item.payFee).toFixed(2) }}</view
                >
              </view>
            </view>
          </view>
        </checkbox-group>
        <!-- 合计 -->
        <view
          class="fiexdBtn flex-between font30"
          v-if="waitPayList.length > 0 && current == 0"
        >
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
            <text>合计：</text>
            <text class="colorred font-weight">￥{{ alltotal }}</text>
          </view>
          <view v-if="checkedList.length > 0" class="payBtn" @click="payTap">
            支付
          </view>
          <view v-else class="payBtn disabled">
            支付
          </view>
        </view>
      </template>
      <!--已完成、已退费-->
      <template v-if="current == 1 || current == 2">
        <view
          class="finishList box-shadow toPayBox"
          v-for="(item, index) in waitPayList"
          :key="index"
        >
          <view class="listBt">单据号:{{ item.checkupNo }}</view>
          <view class="contentBox mt-20">
            <view class="contentTitle">
              <view
                class="payTitle"
                @click="
                  goto(
                    `/pages-zy/physical/payment/detail?patientId=${perId}&type=${current}&billNo=${item.checkupNo}&title=${item.title}`,
                  )
                "
                >{{ item.packageName }}<text>详情</text></view
              >
            </view>
            <view class="flex-between">
              <view>
                <view class="createTime">体检时间：{{ item.regDate }}</view>
                <view class="createTime"
                  >{{ current == 1 ? '缴费' : '退费' }}时间：{{
                    item.payTime
                  }}</view
                >
              </view>
              <view class="price"
                >￥{{ parseFloat(item.payFee).toFixed(2) }}</view
              >
            </view>
          </view>
        </view>
      </template>
    </view>
    <noData v-if="waitPayList.length == 0"></noData>
    <!-- 支付列表 -->
    <pop-pay
      ref="pay"
      :type="true"
      @success="paySucces"
      @payTap="paySubmit"
    ></pop-pay>
  </view>
</template>

<script>
import AppListItem from '@/components/app/app-list-item'
import selectPatient from '../../components/selectPatient.vue'
import popPay from '../../components/pop-pay/index.vue'
import noData from '../../components/NoData.vue'
import {
  getTjPayRecordList,
  tjPayFee,
  countTjRecord,
} from '../../api/physical.js'
export default {
  components: {
    selectPatient,
    AppListItem,
    popPay,
    noData,
  },
  data() {
    return {
      isClick: true,
      tabs: [
        {
          title: '未交费',
          key: 0,
          num: 0,
        },
        {
          title: '已缴费',
          key: 1,
          num: 0,
        },
        {
          title: '已退费',
          key: 2,
          num: 0,
        },
      ],
      current: 0,
      waitPayList: [],
      isAll: false,
      perId: '',
    }
  },
  computed: {
    alltotal() {
      let allnum = 0
      this.waitPayList.forEach(item => {
        if (item.checked) {
          allnum = (parseFloat(allnum) + parseFloat(item.payFee)).toFixed(2)
        }
      })
      return allnum
    },
    checkedList() {
      return this.waitPayList
        .filter(({ checked }) => checked)
        .map(({ checkupNo }) => checkupNo)
    },
  },
  onShow() {
    if (this.perId) {
      this.topbarChange(this.current)
    }
  },
  methods: {
    async getmzRpWaitPayData() {
      this.waitPayList = await getTjPayRecordList({
        patientId: this.perId,
        type: this.current,
      })
    },
    //获取记录统计
    async getcountTjRecord() {
      let res = await countTjRecord({ patientId: this.perId, type: 1 })
      this.tabs[0].num = res.noPay
      this.tabs[1].num = res.payd
      this.tabs[2].num = res.refund
    },
    payTap() {
      this.$refs.pay.show()
      if (this.alltotal > 0) {
        this.$refs.pay.show()
      }
    },
    paySubmit(e) {
      //确认支付
      let that = this
      if (!this.isClick) {
        return uni.showToast({ title: '请勿重复点击', icon: 'none' })
      }
      this.isClick = false
      tjPayFee({
        payment: e,
        payInfo: this.waitPayList.map(item => {
          if (item.checked) {
            return item.checkupNo
          }
        }),
        patientId: this.perId,
        payCard: '',
      }).then(data => {
        this.isClick = true

        this.$refs.pay.payTypeC(data)
      })
    },
    paySucces() {
      this.topbarChange(this.current)
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      })
    },
    //全选
    allCheckboxChange(e) {
      console.log(e)
      if (e.detail.value.length == 0) {
        this.waitPayList.map(item => this.$set(item, 'checked', false))
        this.isAll = false
      } else {
        this.waitPayList.map(item => this.$set(item, 'checked', true))
        this.isAll = true
      }
    },
    checkboxChange(e) {
      let items = this.waitPayList,
        values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        const item = items[i]
        if (values.includes(item.checkupNo)) {
          this.$set(item, 'checked', true)
        } else {
          this.$set(item, 'checked', false)
        }
      }
      console.log(this.waitPayList)
      //  商品是否全部勾选，判断全选与否状态
      let offCarArr = []
      let allChecks = items.every(item => item.checked == true)
      console.log(allChecks)
      if (allChecks) {
        this.isAll = true
      } else {
        this.isAll = false
      }
    },
    topbarChange(state) {
      this.current = state
      this.isAll = false
      this.getmzRpWaitPayData()
      this.getcountTjRecord()
    },
    changePatient(item) {
      this.perId = item.memberId
      this.topbarChange(this.current)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/common/order.scss';

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
      width: 417rpx;
      font-size: 28rpx;
      color: #646464;
    }
  }

  .price {
    font-size: 28rpx;
    color: #666;
    text-align: right;
  }
}

.total {
  background: #fff;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 20rpx;

  .quanxuan {
    width: 200rpx;
    height: 44rpx !important;
    margin: 0 !important;

    .van-checkbox__label {
      font-size: 32rpx !important;
      color: #333333 !important;
      font-weight: 400 !important;
    }
  }
}

.fiexdBtn {
  height: 98rpx;
  width: 100%;
  background: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;

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
