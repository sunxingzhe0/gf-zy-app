<template>
  <view class="mainVieW" v-if="userInfo.clientType == 'USER'">
    <video-invitation />
    <home ref="home" v-show="active == 0"></home>
    <room ref="room" v-show="active == 1"></room>
    <me ref="me" v-show="active == 2"></me>
    <!-- 底部tabbar -->
    <tabbar class="fixs" ref="commentTabbat" :actives="active"></tabbar>
    <uni-popup ref="supplement" type="bottom">
      <view class="pop-content">
        <view class="pop-top">
          <view style="flex:1;text-align:center;font-size:30rpx;color:1a1a1a"
            >电子健康卡信息完善</view
          >
          <image
            @click="closePop"
            class="pop-close"
            :src="require('@/assets/close-popup.png')"
            style="width:30rpx;height:30rpx"
          ></image>
        </view>
        <view class="pop-msg">请完善您和就诊人之间的关系：</view>
        <view class="pop-title">
          <view>就诊人姓名</view>
          <view>关系</view>
        </view>
        <scroll-view :class="{ week }" class="scroll-pop" scroll-y>
          <view class="scoll-item" v-for="(item, i) in memberList" :key="i">
            <view class="left left-right" style="width:50%">
              <view class="name">{{ item.name }}</view>
            </view>
            <view class="right left-right" style="width:50%">
              <picker
                @change="changeSelect(i, $event)"
                :value="item.relation"
                :range="relations"
              >
                <view class="name"
                  ><view
                    style="width:100%;margin-right: 20rpx;"
                    v-if="item.relation || item.relation == 0"
                    >{{ relations[item.relation] }}</view
                  ><input v-else type="text" disabled placeholder="请选择"
                /></view>
              </picker>
            </view>
          </view>
        </scroll-view>
        <view class="pop-confirm" @click="confirmPop">确定</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import home from './user/home/home.vue'
