<template>
  <view style="padding-top:80rpx;">
    <view class="headerTop">
      <view :class="active === 1 ? 'active' : ''" @click="tabChange(1)"
        >待接诊</view
      >
      <view :class="active === 2 ? 'active' : ''" @click="tabChange(2)"
        >接诊中</view
      >
      <view :class="active === 3 ? 'active' : ''" @click="tabChange(3)"
        >接诊记录</view
      >
    </view>
    <view v-if="active === 1" class="time-filter-wait time-filter">
      <view
        class="time-tab"
        :class="activeTabWait === tabI ? 'time-active' : ''"
        v-for="(tabV, tabI) in tabsWait"
        @click="handelTabTime(tabI, 0)"
        :key="tabI"
        >{{ tabV }}</view
      >
      <image
        class="sort-btn"
        :src="require('../static/pd_sort.png')"
        @click="sortList(0)"
      ></image>
    </view>
    <view v-if="active === 3" class="time-filter-records time-filter">
      <view
        class="time-tab"
        :class="activeTabRecords === tabI ? 'time-active' : ''"
        v-for="(tabV, tabI) in tabsRecords"
        @click="handelTabTime(tabI, 1)"
        :key="tabI"
        >{{ tabV }}</view
      >
      <view @click="openDatePop" :class="startDate ? 'flex-shark' : ''">{{
        startDate ? `${startDate} - ${endDate}` : '自定义'
      }}</view>
      <image
        class="sort-btn"
        :src="require('../static/pd_sort.png')"
        @click="sortList(1)"
      ></image>
    </view>
    <view class="list">
      <view class="list-item" v-for="(item, index) in list" :key="index">
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
            <text v-if="item.sex && item.sex != 9" class="state-tag">{{
              item.sex == 9
                ? ''
                : item.sex == 1
                ? '男'
                : item.sex == 2
                ? '女'
                : ''
            }}</text>
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
          <text>{{ `${item.scheduleDate} ${item.reservedTime}` }}</text>
          <image
            class="plan_aloneAdd"
            v-if="item.video"
            :src="require('../static/video.png')"
          />
        </view>
        <view>
          {{ item.docName }} | {{ item.titleName }} | {{ item.roomName || '' }}
        </view>
        <view v-if="active === 2 || active === 3"
          >接诊时间：{{ item.acceptTime || '-' }}</view
        >
        <view v-if="active === 3">结束时间：{{ item.endTime || '-' }}</view>
        <view class="list-item-opt">
          <button
            class="mini-btn"
            v-if="item.visitState === 3"
            @click="seeInfo(item)"
            plain="true"
            type="primary"
            size="mini"
          >
            详情
          </button>
          <button
            class="mini-btn"
            v-if="item.visitState === 1"
            @click="receive(item)"
            plain="true"
            type="primary"
            size="mini"
          >
            接诊
          </button>
          <button
            class="mini-btn cancel-btn"
            v-if="item.visitState === 2"
            @click="cancelAccept(item)"
            plain="true"
            type="primary"
            size="mini"
          >
            取消接诊
          </button>
          <button
            class="mini-btn"
            v-if="item.visitState === 2"
            @click="over(item)"
            plain="true"
            type="warn"
            size="mini"
          >
            结束
          </button>
        </view>
      </view>
    </view>
    <noData v-if="!list.length" />
    <PickerPop title="报名详情" ref="detailPop" :showSubmit="false">
      <scroll-view :scroll-top="0" scroll-y="true" style="height:800rpx;">
        <view class="pop-content">
          <view class="pop-item-title">患者信息</view>
          <view class="pop-item-title"
            >{{ rowData.name }}
            <text class="title-msg">{{
              `${rowData.sex ? '男' : '女'}  ${rowData.age || '-'}岁  ${
                rowData.phone
              }`
            }}</text></view
          >
          <view class="pop-list-item">
            <text class="label">患者ID：</text>
            <text class="value">{{ rowData.patientId }}</text>
          </view>
          <view class="pop-list-item">
            <text class="label">就诊卡号：</text>
            <text class="value">{{ rowData.cardNo }}</text>
          </view>
          <view class="pop-list-item">
            <text class="label">就诊次数</text>
            <text class="value">{{ rowData.patientNum || '-' }}</text>
          </view>
          <view class="pop-list-item">
            <text class="label">出生日期：</text>
            <text class="value">{{ rowData.birthday }}</text>
          </view>
          <view class="pop-list-item">
            <text class="label">身份证号</text>
            <text class="value">{{ rowData.birthday }}</text>
          </view>
          <view class="line"></view>
          <view class="pop-item-title">{{ rowData.itemName }}</view>
          <view class="pop-item-title"
            >{{ rowData.docName }}
            <text class="title-msg"
              >{{ rowData.titleName || '' }} {{ rowData.deptName }}</text
            ></view
          >
          <view class="pop-list-item">
            <text class="label">接诊时间：</text>
            <text class="value">{{ rowData.acceptTime }}</text>
          </view>
          <view class="pop-list-item">
            <text class="label">结束时间：</text>
            <text class="value">{{ rowData.endTime }}</text>
          </view>
        </view>
      </scroll-view>
    </PickerPop>
    <!-- 日历  -->
    <uni-calendar
      range
      :insert="false"
      :showMonth="false"
      :clearDate="false"
      ref="refDate"
      @confirm="confirmCalendar"
    />
  </view>
