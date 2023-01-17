<template>
  <view class="mini-page">
    <view class="app-card">
      <view class="title">{{ articleInfo.title }}</view>
      <view class="tag-box">
        <text class="tag">{{ articleInfo.columnName }}</text>
      </view>
      <view class="time-box">
        <view class="hospital">{{ articleInfo.orgName }}</view>
        <view class="time">{{ articleInfo.updateTime }}</view>
      </view>
      <view class="content" v-html="articleInfo.content"> </view>
    </view>
  </view>
</template>

<script>
import { articleDetail } from '@/pages-sf/api/article'
export default {
  data() {
    return {
      articleInfo: {},
    }
  },
  async onLoad(option) {
    console.log(option, '接收到到参数----日志')
    const res = await articleDetail({ articleId: option.id })
    res.content = res.content
      .replaceAll('img', 'image')
      .replaceAll('figure', 'view')
    console.log(res.content)
    this.articleInfo = res
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  padding: 10px;
}
.title {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 21px;
}
.tag-box {
  margin: 10px 0;
}
.tag {
  color: #0ab2c1;
}
.time-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .hospital {
    padding: 0 6px;
    background: #f2f2f2;
    color: #666;
    font-size: 12px;
  }
  .time {
    color: #999;
    font-size: 12px;
  }
}
.content {
  color: #333;
  font-size: 14px;
  text-indent: 20px;
}
</style>
