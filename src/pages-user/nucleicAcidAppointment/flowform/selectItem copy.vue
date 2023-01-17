<template>
  <view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <app-card styles="padding:20rpx 0">
      <view class="titleH1">选择项目</view>
      <checkbox-group @change="checkboxChange">
        <view
          class="toPayBox"
          v-for="(item, index) in waitPayList"
          :key="index"
        >
          <view class="flex-start-center borderBt">
            <checkbox
              class="checkbox"
              style="transform: scale(0.8);"
              color="#0ab2c1"
              :value="item.id"
              :checked="item.checked"
            />
            <view class="payTitle flex_1">{{ item.title }}</view>
            <view class="price"
              >￥{{
                timesInfo.price ? parseFloat(timesInfo.price).toFixed(2) : '-'
              }}</view
            >
          </view>

          <view class="contentBox">
            <view
              :class="d.alldate == info.date ? 'dateItem active' : 'dateItem'"
              v-for="(d, t) in dateList"
              :key="t"
              @click="dateTap(d)"
            >
              <text>{{ d.week }}</text>
              <text>{{ d.date }}</text>
            </view>
          </view>
          <view class="timeWrap">
            <NoData v-if="timesInfo.docFsInfoList.length === 0" />
            <view
              v-else
              @click="timeTap"
              :class="'flex-between timeItem active'"
            >
              <view>
                <view>{{
                  timesInfo.docFsInfoList
                    ? timesInfo.docFsInfoList[0].shiftName
                    : ''
                }}</view>
                <view>{{
                  timesInfo.docFsInfoList
                    ? `${timesInfo.docFsInfoList[0].beginTime} - ${timesInfo.docFsInfoList[0].endTime}`
                    : ''
                }}</view>
              </view>
              <view
                :class="timesInfo.docFsInfoList.length == 0 ? 'full' : ''"
                >{{
                  timesInfo.docFsInfoList.length == 0
                    ? '约满'
                    : `剩余${timesInfo.docFsInfoList.length || ''}`
                }}</view
              >
            </view>
          </view>
        </view>
      </checkbox-group>
      <!-- 合计 -->
    </app-card>
    <view class="fiexdBtn flex-between font30">
      <checkbox-group style="width: auto;" @change="allCheckboxChange">
        <label>
          <checkbox
            style="transform: scale(0.8);"
            class="checkbox"
            color="#0ab2c1"
            value="isAll"
            :checked="isAll"
          />全选
        </label>
      </checkbox-group>
      <view class="heji" v-if="alltotal > 0">
        <text>合计：</text>
        <text class="price">￥{{ alltotal }}</text>
      </view>
      <view class="payBtn" @click="payTap">
        提交
      </view>
    </view>
    <!--提示-->
    <pop-notice
      ref="notice"
      title="新型冠状病毒核酸检测知情同意书"
      :content="noticeContent"
      btnText="同意"
      @isOk="toPay"
    >
      <view class="no" @click="$refs.notice.close()">不同意</view>
    </pop-notice>
    <!--选择支付方式-->
    <popup-pay
      ref="pay"
      :type="true"
      @success="paySuccess"
      @payTap="orderPay"
      @cancel="payCancel"
    ></popup-pay>
  </view>
</template>

