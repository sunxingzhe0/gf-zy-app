<template>
  <view
    class="invite-container"
    v-show="inviting"
    :style="{ backgroundImage: `url(${FILE_URL(info.doctorAvatar)})` }"
  >
    <view class="container-bg">
      <view class="avatar-wrapper">
        <image
          class="avatar"
          :src="FILE_URL(info.doctorAvatar)"
          mode="scaleToFit"
        ></image>
      </view>
      <view class="doctor-name" style="color: #fff;">{{
        info.doctorName
      }}</view>
      <view style="font-size: 28rpx;color: #fff;">{{ info.titleName }}</view>
      <view class="text">正在邀请你进行视频复诊</view>
    </view>
    <view class="button-wrapper">
      <button class="btn btn-accept" @click="acceptVideo">接受</button>
      <button class="btn btn-refuse" @click="refuseVideo">拒绝</button>
    </view>
  </view>
</template>

<script>
import { clinicInfo } from '@/common/request/index'
export default {
  data() {
    return {
      userId: uni.getStorageSync('userId'),
      fromNickName: this.$store.state.userInfo.username,
      inviting: false,
      info: {},
    }
  },
  created() {
    uni.$on('onMessage', this.messageHandler)
  },
  methods: {
    async getInfo(sessionId) {
      this.info = await clinicInfo({
        sessionId,
      })
    },
    messageHandler(payload) {
      const info = payload.info || payload

      if (info.childMessageType !== this.$protobufMessageType.CRVIDEO) return

      this.inviting = info.from != this.userId && !info.body

      if (this.inviting) {
        this.getInfo(info.to.substr(1))
      } else {
        this.info = {}
      }
    },
    // 接受视频
    acceptVideo() {
      const { orderId, sessionId } = this.info
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages-user/video/video?orderId=${orderId}&sessionId=${sessionId}`,
      })
      //#endif
      //#ifdef APP-PLUS|| H5
      uni.navigateTo({
        url: `/pages-user/video/h5video?orderId=${orderId}&sessionId=${sessionId}`,
      })
      //#endif

      this.sendMessage({
        body: 'accept',
      })
      this.inviting = false
      this.info = {}
    },
    refuseVideo() {
      this.sendMessage({
        body: 'refuse',
      })
      this.inviting = false
      this.info = {}
    },
    sendMessage({ body }) {
      const form = {
        fromNickName: this.fromNickName,
        to: this.info.sessionId,
        toNickName: this.info.doctorName,
        body,
      }
      // 用户类型 用户
      const childMessageType = this.$protobufMessageType.CRVIDEO
      const chatType = this.$protobufChatType.USER
      this.webSocket.sendMessage(form, childMessageType, chatType)
    },
  },
}
</script>

<style lang="scss">
.invite-container {
  position: fixed;
  z-index: 300;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
.button-wrapper {
  position: absolute;
  bottom: 40rpx;
  width: 100vw;
}
.btn {
  width: 70%;
  margin: auto;
  line-height: 80rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
}

.btn-refuse {
  margin-top: 32rpx;
  background-color: #fff;
  border: none;
  color: #e35b5b;
}

.btn-accept {
  background-color: $uni-color-primary;
  border: none;
  color: #fff;
}

.container-bg {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  .avatar-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 180rpx;
    height: 180rpx;
    padding: 12rpx;
    background: rgba(10, 178, 193, 0.5);
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .doctor-name {
    margin-top: 24rpx;
    font-size: 40rpx;
    font-weight: bolder;
  }

  .text {
    margin-top: 80rpx;
    font-size: 28rpx;
    color: #fff;
  }
}
</style>
