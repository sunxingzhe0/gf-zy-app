<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :active="active" :tabs="tabs" @change="tabChange"></topbar>
    <checkbox-group @change="checkboxChange">
      <!-- 处方列表 -->
      <view class="app-card" v-for="item in dataList" :key="item.id" @click="detail(item.payStatus, item.rpOrderId)">
          <!-- 单个列表固定显示信息 -->
        <view class="flex-between">
          <label v-show="active == 'UNPAID' && item.payStatus != 'UNPAID_ING'">
            <checkbox :value="[item.id, item.prescriptionPrice]" :t="item.prescriptionPrice" color="#0AB2C1" :checked="selectIds.includes(item.id)" />
          </label>
          <text class="prescription-no">处方号：{{ item.id }}</text>
          <view class="prescription-price">￥{{ item.prescriptionPrice }}</view>
        </view>
        <view style="font-size: 24rpx;">数量:{{ item.number }} 医生：{{ item.doctorName }} {{ item.title }} {{ item.treatmentTime }}</view>
        <view
          v-show="active == 'UNPAID'"
          class="flex-start-start"
          style="text-align: center;line-height: 60rpx;
"
        >
          {{ countdown(item) }} 距离处方失效还剩:
          <uni-countdown
            color="#E45B5B"
            splitor-color="#E45B5B"
            background-color="#fff"
            border-color="#fff"
            :show-day="false"
            :hour="item.hours || 0"
            :minute="item.minutes || 0"
            :second="item.seconds || 0"
          ></uni-countdown>
          ，请尽快支付！
        </view>
        <view style="margin-top: 25rpx;position: relative;padding-right: 34rpx;" :class="item.isDiagnosis ? '' : 'text-overflow'">
          诊断：
          <text style="color: #333;font-size: 26rpx;">{{ item.diagnosis }}</text>
          <image
            v-if="item.diagnosis.length>18"
            @click="openDiagnosis(item)"
            :class="{ desc: item.isDiagnosis }"
            :src="require('@/assets/open@2x.png')"
            mode="aspectFit"
            style="width: 24rpx;height: 26rpx;position: absolute; top: 15rpx;right: 0;"
          ></image>
        </view>
        <view style="margin-top: 25rpx;" v-show="active == 'UNPAID'">
          处方有效期截至:
          <text style="color: #e45b5b;">{{ item.expireDate }}</text>
        </view>

        <!-- 配送方式信息  已支付列表显示-->
        <view class="cell-box" style="margin-top: 40rpx; " v-show="active == 'PAID'">
          <view class="flex-between">
            <view style="color: #1a1a1a;">{{ item.name }}</view>
            <view class="">
              配送方式：
              <text style="color:#0AB2C1;font-size: 24rpx;">自提</text>
            </view>
          </view>
          <view class="">{{ item.phone }}</view>
          <view class="">{{ item.address }}</view>
        </view>

        <!-- 药品列表-->
        <view class="detail" >
          <!-- 控制药品收起展开 -->
          <view
            style="position: relative;height: 25px; width:100%" class="rpListTop">
            <text>药品清单</text>
            <view @click="openRpList(item)" style=" position: absolute; right: 10rpx;">
              <view>
                <text style="margin-right: 12rpx;">{{ item.isOpenRpList ? '收起' : '查看' }}详情</text>
                <image :class="{ desc: item.isOpenRpList }" :src="require('@/assets/open@2x.png')" mode="aspectFit" style="width: 22rpx;height: 20rpx;"></image>
              </view>
            </view>
          </view>
          <!-- 药品列表 -->
          <view v-show="item.isOpenRpList">
            <template v-for="(valitem, index) in item.rpDrugList">
              <view class="flex-between" :key="valitem.id">
                <view v-if="active != 'EXPIRED'" class="medicine-name">{{ index + 1 }}.{{ valitem.name }} {{ valitem.spec }}</view>
                <view v-if="active == 'EXPIRED'" class="medicine-name">{{ index + 1 }}.***********</view>
                <view class="medicare">医保：{{ valitem.medicare == 'ME_FEE' ? '自费' : swithMedicare(valitem.medicare) }}</view>
              </view>
              <view class="ml-20" :key="valitem.id">
                <view class="use">{{ valitem.useWaysText }} {{ valitem.useFrequencyText }} <!-- {{ active == 'EXPIRED' ? '********' : valitem.singleDose }} --> ￥{{ valitem.price }}x{{ valitem.total }} <text class="price">￥{{ valitem.totalPrice }}</text></view>
                <!-- <view class="price">￥{{ valitem.totalPrice }}</view> -->
                <view type="font-size:24px;color:rgba(102,102,102,1);">备注：{{ valitem.remark || '-' }}</view>
              </view>
            </template>
          </view>
        </view> 