<script>
import appCard from '@/components/app/app-card'
import dayjs from 'dayjs'
import {
  userNucleateReg,
  findRegNum,
  submitAppointment,
  getNucleateDept,
  getPriceAndTime,
} from '../api/index'
import NoData from '@/pages-user/components/NoData'
import popNotice from '../components/pop-notice.vue'
export default {
  components: {
    appCard,
    popNotice,
    NoData,
  },
  data() {
    return {
      isClick: true,
      deptId: '',
      timesInfo: {},
      waitPayList: [
        {
          id: '1',
          title: '（自费）新冠病毒核酸检测',
          morningNum: 29,
          afternoonNum: 70,
          price: '80.00',
          checkedDate: '',
          checkedTime: '',
          checked: false,
        },
      ],
      payList: null, //已完成
      isAll: false,
      isPay: true,
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dateList: [],
      info: {
        ...JSON.parse(uni.getStorageSync('memberInfo')),
        orderItem: '',
        date: '',
        timeName: '',
        rangeTime: '',
      },
      noticeContent:
        '<p>请您务必仔细阅读以下内容:</p><p>◆体检人员必须如实填写个人信息和流行病学史调查问卷，如有隐瞒需承担相应的法律责任。</p><p>◆如有以下情况不得使用新型冠状病毒核酸检测自助服务并请向我院咨询，听从医务人员指引。</p><p>1、发热(T≥37.3)和/或有呼吸道症状;</p><p>2、14天内有境外和国内中高风险地区旅居史;</p><p>(疫情中高风险地区填写时以政府部门公布为准)</p><p>3、有其他流行病学史(包括高风险国家人员接触史、疫区发热或有呼吸道症状患者接触史、确诊病例/疑似病例/无症状感染者接触史、聚集性发病史)人员;</p><p>◆此次新型冠状病毒核酸检测费用为自费全额支付，不享受公医、医保等其它记账、减免待遇。</p><p>◆咨询电话：<br/>客服中心：023-63692253<br/>咨询时间：<br/>周一至周六上午9:00-11:30；下午14:30-17:00',
    }
  },
  computed: {
    alltotal() {
      let allnum = 0
      this.waitPayList.forEach(item => {
        if (item.checked) {
          allnum = (
            parseFloat(allnum) + parseFloat(this.timesInfo.price)
          ).toFixed(2)
        }
      })
      return allnum
    },
  },
  async onLoad(option) {
    this.getdate()
    this.$set(this.info, 'date', dayjs().format('YYYY-MM-DD'))

    await this.getNucleateDept()
    this.getPriceAndTime(dayjs().format('YYYY-MM-DD'))
  },
  onShow() {},
  methods: {
    //获取日期列表
    getdate() {
      let data = []
      for (let i = 0; i < 10; i++) {
        let fulldate = dayjs().add(i, 'day')
        data.push({
          date: fulldate.format('MM-DD'),
          alldate: fulldate.format('YYYY-MM-DD'),
          week:
            fulldate.format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')
              ? '当天'
              : fulldate.format('YYYY-MM-DD') ==
                dayjs()
                  .add(1, 'day')
                  .format('YYYY-MM-DD')
              ? '明天'
              : this.week[fulldate.day()],
        })
      }
      console.log(data)
      this.dateList = data
    },

    //获取科室
    async getNucleateDept() {
      const res = await getNucleateDept()
      console.log(res, '科室--------------')
      this.deptId = res.deptCode
    },

    //获取当日排班
    async getPriceAndTime(time) {
      uni.showLoading()
      this.timesInfo = await getPriceAndTime({
        regDate: time,
        deptId: this.deptId || '',
      })
      uni.hideLoading()
      this.waitPayList[0].checked = false
      this.isAll = false
      //随机取一号
      const activeIndex =
        Math.floor(Math.random() * this.timesInfo.docFsInfoList.length) || 0
      Object.assign(this.info, {
        timeName: this.timesInfo.docFsInfoList[activeIndex].shiftName,
        rangeTime:
          this.timesInfo.docFsInfoList[activeIndex].beginTime +
          '-' +
          this.timesInfo.docFsInfoList[activeIndex].endTime,
        scheduleNo: this.timesInfo.docFsInfoList[activeIndex].scheduleNo,
        shiftCode: this.timesInfo.docFsInfoList[activeIndex].shiftCode,
        periodNo: this.timesInfo.docFsInfoList[activeIndex].periodNo,
        numberCode: this.timesInfo.numberCode,
        price: this.timesInfo.price,
      })
      console.log(this.info, '随机取一号源')
    },

    //选择日期
    dateTap(item) {
      this.info.date = item.alldate
      this.getPriceAndTime(item.alldate)
    },

    //选择当日排班
    timeTap() {},

    toPay() {
      this.$refs.notice.close()
      this.$refs.pay.show()
    },

    /***
     *订单支付
     */
    async orderPay() {
      let res = await userNucleateReg(this.info)

      if (!this.isClick) {
        return uni.showToast({ title: '请勿重复点击', icon: 'none' })
      }
      this.isClick = false
      submitAppointment({
        userId: uni.getStorageSync('userId'),
        bizId: res,
        bizType: 'NUCLEATE',
        agreement: true,
      }).then(order => {
        this.isClick = true
        if (!order) return
        if (!order.isPay) {
          this.$refs.pay.payTypeC(order.tradeId, order.tradeType, order.payFee)
        }
      })
    },
    paySuccess(value) {
      console.log('支付成功-------------')
      uni.showToast({
        title: '支付成功',
        icon: 'none',
      })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages-user/nucleicAcidAppointment/record/index',
        })
      }, 1000)
    },
    payCancel(value) {},
    payTap() {
      if (this.timesInfo.docFsInfoList.length === 0) {
        uni.showToast({
          title: '当前时段无排班，请选择其他时段',
          icon: 'none',
        })
        return
      }
      let checked = this.waitPayList.filter(item => item.checked)
      if (checked.length == 0) {
        uni.showToast({
          title: '请选择项目',
          icon: 'none',
        })
        return false
      } else {
        this.info.orderItem = checked[0].title
      }
      if (this.info.timeName) {
        this.$refs.notice.open()
      }
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
        values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        const item = items[i]
        if (values.includes(item.id)) {
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
  },
}
</script>

<style lang="scss" scoped>
@import '~@/common/order.scss';
.titleH1 {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  padding-left: 20rpx;
}
.borderBt {
  border-bottom: 1px solid #e6e6e6;
  padding: 20rpx;
}
.price {
  color: $uni-color-primary;
}
.toPayBox {
  background: #fff;
  margin-bottom: 20rpx;

  .contentBox {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 20rpx 10rpx;
    border-bottom: 1px solid #e6e6e6;
    .dateItem {
      width: 106rpx;
      height: 106rpx;
      margin: 15rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f2f2f2;
      justify-content: center;
      border-radius: 10rpx;
      &.active {
        color: $uni-color-primary;
        background: rgba(10, 178, 193, 0.1);
      }
    }
  }
}
.timeWrap {
  padding: 0 20rpx;
  .timeItem {
    background: #f2f2f2;
    padding: 20rpx;
    margin-top: 30rpx;
    border-radius: 10rpx;
    view {
      font-size: 24rpx;
      color: #333;
      &.full {
        color: #999999;
      }
    }
    &.active {
      background: rgba(10, 178, 193, 0.1);
      view {
        color: $uni-color-primary;
      }
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
.no {
  color: #666;
  width: 50%;
  text-align: center;
}
</style>
