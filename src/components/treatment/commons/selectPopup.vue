<template>
  <view class="container">
    <view class="title">{{ title }}</view>
    <view v-if="list.length" class="flex-start-start body">
      <view
        class="item"
        :class="{ active: active(item) }"
        v-for="item in list"
        :key="item.value"
        @click="select(item)"
        >{{ item.label || item.value }}</view
      >
    </view>
    <view v-else :style="{ textAlign: 'center', padding: '12rpx 0' }">
      暂无数据
    </view>
    <view>
      <button class="button" type="default" @click.stop="confirm">确定</button>
    </view>
  </view>
</template>

<script>
import { choosePart } from '@/common/request/advice'
export default {
  props: {
    title: String,
    list: {
      type: Array,
      default: [],
    },
    // 支持 多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actives: [],
    }
  },
  watch: {
    list() {
      this.actives = this.list.filter(_ => _.checked)
    },
  },
  methods: {
    active(item) {
      return (
        this.actives.map(item => item.value).includes(item.value) ||
        item.checked
      )
    },
    select(item) {
      if (this.multiple) {
        const index = this.actives.map(item => item.value).indexOf(item.value)
        if (index > -1) {
          this.actives.splice(index, 1)
        } else {
          this.actives.push(item)
        }
      } else {
        this.actives = [item]
      }
    },
    confirm() {
      this.$emit('change', this.multiple ? this.actives : this.actives[0])
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 86vw;
  background-color: #fff;
  border-radius: 12rpx;
}

.title {
  padding: 20rpx 0;
  text-align: center;
  font-size: 30rpx;
  color: #1a1a1a;
}

.body {
  flex-wrap: wrap;
}

.item {
  margin: 20rpx 8rpx;
  min-width: 170rpx;
  height: 60rpx;
  line-height: 58rpx;
  padding: 4rpx 12rpx;
  border-radius: 40rpx;
  text-align: center;
  background-color: #f2f2f2;
  color: #333;

  &.active {
    background-color: $uni-color-primary;
    color: #fff;
  }
}

.button {
  margin-top: 12rpx;
  height: 100rpx;
  line-height: 98rpx;
  font-size: 30rpx;
  color: $uni-color-primary;

  &::after {
    border: none;
  }
}
</style>
