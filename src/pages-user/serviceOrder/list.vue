<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <view class="tabList">
        <view class="tabWrap flex-between">
          <view
            :class="['tabItem', parameter.orderType == 'CONSULT' ? 'on' : '']"
            @click="tabTap('CONSULT')"
            >在线咨询</view
          >
          <view
            :class="[
              'tabItem',
              parameter.orderType == 'REPEAT_CLINIC' ? 'on' : '',
            ]"
            @click="tabTap('REPEAT_CLINIC')"
            >在线复诊</view
          >
          <view
            :class="[
              'tabItem',
              parameter.orderType == 'CARRYON_PRESC' ? 'on' : '',
            ]"
            @click="tabTap('CARRYON_PRESC')"
            >慢病续方</view
          >
        </view>
      </view>
    </view>
    <view scroll-y="true" class="listWrap">
      <view
        class="listItem box-shadow"
        v-for="(item, index) in data"
        :key="index"
        @click="
          gotoInfo('/pages-user/serviceOrder/detail?orderId=' + item.orderId)
        "
      >
        <view class="list_a flex-between">
          <view class="flex-start-center service">
            <default-img
              class="headerImg"
              :url="FILE_URL(item.avatar)"
            ></default-img>
            <view class="name">{{ item.doctorName }}</view>
            <view class="font26 color666"
              >{{ item.titleName }} {{ item.deptName }}</view
            >
          </view>
          <text class="state" v-if="item.orderStatus == 'UNPAID'">待付款</text>
          <text class="state" v-if="item.orderStatus == 'WAIT_TREAT'"
            >待接诊</text
          >
          <text class="state" v-if="item.orderStatus == 'IN_TREAT'"
            >接诊中</text
          >
          <text class="state" v-if="item.orderStatus == 'TO_EVALUATE'"
            >待评价</text
          >
          <text class="" v-if="item.orderStatus == 'CLOSED'">已关闭</text>
          <text class="" v-if="item.orderStatus == 'FINISHED'">已完成</text>
        </view>
        <view class="font26"
          >{{ item.memberName }}: {{ item.illnessDesc }}</view
        >
        <view class="font24 color666">{{ item.createTime }}</view>
        <view class="flex-between list_c" @click.stop>
          <!-- && item.wayType=='VIDEO' -->
          <view class="time flex-start-center" style="line-height: 0rpx;"
            ><text
              v-if="
                item.orderStatus == 'UNPAID' || item.orderStatus == 'WAIT_TREAT'
              "
              >{{ countdown(item) }} 剩余：</text
            >
            <uni-countdown
              v-if="
                item.orderStatus == 'UNPAID' || item.orderStatus == 'WAIT_TREAT'
              "
              color="#E45B5B"
              splitor-color="#E45B5B"
              background-color="#fff"
              border-color="#fff"
              :show-day="false"
              :hour="item.hours || 0"
              :minute="item.minutes || 0"
              :second="item.seconds || 0"
            ></uni-countdown>
          </view>
          <view class="flex-start-center">
            <button
              plain
              class="optBtn on"
              v-if="item.option.cancel"
              @click="orderCancel(item.orderId)"
            >
              取消
            </button>
            <button
              plain
              class="optBtn"
              v-if="item.option.pay"
              @click="payC(item.orderId)"
            >
              付款
            </button>
            <button
              plain
              class="optBtn"
              v-if="item.option.enterRoom"
              @click="gotoInfo('/pages-user/chat/chat?orderId=' + item.orderId)"
            >
              诊室
            </button>
            <button
              plain
              class="optBtn on"
              v-if="item.option.delete"
              @click="orderDelete(item.orderId)"
            >
              删除
            </button>
            <button
              plain
              class="optBtn"
              v-if="item.option.buy"
              @click="
                gotoInfo(
                  '/pages-user/home/doctordetail/DoctorDetail?type=' +
                    item.bizType +
                    '&doctorId=' +
                    item.doctorId,
                )
              "
            >
              继续购买
            </button>

            <button
              plain
              class="optBtn on"
              v-if="item.option.showRp"
              @click="
                gotoInfo(
                  '/pages-user/prescription/prescription?orderId=' +
                    item.orderId,
                )
              "
            >
              处方
            </button>
            <button
              plain
              class="optBtn on"
              v-if="item.option.showMsg"
              @click="gotoInfo('/pages-user/chat/chat?orderId=' + item.orderId)"
            >
              记录
            </button>
            <button
              plain
              class="optBtn "
              v-if="item.option.comment"
              @click="
                gotoInfo(
                  '/pages-user/serviceOrder/evaluate?orderId=' + item.orderId,
                )
              "
            >
              评价
            </button>
          </view>
        </view>
      </view>
      <uni-load-more
        :status="loading"
        :contentText="{
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载数据中',
          contentnomore: '没有更多数据了',
        }"
      ></uni-load-more>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="selectWrap">
        <view class="title">就诊人</view>
        <scroll-view scroll-y="true" class="scroll">
          <view class="flex-between selectMain">
            <view :class="['selectItem', selectActive == '' ? 'on' : '']"
              >全部</view
            >
            <view
              :class="[
                'selectItem',
                selectActive.indexOf(item) > -1 ? 'on' : '',
              ]"
              v-for="(item, index) in 9"
              @click="selectChange(item)"
              :key="index"
              >刘丽芳</view
            >
          </view>
        </scroll-view>
        <view class="selectbtn">
          <text>确定</text>
        </view>
      </view>
    </uni-popup>

    <popup-pay ref="pay" @success="paySuccess"></popup-pay>
  </view>
