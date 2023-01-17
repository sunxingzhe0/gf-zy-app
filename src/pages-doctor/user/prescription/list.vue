<template>
  <view class="orderWrap2">
    <!--主页按钮-->
    <homeIcom />
    <view :class="['headerTop', isFilter ? '' : 'box-shadow']">
      <view class="searchWrap">
        <view class="search flex-between">
          <input
            type="text"
            v-model="keywords"
            placeholderClass="searchtext"
            placeholder="搜索患者姓名"
          />
          <uni-icons
            @click="search"
            type="search"
            class="searchIcon"
            size="20"
          ></uni-icons>
        </view>
      </view>

      <view class="filter-l">
        <view
          v-for="(item, index) in filterData"
          :key="index"
          :class="['title', filter == index ? 'on' : '']"
          @click="changeFilter(index)"
        >
          {{ item.name }}
        </view>
      </view>
      <view class="flex-between">
        <scroll-view scroll-x class="tabList">
          <view class="tabWrap">
            <!-- <view :class="['tabItem', current==0?'on':'']" @click="tabTap(0)">全部({{extend.ALL}})</view>
            <view :class="['tabItem', current==1?'on':'']" @click="tabTap(1)">草稿({{extend.DRAFT}})</view>
            <view :class="['tabItem', current==2?'on':'']" @click="tabTap(2)">待审核({{extend.PENDING_REVIEW}})</view>
            <view :class="['tabItem', current==3?'on':'']" @click="tabTap(3)">已通过({{extend.PASSED}})</view>
            <view :class="['tabItem', current==4?'on':'']" @click="tabTap(4)">已驳回({{extend.REJECTED}})</view> -->
            <view
              :class="['tabItem', current == 0 ? 'on' : '']"
              @click="tabTap(0)"
              >全部({{ nums[0] }})</view
            >
            <view
              :class="['tabItem', current == 1 ? 'on' : '']"
              @click="tabTap(1)"
              >草稿({{ nums[1] }})</view
            >
            <view
              :class="['tabItem', current == 2 ? 'on' : '']"
              @click="tabTap(2)"
              >待审核({{ nums[2] }})</view
            >
            <view
              :class="['tabItem', current == 3 ? 'on' : '']"
              @click="tabTap(3)"
              >已通过({{ nums[3] }})</view
            >
            <view
              :class="['tabItem', current == 4 ? 'on' : '']"
              @click="tabTap(4)"
              >已驳回({{ nums[4] }})</view
            >
          </view>
        </scroll-view>
      </view>
    </view>

    <view class="listWrap">
      <view
        class="listItem box-shadow"
        v-for="(item, index) in list"
        :key="index"
        @click="
          gotoInfo(
            '/pages-doctor/user/prescription/detail?id=' +
              (item.prescriptionNo || item.id),
          )
        "
      >
        <view class="list_a flex-between">
          <text
            style="width: 550rpx;white-space: nowrap;"
            class="overflow-hidden text-overflow"
            >处方号：{{ item.prescriptionNo || item.id }}</text
          >
          <text class="state state-blue" v-if="item.status == 'DRAFT'"
            >草稿</text
          >
          <text class="state state-red" v-if="item.status == 'REJECTED'"
            >已驳回</text
          >
          <text class="state state-blue" v-if="item.status == 'PENDING_REVIEW'"
            >待审核</text
          >
          <text class="state state-green" v-if="item.status == 'PASSED'"
            >已通过</text
          >
        </view>
        <view class="list_b flex-start-center">
          <text class="title">就诊人</text>
          <text>{{ item.memberName }}</text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">诊疗类型</text>
          <text
            >{{
              item.serviceType == 'CONSULT'
                ? '在线咨询'
                : item.serviceType == 'REPEAT_CLINIC'
                ? '在线复诊'
                : '慢病续方'
            }}
            {{
              item.serviceMode == 'GRAPHIC'
                ? '图文'
                : item.serviceMode == 'VIDEO'
                ? '视频'
                : '电话'
            }}
          </text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">诊断</text>
          <text class="value text-overflow price">{{ item.diagnosis }}</text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">药品数量</text>
          <text class="value price">{{ item.number || 0 }}个</text>
        </view>
        <view class="list_b flex-start-center">
          <text class="title">{{
            item.status == 'DRAFT' || item.status == 'REJECTED'
              ? '创建时间'
              : '提交时间'
          }}</text>
          <text class="value price"
            >{{
              item.status == 'DRAFT' || item.status == 'REJECTED'
                ? item.createTime || ''
                : item.submitTime || ''
            }}
          </text>
        </view>

        <view class="list_b flex-start-center">
          <text class="title">价格</text>
          <text class=" price">￥{{ item.prescriptionPrice }}</text>
        </view>
        <view class="flex-between list_c" @click.stop>
          <view class="time"></view>
          <view class="flex-start-center">
            <button
              plain
              class="optBtn on"
              v-if="item.status == 'PENDING_REVIEW'"
              @click="withdraw(item.prescriptionNo || item.id)"
            >
              撤回
            </button>
            <button
              plain
              class="optBtn"
              v-if="item.status == 'REJECTED'"
              @click="cope(item)"
            >
              复制
            </button>
            <button
              plain
              class="optBtn on"
              v-if="item.status == 'DRAFT'"
              @click="del(item.prescriptionNo || item.id)"
            >
              删除
            </button>
            <button
              plain
              class="optBtn on"
              v-if="item.status == 'DRAFT'"
              @click="
                gotoInfo(
                  '/pages-doctor/user/prescription/detail?id=' +
                    (item.prescriptionNo || item.id),
                )
              "
            >
              修改
            </button>
            <button
              plain
              class="optBtn"
              v-if="item.status == 'DRAFT'"
              @click="submit(item)"
            >
              提交
            </button>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more :status="more"></uni-load-more>
  </view>
