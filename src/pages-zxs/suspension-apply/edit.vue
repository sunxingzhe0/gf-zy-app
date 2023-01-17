<template>
  <view class="suspension-edit">
    <view class="app-card">
      <uni-list>
        <uni-list-item
          clickable
          title="选择项目"
          :rightText="showItems"
          class="requird"
          @click="$refs.itemPop.open()"
        />
        <uni-list-item
          clickable
          title="停诊日期"
          :rightText="stopDate || '请选择'"
          class="requird"
          @click="openDate(0)"
        />
        <uni-list-item clickable title="停诊时段" class="requird">
          <template slot="right">
            <picker
              v-if="!timeType"
              @change="changeStopTime"
              :value="stopIndex"
              :range="stopTimes"
              range-key="valueTxt"
            >
              <view style="font-size: 24rpx;color: #999">{{
                stopTimes[stopIndex].startTime
                  ? `${stopTimes[stopIndex].startTime}-${stopTimes[stopIndex].endTime}`
                  : '请选择'
              }}</view>
            </picker>
          </template>
        </uni-list-item>

        <uni-list-item
          :clickable="false"
          title="就诊人"
          :rightText="patient"
          :show-switch="false"
        />
        <uni-list-item
          v-if="stopTimeItem.reservedVO"
          clickable
          title="顺延日期"
          :rightText="passDate || '请选择'"
          @click="openDate(1)"
        />
        <uni-list-item
          v-if="stopTimeItem.reservedVO"
          clickable
          title="顺延时段"
        >
          <template slot="right">
            <picker
              @change="changePassTime"
              :value="passIndex"
              :range="passTimes"
              range-key="valueTxt"
            >
              <view style="font-size: 24rpx;color: #999">{{
                passTimes[passIndex].startTime
                  ? `${passTimes[passIndex].startTime}-${passTimes[passIndex].endTime}`
                  : '请选择'
              }}</view>
            </picker>
          </template>
        </uni-list-item>
      </uni-list>
      <view>
        <view class="lable-txt">停诊原因</view>
        <view class="stop-reason">
          <uni-easyinput
            type="textarea"
            v-model="applyRemark"
            placeholder="请输入停诊原因"
          />
        </view>
      </view>
      <view class="footer">
        <view type="primary" class="submit_btn" @click="submitOrder">提交</view>
      </view>
    </view>

    <!-- 项目选择 -->
    <uni-popup ref="itemPop" type="bottom">
      <view class="pop-view">
        <view class="title">选择项目</view>
        <picker-view
          :indicator-style="indicatorStyle"
          :value="itemVal"
          @change="changeItems"
          style="height: 200px; text-align: center"
        >
          <picker-view-column>
            <view
              v-for="(v, i) in itenNames"
              :key="i"
              style="line-height: 80rpx; font-size: 32rpx"
              >{{ `${userInfo.username}｜${v.itemName}｜¥${v.price}` }}</view
            >
          </picker-view-column>
        </picker-view>
        <view @click="chooseItem" class="confirm">确认</view>
      </view>
    </uni-popup>
    <!-- 日历  -->
    <uni-calendar
      :date="selectDate"
      :insert="false"
      :showMonth="false"
      :isDisableAll="true"
      :optional="optional"
      ref="date"
      @confirm="confirmCalendar"
    />
  </view>
