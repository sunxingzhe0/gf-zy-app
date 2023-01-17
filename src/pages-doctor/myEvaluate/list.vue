<template>
	<view class="doctorWrap">
    <!--主页按钮-->
    <homeIcom />
		<view class="search-bar-wrapper box-shadow">
			<uni-search-bar placeholder="搜索患者姓名" :radius="20" @cancel="searchTap"  @confirm="searchTap"></uni-search-bar>
			<view class="flex-between filter-wrapper">
				<View class="flex-start-center">
					<view class="flex-start-center" @click="sort('seqType')">
						<text style="margin-right: 4rpx;">评分</text>
						<image
							class="search-bar-wrapper__icon1"
							:src="
								search.seqType === 1
									? require('@/assets/paixu_desc.png')
									: search.seqType === 0
									? require('@/assets/paixu_asc.png')
									: require('@/assets/paixu.png')
							"
							mode="aspectFit"
						></image>
					</view>
					<view class="flex-start-center" @click="sort('seqvalue')" style="margin-left: 20px">
						<text style="margin-right: 4rpx;">回复</text>
						<image
							class="search-bar-wrapper__icon1"
							:src="
								search.seqvalue == 1
									? require('@/assets/paixu_desc.png')
									: search.seqvalue === 0
									? require('@/assets/paixu_asc.png')
									: require('@/assets/paixu.png')
							"
							mode="aspectFit"
						></image>
					</view>
				</View>

				<view class="flex-start-center" @click="showFilterPopup">
					<image class="search-bar-wrapper__icon2" :src="require('@/assets/shaixuan.png')" mode="aspectFit"></image>
					<text style="margin-left: 8rpx;">筛选</text>
				</view>
			</view>
		</view>
		<view>
			<view class="list box-shadow" v-for="(item, index) in list" :key="index" @click="gotoInfo('/pages-doctor/myEvaluate/detail?id=' + item.id)">
				<view class="flex-between listTop">
					<view class="flex-start-center">
						<image class="listImg" :src="item.avatar ? FILE_URL(item.avatar) : require('@/assets/user/user_d_head.png')"></image>
						<view class="name">{{ item.userName }}</view>
						<view class="bizWay">{{ item.bizWay == 'GRAPHIC' ? '图文' : item.bizWay == 'VIDEO' ? '视频' : '电话' }}</view>
					</view>
					<view class="consultation">{{ item.bizType == 'CONSULT' ? '在线咨询' : item.bizType == 'REPEAT_CLINIC' ? '在线复诊' : '慢病续方' }}</view>
				</view>
				<view class="flex-start-start">
					<view class="evaluate">评价</view>
					<view class="info">
						<view class="des flex-start-center evaluateNum">
							<uni-rate size="14" active-color="#FFA200" readonly="true" :value="parseFloat(item.average)"></uni-rate>
							<text class="fen">{{ item.average }}分</text>
							<text>{{ getevaluateState(item.evaluateState) }}</text>
						</view>
						<view class="time">{{ item.createTime }}</view>
						<view class="evaluateText">{{ item.content || '' }}</view>
					</view>
				</view>
				<view class="flex-start-start" style="margin-top: 30rpx;" v-if="item.answerContent">
					<view class="evaluate">回复</view>
					<view class="info">
						<view class="time">{{ item.answerTime }}</view>
						<view class="evaluateText">{{ item.answerContent }}</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="list.length == 0" :status="more"></uni-load-more>
		</view>
		<popup-layer ref="popupRef" direction="left">
			<view class="popup-content">
				<view class="title">选择评论时间</view>
				<view class="date-input" @click="datePickerShow">{{ (filterForm && filterForm.rangeTime && filterForm.rangeTime.join(' 至 ')) || '请选择' }}</view>
				<w-picker
					:showClear="true"
					mode="range"
					startYear="2017"
					endYear="2029"
					:value="filterForm.rangeTime"
					:current="true"
					fields="day"
					@confirm="dateConfirm"
					@cancel="dateCancel"
					@clear="filterForm.rangeTime = []"
					ref="datePicker"
				></w-picker>
				<view class="title">选择业务类型</view>
				<view class="filter-option_wrapper">
					<view
						class="filter-option"
						:class="{ active: filterForm.first == item.value }"
						v-for="(item, index) in filters[0]"
						:key="index"
						@click="filterChange(item.value, 'first')"
					>
						{{ item.lable }}
					</view>
				</view>
				<view class="title">选择业务形式</view>
				<view class="filter-option_wrapper">
					<view
						class="filter-option"
						:class="{ active: filterForm.second == item.value }"
						v-for="(item, index) in filters[1]"
						:key="index"
						@click="filterChange(item.value, 'second')"
					>
						{{ item.lable }}
					</view>
				</view>
				<view class="title">选择是否回复</view>
				<view class="filter-option_wrapper">
					<view
						class="filter-option"
						:class="{ active: filterForm.third == item.value }"
						v-for="(item, index) in filters[2]"
						:key="index"
						@click="filterChange(item.value, 'third')"
					>
						{{ item.lable }}
					</view>
				</view>
				<button class="commit_btn" @click="filterConfirm">确认</button>
			</view>
		</popup-layer>
	</view>
