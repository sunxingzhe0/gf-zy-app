<template>
  <view class="app-card" :style="styles" @click="clickHandler">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    styles: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickHandler() {
      this.$emit('click')
    }
  }
};
</script>

<style lang="scss" scoped>
.app-card {
  background: #fff;
  padding: 60rpx 66rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
}
</style>
