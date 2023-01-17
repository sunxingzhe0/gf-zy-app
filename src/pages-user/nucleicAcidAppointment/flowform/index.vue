<template>
  <view style="padding-top: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />

    <view style="padding: 20rpx;">
      <app-card class="appcard" styles="padding:10rpx 0 ;position:relative;">
        <app-list-item
          label="个人信息"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :textStyle="'font-size:30rpx;padding-left:20rpx;font-weight:bold;'"
        >
          <view
            v-if="isform != 1 && isform != 2 && isform != 3"
            class="text-right flex_1 colorPrim"
            @click="$refs.notice.open()"
          >
            <uni-icons type="info" :color="color"></uni-icons>
            <span>预约特别提醒</span>
          </view>
        </app-list-item>
        <app-list-item
          label="姓名"
          :styles="appItemStyle"
          :textStyle="'font-size:30rpx;'"
        >
          <!-- 挂号禁用流调表选择就诊人 -->
          <view
            class="flex_1 flex-between"
            @click="
              isform != 3
                ? ($refs.popselect.open(), (isDisabled = true))
                : () => {}
            "
          >
            <input
              v-model="formData.name"
              disabled
              class="flex_1 inputStyle"
              placeholder-class="input_pla"
              placeholder="请选择就诊人"
            />
            <!-- 挂号禁用流调表选择就诊人 -->
            <view v-if="isform != 3"
              ><uni-icons type="arrowright"></uni-icons
            ></view>
          </view>
        </app-list-item>
        <app-list-item
          label="身份证"
          :styles="appItemStyle"
          :textStyle="'font-size:30rpx;'"
          ><input
            v-model="formData.idCard"
            class="flex_1 inputStyle"
            placeholder-class="input_pla"
            placeholder="请输入身份证"
        /></app-list-item>
        <app-list-item
          label="联系方式"
          :styles="appItemStyle"
          :textStyle="'font-size:30rpx;'"
          className="required"
          ><input
            v-model="formData.phone"
            class="flex_1 inputStyle"
            placeholder-class="input_pla"
            placeholder="请输入联系方式"
        /></app-list-item>
        <app-list-item
          label="地址"
          :styles="appItemStyle"
          :textStyle="'font-size:30rpx;'"
          className="required"
        >
          <pick-regions
            class="flex_1 flex-between address"
            :defaultRegion="defaultRegion"
            @getRegion="handleGetRegion($event, 'address')"
          >
            <view class="flex-between flex_1">
              <input
                v-model="formData.address"
                class="flex_1 inputStyle"
                disabled
                placeholder-class="input_pla"
                placeholder="选择地址"
              />
              <uni-icons type="arrowright"></uni-icons>
            </view>
          </pick-regions>
        </app-list-item>
        <app-list-item
          label="详细地址"
          :styles="appItemStyle"
          :textStyle="'font-size:30rpx;'"
          className="required"
          noBorder
          ><input
            :disabled="isDisabled"
            v-model="formData.addDetail"
            class="flex_1 inputStyle"
            placeholder-class="input_pla"
            placeholder="请输入详细地址"
        /></app-list-item>
      </app-card>
      <view class="msg-text" @click="clickH"
        >为进一步加强新冠肺炎防控工作，请您如实填写以下问题。如隐瞒流行病学史或者有症状不如实告知者，将依据《中华人民共和国传染病防治法》追究其法律责任。</view
      >
      <app-card
        class="appcard"
        v-for="(item, index) in quesList"
        :key="index"
        styles="padding:10rpx 0 ;position:relative;"
      >
        <app-list-item
          :label="item.title"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :textStyle="
            'font-size:30rpx;padding-left:20rpx;font-weight:bold;color:#333;'
          "
        >
        </app-list-item>
        <app-list-item
          v-for="(child, t) in item.quesList"
          :key="child.quesId"
          :label="child.quesName"
          :styles="{
            ...appItemStyle,
            display: child.selectList ? 'block' : '',
          }"
          :textStyle="
            child.selectList
              ? 'width:100%;font-size:30rpx;color:#333;'
              : 'font-size:30rpx;color:#333;width:220rpx;'
          "
          :className="child.id != '13' ? 'required' : ''"
          :noBorder="t == item.child.length - 1"
          ><input
            v-if="!child.selectList"
            v-model="child.value"
            class="flex_1 inputStyle"
            placeholder-class="input_pla"
            placeholder="请输入"
          />
          <view v-else style="width:100%;">
            <radio-group @change="radioChange($event, child)">
              <label
                class="uni-list-cell uni-list-cell-pd"
                v-for="(opt, s) in child.selectList"
                :key="s"
              >
                <view>
                  <radio
                    :value="opt.sortCode"
                    :checked="opt.sortCode === child.value"
                    color="#0AB2C1"
                  />
                </view>
                <view>{{ opt.selectName }}</view>
              </label>
            </radio-group>
          </view>
        </app-list-item>
      </app-card>
    </view>
    <button class="submit_btn" type="primary" @click="submitBtn">提交</button>
    <!--提示-->
    <pop-notice
      ref="notice"
      :title="noticeTitle"
      :content="noticeContent"
    ></pop-notice>
    <!--选择就诊人-->
    <pop-select
      ref="popselect"
      title="就诊人"
      isAdd
      :list="patients"
      @change="patientChange"
      @submit="patientSubmit"
    ></pop-select>
    <hosSelect
      ref="pophosSelecet"
      title="请选择院区"
      :list="hosList"
      @selecList="changeSelect"
    />
  </view>
