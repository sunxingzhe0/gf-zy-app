<template>
  <view class="total-wrap" :style="{ marginTop: isMainNode ? '22rpx' : '6rpx' }">
    <view class="node-container">
      <view class="node-container-left">
        <view class="tag-container">
          <view v-if="nodeData.status == 'COMPLETE'" class="log-complete" :class="{active: isNewest}">收</view>
          <img v-else-if="isMainNode" :src="nodeIconUrl" />
          <view v-else class="node-tag-container"><view class="node-tag"></view></view>
        </view>
        <view class="line-container" :style="{ height: isMainNode ? '142rpx' : '88rpx', paddingTop: isMainNode ? '22rpx' : '8rpx' }">
          <view v-if="!isFirst" class="line" :style="{ height: isMainNode ? '120rpx' : '80rpx' }"></view>
        </view>
      </view>
      <view class="node-container-right" :style="{ paddingTop: isMainNode ? '0' : '8rpx' }">
        <view v-if="isMainNode" class="node-title" :style="{ color: isNewest ? '#222' : '#999' }">{{ nodeData.statusName }}</view>
        <view class="node-desc" :style="{ color: isNewest ? '#4b4b4b' : '#999', marginTop: isMainNode ? '10rpx' : '0' }">
          {{ acceptStationFixed }}
          <text v-if="nodeData.phone" class="node-phone">{{ nodeData.phone }}</text>
        </view>
        <view class="node-time">{{ nodeData.createTime }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    isNewest: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isMainNode: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      default() {
        return {
          status: '',
          statusName: '',
          createTime: '2019-01-01 00:00:00',
          acceptStation: 'xxxxxx'
        };
      }
    }
  },
  computed: {
    nodeIconUrl() {
      if (this.nodeData.status === 'WATTING_PAY') {
        // 待付款
        return this.isNewest ? require('./images/ic-order-commit.png') : require('./images/ic-order-commit-G.png');
      } else if (this.nodeData.status === 'PAYED') {
        // 待发货
        return this.isNewest ? require('./images/ic-paied.png') : require('./images/ic-paied-G.png');
      } else if (this.nodeData.status === 'SHIP') {
        // 已发货
        return this.isNewest ? require('./images/ic-pacakaging.png') : require('./images/ic-pacakaging-G.png');
      } else if (this.nodeData.status === 'STORE') {
        // 已出库
        return require('./images/ic-store-G.png');
      } else if (this.nodeData.status === 'WATTING_DELIVER') {
        // 已揽件
        return require('./images/ic-sending-G.png');
      } else if (this.nodeData.status === 'DELIVERING') {
        // 运输中
        return this.isNewest ? require('./images/ic-sending.png') : require('./images/ic-sending-G.png');
      }
    },
    acceptStationFixed() {
      if (!this.nodeData.acceptStation) return '';
      return this.nodeData.acceptStation.replace(/(\d{3})\d{4}(\d{4})/, '');
    }
  }
};
</script>
<style lang="scss" scoped>
.log-complete {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  text-align: center;
  background-color: #cdcdcd;
  color: #fff;

  &.active {
    background-color: $uni-color-primary;
  }
}
.total-wrap {
  margin-top: 22rpx;
  width: 100%;
  .node-container {
    width: 100%;
    height: auto;
    display: flex;
    &-left {
      width: 44rpx;
      height: auto;
      .tag-container {
        width: 44rpx;
        height: 44rpx;
        img {
          width: 44rpx;
          height: 44rpx;
        }
        .node-tag-container {
          width: 44rpx;
          height: 44rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .node-tag {
            width: 14rpx;
            height: 14rpx;
            background-color: #dcdcdc;
            border-radius: 50%;
          }
        }
      }
      .line-container {
        box-sizing: border-box;
        width: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .line {
          width: 2rpx;
          background-color: #dcdcdc;
        }
      }
    }
    &-right {
      flex: 1;
      box-sizing: border-box;
      padding: 0 10rpx 0 24rpx;
      .node-title {
        width: 100%;
        height: 40rpx;
        line-height: 44rpx;
        color: #222;
        font-size: 28rpx;
        font-family: 'PingFangSC-Medium';
      }
      .node-desc {
        margin-top: 16rpx;
        width: 100%;
        min-height: 30rpx;
        line-height: 30rpx;
        color: #222;
        font-size: 24rpx;
        font-family: 'PingFangSC-Regular';
        word-wrap: break-word;
        word-break: normal;
      }
      .node-phone {
        margin-top: 8rpx;
        width: 100%;
        height: 26rpx;
        line-height: 26rpx;
        color: #fe4e2c;
        font-size: 26rpx;
        font-family: 'Avenir-Medium';
      }
      .node-time {
        margin-top: 12rpx;
        width: 100%;
        height: 34rpx;
        line-height: 34rpx;
        color: #999;
        font-size: 24rpx;
        font-family: 'Avenir-Book';
      }
    }
  }
}
</style>
