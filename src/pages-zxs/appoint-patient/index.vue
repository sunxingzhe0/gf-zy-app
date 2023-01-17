<template>
  <view style="padding-top:100rpx;">
    <view class="headerTop">
      <view class="item flex-between" @click="timeSelect">
        <view class="time-box"
          >{{ rangeData[0] || '开始时间' }} ~ {{ rangeData[1] || '结束时间' }}
          <image
            v-if="rangeData[1]"
            @click.stop="clearTime"
            class="pop-close"
            :src="require('@/assets/close-popup.png')"
            style="width: 30rpx; height: 30rpx"
          ></image>
          <text
            class="iconfont icon-xiala"
            style="font-size: 20rpx;color:#666666;margin-left:30rpx"
          ></text>
        </view>
        <text class="iconfont icon-xiangyou" style="font-size: 26rpx"></text>
      </view>
      <image
        @click="sortList"
        class="sort"
        src="@/pages-zxs/static/pd_sort.png"
      ></image>
    </view>
    <checkbox-group @change="checkChange">
      <label class="check">
        <checkbox
          value="1"
          :checked="checkde"
          color="#0ab2c1"
          style="transform: scale(0.7)"
        />仅看超时
      </label>
    </checkbox-group>
    <view class="list">
      <view
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="toInfo(item.id)"
      >
        <view class="list-item-top">
          <text>
            <text class="name">{{ item.name }}</text
            >{{ `${getsex(item.sex)} ${item.age}岁 | ${item.cardNo}` }}
            <text v-if="item.severePatient" class="state">重精</text>
          </text>
          <text v-if="item.endTimeout" class="state">超时</text>
        </view>
        <view>
          <view>
            <text class="name">{{ item.itemName }}</text>
            <text
              v-if="item.sexLimit && item.sexLimit != 9"
              class="state-tag"
              >{{
                item.sexLimit == 9
                  ? ''
                  : item.sexLimit == 1
                  ? '男'
                  : item.sexLimit == 2
                  ? '女'
                  : ''
              }}</text
            >
            <text
              v-if="item.ageGroup && item.ageGroup != '1,2,3'"
              class="state-tag"
            >
              {{ ageGroupText(item.ageGroup) }}</text
            >
          </view>
          <text class="price">￥{{ item.price }}</text>
        </view>
        <view>
          <text>{{ `${item.scheduleDate}  ${item.reservedTime}` }} </text>
          <image
            class="plan_aloneAdd"
            v-if="item.video"
            :src="require('../static/video.png')"
          />
        </view>
        <view>
          <text
            >{{ item.docName }} {{ item.titleName }}
            {{ item.deptName || '' }}</text
          >
        </view>
      </view>
    </view>
    <pop-select-date
      ref="timePop"
      :date="rangeData"
      @confirm="dateChange"
    ></pop-select-date>
  </view>
</template>
<script>
import popSelectDate from '@/pages-zxs/components/pop-select-date/index.vue'
import { reservedList } from '../api/appointPatient'
import dayjs from 'dayjs'

