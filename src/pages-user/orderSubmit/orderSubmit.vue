<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog>
        <view class="dialog-fade">
          <view class="dialog-body">
            <view class="close-icon" @click="closePointer"
              ><icon type="clear" :size="18"></icon
            ></view>
            <view class="dialog-title">自提点</view>
            <view class="flex-start-center">
              <view style="color: #666;">自提点</view>
              <view class="ml-20">{{
                details.storeDtoList[selectSelfIndex].pharmacyName
              }}</view>
            </view>
            <view class="flex-start-center  mt-20">
              <view style="color: #666;">联系电话</view>
              <view class="ml-20">{{
                details.storeDtoList[selectSelfIndex].pharmacyPhone
              }}</view>
            </view>
            <view class="flex-start-center mt-20">
              <view style="color: #666;">详细地址</view>
              <view class="ml-20 ">{{
                details.storeDtoList[selectSelfIndex].address
              }}</view>
            </view>
          </view>
        </view>
      </uni-popup-dialog>
    </uni-popup>

    <topbar :active="active" :tabs="tabs" @change="tabChange"></topbar>
    <view class="app-card" v-if="active == 'self'">
      <view v-for="(item, index) in details.storeDtoList" :key="index">
        <view class="flex-between cell" @click="viewPointer(index)">
          <view class="flex-start-center">
            <view class="cell-label">自提点{{ index + 1 }}</view>
            <view class="cell-value">
              <view class="">{{ item.pharmacyName }}</view>
              <view class="">{{ item.pharmacyPhone }}</view>
            </view>
          </view>
          <view
            ><image
              class="arrow-horizontal"
              :src="require('@/assets/right11@2x.png')"
              mode="aspectFit"
            ></image
          ></view>
        </view>
        <view class="flex-between cell" @click="selectTime(index)">
          <view class="flex-start-center">
            <view class="cell-label">自提时间</view>
            <view class="cell-value"
              >{{ item.date || '请选择' }} {{ item.startTime || ''
              }}{{ item.endTime ? '-' + item.endTime : '' }}</view
            >
          </view>
          <view
            ><image
              class="arrow-horizontal"
              :src="require('@/assets/right11@2x.png')"
              mode="aspectFit"
            ></image
          ></view>
        </view>
      </view>

      <view class="flex-start-center cell">
        <view class="cell-label">预留手机</view>
        <view class="cell-value">{{ details.phone }}</view>
      </view>
    </view>
    <view class="app-card" v-else>
      <view class="flex-between cell" @click="addressS">
        <view class="flex-start-center">
          <view
            ><image
              :src="require('@/assets/location60@2x.png')"
              mode="aspectFit"
              style="width: 68rpx;height: 68rpx;"
            ></image
          ></view>
          <view class="ml-20" style="color: #666;">
            <view>
              <text style="font-size: 32rpx;color: #1a1a1a;">{{
                address.name
              }}</text>
              <text style="font-size: 24rpx;" class="ml-20">{{
                address.phone
              }}</text>
            </view>
            <view style="font-size: 24rpx;">{{
              address.detailAddress || ''
            }}</view>
          </view>
        </view>
        <view
          ><image
            class="arrow-horizontal"
            :src="require('@/assets/right11@2x.png')"
            mode="aspectFit"
          ></image
        ></view>
      </view>
      <view class="flex-start-center cell">
        <view class="cell-label">配送方式</view>
        <view class="cell-value">快递运输</view>
      </view>
      <view class="flex-between cell">
        <view class="flex-start-center">
          <view class="cell-label">邮寄费用</view>
          <view class="cell-value">
            寄付
            <text class="ml-20" style="color: #0AB2C1;"
              >￥{{ details.fare }}</text
            >
          </view>
        </view>
        <view
          ><image
            class="arrow-horizontal"
            :src="require('@/assets/right11@2x.png')"
            mode="aspectFit"
          ></image
        ></view>
      </view>
    </view>

    <view class="app-card">
      <view class="flex-start-center cell">
        <view class="cell-label">健康卡</view>
        <view class="cell-value">{{ details.name }}</view>
      </view>
      <view v-if="details.diseaseDesc" class="cell">{{
        details.diseaseDesc || ''
      }}</view>
      <view v-show="symptomShow">
        <view class="detailList flex-start-start"
          ><image
            class="item"
            :src="FILE_URL(item)"
            v-for="(item, index) in details.rpPicIds"
            :key="index"
          ></image
        ></view>
        <view class="flex-start-center cell">
          <view class="cell-label">类型</view>
          <view class="cell-value">{{
            switchBizType(details.serviceType)
          }}</view>
        </view>
        <view class="flex-start-center cell" @click="visitHistory()">
          <view class="cell-label">历史就诊记录</view>
          <view class="cell-value"
            >{{ details.historyMedicalInfo.createTime || '无' }}
            {{ details.historyMedicalInfo.outDiagnose || '' }}</view
          >
        </view>
        <view class="flex-start-center cell">
          <view class="cell-label">诊疗形式</view>
          <view class="cell-value">{{
            switchBizWay(details.serviceMode)
          }}</view>
        </view>
        <view>
          <view
            class="flex-between cell"
            v-show="details.serviceType == 'CARRYON_PRESC'"
          >
            <view class="cell-label">续方处方</view>
            <view
              class="cell-value flex-center"
              @click="oldPrescriptionBoxShow = !oldPrescriptionBoxShow"
            >
              <text style="margin-right: 12rpx;">{{
                oldPrescriptionBoxShow ? '收起' : '展开'
              }}</text>
              <image
                class="arrow-horizontal"
                :src="require('@/assets/right11@2x.png')"
                mode="aspectFit"
              ></image>
            </view>
          </view>
          <view
            v-show="oldPrescriptionBoxShow"
            class="prescription-box__item"
            v-for="(item, index) in details.oldRpList"
            :key="index"
          >
            <view class="flex-between">
              <view class="prescription-no">处方号：{{ item.id }}</view>
              <view class="prescription-price"
                >￥{{ item.prescriptionPrice }}</view
              >
            </view>
            <view style="font-size: 24rpx;"
              >数量:{{ item.number }} 医生：{{ item.doctorName }}
              {{ item.title }} {{ item.treatmentTime }}</view
            >
            <view class="">
              诊断：
              <text style="color: #333;">{{ item.diagnosis }}</text>
            </view>
            <!-- <view @click="show = !show" class="text-right">
              <text style="margin-right: 12rpx;">{{ show ? '收起' : '查看' }}详情</text>
              <image :class="{ reverse: show }" :src="require('@/assets/open@2x.png')" mode="aspectFit" style="width: 22rpx;height: 20rpx;"></image>
            </view> -->
            <!-- v-show="show" -->
            <view
              class="detail"
              v-for="(rpDrug, i) in item.rpDrugList"
              :key="i"
            >
              <view class="flex-between">
                <view class="medicine-name"
                  >{{ i + 1 }}.{{ rpDrug.name }} {{ rpDrug.spec }}</view
                >
                <view class="medicare">{{
                  rpDrug.medicare == 'ME_FEE'
                    ? '自费'
                    : swithMedicare(rpDrug.medicare)
                }}</view>
              </view>
              <view class="ml-20">
                <view class="use">
                  {{ rpDrug.useWaysText || '' }}
                  {{ rpDrug.useFrequencyText || '' }}
                  {{ rpDrug.singleDose || ''
                  }}{{ rpDrug.singleDoseUnitText + '/次' }}
                  {{ rpDrug.treatment || ''
                  }}{{ rpDrug.treatmentUnit || '' }} ￥{{ rpDrug.price
                  }}{{ '/' + rpDrug.totalUnitText }}x{{ rpDrug.total }}
                </view>
                <view class="price">￥{{ rpDrug.totalPrice }}</view>
                <view class="remark">备注：{{ rpDrug.remark || '-' }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="text-center" @click="symptomShow = !symptomShow">
        <text style="color: #0AB2C1;"
          >{{ symptomShow ? '收起' : '更多' }}服务订单信息</text
        >
        <image
          class="arrow-vertical"
          :class="{ reverse: symptomShow }"
          :src="require('@/assets/bottom-color@2x.png')"
          mode="aspectFit"
        ></image>
      </view>
    </view>

    <view class="app-card prescription-box">
      <view class="flex-between cell">
        <view>处方</view>
        <view
          style="color: #999;"
          @click="prescriptionBoxShow = !prescriptionBoxShow"
        >
          <text>{{ prescriptionBoxShow ? '收起' : '查看' }}</text>
          <image
            class="arrow-vertical"
            :src="require('@/assets/open@2x.png')"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <view
        v-show="prescriptionBoxShow"
        class="prescription-box__item"
        v-for="(item, index) in details.rpDtoList"
        :key="index"
      >
        <view class="flex-between">
          <view class="prescription-no">处方号：{{ item.id }}</view>
          <view class="prescription-price">￥{{ item.prescriptionPrice }}</view>
        </view>
        <view v-if="active == 'self'"
          >自提点：{{ item.rpDrugList[0].receivePharmacy }}</view
        >
        <view style="font-size: 24rpx;"
          >数量:{{ item.number }} 医生：{{ item.doctorName }} {{ item.title }}
          {{ item.treatmentTime }}</view
        >
        <view class="">
          诊断：
          <text style="color: #333;">{{ item.diagnosis }}</text>
        </view>
        <!-- <view @click="show = !show" class="text-right">
          <text style="margin-right: 12rpx;">{{ show ? '收起' : '查看' }}详情</text>
          <image :class="{ reverse: show }" :src="require('@/assets/open@2x.png')" mode="aspectFit" style="width: 22rpx;height: 20rpx;"></image>
        </view> -->
        <!-- v-show="show" -->
        <view class="detail" v-for="(rpDrug, i) in item.rpDrugList" :key="i">
          <view class="flex-between">
            <view class="medicine-name"
              >{{ i + 1 }}.{{ rpDrug.name }} {{ rpDrug.spec }}</view
            >
            <view class="medicare">{{
              rpDrug.medicare == 'ME_FEE'
                ? '自费'
                : swithMedicare(rpDrug.medicare)
            }}</view>
          </view>
          <view class="ml-20">
            <view class="use">
              {{ rpDrug.useWaysText || '' }}
              {{ rpDrug.useFrequencyText || '' }} {{ rpDrug.singleDose || ''
              }}{{ rpDrug.singleDoseUnitText + '/次' }}
              {{ rpDrug.treatment || '' }}{{ rpDrug.treatmentUnit || '' }} ￥{{
                rpDrug.price
              }}{{ '/' + rpDrug.totalUnitText }}x{{ rpDrug.total }}
            </view>
            <view class="price">￥{{ rpDrug.totalPrice }}</view>
            <view class="remark">备注：{{ rpDrug.remark || '-' }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="app-card doctor-info">
      <view class="flex-start-start" style="padding: 20rpx 0;">
        <view class="avatar-wrapper"
          ><image
            class="avatar"
            :src="
              details.docPic
                ? FILE_URL(details.docPic)
                : require('@/assets/user/user_d_head.png')
            "
            mode="scaleToFill"
          ></image
        ></view>
        <view class="ml-30">
          <view>
            <text class="doctor-info_doctor">{{ details.docName }}</text>
            <text>{{ details.docSex == '1' ? '男' : '女' }}</text>
          </view>
          <view class=""
            >{{ details.docDept }} {{ details.docTitle }}
            {{ details.docHospital }}</view
          >
          <view
            class="text-overflow overflow-hidden"
            style="white-space: nowrap;width: 550rpx;"
            >擅长：{{ details.docGoods }}</view
          >
        </view>
      </view>
    </view>

    <view class="app-card doctor-info" v-show="active == 'express'">
      <view class="flex-start-center cell">
        <view class="cell-label">处方费用</view>
        <view class="cell-value" style="color: #0AB2C1;"
          >￥{{ prescriptionTotal }}</view
        >
      </view>
      <view class="flex-start-center cell">
        <view class="cell-label">运费</view>
        <view class="cell-value" style="color: #0AB2C1;"
          >￥{{ details.fare }}</view
        >
      </view>
      <view class="flex-start-center cell">
        <view class="cell-label">合计</view>
        <view class="cell-value" style="color: #0AB2C1;"
          >￥{{ getTotal() }}</view
        >
      </view>
    </view>

    <view class="flex-between mt-40">
      <view class="flex-center">
        <evan-checkBox
          style="margin-right: 10rpx;"
          v-model="confirmChecked"
          shape="square"
          primary-color="#0AB2C1"
          icon-size="12"
        ></evan-checkBox>
        我同意
        <text style="color: #0AB2C1;" @click="agreementOpen()">{{
          active == 'express' ? '《邮寄授权协议》' : '《自提授权协议》'
        }}</text>
      </view>
      <view style="color: #0AB2C1;" v-show="active == 'self'"
        >合计￥{{ prescriptionTotal }}</view
      >
    </view>
    <button class="submit_btn" @click="submit">支付￥{{ getTotal() }}</button>

    <picker-popup ref="timePopup" @time="selfTime()"></picker-popup>

    <uni-popup ref="visit_records">
      <view class="records-p">
        <text class="text">历史就诊记录</text>
        <view class="content">
          <view
            class="time"
            v-if="details.historyMedicalInfo.medicalType === 'MZ'"
          >
            <text>就诊记录</text>
            <text>{{ details.historyMedicalInfo.visitDate || '无' }}</text>
          </view>
          <view class="time" v-else>
            <text>住院记录</text>
            <text>{{
              details.historyMedicalInfo.inDiagnose +
                '-' +
                details.historyMedicalInfo.outDiagnose || '无'
            }}</text>
          </view>
          <text class="name">{{ details.historyMedicalInfo.patientName }}</text>
          <text class="doctor"
            >{{ details.historyMedicalInfo.deptName }}
            {{ details.historyMedicalInfo.doctorName }}
            {{ details.historyMedicalInfo.title }}</text
          >
          <template v-if="details.historyMedicalInfo.medicalType === 'MZ'">
            <text class="diagnosis"
              >诊断：{{ details.historyMedicalInfo.diagnose }}</text
            >
          </template>
          <template v-else>
            <text class="diagnosis"
              >入院诊断：{{ details.historyMedicalInfo.inDiagnose }}</text
            >
            <text class="diagnosis"
              >出院诊断：{{ details.historyMedicalInfo.outDiagnose }}</text
            >
          </template>
        </view>
      </view>
    </uni-popup>
    <!--选择支付方式-->
    <popup-pay
      ref="pay"
      @success="paySuccess"
      @payTap="orderTap"
      :type="true"
      @cancel="payCancel"
    ></popup-pay>

    <uni-popup ref="agreementPopup" type="center" :maskClick="false">
      <view class="type-popup">
        <text class="popup-title">{{
          active == 'express' ? expressA.title : selfA.title
        }}</text>
        <scroll-view class="popup-content" scroll-y="true"
          ><view
            v-html="active == 'express' ? expressA.content : selfA.content"
          ></view
        ></scroll-view>

        <text class="popup-confirm" @click="agreementConfirm()">我知道了</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import evanCheckBox from '@/components/evan-checkbox/evan-checkbox.vue'
;('@/common/request/userPrescription.js')
import {
  userRpDetail,
  orderSubmit,
} from '../../common/request/userPrescription.js'
import { showAgreement } from '../../common/request/index.js'
import { addressList } from '../../common/request/userCenter.js'
import util from '@/common/util.js'
import dayjs from 'dayjs'
import { medicalDetail } from '@/common/request'
export default {
  components: {
    evanCheckBox,
  },
  onLoad(options) {
    if (options.ids) {
      this.rpIds = options.ids
    }
    if (options.total) {
      this.prescriptionTotal = util.changeTwoDecimal_f(options.total)
    }
    //枚举字段保存
    //用药途径枚举
    this.$store.state.channel.forEach(item => {
      this.allchannel[item.id] = item.name
    })
    //用药频次枚举
    this.$store.state.frequency.forEach(item => {
      this.allfrequency[item.id] = item.name
    })
    //日月
    this.$store.state.course.forEach(item => {
      this.attrdate[item.attrId] = item.attrName
    })
  },
  data() {
    return {
      allchannel: {},
      rpIds: '',
      tabs: [
        {
          title: '自提',
          key: 'self',
        },
        {
          title: '邮寄',
          key: 'express',
        },
      ],
      prescriptionTotal: '', //处方总价
      orderTotal: '', //订单总价
      oldPrescriptionBoxShow: false,
      prescriptionBoxShow: true,
      active: 'self',
      symptomShow: false,
      show: false,
      // 我同意协议单选框
      confirmChecked: 0,
      selectIndex: 0, //当前操作的自提时间index

      address: {
        id: '', //主键
        name: '', //收货人名称
        phone: '', //联系号码
        detailAddress: '', //详细地址
      }, //收货地址

      form: {
        bizId: '',
        bizType: 'PRESCRIPTION',
        prescIds: [],
        express: false,
        phone: '',
        agreement: true,
        addressId: '',
        takeInfoList: [
          {
            orderId: '',
            pharmacyId: '',
            date: '',
            startTime: '',
            endTime: '',
            address: '',
            pharmacyName: '',
          },
        ],
      },
      details: {},
      selectSelfIndex: 0, //选中自提点index
      expressA: {}, //邮寄协议
      selfA: {}, //自提协议
      addressList: [], //收货地址列表
      isPay: true,
    }
  },
  onShow() {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    let res = currPage.data.address
    if (res) {
      this.address = res
    }
  },
  mounted() {
    this.getAddresss()
    this.getUserRpDetail()
    this.getAgreement()
  },
  methods: {
    getAddresss() {
      addressList().then(data => {
        this.addressList = data
      })
    },
    switchBizType(type) {
      return util.switchBizType(type)
    },
    switchBizWay(way) {
      return util.switchBizWay(way)
    },
    selectTime(storeDtoIndex) {
      this.selectIndex = storeDtoIndex
      this.$refs.timePopup.show()
    },
    selfTime(date, startTime, endTime) {
      this.details.storeDtoList[this.selectIndex].date = dayjs(date).format(
        'YYYY-MM-DD',
      )
      this.details.storeDtoList[this.selectIndex].startTime = this.timeFormat(
        startTime,
      )
      this.details.storeDtoList[this.selectIndex].endTime = this.timeFormat(
        endTime,
      )
      this.details.storeDtoList[
        this.selectIndex
      ].orderId = this.details.rpDtoList[0].orderId
      this.$forceUpdate()
    },
    timeFormat(time) {
      let timeRang = time?.split(':')
      let arr = []
      timeRang.forEach(s => {
        if (parseInt(s) < 10) {
          s = '0' + s
        }
        arr.push(s)
      })
      return arr.join(':')
    },
    tabChange(active) {
      this.active = active
    },
    viewPointer(index) {
      this.selectSelfIndex = index
      this.$refs.popup.open()
    },
    closePointer() {
      this.$refs.popup.close()
    },
    // bindDateChange(event) {
    //   this.form.takeInfoList[0].date = event.target.value;
    // },
    /*   async getHistory(id){
      this.historyMedicalInfo= await medicalDetail({medicalId:id})

      console.log(this.historyMedicalInfo,'000000000000000000000000000')
    }, */
    getUserRpDetail() {
      userRpDetail({
        rpIds: this.rpIds,
      }).then(data => {
        if (data) {
          this.details = data
          console.log(this.details, '---------------------------')
          //填充收货地址

          this.address = {
            id: this.details.addressId,
            name: this.details.userName,
            phone: this.details.userPhone,
            detailAddress: this.details.userAddress,
          }

          //
          this.getHistory(data.rpDtoList[0].medicalId)
        }
      })
    },
    async submit() {
      //1判断协议

      if (!this.confirmChecked) {
        let str = '《自提授权协议》'
        if (this.active == 'express') {
          str = '《邮寄授权协议》'
        }
        uni.showToast({
          title: '请先同意' + str,
          icon: 'none',
        })
        return
      }
      //2自提： 每个自提点时间
      if (this.active == 'self') {
        var isR = false
        this.form.takeInfoList = this.details.storeDtoList
        this.form.takeInfoList.forEach(data => {
          if (!data.date) {
            uni.showToast({
              title: '请选择自提时间!',
              icon: 'none',
            })
            isR = true
            return
          }
        })
        if (isR) return
      } else {
        //3邮寄：收货地址
        if (!this.address.id) {
          uni.showToast({
            title: '请选择邮寄地址!',
            icon: 'none',
          })
          return
        }
      }
      this.form.addressId = this.address.id
      this.form.prescIds = this.rpIds?.split(',')
      this.form.express = this.active == 'express'
      this.form.phone = this.details.phone

      this.$refs.pay.show()
    },
    async orderTap() {
      if (this.isPay) {
        this.isPay = false
        const data = await orderSubmit(this.form)
        if (data) {
          if (data.isPay) {
            //0元业务已支付
            uni.showToast({
              title: '支付成功',
            })
            this.$refs.pay.closePop()
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              })
              this.isPay = true
            }, 1000)
          } else {
            this.$refs.pay.payTypeC(data.orderId)
            this.isPay = true
          }
        } else {
          this.isPay = true
        }
      }
    },
    visitHistory() {
      this.$refs.visit_records.open()
    },
    //就诊地址
    addressS() {
      var url = ''
      if (this.addressList && this.addressList.length > 0) {
        url = '../address/list?page=orderSubmit'
      } else {
        url = '../address/add?page=orderSubmit'
      }
      uni.navigateTo({
        url: url,
      })
    },
    getTotal() {
      if (this.active == 'self') {
        this.orderTotal = this.prescriptionTotal
      } else {
        this.orderTotal =
          parseFloat(this.details.fare) + parseFloat(this.prescriptionTotal)
      }
      return util.changeTwoDecimal_f(this.orderTotal)
    },
    getAgreement() {
      for (let i = 1; i <= 2; i++) {
        showAgreement({
          genre: i,
        }).then(data => {
          if (i == 1) {
            //自提授权协议
            this.selfA = data
          } else if (i == 2) {
            //邮寄授权协议
            this.expressA = data
          }
        })
      }
    },
    agreementOpen() {
      this.$refs.agreementPopup.open()
    },
    agreementConfirm() {
      this.$refs.agreementPopup.close()
    },
    swithMedicare(medicare) {
      var str = '医保：'
      switch (medicare) {
        case 'A':
          str += '甲类'
          break
        case 'B':
          str += '乙类'
          break
        case 'C':
          str += '丙类'
          break
      }
      return str
    },
    paySuccess() {
      uni.showToast({
        title: '支付成功',
      })
      //支付成功  处方订单详情
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 1000)
    },
    payCancel() {
      //取消支付  处方订单详情
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.detailList {
  margin-top: 30rpx;
  flex-wrap: wrap;

  .item {
    width: 180rpx;
    height: 180rpx;
    margin-right: 30rpx;
    margin-top: 20rpx;
  }
}

.dialog-fade {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.close-icon {
  position: absolute;
  top: 30rpx;
  right: 20rpx;
}

.dialog-body {
  position: relative;
  width: 80vw;
  padding: 0 20rpx 20rpx;
  border-radius: 20rpx;
  background-color: #fff;
}

.dialog-title {
  padding: 20rpx 0;
  text-align: center;
  font-size: 32rpx;
}

.container {
  padding: 86rpx 20rpx 140rpx;
}

.app-card {
  margin-top: 20rpx;
}

.cell {
  padding: 32rpx 0;

  & + .cell {
    border-top: 2rpx solid #e6e6e6;
  }

  view {
    font-size: 32rpx;
  }
}

.cell-label {
  width: 220rpx;
  color: #666;
}

.cell-value {
  color: #333;
}

.symptom-image {
  margin-right: 20rpx;
  width: 180rpx;
  height: 180rpx;
}

.prescription-no {
  font-size: 32rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prescription-price {
  color: #0ab2c1;
}

.detail {
  padding: 20rpx;
  background-color: #eee;
}

.reverse {
  transform: rotate(0.5turn);
}

.medicine-name {
  color: #333;
}

.use {
  color: rgba(102, 102, 102, 1);
}

.price {
  font-size: 32rpx;
  color: #0ab2c1;
}

.prescription-box {
  color: #666;
}

.arrow-vertical {
  margin-left: 8rpx;
  width: 22rpx;
  height: 22rpx;
}

.arrow-horizontal {
  width: 16rpx;
  height: 24rpx;
}

.prescription-box__item {
  padding: 20rpx 0;
  border-top: 2rpx solid #e6e6e6;
}

.doctor-info {
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.avatar-wrapper {
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
}

.doctor-info_doctor {
  margin-right: 20rpx;
  font-size: 34rpx;
  font-weight: bolder;
  color: #1a1a1a;
}

.doctor-info_score {
  margin-right: 40rpx;
  font-size: 34rpx;
  color: #ffa200;
}

.doctor-info_cell {
  padding: 20rpx 0;
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.doctor-info_cell_label {
  width: 100rpx;
  font-size: 28rpx;
}

.doctor-info_cell_value {
  margin-left: 120rpx;
  font-size: 28rpx;
  color: #1a1a1a;
}

.records-p {
  width: 640rpx;
  min-height: 456rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  border-radius: 20rpx;
  align-items: center;
  padding: 40rpx 0rpx;

  .text {
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    text-align: center;
  }

  .content {
    margin-top: 40rpx;
    padding: 40rpx 28rpx;
    width: 524rpx;
    min-height: 226rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    .time {
      font-size: 24rpx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
      display: flex;
      justify-content: space-between;
    }

    .name {
      font-size: 30rpx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
      margin-top: 40rpx;
    }

    .doctor {
      margin-top: 20rpx;
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
    }

    .diagnosis {
      margin-top: 20rpx;
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
    }
  }
}

.type-popup {
  width: 640rpx;

  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;

  .popup-title {
    font-size: 30rpx;
    text-align: center;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    padding: 41rpx;
  }

  .popup-content {
    max-height: 500rpx;
    width: auto;
    font-size: 26rpx;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    padding: 0rpx 29rpx;
    line-height: 46rpx;
  }

  .popup-confirm {
    margin-top: 30rpx;
    font-size: 30rpx;
    font-weight: 500;
    padding: 30rpx;
    color: rgba(10, 178, 193, 1);
    text-align: center;
  }
}

checkbox-group {
  width: 400rpx;
}
</style>
