<template>
  <view class="content-item">
    <view class="label">{{ label || '标题' }}:</view>
    <view class="value">{{ value || '-' }}</view>
  </view>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.content-item {
  display: flex;
  color: #666;
  font-size: 20rpx;
  margin-bottom: 10rpx;
  flex-shrink: 0;
  .label {
    min-width: 110rpx;
    flex-shrink: 0;
  }
  .value {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