</template>

<script>
import { findEvaluateData } from '@/common/request/userCenter';
export default {
	data() {
		return {
			more: 'noMore',
			filters: [
				[
					{
						lable: '全部',
						value: ''
					},
					{
						lable: '在线咨询',
						value: 'CONSULT'
					},
					{
						lable: '在线复诊',
						value: 'REPEAT_CLINIC'
					},
					{
						lable: '慢病续方',
						value: 'CARRYON_PRESC'
					}
				],
				[
					{
						lable: '全部',
						value: ''
					},
					{
						lable: '图文',
						value: 'GRAPHIC'
					},
					{
						lable: '视频',
						value: 'VIDEO'
					},
					{
						lable: '电话',
						value: 'PHONE'
					}
				],
				[
					{
						lable: '全部',
						value: ''
					},
					{
						lable: '未回复',
						value: '0'
					},
					{
						lable: '已回复',
						value: '1'
					}
				]
			],
			filterForm: {
				rangeTime: [],
				first: '',
				second: '',
				third: ''
			},
			search: {
				startTime: '',
				endTime: '',
				bizType: '',
				bizWay: '',
				answer: '',
				userName: '',
				seqType: '',
				seqvalue: ''
			},
			list: []
		};
	},
	onLoad() {
		this.getfindEvaluateData();
	},
	methods: {
		getevaluateState(state) {
			if (state == 'NOT_SATISFIED') {
				return '不满意';
			} else if (state == 'GENERAL') {
				return '一般';
			} else if (state == 'SATISFIED') {
				return '满意';
			} else if (state == 'SATISFACTORY') {
				return '较满意';
			} else if (state == 'VERY_SATISFIED') {
				return '非常满意';
			}
		},
		// 获取评价列表
		async getfindEvaluateData() {
			this.list = await findEvaluateData({
				doctorId: uni.getStorageSync('userId'),
				...this.search
			});
		},
		gotoInfo(url) {
			uni.navigateTo({
				url
			});
		},
		sort(type) {
			this.search[type] = this.search[type] == 1 ? 0 : this.search[type] === 0 ? '' : 1;
			this.getfindEvaluateData();
		},
		showFilterPopup() {
			this.$refs.popupRef.show();
		},
		datePickerShow() {
			this.$refs.datePicker.show();
		},
		filterChange(index, key) {
			this.filterForm[key] = index;
		},
		searchTap(e) {
			this.search.userName = e.value;
			this.getfindEvaluateData();
		},
		dateConfirm(event) {
			this.filterForm.rangeTime = event.value;
		},
		dateCancel() {},
		filterConfirm() {
			if(this.filterForm.rangeTime.length>0){
				this.search.startTime = this.filterForm.rangeTime[0].replace(/-/g, '') + '000000';
				this.search.endTime = this.filterForm.rangeTime[1].replace(/-/g, '') + '000000';
			}else{
				this.search.startTime=''
				this.search.endTime=''
			}

			this.search.bizType = this.filterForm.first;
			this.search.bizWay = this.filterForm.second;
			this.search.answer = this.filterForm.third;
			this.getfindEvaluateData();
			this.$refs.popupRef.close();
		}
	}
};
</script>

