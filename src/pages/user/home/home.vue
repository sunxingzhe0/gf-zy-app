<template>
  <view class="container">
    <view class="notice" @click="notice">
      <image :src="require('@/assets/user/notice.png')" class="notice-img"></image>
      <text class="notice-text">{{
        announceS[0] ? announceS[0].title : ''
      }}</text>
      <image :src="require('@/assets/right11@2x.png')" class="notice-right"></image>
    </view>
    <!-- <uni-notice-bar @click="notice()" :scrollable="announceS[0].title.length > 20" single="true" showIcon speed="10" background-color="#DFEAED" color="#666666" showGetMore :moreText="' '" :text="announceS[0].title"></uni-notice-bar> -->
    <view class="title-bg">
      <default-img class="title-bg_image" :isPreview="false" :url="FILE_URL(orgIntro.picList[0])" :defaultImg="FILE_URL_BUILT_IN('hospitalBg.png')"></default-img>
      <view class="hospital-title">
        <text>{{ orgIntro.name }}</text>
        <text>{{ orgIntro.levelName }}</text>
        <view @click="details">查看详情</view>
      </view>
    </view>
    <view class="uni-center card box-shadow" v-if="perList.length == 0" @click="navigateTo('/pages-user/patientManagement/add')">
      <text class="iconfont icon-zengjia"></text>
      <view class="title">新增就诊人</view>
      <view class="tip">新增就诊人，可享受医院一对一的在线服务</view>
    </view>
    <view class="perCard flex-between" v-if="perList.length>0" @click="navigateTo(`/pages-user/patientManagement/detail?id=${perList[0].memberId}`)">
      <image class="perBg" :src="require('@/assets/user/perBg.png')"></image>
      <view>
        <view class="perName">{{perList[0].name}}</view>
        <view class="perNo">{{perList[0].patientCard}}</view>
      </view>
      <image class="erweima" :src="require('@/assets/user/erweima.png')"></image>
    </view>
    <view class="tab">
      <template v-for="(item,index) in navList">
        <view class="tab_item" :key="index"  @click="navTap(item)">
          <image :src="item.img"></image>
          <text>{{item.title}}</text>
        </view>

      </template>
      <view class="tab_item"></view>
    </view>
    <swiper class="health_manage" v-if="swiperImgs.length > 0" autoplay="true" circular="true" indicator-dots="true"
      indicator-active-color="#0AB2C1">
      <swiper-item v-for="(item, index) in swiperImgs" :key="index">
        <view class="swiper_view" @click="toWeb(item)">
          <default-img :isPreview="false" style="width: 100%; height: 100%;  border-radius: 22rpx;" :url="FILE_URL(item.picId)"
            :defaultImg="FILE_URL_BUILT_IN('healthManageBg.png')"></default-img>
        </view>
      </swiper-item>
    </swiper>
    <!-- <view class="oline_expert" v-if="onlineExpertList.length > 0">
      <view class="title_layout">
        <view class="item_title">
          <image :src="require('@/assets/user/user_oline_expert.png')"></image>
          <text style="margin-left: 10rpx;">在线咨询专家</text>
        </view>
        <view class="more" @click="navigateTo('/pages-user/home/online/Consultation')">
          <text>更多</text>
          <view class="right"></view>
        </view>
      </view>

      <scroll-view class="oline_doctor" scroll-x="true">
        <view style="display: flex;height: 100%;">
          <view class="doctor_item" v-for="(item, index) in onlineExpertList" :key="index" @click="
              navigateTo(
                '/pages-user/home/doctordetail/DoctorDetail?type=CONSULT&&doctorId=' +
                  item.doctorId,
              )
            ">
            <default-img style="width: 100rpx; :isPreview="false"
        height: 100rpx;border-radius: 50%; overflow: hidden;" :url="FILE_URL(item.picId)"></default-img>
            <text class="name text-overflow">{{ item.name }}</text>
            <text class="deptName text-overflow">{{ item.deptName }}</text>
          </view>
        </view>
      </scroll-view>
    </view> -->
