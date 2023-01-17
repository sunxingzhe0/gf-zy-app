<template>
  <view class="mini-page">
    <topbar class="topbar">
      <!-- tab -->
      <view class="tab-and-sorted">
        <view class="top-tabs">
          <view
            class="tab-list"
            v-for="val in columnList"
            :key="val.id"
            @click="handleChangeTab(val.id)"
          >
            <text
              class="font "
              :class="activeColumn === val.id ? 'active' : ''"
              >{{ val.name }}</text
            >
          </view>
        </view>
        <view class="sorted-search">
          <view
            @click="openTitleList"
            class="open-class"
            style="height:15px;width:15px"
          >
            <view class="icon-mini">
              <view></view>
              <view></view>
            </view>
            <view class="icon-mini">
              <view></view>
              <view></view>
            </view>
          </view>
          <view
            style="margin-right:10px;width:15px;height:15px"
            @click="toSearch"
          >
            <image
              class="icon-class"
              :src="FILE_URL_BUILT_IN('sousuo.png')"
              alt=""
            ></image>
          </view>
        </view>
      </view>
    </topbar>

    <!-- list -->
    <view
      class="app-card list-item"
      v-for="(val, index) in articleList"
      :key="index"
      style="margin-bottom:10px"
      @click="articleInfo(val.id)"
    >
      <view class="title">{{ val.title }}</view>
      <view class="time">{{ val.createTime }}</view>
    </view>
    <view v-if="articleList.length === 0" class="no-article">暂无数据</view>
    <view v-if="articleList.length > 4" class="bottom-msg"
      >已经到底了，暂无更多数据</view
    >
    <!-- pop -->
    <uni-popup type="bottom" ref="popup">
      <view class="pop-content">
        <view class="pop-title"
          >健康栏目
          <view class="img-box" @click="closeTab">
            <image
              class="image-colse"
              :src="require('@/assets/del.png')"
            ></image>
          </view>
        </view>
        <view class="list-item">
          <view
            v-for="(val, index) in columnList"
            :key="index"
            style="width:33.3%"
            class="list-box"
          >
            <view
              class="mini-item"
              :class="activeColumn === val.id ? 'active' : ''"
              @click="handleChangeTab(val.id)"
              >{{ val.name }}</view
            >
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '../../../components/uni-popup/uni-popup.vue'
import { getArticleList, columnList } from '@/pages-sf/api/article'
export default {
  components: { uniPopup },
  data() {
    return {
      activeColumn: '1', //选中栏目
      columnList: [],
      articleList: [
        {
          title:
            '卫健委拟规定：新冠病毒样本应指定机构集中保存， 新冠病毒样本应指定机构',
          time: '2020-05-01 09:10:20',
        },
      ],
    }
  },
  created() {
    this.getColumnList()
    this.getArticleList({ recommend: true })
  },
  methods: {
    //咨询栏目
    async getColumnList() {
      uni.showLoading()
      this.columnList = [{ id: '1', name: '推荐' }].concat(await columnList())
      uni.hideLoading()
    },
    //文章列表
    async getArticleList(params = {}) {
      const res = await getArticleList(params)
      this.articleList = res?.list
    },
    //选择栏目
    handleChangeTab(id) {
      this.$refs.popup.close()
      this.activeColumn = id
      this.getArticleList(id === '1' ? { recommend: true } : { columnId: id })
    },
    openTitleList() {
      this.$refs.popup.open()
    },
    closeTab() {
      this.$refs.popup.close()
    },
    //文章详情
    articleInfo(id) {
      uni.navigateTo({
        url: `/pages-sf/src/healthEducation/article/index?id=${id}`,
      })
    },
    toSearch() {
      uni.navigateTo({
        url: '/pages-sf/src/healthEducation/seach/index',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  height: 100%;
  padding: 10px;
  padding-top: 50px;
}
.tab-and-sorted {
  display: flex;
  align-items: center;
  width: 100%;
  .top-tabs {
    height: 40px;
    // display: flex;
    // justify-content: space-around;
    // flex-wrap: nowrap;
    white-space: nowrap;
    padding-left: 5px;
    overflow-x: scroll;
    flex: 1;
    .tab-list {
      margin-right: 25px;
      display: inline-block;
      /*  display: flex;
      justify-content: center;
      align-items: center; */
      .font {
        display: inline-block;
        font-size: 14px;
        color: #666666;
        line-height: 36px;
      }
      .active {
        color: #0ab2c1;
        border-bottom: 1px solid #0ab2c1;
      }
    }
  }
  .sorted-search {
    display: flex;
    width: 80px;
    height: 15px;
    justify-content: space-around;
    align-items: center;
    border-left: 1px solid #e6e6e6;
    .open-class {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .icon-mini {
        display: flex;
        justify-content: space-between;
        > view {
          width: 6px;
          height: 6px;
          border-radius: 1px;
          background: #999;
        }
      }
    }
  }
  .icon-class {
    width: 15px;
    height: 15px;
  }
}
.list-item {
  .title {
    font-size: 14px;
    color: #333;
  }
  .time {
    font-size: 12px;
    color: #999;
    text-align: right;
  }
}
.bottom-msg {
  color: #999999;
  font-size: 12px;
  text-align: center;
  width: 100%;
  bottom: 22px;
}
.pop-content {
  background: #fff;
  border-radius: 10px 10px 0px 0px;
  .pop-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 16px;
    padding: 15px 0;
    border-bottom: 1px solid #e6e6e6;
    color: #333;
    .img-box {
      width: 15px;
      height: 15px;
      position: absolute;
      right: 15px;
      top: 15px;
      .image-colse {
        width: 15px;
        height: 15px;
      }
    }
  }
  .list-item {
    padding: 15px;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    .list-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .mini-item {
      width: 105px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      background: #f2f2f2;
      color: #666666;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .active {
      background: #0ab2c1;
      color: #fff;
    }
  }
}
.no-article {
  height: 100%;
  color: #999999;
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
