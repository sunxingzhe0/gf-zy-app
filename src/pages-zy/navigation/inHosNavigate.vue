<template>
  <view style="padding-top: 110rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange"> </topbar>
    <view class="main">
      <template v-if="active == 0">
        <image class="img" :src="require('../images/location1.png')" alt="" />
      </template>
      <template v-if="active == 1">
        <image class="img" :src="require('../images/location2.png')" alt="" />
      </template>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      tabs: [
        {
          title: '门诊楼',
          key: 0,
        },
        {
          title: '住院楼',
          key: 1,
        },
      ],
    }
  },
  methods: {
    topbarChange(state) {
      this.active = state
    },
  },
}
</script>
<style scoped lang="scss">
.img {
  width: 100%;
  height: 800rpx;
}
</style>
