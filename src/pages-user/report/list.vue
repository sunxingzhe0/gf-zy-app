<template>
  <view>
    <view class="top">
      <view class="cell">
        <view>健康卡</view>
        <view>
          <text>刘晓琴</text>
          <uni-icons type="arrowright" class="rightIcon" size="12px" />
        </view>
      </view>
      <view class="cell">
        <view>报告时间</view>
        <view>
          <text>2020-04-01 ~ 2020-04-07</text>
          <uni-icons type="arrowright" class="rightIcon" size="12px" />
        </view>
      </view>
      <view class="flex-around">
        <view class="tab">检查报告</view>
        <view class="tab">检验报告</view>
      </view>
    </view>
    <view class="app-card">
      <checkbox-group>
        <view class="flex-between">
          <label>
            <checkbox value="cb" />
            报告编号：N0.11010
          </label>
          <view class="name">刘力菲</view>
        </view>
        <view class="name">项目名称</view>
        <view>申请医生：XXX | 申请时间：2020-04-01</view>
        <view>报告医生：XXX | 报告时间：2020-04-01</view>
      </checkbox-group>
    </view>

    <view class="flex-between footer">
      <checkbox-group>
        <label>
          <checkbox />
          全选
        </label>
      </checkbox-group>
      <view class="button">报告解读</view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.tab {
  border-bottom: 2rpx solid #fff;
  font-size: 26rpx;
  color: #666;

  &.active {
    border-bottom-color: $uni-color-primary;
    color: $uni-color-primary;
  }
}
.app-card {
  font-size: 24rpx;
  color: #666;
}
.name {
  font-size: 32rpx;
  color: #1a1a1a;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88rpx;
  line-height: 86rpx;
  background-color: #fff;
}
.button {
  width: 152rpx;
  height: 60rpx;
  line-height: 58rpx;
  text-align: center;
  background-color: $uni-color-primary;
  font-size: 24rpx;
  color: #fff;
}
</style>
