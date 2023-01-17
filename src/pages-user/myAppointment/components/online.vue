<template>
  <view>
    <view class="flex-between tabWrap">
      <view
        :class="current == item.key ? 'tabItem on' : 'tabItem'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="tabChange(item.key)"
        >{{ item.title }}</view
      >
    </view>
    <view
      class="menzhenItemBox box-shadow"
      v-for="(item, index) in list"
      :key="index"
      @click="goto('/pages-user/chat/chat?orderId=' + item.orderId)"
    >
      <view class="contentBox flex-start-start">
        <view class="headerImg">
          <default-img :url="FILE_URL(item.avatar)"></default-img>
        </view>
        <view class="content flex_1">
          <view class="name flex-between">
            <view>{{ item.doctorName }}</view>
            <text>{{
              item.bizType == 'CONSULT'
                ? '在线咨询'
                : item.bizType == 'REPEAT_CLINIC'
                ? '在线复诊'
                : '慢病续方'
            }}</text>
          </view>
          <view class="flex-between">
            <view class="doctor">{{ item.titleName }}</view>
            <view class="doctor"> {{ item.deptName }}</view>
          </view>
          <view class="dateBox flex-between">
            <view class="doctor flex-start-start">
              <text>创建时间：</text>
              <text>{{ item.createTime }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <NoData v-if="list.length == 0"></NoData>
  </view>
</template>

<script>
import NoData from '../../components/NoData'
import { onlineList } from '../../api/user.js'
export default {
  components: {
    NoData,
  },
  props: {
    type: String,
    patientInfo: Object,
  },
  data() {
    return {
      doctorId: uni.getStorageSync('userId'),
      orgId: uni.getStorageSync('orgId'),
      current: 'WAIT_TREAT',
      tabList: [
        {
          title: '待接诊',
          key: 'WAIT_TREAT',
        },
        {
          title: '接诊中',
          key: 'IN_TREAT',
        },
        {
          title: '已结束',
          key: 'FINISHED',
        },
        {
          title: '已退费',
          key: 5,
        },
      ],
      list: [],
      currentNum: 1,
      pageSize: 10,
      pages: 1,
    }
  },
  methods: {
    //初始化数据
    init() {
      this.list = []
      this.currentNum = 1
      this.pages = 1
      this.getList()
    },
    tabChange(e) {
      this.current = e
      this.init()
    },
    async getList() {
      const list = await onlineList({
        doctorId: this.doctorId,
        orgId: this.orgId,
        orderType: 'REPEAT_CLINIC',
        memberIds:this.patientInfo.memberId,
        orderStatus: this.current,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      this.pages = list.pages
      this.list = this.list.concat(list.data || [])
    },
    goto(url) {
      uni.navigateTo({
        url,
      })
    },
    // 展示温馨提示
    showPop(recordId) {
      this.recordId = recordId
      uni.showModal({
        title: '提示',
        content: '是否确认取消该预约？',
        success: res => {
          if (res.confirm) {
            this.refund()
          }
        },
      })
    },
    getPageMore() {
      if (this.currentNum < this.pages) {
        this.currentNum = this.currentNum + 1
        this.getList()
      }
    },
    // 取消预约
    async refund() {
      let res = await orderRefund({
        orderNo: this.recordId,
      })
      if (res) {
        uni.showToast({
          title: '取消成功',
        })
        this.init()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tabWrap {
  padding: 20rpx 30rpx;
  padding-bottom: 0;
  .tabItem {
    font-size: 26rpx;
    color: #666;
    height: 60rpx;
    box-sizing: border-box;
    &.on {
      border-bottom: 2px solid $uni-color-primary;
      color: $uni-color-primary;
    }
  }
}
.menzhenItemBox {
  padding: 30rpx 20rpx;
  background: #fff;
  overflow: hidden;
  margin: 20rpx auto 0;

  .dateBox {
    .date {
      font-size: 26rpx;
      color: #666;
    }
    .icon {
      width: 54rpx;
      line-height: 30rpx;
      background: #ea9d38;
      border-radius: 4rpx;
      text-align: center;
      font-size: 20rpx;
      color: #fff;
      &.timeOut {
        background: #f74a4a;
      }
    }
  }
  .contentBox {
    .headerImg {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      overflow: hidden;
    }
    .content {
      padding-left: 15rpx;
    }
    .name {
      view {
        font-size: 30rpx;
        color: #333333;
        font-weight: 600;
      }
      text {
        color: #2d5fdf;
        font-size: 24rpx;
      }
    }

    .doctor {
      color: #666;
      font-size: 26rpx;
      font-weight: 400;
    }

    .cancelBtn {
      width: 152rpx;
      height: 60rpx;
      border: 1px solid #999999;
      border-radius: 30rpx;
      text-align: center;
      line-height: 58rpx;
      font-size: 26rpx;
      color: #333;
      margin-top: 20rpx;
      float: right;
      &.default {
        border-color: $uni-color-primary;
        color: $uni-color-primary;
      }
      &.disabled {
        border-color: #ccc;
        color: #999;
      }
    }
  }
}
</style>
