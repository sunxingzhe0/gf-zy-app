<template>
  <uni-popup ref="popup" type="center" :maskClick="false">
    <view class="selectWrap">
      <view class="title">{{ title }}</view>
      <scroll-view scroll-y="true" class="scroll">
        <view class="selectMain">
          <view
            @click="selecList(item)"
            class="flex-between list-item"
            v-for="(item, index) in list"
            :key="index"
          >
            <view>
              <view class="hosname">{{ item.hospName || '-' }}</view>
              <view class="list-item-icon">
                <image
                  class="list-icon"
                  :src="require('@/pages-zy/images/dizhi.png')"
                  style="width: 22rpx;height: 20rpx; margin-right:5px"
                  mode="widthFix"
                ></image>
                <view>{{ item.addr || '-' }}</view>
              </view>
              <view class="list-item-icon">
                <image
                  class="list-icon"
                  :src="require('@/pages-zy/images/31dianhua.png')"
                  style="width: 22rpx;height: 20rpx;margin-right:5px"
                  mode="widthFix"
                ></image>
                <view>{{ item.telNo || '-' }}</view>
              </view>
              <view class="list-item-icon" v-if="item.hospCode === '450388620'">
                <view style="white-space: nowrap"
                  >核酸采集点电话：023-67411298/13983427617</view
                >
              </view>
            </view>
            <uni-icons
              type="arrowright"
              size="14"
              class="rightIcon"
            ></uni-icons>
          </view>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'popSelect',
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
    },
  },
  methods: {
    open() {
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
    selecList(item) {
      this.$emit('selecList', item)
      this.$refs.popup.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.selectWrap {
  width: 700rpx;
  border-radius: 20rpx;
  background: #fff;
  padding: 40rpx 0;
  padding-bottom: 0;
  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .scroll {
    box-sizing: border-box;
    .selectMain {
      padding: 30rpx;
      padding-bottom: 0;
      border-radius: 5px;
      .list-item {
        padding: 15px;
        background-color: #f2f2f2;
        margin-bottom: 15px;
        .hosname {
          font-size: 17px;
          font-weight: bold;
        }
        .list-item-icon {
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .selectbtn {
    border-top: 1px solid #e6e6e6;
    padding: 30rpx;
    color: $uni-color-primary;
    width: 100%;
    font-size: 32rpx;
    text-align: center;
    box-sizing: border-box;
  }
}
.other {
  margin: 40rpx 30rpx 30rpx 30rpx;
  position: relative;
  font-size: 28rpx;
  padding-left: 20rpx;
  &::before {
    content: '';
    width: 4rpx;
    height: 28rpx;
    background: $uni-color-primary;
  }
}
</style>
