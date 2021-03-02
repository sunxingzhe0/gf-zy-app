<template>
  <view class="userWrap">
    <view class="headerTop">
      <image
        class="bg"
        :src="FILE_URL_BUILT_IN('headerBg.png')"
        mode="scaleToFill"
      ></image>
      <view class="headerMain">
        <view class="flex-start-center">
          <image
            :src="
              avatar
                ? FILE_URL(avatar)
                : require('@/assets/user/user_d_head.png')
            "

          ></image>
          <view class="headerInfo flex_1">
            <view class="name">{{
              userInfo.username || '-'
            }}</view>
            <view class="phone flex-between">
              <view>{{ util.noPassByMobile(userInfo.phone) }}</view>
              <view class="changerole" @click.stop="changeRole">
                员工通道
              </view>
            </view>
          </view>
        </view>
        <view class="notice" @click="goto('/pages-user/message/list')">
          <text class="iconfont icon-tongzhi"></text>
          <view class="num" v-if="message > 0">{{
            message > 99 ? '99+' : message
          }}</view>
        </view>
      </view>
    </view>
    <view class="pageWrap">
      <view
        class="box-shadow pageItem"
        @click="goto('/pages-user/patientManagement/add')"
      >
        <view class="uni-center card">
          <text class="iconfont icon-zengjia"></text>
          <view class="title">新增就诊人</view>
          <view class="tip">新增就诊人，可享受医院一对一的在线服务</view>
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
  </view>
</template>
<script>
import util from '@/common/util'
import popSelect from '@/components/pop-select'
import { changeRole, checkValid } from '@/common/request/index'
export default {
  components: {
    popSelect,
  },
  data() {
    return {
      num: 0,
      util: util,
      roleId: this.$store.state.userInfo.roleId,
      headerUrl: '',
      list: [
        {
          title: '就诊人管理',
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
        //   url: '/pages-user/doctorAdvice/list'
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
      console.log(this.$store.state.userInfo);
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
    uni.setNavigationBarTitle({
      title: '我的',
    })
    this.$store.dispatch('getMessge')
  },
  methods: {
    changeRole() {
      // if (this.userInfo.roleList.length > 1) {
      //   this.$refs.popselect.open()
      // }
      uni.setStorageSync('clientType', 'DOC_MOBILE')
      this.$store.dispatch('signOut')
    },
    getWXUserInfo() {
      let that = this
      uni.login({
        provider: 'weixin',
        success: function(loginRes) {
          uni.getUserInfo({
            provider: 'weixin',
            success: async function(infoRes) {
              console.log(3333)
              that.headerUrl = infoRes.userInfo.avatarUrl
              console.log('获取用户信息')
              await that.$store.dispatch('encryptedData', {
                encryptedData: infoRes.encryptedData,
                iv: infoRes.iv,
              })
              that.$store.dispatch('loginInfo', true)
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
  padding: 0 20rpx;
  margin-top: -20rpx;
  position: relative;
  z-index: 4;
}

.pageItem {
  background: #fff;
  margin-bottom: 20rpx;
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

    .notice {
      position: absolute;
      right: 0;
      top: -20rpx;

      text {
        color: #fff;
        font-size: 50rpx;
      }

      .num {
        width: 38rpx;
        height: 38rpx;
        border-radius: 50%;
        background: #e45b5b;
        color: #fff;
        position: absolute;
        right: -12rpx;
        top: -2rpx;
        line-height: 38rpx;
        text-align: center;
        font-size: 20rpx;
      }
    }
  }
}

.card {
  padding: 40rpx 20rpx;
  padding-top: 20rpx;

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
</style>
