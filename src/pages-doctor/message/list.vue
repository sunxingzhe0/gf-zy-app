<template>
  <view class="doctorWrap">
    <!--主页按钮-->
    <!-- <homeIcom /> -->
    <view>
      <uni-swipe-action>
        <uni-swipe-action-item
          :options="options"
          v-for="(item, index) in list"
          :key="index"
          @click="del($event, item.id)"
        >
          <view class="list box-shadow flex-between" @click="info(item, index)">
            <view :class="['listImg', item.readed ? 'read' : '']"
              ><text class="iconfont icon-tongzhi"></text
            ></view>
            <view class="info">
              <view class="name flex-between">
                <view>{{ item.title }}</view>
                <text>{{ item.createTime }}</text>
              </view>
              <view class="des text-overflow">{{ item.content }}</view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
      <uni-load-more :status="more"></uni-load-more>
    </view>
    <view v-if="list.length" class="submit_btn" @click="allread">一键已读</view>
  </view>
</template>

<script>
import {
  queryAnyData,
  delNotice,
  readNotice,
  batchRead,
} from '@/common/request/userCenter'
export default {
  data() {
    return {
      more: 'loading',
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: 'none',
            color: '#E45B5B',
          },
        },
      ],
      list: [],
      currentNum: 1,
      pageSize: 10,
      pages: 0,
    }
  },
  onLoad() {
    this.getqueryAnyData()
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      this.getqueryAnyData()
    }
  },
  methods: {
    //消息列表
    async getqueryAnyData() {
      let list = await queryAnyData({
        scope: 0,
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
    async del(e, id) {
      const that = this
      uni.showModal({
        title: '确认删除该消息?',
        success(res) {
          if (res.confirm) {
            delNotice({
              noticeId: id,
            }).then(() => {
              that.currentNum = 0
              that.list = []
              that.getqueryAnyData()
              uni.showToast({
                title: '删除成功',
              })
            })
          }
        },
      })
    },
    async info(row, index) {
      await readNotice({
        noticeId: row.id,
      })
      let info = encodeURIComponent(JSON.stringify(row))
      this.list[index].readed = true
      uni.navigateTo({
        url: '/pages-doctor/message/detail?info=' + info,
      })
    },
    allread() {
      uni.showModal({
        title: '提示',
        content: '确定要全部标记为已读吗？',
        success: async res => {
          if (res.confirm) {
            await batchRead()
            uni.showToast({
              title: '操作成功',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.doctorWrap {
  padding: 20rpx 0;
  padding-bottom: 100rpx;

  ::v-deep.uni-swipe_box {
    background: none;
  }

  .submit_btn {
    background: #fff !important;
    color: $uni-color-primary;
  }
}

.list {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-left: 30rpx;
  width: 630rpx;
  margin-bottom: 20rpx;
  cursor: pointer;

  .listImg {
    width: 74rpx;
    height: 74rpx;
    border-radius: 50%;
    background: #d0f2f5;
    color: $uni-color-primary;
    text-align: center;
    line-height: 74rpx;

    text {
      font-size: 40rpx;
    }

    &.read {
      background: #f2f2f2;
      color: #999;
    }
  }

  .info {
    width: 507rpx;
    padding-left: 30rpx;
    flex: 1;
    box-sizing: border-box;

    .name {
      color: #1a1a1a;
      font-size: 30rpx;
      font-weight: bolder;

      text {
        font-size: 24rpx;
        color: #666;
        font-weight: normal;
        margin-left: 44rpx;
      }
    }

    .des {
      font-size: 24rpx;
      color: #666;
      line-height: 48rpx;
    }
  }
}
</style>
