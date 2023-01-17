<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />

    <view
      class="top-bg"
      :style="{
        backgroundImage: `url(${FILE_URL_BUILT_IN(
          info.status == 'EXECUTED' ||
            info.payStatus == 'RETURNPAID' ||
            info.status == 'CANCELLATION'
            ? 'orderIngoBg2_grey.png'
            : 'orderIngoBg2.png',
        )})`,
      }"
    >
      {{
        info.status == 'DRAFT'
          ? '草稿'
          : info.payStatus == 'RETURNPAID'
          ? '已退费'
          : info.status == 'NONEXECUTION'
          ? '未执行'
          : info.status == 'EXECUTED'
          ? '已执行'
          : info.status == 'CANCELLATION'
          ? '已作废'
          : info.payStatus == 'EXPIRED'
          ? '已失效'
          : info.payStatus == 'NONPAID'
          ? '未缴费'
          : info.payStatus == 'PAID'
          ? '已缴费'
          : ''
      }}
    </view>
    <app-card styles="margin: -20rpx 20rpx 0;padding: 20rpx;">
      <app-list-item label="名称" :noBorder="true" :styles="appListItemStyles">
        <view class="flex-between" :style="{ width: '100%' }">
          <view>{{ info.name }}</view>
          <view v-if="info.anxious" class="anxious-tag">急</view>
        </view>
      </app-list-item>
      <app-list-item
        :label="info.type == 'LAB' ? '部位' : '标本'"
        v-if="parts"
        :value="parts"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <!-- <app-list-item
        label="子部位"
        v-if="sonParts"
        :value="sonParts"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item> -->
      <app-list-item
        label="执行科室"
        :value="deptName"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        label="预约执行时间"
        v-if="info.start"
        :noBorder="true"
        :styles="appListItemStyles"
      >
        <view
          class="flex-between"
          :style="{ width: '100%' }"
          @click="onTimeClick"
        >
          <view>
            {{ info.type == 'LAB' ? info.start.split(' ')[0] : info.start }}
          </view>
          <uni-icons
            v-if="useUpdateTime"
            type="arrowright"
            size="14"
            color="#666"
          ></uni-icons>
        </view>
      </app-list-item>
      <app-list-item
        label="要求"
        v-if="info.remark"
        :value="info.remark"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
    </app-card>
    <app-card :styles="appCardStyles">
      <app-list-item
        label="单据号"
        :value="info.documentId"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        label="项目"
        :value="
          info.type == 'LAB'
            ? '检验单'
            : info.type == 'EXAMINE'
            ? '检查单'
            : '治疗单'
        "
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item label="费用" :noBorder="true" :styles="appListItemStyles">
        <view :style="{ color: '#e45c5c' }">￥ {{ info.price }}</view>
      </app-list-item>
      <app-list-item
        label="创建时间"
        :value="info.createTime"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        label="创建人"
        :noBorder="true"
        :styles="appListItemStyles"
      >
        <text>{{ info.doctorName }}</text>
        <text :style="{ marginLeft: '20rpx' }">{{ info.doctorTitle }}</text>
      </app-list-item>
    </app-card>
    <app-card v-if="info.outTradeNo" :styles="appCardStyles">
      <app-list-item
        label="支付号"
        :value="info.outTradeNo"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        label="支付方式"
        :value="
          info.payType == 'WECHAT_PAY'
            ? '微信支付'
            : info.payType == 'ALI_PAY'
            ? '支付宝支付'
            : info.payType == 'OFFLINE_PAY'
            ? '线下支付'
            : ''
        "
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
    </app-card>
    <app-card v-if="info.outRefundNo" :styles="appCardStyles">
      <app-list-item
        label="退费号"
        :value="info.outRefundNo"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
      <app-list-item
        label="退费方式"
        :noBorder="true"
        :styles="appListItemStyles"
      >
        {{
          info.refundType == 'ORIGINAL'
            ? '原路退回'
            : info.refundType == 'WECHAT_PAY'
            ? '支付宝'
            : info.refundType == 'ALI_PAY'
            ? '微信'
            : info.refundType == 'BANK_CARD'
            ? '银行卡'
            : ''
        }}
      </app-list-item>
      <app-list-item
        label="退费金额"
        :value="'￥' + info.refundFee"
        :noBorder="true"
        :styles="appListItemStyles"
      ></app-list-item>
    </app-card>
    <view class="bottom-bar flex-justify-end" v-if="showBottom">
      <button
        v-if="
          ['SUBMITTED', 'NONEXECUTION'].includes(info.status) &&
            info.payStatus == 'PAID'
        "
        class="button"
        @click="$refs.time.open()"
      >
        修改预约
      </button>
      <button
        v-if="info.status == 'SUBMITTED'"
        class="button button-primary"
        @click="openPay"
      >
        付款
      </button>
      <button
        v-else-if="info.status == 'NONEXECUTION' && info.payStatus == 'PAID'"
        class="button button-primary"
        @click="refund"
      >
        退款
      </button>
      <button v-else-if="info.outRefundNo" class="button" @click="del">
        删除
      </button>
    </view>

    <popup-pay
      ref="pay"
      :type="true"
      @success="getData"
      @payTap="orderPay"
    ></popup-pay>

    <uni-popup ref="time" type="bottom">
      <Time
        v-if="info.id"
        tight
        week
        :mode="info.type == 'EXAMINE' ? 'time' : ''"
        :dictDisposeId="info.dictDisposeId"
        :parts="specimens || parts"
        :methodsId="info.methodId"
        :type="info.type"
        :value="resolveTimeValue"
        @confirm="timeConfirm"
      />
    </uni-popup>
  </view>
