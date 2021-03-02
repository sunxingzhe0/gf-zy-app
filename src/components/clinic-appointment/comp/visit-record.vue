<template>
  <uni-popup ref="popup" :maskClick="false">
    <view class="records-p">
      <view class="close" @click="close"
        ><uni-icons type="closeempty" class="closeIcon" color="#999"></uni-icons
      ></view>
      <text class="text">历史就诊记录</text>

      <scroll-view scroll-x class="tabList">
        <view class="tab-layout">
          <view
            v-for="(item, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: active == index }"
            @click="topBarChange(index)"
          >
            {{ item.title }}
          </view>
        </view>
      </scroll-view>
      <scroll-view scroll-y="true" class="content-slot">
        <radio-group
          class="content"
          @change="e => (recordS = e.target.value)"
        >
          <view v-for="(item, index) in list" :key="index" class="records-item">
            <image
              class="item-img"
              :src="require('@/assets/internet_title.png')"
              v-show="active == 0"
            ></image>
            <view class="item-time">
              <text>{{
                item.medicalType == 'MZ'
                  ? '门诊记录'
                  : item.medicalType == 'ZY'
                  ? '住院记录'
                  : '体检报告'
              }}</text>
              <text style="padding-left: 59rpx;">{{ item.visitDate }}</text>
            </view>
            <text class="item-user">{{ item.patientName }}</text>
            <view class="item-doctor">
              <text>{{ item.deptName || '' }}</text>
              <text style="padding-left: 39rpx;">{{ item.doctorName || '' }}</text>
              <text style="padding-left: 39rpx;">{{ item.title || '' }}</text>
            </view>
            <!-- 在线就诊/门诊 -->
            <view class="item-content" v-show="active == 0 || active == 1">
              <text style="color: #666666;">初步诊断：</text>
              <text>{{ item.diagnose || '' }}</text>
            </view>
            <view class="item-content" v-show="active == 0 || active == 1">
              <text style="color: #666666;">治疗意见：</text>
              <text>{{ item.disposeAdvise || '' }}</text>
            </view>

            <!-- 住院记录 -->
            <view class="item-content" v-show="active == 2">
              <text style="color: #666666;">入院诊断：</text>
              <text>{{ item.inDiagnose || '' }}</text>
            </view>
            <view class="item-content" v-show="active == 2">
              <text style="color: #666666;">出院诊断：</text>
              <text>{{ item.outDiagnose || '' }}</text>
            </view>

            <!-- 体检报告 -->
            <view class="item-content" v-show="active == 3">
              <text style="color: #666666;">体检单号：</text>
              <text>{{ item.visitNo }}</text>
            </view>
            <view class="item-content" v-show="active == 3">
              <text style="color: #666666;">体检内容：</text>
              <text>{{ item.content }}</text>
            </view>
            <view class="item-content" v-show="active == 3">
              <text style="color: #666666;">体检时间：</text>
              <text>{{ item.exeTime }}</text>
            </view>
            <view :style="{ textAlign: 'right' }">
              <radio
                :value="item.id"
                :checked="item.id === recordS"
                color="#0AB2C1"
              ></radio>
            </view>
          </view>
        </radio-group>
      </scroll-view>
      <view class="record-confirm" @click="confirm">确定</view>
    </view>
  </uni-popup>
</template>
<script>
import { archiveList } from '@/common/request/index'
export default {
  props: {
    userId: String,
    memberId: String,
  },
  data() {
    return {
      tabs: [
        {
          title: '在线就诊记录',
          key: 0,
        },
        {
          title: '门诊记录',
          key: 1,
        },
        {
          title: '住院记录',
          key: 2,
        },
        {
          title: '体检报告',
          key: 3,
        },
      ],
      active: 0, //就诊记录类型选择
      recordS: '',
      archiveData: {},
      recordListBytype: [],
    }
  },
  computed: {
    list() {
      switch (this.active) {
        case 0:
          return this.archiveData.OUTER
        case 1:
          return this.archiveData.MZ
        case 2:
          return this.archiveData.ZY
        case 3:
          return this.archiveData.TJ
        default:
      }
    },
  },
  created() {
    this.getList()
  },
  methods: {
    open() {
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
    confirm() {
      const item = this.list.find(_ => _.id == this.recordS)
      this.$emit('change', item)
      this.close()
    },
    topBarChange(active) {
      this.active = active
      this.setRecordList()
    },
    getList() {
      archiveList({
        userId: this.userId,
        memberIds: this.memberId,
        bizType: 'REPEAT_CLINIC',
      }).then(data => (this.archiveData = data))
    },
  },
}
</script>
<style lang="scss" scoped>
.records-p {
  width: 640rpx;
  height: 860rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20rpx;
  position: relative;

  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;

    .closeIcon {
      font-size: 30rpx !important;
    }
  }

  .text {
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    padding: 41rpx 41rpx 0rpx 41rpx;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .tabList {
    width: 100%;
  }

  .tab-layout {
    display: flex;
    justify-content: flex-start;
    padding: 0rpx 28rpx;
  }

  .tab-item {
    height: 70rx;
    line-height: 68rpx;

    & + .tab-item {
      margin-left: 28rpx;
    }
    &.active {
      border-bottom: 4rpx solid $uni-color-primary;
      color: $uni-color-primary;
    }
  }

  .content-slot {
    max-height: 600rpx;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .records-item {
      padding-bottom: 20rpx;
      margin-top: 19rpx;
      width: 580rpx;
      min-height: 218rpx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
      border-radius: 20rpx;
      position: relative;

      .item-img {
        width: 123rpx;
        position: absolute;
        right: 0rpx;
        height: 123rpx;
      }

      .item-time {
        padding: 41rpx 0rpx 41rpx 30rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
      }

      .item-user {
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
        padding-left: 30rpx;
      }

      .item-doctor {
        position: relative;
        padding-left: 30rpx;
        margin-top: 22rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }

      .item-content {
        padding-left: 30rpx;
        margin-top: 21rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: #333333;
      }
    }
  }

  .record-confirm {
    position: absolute;
    bottom: 0rpx;
    text-align: center;
    width: 100%;
    line-height: 100rpx;
    font-size: 30rpx;
    font-weight: 500;
    background-color: #fff;
    color: rgba(10, 178, 193, 1);
    border-top: 1rpx solid rgba(230, 230, 230, 1);
  }
}
</style>
