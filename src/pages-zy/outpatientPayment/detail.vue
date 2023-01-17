<template>
  <view style="padding-bottom:100rpx">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view>
      <view class="top-tip" v-if="type == 0">
        温馨提示：暂只支持自费，使用医保请到窗口缴费。
      </view>
      <view
        class="top-bg flex-center"
        :style="{
          backgroundImage: `url(${FILE_URL_BUILT_IN(
            type == 0 ? 'orderIngoBg2.png' : 'orderIngoBg2_grey.png',
          )})`,
        }"
      >
        <view>{{
          type == 0 ? '未支付' : type == 1 ? '已完成' : '已退费'
        }}</view>
      </view>
    </view>
    <view style="padding: 20rpx;padding-top: 0;margin-top: -20rpx;">
      <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
        <app-list-item
          label="单据号"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.billNo || '-'"
        ></app-list-item>
        <app-list-item
          label="门诊号"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.outSno || '-'"
        ></app-list-item>
        <app-list-item
          label="项目"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.name || '-'"
        ></app-list-item>
        <app-list-item
          label="金额"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.fee && Math.abs(info.fee) | feeFmt"
        ></app-list-item>
        <app-list-item
          label="就诊人"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="name || info.patientName || '-'"
        ></app-list-item>
        <app-list-item
          label="医院"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.hospitalName"
        ></app-list-item>
        <app-list-item
          label="科室"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.deptName || '-'"
        ></app-list-item>
        <app-list-item
          label="医生"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.doctorName"
        ></app-list-item>
        <app-list-item
          label="创建时间"
          :styles="{ padding: '20rpx', paddingLeft: 0 }"
          :value="info.createTime || '-'"
        ></app-list-item>
      </app-card>
      <app-card
        v-if="type != 2 && type != 0"
        class="panWrap"
        styles="padding: 0;padding-left:20rpx;"
      >
        <app-list-item
          label="支付号"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="type == 2 ? info.refundNo : info.payNo || '-'"
        ></app-list-item>
        <app-list-item
          label="支付方式"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="info.refundWay || info.payWay || '-'"
        ></app-list-item>
        <app-list-item
          label="支付金额"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="type == 2 ? info.refundFee : info.payFee | feeFmt"
        ></app-list-item>
        <app-list-item
          label="支付时间"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="type == 2 ? info.refundTime : info.payTime || '-'"
        ></app-list-item>
      </app-card>
      <app-card
        class="panWrap"
        styles="padding: 0;padding-left:20rpx;"
        v-if="type == 2"
      >
        <app-list-item
          label="退费金额"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="Math.abs(info.payFee) | feeFmt"
        ></app-list-item>
        <app-list-item
          label="退费流水号"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="info.payNo"
        ></app-list-item>
        <app-list-item
          label="退费方式"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="info.payWay"
        ></app-list-item>
        <app-list-item
          label="退费时间"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
          :value="info.payTime"
        ></app-list-item>
      </app-card>
      <app-card
        class="panWrap"
        styles="padding: 30rpx;"
        v-if="info.items && info.items.length"
      >
        <view class="color666 font28" style="font-weight: bold;"
          >{{ info.name == '药品缴费' ? '药品' : '费用' }}明细</view
        >
        <!-- <view class="font28 mt-20"><text class="color666">诊断：</text>诊断内容，显示一行，多了就折叠</view> -->
        <view class="border burg mt-20">
          <view
            class="burgList flex-between"
            v-for="(item, index) in info.items.filter(
              val => Number(val.num) > 0,
            )"
            :key="index"
          >
            <view class="font28" style="width: 460rpx; word-wrap:break-word;"
              >{{ item.body }} x{{ item.num }}</view
            >
            <view class="flex-between">
              <!-- <text class="font24 color666">{{item.drugType}}</text> -->
              <view class="price font28"
                >￥{{
                  (parseInt(item.num) * Math.abs(parseFloat(item.fee))).toFixed(
                    2,
                  )
                }}</view
              >
            </view>
          </view>
        </view>
      </app-card>
      <!-- <app-card class="panWrap" styles="padding: 30rpx;">
        <view class="color666 font28 ">费用明细</view>
        <view class="burg mt-20">
          <template v-for="(item, index) in 4">
            <view :key="index" >
              <view class="burgList border-bottom">
                <view :class="['font28', 'minHeight', isOpen ? 'maxHeight' : 'van-ellipsis']">
                  血清促甲状腺激素测定（化学发光法）血清促甲状腺激素测定（化学发光法）血清促甲状腺激素测定（化学发光法）
                </view>
                <view class="flex-between" style="margin-top: 10rpx;">
                  <view class="price font28">￥28.00</view>
                  <text class="font24 pricolor" @click="isOpen = !isOpen">{{ isOpen ? '收起' : '明细' }}</text>
                </view>
              </view>
            </view>
          </template>
        </view>
      </app-card> -->
    </view>
    <view class="fiexdBtn flex-between" v-if="type == 0">
      <view class="font30 color666"
        >费用金额：<text class="colorred font-weight">
          {{ info.fee | feeFmt }}
        </text></view
      >
      <!-- <view class="btn" v-if="false"><van-button type="primary">取消预约</van-button></view>
      <view class="btn" v-if="true"><van-button type="primary" @click="pay">支付</van-button></view> -->
      <view class="payBtn" @click="payTap">支付</view>
    </view>
    <!-- 支付列表 -->
    <pop-pay
      ref="pay"
      :type="true"
      @success="successPay"
      @payTap="paySubmit"
    ></pop-pay>
  </view>
