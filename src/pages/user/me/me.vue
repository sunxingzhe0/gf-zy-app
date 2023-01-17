<template>
  <view class="userWrap">
    <view class="headerTop">
      <image
        class="bg"
        :src="FILE_URL_BUILT_IN('meBg.png')"
        mode="scaleToFill"
      ></image>
      <!-- <image class="bg" :src="bgUrl" mode="scaleToFill"></image> -->
      <view class="headerMain">
        <view class="flex-start-center">
          <default-img
            style="
                width: 110rpx;
                height: 110rpx;
                border-radius: 50%;
                overflow: hidden;
                margin-right:10rpx;
              "
            :isPreview="false"
            :url="FILE_URL(avatar)"
          ></default-img>
          <!-- <image
            :src="
              avatar
                ? FILE_URL(avatar)
                : require('@/assets/user/user_d_head.png')
            "
          ></image> -->
          <view class="headerInfo flex_1 flex-between">
            <!-- <view class="name">{{ userInfo.username || '-' }}</view> -->
            <view class="phone-name" style="margin-left: 5px">
              <view class="name">{{ userInfo.username || '-' }}</view>
              <view>{{ util.noPassByMobile(userInfo.phone) }}</view>
            </view>

            <view class="header-btns">
              <view
                class="changerole"
                style="margin-bottom:10px"
                @click="goto('/pages-user/message/list')"
              >
                <text
                  class="iconfont icon-tongzhi"
                  style="margin-right: 8px;"
                ></text>
                消息
                <view class="num" v-if="message > 0">{{
                  message > 99 ? '99+' : message
                }}</view>
              </view>
              <view class="changerole" @click.stop="toChangeRole">
                <uni-icons
                  type="loop"
                  color="#0AB2C1"
                  style="margin-top: 6rpx;margin-right: 17rpx;font-weight: bold;"
                  :size="16"
                ></uni-icons
                >员工
              </view>
            </view>
          </view>
        </view>
        <!-- <view class="notice" @click="goto('/pages-user/message/list')">
          <text class="iconfont icon-tongzhi"></text>
          <view class="num" v-if="message > 0">{{
            message > 99 ? '99+' : message
          }}</view>
        </view> -->
      </view>
    </view>
    <view class="pageWrap">
      <view
        class="box-shadow pageItem"
        @click="goto('/pages-user/patientManagement/add')"
        v-if="perList.length == 0"
      >
        <view class="uni-center card">
          <text class="iconfont icon-zengjia"></text>
          <view class="title">添加健康卡</view>
        </view>
      </view>
      <view class="card-swiper-box" v-if="perList.length > 0">
        <view class="card-swiper-content">
          <swiper
            @change="changeCard"
            class="card-swiper"
            indicator-dots="true"
            indicator-color="#ccc"
            indicator-active-color="#0AB2C1"
            circular="true"
            previous-margin="5px"
            next-margin="7px"
          >
            <swiper-item
              class="swiper-item"
              v-for="(val, index) in perList"
              :key="index"
            >
              <view
                class="swiper-perCard flex-between"
                @click="
                  navigateTo(
                    `/pages-user/patientManagement/detail?id=${val.memberId}`,
                  )
                "
              >
                <view>
                  <view class="perName">{{ val.name }}</view>
                  <view class="perNo">卡号：{{ val.patientCard }}</view>
                </view>
                <image
                  class="erweima"
                  :src="require('@/assets/user/erweima.png')"
                ></image>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="linkList box-shadow">
        <view
          class="listItem"
          v-for="item in list"
          :key="item.url"
          @click="goto(item.url)"
        >
          <image :src="item.icon"></image>
          <view class="title">{{ item.title }}</view>
        </view>
      </view>
    </view>
    <pop-select
      ref="popselect"
      @submit="selectSubmit"
      title="用户身份"
      :list="roleList"
      @change="radioChangeType"
    ></pop-select>
    <view class="version">{{ version }}</view>
  </view>
