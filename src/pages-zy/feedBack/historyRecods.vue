<template>
  <view class="historyWrap">
    <scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="getMore">
      <app-card
        class="history"
        styles="padding: 30rpx;"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="historyTitle flex-between">
          <view class="title">{{ item.reason }}</view>
          <view class="time">{{ item.createTime }}</view>
        </view>
        <view class="content">{{ item.backContent }}</view>
        <view class="imgWrap">
          <image
            v-for="(img, i) in item.picIds"
            :key="i"
            :src="FILE_URL(img)"
            class="img"
            @click="seeImgInfo(FILE_URL(img))"
          ></image>
        </view>
        <view class="contacts">联系人：{{ item.name }}</view>
        <view class="contacts and-del">
          <text>联系电话：{{ item.phone }}</text>
          <text class="del" @click="handelDel(item)">删除</text>
        </view>
        <view
          v-if="item.replyList.length > 0"
          style="color:#0ab2c1;margin-top:10rpx"
          >官方回复（{{ item.replyList.length || 0 }}）</view
        >
        <view
          v-for="(val, i) in item.replyList"
          :key="i"
          :class="i < item.replyList.length - 1 && 'back-list'"
        >
          <view style="font-size:24rpx;color:#ccc">{{ val.createTime }}</view>
          <view>{{ val.content }}</view>
        </view>
      </app-card>
    </scroll-view>
    <NoData v-if="list.length == 0"></NoData>
    <uni-load-more v-show="pages > 1" :status="more"></uni-load-more>
  </view>
</template>
<script>
import NoData from '../components/NoData'
import AppCard from '@/components/app/app-card'
import { getHistoryList, delUserFeedBack } from '../api/user'
export default {
  components: {
    AppCard,
    NoData,
  },
  data() {
    return {
      currentNum: 1,
      pageSize: 10,
      list: [],
      pages: 1,
      more: 'more',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //删除记录
    handelDel(row) {
      console.log(row)
      uni.showModal({
        title: '提示',
        content: '是否确认删除？',
        success: async res => {
          if (res.confirm) {
            const res = await delUserFeedBack({ id: row.id })
            uni.showToast({
              title: '删除成功！',
              icon: 'none',
            })
            this.list = this.list.filter(i => i.id !== row.id) //不拉接口过滤已删除项
          }
        },
      })
    },
    async getList() {
      this.more = 'loading'
      uni.showLoading()
      let list = await getHistoryList({
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      uni.hideLoading()
      this.pages = list.pages
      this.list = this.list.concat(list.data)
      if (this.currentNum == list.pages) {
        this.more = 'noMore'
      } else {
        this.more = 'more'
      }
    },
    getMore() {
      if (this.currentNum < this.pages) {
        this.currentNum = this.currentNum + 1
        this.getList()
      } else {
        this.more = 'noMore'
      }
    },
    seeImgInfo(url) {
      console.log(url, '图片地址')
      uni.previewImage({
        urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: '', // 当前显示图片的http链接，默认是第一个
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.historyWrap {
  height: calc(100vh - 360rpx);
  padding: 0 20rpx;
  margin-top: 20rpx;
  .history {
    .historyTitle {
      .title {
        font-weight: bold;
        color: #333;
        font-size: 28rpx;
      }
      .time {
        color: #666;
      }
    }
    .content {
      color: #333;
      line-height: 28rpx;
      margin: 20rpx 0;
    }
    .imgWrap {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 30rpx;
      .img {
        width: 180rpx;
        height: 180rpx;
        margin-bottom: 20rpx;
      }
    }
    .contacts {
      color: #666;
    }
    .and-del {
      display: flex;
      justify-content: space-between;
      .del {
        color: red;
      }
    }
  }
}
.back-list {
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 10rpx;
}
</style>
