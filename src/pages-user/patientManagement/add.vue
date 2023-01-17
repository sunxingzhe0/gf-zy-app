<template>
  <view class="addWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 表单 -->
    <view
      style="background: #fff; overflow: hidden; margin: 20rpx "
      class="box-shadow"
    >
      <uni-list class="inputWrap">
        <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              年龄段
            </view>
            <view class="flex-start-center flex_1">
              <uni-tag
                text="成人"
                :class="[formData.child == false ? 'on' : '', 'tag']"
                @click="radioChange('child', false)"
                circle
              ></uni-tag>
              <uni-tag
                text="儿童"
                :class="[formData.child == true ? 'on' : '', 'tag']"
                @click="radioChange('child', true)"
                circle
              ></uni-tag>
            </view>
          </view>
        </uni-list-item>

        <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              姓名
            </view>
            <input
              v-model="formData.name"
              :disabled="isFromBack || !formData.wechatCode"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人姓名"
            />
          </view>
        </uni-list-item>

        <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              身份证
            </view>
            <input
              v-model="formData.idCard"
              :disabled="isFromBack || !formData.wechatCode"
              class="flex_1"
              @change="changeUserVal"
              placeholder-class="input_pla"
              placeholder="请输入就诊人身份证"
            />
          </view>
        </uni-list-item>

        <!-- <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              性别
            </view>
            <picker
              class="flex_1"
              disabled
              @change="bindPickerChange($event, 'sex')"
              :value="index"
              :range="sexList"
              range-key="lable"
            >
              <input
                v-model="sexList[formData.sex].lable"
                disabled
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请选择就诊人性别"
              />
            </picker>
          </view>
        </uni-list-item> -->

        <!-- <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              出生日期
            </view>
            <input
              v-model="formData.birthDay"
              disabled
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人出生日期"
            />
          </view>
        </uni-list-item> -->

        <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              民族
            </view>
            <picker
              mode="selector"
              class="flex_1"
              :range="nations"
              :disabled="!formData.wechatCode"
              :value="formData.nation"
              @change="e => (this.formData.nation = nations[e.detail.value])"
            >
              <input
                v-model="formData.nation"
                :disabled="true"
                placeholder-class="input_pla"
                placeholder="请输入就诊人民族"
              />
            </picker>
          </view>
        </uni-list-item>

        <uni-list-item
          v-if="!formData.child"
          style="padding-left: 0"
          :show-arrow="false"
        >
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              职业
            </view>
            <picker
              class="flex_1"
              mode="selector"
              :disabled="!formData.wechatCode"
              :range="occupation"
              :value="formData.careerName"
              @change="
                e => (this.formData.careerName = occupation[e.detail.value])
              "
            >
              <input
                :value="formData.careerName"
                :disabled="true"
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="选择职业"
              />
            </picker>
          </view>
        </uni-list-item>

        <!-- <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              籍贯
            </view>
            <pick-regions
              class="flex_1"
              :defaultRegion="defaultRegion"
              @getRegion="handleGetRegion($event, 'address')"
            >
              <input
                v-model="formData.address"
                class="flex_1"
                disabled
                placeholder-class="input_pla"
                placeholder="请选择籍贯"
              />
            </pick-regions>
          </view>
        </uni-list-item> -->

        <!-- <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              户口地址
            </view>
            <input
              v-model="formData.liveAddress"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入户口地址"
            />
          </view>
        </uni-list-item> -->

        <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              现住址
            </view>
            <input
              v-model="formData.addressNow"
              :disabled="!formData.wechatCode"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入现住址：如xx路xx号"
            />
          </view>
        </uni-list-item>

        <uni-list-item
          v-if="formData.child"
          style="padding-left: 0"
          :show-arrow="false"
        >
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              监护人姓名
            </view>
            <input
              v-model="formData.guardName"
              :disabled="!formData.wechatCode"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入监护人姓名"
            />
          </view>
        </uni-list-item>

        <uni-list-item
          v-if="formData.child"
          style="padding-left: 0"
          :show-arrow="false"
        >
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              监护人身份证
            </view>
            <input
              v-model="formData.guardIdCard"
              :disabled="!formData.wechatCode"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入监护人身份证"
            />
          </view>
        </uni-list-item>

        <uni-list-item
          v-if="formData.child"
          style="padding-left: 0"
          :show-arrow="false"
        >
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              监护人关系
            </view>
            <picker
              class="flex_1"
              mode="selector"
              :disabled="!formData.wechatCode"
              :range="crelations"
              :value="formData.guardRelation"
              @change="e => (this.formData.guardRelation = e.detail.value)"
            >
              <input
                :value="crelations[formData.guardRelation]"
                :disabled="true"
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请选择监护人和患者之间的关系"
              />
            </picker>
          </view>
        </uni-list-item>

        <uni-list-item style="padding-left: 0" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              关系
            </view>
            <picker
              class="flex_1"
              mode="selector"
              :disabled="!formData.wechatCode"
              :range="relations"
              :value="formData.relation"
              @change="e => (this.formData.relation = e.detail.value)"
            >
              <input
                :value="relations[formData.relation]"
                :disabled="true"
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="选择为谁申领"
              />
            </picker>
          </view>
        </uni-list-item>

        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              手机号
            </view>
            <input
              type="number"
              v-model="formData.phone"
              :disabled="!formData.wechatCode"
              class="flex_1"
              maxlength="11"
              placeholder-class="input_pla"
              placeholder="请输入手机号码"
            />
          </view>
        </uni-list-item>

        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              <text class="red">*</text>
              验证码
            </view>
            <input
              :disabled="!formData.wechatCode"
              type="number"
              class="flex_1"
              v-model="formData.phoneCode"
              placeholder-class="input_pla"
              placeholder="请输入验证码"
            />
            <view class="getcode">
              <text v-if="passClick" @click="getcode">获取验证码</text>
              <text v-else>{{ timecode }}s后重新获取</text>
            </view>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
    <button
      :disabled="!formData.phoneCode"
      :class="formData.phoneCode ? '' : 'disabled-class'"
      class="submit_btn"
      type="primary"
      @click="submit"
    >
      提交
    </button>
    <view class="botton-msg" @click="toSelectCard">已有电子健康卡</view>

    <uni-popup ref="notice" :mask-click="false">
      <view class="dialog-content">
        <view class="dialogTitle">{{ '提示' }}</view>
        <scroll-view class="textBox" :scroll-y="true">
          <!-- <view class="title">{{ghNotice.title}}</view> -->
          <view class="text">当前用户未授权，请前往微信授权登录健康卡 </view>
        </scroll-view>
        <view class="noticeBtn">
          <!-- 健康卡登录组件 -->
          <health-card-login
            v-show="!formData.wechatCode"
            :authLogin="true"
            :encrypt="true"
            :wechatcode="true"
            @authFail="authFail"
            @authCancel="authCancel"
            @authSucess="authSuccess"
          >
            <!-- 组件slot，点击该区域跳转微信授权 -->
            <view @click.stop="toWey" style="width:350px;line-height:44px"
              >确认</view
            >
            <!-- 注意：开发者工具上暂不支持调试插件功能页，请在真机上测试 -->
          </health-card-login>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
