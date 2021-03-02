<template>
  <view
    :class="{
      'treatment-detail':
        info.status == 'SUBMITTED' && info.payStatus == 'NONPAID',
    }"
  >
    <!-- 病人信息 -->
    <app-card styles="padding: 0; margin: -20rpx 20rpx 20rpx;">
      <app-list-item
        noBorder
        label="患者姓名"
        :value="info.patientName"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        noBorder
        label="就诊卡号"
        :value="info.patientCard"
        :styles="appListItemStyles"
      ></app-list-item>
    </app-card>
    <!-- 处置详情 start -->
    <app-card styles="padding: 0; margin: 0 20rpx 20rpx;">
      <app-list-item
        noBorder
        label="名称"
        :value="info.name"
        :styles="appListItemStyles"
      >
        <view class="flex-between" :style="{ width: '100%' }">
          <view>{{ info.name }}</view>
          <view v-if="info.anxious" class="anxious-tag">急</view>
        </view>
      </app-list-item>
      <app-list-item
        v-if="info.type == 'LAB'"
        noBorder
        label="标本"
        :value="parts"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        v-if="info.type == 'EXAMINE' || info.type == 'CURE'"
        noBorder
        label="部位"
        :value="parts"
        :styles="appListItemStyles"
      ></app-list-item>
      <!-- <app-list-item
        v-if="info.type == 'CURE'"
        noBorder
        label="子部位"
        :value="sonParts"
        :styles="appListItemStyles"
      ></app-list-item> -->
      <!-- <app-list-item noBorder label="频次" value="频次"></app-list-item> -->
      <!-- <app-list-item noBorder label="疗程" value="疗程"></app-list-item> -->
      <app-list-item
        noBorder
        label="执行科室"
        :value="deptName"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        v-if="info.start"
        noBorder
        label="预约执行时间"
        :styles="appListItemStyles"
      >
        <view
          class="flex-between"
          :style="{ width: '100%' }"
          @click="
            () => {
              info.status == 'SUBMITTED' &&
                info.payStatus == 'NONPAID' &&
                $refs.time.open()
            }
          "
        >
          <view>{{ info.start.split(' ')[0] }}</view>
          <uni-icons
            v-if="info.status == 'SUBMITTED' && info.payStatus == 'NONPAID'"
            type="arrowright"
            size="14"
            color="#666"
          ></uni-icons>
        </view>
      </app-list-item>
      <app-list-item
        noBorder
        label="要求"
        v-if="info.remark"
        :value="info.remark"
        :styles="appListItemStyles"
      ></app-list-item>
    </app-card>
    <!-- 处置详情 end -->

    <!-- 订单信息 -->
    <app-card styles="padding: 0; margin: 0 20rpx 20rpx;">
      <app-list-item
        noBorder
        label="单据号"
        :value="info.documentId"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        noBorder
        label="项目"
        :styles="appListItemStyles"
        :value="
          info.type == 'EXAMINE'
            ? '检查单'
            : info.type == 'LAB'
            ? '检验单'
            : '治疗单'
        "
      ></app-list-item>
      <app-list-item noBorder label="费用" :styles="appListItemStyles">
        <view :style="{ color: '#e45c5c' }">￥{{ info.price }}</view>
      </app-list-item>
      <app-list-item
        noBorder
        label="创建时间"
        :value="info.createTime"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        noBorder
        label="作废时间"
        v-if="info.status == 'CANCELLATION'"
        :value="info.updateTime"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item noBorder label="关联订单号" :styles="appListItemStyles">
        <text>{{ info.orderId }}</text>
        <navigator
          :url="`/pages-doctor/user/order/detail?orderId=${info.orderId}`"
          class="primary-text"
          hover-class="navigator-hover"
          :style="{ marginLeft: '20rpx' }"
        >
          查看
        </navigator>
        <text
          class="primary-text"
          :style="{ marginLeft: '20rpx' }"
          @click="onCopy"
        >
          复制
        </text>
      </app-list-item>
    </app-card>
    <!-- 退款信息 -->
    <app-card
      v-if="info.outRefundNo"
      styles="padding: 0; margin: 0 20rpx 20rpx;"
    >
      <app-list-item
        noBorder
        label="退费号"
        :value="info.outRefundNo"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        noBorder
        label="退费方式"
        :value="refundType"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        noBorder
        label="退费金额"
        :value="'¥' + (info.refundFee || '')"
        :styles="appListItemStyles"
      ></app-list-item>
    </app-card>

    <view
      class="bottom-bar flex-justify-end"
      v-if="info.status == 'SUBMITTED' && info.payStatus == 'NONPAID'"
    >
      <button class="button" @click="handler('DRAFT')">
        撤回
      </button>
      <button class="button" @click="handler('CANCELLATION')">
        作废
      </button>
    </view>

    <uni-popup ref="time" type="bottom">
      <Time
        v-if="info.id"
        tight
        week
        :mode="info.type == 'EXAMINE' ? 'time' : ''"
        :dictDisposeId="info.dictDisposeId"
        :parts="parts"
        :methodsId="info.methodId"
        :type="info.type"
        :value="info.start"
        @confirm="timeConfirm"
      />
    </uni-popup>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import Time from '@/components/treatment/popup/time'