</template>
<script>
import {
  orderList,
  orderCancel,
  orderDelete,
} from '../../common/request/index.js'
export default {
  components: {},
  data() {
    return {
      loading: 'more', //more（loading前）、loading（loading中）、noMore（没有更多了）
      selectActive: [],
      parameter: {
        orderType: 'CONSULT',
        currentNum: 0,
        pageSize: 10,
        pages: 1,
      },
      data: [],
    }
  },

  onShow() {
    this.data = []
    this.parameter.currentNum = 0
    this.getList()
  },
  onReachBottom() {
    if (this.parameter.pages > this.parameter.currentNum) {
      this.loading = 'loading'
      this.getList()
    }
  },
  methods: {
    getList() {
      this.parameter.currentNum++
      orderList(this.parameter).then(data => {
        if (data && data.data) {
          this.parameter.pages = data.pages
          this.parameter.currentNum = data.pageNum
          this.data = [...this.data, ...data.data]
          if (data.pages == data.pageNum) {
            this.loading = 'noMore'
          }
        } else {
          this.loading = 'noMore'
        }
      })
    },
    // 选择确诊人
    selecvisit() {
      this.$refs.popup.open()
    },
    tabTap(e) {
      if (this.parameter.orderType !== e) {
        this.parameter.orderType = e
        this.data = []
        this.parameter.currentNum = 0
        this.getList()
      }
    },
    switchChange(e) {
      console.log(e)
    },
    selectChange(item) {
      if (this.selectActive.indexOf(item) > -1) {
        this.selectActive.splice(this.selectActive.indexOf(item), 1)
      } else {
        this.selectActive.push(item)
      }
    },
    gotoInfo(url) {
      uni.navigateTo({
        url: url,
      })
    },
    payC(orderId) {
      this.$refs.pay.show(orderId)
    },
    orderCancel(orderId) {
      var _slf = this
      uni.showModal({
        title: '提示',
        content: '是否确认操作',
        success: function(res) {
          if (res.confirm) {
            orderCancel({
              orderId: orderId,
            }).then(data => {
              //刷新
              _slf.data = []
              _slf.parameter.currentNum = 0
              _slf.getList()

              uni.showToast({
                title: '取消成功!',
                icon: 'none',
              })
            })
          }
        },
      })
    },
    orderDelete(orderId) {
      var _slf = this
      uni.showModal({
        title: '提示',
        content: '是否确认操作',
        success: function(res) {
          if (res.confirm) {
            orderDelete({
              orderId: orderId,
            }).then(data => {
              uni.showToast({
                title: '删除成功!',
                icon: 'none',
              })
              //刷新
              _slf.data = []
              _slf.parameter.currentNum = 0
              _slf.getList()
            })
          }
        },
      })
    },
    paySuccess() {
      uni.showToast({
        title: '支付成功',
      })
      //刷新
      this.data = []
      this.parameter.currentNum = 0
      this.getList()
    },

    /***
     *付款时间倒计时
     */
    countdown(item) {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date(
        (item.countDownTime || '').replace('-', '/').replace('-', '/'),
      ) //到期时间

      var currentTime = new Date(
        (item.currentTime || '').replace('-', '/').replace('-', '/'),
      ) //当前系统时间
      var dateDiff = dateEnd.getTime() - currentTime.getTime() //时间差的毫秒数
      if (!item.countDownTime || dateDiff < 0) {
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

      var leave4 = leave3 % (60 * 1000) //计算分钟数后剩余的毫秒数
      var minseconds = Math.round(leave4 / 1000)

      item.hours = dayDiff * 24 + hours
      item.minutes = minutes
      item.seconds = seconds
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.tabList {
  padding-right: 70rpx;
  padding-left: 40rpx;

  .tabItem {
    margin-right: 0;
  }
}

.listWrap {
  padding: 110rpx 20rpx 0;

  .listItem {
    margin-bottom: 20rpx;
  }

  .service {
    .headerImg {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      margin-right: 18rpx;
      overflow: hidden;
    }

    .name {
      font-size: 30rpx;
      color: #1a1a1a;
      margin-right: 22rpx;
      font-weight: bolder;
    }
  }

  /deep/.uni-countdown__number {
    font-size: 26rpx;
    width: auto;
    height: auto;
  }
}
</style>
