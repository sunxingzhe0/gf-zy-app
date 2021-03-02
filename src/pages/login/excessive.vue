<template>
	<view style="padding: 40px;"><uni-load-more :status="more" :contentText="{ contentrefresh: '正在加载，请稍等...' }"></uni-load-more></view>
</template>

<script>
import { bindingWxApp } from '@/common/request/index';
import util from '@/common/util';
export default {
	data() {
		return {
			more: 'loading',
			appid: 'wxb16a68518133564e'
		};
	},
	onLoad() {
		this.getCode()
	},
	methods: {
		getCode() {
			// 非静默授权，第一次有弹框
			const code = util.getUrlParam('code'); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
			const local = window.location.href;
			if (code == null || code === '') {
				window.location.href =
					'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
					this.appid +
					'&redirect_uri=' +
					encodeURIComponent(local) +
					'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

			} else {
				this.getOpenId(code); //把code传给后台获取用户信息
			}
		},
		async getOpenId(code) {
			// 通过code获取 openId等用户信息
			let _this = this;
			await bindingWxApp({ code });
			this.$store.dispatch('loginInfo');
		}
	}
};
</script>

<style></style>
