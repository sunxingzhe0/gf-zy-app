<template>
  <view style="padding-top: 186rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <app-list-item
        label="健康卡"
        :styles="{ padding: '16rpx 20rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right color666">
          <select-patient
            textStyle="color:#666;"
            @patientLoad="changePatient"
          ></select-patient>
        </view>
      </app-list-item>
      <view style="padding-right: 20rpx;">
        <view class="search flex-between">
          <input
            type="text"
            class="flex_1"
            v-model="keywords"
            placeholderClass="searchtext"
            placeholder="搜索姓名/职称/擅长"
          />
          <uni-icons
            type="search"
            @click="searchTap"
            class="searchIcon"
            size="20"
          ></uni-icons>
        </view>
        <view class="tabList flex-between" v-if="false">
          <view class="tabWrap flex-between flex_1">
            <view
              :class="['tabItem', bizType == item.value ? 'on' : '']"
              @click="tabTap(item.value)"
              v-for="(item, index) in tabList"
              :key="index"
              >{{ item.name }}</view
            >
          </view>
          <view class="iconBorder" @click="sortChange">
            <image
              :src="require('@/assets/paixu(1)@2x.png')"
              style="width: 30rpx;height: 30rpx;"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view class="main">
      <!-- 医生列表 -->
      <view class="docBox" v-if="bizType == 1">
        <view
          class="docItem box-shadow"
          v-for="(item, index) in docList"
          :key="index"
          @click="goto(item)"
        >
          <view class="ptr">
            <default-img :url="FILE_URL(item.avatar)"></default-img>
          </view>
          <view class="contentBox">
            <view class="name"
              >{{ item.name }}
              <text>{{
                item.sex == 1 ? '男' : item.sex == 0 ? '女' : ''
              }}</text></view
            >
            <view class="hos text-overflow"
              >{{ item.deptName || '' }} {{ item.titleName || '' }}
              {{ item.orgName || '' }}</view
            >
            <view class="good mt-10 text-overflow"
              >擅长：{{ item.skilled || '-' }}</view
            >
          </view>
        </view>
      </view>
      <view class="docBox" v-else>
        <view
          class="docItem box-shadow"
          v-for="(item, index) in docList"
          :key="index"
          @click="goto(item)"
        >
          <view class="ptr">
            <default-img :url="FILE_URL(item.avatar)"></default-img>
          </view>
          <view class="contentBox">
            <view class="name"
              >{{ item.doctorName }} <text>{{ item.sex || '' }}</text></view
            >
            <view class="hos text-overflow"
              >{{ item.deptName }} {{ item.titleName }}
              {{ userInfo.orgName }}</view
            >
            <view class="good mt-10 text-overflow"
              >擅长：{{ item.skilled || '-' }}</view
            >
            <view class="good mt-10"
              >业务：{{
                item.bizType == 'CONSULT'
                  ? '在线咨询'
                  : item.bizType == 'REPEAT_CLINIC'
                  ? '在线复诊'
                  : item.bizType == 'CARRYON_PRESC'
                  ? '慢病续方'
                  : ''
              }}</view
            >
            <view class="good mt-10"
              >评分：<text class="fen">{{ item.avgScore || 0 }}</text>
              <text>{{ item.treatNumber || 0 }} 次诊疗</text></view
            >
          </view>
        </view>
      </view>
      <NoData v-if="docList.length == 0"></NoData>
      <uni-load-more v-show="pages > 1" :status="more"></uni-load-more>
    </view>
    <uni-popup ref="edit" :maskClick="false">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">系统消息</view>
          <view class="font26 color666"
            >该医生目前已暂停所有服务，是否前往购买其他医生的{{
              tabList.filter(item => item.value == bizType)[0].name
            }}服务？</view
          >
        </view>
        <view class="pop-btn flex-between">
          <view class="close flex_1" @click="info">否</view>
          <view class="flex_1" @click="service">是</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import selectPatient from '../components/selectPatient.vue'
