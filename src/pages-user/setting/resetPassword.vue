<template>
	<view style="padding-top: 30rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
		<view class="box-shadow" style="margin: 0 30rpx; background: #fff; overflow: hidden;">
			<uni-list class="inputWrap">
				<uni-list-item :show-arrow="false">
					<view class="flex-start-center">
						<view class="title">手机号</view>
						<view>{{ util.noPassByMobile(userInfo.phone) }}</view>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">验证码</view>
						<input type="number" v-model="form.code" class="flex_1" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入验证码" />
					    <view class="getcode">
							<text v-if="passClick" @click="getcode">获取验证码</text>
							<text v-else>{{timecode}}s后重新获取</text>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">新密码</view>
						<input type="password" v-model="form.password" class="flex_1" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入新密码" />
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">确认密码</view>
						<input type="password" v-model="newPassword" class="flex_1" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请确认密码" />
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<button class="submit_btn" type="primary" @click="submit">确定</button>
	</view>
</template>

<script>
	import util from '@/common/util';
	import {verificationCode,resetPwd } from '@/common/request/index'
	import graceChecker from '@/common/graceChecker'
export default {
	data() {
		return {
			util:util,
			timecode: 60,
			passClick:true,
			form:{
				phone:this.$store.state.userInfo.phone,
				password:'',
				code:''
			},
			newPassword:''
		};
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo
		}
	},
	methods: {
		async submit() {
			if(!graceChecker.isPassword((this.form.password))){
				uni.showToast({
					icon:'none',
					title:'密码为6-18位，可用阿拉伯数字和英文字母'
				})
				return false
			}
			if (this.form.password != this.newPassword) {
				uni.showToast({
					icon: 'none',
					title: '两次输入的密码不一致'
				});
				return false;
			}
			if (this.form.code == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入验证码'
				});
				return false;
			}
			let res = await resetPwd(this.form);
			if (res) {
				this.$store.dispatch('signOut');
			}
		},
		getcode() {
			verificationCode({ phone: this.userInfo.phone, type: 'RESET_PASSWORD' }).then(res => {
        this.passClick = false;
        this.reserveCode();
				uni.showToast({
					icon: 'none',
					title: '发送成功'
				});
			});
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
		width: 150rpx;
		font-size: 30rpx;
		color: #666;
	}
	.getcode{
		color: $uni-color-primary;
	}
}

</style>