<view class="oline_expert" v-if="starList.length > 0">
      <view class="title_layout">
        <view class="item_title">
          <image :src="require('@/assets/user/user_oline_expert.png')"></image>
          <text style="margin-left: 10rpx;">明星专家</text>
        </view>
        <view class="more" @click="navigateTo('/pages-zy/starExpert/list')">
          <text>更多</text>
          <view class="right"></view>
        </view>
      </view>

      <scroll-view class="oline_doctor" scroll-x="true">
        <view style="display: flex;height: 100%;">
          <view class="doctor_item" v-for="(item, index) in starList" :key="index" @click="
              navigateTo(`/pages-zy/appointmentDoc/appointmentInfo?docId=${item.id}&deptId=${item.deptId}&orgId=${item.orgCode}`)
            ">
            <default-img style="width: 100rpx;
        height: 100rpx;border-radius: 50%; overflow: hidden;" :isPreview="false" :url="FILE_URL(item.avatar)"></default-img>
            <text class="name text-overflow">{{ item.name }}</text>
            <text class="deptName text-overflow">{{ item.deptName }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="department" v-if="columnPro.length > 0">
      <view class="title_layout">
        <view class="item_title">
          <image :src="require('@/assets/user/user_star_department.png')"></image>
          <text style="margin-left: 10rpx;">{{ columnTitle }}</text>
        </view>
      </view>

      <scroll-view class="department_list" scroll-x="true">
        <view style="display: flex;height: 100%;">
          <view class="department_item" v-for="(item, index) in columnPro" :key="index" @click="toWeb(item)">
            <default-img class="department_item_image" :isPreview="false" :url="FILE_URL(item.picId)" :defaultImg="require('@/assets/user/department_d.png')"></default-img>
          </view>
        </view>
      </scroll-view>
    </view>

    <!--解决ios设置底部距离未生效问题 -->
    <view style="height: 1px;"></view>
  </view>
</template>

<script>
  import {
    rotationChartDisplay,
    findColumnTitle,
    columnPro,
    onlineExpertList,
    orgIntro,
    announceAnyData,
    startExperts,
    patientList
  } from '../../../common/request/index.js'
  import navList from './navList.js'
  export default {
    data() {
      return {
        swiperImgs: [],
        columnTitle: '',
        columnPro: [],
        onlineExpertList: [],
        orgIntro: {
          picList: [],
        },
        announceS: [],
        navList: navList,
        starList: [],
        perList: []
      }
    },
    created() {
      // uni.setNavigationBarTitle({
      //   title: '首页'
      // });

      this.getannounceAnyData()
      this.getpatientList() //就诊人
      this.getrotationChartDisplay()
      this.getColumnTitle()
      this.getcolumnPro()
      this.getOnlineExpertList()
      this.getOrgIntro()
      this.getstartExperts() //明星专家
    },
    // onShow() {
    //   this.setTabBarIndex(0);
    // },
    methods: {
      //快速导航跳转
      navTap(item) {
        if (item.type == 'link') {
          this.navigateTo(item.url)
        } else if (item.type == 'all') {
          this.navList.forEach((t, index) => {
            t.isOpen = true
            if (t.type == 'all') {
              t.isOpen = false
            }
          })
        } else if (item.type == 'close') {
          this.navList.forEach((t, index) => {
            if (index < 7) {
              t.isOpen = true
            } else {
              if (t.type == 'all') {
                t.isOpen = true
              } else {
                t.isOpen = false
              }

            }

          })
        } else if (item.type == 'navigation') {
          let that = this
          uni.openLocation({
            latitude: 20.001134,
            longitude: 110.341339,
            name: that.orgIntro.name,
            address: that.orgIntro.address,
            success: function() {
              console.log('success');
            }
          });
        }
      },
      toWeb(item) {
        console.log(item)
        if (item.linksType == 1) {
          if (item.skipLinks) {
            uni.navigateTo({
              url: '/pages/user/home/web-view?url=' + item.skipLinks,
            })
          }
        } else {
          if (item.skipLinks) {
            if (item.skipLinks == '/pages/user/room/room') {
              uni.setStorageSync('setStatusIndexFunc', 1)
              uni.reLaunch({
                url: '/pages/index-user',
              })
            } else {
              uni.navigateTo({
                url: item.skipLinks,
              })
            }
          }
        }
      },
      //最新一条公告
      async getannounceAnyData() {
        let list = await announceAnyData({
          searchType: 0,
          currentNum: 1,
          pageSize: 1,
        })
        this.announceS = this.announceS.concat(list.list)
      },
      /**
       * 获取广告轮播
       * */
      getrotationChartDisplay() {
        rotationChartDisplay().then(data => {
          if (data) {
            this.swiperImgs = data
          }
        })
      },
      // 明星专家
      async getstartExperts() {
        let list = await startExperts({
          currentNum: 1,
          pageSize: 10
        })
        this.starList = list.data
      },
      // 就诊人
      async getpatientList() {
        this.perList = await patientList()
      },
      getColumnTitle() {
        findColumnTitle().then(data => {
          if (data) {
            this.columnTitle = data.title
          }
        })
      },
      getcolumnPro() {
        columnPro().then(data => {
          if (data) {
            this.columnPro = data
          }
        })
      },
      getOnlineExpertList() {
        onlineExpertList().then(data => {
          if (data) {
            this.onlineExpertList = data
          }
        })
      },
      details() {
        uni.navigateTo({
          url: '/pages-user/home/OrganizationInformation',
        })
      },
      information() {
        uni.navigateTo({
          url: '/pages-user/home/information/HospitalInformation',
        })
      },
      navigateTo(urlStr) {
        uni.navigateTo({
          url: urlStr,
        })
      },
      notice() {
        uni.navigateTo({
          url: '/pages-user/notice/list',
        })
      },
      getOrgIntro() {
        orgIntro().then(data => {
          if (data) {
            this.orgIntro = data
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    padding-bottom: 120rpx;
  }

  .notice {
    // padding: 0rpx 20rpx;
    width: 100%;
    height: 80rpx;
    align-items: center;
    background: rgba(10, 178, 193, 0.1);
    display: flex;
    justify-content: space-between;

    .notice-img {
      padding-left: 20rpx;
      width: 46rpx;
      height: 46rpx;
    }

    .notice-text {
      flex: 1;
      padding: 0rpx 20rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .notice-right {
      padding-right: 20rpx;
      width: 7rpx;
      height: 14rpx;
    }
  }



  .title-bg {
    width: 100%;
    height: 320rpx;
    position: relative;

    .title-bg_image {
      width: 100%;
      height: 320rpx;
      position: absolute;
    }

    .hospital-title {
      z-index: 2;
      position: absolute;
      display: flex;
      flex-direction: column;
      width: 80%;
      height: 320rpx;
      padding-left: 60rpx;

      text {
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);

        &:first-child {
          margin-top: 59rpx;
          margin-bottom: 30rpx;
          font-size: 40rpx;
          font-weight: normal;
          color: rgba(255, 255, 255, 1);
          line-height: 36rpx;
        }
      }

      view {
        margin-top: 36rpx;
        width: 140rpx;
        line-height: 52rpx;
        height: 52rpx;
        text-align: center;
        background: rgba(10, 178, 193, 1);
        border-radius: 26px;
        font-size: 24rpx;
        color: rgba(254, 254, 254, 1);
      }
    }
  }

  .perCard {
    padding: 20rpx 30rpx;
    padding-right: 40rpx;
    margin: 0 20rpx;
    margin-top: -20rpx;
    z-index: 20;
    position: relative;
    border-radius: 20rpx;
    overflow: hidden;

    .perBg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    >view {
      position: relative;
      z-index: 3;
    }

    .perName {
      font-size: 30rpx;
      color: #fff;
      font-weight: 600;

    }

    .perNo {
      font-size: 24rpx;
      color: #fff;
    }

    .erweima {
      width: 40rpx;
      height: 40rpx;
      position: relative;
      z-index: 3;
    }
  }

  .card {
    padding: 20rpx 20rpx;
    padding-top: 30rpx;
    margin: 0 20rpx;
    margin-top: -20rpx;
    z-index: 20;
    position: relative;
    background: #fff;
    line-height: 50rpx;

    text {
      color: $uni-color-primary;
      font-size: 54rpx;
      font-weight: 600;
    }

    .title {
      font-size: 30rpx;
      color: #1a1a1a;
      margin-top: 5rpx;
    }

    .tip {
      font-size: 24rpx;
      color: #666;
    }
  }

  .tab {
    margin: 20rpx 20rpx 0 20rpx;
    z-index: 20;
    position: relative;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 24px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 30rpx 6rpx;
    padding-bottom: 10rpx;

    .tab_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 160rpx;
      text-align: center;
      margin-bottom: 20rpx;

      image {
        width: 80rpx;
        height: 80rpx;
      }

      text {
        font-size: 26rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
        line-height: 36rpx;
        margin-top: 10rpx;
      }
    }
  }


  .health_manage {
    margin-top: 20rpx;
    width: 100%;
    height: 220rpx;

    .swiper_view {
      margin: 0rpx 20rpx;
      border-radius: 22rpx;
      overflow: hidden;
      width: 710rpx;
      height: 220rpx;
    }
  }

  .oline_expert {
    margin: 0 auto;
    margin-top: 20rpx;
    width: 710rpx;
    height: 354rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
    border-radius: 20rpx;
  }

  .department {
    margin-top: 20rpx;
    margin-left: 20rpx;
    width: 710rpx;
    height: 320rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
    border-radius: 20rpx;
  }

  .title_layout {
    padding: 40rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item_title {
      display: flex;
      align-items: center;

      image {
        width: 40rpx;
        height: 40rpx;
      }

      text {
        font-size: 30rpx;
        font-weight: bold;
        color: rgba(26, 26, 26, 1);
      }
    }

    .more {
      align-items: center;
      display: flex;
      font-size: 24rpx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);

      .right {
        margin-left: 10rpx;
        width: 14rpx;
        height: 14rpx;
        border-top: 2rpx solid #666666;
        border-right: 2rpx solid #666666;
        transform: rotate(45deg);
      }
    }
  }

  .oline_doctor {
    width: 700rpx;
    margin: 0 auto;

    // display: flex;

    .doctor_item {
      margin: 0rpx 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .item_image {
        width: 100rpx;
        height: 100rpx;
      }

      .name {
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
      }

      .deptName {
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
    }
  }

  .department_list {
    width: 700rpx;
    margin: 0 auto;
  }

  .department_item {
    margin-right: 30rpx;
    display: flex;
    flex-direction: column;
    width: 190rpx;
    height: 160rpx;
    position: relative;
    &:nth-child(1){
      margin-left: 30rpx;
    }

    .department_item_image {
      width: 190rpx;
      height: 160rpx;
      border-radius: 10rpx;
      overflow: hidden;
    }

    text {
      position: absolute;
      left: 16rpx;
      bottom: 12rpx;
      font-size: 26rpx;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 36rpx;
    }
  }
</style>
