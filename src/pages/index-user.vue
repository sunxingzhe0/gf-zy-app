<template>
  <view class="mainVieW" v-if="userInfo.clientType == 'USER'">
    <video-invitation />
    <home ref="home" v-if="active == 0"></home>
    <room ref="room" v-else-if="active == 1"></room>
    <me ref="me" v-else-if="active == 2"></me>
    <!-- 底部tabbar -->
    <tabbar class="fixs" ref="commentTabbat" :actives="active"></tabbar>
  </view>
</template>
<script>
import home from './user/home/home.vue'
import room from './user/room/room.vue'
import me from './user/me/me.vue'
import tabbar from '../components/tabbar/tabbar.vue'
export default {
  name: 'mains',
  data() {
    return {
      active: Number || 0,
    }
  },
  components: {
    home,
    room,
    me,
    tabbar,
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    wx.hideHomeButton()
    // #endif

    const temp = uni.getStorageSync('setStatusIndexFunc') || 0
    this.active = temp
    uni.setStorageSync('setStatusIndexFunc', temp)
    this.webSocket.connectSocket()
    // this.$store.dispatch('getListByType') //用户端没有权限访问这个接口
  },
  onShow() {
    if (this.active === 1) {
      this.$refs.room?.onPullDown()
      this.$refs.room?.openMonitor()
    } else if (this.active === 0) {
      this.$refs.home?.getpatientList()
    }
  },
  onHide() {
    if (this.active === 1) {
      this.$refs.room.destroyMonitor()
    }
  },
  provide() {
    return {
      _mainFuncInit: this._mainFuncInit,
    }
  },
  onPullDownRefresh() {
    this.active === 1 && this.$refs.room?.onPullDown()

    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    this.active === 1 && this.$refs.room?.onBottom()
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
            // this.$refs.room.getData();
            break
          case 2:
            uni.setStorageSync('setStatusIndexFunc', 2)
            // this.$refs.me.getData();
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
