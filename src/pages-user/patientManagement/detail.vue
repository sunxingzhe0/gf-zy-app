<template>
  <view class="detail">
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
    <view class="box-shadow" style="background: #fff;">
      <view class="ewmImg">
        <canvas v-show="!istextarea" canvas-id="qrcode" style="width: 180px;height: 180px;margin: 0 auto;" />
        <view>
          <tki-barcode
            ref="barcode"
            :opations="{ width: 4, height: 120, fontSize: 28, displayValue: false, textMargin: 5, margin: 30, text: '' }"
            :show="show"
            :val="infoData.patientCard"
            format="code39"
            :onval="true"
          />
        </view>
      </view>
      <view class="tmImg"><view></view></view>
      <view class="border-b">
        <view class="round_left"></view>
        <view class="round_left round_right"></view>
      </view>
      <view class="info">
        <view class="name">{{ infoData.name }}</view>
        <view class="flex-start-center">
          <view class="title">性别</view>
          <view class="value">{{ infoData.sex == 1 ? '男' : '女' }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">出生日期</view>
          <view class="value">{{ infoData.birthDay }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">身份证号</view>
          <view class="value">{{ util.noPassByIdcard(infoData.idCard) }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">手机号</view>
          <view class="value">{{ util.noPassByMobile(infoData.phone) }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">就诊卡号</view>
          <view class="value">{{ infoData.patientCard }}</view>
        </view>
        <view class="mt10 flex-start-center" @click.stop>
          <evan-checkbox v-model="infoData.def" shape="square" @change="defauChange" :primary-color="primaryColor"></evan-checkbox><text class="checkText">设为默认</text>
        </view>
      </view>
      <view class="border-b">
        <view class="round_left"></view>
        <view class="round_left round_right"></view>
      </view>
      <view class="main">
        <view class="messageItem">
          <view class="flex-between">
            <view class="title">过敏史</view>
            <view class="edit">
              <view @click="isEdit(1)">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </view>
          </view>
          <view class="textarea" v-show="infoData.allergies">{{ infoData.allergies }}</view>
        </view>
        <view class="messageItem">
          <view class="flex-between">
            <view class="title">既往史</view>
            <view class="edit">
              <view @click="isEdit(2)">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </view>
          </view>
          <view class="textarea" v-show="infoData.pastHistory">{{ infoData.pastHistory }}</view>
        </view>
      </view>
      <view class="border-b">
        <view class="round_left"></view>
        <view class="round_left round_right"></view>
      </view>
      <view class="uni-center del" @click="del"><text>删除</text></view>
    </view>
    <uni-popup ref="edit1">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">修改过敏史</view>
          <view class="popText">
            <textarea
            v-show="istextarea"
              class="textMain"
              placeholder="限200字"
              maxlength="200"
              placeholder-style="font-size:26rpx; color:#666;"
              v-model="content"
            ></textarea>
            <view class="textNum">{{ content.length || 0 }}/200</view>
          </view>
        </view>
        <view class="pop-btn flex-between">
          <view class="close flex_1" @click="this.$refs.edit1.close();istextarea = false">取消</view>
          <view class="flex_1" @click="submit(1)">保存</view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="edit2">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">修改既往史</view>
          <view class="popText">
            <textarea
            v-show="istextarea"
              class="textMain"
              placeholder="限50字"
              maxlength="50"
              placeholder-style="font-size:26rpx; color:#666;"
              v-model="content"
            ></textarea>
            <view class="textNum">{{ content.length || 0 }}/50</view>
          </view>
        </view>
        <view class="pop-btn flex-between">
          <view class="close flex_1" @click="this.$refs.edit2.close();istextarea = false">取消</view>
          <view class="flex_1" @click="submit(2)">保存</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { getPatientInfo, editPatientInfo, deletePatient } from '@/common/request/userCenter';
import evanCheckbox from '@/components/evan-checkbox/evan-checkbox.vue';
import tkiBarcode from '@/components/tki-barcode/tki-barcode.vue';
import uQRCode from '@/common/uqrcode.js';
import util from '@/common/util';
export default {
  components: {
    evanCheckbox,
    tkiBarcode
  },
  data() {
    return {
      util: util,
      checked: false,
      disabled: true,
      primaryColor: '#0AB2C1',
      editTitle: 0,
      content: '',
      infoData: {},
      form: {
        memberId: '',
        def: null,
        pastHistory: null,
        allergies: null
      },
      istextarea:false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.form.memberId = options.id;

      this.patientInfo(true);
    }
  },
  methods: {
    // 生成二维码
    make() {
      uQRCode.make({
        canvasId: 'qrcode',
        componentInstance: this,
        text: 'uQRCode',
        size: 180,
        margin: 10,
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        fileType: 'jpg',
        text: this.infoData.patientCard,
        correctLevel: uQRCode.defaults.correctLevel,
        success: res => {
          console.log(res);
        }
      });
    },
    async patientInfo(a) {
      this.infoData = await getPatientInfo({
        memberId: this.form.memberId
      });
      if (a) {
        this.make();
      }
    },
    isEdit(type) {
      this.editTitle = type;
      this.content = type == 1 ? (this.infoData.allergies == '暂无' ? '' : this.infoData.allergies) : this.infoData.pastHistory == '暂无' ? '' : this.infoData.pastHistory;
      if(type == 1){
        this.$refs.edit1.open();
      }else{
        this.$refs.edit2.open();
      }
      setTimeout(()=>{
        this.istextarea = true
      },400)
    },
    async defauChange(e) {
      this.form.allergies = null;
      this.form.pastHistory = null;
      this.form.def = true;
      if (e) {
        await editPatientInfo(this.form);
        uni.showToast({
          title: '设置成功'
        });
      }
      await this.patientInfo();
    },
    del() {
      const that = this;
      uni.showModal({
        title: '确认删除该就诊人?',
        success(res) {
          if (res.confirm) {
            deletePatient({
              memberId: that.form.memberId
            }).then(() => {
              uni.showToast({
                title: '删除成功'
              });
              uni.navigateBack({
                delta: 1
              });
            });
          }
        }
      });
    },
    async submit(type) {
      this.form.allergies = null;
      this.form.pastHistory = null;
      this.form.def = null;
      if (this.editTitle == 1) {
        this.form.allergies = this.content ? this.content : '暂无';
      } else {
        this.form.pastHistory = this.content ? this.content : '暂无';
      }
      let res = await editPatientInfo(this.form);
      if (res) {
        await this.patientInfo();
        if(type == 1){
          this.$refs.edit1.close();
        }else{
          this.$refs.edit2.close();
        }
        this.istextarea = false
      }
    }
  }
};
</script>

<style lang="scss">
.popText {
  background: #f2f2f2;
  padding: 20rpx;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
  width: 100%;
  box-sizing: border-box;
  .textMain {
    width: 520rpx;
    height: 184px;
    font-size: 26rpx;
    line-height: 36rpx;
  }
  .textNum {
    text-align: right;
  }
}

.ewmImg {
  padding-top: 30rpx;
  padding-bottom: 30rpx;

  image {
    // width: 100% !important;
    // height: 120rpx;
    margin: 0 auto;
    display: block;
  }
}

.border-b {
  border-top: 1px dashed #e6e6e6;
  position: relative;

  .round_left {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #f2f2f2;
    left: -7px;
    top: 50%;
    margin-top: -7px;
    box-shadow: inset 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
  }

  .round_right {
    left: auto;
    right: -7px;
  }
}

.detail {
  padding: 20rpx;
}

.info {
  padding: 30rpx;
  line-height: 56rpx;
  padding-bottom: 40rpx;

  .name {
    color: #1a1a1a;
    font-size: 30rpx;
    font-weight: bold;
  }

  .title {
    width: 190rpx;
    font-size: 26rpx;
    color: #666;
  }

  .value {
    font-size: 26rpx;
    color: #333;
  }

  .checkText {
    font-size: 24rpx;
    color: #666;
    margin-left: 10rpx;
  }

  /deep/.evan-checkbox__label {
    font-size: 28rpx;
  }

  /deep/.evan-checkbox__inner {
    width: 16px !important;
    height: 16px !important;
  }
}

.mt10 {
  margin-top: 10rpx;
}

.del {
  margin-top: 25rpx;
  padding-bottom: 25rpx;

  text {
    color: $uni-color-error;
    font-size: 30rpx;
  }
}

.main {
  padding: 30rpx 40rpx;
  padding-bottom: 0;
  transition: height 0.8s;

  .messageItem {
    padding-bottom: 40rpx;

    .title {
      position: relative;
      padding-left: 13rpx;
      font-size: 30rpx;
      color: #333;
      font-weight: bold;

      &::before {
        content: '';
        position: absolute;
        width: 4rpx;
        height: 30rpx;
        background: $uni-color-primary;
        left: 0;
        top: 50%;
        margin-top: -15rpx;
      }
    }

    .edit {
      color: #666;
      font-size: 26rpx;

      .wanc {
        color: $uni-color-primary;

        .iconfont {
          font-size: 35rpx;
        }
      }
    }

    .textarea {
      width: 100%;
      font-size: 26rpx;
      color: #666;
      margin-top: 20rpx;
      line-height: 36rpx !important;
      word-wrap: break-word;
    }
  }
}
</style>
