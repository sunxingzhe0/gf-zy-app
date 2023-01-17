<template>
  <view class="mini-page" style="padding: 20rpx; padding-top: 190rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="[]">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="就诊人"
            :styles="{
              padding: '16rpx 30rpx',
              paddingLeft: 0,
              borderBottom: '1px solid #E6E6E6',
            }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
          <!-- tab -->
          <view v-if="isSearch" class="search-view">
            <view class="search-btn" @click="handleSeach">
              <image
                class="icon-class"
                :src="FILE_URL_BUILT_IN('sousuo.png')"
                alt=""
              ></image>
            </view>
            <input
              class="search-input"
              placeholder-style="color:#999"
              placeholder="请输入关键字"
              @input="handleInput"
            />
          </view>
          <view v-else class="tab-and-sorted">
            <view class="top-tabs">
              <view class="tab-list" @click="handleChangeTab(0)">
                <text class="font " :class="tabType === 0 ? 'active' : ''">{{
                  `随访单(${orderList.length})`
                }}</text>
              </view>
              <view class="tab-list" @click="handleChangeTab(1)">
                <text class="font" :class="tabType === 1 ? 'active' : ''">{{
                  `随访记录(${endList.length})`
                }}</text>
              </view>
            </view>
            <view class="sorted-search">
              <view style="height:15px;width:15px" @click="sortedList">
                <image
                  class="icon-class"
                  :src="require('@/assets/paixu(1)@2x.png')"
                  alt=""
                ></image>
              </view>
              <view
                style="margin-right:10px;width:15px;height:15px"
                @click="searchOpen"
              >
                <image
                  class="icon-class"
                  :src="FILE_URL_BUILT_IN('sousuo.png')"
                  alt=""
                ></image>
              </view>
            </view>
          </view>
        </view>
      </template>
    </topbar>
    <view class="app-card question-list" v-for="val in cardList" :key="val.id">
      <view class="title">
        <text class="title-name">{{ val.title }}</text>
        <!-- <text
          class="title-status"
          :style="{ color: val.status === 'end' && '#ccc' }"
          >{{ val.statusText }}</text
        > -->
      </view>

      <view class="mini-list">
        <view>
          <text>制定人： </text>
          <text style="color:#333;margin-right:5px">{{
            val.docName || '-'
          }}</text>
          <!-- <text>{{ val.ussertitle }}</text> -->
        </view>
        <view v-if="val.columnName" class="mini-tab">{{
          val.columnName || ''
        }}</view>
      </view>
      <view class="mini-list">
        <view class="time-status">
          <text>随访时间： </text>
          <text>{{ val.createDate || '-' }}</text>
          <image
            v-if="val.state === 4"
            class="pass-time"
            :src="require('@/pages-sf/images/pass-time.png')"
            alt=""
          ></image>
        </view>
      </view>
      <view v-if="val.state === 2" class="mini-list">
        <view>
          <text>完成时间： </text>
          <text>{{ val.updateDate || '-' }}</text>
        </view>
      </view>
      <view class="mini-list">
        <view> </view>
        <view class="right-btn" @click="goToOrder($event, val)">
          {{ val.state !== 2 ? '开始' : '查看' }}
        </view>
      </view>
    </view>
    <noData v-if="cardList.length == 0"></noData>
    <view class="bottom-msg">已经到底了，暂无更多数据</view>
  </view>
</template>

