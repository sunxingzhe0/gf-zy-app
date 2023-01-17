<template>
  <view class="doctorWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view>
      <view
        class="list box-shadow"
        v-for="(item, index) in list"
        :key="index"
        @click="goto(item.orderId)"
      >
        <view class="flex-between listTop">
          <view class="flex-start-center">
            <image
              class="listImg"
              :src="
                item.avatar
                  ? FILE_URL(item.avatar)
                  : require('@/assets/user/user_d_head.png')
              "
            ></image>
            <view class="name">
              {{ item.doctorName }}
              <text>{{ item.titleName }}</text>
              <text>{{ item.deptName }}</text>
            </view>
            <!-- <view class="bizWay">{{item.bizWay == 'GRAPHIC'?'图文':item.bizWay == 'VIDEO'?'视频':'电话'}}</view> -->
          </view>
          <view class="consultation">{{
            item.bizType == 'CONSULT'
              ? '在线咨询'
              : item.bizType == 'REPEAT_CLINIC'
              ? '在线复诊'
              : '慢病续方'
          }}</view>
        </view>
        <view class="flex-start-start">
          <view class="evaluate">评价</view>
          <view class="info">
            <view class="des flex-start-center evaluateNum">
              <uni-rate
                size="14"
                style="margin-top: 10rpx;"
                active-color="#FFA200"
                readonly="true"
                :value="parseFloat(item.average)"
              ></uni-rate>
              <text class="fen">{{ item.average }}分</text>
              <text>{{ getevaluateState(item.evaluateState) }}</text>
            </view>
            <view class="time">{{ item.createTime }}</view>
            <view class="evaluateText">{{ item.content || '' }}</view>
          </view>
        </view>
        <view
          class="flex-start-start"
          style="margin-top: 30rpx;"
          v-if="item.answerContent"
        >
          <view class="evaluate">回复</view>
          <view class="info">
            <view class="time">{{ item.answerTime }}</view>
            <view class="evaluateText">{{ item.answerContent }}</view>
          </view>
        </view>
      </view>
      <uni-load-more
        v-if="list && list.length == 0"
        :status="more"
      ></uni-load-more>
    </view>
  </view>
</template>

<script>
import { findEvaluateList } from '@/common/request/userCenter'
export default {
  components: {},
  data() {
    return {
      more: 'noMore',
      list: null,
    }
  },
  onLoad() {
    this.getfindEvaluateList()
  },
  methods: {
    // 评论列表
    getfindEvaluateList() {
      uni.showLoading({
        title: '加载中',
      })
      uni.showLoading()
      findEvaluateList({ userId: uni.getStorageSync('userId') })
        .then(uni.hideLoading()(data => (this.list = data)))
        .finally(() => uni.hideLoading())
    },
    goto(id) {
      uni.navigateTo({
        url: '/pages-user/serviceOrder/detail?orderId=' + id,
      })
    },
    getevaluateState(state) {
      if (state == 'NOT_SATISFIED') {
        return '不满意'
      } else if (state == 'GENERAL') {
        return '一般'
      } else if (state == 'SATISFIED') {
        return '满意'
      } else if (state == 'SATISFACTORY') {
        return '较满意'
      } else if (state == 'VERY_SATISFIED') {
        return '非常满意'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.doctorWrap {
  padding: 20rpx 30rpx;
}
.list {
  background: #fff;
  padding: 40rpx 30rpx;
  padding-right: 0;
  margin-bottom: 20rpx;
  align-items: flex-start;
  cursor: pointer;
  .listTop {
    border-bottom: 1px solid #e6e6e6;
    padding-right: 30rpx;
    padding-bottom: 30rpx;
    margin-bottom: 30rpx;
    .listImg {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      margin-right: 18rpx;
    }
    .name {
      color: #1a1a1a;
      font-size: 30rpx;
      font-weight: bolder;
      text {
        font-size: 24rpx;
        color: #666;
        font-weight: normal;
        margin-left: 22rpx;
      }
    }
    .bizWay {
      padding: 2rpx 15rpx;
      background: rgba(10, 178, 193, 0.1);
      color: $uni-color-primary;
      font-size: 22rpx;
      margin-left: 20rpx;
    }
    .consultation {
      color: $uni-color-primary;
      font-size: 26rpx;
      cursor: pointer;
    }
  }

  .evaluate {
    font-size: 30rpx;
    color: #666;
    width: 90rpx;
  }
  .info {
    width: 480rpx;
    padding-right: 30rpx;
    flex: 1;
    box-sizing: border-box;
    .des {
      font-size: 24rpx;
      color: #666;
      line-height: 48rpx;
      text {
        margin-right: 30rpx;
      }
    }
    .evaluateText {
      font-size: 30rpx;
      color: #1a1a1a;
      font-weight: bold;
      margin-bottom: 10rpx;
      word-break: break-all;
    }
    .time {
      font-size: 24rpx;
      color: #999999;
    }
    .evaluateNum {
      line-height: 48rpx;
      font-size: 24rpx;
      color: #ffa200;
      .fen {
        font-size: 30rpx;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
