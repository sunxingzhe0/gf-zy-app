<template>
  <view>
    <view v-for="(item, index) in messageBox" :key="index">
      <view v-if="self(item)" class="flex-end-start self chat-item">
        <view class="content-wrapper">
          <view class="chat-content">{{ item.body }}</view>
        </view>
        <view class="avatar-wrapper">
          <image
            class="avatar"
            :src="
              userAvatar
                ? FILE_URL(userAvatar)
                : require('@/assets/user/user_d_head.png')
            "
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view v-else class="flex-start-start left chat-item">
        <view class="avatar-wrapper">
          <image
            class="avatar"
            :src="
              avatar
                ? FILE_URL(avatar)
                : require('@/assets/user/user_d_head.png')
            "
            mode="aspectFill"
          ></image>
        </view>
        <view class="chat-content">{{ item.body }}
          <view class="tips" v-if="item.errorMsg">
            <view class="line"></view>
            <view class="tips-msg">您可以这样输入</view>
            <view>·咽喉部有异物感，痰多</view>
            <view>·慢性胃炎，麻烦开两盒奥美拉唑</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'MessageBox',
  props: {
    messageBox: Array, //消息列表
    avatar: String, 
  },
  data() {
    return {
      userAvatar: this.$store.state.userInfo.avatar,
      messageType: this.$protobufMessageType,
    }
  },
/*   computed: {
    messages() {
      const map = new Map()
      this.messageBox.forEach(item => {
          if (!map.has(item.conferenceId)) {
            map.set(item.conferenceId, item)
          }
        })
      return Array.from(map.values())
    },
  }, */
  created() {
  },
  methods: {
    self(item) {
      return item.chatType===1
    },
  },
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  max-width: 70%;
}

.link {
  color: $uni-color-primary;
}

.self-link {
  color: #fff;
}

.tip {
  margin-top: 20rpx;
  margin-right: 20rpx;
  text-align: right;
  font-size: 24rpx;
  color: $uni-color-primary;
}

.chat-content {
  overflow-wrap: break-word;
  padding: 16rpx 28rpx;
}

.image-content {
  margin-right: 20rpx;
}

.chat-content-image {
  max-width: 260rpx;
}

.left .chat-content {
  max-width: 60%;
  margin-left: 16rpx;
  border-radius: 20rpx;
  border-top-left-radius: 0;
  background-color: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  color: #333;
}

.self .chat-content {
  margin-right: 16rpx;
  border-radius: 20rpx;
  border-bottom-right-radius: 0;
  background-color: $uni-color-primary;
  box-shadow: 0px 5px 20px 0px rgba(10, 178, 193, 0.5);
  color: #fff;
}

.chat-item {
  margin-top: 40rpx;
}

.avatar-wrapper {
  flex-shrink: 0;
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
}

.icon {
  margin-left: 8rpx;
  width: 42rpx;
  height: 30rpx;
}

.text-center {
  text-align: center;
}

.divide-text {
  position: relative;
  width: 300rpx;
  margin: 40rpx auto 0;
  color: #9a9a9a;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 50rpx;
    height: 4rpx;
    border-top: 4rpx solid #9a9a9a;
  }

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 0;
    width: 50rpx;
    height: 4rpx;
    border-top: 4rpx solid #9a9a9a;
  }
}

.timestamp {
  width: 280rpx;
  margin: 20rpx auto 0;
  border-radius: 40rpx;
  background-color: #e6e6e6;
  font-size: 24rpx;
  color: #666;
}
.tips{
  .line{
    border-bottom: 1px solid #ccc;

  }
  .tips-msg{
    color: #ccc;
    font-size: 12px;
  }
}
</style>