<!--          <view class="cell-box" style="margin-top: 40rpx;" v-show="item.rpExpressDto.way == '1'">
              <view class="flex-between">
                <view style="color: #1a1a1a;">{{ subpackage.receiverName || '' }} {{ subpackage.receiverPhone || '' }}</view>
                <view class="">{{ subpackage.corpName || '' }}：{{ subpackage.expressNo || '' }}</view>
              </view>
              <view class="">
                收货信息：{{ subpackage.receiverProvince || '' }}{{ subpackage.receiverRegion || '' }}{{ subpackage.receiverCity || '' }}{{ subpackage.receiverDetailAddress || '' }}
              </view>
              <view class="logistics cell-box-t">
                <image style="width: 68rpx; height: 68rpx;" :src="require('@/assets/receivedIcon.png')"></image>
                <view style="flex: 1;">
                  <view class="info">{{ subpackage.location || '暂无信息' }}</view>
                </view>
              </view>
        </view>

        <view class="mt-20 " v-show="active != 'UNPAID' && item.rpExpressDto.way == '1'">
          供货方：
          <text style="color:#1A1A1A;">{{ item.pharmacyName }}</text>
        </view> -->

        <!-- 已支付列表显示 -->
        <template>
          <view style="margin-top: 40rpx;" v-show="active == 'PAID'">
            <view class="">
              <text>支付方式</text>
              <text class="ml-50" style="color: #1a1a1a;">{{ switchPayType(item.rpExpressDto.orderPayWay) }}</text>
            </view>
            <view class="">
              <text>支付时间</text>
              <text class="ml-50" style="color: #1a1a1a;">{{ item.rpExpressDto.orderPayTime }}</text>
            </view>
          </view>
        </template>

      </view>

    </checkbox-group>


    <!-- 总全选---未支付列表时显示 -->
    <view class="flex-between bottom-bar" v-show="active == 'UNPAID'">
      <checkbox-group @change="allCheckboxChange">
        <label><checkbox value="all" :checked="checkedAll ? true : false">全选</checkbox></label>
      </checkbox-group>
      <view class="flex-start-center">
        <view class="bottom-bar__price">￥{{ total }}</view>
        <button class="btn-primary btn-pay" :class="{ no: !payable }" @click="pay()">支付</button>
      </view>
    </view>
  </view>
</template>

