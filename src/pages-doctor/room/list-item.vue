<template>
  <view>
    <view
      class="app-card"
      :class="{ finish: item.status == 'FINISH' }"
      @click="navigate(item.orderId)"
    >
      <view class="status-sign wait" v-if="item.status == 'APPOINTMENT'"
        >预约中</view
      >
      <view class="status-sign wait" v-else-if="item.status == tabs[0].key"
        >待接诊</view
      >
      <view class="status-sign ing" v-else-if="item.status == tabs[1].key"
        >接诊中</view
      >
      <view class="status-sign end" v-else-if="item.status == tabs[2].key"
        >已结束</view
      >
      <view class="flex-start-start">
        <view class="avatar-wrapper" style="flex-shrink: 0;">
          <image
            class="avatar"
            :src="FILE_URL(item.avatar)"
            mode="aspectFit"
          ></image>
          <view class="unreadmessage" v-if="item.unReadMessage">{{
            item.unReadMessage
          }}</view>
        </view>
        <view class="ml-20">
          <view>
            <text class="username">{{ item.memberName }}</text>
            <text class="tag" :class="item.bizType ? 'video' : 'text'">{{
              item.bizTypeName
            }}</text>
          </view>

          <view class="">{{
            item.bizType ? item.createTime : item.createTime
          }}</view>
          <view v-if="item.countDown" style="color: #e45c5c;"
            >距离{{
              item.status == 'APPOINTMENT'
                ? '复诊开始'
                : item.status == 'IN_TREAT'
                ? '服务结束'
                : '诊室关闭'
            }}还剩：{{ item.countDown }}</view
          >
          <view v-if="item.diagnose" style="width: 74vw;">
            历史诊断：
            <text style="color: #1A1A1A;">{{ item.diagnose }}</text>
          </view>
          <view id="desc" class="desc" :class="{ nowrap: !show }">
            {{ item.illnessDesc }}
          </view>
          <template v-if="item.pic.length">
            <view v-show="show">
              <image
                v-for="ite in item.pic"
                :key="ite"
                class="diagnosis-image"
                :src="FILE_URL(ite)"
                mode="aspectFit"
              ></image>
            </view>
          </template>
        </view>
      </view>
      <view
        v-if="showExpandButton"
        @click.stop="show = !show"
        class="text-center"
        :style="{ marginTop: '20rpx' }"
      >
        <image
          :class="{ reverse: show }"
          :src="require('@/assets/zhankai@2x.png')"
          class="icon-expand"
          mode="aspectFit"
          :style="{ width: '36rpx', height: '24rpx' }"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      show: true,
      showExpandButton: false,
    }
  },
  onReady() {
    this.$nextTick(() => {
      uni
        .createSelectorQuery()
        .in(this)
        .select('#desc')
        .boundingClientRect(data => {
          this.show = data.height < 26
          this.showExpandButton = data.height >= 26
        })
        .exec()
    })
  },
  methods: {
    navigate(orderId) {
      uni.navigateTo({
        url: `/pages-doctor/chat/chat?orderId=${orderId}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-card {
  position: relative;
  overflow: hidden;
  margin-top: 12rpx;
  padding-bottom: 0;
  color: #666;

  &.finish {
    background-color: #f8f8f8;
  }
}

.status-sign {
  position: absolute;
  right: -36rpx;
  top: -24rpx;
  width: 140rpx;
  height: 110rpx;
  line-height: 130rpx;
  border-radius: 50%;
  text-align: center;
  transform: rotate(0.1turn);

  &.wait {
    background-color: rgba(10, 178, 193, 0.1);
    color: #0ab2c1;
  }

  &.ing {
    background-color: #0ab2c1;
    color: #fff;
  }

  &.end {
    background-color: #ccc;
    color: #fff;
  }
}

.avatar-wrapper {
  position: relative;
  width: 100rpx;
  height: 100rpx;
}

.unreadmessage {
  position: absolute;
  top: 0;
  right: 0;
  width: 32rpx;
  height: 32rpx;
  line-height: 30rpx;
  border-radius: 50%;
  text-align: center;
  background-color: #e35b5b;
  font-size: 24rpx;
  color: #fff;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.username {
  font-weight: bolder;
  font-size: 32rpx;
  color: #1a1a1a;
}

.tag {
  margin-left: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  font-size: 20rpx;

  &.video {
    background: rgba(10, 96, 193, 0.1);
    color: #0a60c1;
  }

  &.text {
    background: rgba(10, 178, 193, 0.1);
    color: $uni-color-primary;
  }

  &.call {
    background: rgba(115, 70, 217, 0.1);
    color: #7346d9;
  }
}

.diagnosis-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.icon-expand {
  width: 60rpx;
  height: 40rpx;
  margin: auto;
}
.desc {
  width: 74vw;
  overflow: hidden;
  text-overflow: ellipsis;

  &.nowrap {
    white-space: nowrap;
  }
}
</style>
