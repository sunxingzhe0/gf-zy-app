<template>
  <view class="loginWrap">
    <view class="loginTop">
      <image class="bg" :src="FILE_URL_BUILT_IN('loginBg.png')"></image>
      <image class="logo" :src="require('@/static/logo.png')"></image>
      <!-- <view class="tab flex-between">
        <view :class="type == 1 ? 'on' : ''" @click="type = 1">手机</view>
        <view :class="type == 2 ? 'on' : ''" @click="type = 2">账号</view>
      </view> -->
    </view>
    <view class="loginMain box-shadow">
      <view class="formItem flex-between" v-if="type == 1">
        <view class="iconLeft"
          ><text class="iconfont icon-ico_login_phone"></text
        ></view>
        <input
          class="input"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="inputplaceholder"
          v-model="phone"
          type="number"
        />
        <view style="padding-left: 20rpx" @click="dele('phone')">
          <image class="delIcon" :src="require('@/static/del.png')"></image>
        </view>
      </view>
      <view class="formItem flex-between" v-if="type == 1">
        <view class="iconLeft"
          ><text class="iconfont icon-yanzhengma"></text
        ></view>
        <input
          type="number"
          class="input"
          v-model="code"
          placeholder-class="inputplaceholder"
          placeholder="请输入短信验证码"
        />
        <view class="getcode">
          <text v-if="passClick" @click="getcode">获取验证码</text>
          <text v-else>{{ timecode }}s后重新获取</text>
        </view>
      </view>
      <view class="formItem flex-between" v-if="type == 2">
        <view class="iconLeft"><text class="iconfont icon-yonghu"></text></view>
        <input
          class="input"
          placeholder="请输入账号"
          placeholder-class="inputplaceholder"
          v-model="account"
          type="text"
        />
        <view style="padding-left: 20rpx" @click="dele('account')">
          <image class="delIcon" :src="require('@/static/del.png')"></image>
        </view>
      </view>
      <view class="formItem flex-between" v-if="type == 2">
        <view class="iconLeft"><text class="iconfont icon-mima"></text></view>
        <input
          class="input"
          placeholder="请输入密码"
          placeholder-class="inputplaceholder"
          v-model="password"
          :password="!isOpen"
          type="text"
        />
        <view style="padding-left: 20rpx">
          <image
            class="delIcon"
            :src="require('@/static/del.png')"
            style="margin-right: 16rpx"
            @click="dele('password')"
          ></image>
          <text
            @click="isOpen = !isOpen"
            :class="[
              'iconfont',
              'passwordIcon',
              isOpen ? 'icon-yanjing' : 'icon-biyan-copy',
            ]"
          ></text>
        </view>
      </view>
      <view class="flex-between agreeWrap">
        <view class="flex-start-center">
          <!-- <evan-checkbox
            v-model="checked"
            shape="square"
            :primary-color="primaryColor"
            ><text class="checkText">我同意</text></evan-checkbox
          > -->
          <text class="agree" v-if="agreement.name" @click="agree"
            >《{{ agreement.name }}》</text
          >
        </view>
        <text class="agree" v-if="type == 2">忘记密码</text>
      </view>
      <button class="loginBtn" @click="handleLogin">登 录</button>
    </view>

    <view class="forget" @click="toUserIndex">返回患者首页</view>

    <image class="gb" :src="require('@/static/loginBgB.png')"></image>
    <uni-popup ref="popup" type="center">
      <view class="selectWrap">
        <view class="title">{{ agreement.title }}</view>
        <scroll-view class="agreeMain" scroll-y="true">
          <view v-html="agreement.content"></view>
        </scroll-view>
        <view class="selectbtn" @click="close"><text>知道了</text></view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
