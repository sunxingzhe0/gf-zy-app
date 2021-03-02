<template>
  <view style="padding-top: 12px;">
    <view class="box-shadow" style="margin:0 20rpx;margin-top: 0;background: #fff;overflow: hidden;">
      <uni-list class="inputWrap">
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">手机号</view>
            <input type="number" class="flex_1" v-model="phone" maxlength="11" placeholder-style="color:#ccc;font-size: 30rpx;"
              placeholder="请输入手机号" />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">验证码</view>
            <input type="number" v-model="code" class="flex_1" placeholder-style="color:#ccc;font-size: 30rpx;"
              placeholder="请输入验证码" />
            <view class="getcode">
              <text v-if="passClick" @click="getcode">获取验证码</text>
              <text v-else>{{ timecode }}s后重新获取</text>
            </view>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
    <!--#ifdef MP-WEIXIN-->
    <button class="submit_btn passwordBtn" open-type="getUserInfo" @getuserinfo="login">确定</button>
    <!-- #endif-->
    <!--#ifdef H5-->
    <view class="submit_btn passwordBtn" @click="login()">确定</view>
    <!-- #endif-->
    <!-- <button class="submit_btn passwordBtn" @click="login" type="primary">确定</button> -->
  </view>
</template>
<script>
  import {
    verificationCode,
    bindingMiniProgram,
    finMiniProgramAuth
  } from '@/common/request/index';
  export default {
    data() {
      return {
        timecode: 60,
        passClick: true,
        minToken: ''
      };
    },
    methods: {
      async login(e) {
        let that = this;
        if (this.phone == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入手机号'
          });
          return;
        }
        if (this.code == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入验证码'
          });
          return;
        }
        let data = {};
        data.phone = this.phone;
        data.code = this.code;
        bindingMiniProgram(data).then(async res => {
          await this.getfinMiniProgramAuth(res);
          if (e) {
            await this.$store.dispatch('encryptedData', {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            });
            //#ifdef H5 || APP-PLUS
            this.$store.dispatch('h5LoginInfo');
            //#endif
            //#ifndef H5 || APP-PLUS
            this.$store.dispatch('loginInfo');
            //#endif


          } else {
            if (!res.wxBinding) {
              //#ifdef H5 || APP-PLUS
              this.$store.dispatch('h5LoginInfo');
              //#endif
              //#ifndef H5 || APP-PLUS
              uni.reLaunch({
                url: '/pages/login/excessive'
              });
              //#endif
            } else {
              //#ifdef H5 || APP-PLUS
              this.$store.dispatch('h5LoginInfo');
              //#endif
              //#ifndef H5 || APP-PLUS
              this.$store.dispatch('loginInfo');
              //#endif
            }
          }
        });
      },
      async getfinMiniProgramAuth(bizToken) {
        let info = await finMiniProgramAuth({
          bizToken
        });
        uni.setStorageSync('token', info.token);
        uni.setStorageSync('imToken', info.imToken);
        uni.setStorageSync('userId', info.userId);
      },
      getcode() {
        if (this.phone == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入手机号'
          });
          return false;
        }

        verificationCode({
          phone: this.phone,
          type: 'LOGIN'
        }).then(res => {
          this.passClick = false;
          this.reserveCode();
          uni.showToast({
            icon: 'none',
            title: '发送成功'
          });
        });
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
      }
    }
  };
</script>
<style lang="scss" scoped>
  .tip {
    padding: 40rpx 15px;
    padding-bottom: 10rpx;
    font-size: 24rpx;
    color: #666;
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
  }

  .passwordBtn {
    position: relative;
    margin-top: 30rpx;
    bottom: 0;
  }
</style>
