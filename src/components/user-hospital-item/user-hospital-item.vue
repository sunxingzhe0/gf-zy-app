<template>
  <view class="range">
    <view class="hospital-title">
      <view class="title-img"></view>
      <text class="title-name">{{ title_name }}</text>
    </view>
    <view
      id="content"
      class="fload"
      :class="isFload ? '' : 'show'"
      v-html="`<span>${content}</span>`"
    >
    </view>
    <view @click="fload" class="operation" v-if="showExchangeButton">
      <text id="test">{{ isFload ? '展开' : '收起' }}</text>
      <image :src="isFload ? showImg : hideImg"></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title_name: String,
    content: String,
  },
  data() {
    return {
      isFload: true,
      hideImg: require('@/assets/hide.png'),
      showImg: require('@/assets/show.png'),

      // 是否显示展开收起按钮
      showExchangeButton: true,
      //1行高度
      lin_height: 0,
    }
  },

  mounted() {
    this.$nextTick(this.init)
  },

  methods: {
    showTotalIntro() {
      this.showTotal = !this.showTotal
    },
    fload() {
      //改变isFload的状态
      this.isFload = !this.isFload
    },

    init() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('#test')
        .boundingClientRect(data => {
          if (data) {
            this.lin_height = data.height
          }
        })
        .exec()
      uni
        .createSelectorQuery()
        .in(this)
        .select('#content')
        .boundingClientRect(data => {
          this.showExchangeButton = false
          if (data.height > this.lin_height * 2) {
            this.showExchangeButton = true
          }
        })
        .exec()
    },
  },
}
</script>

<style lang="scss" scoped>
.hospital-title {
  display: flex;
  align-items: center;
}

.title-name {
  margin-left: 10rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}

.title-img {
  width: 3rpx;
  height: 30rpx;
  background: rgba(10, 178, 193, 1);
}

.range {
  padding: 40rpx 30rpx;
  margin: 20rpx;
  width: 650rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 20rpx;
}

.fload {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* 要显示多少行就改变line-clamp的数据,此处折叠起来显示一行*/
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  font-size: 26rpx;
  color: rgba(102, 102, 102, 1);
}

.show {
  display: block;
}

.operation {
  margin-top: 30rpx;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 26rpx;
  font-weight: 500;
  color: rgba(10, 178, 193, 1);

  image {
    margin-left: 10rpx;
    width: 22rpx;
    height: 10rpx;
  }
}
</style>
