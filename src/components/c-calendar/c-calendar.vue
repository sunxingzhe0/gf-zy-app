<template>
	<view class="dateWrap">
		<view class="calendar">
			<view class="detail">
				<view class="datedetail">{{ datedetail }}</view>
				<view class="festival">{{ festival }}</view>
			</view>
			<view class="dateTop">
				<view class="">
					<text class="leftIcon"></text>
					<view></view>
					<text class="rigthIcon"></text>
				</view>
				<view class=""></view>
			</view>
			<view class="calendarhead">
				<view class="tr">
					<text>日</text>
					<text>一</text>
					<text>二</text>
					<text>三</text>
					<text>四</text>
					<text>五</text>
					<text>六</text>
				</view>
			</view>
			<swiper class="swiper"  :current="current" @change="change" circular="true" :style="'height:' + sheight + 'px'">
				<swiper-item v-for="(sitem, sindex) in swiper" :key="sindex">
					<view class="week" v-for="(index,i) in normalDateList" :key="i">
						<view class="tr">
							<block v-for="(noritem, idx) in normalDateList[i]" :key="idx">
								<text :class="{ aorange: idx == 0 || idx == 6, agreen: noritem.isToday }" @tap="choose(noritem.text, i)">{{ noritem.text }}</text>
							</block>
						</view>
						<!-- <view class="tr tr2">
							<block v-for="(lunitem, idx) in lunarDateList[i]" :key="idx">
								<text :class="{ aorange: idx == 0 || idx == 6, agreen: lunitem.isToday }" @tap="choose(lunitem.days, i)">{{ lunitem.text }}</text>
							</block>
						</view> -->
					</view>
				</swiper-item>
			</swiper>
			<view class="show" v-if="show" @tap="toggle">收</view>
			<view class="show" v-else @tap="toggle">开</view>
		</view>

		<view class="panel">
			<view @tap="changeDate('YU')">上一年↑</view>
			<view @tap="changeDate('YD')">下一年↓</view>
			<view @tap="changeDate('MU')">上一月↑</view>
			<view @tap="changeDate('MD')">下一月↓</view>
			<view @tap="changeDate('')">当前月</view>
		</view>
	</view>
</template>

<script>
import Calendar from './calendar.js';
export default {
	data() {
		return {
			sheight: 280,
			Calendar: {},
			normalDateList: [],
			lunarDateList: [],
			flag: true,
			init: false,
			datedetail: '',
			festival: '',
			swiper: [1, 2, 2],
			current: 1,
			show: true,
			allDateLong: [0, 1, 2, 3, 4,5],
			showItemIndex: 0
		};
	},
	created() {
		Calendar.initial();
		this.changeDateStatus();
	},
	watch: {
		init(val) {
			this.normalDateList = Calendar.normalDateList;
			this.lunarDateList = Calendar.lunarDateList;
			this.datedetail = Calendar.datedetail;
			this.festival = Calendar.festival;
			this.showItemIndex = Calendar.showItemIndex;
			this.doToggle();
			this.getSwiperHeight();
		}
	},
	methods: {
		getSwiperHeight(){
			this.sheight = 48*this.normalDateList.length;
			console.log(this.sheight)
		},
		toggle() {
			if (this.show) {
				this.show = false;
				this.normalDateList = [this.normalDateList[this.showItemIndex]];
				this.lunarDateList = [this.lunarDateList[this.showItemIndex]];
				this.sheight = 60;
			} else {
				this.show = true;
				this.getSwiperHeight();
				this.changeDateStatus();
			}
		},
		doToggle() {
			if (!this.show) {
				this.normalDateList = [this.normalDateList[this.showItemIndex]];
				this.lunarDateList = [this.lunarDateList[this.showItemIndex]];
				this.sheight = 60;
			}
		},
		change(e) {
			let Bt = this.current;
			let Nt = e.detail.current;
			if (Bt == 0) {
				if (Nt == 2) {
					this.resMonth();
					this.current = Nt;
					return;
				}
			}
			if (Bt == 2) {
				if (Nt == 0) {
					this.addMonth();
					this.current = Nt;
					return;
				}
			}
			if (Nt > Bt) {
				this.addMonth();
			} else {
				this.resMonth();
			}
			this.current = Nt;
		},
		addMonth() {
			if (!this.show) {
				this.changeDate('WD');
			} else {
				this.changeDate('MD');
			}
		},
		resMonth() {
			if (!this.show) {
				this.changeDate('WU');
			} else {
				this.changeDate('MU');
			}
		},
		choose(item, index) {
			//console.log(item);
			if(item!==undefined&&item!==" "){
			this.changeDateStatus();
			Calendar.setToday(item);
			this.showItemNum = index;	
			}
			
		},
		changeDateStatus() {
			if (this.init) {
				this.init = false;
			} else {
				this.init = true;
			}
		},

		changeDate(type) {
			this.changeDateStatus();

			Calendar.pushBtm(type);
		}
	}
};
</script>

<style lang="scss">
	.dateWrap{
		background: #F2F2F2;
	}
	.dateTop{
		height: 80rpx;
		border-bottom: 1px solid #fff;
	}
.aorange {
	font-size: 16px;
	color: #ff5f07;
	font-weight: bold;
}
.agreen {
	font-size: 16px;
	color: #55e8df !important;
	font-weight: bold;
}

.one {
	font-size: 16px;
	color: #000;
	font-weight: normal;
}

.spc {
	color: #ff5f07;
}

.festival {
	color: #000;
	width: 100%;
	padding: 2px;
	margin: 0 auto;
	height: 25px;
}
.datedetail {
	width: 100%;
	border: 0;
	padding: 2px;
	margin: 0;
	background-color: #e8f5f9;
	text-align: center;
}
.datedetail span {
	color: #23460f;
}
.detail {
	width: 100%;
	margin: 0;
	
}

.date {
	clear: both;
	padding-top: 0 !important;
	padding-top: 12px;
	width: 490px;
	height: 40px !important;
	height: 28px;
	font-size: 16px;
	background-color: #e6f0fa;
}
.calendar {
	float: left;
	text-align: center;
	width: 100%;
	border-top: 0;
	height: auto;
}
.calendarhead {
	color: #fafbfb;
	border: 0;
	padding: 0;
	margin: 0;
	background-color: #0978a6;
	width: 100%;
	flex-direction: column;
}
.calendarhead .tr {
	width: 100%;
	display: flex;
	flex-direction: row;
}
.calendarhead text {
	flex: 1;
	font-size: 20px;
	padding: 1px;
	text-align: center;
}

.panel {
	margin: 0;
	padding: 10px;
	width: 100%;
	display: flex;
	flex-direction: row;
}
.panel view {
	padding: 2px;
	margin-top: 10px;
	background: #e8f5f9;
	font-size: 12px;
	cursor: pointer;
}

.week {
	width: 100%;
	display: flex;
	background-color: #fcfcfc;
	border: 0;
	padding: 0;
	margin: 0;
	flex-direction: column;
}
.week .tr {
	width: 100%;
	display: flex;
	flex-direction: row;
}
.week text {
	flex: 1;
	padding: 1px;
	margin: 0;
	height: 20px;
	overflow: hidden;
}

.tr2 text {
	background-color: #e8f5f9;
	font-size: 24upx;
}
</style>
