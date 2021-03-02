<template>
  <view>
    <!-- 处置单状态 active-->
    <view
      class="treatment-status"
      :class="{ active: info.payStatus == 'PAID' }"
    >
      {{
        info.status == 'DRAFT'
          ? '草稿'
          : info.status == 'SUBMITTED' && info.payStatus == 'NONPAID'
          ? '未缴费'
          : info.payStatus == 'PAID'
          ? '已缴费'
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
          : ''
      }}
    </view>
    <template v-if="info.id">
      <view v-if="info.status == 'DRAFT'" :style="{ marginTop: '-40rpx' }">
        <treatment-edit :order="info" @submit="submit" />
      </view>
      <treatment-detail v-else :info="info" @handler="getData(info.id)" />
    </template>
  </view>
</template>

<script>
import TreatmentDetail from '@/components/treatment/detail/index.vue'
import TreatmentEdit from '@/components/treatment/new/index.vue'
import { adviceDetail } from '@/common/request/advice'
export default {
  components: {
    TreatmentDetail,
    TreatmentEdit,
  },
  data() {
    return {
      status: '',
      info: {},
    }
  },
  onLoad(options) {
    this.getData(options.id)
  },
  onReady() {
    setTimeout(() => {
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: 'white',
      })
    })
  },
  methods: {
    getData(id) {
      adviceDetail({ id: id ?? this.info.id }).then(
        data =>
          (this.info = Object.assign(data, { memberName: data.patientName })),
      )
    },
    submit() {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.treatment-status {
  width: 100%;
  height: 130rpx;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
  line-height: 110rpx;
  background-size: cover;
  background-color: #cccccc;
  background-image: url(@/assets/treatment-bg.png);
  &.active {
    background-color: #0ab2c1;
  }
}
</style>
