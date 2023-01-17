<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <topbar>
        <template v-slot:top>
          <view style="padding-left: 30rpx;">
            <app-list-item label="健康卡">
              <view class="flex_1 text-right color666">
                <select-patient
                  textStyle="color:#666;"
                  @patientLoad="changePatient"
                ></select-patient>
              </view>
            </app-list-item>
          </view>

          <!-- <app-list-item label="选择时间" :styles="{padding:'16rpx 30rpx'}">
         <view class="flex_1 text-right color666 flex-end-start">
           <select-date-range :date="rangeData" @confirm="dateChange"></select-date-range>
         </view>
       </app-list-item> -->
        </template>
      </topbar>
    </view>
    <!--左菜单栏-->
    <leftTab
      :tabs="leftTabs"
      styles="top:100rpx;"
      :active="parameter.type"
      @change="topbarChange()"
    ></leftTab>
    <template>
      <view class="tabList">
        <view class="tabWrap flex-between" style="padding-left: 40rpx;">
          <view
            :class="['tabItem', parameter.payState == 0 ? 'on' : '']"
            @click="tabTap(0)"
            >未预约
          </view>
          <view
            :class="['tabItem', parameter.payState == 1 ? 'on' : '']"
            @click="tabTap(1)"
            >已预约</view
          >
          <view
            :class="['tabItem', parameter.payState == 2 ? 'on' : '']"
            @click="tabTap(2)"
            >已取消</view
          >
        </view>

        <view
          class="toPayBox box-shadow"
          v-for="(item, index) in data"
          :key="index"
          @click="onTimeClick(item)"
        >
          <!-- //点击修改时间 -->
          <!--待支付-->
          <checkbox-group @change="checkboxChange">
            <view class="listBt flex-between">
              <!-- //暂时不需要支付 -->
              <view v-if="false">
                <checkbox
                  class="checkbox"
                  style="transform: scale(0.7);"
                  color="#0ab2c1"
                  :value="item.id"
                  :checked="item.checked"
                  @click.stop="() => null"
                />{{ typeSwitch(parameter.type) }}
              </view>
              <!-- v-if="parameter.payState >1" -->
              <view>{{ typeSwitch(parameter.type) }}</view>
              <view class="state flex-center">
                <view class="u" v-if="item.instead">代</view>
                <view class="r" v-if="item.anxious">急</view>
                <!-- <text :class="{
                  paid:parameter.payState>1,
                  unpaid:parameter.payState==1
                }">支付状态</text> -->
              </view>
            </view>

            <view class="contentBox" v-if="item.type != 'ONLINEFOLLOWUP'">
              <view class="contentTitle">
                <view class="payTitle">{{ item.itemName }}</view>
              </view>
              <view class="flex-between">
                <view>
                  <!-- item.dictDisList[0].execDeptName -->
                  <view class="createTime"
                    >执行科室：{{ item.execDept || '-' }}</view
                  >
                </view>
                <view class="price"
                  >￥{{ parseFloat(item.price).toFixed(2) }}</view
                >
              </view>
              <view class="createTime"
                >预约执行时间：{{ item.orderDate || '-' }}</view
              >
            </view>
            <!-- 在线复诊 暂时没有 -->
            <view class="contentBox" v-if="item.type == 'ONLINEFOLLOWUP'">
            </view>
            <!-- </view> -->
          </checkbox-group>
        </view>

        <!-- 合计 parameter.payState==1-->
        <view class="fiexdBtn flex-between font30" v-if="false">
          <checkbox-group style="width: auto;" @change="allCheckboxChange">
            <label>
              <checkbox
                style="transform: scale(0.7);"
                class="checkbox"
                color="#0ab2c1"
                value="isAll"
                :checked="isAll"
              />
              全选
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
        <NoData v-if="data.length == 0"></NoData>
      </view>
    </template>

    <!-- 支付列表 -->
    <popup-pay
      ref="pay"
      :type="true"
      @success="init"
      @payTap="orderPay"
    ></popup-pay>
    <uni-popup ref="time" type="bottom">
      <Time
        v-if="info.id"
        tight
        week
        istimeNum="false"
        mode="time"
        :dictDisposeId="info.dictDisposeId"
        :parts="specimens || parts"
        :methodsId="info.methodId"
        type="EXAMINE"
        :value="resolveTimeValue"
        @confirm="timeConfirm"
      />
    </uni-popup>
  </view>
</template>

<script>
import NoData from '../components/NoData.vue'

import { userUpdateTime } from '@/common/request/advice'
import AppListItem from '@/components/app/app-list-item'
import selectPatient from '../components/selectPatient.vue'
import Time from '@/components/treatment/popup/time'
import leftTab from '@/components/leftTab/index.vue'
import {
  userDisposeList,
  submitAppointment,
} from '@/common/request/userAppointment'