</template>
<script>
import dayjs from 'dayjs'
import { reservedList, acceptVisit, cancelAccept } from '../api/appointPatient'
import PickerPop from '../my-active/components/PickerPop/index.vue'
export default {
  data() {
    return {
      rangeData: [],
      checkde: false,
      list: [],
      active: 2,
      more: 'loading',
      currentNum: 1,
      pageSize: 10,
      pages: 0,
      rowData: {},
      tabsWait: ['今日', '未来7日', '未来15日', '全部'],
      tabsRecords: ['今日', '近7日', '近15日'],
      activeTabWait: 0,
      activeTabRecords: 0,
      reservedStartTime: '',
      reservedEndTime: '',
      //timeType 0 预约日期 1 接诊日期
      timeType: 0,
      recordStartTime: '',
      recordEndTime: '',
      //日历选择时间
      startDate: '',
      endDate: '',
      //sorted {String}  desc / asc
      sorted: false,
      // * field {String}  create_time
    }
  },
  components: {
    PickerPop,
  },
  onShow() {
    this.currentNum = 1
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
    sortList(type) {
      //0 预约时间  1接诊时间
      this.sorted = !this.sorted
      //排序参数
      const sortQury = {
        field: type ? 'acceptTime' : 'start_range',
        sorted: this.sorted ? 'desc' : 'asc',
      }
      this.getList(sortQury) //参数1预约时间 2接诊时间
    },
    //打开日历
    openDatePop() {
      this.$refs.refDate.open()
    },
    //日历时间确认
    confirmCalendar(e) {
      if (!e.range.before || !e.range.after) {
        return false
      }
      this.startDate = e.range.before
      this.endDate = e.range.after
      this.activeTabRecords = ''
      this.recordStartTime = dayjs(e.range.before).format('YYYYMMDD') + '000000'
      this.recordEndTime = dayjs(e.range.after).format('YYYYMMDD') + '235959'
      this.getList()
    },
    //时间tab
    handelTabTime(i, type) {
      //type 0待接诊筛选 1接诊记录筛选
      //待接诊
      if (!type) {
        this.activeTabWait = i
        const waitType = [
          [
            dayjs().format('YYYYMMDD') + '000000',
            dayjs().format('YYYYMMDD') + '235959',
          ],
          [
            dayjs().format('YYYYMMDD') + '000000',
            dayjs()
              .add(7, 'day')
              .format('YYYYMMDD') + '235959',
          ],
          [
            dayjs().format('YYYYMMDD') + '000000',
            dayjs()
              .add(15, 'day')
              .format('YYYYMMDD') + '235959',
          ],
          ['', ''],
        ]
        this.reservedStartTime = waitType[i][0]
        this.reservedEndTime = waitType[i][1]
        this.getList()
        return
      }

      //接诊记录
      this.activeTabRecords = i
      const recordsType = [
        [
          dayjs().format('YYYYMMDD') + '000000',
          dayjs().format('YYYYMMDD') + '235959',
        ],
        [
          dayjs()
            .subtract(7, 'day')
            .format('YYYYMMDD') + '000000',
          dayjs().format('YYYYMMDD') + '235959',
        ],
        [
          dayjs()
            .subtract(15, 'day')
            .format('YYYYMMDD') + '000000',
          dayjs().format('YYYYMMDD') + '235959',
        ],
      ]
      this.recordStartTime = recordsType[i][0]
      this.recordEndTime = recordsType[i][1]
      //清除自定义日期
      this.startDate = ''
      this.endDate = ''
      this.getList()
    },
    //取消接诊
    cancelAccept(item) {
      uni.showModal({
        title: '提示',
        content: '是否取消接诊该患者？',
        success: async ({ confirm }) => {
          if (confirm) {
            await cancelAccept(item.id)
            uni.showToast({
              title: '操作成功',
              icon: 'none',
            })
            this.currentNum = 1
            this.list = []
            this.getList()
          }
        },
      })
    },
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
    getsex(sex) {
      return sex == 0 ? '女' : sex == 1 ? '男' : ''
    },
    //结束接诊
    over(row) {
      uni.navigateTo({
        url: `/pages-zxs/psychological-consulting/endVisit?rowData=${JSON.stringify(
          row,
        )}`,
      })
    },
    receive(row) {
      uni.showModal({
        title: '提示',
        content: '是否确认该操作？',
        success: async res => {
          if (res.confirm) {
            await acceptVisit(row.id)
            uni.showToast({
              title: '操作成功',
              icon: 'success',
            })
            this.currentNum = 1
            this.list = []
            this.getList()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
    //切换类型
    tabChange(e) {
      this.sorted = false
      this.active = e
      this.currentNum = 1
      this.list = []

      //重置时间选择项
      if (e === 1) {
        this.timeType = 0
        this.handelTabTime(this.activeTabWait, 0)
      }
      if (e === 2) {
        this.getList()
      }
      if (e === 3) {
        this.timeType = 1
        this.handelTabTime(this.activeTabRecords, 1)
      }
    },
    toInfo(url) {
      uni.navigateTo({
        url,
      })
    },
    // 获取列表
    async getList(sortQury) {
      let params = {
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        doctorId: this.$store.state.userInfo.userId,
        status: this.active,
      }
      //获取待接诊和记录需要传时间
      if (this.active != 2) {
        Object.assign(params, {
          timeType: this.timeType,
          reservedStartTime:
            this.active === 1 ? this.reservedStartTime : this.recordStartTime,
          reservedEndTime:
            this.active === 1 ? this.reservedEndTime : this.recordEndTime,
        })
      }
      //是否排序
      if (sortQury && sortQury.field) {
        params.field = sortQury.field
        params.sorted = sortQury.sorted
      }
      const list = await reservedList(params)
      this.list =
        this.currentNum === 1 ? list.list : this.list.concat(list.list)
      this.pages = list.pages
      this.more = list.pages > 1 ? 'more' : 'noMore'
    },
    //查看详情
    seeInfo(row) {
      this.rowData = row
      this.$refs.detailPop.open()
    },
  },
}
</script>
<style lang="scss" scoped>
.headerTop {
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20rpx;
  font-size: 28rpx;
  height: 80rpx;
  position: fixed;
  z-index: 2;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  > view {
    width: 120rpx;
    height: 76rpx;
    line-height: 76rpx;
    text-align: center;
    border-bottom: 2px solid #fff;
  }
  .active {
    font-weight: bold;
    color: #0ab2c1;
    border-bottom: 2px solid #0ab2c1;
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
.pop-content {
  padding: 30rpx;
  box-sizing: border-box;
  .pop-item-title {
    font-size: 30rpx;
    color: #1a1a1a;
    margin-bottom: 18rpx;
    .title-msg {
      font-size: 24rpx;
      color: #4d4d4d;
      margin-left: 20rpx;
    }
  }
  .pop-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10rpx 0;
    font-size: 24rpx;
    .label {
      color: #4d4d4d;
    }
    .value {
      color: #1a1a1a;
    }
  }
  .line {
    margin: 20rpx 0;
    height: 1px;
    background: #e6e6e6;
  }
}
.cancel-btn {
  margin-right: 20rpx !important;
}
.time-filter {
  margin: 30rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
  .time-tab {
    width: 148rpx;
    height: 56rpx;
    display: flex;
    border-radius: 28rpx;
    justify-content: center;
    align-items: center;
  }
  .time-active {
    background-color: #fff;
    color: #0ab2c1;

    box-shadow: 0px 5rpx 20rpx 0px rgba(0, 0, 0, 0.15);
  }
}
.flex-shark {
  flex-shrink: 0;
  margin-left: 20rpx;
}
.sort-btn {
  width: 28rpx;
  height: 28rpx;
  margin: 0 20rpx;
}
</style>
