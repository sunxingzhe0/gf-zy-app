<template>
	<view class="docDetail">
		<!-- 收到视频聊天邀请 -->
		<video-invitation/>
		<!--主页按钮-->
		<homeIcom />
		<!-- 顶部背景图 -->
		<view class="bgtop"><img :src="FILE_URL_BUILT_IN('bgtop.png')" alt="" mode="widthFix" /></view>
		<!-- 医生信息简介卡片视图 -->
		<view class="docCard">
			<!-- 医生简介 -->
			<view class="docinfoCard">
				<!-- 卡片内部上半部分 -->
				<view class="cardTop">
					<view class="touxiang"><default-img :url="FILE_URL(infoData.avatar)"></default-img></view>
					<view class="content">
						<view class="nameBox">
							<view class="name">{{ infoData.name }}</view>
							<view class="gender">{{ infoData.sex == 1 ? '男' : '女' }}</view>
						</view>
						<view class="type">
							<view class="keshi">{{ infoData.deptName }}</view>
							<view class="position">{{ infoData.titleName }}</view>
						</view>
						<view class="hospital">{{ infoData.orgName }}</view>
					</view>
				</view>
				<!-- 卡片内部下半部分 -->
				<view class="cardbottom">
					<view class="item">
						<view class="numBox">
							<view class="num">{{ infoData.workHistory || '-' }}</view>
							<span class="fontW">年</span>
						</view>
						<view class="describe">从业年限</view>
					</view>
					<view class="item">
						<view class="numBox">
							<view class="num">{{ infoData.diagNum || '-' }}</view>
							<span class="fontW">次</span>
						</view>
						<view class="describe">服务人数</view>
					</view>
					<view class="item">
						<view class="numBox">
							<view class="num">{{ infoData.score || '-' }}</view>
							<span class="fontW">分</span>
						</view>
						<view class="describe">综合评分</view>
					</view>
				</view>
			</view>

			<!-- 医生详情 -->
			<view class="docdetailCard open">
				<view class="detailItem">
					<view class="title">擅长</view>
					<view class="text" v-html="infoData.skilled"></view>
				</view>
				<view class="detailItem">
					<view class="title">个人简介</view>
					<view class="text" v-html="infoData.intro"></view>
				</view>
				<view class="detailItem">
					<view class="title">执业经历</view>
					<view class="text" v-html="infoData.practiceInfo"></view>
				</view>
				<view class="detailItem">
					<view class="title">学术经历</view>
					<view class="text" v-html="infoData.academicInfo"></view>
				</view>
				<view class="detailItem">
					<view class="title">执业范围</view>
					<view class="text" v-html="infoData.practiceArea"></view>
				</view>
				<!-- <view class="detailItem">
					<view class="title">执业证号</view>
					<view class="text">1234569874563</view>
				</view> -->
			</view>
		</view>
		<view class="orderButton" @click="orderButton">查看更多诊疗服务</view>
	</view>
</template>
<script>
import { doctorIntro } from '@/common/request/index';
export default {
	data() {
		return {
			id: '',
			infoData: {}
		};
	},
	onLoad(options) {
		if (options.doctorId) {
			this.id = options.doctorId;
			this.getdoctorIntro();
		}
	},
	mounted() {},

	methods: {
		async getdoctorIntro() {
			this.infoData = await doctorIntro({id:this.id});
		},
		orderButton(){
			uni.navigateTo({
				url:'/pages-user/home/online/Consultation?type=CONSULT'
			})
		}
	}
};
</script>
<style scoped lang="scss">
view {
	line-height: 1;
	box-sizing: border-box;
}

.bgtop {
	width: 100%;
	height: 140rpx;

	img {
		width: 100%;
		height: 100%;
	}
}