<script>
import selectPatient from '../../components/selectPatient.vue'
import AppListItem from '@/components/app/app-list-item'
import noData from '@/pages-sf/components/NoData'
import AppCard from '@/components/app/app-card'
import { getPatientCorrespondenceByCardNo } from '@/pages-sf/api/myFollow'
export default {
  components: {
    selectPatient,
    AppCard,
    AppListItem,
  },
  data() {
    return {
      perName: '', //患者名
      perId: '', //患者id
      tabType: 0, //当前tab
      sortState: false,
      title: '',
      cardNo: '',
      isSearch: false,
      cardList: [
        // {
        //   title: '随访标题',
        //   id: 1,
        //   status: 'pass',
        //   statusText: '已超时',
        //   followTime: '2021-07-01 10:10:26',
        //   endTime: '',
        //   userName: '赵柯',
        //   ussertitle: '主任医师',
        //   tabText: '糖尿病',
        // },
      ],
      orderList: [],
      endList: [],
    }
  },
  mounted() {
    uni.$on('updateList', () => {
      this.getListData(this.cardNo)
    })
  },
  methods: {
    //获取随访单和记录列表
    async getListData(cardNo, orderType, title) {
      console.log('123-----123-----')
      const res = await getPatientCorrespondenceByCardNo({
        cardNo,
        orderType: orderType || 0, //排序  0 默认降序， 1升序
        title: title || '',
        sign: 0, //0 为随访， 1为满意度调查
      })
      this.filterList(res)
    },
    //筛选列表
    filterList(res) {
      this.orderList = res.filter(val => val.state !== 2)
      this.endList = res.filter(val => val.state === 2)
      this.cardList = this.tabType ? this.endList : this.orderList
    },
    //切换就诊人-初始化也会调用一次
    changePatient(item) {
      this.perId = item.memberId
      this.perName = item.name
      this.cardNo = item.patientCard
      this.getListData(item.patientCard)
    },
    //切换tab
    handleChangeTab(type) {
      console.log(type)
      this.tabType = type
      uni.showLoading({
        title: '',
        mask: false,
      })
      this.cardList = this.tabType ? this.endList : this.orderList
      setTimeout(() => {
        uni.hideLoading()
      }, 500)
    },
    //开始查看随访单
    goToOrder(e, val) {
      console.log(val, '传递前---')
      uni.navigateTo({
        url: `/pages-sf/src/myFollow/folloOrder/index?id=${val.id}`,
      })
    },
    //排序
    sortedList() {
      this.sortState = !this.sortState
      this.getListData(this.cardNo, this.sortState ? 1 : 0, this.title)
    },
    handleInput(e) {
      this.title = e.detail.value
      console.log(e)
    },
    searchOpen() {
      this.isSearch = true
    },
    handleSeach() {
      this.isSearch = false
      this.getListData(this.cardNo, 0, this.title)
      this.title = ''
      console.log('search------')
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-and-sorted {
  display: flex;
  align-items: center;
  .top-tabs {
    height: 40px;
    display: flex;
    flex: 1;
    .tab-list {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .font {
        display: inline-block;
        font-size: 14px;
        color: #666666;
        line-height: 36px;
      }
      .active {
        color: #0ab2c1;
        border-bottom: 1px solid #0ab2c1;
      }
    }
  }
  .sorted-search {
    display: flex;
    width: 80px;
    height: 15px;
    justify-content: space-around;
    align-items: center;
    border-left: 1px solid #e6e6e6;
  }
}

.question-list {
  margin-bottom: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    line-height: 20px;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 12px;
    margin-bottom: 15px;
    .title-name {
      font-size: 14px;
      font-weight: 450;
      color: #333;
    }
    .title-status {
      color: #f74a4a;
      font-size: 12px;
    }
  }
  .mini-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    .mini-tab {
      padding: 1px 5px;
      background: #cef0f3;
      color: #0ab2c1;
      font-size: 12px;
    }
    .right-btn {
      width: 70px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #0ab2c1;
      border-radius: 15px;
      color: #0ab2c1;
    }
  }
}
.bottom-msg {
  color: #999999;
  font-size: 12px;
  text-align: center;
  width: 100%;
  position: fixed;
  bottom: 22px;
}
.icon-class {
  width: 15px;
  height: 15px;
}
.time-status {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pass-time {
  width: 44px;
  height: 15px;
  margin-left: 5px;
}

.search-view {
  padding: 4px 15px 8px 0;
  position: relative;
  .search-input {
    height: 34px;
    border-radius: 17px;
    padding-left: 10px;
    background: #ededed;
  }
  .search-btn {
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 4px;
    z-index: 99;
  }
}
</style>
