<template>
  <view class="orderWrap2">
    <!--主页按钮-->
    <homeIcom />
    <view :class="['headerTop' ,isFilter?'':'box-shadow']">
      <view class="searchWrap">
        <view class="search flex-between">
          <input type="text" placeholderClass="searchtext" placeholder="搜索患者姓名" v-model="parameter.keywords" />
          <uni-icons type="search" class="searchIcon" size="20" @click="search"></uni-icons>
        </view>
      </view>
      <view class="filter-l">
        <view v-for="(item,index) in filterData" :key="index" :class="['title', filter==index?'on':'']" @click="changeFilter(index)">
          {{item.name}}
        </view>
      </view>

      <view class="flex-between">
        <scroll-view scroll-x class="tabList">
          <view class="tabWrap">
            <view :class="['tabItem', current==0?'on':'']" @click="tabTap(0)">全部({{extend.all}})</view>
            <view :class="['tabItem', current==1?'on':'']" @click="tabTap(1)">待接诊({{extend.waitTreat}})</view>
            <view :class="['tabItem', current==2?'on':'']" @click="tabTap(2)">接诊中({{extend.inTreat}})</view>
            <view :class="['tabItem', current==3?'on':'']" @click="tabTap(3)">待评价({{extend.toEvaluate||0}})</view>
            <view :class="['tabItem', current==4?'on':'']" @click="tabTap(4)">已完成({{extend.finished}})</view>
            <view :class="['tabItem', current==5?'on':'']" @click="tabTap(5)">已关闭({{extend.closed}})</view>

          </view>
        </scroll-view>
      </view>

    </view>

    <scroll-view scroll-y="true" @scrolltolower="tolower" class="listWrap">
      <view class="listItem box-shadow" v-for="(item, index) in activeList" :key="index" @click="gotoInfo('/pages-doctor/user/order/detail?orderId='+item.orderId)">
        <view class="list_a flex-between">
          <text>订单号：{{item.orderId}}</text>

          <text class="state" v-if="item.orderStatus=='WAIT_TREAT'">待接诊</text>
          <text class="state" v-if="item.orderStatus=='IN_TREAT'">接诊中</text>
          <text class="state" v-if="item.orderStatus=='TO_EVALUATE'">待评价</text>
          <text class="state" v-if="item.orderStatus=='FINISHED'">已完成</text>
          <text class="state" v-if="item.orderStatus=='CLOSED'">已关闭</text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">就诊人</text>
          <text class="value">{{item.memberName}}</text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">诊疗类型</text>
          <text class="value">{{switchBizType(item.bizType)}} {{switchBizWay(item.wayType)}}</text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">下单时间</text>
          <text class="value">{{item.createTime}}</text>
        </view>

        <view class="list_b flex-start-center" v-show="item.date">
          <text class="title">预约时间</text>
          <text class="value">{{item.date}}{{item.startTime}}</text>
        </view>

        <view class="list_b flex-start-center">
          <text class="title">价格</text>
          <text class="value">￥{{item.payFee}}</text>
        </view>
        <view class="countdown" v-if="item.orderStatus=='WAIT_TREAT'"><text>{{countdown(item)}}
            剩余：</text>

          <uni-countdown color="#E45B5B" splitor-color="#E45B5B" background-color="#fff" border-color="#fff" :show-day="false"
            :hour="item.hours||0" :minute="item.minutes||0" :second="item.seconds||0"></uni-countdown>
        </view>
        <view class="flex-between list_c" @click.stop>
          <view>
          </view>
          <view class="flex-start-center">
            <button plain class="optBtn" v-if="item.option.accept" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+item.orderId)">接诊</button>
            <button plain class="optBtn on" v-if="item.option.audit" @click="reject(false,item.orderId)">拒绝</button>
            <button plain class="optBtn" v-if="item.option.audit" @click="reject(true,item.orderId)">同意接诊</button>
            <button plain class="optBtn" v-if="item.option.enterRoom" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+item.orderId)">诊室</button>
            <!-- 视频类业务 -->
            <button plain class="optBtn" v-if="item.option.video" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+item.orderId)">接诊</button>

            <button plain class="optBtn" v-if="item.option.showRp" @click="gotoInfo('/pages-doctor/user/prescription/info?id='+item.orderId)">处方</button>

            <button plain class="optBtn" v-if="item.option.showMsg" @click="gotoInfo('/pages-doctor/chat/chat?orderId='+item.orderId)">记录</button>
          </view>
        </view>
      </view>
      <uni-load-more :status="loading" :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载数据中',contentnomore: '没有更多数据了'}"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
  import {
    doctorOrderList,
    doctorOrderAudit,
    doctorReceiving

  } from '../../../common/request/index.js'
  export default {
    data() {
      return {
        loading: 'more', //more（loading前）、loading（loading中）、noMore（没有更多了）
        current: 0,
        themeColor: '#0AB2C1',
        selectActive: [],
        activeList: [],
        extend: {}, //头部数量
        filter: 0,
        isFilter: false,
        filterData: [{
            "name": "在线咨询",
            'type': 'CONSULT',
            "value": 1
          },
          {
            "name": "在线复诊",
            'type': 'REPEAT_CLINIC',
            "value": 2
          },
          {
            "name": "慢病续方",
            'type': 'CARRYON_PRESC',
            "value": 3
          }
        ],
        statusData: ['', 'WAIT_TREAT', 'IN_TREAT', 'TO_EVALUATE', 'FINISHED', 'CLOSED'],
        parameter: {
          doctorId: '',
          orderType: 'CONSULT',
          orderStatus: '', //
          keywords: '', //关键字
          currentNum: 0,
          pages: 1,
        }
      };
    },
    onLoad(options) {
      if(options.current){
        this.current = options.current
        this.parameter.orderStatus = this.statusData[options.current]
      }
    },
    onShow() {
      this.parameter.currentNum = 0
      this.activeList = []
      this.getOrderList()
    },
    methods: {
      getOrderList() {

        this.parameter.currentNum++
        doctorOrderList(this.parameter).then(data => {
          if (data && data.data) {
            this.parameter.pages = data.pages
            this.parameter.currentNum = data.pageNum
            this.activeList = [...this.activeList, ...data.data]
            this.extend = data.extend
            if (data.pages == data.pageNum) {
              this.loading = 'noMore'
            }
          } else {
            this.loading = 'noMore'
          }
        })
      },
      reject(state, id) {

        let str = state ? '确认通过' : '确认驳回'
        let _slf = this
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
                _slf.parameter.currentNum = 0
                _slf.activeList = []
                _slf.getOrderList()
              })

            } else if (res.cancel) {

            }
          }
        })
      },
      // receivingC(id){
      //   doctorReceiving({orderId:id}).then(data=>{
      //     uni.showToast({
      //       title: '已成功接诊！'
      //     })
      //     this.parameter.currentNum = 0
      //     this.activeList = []
      //     this.getOrderList()
      //   })
      // },
      changeFilter(index) {
        this.filter = index
        this.parameter.orderType = this.filterData[index].type
        this.isFilter = false
        this.parameter.currentNum = 0
        this.activeList = []
        this.getOrderList()
      },
      tabTap(e) {
        this.current = e
        this.parameter.orderStatus = this.statusData[this.current]
        this.parameter.currentNum = 0
        this.activeList = []
        this.getOrderList()
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
          url: url
        })
      },

      tolower() {
        if (this.parameter.pages > this.parameter.currentNum) {
          this.loading = "loading"
          this.getOrderList()
        }

      },
      //搜索
      search() {
        this.parameter.currentNum = 0
        this.activeList = []
        this.getOrderList()
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

      /***
       *付款时间倒计时
       */
      countdown(item) {
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateEnd = new Date((item.countDownTime || '').replace('-', '/').replace('-', '/')); //到期时间
        var currentTime = new Date((item.currentTime || '').replace('-', '/').replace('-', '/')); //当前系统时间
        var dateDiff = dateEnd.getTime() - currentTime.getTime(); //时间差的毫秒数
        if (!item.countDownTime || dateDiff < 0) {
          return ""
        }
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
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

        item.hours = (dayDiff * 24 + hours);
        item.minutes = minutes
        item.seconds = seconds
        return ""
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/common/order.scss';

  .filter-l {
    display: flex;

    background: #fff;


    .title {
      margin-right: 20rpx;
      text-align: center;
      width: 160rpx;
      height: 60rpx;
      line-height: 60rpx;
      background: rgba(242, 242, 242, 1);
      border-radius: 30rpx;
      font-size: 24rpx;
      color: rgba(51, 51, 51, 1);

      &.on {
        background: rgba(10, 178, 193, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }



  .listWrap {
    padding-top: 300rpx;
    height: calc(100vh - 300rpx);
    padding-left: 0;
    .listItem {
      width: 650rpx;
      margin: 0 auto;
      margin-bottom: 20rpx;
    }
  }

  .orderWrap2 {
    .filterText {
      padding-right: 30rpx;

      text {
        font-size: 18rpx;
        color: #666;
      }
    }
  }

  .tabList {
    width: 100%;
  }

  .searchWrap {
    padding-right: 30rpx;
    padding-top: 20rpx;
    margin-bottom: 30rpx;

    .search {
      background: #F2F2F2;
    }
  }

  .selfExtracting {
    background: #fff;
    border-radius: 30rpx 30rpx 0 0;
    padding: 40rpx;
    padding-bottom: 100rpx;
    position: relative;

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

    .store {
      font-size: 26rpx;
      color: #666;
      width: 50%;
      margin: 0 auto;

      .iconfont {
        font-size: 32rpx;
        color: $uni-color-primary;
        margin-right: 10rpx;
      }
    }

    .codeImg {
      width: 260rpx;
      height: 260rpx;
      display: block;
      margin: 0 auto;
      margin-top: 30rpx;
      margin-bottom: 10rpx;
    }

    .title {
      font-size: 30rpx;
      color: #1A1A1A;
      text-align: center;
      font-weight: bold;
    }
  }

  .countdown {
    font-size: 26rpx;
    color: #e45b5b;
    display: flex;
    text-align: center;
    line-height: 20rpx;
  }
</style>
