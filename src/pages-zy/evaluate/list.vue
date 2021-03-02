<template>
  <view style="padding-top: 170rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item label="就诊人" :styles="{padding:'16rpx 30rpx',paddingLeft:0}">
            <view class="flex_1 text-right color666">
              <select-patient textStyle="color:#666;" @patientLoad="changePatient"></select-patient>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <view class="main">
      <!-- 就诊点评 -->
      <template v-if="active == 0">
        <view class="survey box-shadow" v-for="(item, index) in gradeList" :key="index">
          <view class="titleBox">
            <view class="title">
              <view class="left flex-start-center">
                <view class="type">{{ item.type == 0 ? '门诊' : item.type == 1 ? '住院' : '体检' }}</view>
                <view class="icon">{{ item.deptNo || '' }}</view>
              </view>
            </view>
            <view class="flex-between date">
              <view>单据号：{{ item.doctorNo }}</view>
              <view>就诊时间：{{ item.visitTime }}</view>
            </view>
          </view>
          <!-- 评分 -->
          <view class="rateBox">
            <view class="itemBox">
              <view class="mt-10">
                <view class="textarea" v-if="!item.hasEva">
                  <textarea maxlength="200" v-model="item.content" placeholder="非常好，我非常满意！" />
                  <view class="tip">{{item.content?item.content.length:0}}/200</view>
                </view>
                <view v-else class="textareaText">{{ item.content }}</view>
              </view>
              <view class="flex-start-center">
                <view class="titleFont">诊疗效果</view>
                <view class="star">
                  <uni-rate :value="item.diagResult" :size="15" :margin="8" color="#CCCCCC" @change="starChange($event,item,'diagResult')" active-color="#FFA200"
                    :readonly="item.hasEva ? true : false" />

                </view>
                <view class="rateFont">{{ getevaluateState(item.diagResult) }}</view>
              </view>
              <view class="mt-10 flex-start-center">
                <view class="titleFont">服务态度</view>
                <view class="star">
                  <uni-rate :value="item.serviceAttitude" :size="15" :margin="8" color="#CCCCCC" active-color="#FFA200"
                    :readonly="item.hasEva ? true : false" @change="starChange($event,item,'serviceAttitude')"/>

                </view>
                <view class="rateFont">{{ getevaluateState(item.serviceAttitude) }}</view>
              </view>
              <view class="mt-10 flex-start-center">
                <view class="titleFont">就医环境</view>
                <view class="star">
                  <uni-rate :value="item.hospitalEnvironment" :size="15" :margin="8" color="#CCCCCC" active-color="#FFA200"
                    :readonly="item.hasEva ? true : false"  @change="starChange($event,item,'hospitalEnvironment')"/>

                </view>
                <view class="rateFont">{{ getevaluateState(item.hospitalEnvironment) }}</view>
              </view>

            </view>
          </view>
          <view class="subBtn" v-if="!item.hasEva" @click="save(item)">
            提交
          </view>
        </view>
        <NoData v-if="gradeList.length == 0" />
      </template>
       <!-- 医生点评 -->
       <view v-else>
       	<view class="list box-shadow" v-for="(item, index) in list" :key="index">
       		<view class="flex-between listTop"  @click="goto(item.orderId)">
       			<view class="flex-start-center">
       				<image class="listImg" :src="item.avatar ? FILE_URL(item.avatar) : require('@/assets/user/user_d_head.png')"></image>
              <view>
                <view class="name" style="line-height: 30rpx;">
                	{{ item.doctorName }}
                	<text>{{ item.titleName }}</text>
                	<text>{{ item.deptName }}</text>
                </view>
                <view class="name" style="line-height: 30rpx;"><text style="margin-left: 0;font-size: 22rpx;">订单号：{{item.orderId}}</text></view>
              </view>

       				<!-- <view class="bizWay">{{item.bizWay == 'GRAPHIC'?'图文':item.bizWay == 'VIDEO'?'视频':'电话'}}</view> -->
       			</view>
       			<view class="consultation">{{ item.bizType == 'CONSULT' ? '在线咨询' : item.bizType == 'REPEAT_CLINIC' ? '在线复诊' : '慢病续方' }}</view>
       		</view>
          <view style="padding: 0 30rpx;" v-if="!item.hasEva">
            <view class="flex-start-start" style="margin-bottom: 30rpx;">
              <view class="evaluate">评价</view>
              <view class="info">
              	<view class="des flex-start-center evaluateNum">
                  <uni-rate :value="item.average" :size="15" :margin="8" color="#CCCCCC" active-color="#FFA200"
                     @change="starChange($event,item,'average')"/>
              		<text class="fen">{{parseFloat(item.average).toFixed(1)}}分</text>
              		<text>{{getevaluateState(item.average)}}</text>
              	</view>
              </view>
            </view>
            <view class="textarea">
              <textarea maxlength="200" v-model="item.content" placeholder="非常好，我非常满意！" />
              <view class="tip">{{item.content?item.content.length:0}}/200</view>
            </view>
          </view>
       		<view v-else class="flex-start-start" style="padding: 0 30rpx;">
       			<view class="evaluate">评价</view>
       			<view class="info" :style="item.answerContent?'border-bottom: 1px solid #e6e6e6; padding-bottom:20rpx;':''">
       				<view class="des flex-start-center evaluateNum">
       					<uni-rate size="15" active-color="#FFA200" :margin="8" readonly="true" :value="parseFloat(item.average)" />
       					<text class="fen">{{item.average}}分</text>
       					<text>{{getevaluateState(item.average)}}</text>
       				</view>
       				<view class="time">{{ item.createTime }}</view>
               <view class="evaluateText">{{ item.content || '' }}</view>
       			</view>
       		</view>
       		<view class="flex-start-start" style="margin-top: 30rpx; padding: 0 30rpx;" v-if="item.answerContent">
       			<view class="evaluate">回复</view>
       			<view class="info">
       				<view class="time">{{ item.answerTime }}</view>
               <view class="evaluateText">{{ item.answerContent }}</view>
       			</view>
       		</view>
          <view class="subBtn" v-if="!item.hasEva" @click="save(item)">
            提交
          </view>
       	</view>
       	<NoData v-if="list.length == 0" />
       </view>
    </view>
  </view>