</template>

<script>
import appCard from '@/components/app/app-card/index.vue'
import appListItem from '@/components/app/app-list-item/index.vue'
import Time from '@/components/treatment/popup/time'
import {
  adviceDetail,
  userDelete,
  userRefund,
  userUpdateTime,
} from '@/common/request/advice'
import { submitAppointment } from '@/common/request/userAppointment'
export default {
  components: {
    appCard,
    appListItem,
    Time,
  },
  data() {
    return {
      isClick: true,
      appCardStyles: 'margin: 20rpx 20rpx 0; padding: 20rpx;',
      appListItemStyles: {
        padding: '20rpx',
      },
      id: '',
      disOrderId: '',
      info: {},
    }
  },
  computed: {
    parts() {
      return this.info.dictDisList?.map(_ => _.specimenPartName)?.join() || ''
    },
    deptName() {
      return this.info.dictDisList?.[0]?.execDeptName || ''
    },
    // sonParts() {
    //   return this.info.parts
    //     ?.map(item => item.next.map(ite => ite.partName))
    //     .flat()
    //     .join('、')
    // },
    showBottom() {
      return (
        (['SUBMITTED', 'NONEXECUTION'].includes(this.info.status) &&
          ['NONPAID', 'PAID'].includes(this.info.payStatus)) ||
        this.info.outRefundNo
      )
    },
    useUpdateTime() {
      return (
        !this.info.updateTimeStatus &&
        this.info.status != 'EXECUTED' &&
        this.info.payStatus != 'RETURNPAID'
      )
    },
    resolveTimeValue() {
      const [date, start] = this.info.start?.split(' ') || [null, null]
      const end = this.info.end?.split(' ')?.[1] || ''
      return {
        date,
        start: start?.substr(0, 5) || '',
        end: end?.substr(0, 5) || '',
      }
    },
  },
  onLoad(option) {
    this.id = option.id
    this.disOrderId = option.bizId
    console.log(option.bizId, 'bizid-----')
    this.getData()
  },
  methods: {
    getData() {
      adviceDetail({
        id: this.id || '',
        disOrderId: this.disOrderId,
      }).then(data => {
        this.info = data
      })
    },
    onTimeClick() {
      if (!this.useUpdateTime) return
      this.$refs.time.open()
    },
    openPay() {
      this.$refs.pay.show()
    },
    async orderPay() {
      if (!this.isClick) {
        return uni.showToast({ title: '请勿重复点击', icon: 'none' })
      }
      this.isClick = false

      submitAppointment({
        userId: uni.getStorageSync('userId'),
        bizId: this.info.id,
        bizType: 'DISPOSAL',
        agreement: true,
      }).then(order => {
        this.isClick = true
        if (!order) return
        if (order.isPay) {
          this.getData()
          this.$refs.pay.close()
        } else {
          this.$refs.pay.payTypeC(order.tradeId, order.tradeType)
        }
      })
    },
    refund() {
      uni.showModal({
        title: '是否确认操作？',
        success: ({ confirm }) => {
          if (confirm) {
            uni.showLoading({
              title: '正在申请退款',
            })
            userRefund({ id: this.info.id }).then(() =>
              uni.navigateBack({
                delta: 1,
              }),
            )
          }
        },
      })
    },
    del() {
      uni.showModal({
        title: '是否确认操作？',
        success: ({ confirm }) => {
          if (confirm) {
            userDelete({ id: this.id }).then(() =>
              uni.navigateBack({
                delta: 1,
              }),
            )
          }
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

      userUpdateTime(params).then(() => this.getData())
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 130rpx;
}
.top-bg {
  height: 130rpx;
  line-height: 104rpx;
  background-size: contain;
  background-repeat: no-repeat;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
}

.anxious-tag {
  width: 48rpx;
  height: 48rpx;
  text-align: center;
  background: rgba(228, 91, 91, 0.2);
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
  width: 160rpx;
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

  &.button-primary {
    background-color: $uni-color-primary;
    color: #fff;
  }
}
</style>
