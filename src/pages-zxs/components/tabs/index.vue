<template>
  <scroll-view scroll-x>
    <view class="tabs">
      <view
        v-for="(item, i) in tabList"
        :key="i"
        class="list-item flex"
        :class="active === i ? (!styles ? 'active' : 'active-bg') : ''"
        :style="styles"
        @click="handelClick(item, i)"
      >
        {{ item.title }}
        <text v-if="item.num" class="num flex-center">({{ item.num }})</text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
/**
 * @props tabList   ---选项列表
 *        styles    ---单项样式
 * @emits click     ---选中tab
 */

export default {
  props: {
    tabList: Array,
    styles: String,
  },
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    handelClick(item, i) {
      this.$emit("click", item);
      this.active = i;
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 92vw;
  padding: 0rpx 30rpx;
  display: flex;
  justify-content: space-between;
}
.list-item {
  font-size: 26rpx;
  padding: 20rpx;
  margin-right: 30rpx;
  white-space: nowrap;
  position: relative;
}
.active {
  font-weight: bold;
  color: #0ab2c1;
  border-bottom: 4rpx solid $uni-color-primary;
}
.active-bg {
  /* font-size: 26rpx !important; */
  font-weight: bold;
  border-bottom: 6rpx solid $uni-color-primary;
}

/* .num {
  position: absolute;
  top: -8rpx;
  right: -12rpx;
  width: 24rpx;
  height: 24rpx;
  background: #ff4c4c;
  border-radius: 50%;
  color: #fff;
  font-size: 16rpx;
  text-align: center;
} */
</style>
