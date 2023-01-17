<template>
  <view
    :style="{
      paddingTop: cardId ? '' : '170rpx',
      paddingBottom: current == 0 ? '120rpx' : '20rpx',
    }"
  >
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="top-tip" v-if="cardId">
      温馨提示：待支付的缴费单仅限当天有效。
    </view>
    <view class="name-top" v-if="cardId">
      <view>姓名</view>
      <view>{{ name || '-' }}</view>
    </view>
    <topbar v-else :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="健康卡"
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
            class="toPayBox box-shadow flex-start-center"
            v-for="(item, index) in waitPayList"
            :key="index"
          >
            <checkbox
              class="checkbox"
              style="transform: scale(0.8);"
              color="#0ab2c1"
              :value="item.prescNo"
              :checked="item.checked"
            />
            <view
              class="contentBox flex-between"
              @click="
                goto(
                  `/pages-zy/outpatientPayment/detail?patientId=${perId}&type=${current}&billNo=${item.payInfo.billNo}&visitNo=${item.visitNo}&title=${item.title}`,
                )
              "
            >
              <view class="content">
                <view class="contentTitle flex-start-center">
                  <view class="payTitle">{{ item.title }}</view>
                  <view class="category flex-start-center">
                    <view class="category-divactive">{{ item.deptName }}</view>
                    <!-- <view class="normal">普通</view> -->
                  </view>
                </view>
                <view v-if="item.outSno" class="createTime"
                  >门诊号：{{ item.outSno || '' }}</view
                >
                <view class="createTime">开单时间：{{ item.prescDtime }}</view>
              </view>
              <view class="text-right">
                <view class="font32 font-weight"
                  >￥{{ parseFloat(item.money).toFixed(2) }}</view
                >
                <view class="font28 color666 mt-10">x{{ item.itemNum }}</view>
              </view>
            </view>
          </view>
        </checkbox-group>
        <uni-load-more
          v-if="waitPayList.length > 0"
          status="nomore"
          :contentText="{
            contentdown: '上拉显示更多',
            contentrefresh: '正在加载数据中',
            contentnomore: '没有更多数据了',
          }"
        ></uni-load-more>
        <noData v-if="waitPayList.length == 0"></noData>
        <!-- 合计 -->
        <view
          class="fiexdBtn flex-between font30"
          v-if="waitPayList.length > 0 && current == 0"
        >
          <checkbox-group style="width: auto;" @change="allCheckboxChange">
            <label>
              <checkbox
                style="transform: scale(0.8);"
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
          v-for="(item, index) in current == 1 ? payList : refundList"
          :key="index"
          @click="
            goto(
              `/pages-zy/outpatientPayment/detail?patientId=${perId}&type=${current}&billNo=${item.prescNo}&visitNo=${item.visitNo}&title=${item.title}`,
            )
          "
        >
          <view class="listTitle">
            <view class="num">支付号：{{ item.payId || '-' }}</view>
            <view class="payMode">{{ item.payWay }}</view>
          </view>
          <view class="contentBox flex-between mt-20">
            <view class="content">
              <view class="contentTitle flex-start-center">
                <view class="payTitle">{{ item.title }}</view>
                <view class="category flex-start-center">
                  <view class="category-divactive">{{ item.deptName }}</view>
                  <!-- <view class="normal">普通</view> -->
                </view>
              </view>
              <view class="createTime">门诊号：{{ item.outSno || '' }}</view>
              <view class="createTime">开单时间：{{ item.visitDate }}</view>
              <view class="createTime"
                >{{ current == 3 ? '退费' : '缴费' }}时间：{{ item.time }}</view
              >
            </view>
            <view class="text-right">
              <view class="font32 font-weight"
                >￥{{ Math.abs(parseFloat(item.totalAmount).toFixed(2)) }}</view
              >
              <view class="font28 color666 mt-10">x{{ item.itemNum }}</view>
            </view>
          </view>
        </view>
        <uni-load-more
          v-if="
            (current == 1 && payList.length > 0) ||
              (current == 2 && refundList.length > 0)
          "
          status="nomore"
          :contentText="{
            contentdown: '上拉显示更多',
            contentrefresh: '正在加载数据中',
            contentnomore: '没有更多数据了',
          }"
        ></uni-load-more>
        <noData
          v-if="
            current == 1
              ? payList && payList.length == 0
              : refundList && refundList.length == 0
          "
        ></noData>
      </template>
    </view>
    <!-- 支付列表 -->
    <pop-pay
      ref="pay"
      :type="true"
      @success="successPay"
      @payTap="paySubmit"
    ></pop-pay>
  </view>
