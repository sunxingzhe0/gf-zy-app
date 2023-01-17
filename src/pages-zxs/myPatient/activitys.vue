<template>
  <view>
    <view
      class="recommend-item"
      v-for="(item, index) in signs"
      :key="index"
      @click="toInfo(item.activityId, item.id)"
    >
      <view class="img-view">
        <image
          style="
            width: 100%;
            height: 300rpx;
            background: #b1e0ff;
            border-radius: 10rpx;
          "
          :src="
            item.activityImgId
              ? item.activityImgId.indexOf('.') > -1
                ? FILE_URL_BUILT_IN(item.activityImgId)
                : FILE_URL(item.activityImgId)
              : ''
          "
        ></image>
        <text class="item-state">{{
          item.activityStatus == 1
            ? '进行中'
            : item.activityStatus == 1
            ? '已结束'
            : item.activityStatus == 3
            ? '暂停'
            : '未开始'
        }}</text>
        <view class="state" v-if="item.status == 1">
          <image
            style="width: 160rpx; height: 160rpx"
            :src="require('@/assets/sing-up-success.png')"
          ></image>
        </view>
        <view class="state" v-if="item.status == 3">
          <image
            style="width: 160rpx; height: 160rpx"
            :src="require('@/assets/sing-up-err.png')"
          ></image>
        </view>
        <view class="state" v-if="item.status == 2">
          <text>报名待审核</text>
        </view>
      </view>

      <text class="name">[{{ item.activityType }}]{{ item.activityName }}</text>
      <view class="time-v flex-between">
        <text>{{ item.signTime }}</text>
        <text class="iconfont icon-wode-weixuanzhong">20</text>
      </view>
    </view>
  </view>
</template>

<script>
import { recordlist, mySignDesc } from '@/pages-zxs/api/myPatient'

export default {
  props: {
    patentInfo: Object,
  },
  data() {
    return {
      signs: [],
      detail: {},
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    async mySignDesc(id) {
      this.detail = await mySignDesc({ signId: id })
    },
    async getListData(times, activityType) {
      const params = times
        ? {
            patientId: this.patentInfo.patientId,
            signStartTime: times[0].replace(/-/g, '') + '000000',
            signEndTime: times[1].replace(/-/g, '') + '235959',
            activityType: activityType || '',
          }
        : {
            patientId: this.patentInfo.patientId,
            activityType: activityType || '',
          }
      this.signs = (await recordlist(params)).list
    },
    async toInfo(activityId, id) {
      /*
      ,
        {
          "path": "myPatient/activitysInfo",
          "style": {
            "navigationBarTitleText": "活动详情"
          }
        }
      */
      await this.mySignDesc(id)
      uni.navigateTo({
        url: `/pages-zxs/my-active/detail?id=${activityId}&templateId=${this.detail.activityTemplateId}`,
      })
    },
  },
  watch: {
    patentInfo: {
      handler(newval, oldval) {
        console.log(newval)
        this.getListData()
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.recommend-item {
  margin-top: 20rpx;
  height: 434rpx;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 10rpx;
  position: relative;
  .img-view {
    position: relative;

    .state {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      position: absolute;
      width: 160rpx;
      height: 160rpx;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 100px;
      text-align: center;
      padding: 10rpx;
      > text {
        font-size: 30rpx;
        color: #0ab1c0;
        line-height: 160rpx;
      }
    }
  }
  .item-state {
    position: absolute;
    top: 30rpx;
    right: 20rpx;
    background: #0ab2c1;
    color: #fff;
    padding: 4rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    &.end {
      background: #999999;
    }
  }
  .name {
    margin: 0rpx 30rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    overflow: hidden;
    height: 40rpx;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time-v {
    margin: 20rpx 30rpx;
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 20rpx;
  }
}
</style>
