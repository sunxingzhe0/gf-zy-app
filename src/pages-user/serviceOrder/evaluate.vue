<template>
  <view class="orderWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="oerderMain  box-shadow">
      <view class="orderItem flex-between">
        <view class="title">订单号</view>
        <view class="info">
          <view>{{ orderD.id }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
      <view class="orderItem flex-between">
        <view class="title">就诊人</view>
        <view class="info">
          <view>{{ orderD.userName }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
      <view class="orderItem flex-between">
        <view class="title">类型</view>
        <view class="info">
          <view>{{ switchBizType(orderD.bizType) }}，{{ switchBizWay(orderD.bizWay) }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
      <view class="orderItem flex-between" style="align-items:flex-start;">
        <view class="title">费用</view>
        <view class="info">
          <text class="colorred">￥{{ orderD.couponFee }}</text>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
    </view>

    <view class="list oerderMain box-shadow paddtb">
      <view class="orderItem border0 flex-between"><view class="title">接诊医生</view></view>
      <view class="flex-between-start paddtb">
        <image class="listImg" :src="orderD.avatar ? (orderD.avatar.indexOf('https') != -1 ? orderD.avatar : FILE_URL(orderD.avatar)) : require('@/assets/user/user_d_head.png')"></image>
        <view class="info">
          <view class="name">
            {{ orderD.doctorName }}
            <text>{{ orderD.sex }}</text>
          </view>
          <view class="des">
            <text>{{ orderD.deptName }}</text>
            <text>{{ orderD.titleName }}</text>
            <text>{{ orderD.orgName }}</text>
          </view>
          <view class="des text-overflow">擅长：{{ orderD.goodAt }}</view>
          <!-- <view class="des">
            评分：
            <text class="fen">5.0</text>
            <text>50 次诊疗</text>
          </view> -->
        </view>
      </view>
    </view>
    <view class="oerderMain box-shadow paddtb">
      <view class="orderItem border0 flex-between">
        <view class="title" style="width: auto;">评价</view>
        <view style="display: flex; align-items: center;">
          <uni-rate :size="16" :margin="4" :value="evaluateP.level" style="margin-top: 8rpx;" active-color="#FFA200" color="#cccccc" @change="evaluateC"></uni-rate>

          <view
            style="font-size:26rpx;
color:rgba(255,162,0,1);margin-left: 40rpx;"
          >
            {{ evaluateP.level }}.0分
          </view>
        </view>

        <view class="evaluate">{{ evaluateDescribe[evaluateP.level - 1] }}</view>
      </view>

      <view class="evaluateText">
        <textarea placeholder-style="color:#999999;font-size:26rpx;" @input="inputText" maxlength="200" placeholder="非常好，我非常满意！" />

        <view class="surplus">{{ count }}/200</view>
      </view>
    </view>
    <button class="submit_btn" type="primary" @click="submit">提交</button>
  </view>
</template>

<script>
import { findEvaluate, addEvaluate } from '../../common/request/index.js';
export default {
  onLoad(options) {
    if (options.orderId) {
      this.evaluateP.orderId = options.orderId;
    }
  },
  data() {
    return {
      orderD: {},
      evaluateP: {
        orderId: '',
        level: 5,
        content: ''
      }, //评价参数
      evaluateDescribe: ['不满意', '一般', '满意', '较满意', '非常满意'],
      // 输入的字数
      count: 0
    };
  },
  mounted() {
    this.findEvaluate();
  },

  methods: {
    evaluateC(e) {
      this.evaluateP.level = e.value;
    },
    findEvaluate() {
      findEvaluate({ orderId: this.evaluateP.orderId }).then(data => {
        if (data) {
          this.orderD = data;
        }
      });
    },

    switchBizType(bizType) {
      let typeS = '';
      switch (bizType) {
        case 'CONSULT':
          typeS = '在线咨询';
          break;
        case 'REPEAT_CLINIC':
          typeS = '在线复诊';
          break;
        case 'CARRYON_PRESC':
          typeS = '慢病续方';
          break;
      }
      return typeS;
    },
    switchBizWay(bizWay) {
      let typeS = '';
      switch (bizWay) {
        case 'GRAPHIC':
          typeS = '图文';
          break;
        case 'VIDEO':
          typeS = '视频';
          break;
        case 'PHONE':
          typeS = '电话';
          break;
      }
      return typeS;
    },
    // bindTextAreaBlur(e) {
    //     this.evaluateP.content=e.detail.value
    //   },
    // 监听输入字数事件
    inputText(e) {
      this.count = e.detail.cursor;
      this.evaluateP.content = e.detail.value;
    },
    submit() {
      //输入框还未将数据填充就提交容易取不到值
      addEvaluate(this.evaluateP).then(data => {
        uni.showToast({
          title: '评价成功！'
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          });
        }, 1000);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';
.orderWrap {
  margin-top: 0;
  padding-top: 20rpx;
  .evaluate {
    font-size: 30rpx;
    color: #ffa200;
  }
  .evaluateText {
    background: #f2f2f2;
    padding: 30rpx;
    box-sizing: border-box;
    margin-right: 30rpx;
    margin-bottom: 20rpx;
    margin-top: 10rpx;
    border-radius: 10px;
    textarea {
      font-size: 26rpx;
      width: 580rpx;
    }
  }
}
.surplus {
  text-align: right;
  font-size: 20upx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(204, 204, 204, 1);
}
</style>
