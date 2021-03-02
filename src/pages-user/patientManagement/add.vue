<template>
  <view class="addWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="step">
      <view class="flex-between">
        <view :class="[active >= 0 ? 'on' : '', 'step_item']">
          <view class="step_num">1</view>
          <view class="step_title">手机验证</view>
        </view>
        <view :class="[active >= 1 ? 'on' : '', 'br']"></view>
        <view :class="[active >= 1 ? 'on' : '', 'step_item']">
          <view class="step_num">2</view>
          <view class="step_title">身份验证</view>
        </view>
        <view :class="[active >= 2 ? 'on' : '', 'br']"></view>
        <view :class="[active >= 2 ? 'on' : '', 'step_item']">
          <view class="step_num">3</view>
          <view class="step_title">资料填写</view>
        </view>
      </view>
    </view>
    <view
      style="background: #fff;overflow: hidden; margin: 20rpx;"
      class="box-shadow"
      v-if="active < 2"
    >
      <uni-list class="inputWrap" v-if="active == 0">
        <!-- style="padding-left: 0;" -->
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              手机号
              <text class="red">*</text>
            </view>
            <input
              type="number"
              v-model="one.phone"
              class="flex_1"
              maxlength="11"
              placeholder-class="input_pla"
              placeholder="请输入手机号码"
            />
          </view>
        </uni-list-item>
        <!-- style="padding-left: 0;" -->
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              验证码
              <text class="red">*</text>
            </view>
            <input
              type="number"
              class="flex_1"
              v-model="one.code"
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
      <uni-list class="inputWrap" v-if="active == 1">
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              年龄段
              <text class="red">*</text>
            </view>
            <view class="flex-start-center flex_1">
              <uni-tag
                text="成人"
                :class="[two.child == false ? 'on' : '', 'tag']"
                @click="radioChange('child', false)"
                circle
              ></uni-tag>
              <uni-tag
                text="儿童"
                :class="[two.child == true ? 'on' : '', 'tag']"
                @click="radioChange('child', true)"
                circle
              ></uni-tag>
            </view>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              姓名
              <text class="red">*</text>
            </view>
            <input
              v-model="two.name"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人姓名"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              身份证
              <text class="red">*</text>
            </view>
            <input
              v-model="two.idCard"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人身份证"
            />
          </view>
        </uni-list-item>
        <uni-list-item
          style="padding-left: 0;"
          :show-arrow="false"
          v-if="two.child"
        >
          <view class="flex-between">
            <view class="title">
              监护人姓名
              <text class="red">*</text>
            </view>
            <input
              v-model="two.guardName"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入监护人姓名"
            />
          </view>
        </uni-list-item>
        <uni-list-item
          style="padding-left: 0;"
          :show-arrow="false"
          v-if="two.child"
        >
          <view class="flex-between">
            <view class="title">
              监护人身份证
              <text class="red">*</text>
            </view>
            <input
              v-model="two.guardIdCard"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入监护人身份证"
            />
          </view>
        </uni-list-item>
        <uni-list-item
          style="padding-left: 0;"
          :show-arrow="false"
          v-if="two.child"
        >
          <view class="flex-between">
            <view class="title">
              关系
              <text class="red">*</text>
            </view>
            <input
              v-model="two.relation"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入监护人和患者之间的关系"
            />
          </view>
        </uni-list-item>
        <!-- <uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							就诊卡
							<text class="red">*</text>
						</view>
						<view class="flex-start-center flex_1">
							<uni-tag text="已有" :class="[two.isVisitcard == 1 ? 'on' : '', 'tag']" @click="radioChange('isVisitcard', 1)" circle></uni-tag>
							<uni-tag text="没有" :class="[two.isVisitcard == 2 ? 'on' : '', 'tag']" @click="radioChange('isVisitcard', 2)" circle></uni-tag>
						</view>
					</view>
				</uni-list-item> -->
        <!-- <uni-list-item style="padding-left: 0;" :show-arrow="false" v-if="two.isVisitcard == 1">
					<view class="flex-between">
						<view class="title">
							就诊卡/社保卡
							<text class="red">*</text>
						</view>
						<input v-model="two.patientCard" class="flex_1" placeholder-class="input_pla" placeholder="请输入就诊卡号或社保卡号" />
					</view>
				</uni-list-item> -->
      </uni-list>
    </view>
    <view
      style="background: #fff;overflow: hidden; margin: 20rpx;"
      class="box-shadow"
      v-if="active == 2 && form.child"
    >
      <uni-list class="inputWrap">
        <uni-list-item
          style="padding-left: 0;"
          v-if="form.child"
          :show-arrow="false"
          ><view class="title2">1.监护人信息</view></uni-list-item
        >
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              姓名
              <text class="red">*</text>
            </view>
            <input
              v-model="form.guardName"
              disabled
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人姓名"
            />
          </view>
        </uni-list-item>
        <uni-list-item
          style="padding-left: 0;"
          :show-arrow="false"
          v-if="form.child"
        >
          <view class="flex-between">
            <view class="title">
              关系
              <text class="red">*</text>
            </view>
            <input
              v-model="form.relation"
              disabled
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入监护人和患者之间的关系"
            />
          </view>
        </uni-list-item>
        <!-- <uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							民族
							<text class="red">*</text>
						</view>
						<input v-model="form.guardianNation" disabled class="flex_1" placeholder-class="input_pla" placeholder="请输入就诊人民族" />
					</view>
				</uni-list-item> -->
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              性别
              <text class="red">*</text>
            </view>
            <picker
              class="flex_1"
              disabled
              @change="bindPickerChange($event, 'guardSex')"
              :value="index"
              :range="sexList"
              range-key="lable"
            >
              <input
                v-model="sexList[form.guardSex].lable"
                disabled
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请输入就诊人性别"
              />
            </picker>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              出生日期
              <text class="red">*</text>
            </view>
            <input
              v-model="form.guardBirthDay"
              disabled
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人出生日期"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              地址
              <text class="red">*</text>
            </view>
            <input
              v-model="form.guardAddress"
              disabled
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人地址"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              电话
              <text class="red">*</text>
            </view>
            <input
              type="number"
              v-model="form.guardPhone"
              disabled
              class="flex_1"
              maxlength="11"
              placeholder-class="input_pla"
              placeholder="请输入就诊人电话"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              身份证
              <text class="red">*</text>
            </view>
            <input
              v-model="form.guardIdCard"
              disabled
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人身份证"
            />
          </view>
        </uni-list-item>
      </uni-list>
    </view>

    <view
      style="background: #fff;overflow: hidden; margin: 20rpx;"
      class="box-shadow"
      v-if="active == 2"
    >
      <uni-list :class="['inputWrap', form.child ? 'childInfo' : '']">
        <uni-list-item
          style="padding-left: 0;"
          v-if="form.child"
          :show-arrow="false"
          ><view class="title2">2.就诊人信息</view></uni-list-item
        >
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              姓名
              <text class="red">*</text>
            </view>
            <input
              v-model="form.name"
              :disabled="!form.child"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人姓名"
            />
          </view>
        </uni-list-item>
        <!-- <uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							民族
							<text class="red">*</text>
						</view>
						<input v-model="form.nation" disabled class="flex_1" placeholder-class="input_pla" placeholder="请输入就诊人民族" />
					</view>
				</uni-list-item> -->
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              性别
              <text class="red">*</text>
            </view>
            <picker
              class="flex_1"
              :disabled="!form.child"
              @change="bindPickerChange($event, 'sex')"
              :value="index"
              :range="sexList"
              range-key="lable"
            >
              <input
                v-model="sexList[form.sex].lable"
                disabled
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请输入就诊人性别"
              />
            </picker>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              出生日期
              <text class="red">*</text>
            </view>
            <picker
              mode="date"
              class="flex_1"
              :disabled="!form.child"
              :value="form.birthDay"
              @change="bindPickerChange($event, 'birthDay')"
            >
              <input
                v-model="form.birthDay"
                disabled
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请输入就诊人出生日期"
              />
            </picker>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              地址
              <text class="red">*</text>
            </view>
            <input
              v-model="form.address"
              disabled
              class="flex_1"
              v-if="!form.child"
              placeholder-class="input_pla"
              placeholder="请输入就诊人地址"
            />
            <pick-regions
              class="flex_1"
              v-else
              :disabled="!form.child"
              @getRegion="handleGetRegion($event, 'address')"
            >
              <input
                v-model="form.address"
                class="flex_1"
                disabled
                placeholder-class="input_pla"
                placeholder="请选择就诊人地址"
              />
            </pick-regions>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              电话
              <text class="red">*</text>
            </view>
            <input
              type="number"
              :disabled="!form.child"
              v-model="form.phone"
              class="flex_1"
              maxlength="11"
              placeholder-class="input_pla"
              placeholder="请输入就诊人电话"
            />
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              身份证
              <text class="red">*</text>
            </view>
            <input
              v-model="form.idCard"
              :disabled="!form.child"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入就诊人身份证"
            />
          </view>
        </uni-list-item>
        <uni-list-item
          style="padding-left: 0;"
          :show-arrow="false"
          v-if="form.child"
        >
          <view class="flex-between">
            <view class="title">
              出生地
              <text class="red">*</text>
            </view>
            <pick-regions
              class="flex_1"
              @getRegion="handleGetRegion($event, 'nativePlace')"
            >
              <input
                v-model="form.nativePlace"
                class="flex_1"
                disabled
                placeholder-class="input_pla"
                placeholder="请选择出生地"
              />
            </pick-regions>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              现居地
              <text class="red">*</text>
            </view>
            <pick-regions
              class="flex_1"
              @getRegion="handleGetRegion($event, 'addressNow')"
            >
              <view class="flex_1">
                <text v-if="form.addressNow">{{ form.addressNow }}</text>
                <text v-else style="color: #666;">请选择现居地</text>
              </view>
            </pick-regions>
          </view>
        </uni-list-item>
        <uni-list-item style="padding-left: 0;" :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              常居地
              <text class="red">*</text>
            </view>
            <input
              v-model="form.liveAddress"
              class="flex_1"
              placeholder-class="input_pla"
              placeholder="请输入常居地"
            />
          </view>
        </uni-list-item>
      </uni-list>
    </view>
    <view class="tipWrap">
      <view class="tipText" v-if="active == 1 && form.isVisitcard == 1">
        <text>注：</text>
        若输入社保卡号，该患者社保卡需曾经在挂号窗口进行挂号
      </view>
    </view>
    <button
      class="submit_btn next"
      @click="next"
      type="primary"
      v-if="active < 2"
    >
      下一步
    </button>
    <button class="submit_btn" v-if="active > 1" type="primary" @click="submit">
      提交
    </button>
    <uni-popup ref="select" class="selectWrap" type="bottom" :maskClick="false">
      <view class="selectPer">
        <view class="title">请选择您的就诊卡</view>
        <uni-icons
          type="close"
          class="closeIcon"
          color="#999"
          size="20"
          @click="closePer"
        ></uni-icons>
        <uni-notice-bar
          text="温馨提示：一旦选择了就诊卡，则只能使用该就诊卡进行预约挂号等服务。如需更换，则需要本人线下进行人工办理。"
        ></uni-notice-bar>
        <view class="selectList">
          <view class="uni-list">
            <radio-group @change="perChange">
              <label
                class="uni-list-cell uni-list-cell-pd"
                v-for="(item, index) in cardList"
                :key="index"
              >
                <view
                  ><radio
                    :value="item.cardNo"
                    :color="themeColor"
                    :checked="item.cardNo === perCardId"
                /></view>

                <view class="flex_1 perMain">
                  <view>就诊卡号：{{ item.cardNo }}</view>
                  <view class="time"
                    >最近使用时间：{{ item.createDtime || '-' }}</view
                  >
                </view>
                <view class="perPrice">卡内余额：￥{{ item.balance }}</view>
              </label>
            </radio-group>
          </view>
        </view>
        <button
          class="submit_btn next"
          type="primary"
          style="margin-left:0 ; border-radius: 0; width:100%;"
          @click="selectCard"
        >
          确认
        </button>
      </view>
    </uni-popup>
    <uni-popup ref="popup" type="center" :maskClick="false">
      <view class="popTip">
        <view class="popTitle">新增就诊卡</view>
        <view class="popMain">
          <view
            >您还未在{{
              userInfo.orgName
            }}办理过就诊卡，系统将为您创建一张新的就诊卡。</view
          >
          <view
            >一旦创建了就诊卡，则只能使用该就诊卡进行预约挂号等服务。如需更换，则需要本人线下进行人工办理。</view
          >
        </view>
        <view class="popBtn" @click="addPatient">确 定</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue'
