<template>
  <view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
      <app-list-item
        label="就诊人"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right">{{ patientName }}</view>
      </app-list-item>
      <app-list-item
        label="住院总费用"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right">{{
          infoData.feeAmount
            ? '￥' + parseFloat(infoData.feeAmount).toFixed(2)
            : '-'
        }}</view>
      </app-list-item>
      <app-list-item
        label="可用余额"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right">{{
          infoData.useMoney
            ? '￥' + parseFloat(infoData.useMoney).toFixed(2)
            : '-'
        }}</view>
      </app-list-item>
      <!-- <app-list-item
        label="费用日期"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right color666 flex-end-start">
          <picker
            mode="date"
            :value="date"
            :start="minData"
            :end="maxDate"
            @change="confirm"
          >
            <text :class="[date ? 'color666' : 'color999']">{{
              date || '选择时间'
            }}</text>
          </picker>
          <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
        </view>
      </app-list-item> -->
      <app-list-item
        label="当日费用"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right">{{
          infoData.moneyAnd
            ? '￥' + parseFloat(infoData.moneyAnd).toFixed(2)
            : '-'
        }}</view>
      </app-list-item>
    </app-card>
    <app-card styles="padding: 0rpx; min-height:400px" class="detail">
      <app-list-item label="项目类别">
        <view class="flex_1 text-right color666" @click="selecPayType">
          {{ feeName }}
          <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
        </view>
      </app-list-item>
      <view class="time-change" style="padding:0 10px">
        <view class="ot-icon" @click="changeTime(0)"
          ><uni-icons
            style="margin-rigth:2px"
            type="arrowleft"
            :color="isMin ? '#ccc' : '#666'"
            size="14"
          ></uni-icons>
        </view>
        <text style="flex:1;text-align:center">{{ date }}</text>
        <view class="ot-icon" @click="changeTime(1)"
          ><uni-icons
            style="margin-left:2px"
            type="arrowright"
            :color="isMax ? '#ccc' : '#666'"
            size="14"
          ></uni-icons
        ></view>
      </view>
      <view class="table">
        <view class="thbody">
          <view class="th" style="min-width: 80px;">项目类别</view>
          <view class="th">名称</view>
          <view class="th">单价</view>
          <view class="th" style="min-width: 30px;">数量</view>
          <view class="th">总价</view>
        </view>
        <view
          v-for="(item, index) in infoData.items"
          :key="index"
          class="tdbody"
        >
          <view class="td">{{ item.itemType }}</view>
          <view class="td">{{ item.itemName }}</view>
          <view class="td">{{
            item.price ? '￥' + parseFloat(item.price).toFixed(2) : '-'
          }}</view>
          <view class="td">{{ item.num }}</view>
          <view class="td">{{
            item.money ? '￥' + parseFloat(item.money).toFixed(2) : '-'
          }}</view>
        </view>
      </view>
      <view v-if="!infoData.items" style="width:100%"><NoData></NoData></view>
    </app-card>
    <!--费用类别-->
    <pop-select
      ref="popselect"
      title="费用类别"
      :list="feeTypes"
      @change="changePer"
      @submit="changePer"
    ></pop-select>
  </view>