import AppListItem from '@/components/app/app-list-item'
import NoData from '../components/NoData'
import { myRegDocList } from '../api/user.js'
import { userdoctorList } from '@/common/request/userCenter'
import { h5DocBizInfo } from '@/common/request/index'
export default {
  components: {
    selectPatient,
    AppListItem,
    NoData,
  },
  data() {
    return {
      bizType: 1,
      tabList: [
        {
          name: '预约挂号',
          value: 1,
        },
        // {
        //   name: '在线咨询',
        //   value: 'CONSULT',
        // },
        // {
        //   name: '在线复诊',
        //   value: 'REPEAT_CLINIC',
        // },
        // {
        //   name: '慢病续方',
        //   value: 'CARRYON_PRESC',
        // },
      ],
      // 输入框的值
      keywords: '',

      // 医生列表
      docList: [],
      more: 'more',
      currentNum: 0,
      pageSize: 10,
      pages: 1,
      sorted: 'desc',
      doctorId: '',
      patientId: '',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  // 预约挂号医生
  async getList() {
    this.more = 'loading'
    uni.showLoading()
    let list = await myRegDocList({
      patientId: this.patientId,
      currentNum: this.currentNum,
      pageSize: this.pageSize,
      searchKeywords: this.keywords,
      field: 'create_time',
      sorted: this.sorted,
    })
    uni.hideLoading()
    this.pages = list.pages
    this.docList = this.docList.concat(list.data || [])
    if (this.currentNum == list.pages) {
      this.more = 'noMore'
    } else {
      this.more = 'more'
    }
  },
  methods: {
    // 选择就诊人
    changePatient(item) {
      this.perId = item.memberId
      this.patientId = item.patientId
      this.tabTap(this.bizType)
    },
    searchTap() {
      this.currentNum = 0
      this.docList = []
      this.tabTap(this.bizType)
    },
    // 预约挂号医生
    async getList() {
      this.more = 'loading'
      uni.showLoading()
      let list = await myRegDocList({
        patientId: this.patientId,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        searchKeywords: this.keywords,
        field: 'create_time',
        sorted: this.sorted,
      })
      uni.hideLoading()
      this.pages = list.pages
      this.docList = this.docList.concat(list.data || [])
      if (this.currentNum == list.pages) {
        this.more = 'noMore'
      } else {
        this.more = 'more'
      }
    },
    tabTap(value) {
      console.log(value)
      this.bizType = value
      this.currentNum = 1
      this.pages = 1
      this.docList = []
      if (this.bizType == 1) {
        this.getList()
      } else {
        this.getuserdoctorList()
      }
    },
    sortChange() {
      if (this.sorted == 'desc') {
        this.sorted = 'asc'
      } else {
        this.sorted = 'desc'
      }
      this.tabTap(this.bizType)
    },
    // 互联网医生
    getuserdoctorList() {
      let data = {
        pageSize: this.pageSize,
        currentNum: this.currentNum,
        bizType: this.bizType,
        userId: uni.getStorageSync('userId'),
        orgId: uni.getStorageSync('orgId'),
        keywords: this.keywords,
        field: 'create_time',
        sorted: this.sorted,
        memberId: this.perId,
      }
      this.more = 'loading'
      userdoctorList(data).then(res => {
        this.docList = this.docList.concat(res.data)
        this.pages = res.pages
        if (this.currentNum == res.pages) {
          this.more = 'noMore'
        } else {
          this.more = 'more'
        }
      })
    },
    info() {
      this.$refs.edit.close()
      uni.navigateTo({
        url: `/pages-user/myDoctor/detail?doctorId=${this.doctorId}`,
      })
    },
    goto(row) {
      if (this.bizType == 1) {
        uni.navigateTo({
          url: `/pages-zy/appointmentDoc/appointmentInfo?fromDocList=${true}&docId=${
            row.id
          }&deptId=${row.deptId}&orgId=${row.orgCode}&item=${JSON.stringify(
            row,
          )}`,
        })
      } else {
        h5DocBizInfo({
          doctorId: row.doctorId,
        }).then(res => {
          let list = []
          let falseNum = 0
          let forLi = 0
          for (let i = 0; i < res.length; i++) {
            if (this.bizType == res[i].describe && res[i].hasOpen) {
              uni.navigateTo({
                url: `/pages-user/home/doctordetail/DoctorDetail?type=${this.bizType}&doctorId=${row.doctorId}`,
              })
              break
            } else {
              list.push(res[i])
            }
            if (!res[i].hasOpen) {
              falseNum = falseNum + 1
            }
            forLi++
          }
          if (forLi == res.length) {
            if (falseNum == res.length) {
              this.doctorId = row.doctorId
              this.$refs.edit.open()
              return false
            }
            for (let f = 0; f < list.length; f++) {
              if (list[f].hasOpen && list[f].describe == 'CONSULT') {
                uni.navigateTo({
                  url: `/pages-user/home/doctordetail/DoctorDetail?type=CONSULT&doctorId=${row.doctorId}`,
                })
                return false
              } else {
                if (list[f].hasOpen && list[f].describe == 'REPEAT_CLINIC') {
                  uni.navigateTo({
                    url: `/pages-user/home/doctordetail/DoctorDetail?type=REPEAT_CLINIC&doctorId=${row.doctorId}`,
                  })
                  return false
                } else {
                  if (list[f].hasOpen && list[f].describe == 'CARRYON_PRESC') {
                    uni.navigateTo({
                      url: `/pages-user/home/doctordetail/DoctorDetail?type=CARRYON_PRESC&doctorId=${row.doctorId}`,
                    })
                    return false
                  }
                }
              }
            }
          }
          if (res.length < 1) {
            this.doctorId = row.doctorId
            this.$refs.edit.open()
          }
        })
      }
    },
    service() {
      this.$refs.edit.close()
      uni.navigateTo({
        url: '/pages-user/home/online/Consultation?type=' + this.bizType,
      })
    },
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum = this.currentNum + 1
      if (this.bizType == 1) {
        this.getList()
      } else {
        this.getuserdoctorList()
      }
    } else {
      this.more = 'noMore'
    }
  },
}
</script>
<style scoped lang="scss">
.headerTop {
  padding-left: 20rpx;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  border-radius: 0 0 20rpx 20rpx !important;
}

.search {
  background: #fff;
  padding: 0 20rpx 0 32rpx;
  border-radius: 36rpx !important;
  height: 72rpx;
  line-height: 72rpx;
  background: #f2f2f2;
  margin: 20rpx 0;
  margin-bottom: 10rpx;

  .searchtext {
    font-size: 28rpx;
    color: #999;
  }

  .searchIcon {
    color: #888 !important;
  }
}

.tabList {
  padding: 0 20rpx;
  padding-bottom: 0;
  height: 80rpx;

  .tabItem {
    font-size: 26rpx;
    color: #666;
    border-bottom: 4rpx solid #fff;
    padding-bottom: 10rpx;
    line-height: 66rpx;

    &.on {
      border-color: $uni-color-primary;
      color: $uni-color-primary;
    }
  }

  .iconBorder {
    padding-left: 30rpx;
    margin-left: 40rpx;
    border-left: 1px solid #e6e6e6;
  }
}

.main {
  padding: 20rpx;
}

.docBox {
  .docItem {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .ptr {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
    }

    .contentBox {
      width: 510rpx;

      .name {
        font-size: 30rpx;
        color: #1a1a1a;

        text {
          font-size: 24rpx;
          color: #666666;
          margin-left: 40rpx;
        }
      }

      .hos,
      .good {
        font-weight: 400;
        font-size: 24rpx;
        color: #666;

        .fen {
          font-size: 34rpx;
          color: #ffa200;
          font-weight: bold;
          margin-right: 40rpx;
        }
      }
    }
  }
}
</style>
