<template>
  <view class="doctorWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <view class="search flex-between">
        <input type="text" v-model="keywords" placeholderClass="searchtext" placeholder="搜索姓名/职称/擅长" />
        <uni-icons type="search" @click="searchTap" class="searchIcon" size="20"></uni-icons>
      </view>
      <view class="tabList flex-between">
        <view class="tabWrap flex-between flex_1">
          <view :class="['tabItem', bizType == item.value ? 'on' : '']" @click="tabTap(index)" v-for="(item, index) in tabList" :key="index">{{ item.name }}</view>
        </view>
        <view class="iconBorder" @click="sortChange"><image :src="require('@/assets/paixu(1)@2x.png')" style="width: 30rpx;height: 30rpx;"></image></view>
      </view>
    </view>

    <view style="padding-top: 200rpx;">
      <view class="list box-shadow flex-between" v-for="(item, index) in list" :key="index" @click="goto(item)">
        <view class="listImg">
          <default-img :url="FILE_URL(item.avatar)"></default-img>
        </view>
        <view class="info">
          <view class="name">
            {{ item.doctorName }}
            <text>{{ item.sex }}</text>
          </view>
          <view class="des">
            <text>{{ item.deptName }}</text>
            <text>{{ item.titleName }}</text>
            <text>{{ userInfo.orgName }}</text>
          </view>
          <view class="des text-overflow">擅长：{{ item.skilled }}</view>
          <view class="des">
            业务：{{ item.bizType == 'CONSULT' ? '在线咨询' : item.bizType == 'REPEAT_CLINIC' ? '在线复诊' : item.bizType == 'CARRYON_PRESC' ? '慢病续方' : '' }}
          </view>
          <view class="des">
            评分：
            <text class="fen">{{ item.avgScore || 0 }}</text>
            <text>{{ item.treatNumber || 0 }} 次诊疗</text>
          </view>
        </view>
      </view>
      <uni-load-more v-show="pages > 1" :status="more"></uni-load-more>
    </view>
    <uni-popup ref="edit" :maskClick="false">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">系统消息</view>
          <view class="font26 color666">该医生目前已暂停所有服务，是否前往购买其他 医生的{{ tabName }}服务？</view>
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
import { userdoctorList } from '@/common/request/userCenter';
import { h5DocBizInfo } from '@/common/request/index';
export default {
  components: {},
  data() {
    return {
      tabList: [{ name: '在线咨询', value: 'CONSULT' }, { name: '在线复诊', value: 'REPEAT_CLINIC' }, { name: '慢病续方', value: 'CARRYON_PRESC' }],
      more: 'more',
      pageSize: 10,
      currentNum: 1,
      pages: 1,
      tabName: '在线咨询',
      bizType: 'CONSULT',
      keywords: '',
      sorted: 'desc',
      list: [],
      doctorId: '',
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  onLoad() {
    this.getuserdoctorList();
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum += 1;
      this.getuserdoctorList();
    } else {
      this.more = 'noMore';
    }
  },
  methods: {
    searchTap() {
      this.currentNum = 1;
      this.list = [];
      this.getuserdoctorList();
    },
    sortChange() {
      if (this.sorted == 'desc') {
        this.sorted = 'asc';
      } else {
        this.sorted = 'desc';
      }
      this.searchTap();
    },
    getuserdoctorList() {
      let data = {
        pageSize: this.pageSize,
        currentNum: this.currentNum,
        bizType: this.bizType,
        userId: uni.getStorageSync('userId'),
        orgId: uni.getStorageSync('orgId'),
        keywords: this.keywords,
        field: 'create_time',
        sorted: this.sorted
      };
      this.more = 'loading';
      userdoctorList(data).then(res => {
        this.list = this.list.concat(res.data);
        this.pages = res.pages;
        if (this.currentNum == res.pages) {
          this.more = 'noMore';
        } else {
          this.more = 'more';
        }
      });
    },
    tabTap(index) {
      this.bizType = this.tabList[index].value;
      this.tabName = this.tabList[index].name;
      this.searchTap();
    },
    info() {
      this.$refs.edit.close();
      uni.navigateTo({
        url: `/pages-user/myDoctor/detail?doctorId=${this.doctorId}`
      });
    },
    goto(row) {
      h5DocBizInfo({ doctorId: row.doctorId }).then(res => {
        let list = [];
        let falseNum = 0;
        for (let i = 0; i < res.length; i++) {
          if (this.bizType == res[i].describe && res[i].hasOpen) {
            uni.navigateTo({
              url: `/pages-user/home/doctordetail/DoctorDetail?type=${this.bizType}&doctorId=${row.doctorId}`
            });
            break;
          } else {
            list.push(res[i]);
          }
          if (!res[i].hasOpen) {
            falseNum = falseNum + 1;
          }

          if (i == res.length - 1) {
            if (falseNum == res.length) {
              this.doctorId = row.doctorId;
              this.$refs.edit.open();
              return false;
            }
            for (let f = 0; f < list.length; f++) {
              if (list[f].hasOpen && list[f].describe == 'CONSULT') {
                uni.navigateTo({
                  url: `/pages-user/home/doctordetail/DoctorDetail?type=CONSULT&doctorId=${row.doctorId}`
                });
                return false;
              } else {
                if (list[f].hasOpen && list[f].describe == 'REPEAT_CLINIC') {
                  uni.navigateTo({
                    url: `/pages-user/home/doctordetail/DoctorDetail?type=REPEAT_CLINIC&doctorId=${row.doctorId}`
                  });
                  return false;
                } else {
                  if (list[f].hasOpen && list[f].describe == 'CARRYON_PRESC') {
                    uni.navigateTo({
                      url: `/pages-user/home/doctordetail/DoctorDetail?type=CARRYON_PRESC&doctorId=${row.doctorId}`
                    });
                    return false;
                  }
                }
              }
            }
          }
        }
        if (res.length < 1) {
          this.doctorId = row.doctorId;
          this.$refs.edit.open();
        }
      });
    },
    service() {
      this.$refs.edit.close();
      uni.navigateTo({
        url: '/pages-user/home/online/Consultation?type=' + this.bizType
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';
.doctorWrap {
  padding: 20rpx 30rpx;
  padding-top: 0;
}
.headerTop {
  padding: 20rpx;
  padding-bottom: 0;
}
.search {
  background: #fff;
  padding: 0 20rpx 0 32rpx;
  border-radius: 36rpx !important;
  height: 72rpx;
  line-height: 72rpx;
  background: #f2f2f2;
  .searchtext {
    font-size: 28rpx;
    color: #999;
  }
  .searchIcon {
    color: #888 !important;
  }
}
.tabList {
  padding-right: 20rpx;
  padding-left: 30rpx;
  .tabItem {
    margin-right: 0;
  }
  .iconBorder {
    padding-left: 30rpx;
    margin-left: 40rpx;
    border-left: 1px solid #e6e6e6;
  }
}
.list {
  background: #fff;
  padding: 40rpx 30rpx;
  align-items: flex-start;
  cursor: pointer;
  .listImg {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
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
      text {
        margin-right: 30rpx;
      }
      .fen {
        font-size: 34rpx;
        color: #ffa200;
        font-weight: bold;
      }
    }
    .tag {
      margin-top: 20rpx;
      view {
        border-radius: 6rpx;
        padding: 4rpx 12rpx;
        background: #d0f2f5;
        color: $uni-color-primary;
        margin-right: 20rpx;
        font-size: 22rpx;
        &:nth-child(2) {
          background: #f2f2f2;
          color: #999999;
        }
      }
    }
  }
}
</style>