</template>
<script>
import popSelectDate from '@/pages-zxs/components/pop-select-date/index'
import uniEasyinput from '@/pages-zxs/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput'
import {
  myWorkSchedule,
  getScheduleListByDeptDoctorPeriod,
  stopApply,
} from '@/pages-zxs/api/closeApply'
import dayjs from 'dayjs'
export default {
  components: { popSelectDate, uniEasyinput },
  data() {
    return {
      listData: [], //工作日程s
      nameFilterList: [], //项目名筛选的工作日程
      canPassTimeList: [], //可延诊工作日程
      selectValue: {}, //选中项目
      itemVal: [0],
      selectItem: 0,
      itenNames: [], //工作日程项目名s

      selectDate: dayjs().format('YYYY-MM-DD'), //日历显示选中时间(默认今日)
      statusType: 0, //日历打开状态（0停诊1延诊）
      optional: [], //可选日期
      stopDate: '', //停诊日期
      passDate: '', //延诊日期

      timeType: 0, //时段显示状态（0停诊时段1延诊时段）
      stopTimeTxt: '', //停诊时段显示文字
      passTimeTxt: '', //延诊时段显示文字
      stopIndex: 0, //停诊时段选中下标
      passIndex: 0, //延诊时段选中下标
      stopTimeItem: {}, //停诊item
      passTimeItem: {}, //延诊item
      stopTimes: [], //停诊时段可选项
      passTimes: [], //延诊时

      applyRemark: '',

      indicatorStyle: `height: 80rpx;`,
    }
  },
  onLoad() {
    this.getList()
  },
  computed: {
    patient() {
      if (!this.stopTimeItem.reservedVO) return '-'
      const info = this.stopTimeItem.reservedVO
      return `[${info.cardNo}]${info.patientName}｜${info.sex ? '男' : '女'}｜${
        info.phone
      }`
    },
    userInfo() {
      return uni.getStorageSync('userInfo')
    },
    showItems() {
      if (!this.selectValue.itemName) return '请选择'
      return `${this.userInfo.username}｜${this.selectValue.itemName}｜${this.selectValue.price}`
    },
  },
  methods: {
    /* ------------------ */
    //打开日历
    openDate(status) {
      this.statusType = status
      if (this.stopDate || this.passDate) {
        //回显赋值
        this.selectDate = !status ? this.stopDate : this.passDate
      }
      this.filterList()
      setTimeout(() => {
        this.$refs.date.open()
      })
    },
    //选中日历日期
    confirmCalendar(e) {
      if (!this.optional.includes(e.fulldate)) return //选中日期不在可选项之内
      //
      this.selectDate = e.fulldate
      if (!this.statusType) {
        //选中停诊日期
        this.stopDate = e.fulldate
        this.filterTimes()
      } else {
        //选中延诊日期
        this.passDate = e.fulldate
        this.filterTimes()
      }
    },
    /* ----------------- */

    //选择停诊时段
    changeStopTime(e) {
      this.stopTimeItem = this.stopTimes[e.detail.value]
      this.stopIndex = e.detail.value
      if (this.stopTimeItem.reservedVO) {
        //reservedVo为是否有预约患者
        this.getPostDateList()
      }
    },
    //选择延诊时段
    changePassTime(e) {
      this.passTimeItem = this.passTimes[e.detail.value]
    },
    // 项目改变
    changeItems(e) {
      this.selectItem = e.detail.value[0]
    },
    // 选择项目
    chooseItem() {
      this.itemVal = [this.selectItem]
      this.selectValue = this.itenNames[this.selectItem]
      //筛选条件：1.选择的同项目 2.时间未过期 3.非已停诊 4.如果有预约患者，预约患者接诊状态只能为待接诊的
      this.nameFilterList = this.listData.filter(
        v =>
          v.itemName === this.selectValue.itemName &&
          dayjs() < dayjs(v.scheduleDate + ' ' + v.endTime) &&
          v.stopStatus == 1 &&
          (!v.reservedVO || (v.reservedVO && v.reservedVO.visitState == 1)),
      ) //同名项目时段 且非过时的数据
      this.filterList()
      this.$refs.itemPop.close()
    },
    //日历可选项
    filterList() {
      this.optional = !this.statusType
        ? [...new Set(this.nameFilterList.map(v => v.scheduleDate))]
        : [...new Set(this.canPassTimeList.map(v => v.scheduleDate))]
    },
    //筛选时段可选项
    filterTimes() {
      if (!this.statusType) {
        //筛选停诊时段可选项
        this.stopTimes = this.nameFilterList
          .filter(v => v.scheduleDate == this.stopDate)
          .map(v =>
            Object.assign(v, { valueTxt: `${v.startTime}-${v.endTime}` }),
          )
        this.stopTimes && (this.stopTimeItem = this.stopTimes[0]) //默认选择第一项(选中停诊时段时需要请求延诊日期)
        this.getPostDateList()

        return
      }
      //筛选延诊时段可选项
      this.passTimes = this.canPassTimeList
        .filter(v => v.scheduleDate == this.passDate)
        .map(v => Object.assign(v, { valueTxt: `${v.startTime}-${v.endTime}` }))
      this.stopTimes && (this.passTimeItem = this.passTimes[0]) //默认选择第一项
    },

    async getList() {
      const res = await myWorkSchedule()
      //医生工作日程
      this.listData = res.reduce((pre, next) => {
        next?.scheduleDetailList?.forEach(v => pre.push(v))
        return pre
      }, [])
      const keys = []
      //去重（项目名）
      this.itenNames = this.listData.reduce((pre, next) => {
        if (!keys.includes(next.itemName)) {
          keys.push(next.itemName)
          pre.push(next)
        }
        return pre
      }, [])
    },
    //提交申请
    async submitOrder() {
      const params = {
        applyRemark: this.applyRemark,
        memberId: this.stopTimeItem?.reservedVO?.memberId || '',
        patientId: this.stopTimeItem?.reservedVO?.patientId || '',
        scheduleId: this.stopTimeItem?.id || '',
        newScheduleId: this.passTimeItem.id || '', //延诊id
      }
      console.log(params, '参数----')
      try {
        await stopApply(params)
        uni.showToast({
          title: '提交成功!',
          icon: 'none',
        })
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          })
        }, 1000)
      } catch (error) {
        uni.showToast({
          title: '网络连接超时，请稍后重试！',
          icon: 'none',
        })
      }
    },
    //获取顺延日期时间数据
    async getPostDateList() {
      const params = {
        deptId: this.stopTimeItem.deptId,
        doctorId: this.stopTimeItem.reservedVO.doctorId,
        itemId: this.stopTimeItem.itemId,
        startTime: this.stopTimeItem.startTime,
        endTime: this.stopTimeItem.endTime,
      }
      this.canPassTimeList = (
        await getScheduleListByDeptDoctorPeriod(params)
      ).filter(v => dayjs() < dayjs(v.scheduleDate + ' ' + v.endTime)) //查找同时段同医生的可延诊时间
      this.statusType = 1
      //日历可选项
      this.filterList()
    },
  },
}
</script>
<style lang="scss" scoped>
.suspension-edit {
  padding: 30rpx;
  .content-view {
    position: relative;
    height: 100vh;
    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      padding: 0 20rpx 20rpx;
      box-sizing: border-box;
      .btn {
        background: $uni-color-primary;
        border-radius: 46rpx;
        font-size: 30rpx;
      }
    }
  }
  .stop-reason {
    padding: 0 20rpx 30rpx 50rpx;
    box-sizing: border-box;
    border-radius: 0 0 20rpx 20rpx;
    background: #fff;
    margin-top: 30rpx;
  }
  ::v-deep .uni-list-item__content-title {
    position: relative;
    padding-left: 20rpx;
    &::before {
      content: '*';
      position: absolute;
      top: -6rpx;
      left: 0;
      color: transparent;
    }
    span {
      margin-left: 16rpx;
    }
  }
  .requird {
    ::v-deep .uni-list-item__content-title {
      position: relative;
      &::before {
        content: '*';
        position: absolute;
        top: -6rpx;
        left: 0;
        color: red;
      }
    }
  }
  ::v-deep .uni-list--border-bottom {
    height: 0;
  }
  .pop-view {
    position: relative;
    width: 100%;
    min-height: 700rpx;
    background: #fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    .title {
      font-size: 32rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
    }
    .confirm {
      position: absolute;
      width: 100%;
      bottom: 0;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      font-size: 30rpx;
      background: $uni-color-primary;
      color: #fff;
    }
  }
}
.uni-list-item__content-title {
  padding-left: 20rpx;
}
.lable-txt {
  margin-left: 50rpx;
  font-size: 28rpx;
  color: #666;
  border-top: 1px solid #f2f2f2;
  padding-top: 30rpx;
  position: relative;
  &::before {
    content: '*';
    position: absolute;
    top: 25rpx;
    left: -10px;
    color: red;
  }
}
</style>