</template>

<script>
import AppListItem from '@/components/app/app-list-item'
import selectPatient from '../components/selectPatient.vue'
import popPay from '../components/pop-pay/index.vue'
import noData from '../components/NoData.vue'
import {
  mzRpWaitPayData,
  mzRpPaydData,
  mzRpRefundData,
  mzPayment,
} from '../api/outpatient.js'

export default {
  components: {
    selectPatient,
    AppListItem,
    popPay,
    noData,
  },
  data() {
    return {
      tabs: [
        {
          title: '待支付',
          key: 0,
          num: 0,
        },
        {
          title: '已完成',
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
      payList: null, //已完成
      refundList: null, // 已退费
      isAll: false,
      perId: '',
      isPay: true,
      cardId: '',
      name: '',
    }
  },
  computed: {
    alltotal() {
      let allnum = 0
      this.waitPayList.forEach(item => {
        if (item.checked) {
          allnum = (parseFloat(allnum) + parseFloat(item.money)).toFixed(2)
        }
      })
      return allnum
    },
    checkedList() {
      return this.waitPayList
        .filter(({ checked }) => checked)
        .map(({ payInfo }) => payInfo)
    },
  },
  onShow() {
    // if (this.perId) {
    //   this.topbarChange(this.current)
    // }
  },
  onLoad(options) {
    console.log('log--进入页面的参数，', options)
    options.name && (this.name = options.name)
    console.log(this.name, '姓名')
    options.cardId &&
      (this.cardId = options.cardId) &&
      this.getmzRpWaitPayData()
    // if (this.cardId) {
    //   this.getmzRpWaitPayData()
    // }
    if (options.cardId) {
      getApp().globalData.pageQuery = '' //清空进入app的参数
    }
    /* 门诊缴费默认全选 */
    this.$nextTick(() => {
      this.waitPayList.map(item => this.$set(item, 'checked', true))
      this.isAll = true
    })
  },
  methods: {
    successPay() {
      // await this.topbarChange(this.current)
      this.openTipNavigation()
    },
    billType(type) {
      if (type == 'GH') {
        return '预约挂号'
      } else if (type == 'MZ') {
        return '门诊缴费'
      } else if (type == 'ZY') {
        return '住院充值'
      } else if (type == 'TJ') {
        return '体检预约'
      }
    },
    //获取待支付
    async getmzRpWaitPayData() {
      const data = {
        cardId: this.cardId || '',
        patientId: '',
      }
      if (this.isCode) {
        data.cardId = this.$route.query.cardId || ''
      } else {
        data.patientId = this.cardId ? '' : this.perId
      }
      console.log('log--请求列表参数', data)
      this.waitPayList = await mzRpWaitPayData(data)
      this.waitPayList.map(item => this.$set(item, 'checked', true))
      this.tabs[0].num = this.waitPayList.length
    },
    // 已完成
    async getmzRpPaydData() {
      this.payList = await mzRpPaydData({
        cardId: this.cardId || '',
        patientId: this.cardId ? '' : this.perId,
      })
      this.tabs[1].num = this.payList.length
    },
    // 已退费
    async getmzRpRefundData() {
      this.refundList = await mzRpRefundData({
        cardId: this.cardId || '',
        patientId: this.cardId ? '' : this.perId,
      })
      this.tabs[2].num = this.refundList.length
    },
    payTap() {
      if (this.checkedList.length > 0) {
        this.$refs.pay.show()
      }
    },
    paySubmit(e) {
      //确认支付
      const data = {
        payment: e,
        items: this.waitPayList
          .filter(item => item.checked)
          .map(ite => ite.payInfo),
        payCard: '',
      }
      if (this.isCode) {
        Object.assign(data, {
          cardId: this.cardId,
          name: this.name,
        })
      } else {
        data.patientId = this.perId
      }
      this.info = data
      if (this.isPay) {
        this.isPay = false
        if (this.cardId) {
          Object.assign(data, {
            cardId: this.cardId,
            name: this.name,
            patientId: '',
          })
        }
        console.log(data, '==-1')
        mzPayment(data)
          .then(data => this.$refs.pay.payTypeC(data))
          .finally(() => {
            this.isPay = true
            // this.isAll = false
          })
      } else {
        uni.showToast({
          title: '请勿重复点击',
          icon: 'none',
        })
      }
    },
    goto(url) {
      let infoUrl = url
      if (this.cardId) {
        infoUrl = infoUrl + `&cardId=${this.cardId}&name=${this.name}`
      }
      uni.navigateTo({
        url: infoUrl,
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
        if (values.includes(item.prescNo)) {
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
    async topbarChange(state) {
      console.log(12)
      this.current = state

      uni.showLoading({
        title: '正在加载数据',
      })

      try {
        state == 0
          ? await this.getmzRpWaitPayData()
          : state == 1
          ? await this.getmzRpPaydData()
          : await this.getmzRpRefundData()

        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
      }
    },
    //打开导航河豚引路
    openTipNavigation() {
      //选中项
      const selectItems = this.waitPayList.filter(item => item.checked)
      //是否只有核酸预约
      const state = selectItems.every(
        v => v.title === '检验缴费' && v.docName === '彭晶晶',
      )
      if (state) return
      uni.showModal({
        title: '系统消息',
        content: '是否导航到医技科室？',
        confirmColor: '#0AB2C1',
        success: confirm => {
          if (confirm.confirm) {
            uni.navigateToMiniProgram({
              appId: 'wx83884e3a215b20f4',
              path:
                'pages/map/mapView?buildId=0AIP01&url=https%3A%2F%2Fhis.ipalmap.com%2Fnavigation%2Fdist%2Findex.html%23%2Fmap%3FappsId%3D2161%26deptId%3D93',
              extraData: {
                data1: 'test',
              },
              success(res) {
                // 打开成功
              },
            })
          } else {
            this.topbarChange(this.current)
          }
        },
      })
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
  padding: 30rpx 20rpx;

  .contentBox {
    flex: 1;
    margin-left: 20rpx;

    .content {
      .contentTitle {
        margin-bottom: 15rpx;

        .payTitle {
          font-size: 33rpx;
          color: #333333;
          font-weight: 400;
          margin-right: 25rpx;
        }

        .category {
          font-size: 22rpx;
          color: $uni-color-primary;

          .category-divactive {
            background: $uni-color-primary;
            color: #fff;
            padding: 0 10rpx;
            border: 1rpx solid $uni-color-primary;
            border-radius: 4rpx 0 0 4rpx;
          }

          .normal {
            padding: 0 10rpx;
            border: 1rpx solid $uni-color-primary;
            border-radius: 0 4rpx 4rpx 0;
          }
        }
      }

      .createTime {
        min-width: 417rpx;
        font-size: 28rpx;
        color: #646464;
      }
    }

    .price {
      font-size: 32rpx;
      color: #333333;
      text-align: right;
    }
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

.finishList {
  padding: 0 0 20rpx 20rpx;
  margin: 0 auto;
  width: 95%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12rpx;
  margin-bottom: 18rpx;

  .contentBox {
    margin-left: 0;
    padding-right: 20rpx;
  }

  .listTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13rpx 0;
    border-bottom: 1px solid #e9eff4;

    .num,
    span {
      color: #646464;
      font-size: 28rpx;
    }

    .payMode {
      background: rgba(10, 178, 193, 0.1);
      color: #0ab2c1;
      border-radius: 5rpx;
      font-size: 24rpx;
      text-align: center;
      font-weight: 600;
      padding: 5rpx 10rpx;
    }
  }
}
.top-tip {
  height: 54rpx;
  line-height: 52rpx;
  padding-left: 20rpx;
  background-color: #fae2e2;
  color: #e45b5b;
}
.name-top {
  display: flex;
  font-size: 30rpx;
  justify-content: space-between;
  background-color: #fff;
  padding: 16rpx 30rpx;
  border-bottom-left-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
}
</style>
