<template>
	<view>
    <!--主页按钮-->
    <homeIcom />
		<view class="orderWrap ">
			<view class="oerderMain  box-shadow">
				<picker @change="bindPickerChange" :value="num" :range="array">
					<view class="orderItem flex-between">
						<view class="title">处方号</view>
						<view class="info">
							<view>{{ array[num] }}</view>
						</view>
						<uni-icons type="arrowright" class="rightIcon"></uni-icons>
					</view>
					
				</picker>

				<view class="orderItem flex-between">
					<view class="title">药品名称</view>
					<view class="info"><input type="text" class="input" placeholder="请输入" placeholder-class="inputplaceholder" /></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<view class="orderItem flex-between">
					<view class="title">剂型</view>
					<view class="info"><input type="text" class="input" value="注射液" placeholder="请输入" placeholder-class="inputplaceholder" /></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<picker @change="typeChange" :value="type" :range="typeList">
					<view class="orderItem flex-between">
						<view class="title">用药途径</view>
						<view class="info">
							<view>{{ typeList[type] }}</view>
						</view>
						<uni-icons type="arrowright" class="rightIcon"></uni-icons>
					</view>
					
				</picker>
				<view class="orderItem flex-between">
					<view class="title">单次剂量</view>
					<view class="info"><input type="text" class="input" value="" placeholder="请输入" placeholder-class="inputplaceholder" /></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<picker @change="frequencyChange" :value="frequency" :range="frequencyList">
					<view class="orderItem flex-between">
						<view class="title">用药频次</view>
						<view class="info">
							<view>{{ frequencyList[frequency] }}</view>
						</view>
						<uni-icons type="arrowright" class="rightIcon"></uni-icons>
					</view>
					
				</picker>
				<view class="orderItem flex-between">
					<view class="title">疗程</view>
					<view class="info"><input type="text" class="input" value="" placeholder="请输入" placeholder-class="inputplaceholder" /></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<view class="orderItem flex-between">
					<view class="title">总量</view>
					<view class="info"><input type="text" class="input" value="" placeholder="请输入" placeholder-class="inputplaceholder" /></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<view class="orderItem flex-between">
					<view class="title">医保</view>
					<view class="info"><view>-</view></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<view class="orderItem flex-between">
					<view class="title">单价</view>
					<view class="info"><view>-</view></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<view class="orderItem flex-between">
					<view class="title">总价</view>
					<view class="info"><view>-</view></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
				<view class="orderItem flex-between">
					<view class="title">备注</view>
					<view class="info"><textarea class="input" auto-height placeholder="请输入"></textarea></view>
					<uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
				</view>
			</view>
		</view>
		<view class="fiexBtn flex-between">
			<view class="addBtn" @click="back()">取消</view>
			<view class="addBtn" @click="back()">提交</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			array: ['RP1', 'RP2', 'RP3', 'RP4'],
			typeList:['口服','外用'],
			frequencyList:['每日一次','每日两次','每日三次'],
			frequency:0,
			type:0,
			num: 0
		};
	},
	methods: {
		bindPickerChange(e) {
			this.num = e.detail.value;
		},
		typeChange(e){
			this.type = e.detail.value;
		},
		frequencyChange(e){
			this.frequency = e.detail.value;
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';
.orderWrap {
	padding-top: 20rpx;
	margin-top: 0;
	.input {
		width: 100%;
	}
	.inputplaceholder {
		color: #999;
		font-size: 30rpx;
	}
}
.fiexBtn {
	.addBtn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #f2f2f2;
		font-size: 30rpx;
		color: #333;
		cursor: pointer;
		border-radius: 44px 0 0 44px;
		&:nth-last-child(1) {
			background: $uni-color-primary;
			color: #fff;
			border-radius: 0 44px 44px 0;
		}
	}
}
</style>
