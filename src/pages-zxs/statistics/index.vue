<template>
  <view class="page-statis">
    <view class="top-bar">
      <view class="left">
        <image :src="FILE_URL(userInfo.avatar)" class="avatar"></image>
        <text class="doc-name">{{ userInfo.username }}</text>
        <text class="dept">{{ userInfo.deptName }}</text>
      </view>
      <view class="right">
        <view
          class="mini-btn"
          @click="changeActive(0)"
          :class="active === 0 ? 'active' : ''"
          >心咨预约</view
        >
        <view
          class="mini-btn"
          @click="changeActive(1)"
          :class="active === 1 ? 'active' : ''"
          >团体业务</view
        >
      </view>
    </view>
    <Register v-if="active === 0" />
    <Group v-else />
  </view>
</template>

<script>
import Register from './register.vue'
import Group from './group.vue'
export default {
  data() {
    return {
      active: 0,
      userInfo: uni.getStorageSync('userInfo'),
    }
  },
  components: {
    Register,
    Group,
  },
  methods: {
    //切换筛选类型
    changeActive(type) {
      this.active = type
    },
  },
}
</script>

<style lang="scss" scoped>
.page-statis {
  padding: 155rpx 20rpx 0 20rpx;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  align-items: center;
  z-index: 9999;
  .left {
    display: flex;
    align-items: center;
    .avatar {
      width: 74rpx;
      height: 74rpx;
      border-radius: 50%;
      background-color: #f2f2f2;
    }
    .doc-name {
      font-size: 30rpx;
      color: #1a1a1a;
      margin: 0 20rpx;
    }
    .dept {
      font-size: 24rpx;
      color: #4d4d4d;
    }
  }
  .right {
    display: flex;
    align-items: center;
    background: #f1f1f1;
    border-radius: 6rpx;
    height: 56rpx;
    border: 1px solid #f1f1f1;
    .mini-btn {
      width: 140rpx;
      height: 56rpx;
      border-radius: 5rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      color: #4d4d4d;
    }
    .active {
      background-color: #fff;
      color: #0ab2c1;
    }
  }
}
</style>
