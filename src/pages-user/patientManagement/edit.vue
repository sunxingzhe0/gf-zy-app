<template>
  <view class="wrap orderWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="box-shadow oerderMain">
      <view class="orderItem">
        <view class="font-weight font30 colora1a1">{{ infoData.name }}</view>
        <view class="flex-start-center">
          <view class="title">就诊卡</view>
          <view class="info">{{ infoData.patientCard }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">电话号码</view>
          <view class="info">{{ util.noPassByMobile(infoData.phone) }}</view>
        </view>
      </view>
      <view class="orderItem">
        <view class="font30 color333">常居地</view>
        <textarea
          class="textarea"
          v-model="form.liveAddress"
          placeholder-class="placeholder"
          maxlength="50"
          placeholder="请输入常居地，限50字内"
        />
      </view>
      <view class="orderItem">
        <view class="font30 color333">过敏史</view>
        <textarea
          class="textarea"
          v-model="form.allergies"
          placeholder-class="placeholder"
          maxlength="200"
          placeholder="请输入过敏史，限200字内"
        />
      </view>
      <view class="orderItem">
        <view class="font30 color333">既往史</view>
        <textarea
          class="textarea"
          v-model="form.pastHistory"
          placeholder-class="placeholder"
          maxlength="50"
          placeholder="请输入既往史，限50字内"
        />
      </view>
    </view>
    <button class="submit_btn" @click="submit" type="primary">保存</button>
    <view
      class="font30 pricolor"
      style="text-align: center; cursor: pointer;"
      @click="goto"
      >跳过</view
    >
  </view>
</template>

<script>
import { getPatientInfo, editPatientHistory } from '@/common/request/userCenter'
import util from '@/common/util'
export default {
  data() {
    return {
      util: util,
      id: '',
      form: {
        memberId: '',
        liveAddress: '',
        allergies: '',

        pastHistory: '',
      },
      infoData: {},
    }
  },
  onLoad(options) {
    if (options.id) {
      this.form.memberId = options.id
      this.patientInfo()
    }
  },
  methods: {
    async patientInfo() {
      this.infoData = await getPatientInfo({ memberId: this.form.memberId })
      if (this.infoData.liveAddress) {
        this.form.liveAddress = this.infoData.liveAddress
      }
      if (this.infoData.allergies) {
        this.form.allergies = this.infoData.allergies
      }
      if (this.infoData.pastHistory) {
        this.form.pastHistory = this.infoData.pastHistory
      }
    },
    async submit() {
      let res = await editPatientHistory(this.form)
      if (res) {
        this.goto()
      }
    },
    goto() {
      uni.$emit('updateCard')
      uni.navigateTo({
        url: '/pages-user/patientManagement/list',
      })
      // uni.navigateBack({
      //   delta: 1,
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';
.wrap {
  padding: 20rpx;
  margin-top: 0;
  .textarea {
    padding: 30rpx;
    width: 100%;
    box-sizing: border-box;
    background: #f2f2f2;
    font-size: 26rpx;
    margin-top: 30rpx;
    height: 200rpx;
  }
  .placeholder {
    color: #999999;
    font-size: 26rpx;
  }
  .submit_btn {
    position: relative;
    bottom: 0;
    margin-top: 30rpx;
    margin-bottom: 30rpx;
  }
}
</style>
