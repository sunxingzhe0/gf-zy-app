<template>
  <view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
      <app-list-item label="检查项目" :styles="{padding:'30rpx',paddingLeft:0}" ></app-list-item>
      <view style="padding: 30rpx;padding-left: 0;">DX 左肩关节看，正侧位</view>
    </app-card>
    <app-card styles="padding: 30rpx;padding-bottom:0;padding-top:40rpx;">
      <view class="flex-between" style="flex-wrap: wrap;">
        <view
          class="imgWrap"
          v-for="(item, index) in 8"
          :key="index"
          @click="goto('/pages-zy/reportQuery/ctImgInfo')"
        >
          <image src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <view class="color666 font26 text-overflow text-center">这是图片的名称…</view>
        </view>
        <view class="imgWrap"></view>
        <view class="imgWrap"></view>
      </view>

    </app-card>

  </view>
</template>
<script>
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
export default {
  components:{
    AppCard,
    AppListItem
  },
  data() {
    return {}
  },
  methods: {
    goto(url) {
      uni.navigateTo({
        url:url
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  @import '~@/common/order.scss';
.imgWrap {
  width: 200rpx;
  margin-bottom: 20rpx;
  image{
    width: 100%;
    height: 200rpx;
  }

}
</style>
