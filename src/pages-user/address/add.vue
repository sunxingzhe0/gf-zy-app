<template>
	<view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
		<view isShadow class="box-shadow" style="background: #fff; overflow: hidden;padding-left: 30rpx; padding-right: 30rpx;">
			<uni-list class="inputWrap">
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-start-center">
						<view class="title">
							收货人
							<text class="red">*</text>
						</view>
						<input type="text" class="flex_1" v-model="form.name" placeholder-class="input_pla" placeholder="请输入" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-start-center">
						<view class="title">
							联系电话
							<text class="red">*</text>
						</view>
						<input type="number" class="flex_1" v-model="form.phone" maxlength="11" placeholder-class="input_pla" placeholder="请输入" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;">
					<view class="flex-start-center">
						<view class="title">
							所在地区
							<text class="red">*</text>
						</view>
						<pick-regions :defaultRegion="defaultRegion" @getRegion="handleGetRegion">
							<input v-model="cityName" class="flex_1" disabled placeholder-class="input_pla" placeholder="请选择" />
						</pick-regions>
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-start-center">
						<view class="title">
							详细地址
							<text class="red">*</text>
						</view>
						<input type="text" class="flex_1" v-model="form.detailAddress" placeholder-class="input_pla" placeholder="街道/小区/房间号" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-start-center">
						<view class="title">
							邮政编码
							<text class="red"></text>
						</view>
						<input type="number" class="flex_1" v-model="form.zipCode" maxlength="6" placeholder-class="input_pla" placeholder="请输入6位邮编号" />
					</view>
				</uni-list-item>
				<uni-list-item style="padding-left: 0;" :show-arrow="false">
					<view class="flex-between">
						<view class="title">默认地址</view>
						<switch class="listswitch" :checked="form.defaultStatus" @change="switchChange" :color="themeColor" />
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<button class="submit_btn addressBtn" type="primary" @click="submit">保存</button>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
import { addressUpdate } from '@/common/request/userCenter';
export default {
	components: { pickRegions },
	data() {
		return {
			themeColor: '#0AB2C1',
			defaultRegion: [],
			cityName: '',
			form: {
				name: '',
				phone: '',
				defaultStatus: false,
				province: '',
				city: '',
				region: '',
				detailAddress: '',
				zipCode: '',
			},
      select:''
		};
	},
	onLoad(option) {
    if (option.page == 'orderSubmit') {
      this.select = option.page;
    }
		if (option.row) {
			uni.setNavigationBarTitle({
				title: '编辑地址'
			});
			console.log(JSON.parse(decodeURIComponent(option.row)))
			let data = JSON.parse(decodeURIComponent(option.row))
			this.form = data
			this.defaultRegion = [data.province,data.city,data.region]
			this.cityName = this.defaultRegion.join('/')
		} else {
			uni.setNavigationBarTitle({
				title: '新建地址'
			});
		}
	},
	methods: {
		handleGetRegion(region) {
			console.log(region);
			let cityname = [];
			region.forEach(i => {
				cityname.push(i.name);
			});
			this.cityName = cityname.join('/');
			this.form.province = cityname[0];
			this.form.city = cityname[1];
			this.form.region = cityname[2];
		},
		async submit() {
			if (this.form.name == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入收货人名称'
				});
				return false;
			}
			if (this.form.phone == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入联系电话'
				});
				return false;
			}
			if (this.cityName == '') {
				uni.showToast({
					icon: 'none',
					title: '请选择所在地区'
				});
				return false;
			}
			if (this.form.detailAddress == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入详细地址'
				});
				return false;
			}
			// if (this.form.zipCode == '') {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请输入邮政编码'
			// 	});
			// 	return false;
			// }
		 	 let info = await addressUpdate(this.form)
			uni.showToast({
				title:this.form.id?'修改成功':'添加成功'
			})
      if (this.select == 'orderSubmit') {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let prevPage = pages[pages.length - 2]; //上一个页面
        //可以打印prevPage看看
        console.log(prevPage);
        //#ifdef H5
        prevPage.address = info;
        //#endif
        //#ifdef MP-WEIXIN
        prevPage.setData({
          address: info
        });
        //#endif
      }
			uni.navigateBack({
				delta:1
			})
		},

		switchChange(e) {
			this.form.defaultStatus = e.detail.value
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
		width: 200rpx;
		font-size: 30rpx;
		color: #666;
		.red {
			color: #ea4444;
			position: relative;
			top: -10rpx;
		}
	}
	input {
		font-size: 30rpx;
	}
	.listswitch {
		transform: scale(0.6);
		-webkit-transform: scale(0.7);
		/deep/.uni-switch-input:before {
			background: #ccc;
		}
	}
	/deep/.uni-list-item__container {
		padding-right: 0;
	}
	.input_pla {
		color: #ccc;
		font-size: 30rpx;
	}
	.getcode {
		color: $uni-color-primary;
	}
	/deep/.uni-list-item--hover {
		background: none;
	}
}
.addressBtn {
	margin-top: 30rpx;
	position: relative;
	bottom: 0;
}
</style>
