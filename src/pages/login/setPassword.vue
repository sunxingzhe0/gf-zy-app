<template>
	<view style="padding-top: 12px;">
		<view class="box-shadow" style="margin:0 20rpx;margin-top: 0;background: #fff;overflow: hidden;">
			<uni-list class="inputWrap">
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">新密码</view>
						<input type="password" class="flex_1" v-model="password" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入新密码" />
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">确认密码</view>
						<input type="password" class="flex_1" v-model="newpassword" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请再次输入新密码" />
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<button class="submit_btn passwordBtn" type="primary" @click="submit">确定</button>
		<view class="tiaoguo" @click="skip">跳过</view>
	</view>
</template>
<script>
	import {setPwd} from '@/common/request/index'
	import graceChecker from '@/common/graceChecker'
export default {
	data() {
		return {
			timecode: 60,
			passClick:true,
			password:'',
			newpassword:'',
			e:{}
		};
	},
	onLoad(options) {
		if(options.e){
			this.e = options.e
		}
	},
	methods: {
		skip(){
			this.$store.dispatch('loginInfo');
		},
		async submit(){
			if(!graceChecker.isPassword(this.password)){
				uni.showToast({
					icon:'none',
					title:'密码为6-18位，可用阿拉伯数字和英文字母'
				})
				return false
			}
			if(this.newpassword != this.password){
				uni.showToast({
					icon:'none',
					title:'两次输入的密码不一致'
				})
				return false
			}
			await setPwd({password:this.password})

			this.$store.dispatch('loginInfo');
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
		margin-right: 40rpx;
		font-size: 30rpx;
		color: #666;
    width: 150rpx;
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
.tiaoguo{
	font-size: 24rpx;
	color: $uni-color-primary;
	text-align: center;
	margin-top: 40rpx;
}
</style>
