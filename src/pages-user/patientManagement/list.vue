<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!--
      v-show是因为图片加载与渲染比较耗时，会导致视觉上的卡顿，
      所以等图片加载完成后再显示整条记录，视觉上会相对流畅一些
     -->
    <view
      class="health-card"
      v-for="item in list"
      :key="item.memberId"
      :data-id="item.memberId"
      @click="goDetail"
    >
      <view class="health-card-wrapper">
        <view class="org-name">重庆市卫生健康委员会</view>
        <view class="flex-between-end">
          <view>
            <view class="name">{{ item.name }}</view>
            <view class="id-card">{{ util.noPassByIdcard(item.idCard) }}</view>
          </view>
          <view style="flex-shrink: 0; padding-bottom: 22rpx">
            <canvas
              :canvas-id="'qrcode_' + item.idCard"
              style="width: 100px; height: 100px"
            ></canvas>
          </view>
        </view>
      </view>
      <image
        class="health-card-bg"
        :src="FILE_URL_BUILT_IN('health-card.png')"
        mode="widthFix"
        @load="showCard = true"
      />
    </view>
    <button class="submit_btn" type="primary" @click="add">+ 添加健康卡</button>
  </view>
</template>

<script>
import drawQrcode from 'weapp-qrcode'
import { patientList, editPatientInfo } from '@/common/request/userCenter'
import util from '@/common/util'
export default {
  data() {
    return {
      primaryColor: '#0AB2C1',
      util: util,
      list: [],
      def: true,
      showCard: false,
    }
  },
  onShow() {
    this.getpatientList()
  },

  methods: {
    async getpatientList() {
      uni.showLoading()
      const list = await patientList()
      this.list = list
      this.$nextTick(
        list.forEach(e => this.qrCode(e.qrCodeText || e.patientId, e.idCard)),
      )
      uni.hideLoading()
    },
    qrCode(text, idCard) {
      drawQrcode({
        width: 100,
        height: 100,
        canvasId: 'qrcode_' + idCard,
        text,
        image: {
          imageResource: '../../static/red-cross.png',
          dx: 35,
          dy: 35,
          dWidth: 30,
          dHeight: 30,
        },
      })
    },
    async defauChange(e, memberId) {
      this.list = this.list.map(d => Object.assign(d, { def: false }))

      const form = {
        allergies: null,
        pastHistory: null,
        def: true,
        memberId,
      }
      const res = await editPatientInfo(form)
      if (res) {
        uni.showToast({
          title: '设置成功',
        })
      }
      this.getpatientList()
    },
    goDetail(e) {
      uni.navigateTo({
        url:
          '/pages-user/patientManagement/detail?id=' +
          e.currentTarget.dataset.id,
      })
    },
    add() {
      uni.navigateTo({
        url: '/pages-user/patientManagement/add?intoList=1',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx 20rpx 140rpx;
}
.health-card {
  position: relative;

  + .health-card {
    margin-top: 20rpx;
  }
}
.health-card-bg {
  width: 100%;
}
.health-card-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 40rpx 28rpx 60rpx 40rpx;
  box-sizing: border-box;
}
.org-name {
  font-size: 22rpx;
}
.name {
  font-size: 50rpx;
}
.id-card {
  font-size: 40rpx;
}
.submit_btn {
  z-index: 999;
}
</style>
