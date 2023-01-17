<template>
  <view class="treatment-new">
    <app-card styles="padding: 0">
      <app-list-item label="患者姓名" :value="order.memberName"></app-list-item>
      <app-list-item
        label="就诊卡号"
        :value="order.patientCard"
      ></app-list-item>
      <app-list-item noBorder label="关联订单号">
        <text>{{ order.orderId }}</text>
        <navigator
          :url="`/pages-doctor/user/order/detail?orderId=${order.orderId}`"
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
      <app-list-item label="类型" noBorder>
        <view class="treatment-types">
          <view
            v-for="item in treatmentTypes"
            @click="toogleTreatmentType(item.value)"
            class="treatment-type"
            :key="item.value"
            :class="{ active: treatmentType === item.value }"
          >
            {{ item.label }}
          </view>
        </view>
      </app-list-item>
    </app-card>
    <inspection
      ref="inspection"
      v-if="treatmentType === treatmentTypes[0].value"
      :order="form"
    />
    <examination
      ref="examination"
      v-else-if="treatmentType === treatmentTypes[1].value"
      :order="form"
    />
    <treatment ref="treatment" v-else :order="info" />
    <view class="treatment-btns">
      <view class="treatment-btn temp" @click="onSubmit('DRAFT')">暂存</view>
      <view class="treatment-btn submit" @click="onSubmit('SUBMITTED')">
        提交
      </view>
    </view>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import Treatment from '../components/treatment'
import Inspection from '../components/inspection'
import Examination from '../components/examination'
import {
  insertDispose,
  doctorUpdateDetail,
  hasDisDraft,
} from '@/common/request/advice'

export default {
  components: {
    AppCard,
    Treatment,
    Inspection,
    Examination,
    AppListItem,
  },
  props: {
    roomOrderId: String,
    order: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      isSubmit: false,
      treatmentType: 'inspection',
      treatmentTypes: [
        {
          label: '检验',
          value: 'inspection',
          key: 'LAB',
        },
        {
          label: '检查',
          value: 'examination',
          key: 'EXAMINE',
        },
        // {
        //   label: '治疗',
        //   value: 'treatment',
        // },
      ],
      info: {},
    }
  },
  watch: {
    'info.type': {
      handler(value) {
        if (!value) return
        this.treatmentType = this.treatmentTypes.find(
          ({ key }) => key == value,
        ).value
      },
      deep: true,
    },
  },
  computed: {
    form() {
      return this.info.type ==
        this.treatmentTypes.find(item => this.treatmentType == item.value).key
        ? this.info
        : {}
    },
  },
  created() {
    if (this.roomOrderId) {
      this.getDraft()
    } else {
      this.info = this.order
    }
  },
  onShow() {
    uni.$on('caBack', () => {
      this.isSubmit = true
    })
  },
  methods: {
    async getDraft() {
      this.info = await hasDisDraft({ orderId: this.order.orderId })
    },
    toogleTreatmentType(val) {
      this.treatmentType = val
    },
    onSubmit(status) {
      //处置提交
      if (this.info.id) {
        this.update(status)
        return
      }

      const {
        userId,
        sessionId,
        orderId,
        memberId,
        memberName,
        patientCard,
        titleName,
        bizType,
      } = this.order

      const f = this.$refs[this.treatmentType].form
      const form = Object.assign({}, f, {
        userId,
        patientName: memberName,
        doctorTitle: titleName,
        sessionId,
        orderId,
        memberId,
        patientCard,
        status,
        orderType:
          bizType == 'REPEAT_CLINIC' ? 'F' : bizType == 'CONSULT' ? 'Z' : 'X',
        start: f.start
          ? this.FORMATDATE(
              new Date(f.start.replace(/-/g, '/')),
              'yyyyMMddhhmmss',
            )
          : '',
        end: f.end
          ? this.FORMATDATE(
              new Date(f.end.replace(/-/g, '/')),
              'yyyyMMddhhmmss',
            )
          : '',
      })

      if (status == 'DRAFT') {
        insertDispose(form).then(() => this.$emit('submit'))
        return
      }

      if (!form.dictDisposeId) {
        uni.showToast({
          icon: 'none',
          title: '请选择类别',
        })
        return
      } else if (!form.name) {
        uni.showToast({
          icon: 'none',
          title: '请选择名称',
        })
        return
      } else if (!form.start) {
        uni.showToast({
          icon: 'none',
          title: '请选择预约执行时间',
        })
        return
      }

      insertDispose(form)
        .then(() => this.$emit('submit'))
        .catch(error => {
          console.log(error, '错误信息')
          //错误码为此时跳转授权
          if (error.cause.apiError.val$errCode === 'CA_SIGN_ERROR') {
            uni.navigateTo({
              url: '/pages-doctor/autograph/autograph',
            })
          }
        })
    },
    update(status) {
      const f = this.$refs[this.treatmentType].form
      if (status == 'DRAFT' && f.id) {
        uni.showModal({
          title: '提示',
          content: '只能存在一个草稿处置，是否需要覆盖上一个草稿处置？',
          success: ({ confirm }) => {
            if (confirm) {
              this.submitUpdate(status)
            }
          },
        })
      } else {
        this.submitUpdate(status)
      }
    },
    submitUpdate(status) {
      const f = this.$refs[this.treatmentType].form
      const form = Object.assign({}, f, {
        start: f.start
          ? this.FORMATDATE(
              new Date(f.start.replace(/-/g, '/')),
              'yyyyMMddhhmmss',
            )
          : '',
        end: f.end
          ? this.FORMATDATE(
              new Date(f.end.replace(/-/g, '/')),
              'yyyyMMddhhmmss',
            )
          : '',
        status,
      })

      if (!f.id) Object.assign(form, { id: this.info.id })
      doctorUpdateDetail(form)
        .then(() => this.$emit('submit'))
        .catch(error => {
          console.log(error, '错误信息')
          //错误码为此时跳转授权
          if (error.cause.apiError.val$errCode === 'CA_SIGN_ERROR') {
            uni.navigateTo({
              url: '/pages-doctor/autograph/autograph',
            })
          }
        })
    },
    onCopy() {
      // #ifdef MP-WEIXIN
      wx.setClipboardData({
        //准备复制的数据
        data: this.order.orderId,
        success: function(res) {
          wx.showToast({
            title: '复制成功',
          })
        },
      })
      // #endif

      // #ifdef H5
      this.$copyText(this.order.orderId).then(
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
  },
}
</script>

<style lang="scss" scoped>
.treatment-new {
  box-sizing: border-box;
  padding: 20rpx;
}

.treatment-types {
  display: flex;
  align-items: center;
}

.treatment-type {
  width: 126rpx;
  color: #333;
  height: 52rpx;
  font-size: 24rpx;
  text-align: center;
  line-height: 50rpx;
  margin-right: 30rpx;
  border-radius: 26rpx;
  background: #f1f1f1;

  &.active {
    color: #fff;
    background: #09b1c1;
  }
}

.treatment-btns {
  display: flex;
  flex-direction: row;

  .treatment-btn {
    width: 50%;
    height: 88rpx;
    font-size: 30rpx;
    font-weight: 500;
    text-align: center;
    line-height: 88rpx;
  }

  .temp {
    color: #0ab1c1;
    background: #fff;
    border-top-left-radius: 44rpx;
    border-bottom-left-radius: 44rpx;
  }

  .submit {
    color: #ffffff;
    background: #0ab1c1;
    border-top-right-radius: 44rpx;
    border-bottom-right-radius: 44rpx;
  }
}
.primary-text {
  color: $uni-color-primary;
}
</style>