</template>

<script>
import { h5RpList, singleRp } from '@/common/request/userCenter'
import { saveRp, delRp, withdrawRp } from '@/common/request/index.js'
import { submitRp, addAndEdit } from '@/common/request/prescriptionList'
export default {
  data() {
    return {
      nums: [0, 0, 0, 0, 0],
      current: 0,
      themeColor: '#0AB2C1',
      selectActive: [],
      activeList: [],
      filter: 0,
      isFilter: false,
      filterData: [
        {
          name: '在线复诊',
          value: 'REPEAT_CLINIC',
        },
        {
          name: '慢病续方',
          value: 'CARRYON_PRESC',
        },
      ],
      more: 'more',
      keywords: '',
      pageSize: 10,
      currentNum: 1,
      pages: 0,
      list: [],
      rpStatus: '',
      statusData: ['', 'DRAFT', 'PENDING_REVIEW', 'PASSED', 'REJECTED'],
      extend: {},
    }
  },
  onShow() {
    this.list = []
    this.currentNum = 1
    this.geth5RpList(0)
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      this.geth5RpList(0)
    }
  },
  methods: {
    tabTap(e) {
      this.current = e
      this.rpStatus = this.statusData[this.current]
      this.currentNum = 1
      this.list = []
      this.geth5RpList(e)
    },
    // 获取处方列表
    async geth5RpList(num) {
      let list = await h5RpList({
        rpStatus: this.rpStatus,
        searchKeywords: this.keywords,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        businessType: this.filterData[this.filter].value,
      })
      console.log(list, '处方列表------')
      this.nums[num] = list.data.length
      // this.$set(this.nums, num, list.data.length)
      console.log(this.nums, num)
      this.extend = list.extend
      this.list = this.list.concat(list.data)
      this.pages = list.pages
      if (this.pages > 1) {
        this.more = 'more'
      } else {
        this.more = 'noMore'
      }
    },
    search() {
      this.list = []
      this.currentNum = 1
      this.geth5RpList(this.current)
    },
    //复制处方
    async cope(item) {
      //获取当前处方详情
      console.log(item.id, '处方id')
      let res = await singleRp({ rpId: item.id })
      console.log('处方详情', res)
      let p = {
        memberId: res.memberId,
        memberName: res.memberName,
        memberSex: res.memberSex,
        treatmentTime: res.treatmentTime,
        serviceType: res.serviceType,
        serviceMode: res.serviceMode,
        titleId: res.titleId,
        orderId: res.orderId,
        userId: res.userId,
      }
      //新增处方
      this.newCode = await saveRp(p)
      //新增处方后将原来的药品赋给新处方
      //清空id
      res.rpDrugList.forEach(item => {
        delete item.id
      })
      let resp = await addAndEdit({
        id: this.newCode,
        rpDrugList: res.rpDrugList,
      })
      console.log(resp, '-----------------------------------')
      if (resp) {
        uni.showToast({
          title: '复制成功！',
          icon: 'none',
        })
        //跳转复制的处方
        uni.navigateTo({
          url: `/pages-doctor/user/prescription/detail?id=${resp}`,
        })
      }
      this.list = []
      this.currentNum = 1
      this.geth5RpList(this.current)
    },
    changeFilter(index) {
      this.filter = index
      this.isFilter = false
      this.list = []
      this.currentNum = 1
      this.geth5RpList(this.current)
    },

    selectChange(item) {
      if (this.selectActive.indexOf(item) > -1) {
        console.log(this.selectActive.indexOf(item))
        this.selectActive.splice(this.selectActive.indexOf(item), 1)
        console.log(this.selectActive)
      } else {
        this.selectActive.push(item)
      }
    },
    gotoInfo(url) {
      uni.navigateTo({
        url: url,
      })
    },
    withdraw(id) {
      withdrawRp({
        id: id,
      }).then(data => {
        uni.showToast({
          title: '已经成功撤回！',
          icon: 'none',
        })
        this.list = []
        this.currentNum = 1
        this.geth5RpList(this.current)
      })
    },

    del(id) {
      //提示
      uni.showModal({
        title: '系统提示',
        content: '是否确认操作?',
        cancelText: '否',
        confirmText: '是',
        confirmColor: '#0AB2C1',
        cancelColor: '#666666',
        success: res => {
          if (res.confirm) {
            delRp({
              id: id,
            }).then(data => {
              uni.showToast({
                title: '删除成功！',
                icon: 'none',
              })
              this.list = []
              this.currentNum = 1
              this.geth5RpList(this.current)
            })
          }
        },
      })
    },
    //提交审核
    async submit(val) {
      if (val.rpDrugList.length < 1) {
        uni.showToast({
          title: '空处方不可提交',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      let res = await submitRp({ submit: [val] })
      uni.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 1500,
      })
      this.list = []
      this.currentNum = 1
      this.geth5RpList(this.current)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.filter-l {
  display: flex;

  background: #fff;

  .title {
    margin-right: 20rpx;
    text-align: center;
    width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: rgba(242, 242, 242, 1);
    border-radius: 30rpx;
    font-size: 24rpx;
    color: rgba(51, 51, 51, 1);

    &.on {
      background: rgba(10, 178, 193, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}

.bg {
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
}

.listWrap {
  padding-top: 300rpx;
}

.orderWrap2 {
  .filterText {
    padding-right: 30rpx;

    text {
      font-size: 18rpx;
      color: #666;
    }
  }
}

.tabList {
  width: 100%;
}

.searchWrap {
  padding-right: 30rpx;
  padding-top: 20rpx;
  margin-bottom: 30rpx;

  .search {
    background: #f2f2f2;
  }
}

.selfExtracting {
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 40rpx;
  padding-bottom: 100rpx;
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

  .store {
    font-size: 26rpx;
    color: #666;
    width: 50%;
    margin: 0 auto;

    .iconfont {
      font-size: 32rpx;
      color: $uni-color-primary;
      margin-right: 10rpx;
    }
  }

  .codeImg {
    width: 260rpx;
    height: 260rpx;
    display: block;
    margin: 0 auto;
    margin-top: 30rpx;
    margin-bottom: 10rpx;
  }

  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }
}

.state-blue {
  color: rgba(10, 178, 193, 1);
}

.state-green {
  color: #26b523 !important;
}

.state-red {
  color: rgba(228, 91, 91, 1) !important;
}
</style>
