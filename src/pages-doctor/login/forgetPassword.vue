<template>
	<view style="padding-top: 12px;">
		<view class="box-shadow" style="margin:0 20rpx;margin-top: 0;background: #fff;overflow: hidden;">
			<uni-list class="inputWrap">
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">手机号</view>
						<input type="number" class="flex_1" maxlength="11" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入手机号" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">验证码</view>
						<input type="number" class="flex_1" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入验证码" />
					    <view class="getcode">
							<text v-if="passClick" @click="getcode">获取验证码</text>
							<text v-else>{{timecode}}s后重新获取</text>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">新密码</view>
						<input type="password" class="flex_1"  placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入新密码" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">新密码</view>
						<input type="password" class="flex_1"  placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请再次输入新密码" />
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<button class="submit_btn passwordBtn" type="primary">确定</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			timecode: 60,
			passClick:true
		};
	},
	methods: {
		getcode(){
			this.passClick = false
			this.reserveCode()
		},
		reserveCode() {
			var time = 60;
			var timer = setInterval(() => {
				this.timecode = time--;
				//60s后停止定时器
				if (this.timecode === 0) {
					this.passClick = true;
					this.timecode = 60;
					clearInterval(timer);
				}
			}, 1000);
		}
	}
};
</script>
<style lang="scss" scoped>
.tip {
	padding: 40rpx 15px;
	padding-bottom: 10rpx;
	font-size: 24rpx;
	color: #666;
}
.inputWrap {
	.title {
		margin-right: 98rpx;
		font-size: 30rpx;
		color: #666;
	}
	.getcode{
		color: $uni-color-primary;
	}
}
.passwordBtn{
	position: relative;
	margin-top: 30rpx;
	bottom: 0;
}
</style>