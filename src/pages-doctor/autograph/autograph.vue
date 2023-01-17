<template>
  <view>
    <verify-code
      :auth="auth"
      :userPhone="userPhone"
      callBackUrl="null"
      :needModal="true"
      id="myComponent"
      @back="back"
      @signFinished="signFinished"
    ></verify-code>
  </view>
</template>

<script>
import { scanNotify } from '@/common/request/index'
export default {
  options: {
    // 微信小程序中 options 选项
    addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
  },
  data() {
    return {
      code: null,
      opOhone: null,
      myComponent: null,
      //
      auth:
        'APPCODE 1649994196269  FCOzNvGRyMFfX6MDwSdY1UHs  nrN4TML5DMg79Walamg7uXW6j2jutUkH',
      userPhone:
        this.$store.state.codePhone || this.$store.state.userInfo.phone, //用户手机号(优先取扫码保存的,组件原因不可加载页面后赋值，需保存好手机再进入页面)
      callBackUrl: null,
    }
  },
  onLoad(options) {
    //扫码带入的code
    if (options.code) {
      this.code = options.code
    }
  },
  onShow() {
    this.$store.commit('setCodePhone', null) //销毁扫码保存的phone
    this.myComponent = this.selectComponent('#myComponent') //myComponent为组件id
    this.myComponent.getUser()
  },
  methods: {
    //签字完成的自执行回调
    signFinished(e) {
      console.log(e.detail.result, '签名完成=')
      if (this.code) {
        this.successBack()
      }
    },
    //回调通知web端停止轮询
    async successBack() {
      await scanNotify({ code: this.code })
    },
    //签字结束的返回按钮执行的方法
    back(e) {
      console.log(e)
      uni.$emit('caBack', e)
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