import {
  validatePhone,
  fullPatientInfo,
  finishAuth,
  confirmPatientInfo,
  confirmCard,
} from '@/common/request/userCenter'
import { verificationCode } from '@/common/request/index'
import {idcard,GetAgeAndSexByIDNum} from '@/common/util.js'
export default {
  components: { pickRegions },
  data() {
    return {
      themeColor: '#0AB2C1',
      active: 0,
      timecode: 60,
      passClick: true,
      sexList: [
        { lable: '女', value: 0 },
        { lable: '男', value: 1 },
      ],
      one: {
        phone: '',
        code: '',
      },
      two: {
        child: false,
        name: '',
        idCard: '',
        isVisitcard: 1,
        guardName: '',
        guardIdCard: '',
        relation: '',
        patientCard: '',
      },
      form: {
        name: '',
        sex: '',
        birthDay: '',
        address: '',
        phone: '',
        idCard: '',
        nativePlace: '',
        addressNow: '',
        liveAddress: '',
      },
      pikerName: '',
      pikerVal: {
        birthplace: [0, 0, 0],
        residence: [0, 0, 0],
      },
      bizToken: '',
      perCardId: '',
      cardList: [],
      page: '',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad(options) {
    if (options.page == 'DoctorDetail') {
      this.page = options.page
    }
  },
  methods: {
    next() {
      if (this.active < 1) {
        if (this.one.phone == '') {
          uni.showToast({
            title: '请输入手机号',
            icon: 'none',
          })
          return false
        }
        if (this.one.code == '') {
          uni.showToast({
            title: '请输入验证码',
            icon: 'none',
          })
          return false
        }
        validatePhone(this.one).then(res => {
          if (res) {
            this.active += 1
          }
        })
      } else {
        if (this.active == 1) {
          if (this.two.name == '') {
            uni.showToast({
              title: '请输入患者姓名',
              icon: 'none',
            })
            return false
          }
          if (this.two.idCard == '') {
            uni.showToast({
              title: '请输入患者身份证',
              icon: 'none',
            })
            return false
          }
          if (this.two.child) {
            if (this.two.guardName == '') {
              uni.showToast({
                title: '请输入监护人姓名',
                icon: 'none',
              })
              return false
            }
            if (this.two.guardIdCard == '') {
              uni.showToast({
                title: '请输入监护人身份证',
                icon: 'none',
              })
              return false
            }
            if (this.two.relation == '') {
              uni.showToast({
                title: '请输入监护人和患者之间的关系',
                icon: 'none',
              })
              return false
            }
          }
          if(!idcard(this.two.idCard)){
            uni.showToast({
                title: '身份证号不存在',
                icon: 'none',
              })
              return false
          }
          if(!this.two.child && GetAgeAndSexByIDNum(this.two.idCard)<18){
            let isNext = false
             uni.showModal({
                title: '提示',
                cancelText:'否',
                confirmText:'是',
                confirmColor:'0AB2C1',
                content: '身份信息与当前选择的年龄段不符，是否切换年龄段为儿童？',
                success: res=> {
                    if (res.confirm) {
                        this.two.child = true
                        isNext = true
                    } else if (res.cancel) {
                        isNext = false
                    }
                }
            });
            return isNext
          }
          if(this.two.child && GetAgeAndSexByIDNum(this.two.idCard)>17){
            let isNext = false
             uni.showModal({
                title: '提示',
                content: '身份信息与当前选择的年龄段不符，是否切换年龄段为成人？',
                cancelText:'否',
                confirmText:'是',
                confirmColor:'0AB2C1',
                success:  res=> {
                    if (res.confirm) {
                        this.two.child = false
                        isNext = true
                    } else if (res.cancel) {
                        isNext = false
                    }
                }
            });
            return isNext
          }
          // if (this.two.isVisitcard == 1) {
          // 	if (this.two.patientCard == '') {
          // 		uni.showToast({
          // 			title: '请输入就诊卡号或社保卡号',
          // 			icon: 'none'
          // 		});
          // 		return false;
          // 	}
          // }

          fullPatientInfo(this.two)
            .then(res => {
              if (res) {
                this.bizToken = res
                this.getfinishAuth(res)
              }
            })
            .catch(err => {
              if (err.message.includes('验证超时')) {
                this.active -= 1
              }
            })
        }
      }
    },
    // 人脸识别回调
    async getfinishAuth(bizToken) {
      let res = await finishAuth({ bizToken: bizToken })
      if (res) {
        this.form.name = res.name
        this.form.sex = res.sex
        this.form.child = res.child
        this.form.guardIdCard = res.guardIdCard
        this.form.guardName = res.guardName
        this.form.patientCard = res.patientCard
        this.form.phone = res.phone
        this.form.relation = res.relation
        this.form.birthDay = res.birthDay
        this.form.idCard = res.idCard
        this.form.guardPhone = res.guardPhone
        this.form.guardBirthDay = res.guardBirthDay
        this.form.guardSex = res.guardSex
        this.form.address = res.address
        this.form.guardAddress = res.guardAddress
        this.active = this.active + 1
      }
    },
    handleGetRegion(region, name) {
      console.log(region)
      let cityname = []
      region.forEach(i => {
        cityname.push(i.name)
      })
      this.form[name] = cityname.join(' ')
    },
    bindPickerChange(e, name) {
      this.form[name] = e.detail.value
    },
    radioChange(key, val) {
      this.two[key] = val
    },
    getcode() {
      if (this.one.phone == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入手机号',
        })
        return false
      }
      this.passClick = false
      this.reserveCode()
      verificationCode({ phone: this.one.phone, type: 'MEMBER_BINDING' }).then(
        res => {
          uni.showToast({
            icon: 'none',
            title: '发送成功',
          })
        },
      )
    },
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
    submit() {
      if (this.form.name == '') {
        uni.showToast({
          title: '请输入就诊人姓名',
          icon: 'none',
        })
        return false
      }
      if (this.form.birthDay == '') {
        uni.showToast({
          title: '请选择就诊人出生日期',
          icon: 'none',
        })
        return false
      }
      if (this.form.address == '') {
        uni.showToast({
          title: '请输入地址',
          icon: 'none',
        })
        return false
      }
      if (this.form.phone == '') {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none',
        })
        return false
      }
      if (this.form.idCard == '') {
        uni.showToast({
          title: '请输入身份证号',
          icon: 'none',
        })
        return false
      }
      if (this.form.addressNow == '') {
        uni.showToast({
          title: '请选择现居地',
          icon: 'none',
        })
        return false
      }
      if (this.form.liveAddress == '') {
        uni.showToast({
          title: '请填写常居地',
          icon: 'none',
        })
        return false
      }
      if (this.form.child) {
        if (this.form.nativePlace == '') {
          uni.showToast({
            title: '请选择出生地',
            icon: 'none',
          })
          return false
        }
      }
      uni.showLoading({
        title: '正在提交...',
      })
      confirmPatientInfo(this.form).then(res => {
        uni.hideLoading()
        if (res) {
          console.log(res)
          this.cardList = res
          if (res.length > 0) {
            this.perCardId = res[0].cardNo
            this.$refs.select.open()
          } else {
            this.$refs.popup.open()
          }
        }
      })
    },
    addPatient() {
      this.selectCard()
      this.$refs.popup.close()
    },
    // 选择就诊卡
    async selectCard() {
      let res = await confirmCard({ cardNo: this.perCardId })
      this.$refs.select.close()
      if (this.page == 'DoctorDetail') {
        let pages = getCurrentPages()
        let currPage = pages[pages.length - 1] //当前页面
        let prevPage = pages[pages.length - 2] //上一个页面
        //可以打印prevPage看看
        console.log(prevPage)
        //#ifdef H5
        prevPage.patient = { memberId: res.memberId, patientId: res.patientId }
        //#endif
        //#ifdef MP-WEIXIN
        prevPage.setData({
          memberId: { memberId: res.memberId, patientId: res.patientId },
        })
        //#endif
        uni.navigateBack()
      } else {
        uni.redirectTo({
          url: '/pages-user/patientManagement/edit?id=' + res.memberId,
        })
      }
    },
    perChange(e) {
      this.perCardId = e.detail.value
    },
    closePer() {
      this.$refs.select.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.addWrap {
  padding-bottom: 120rpx;
}
.step {
  padding: 40rpx 70rpx;
  padding-bottom: 20rpx;
  position: relative;
  .step_item {
    .step_num {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      font-size: 34rpx;
      color: #fff;
      text-align: center;
      line-height: 50rpx;
      background: #ccc;
      margin: 0 auto;
    }
    .step_title {
      font-size: 26rpx;
      color: #ccc;
      margin-top: 10rpx;
      width: 110rpx;
    }
    &.on {
      .step_num {
        background: $uni-color-primary;
      }
      .step_title {
        color: $uni-color-primary;
      }
    }
  }
  .br {
    height: 2px;
    background: #ccc;
    width: 200rpx;
    position: absolute;
    top: 60rpx;
    left: 150rpx;
    &:nth-child(4) {
      left: auto;
      right: 150rpx;
    }
    &.on {
      background: $uni-color-primary;
    }
  }
}
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
    /deep/.uni-tag {
      background: #f2f2f2;
      color: #333;
    }
    &.on {
      /deep/.uni-tag {
        background: $uni-color-primary;
      }

      /deep/.uni-tag--default {
        color: #fff;
      }
    }
    &:nth-child(1) {
      margin-right: 30rpx;
    }
  }
  /deep/.uni-list-item--hover {
    background: none;
  }
  .input_pla {
    font-size: 30rpx;
    color: #ccc;
  }
  input {
    font-size: 30rpx;
  }
}
.childInfo {
  input {
    color: #888;
  }
}
.next {
  margin-top: 30rpx;
  position: relative;
  left: 0;
  margin-left: 15px;
  width: auto;
  bottom: 0;
}
.tipWrap {
  padding: 0 15px;
  .tipText {
    font-size: 24rpx;
    color: #666;
    text {
      color: $uni-color-error;
    }
  }
}
.selectWrap {
  position: relative;
  z-index: 12;
}
.selectPer {
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding-top: 40rpx;
  position: relative;
  .title {
    font-size: 32rpx;
    color: #1a1a1a;
    text-align: center;
    margin-bottom: 30rpx;
  }
  .closeIcon {
    position: absolute;
    right: 30rpx;
    top: 40rpx;
  }
  .selectList {
    margin-top: 30rpx;
    margin-bottom: 20rpx;
    .perMain {
      padding: 0 20rpx;
      .time {
        font-size: 24rpx;
        color: #666;
      }
    }
    .perPrice {
      font-size: 30rpx;
      color: #000;
    }
  }
}
.popTip {
  width: 680rpx;
  background: #fff;
  border-radius: 30rpx;
  padding-top: 50rpx;
  .popTitle {
    font-size: 34rpx;
    text-align: center;
    margin-bottom: 20rpx;
    color: #000;
  }
  .popMain {
    font-size: 30rpx;
    line-height: 52rpx;
    color: #888;
    padding: 0 40rpx;
    margin-bottom: 50rpx;
    text-indent: 2em;
  }
  .popBtn {
    color: $uni-color-primary;
    font-size: 34rpx;
    padding: 26rpx 0;
    text-align: center;
    border-top: 1px solid #f2f2f2;
  }
}
</style>