const healthCardPlugins = requirePlugin('healthCardPlugins')
import { verificationCode } from '@/common/request/index'
import { idcard, GetAgeAndSexByIDNum } from '@/common/util.js'
import {
  getIdCardInfo,
  submitCardInfo,
  getDictList,
} from '@/common/request/userCenter'
import nations from './nations'
export default {
  data() {
    const relations = ['本人', '父母', '子女', '夫妻', '亲属', '朋友', '其他']
    const crelations = ['父母', '子女', '夫妻', '亲属', '朋友', '其他']
    return {
      defaultRegion: ['重庆市', '市辖区', '万州区'],
      intoList: '', //是否来源于健康卡管理页面
      timeNum: 3,
      isFirstEnter: false,
      isFromBack: false, //是否是选择健康卡后返回
      relations,
      crelations,
      occupation: [], //职业
      nations,
      themeColor: '#0AB2C1',
      timecode: 60,
      passClick: true,
      sexList: [
        { lable: '女', value: 0 },
        { lable: '男', value: 1 },
      ],
      formData: {
        child: false, //是否儿童
        name: '', //姓名
        idCard: '', //身份证

        sex: '',
        birthDay: '',
        nation: '汉族', //民族
        careerName: '', //职业
        address: '重庆市市辖区万州区', //籍贯
        // liveAddress: '', //户口地址
        addressNow: '', //现住址
        guardName: '', //监护人姓名
        guardIdCard: '', //监护人身份证
        guardRelation: '', //监护人关系
        relation: '0', //关系
        phone: '', //手机号
        phoneCode: '', //验证码
        wechatCode: '', //微信身份码
      },
      cardList: [],
      perCardId: '',
    }
  },

  created() {
    this.getDictList()
    this.loginCard()
  },
  onLoad(options) {
    if (options.intoList) {
      this.intoList = options.intoList
    }
  },
  onReady() {
    this.isFirstEnter = true
  },
  onShow() {
    if (this.isFirstEnter) {
      this.loginCard()
    }
  },
  mounted() {
    uni.$on('updateCardInfo', data => {
      console.log(data, '健康卡信息---------------')
      this.isFromBack = true
      const {
        child,
        name,
        idCard,
        birthDay,
        sex,
        nation,
        address,
        phone,
      } = data
      Object.assign(this.formData, {
        child,
        name,
        idCard,
        birthDay,
        sex,
        nation,
        address:address||'重庆市市辖区万州区',
        phone,
      })
    })
  },

  methods: {
    loginCard() {
      healthCardPlugins.login(
        (_, res) => {
          if (res.result.type !== 3) {
            // 用户在微信授权过，可直接获取登录信息
            this.formData.wechatCode = res.result.wechatCode
          } else {
            // 用户未授权，需要用户同意授权
            // 显示 healthCardLogin 登录组件，引导用户同意授权
            // this.$refs.notice.open()
            uni.showToast({
              title: '用户未授权，即将跳转！',
              icon: 'none',
              duration: 3000,
            })
            // uni.showModal({
            //   title: '提示',
            //   content: `当前用户电子健康卡未授权，即将自动前往授权页！`,
            //   showCancel: false,
            // })
            setTimeout(() => {
              uni.navigateTo({
                url:
                  '/pages-user/patientManagement/infoManage?fromPage=addCard',
              })
            }, 3000)
          }
        },
        {
          wechatcode: true,
        },
      )
    },
    authFail() {
      console.log('失败回调', arguments)
    },
    authCancel() {
      console.log('取消回调', arguments)
    },
    //获取职业列表
    async getDictList() {
      this.occupation = (await getDictList()).map(v => v.name)
    },
    toWey() {
      this.$refs.notice.close()
      console.log('前往获取验证码')
      this.toSelectCard()
    },
    //选择性别
    bindPickerChange(e, name) {
      this.form[name] = e.detail.value
    },
    //籍贯选择
    handleGetRegion(region, name) {
      console.log(region)
      let cityname = []
      region.forEach(i => {
        cityname.push(i.name)
      })
      this.formData[name] = cityname.join(' ')
    },
    //changeUserVal获取身份信息
    async changeUserVal() {
      if (!this.formData.idCard) return
      if (!idcard(this.formData.idCard)) {
        uni.showToast({
          title: '身份证号不存在,请重新输入',
          icon: 'none',
        })
        return
      }
      const { address, birthDay, sex, child } = await getIdCardInfo({
        idCard: this.formData.idCard,
      })
      Object.assign(this.formData, {
        address:address||'重庆市市辖区万州区',
        birthDay,
        sex,
      })
      //
      if (
        !this.formData.child &&
        GetAgeAndSexByIDNum(this.formData.idCard) < 18
      ) {
        uni.showModal({
          title: '提示',
          cancelText: '否',
          confirmText: '是',
          confirmColor: '#0AB2C1',
          content: '身份信息与当前选择的年龄段不符，是否切换年龄段为儿童？',
          success: res => {
            if (res.confirm) {
              this.formData.child = true
            } else if (res.cancel) {
            }
          },
        })
      }
    },
    //健康卡授权成功回调
    authSuccess(e) {
      console.log(e, '授权成功回调')
      this.formData.wechatCode = e.target.result.wechatCode
      console.log(e.target.result.wechatCode, '健康卡开放平台建卡授权码-------')
    },
    //成人儿童切换
    radioChange(key, val) {
      this.formData[key] = val
      //清空输入框
      this.formData.addressNow = ''
      this.formData.relation = ''
      this.formData.phone = ''
      this.formData.phoneCode = ''
    },
    //获取验证码
    getcode() {
      if (this.formData.phone == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入手机号',
        })
        return false
      }

      verificationCode({
        phone: this.formData.phone,
        type: 'MEMBER_BINDING',
      }).then(res => {
        this.passClick = false
        this.reserveCode()
        uni.showToast({
          icon: 'none',
          title: '发送成功',
        })
      })
    },
    //倒计时
    reserveCode() {
      var time = 60
      var timer = setInterval(() => {
        this.timecode = time--
        //60s后停止定时器
        if (this.timecode === 0) {
          this.passClick = true
          this.timecode = 60
          clearInterval(timer)
        }
      }, 1000)
    },
    //提交
    submit() {
      if (this.validateForm()) {
        uni.showToast({
          title: this.validateForm(),
          icon: 'none',
        })
        return
      }
      //选择健康卡后返回时再提交直接提交建卡信息--不需要人脸识别
      if (this.isFromBack) {
        this.subMitInfo()
        return
      }

      /* ************先跳过人脸识别********* */
      //人脸识别
      // uni.showModal({
      //   title: '确认开启人脸识别',
      //   content: '是否开启人脸识别？',
      //   success: res => {
      //     if (res.confirm) {
      //       //先校验是否支持人脸识别
      //       wx.checkIsSupportFacialRecognition({
      //         checkAliveType: 2,
      //         success: res => {
      //           //验证通过调取人脸识别
      //           this.inFaceValidate()
      //         },
      //         fail: res => {
      //           if (res.errCode === 10001) {
      //             wx.showToast('不支持人脸采集：设备没有前置摄像头')
      //             //未通过后台再调后台接口验证
      //             this.validateUserInfo()
      //             return
      //           }
      //           wx.showToast(
      //             '微信版本过低，暂时无法使用此功能，请升级微信最新版本',
      //           )
      //           //未通过后台再调后台接口验证
      //           this.validateUserInfo()
      //         },
      //       })
      //     }
      //   },
      // })
      this.subMitInfo()
      /* ************先跳过人脸识别* ******** */
    },

    //人脸识别
    inFaceValidate() {
      wx.startFacialRecognitionVerify({
        name: this.formData.name,
        idCardNumber: this.formData.idCard,
        success: res => {
          this.subMitInfo()
        },
      })
    },
    //后台手动验证身份信息
    validateUserInfo() {
      // await xxx({ name: this.two.name, idCardNumber: this.two.idCard })
      //通过后进入下一步
      this.subMitInfo()
    },
    //提交建卡信息_____________________________________
    async subMitInfo() {
      uni.showLoading({
        title: '正在提交...',
      })
      if (this.formData.child) {
        //儿童提交增加职业默认值
        this.formData.careerName = '儿童'
      }
      const res = await submitCardInfo(this.formData)
      console.log('提交返回------', res)
      uni.hideLoading()
      uni.$emit('updateCard')

      // uni.redirectTo({
      //   url: '/pages/index-user',
      // })
      // uni.redirectTo({
      //   url: '/pages-user/patientManagement/edit?id=' + res.memberId,
      // })
      if (this.intoList) {
        return uni.redirectTo({
          url: '/pages/index-user',
        })
      }
      uni.navigateBack({
        delta: 1,
      })
    },
    //已有健康卡跳转至微信健康卡管理
    toSelectCard() {
      if (!this.formData.wechatCode) {
        return
      }
      uni.navigateTo({
        url: '/pages-user/patientManagement/infoManage?fromPage=addCard',
      })
    },
    //验证表单
    validateForm() {
      const validates = {
        phone: '请输入手机号', //手机号
        phoneCode: '请输入验证码', //验证码
        child: false, //是否儿童
        name: '请输入姓名', //姓名
        idCard: '请输入身份证号', //身份证
        relation: '请选择关系', //关系
        nation: '请选择民族', //民族
        careerName: '请选择职业', //职业
        // address: '请输入籍贯', //籍贯
        // liveAddress: '请输入户籍地址', //户口地址
        addressNow: '请输入现住址', //现住址
        guardName: '请输入监护人姓名', //监护人姓名
        guardIdCard: '请输入监护人身份证号', //监护人身份证
        guardRelation: '请选择监护人关系', //监护人关系
        wechatCode: '微信身份码不能为空', //微信身份码
      }
      const validateFormData = JSON.parse(JSON.stringify(this.formData))
      if (!this.formData.child) {
        delete validateFormData.guardName
        delete validateFormData.guardIdCard
        delete validateFormData.guardRelation
      } else {
        delete validateFormData.careerName
      }
      let validateMsg
      for (let key in validateFormData) {
        if (!validateFormData[key] && key !== 'child') {
          console.log(key)
          validateMsg = validates[key]
          break
        }
      }
      return validateMsg || ''
    },
  },
}
</script>

