<template>
  <view>
    <view>{{ illInfo.illnessDesc }}</view>
    <view
      ><image
        v-for="pic in illInfo.picList"
        :key="pic"
        class="image"
        :src="FILE_URL(pic)"
        @click="preViewImage(pic)"
        mode="aspectFit"
        style="width: 128rpx;height: 128rpx;"
      ></image
    ></view>
    <template v-if="illInfo.historyMedicalInfo">
      <view class="mt-20">就诊记录</view>
      <view
        v-if="illInfo.historyMedicalInfo.visitDate"
        :style="{ marginTop: '10rpx', color: user ? '#fff' : '#0ab2c1' }"
      >
        就诊日期：{{ illInfo.historyMedicalInfo.visitDate }}
      </view>
      <view
        v-if="illInfo.historyMedicalInfo.diagnose"
        :style="{ color: user ? '#fff' : '#0ab2c1' }"
        >{{ illInfo.historyMedicalInfo.diagnose }}</view
      >
      <view
        v-if="illInfo.historyMedicalInfo.doctorName"
        :style="{ color: user ? '#fff' : '#0ab2c1' }"
      >
        {{ illInfo.historyMedicalInfo.doctorName }}
        <text style="margin-left: 20rpx;">{{
          illInfo.historyMedicalInfo.deptName
        }}</text>
      </view>
    </template>
    <view v-for="rp in illInfo.historyRpList" :key="rp.id">
      <view>
        <text>药品清单</text>
        <text style="margin-left: 20rpx;">{{ rp.contentList.length }}</text>
      </view>
      <view
        v-for="medicine in rp.contentList"
        :key="medicine.id"
        class="medicine-wrapper"
      >
        <view class="medicine-name"
          >{{ medicine.name }}（规格：{{ medicine.spec }}） x{{
            medicine.total
          }}
          盒</view
        >
        <view class="medicare"
          >医保：{{
            medicine.medicare == 'A'
              ? '甲'
              : medicine.medicare == 'B'
              ? '乙'
              : medicine.medicare == 'C'
              ? '丙'
              : '自费'
          }}</view
        >
        <view class="useFrequency"
          >{{ medicine.useWaysText || '' }}
          {{ medicine.useFrequencyText || '' }}</view
        >
        <view class="remark" v-if="medicine.remark"
          >备注：{{ medicine.remark }}</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import { orderIllness } from '@/common/request/'
export default {
  props: {
    orderId: String,
    user: String,
  },
  data() {
    return {
      illInfo: {},
      attrdate: {},
      allchannel: {},
      allfrequency: {},
    }
  },
  created() {
    this.getIllInfo()
    const { course, channel, frequency } = this.$store.state
    //日月
    course.forEach(item => {
      Object.assign(this.attrdate, {
        [item.attrId]: item.attrName,
      })
    })
    //用药途径枚举
    channel.forEach(item => {
      Object.assign(this.allchannel, {
        [item.id]: item.name,
      })
    })
    //用药频次枚举
    frequency.forEach(item => {
      Object.assign(this.allfrequency, {
        [item.id]: item.name,
      })
    })
  },
  methods: {
    async getIllInfo() {
      this.illInfo = await orderIllness({ orderId: this.orderId })
    },
    preViewImage(fileId) {
      uni.previewImage({
        current: this.FILE_URL(fileId),
        urls: this.illInfo.picList.map(item => this.FILE_URL(item)),
        loop: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.medicine-wrapper {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f2f2f2;
}
.medicine-name {
  color: #1a1a1a;
}
.medicare {
  color: #666;
}
.useFrequency {
  color: #e45b5b;
}
.remark {
  font-size: 20rpx;
  color: #666;
}
.image {
  margin-right: 12rpx;
}
</style>
