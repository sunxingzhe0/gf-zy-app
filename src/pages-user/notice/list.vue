<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="doctorWrap">
      <view class="search flex-between box-shadow">
        <input
          type="text"
          style="width:100%;height:100%"
          v-model="searchKeywords"
          placeholderClass="searchtext"
          placeholder="按公告标题搜索"
          @input="input()"
        />
        <uni-icons type="search" class="searchIcon" size="20"></uni-icons>
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
        <view class="info" v-html="item.body"></view>
      </view>
    </view>
    <uni-load-more :status="more"></uni-load-more>
  </view>
</template>

<script>
import { announceAnyData } from '../../common/request/index.js'
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
    if (this.list.length < this.pageSize * this.currentNum) return
    this.currentNum++
    this.getannounceAnyData()
  },
  methods: {
    // 获取列表
    async getannounceAnyData() {
      const list = await announceAnyData({
        searchType: 0,
        searchKeywords: this.searchKeywords,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })

      this.list = this.list.concat(list.list)
      this.pages = list.pages
      this.more = list.pages > 1 ? 'more' : 'noMore'
    },
    input() {
      this.list = []
      this.currentNum = 1
      this.getannounceAnyData()
    },
    toInfo(id) {
      uni.navigateTo({
        url: '/pages-user/notice/detail?id=' + id,
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
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 30rpx;
    color: #1a1a1a;
    font-weight: bold;
  }

  .info {
    font-size: 24rpx;
    color: #666;
    margin-top: 20rpx;
    text-align: justify;
    height: 80rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
