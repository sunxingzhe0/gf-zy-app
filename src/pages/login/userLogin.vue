<template>
  <view class="page" v-if="showAuth">
    <view class="container">
      <view class="title">微信授权</view>
      <view class="body">
        <view class="avatar">
          <open-data type="userAvatarUrl"></open-data
        ></view>
        <view class="content">互联网医院申请获得以下权限：</view>
        <view class="desc">· 获得你的公开信息（昵称、头像等）</view>
      </view>
      <view class="footer">
        <button class="button" :style="{ color: '#666' }" @click="unAuthlogin">
          取消
        </button>
        <button
          class="button"
          open-type="getUserInfo"
          @getuserinfo="login"
          :style="{ color: '#0ab2c1' }"
        >
          确认授权
        </button>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      redirect: '',
      showAuth: false,
    }
  },
  onLoad(options) {
    this.redirect = options.url || ''
    uni.setStorageSync('orgId', options.orgId ?? 'H000000001')
  },
  onShow() {
    const clientType = uni.getStorageSync('clientType')
    if (clientType && clientType.indexOf('DOC') > -1) {
      uni.redirectTo({
        url: '/pages/login/login',
      })
    } else {
      this.login()
    }
  },
  methods: {
    login() {
      uni.showLoading({
        title: '登录中',
      })
      this.$store
        .dispatch('miniUserRegLogin')
        .then(data => {
          if (data.username) {
            this.$store.dispatch('loginInfo', null, this.redirect)
          } else {
            this.getAuth()
          }
        })
        .finally(() => uni.hideLoading())
    },
    unAuthlogin() {
      uni.showLoading({
        title: '登录中',
      })
      this.$store
        .dispatch('miniUserRegLogin')
        .then(() => this.$store.dispatch('loginInfo', null, this.redirect))
        .finally(() => uni.hideLoading())
    },
    getAuth() {
      uni.getSetting({
        success: res =>
          res.authSetting['scope.userInfo']
            ? uni.getUserInfo({
                provider: 'weixin',
                success: async info => {
                  await this.$store.dispatch('encryptedData', info)
                  this.$store.dispatch('loginInfo', null, this.redirect)
                },
              })
            : (this.showAuth = true),
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
.container {
  margin: auto;
  width: 80vw;
  background-color: #fff;
  border-radius: 24rpx;
}
.title {
  line-height: 100rpx;
  text-align: center;
  border-bottom: 2rpx solid #e6e6e6;
  font-size: 32rpx;
  color: #333;
}
.body {
  padding: 28rpx 28rpx 0;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  margin: auto;
  border-radius: 50%;
  overflow: hidden;
}
.content {
  padding: 24rpx 0;
  font-size: 26rpx;
  color: #333;
}
.desc {
  padding: 24rpx 0;
  border-top: 2rpx solid #e6e6e6;
  font-size: 24rpx;
  color: #666;
}
.footer {
  display: flex;
  justify-content: space-between;
  border-top: 2rpx solid #e6e6e6;
}
.button {
  width: 50%;
  line-height: 88rpx;
  border-radius: 0;
  background-color: transparent;
  font-size: 32rpx;

  &::after {
    border: none;
  }
  & + .button {
    border-left: 2rpx solid #e6e6e6;
  }
}
</style>
