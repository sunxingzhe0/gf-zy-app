<template>
  <view class="lists">
    <view class="app-card" v-for="(item, index) in listData" :key="index">
      <view class="item flex-between"
        >日期：{{ item.visitDate }}
        <text :style="{ color: tagColor[item.medicalType] }">{{
          tagText[item.medicalType]
        }}</text></view
      >
      <view class="item">{{
        `医师：${item.doctorName}｜科室：${item.deptName}`
      }}</view>
      <view class="item"
        >{{
          item.medicalType == 'MZ'
            ? '门诊号'
            : item.medicalType == 'ZY'
            ? '住院号'
            : item.medicalType == 'TJ'
            ? '体检号'
            : '-'
        }}：{{ item.medicalId }}</view
      >
      <view class="btn" @click="toRcordInfo(item)">查看详情</view>
    </view>
  </view>
</template>

<script>
import { medicalList } from '@/pages-zxs/api/myPatient'

export default {
  props: {
    patentInfo: Object,
  },
  data() {
    return {
      listData: [],
      tagColor: {
        MZ: '#0AB2C1',
        ZY: '#48B72A',
        TJ: '#187CC1',
      },
      tagText: {
        MZ: '门诊',
        ZY: '体检',
        TJ: '住院',
      },
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    async getListData(times) {
      const params = times
        ? {
            patientId: this.patentInfo.patientId,
            startTime: times[0],
            endTime: times[1],
          }
        : {
            patientId: this.patentInfo.patientId,
            year: '2022',
            month: '04',
          }
      this.listData = (await medicalList(params)).list
    },
    toRcordInfo(item) {
      console.log(item, '---')
      uni.navigateTo({
        url: '/pages-zxs/myPatient/visitRcordInfo?medicalId=' + item.medicalId,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.lists {
  padding: 20rpx;
  .app-card {
    margin-top: 20rpx;
    padding: 20rpx;
    .item {
      margin-top: 10rpx;
    }
    .btn {
      width: 100%;
      margin-top: 20rpx;
      border-top: 1px solid #f2f2f2;
      height: 60rpx;
      color: #0ab2c1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
