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
          :rightText="showDate"
          class="requird"
          @click="$refs.datePop.open()"
        />
        <uni-list-item
          :clickable="false"
          title="就诊人"
          :rightText="patient"
          :show-switch="false"
        />
        <uni-list-item
          v-if="slectDateVal.reservedVO"
          clickable
          title="顺延时间"
          :rightText="postponeDateText"
          @click="$refs.postTimePop.open()"
        />
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
    <!-- 时间选择 -->
    <uni-popup ref="datePop" type="bottom">
      <view class="pop-view">
        <view class="title">选择日期</view>
        <picker-view
          :indicator-style="indicatorStyle"
          :value="dateVal"
          @change="changeDateItems"
          style="height: 200px; text-align: center"
        >
          <picker-view-column>
            <view
              v-for="(v, i) in nameFilterList"
              :key="i"
              style="line-height: 80rpx; font-size: 32rpx"
              >{{ `${v.scheduleDate} ${v.startTime}-${v.endTime}` }}</view
            >
          </picker-view-column>
        </picker-view>
        <view @click="chooseDateItem" class="confirm">确认</view>
      </view>
    </uni-popup>
    <!-- 顺延日期选择 -->
    <uni-popup ref="postTimePop" type="bottom">
      <view class="pop-view">
        <view class="title">选择顺延日期</view>
        <picker-view
          :indicator-style="indicatorStyle"
          :value="postDateVal"
          @change="changepostDate"
          style="height: 200px; text-align: center"
        >
          <picker-view-column>
            <view
              v-for="(v, i) in postDateList"
              :key="i"
              style="line-height: 80rpx; font-size: 32rpx"
              >{{ `${v.scheduleDate} ${v.startTime}-${v.endTime}` }}</view
            >
          </picker-view-column>
        </picker-view>
        <view @click="confirmPostDate" class="confirm">确认</view>
      </view>
    </uni-popup>
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
export default {
  components: { popSelectDate, uniEasyinput },
  data() {
    return {
      closeDate: {},
      postDate: [],
      applyRemark: '',
      itemVal: [0],
      dateVal: [0],
      selectItem: 0,
      dateSelectItem: 0,
      itemList: ['李医生 项目1 ¥500', '张医生 项目2 ¥300', '王医生 项目3 ¥800'],
      indicatorStyle: `height: 80rpx;`,
      listData: [], //工作日程s
      itenNames: [], //工作日程项目名s
      nameFilterList: [], //项目名筛选的工作日程
      selectValue: {}, //选中项目
      slectDateVal: {}, //选中日期
      /*  */
      //顺延日期
      postDateVal: [0],
      postDateList: [],
      postDateIndex: 0,
      selectPostDate: {},
    }
  },
  onLoad() {
    this.getList()
  },
  computed: {
    userInfo() {
      return uni.getStorageSync('userInfo')
    },
    showItems() {
      if (!this.selectValue.itemName) return '请选择'
      return `${this.userInfo.username}｜${this.selectValue.itemName}｜${this.selectValue.price}`
    },
    showDate() {
      if (!this.slectDateVal.itemName) return '请选择'
      return `${this.slectDateVal.scheduleDate} ${this.slectDateVal.startTime}-${this.slectDateVal.endTime}`
    },
    patient() {
      if (!this.slectDateVal.reservedVO) return '-'
      const info = this.slectDateVal.reservedVO
      return `[${info.cardNo}]${info.patientName}｜${info.sex ? '男' : '女'}｜${
        info.phone
      }`
    },
    postponeDateText() {
      if (!this.selectPostDate.id) return '请选择'
      return `${this.selectPostDate.scheduleDate} ${this.selectPostDate.startTime}-${this.selectPostDate.endTime}`
    },
  },
  methods: {
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
      console.log(this.itenNames, '处理后的列表---')
    },
    //提交申请
    async submitOrder() {
      const params = {
        applyRemark: this.applyRemark,
        memberId: this.slectDateVal?.reservedVO?.memberId || '',
        patientId: this.slectDateVal?.reservedVO?.patientId || '',
        scheduleId: this.slectDateVal?.id || '',
        newScheduleId: this.selectPostDate.id || '',
      }
      console.log(params, '提交申请')
      try {
        await stopApply(params)
        uni.showToast({
          title: '提交成功!',
        })
        uni.navigateBack({
          delta: 1,
        })
      } catch (error) {
        uni.showToast({
          title: '网络连接超时，请稍后重试！',
          icon: 'none',
        })
      }
    },
    // 停诊日期
    dateChange(e) {
      this.rangeData = e
    },

    // 项目改变
    changeItems(e) {
      this.selectItem = e.detail.value[0]
    },
    //日期改变
    changeDateItems(e) {
      this.dateSelectItem = e.detail.value[0]
    },
    // 选择项目
    chooseItem() {
      this.itemVal = [this.selectItem]
      this.selectValue = this.itenNames[this.selectItem]
      this.filterList(this.selectValue.itemName)
      this.$refs.itemPop.close()
    },
    //选择停诊日期
    chooseDateItem() {
      this.slectDateVal = this.nameFilterList[this.dateSelectItem]
      if (this.slectDateVal.reservedVO) {
        this.getPostDateList()
      }
      this.$refs.datePop.close()
    },
    //筛选出日期列表
    filterList(name) {
      this.nameFilterList = this.listData.filter(v => v.itemName === name)
      console.log(this.nameFilterList, '筛选列表---')
    },
    //顺延日期改变
    changepostDate(e) {
      this.postDateIndex = e.detail.value[0]
    },
    //确认选择顺延日期
    confirmPostDate() {
      this.selectPostDate = this.postDateList[this.postDateIndex]
      this.$refs.postTimePop.close()
    },
    //获取顺延日期
    async getPostDateList() {
      const params = {
        deptId: this.slectDateVal.deptId,
        doctorId: this.slectDateVal.reservedVO.doctorId,
        itemId: this.slectDateVal.itemId,
        startTime: this.slectDateVal.startTime,
        endTime: this.slectDateVal.endTime,
      }
      this.postDateList = await getScheduleListByDeptDoctorPeriod(params)
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
