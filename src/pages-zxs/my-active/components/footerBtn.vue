<template>
  <view class="footer">
    <view class="btn" @click="goto">报名名单</view>
    <view class="btn" @click="copyUrl">分享</view>
    <view class="btn QR" @click="erCodeOpen">二维码</view>
    <uni-popup ref="popup" type="bottom">
      <view class="pop-content">
        <view class="pop-top">
          <view style="flex:1;text-align:center;font-size:30rpx;color:1a1a1a"
            >活动二维码</view
          >
          <image
            @click="closePop"
            class="pop-close"
            :src="require('@/assets/close-popup.png')"
            style="width:30rpx;height:30rpx"
          ></image>
        </view>
        <view class="QR-view">
          <canvas
            class="code"
            :canvas-id="'qrcode' + signId"
            style="width: 200px; height: 200px; margin: 0 auto"
          ></canvas>
        </view>
        <view class="pop-confirm" @click="downloadCode">保存到本地</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { xzActiveLink } from '@/urls.js'
import drawQrcode from 'weapp-qrcode'
export default {
  props: ['signId', 'activityTemplateId', 'actName', 'actType', 'actState'],
  data() {
    return {
      templates: {
        'template_01.jpg': 'pages/recommend/detailTemplateBase',
        'template_02.jpg': 'pages/recommend/detailTemplateOne',
        'template_03.jpg': 'pages/recommend/detailTemplateTwo',
        'template_04.jpg': 'pages/recommend/detailTemplateThree',
        'template_05.jpg': 'pages/recommend/detailTemplateBase',
      },
      acticityUrl: '',
      imagePath: '',
    }
  },
  created() {
    console.log(this.activityTemplateId, this.signId)
    this.acticityUrl = `${xzActiveLink}${
      this.templates[this.activityTemplateId]
    }?activityId=${this.signId}&token=${uni.getStorageSync('token')}`
  },
  methods: {
    goto() {
      uni.navigateTo({
        url: `/pages-zxs/signupOrder/index?id=${this.signId}&actName=${this.actName}&actType=${this.actType}&actState=${this.actState}`,
      })
    },
    copyUrl() {
      uni.setClipboardData({
        data: this.acticityUrl,
        success: function() {
          uni.showToast({
            title: '复制链接成功',
            duration: 2000,
            icon: 'none',
          })
        },
        fail: function(err) {
          uni.showToast({
            title: '复制失败',
            duration: 2000,
            icon: 'none',
          })
        },
      })
    },
    closePop() {
      this.$refs.popup.close()
    },
    erCodeOpen() {
      this.$refs.popup.open()
      this.$nextTick(() => {
        setTimeout(() => {
          this.draw()
        }, 100)
      })
    },
    // 生成二维码
    draw() {
      console.log(this.acticityUrl)
      drawQrcode({
        width: 200, // 画出的二维码的宽高，单位为px
        height: 200,
        canvasId: 'qrcode' + this.signId, // 拿到canvas节点
        text: this.acticityUrl, // 文本数据
        _this: this,
        callback(e) {
          console.log(e)
        },
      })
      this.canvasToTempImage() // 画完之后获取临时路径
    },
    canvasToTempImage() {
      setTimeout(() => {
        uni.canvasToTempFilePath(
          {
            canvasId: 'qrcode' + this.signId,
            success: res => {
              this.imagePath = res.tempFilePath
            },
            fail: res => {
              console.log(res)
            },
          },
          this,
        )
      }, 200)
    },
    // 下载图片
    downloadCode() {
      var filePath = this.imagePath
      console.log('下载中' + filePath)
      uni.saveImageToPhotosAlbum({
        filePath: filePath,
        success: res => {
          uni.showToast({
            title: '图片保存成功',
            icon: 'success',
            duration: 2000, //持续的时间
          })
        },
        fail: err => {
          console.log(err)
          uni.showToast({
            title: '图片保存失败',
            icon: 'none',
            duration: 2000, //持续的时间
          })
        },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  position: fixed;
  z-index: 2;
  bottom: 0;
  right: 0;
  width: 100%;
  background: #fff;
  padding: 15rpx 20rpx;
  box-sizing: border-box;
  justify-content: flex-end;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.15);
  .btn {
    width: 180rpx;
    height: 72rpx;
    margin-left: 20rpx;
    box-sizing: border-box;
    border-radius: 36rpx;
    line-height: 72rpx;
    border: 2rpx solid #ccc;
    text-align: center;
    font-size: 26rpx;
  }
  .QR {
    color: #0ab2c1;
    border-color: #0ab2c1;
  }
}
.pop-content {
  background: #fff;
  min-height: 800rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  position: relative;
  .pop-top {
    display: flex;
    height: 110rpx;
    padding: 0 40rpx;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
  }
  .pop-msg {
    margin-top: 30rpx;
    font-size: 24rpx;
    padding: 0 40rpx;
    color: #666;
  }
  .pop-title {
    display: flex;
    padding: 30rpx 0;
    justify-content: space-around;
    align-items: center;
    font-size: 30rpx;
  }
  .pop-confirm {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 88rpx;
    color: #fff;
    font-size: 30rpx;
    background: #0ab2c1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .code {
    margin: 0 auto;
  }
}
.QR-view {
  padding-top: 120rpx;
}
</style>