</template>
<script>
import util from '@/common/util'
import popSelect from '@/components/pop-select'
import {
  changeRole,
  checkValid,
  patientList,
  autoSyncUserCard,
} from '@/common/request/index'
import { editPatientInfo } from '@/common/request/userCenter'
export default {
  components: {
    popSelect,
  },
  data() {
    return {
      version: '',
      // bgUrl: require('@/assets/meBg.png'),
      perList: [],
      num: 0,
      util: util,
      roleId: this.$store.state.userInfo.roleId,
      headerUrl: '',
      list: [
        {
          title: '健康卡管理',
          icon: require('@/assets/user/userIcon1.png'),
          url: '/pages-user/patientManagement/list',
        },
        {
          title: '健康档案',
          icon: require('@/assets/user/userIcon2.png'),
          url: '/pages-user/healthRecords/list',
        },
        {
          title: '我的医生',
          icon: require('@/assets/user/userIcon3.png'),
          url: '/pages-zy/myDoctor/list',
        },
        {
          title: '就诊记录',
          icon: require('@/assets/user/userIcon14.png'),
          url: '/pages-zy/medicalRecords/list',
        },
        // {
        //   title: '在线医嘱',
        //   icon: require('@/assets/user/userIcon12.png'),
        //   url: '/pages-user/doctorAdvice/list',
        // },
        {
          title: '我的预约',
          icon: require('@/assets/user/userIcon11.png'),
          url: '/pages-zy/myAppointment/list',
        },
        {
          title: '我的缴费',
          icon: require('@/assets/user/userIcon13.png'),
          url: '/pages-zy/myPayment/list',
        },
        {
          title: '订单管理',
          icon: require('@/assets/user/userIcon4.png'),
          url: '/pages-user/serviceOrder/list',
        },
        {
          title: '处方管理',
          icon: require('@/assets/user/userIcon5.png'),
          url: '/pages-user/prescriptionOrder/list',
        },
        {
          title: '就医点评',
          icon: require('@/assets/user/userIcon6.png'),
          url: '/pages-zy/evaluate/list',
        },
        {
          title: '地址管理',
          icon: require('@/assets/user/userIcon7.png'),
          url: '/pages-user/address/list',
        },
        {
          title: '意见反馈',
          icon: require('@/assets/user/userIcon12.png'),
          url: '/pages-zy/feedBack/index',
        },
        // {
        //   title: '账号管理',
        //   icon: require('@/assets/user/userIcon10.png'),
        //   url: '/pages-user/setting/index',
        // },
      ],
    }
  },
  computed: {
    userInfo: function() {
      return this.$store.state.userInfo
    },
    roleList: function() {
      return this.$store.state.userInfo.roleList
    },
    avatar: function() {
      return this.$store.state.avatar
    },
    message: function() {
      return this.$store.state.message
    },
  },
  created() {
    const accountInfo = wx.getAccountInfoSync() //获取小程序版本号
    console.log(accountInfo, '账号信息')
    this.version = accountInfo.miniProgram.version
      ? 'v' + accountInfo.miniProgram.version
      : ''
    console.log(this.$store.state)
    uni.setNavigationBarTitle({
      title: '我的',
    })
    this.$store.dispatch('getMessge')
    this.getpatientList()
  },
  mounted() {
    uni.$on('updateCard', () => {
      this.getpatientList()
      this.$forceUpdate()
    })
  },
  methods: {
    //自动更新就诊卡
    async handleAutoSyncUserCard(memberId) {
      await autoSyncUserCard({ memberId })
    },
    //变更默认选项
    async changeCard(e) {
      uni.showLoading()
      const params = this.perList[e.detail.current]
      params.def = true
      await editPatientInfo(params)
      this.handleAutoSyncUserCard(params.memberId)
      uni.hideLoading()
    },
    navigateTo(url) {
      uni.navigateTo({
        url,
      })
    },
    toChangeRole() {
      // if (this.userInfo.roleList.length > 1) {
      //   this.$refs.popselect.open()
      // }
      uni.setStorageSync('clientType', 'DOC_MOBILE')
      this.$store.dispatch('signOut')
    },
    // 就诊人
    async getpatientList() {
      this.perList = []
      this.perList = await patientList()
    },
    getWXUserInfo() {
      let that = this
      uni.login({
        provider: 'weixin',
        success: function(loginRes) {
          uni.getUserProfile({
            desc: 'weixin',
            success: async function(infoRes) {
              console.log(3333)
              that.headerUrl = infoRes.userInfo.avatarUrl
              console.log('获取用户信息')
              that.$store.dispatch('loginInfo', true)
              if (this.userInfo.username === '微信用户') {
                that.$store.dispatch('encryptedData', {
                  encryptedData: infoRes.encryptedData,
                  iv: infoRes.iv,
                })
              }
            },
            fail: function(err) {
              console.log(err)
            },
          })
        },
      })
    },
    radioChangeType(e) {
      this.roleId = e
    },
    selectSubmit() {
      if (this.roleId == this.userInfo.roleId) {
        this.$refs.popselect.close()
      } else {
        changeRole({
          roleId: this.roleId,
        }).then(res => {
          this.webSocket.close()
          this.$store.dispatch('loginInfo')
          this.$refs.popselect.close()
        })
      }
    },
    goto(url) {
      uni.navigateTo({
        url,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.userWrap {
  padding-bottom: 120rpx;
}

.pageWrap {
  // padding: 0 20rpx;
  margin-top: -20rpx;
  position: relative;
  z-index: 4;
}

.pageItem {
  background: #fff;
  // margin-bottom: 20rpx;
  margin: -10px 10px 10px 10px;
}

.headerTop {
  width: 100%;
  height: 260rpx;
  position: relative;
  padding: 40rpx;
  box-sizing: border-box;

  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .headerMain {
    position: relative;
    z-index: 3;

    image {
      width: 110rpx;
      height: 110rpx;
      border-radius: 50%;
      margin-right: 30rpx;
    }

    .headerInfo {
      color: #fff;

      .name {
        font-size: 34rpx;
        margin-bottom: 10rpx;
      }

      .phone {
        font-size: 26rpx;

        text {
          font-size: 24rpx;
          border: 1px solid #fff;
          border-radius: 20rpx;
          padding: 0 10rpx;
          margin-left: 16rpx;
        }
      }

      .phone-name {
      }
      .changerole {
        height: 60rpx;
        line-height: 60rpx;
        background: #fff;
        border-radius: 30rpx 0 0 30rpx;
        color: $uni-color-primary;
        padding-left: 20rpx;
        padding-right: 25rpx;
        position: relative;
        right: -40rpx;
      }
    }

    .header-btns {
      position: relative;
      .num {
        width: 38rpx;
        height: 38rpx;
        border-radius: 50%;
        background: #e45b5b;
        color: #fff;
        position: absolute;
        left: -15rpx;
        top: -10rpx;
        line-height: 38rpx;
        text-align: center;
        font-size: 20rpx;
      }
    }
  }
}

.card {
  padding: 18rpx 20rpx;

  text {
    color: $uni-color-primary;
    font-size: 60rpx;
  }

  .title {
    font-size: 30rpx;
    color: #1a1a1a;
  }

  .tip {
    font-size: 24rpx;
    color: #666;
    margin-top: 6rpx;
  }
}

.linkList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0 10px;
  padding: 20rpx 0 20rpx 20rpx;
  background: #fff;
  overflow: hidden;

  .listItem {
    padding: 20rpx 0;
    text-align: center;
    width: 168rpx;

    .title {
      font-size: 26rpx;
      color: #333;
    }
  }

  image {
    width: 60rpx;
    height: 60rpx;
  }
}
.perCard {
  padding: 20rpx 30rpx;
  padding-right: 40rpx;
  margin: 10px 20rpx;
  margin-top: -20rpx;
  z-index: 20;
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 10px;
  .perBg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  > view {
    position: relative;
    z-index: 3;
  }

  .perName {
    font-size: 30rpx;
    color: #fff;
    font-weight: 600;
  }

  .perNo {
    font-size: 24rpx;
    color: #fff;
  }

  .erweima {
    width: 40rpx;
    height: 40rpx;
    position: relative;
    z-index: 3;
  }
}
.card-swiper-box {
  // margin: 0 10px;
  height: 80px;
  position: relative;
  .card-swiper-content {
    width: 100%;
    position: absolute;
    top: -10px;
    left: 0;
    z-index: 999;
  }
  .card-swiper {
    width: 100%;
    height: 90px;
    .swiper-item {
      height: 68px !important;
    }
    .swiper-perCard {
      margin: 0 2px;
      width: 100%;
      height: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      border-radius: 10px;
      background-image: url('@/assets/user/perBg.png');
      background-size: cover;
      .perBg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      > view {
        position: relative;
        z-index: 3;
      }

      .perName {
        font-size: 30rpx;
        color: #fff;
        font-weight: 600;
      }

      .perNo {
        font-size: 24rpx;
        color: #fff;
      }

      .erweima {
        width: 40rpx;
        height: 40rpx;
        // position: relative;
        z-index: 3;
      }
    }
  }
}
.version {
  position: fixed;
  bottom: 100rpx;
  width: 100%;
  left: 0;
  text-align: center;
  color: #cecece;
}
</style>
