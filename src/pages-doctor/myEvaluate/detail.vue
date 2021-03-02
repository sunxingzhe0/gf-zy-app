<template>
  <view class="orderWrap">
    <!--主页按钮-->
    <homeIcom />
    <view class="oerderMain  box-shadow">
      <view class="orderItem flex-between" @click="goto(infoData.orderId)">
        <view class="title">订单号</view>
        <view class="info">
          <view>{{ infoData.orderId }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon "></uni-icons>
      </view>
      <view class="orderItem flex-between">
        <view class="title">就诊人</view>
        <view class="info">
          <view>{{ infoData.userName }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
      <view class="orderItem flex-between">
        <view class="title">业务类型</view>
        <view class="info">
          <view>{{
            infoData.bizType == 'CONSULT'
              ? '在线咨询'
              : infoData.bizType == 'REPEAT_CLINIC'
              ? '在线复诊'
              : '慢病续方'
          }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
      <view class="orderItem flex-between">
        <view class="title">业务形式</view>
        <view class="info">
          <view>{{
            infoData.bizWay == 'GRAPHIC'
              ? '图文'
              : infoData.bizWay == 'VIDEO'
              ? '视频'
              : '电话'
          }}</view>
        </view>
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
      <view class="orderItem flex-between" style="align-items:flex-start;">
        <view class="title">费用</view>
        <view class="info"
          ><text class="colorred">￥{{ infoData.couponFee }}</text></view
        >
        <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
      </view>
    </view>
    <view class="oerderMain box-shadow paddtb">
      <view class="flex-start-start">
        <view class="evaluate">用户评价</view>
        <view class="info">
          <view class="des flex-start-center evaluateNum">
            <uni-rate
              size="14"
              active-color="#FFA200"
              readonly="true"
              :value="parseFloat(average)"
            ></uni-rate>
            <text class="fen">{{ infoData.average }}分</text>
            <text>{{ getevaluateState(infoData.evaluateState) }}</text>
          </view>
          <view class="time">{{ infoData.createTime }}</view>
          <view class="evaluateText">{{ infoData.content || '' }}</view>
        </view>
      </view>
      <view
        class="flex-start-start"
        v-if="infoData.answerContent"
        style="margin-top: 30rpx;"
      >
        <view class="evaluate">回复</view>
        <view class="info">
          <view class="time">{{ infoData.answerTime }}</view>
          <view class="evaluateText">{{ infoData.answerContent }}</view>
        </view>
      </view>
      <view class="flex-start-start" style="margin-top: 30rpx;" v-else>
        <view class="evaluate">回复</view>
        <view class="info">
          <view class="evaluatetextarea">
            <textarea
              auto-height
              maxlength="500"
              v-model="content"
              placeholder-style="color:#999999;font-size:26rpx;"
              placeholder="请输入"
            />
          </view>
        </view>
      </view>
    </view>
    <button
      class="submit_btn"
      v-if="!infoData.answerContent"
      type="primary"
      @click="submit"
    >
      提交
    </button>
  </view>
</template>

<script>
import {
  findEvaluatePage,
  addEvaluateAnswer,
} from '@/common/request/userCenter'
export default {
  data() {
    return {
      evaluate: 4,
      id: '',
      infoData: {},
      content: '',
      average: 3,
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.getfindEvaluatePage()
    }
  },
  methods: {
    goto(id) {
      uni.navigateTo({
        url: '/pages-doctor/user/order/detail?orderId=' + id,
      })
    },
    // 获取详情
    async getfindEvaluatePage() {
      this.infoData = await findEvaluatePage({ evaluateId: this.id })
      this.average = this.infoData.average
    },
    async submit() {
      if (this.content == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入回复内容',
        })
        return false
      }
      await addEvaluateAnswer({ evaluateId: this.id, content: this.content })
      await this.getfindEvaluatePage()
      uni.showToast({
        title: '回复成功',
      })
    },
    getevaluateState(state) {
      if (state == 'NOT_SATISFIED') {
        return '不满意'
      } else if (state == 'GENERAL') {
        return '一般'
      } else if (state == 'SATISFIED') {
        return '满意'
      } else if (state == 'SATISFACTORY') {
        return '较满意'
      } else if (state == 'VERY_SATISFIED') {
        return '非常满意'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';
.orderWrap {
  margin-top: 0;
  padding-top: 20rpx;
  .evaluate {
    font-size: 30rpx;
    color: #666;
    width: 140rpx;
  }
  .info {
    width: 480rpx;
    padding-right: 30rpx;
    flex: 1;
    box-sizing: border-box;
    .des {
      font-size: 24rpx;
      color: #666;
      line-height: 48rpx;
      text {
        margin-right: 30rpx;
      }
    }
    .evaluateText {
      font-size: 30rpx;
      color: #1a1a1a;
      font-weight: bold;
      margin-bottom: 10rpx;
      word-break: break-all;
    }
    .time {
      font-size: 24rpx;
      color: #999999;
    }
    .evaluateNum {
      line-height: 48rpx;
      font-size: 24rpx;
      color: #ffa200;
      .fen {
        font-size: 30rpx;
        margin-left: 20rpx;
      }
    }
  }
  .evaluatetextarea {
    background: #f2f2f2;
    padding: 30rpx;
    box-sizing: border-box;
    margin-right: 30rpx;
    margin-bottom: 20rpx;
    margin-top: 10rpx;
    border-radius: 10px;
    line-height: 46rpx;
    textarea {
      width: 100%;
      font-size: 26rpx;
      line-height: 46rpx;
    }
  }
}
</style>
