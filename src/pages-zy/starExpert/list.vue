<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <view class="search flex-between">
        <input type="text" class="flex_1" v-model="keywords" placeholderClass="searchtext" placeholder="搜索姓名/职称/擅长" />
        <uni-icons type="search" @click="search" class="searchIcon" size="20"></uni-icons>
      </view>
    </view>
    <!-- 医生列表 -->
    <view class="docBox">
      <view class="docItem flex-between box-shadow" v-for="(item, index) in starList" :key="index" @click="goTo(`/pages-zy/appointmentDoc/appointmentInfo?docId=${item.id}&deptId=${item.deptId}&orgId=${item.orgCode}`)">
        <view class="headerImg">
          <default-img :url="FILE_URL(item.avatar)"></default-img>
        </view>
        <view class="contentBox">
          <view class="name">{{ item.name }} <text>{{item.sex}}</text></view>
          <text class="info text-overflow">{{item.deptName}} {{item.titleName}} </text>
          <view class="info text-overflow">{{item.orgName}}</view>
          <view class="info text-overflow">{{ item.skilled }}</view>
        </view>
      </view>
      <noData v-if="starList.length == 0"></noData>
    </view>
  </view>
</template>
<script>
  import noData from '../components/NoData.vue'
  import {
    startExperts
  } from '../api/user.js'
  export default {
    components: {
      noData
    },
    data() {
      return {
        // 输入框的值
        keywords: '',
        // 明星专家列表
        starList: [],
        currentNum: 1,
        pageSize: 10,
        pages: 1
      }
    },
    onLoad() {
      this.getstartExperts()
    },
    methods: {
      //获取列表
      async getstartExperts() {
        let data = await startExperts({
          searchKeywords: this.keywords,
          currentNum: this.currentNum,
          pageSize: this.pageSize
        })
        this.starList = this.starList.concat(data.data)
        this.pages = data.pages
      },
      // 点击跳转
      goTo(url) {
        uni.navigateTo({
          url:url
        })
      },
      search() {
        this.starList = []
        this.currentNum = 1
        this.pages = 1
        this.getstartExperts()
      }
    },
    onReachBottom() {
      if (this.currentNum < this.pages) {
        this.currentNum = this.currentNum + 1
        this.getstartExperts()
      }
    }
  }
</script>
<style scoped lang="scss">
  .headerTop {
    padding: 20rpx;
    background: #fff;
    border-radius: 0 0 20rpx 20rpx !important;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .search {
    background: #fff;
    padding: 0 20rpx 0 32rpx;
    border-radius: 36rpx !important;
    height: 72rpx;
    line-height: 72rpx;
    background: #f2f2f2;

    .searchtext {
      font-size: 28rpx;
      color: #999;
    }

    .searchIcon {
      color: #888 !important;
      width: 60rpx;
      text-align: right;
    }
  }

  .docBox {
    padding: 20rpx 20rpx 0 20rpx;
    padding-top: 134rpx;

    .docItem {
      background: #fff;
      padding: 30rpx;
      align-items: start;
      margin-bottom: 20rpx;

      .headerImg {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
      }

      .contentBox {
        width: 530rpx;
        line-height: 46rpx;

        .name {
          font-size: 30rpx;
          color: #1a1a1a;

          text {
            font-size: 24rpx;
            color: #666;
            margin-left: 45rpx;
          }
        }

        .info {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
</style>
