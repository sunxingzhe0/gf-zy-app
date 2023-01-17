<template>
  <view class="app-tab">
    <view
      class="app-tab-item"
      v-for="(item, index) in menus"
      @click="toogleTabIndex(index)"
      :class="{ active: value === index }"
      :key="index"
      >{{ item }}</view
    >
  </view>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    value: {
      type: Number,
      default: 0
    }
  },
  methods: {
    toogleTabIndex(index) {
      this.$emit("input", index)
      this.$emit("change", index);
    }
  },
  watch: {
      value(val) {
          console.log(val)
      }
  }
};
</script>

<style lang="scss" scoped>
.app-tab {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.app-tab-item {
  color: #656565;
  font-size: 26rpx;
  font-weight: 500;
  position: relative;
  line-height: 80rpx;
  transition: all ease 0.3s;
  font-family: PingFang SC;
  &::before {
    bottom: 0;
    left: -10%;
    width: 120%;
    content: "";
    height: 2rpx;
    position: absolute;
    background: transparent;
    transition: all ease 0.3s;
  }
  &.active {
    color: #0ab1c0;
    &::before {
      background: #0ab1c0;
    }
  }
}
</style>
