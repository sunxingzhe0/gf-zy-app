<template>
  <view>
    <!--主页按钮-->
    <homeIcom />
    <view class="orderTop flex-between">
      <image :src="FILE_URL_BUILT_IN('orderIngoBg2.png')"></image>
      <text class="sate">{{switchrrderStatus(details.orderStatus)}}</text>
      <text class="sate">{{switchBizType(details.bizType)}}</text>
    </view>
    <view class="orderWrap ">
      <view class="oerderMain  box-shadow" v-if="takeType==1">
        <view class="orderItem flex-between">
          <view class="title">就诊人</view>
          <view class="info">
            <view>{{details.memberName}}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem">
          <view class="font26 color333">{{details.illnessDesc}}</view>
          <view class="detailList flex-start-start">
            <default-img class="item" :url="FILE_URL(item)" v-for="(item,index) in details.patient.pic" :key="index"
              :defaultImg="require('@/assets/user/department_d.png')"></default-img>
          </view>

        </view>
        <view class="orderItem flex-between">
          <view class="title">业务类型</view>
          <view class="info">
            {{switchBizType(details.bizType)}}
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">业务形式</view>
          <view class="info">
            {{switchBizWay(details.wayType)}}
          </view>
        </view>
        <view v-if="details.historyMedicalInfo" class="orderItem flex-between" style="align-items:flex-start;" @click="visitHistory()">
          <view class="title">历史就诊记录</view>
          <view class="info text-overflow">{{ details.historyMedicalInfo.createTime ||'-'}}{{details.historyMedicalInfo.inDiagnose || '' }}</view>
          <uni-icons type="arrowright" class="rightIcon "></uni-icons>
        </view>


        <view v-show="details.historyRpList" class="orderItem flex-between">
          <view class="title">续方处方</view>
          <view class="info">
            <view></view>
          </view>
          <view class="flex-justify-end" @click="isrecipel=!isrecipel"><text class="font24 color999">{{ !isrecipel ? '展开' : '收起' }}</text>
            <uni-icons type="arrowright" class="rightIcon"></uni-icons>
          </view>
        </view>
        <prescription :prescriptionShow="isrecipel" :checkboxShow="false" :historyRpList="details.historyRpList"></prescription>
        <view class="orderItem flex-between">
          <view class="title">费用</view>
          <view class="info">
            <view><text class="colorred">￥{{details.biz.price}}</text></view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>


      <view class="oerderMain  box-shadow paddtb" v-if="details.orderStatus=='FINISHED'">
        <view class="orderItem border0" style=" justify-content: space-between;  display: flex;">
          <view class="title">评价</view>
          <view class="evaluate-view">
            <view style="display: flex; align-items: center;">
              <uni-rate :readonly="true" :size="16" :margin="4" :value="details.evaluate.rating" style="margin-top: 8rpx;"
                active-color="#FFA200" color="#cccccc"></uni-rate>
              <view style="font-size:26rpx;
            color:rgba(255,162,0,1);margin-left: 30rpx;">{{details.evaluate.rating||'-'}}.0分</view>
              <view style="font-size:26rpx;
            color:rgba(255,162,0,1);margin-left: 30rpx;">{{evaluateDescribe[((details.evaluate.rating)-1)]}}</view>
            </view>
            <view class="evaluate-content">
             {{details.evaluate.content}}
            </view>
          </view>

        </view>

      </view>


      <view class="oerderMain  box-shadow paddtb">
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">订单号</view>
            <view class="info">
              <view>{{details.orderId}}</view>
            </view>
            <view class="copy-t" @click="cope(details.orderId)">复制</view>

          </view>
          <view class="flex-between">
            <view class="title">下单时间</view>
            <view class="info">
              <view>{{details.createTime}}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">支付时间</view>
            <view class="info">
              <view>{{details.paymentTime || '-'}}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
          <view class="flex-between">
            <view class="title">支付方式</view>
            <view class="info">
              <view>{{details.payType=='WECHAT_PAY'?"微信支付":details.payType=='ALI_PAY'?'支付宝支付':'线下支付'}}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">购买人</view>
          <view class="info flex-start-center">
            <default-img class="headImg" :url='FILE_URL(details.userAvatar)'></default-img>

            <view>{{details.userName}}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
      <view class="list box-shadow flex-between">
        <default-img class="listImg" :url='FILE_URL(details.biz.avatar)'></default-img>
        <view class="info">
          <view class="name">
            {{details.doctorName}}
            <text>{{details.biz.sex == '0' ? '女' : '男'}}</text>
          </view>
          <view class="des">
            <text>{{details.biz.deptName}}</text>
            <text>{{details.biz.titleName}}</text>
            <text>{{details.biz.orgName}}</text>
          </view>
          <view class="des text-overflow">擅长：{{details.biz.skilled}}</view>

        </view>
      </view>
    </view>
    <view class="fiexBtn flex-justify-end">
      <button plain v-if="details.option.accept" class="optBtn" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+details.orderId)">接诊</button>
      <button plain class="optBtn on" v-if="details.option.audit" @click="reject(false,item.orderId)">拒绝</button>
      <button plain class="optBtn" v-if="details.option.audit" @click="reject(true,item.orderId)">同意接诊</button>
      <button plain class="optBtn" v-if="details.option.enterRoom" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+details.orderId)">诊室</button>
      <button plain class="optBtn" v-if="details.option.video" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+details.orderId)">接诊</button>
      <button plain class="optBtn" v-if="details.option.showRp" @click="gotoInfo('/pages-doctor/user/prescription/info?id='+details.orderId)">处方</button>

      <button plain class="optBtn" v-if="details.option.showMsg" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+details.orderId)">记录</button>
    </view>

    <uni-popup ref="visit_records">
      <view class="records-p">
        <text class="text">历史就诊记录</text>
        <view class="content">
          <image v-show="details.historyMedicalInfo&&details.historyMedicalInfo.type=='outer'" class="item-img" :src="require('@/assets/internet_title.png')"></image>
          <view class="time">
            <text>{{details.historyMedicalInfo&&details.historyMedicalInfo.medicalType=='ZY'
            ?'住院记录':'门诊记录'}} </text>
            <text class="ml-20" v-if="details.historyMedicalInfo&&details.historyMedicalInfo.medicalType=='MZ'">{{getTime(details.historyMedicalInfo&&details.historyMedicalInfo.visitDate)}}</text>
            <text class="ml-20" v-if="details.historyMedicalInfo&&details.historyMedicalInfo.medicalType=='ZY'">{{getTime(details.historyMedicalInfo&&details.historyMedicalInfo.time1)}}-{{getTime(details.historyMedicalInfo&&details.historyMedicalInfo.time2) }}</text>
          </view>
          <text class="name" v-if="details.historyMedicalInfo">{{details.historyMedicalInfo.patientName}}</text>
          <text class="doctor" v-if="details.historyMedicalInfo">{{details.historyMedicalInfo.deptName}} {{details.historyMedicalInfo.doctorName}}  {{details.historyMedicalInfo.title}}</text>
          <text class="diagnosis" v-if="details.historyMedicalInfo&&data.historyMedicalInfo.medicalType=='ZY'">入院诊断：{{details.historyMedicalInfo.inDiagnose}}</text>
          <text class="diagnosis" v-if="details.historyMedicalInfo&&data.historyMedicalInfo.medicalType=='ZY'">出院诊断：{{details.historyMedicalInfo.outDiagnose}}</text>

          <text class="diagnosis" v-if="details.historyMedicalInfo&&details.historyMedicalInfo.medicalType=='MZ'">初步诊断：{{ details.historyMedicalInfo.diagnose||'' }}</text>
          <text class="diagnosis" v-if="details.historyMedicalInfo&&details.historyMedicalInfo.medicalType=='MZ'">治疗意见：{{ details.historyMedicalInfo.disposeAdvise||'' }}</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import {
    doctorOrderDetail
  } from '../../../common/request/index.js'
  export default {

    data() {
      return {
        isOpen: false,
        isrecipel: false,
        takeType: 1, // 1.自提，2.邮寄
        orderId: '',
        details: {
          patient: {},
          biz:{},
          option:{},
        },
         evaluateDescribe: ['不满意', '一般', '满意', '较满意', '非常满意'],
      };
    },
    onLoad(option) {
      if (option.orderId) {
        this.orderId = option.orderId

      }
    },
    mounted() {
      this.getOrderDetail()
    },

    methods: {
      getTime(date) {
        var time = ''
        if (date) {
          time = date?.split(' ')[0]
        }
        return time
      },
      getOrderDetail() {
        doctorOrderDetail({
          orderId: this.orderId
        }).then(data => {
          this.details = data
        })
      },
      gotoInfo(url) {
        uni.navigateTo({
          url: url
        })
      },
      cope(val) {
        //#ifndef H5
        uni.setClipboardData({
          data: val,
          success: function() {
            uni.showToast({
              title: '复制成功',
            })
          }
        });
        //#endif
        //#ifdef H5
        this.$copyText(val).then(res => {
          uni.showToast({
            title: '复制成功'
          })
        })
        //#endif
      },
      switchBizType(bizType) {
        let typeS = ""
        switch (bizType) {
          case 'CONSULT':
            typeS = '在线咨询'
            break
          case 'REPEAT_CLINIC':
            typeS = '在线复诊'
            break
          case 'CARRYON_PRESC':
            typeS = '慢病续方'
            break
        }
        return typeS

      },
      switchBizWay(bizWay) {
        let typeS = ""
        switch (bizWay) {
          case 'GRAPHIC':
            typeS = '图文'
            break
          case 'VIDEO':
            typeS = '视频'
            break
          case 'PHONE':
            typeS = '电话'
            break
        }
        return typeS
      },
      switchrrderStatus(status) {
        let typeS = ""
        switch (status) {
          case 'UNPAID':
            typeS = '待付款'
            break
          case 'PAID':
            typeS = '已支付'
            break
          case 'WAIT_TREAT':
            typeS = '待接诊'
            break

          case 'IN_TREAT':
            typeS = '接诊中'
            break
          case 'WAIT_TAKE':
            typeS = '待自提'
            break
          case 'TO_EVALUATE':
            typeS = '待评价'
            break
          case 'FINISHED':
            typeS = '已完成'
            break
          case 'CLOSED':
            typeS = '已关闭'
            break
        }
        return typeS
      },
      visitHistory() {
        this.$refs.visit_records.open()
      },
      reject(state, id) {
        let str = state ? '确认通过' : '确认驳回'
        uni.showModal({
          title: '提示',
          content: str,
          success: function(res) {
            if (res.confirm) {
              doctorOrderAudit({
                orderId: id,
                reply: state
              }).then(data => {
                uni.showToast({
                  title: '操作成功'
                })
                uni.navigateBack({
                  delta: 1
                })
              })

            } else if (res.cancel) {

            }
          }
        })
      },
      // receivingC(id) {
      //   doctorReceiving({
      //     orderId: id
      //   }).then(data => {
      //     uni.showToast({
      //       title: '已成功接诊！'
      //     })
      //    uni.navigateBack({
      //      delta:1
      //    })
      //   })
      // },
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/common/order.scss';

  .orderTop {
    .stateIcon {
      font-size: 50rpx;
      color: #fff;

    }
  }

  .detailList {
    margin-top: 30rpx;
    flex-wrap: wrap;

    .item {
      width: 180rpx;
      height: 180rpx;
      margin-right: 30rpx;
      margin-top: 20rpx;
    }
  }

  .copy-t {
    width: auto;
    font-size: 24rpx;
    color: rgba(10, 178, 193, 1);
  }

  .records-p {
    width: 640rpx;
    min-height: 456rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    border-radius: 20rpx;
    align-items: center;
    padding: 40rpx 0rpx;


    .text {
      font-size: 30rpx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
      text-align: center;
    }

    .content {
      margin-top: 40rpx;
      padding: 40rpx 28rpx;
      width: 524rpx;
      min-height: 226rpx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
      border-radius: 20px;
      display: flex;
      position: relative;
      flex-direction: column;

      .item-img {
        width: 123rpx;
        position: absolute;
        right: 0rpx;
        height: 123rpx;
        top: 0rpx;

      }

      .time {
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
        display: flex;
        // justify-content: space-between;
      }

      .name {
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
        margin-top: 40rpx;
      }

      .doctor {
        margin-top: 20rpx;
        font-size: 24rpx;
        color: rgba(102, 102, 102, 1);
      }

      .diagnosis {
        margin-top: 20rpx;
        font-size: 24rpx;
        color: rgba(102, 102, 102, 1);
      }
    }
  }

  .evaluate-view {
    flex: 1;

    .evaluate-content {
      font-size: 30rpx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
      margin-top: 10rpx;
      word-wrap: break-word;
      word-break: break-all;

    }
  }
</style>
