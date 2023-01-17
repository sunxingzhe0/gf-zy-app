<template>
  <view class="main">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="title">
      <text class="name">{{ data.title }}</text>
      <view class="view">
        <view class="from">来源：{{ data.source }}</view>
        <text class="time">{{ data.createTime }}</text>
      </view>
    </view>
    <!-- <rich-text class="item" :nodes="data.content"></rich-text> -->
    <view class="item" v-html="data.content"></view>
    <!--   <view v-for="(item,index) in datas" :key="index" class="item">
      <text class="item-title">{{index+1}}.{{item.title}}</text>
      <text class="item-context">{{item.context}}</text>
    </view> -->
  </view>
</template>

<script>
import { informationDataPage } from '../../../common/request/index.js'
import htmlParser from '@/common/htmlParser.js'
import { host } from '@/urls.js'
export default {
  onLoad(option) {
    if (option.id) {
      this.id = option.id
      this.getInformationDataPage()
    }
  },
  data() {
    return {
      id: '',
      data: {},
    }
  },
  methods: {
    getInformationDataPage() {
      informationDataPage({
        id: this.id,
      }).then(data => {
        if (data) {
          data.content = data.content
            .replace('&amp;', '&')
            .replace(
              /<img/gi,
              '<img style="max-width:100%;height:auto;display:block" ',
            )
            .replace(/<figure/g, '<div')
            .replace(/\/figure>/g, '\div>')
            .replace(/<figcaption/g, '<div')
            .replace(/\/figcaption>/g, '\div>')
          let nodes = htmlParser(data.content)
          nodes = this.nodesList(nodes)
          this.data = data
          this.data.content = nodes
        }
      })
    },
    nodesList(list) {
      let arr = [...list]
      arr.forEach(item => {
        if (item.children) {
          this.nodesList(item.children)
        } else {
          if (item.name == 'img') {
            if (item.attrs.src.indexOf('http') < 0) {
              item.attrs.src = host + item.attrs.src
            }
          }
        }
      })
      return arr
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  background: #ffffff;
}

.title {
  padding: 30upx 30upx 0upx 30upx;

  .name {
    font-size: 34upx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
  }

  .view {
    margin-top: 30upx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .from {
      padding: 5upx 10upx;
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
}

.item {
  display: flex;
  padding: 30upx 30upx 0upx 30upx;
  box-sizing: border-box;
  flex-direction: column;
  font-size: 26upx;
  font-weight: 500;
  color: #666666;
  white-space: pre-wrap;
}
</style>
