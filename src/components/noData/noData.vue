<template>
	<view class="nodata">
		<image :src="require('@/assets/nodata.png')"></image>
		<view class="text">暂无数据</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.nodata{
		padding: 60rpx 30rpx;
		image{
			width: 221rpx;
			height: 203rpx;
			display: block;
			margin: 0 auto;

		}
		.text{
			font-size: 26rpx;
			color: #999;
			margin-top: 30rpx;
			text-align: center;
		}
	}
</style>
