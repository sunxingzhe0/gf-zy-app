<template>
  <view class="wrap ">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="title"
      ><image :src="FILE_URL_BUILT_IN('selectDoctorBg.png')"></image
      ><text>{{ info.title }}</text></view
    >
    <view class="content box-shadow" v-html="info.content"></view>
  </view>
</template>
<script>
import deptList from './dept'
import { getDeptinfo } from '@/common/request/depetinfoList.js'

export default {
  data() {
    return {
      info: {},
      list: deptList,
    }
  },
  onLoad(options) {
    console.log(options)
    this.getInfo(options.id)
  },
  methods: {
    async getInfo(id) {
      this.info = await getDeptinfo(id)
      // let info = this.list.filter(item => item.id == id)[0]
      // this.info = info
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  padding-bottom: 30rpx;
  .title {
    height: 200rpx;
    position: relative;
    image {
      width: 100%;
      height: 100%;
    }
    text {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 40rpx;
      font-size: 34rpx;
      color: #fff;
      font-weight: bold;
      left: 0;
    }
  }
  .content {
    background: #fff;
    width: 94%;
    margin: 0 auto;
    margin-top: -40rpx;
    box-shadow: 0 0 3rpx 0 rgba(0, 0, 0, 0.3);
    font-size: 28rpx;
    line-height: 46rpx;
    text-indent: 2em;
    position: relative;
    z-index: 4;
    padding: 40rpx 20rpx 40rpx 30rpx;
    box-sizing: border-box;
    color: #333;
  }
}
</style>
