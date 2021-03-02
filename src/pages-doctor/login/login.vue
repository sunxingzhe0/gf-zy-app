<template>
	<view>
		<view class="loginTop">
			<image class="bg" :src="FILE_URL_BUILT_IN('loginBg.png')"></image>
			<image class="logo" :src="require('@/assets/logo.png')"></image>
		</view>
		<view class="loginMain box-shadow">
			<view class="formItem flex-between">
				<view class="iconLeft"><text class="iconfont icon-yonghu"></text></view>
				<input class="input" placeholder="请输入账号" placeholder-class="inputplaceholder" v-model="userName" type="text" />
				<image class="delIcon" :src="require('@/assets/del.png')" @click="dele"></image>
			</view>
			<view class="formItem flex-between">
				<view class="iconLeft"><text class="iconfont icon-mima"></text></view>
				<input class="input" placeholder="请输入密码" placeholder-class="inputplaceholder" v-model="password" :password="!isOpen" type="text" />
				<text :class="['iconfont', 'passwordIcon' ,isOpen?'icon-yanjing':'icon-biyan-copy']" @click="isOpen=!isOpen"></text>
			</view>
			<view class="loginBtn" @click="login">登 录</view>
		</view>
		<view class="forget" @click="gotoForget">忘记密码</view>
	</view>
</template>
<script>
	export default{
		data(){
			return{
				isOpen:false,
				userName:'',
				password:''
			}
		},
		methods:{
			dele(){
				this.userName = ''
			},
			gotoForget(){
				uni.navigateTo({
					url:'/pages/login/forgetPassword'
				})
			},
			login(){
				if(this.userName == ''){
					uni.showToast({
						icon:'none',
						title:'请输入用户名'
					})
					return false
				}
				if(this.password == ''){
					uni.showToast({
						icon:'none',
						title:'请输入密码'
					})
					return false
				}
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.loginTop{
		width: 100%;
		height: 400rpx;
		padding-top: 110rpx;
		box-sizing: border-box;
		.bg{
			width: 100%;
			height: 400rpx;
			position: absolute;
			top: 0;
			left: 0;
		}
		.logo{
			width: 141rpx;
			height: 140rpx;
			display: block;
			margin: 0 auto;
			position: relative;
			z-index: 3;
		}
	}
	.loginMain{
		background: #fff;
		margin: 0 60rpx;
		margin-top: -40rpx;
		padding: 40rpx 60rpx;
		padding-bottom: 20rpx;
		position: relative;
		z-index: 4;
		.formItem{
			padding: 20rpx 0;
			border-bottom: 1px solid #E6E6E6;
			margin-bottom: 40rpx;
			.input{
				flex: 1;
				font-size: 30rpx;
				color: #333;
				border: 0;
			}
			.inputplaceholder{
				color:#999;font-size:30rpx;
			}
			.delIcon{
				width: 30rpx;
				height: 30rpx;
			}
			.passwordIcon{
				color: #999;
			}
			.iconLeft{
				width: 50rpx;
				height: 50rpx;
				color: $uni-color-primary;
				background:rgba(10,178,193,0.15);
				border-radius: 50%;
				text-align: center;
				line-height: 50rpx;
				margin-right: 30rpx;
			}
		}
		.loginBtn{
			height:88rpx;
			background:$uni-color-primary;
			border-radius:44rpx;
			box-shadow: 6rpx 8rpx 15rpx 0rpx rgba(10,178,193,0.15);
			text-align: center;
			color: #fff;
			font-size: 30rpx;
			line-height: 88rpx;
			position: relative;
			top: 60rpx;
			}
	}
	.forget{
		font-size: 26rpx;
		color: $uni-color-primary;
		text-align: center;
		margin-top: 80rpx;
		cursor: pointer;
	}
</style>
