<template>
  <view style="padding: 80rpx 20rpx 110rpx 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="[]">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item label="就诊人" :styles="{padding:'16rpx 30rpx',paddingLeft:0}">
            <view class="flex_1 text-right color666">
              <select-patient textStyle="color:#666;" @patientLoad="changePatient"></select-patient>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <!-- 标题 -->
    <view class="contentTitle box-shadow mt-20">
      <view>{{title}}</view>
    </view>
    <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">

      <app-list-item label="预约体检时间" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right" :style="{color:form.date?'':'#999'}" @click="$refs.date.open()">{{form.date || '请选择预约时间'}}</view>
      </app-list-item>
      <app-list-item label="手机号" :styles="{padding:'30rpx',paddingLeft:0}">
        <view class="flex_1 text-right">
          <input type="number" maxlength="11" v-model="form.phone" placeholder="请填写手机号" />
        </view>
      </app-list-item>
    </app-card>
    <!-- 注意事项 -->
    <view class="attention box-shadow">
      <view class="attenTitle flex-between">
        <view></view>
        <view class="notice">注意事项</view>
        <view></view>
      </view>
      <view class="text" v-html="tjNotice.content"> </view>
    </view>
    <!-- 提交按钮 -->
    <view class="fiexdBtn" @click="goTo">提交
    </view>
    <uni-calendar ref="date" :start-date="'2020-12-23'" :insert="false"
      @confirm="dateChange" class="physicalDate"></uni-calendar>
    <!-- 支付列表 -->
    <pop-pay ref="pay" :type="true" @success="paysuccess" @payTap="paySubmit"></pop-pay>
  </view>
</template>
<script>
  import selectPatient from '../../components/selectPatient.vue'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import popPay from '../../components/pop-pay/index.vue'
  import dayjs from 'dayjs'
  import {
    regTj,
    getLastPhone,
    getTjIns
  } from '../../api/physical.js'
  export default {
    components: {
      selectPatient,
      AppCard,
      AppListItem,
      popPay
    },
    data() {
      return {
        isClick:true,
        isPay: false,
        // 检查类型
        checkType: ['男士', '未婚女士', '已婚女士'],
        isPer: false,
        perId: '', // 就诊人id
        perName: '', // 就诊人
        // 是否激活选择检查类型
        isActive: 0,
        form: {
          date: '',
          phone: ''
        },
        packageNo: '',
        title:'',
        minDate:dayjs().add(1,'day').format('YYYY-MM-DD'),
        amount:0,
        tjNotice:{}
      }
    },
    onLoad(option) {
      this.packageNo = option.packageNo
      this.title = option.title
      this.amount = option.amount
      this.marryType = option.marryType
      this.getTjInsInfo()
    },
    methods: {
      dayjs,
      // 选择就诊人
      changePatient(item) {
        this.perId = item.memberId
        this.getphone(item.phone)
      },
      // 体检须知
      async getTjInsInfo(){
        this.tjNotice = await getTjIns({type:1})
      },
      //查询上次购买手机号
      async getphone(phone){
        let res = await getLastPhone({patientId:this.perId,packageNo:this.packageNo})
        this.form.phone = res==true?phone:res
      },

      paysuccess(){
        uni.redirectTo({
          url:`/pages-zy/myAppointment/list?type=1`
        })
      },
      //支付
      paySubmit(e) {
        if (!this.isClick){
        return uni.showToast({ title: '请勿重复点击', icon: 'none' })
      }
      this.isClick = false
        regTj({
          payment: e,
          patientId: this.perId,
          packageNo: this.packageNo,
          reserveDate: this.form.date,
          phone: this.form.phone,
          marryType:this.marryType,
          payCard: '',
          platOrgCode: '450388620S',
          packageFee:this.amount,
          packageName:this.title
        }).then(data => {
      this.isClick = true
          this.$refs.pay.payTypeC(data)
        })
      },

      //提交
      goTo() {
        if (this.form.perId == '') {
          uni.showToast({
            title: '请选择就诊人',
            icon: 'none'
          })
          return false
        }
        if (this.form.date == '') {
          uni.showToast({
            title: '请选择预约时间',
            icon: 'none'
          })
          return false
        }
        if (this.form.phone == '') {
          uni.showToast({
            title: '请填写联系电话',
            icon: 'none'
          })
          return false
        }
        this.$refs.pay.show()

      },
      dateChange(e) {
        console.log(e)
        this.form.date = e.fulldate
      }
    },
  }
</script>
<style scoped lang="scss">
  .main {
    padding-bottom: 130rpx;
  }

  .contentTitle {
    background: #fff;
    padding: 20rpx;
    margin-bottom: 20rpx;

    view {
      font-size: 30rpx;
      color: #333333;
      line-height: 50rpx;

      text {
        font-size: 22rpx;
        background: $uni-color-primary;
        color: #fff;
        padding: 4rpx 10rpx;
        border-radius: 2px;
        margin-right: 15rpx;
      }
    }
  }

  .attention {
    background: #fff;
    overflow: hidden;
    padding: 20rpx;
    padding-bottom: 40rpx;

    .attenTitle {
      width: 263rpx;
      margin: 10rpx auto 20rpx;

      view {
        height: 2;
        width: 50rpx;
        border-top: 2rpx solid #979797;
      }

      .notice {
        font-size: 32rpx;
        color: #333333;
        font-weight: 400;
        height: auto;
        border: 0;
        width: auto;
      }
    }

    .text {
      font-size: 28rpx;
      color: #646464;
      line-height: 42rpx;
    }
  }

  .fiexdBtn {
    height: 88rpx;
    width: 710rpx;
    position: fixed;
    bottom: 20rpx;
    left: 50%;
    margin-left: -355rpx;
    border-radius: 44rpx;
    background: $uni-color-primary;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;
  }

  .physicalDate {

    ::v-deep .uni-calendar-item--isDay,
    ::v-deep .uni-calendar-item--checked {
      border-radius: 15rpx;
    }

    ::v-deep .uni-calendar--fixed-top {
      view:nth-child(2) {
        .uni-calendar__header-text {
          color: $uni-color-primary;
        }

      }
    }
  }
</style>
