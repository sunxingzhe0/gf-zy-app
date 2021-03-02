<template>
  <view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
    <view class="linkList box-shadow">
      <view class="flex-between listItem" @click="goto('/pages-user/changePhone')">
        <view class="flex_1 title">更换手机号</view>
        <view class="flex-start-center">
          <view class="vule">{{ util.noPassByMobile(userInfo.phone) }}</view>
          <uni-icons type="arrowright" size="14" color="#666"></uni-icons>
        </view>
      </view>
      <view class="flex-between listItem" @click="goto('/pages-user/setting/resetPassword')">
        <view class="flex_1 title">重置密码</view>
        <view class="flex-start-center">
          <uni-icons type="arrowright" size="14" color="#666"></uni-icons>
        </view>
      </view>
    </view>
    <button class="submit_btn" type="primary" @click="goOut">注销账号</button>
  </view>
</template>

<script>
  import util from '@/common/util';
  export default {
    data() {
      return {
        util: util,
      }
    },
    computed: {
      userInfo: function() {
        return this.$store.state.userInfo;
      },
    },
    methods: {
      goto(url) {
        uni.navigateTo({
          url: url
        })
      },
      goOut() {
        const that = this
        uni.showModal({
          title: '确认退出账号?',
          success(res) {
            if (res.confirm) {
              // that.$store.dispatch('signOut').then(() => {
              //   uni.reLaunch({
              //     url: '/pages/login/login'
              //   });
              // })
              that.webSocket.close();
              that.$store.dispatch('signOut');
            }
          }
        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  .linkList {
    padding-left: 30rpx;
    background: #fff;
    overflow: hidden;

    .listItem {
      padding: 30rpx;
      padding-left: 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 1px;
        background: #e6e6e6;
        width: 100%;
      }

      .title {
        font-size: 30rpx;
        color: #333;
      }

      .vule {
        font-size: 30rpx;
        color: #666;
        margin-right: 20rpx;
      }
    }
  }

  .submit_btn {
    position: relative;
    background: #fff !important;
    color: #E45B5B;
    bottom: 0;
    margin-top: 30rpx;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
  }
</style>
