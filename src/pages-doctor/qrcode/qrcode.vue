<template>
  <view style="height: 100%; overflow: hidden;">
    <view class="canvas flex-center">
      <canvas
        :style="{ width: cansWidth + 'rpx', height: cansHeight + 'rpx' }"
        canvas-id="firstCanvas"
      ></canvas>
      <cover-view class="btn" @click="saveCans">保存二维码</cover-view>
    </view>
    <view v-show="iscode" style="position: absolute;bottom: -100%; z-index: -1;"
      ><canvas canvas-id="qrcode" style="width: 215px;height: 215px;"
    /></view>
  </view>
</template>

<script>
// import uQRCode from '@/common/uqrcode.js';
import bgimg from '@/assets/qrcodebg@2x.png';
export default {
  data() {
    return {
      cansWidth: 710, //海报宽度
      cansHeight: 1035, //海报高度
      widths: '', //图片列表动态宽度
      imgsrc: '', //保存图片的路径
      userdata: {}, //个人数据
      iscode: true
    };
  },
  computed: {
    avatar: function() {
      return this.FILE_URL(this.$store.state.avatar);
    },
    userInfo: function() {
      return this.$store.state.userInfo;
    }
  },
  onReady() {
    this.make();
  },
  methods: {
    async make() {
      // uQRCode.make({
      //   canvasId: 'qrcode',
      //   componentInstance: this,
      //   text:  this.FILE_URL(this.$store.state.userInfo.qrCode),
      //   size: 200,
      //   margin: 10,
      //   backgroundColor: '#ffffff',
      //   foregroundColor: '#000000',
      //   fileType: 'jpg',
      //   correctLevel: uQRCode.defaults.correctLevel,
      //   success: async res => {
      //     console.log(res);
      //     this.iscode = false;
      //     let img = await this.getImg();
      //     this.selseimg(res, img);
      //   }
      // });

      const img = await this.getImg();
      this.selseimg(this.FILE_URL(this.$store.state.userInfo.qrCode), img);
    },
    getImg() {
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: this.avatar,
          success: res => {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath);
            } else {
              new Error(res.errMsg);
              reject(res.errMsg);
            }
          }
        })
      });
    },
    base64src(base64data, name) {
      const fsm = wx.getFileSystemManager();
      return new Promise((resolve, reject) => {
        const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
        if (!format) {
          reject(new Error('ERROR_BASE64SRC_PARSE'));
        }
        const filePath = `${wx.env.USER_DATA_PATH}/${name}.${format}`;
        const buffer = uni.base64ToArrayBuffer(bodyData);
        fsm.writeFile({
          filePath,
          data: buffer,
          encoding: 'binary',
          success() {
            resolve(filePath);
          },
          fail() {
            reject(new Error('ERROR_BASE64SRC_WRITE'));
          },
        });
      });
    },

    async selseimg(e, img) {
      //绘制海报
      let rpx;
      //获取屏幕宽度，获取自适应单位
      uni.getSystemInfo({
        success: function(res) {
          rpx = res.windowWidth / 375;
        }
      });

      let that = this;
      uni.showLoading({
        title: '生成海报中'
      });
      const bg = await this.base64src(bgimg, 'bg')
      // const header = await this.base64src(img, 'header')
      const context = uni.createCanvasContext('firstCanvas');
      context.drawImage(bg, -10 * rpx, 0, 374 * rpx, 530 * rpx); //海报背景
      context.drawImage(e, 72.5 * rpx, 200 * rpx, 220 * rpx, 220 * rpx); //二维码图片

      context.setFillStyle('#fff');
      context.setFontSize(20);
      context.textAlign = 'center'; //文字居中
      context.fillText(that.userInfo.username, 177.5 * rpx, 150 * rpx); //昵称
      context.fill();

      context.setFillStyle('#fff');
      context.setFontSize(12);
      context.textAlign = 'center'; //文字居中
      context.fillText(that.userInfo.orgName + ' ' + that.userInfo.deptName + ' ' + that.userInfo.titleName, 177.5 *
        rpx, 176 * rpx);
      context.fill();

      this.circleImg(context, img, 147 * rpx, 50 * rpx, 35 * rpx) //头像
      context.restore();
      context.draw();

      uni.hideLoading();
    },
    // 调用剪切头像方式
    circleImg(ctx, img, x, y, r) {
      //圆形头像
      ctx.save();
      var d = 2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, x, y, d, d);
    },
    saveCans(e) {
      let that = this;
      //保存海报
      uni.showLoading({
        title: '保存海报中'
      });

      console.log('保存');
      let tempRatio = 1.5;

      // #ifdef H5 || APP-PLUS
      tempRatio = 1;
      // #endif

      uni.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: that.cansWidth * tempRatio,
          height: that.cansHeight * tempRatio,
          destWidth: that.cansWidth * tempRatio * 2,
          destHeight: that.cansHeight * tempRatio * 2,
          canvasId: 'firstCanvas',
          success: function(res) {
            uni.hideLoading();
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(red) {
                uni.showToast({
                  title: '保存相册成功'
                });
                that.imgsrc = res.tempFilePath;
              },
              fail(res) {
                if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
                  uni.showModal({
                    title: '您需要授权相册权限',
                    success(res) {
                      if (res.confirm) {
                        uni.openSetting({
                          success(res) {},
                          fail(res) {
                            console.log(res);
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          },
          fail(res) {
            uni.hideLoading();
          }
        },
        this
      );
    }
  }
}
</script>

<style lang="scss">
.canvas {
  position: relative;
  flex-direction: column;

  .btn {
    top: -114rpx;
    z-index: 5551;
  }
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20rpx;
  // padding: 60rpx 0 0;
  // background-position: -20rpx -22rpx;
  // background-size: 750rpx;
  color: #fff;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}

.name {
  font-size: 34rpx;
}

.qrcode {
  margin-top: 42rpx;
  width: 460rpx;
  height: 460rpx;
}

.btn {
  position: relative;
  // margin-top: 90rpx;
  width: 100%;
  height: 110rpx;
  line-height: 110rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 32rpx;
  color: $uni-color-primary;

  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    top: -16rpx;
    left: 10rpx;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    background-color: #f1f1f1;
    box-shadow: inset -4rpx 0 10rpx #dbdbdb;
  }

  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    top: -16rpx;
    right: 6rpx;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    background-color: #f1f1f1;
    box-shadow: inset 4rpx 0 10rpx #dbdbdb;
  }
}
</style>