</template>
<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import popPay from '../components/pop-pay/index.vue'
import { mzRpDetail, mzPayment } from '../api/outpatient.js'
export default {
  components: {
    AppCard,
    AppListItem,
    popPay,
  },
  data() {
    return {
      isOpen: false,
      payType: 'WX',
      state: 1,
      patientId: '',
      type: '',
      billNo: '',
      visitNo: '',
      cardId: '',
      name: '',
      info: {},
      isPay: true,
    }
  },
  filters: {
    feeFmt(value) {
      return typeof value == 'number' || typeof value == 'string'
        ? `￥${parseFloat(value).toFixed(2)}`
        : '-'
    },
  },
  onLoad(option) {
    this.patientId = option.patientId
    this.type = option.type
    this.billNo = option.billNo
    this.visitNo = option.visitNo
    if (option.cardId) {
      this.cardId = option.cardId
    }
    if (option.name) {
      this.name = option.name
    }
    this.getmzRpDetail()
  },
  methods: {
    // 获取详情
    async getmzRpDetail() {
      uni.showLoading()
      const params = {
        patientId: this.cardId ? '' : this.patientId,
        type: this.type,
        billNo: this.billNo,
        visitNo: this.visitNo,
      }
      if (this.cardId) {
        Object.assign(params, {
          cardId: this.cardId || '',
          name: this.name || '',
        })
      }
      this.info = await mzRpDetail(params)
      uni.hideLoading()
    },
    // 智能导诊
    daoZhen() {
      uni.showModal({
        title: '智能导诊',
        content:
          '本院所有预约号不予取消。如确因病情好转、病情恶化、已住院或不可抗拒的自然因素等特殊情况需取消预约挂号时，可由患者本人于预约就诊日前的工作时间内持本人身份证原件，前往门诊一楼预约挂号咨询台办理相关手续；如由他人代办，需由代办人出示患者身份证原件、代办人身份证及预约成功短信截图进行办理',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
    payTap() {
      this.$refs.pay.show()
    },
    successPay() {
      this.openTipNavigation()
    },
    //打开导航河豚引路
    openTipNavigation() {
      //是否为核酸检测
      if (this.info.name === '检验缴费' && this.info.doctorName === '彭晶晶') {
        return console.log('核酸检测不弹跳转=----------------')
      }
      uni.showModal({
        title: '系统消息',
        content: '是否导航到医技科室？',
        confirmColor: '#0AB2C1',
        success: confirm => {
          if (confirm.confirm) {
            uni.navigateToMiniProgram({
              appId: 'wx83884e3a215b20f4',
              path:
                'pages/map/mapView?buildId=0AIP01&url=https%3A%2F%2Fhis.ipalmap.com%2Fnavigation%2Fdist%2Findex.html%23%2Fmap%3FappsId%3D2161%26deptId%3D93',
              extraData: {
                data1: 'test',
              },
              success(res) {
                // 打开成功
              },
            })
          } else {
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              })
            }, 500)
          }
        },
      })
    },
    paySubmit() {
      //确认支付
      let that = this
      if (this.isPay) {
        this.isPay = false
        const params = {
          payment: this.payType,
          patientId: this.patientId,
          items: [this.info.payInfo],
          payCard: '',
        }
        if (this.cardId) {
          Object.assign(params, {
            cardId: Number(this.cardId) || '',
            name: this.name || '',
            patientId: '',
          })
        }
        mzPayment(params)
          .then(data => {
            this.$refs.pay.payTypeC(data)
            this.isPay = true
          })
          .catch(() => {
            this.isPay = true
          })
      } else {
        uni.showToast({
          title: '请勿重复点击',
          icon: 'none',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/common/order.scss';

.top-tip {
  height: 54rpx;
  line-height: 52rpx;
  padding-left: 20rpx;
  background-color: #fae2e2;
  color: #e45b5b;
}

.top-bg {
  height: 130rpx;
  background-size: contain;
  background-repeat: no-repeat;
  padding: 0 30rpx;
  padding-bottom: 15rpx;
  box-sizing: border-box;
  color: #fff;

  view {
    font-size: 32rpx;

    &.btn {
      background: #fff;
      color: $uni-color-primary;
      font-size: 24rpx;
      border-radius: 30rpx;
      width: 150rpx;
      text-align: center;
    }
  }
}

.panWrap {
  .burg {
    padding: 10rpx 20rpx;
    line-height: 40rpx;
    background: #f1f1f1;
    .burgList {
      padding: 10rpx 0;
    }
  }
}

.minHeight {
  max-height: 44rpx;
  overflow: hidden;
  transition: max-height 0.3s;
}

.maxHeight {
  max-height: 300rpx;
  overflow: hidden;
  transition: max-height 0.3s;
}
.fiexdBtn {
  height: 98rpx;
  width: 100%;
  background: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;

  .payBtn {
    width: 160rpx;
    height: 60rpx;
    background: $uni-color-primary;
    line-height: 60rpx;
    border-radius: 30rpx;
    text-align: center;
    color: #fff;
    font-size: 32rpx;

    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>
