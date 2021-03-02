<template>
	<view class="content">
		<!--主页按钮-->
		<homeIcom />
		<view class="title">{{infoData.title}}</view>
		<view class="date">{{infoData.releaseTime}}</view>
		<view class="main" v-html="infoData.content"></view>
	</view>
</template>

<script>
	import {queryAnnounce,readAnnounce} from '@/common/request/index'
	export default{
		data(){
			return{
				id:'',
				infoData:''
			}
		},
		onLoad(options) {
			if(options.id){
				this.id = options.id
				this.setreadAnnounce()
				this.getqueryAnnounce()
			}
		},
		methods:{
			// 获取详情
			async getqueryAnnounce(){
			 	this.infoData = await queryAnnounce({announceId:this.id})
			},
			// 标记为已读
			setreadAnnounce(){
				readAnnounce({announceId:this.id})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		background: #fff;
		min-height: 100%;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		.title{
			font-size: 34rpx;
			color: #1A1A1A;
			text-align: center;
			font-weight: bold;
		}
		.date{
			font-size: 24rpx;
			color: #666666;
			text-align: center;
			margin-top: 30rpx;
			margin-bottom: 50rpx;
		}
		.main{
			font-size: 26rpx;
			color: #666666;
			line-height: 46rpx;
      word-wrap: break-word;
		}
	}
</style>
