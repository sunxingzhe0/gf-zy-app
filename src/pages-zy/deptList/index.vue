<template>
  <view class="wrap">
    <view style="background: #fff;">
      <view
        class="flex-between deptList"
        v-for="(item, index) in listData"
        :key="index"
        @click="info(item.id)"
      >
        <view>{{ item.title }}</view>
        <uni-icons type="arrowright" color="#666"></uni-icons>
      </view>
    </view>
  </view>
</template>
<script>
import deptList from './dept'
import { getDeptinfoList } from '@/common/request/depetinfoList.js'
export default {
  data() {
    return {
      deptList: deptList,
      listData: [],
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    info(id) {
      uni.navigateTo({
        url: `/pages-zy/deptList/detail?id=${id}`,
      })
    },
    async getDeptList() {
      this.listData = (await getDeptinfoList()).list.filter(
        v => v.status == '1',
      )
      console.log(this.listData, '==')
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  .deptList {
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    color: #333;
    font-size: 28rpx;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
