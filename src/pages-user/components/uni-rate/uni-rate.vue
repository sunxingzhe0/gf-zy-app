<template>
  <view>
    <view ref="uni-rate" class="uni-rate">
      <view
        class="uni-rate__icon"
        :style="{ 'margin-right': margin + 'px' }"
        v-for="(star, index) in stars"
        :key="index"
        @touchstart.stop="touchstart"
        @touchmove.stop="touchmove"
      >
        <uni-icons
          :color="color"
          :size="size"
          :type="isFill ? 'star-filled' : 'star'"
        />
        <!-- #ifdef APP-NVUE -->
        <view
          :style="{
            width: (star.activeWitch.replace('%', '') * size) / 100 + 'px',
          }"
          class="uni-rate__icon-on"
        >
          <uni-icons
            style="text-align: left;"
            :color="disabled ? '#ccc' : activeColor"
            :size="size"
            type="star-filled"
          />
        </view>
        <!-- #endif -->
        <!-- #ifndef APP-NVUE -->
        <view :style="{ width: star.activeWitch }" class="uni-rate__icon-on">
          <uni-icons
            :color="disabled ? disabledColor : activeColor"
            :size="size"
            type="star-filled"
          />
        </view>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom')
// #endif
import uniIcons from '@/components/uni-icons/uni-icons.vue'
/**
 * Rate 评分
 * @description 评分组件
 * @tutorial https://ext.dcloud.net.cn/plugin?id=33
 * @property {Boolean} 	isFill = [true|false] 		星星的类型，是否为实心类型, 默认为实心
 * @property {String} 	color 						未选中状态的星星颜色，默认为 "#ececec"
 * @property {String} 	activeColor 				选中状态的星星颜色，默认为 "#ffca3e"
 * @property {String} 	disabledColor 				禁用状态的星星颜色，默认为 "#c0c0c0"
 * @property {Number} 	size 						星星的大小
 * @property {Number} 	value/v-model 				当前评分
 * @property {Number} 	max 						最大评分评分数量，目前一分一颗星
 * @property {Number} 	margin 						星星的间距，单位 px
 * @property {Boolean} 	disabled = [true|false] 	是否为禁用状态，默认为 false
 * @property {Boolean} 	readonly = [true|false] 	是否为只读状态，默认为 false
 * @property {Boolean} 	allowHalf = [true|false] 	是否实现半星，默认为 false
 * @property {Boolean} 	touchable = [true|false] 	是否支持滑动手势，默认为 true
 * @event {Function} change 						uniRate 的 value 改变时触发事件，e={value:Number}
 */

export default {
  components: {
    uniIcons,
  },
  name: 'UniRate',
  props: {
    isFill: {
      // 星星的类型，是否镂空
      type: [Boolean, String],
      default: true,
    },
    color: {
      // 星星未选中的颜色
      type: String,
      default: '#ececec',
    },
    activeColor: {
      // 星星选中状态颜色
      type: String,
      default: '#ffca3e',
    },
    disabledColor: {
      // 星星禁用状态颜色
      type: String,
      default: '#c0c0c0',
    },
    size: {
      // 星星的大小
      type: [Number, String],
      default: 24,
    },
    value: {
      // 当前评分
      type: [Number, String],
      default: 1,
    },
    max: {
      // 最大评分
      type: [Number, String],
      default: 5,
    },
    margin: {
      // 星星的间距
      type: [Number, String],
      default: 0,
    },
    disabled: {
      // 是否可点击
      type: [Boolean, String],
      default: false,
    },
    readonly: {
      // 是否只读
      type: [Boolean, String],
      default: false,
    },
    allowHalf: {
      // 是否显示半星
      type: [Boolean, String],
      default: false,
    },
    touchable: {
      // 是否支持滑动手势
      type: [Boolean, String],
      default: true,
    },
  },
  data() {
    return {
      valueSync: '',
    }
  },
  watch: {
    value(newVal) {
      this.valueSync = Number(newVal)
    },
  },
  computed: {
    stars() {
      const value = this.valueSync ? this.valueSync : 0
      const starList = []
      const floorValue = Math.floor(value)
      const ceilValue = Math.ceil(value)
      for (let i = 0; i < this.max; i++) {
        if (floorValue > i) {
          starList.push({
            activeWitch: '100%',
          })
        } else if (ceilValue - 1 === i) {
          starList.push({
            activeWitch: (value - floorValue) * 100 + '%',
          })
        } else {
          starList.push({
            activeWitch: '0',
          })
        }
      }
      return starList
    },
  },
  created() {
    this.valueSync = Number(this.value)
    this._rateBoxLeft = 0
    this._oldValue = null
  },
  mounted() {
    setTimeout(() => {
      this._getSize()
    }, 100)
  },
  methods: {
    touchstart(e) {
      if (this.readonly || this.disabled) return
      const { clientX, screenX } = e.changedTouches[0]
      // TODO 做一下兼容，只有 Nvue 下才有 screenX，其他平台式 clientX
      this._getRateCount(clientX || screenX)
    },
    touchmove(e) {
      if (this.readonly || this.disabled || !this.touchable) return
      const { clientX, screenX } = e.changedTouches[0]
      this._getRateCount(clientX || screenX)
    },
    /**
     * 获取星星个数
     */
    _getRateCount(clientX) {
      const rateMoveRange = clientX - this._rateBoxLeft
      const index = parseInt(rateMoveRange / (this.size + this.margin))
      const range = parseInt(rateMoveRange - (this.size + this.margin) * index)
      let value = 0

      if (this.allowHalf) {
        if (range > this.size / 2) {
          value = index + 1
        } else {
          value = index + 0.5
        }
      } else {
        value = index + 1
      }

      value = Math.max(0.5, Math.min(value, this.max))
      if (this.valueSync !== value) {
        this.valueSync = value
        this._onChange()
      }
      // const rateCount = parseInt(rateMoveRange / (this.size / 2)) + 1
    },

    /**
     * 触发动态修改
     */
    _onChange() {
      this.$emit('input', this.valueSync)
      this.$emit('change', {
        value: this.valueSync,
      })
    },
    /**
     * 获取星星距离屏幕左侧距离
     */
    _getSize() {
      // #ifndef APP-NVUE
      uni
        .createSelectorQuery()
        .in(this)
        .select('.uni-rate')
        .boundingClientRect()
        .exec(ret => {
          if (ret) {
            this._rateBoxLeft = ret[0].left
          }
        })
      // #endif
      // #ifdef APP-NVUE
      dom.getComponentRect(this.$refs['uni-rate'], ret => {
        const size = ret.size
        if (size) {
          this._rateBoxLeft = size.left
        }
      })
      // #endif
    },
  },
}
</script>

<style lang="scss" scoped>
.uni-rate {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  line-height: 1;
  font-size: 0;
  flex-direction: row;
}

.uni-rate__icon {
  position: relative;
  line-height: 1;
  font-size: 0;
}

.uni-rate__icon-on {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 1;
  text-align: left;
}
</style>
