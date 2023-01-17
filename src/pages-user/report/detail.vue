<template>
  <view>
    <view>DX 左肩关节看，正侧位 </view>
    <view class="app-card">
      <view class="title">诊断报告</view>
      <view class="flex-between cell">
        <view>报告时间</view>
        <view>2020-04-07 09:20:15</view>
      </view>
      <view class="flex-between cell">
        <view>报告医生</view>
        <view>柳立峰</view>
      </view>
      <view class="flex-between cell">
        <view>检查描述</view>
        <view>
          <text>左肩关节骨质结构完整，关节...</text>
          <uni-icons type="arrowright" class="rightIcon" size="12px" />
        </view>
      </view>
      <view class="flex-between cell">
        <view>报告诊断</view>
        <view>
          <text>左肩关节骨质结构完整，关节...</text>
          <uni-icons type="arrowright" class="rightIcon" size="12px" />
        </view>
      </view>
    </view>

    <view class="app-card">
      <view class="title">检查影像</view>
      <view class="flex-between">
        <view>CT影像</view>
        <view>50张</view>
      </view>
    </view>

    <view class="app-card">
      <view class="title">检查信息</view>
      <view class="flex-between cell">
        <view>患者姓名</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>性别</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>年龄</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>检查号</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>检查时间</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>设备类型</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>申请科室</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>申请医生</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>申请时间</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>病人主诉</view>
        <view>李明明</view>
      </view>
      <view class="flex-between cell">
        <view>临床诊断</view>
        <view>李明明</view>
      </view>
    </view>

    <view class="button">报告解读</view>
  </view>
</template>
<style lang="scss" scoped>
.app-card {
  margin-top: 20rpx;
  padding-left: 28rpx;
}
.cell {
  padding: 28rpx 28rpx 28rpx 0;
  + .cell {
    border-top: 2rpx solid #e6e6e6;
  }
}
.button {
  width: 100%;
  height: 88rpx;
  line-height: 86rpx;
  text-align: center;
  background-color: $uni-color-primary;
  font-size: 32rpx;
  color: #fff;
}
</style>
