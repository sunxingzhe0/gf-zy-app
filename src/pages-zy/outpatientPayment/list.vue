<template>
  <view :style="{paddingTop:'170rpx',paddingBottom:current==0?'120rpx':'20rpx'}">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
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
    <view style="padding: 20rpx;">
      <!--待支付-->
      <template v-if="current ==0">
        <checkbox-group @change="checkboxChange">
          <view class="toPayBox box-shadow flex-start-center" v-for="(item, index) in waitPayList" :key="index">
            <checkbox class="checkbox" style="transform: scale(0.8);" color="#0ab2c1" :value="item.prescNo" :checked="item.checked" />
            <view class="contentBox flex-between" @click="goto(`/pages-zy/outpatientPayment/detail?patientId=${perId}&type=${current}&billNo=${item.payInfo.billNo}&visitNo=${item.visitNo}&title=${item.title}`)">
              <view class="content">
                <view class="contentTitle flex-start-center">
                  <view class="payTitle">{{ item.title }}</view>
                  <view class="category flex-start-center">
                    <view class="category-divactive">{{ item.deptName }}</view>
                    <!-- <view class="normal">普通</view> -->
                  </view>
                </view>
                <view class="createTime">创建时间：{{ item.prescDtime }}</view>
              </view>
              <view class="text-right">
                <view class="font32 font-weight">￥{{parseFloat(item.money).toFixed(2)}}</view>
                <view class="font28 color666 mt-10">x{{item.itemNum}}</view>
              </view>
            </view>
          </view>

        </checkbox-group>
        <noData v-if="waitPayList.length  == 0"></noData>
        <!-- 合计 -->
        <view class="fiexdBtn flex-between font30" v-if="waitPayList.length > 0 && current == 0">
          <checkbox-group style="width: auto;" @change="allCheckboxChange">
            <label>
              <checkbox style="transform: scale(0.8);" class="checkbox" color="#0ab2c1" value="isAll" :checked="isAll" />全选
            </label>
          </checkbox-group>
          <view class="heji font30" v-if="alltotal>0">
            <text>合计：</text>
            <text class="colorred font-weight">￥{{alltotal}}</text>
          </view>
          <view v-if="checkedList.length > 0" class="payBtn" @click="payTap">
            支付
          </view>
          <view v-else class="payBtn disabled">
            支付
          </view>
        </view>
      </template>
      <!--已完成、已退费-->
      <template v-if="current == 1 || current ==2">
        <view class="finishList box-shadow toPayBox" v-for="(item, index) in current==1?payList:refundList" :key="index"
          @click="goto(`/pages-zy/outpatientPayment/detail?patientId=${perId}&type=${current}&billNo=${item.prescNo}&visitNo=${item.visitNo}&title=${item.title}`)">
          <view class="listTitle">
            <view class="num">支付号：{{ item.prescNo }}</view>
            <view class="payMode">{{ item.payWay }}</view>
          </view>
          <view class="contentBox flex-between mt-20">
            <view class="content">
              <view class="contentTitle flex-start-center">
                <view class="payTitle">{{ item.title }}</view>
                <view class="category flex-start-center">
                  <view class="category-divactive">{{ item.deptName }}</view>
                  <!-- <view class="normal">普通</view> -->
                </view>
              </view>
              <view class="createTime">创建时间：{{ item.time }}</view>
              <view class="createTime">{{current ==3?'退费':'缴费' }}时间：{{ item.visitDate }}</view>
            </view>
            <view class="text-right">
              <view class="font32 font-weight">￥{{parseFloat(item.totalAmount).toFixed(2)}}</view>
              <view class="font28 color666 mt-10">x{{item.itemNum}}</view>
            </view>
          </view>

        </view>
        <noData v-if="current==1?payList.length==0:refundList.length==0"></noData>
      </template>
    </view>
    <!-- 支付列表 -->
    <pop-pay ref="pay" :type="true" @success="topbarChange(current)" @payTap="paySubmit"></pop-pay>
  </view>
</template>