export default {
  components: { popSelectDate },
  data() {
    return {
      rangeData: [],
      checkde: false,
      list: [],
      more: 'loading',
      currentNum: 1,
      pageSize: 10,
      pages: 0,
      sorted: 'desc',
    }
  },
  onLoad() {
    this.getList()
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum = this.currentNum + 1
      this.getList()
    } else {
      this.more = 'noMore'
    }
  },
  methods: {
    ageGroupText(ageGroup) {
      if (ageGroup.split(',').length === 3) return ''
      const types = {
        1: '儿童',
        2: '青少年',
        3: '成人',
      }
      return ageGroup
        .split(',')
        .map(v => types[v])
        .join('、')
    },
    clearTime() {
      this.rangeData = []
      this.getList()
    },
    //排序
    sortList() {
      if (this.sorted == 'desc') {
        this.sorted = 'asc'
      } else if (this.sorted == 'asc') {
        this.sorted = 'desc'
      }
      this.currentNum = 0
      this.list = []
      this.getList()
    },
    timeSelect() {
      this.$refs.timePop.open()
    },
    getsex(sex) {
      return sex == 0 ? '女' : sex == 1 ? '男' : ''
    },
    dateChange(e) {
      this.rangeData = e
      this.currentNum = 0
      this.list = []
      this.getList()
    },
    //仅看超时
    checkChange(e) {
      console.log(e)
      if (e.detail.value.length > 0) {
        this.checkde = true
      } else {
        this.checkde = false
      }
      this.currentNum = 0
      this.list = []
      this.getList()
    },
    toInfo(id) {
      uni.navigateTo({
        url: '/pages-zxs/appoint-patient/detail?id=' + id,
      })
    },
    // 获取列表
    async getList() {
      let data = {
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        doctorId: this.$store.state.userInfo.userId,
        status: 1,
        sorted: this.sorted,
        field: 'scheduleDate',
      }
      if (this.checkde) {
        data.endTimeout = true
      }
      if (this.rangeData.length > 0) {
        data.reservedStartTime =
          dayjs(this.rangeData[0]).format('YYYYMMDD') + '000000'
        data.reservedEndTime =
          dayjs(this.rangeData[1]).format('YYYYMMDD') + '235959'
      }
      const list = await reservedList(data)
      this.list = this.list.concat(list.list)
      this.pages = list.pages
      this.more = list.pages > 1 ? 'more' : 'noMore'
    },
  },
}
</script>
<style lang="scss" scoped>
.headerTop {
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  display: flex;
  align-items: center;
  padding-right: 20rpx;
  justify-content: space-between;
  height: 80rpx;
  position: fixed;
  z-index: 2;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  .sort {
    width: 28rpx;
    height: 30rpx;
    margin: 0 30rpx;
  }
  .item {
    flex: 1;
    padding: 20rpx 0rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    margin: 0rpx 20rpx;
    -webkit-flex: none;
  }
  .check {
    font-size: 24rpx;
    margin-left: 30rpx;
    margin-top: 30rpx;
  }
}
.list {
  margin: 20rpx;
  font-size: 24rpx;
  .list-item {
    background: #fff;
    box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
    border-radius: 20rpx;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
    color: #666666;
    > view {
      display: flex;
      justify-content: space-between;
      line-height: 44rpx;
      padding: 0 30rpx;
    }

    .list-item-top {
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 20rpx;
      margin-bottom: 20rpx;
      .state {
        margin-left: 5rpx;
        background: rgba(247, 74, 74, 0.15);
        color: #f74a4a;
        font-size: 24rpx;
        border-radius: 6rpx;
        padding: 0 10rpx;
        height: 34rpx;
        line-height: 34rpx;
      }
    }
    .name {
      font-size: 30rpx;
      color: #1a1a1a;
      font-family: PingFang SC;
      font-weight: 500;
      margin-right: 10rpx;
    }
    .price {
      font-size: 30rpx;
      color: $uni-color-primary;
    }
    .list-item-opt {
      justify-content: flex-end;
      text-align: right;
      button {
        margin: 0;
        border-radius: 80rpx;
      }
      button[type='primary'] {
        border: 1px solid $uni-color-primary;
        color: $uni-color-primary;
      }
      button[type='warn'] {
        border: 1px solid #f74a4a;
        color: $uni-color-primary #f74a4a;
      }
    }
  }
}
radio-group label,
checkbox-group label {
  margin-left: 20rpx;
}

.time-box {
  display: flex;
  align-items: center;
  .pop-close {
    margin-left: 8rpx;
  }
}
.state-tag {
  background-color: rgba(10, 178, 193, 0.1);
  padding: 3rpx 5rpx;
  color: #0ab2c1;
  margin-left: 20rpx;
}
.plan_aloneAdd {
  width: 32rpx;
  height: 32rpx;
  margin-left: 20rpx;
}
</style>