export default {
  components: {
    AppListItem,
    NoData,
    selectPatient,
    Time,
    leftTab,
  },
  data() {
    return {
      isClick: true,
      leftTabs: [
        {
          title: '检验',
          key: 0, //'LAB',
        },

        {
          title: '检查',
          key: 1, //'EXAMINE',
        },
        {
          title: '治疗',
          key: 2, //'CURE',
        },
        // {
        //   title: '床位',
        //   key: 3, //'BED',
        //   forbidden: true, //暂不启用
        // },
        // {
        //   title: '在线复诊',
        //   key: 4, //'ONLINEFOLLOWUP',
        //   forbidden: true, //暂不启用
        // },
      ],
      info: {}, //选中项
      parameter: {
        cardId: '',
        type: 0, //LAB EXAMINE CURE BED ONLINEFOLLOWUP
        payState: 0, //支付状态 0未预约 1已预约 2取消
      },
      data: [],
      isAll: false,
    }
  },
  onShow() {
    if (this.parameter.cardId) {
      this.init()
    }
  },

  methods: {
    init() {
      this.data = []
      this.isAll = false
      this.getList()
    },
    tabTap(e) {
      if (this.parameter.payState !== e) {
        this.parameter.payState = e
        this.init()
      }
    },
    getList() {
      userDisposeList(this.parameter).then(data => {
        this.data = data
      })

      // orderList(this.parameter).then(data => {
      //   if (data && data.data) {
      //     this.parameter.pages = data.pages
      //     this.parameter.currentNum = data.pageNum
      //     this.data = [...this.data, ...data.data]
      //     if (data.pages == data.pageNum) {
      //       this.loading = 'noMore'
      //     }
      //   } else {
      //     this.loading = 'noMore'
      //   }
      // })
    },
    changePatient(item) {
      this.parameter.cardId = item.patientCard

      this.$nextTick(this.init())
    },
    //全选
    allCheckboxChange(e) {
      if (e.detail.value.length == 0) {
        this.data.forEach(item => this.$set(item, 'checked', false))
        this.isAll = false
      } else {
        this.data.forEach(item => this.$set(item, 'checked', true))
        this.isAll = true
      }
    },

    checkboxChange(e) {
      const items = this.data,
        values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        this.$set(this.data[i], 'checked', values.includes(items[i].id))
      }

      //  商品是否全部勾选，判断全选与否状态
      this.isAll = items.every(item => item.checked == true)
    },
    //支付
    async orderPay() {
      const params = {
        userId: uni.getStorageSync('userId'),
        bizId: this.data
          .filter(({ checked }) => checked)
          .map(({ id }) => id)
          .join(','),
        bizType: 'DISPOSAL',
        agreement: true,
      }
      if (!this.isClick){
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

    onTimeClick(row) {
      //未执行和已取消的预约单不能修改时间
      if (row.stateType == 2 || row.stateType == 3) return
      this.info = row
      this.$refs.time.open()
    },
    timeConfirm(date) {
      const params = {
        id: this.info.id,
      }
      // if (this.info.type == 'EXAMINE') {
      const [d1, d2] = date.split(' ')
      if (!d2) {
        uni.showToast({
          title: '请选择时间段！',
          icon: 'none',
        })
        return
      }
      const [t1, t2] = d2.split('~')
      this.$refs.time.close()
      Object.assign(params, {
        start: d1.replace(/-/g, '') + t1.replace(':', '') + '00',
        end: d1.replace(/-/g, '') + t2.replace(':', '') + '00',
      })
      // } else {
      //   Object.assign(params, {
      //     start: date.replace(/-/g, '') + '000000',
      //     end: date.replace(/-/g, '') + '000000',
      //   })
      // }

      userUpdateTime(params).then(data => {
        this.$nextTick(this.init())
      })
    },
    typeSwitch(type) {
      let typeS = ''
      switch (type) {
        case 0: //'LAB'
          typeS = '检验单'
          break
        case 1: //'EXAMINE'
          typeS = '检查单'
          break
        case 2: //'CURE'
          typeS = '治疗'
          break
        case 3: //'BED'
          typeS = '床位'
          break
        case 4: //'ONLINEFOLLOWUP'
          typeS = '在线复诊'
          break
      }
      return typeS
    },
    topbarChange(e) {
      this.parameter.type = e
      this.$nextTick(() => {
        this.init()
      })
    },
  },
  computed: {
    checkedList() {
      return this.data.filter(({ checked }) => checked).map(({ id }) => id)
    },
    resolveTimeValue() {
      const [date, time] = this.info.orderDate?.split(' ') || [null, null]
      const [start, end] = time?.split('-') || ['', '']
      return {
        date,
        start: start,
        end: end,
      }
    },
    parts() {
      return this.info.dictDisList?.map(_ => _.specimenPartName)?.join() || ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.tabList {
  margin-top: 60rpx;
  margin-left: 150rpx;
  padding: 20rpx 30rpx;

  .tabWrap {
    padding: 20rpx 30rpx;

    .tabItem {
      font-size: 28rpx;
      color: #666;
      border-bottom: none;
    }

    .on {
      border-bottom: 2px solid #0ab2c1;
    }
  }
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

    .state {
      view {
        font-size: 14px;
        margin: 5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
      }

      .u {
        color: #e45b5b;
        background: rgba(228, 91, 91, 0.1);
      }

      .r {
        color: #e5aa1e;
        background: rgba(229, 170, 30, 0.1);
      }

      .unpaid {
        font-size: 13px;
        color: #0ab2c1;
      }

      .paid {
        font-size: 13px;
        color: #999999;
      }
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
  width: 70%;
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
