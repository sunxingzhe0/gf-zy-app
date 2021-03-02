<template>
  <view style="padding: 20rpx; padding-bottom: 130rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 对应医生 -->
    <view class="docBox box-shadow">
      <view class="flex-start-start docInfo">
        <view class="icon">
          <default-img :url="FILE_URL(docInfo.img)"></default-img>
        </view>
        <view class="info">
          <view class="infoText">
            <view class="docName">
              <text class="mr-20 font-weight">{{ docInfo.docName }}</text>{{ docInfo.docTitle || ''}}
            </view>
            <p>{{deptInfo.deptName || ''}}</p>
            <text>任职医院：{{deptInfo.orgName || ''}}</text>
          </view>
        </view>
      </view>
      <view class="goodAt border_b" v-if="isgoodAt">
        <view class="border_b" style="padding-right: 30rpx;margin-top: 30rpx;">
          <view class="title" v-show="docInfo.good">擅长</view>
          <view :class="['content', isgoodAt ? '' : 'text-clamp']" v-show="docInfo.good">
            {{ docInfo.good || ''}}
          </view>
        </view>
        <view style="padding-right: 30rpx;margin-top: 30rpx;">
          <view class="title">个人简介</view>
          <view class="content">
            {{ docInfo.intro || ''}}
          </view>
        </view>

      </view>
      <view class="openbtn font28 flex-center" @click="isgoodAt = !isgoodAt">
        {{ isgoodAt ? '收起' : '更多医生详细信息' }}
        <uni-icons :type="isgoodAt?'arrowdown':'arrowup'" color="#0AB2C1" size="12"></uni-icons>
      </view>
    </view>
    <app-card styles="padding: 0;padding-left:30rpx;">
      <app-list-item label="就诊日期" :styles="{padding:'30rpx',paddingLeft:0}" textStyle="font-size:30rpx;color:#333">
        <view class="flex_1 text-right color666">{{activeDate}} （{{week[dayjs(activeDate).format('d')]}}）
          {{adtiveOrderTime.shiftName?adtiveOrderTime.shiftName:''}}</view>
      </app-list-item>
      <app-list-item label="诊疗费" :styles="{padding:'30rpx',paddingLeft:0}" textStyle="font-size:30rpx;color:#333">
        <view class="flex_1 text-right"><text class="colorred">{{docInfo.scheduleLists[0].noType=='普通'?docInfo.scheduleLists[0].regFee: docInfo.scheduleLists[0].expertFee}}元</text></view>
      </app-list-item>
    </app-card>
    <app-card styles="padding: 0;padding-left:30rpx;">
      <app-list-item label="就诊人" :styles="{padding:'30rpx',paddingLeft:0}" textStyle="font-size:30rpx;color:#333">
        <view class="flex_1">
          <select-patient textStyle="color:#666;" @patientLoad="changePatient"></select-patient>
        </view>
      </app-list-item>
      <app-list-item label="号源类型" :styles="{padding:'30rpx',paddingLeft:0}" textStyle="font-size:30rpx;color:#333">
        <view class="flex_1 text-right color666">{{docInfo.scheduleLists[0].noType}}<text class="colorred"></text></view>
      </app-list-item>
    </app-card>
    <!-- 预约时段 -->
    <view class="mt-20 box-shadow" style="overflow: hidden;">
      <OrderTime :active="activeDate" @selectDay="showCurrentDate"></OrderTime>
      <view class="orderTimeBox">
        <view :class="[shiftIndex == index ? 'timePart activeBackground' : 'timePart']" v-for="(item, index) in orderTimeList"
          :key="index" @click="changeDate(item,index)">
          <view>
            <view class="date">{{activeDate}}（{{week[dayjs(activeDate).format('d')]}}）</view>
            <view>{{item.shiftName}} {{item.beginTime}}-{{item.endTime}}</view>
          </view>
          <!-- <view>{{ item.time }}</view> -->
          <view :class="item.leaveNo == 0?'full num':'num'">
            {{ item.leaveNo == 0 ? '已约满' : `剩余：${item.leaveNo}`}}
          </view>
        </view>
        <view style="padding-top: 200rpx;" v-if="orderTimeList.length == 0">
          <NoData styles="margin-top:0;"></NoData>
        </view>


      </view>
    </view>
    <!-- 确认预约 -->
    <button class="submit_btn" type="primary" @click="showPopup">确认预约</button>
    <uni-popup ref="notice">
      <view class="dialog-content">
        <view class="dialogTitle">{{ghNotice.title}}</view>
        <scroll-view class="textBox" :scroll-y="true">
          <!-- <view class="title">{{ghNotice.title}}</view> -->
          <view class="text" v-html="ghNotice.content">
          </view>
        </scroll-view>
        <view class="noticeBtn" @click="toPay">我已了解</view>
      </view>
    </uni-popup>

    <!-- 支付列表 -->
    <popup-pay ref="pay" :type="true" @success="paysuccess" @payTap="orderPay"></popup-pay>
  </view>
