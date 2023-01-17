<template>
  <view class="leftTab" :style="styles">
    <view class="tabItem text-overflow" v-for="item in tabs" :key="item.key" :class="{ on: checked == item.key }" @click="change(item.key)">{{item.title}}</view>
  </view>
</template>

<script>
  export default{
    props:{
      active: String,
      tabs: Array,
      styles: String
    },

    data() {
      return {
        checked: ''
      }
    },
    watch:{
      active(){
        this.checked = this.active
      }
    },
    created() {
      this.checked = this.active
    },
    methods: {
      change(key) {
        this.checked = key
        this.$emit('change', key);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .leftTab{
    width: 160rpx;
    background: #fff;
    box-shadow: 0px 5rpx 20rpx 0px rgba(0, 0, 0, 0.15);
    border-radius: 0px 20rpx 0px 0px;
    position: fixed;
    left: 0;
    height: 100vh;
    top: 550rpx;
    z-index: 1;
    .tabItem{
      height: 48rpx;
      text-align: center;
      line-height: 48rpx;
      border-left: 4rpx solid #fff;
      font-size: 26rpx;
      color: #333;
      margin: 20rpx 0;
      padding: 0 10rpx;
      &.on{
        border-color: $uni-color-primary;
        color:$uni-color-primary ;
      }
    }
  }
</style>
