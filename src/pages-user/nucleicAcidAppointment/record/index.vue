<template>
  <view class="wrap">
    <app-card
      styles="padding:20rpx"
      v-for="(item, index) in list"
      :key="index"
      @click="
        goto(`/pages-user/nucleicAcidAppointment/record/detail?id=${item.id}`)
      "
    >
      <view class="name"
        >{{ item.name }}<text class="phone">{{ item.encryPhone }}</text></view
      >
      <view class="flex-between">
        <view class="title">{{ item.orderItem }}</view>
        <view class="price">￥{{ item.price }}</view>
      </view>
      <view class="date">预约时间：{{ item.rangeTime }}</view>
    </app-card>
    <uni-load-more v-show="pages > 1" :status="more"></uni-load-more>
    <uni-load-more
      v-if="list.length > 0"
      status="nomore"
      :contentText="{
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载数据中',
        contentnomore: '没有更多数据了',
      }"
    ></uni-load-more>
    <NoData v-if="list.length == 0"></NoData>
    <view class="toAppointment" @click="infoFlowForm">立即预约</view>
  </view>
</template>
<script>
import appCard from '@/components/app/app-card'
import NoData from '@/pages-user/components/NoData'
import { userRegList } from '../api/index'
import { findHasError } from '@/common/request/index.js'
export default {
  components: { appCard, NoData },
  data() {
    return {
      list: [],
      currentNum: 0,
      pageSize: 10,
      total: 0,
      more: 'more',
    }
  },
  onLoad(options) {
    this.getuserRegList()
    this.memberId = options.memberId
  },
  onReachBottom() {
    if (this.currentNum < this.total) {
      this.currentNum++
      this.getuserRegList()
    }
  },
  methods: {
    async getuserRegList() {
      uni.showLoading()
      let res = await userRegList({
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      uni.hideLoading()
      console.log(res)
      this.total = res.total
      this.list = this.list.concat(res.data)
      console.log(this.list)
      if (res.pageNum < res.pages) {
        this.more = 'more'
      } else {
        this.more = 'noMore'
      }
    },
    async infoFlowForm() {
      //取消核酸预约【是】的限制 start
      // uni.showLoading()
      // const intoState = await findHasError({ memberId: this.memberId })
      // uni.hideLoading()
      // if (intoState) {
      //   return uni.showModal({
      //     title: '系统提醒',
      //     content:
      //       '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下预约。',
      //     showCancel: false,
      //   })
      // }
      //end
      this.goto('/pages-user/nucleicAcidAppointment/flowform/index?isform=0')
    },
    goto(url) {
      uni.navigateTo({
        url,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 20rpx;
  padding-bottom: 108rpx;
  .name {
    font-size: 30rpx;
    .phone {
      font-size: 24rpx;
      margin-left: 36rpx;
    }
  }
  .title {
    font-size: 24rpx;
  }
  .price {
    font-size: 26rpx;
    color: $uni-color-primary;
  }
  .date {
    font-size: 24rpx;
    color: #666;
  }
  .toAppointment {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 88rox;
    line-height: 88rpx;
    color: #fff;
    background: $uni-color-primary;
    text-align: center;
    font-size: 30rpx;
  }
}
</style>
