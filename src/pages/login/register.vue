<template>
  <view class="loginWrap" style="padding-top: 80rpx;">
    <image class="logo" :src="require('@/assets/logoA.png')"></image>
    <view
      class="box-shadow"
      style="margin: 0 20rpx;background: #fff; overflow: hidden;padding-left: 30rpx;"
    >
      <uni-list class="inputWrap">
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">姓&emsp;名</view>
            <input
              type="text"
              class="flex_1"
              v-model="form.name"
              placeholder-class="inputplaceholder"
              placeholder="请输入姓名"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">身份证</view>
            <input
              type="idcard"
              class="flex_1"
              v-model="form.idCard"
              placeholder-class="inputplaceholder"
              placeholder="请输入身份证"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">手机号</view>
            <input
              type="number"
              class="flex_1"
              v-model="form.phone"
              maxlength="11"
              placeholder-class="inputplaceholder"
              placeholder="请输入手机号"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">验证码</view>
            <input
              type="number"
              class="flex_1"
              v-model="form.code"
              placeholder-class="inputplaceholder"
              placeholder="请输入验证码"
            />
            <view class="getcode">
              <text v-if="passClick" @click="getcode">获取验证码</text>
              <text v-else>{{ timecode }}s后重新获取</text>
            </view>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
    <view class="flex-start-center agreeWrap">
      <evan-checkbox
        v-model="checked"
        shape="square"
        :primary-color="primaryColor"
        ><text class="checkText">我同意</text></evan-checkbox
      >
      <text class="agree" @click="agree">《{{ agreement.name }}》</text>
    </view>
    <!--#ifdef MP-WEIXIN-->
    <button
      class="submit_btn"
      style="position: relative; bottom: 0;"
      type="primary"
      open-type="getUserInfo"
      @getuserinfo="login"
    >
      立即注册
    </button>
    <!-- #endif-->
    <!--#ifdef H5-->
    <button
      class="submit_btn"
      style="position: relative; bottom: 0;"
      type="primary"
      @click="login()"
    >
      立即注册
    </button>
    <!-- #endif-->
    <view class="forget" @click="back">已有账号，前往登录</view>

    <uni-popup ref="popup" type="center">
      <view class="selectWrap">
        <view class="title">{{ agreement.title }}</view>
        <scroll-view class="agreeMain" scroll-y="true"
          ><view v-html="agreement.content"></view
        ></scroll-view>
        <view class="selectbtn" @click="close"><text>知道了</text></view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  register,
  verificationCode,
  finRegisterAuth,
  showAgreement,
} from '@/common/request/index'
export default {
  data() {
    return {
      form: {
        name: '',
        idCard: '',
        phone: '',
        code: '',
      },
      timecode: 60,
      passClick: true,
      checked: false,
      primaryColor: '#0AB2C1',
      agreement: {},
    }
  },
  onLoad() {
    this.getshowAgreement()
  },
  methods: {
    // 获取协议
    async getshowAgreement() {
      this.agreement = await showAgreement({
        genre: 0,
      })
    },
    agree() {
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
    getcode() {
      if (this.form.phone == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入手机号',
        })
        return false
      }

      verificationCode({
        phone: this.form.phone,
        type: 'REGISTER',
      }).then(res => {
        this.passClick = false
        this.reserveCode()
        uni.showToast({
          icon: 'none',
          title: '发送成功',
        })
      })
    },
    async login(e) {
      let that = this
      if (this.form.name == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入姓名',
        })
        return false
      }
      if (this.form.idCard == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入身份证',
        })
        return false
      }
      if (this.form.phone == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入手机号',
        })
        return false
      }
      if (this.form.code == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入验证码',
        })
        return false
      }
      if (!this.checked) {
        uni.showToast({
          icon: 'none',
          title: '请勾选医院互联网医院患者知情同意书',
        })
        return false
      }
      // #ifdef MP-WEIXIN
      await that.$store.dispatch('miniProgramLogin')
      // #endif
      register(that.form).then(async res => {
        if (res) {
          await this.getfinRegisterAuth(res, e)
        }
      })
    },
    // 人脸识别回调
    async getfinRegisterAuth(bizToken, e) {
      let info = await finRegisterAuth({
        bizToken,
      })
      uni.setStorageSync('token', info.token)
      uni.setStorageSync('imToken', info.imToken)
      uni.setStorageSync('userId', info.userId)
      // #ifdef MP-WEIXIN
      await this.$store.dispatch('encryptedData', e)
      // #endif
      uni.redirectTo({
        url: '/pages/login/setPassword',
      })
    },
    reserveCode() {
      var time = 60
      var timer = setInterval(() => {
        this.timecode = time--
        //60s后停止定时器
        if (this.timecode === 0) {
          this.passClick = true
          this.timecode = 60
          clearInterval(timer)
        }
      }, 1000)
    },
    back() {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  width: 141rpx;
  height: 140rpx;
  display: block;
  margin: 0 auto;
  margin-bottom: 80rpx;
}

.inputWrap {
  .title {
    margin-right: 98rpx;
    font-size: 30rpx;
    color: #666;
  }

  .getcode {
    color: $uni-color-primary;
  }

  .inputplaceholder {
    color: #ccc;
    font-size: 30rpx;
  }
}

.loginWrap {
  ::v-deep.evan-checkbox__label {
    font-size: 28rpx;
  }

  ::v-deep.evan-checkbox__inner {
    width: 16px !important;
    height: 16px !important;
  }

  .checkText {
    font-size: 24rpx;
    color: #666;
  }

  .agreeWrap {
    margin-top: 30rpx;
    padding: 0 50rpx;
    margin-bottom: 40rpx;
  }

  .agree {
    font-size: 24rpx;
    color: $uni-color-primary;
    line-height: 24rpx;
  }
}

.selectWrap {
  width: 640rpx;
  border-radius: 20rpx;
  background: #fff;
  padding: 40rpx 0;
  padding-bottom: 0;

  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .agreeMain {
    width: auto;
    font-size: 26rpx;
    color: #666;
    line-height: 46rpx;
    padding: 30rpx;
    max-height: 439rpx;
  }

  .selectbtn {
    border-top: 1px solid #e6e6e6;
    padding: 30rpx;
    color: $uni-color-primary;
    width: 100%;
    font-size: 32rpx;
    text-align: center;
    box-sizing: border-box;
  }
}

.forget {
  width: 100%;
  font-size: 26rpx;
  color: $uni-color-primary;
  text-align: center;
  margin-top: 30rpx;
}
</style>
