<template>
  <view class="range">
    <view class="hospital-title">
      <view class="title-img"></view>
      <text class="title-name">{{ title_name }}</text>
    </view>
    <view id="content">
      <rich-text
        class="content"
        :class="{ hide: showExchangeButton, show: !isFload }"
        :nodes="nodes"
      />
    </view>
    <view class="operation" v-if="showExchangeButton" @click="fload">
      <text id="test">{{ isFload ? '展开' : '收起' }}</text>
      <image
        :src="
          isFload ? require('@/assets/show.png') : require('@/assets/hide.png')
        "
      ></image>
    </view>
  </view>
</template>

<script>
import parseHtml from './parseHtml'
export default {
  props: {
    title_name: String,
    content: String,
    isOpen:Number
  },
  data() {
    return {
      isFload: true,
      // 是否显示展开收起按钮
      showExchangeButton: false,
    }
  },
  created(){
    this.isOpen&&(this.isFload=false)
  },
  mounted() {
    this.$nextTick(this.init)

  },
  computed: {
    nodes() {
      return parseHtml(this.content)
    },
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
        .select('#content')
        .boundingClientRect(data => {
          this.showExchangeButton = data.height > 90
        })
        .exec()
    },
  },
}
</script>

<style lang="less" scoped>
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

.content {
  display: block;
  overflow: hidden;
  font-size: 26rpx;
  color: rgba(102, 102, 102, 1);

  &.hide {
    height: 90px;
  }
  &.show {
    height: auto;
  }
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
