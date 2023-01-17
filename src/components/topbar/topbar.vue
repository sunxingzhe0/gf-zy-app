<template>
  <view class="container">
    <slot name="top"></slot>
    <view class="top-bar">
      <view
        class="top-bar__item"
        v-for="item in tabs"
        :key="item.key"
        :class="{ active: checked == item.key }"
        @click="change(item)"
      >
        {{ item.title }} {{ item.num ? `(${item.num})` : '' }}
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    active: String,
    tabs: Array,
  },
  data() {
    return {
      checked: '',
    }
  },
  created() {
    this.checked = this.active
  },
  methods: {
    change(item) {
      if (item.disabled) {
        return uni.showToast({
          title: '暂未开通...',
          icon: 'none',
        })
      }
      this.checked = item.key
      this.$emit('change', item.key)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #fff;
  border-bottom-left-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
}
.top-bar {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #666;
}
.top-bar__item {
  line-height: 80rpx;
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: $uni-color-primary;
    color: $uni-color-primary;
  }
}
</style>
