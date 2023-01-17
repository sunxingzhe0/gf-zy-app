<template>
  <view>
    <!--主页按钮-->
    <homeIcom />
    <view class="tip"
      >请输入{{
        userInfo.phone && !userInfo.hasAuth && active < 1 ? '已绑定的' : '新'
      }}手机号，填写验证码</view
    >
    <view
      class="box-shadow"
      v-if="active < 1"
      style="margin: 0 30rpx; background: #fff; overflow: hidden;margin-top: 20rpx;"
    >
      <uni-list class="inputWrap">
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">手机号</view>
            <input
              type="number"
              v-model="oldForm.phone"
              disabled
              class="flex_1"
              maxlength="11"
              placeholder-style="color:#ccc;font-size: 30rpx;"
              placeholder="请输入已绑定的手机号码"
            />
          </view>
        </uni-list-item>
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">验证码</view>
            <input
              type="number"
              v-model="oldForm.code"
              class="flex_1"
              placeholder-style="color:#ccc;font-size: 30rpx;"
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
    <view
      class="box-shadow"
      v-else
      style="margin: 0 30rpx; background: #fff; overflow: hidden;margin-top: 20rpx;"
    >
      <uni-list class="inputWrap">
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">手机号</view>
            <input
              type="number"
              v-model="phone"
              class="flex_1"
              maxlength="11"
              placeholder-style="color:#ccc;font-size: 30rpx;"
              placeholder="请输入要绑定的手机号码"
            />
          </view>
        </uni-list-item>
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">验证码</view>
            <input
              type="number"
              v-model="code"
              class="flex_1"
              placeholder-style="color:#ccc;font-size: 30rpx;"
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
    <button class="submit_btn" type="primary" @click="submit">
      {{ active > 0 ? '提交' : '下一步' }}
    </button>
  </view>
</template>

<script>
import {
  validateOldPhone,
  resetPhone,
  bindPhone,
  finishFirstBindPhone,
  verificationCode,
  finishResetPhone,
} from '@/common/request/index'
export default {
  data() {
    this.isFromAuth = false
    return {
      timecode: 60,
      phone: '',
      code: '',
      passClick: true,
      active: 0,
      oldForm: {
        phone: this.$store.state.userInfo.phone,
        code: '',
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad(options) {
    if (options.auth) {
      this.isFromAuth = true
    }
  },
  created() {
    if (!this.userInfo.phone) {
      this.active = 1
      this.phone = this.userInfo.prestorePhone || ''
      uni.setNavigationBarTitle({
        title: '绑定手机号',
      })
    } else {
      this.active = this.userInfo.hasAuth ? 1 : 0
      uni.setNavigationBarTitle({
        title: '更换手机号',
      })
    }
  },
  methods: {
    async submit() {
      if (this.active == 0) {
        if (this.oldForm.phone == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入手机号',
          })
          return false
        }
        if (this.oldForm.code == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入验证码',
          })
          return false
        }
        let res = await validateOldPhone(this.oldForm)
        if (res) {
          this.reserveCode(true)
          this.active = 1
        }
      } else {
        if (this.phone == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入手机号',
          })
          return false
        }
        if (this.code == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入验证码',
          })
          return false
        }
        const func = this.$store.state.userInfo.phone ? resetPhone : bindPhone
        let res = await func({
          phone: this.phone,
          code: this.code,
        })
        if (res) {
          this.getfinishResetPhone(res)
        }
      }
    },
    // 人脸识别回调
    async getfinishResetPhone(bizToken) {
      const func = this.$store.state.userInfo.phone
        ? finishResetPhone
        : finishFirstBindPhone
      const res = await func({
        bizToken,
      })
      if (res) {
        await this.$store.dispatch('loginInfo', true)
        if (this.isFromAuth) {
          uni.navigateTo({
            url: '/pages-doctor/user/attestation/index',
          })
        } else {
          uni.navigateBack({
            delta: 1,
          })
        }
      }
    },
    getcode() {
      if (this.active == 0) {
        if (this.oldForm.phone == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入手机号',
          })
          return false
        }
      } else {
        if (this.phone == '') {
          uni.showToast({
            icon: 'none',
            title: '请输入手机号',
          })
          return false
        }
      }
      verificationCode({
        phone: this.active == 0 ? this.oldForm.phone : this.phone,
        type: this.active == 0 ? 'VALIDATE' : 'BINDING',
      }).then(res => {
        this.passClick = false
        this.reserveCode()
        uni.showToast({
          icon: 'none',
          title: '发送成功',
        })
      })
    },
    reserveCode(a) {
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
      if (a) {
        this.passClick = true
        this.timecode = 60
        clearInterval(timer)
      }
    },
  },
}
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
    margin-right: 10rpx;
    font-size: 30rpx;
    color: #666;
    width: 140rpx;
  }

  .getcode {
    color: $uni-color-primary;
  }
}
</style>
