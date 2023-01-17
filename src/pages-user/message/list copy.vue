<template>
  <view class="doctorWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view>
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(item, index) in list"
          :key="item.id"
          :options="options"
          @click="handler($event, item.id)"
        >
          <view
            class="list box-shadow flex-between"
            @click="list[index].show = !item.show"
          >
            <view :class="['listImg', item.readed ? 'read' : '']"
              ><text class="iconfont icon-tongzhi"></text
            ></view>
            <view class="info">
              <view class="name flex-between">
                <view>{{ item.title }}</view>
                <text>{{ item.createTime }}</text>
              </view>
              <view class="des" :class="{ 'text-overflow': !item.show }">{{
                item.content
              }}</view>
              <view v-show="item.show">
                <view class="handlers">
                  <template v-if="item.notice == 'USER_16'">
                    <view
                      class="handle-button"
                      @click.stop="authorize(item, index, false)"
                      >拒绝</view
                    >
                    <view
                      class="handle-button"
                      @click.stop="authorize(item, index, true)"
                      >同意</view
                    >
                  </template>
                  <view
                    v-else-if="
                      item.notice !== 'USER_231' &&
                        item.notice !== 'USER_241' &&
                        item.notice !== 'USER_251' &&
                        item.notice !== 'USER_22'
                    "
                    class="handle-button"
                    @click.stop="info(item, index)"
                  >
                    查看
                  </view>
                </view>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
      <uni-load-more :status="more"></uni-load-more>
    </view>
    <view class="submit_btn" @click="allread">一键已读</view>
  </view>
</template>

<script>
import {
  queryAnyData,
  delNotice,
  readNotice,
  batchRead,
  replyAuth,
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
      const list = await queryAnyData({
        scope: 0,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      })
      this.list = this.list.concat(
        list.list.map(item => Object.assign(item, { show: false })),
      )
      this.pages = list.pages
      this.more = list.pages > 1 ? 'more' : 'noMore'
    },
    async handler(event, id) {
      await delNotice({
        noticeId: id,
      })
      this.currentNum = 1
      this.list = []
      this.getqueryAnyData()
      uni.showToast({
        title: '删除成功',
      })
    },
    async info(row, index) {
      await readNotice({
        noticeId: row.id,
      })
      this.list[index].readed = true
      this.$store.dispatch('getMessge', true)
      const val = parseInt(row.notice.split('_')[1])
      if (row.notice.split('_')[0] == 'ALL') return
      if (row.notice === 'ZY_USER_04') {
        uni.navigateTo({
          url: '/pages-zy/inpatientServices/deposit?id=' + row.bizId,
        })
      }
      if (val < 5) {
        uni.navigateTo({
          url:
            row.bizId.indexOf('DH') > -1
              ? '/pages-user/doctorAdvice/detail?disOrderId=' + row.bizId
              : row.bizId.indexOf('DA') > -1
              ? '/pages-user/myAppointment/detail?orderId=' + row.bizId
              : row.bizId.indexOf('PR') > -1
              ? '/pages-user/prescriptionOrder/detail?id=' + row.bizId
              : '/pages-user/serviceOrder/detail?orderId=' + row.bizId,
        })
      } else if (val == 17) {
        return
      } else if (val == 20) {
        console.log(val, '-------------------------')
        uni.navigateTo({
          url: `/pages-user/message/detail?title=${row.title}&createtime=${row.createTime}&content=${row.content}`,
        })
      } else if ((val > 4 && val < 11) || val > 13) {
        uni.navigateTo({
          url: '/pages-user/chat/chat?bizId=' + row.bizId,
        })
      } else if (val > 10 && val < 14) {
        uni.navigateTo({
          url: '/pages-user/prescriptionOrder/detail?id=' + row.bizId,
        })
      }
    },
    allread() {
      uni.showModal({
        title: '提示',
        content: '确定要全部标记为已读吗？',
        success: async res => {
          if (res.confirm) {
            await batchRead()
            this.currentNum = 1
            this.list = []
            this.$store.dispatch('getMessge', true)
            this.getqueryAnyData()
            uni.showToast({
              title: '操作成功',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
    async authorize(data, index, reply) {
      await replyAuth({
        authId: data.bizId,
        reply,
      })
      await delNotice({
        noticeId: data.id,
      })
      this.list.splice(index, 1)
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
.handlers {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}
.handle-button {
  margin-left: 20rpx;
  width: 120rpx;
  line-height: 48rpx;
  border: 2rpx solid $uni-color-primary;
  border-radius: 30px;
  text-align: center;
  font-size: 24rpx;
  color: $uni-color-primary;
}
</style>
