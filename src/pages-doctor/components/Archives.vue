<template>
  <view class="top-bar">
    <view class="top-bar__title">
      <view class="flex-start-center">
        <view>{{ statusEnums[order.status] }}</view>
        <view class="ml-50 doctor-name">
          就诊人：
          <text style="color: #e45b5b;">{{ order.memberName }}</text>
        </view>
      </view>
      <view @click="showExpand = !showExpand">
        {{ showExpand ? '收回' : '查看档案' }}
        <image class="top-bar__icon" :class="{ reverse: showExpand }" :src="require('@/assets/zhankaihui@2x.png')" mode="aspectFit"></image>
      </view>
    </view>
    <view v-show="showExpand" class="list">
      <view class="tab-panel">
        <view class="tab-panel__item" v-for="(item, index) in tabs" :key="index" :class="{ active: active === index }" @click="change(index)">{{ item.title }}</view>
      </view>
      <view class="app-card mt-20" v-for="item in archiveDataList" :key="item.id">
        <view class="sign" v-if="item.type == 'outer'">互联网</view>
        <view class="">{{ tabs[active].title }} {{ item.createTime }}</view>
        <view class="flex-between mt-40">
          <view class="">
            <view style="font-size: 30rpx;">{{ item.patientName }}</view>
            <view style="color: #666;">{{ item.deptName }} {{ item.doctorName }} {{ item.title }}</view>
          </view>
          <view class="">
            <button class="btn btn-primary" v-if="order.status!='FINISH'" @click="view(item)">{{ item.open ? '' : '申请' }}查看</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { archives } from '@/common/request/index.js';
export default {
  props: {
    order: Object
  },
  data() {
    return {
      orgId: uni.getStorageSync('orgId'),
      tabs: [
        {
          key: 'MZ',
          title: '在线就诊记录'
        },
        {
          key: 'MZ',
          title: '门诊记录'
        },
        {
          key: 'ZY',
          title: '住院记录'
        },
        {
          key: 'TJ',
          title: '体检报告'
        }
      ],
      bizTypeEums: {
        CONSULT: '在线咨询',
        REPEAT_CLINIC: '在线复诊',
        CARRYON_PRESC: '慢病续方'
      },
      statusEnums: {
        APPOINTMENT: '预约中',
        WAIT_TREAT: '待接诊',
        IN_TREAT: '接诊中',
        FINISH: '已结束'
      },
      showExpand: false,
      active: 0,
      archiveListType: 'outer',
      archiveDataList: []
    };
  },
  watch: {
    'order.userId': {
      handler(value) {
        value && this.getArchiveList();
      }
    }
  },
  methods: {
    async getArchiveList() {
      const params = {
        userId: this.order.userId,
        orgId: this.orgId,
        memberIds: this.order.memberId,
        type: this.archiveListType,
        medicalType: this.tabs[this.active].key,
        currentNum: 1,
        pageSize: 9999
      };
      const { data } = await archives(params);
      this.archiveDataList = data;
    },
    change(index) {
      this.archiveListType = index ? 'inner' : 'outer';
      this.active = index;
      this.getArchiveList();
    },
    view(medical) {
      this.showExpand = false;
      this.$emit('view', { ...medical });
    }
  }
};
</script>

<style lang="scss" scoped>
.top-bar {
  /* #ifdef H5 */
     padding-top: 80rpx;
  /* #endif */
  z-index: 2;
}
.doctor-name {
  color: $uni-color-primary;
}
.top-bar__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
}
.top-bar__icon {
  width: 21rpx;
  height: 20rpx;
  margin-left: 8rpx;
}
.tab-panel {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #666;
}
.tab-panel__item {
  line-height: 80rpx;
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: $uni-color-primary;
  }
}
.app-card {
  position: relative;
  overflow: hidden;
}
.sign {
  position: absolute;
  top: 16rpx;
  right: -48rpx;
  width: 200rpx;
  transform: rotate(0.1turn);
  text-align: center;
  background-color: #0ab2c1;
  font-size: 24rpx;
  color: #fff;
}
.btn {
  width: 160rpx;
  height: 60rpx;
  line-height: 58rpx;
  border-radius: 30rpx;
}
.list {
  max-height: 70vh;
  overflow: auto;
  padding-bottom: 40rpx;
}
</style>
