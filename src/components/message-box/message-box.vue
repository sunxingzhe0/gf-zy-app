<template>
  <view>
    <view v-for="(item, index) in messages" :key="index">
      <view class="timestamp" v-if="isShowTime(index)">
        {{ formatTime(item.clientTime) }}
      </view>
      <view
        v-if="newMessage && newMessage.msgId == item.msgId"
        class="text-center"
      >
        <view class="divide-text">以下为新消息</view>
        <!-- <view class="timestamp">
          {{ FORMATDATE(item.clientTime, 'yyyy-MM-dd hh:mm') }}
        </view> -->
      </view>
      <view v-if="self(item)" class="flex-end-start self chat-item">
        <view class="content-wrapper">
          <view
            v-if="item.childMessageType === messageType.IMAGE"
            class="image-content"
          >
            <image
              class="chat-content-image"
              :src="FILE_URL(item.body)"
              mode="widthFix"
              @click="previewImage(item.body)"
            ></image>
          </view>

          <!-- 视频通话 -->
          <template v-else-if="item.childMessageType === messageType.CRVIDEO">
            <view class="chat-content flex-start-center">
              <view>
                {{
                  item.body == 'cancel'
                    ? '已取消'
                    : item.body == 'refuse'
                    ? '已拒绝'
                    : item.body == 'accept'
                    ? '已接受'
                    : item.body == 'leave'
                    ? '已挂断'
                    : item.chatType === chatType.DOCTOR
                    ? '发起了视频聊天'
                    : ''
                }}
              </view>
              <image
                class="icon"
                :src="require('@/assets/video@2x.png')"
                mode="aspectFit"
              ></image>
            </view>
          </template>
          <view
            class="chat-content"
            v-else-if="
              [messageType.RP, 'RP'].includes(item.childMessageType) &&
                item.body
            "
            @click="viewRP"
          >
            {{ item.body.indexOf('SUBMIT') > -1 ? '提交' : '审核通过' }}了{{
              JSON.parse(item.body).num
            }}个处方，
            <text class="self-link">查看详情</text>
          </view>
          <view
            class="chat-content"
            v-else-if="
              [messageType.DIAS, 'DIAS'].includes(item.childMessageType)
            "
            @click="viewDIAS(item.body)"
          >
            {{ item.body.indexOf('SUB_AGAIN') > -1 ? '更新' : '发送' }}了诊断，
            <text class="self-link">查看详情</text>
          </view>
          <view
            class="chat-content"
            v-else-if="[messageType.EMH, 'EMH'].includes(item.childMessageType)"
            @click="viewEMH"
          >
            {{ item.body.indexOf('SUB_AGAIN') > -1 ? '更新' : '发送' }}了病历，

            <text class="self-link">查看详情</text>
          </view>
          <view
            class="chat-content"
            v-else-if="[messageType.DSO, 'DSO'].includes(item.childMessageType)"
            @click="viewDSO(item.body)"
          >
            发送了一个处置单，
            <text class="self-link">查看详情</text>
          </view>
          <view
            class="chat-content"
            v-else-if="[messageType.ZJ, 'ZJ'].includes(item.childMessageType)"
          >
            发送了一个预约单
          </view>
          <view
            class="chat-content"
            v-else-if="
              item.childMessageType === messageType.ANY ||
                item.childMessageType === 'ANY'
            "
          >
            <illness
              v-if="item.body.indexOf('ILLNESS') > -1"
              :orderId="orderId"
              :user="'user'"
            />
            <authorize-record
              v-else-if="item.body.indexOf('MEDICAL_APPLY') > -1"
              :message="item"
            />
          </view>

          <view class="chat-content" v-else>{{ item.body }}</view>

          <view
            class="tip"
            v-if="
              item.chatType == chatType.DOCTOR &&
                item.childMessageType === messageType.DEFAULT
            "
            @click="setCommonWords(item.body)"
          >
            {{
              commonWordsContent.includes(item.body)
                ? '修改常用语'
                : '设为常用语'
            }}
          </view>
        </view>
        <!-- <view class="avatar-wrapper"><image class="avatar" :src="require('@/assets/self.jpg')" mode="aspectFit"></image></view> -->
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
      <!-- v-else 过滤诊断病例 用户端信息 -->
      <view
        v-if="
          ![messageType.DIAS, 'DIAS', messageType.EMH, 'EMH'].includes(
            item.childMessageType,
          ) && !self(item)
        "
        class="flex-start-start left chat-item"
      >
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
        <view
          class="chat-content"
          v-if="item.childMessageType === messageType.IMAGE"
        >
          <image
            class="chat-content-image "
            :src="FILE_URL(item.body)"
            mode="widthFix"
            @click="previewImage(item.body)"
          ></image>
        </view>

        <template v-else-if="item.childMessageType === messageType.CRVIDEO">
          <view class="chat-content" v-if="item.body == 'refuse'">
            已拒绝
          </view>
          <view class="chat-content" v-else-if="item.body == 'cancel'">
            已取消
          </view>
          <view class="chat-content" v-else-if="item.body == 'accept'">
            已接受
          </view>
          <view class="chat-content" v-else-if="item.body == 'leave'">
            已挂断
          </view>
          <view
            class="chat-content"
            v-else-if="item.chatType == chatType.DOCTOR"
          >
            向您发起了视频邀请
          </view>
        </template>
        <!-- 终止诊室的消息 -->
        <view
          class="chat-content"
          v-else-if="item.childMessageType === messageType.SV"
        >
          向您发起了服务终止，诊查费将于1-3个工作日内原路退回。
        </view>
        <view
          class="chat-content"
          v-else-if="
            [messageType.RP, 'RP'].includes(item.childMessageType) && item.body
          "
        >
          <template v-if="item.body.indexOf('SUBMIT') > -1">
            为您开了
            <text style="color: #0ab2c1;">{{ JSON.parse(item.body).num }}</text>
            个处方，正在审核中
          </template>
          <view v-else @click="viewRP">
            向您发送了处方，
            <text class="link">查看详情</text>
          </view>
        </view>
        <view
          class="chat-content"
          v-else-if="[messageType.DIAS, 'DIAS'].includes(item.childMessageType)"
          @click="viewDIAS(item.body)"
        >
          向您{{
            item.body.indexOf('SUB_AGAIN') > -1 ? '更新' : '发送'
          }}了诊断，

          <text class="link">查看详情</text>
        </view>
        <view
          class="chat-content"
          v-else-if="[messageType.EMH, 'EMH'].includes(item.childMessageType)"
          @click="viewEMH"
        >
          向您{{
            item.body.indexOf('SUB_AGAIN') > -1 ? '更新' : '发送'
          }}了病历，
          <text class="link">查看详情</text>
        </view>
        <view
          class="chat-content"
          v-else-if="[messageType.DSO, 'DSO'].includes(item.childMessageType)"
          @click.stop="viewDSO(item.body)"
        >
          <!-- <template v-if="JSON.parse(item.body).type == 'DISPOSE_SUBMIT'"></template> -->
          向您发送了一个处置单，
          <text class="link">
            查看详情
          </text>
        </view>
        <view
          class="chat-content"
          v-else-if="[messageType.ZJ, 'ZJ'].includes(item.childMessageType)"
          @click="viewZJ(item.body)"
        >
          向您发送了一个预约单，
          <text class="link">查看详情</text>
        </view>
        <view
          class="chat-content"
          v-else-if="
            item.childMessageType === messageType.ANY ||
              item.childMessageType === 'ANY'
          "
        >
          <illness
            v-if="item.body.indexOf('ILLNESS') > -1"
            :orderId="orderId"
          />
          <authorize-record
            v-else-if="item.body.indexOf('MEDICAL_APPLY') > -1"
            :message="item"
            :roomId="roomId"
          />
        </view>

        <view class="chat-content" v-else>{{ item.body }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Illness from './Illness.vue'
import AuthorizeRecord from './AuthorizeRecord.vue'
import dayjs from 'dayjs'
export default {
  name: 'MessageBox',
  components: {
    Illness,
    AuthorizeRecord,
  },
  props: {
    orderId: String,
    roomId: String,
    messageBox: Array,
    commonWords: Array,
    avatar: String,
    newMessage: Object,
    memberId: String,
  },
  data() {
    const clientType = uni.getStorageSync('clientType')
    return {
      userAvatar: this.$store.state.userInfo.avatar,
      userId: uni.getStorageSync('userId'),
      clientType,
      userType: clientType == 'USER' ? 3 : 2,
      messageType: this.$protobufMessageType,
      chatType: this.$protobufChatType,
      commonWordsContent: [],
      rp: {},
    }
  },
  watch: {
    commonWords: function(value) {
      this.commonWordsContent = value.map(item => item.content)
    },
  },
  computed: {
    messages() {
      const map = new Map()
      this.messageBox
        .filter(_ => !_.deleteType && _.conferenceId)
        .forEach(item => {
          if (!map.has(item.conferenceId)) {
            map.set(item.conferenceId, item)
          }
        })
      console.log(Array.from(map.values()), '消息列表-0-0-')
      return Array.from(map.values())
    },
  },
  created() {
    if (this.commonWords) {
      this.commonWordsContent = this.commonWords.map(item => item.content)
    }
  },
  methods: {
    previewImage(fileId) {
      uni.previewImage({
        current: this.FILE_URL(fileId),
        urls: this.messageBox
          .filter(item => item.childMessageType == this.messageType.IMAGE)
          .map(item => this.FILE_URL(item.body)),
      })
    },
    //是否显示日期
    isShowTime(index) {
      //显示规则前一条比后一条大于30s
      if (index === 0) {
        return true
      }
      if (
        this.messages[index].clientTime - this.messages[index - 1].clientTime >
        30 * 1000
      ) {
        return true
      } else {
        return false
      }
    },
    //格式换日期显示
    formatTime(time) {
      //非本年
      if (dayjs(time).format('YYYY') !== dayjs().format('YYYY')) {
        return dayjs(time).format('YYYY年MM月DD日 HH:mm')
      }
      //今日
      if (dayjs(time).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
        return dayjs(time).format('HH:mm')
      } else {
        //非今日
        return dayjs(time).format('MM月DD日 HH:mm')
      }
    },
    setCommonWords(words) {
      const index = this.commonWordsContent.indexOf(words)
      this.$emit('onCommonWords', {
        words,
        index,
      })
    },
    self(message) {
      return (
        message.from == this.userId &&
        (typeof message.chatType == 'number'
          ? this.userType === message.chatType
          : message.chatType.indexOf(this.clientType.substr(0, 3)) > -1)
      )
    },
    // 处方
    viewRP() {
      uni.navigateTo({
        url:
          this.clientType == 'USER'
            ? `/pages-user/prescription/prescription?orderId=${this.orderId}`
            : `/pages-doctor/user/prescription/info?id=${this.orderId}`,
      })
    },
    // 诊断
    viewDIAS(diagId) {
      console.log(diagId)
      let id = ''
      if (diagId) {
        id = JSON.parse(diagId).content
      }
      this.$emit('viewDIAS', id)
    },
    // 病历
    viewEMH() {
      uni.navigateTo({
        url: `/pages-user/medical/detail?orderId=${this.orderId}`,
      })
    },
    viewDSO(body) {
      const id = JSON.parse(body).content
      uni.navigateTo({
        url:
          this.clientType == 'USER'
            ? `/pages-user/doctorAdvice/detail?id=${id}`
            : `/pages-doctor/treatment/detail/index?id=${id}`,
      })
    },
    viewZJ(body) {
      const id = JSON.parse(body).content
      uni.navigateTo({
        url: `/pages-user/myAppointment/detail?orderId=${this.orderId}&memberId=${this.memberId}&id=${id}`,
      })
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
  // background-color: #e6e6e6;
  font-size: 24rpx;
  color: #666;
  text-align: center;
}
</style>