</template>
<script>
  import selectPatient from '../components/selectPatient.vue'
  import NoData from '../components/NoData.vue'
  import AppListItem from '@/components/app/app-list-item'
  import {
    findEvaluateListZy,
    addEvaluatezy
  } from '../api/user.js'
  import {addEvaluate} from '@/common/request/user.js'
  import { findEvaluateList } from '@/common/request/userCenter';
  export default {
    components: {
      selectPatient,
      NoData,
      AppListItem
    },
    data() {
      return {
        more: 'noMore',
        list: [], //医生评论
        tabs: [{
            title: '就诊点评',
            key: 0,
          },
          {
            title: '医生点评',
            key: 1,
          },
        ],
        active: 0,
        content: '',
        // 就诊点评
        gradeList: [],
        showPer: false,
        perId: ''
      }
    },
    onLoad() {

    },
    methods: {
      changePatient(item) {
        this.perId = item.memberId
        this.topbarChange(this.active)
      },
      topbarChange(state) {
        this.active = state
        if (this.active == 1) {
          this.getfindEvaluateList()
        } else {
          this.getfindEvaluateListZy()
        }
      },
      // 获取列表
      async getfindEvaluateListZy() {
        let list = await findEvaluateListZy({
          patientId: this.perId
        })
        if (list) {
          list.forEach(i => {
            if (!i.hasEva) {
              i.diagResult = 5
              i.serviceAttitude = 5
              i.hospitalEnvironment = 5
            }
          })
        }
        this.gradeList = list
      },
      starChange(e,item,key){
        this.$set(item,key,e.value)
      },
      // 就医评论
      async save(item) {
        let res = null
        if(this.active == 0){
          res = await addEvaluatezy({
            diagResult: item.diagResult,
            serviceAttitude: item.serviceAttitude,
            hospitalEnvironment: item.hospitalEnvironment,
            content: item.content || '非常好，我非常满意！',
            id: item.id,
          })
        }else{
          res = await addEvaluate({
            level: item.average,
            content: item.content || '非常好，我非常满意！',
            orderId: item.orderId,
          })
        }

        if (res) {
          uni.showToast({
            title:'提交成功'
          })
        }
        if(this.active == 0){
          this.getfindEvaluateListZy()
        }else{
          this.getfindEvaluateList()
        }
      },
      // 医生评论列表
      async getfindEvaluateList() {
      	let list = await findEvaluateList({patientId: this.perId});
        list.forEach(item=>{
          if(!item.content){
            item.hasEva = false
            item.average = 5
          }else{
            item.hasEva = true
          }
        })
        this.list = list
      },
      goto(id){
      	uni.navigateTo({
      		url:'/pages-user/serviceOrder/detail?orderId='+id
      	})
      },
      getevaluateState(state) {
      	if (state == 1) {
      		return '不满意';
      	} else if (state == 2) {
      		return '一般';
      	} else if (state == 3) {
      		return '满意';
      	} else if (state == 4) {
      		return '较满意';
      	} else if (state == 5) {
      		return '非常满意';
      	}
      },
    },
  }