</template>

<script>
/**
 * @props isform 0：核酸预约进入流调表 ； 1：扫码进入流调表； 2：点击流调表菜单进入流调表 ；3：预约挂号进入流调表   (除预约挂号/核酸检测，进入该页都需选择院区)
 */
import { getHospInfo } from '@/pages-zy/api/outpatient.js'
import hosSelect from '@/pages-user/components/hosSelect/hosSelect'
import formListt from './formList'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import popSelect from '@/components/pop-select'
import { patientList } from '@/common/request/userCenter'
import pickRegions from '@/pages-user/components/pick-regions/pick-regions.vue'
import popNotice from '../components/pop-notice.vue'
import { findHasError } from '@/common/request/index.js'
import { getQuesList, fillInBasins } from '../api/index'
import { getTjIns } from '@/pages-zy/api/physical.js'
export default {
  components: {
    AppCard,
    AppListItem,
    popSelect,
    pickRegions,
    popNotice,
    hosSelect,
  },
  data() {
    return {
      isform: '',
      intoNext: true, //是否可进入下一步
      isDisabled: false,
      hosList: [],
      infoParams: {},
      quesList: [],
      defaultRegion: ['重庆市', '市辖区', '万州区'],
      appItemStyle: {
        padding: '20rpx',
        paddingLeft: 0,
        marginLeft: '20rpx',
        width: 'auto',
        alignItems: 'center',
      },
      formData: {
        hospId: '', //院区id 流调表提交传
        patientId: '',
        name: '',
        idCard: '',
        phone: '',
        addDetail: '',
        address: '',
        chooseList: [],
      },
      list: [],
      patients: [],
      formListt,
      form: {},
      noticeContent: '',
      noticeTitle: '预约特别提醒',
    }
  },
  async onShow() {
    if (this.isform != 1 && this.isform != 2 && this.isform != 3) {
      this.$refs.notice.open()
    }
    await this.getPatientList()
    this.$nextTick(() => {
      console.log(this.infoParams.inperId, '健康卡memberId')
      this.patientChange(this.infoParams.inperId || this.defaultId) //默认选中
      //取消核酸预约【是】的限制 start
      // 核酸预约进入 提示是否可预约
      // if (this.isform == 0) {
      //   this.getIntoNext()
      // }
      //end
    })
  },
  onLoad(options) {
    console.log(options, '参数----')
    this.isform = options.isform
    if (options.hospId) {
      this.formData.hospId = options.hospId
      this.hospId = options.hospId
    }
    if (options.isform == 1) {
      //扫码进入
      uni.setStorageSync('isIncode', true)
    }
    this.noticeContent = `<p>1 、请如实填写疫情防控调查表;</p><p>2、筛查表中任意一项选“是”时，请及时到发热门诊就诊；</p><p>3、本服务仅支持“<span style="color:#EA4444">愿检尽检</span>”人员的<span style="color:#EA4444">自费</span>预约；</p><p>4、符合当地财政免费要求的“<span style="color:#EA4444">应检尽检</span>”人员，请通过医院线下渠道开单检测；</p><p>${
      !this.isform
        ? `<span style="color:#EA4444">5、支付成功后，请在采集时间上午8:30-12:00，下午14:00-17:00来院进行核酸采集，进入医院佩戴口罩、配合亮码测温；</span>`
        : '5、支付成功后，请在<span style="color:#EA4444">任意工作时间</span>内前往医院检测，进入医院佩戴口罩、配合亮码测温；'
    }</p><p>6、支付成功后，若想取消订单并<span style="color:#EA4444">退款</span>，请前往医院<span style="color:#EA4444">服务窗口</span>咨询处理。</p>`
    options.infoParams && (this.infoParams = JSON.parse(options.infoParams))

    //核酸检测替换提示内容
    if (this.isform == 0) {
      this.noticeTitle = '新冠核酸检测告知书'
      this.getTjInsInfo()
      //       this.noticeContent = `
      //       <p>一、受检人群:</p>
      //       <p style="text-indent:2em">1.来院人员请主动向工作人员出示渝康码、行程卡。</p>
      //       <p style="text-indent:2em">2.有发热症状（体温≥37.3℃）或中高风险地区旅居史患者请主动告知工作人员，前往发热门诊就诊。</p>
      //       <p style="text-indent:2em">3.黄码(渝康码黄色)、弹窗人员在“黄码”检测区采集核酸;</p>
      //       <p style="text-indent:2em">4.无发热等新冠相关症状和中高风险地区旅居史等健康码及行程码无异常的人员在“愿检尽检”核酸检测点采集核酸。</p>
      //       <p>二、标本采集时间:</p>
      //       <p style="text-indent:2em">我中心暂不提供核酸检测预约服务，
      // 对外提供核酸检测服务时间：绿码、橙色弹窗人员采集时间周一至周五9：00-12：00，18：00-22：00；周六、周日9：00-12：00，14：00-22：00。</br>
      // 黄码及渝康码异常人员核酸采集时间周一至周日9：00-12：00，16：00-21：00。</p>
      //       <p>三、结果查询及报告领取：</p>
      //       <p style="text-indent:2em">1.“应检尽检(单采单检)”采样后12小时内出具报告;“愿检尽检(混检10:1) ”采样后24小时内出具报告，采样后请务必保持电话畅通。</p>
      //       <p style="text-indent:2em">2.核酸检测结果可通过渝康码查询。需要纸质报告单的前往检验科打印纸质报告。</p>
      // `
    }
    this.getQuesList()
    this.getHospInfo()
  },
  mounted() {
    // console.log(this.infoParams.inperId, '健康卡memberId')
    // this.infoParams.inperId && this.patientChange(this.infoParams.inperId) //默认选中
    uni.$on('updateCard', () => {
      this.getPatientList()
      this.patientChange(this.infoParams.inperId || this.defaultId) //默认选中
    })
  },
  methods: {
    // 核酸检测预约须知
    async getTjInsInfo() {
      this.hsNotice = await getTjIns({
        type: 3,
      })
      if (this.hsNotice.content) {
        this.noticeContent = this.hsNotice.content.replace(/&nbsp;/g, '\xa0')
      }
    },
    clickH() {
      console.log(this.$refs.adreInp)
    },
    changeSelect(data) {
      this.formData.hospId = data.id //院区id
      this.hospId = data.id
    },
    //获取院区
    async getHospInfo() {
      uni.showLoading()
      /*  GH("预约挂号"),
    LYDH("来院导航"),
    LDB("流调表")  */
      this.hosList = (await getHospInfo()).filter(item =>
        item.hospType?.split(',')?.includes('LDB'),
      )
      uni.hideLoading()
      this.$nextTick(() => {
        //非预约挂号||核酸检测  进入页面 才选择院区
        this.isform != 3 &&
          this.isform != 0 &&
          this.hosList.length &&
          this.$refs.pophosSelecet.open()
      })
    },
    //获取问题列表
    async getQuesList() {
      this.quesList = await getQuesList()
      this.quesList.forEach(v => {
        v.quesList.forEach(item => {
          item = Object.assign(item, { value: 1 })
        })
      })
    },
    //获取就诊人
    async getPatientList() {
      const list = await patientList()
      this.patients = list.map(item =>
        Object.assign(item, {
          value: item.memberId,
          // checked: item.def,
          checked: false,
        }),
      )
      let res = list.find(item => item.def)?.memberId ?? list?.[0]?.memberId
      this.defaultId = res
      // console.log(res, '----------------默认选择项----------')
      // if (res) {
      //   this.formData.name = res.name
      //   this.formData.idCard = res.idCard
      //   this.formData.phone = res.phone
      //   this.formData.patientId = res.memberId
      // }
    },
    patientChange(memberIds) {
      console.log(memberIds, 'ids==')
      this.infoParams.inperId = memberIds //
      if (memberIds[0] == 'all') {
        memberIds.shift()
      }
      this.patients.forEach(item => {
        if (item.memberId == memberIds) {
          this.formData.patientId = item.memberId
          this.formData.name = item.name
          this.formData.idCard = item.idCard
          this.formData.phone = item.phone
          this.formData.address = item.address
          this.formData.addDetail = item.addressNow
        }
      })
    },
    // 确认切换就诊人
    patientSubmit() {
      this.$refs.popselect.close()
      this.isDisabled = false
      //取消核酸预约【是】的限制 start
      // if (this.isform == 0) {
      //   this.getIntoNext()
      // }
      // end
    },
    async getIntoNext() {
      //是否提示无法预约核酸
      const intoState = await findHasError({
        memberId: this.formData.patientId,
      })
      if (intoState) {
        this.intoNext = false
        return uni.showModal({
          title: '系统提醒',
          content:
            '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下预约。',
          showCancel: false,
        })
      } else {
        this.intoNext = true
      }
    },
    handleGetRegion(region) {
      console.log(region)
      let cityname = []
      region.forEach(i => {
        cityname.push(i.name)
      })
      this.formData.address = cityname.join(' ')
    },

    //选择答案
    radioChange(e, item) {
      item.value = Number(e.detail.value)
      console.log(item.value)
    },
    //验证问题是否勾选是
    validateQuse() {
      console.log(this.formData, '提交')
      let state = this.formData.basinsList[0].quesList.every(
        v => v.select === 1,
      )
      return new Promise((resolve, reject) => {
        if (!state) {
          uni.showModal({
            title: '提示',
            content: '有选项为[是]，请确认是否继续提交?',
            success: res => {
              if (res.confirm) {
                this.isform == 3 && (this.intoNext = false)
                this.isform == 0 && (this.intoNext = false)
                resolve(true)
              } else if (res.cancel) {
                resolve(false)
              }
            },
          })
        } else {
          resolve(true)
        }
      })
    },
    //提交流调表
    async submitInform(formData) {
      // this.formData = formData
      const state = await this.validateQuse() //验证问题 state为true可提交
      //预约挂号带入之前页面选择的院区id 否则用选择的id
      this.formData.hospId = this.infoParams.hospId || this.hospId
      console.log('提交----', state)
      if (!state) return
      uni.showLoading()
      const res = await fillInBasins({ ...formData, isform: this.isform })
      uni.hideLoading()
      //是否进入下一步
      if (!this.intoNext && (this.isform == 3 || this.isform == 0)) {
        return uni.showModal({
          title: '系统提醒',
          content:
            this.isform == 3
              ? '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下收费处挂号。'
              : '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下预约。',
          showCancel: false,
        })
      }

      uni.showToast({ title: '提交成功！', icon: 'none' })

      const params = this.infoParams || ''

      setTimeout(() => {
        // uni.navigateBack()
        if (this.isform == 3) {
          //挂号
          uni.navigateTo({
            url: `/pages-zy/appointmentDoc/appointmentInfo?basinsId=${res ||
              ''}&docId=${params.docId}&scheduleNo=${params.scheduleNo}&date=${
              params.date
            }&deptId=${params.deptId}&orgId=${params.orgId}&item=${
              params.item
            }&inperId=${params.inperId}`,
          })
        } else if (this.isform == 0) {
          //预约核酸
          uni.setStorageSync('memberInfo', JSON.stringify(this.formData))
          uni.navigateTo({
            url: '/pages-user/nucleicAcidAppointment/flowform/selectItem',
          })
        } else {
          //扫码和直接进入流调表
          getApp().globalData.pageQuery = '' //清空进入app的参数
          uni.reLaunch({
            url: '/pages/index-user',
          })
        }
      }, 500)
    },
    //提交
    async submitBtn() {
      //验证
      const MESSAGETYPE = {
        patientId: '请选择就诊人',
        address: '请选择地址',
        addDetail: '请填写详细地址',
      }
      for (const val in MESSAGETYPE) {
        if (!this.formData[val] && MESSAGETYPE[val]) {
          uni.showToast({
            title: MESSAGETYPE[val],
            icon: 'none',
          })
          return
        }
      }

      // //问题集合
      // const list = [].concat(...this.quesList.map(val => [...val.quesList]))
      // // 答案整理
      // this.formData.quesList = list.map(val => {
      //   return {
      //     quesId: val.quesId,
      //     quesName: val.quesName,
      //     select: val.value,
      //     selectList: val.selectList,
      //   }
      // })
      // //填写验证
      // if (this.formData.quesList.some(val => !val.select)) {
      //   uni.showToast({ title: '请检查问题并填写完整', icon: 'none' })
      //   return
      // }
      // console.log(this.formData.quesList, '问题答案集合')

      //参数处理
      this.formData.basinsList = this.quesList.map(val => {
        return {
          title: val.title,
          titleType: val.titleType,
          quesList: val.quesList.map(item => {
            return {
              quesId: item.quesId,
              quesName: item.quesName,
              select: item.value,
              selectList: item.selectList,
            }
          }),
        }
      })
      //填写验证
      const flag = this.formData.basinsList.every(val => {
        return val.quesList.every(item => item.select)
      })
      // console.log(this.formData.basinsList, '答案组------')
      if (!flag) {
        uni.showToast({ title: '请检查问题并填写完整', icon: 'none' })
        return
      }

      //取消核酸预约【是】的限制 start
      // this.submitInform(this.formData)
      // 非核酸预约进入流调表 需要提交流调表
      if (this.isform != 0) {
        this.submitInform(this.formData)
        return
      }
      uni.setStorageSync('memberInfo', JSON.stringify(this.formData))
      uni.navigateTo({
        url: '/pages-user/nucleicAcidAppointment/flowform/selectItem',
      })
      //end
    },
  },
}
</script>

<style lang="scss" scoped>
.colorPrim {
  color: $uni-color-primary;
}
.address {
  ::v-deep picker {
    width: 100%;
  }
}
.uni-list-cell-pd {
  justify-content: start;
  padding: 10rpx 30rpx;
  radio {
    transform: scale(0.8);
    color: $uni-color-primary;
  }
}
.uni-list-cell::after {
  height: 0;
}
.input_pla {
  font-size: 30rpx;
  color: #ccc;
}
.inputStyle {
  font-size: 30rpx;
  color: #333;
}
.submit_btn {
  position: relative;
}
.appcard {
  ::v-deep .required {
    .list-item-label {
      position: relative;
      &::before {
        content: '*';
        color: #ea4444;
        font-size: 20rpx;
        position: absolute;
        top: 0;
        left: -10rpx;
      }
    }
  }
}
.msg-text {
  text-align: justify;
  color: red;
  margin-bottom: 10px;
  text-indent: 2em;
  font-size: 14px;
}
</style>
