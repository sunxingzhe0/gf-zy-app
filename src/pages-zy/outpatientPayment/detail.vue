<template>
  <view style="padding-bottom:100rpx">
	  <!-- 收到视频聊天邀请 -->
	  <video-invitation />
	  <!--主页按钮-->
	  <homeIcom />
    <view>
      <view class="top-tip" v-if="type==0">
        温馨提示：暂只支持自费，使用医保请到窗口缴费。
      </view>
      <view class="top-bg flex-center" :style="{
          backgroundImage: `url(${FILE_URL_BUILT_IN(
            type == 0 ?  'orderIngoBg2.png':'orderIngoBg2_grey.png',
          )})`,
        }">
        <view>{{type==0?'未支付':type==1?'已完成':'已退费'}}</view>
      </view>
    </view>
    <view style="padding: 20rpx;padding-top: 0;margin-top: -20rpx;">
      <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
        <app-list-item label="单据号" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.prescNo || '-'"></app-list-item>
        <app-list-item label="项目" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.name || '-'"></app-list-item>
        <app-list-item label="金额" :styles="{padding:'30rpx',paddingLeft:0}" :value="`￥${parseFloat(info.fee).toFixed(2) || '-'}`"></app-list-item>
        <app-list-item label="就诊人" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.patientName || '-'"></app-list-item>
        <app-list-item label="医院" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.hospitalName"></app-list-item>
        <app-list-item label="科室" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.deptName || '-'"></app-list-item>
        <app-list-item label="医生" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.doctorName"></app-list-item>
        <app-list-item label="创建时间" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.createTime || '-'"></app-list-item>

      </app-card>
      <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
        <app-list-item label="支付号" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.payNo || '-'"></app-list-item>
        <app-list-item label="支付方式" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.payWay || '-'"></app-list-item>
        <app-list-item label="支付金额" :styles="{padding:'30rpx',paddingLeft:0}" :value="`${info.payFee?'￥'+parseFloat(info.payFee).toFixed(2) : '-'}`"></app-list-item>
        <app-list-item label="支付时间" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.payTime || '-'"></app-list-item>
      </app-card>
      <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;" v-if="type==2">
        <app-list-item label="退费金额" :styles="{padding:'30rpx',paddingLeft:0}" :value="`${info.payFee?'￥'+parseFloat(info.payFee).toFixed(2) : '-'}`"></app-list-item>
        <app-list-item label="退费流水号" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.payNo"></app-list-item>
        <app-list-item label="退费方式" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.payWay"></app-list-item>
        <app-list-item label="退费时间" :styles="{padding:'30rpx',paddingLeft:0}" :value="info.payTime"></app-list-item>
      </app-card>
      <app-card class="panWrap" styles="padding: 30rpx;" v-if="info.items && info.items.length > 0">
        <view class="color666 font28">{{info.name == '药品缴费'?'药品':'费用'}}明细</view>
        <!-- <view class="font28 mt-20"><text class="color666">诊断：</text>诊断内容，显示一行，多了就折叠</view> -->
        <view class="border burg mt-20">
          <view class="burgList flex-between" v-for="(item, index) in info.items" :key="index">
            <view class="font28" style="width: 460rpx; word-wrap:break-word;">{{ item.body }} x{{ item.num }}</view>
            <view class="flex-between">
              <!-- <text class="font24 color666">{{item.drugType}}</text> -->
              <view class="price font28">￥{{ (parseInt(item.num) * parseFloat(item.fee)).toFixed(2) }}</view>
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
      <view class="font30 color666">费用金额：<text class="colorred font-weight">￥{{parseFloat(info.fee).toFixed(2)}}</text></view>
      <!-- <view class="btn" v-if="false"><van-button type="primary">取消预约</van-button></view>
      <view class="btn" v-if="true"><van-button type="primary" @click="pay">支付</van-button></view> -->
      <view class="payBtn" @click="payTap">支付</view>
    </view>
    <!-- 支付列表 -->
    <pop-pay ref="pay" :type="true" @success="back" @payTap="paySubmit"></pop-pay>
  </view>
</template>
<script>
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import popPay from '../components/pop-pay/index.vue'
  import { mzRpDetail, payCancel, payNotify, mzPayment } from '../api/outpatient.js'
  export default {
    components: {
      AppCard,
      AppListItem,
      popPay
    },
    data() {
      return {
        isOpen: false,
        payType: '1',
        state: 1,
        patientId: '',
        type: '',
        billNo: '',
        visitNo: '',
        info: {},
        isPay:true
      }
    },
    onLoad(option) {
      this.patientId = option.patientId
      this.type = option.type
      this.billNo = option.billNo
      this.visitNo = option.visitNo
      this.getmzRpDetail()
    },
    methods: {
       // 获取详情
      async getmzRpDetail() {
        this.info = await mzRpDetail({
          patientId: this.patientId,
          type: this.type,
          billNo: this.billNo,
          visitNo: this.visitNo,
        })
      },
      // 智能导诊
      daoZhen() {
        uni.showModal({
          title: '智能导诊',
          content: '本院所有预约号不予取消。如确因病情好转、病情恶化、已住院或不可抗拒的自然因素等特殊情况需取消预约挂号时，可由患者本人于预约就诊日前的工作时间内持本人身份证原件，前往门诊一楼预约挂号咨询台办理相关手续；如由他人代办，需由代办人出示患者身份证原件、代办人身份证及预约成功短信截图进行办理',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      },
      payTap() {
          this.$refs.pay.show()

      },
      back(){
        setTimeout(() => {
          uni.navigateBack({
          delta:1
        })
        }, 500);

      },
      paySubmit() {
            //确认支付
            let that = this
            if(this.isPay){
              this.isPay = false
              mzPayment({
                  payment: this.payType,
                  patientId: this.patientId,
                  items: [this.info.payInfo],
                  payCard: '',
                })
                .then(data => {
                  this.$refs.pay.payTypeC(data)
                  this.isPay = true
                }).catch(()=>{
                  this.isPay = true
                })
              }else{
                 uni.showToast({
                  title:'请勿重复点击',
                  icon:'none'
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
      background: #F1F1F1;
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
