<template>
  <view>
    <view
      class="fixedView icon"
      @longpress.stop="touchIcon"
      @touchmove.stop.prevent="moveIcon"
      @tap.stop="tapIcon"
      :style="{
        left: iconPosition.left + 'px',
        top: iconPosition.top + 'px',
        width: iconSize.width + 'rpx',
        height: iconSize.height + 'rpx',
      }"
    >
      <image
        :src="iconPath || icon_path"
        :style="{
          width: iconSize.width + 'rpx',
          height: iconSize.height + 'rpx',
        }"
        mode="aspectFill"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      screenHeight: uni.getSystemInfoSync().screenHeight,
      icon_path:
        'data:image/png;base64,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',
      windowSize: {
        width: 0,
        height: 0,
        margin: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      iconSize: {
        width: 100,
        height: 100,
      },
      iconPosition: {
        left: 0,
        top: 0,
        touchPostion: {
          x: 0,
          y: 0,
        },
      },
    }
  },
  props: {
    startPostion: {
      type: Number,
      default: 0,
    },
    iconWidth: {
      type: Number,
      default: 100,
    },
    iconHeight: {
      type: Number,
      default: 100,
    },
    marginLeft: {
      type: Number,
      default: 10,
    },
    marginRight: {
      type: Number,
      default: 10,
    },
    marginTop: {
      type: Number,
      default: 10,
    },
    marginBottom: {
      type: Number,
      default: 10,
    },
    iconPath: {
      type: String,
      default: '',
    },
    /*tapFunction:{
				type:Function,
				default:this.tapIcon
			}*/
  },
  mounted() {
    this.$set(this.iconSize, 'width', this.iconWidth)
    this.$set(this.iconSize, 'height', this.iconHeight)
    this.$set(this.windowSize.margin, 'left', this.marginLeft)
    this.$set(this.windowSize.margin, 'right', this.marginRight)
    this.$set(this.windowSize.margin, 'top', this.marginTop)
    this.$set(this.windowSize.margin, 'bottom', this.marginBottom)
    this.$set(this.windowSize, 'width', uni.getSystemInfoSync().windowWidth)
    this.$set(this.windowSize, 'height', uni.getSystemInfoSync().windowHeight)
    switch (this.startPostion) {
      case 1:
        //初始位置左上角
        this.$set(this.iconPosition, 'left', this.windowSize.margin.left)
        this.$set(this.iconPosition, 'top', this.windowSize.margin.top)
        break
      case 2:
        //初始位置右上角
        this.$set(
          this.iconPosition,
          'left',
          this.windowSize.width -
            uni.upx2px(this.iconSize.width) -
            this.windowSize.margin.right,
        )
        this.$set(this.iconPosition, 'top', this.windowSize.margin.top)
        break
      case 3:
        //初始位置左下角
        this.$set(this.iconPosition, 'left', this.windowSize.margin.left)
        this.$set(
          this.iconPosition,
          'top',
          this.windowSize.height -
            uni.upx2px(this.iconSize.height) -
            this.windowSize.margin.bottom,
        )
        break
      case 4:
        //初始位置右下角
        this.$set(
          this.iconPosition,
          'left',
          this.windowSize.width -
            uni.upx2px(this.iconSize.width) -
            this.windowSize.margin.right,
        )
        this.$set(
          this.iconPosition,
          'top',
          this.windowSize.height -
            uni.upx2px(this.iconSize.height) -
            this.windowSize.margin.bottom,
        )
        break
      default:
        //初始位置左居中
        this.$set(this.iconPosition, 'left', this.windowSize.margin.left)
        this.$set(this.iconPosition, 'top', this.screenHeight / 2)
    }
  },
  methods: {
    touchIcon(e) {
      this.$set(this.iconPosition.touchPostion, 'x', e.touches[0].clientX)
      this.$set(this.iconPosition.touchPostion, 'y', e.touches[0].clientY)
    },
    moveIcon(e) {
      this.$set(
        this.iconPosition,
        'left',
        e.touches[0].clientX - uni.upx2px(this.iconSize.width / 2),
      )
      this.$set(
        this.iconPosition,
        'top',
        e.touches[0].clientY - uni.upx2px(this.iconSize.height / 2),
      )

      this.$set(
        this.iconPosition,
        'left',
        Math.min(
          this.windowSize.width -
            uni.upx2px(this.iconSize.width) -
            this.windowSize.margin.right,
          this.iconPosition.left,
        ),
      )
      this.$set(
        this.iconPosition,
        'left',
        Math.max(this.windowSize.margin.left, this.iconPosition.left),
      )
      this.$set(
        this.iconPosition,
        'top',
        Math.min(
          this.windowSize.height -
            uni.upx2px(this.iconSize.height) -
            this.windowSize.margin.bottom,
          this.iconPosition.top,
        ),
      )
      this.$set(
        this.iconPosition,
        'top',
        Math.max(this.windowSize.margin.top, this.iconPosition.top),
      )
    },
    tapIcon(e) {
      console.log('you tap icon')
      this.$emit('tapIcon')
    },
  },
}
</script>

<style scoped lang="scss">
.fixedView {
  position: fixed;
  z-index: 200;
}

.icon {
  border-radius: 50%;
  overflow: hidden;
  border: none;
}
</style>
