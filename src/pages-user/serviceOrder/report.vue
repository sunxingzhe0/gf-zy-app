<template>
  <view>
    <view class="top-banner" :style="{backgroundImage: url(this.FILE_URL_BUILT_IN('orderBg.png'))}">
      <view>待付款</view>
      <view>报告解读</view>
    </view>
    <view class="app-card">
      <view>
        <image src="" />
      </view>
      <view>
        <view>
          <text>刘晓霞</text>
          <text>女</text>
        </view>
        <view>妇产科 副主任医师 重庆医科大附属医院</view>
        <view>擅长：阴道炎、先兆流产、HPV感染、围绝经…</view>
        <view>
          <text>评分：</text>
          <text>5.0</text>
          <text>50 次诊疗</text>
        </view>
      </view>
    </view>

    <view class="app-card">
      <view class="app-card-cell">
        <text class="label">就诊人</text>
        <text class="value">刘晓琴</text>
      </view>
      <view class="app-card-cell">
        <view class="flex-between">
          <text class="label">选择报告</text>
          <text class="value color-primary">刘晓琴</text>
        </view>
        <view>
          <uni-icons type="arrowright" class="rightIcon" />
        </view>
      </view>
      <view class="app-card-cell">
        <view>这里是你的报告内容，或者备注</view>
      </view>
      <view class="app-card-cell">
        <text class="label">类型</text>
        <text class="value">报告解读，图文</text>
      </view>
      <view class="app-card-cell">
        <text class="label">费用</text>
        <text class="value" style="color: #e45b5b;">￥75.00</text>
      </view>
    </view>

    <view class="app-card">
      <view class="app-card-cell">
        <view class="flex-between">
          <view>
            <text class="label">费用</text>
            <text class="value">￥75.00</text>
          </view>
          <view class="color-primary">复制</view>
        </view>
        <view>
          <text class="label">下单时间</text>
          <text class="value">2019-11-11 22:54:30</text>
        </view>
      </view>
      <view class="app-card-cell">
        <view>
          <text class="label">支付时间</text>
          <text class="value">￥75.00</text>
        </view>
        <view>
          <text class="label">支付方式</text>
          <text class="value">￥75.00</text>
        </view>
      </view>
      <view class="app-card-cell">
        <text class="label">购买人</text>
        <text class="value">一只小乌龟</text>
      </view>
    </view>

    <view class="footer-wrapper">
      <view class="btn btn-cancel">取消</view>
      <view class="btn btn-pay">付款</view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.app-card-cell {
  padding: 0 32rpx;
  font-size: 32rpx;

  + .app-card-cell {
    border-top: 2rpx solid #e6e6e6;
  }
  .label {
    color: #666;
  }
  .value {
    color: #1a1a1a;
  }
}
.color-primary {
  color: $uni-color-primary;
}
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
}
.btn {
  width: 152rpx;
  height: 60rpx;
  line-height: 58rpx;
  border-radius: 32rpx;
}
.btn-cancel {
  background-color: #f2f2f2;
  color: #333;
}
.btn-pay {
  background-color: $uni-color-primary;
  color: #000;
}
</style>