</script>
<style scoped lang="scss">
  .main {
    padding: 20rpx;
    .textarea {
      background: #F2F2F2;
      border-radius: 10rpx;
      padding: 20rpx;
      color: #333;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 30rpx;
      textarea {
        width: 100%;
        height: 160rpx;

      }
      .tip{
        font-size: 24rpx;
        color: #999;
        text-align: right;
        margin-top: 10rpx;
      }
    }
    .subBtn{
      padding-top: 20rpx;
      margin-top:30rpx;
      border-top: 1px solid #E6E6E6;
      text-align: center;
      font-size: 30rpx;
      color: $uni-color-primary;
    }
  }
.mt-10{
  margin-top: 10rpx;
}
  .survey {
    background: #fff;
    border-radius: 22rpx;
    overflow: hidden;
    padding: 30rpx 0;
    margin-bottom: 20rpx;

    .titleBox {
      border-bottom: 1px solid #e9eff4;
      margin-bottom: 30rpx;
      padding: 0 30rpx;
      padding-bottom: 20rpx;

      .title {
        width: 100%;
        padding-right: 20rpx;

        .left {
          .type {
            font-size: 36rpx;
            color: #333333;
            font-weight: 600;
            margin-right: 20rpx;
          }

          .icon {
            font-size: 24rpx;
            color: #666;
          }
        }
      }

      .date {
        font-size: 24rpx;
        color: #666;
      }
    }

    .itemBox {
      padding: 0 35rpx;
    }



    .textareaText {
      font-size: 30rpx;
      color: #333;
      margin-bottom: 20rpx;
      font-weight: bold;
    }

    .titleFont {
      color: #666;
      font-size: 28rpx;
      font-weight: 400;
    }

    .star {
      margin-left: 30rpx;
    }

    .rateFont {
      font-size: 28rpx;
      font-weight: 400;
      color: #FFA200;
      margin-left: 30rpx;
    }

  }
  .list {
  	background: #fff;
  	padding: 30rpx 0;
  	margin-bottom: 20rpx;
  	align-items: flex-start;
  	.listTop {
  		border-bottom: 1px solid #e6e6e6;
  		padding: 30rpx;
  		padding-top:0;
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
  		.bizWay{
  			padding: 2rpx 15rpx;
  			background:rgba(10,178,193,0.1);
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
        word-break:break-all;
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
</style>
