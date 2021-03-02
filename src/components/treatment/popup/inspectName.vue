<template>
  <view class="container">
    <view class="keyword">
      <input
        class="input"
        type="text"
        confirm-type="search"
        placeholder="请输入检验名称关键字查找"
        @input="e => (this.query = e.detail.value)"
        @confirm="e => (this.query = e.detail.value)"
      />
      <view class="iconfont icon-sousuo"></view>
    </view>
    <scroll-view class="departments" scroll-y>
      <uni-list>
        <uni-list-item
          v-for="item in list"
          :key="item.id"
          :title="item.name"
          :showArrow="false"
          clickable
          @click.stop="clickHandler(item)"
        ></uni-list-item>
      </uni-list>
    </scroll-view>
  </view>
</template>

<script>
import { chooseList } from '@/common/request/advice'
export default {
  components: {},
  props: {
    chooseList: Array,
  },
  data() {
    return {
      query: '',
    }
  },
  computed: {
    list() {
      return this.chooseList
        .filter(_ => _.itemName.indexOf(this.query) > -1)
        .map(_ => ({ name: _.itemName, id: _.itemId }))
    },
  },
  methods: {
    clickHandler(val) {
      this.$emit('change', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 90vh;
  padding-top: 20rpx;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  background: #f2f2f2;
}

.keyword {
  width: 710rpx;
  height: 72rpx;
  display: flex;
  margin: 20rpx auto;
  align-items: center;
  border-radius: 36rpx;
  background: #ffffff;
  box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);

  .input {
    flex: 1;
    height: 72rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 72rpx;
    margin-left: 20rpx;
    font-family: PingFang SC;
  }

  .icon-sousuo {
    width: 30rpx;
    height: 30rpx;
    margin: 0 20rpx;
    display: flex;
    align-items: center;
  }
}

.departments {
  height: 88%;
  flex: 1;
  background: #fff;
}

.list-item {
  height: 90rpx;
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  flex-direction: column;
  transition: all ease 0.3s;

  &.expand {
    height: auto;

    .item-row {
      border-bottom: none;
    }

    .icon-jiantou::before {
      transform: rotate(0);
    }
  }

  .item-row {
    height: 90rpx;
    display: flex;
    margin-left: 30rpx;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
  }

  .item-children {
    background: #f2f2f2;
  }

  .item-child {
    height: 90rpx;
    margin-left: 30rpx;
    text-indent: 60rpx;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
  }

  .item-text {
    color: #333333;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 90rpx;
    font-family: PingFang SC;
  }

  .icon-jiantou {
    display: flex;
    align-items: center;
    padding-right: 28rpx;

    &::before {
      color: #656565;
      transform: rotate(-90deg);
      transition: all ease 0.3s;
    }
  }
}
</style>
