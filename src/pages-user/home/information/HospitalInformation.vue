<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
    <user-search @search="search()"  placeholder='按文章标题搜索'></user-search>
    <scroll-view scroll-y="true" @scrolltolower="tolower" class="scroll">
      <view v-for="(item,index) in informations" class="item" @click="detail(item.id)" :key="index">
        <text class="name">{{item.title}}</text>
        <view class="view">
          <view class="from">{{item.source}}</view>
          <text class="time">{{item.createTime}}</text>
        </view>
        <view class="line"></view>
      </view>
      <uni-load-more :status="loading" :contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载数据中',contentnomore: '没有更多数据了'}"></uni-load-more>
    </scroll-view>

  </view>
</template>

<script>
  import {
    findInformationByPage
  } from '../../../common/request/index.js'
  export default {
    data() {
      return {
        loading: 'more', //more（loading前）、loading（loading中）、noMore（没有更多了）
        informations: [],
        parameter: {
          pageNum: 0,
          pageSize: 10,
          pages: 1,
          title:''
        }
      }
    },
    created() {
      this.informations = []
      this.getInformationByPage()
    },
    methods: {
      search(value) {
        this.parameter.title=value
        this.parameter.pageNum=0
        this.informations = []
        this.getInformationByPage()
      },
      detail(id) {
        uni.navigateTo({
          url: '/pages-user/home/information/InformationDetail?id='+id,

        });
      },
      tolower() {
        if (this.parameter.pages > this.parameter.pageNum) {
          this.loading = "loading"
          this.getInformationByPage()
        }

      },
      getInformationByPage() {
        this.parameter.pageNum++
        findInformationByPage(this.parameter).then(data => {
          if (data) {
            this.parameter.pageNum = data.pageNum
            this.parameter.pages = data.pages
            this.informations = [...this.informations, ...data.data]
            if (this.parameter.pages <= this.parameter.pageNum) {
              this.loading = "noMore"
            }

          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .scroll {
    background: #FFFFFF;
    height: 100vh;
  }

  .item {
    padding: 30upx 30upx 0upx 30upx;

    .name {
      font-size: 30upx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
    }

    .view {
      margin-top: 30upx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .from {
        width: 120upx;
        height: 30upx;
        background: rgba(208, 242, 245, 1);
        border-radius: 15upx;
        font-size: 20upx;
        font-weight: 400;
        text-align: center;
        line-height: 30upx;
        color: rgba(10, 178, 193, 1);
      }

      .time {
        font-size: 24upx;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }

    .line {
      width: 720px;
      height: 1px;
      background: rgba(230, 230, 230, 1);
      margin-top: 30upx;
    }
  }
</style>
