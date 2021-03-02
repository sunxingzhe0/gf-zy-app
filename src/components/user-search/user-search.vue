<template>
  <view style="padding: 20rpx;">
    <view class="layout">
      <input v-model="searchValue" class="input" :placeholder="placeholder" />
      <icon class="search" type="search" @click="search" size="15"></icon>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      placeholder: {
        type: String,
        default: function() {
          return '搜索'
        },

      }
    },
    data() {
      return {
        searchValue: ''
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchValue)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .layout {
    // margin: 20rpx;
    width: 710rpx;
    height: 72rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
    border-radius: 36rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .input {
    width: 600rpx;
    margin-left: 32rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 36rpx;
  }

  .search {
    margin-right: 30rpx;

  }
</style>
