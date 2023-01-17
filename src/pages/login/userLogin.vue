<template>
  <view class="user-pages">
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
          <button
            class="button"
            :style="{ color: '#666' }"
            @click="unAuthlogin"
          >
            取消
          </button>
          <button class="button" @click="getAuth" :style="{ color: '#0ab2c1' }">
            确认授权
          </button>
        </view>
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
    this.login() //登录定位问题
    // if (clientType && clientType.indexOf('DOC') > -1) {
    //   uni.redirectTo({
    //     url: '/pages/login/login',
    //   })
    // } else {
    //   this.login()
    // }
  },
  methods: {
    async login() {
      uni.showLoading({
        title: '查询登录信息',
      })
      //登录前先清除缓存
      await this.$store.dispatch('handelRemoveStorage')
      this.webSocket.close()
      this.$store
        .dispatch('miniUserRegLogin')
        .then(async data => {
          if (data.username && data.username !== '微信用户') {
            await this.$store.dispatch('loginInfo', null, this.redirect)
            this.webSocket.connectSocket()
          } else {
            this.showAuth = true
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
      uni.showLoading({
        title: '登录中',
      })
      uni.getUserProfile({
        desc: '完善用户信息',
        lang: 'zh_CN',
        success: async info => {
          await this.$store.dispatch('encryptedData', info)
          this.$store.dispatch('loginInfo', null, this.redirect)
        },
        complete: () => uni.hideLoading(),
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.user-pages {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login-bg.jpg');
  background-size: 100%;
}
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
