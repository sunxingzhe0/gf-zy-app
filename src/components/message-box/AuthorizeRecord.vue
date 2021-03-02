<template>
  <view>
    <view class="title">
      <template v-if="userId == message.from">
        您正在向对方申请查看就诊记录，
        <text v-if="applyInfo.status == 'NONE'">等待中</text>
        <text v-else-if="applyInfo.status == 'ANSWERED'">
          {{ applyInfo.optContent || '' }}
        </text>
      </template>
      <template v-else>
        医生{{ info.doctorName }}正在向您申请查看就诊记录，
        <text v-if="applyInfo.status == 'NONE'">是否同意？</text>
        <text v-else-if="applyInfo.status == 'ANSWERED'">
          {{ applyInfo.optContent || '' }}
        </text>
      </template>
    </view>

    <view>
      <text>
        {{
          info.medicalType == 'MZ'
            ? '门诊记录'
            : info.medicalType == 'ZY'
            ? '住院记录'
            : info.medicalType == 'TJ'
            ? '体检报告'
            : ''
        }}
      </text>
      <text class="ml-20">{{ info.visitDate }}</text>
    </view>
    <view>{{ info.patientName }}</view>
    <view>
      <text>{{ info.deptName }}</text>
      <text class="ml-20">{{ info.doctorName }}</text>
      <text class="ml-20">{{ info.title }}</text>
    </view>
    <view
      class="button-wrapper"
      v-if="userId != message.from && applyInfo.status == 'NONE'"
    >
      <button class="button" @click="authorize(false)">拒绝</button>
      <button class="button btn-primary" @click="authorize(true)">同意</button>
    </view>
  </view>
</template>

<script>
import { getMedicalInfo } from '@/common/request'
import { replyAuth } from '@/common/request/userCenter.js'
export default {
  name: 'AuthorizeRecord',
  props: {
    message: Object,
    roomId: String,
  },
  data() {
    return {
      userId: uni.getStorageSync('userId'),
      applyInfo: JSON.parse(this.message.body),
      info: {},
    }
  },
  watch: {
    message: {
      handler() {
        this.applyInfo = JSON.parse(this.message.body)
      },
      deep: true,
    },
  },
  created() {
    this.getData()
  },
  mounted() {
    uni.$on('MESSAGE_EVENT_HANDLER', this.messageEventHandler)
  },
  methods: {
    getData() {
      getMedicalInfo({
        medicalId: this.applyInfo.content,
      }).then(data => (this.info = data))
    },
    authorize(reply) {
      replyAuth({
        roomId: this.roomId,
        authId: this.applyInfo.authId,
        msgId: this.message.id,
        reply,
      }).then(() =>
        Object.assign(this.applyInfo, {
          status: 'ANSWERED',
          optContent: reply ? '已同意' : '已拒绝',
        }),
      )
    },
    messageEventHandler(options) {
      options.msgId.forEach(id => {
        if (id === this.message.msgId) {
          uni.$off('MESSAGE_EVENT_HANDLER')

          Object.assign(this.applyInfo, {
            status: options.status,
            optContent: options.optContent,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 28rpx;
  font-weight: bolder;
}

.button {
  display: inline-block;
  width: 132rpx;
  height: 60rpx;
  line-height: 58rpx;
  margin-left: 0;
  margin-right: 20rpx;
  background-color: #eaeaea;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #333;

  &::after {
    border: none;
  }
}

.btn-primary {
  background-color: $uni-color-primary;
  color: #fff;
}

.button-wrapper {
  margin-top: 20rpx;
  text-align: right;
}

.ml20 {
  margin-left: 20rpx;
}
</style>