// import {
//   verificationCode,
//   showAgreement,
//   encryptedDataByApp,
// } from "@/common/request/index";
// import MD5 from "crypto-js/md5";
export default {
  data() {
    return {
      isTodoctor: false,
      token: uni.getStorageSync("token"),
      type: 2,
      isOpen: false,
      account: "",
      password: "",
      phone: "",
      code: "",
      primaryColor: "#0AB2C1",
      timecode: 60,
      passClick: true,
      checked: false,
      miniToken: "",
      agreement: {},
    };
  },

  onLoad(options) {
    // #ifdef MP-WEIXIN
    // wx.hideHomeButton()
    // #endif
    // if (this.token) {
    // this.$store.dispatch('loginInfo')
    // }
    // uni.setStorageSync('orgId', options.orgId || 'H000000001')
    // this.getshowAgreement()
    //手机端微信登录回调方法
    // #ifdef H5
    // window.loginCode = value => this.loginCode(value)
    // window.wxLoginInfo = value => this.wxLoginInfo(value)
    // #endif
  },
  onShow() {
    // uni.$on('caBack', () => {
    //   this.isTodoctor = true
    // })
  },

  methods: {
    toUserIndex() {
      uni.navigateTo({
        url: "/pages/index/index",
      });
    },
    // 获取协议
    // async getshowAgreement() {
    //   this.agreement = await showAgreement({
    //     genre: 3,
    //   })
    // },
    dele(name) {
      this[name] = "";
    },
    //h5微信登录
    h5WxLogin() {
      if (uni.getSystemInfoSync().platform == "android") {
        window.app.wxLogin("login");
      } else {
        window.webkit.messageHandlers.wxLogin.postMessage("login");
      }
    },
    //移动端微信登录code传入
    loginCode(code) {
      if (code) {
        uni.showLoading({
          title: "登录中, 请稍后...",
        });
        // 调用获取用户信息（有显示/没有 患者端 获取微信中的用户信息 ）
        this.$store
          .dispatch("h5MiniProgramLogin", { loginCode: code })
          .then((minRes) => {
            if (minRes.hasAccount) {
              this.$store.dispatch("h5LoginInfo");
            } else {
              uni.navigateTo({
                url: "/pages/login/bindAccount",
              });
            }
          });
      }
      return code;
    },
    /***
     *将微信登录后获取的信息绑定到后端（已经改为接口直接获取信息无需再次获取）
     */
    // wxLoginInfo(info) {
    //   if (info) {
    //     var map = eval('(' + info + ')')
    //     encryptedDataByApp(map).then(data => {})
    //   }

    //   return map
    // },
    getInfo(type) {
      uni.showLoading({
        title: "登录中",
      });
      this.$store
        .dispatch("miniProgramLogin")
        .then((minRes) => {
          if (minRes.hasAccount) {
            this.$store.dispatch("loginInfo");
          } else {
            uni.navigateTo({
              url: "/pages/login/bindAccount",
            });
          }
        })
        .finally(() => uni.hideLoading());
    },
    goto(url) {
      uni.navigateTo({
        url,
      });
    },
    async handleLogin() {
      uni.navigateTo({
        url: "/pages/pages-doctor/index/index",
      });
      return;
      if (this.account == "") {
        uni.showToast({
          icon: "none",
          title: "请输入账号",
        });
        return;
      }
      if (this.password == "") {
        uni.showToast({
          icon: "none",
          title: "请输入密码",
        });
        return;
      }
      if (!this.checked) {
        uni.showToast({
          icon: "none",
          title: "请同意用户隐私条款",
        });
        return;
      }
      //是否前往签名
      // if (!this.isTodoctor) {
      //   return uni.navigateTo({
      //     url: '/pages-doctor/autograph/autograph',
      //   })
      // }

      uni.showLoading({
        title: "登录中",
      });
      await this.$store.dispatch("accountLogin", {
        account: this.account,
        password: MD5(this.password).toString(),
      });

      //#ifdef H5||APP-PLUS
      this.$store.dispatch("h5LoginInfo");
      // #endif

      //#ifdef MP-WEIXIN
      this.$store.dispatch("loginInfo");
      // #endif
    },
    agree() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    getcode() {
      if (this.phone == "") {
        uni.showToast({
          icon: "none",
          title: "请输入手机号",
        });
        return false;
      }

      // verificationCode({
      //   phone: this.phone,
      //   type: 'LOGIN',
      // }).then(res => {
      //   this.passClick = false
      //   this.reserveCode()
      //   uni.showToast({
      //     icon: 'none',
      //     title: '发送成功',
      //   })
      // })
    },
    reserveCode() {
      var time = 60;
      var timer = setInterval(() => {
        this.timecode = time--;
        //60s后停止定时器
        if (this.timecode === 0) {
          this.passClick = true;
          this.timecode = 60;
          clearInterval(timer);
        }
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.loginWrap {
  position: relative;
  height: 100%;

  .gb {
    width: 100%;
    height: 281rpx;
    position: absolute;
    bottom: 0;
  }
}

.loginTop {
  width: 100%;
  height: 438rpx;
  padding-top: 80rpx;
  box-sizing: border-box;

  .bg {
    width: 100%;
    height: 438rpx;
    position: absolute;
    top: 0;
    left: 0;
  }

  .logo {
    width: 121rpx;
    height: 120rpx;
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 3;
  }

  .tab {
    width: 472rpx;
    height: 88rpx;
    padding: 4rpx;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 44rpx;
    margin: 0 auto;
    margin-top: 80rpx;
    position: relative;
    z-index: 3;

    view {
      width: 230rpx;
      color: #fff;
      font-size: 30rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-weight: 600;

      &.on {
        background: #fff;
        color: $uni-color-primary;
      }
    }
  }
}

.loginMain {
  background: #fff;
  margin: 0 40rpx;
  margin-top: -40rpx;
  padding: 40rpx 60rpx;
  padding-bottom: 0;
  position: relative;
  z-index: 4;

  .formItem {
    padding: 20rpx 0;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 30rpx;

    .input {
      flex: 1;
      font-size: 30rpx;
      color: #333;
      border: 0;
    }

    .inputplaceholder {
      color: #999;
      font-size: 30rpx;
    }

    .delIcon {
      width: 30rpx;
      height: 30rpx;
    }

    .passwordIcon {
      color: #999;
    }

    .iconLeft {
      width: 50rpx;
      height: 50rpx;
      color: $uni-color-primary;
      background: rgba(10, 178, 193, 0.15);
      border-radius: 50%;
      text-align: center;
      line-height: 50rpx;
      margin-right: 30rpx;
    }

    .getcode {
      color: $uni-color-primary;
      font-size: 26rpx;
    }
  }

  ::v-deep.evan-checkbox__label {
    font-size: 28rpx;
  }

  ::v-deep.evan-checkbox__inner {
    width: 28rpx !important;
    height: 28rpx !important;
  }

  .agree {
    font-size: 24rpx;
    color: $uni-color-primary;
    line-height: 24rpx;
  }

  .loginBtn {
    height: 88rpx;
    background: $uni-color-primary;
    border-radius: 44rpx;
    box-shadow: 6rpx 8rpx 15rpx 0rpx rgba(10, 178, 193, 0.15);
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    line-height: 88rpx;
    position: relative;
    top: 40rpx;
  }
}

.checkText {
  font-size: 24rpx;
  color: #666;
}

.forget {
  font-size: 26rpx;
  color: $uni-color-primary;
  text-align: center;
  margin-top: 60rpx;
  position: relative;
  z-index: 4;
}

.wxbtn {
  padding: 0;
  background: none;
  margin-top: 60rpx;
  position: relative;
  z-index: 4;

  &::after {
    border: 0;
  }

  image {
    width: 84rpx;
    height: 84rpx;
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
    font-size: 26rpx;
    max-height: 439rpx;
    color: #666;
    line-height: 46rpx;
    padding: 30rpx;
    width: auto;
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
</style>