<style lang="scss" scoped>
.doctorWrap {
	padding: 190rpx 30rpx 20rpx;
}

.search-bar-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	border-radius: 0 0 20rpx 20rpx;
	z-index: 4;
}

.filter-wrapper {
	padding: 0 30rpx 20rpx 30rpx;
}

.search-bar-wrapper__icon1 {
	width: 16rpx;
	height: 24rpx;
}

.search-bar-wrapper__icon2 {
	width: 30rpx;
	height: 30rpx;
}

.list {
	background: #fff;
	padding: 40rpx 30rpx;
	padding-right: 0;
	margin-bottom: 20rpx;
	align-items: flex-start;
	cursor: pointer;

	.listTop {
		border-bottom: 1px solid #e6e6e6;
		padding-right: 30rpx;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;

		.listImg {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: 18rpx;
		}

		.name {
			color: #1a1a1a;
			font-size: 30rpx;
			font-weight: bolder;

			text {
				font-size: 24rpx;
				color: #666;
				font-weight: normal;
				margin-left: 22rpx;
			}
		}

		.bizWay {
			padding: 2rpx 15rpx;
			background: rgba(10, 178, 193, 0.1);
			color: $uni-color-primary;
			font-size: 22rpx;
			margin-left: 20rpx;
		}

		.consultation {
			color: $uni-color-primary;
			font-size: 26rpx;
			cursor: pointer;
		}
	}

	.evaluate {
		font-size: 30rpx;
		color: #666;
		width: 90rpx;
	}

	.info {
		width: 480rpx;
		padding-right: 30rpx;
		flex: 1;
		box-sizing: border-box;

		.des {
			font-size: 24rpx;
			color: #666;
			line-height: 48rpx;

			text {
				margin-right: 30rpx;
			}
		}

		.evaluateText {
			font-size: 30rpx;
			color: #1a1a1a;
			font-weight: bold;
			margin-bottom: 10rpx;
			word-break: break-all;
		}

		.time {
			font-size: 24rpx;
			color: #999999;
		}

		.evaluateNum {
			line-height: 48rpx;
			font-size: 24rpx;
			color: #ffa200;

			.fen {
				font-size: 30rpx;
				margin-left: 20rpx;
			}
		}
	}
}

.popup-content {
	width: 84vw;

	.title {
		font-size: 32rpx;
		border-top: 2rpx solid #e2e2e2;
		margin-top: 32rpx;
		padding: 20rpx;

		&:first-child {
			border: none;
			margin: 0;
		}
	}
}

.date-input {
	margin-left: 20rpx;
	width: 90%;
	height: 80rpx;
	line-height: 80rpx;
	padding-left: 20rpx;
	border-radius: 40rpx;
	background-color: #f2f2f2;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
}

.filter-option_wrapper {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.filter-option {
	margin-bottom: 20rpx;
	margin-left: 20rpx;
	width: 180rpx;
	height: 70rpx;
	text-align: center;
	line-height: 70rpx;
	border-radius: 50rpx;
	background-color: #f2f2f2;
	color: #666;

	&.active {
		background-color: $uni-color-primary;
		color: #fff;
	}
}

.commit_btn {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	border: none;
	border-radius: 0;
	background-color: $uni-color-primary;
	color: #fff;

	&:after {
		border: none;
	}
}
</style>
