<template>
  <view class="">
    <!--主页按钮-->
    <homeIcom />
    <view class="doctorWrap">
      <view class="search flex-between box-shadow">
        <input
          type="text"
          v-model="searchKeywords"
          class="flex_1"
          @input="searchTap"
          placeholderClass="searchtext"
          placeholder="搜索关键字"
        />
        <uni-icons
          type="search"
          class="searchIcon"
          size="20"
          @click="searchTap"
        ></uni-icons>
      </view>
    </view>
    <view class="box-shadow bg">
      <view
        class="list "
        v-for="(item, index) in list"
        :key="index"
        @click="toInfo(item.id)"
      >
        <view class="flex-between">
          <view class="title">{{ item.title }}</view>
          <view class="date">{{ item.releaseTime }}</view>
        </view>
        <view class="info overflow-hidden" v-html="item.body"></view>
      </view>
    </view>
    <uni-load-more :status="more"></uni-load-more>
  </view>
</template>

<script>
import { announceAnyData } from '@/common/request/index'
export default {
  data() {
    return {
      more: 'loading',
      currentNum: 1,
      pageSize: 10,
      pages: 0,
      searchKeywords: '',
      list: [],
    }
  },
  onLoad() {
    this.getannounceAnyData()
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      this.getannounceAnyData()
    }
  },
  methods: {
    // 获取列表
    async getannounceAnyData() {
      let list = await announceAnyData({
        searchType: 0,
        searchKeywords: this.searchKeywords,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      this.list = this.list.concat(list.list)
      this.pages = list.pages
      if (list.pages > 1) {
        this.more = 'more'
      } else {
        this.more = 'noMore'
      }
    },
    searchTap() {
      this.list = []
      this.currentNum = 1
      this.getannounceAnyData()
    },
    toInfo(id) {
      uni.navigateTo({
        url: '/pages-doctor/notice/detail?id=' + id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.doctorWrap {
  padding: 20rpx 30rpx;
}
.search {
  background: #fff;
  padding: 0 20rpx 0 32rpx;
  border-radius: 36rpx !important;
  height: 72rpx;
  line-height: 72rpx;
  .searchtext {
    font-size: 28rpx;
    color: #999;
  }
  .searchIcon {
    color: #888 !important;
  }
}
.bg {
  background: #fff;
  overflow: hidden;
  padding-left: 30rpx;
}
.list {
  background: #fff;
  padding: 30rpx 30rpx;
  padding-left: 0;
  cursor: pointer;
  border-bottom: 1px solid #e6e6e6;
  .date {
    font-size: 24rpx;
    color: #666;
  }
  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    font-weight: bold;
  }
  .info {
    font-size: 24rpx;
    color: #666;
    margin-top: 20rpx;
    height: 40px;
    overflow: hidden;
  }
}
</style>