import { doctorUpdateStatus, userUpdateTime } from '@/common/request/advice'
export default {
  components: {
    AppCard,
    AppListItem,
    Time,
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      appListItemStyles: {
        padding: '20rpx',
      },
    }
  },
  computed: {
    parts() {
      return this.info?.dictDisList?.map(_ => _.specimenPartName)?.join() || ''
    },
    deptName() {
      return this.info?.dictDisList?.[0]?.execDeptName || ''
    },
    // sonParts() {
    //   return this.info.parts
    //     ?.map(({ next }) => next.map(({ partName }) => partName))
    //     .flat()
    //     .join('，')
    // },
    refundType() {
      switch (this.info.refundType) {
        case 'ORIGINAL':
          return '原路退回'
        case 'WECHAT_PAY':
          return '微信'
        case 'ALI_PAY':
          return '支付宝'
        case 'BANK_CARD':
          return '银行卡'
        default:
          return ''
      }
    },
  },
  methods: {
    onCopy() {
      // #ifdef MP-WEIXIN
      wx.setClipboardData({
        //准备复制的数据
        data: this.info.orderId,
        success: function(res) {
          wx.showToast({
            title: '复制成功',
          })
        },
      })
      // #endif

      // #ifdef H5
      this.$copyText(this.info.orderId).then(
        function(e) {
          uni.showToast({
            icon: 'success',
            title: '复制成功',
          })
        },
        function(e) {
          uni.showToast({
            icon: 'none',
            title: '复制失败',
          })
        },
      )
      // #endif
    },
    handler(status) {
      uni.showModal({
        content: '是否确认操作？',
        cancelText: '否',
        confirmText: '是',
        success: ({ confirm }) => {
          if (!confirm) return
          doctorUpdateStatus({ id: this.info.id, status }).then(() => {
            this.$emit('handler')
            uni.navigateBack({
              delta: 1,
            })
            uni.showToast({
              title: '操作成功',
              icon: 'none',
            })
          })
        },
      })
    },
    timeConfirm(date) {
      this.$refs.time.close()

      const params = {
        id: this.info.id,
      }

      if (this.info.type == 'EXAMINE') {
        console.log(date)
        const [d1, d2] = date.split(' ')
        const [t1, t2] = d2.split('~')

        Object.assign(params, {
          start: d1.replace(/-/g, '') + t1.replace(':', '') + '00',
          end: d1.replace(/-/g, '') + t2.replace(':', '') + '00',
        })
      } else {
        Object.assign(params, {
          start: date.replace(/-/g, '') + '000000',
          end: date.replace(/-/g, '') + '000000',
        })
      }

      userUpdateTime(params).then(() => this.$emit('handler'))
    },
  },
}
</script>

<style lang="scss" scoped>
.treatment-detail {
  padding-bottom: 100rpx;
}
.primary-text {
  color: $uni-color-primary;
}
.anxious-tag {
  width: 48rpx;
  height: 48rpx;
  text-align: center;
  background: rgba(228, 91, 91, 0.1);
  border-radius: 50%;
  color: #e45b5b;
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
  text-align: right;
}

.button {
  width: 152rpx;
  line-height: 60rpx;
  margin: 0 0 0 12rpx;
  text-align: center;
  background-color: #f2f2f2;
  border-width: 0;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #333;

  &::after {
    border: none;
  }
}
</style>
