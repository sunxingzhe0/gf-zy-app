<template>
  <!-- <web-view src="https://mp.weixin.qq.com/s/XtUeuzL4UWCv-3Mhc4fhPQ"></web-view> -->
  <view class="notice-page">
    <view class="title">{{ tjNotice.title || '就诊须知' }}</view>
    <!-- <u-parse :content="tjNotice.content"></u-parse> -->
    <view class="content" v-html="tjNotice.content"></view>
  </view>
</template>

<script>
import { getTjIns } from '@/pages-zy/api/physical.js'
export default {
  data() {
    return {
      tjNotice: {},
    }
  },
  onLoad() {
    //获取温馨提示
    this.getTjInsInfo()
  },
  methods: {
    // 获取温馨提示 就诊须知
    async getTjInsInfo() {
      this.tjNotice = await getTjIns({ type: 2 })
      if (this.tjNotice.content) {
        this.tjNotice.content = this.tjNotice.content.replace(/&nbsp;/g, '\xa0')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
view {
  font-size: 30rpx !important;
  line-height: 52rpx;
  text-align: justify;
}
.notice-page {
  background: #fff;
  padding: 30rpx;
  .title {
    text-align: center;
    font-size: 34rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
  }
  .content {
    font-size: 30rpx;
    color: #666;
  }
}
</style>
