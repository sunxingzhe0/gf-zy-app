<template>
  <view>
    <view
      v-for="(item, index) in messageBox"
      :key="index"
      class="message"
      :class="{ self: item.from == userId }"
    >
      <text
        >{{
          self(item)
            ? '我'
            : clientType == 'USER'
            ? order.doctorName
            : order.memberName
        }}：</text
      >

      <!-- 视频通话 -->
      <text v-if="item.childMessageType === messageType.CRVIDEO">
        <template>
          {{
            item.body == 'cancel'
              ? '已取消'
              : item.body == 'refuse'
              ? '已拒绝'
              : item.body == 'accept'
              ? '接受了视频'
              : item.body == 'leave'
              ? '挂断了视频'
              : item.chatType === chatType.DOCTOR
              ? (item.from != userId ? '向您' : '') + '向您发起视频邀请'
              : ''
          }}
        </template>
      </text>
      <text
        v-else-if="
          !item.childMessageType ||
            item.childMessageType === messageType.DEFAULT
        "
        >{{ item.body }}</text
      >
      <template v-else>
        <text v-if="!self(item)">向您</text>
        <text
          v-if="item.childMessageType === messageType.IMAGE"
          @click="previewImage(item.body)"
        >
          发送了图片，
          <text class="btn-text">点击查看</text>
        </text>
        <template
          v-else-if="
            item.childMessageType === messageType.RP ||
              item.childMessageType == 'RP'
          "
        >
          <text v-if="item.body.indexOf('SUBMIT')"
            >{{ self(item) ? '提交' : '开' }}了{{
              JSON.parse(item.body).num
            }}个处方，审核中</text
          >
          <template v-else>
            <text>发送了处方，</text>
            <navigator
              class="btn-text"
              :url="
                clientType == 'USER'
                  ? `/pages-user/prescription/info?id=${order.orderId}`
                  : `/pages-doctor/user/prescription/info?id=${order.orderId}`
              "
              >查看详情</navigator
            >
          </template>
        </template>
        <template v-else-if="item.childMessageType === messageType.EMH">
          <text>发送了病历，</text>
          <navigator
            class="btn-text"
            :url="`/pages-user/medical/detail?orderId=${order.orderId}`"
            >点击查看</navigator
          >
        </template>
        <text
          v-else-if="[messageType.DIAS, 'DIAS'].includes(item.childMessageType)"
          @click="viewDIAS(item.body)"
        >
          发送了诊断，
          <text class="btn-text">点击查看</text>
        </text>
        <text
          v-else-if="[messageType.DSO, 'DSO'].includes(item.childMessageType)"
          @click="viewDSO(item.body)"
        >
          发送了处置单，
          <text class="btn-text">点击查看</text>
        </text>
        <text
          v-else-if="[messageType.ZJ, 'ZJ'].includes(item.childMessageType)"
          @click="viewZJ(item.body)"
        >
          发送了诊间预约单，
          <text class="btn-text" v-if="clientType == 'USER'">
            点击查看
          </text>
        </text>
      </template>
    </view>
  </view>
</template>

<script>
import { findDiagContentById } from '@/common/request/index.js'
export default {
  props: {
    order: Object,
    messageBox: Array,
  },
  data() {
    return {
      userId: uni.getStorageSync('userId'),
      messageType: this.$protobufMessageType,
      chatType: this.$protobufChatType,
      clientType: uni.getStorageSync('clientType'),
    }
  },
  computed: {
    userType() {
      return this.clientType == 'USER' ? 3 : 2
    },
  },
  methods: {
    previewImage(fileId) {
      const index = this.messageBox
        .filter(
          ({ childMessageType }) => childMessageType == this.messageType.IMAGE,
        )
        .map(({ body }) => body)
        .indexOf(fileId)

      this.$emit('previewImage', {
        index,
      })
    },
    async viewDIAS() {
      const content = await findDiagContentById({
        diagId: this.order.orderId,
      })
      uni.showModal({
        title: '诊断内容',
        content,
        showCancel: false,
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
      if (this.userType == 2) return
      const id = JSON.parse(body).content
      uni.navigateTo({
        url:
          this.clientType == 'USER'
            ? `/pages-user/myAppointment/detail?id=${id}`
            : `/pages-doctor/treatment/detail/index?id=${id}`,
      })
    },
  },
}
</script>

<style lang="scss">
.message {
  max-width: 100%;
  padding: 16rpx;
  color: #fff;

  &.self {
    color: #84ff70;
  }
}

.btn-text {
  display: inline;
  color: $uni-color-primary;
}
</style>