</template>
<script>
  import OrderTime from '../components/OrderTime.vue'
  import NoData from '../components/NoData'
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
  import selectPatient from '../components/selectPatient.vue'
  import popPay from '../components/pop-pay/index.vue'
  import dayjs from 'dayjs'
  import {
    getReverseDocInfo,
    saveAppointment,
    getDocFsInfo,
    getDeptDetail
  } from '@/common/request/doctorAppointment'
  import {
    submitAppointment
  } from '@/common/request/userAppointment.js'
  import {
    getTjIns
  } from '../api/physical.js'
  export default {
    components: {
      OrderTime,
      NoData,
      AppCard,
      AppListItem,
      selectPatient,
      popPay
    },
    data() {
      return {
        docId: '',
        deptId: '',
        orgName: '',
        isgoodAt: false,
        perId: '', // 就诊人id
        patientName: '',
        patientCard: '',
        ispay: false,
        week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        docInfo: {},
        adtiveOrderTime: {}, //选中时段
        activeDate: dayjs().format('YYYY-MM-DD'),
        payType: '1',
        // 预约时间段列表
        orderTimeList: [],
        shiftIndex: null,
        ghNotice: {},
        orgId:'',
        deptInfo:{}
      }
    },
    onLoad(option) {
      if (option) {
        this.docId = option.docId
        this.deptId = option.deptId
        this.orgId = option.orgId
        this.activeDate = option.date || dayjs().format('YYYY-MM-DD')
        this.getdeptInfo()
        this.getdoctorIntro()
        this.getDocFsInfoData()
      }
      this.getTjInsInfo()

    },
    methods: {
      dayjs,
      changePatient(item) {
        this.perId = item.memberId
        this.patientCard = item.patientCard
        this.patientName = item.name
      },
      //挂号须知
      async getTjInsInfo() {
        this.ghNotice = await getTjIns({
          type: 0
        })
      },
      //获取科室详情
      async getdeptInfo() {
        this.deptInfo = await getDeptDetail({
          deptId: this.deptId,
          orgId:this.orgId
        })
      },
      // 获取医生详情
      async getdoctorIntro() {
        let list = await getReverseDocInfo({
          orgId: this.orgId,
          deptId: this.deptId,
          beginDate: this.activeDate,
          endDate: this.activeDate,
          doctorId: this.docId,
          resource: 2
        })
        this.docInfo = list[0]
        console.log(this.docInfo)
      },
      // 获取时间段
      async getDocFsInfoData() {
        this.adtiveOrderTime = {}
        this.shiftIndex = null
        let list = await getDocFsInfo({
          deptId: this.deptId,
          orgId: this.orgId,
          doctorId: this.docId,
          visitDate: this.activeDate
        })
        list.forEach((item, index) => {
          if (parseInt(item.leaveNo) > 0) {
            if (JSON.stringify(this.adtiveOrderTime) == '{}') {
              this.adtiveOrderTime = item
              this.shiftIndex = index
              return
            }
          }
        })
        this.orderTimeList = list
      },
      orderPay(e) {
        //确认支付
        let that = this
        saveAppointment({
          deptId: this.deptId,
          deptName: this.deptInfo.deptName,
          orgId: this.orgId,
          doctorId: this.docId,
          doctorName: this.docInfo.docName,
          doctorTitle:this.docInfo.docTitle,
          orgName: this.deptInfo.orgName,
          memberId: this.perId,
          patientName: this.patientName,
          userId: uni.getStorageSync('userId'),
          diagnoseNo: this.patientCard,
          resourceNo: this.docInfo.scheduleLists[0].noType,
          visitDate: this.activeDate,
          startTime: this.adtiveOrderTime.beginTime,
          endTime: this.adtiveOrderTime.endTime,
          fee: this.docInfo.scheduleLists[0].noType == '普通' ? this.docInfo.scheduleLists[0].regFee : this.docInfo.scheduleLists[
            0].expertFee,
          creator: uni.getStorageSync('userId'),
          numberCode: this.docInfo.scheduleLists[0].scheduleNo,
          scheduleNo: this.docInfo.scheduleLists[0].scheduleNo,
          shiftCode: this.adtiveOrderTime.shiftName,
          periodNo: this.adtiveOrderTime.periodNo,
          origin: 2, //来源 1-医生 2-患者
          resource: 2
        }).then(async res => {
          const params = {
            userId: uni.getStorageSync('userId'),
            bizId: res,
            bizType: 'RESERVE',
            agreement: true,
          }
          const data = await submitAppointment(params)
          if(data){
            if(data.tradeId && data.tradeType){
              this.$refs.pay.payTypeC(data.tradeId, data.tradeType)
            }else{
              if(data.orderId){
                this.$refs.pay.close()
                uni.showToast({
                  title:'支付成功！'
                })
                setTimeout(()=>{this.paysuccess()}, 3000);

              }
            }
          }
        })

      },
      changeDate(item, index) {
        if (item.leaveNo == 0) {
          uni.showToast({
            title: '该时间段已预约满',
            icon: 'none'
          })
          return false
        }
        this.shiftIndex = index
        this.adtiveOrderTime = item
      },
      // 弹出层
      showPopup() {
        if (!this.adtiveOrderTime.leaveNo) {
          uni.showToast({
            title: '请选择预约时段',
            icon: 'none'
          })
          return
        }
        if (this.adtiveOrderTime.leaveNo == 0) {
          uni.showToast({
            title: '该时间段已预约满',
            icon: 'none'
          })
          return
        }
        this.$refs.notice.open()
      },
      toPay() {
        this.$refs.notice.close()
        this.$refs.pay.show()
      },

      // 展示当前选中日期 title
      showCurrentDate(date) {
        this.activeDate = date.date
        this.getdoctorIntro()
        this.getDocFsInfoData()
      },
      paysuccess() {
        uni.redirectTo({
          url: '/pages-zy/myAppointment/list?state=2'
        });
      }
    },
  }
