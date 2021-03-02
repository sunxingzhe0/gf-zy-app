<template>
  <view>
    <!--主页按钮-->
    <homeIcom />
    <view class="orderWrap">
      <view class="oerderMain  box-shadow">
        <view class="orderItem flex-between">
          <view class="title">头像</view>
          <view class="flex-start-center rightInfo" @click="upImg">
            <image
              class="headerImg"
              :src="
                avatar
                  ? FILE_URL(avatar)
                  : require('@/assets/user/user_d_head.png')
              "
            ></image>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">姓名</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.username }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">性别</view>
          <view class="flex-start-center rightInfo">
            <view>
              {{ userInfo.sex == 1 ? '男' : userInfo.sex == 0 ? '女' : '-' }}
            </view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">所在医院</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.orgName }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">科室</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.deptName }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">职称</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.titleName }}</view>
          </view>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view class="orderItem flex-between">
          <view class="title">我的ID</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.userCode }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">我的二维码</view>
          <view
            class="flex-start-center rightInfo"
            @click="goto('/pages-doctor/qrcode/qrcode')"
          >
            <view>查看</view>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
        <view
          class="orderItem flex-between"
          @click="
            userInfo.hasAuth
              ? this.$refs.pop.open()
              : goto('/pages-doctor/user/attestation/index?leve=3')
          "
        >
          <view class="title">实名认证</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.hasAuth ? '已实名' : '未实名' }}</view>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">资质认证</view>
          <view
            class="flex-start-center rightInfo"
            @click="
              userInfo.hasAuth
                ? goto('/pages-doctor/user/qualification')
                : goto('/pages-doctor/user/attestation/index')
            "
          >
            <view>{{ authMap[userInfo.examineState] }}</view>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view
          class="orderItem flex-between"
          @click="goto('/pages-doctor/user/bindPhone')"
        >
          <view class="title">{{
            userInfo.phone ? '更换手机号' : '绑定手机号'
          }}</view>
          <view class="flex-start-center rightInfo">
            <view>{{ util.noPassByMobile(userInfo.phone) }}</view>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
        <view
          class="orderItem flex-between"
          @click="
            goto(
              userInfo.phone
                ? '/pages-user/setting/resetPassword'
                : '/pages-doctor/user/bindPhone',
            )
          "
        >
          <view class="title">重置密码</view>
          <view class="flex-start-center rightInfo">
            <view></view>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
      </view>
      <button class="submit_btn" type="primary" @click="signOut">
        注销账号
      </button>
    </view>
    <uni-popup ref="pop">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">实名信息</view>
          <view class="flex-start-center realInfo">
            <view class="name">姓名</view>
            <view class="flex_1">{{ userInfo.username }}</view>
          </view>
          <view class="flex-start-center realInfo">
            <view class="name">身份证</view>
            <view class="flex_1">{{ userInfo.idCard }}</view>
          </view>
        </view>
        <view class="pop-btn" @click="this.$refs.pop.close()"
          ><text class="close" style="border: 0;">关闭</text></view
        >
      </view>
    </uni-popup>
  </view>
</template>
<script>
import util from '@/common/util'
import { upload } from '@/common/request/index'
import { changeAvatar } from '@/common/request/userCenter'
export default {
  data() {
    return {
      util: util,
      authMap: {
        TO_DOWN: '已驳回',
        TO_EXAMINE: '待审核',
        TO_CONFIRM: '待确认',
        SUCCESS: '已认证',
        FAIL: '未认证',
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    avatar() {
      return this.$store.state.avatar
    },
  },
  methods: {
    // 上传头像
    upImg() {
      let that = this
      uni.chooseImage({
        count: 1,
        success: chooseImageRes => {
          const tempFilePaths = chooseImageRes.tempFilePaths
          upload(tempFilePaths[0]).then(async res => {
            console.log(res.body)
            await changeAvatar({
              avatar: res.body,
            })
            that.$store.commit('avatar', res.body)
          })
        },
      })
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      })
    },
    reload() {
      this.$store.dispatch('loginInfo')
    },
    signOut() {
      const that = this
      uni.showModal({
        title: '确认退出账号?',
        success(res) {
          if (res.confirm) {
            that.webSocket.close()
            that.$store.dispatch('signOut').then(() => {
              uni.reLaunch({
                url: '/pages/login/login',
              })
            })
          }
        },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/common/order.scss';
.orderWrap {
  margin-top: 0;
  padding-top: 20rpx;
  padding-bottom: 30rpx;
  .title {
    color: #1a1a1a !important;
  }
  .rightInfo {
    font-size: 30rpx;
    color: #666;
    .rightIcon {
      color: #666;
      padding-top: 2rpx;
      margin-left: 8rpx;
    }
    .headerImg {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
}
.submit_btn {
  background: #fff !important;
  color: #e45b5b;
  margin-top: 30rpx;
  position: relative;
  bottom: 0;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
}
.realInfo {
  font-size: 30rpx;
  color: #1a1a1a;
  margin-top: 30rpx;
  .name {
    width: 120rpx;
    color: #666;
  }
}
</style>
