<template>
  <view class="doctorWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="search flex-between box-shadow">
      <input type="text" style="width: 100%; " placeholderClass="searchtext" @blur="search" v-model="keywords"
        placeholder="请输入医生姓名进行搜索" />
      <uni-icons type="search" class="searchIcon" size="20"></uni-icons>
    </view>
    <!--左菜单栏-->
    <leftTab :tabs="tabs" styles="top:112rpx; width:220rpx; border-radius:20rpx 0 0 0 ;" :active="tabs[0].key" @change="topbarChange"></leftTab>
    <view class="listWrap" style="padding-left: 222rpx;padding-top: 21.6rpx;">
      <scroll-view :scroll-y="true" class="box-shadow listScroll" style="min-height: 90.8vh; background: #fff; overflow: hidden;">
        <!-- <view class="list"> -->
          <view class="listItem" v-for="(item,t) in list" :key="t">
            <view class="listpdept flex-between" @click="deptTap(item)">
              <text>{{item.name}}</text>
              <uni-icons :type="item.isOpen?'arrowdown':'arrowright'" color="#666" size="14"></uni-icons>
            </view>
            <view class="childList" v-if="item.children.length>0 && item.isOpen">
              <view v-for="(child,index) in item.children" :key="index" @click="goto(child)">
                {{child.name}}
              </view>
            </view>
          </view>
        <!-- </view> -->
      </scroll-view>

    </view>
  </view>
</template>

<script>
  import {
    getDeptList,
    getDeptByCondition
  } from '../api/outpatient.js'
  import {
    getHospInfo
  } from '../api/physical.js'
  import leftTab from '../components/leftTab/index.vue'
  export default {
    components: {
      leftTab
    },
    data() {
      return {
        tabs: [],
        active: 0,
        primaryColor: '#0AB2C1',
        keywords: '',
        list: []
      };
    },
    onLoad(options) {
      this.gethispital()

    },
    onShow() {

    },
    methods: {
      topbarChange(e) {
        this.active = e
        this.getdept()
      },
      //获取院区
      async gethispital() {
        let list = await getHospInfo()
        list.forEach(item => {
          item.title = item.hospName
          item.key = item.hospCode
        })
        this.tabs = list
        this.active = list[0].hospCode
        this.getdept()
      },
      //获取科室列表
      async getdept() {
        this.list = await getDeptList({
          orgId: this.active,
          name: this.keywords,
          resource: 2
        })
      },
      //获取搜索科室
      async getshearchList() {
        this.list = await getDeptByCondition({
          name: this.keywords,
          orgId: this.active,
          resource: 2
        })
      },
      search() {
        if (this.keywords) {
          this.getshearchList()
        } else {
          this.getdept()
        }
      },

      deptTap(item) {
        if (item.children && item.children.length > 0) {
          this.$set(item, 'isOpen', !item.isOpen)
        } else {
          this.goto(item)
        }
      },
      goto(item) {
        console.log(item)
        uni.navigateTo({
          url: `/pages-zy/appointmentDoc/docList?deptId=${item.id}&orgId=${this.active}`
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .doctorWrap {
    padding-top: 20rpx;
  }

  .search {
    background: #fff;
    padding: 0 20rpx 0 32rpx;
    border-radius: 36rpx !important;
    height: 72rpx;
    line-height: 72rpx;
    margin: 0 20rpx;

    .searchtext {
      font-size: 28rpx;
      color: #999;
    }

    .searchIcon {
      color: #888 !important;
    }
  }

  .listScroll {
    border-radius: 0 20rpx 0 0 !important;
  }

  // .list {
  //   background: #fff;
  //   margin-top: 20rpx;
  //   align-items: flex-start;
  //   overflow: hidden;
  //   color: #333;


    .listItem {
      border-bottom: 1px solid #E6E6E6;

      .listpdept {
        font-size: 30rpx;
        color: #333;
        height: 90rpx;
        line-height: 90rpx;
        padding: 0 30rpx;
      }

    }



    .childList {
      background: #F2F2F2;
      padding-left: 30rpx;

      view {
        height: 90rpx;
        line-height: 90rpx;
        padding-left: 58rpx;
        border-top: 1px solid #E6E6E6;
      }
    }
  // }
</style>