<script>
  import AppListItem from '@/components/app/app-list-item'
  import selectPatient from '../components/selectPatient.vue'
  import popPay from '../components/pop-pay/index.vue'
  import noData from '../components/NoData.vue'
  import {
    mzRpWaitPayData,
    mzRpPaydData,
    mzRpRefundData,
    mzPayment,
    payCancel,
    payNotify
  } from '../api/outpatient.js'
  export default {
    components: {
      selectPatient,
      AppListItem,
      popPay,
      noData
    },
    data() {
      return {
        tabs: [{
            title: '待支付',
            key: 0,
            num: 0
          },
          {
            title: '已完成',
            key: 1,
            num: 0
          },
          {
            title: '已退费',
            key: 2,
            num: 0
          },
        ],
        current: 0,
        waitPayList: [],
        payList: [], //已完成
        refundList: [], // 已退费
        isAll: false,
        perId: '',
        isPay:true
      }
    },
    computed: {
      alltotal() {
        let allnum = 0
        this.waitPayList.forEach(item => {
          if (item.checked) {
            allnum = (parseFloat(allnum) + parseFloat(item.money)).toFixed(2)
          }
        })
        return allnum
      },
      checkedList() {
        return this.waitPayList.filter(({ checked }) => checked).map(({ payInfo }) => payInfo)
      },
    },
    onShow() {
      if(this.perId){
        this.topbarChange(this.current)
      }
    },
    methods: {
      billType(type) {
        if (type == 'GH') {
          return '预约挂号'
        } else if (type == 'MZ') {
          return '门诊缴费'
        } else if (type == 'ZY') {
          return '住院充值'
        } else if (type == 'TJ') {
          return '体检预约'
        }
      },
      //获取待支付
      async getmzRpWaitPayData() {
        let data = {}
        if (this.isCode) {
          data.cardId = this.$route.query.cardId || null
        } else {
          data.patientId = this.perId
        }
        this.waitPayList = await mzRpWaitPayData(data)
        this.tabs[0].num = this.waitPayList.length

      },
      // 已完成
      async getmzRpPaydData() {
        this.payList = await mzRpPaydData({
          patientId: this.perId
        })
        this.tabs[1].num = this.payList.length
      },
      // 已退费
      async getmzRpRefundData() {
        this.refundList = await mzRpRefundData({
          patientId: this.perId
        })
        this.tabs[2].num = this.refundList.length
      },
      payTap() {
        if (this.checkedList.length > 0) {
          this.$refs.pay.show()
        }
      },
      paySubmit(e) {
        //确认支付

        let that = this
        let data = {
          payment: e,
          items: this.waitPayList.filter(item => item.checked).map(ite => ite.payInfo),
          payCard: '',
        }
        if (this.isCode) {
          data.cardId = this.cardId
          data.name = this.name
        } else {
          data.patientId = this.perId
        }
        this.info = data
        if(this.isPay){
          this.isPay = false
          mzPayment(data)
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
      goto(url) {
        uni.navigateTo({
          url: url
        })
      },
      //全选
      allCheckboxChange(e) {
        console.log(e)
        if (e.detail.value.length == 0) {
          this.waitPayList.map(item => this.$set(item, 'checked', false))
          this.isAll = false
        } else {
          this.waitPayList.map(item => this.$set(item, 'checked', true))
          this.isAll = true
        }
      },
      checkboxChange(e) {
        let items = this.waitPayList,
          values = e.detail.value;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          if (values.includes(item.prescNo)) {
            this.$set(item, 'checked', true)
          } else {
            this.$set(item, 'checked', false)
          }
        }
        console.log(this.waitPayList)
        //  商品是否全部勾选，判断全选与否状态
        let offCarArr = []
        let allChecks = items.every(item => item.checked == true)
        console.log(allChecks)
        if (allChecks) {
          this.isAll = true
        } else {
          this.isAll = false
        }

      },
      topbarChange(state) {
        this.current = state
        this.getmzRpWaitPayData()
        this.getmzRpPaydData()
        this.getmzRpRefundData()
      },
      changePatient(item) {
        this.perId = item.memberId
        this.topbarChange(this.current)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/common/order.scss';

  .toPayBox {
    background: #fff;
    margin-bottom: 20rpx;
    padding: 30rpx 20rpx;

    .contentBox {
      flex: 1;
      margin-left: 20rpx;

      .content {
        .contentTitle {
          margin-bottom: 15rpx;

          .payTitle {
            font-size: 33rpx;
            color: #333333;
            font-weight: 400;
            margin-right: 25rpx;
          }

          .category {
            font-size: 22rpx;
            color: $uni-color-primary;

            .category-divactive {
              background: $uni-color-primary;
              color: #fff;
              padding: 0 10rpx;
              border: 1rpx solid $uni-color-primary;
              border-radius: 4rpx 0 0 4rpx;
            }

            .normal {
              padding: 0 10rpx;
              border: 1rpx solid $uni-color-primary;
              border-radius: 0 4rpx 4rpx 0;
            }
          }
        }

        .createTime {
          width: 417rpx;
          font-size: 28rpx;
          color: #646464;
        }
      }

      .price {
        font-size: 32rpx;
        color: #333333;
        text-align: right;
      }
    }
  }

  .total {
    background: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 20rpx;

    .quanxuan {
      width: 200rpx;
      height: 44rpx !important;
      margin: 0 !important;

      .van-checkbox__label {
        font-size: 32rpx !important;
        color: #333333 !important;
        font-weight: 400 !important;
      }
    }

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
      height: 60rpx;
      width: 160rpx;
      background: $uni-color-primary;
      line-height: 60rpx;
      text-align: center;
      border-radius: 30rpx;
      color: #fff;
      font-size: 32rpx;

      &.disabled {
        opacity: 0.5;
      }
    }
  }


  .finishList {
    padding: 0 0 20rpx 20rpx;
    margin: 0 auto;
    width: 95%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 12rpx;
    margin-bottom: 18rpx;

    .contentBox {
      margin-left: 0;
      padding-right: 20rpx;
    }

    .listTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13rpx 0;
      border-bottom: 1px solid #e9eff4;

      .num,
      span {
        color: #646464;
        font-size: 28rpx;
      }

      .payMode {
        background: rgba(10, 178, 193, 0.1);
        color: #0ab2c1;
        border-radius: 5rpx;
        font-size: 24rpx;
        text-align: center;
        font-weight: 600;
        padding: 5rpx 10rpx;
      }
    }
  }
</style>
