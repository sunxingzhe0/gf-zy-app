<template>
  <view class="detail">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="box-shadow" style="background: #fff">
      <view class="change-tag" @click="changeTag">{{
        isCode ? '切换就诊卡' : '切换健康卡'
      }}</view>

      <view v-show="isCode" class="ewmImg">
        <canvas
          v-show="!istextarea"
          canvas-id="qrcode"
          style="width: 200px; height: 200px; margin: 0 auto"
        />
      </view>
      <view v-show="!isCode" class="ewmImg">
        <view v-if="mzNo" class="img" @click="previewImg(0)">
          <tki-barcode
            ref="barcode"
            :show="true"
            format="code128"
            :cid="1"
            :val="mzNo"
            unit="upx"
            :opations="opations"
            :onval="false"
            :loadMake="true"
            @result="barresult"
          />
        </view>
        <view class="mz-num">门诊号：{{ mzNo || '-' }}</view>
        <view class="code-box" @click="previewImg(1)" v-show="!isShowBrCode">
          <canvas
            canvas-id="barCode"
            style="width: 150px; height: 150px; margin: 0 auto"
          />
        </view>
      </view>
      <view class="tmImg"><view></view></view>
      <view class="border-b">
        <view class="round_left"></view>
        <view class="round_left round_right"></view>
      </view>
      <view class="info">
        <view class="flex-between">
          <view class="name">{{ infoData.name }}</view>
          <view class="relationship">{{
            relations[Number(infoData.relation)] || ''
          }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">健康卡号</view>
          <view class="value">{{ infoData.patientCard || '' }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">性别</view>
          <view class="value">{{
            infoData.sex == 0 ? '女' : infoData.sex == 1 ? '男' : '-'
          }}</view>
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
          <button
            type="primary"
            plain
            size="mini"
            style="color:#0ab2c1;border:none"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            更换
          </button>
        </view>
        <!-- <view class="mt10 flex-start-center" @click.stop>
          <evan-checkbox
            v-model="infoData.def"
            shape="square"
            @change="defauChange"
            :primary-color="primaryColor"
          ></evan-checkbox
          ><text class="checkText">设为默认</text>
        </view> -->
      </view>
      <view class="border-b">
        <view class="round_left"></view>
        <view class="round_left round_right"></view>
      </view>
      <view class="main">
        <view class="messageItem">
          <view class="flex-between">
            <view class="title"
              >职业
              <text style="font-size: 26rpx;color: #666;margin-left:100rpx">{{
                infoData.careerName || ''
              }}</text>
            </view>

            <picker
              class="flex_1"
              mode="selector"
              :range="occupation"
              :value="careerName"
              @change="changeCareerName"
            >
              <view class="edit flex-end">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </picker>
          </view>
        </view>

        <view class="messageItem">
          <view class="flex-between">
            <view class="title">现居地</view>
            <view class="edit">
              <view @click="isEdit(0)">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </view>
          </view>
          <view class="textarea" v-show="infoData.addressNow">{{
            infoData.addressNow
          }}</view>
        </view>
        <view class="messageItem">
          <view class="flex-between">
            <view class="title">常居地</view>
            <view class="edit">
              <view @click="isEdit(1)">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </view>
          </view>
          <view class="textarea" v-show="infoData.liveAddress">{{
            infoData.liveAddress
          }}</view>
        </view>
        <view class="messageItem">
          <view class="flex-between">
            <view class="title">过敏史</view>
            <view class="edit">
              <view @click="isEdit(2)">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </view>
          </view>
          <view class="textarea" v-show="infoData.allergies">{{
            infoData.allergies
          }}</view>
        </view>
        <view class="messageItem">
          <view class="flex-between">
            <view class="title">既往史</view>
            <view class="edit">
              <view @click="isEdit(3)">
                <uni-icons type="compose" size="18" color="#666"></uni-icons>
                编辑
              </view>
            </view>
          </view>
          <view class="textarea" v-show="infoData.pastHistory">{{
            infoData.pastHistory
          }}</view>
        </view>
      </view>
      <view class="border-b">
        <view class="round_left"></view>
        <view class="round_left round_right"></view>
      </view>
      <view class="uni-center del" @click="del"><text>删除</text></view>
    </view>
    <uni-popup ref="edit">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">修改{{ popTitle[editTitle] }}</view>
          <view class="popText">
            <textarea
              class="textMain"
              :placeholder="fontLenth[editTitle]"
              :maxlength="lengths[editTitle]"
              placeholder-style="font-size:26rpx; color:#666;"
              v-model="content"
            />
            <view class="textNum"
              >{{ content.length || 0 }}/{{ lengths[editTitle] }}</view
            >
          </view>
        </view>
        <view class="pop-btn flex-between">
          <view
            class="close flex_1"
            @click="
              this.$refs.edit.close()
              istextarea = false
            "
            >取消</view
          >
          <view class="flex_1" @click="submit(editTitle)">保存</view>
        </view>
      </view>
    </uni-popup>
    <!-- 条码二维码预览窗口 -->
    <view v-if="isShowBrCode" @click="closeCode" class="pre-img">
      <view class="img-box" v-show="!showType">
        <view class="code-no">{{ mzNo }}</view>
        <image class="code-img" :src="codeUrl"></image>
      </view>
      <view v-show="showType">
        <canvas
          canvas-id="model-code"
          style="width: 200px; height: 200px; margin: 0 auto"
        />
      </view>
    </view>
  </view>
</template>

<script>
import {
  getPatientInfo,
  editPatientInfo,
  getOutSno,
  deletePatient,
} from '@/common/request/userCenter'
// import tkiBarcode from '@/pages-user/components/tki-barcode/tki-barcode.vue'
import { getDictList, getMiniPhoneByCode } from '@/common/request/userCenter'
import evanCheckbox from '@/components/evan-checkbox/evan-checkbox.vue'
import tkiBarcode from '@/pages-user/components/tki-barcode/tki-barcode.vue'
import drawQrcode from 'weapp-qrcode'
import util from '@/common/util'
export default {
  components: {
    evanCheckbox,
    tkiBarcode,
  },
  data() {
    return {
      careerName: '',
      occupation: [], //职业
      util: util,
      checked: false,
      disabled: true,
      primaryColor: '#0AB2C1',
      editTitle: 0,
      content: '',
      infoData: {},
      popTitle: ['现居地', '常居地', '过敏史', '既往史'],
      fontLenth: ['限50字', '限50字', '限200字', '限50字'],
      relations: ['本人', '父母', '子女', '夫妻', '亲属', '朋友', '其他'],
      lengths: [50, 50, 200, 50],
      form: {
        memberId: '',
        def: null,
        careerName: '',
        addressNow: '',
        liveAddress: '',
        allergies: null,
        pastHistory: null,
      },
      istextarea: false,
      mzNo: '',
      isCode: false,
      opations: {
        format: 'code39',
        displayValue: false,
        height: 160,
      },
      codeUrl: '',
      isShowBrCode: false,
      showType: 0,
    }
  },
  onLoad(options) {
    if (options.id) {
      this.form.memberId = options.id

      this.patientInfo(true)
    }
  },
  created() {
    this.getDictList()
  },
  methods: {
    previewImg(type) {
      //type 0 条码 1二维码
      console.log('预览')
      this.isShowBrCode = true
      this.showType = type
      if (type) {
        //生成门诊号二维码
        drawQrcode({
          width: 200,
          height: 200,
          canvasId: 'model-code',
          text: this.mzNo,
        })
      }
    },
    closeCode() {
      this.isShowBrCode = false
    },
    barresult(e) {
      console.log(e, '条码地址----------------------------')
      this.codeUrl = e
    },
    //切换条码二维码
    changeTag() {
      this.isCode = !this.isCode
    },
    async getPhoneNumber(e) {
      console.log(e.detail.code)
      if (!e.detail.code) return
      const res = await getMiniPhoneByCode({ code: e.detail.code })
      await editPatientInfo({
        memberId: this.form.memberId,
        phone: res.phone_info.phoneNumber,
      })
      uni.showToast({
        title: '编辑成功',
        relations: 1500,
      })
      setTimeout(async () => {
        await this.patientInfo()
      }, 1500)
      console.log(res, '--')
    },
    async changeCareerName(e) {
      this.form.careerName = this.occupation[e.detail.value]
      await editPatientInfo({
        careerName: this.occupation[e.detail.value],
        memberId: this.form.memberId,
      })
      uni.showToast({
        title: '编辑成功',
        relations: 1500,
      })
      await this.patientInfo()
    },
    //获取职业列表
    async getDictList() {
      this.occupation = (await getDictList()).map(v => v.name)
    },
    // 生成二维码
    make(text) {
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'qrcode',
        text,
        image: {
          imageResource: '../../static/red-cross.png',
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60,
        },
      })
    },
    async patientInfo(a) {
      uni.showLoading()
      const data = await getPatientInfo({
        memberId: this.form.memberId,
      })
      uni.hideLoading()
      this.infoData = { ...data }
      this.getMzNo(data.patientCard)
      if (a) {
        this.make(data.qrCodeText)
      }
    },
    //获取门诊号
    async getMzNo(patientCard) {
      this.mzNo = await getOutSno({ cardNo: patientCard })
      //生成门诊号二维码
      drawQrcode({
        width: 150,
        height: 150,
        canvasId: 'barCode',
        text: this.mzNo,
      })
      console.log(this.mzNo, '门诊号-------------------')
    },
    isEdit(type) {
      this.$refs['edit'].open()
      this.istextarea = true
      this.editTitle = type
      const contents = [
        this.infoData.addressNow,
        this.infoData.liveAddress,
        this.infoData.allergies,
        this.infoData.pastHistory,
      ]
      this.content = contents[type]
    },
    async defauChange(e) {
      this.form.allergies = null
      this.form.pastHistory = null
      this.form.def = true
      if (e) {
        await editPatientInfo(this.form)
        uni.showToast({
          title: '设置成功',
        })
      }
      await this.patientInfo()
    },
    toInfoManage() {
      uni.showModal({
        title: '是否前往解除健康卡与微信的绑定？',
        success(res) {
          if (res.confirm) {
            //跳转至微信健康卡管理
            uni.reLaunch({
              url: '/pages-user/patientManagement/infoManage',
            })
          } else if (res.cancel) {
            uni.navigateBack({
              delta: 1,
            })
          }
        },
      })
    },
    del() {
      const that = this
      uni.showModal({
        title: '确认删除该就诊人?',
        success: res => {
          if (res.confirm) {
            deletePatient({
              memberId: that.form.memberId,
            }).then(() => {
              uni.showToast({
                title: '删除成功',
              })
              uni.$emit('updateCard')
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                })
              }, 1500)
              // this.toInfoManage() //调用提示
            })
          }
        },
      })
    },
    async submit(type) {
      this.form.def = null
      const keys = ['addressNow', 'liveAddress', 'allergies', 'pastHistory']
      this.form[keys[type]] = this.content || '暂无'
      await editPatientInfo({
        [keys[type]]: this.content,
        memberId: this.form.memberId,
      })
      uni.showToast({
        title: '编辑成功',
      })
      this.$refs['edit'].close()
      await this.patientInfo()
      this.istextarea = false
    },
  },
}
</script>

<style lang="scss">
.popText {
  background: #f2f2f2;
  padding: 12rpx;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
  width: 100%;
  box-sizing: border-box;
  .textMain {
    width: 100%;
    font-size: 26rpx;
    line-height: 32rpx;
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

  ::v-deep.evan-checkbox__label {
    font-size: 28rpx;
  }

  ::v-deep.evan-checkbox__inner {
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
.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.change-tag {
  text-align: right;
  color: $uni-color-primary;
  padding: 20rpx 20rpx 0 0;
}
.mz-num {
  text-align: center;
  margin: 20rpx 0;
}
.tki-barcode {
  image {
    min-width: 330px;
    max-width: 340px;
  }
}
.warp {
  min-width: 1080rpx;
  min-height: 1920rpx;
  background: #fff;
}
.pre-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
.img-box {
  transform: rotate(90deg);
  .code-no {
    text-align: center;
    margin-bottom: 20rpx;
    letter-spacing: 10rpx;
  }
  .code-img {
    min-width: 1000rpx;
    max-height: 300rpx;
  }
}
</style>
