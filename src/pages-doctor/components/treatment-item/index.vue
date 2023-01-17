<template>
  <app-card
    @click="linkToDetail"
    styles="padding: 0 0 0 30rpx; margin: 20rpx; display: flex; flex-direction: column;"
  >
    <view class="treatment-item-header">
      <view class="flex">
        <checkbox-group @change="toggleChecked" @click.stop="() => null">
          <label>
            <checkbox
              v-if="item.status == 'DRAFT'"
              class="checkbox"
              :checked="item.checked"
            />
            {{
              item.type == 'LAB'
                ? '检验'
                : item.type == 'EXAMINE'
                ? '检查'
                : '治疗'
            }}单
          </label>
        </checkbox-group>
        <view :class="['type-tip', status.class]">{{ status.text }}</view>
      </view>
      <view class="flex" v-if="item.startTime">
        <view class="agreement-time">
          预约执行时间：{{ item.start.split(' ')[0] }}
        </view>
        <view class="expedited" v-if="item.anxious">急</view>
      </view>
    </view>
    <view class="treatment-item-body">
      <view class="body-left">
        <view class="treate-name">
          {{ item.name || '' }}{{ item.dictDisList[0].specimenPartName || '' }}
        </view>
        <view class="treat-depart">
          执行科室：{{ item.dictDisList[0].execDeptName || '-' }}
        </view>
        <view class="treat-money"> 费用：￥{{ item.price }} </view>
      </view>
      <view class="body-right">
        <view :style="{ textAlign: 'right' }">
          <view class="patient-name">
            {{ item.patientName }}
          </view>
          <view class="patient-no">
            {{ item.patientCard }}
          </view>
        </view>
        <uni-icons
          v-if="item.status == 'DRAFT'"
          type="arrowright"
          size="16"
          style="margin-left: 12rpx;"
        ></uni-icons>
      </view>
    </view>
    <view
      class="treatment-item-footer"
      v-if="item.status == 'SUBMITTED' && item.payStatus == 'NONPAID'"
    >
      <view class="treatment-btn withdraw" @click.stop="handler('DRAFT')">
        撤回
      </view>
      <view class="treatment-btn void" @click.stop="handler('CANCELLATION')">
        作废
      </view>
    </view>
  </app-card>
</template>

<script>
import AppCard from '@/components/app/app-card/index.vue'
import { doctorUpdateStatus } from '@/common/request/advice'
export default {
  components: {
    AppCard,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    status() {
      const { status, payStatus } = this.item
      return status == 'DRAFT'
        ? { text: '草稿', class: 'default' }
        : payStatus == 'NONPAID'
        ? { text: '未缴费', class: 'no-payment' }
        : payStatus == 'PAID'
        ? { text: '已缴费', class: 'paid' }
        : payStatus == 'RETURNPAID'
        ? { text: '已退费', class: 'cancellation' }
        : status == 'CANCELLATION'
        ? { text: '已作废', class: 'default' }
        : payStatus == 'EXPIRED'
        ? { text: '已失效', class: 'default' }
        : {}
    },
  },
  methods: {
    linkToDetail() {
      uni.navigateTo({
        url: `/pages-doctor/treatment/detail/index?id=${this.item.id}`,
      })
    },
    toggleChecked() {
      this.$emit('change')
    },
    handler(status) {
      uni.showModal({
        content: '是否确认操作？',
        cancelText: '否',
        confirmText: '是',
        success: ({ confirm }) => {
          if (!confirm) return
          doctorUpdateStatus({ id: this.item.id, status }).then(() => {
            this.$emit('statusChange')
            uni.showToast({
              title: '操作成功',
              icon: 'none',
            })
          })
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.treatment-item-header {
  height: 86rpx;
  display: flex;
  line-height: 86rpx;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  padding: 28rpx 24rpx 28rpx 0;
  justify-content: space-between;
  border-bottom: 1rpx solid #e5e5e5;
  .flex {
    align-items: center;
  }
  .checkbox {
    position: relative;
    top: -4rpx;
    transform: scale(0.6);
  }
  .type-name {
    height: 25rpx;
    color: #333333;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 25rpx;
    margin-right: 12rpx;
  }
  .type-tip {
    width: 100rpx;
    padding: 6rpx 10rpx;
    text-align: center;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 26rpx;
    // 草稿
    &.default {
      color: #656565;
      background: #f2f2f2;
    }
    // 未缴费
    &.no-payment {
      color: #0ab1c0;
      background: #d4f6fa;
    }
    // 已缴费
    &.paid {
      color: #26b523;
      background: #d1f8d1;
    }
    // 已退款
    &.cancellation {
      color: #e35b5b;
      background: #fbeded;
    }
  }
  .agreement-time {
    height: 23rpx;
    color: #999999;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 23rpx;
    font-family: PingFang SC;
  }
  .expedited {
    width: 40rpx;
    height: 40rpx;
    color: #e35b5b;
    font-size: 24rpx;
    font-weight: 500;
    text-align: center;
    line-height: 40rpx;
    margin-left: 12rpx;
    border-radius: 50%;
    font-family: PingFang SC;
    background: rgba(227, 91, 91, 0.1);
  }
}
.treatment-item-body {
  display: flex;
  padding: 30rpx 0;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: space-between;
  .body-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .body-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 12rpx;
    box-sizing: border-box;
  }
  .treate-name {
    line-height: 42rpx;
    color: #333333;
    font-size: 38rpx;
  }
  .treat-depart {
    color: #656565;
    font-size: 24rpx;
  }
  .treat-money {
    color: #656565;
    font-size: 24rpx;
  }
  .patient-name {
    height: 31rpx;
    color: #333333;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 31rpx;
    font-family: PingFang SC;
  }
  .patient-no {
    height: 19rpx;
    color: #656565;
    font-size: 24rpx;
    font-weight: 500;
    margin-top: 12rpx;
    line-height: 19rpx;
    font-family: PingFang SC;
  }
}
.treatment-item-footer {
  display: flex;
  padding-right: 30rpx;
  padding-bottom: 30rpx;
  justify-content: flex-end;
  .treatment-btn {
    width: 152rpx;
    height: 60rpx;
    color: #333333;
    font-size: 24rpx;
    font-weight: 500;
    text-align: center;
    line-height: 60rpx;
    margin-left: 20rpx;
    border-radius: 30rpx;
    font-family: PingFang SC;
    border: 1rpx solid #999999;
  }
}
</style>
