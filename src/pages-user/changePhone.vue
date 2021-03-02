<template>
	<view>
    <!--主页按钮-->
    <homeIcom />
		<view class="tip">请输入新的手机号，填写验证码</view>
		<view class="box-shadow" style="margin: 0 30rpx; background: #fff; overflow: hidden;margin-top: 20rpx;">
			<uni-list class="inputWrap">
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">手机号</view>
						<input type="number" v-model="phone" class="flex_1" maxlength="11" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入手机号码" />
					</view>
				</uni-list-item>
				<uni-list-item :show-arrow="false">
					<view class="flex-between">
						<view class="title">验证码</view>
						<input type="number" v-model="code" class="flex_1" placeholder-style="color:#ccc;font-size: 30rpx;" placeholder="请输入验证码" />
						<view class="getcode">
							<text v-if="passClick" @click="getcode">获取验证码</text>
							<text v-else>{{ timecode }}s后重新获取</text>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<button class="submit_btn" type="primary" @click="submit">提交</button>
	</view>
</template>

<script>
import { resetPhone, verificationCode, finishResetPhone } from '@/common/request/index';
export default {
	data() {
		return {
			timecode: 60,
			phone:this.$store.state.userInfo.prestorePhone,
			code:'',
			passClick: true
		};
	},
	created() {
		if(!this.$store.state.userInfo.phone){
			uni.setNavigationBarTitle({
				title: '绑定手机号'
			});
		}
	},
	methods: {
		async submit() {
			if (this.phone == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return false;
			}
			if (this.code == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入验证码'
				});
				return false;
			}
			let res = await resetPhone({ phone: this.phone, code: this.code });
			if (res) {
				this.getfinishResetPhone(res);
			}
		},
		// 人脸识别回调
		async getfinishResetPhone(bizToken) {
			let res = await finishResetPhone({ bizToken: bizToken });
			if (res) {
				await this.$store.dispatch('loginInfo', true);
        uni.showToast({
          title: '修改成功！'
        })
        setTimeout(()=>{
          uni.navigateBack({
          	delta: 1
          });
        },600)

			}
		},
		getcode() {
			if (this.phone == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return false;
			}
			verificationCode({ phone: this.phone, type: 'BINDING' }).then(res => {
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
		margin-right: 98rpx;
		font-size: 30rpx;
		color: #666;
	}
	.getcode {
		color: $uni-color-primary;
	}
}
</style>
