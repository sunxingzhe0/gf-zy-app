<template>
  <view
    class="app-list-item"
    :class="[className, noBorder ? 'no-border' : '']"
    :style="[styles]"
  >
    <view class="list-item-label" :style="textStyle">
      {{ label }}
    </view>
    <view class="list-item-value" :style="valStyle">
      <slot></slot>
      <template v-if="!$slots.default">
        {{ value }}
      </template>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
    styles: {
      type: Object,
      default: {},
    },
    textStyle: {
      type: String,
      default: '',
    },
    valStyle: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.app-list-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  font-size: 30rpx;
  flex-direction: row;
  box-sizing: border-box;
  padding: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}
.list-item-label {
  width: 190rpx;
  color: #666;
}
.list-item-value {
  flex: 1;
  display: flex;
  color: #1a1a1a;
  align-items: center;
}
</style>
