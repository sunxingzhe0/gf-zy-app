<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="orderTop flex-between">
      <image
        :src="
          data.orderStatus == 'CLOSED' || data.orderStatus == 'FINISHED'
            ? FILE_URL_BUILT_IN('orderIngoBg.png')
            : FILE_URL_BUILT_IN('orderIngoBg2.png')
        "
      ></image>
      <text class="sate">{{ getState(data.orderStatus) }}</text>
      <text class="sate">{{
        data.bizType == 'CONSULT'
          ? '在线咨询'
          : data.bizType == 'REPEAT_CLINIC'
          ? '在线复诊'
          : '慢病续方'
      }}</text>
    </view>
    <view class="orderWrap">
      <view class="list box-shadow flex-between">
        <default-img
          class="listImg"
          :url="FILE_URL(data.biz.avatar)"
        ></default-img>
        <view class="info">
          <view class="name">
            {{ data.biz.doctorName }}
            <text>{{ data.biz.sex == '0' ? '女' : '男' }}</text>
          </view>
          <view class="des">
            <text>{{ data.biz.deptName }}</text>
            <text>{{ data.biz.titleName }}</text>
            <text>{{ data.biz.orgName }}</text>
          </view>
          <view class="des text-overflow">擅长：{{ data.biz.skilled }}</view>
          <view class="des">
            评分：
            <text class="fen">{{ data.biz.avgScore || '-' }}</text>
            <text>{{ data.biz.treatNumber || '-' }} 次诊疗</text>
          </view>
        </view>
      </view>

      <view class="oerderMain  box-shadow" v-if="takeType == 1">
        <view class="orderItem flex-between">
          <view class="title">健康卡</view>
          <view class="info">
            <view>{{ data.patient.memberName }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem">
          <view class="font26 color333">{{ data.patient.illnessDesc }}</view>
          <view class="detailList flex-start-start"
            ><image
              class="item"
              :src="FILE_URL(item)"
              v-for="(item, index) in data.patient.pic"
              :key="index"
              @click="previewImage(item)"
            ></image
          ></view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">类型</view>
          <view class="info">
            <view>{{
              data.bizType == 'CONSULT'
                ? '在线咨询'
                : data.bizType == 'REPEAT_CLINIC'
                ? '在线复诊'
                : '慢病续方'
            }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view
          v-show="data.historyMedicalInfo"
          class="orderItem flex-between"
          style="align-items:flex-start;"
          @click="visitHistory()"
        >
          <view class="title">历史就诊记录</view>
          <view class="info text-overflow">
            {{
              (data.historyMedicalInfo && data.historyMedicalInfo.createTime) ||
                ''
            }}{{
              (data.historyMedicalInfo && data.historyMedicalInfo.inDiagnose) ||
                ''
            }}
          </view>
          <uni-icons type="arrowright" class="rightIcon "></uni-icons>
        </view>
        <view class="orderItem flex-between">
          <view class="title">诊疗形式</view>
          <view class="info">
            <view>{{
              data.wayType == 'GRAPHIC'
                ? '图文'
                : data.wayType == 'VIDEO'
                ? '视频'
                : '电话'
            }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view v-show="data.historyRpList" class="orderItem flex-between">
          <view class="title">续方处方</view>
          <view class="info"><view></view></view>
          <view class="flex-justify-end" @click="isrecipel = !isrecipel">
            <text class="font24 color999">{{
              !isrecipel ? '展开' : '收起'
            }}</text>
            <uni-icons type="arrowright" class="rightIcon"></uni-icons>
          </view>
        </view>
        <prescription
          :prescriptionShow="isrecipel"
          :checkboxShow="false"
          :historyRpList="data.historyRpList"
        ></prescription>

        <view class="orderItem flex-between">
          <view class="title">费用</view>
          <view class="info">
            <view>
              <text class="colorred">￥{{ data.payFee }}</text>
            </view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
      <view
        class="oerderMain  box-shadow paddtb"
        v-if="data.orderStatus == 'FINISHED'"
      >
        <view
          class="orderItem border0"
          style=" justify-content: space-between;  display: flex;"
        >
          <view class="title">评价</view>
          <view class="evaluate-view">
            <view style="display: flex; align-items: center;">
              <uni-rate
                :readonly="true"
                :size="16"
                :margin="4"
                :value="data.evaluate.rating"
                style="margin-top: 8rpx;"
                active-color="#FFA200"
                color="#cccccc"
              ></uni-rate>
              <view
                style="font-size:26rpx;
            color:rgba(255,162,0,1);margin-left: 30rpx;"
              >
                {{ data.evaluate.rating || '-' }}.0分
              </view>
              <view
                style="font-size:26rpx;
            color:rgba(255,162,0,1);margin-left: 30rpx;"
              >
                {{ evaluateDescribe[data.evaluate.rating - 1] }}
              </view>
            </view>
            <view class="evaluate-content">{{ data.evaluate.content }}</view>
          </view>
          <!--  <uni-icons type="arrowright" class="rightIcon hide"></uni-icons> -->
        </view>
      </view>
      <view class="oerderMain  box-shadow paddtb">
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">订单号</view>
            <view class="info">
              <view>{{ data.orderId }}</view>
            </view>
            <view class="copy-t" @click="cope(data.orderId)">复制</view>
          </view>
          <view class="flex-between">
            <view class="title">下单时间</view>
            <view class="info">
              <view>{{ data.createTime }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">支付时间</view>
            <view class="info">
              <view>{{ data.paymentTime || '-' }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
          <view class="flex-between">
            <view class="title">支付方式</view>
            <view class="info">
              <view>{{
                data.payType == 'ICBC_PAY'
                  ? '微信支付'
                  : data.payType == 'ALI_PAY'
                  ? '支付宝支付'
                  : data.payType == 'OFFLINE_PAY'
                  ? '线下支付'
                  : '-'
              }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">购买人</view>
          <view class="info flex-start-center">
            <image class="headImg" :src="FILE_URL(data.userAvatar)"></image>
            <view>{{ data.userName }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
    </view>
    <view class="fiexBtn flex-justify-end">
      <button
        plain
        class="optBtn on"
        v-if="data.option.cancel"
        @click="orderCancel"
      >
        取消
      </button>
      <button plain class="optBtn" v-if="data.option.pay" @click="payC">
        付款
      </button>
      <button
        plain
        class="optBtn"
        v-if="data.option.enterRoom"
        @click="gotoInfo('/pages-user/chat/chat?orderId=' + data.orderId)"
      >
        诊室
      </button>
      <button
        plain
        class="optBtn on"
        v-if="data.option.delete"
        @click="orderDelete"
      >
        删除
      </button>
      <button
        plain
        class="optBtn"
        v-if="data.option.buy"
        @click="
          gotoInfo(
            '/pages-user/home/doctordetail/DoctorDetail?type=' +
              data.bizType +
              '&doctorId=' +
              data.doctorId,
          )
        "
      >
        继续购买
      </button>
      <button
        plain
        class="optBtn on"
        v-if="data.option.showMsg"
        @click="gotoInfo('/pages-user/chat/chat?orderId=' + data.orderId)"
      >
        记录
      </button>
      <button
        plain
        class="optBtn on"
        v-if="data.option.showRp"
        @click="
          gotoInfo(
            '/pages-user/prescription/prescription?orderId=' + data.orderId,
          )
        "
      >
        处方
      </button>
      <button
        plain
        class="optBtn "
        v-if="data.option.comment"
        @click="
          gotoInfo('/pages-user/serviceOrder/evaluate?orderId=' + data.orderId)
        "
      >
        评价
      </button>
    </view>

    <uni-popup ref="visit_records">
      <view class="records-p">
        <view class="close" @click="close"
          ><uni-icons
            type="closeempty"
            class="closeIcon"
            color="#999"
          ></uni-icons
        ></view>
        <view class="text">历史就诊记录</view>
        <view class="wrapper">
          <view class="content">
            <image
              v-show="
                data.historyMedicalInfo &&
                  data.historyMedicalInfo.type == 'outer'
              "
              class="item-img"
              :src="require('@/assets/internet_title.png')"
            ></image>
            <view class="time">
              <text>{{
                data.historyMedicalInfo &&
                data.historyMedicalInfo.medicalType == 'ZY'
                  ? '住院记录'
                  : '门诊记录'
              }}</text>
              <text
                class="ml-20"
                v-if="
                  data.historyMedicalInfo &&
                    data.historyMedicalInfo.medicalType == 'MZ'
                "
              >
                {{
                  getTime(
                    (data.historyMedicalInfo &&
                      data.historyMedicalInfo.visitDate) ||
                      '',
                  )
                }}
              </text>
              <text
                class="ml-20"
                v-if="
                  data.historyMedicalInfo &&
                    data.historyMedicalInfo.medicalType == 'ZY'
                "
              >
                {{
                  getTime(
                    data.historyMedicalInfo && data.historyMedicalInfo.time1,
                  )
                }}-{{
                  getTime(
                    data.historyMedicalInfo && data.historyMedicalInfo.time2,
                  )
                }}
              </text>
            </view>
            <text class="name">{{
              (data.historyMedicalInfo &&
                data.historyMedicalInfo.patientName) ||
                ''
            }}</text>
            <view class="doctor">
              <text>
                {{
                  data.historyMedicalInfo && data.historyMedicalInfo.deptName
                }}
              </text>
              <text style="margin-left: 12rpx;">{{
                data.historyMedicalInfo && data.historyMedicalInfo.doctorName
              }}</text>
              <text style="margin-left: 12rpx;">{{
                data.historyMedicalInfo && data.historyMedicalInfo.title
              }}</text>
            </view>
            <text
              class="diagnosis"
              v-show="
                data.historyMedicalInfo &&
                  data.historyMedicalInfo.medicalType == 'ZY'
              "
            >
              入院诊断：{{
                data.historyMedicalInfo && data.historyMedicalInfo.inDiagnose
              }}
            </text>
            <text
              class="diagnosis"
              v-show="
                data.historyMedicalInfo &&
                  data.historyMedicalInfo.medicalType == 'ZY'
              "
            >
              出院诊断：{{
                data.historyMedicalInfo && data.historyMedicalInfo.outDiagnose
              }}
            </text>

            <view
              class="diagnosis"
              v-show="
                data.historyMedicalInfo &&
                  data.historyMedicalInfo.medicalType == 'MZ'
              "
            >
              初步诊断：{{
                (data.historyMedicalInfo && data.historyMedicalInfo.diagnose) ||
                  ''
              }}
            </view>
            <text
              class="diagnosis"
              v-show="
                data.historyMedicalInfo &&
                  data.historyMedicalInfo.medicalType == 'MZ'
              "
            >
              治疗意见：{{
                (data.historyMedicalInfo &&
                  data.historyMedicalInfo.disposeAdvise) ||
                  ''
              }}
            </text>
          </view>
        </view>
      </view>
    </uni-popup>
    <popup-pay ref="pay" @success="paySuccess"></popup-pay>
  </view>
</template>
<!--待完善：图片显示 各个按钮点击操作 完善各个状态下的页面显示-->
<script>
import {
  orderDetail,
  orderCancel,
  orderDelete,
} from '../../common/request/index.js'
export default {
  onLoad(option) {
    if (option.bizId) {
      this.orderId = option.bizId
      this.getDetail()
    }
  },
  data() {
    return {
      isOpen: false,
      isrecipel: false,
      takeType: 1, // 1.自提，2.邮寄
      orderId: null,
      data: {
        biz: {},
        patient: {},
        historyMedicalInfo: {},
        option: {},
      },
      payType: '',
      evaluateDescribe: ['不满意', '一般', '满意', '较满意', '非常满意'],
    }
  },
  onShow() {
    this.getDetail()
  },
  methods: {
    getTime(date) {
      var time = ''
      if (date) {
        time = date.split(' ')[0]
      }
      return time
    },
    getDetail() {
      orderDetail({
        orderId: this.orderId,
      }).then(data => {
        if (data) {
          this.data = data
        }
      })
    },
    orderCancel() {
      uni.showModal({
        title: '提示',
        content: '是否确认操作',
        success: res => {
          if (res.confirm) {
            orderCancel({
              orderId: this.orderId,
            }).then(data => {
              uni.showToast({
                title: '取消成功!',
                icon: 'none',
              })
              uni.navigateBack({
                delta: 1,
              })
            })
          }
        },
      })
    },
    orderDelete() {
      uni.showModal({
        title: '提示',
        content: '是否确认操作',
        success: res => {
          if (res.confirm) {
            orderDelete({
              orderId: this.orderId,
            }).then(data => {
              uni.showToast({
                title: '删除成功!',
                icon: 'none',
              })
              uni.navigateBack({
                delta: 1,
              })
            })
          }
        },
      })
    },
    paySuccess() {
      uni.showToast({
        title: '支付成功',
      })
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 1000)
    },
    gotoInfo(url) {
      uni.navigateTo({
        url: url,
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
        },
      })
      //#endif
      //#ifdef H5
      this.$copyText(val).then(res => {
        uni.showToast({
          title: '复制成功',
        })
      })
      //#endif
    },
    getState(tatus) {
      var s = ''
      switch (tatus) {
        case 'UNPAID':
          s = '待付款'
          break
        case 'PAID':
          s = '已支付'
          break
        case 'WAIT_TREAT':
          s = '待接诊'
          break
        case 'IN_TREAT':
          s = '接诊中'
          break
        case 'WAIT_TAKE':
          s = '待自提'
          break
        case 'WAIT_SEND':
          s = '待发货'
          break
        case 'WAIT_RECEIVE':
          s = '待收货'
          break
        case 'TO_EVALUATE':
          s = '待评价'
          break
        case 'IN_AFTER_SALE':
          s = '售后中'
          break
        case 'FINISHED':
          s = '已完成'
          break
        case 'CLOSED':
          s = '已关闭'
          break
      }
      return s
    },
    visitHistory() {
      this.$refs.visit_records.open()
    },
    payC() {
      this.$refs.pay.show(this.data.orderId)
    },
    close() {
      this.$refs.visit_records.close()
    },
    previewImage(fileId) {
      uni.previewImage({
        current: this.FILE_URL(fileId),
        urls: this.data.patient.pic.map(item => this.FILE_URL(item)),
      })
    },
  },
}
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

.records-p {
  width: 640rpx;
  min-height: 456rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  padding-top: 40rpx;

  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;

    .closeIcon {
      font-size: 30rpx !important;
    }
  }

  .text {
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    text-align: center;
  }

  .wrapper {
    max-height: 700rpx;
    padding: 0 40rpx 40rpx;
    overflow-y: auto;
  }
  .content {
    margin-top: 40rpx;
    padding: 40rpx 28rpx;
    min-height: 226rpx;

    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    position: relative;

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
      margin: 20rpx 0 18rpx;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
    }
  }
}

.copy-t {
  width: auto;
  font-size: 24rpx;
  color: rgba(10, 178, 193, 1);
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