.docCard {
	width: 100%;
	padding: 20rpx;
	position: relative;
	top: -20rpx;

	.docinfoCard {
		width: 100%;
		height: 335rpx;
		padding: 30rpx;
		background: #fff;
		box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.cardTop {
			margin-top: 10rpx;
			display: flex;
			justify-content: flex-start;
			padding-bottom: 30rpx;
			border-bottom: 1px solid #e6e6e6;

			.touxiang {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 29rpx;

				img {
					width: 100%;
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 117rpx;

				.nameBox,
				.type {
					display: flex;
					justify-content: flex-start;
					align-items: baseline;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
				}

				.nameBox {
					.name {
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(26, 26, 26, 1);
						margin-right: 20rpx;
					}
				}

				.type {
					.keshi {
						margin-right: 20rpx;
					}
				}

				.hospital {
					font-size: 24rpx;
					color: #666666;
				}
			}
		}

		.cardbottom {
			width: 100%;
			height: 76rpx;
			// padding: 10rpx 0;
			box-sizing: border-box;
			// border-top: 1px solid #E6E6E6;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item {
				width: 33.33%;
				height: 76rpx;
				border-right: 1px solid #e6e6e6;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.numBox {
					display: flex;
					align-items: baseline;

					.num {
						font-size: 33rpx;
						font-family: PingFang SC;
						font-weight: 600;
						color: rgba(26, 26, 26, 1);
						margin-right: 10rpx;
					}

					.fontW {
						font-size: 20rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #666;
					}
				}

				.describe {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #666;
				}
			}

			.rate {
				width: 33.33%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.numBox {
					display: flex;
					align-items: baseline;
					justify-content: space-around;
					color: #ffa200;
					margin-bottom: 20rpx;

					.num {
						font-size: 40rpx;
						font-family: PingFang SC;
						font-weight: 600;
						margin-right: 10rpx;
					}

					.fontW {
						font-size: 20rpx;
						font-family: PingFang SC;
						font-weight: 500;
					}
				}

				.describe {
					height: 26rpx;
				}
			}
		}
	}

	.docdetailCard {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0 0 0 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		background: #fff;
		box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		transition: height 0.8s;
		overflow: hidden;
		position: relative;
		box-sizing: border-box;

		.detailItem {
			padding: 40rpx 0;
			border-bottom: 1rpx solid #e6e6e6;

			.title {
				padding-left: 10rpx;
				line-height: 30rpx;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				border-left: 4rpx solid #0ab2c1;
				margin-bottom: 42rpx;
			}

			.text {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 36rpx;
				padding-right: 30rpx;
				line-height: 36rpx;
			}
		}

		.showBox {
			width: 100%;
			text-align: center;
			position: absolute;
			bottom: 0;
			height: 80rpx;
			background: #fff;
			display: flex;
			justify-content: center;
			align-items: center;

			.show {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(10, 178, 193, 1);
				margin-left: -81rpx;
			}

			img {
				width: 22rpx;
				height: 10rpx;
				margin-left: 15rpx;
			}
		}
	}
	.jiuzhenInfo {
		width: 100%;
		// height: 599rpx;
		// padding: 20rpx;
		background: #fff;
		box-sizing: border-box;
		margin-top: 20rpx;
		box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
		padding-left: 30rpx;

		.titleBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 30rpx 40rpx 0;
			border-bottom: 1rpx solid #e6e6e6;

			.title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}

			.changePerson {
				width: 70%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.person {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(10, 178, 193, 1);
				}

				img {
					width: 8rpx;
					height: 14rpx;
				}
			}
		}

		.typeBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 30rpx 40rpx 0;

			.title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}

			.modeBox {
				width: 70%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.mode {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #1a1a1a;
				}

				img {
					width: 8rpx;
					height: 14rpx;
				}
			}
		}

		.jiuzhenType {
			width: 640rpx;
			border-radius: 20rpx;
			padding: 40rpx 0 0;
			background: #fff;

			.typeTitle {
				width: 300rpx;
				text-align: center;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(26, 26, 26, 1);
				margin: 10rpx auto 50rpx;
			}

			.typeItemBox {
				display: flex;
				justify-content: space-between;
				align-items: center;
				// width: 100%;
				padding: 0 30rpx;
				margin-bottom: 60rpx;

				.typeItemtitleBox {
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					height: 74rpx;

					.itemTitle {
						font-size: 30rpx;
						font-weight: 500;
						color: rgba(26, 26, 26, 1);
					}

					.itemDescribe {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
			}

			.confirm {
				line-height: 88rpx;
				width: 100%;
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(10, 178, 193, 1);
				text-align: center;
				border-top: 1px solid #e6e6e6;
			}
		}

		.changeMode {
			width: 100%;
			padding-bottom: 40rpx;
			border-bottom: 1rpx solid #e6e6e6;
			display: flex;

			.typeItem1 {
				width: 196rpx;
				height: 116rpx;
				border-radius: 10rpx;
				background: #d0f2f5;
				color: #0ab2c1;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				margin-right: 25px;

				.title1 {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
				}

				.priceBox {
					display: flex;
					align-items: baseline;

					.num {
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(10, 178, 193, 1);
					}
				}
			}

			.typeItem2 {
				width: 196rpx;
				height: 116rpx;
				border-radius: 10rpx;
				background: #f2f2f2;
				color: #cccccc;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				margin-right: 25px;

				.title2 {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
				}

				.priceBox {
					display: flex;
					align-items: baseline;

					.num {
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(10, 178, 193, 1);
					}
				}
			}
		}

		.histroyBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 30rpx 40rpx 0;
			border-bottom: 1rpx solid #e6e6e6;

			.title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}

			.record {
				width: 70%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.date {
					width: 365rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(10, 178, 193, 1);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				img {
					width: 8rpx;
					height: 14rpx;
				}
			}
		}

		.historyPrescription {
			padding: 40rpx 30rpx 40rpx 0;

			.histitleBox {
				padding: 40rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.prescriptionTitle {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
				}

				.showBox {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 75rpx;

					.showText {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
					}

					img {
						width: 8rpx;
						height: 14rpx;
					}
				}
			}
		}

		.app-card {
			border-radius: 0rpx;
			margin-top: 20rpx;
			padding: 28rpx 28rpx 0rpx 28rpx;
			color: #666;
		}

		.prescription-checkbox {
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.prescription-no {
			font-size: 30rpx;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}

		.prescription-price {
			color: #0ab2c1;
			font-size: 30rpx;
			font-weight: bold;
		}

		.prescription-doctor {
			font-size: 24rpx;
			line-height: 36rpx;
			margin: 20rpx 0rpx;
		}

		.prescription-desc {
			margin-right: 12rpx;
			width: 100%;
			text-align: right;

			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);

			text {
				margin-right: 10rpx;
			}
		}

		.detail {
			margin: 0px -28rpx;
			padding-top: 32rpx;
			padding: 20rpx;
			background-color: #eee;
		}

		.desc {
			transform: rotate(0.5turn);
		}

		.medicine {
			display: flex;
			justify-content: space-between;

			.medicine-name {
				font-size: 26rpx;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}

			.medicare {
				width: 130rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
		}

		.use {
			color: #e45b5b;
			margin: 20rpx 0rpx;
			font-size: 26rpx;
		}

		.price {
			font-size: 30rpx;
			font-weight: bold;
			color: #0ab2c1;
		}

		.remark {
			font-size: 24rpx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			margin-top: 20rpx;
		}

		.cell-box {
			padding: 20rpx 0;
			border-top: 2rpx solid #e6e6e6;
		}

		.reSee {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 30rpx 40rpx 0;

			.title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}

			.selDate {
				width: 70%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.date {
					width: 365rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #cccccc;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				img {
					width: 8rpx;
					height: 14rpx;
				}
			}
		}
	}
}

.orderButton {
	width: 710rpx;
	line-height: 88rpx;
	background: rgba(10, 178, 193, 1);
	border-radius: 44rpx;
	font-size: 30rpx;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	margin: 0 auto 30rpx;
	text-align: center;

	&.f {
		background: #f2f2f2;
		color: #cccccc;
	}
}
</style>
