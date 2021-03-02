<template>
	<view class="logisticsWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
		<view class="logTop">两个包裹已发出</view>
		<view class="orderWrap">
			<view class="oerderMain box-shadow" @click="goInfo">
				<view class="orderItem border0 flex-between font26 color666">
					<view>韵达快递：3510520029430</view>
					<view>已签收</view>
				</view>
				<view class="text-overflow font26">您已在重庆光电园店完成区间，感谢使用菜鸟驿站，…</view>
				<view class="orderItem border0">
					<view class="recipelInfo">
						<view class="recipelItem" v-for="(item, index) in 4" :key="index">
							<view class="flex-between">
								<view class="font26">1.盐酸美林他嗪片（规格：20mg*30）</view>
								<view class="font26 color666">医保：甲类</view>
							</view>
							<view class="colorred font26 paddingLeft16">口服 3天 每日3次 1.5mg/次 ￥8.9/盒x2</view>
							<view class="font24 color666 paddingLeft16">备注：这是一个备注有20个字。这是一个备注有20个</view>
						</view>
					</view>
					<view class="logNum font24 color666">共4件</view>
				</view>
			</view>
			<view class="oerderMain box-shadow" @click="goInfo">
				<view class="orderItem border0 flex-between font26 color666">
					<view>暂无</view>
					<view class="pricolor">仓库处理中</view>
				</view>
				<view class="text-overflow font26">暂时没有跟踪记录</view>
				<view class="orderItem border0">
					<view class="recipelInfo">
						<view class="recipelItem" v-for="(item, index) in 4" :key="index">
							<view class="flex-between">
								<view class="font26">1.盐酸美林他嗪片（规格：20mg*30）</view>
								<view class="font26 color666">医保：甲类</view>
							</view>
							<view class="colorred font26 paddingLeft16">口服 3天 每日3次 1.5mg/次 ￥8.9/盒x2</view>
							<view class="font24 color666 paddingLeft16">备注：这是一个备注有20个字。这是一个备注有20个</view>
						</view>
					</view>
					<view class="logNum font24 color666">共4件</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		methods:{
			goInfo(){
				uni.navigateTo({
					url:'/pages-user/logistics/logistics'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';
.pricolor{
	color:$uni-color-primary ;
}
.logisticsWrap {
	padding: 20rpx;
	.logTop {
		height: 80rpx;
		background: rgba(10, 178, 193, 0.1);
		color: $uni-color-primary;
		line-height: 80rpx;
		border-radius: 20rpx;
		padding: 0 30rpx;
	}
}
.orderWrap {
	margin-top: 20rpx;
	padding: 0;

	.oerderMain {
		padding-top: 20rpx;
		.logNum{
			text-align: right;
			padding: 30rpx 0;
		}
	}
}
</style>