<style lang="scss" scoped>
.addWrap {
  .inputWrap {
    .title {
      width: 210rpx;
      font-size: 30rpx;
      color: #666;
      .red {
        color: #ea4444;
        position: relative;
        top: -10rpx;
      }
    }
    .title2 {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }
    .getcode {
      color: $uni-color-primary;
    }
    .tag {
      padding: 0 2px;
      ::v-deep.uni-tag {
        background: #f2f2f2;
        color: #333;
      }
      &.on {
        ::v-deep.uni-tag {
          background: $uni-color-primary;
        }

        ::v-deep.uni-tag--default {
          color: #fff;
        }
      }
      &:nth-child(1) {
        margin-right: 30rpx;
      }
    }
    ::v-deep.uni-list-item--hover {
      background: none;
    }
    ::v-deep.input_pla {
      font-size: 30rpx;
      color: #ccc;
    }
    input {
      font-size: 30rpx;
    }
  }
  .submit_btn {
    position: relative;
    margin-left: 0;
    margin: 0 15px;
    margin-bottom: 10px;
    bottom: 0;
    left: 0;
  }
  .botton-msg {
    width: 100%;
    text-align: center;
    font-size: 15px;
    color: #0ab2c1;
    margin-bottom: 10px;
  }
  .dialog-content {
    padding: 45rpx 0;
    width: 600rpx;
    background: #fff;
    border-radius: 30rpx;
    padding-bottom: 0;

    .dialogTitle {
      font-size: 32rpx;
      color: #1a1a1a;
      text-align: center;
      font-weight: bold;
    }

    .textBox {
      font-size: 26rpx;
      line-height: 42rpx;
      color: #666;
      height: 90px;
      padding: 0 30rpx;
      box-sizing: border-box;

      .title {
        font-size: 28rpx;
        margin-bottom: 20rpx;
        color: #1a1a1a;
        margin-top: 40rpx;
      }

      .text {
        margin-bottom: 40rpx;
        height: 100%;
        display: flex;
        align-items: center;
        animation-direction: alternate;
      }
    }

    .noticeBtn {
      width: 100%;
      height: 88rpx;
      border-top: 1rpx solid #e9eff4;
      line-height: 88rpx;
      text-align: center;
      color: $uni-color-primary;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.disabled-class {
  color: #fff;
  background: #ccc !important;
}
</style>