<script>
import { userPageRp } from '@/common/request/userPrescription.js';
export default {
  data() {
    return {
      orderId: '',
      tabs: [
        {
          title: '待付款',
          key: 'UNPAID'
        },
        {
          title: '已支付',
          key: 'PAID'
        },
        {
          title: '已失效',
          key: 'EXPIRED'
        }
      ],
      active: 'UNPAID',
      show: false,
      selectIds: [], //选中
      checkedAll: false, //是否全选
      total: '0.00', //总价
      currentNum: 1,
      dataList: [],
      payable: true //可支付
    };
  },
  onLoad(options) {
    if (options.orderId) {
      this.orderId = options.orderId;
    }
  },

  onShow() {
    // 清理数据
    this.checkedAll = false;
    this.selectIds = [];
    this.total = '0.00';
    this.dataList = [];
    this.currentNum = 1;
    this.getUserPageRp();
  },
  methods: {
    swithMedicare(medicare) {
      var str = '医保：';
      switch (medicare) {
        case 'A':
          str += '甲类';
          break;
        case 'B':
          str += '乙类';
          break;
        case 'C':
          str += '丙类';
          break;
      }
      return str;
    },
    openDiagnosis(item) {
      this.$set(item, 'isDiagnosis', !item.isDiagnosis);
    },
    openRpList(item) {
      this.$set(item, 'isOpenRpList', !item.isOpenRpList);
    },
    pay() {
      if (!this.payable) {
        return;
      }
      if (!this.selectIds || this.selectIds.length <= 0) {
        uni.showToast({
          title: '选择要支付的处方!',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: '../orderSubmit/orderSubmit?ids=' + this.selectIds + '&total=' + this.total
      });
    },
    async getUserPageRp() {
      const data = await userPageRp({
        payStatus: this.active,
        orderId: this.orderId,
        currentNum: this.currentNum
      });
      console.log(data,'===============')

      if (data.data) {
        this.dataList = [...this.dataList, ...data.data];
        console.log(this.dataList,'-----------------------')
      }
    },
    tabChange(active) {
      this.payable = true;
      this.dataList = [];
      this.currentNum = 1;
      this.active = active;
      this.getUserPageRp();
    },
    checkboxChange(event) {
      this.payable = true;
      this.total = '0.00';
      const value = event.detail.value;
      this.selectIds = [];
      value.forEach(data => {
        let d = data.split(',');
        this.selectIds.push(d[0]);
        this.total = parseFloat(d[1]) + parseFloat(this.total);
      });
      // 如果选择的数组中有值，并且长度等于列表的长度，就是全选
      if (this.selectIds.length > 0 && this.selectIds.length == this.dataList.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    },
    allCheckboxChange(event) {
      const chooseItem = event.detail.value;
      this.payable = true;
      // 全选
      if (chooseItem[0] == 'all') {
        this.checkedAll = true;
        this.total = '0.00';
        this.dataList.forEach(data => {
          //判断状态为未提交过
          if (data.payStatus == 'UNPAID') {
            this.selectIds.push(data.id);
            this.total = parseFloat(data.prescriptionPrice) + parseFloat(this.total);
          }
        });
        if (!this.selectIds || this.selectIds.length <= 0) {
          //无可支付处方
          this.payable = false;
        }
      } else {
        // 取消全选
        this.checkedAll = false;
        this.selectIds = [];
        this.total = '0.00';
      }
    },
    /***
     *付款时间倒计时
     */
    countdown(item) {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date((item.expireDate || '').replace('-', '/').replace('-', '/')); //到期时间
      var currentTime = new Date((item.now || '').replace('-', '/').replace('-', '/')); //当前系统时间
      var dateDiff = dateEnd.getTime() - currentTime.getTime(); //时间差的毫秒数
      if (!item.expireDate || dateDiff < 0) {
        return '';
      }
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);

      var leave4 = leave3 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var minseconds = Math.round(leave4 / 1000);

      item.hours = dayDiff * 24 + hours;
      item.minutes = minutes;
      item.seconds = seconds;
      return '';
    },
    switchPayType(type) {
      var typeS = '';
      switch (type) {
        case 'OFFLINE_PAY':
          typeS = '线下支付';
          break;
        case 'WECHAT_PAY':
          typeS = '微信支付';
          break;
      }
      return typeS;
    },
    detail(payStatus, orderId) {
      if (payStatus != 'UNPAID_ING') {
        return;
      }
      //已下单未支付进入处方订单详情页
      uni.navigateTo({
        url: '../prescriptionOrder/detail?id=' + orderId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rpListTop{
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba($color: #fff, $alpha: 0.5);
}
.container {
  padding: 80rpx 0 140rpx;
  background-color: rgba(255, 255, 255, 0.2);
}

.app-card {
  margin: 28rpx 20rpx 0;
  padding: 28rpx;
  color: #666;
}

.prescription-no {
  font-size: 30rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prescription-price {
  color: #0ab2c1;
}

.detail {
  margin-top: 32rpx;
  padding: 20rpx;
  background-color: #eee;
}

.desc {
  transform: rotate(0.5turn);
}

.medicine-name {
  color: #333;
}

.use {
  color: rgba(102, 102, 102, 1);
  display: flex;
  justify-content: space-between;
}

.price {
  font-size: 32rpx;
  color: #0ab2c1;
}

.cell-box {
  border: 1px solid rgba(204, 204, 204, 1);
  padding: 20rpx 20rpx;
}

.cell-box-t {
  padding: 20rpx 0rpx;
  border-top: 1rpx solid #e6e6e6;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px -2px 4px 0 rgba(169, 169, 169, 0.37);
}

.bottom-bar__price {
  font-size: 32rpx;
  color: $uni-color-primary;
}

.btn-pay {
  margin-left: 20rpx;
  width: 154rpx;
  line-height: 60rpx;
  border-radius: 34rpx;
  background-color: $uni-color-primary;
  font-size: 24rpx;
  color: #fff;

  &.no {
    background-color: #999999;
    border: 2rpx solid #999999;
  }
}

.logistics {
  display: flex;
  align-items: center;
  color: rgba(102, 102, 102, 1);

  .info {
    // display: inline-block;
    font-size: 24rpx;
    width: 472rpx;
    margin-left: 10rpx;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // line-height: 23rpx;
  }

  .time {
    font-size: 24rpx;
  }
}

// checkbox-group {
//   width: 160rpx;
// }
</style>
