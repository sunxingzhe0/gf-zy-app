<template>
  <view class="mainVieW">
    <home ref="home" v-if="active == 0"></home>
    <user ref="user" v-if="active == 1"></user>

    <!-- 底部tabbar -->

    <tabbar
      v-if="userInfo.clientType != 'DRUG_DOC'"
      class="fixs"
      ref="commentTabbat"
      :actives="active"
    ></tabbar>
  </view>
</template>
<script>
import home from './doctor/home/home.vue'
import user from './doctor/user/user.vue'
import tabbar from '../components/tabbar/tabbar-doctor.vue'
import { mapActions } from 'vuex'
export default {
  name: 'mains',
  data() {
    return {
      active: Number || 0,
      isshow: false, //资质未认证弹框
    }
  },
  components: {
    home,
    user,
    tabbar,
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad() {
    const temp = uni.getStorageSync('setStatusIndexFunc') || 0
    this.active = temp
    uni.setStorageSync('setStatusIndexFunc', temp)

    this.webSocket.connectSocket()

    //存储药品类型、使用频率、用药途径枚举表
    this.$store.dispatch('getListByType')

    // this.$nextTick(() => {
    //   this.$refs.commentTabbat.getSetting(temp)
    //   this._initData();
    // })
  },
  onShow() {
    // #ifdef MP-WEIXIN
    wx.hideHomeButton()
    // #endif

    this.$nextTick(() => {
      if (this.active == 1) {
        this.$refs.user.getorderCount()
        if (this.isshow) {
          this.$refs.user.isexamineOpen()
        }
      } else {
        this.$refs.home.getSessionMessage()
      }
    })
  },
  onHide() {
    this.isshow = false
  },
  provide() {
    return {
      _mainFuncInit: this._mainFuncInit,
    }
  },
  methods: {

    /**
     * @name 公共点击函数
     * */
    _mainFuncInit() {
      this.active = uni.getStorageSync('setStatusIndexFunc') || 0
      if (this.tempActive == this.active) {
        return
      }
      this.$nextTick(() => {
        switch (this.active) {
          case 0:
            uni.setStorageSync('setStatusIndexFunc', 0)
            // this.$refs.home.getData();
            break
          case 1:
            uni.setStorageSync('setStatusIndexFunc', 1)
            this.$store.dispatch('loginInfo', true)
            break
          case 2:
            uni.setStorageSync('setStatusIndexFunc', 2)
            // this.$refs.me.getData();
            break
        }
      })
      this.tempActive = this.active
    },
    /**
     * @name 首页数据初始化
     * */
    _initData() {
      this._mainFuncInit()
    },
  },
}
</script>
<style scoped>
.fixs {
  position: fixed;
  z-index: 100;
}
</style>
