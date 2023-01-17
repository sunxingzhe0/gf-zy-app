<template>
  <view class="mini-page">
    <view class="search">
      <view class="input-box"
        ><input
          placeholder="搜索文章标题"
          placeholder-class="placeholder"
          @input="inputChange"
          :cursor="3"
          :value="searchVal"
          class="input-class"
      /></view>
      <text class="cancel" @click="toBack">取消</text>
    </view>
    <view class="app-card" style="margin-top:10px" v-if="!searchVal">
      <view class="title">搜索历史</view>
      <view class="tab-list-box">
        <view
          class="search-text-list"
          v-for="(val, i) in searchList"
          :key="i"
          @click="searchInVal(val)"
          >{{ val }}</view
        >
      </view>
    </view>
    <view class="app-card" style="margin-top:10px">
      <view class="title" style="margin-bottom:15px">{{
        searchVal ? '文章' : '最近阅读'
      }}</view>
      <view
        @click="toArticleInfo(val.id)"
        class="article-list"
        v-for="val in articleList"
        :key="val.id"
      >
        {{ val.name }}
      </view>
    </view>
  </view>
</template>

<script>
import {
  searchArticle,
  searchKeywords,
  readArticleHistory,
} from '@/pages-sf/api/article'
export default {
  data() {
    return {
      searchVal: '',
      searchList: [],
      articleList: [{ title: '什么叫糖尿病前期？', id: 1 }],
    }
  },
  created() {
    this.readArticleHistory()
    this.searchKeywords()
  },
  methods: {
    toBack() {
      uni.navigateBack()
    },
    //阅读历史 -name+id
    async readArticleHistory() {
      this.articleList = await readArticleHistory()
    },
    //文章搜索-返回id和name
    async searchArticle(params = {}) {
      const res = await searchArticle(params)
      this.articleList = res
    },
    //关键字列表
    async searchKeywords() {
      this.searchList = await searchKeywords()
    },
    //点击历史搜索关键字
    searchInVal(val) {
      this.searchVal = val
      this.searchArticle({ keyword: val })
    },

    //input事件
    inputChange(e) {
      this.searchVal = e.detail.value
      this.searchArticle({ keyword: e.detail.value })
      !e.detail.value && this.readArticleHistory()
    },
    //文章详情
    toArticleInfo(id) {
      uni.navigateTo({
        url: `/pages-sf/src/healthEducation/article/index?id=${id}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  padding: 10px;
  .search {
    margin-top: 5px;
    display: flex;
    .input-box {
      width: 80%;
      .input-class {
        height: 36px;
        border-radius: 18px;
        background: #fff;
        padding-left: 20px;
      }
      v-deep.placeholder {
        color: #999;
      }
    }

    .cancel {
      margin-left: 15px;
      font-size: 14px;
      color: #666;
      line-height: 36px;
    }
  }
  .title {
    height: 15px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-left: 1px solid #0ab2c1;
    margin-bottom: 2px;
  }
  .tab-list-box {
    display: flex;
    flex-wrap: wrap;
    .search-text-list {
      background: #ededed;
      color: #333;
      padding: 6px 10px;
      margin-right: 10px;
      margin-top: 10px;
      border-radius: 14px;
    }
  }
  .article-list {
    line-height: 45px;
    border-top: 1px solid #e6e6e6;
    color: #333;
    font-size: 14px;
  }
}
</style>
