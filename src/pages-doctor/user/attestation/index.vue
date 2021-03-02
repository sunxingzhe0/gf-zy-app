<template>
	<view class="addWrap">
    <!--主页按钮-->
    <homeIcom />
		<view class="step">
			<view class="flex-between">
				<!-- <view :class="[active >= 0 ? 'on' : '', 'step_item']">
					<view class="step_num">1</view>
					<view class="step_title">手机验证</view>
				</view> -->
				<view :class="[active >= 1 ? 'on' : '', 'br']"></view>
				<view :class="[active >= 1 ? 'on' : '', 'step_item']">
					<view class="step_num">1</view>
					<view class="step_title">身份验证</view>
				</view>
				<view :class="[active >= 2 ? 'on' : '', 'br']"></view>
				<view :class="[active >= 2 ? 'on' : '', 'step_item']">
					<view class="step_num">2</view>
					<view class="step_title">人脸识别</view>
				</view>
			</view>
		</view>
		<view class="box-shadow" style="background: #fff;overflow: hidden; margin: 20rpx;">
			<!-- <uni-list class="inputWrap" v-if="active == 0">
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							手机号
							<text class="red">*</text>
						</view>
						<input type="number" v-model="form.phone" class="flex_1" maxlength="11" placeholder-class="input_pla" placeholder="请输入手机号码" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							验证码
							<text class="red">*</text>
						</view>
						<input type="number" class="flex_1" v-model="form.code" placeholder-class="input_pla" placeholder="请输入验证码" />
						<view class="getcode">
							<text v-if="passClick" @click="getcode">获取验证码</text>
							<text v-else>{{ timecode }}s后重新获取</text>
						</view>
					</view>
				</uni-list-item>
			</uni-list> -->
			<uni-list class="inputWrap" v-if="active == 1">
        <!-- style="padding-left: 0;" -->
				<uni-list-item  :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							姓名
							<text class="red">*</text>
						</view>
						<input v-model="form.name" class="flex_1" placeholder-class="input_pla" placeholder="请输入姓名" />
					</view>
				</uni-list-item>
        <!-- style="padding-left: 0;" -->
				<uni-list-item  :show-arrow="false">
					<view class="flex-between">
						<view class="title">
							身份证
							<text class="red">*</text>
						</view>
						<input v-model="form.idCard" type="idcard" class="flex_1" placeholder-class="input_pla" placeholder="请输入身份证" />
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<button class="submit_btn next" @click="next" type="primary" v-if="active < 2">下一步</button>
		<button class="submit_btn" v-if="active > 1" type="primary" @click="next">提交</button>
	</view>
</template>

<script>
import { verificationCode } from '@/common/request/index';
import { doctorValidatePhone, doctorStartAuth, doctorFinAuth } from '@/common/request/userCenter';
export default {
	data() {
		return {
			themeColor: '#0AB2C1',
			active: 1,
			timecode: 60,
			passClick: true,
			form: {
				// phone: this.$store.state.userInfo.prestorePhone,
				// code: '',
				name: this.$store.state.userInfo.name || '',
				idCard: this.$store.state.userInfo.prestoreIdCard
			},
      leve:null
		};
	},
  computed:{
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad(options) {
    if(options.leve){
      this.leve = options.leve
    }
  },
	methods: {
		async next() {
			if (this.active < 1) {
				if (this.form.phone == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
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
				let res = await doctorValidatePhone({
					phone: this.form.phone,
					code: this.form.code
				});
				if (res) {
					if (res.name) {
						this.form.name = res.name;
					}
					if (res.idCard) {
						this.form.idCard = res.idCard;
					}
					this.active += 1;
				}
			} else {
				if (this.active == 1) {
					if (this.form.name == '') {
						uni.showToast({
							icon: 'none',
							title: '请输入姓名'
						});
						return false;
					}
					if (this.form.idCard == '') {
						uni.showToast({
							icon: 'none',
							title: '请输入身份证号'
						});
						return false;
					}
					let res = await doctorStartAuth({
						name: this.form.name,
						idCard: this.form.idCard
					});
					this.getdoctorFinAuth(res);
				}
			}
		},
		// 人脸识别回调
		async getdoctorFinAuth(bizToken) {
			const res = await doctorFinAuth({
				bizToken: bizToken
			});
      await this.$store.dispatch('loginInfo',true);
      uni.showToast({
        title:'认证成功'
      })
      let pages = getCurrentPages();  //获取所有页面栈实例列表
      let prevPage = pages[pages.length - (this.leve?3:2)];  //上上一页页面实例
      console.log(prevPage)
      prevPage.$vm.isshow = true;
      setTimeout(()=>{
        uni.navigateBack({
          delta:2
        })
      },1500)

			// this.$store.dispatch('reLoadLoginInfo', res);

		},
		radioChange(key, val) {
			this.form[key] = val;
		},
		getcode() {
			if (this.form.phone == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return false;
			}
			this.passClick = false;
			this.reserveCode();
			verificationCode({
				phone: this.form.phone,
				type: 'VALIDATE'
			}).then(res => {
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
.addWrap {
	padding-bottom: 120rpx;
}

.step {
	padding: 40rpx 70rpx;
	padding-bottom: 20rpx;
	position: relative;

	.step_item {
		.step_num {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			font-size: 34rpx;
			color: #fff;
			text-align: center;
			line-height: 50rpx;
			background: #ccc;
			margin: 0 auto;
		}

		.step_title {
			font-size: 26rpx;
			color: #ccc;
			margin-top: 10rpx;
			width: 110rpx;
		}

		&.on {
			.step_num {
				background: $uni-color-primary;
			}

			.step_title {
				color: $uni-color-primary;
			}
		}
	}

	.br {
		height: 2px;
		background: #ccc;
		width: 248rpx;
		position: absolute;
		top: 60rpx;
		left: 150rpx;

		&:nth-child(3) {
			left: auto;
			right: 149rpx;
		}

		&.on {
			background: $uni-color-primary;
		}
	}
}

.inputWrap {
	.title {
		width: 210rpx;
		font-size: 30rpx;
		color: #666;

		.red {
			color: #ea4444;
			position: relative;
			top: -10rpx;
		}
	}

	.title2 {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}

	.getcode {
		color: $uni-color-primary;
	}

	.tag {
		background: #f2f2f2;
		color: #333;

		&.on {
			background: $uni-color-primary;

			/deep/.uni-tag--default {
				color: #fff;
			}
		}

		&:nth-child(1) {
			margin-right: 30rpx;
		}
	}

	/deep/.uni-list-item--hover {
		background: none;
	}

	.input_pla {
		font-size: 30rpx;
		color: #ccc;
	}

	input {
		font-size: 30rpx;
	}
}

.next {
	margin-top: 30rpx;
	position: relative;
	left: 0;
	margin-left: 15px;
	width: auto;
	bottom: 0;
}

.tipWrap {
	padding: 0 15px;

	.tipText {
		font-size: 24rpx;
		color: #666;

		text {
			color: $uni-color-error;
		}
	}
}
</style>