import room from './user/room/room.vue'
import me from './user/me/me.vue'
import tabbar from '../components/tabbar/tabbar.vue'
import { checkRelation, updateRelation } from '@/common/request/user'
import { saveSystemInfo } from '@/common/request/user'
export default {
  name: 'mains',
  data() {
    const relations = ['本人', '父母', '子女', '夫妻', '亲属', '朋友', '其他']
    return {
      relations,
      active: Number || 0,
      memberList: [{ relation: null }, { relation: 1 }, { relation: 1 }],
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
  created() {
    this.checkRelation()
    this.getSystemInfo() //获取系统信息
  },
  mounted() {},
  onLoad() {
    // #ifdef MP-WEIXIN
    wx.hideHomeButton()
    // #endif

    this.webSocket.connectSocket()

    const temp = uni.getStorageSync('setStatusIndexFunc') || 0
    this.active = temp
    uni.setStorageSync('setStatusIndexFunc', temp)
    uni.setNavigationBarTitle({
      title: temp == 0 ? '首页' : temp == 1 ? '我的诊室' : '我的',
    })

    /* ***公众号入口跳转核酸预约挂号缴费 */
    const pageQuery = getApp().globalData.pageQuery
    console.log(pageQuery, '---进入小程序的全局参数----')
    if (pageQuery.type === 'nucleatePay') {
      uni.navigateTo({
        url: `/pages-user/nucleicAcidAppointment/flowform/success?bizId=${pageQuery.id}&overdue=${pageQuery.overdue}&type=nucleatePay`,
      })
    }
    /* **** */
    /* *******扫码进入小程序**** */
    if (pageQuery.redirect) {
      const url = decodeURIComponent(decodeURIComponent(pageQuery.redirect))
      console.log(url, '要跳转到路径====')
      uni.navigateTo({
        url: `${url}?isform=1`,
      })
    }
    /* ***** */
    /* ****扫码进入门诊缴费-带cardId intoPay name 参数 （需要生成二维码故单独处理） */
    if (pageQuery.intoPay) {
      uni.navigateTo({
        url: `/pages-zy/outpatientPayment/list?cardId=${
          pageQuery.cardId
        }&name=${decodeURIComponent(decodeURIComponent(pageQuery.name))}`,
      })
    }
    /* **** */

    /* ***心咨订单进入支付页*** */
    if (pageQuery.hcOrder) {
      uni.navigateTo({
        url: `/pages/hcOrderPay/index?tradeId=${pageQuery.tradeId}&tradeType=${pageQuery.tradeType}&payFee=${pageQuery.payFee}&orderId=${pageQuery.orderId}&expireTime=${pageQuery.expireTime}`,
      })
    }
    /* **** */
    //进入小程序就跳转须知界面
    uni.navigateTo({
      url: '/pages-zy/noticePage/index',
    })
  },
  onShow() {
    if (this.active === 1) {
      this.$refs.room.onPullDown()
      setTimeout(() => {
        this.$refs.room.openMonitor()
      }, 1500)
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
    //收集系统信息
    getSystemInfo() {
      wx.getSystemInfo({
        async success(res) {
          console.log(res, '系统信息')
          const params = {
            brand: res.brand, //设备品牌
            model: res.model, //设备型号。新机型刚推出一段时间会显示unknown，微信会尽快进行适配
            versionNum: res.version, //版本号
            system: res.system, //操作系统及版本
            platform: res.platform, //客户端平台
            otherInfo: JSON.stringify(res), // 其他信息
            sourceType: 'WX', //来源 ALI-支付宝/WX-微信
          }
          await saveSystemInfo(params)
        },
      })
    },
    //confirmPop
    async confirmPop() {
      this.$refs.supplement.close()
      console.log(this.memberList, '11')
      await updateRelation({ memberList: this.memberList })
      uni.showToast({
        title: '更新成功！',
        icon: 'none',
      })
    },
    //获取要更新关系的就诊人
    async checkRelation() {
      this.memberList = await checkRelation()
      if (this.memberList.length > 0) {
        this.$nextTick(() => {
          this.$refs.supplement.open()
        })
      }
    },
    //选择关系
    changeSelect(i, e) {
      console.log(i, e)
      this.memberList[i].relation = e.target.value
    },
    closePop() {
      this.$refs.supplement.close()
    },
    /**
     * @name 公共点击函数
     * */
    _mainFuncInit() {
      const active = uni.getStorageSync('setStatusIndexFunc') || 0
      // if (active != 1) {
      //   uni.$emit('updateCard')
      // }
      this.active = active
      uni.setNavigationBarTitle({
        title: active == 0 ? '首页' : active == 1 ? '我的诊室' : '我的',
      })

      if (active === 1) {
        this.$refs.room.onPullDown()
        this.$refs.room.openMonitor()
      }
      if (this.tempActive == active) {
        return
      }
      this.$nextTick(() => uni.setStorageSync('setStatusIndexFunc', active))
      this.tempActive = active
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
<style scoped lang="scss">
.fixs {
  position: fixed;
  z-index: 50;
}
.pop-content {
  background: #fff;
  min-height: 800rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  position: relative;
  .pop-top {
    display: flex;
    height: 110rpx;
    padding: 0 40rpx;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
  }
  .pop-msg {
    margin-top: 30rpx;
    font-size: 24rpx;
    padding: 0 40rpx;
    color: #666;
  }
  .pop-title {
    display: flex;
    padding: 30rpx 0;
    justify-content: space-around;
    align-items: center;
    font-size: 30rpx;
  }
  .pop-confirm {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 88rpx;
    color: #fff;
    font-size: 30rpx;
    background: #0ab2c1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .scroll-pop {
    background: #f2f2f2;
    padding: 30rpx;
    max-height: 500rpx;
    padding-bottom: 88rpx;
    .scoll-item {
      display: flex;
      margin-bottom: 20rpx;
      .left-right {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
      }
      .name {
        width: 100%;
        height: 90rpx;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      input {
        text-indent: 110rpx;
      }
    }
  }
}
</style>
