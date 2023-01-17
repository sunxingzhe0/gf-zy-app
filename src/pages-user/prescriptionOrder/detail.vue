<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="orderTop flex-between">
      <image
        :src="
          infoData.orderStatus == 'CLOSED' || infoData.orderStatus == 'FINISHED'
            ? FILE_URL_BUILT_IN('orderIngoBg.png')
            : FILE_URL_BUILT_IN('orderIngoBg2.png')
        "
      ></image>
      <view class="sate">
        <view class="time flex-between ">
          <text>
            {{ getstate(infoData.orderStatus) }}
          </text>

          <text
            style="margin-left: 20rpx;font-weight: normal;"
            v-if="infoData.orderStatus == 'UNPAID'"
          >
            剩余：
          </text>
          <uni-countdown
            v-if="infoData.orderStatus == 'UNPAID'"
            color="#fff"
            splitor-color="#fff"
            border-color="#fff"
            background-color="#0AB2C1"
            :show-day="false"
            :hour="infoData.hours"
            :minute="infoData.minutes"
            :second="infoData.seconds"
          ></uni-countdown>
        </view>
      </view>
      <view class="sate">{{
        infoData.expressMode == 1 ? '邮寄' : '到店自提'
      }}</view>
    </view>
    <view
      class="orderWrap"
      :style="{
        paddingBottom:
          infoData.option.cancel ||
          infoData.option.pay ||
          infoData.option.pay ||
          infoData.option.delete ||
          infoData.option.showExpress ||
          infoData.option.confirm ||
          infoData.orderStatus === 'WAIT_TAKE' ||
          infoData.orderStatus === 'WAIT_SEND'
            ? ''
            : '40rpx',
      }"
    >
      <view class="oerderMain  box-shadow" v-if="infoData.expressMode == 0">
        <template v-for="(item, index) in infoData.takeInfo">
          <view class="orderItem flex-between" :key="index">
            <view class="title"
              >自提点{{ infoData.takeInfo.length > 1 ? index + 1 : '' }}</view
            >
            <view class="info">
              <view>{{ item.name }}</view>
              <view>{{ item.phone }}</view>
            </view>
          </view>
          <view class="orderItem flex-between" :key="index">
            <view class="title">自提时间</view>
            <view class="info">
              <view>{{ item.dateTime }}</view>
            </view>
          </view>
        </template>

        <view class="orderItem flex-between">
          <view class="title">预留手机</view>
          <view class="info">
            <view>{{ infoData.memberPhone }}</view>
          </view>
        </view>
        <view
          class="orderItem flex-between"
          style="align-items:flex-start;"
          v-if="
            infoData.orderStatus == 'WAIT_TAKE' ||
              infoData.orderStatus == 'FINISHED'
          "
        >
          <view class="title">自提码</view>

          <view class="info">
            <view class="codeWrap">
              <image
                class="code"
                :class="{ opacity: infoData.orderStatus == 'FINISHED' }"
                :src="infoData.qrcode.base64"
              ></image>
              <view class="opacity">{{ infoData.qrcode.code }}</view>
              <image
                v-if="infoData.orderStatus == 'FINISHED'"
                class="used"
                :src="require('@/assets/used.png')"
              ></image>
            </view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
      <view class="oerderMain  box-shadow" v-if="infoData.expressMode == 1">
        <view class="orderItem flex-between">
          <image
            class="locationIcon"
            :src="require('@/assets/location.png')"
          ></image>
          <view class="info">
            <view>
              <text class="name">{{ infoData.receiverName }}</text>
              <text class="font24 color666">{{ infoData.receiverPhone }}</text>
            </view>
            <view class="font24 color666">{{ infoData.fullAddress }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem flex-between" v-if="infoData.expressInfo">
          <view class="title">配送方式</view>
          <view class="info">
            <view
              >{{ infoData.expressInfo.corpName
              }}{{ infoData.expressInfo.expressNo }}</view
            >
          </view>
          <!-- <uni-icons type="arrowright" class="rightIcon"></uni-icons> -->
        </view>
        <view class="orderItem flex-between">
          <view class="title">邮寄费用</view>
          <view class="info">
            <view>
              寄付，
              <text class="colorred">￥{{ infoData.freightFee }}</text>
            </view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view
          class="orderItem flex-between"
          v-if="infoData.orderStatus == 'WAIT_RECEIVE'"
        >
          <image
            class="locationIcon"
            :src="require('@/assets/receivedIcon.png')"
          ></image>
          <view class="info">
            <view class="text-overflow font24 color666"
              >【{{ infoData.expressInfo.province || '暂无物流信息' }}】{{
                infoData.expressInfo.content || ''
              }}</view
            >
            <view class="font24 color666">{{
              infoData.expressInfo.updateTime
            }}</view>
          </view>
          <uni-icons
            v-if="infoData.expressInfo.province"
            type="arrowright"
            class="rightIcon"
          ></uni-icons>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view class="orderItem flex-between">
          <view class="title">健康卡</view>
          <view class="info">
            <view>{{ infoData.memberName }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <block v-if="isOrdermore">
          <view class="orderItem">
            <view class="font26 color333">{{ infoData.illnessDesc }}</view>
            <view class="detailList flex-start-start">
              <image
                class="item"
                :src="FILE_URL(item)"
                v-for="(item, index) in infoData.picList"
                :key="index"
                @click="previewImage(item)"
              ></image>
            </view>
          </view>
          <view class="orderItem flex-between">
            <view class="title">类型 </view>
            <view class="info">
              <view>{{ switchBizType(infoData.bizType) }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
          <view class="orderItem flex-between" style="align-items:flex-start;">
            <view class="title">历史就诊记录</view>
            <view class="info text-overflow"
              >{{ infoData.historyMedicalInfo.createTime }}
              {{ infoData.historyMedicalInfo.outDiagnose || '' }}</view
            >
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
          <view class="orderItem flex-between">
            <view class="title">诊疗形式</view>
            <view class="info">
              <view>{{ switchBizWay(infoData.wayType) }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
          <view
            class="orderItem flex-between"
            v-show="details.serviceType == 'CARRYON_PRESC'"
          >
            <view class="title">续方处方</view>
            <view class="info">
              <view></view>
            </view>
            <view
              class="flex-justify-end"
              @click="isrecipelhis = !isrecipelhis"
            >
              <text class="font24 color999">{{
                !isrecipelhis ? '展开' : '收起'
              }}</text>
              <uni-icons type="arrowright" class="rightIcon"></uni-icons>
            </view>
          </view>
          <view v-show="isrecipelhis">
            <view
              style="padding-right: 30rpx;"
              v-for="(item, index) in infoData.historyRpList"
              :key="index"
            >
              <view class="flex-between">
                <view
                  class="font30 font-weight"
                  style="overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;"
                >
                  处方号：{{ item.id }}
                </view>
                <view class="price">￥{{ item.fee }}</view>
              </view>
              <view class="flex-between">
                <view class="font24 color666">数量：</view>
                <view class="font24 color666"
                  >医生：{{ item.doctorName }} {{ item.title }}</view
                >
                <view class="font24 color666">{{ item.createTime }}</view>
              </view>
              <view class="flex-between">
                <view class="font24 color666">处方有效期截至</view>
                <view class="font24 color666">{{ item.expireDate }}</view>
                <view class="font24 rp-msg" @click.stop="openPdf(item)"
                  >处方签</view
                >
              </view>
              <view class="recipelInfo">
                <view
                  class="recipelItem"
                  v-for="(f, i) in item.contentList"
                  :key="i"
                >
                  <view class="flex-between">
                    <view class="font26"
                      >{{ i + 1 }}.{{ f.name }}（规格：{{ f.spec }}）</view
                    >
                    <view class="font26 color666">￥{{ f.totalPrice }}</view>
                  </view>

                  <view class=" font26 paddingLeft16">
                    {{ f.useWaysText }} {{ f.useFrequencyText }}
                    {{ f.singleDose }}{{ f.singleDoseUnitText }}/次
                    {{ f.treatment || '-' }}{{ f.treatmentUnitText }} x{{
                      f.total
                    }}{{ f.totalUnitText }} ￥{{ f.price }}/{{
                      f.singleDoseUnitText
                    }}</view
                  >
                  <view class="font24 color666 paddingLeft16"
                    >备注：{{ f.remark }}</view
                  >
                </view>
              </view>
            </view>
          </view>
        </block>

        <view class="diagnosis">
          <view class="diagnosisInfo" v-if="!isOrdermore">{{
            infoData.illnessDesc
          }}</view>
          <view class="textMore" @click="isOrdermore = !isOrdermore">
            更多服务订单信息
            <text
              :class="[
                'iconfont',
                isOrdermore ? 'icon-expand-down' : 'icon-zhankai',
              ]"
            ></text>
          </view>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view class="orderItem flex-between">
          <view class="title">处方</view>
          <view class="more" @click="isOpen = !isOpen">
            {{ !isOpen ? '展开' : '收起' }}
            <text
              :class="[
                'iconfont',
                !isOpen ? 'icon-zhankai' : 'icon-expand-down',
              ]"
            ></text>
          </view>
        </view>
        <view v-show="isOpen">
          <view
            class="orderItem"
            v-for="(item, index) in infoData.rpList"
            :key="index"
          >
            <view class="prescription flex-between">
              <view
                class="prescriptionTitle"
                style="  overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;"
              >
                处方号：{{ item.id }}
              </view>
              <view class="price">￥{{ item.rpFee }}</view>
            </view>
            <view class="prescribe">
              <text>数量:{{ item.drugNumber }}</text>
              <text>医生：{{ item.doctorName }} {{ item.title }}</text>
              <text>{{ item.createTime }}</text>
            </view>
            <view class="flex-between">
              <view class="font24 color666">处方有效期截至</view>
              <view class="font24 color666">{{ item.expireDate }}</view>
              <view class="font24 rp-msg" @click.stop="openPdf(item)"
                >处方签</view
              >
            </view>
            <view class="recipelInfo">
              <view
                class="recipelItem"
                v-for="(f, i) in item.contentList"
                :key="i"
              >
                <view class="flex-between">
                  <view class="font26"
                    >{{ i + 1 }}.{{ f.name }}（规格：{{ f.spec }}）</view
                  >
                  <view class="font26 color666">￥{{ f.totalPrice }}</view>
                </view>
                <view class=" font26 paddingLeft16"
                  >{{ f.useWaysText }} {{ f.useFrequencyText }} {{ f.singleDose
                  }}{{ f.singleDoseUnitText }}/次 {{ f.treatment || '-'
                  }}{{ f.treatmentUnitText }} x{{ f.total
                  }}{{ f.totalUnitText }} ￥{{ f.price }}/{{
                    f.singleDoseUnitText
                  }}</view
                >
                <view class="font24 color666 paddingLeft16"
                  >备注：{{ f.remark || '-' }}</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="list box-shadow flex-between">
        <default-img
          class="listImg"
          :url="FILE_URL(infoData.avatar)"
        ></default-img>
        <view class="info">
          <view class="name">
            {{ infoData.doctorName }}
            <text>{{ infoData.sex == '0' ? '女' : '男' }}</text>
          </view>
          <view class="des">
            <text>{{ infoData.deptName }}</text>
            <text>{{ infoData.titleName }}</text>
            <text>{{ infoData.orgName }}</text>
          </view>
          <view class="des text-overflow"
            >擅长：{{ infoData.skilled || '-' }}</view
          >
        </view>
      </view>
      <view class="oerderMain  box-shadow paddtb">
        <view class="orderItem border0 flex-between">
          <view class="title">处方费用</view>
          <view class="info">
            <view>￥{{ infoData.totalFee }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">运费</view>
          <view class="info">
            <view>￥{{ infoData.freightFee }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">合计</view>
          <view class="info">
            <view>￥{{ infoData.payFee }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
      <view class="oerderMain  box-shadow paddtb">
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">订单号</view>
            <view class="info">
              <view>{{ infoData.orderId }}</view>
            </view>
            <view class="copy-t" @click="cope(infoData.orderId)">复制</view>
          </view>
          <view class="flex-between">
            <view class="title">下单时间</view>
            <view class="info">
              <view>{{ infoData.createTime }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">支付时间</view>
            <view class="info">
              <view>{{ infoData.paymentTime || '-' }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
          <view class="flex-between">
            <view class="title">支付方式</view>
            <view class="info">
              <view>微信支付</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">购买人</view>
          <view class="info flex-start-center">
            <image class="headImg" :src="FILE_URL(infoData.userAvatar)"></image>
            <view>{{ infoData.userName }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
      <view class="oerderMain  box-shadow paddtb">
        <view class="orderItem border0 flex-between">
          <view class="title">关联服务订单</view>
          <view class="info flex-start-center">
            <view>{{ infoData.bizOrderId }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="flex-end-start border0 orderItem">
          <button plain class="optBtn on" @click="cope(infoData.bizOrderId)">
            复制
          </button>

          <button plain class="optBtn" @click="bizOrder(infoData.bizOrderId)">
            查看
          </button>
        </view>
      </view>
    </view>
    <view
      class="fiexBtn flex-justify-end"
      v-if="
        infoData.option.cancel ||
          infoData.option.pay ||
          infoData.option.pay ||
          infoData.option.delete ||
          infoData.option.showExpress ||
          infoData.option.confirm ||
          infoData.orderStatus === 'WAIT_TAKE' ||
          infoData.orderStatus === 'WAIT_SEND'
      "
    >
      <button
        plain
        class="optBtn on"
        v-if="infoData.option.cancel"
        @click="operation('cancel')"
      >
        取消
      </button>
      <button plain class="optBtn" v-if="infoData.option.pay" @click="pay">
        付款
      </button>
      <button
        plain
        class="optBtn on"
        v-if="infoData.option.delete"
        @click="operation('delete')"
      >
        删除
      </button>
      <button
        plain
        class="optBtn on"
        v-if="
          infoData.orderStatus === 'WAIT_TAKE' ||
            infoData.orderStatus === 'WAIT_SEND'
        "
        @click="rpRefund(infoData)"
      >
        退款
      </button>
      <button
        plain
        class="optBtn on"
        v-if="infoData.option.showExpress"
        @click="gotoInfo('/pages-user/logistics/logistics?id=' + expressInfoId)"
      >
        查看物流
      </button>
      <button
        plain
        class="optBtn"
        v-if="infoData.option.confirm"
        @click="operation('confirm')"
      >
        确认收货
      </button>
    </view>
    <!--选择支付方式-->
    <popup-pay ref="pay" @success="paySuccess"></popup-pay>
  </view>
</template>

<script>
import { downloadRxToUrl } from '@/common/request/user'

import util from '@/common/util.js'
import { detailRp } from '@/common/request/userCenter'
import {
  orderCancel,
  orderDelete,
  orderConfirm,
  handelRpRefund,
} from '../../common/request/index.js'
export default {
  data() {
    return {
      expressInfoId: '', //物流id
      isOpen: true,
      isrecipel: false,
      isrecipelhis: false,
      isOrdermore: false,
      takeType: 1, // 1.自提，2.邮寄
      index: 0,
      date: '',
      tabList: [
        {
          name: '全部',
          value: '',
          num: 0,
          numKey: 'all',
        },
        {
          name: '待付款',
          value: 'UNPAID',
          num: 0,
          numKey: 'unpaid',
        },
        {
          name: '待自提',
          value: 'WAIT_TAKE',
          num: 2,
          numKey: 'waitTake',
        },
        {
          name: '待发货',
          value: 'WAIT_SEND',
          num: 2,
          numKey: 'waitSend',
        },
        {
          name: '待收货',
          value: 'WAIT_RECEIVE',
          num: 2,
          numKey: 'waitReceive',
        },
        {
          name: '已完成',
          value: 'FINISHED',
          num: 2,
          numKey: 'finished',
        },
        {
          name: '已关闭',
          value: 'CLOSED',
          num: 2,
          numKey: 'closed',
        },
      ],
      addressList: [
        {
          id: 1,
          title: '重庆大药房光电园店1',
          phone: '023-12345678',
        },
        {
          id: 1,
          title: '重庆大药房光电园店2',
          phone: '023-12345678',
        },
        {
          id: 3,
          title: '重庆大药房光电园店3',
          phone: '023-12345678',
        },
      ],
      id: '',
      infoData: {
        option: {},
      },
    }
  },
  onLoad: function(option) {
    if (option.bizId) {
      this.id = option.bizId
    }
    if (option.expressInfoId) {
      this.expressInfoId = option.expressInfoId
    }
    let date = new Date()
    this.date = util.dateFtt('yyyy-MM-dd', date)
  },
  mounted() {
    this.getIngo()
  },
  methods: {
    //患者处方退款
    rpRefund(item) {
      uni.showModal({
        title: '提示',
        content: '是否确认退款？',
        success: async res => {
          if (res.confirm) {
            console.log('退款')
            await handelRpRefund({ orderId: item.orderId })
            uni.showToast({
              title: '退款成功！',
              icon: 'none',
            })
            this.getIngo()
          }
        },
      })
    },
    async openPdf(item) {
      const res = await downloadRxToUrl({ rxId: item.id /* ,isHtml:true */ })
      //打开处方签
      wx.downloadFile({
        // 示例 url，并非真实存在
        url: `${host}${res.group}/${res.path}`,
        success: function(re) {
          const filePath = re.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function(re) {
              console.log('打开文档成功')
            },
          })
        },
      })
      // uni.navigateTo({
      //   url:
      //     '/pages/web-view/web-view?title=处方签&src=' +
      //     encodeURIComponent(
      //       'https://miapp.chuntaoyisheng.com/gfms/' + res.path,
      //     ),
      // })
    },
    switchBizType(type) {
      return util.switchBizType(type)
    },
    switchBizWay(way) {
      return util.switchBizWay(way)
    },
    // 获取详情
    async getIngo() {
      this.infoData = await detailRp({
        orderId: this.id,
      })
      this.countdown()
    },
    // 状态
    getstate(value) {
      let name = ''
      this.tabList.forEach(i => {
        if (i.value == value) {
          name = i.name
        }
      })
      return name
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
    pay() {
      this.$refs.pay.show(this.infoData.orderId)
    },
    paySuccess() {
      uni.showToast({
        title: '支付成功',
      })
      //支付成功
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 1000)
    },
    /***
     *取消 删除 确认收货（暂无接口）
     */
    operation(state) {
      if (state == 'cancel') {
        orderCancel({
          orderId: this.id,
        }).then(data => {
          if (!data) {
            return
          }
        })
      } else if (state == 'delete') {
        orderDelete({
          orderId: this.id,
        }).then(data => {
          if (!data) {
            return
          }
        })
      } else {
        orderConfirm({
          orderId: id,
        }).then(data => {
          if (!data) {
            return
          }
        })
      }
      uni.showToast({
        title: '操作成功！',
      })
      uni.navigateBack({
        delta: 1,
      })
    },
    /***
     *进入服务订单
     */
    bizOrder(id) {
      uni.navigateTo({
        url: '../serviceOrder/detail?bizId=' + id,
      })
    },
    /***
     *付款时间倒计时
     */
    countdown() {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date(
        (this.infoData.countDownTime || '').replace('-', '/').replace('-', '/'),
      ) //到期时间
      var currentTime = new Date(
        (this.infoData.currentTime || '').replace('-', '/').replace('-', '/'),
      ) //当前系统时间
      var dateDiff = dateEnd.getTime() - currentTime.getTime() //时间差的毫秒数
      if (!this.infoData.countDownTime || dateDiff < 0) {
        return ''
      }
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) //计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000)

      this.infoData.hours = dayDiff * 24 + hours
      this.infoData.minutes = minutes
      this.infoData.seconds = seconds
      this.$forceUpdate()
    },
    previewImage(file) {
      uni.previewImage({
        current: this.FILE_URL(file),
        urls: this.infoData.picList.map(item => this.FILE_URL(item)),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

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
.rp-msg {
  color: #0ab2c1;
  margin-right: 30rpx;
  border: 1px solid #0ab2c1;
  padding: 0px 16rpx;
  border-radius: 30rpx;
}
</style>