</script>
<style scoped lang="scss">
  @import '~@/common/order.scss';

  .docBox {
    padding: 30rpx 0 30rpx 0;
    background: #fff;
    margin-bottom: 20rpx;

    .icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
    }

    .docInfo {
      padding: 0 30rpx;
      margin-bottom: 20rpx;
    }

    .info {
      background: #fff;
      margin-left: 30rpx;

      .infoText {
        flex: 1;
        line-height: 50rpx;
        font-size: 28rpx;
        color: #373737;

        .docName {
          span {
            font-size: 32rpx;
            color: #333333;
            margin-right: 30rpx;
          }
        }
      }
    }

    .openbtn {
      color: $uni-color-primary;
      width: 100%;
      font-size: 24rpx;
    }

    .border_b {
      border-bottom: 1px solid #E6E6E6;
    }
  }

  .goodAt {
    margin-bottom: 20rpx;
    padding-left: 30rpx;


    .title {
      font-size: 30rpx;
      border-left: 4rpx solid #0ab2c1;
      line-height: 30rpx;
      padding-left: 10rpx;
      color: #333;
      font-weight: bold;
    }

    .content {
      font-size: 26rpx;
      color: #666;
      line-height: 38rpx;
      margin: 30rpx 0;
    }
  }

  .priceBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 75rpx;
    padding: 0 20rpx;
    background: #fff;
    font-size: 28rpx;
    margin-bottom: 15rpx;

    .priceName {
      color: #646464;
    }

    .priceNum {
      color: #ff4500;
    }
  }

  .changeDate {
    padding: 20rpx;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #e9eff4;

    .showDate {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(100, 100, 100, 1);
    }

    img {
      width: 20rpx;
      height: 10rpx;
    }
  }

  .orderTimeBox {
    padding: 30rpx;
    background: #fff;
    padding-top: 0;

    .timePart {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 20rpx;
      color: #666;
      font-size: 24rpx;
      background: #F1F1F1;

      .date {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }

      .num {
        font-size: 30rpx;
        color: #333;
      }

      .full {
        color: #999;
      }
    }

    .activeBackground {
      background: $uni-color-primary;
      color: #fff;

      .date {
        color: #fff;
      }

      .num {
        color: #fff;
      }
    }
  }

  .zhifu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 75rpx;
    padding: 0 20rpx;
    background: #fff;
    font-size: 28rpx;
    margin-bottom: 15rpx;

    .zhifuTitle {
      position: relative;
      margin-left: 15rpx;

      span {
        position: absolute;
        top: 0;
        left: -15rpx;
        color: #ff4500;
        font-size: 28rpx;
      }
    }

    .zhifuNameBox {
      width: 300rpx;
      height: 75rpx;
      line-height: 75rpx;
      font-weight: 600 !important;
    }
  }


  .dialog-content {
    padding: 45rpx 0;
    width: 600rpx;
    background: #fff;
    border-radius: 30rpx;
    padding-bottom: 0;

    .dialogTitle {
      font-size: 32rpx;
      color: #1A1A1A;
      text-align: center;
      font-weight: bold;
    }

    .textBox {
      font-size: 26rpx;
      line-height: 42rpx;
      color: #666;
      height: 600rpx;
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
      }
    }

    .noticeBtn {
      width: 100%;
      height: 88rpx;
      border-top: 1rpx solid #e9eff4;
      line-height: 88rpx;
      text-align: center;
      color: $uni-color-primary;
    }
  }
</style>