</template>
<script>
import dayjs from 'dayjs'
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import popSelect from '@/components/pop-select'
// import itemList from './itemType.js'
import { findBill, getFeeType } from '../api/inHospital.js'
import NoData from '../components/NoData'
export default {
  components: {
    AppCard,
    AppListItem,
    popSelect,
    NoData,
  },
  data() {
    return {
      isMin: false,
      isMax: true,
      patientName: '',
      feeTypes: [],
      isdate: false,
      maxDate: dayjs().format('YYYY-MM-DD'),
      date: dayjs()
        .subtract(1, 'day')
        .format('YYYY-MM-DD'),
      minData: '',
      isFee: false,
      feeId: '',
      feeName: '全部',
      patientId: '',
      inTimes: '',
      inSno: '',
      // feeList: itemList,
      infoData: {},
      list: [],
    }
  },
  onLoad(option) {
    console.log(this.option, '参数--')
    this.patientName = option.patientName
    this.inTimes = option.inTimes
    this.inSno = option.inSno
    this.minData = option.admitDtime.split(' ')[0]
    if (option.dischargeDtime) {
      this.date = option.dischargeDtime.split(' ')[0]
      this.maxDate = option.dischargeDtime.split(' ')[0]
    } else {
      this.date = dayjs()
        .add(-1, 'day')
        .format('YYYY-MM-DD')
      console.log(this.date, '111')
    }
    if (option.patientId) {
      this.patientId = option.patientId
      this.getfindBill()
      // this.getFeeType(option.patientId)
    }
  },
  methods: {
    //切换时间
    changeTime(type) {
      //jia
      if (type) {
        if (this.date === this.maxDate) {
          this.isMax = true
          return
        }
        this.date = dayjs(this.date)
          .add(1, 'day')
          .format('YYYY-MM-DD')
        this.getfindBill()
        this.isMax = false
        this.isMin = false
        return
      }
      //jian
      if (this.date === this.minData) {
        this.isMin = true
        return
      }
      this.date = dayjs(this.date)
        .subtract(1, 'day')
        .format('YYYY-MM-DD')
      this.getfindBill()
      this.isMin = false
      this.isMax = false
    },
    //获取费用类别
    async getFeeType(patientId) {
      const res = await getFeeType({ patientId })
      this.feeTypes = [
        {
          name: '全部',
          value: '',
          checked: true,
        },
        ...res.map(val => {
          return {
            name: val.feeName,
            value: val.feeName,
            checked: false,
          }
        }),
      ]
    },
    newArry(arr) {
      return Array.from(new Set(arr))
    },
    async getfindBill() {
      uni.showLoading()
      let res = await findBill({
        inTimes: this.inTimes,
        inSno: this.inSno,
        patientId: this.patientId,
        startTime: this.date,
        endTime: this.date,
        billType: 2,
        // itemType: this.feeId,
      })
      uni.hideLoading()
      this.list = res.items
      this.infoData = res
      let typeName = res.items
        ? this.newArry(
            res.items.map(val => {
              return val.itemType
            }),
          )
        : []
      this.feeTypes = [
        {
          name: '全部',
          value: '',
          checked: true,
        },
        ...typeName.map(val => {
          return {
            name: val,
            value: val,
            checked: false,
          }
        }),
      ]
    },
    // 选择就费用类别
    changePer(e) {
      console.log(e, '--------')
      if (e) {
        this.feeId = e
        this.feeName = e
      } else if (e === '') {
        this.feeId = e
      } else {
        this.$refs.popselect.close()
        // this.getfindBill()
        if (this.feeId) {
          this.infoData.items = this.list.filter(
            item => this.feeId == item.itemType,
          )
        } else {
          this.infoData.items = this.list
        }
      }
    },
    selecPayType() {
      this.$refs.popselect.open()
    },
    confirm(e) {
      console.log(e)
      this.date = e.detail.value
      this.getfindBill()
    },
  },
}
</script>
<style lang="scss" scoped>
.detail {
  min-height: 400px;
  .table {
    width: 100%;
    display: table;
    border: 1px solid #e6e6e6;
    border-right: 0;
    border-bottom: 0;
    text-align: center;
    font-size: 24rpx;

    .thbody {
      display: table-header-group;

      .th {
        display: table-cell;
        border: 1px solid #e6e6e6;
        color: #666;
        border-top: 0;
        border-left: 0;
        padding: 10rpx;
        background-color: #f2f2f2;
      }
    }

    .tdbody {
      display: table-row-group;

      .td {
        padding: 10rpx;
        display: table-cell;
        border: 1px solid #e6e6e6;
        border-top: 0;
        border-left: 0;
      }
    }
  }
  .time-change {
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    .ot-icon {
      width: 25px;
      height: 25px;
      display: flex;
      border-radius: 50%;
      border: 1px solid #f2f2f2;
      justify-content: center;
      align-items: center;
      .max-min {
        text {
          color: #ccc !important;
        }
      }
    }
  }
}
::v-deep .radioWrap {
  justify-content: flex-start !important;
}
::v-deep filter-radio-item {
  width: auto !important;
}
</style>
