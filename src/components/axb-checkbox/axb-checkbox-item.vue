<template>
	<view class="radio" :class="{'radio-width-default':widthDefault}" :style="checked?activeStyle :itemStyle" @click="handleChange">
		{{name}}
	</view>
</template>

<script>

	/**
 * 防抖
 * @param {*} fun
 * @param {*} delay
 * @param {*} immediate
 */
const debounce = function (fun, delay, immediate) {
  var timer, lasttime, context, arg
  var later = function () {
    var now = new Date().getTime(),
      l = now - lasttime
    if (l < delay && l >= 0) {
      clearTimeout(timer)
      timer = setTimeout(later, delay - l)
    } else {
      clearTimeout(timer)
      timer = null
      if (!immediate) {
        fun.apply(context, arg)
        if (!timer) context = arg = null
      }
    }
  }
  return function () {
    context = this
    arg = arguments
    lasttime = new Date().getTime()
    var callNow = immediate && !timer
    if (!timer) timer=setTimeout(later, delay)
    if (callNow) {
      fun.apply(context, arg)
      context = arg = null
    }
  }
}
	export default {
		props: {
			name: {
				type: String,
				default: ''
			},
			value: {
				default: null,
			},
			checked: {
				type: [Boolean, Number],
				default: false
			},
		},
		computed: {
			widthDefault() {
				return this.name.length <= 3
			},
			activeStyle() {
				return `background: #0AB2C1;color: #fff;`
			},
			itemStyle() {
				return `background: #f2f2f2;color: #333;`
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleChange: debounce(handleChange, 200,true)
		}
	}

	function handleChange() {
		this.$emit('change', this.value)
	}
</script>

<style lang="scss">
	.radio {
		min-width: 160rpx;
		height: 60rpx;
    padding: 0 24rpx;
		border-radius:30rpx;
		background: #f2f2f2;
		color: #333;
		line-height: 60rpx;
		text-align: center;
    margin-right: 20rpx;
		margin-bottom: 30rpx;
	}

	.radio-width-default {
		text-align: center;
		padding: 0;
	}
</style>
