<template>
  <view class="container">
    <view class="notice" @click="notice">
      <image
        :src="require('@/assets/user/notice.png')"
        class="notice-img"
      ></image>
      <text class="notice-text">{{
        announceS[0] ? announceS[0].title : ''
      }}</text>
      <image
        :src="require('@/assets/right11@2x.png')"
        class="notice-right"
      ></image>
      <view
        v-if="host === 'https://miapp.chuntaoyisheng.com/'"
        class="state-test"
        >debug</view
      >
    </view>
    <!-- <uni-notice-bar @click="notice()" :scrollable="announceS[0].title.length > 20" single="true" showIcon speed="10" background-color="#DFEAED" color="#666666" showGetMore :moreText="' '" :text="announceS[0].title"></uni-notice-bar> -->
    <view class="title-bg">
      <!-- <default-img
        class="title-bg_image"
        :isPreview="false"
        :url="FILE_URL(orgIntro.picList[0])"
        :defaultImg="require('@/assets/no-banner.png')"
      ></default-img> -->
      <default-img
        class="title-bg_image"
        :isPreview="false"
        :url="bannerUrl"
        :defaultImg="require('@/assets/hos-info-banner.jpg')"
      ></default-img>
      <view class="hospital-title">
        <text>{{ orgIntro.name }}</text>
        <text>{{ orgIntro.levelName }}</text>
        <view @click="details">查看详情</view>
      </view>
    </view>
    <view
      class="uni-center card box-shadow"
      v-if="perList.length == 0"
      @click="navigateTo('/pages-user/patientManagement/add')"
    >
      <text class="iconfont icon-zengjia"></text>
      <view class="title">新增健康卡</view>
    </view>
    <view class="card-swiper-box" v-if="perList.length > 0">
      <view class="card-swiper-content">
        <swiper
          @change="changeCard"
          class="card-swiper"
          circular="true"
          indicator-dots="true"
          indicator-color="#ccc"
          indicator-active-color="#0AB2C1"
          previous-margin="5px"
          next-margin="7px"
        >
          <swiper-item
            class="swiper-item"
            v-for="(val, index) in perList"
            :key="index"
          >
            <view
              class="swiper-perCard flex-between"
              @click="
                navigateTo(
                  `/pages-user/patientManagement/detail?id=${val.memberId}`,
                )
              "
            >
              <view>
                <view class="perName">{{ val.name }}</view>
                <view class="perNo">卡号：{{ val.patientCard }}</view>
              </view>
              <image
                class="erweima"
                :src="require('@/assets/user/erweima.png')"
              ></image>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view class="tab" v-for="(miniCard, i) in navList" :key="i">
      <view class="card-title">
        <image class="card-icon" :src="miniCard.imgurl"></image>
        <text>{{ miniCard.title }}</text>
      </view>
      <view class="icons">
        <template v-for="(item, index) in miniCard.iconList">
          <view
            :class="item.disabled ? 'disabled tab_item' : 'tab_item'"
            :key="index"
            @click="navTap(item)"
          >
            <image :src="item.img"></image>
            <text>{{ item.title }}</text>
          </view>
        </template>
        <view class="tab_item"></view>
        <view class="tab_item"></view>
      </view>
    </view>
    <view class="oline_expert" v-if="starList.length > 0">
      <view class="title_layout">
        <view class="item_title">
          <image :src="require('@/assets/user/user_oline_expert.png')"></image>
          <text style="margin-left: 10rpx">专家介绍</text>
        </view>
        <view class="more" @click="navigateTo('/pages-zy/starExpert/list')">
          <text>更多</text>
          <view class="right"></view>
        </view>
      </view>

      <scroll-view class="oline_doctor" scroll-x="true">
        <view style="display: flex; height: 100%">
          <view
            class="doctor_item"
            v-for="(item, index) in starList"
            :key="index"
            @click="
              navigateTo(
                `/pages-zy/appointmentDoc/appointmentInfo?docId=${
                  item.id
                }&deptId=${item.deptId}&orgId=${
                  item.orgCode
                }&item=${JSON.stringify(item)}&starIn=1`,
              )
            "
          >
            <default-img
              style="
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                overflow: hidden;
              "
              :isPreview="false"
              :url="FILE_URL(item.avatar)"
            ></default-img>
            <text class="name text-overflow">{{ item.name }}</text>
            <text class="deptName text-overflow">{{
              item.deptName || ''
            }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <swiper
      class="health_manage"
      v-if="swiperImgs.length > 0"
      autoplay="true"
      circular="true"
      indicator-dots="true"
      indicator-active-color="#0AB2C1"
    >
      <swiper-item v-for="(item, index) in swiperImgs" :key="index">
        <view class="swiper_view" @click="toWeb(item)">
          <default-img
            :isPreview="false"
            style="width: 100%; height: 100%; border-radius: 22rpx"
            :url="FILE_URL(item.picId)"
            :defaultImg="FILE_URL_BUILT_IN('healthManageBg.png')"
          ></default-img>
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

    <!-- <view class="department" v-if="columnPro.length > 0">
      <view class="title_layout">
        <view class="item_title">
          <image
            :src="require('@/assets/user/user_star_department.png')"
          ></image>
          <text style="margin-left: 10rpx">{{ columnTitle }}</text>
        </view>
      </view>

      <scroll-view class="department_list" scroll-x="true">
        <view style="display: flex; height: 100%">
          <view
            class="department_item"
            v-for="(item, index) in columnPro"
            :key="index"
            @click="toWeb(item)"
          >
            <default-img
              class="department_item_image"
              :isPreview="false"
              :url="FILE_URL(item.picId)"
              :defaultImg="require('@/assets/user/department_d.png')"
            ></default-img>
          </view>
        </view>
      </scroll-view>
    </view> -->

    <!--解决ios设置底部距离未生效问题 -->
    <view style="height: 1px"></view>

    <!-- 温馨提示 数据来源pc后台配置 -->
    <uni-popup ref="agreementPopup" type="center" :maskClick="false">
      <view class="type-popup">
        <text class="popup-title">{{ tjNotice.title || '温馨提示' }}</text>
        <scroll-view class="popup-content" scroll-y="true">
          <!-- <view v-html="tjNotice.content"> </view> -->
          <u-parse :content="tjNotice.content"></u-parse>
        </scroll-view>
        <text class="popup-confirm" @click="closeTips">我知道了</text>
      </view>
    </uni-popup>
    <hosSelect
      ref="popselect"
      title="请选择院区"
      :list="hosList"
      @selecList="changeSelect"
    />
    <!--   核酸检测类型选择 -->
    <uni-popup ref="typesPop" type="center" :maskClick="true">
      <view class="btns-pop">
        <view class="btn-title">请选择</view>
        <view class="btn-content">
          <view class="btn-mini" @click="handleSelect(1)">
            <image
              style="width:100%;height:100%"
              :src="require('@/assets/hun.png')"
            ></image>
            <view class="btn-right">立即预约</view>
          </view>
          <view class="btn-mini" @click="handleSelect(0)">
            <image
              style="width:100%;height:100%"
              :src="require('@/assets/dan.png')"
            ></image>
            <view class="btn-right">立即预约</view>
          </view>
        </view>
      </view>
    </uni-popup>
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
  patientList,
  findHasError,
  autoSyncUserCard,
} from '../../../common/request/index.js'
import { getHospInfo } from '@/pages-zy/api/outpatient.js'
import { getTjIns } from '@/pages-zy/api/physical.js'
import hosSelect from './hosSelect.vue'
import navList from './navList.js'
import { loginSf } from '@/pages-sf/util/login'
import { editPatientInfo } from '@/common/request/userCenter'
import { host } from '@/urls'
export default {
  components: { hosSelect },
  data() {
    return {
      host: host,
      memberId: '', //设置当前就诊人menberId
      bannerUrl: require('@/assets/hos-info-banner.jpg'),
      hosList: [],
      tjNotice: null,
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
      perList: [],
      hosType: 'LYDH',
      rowHopInfo: {},
    }
  },
  async created() {
    // uni.setNavigationBarTitle({
    //   title: '首页'
    // });

    this.getannounceAnyData()
    this.getpatientList() //就诊人
    this.getrotationChartDisplay()
    this.getColumnTitle()
    this.getcolumnPro()
    this.getOnlineExpertList()
    await this.getOrgIntro()
    this.bannerUrl = this.FILE_URL(this.orgIntro.picList[0])
    this.getstartExperts() //明星专家

    //获取温馨提示
    this.getTjInsInfo()
    //获取院区
    this.getHospInfo()
  },
  // onShow() {
  //   this.setTabBarIndex(0);
  // },
  mounted() {
    uni.$on('updateCard', () => {
      this.getpatientList()
    })
  },
  methods: {
    handleSelect(state) {
      this.$refs.typesPop.close()
      //1 混检  0 单检
      uni.setStorageSync('selectState', state)
      // //单检
      // if (!state) {
      //   return uni.navigateTo({
      //     url: `/pages-user/nucleicAcidAppointment/flowform/index?isform=0&hospId=${this.rowHopInfo.hospCode}`,
      //   })
      // }
      //单检混检统一走挂号流程
      uni.navigateTo({
        url: `/pages-zy/appointmentDoc/deptList?hospInfo=${JSON.stringify(
          this.rowHopInfo,
        )}`,
      })
    },
    //自动更新就诊卡
    async handleAutoSyncUserCard(memberId) {
      await autoSyncUserCard({ memberId })
    },
    //变更默认选项
    async changeCard(e) {
      uni.showLoading()
      const params = this.perList[e.detail.current]
      params.def = true
      this.memberId = params.memberId //设置当前就诊人menberId
      await editPatientInfo(params)
      this.handleAutoSyncUserCard(this.memberId)
      uni.hideLoading()
    },
    //选择院区
    changeSelect(row) {
      if (this.hosType == 'LYDH') {
        //来院导航
        return uni.openLocation({
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          name: row.name,
          address: row.addr,
          success: function() {
            console.log('success')
          },
          fail: function(err) {
            console.log(err)
          },
        })
      }
      if (this.hosType == 'HSJC') {
        this.rowHopInfo = row
        this.$refs.typesPop.open()
      }
    },
    //获取院区
    async getHospInfo() {
      /*  GH("预约挂号"),
    LYDH("来院导航"),
    LDB("流调表")  */
      // this.hosList = await getHospInfo()
      const res = await getHospInfo()
      this.hosList =
        this.hosType === 'LYDH'
          ? res.filter(item => item.hospType?.split(',')?.includes('LYDH'))
          : this.hosType === 'HSJC'
          ? res.filter(item => item.hospType?.split(',')?.includes('LDB'))
          : []
    },
    //快速导航跳转
    async navTap(item) {
      /* *****登录随访 **start*/
      const sfUrl = [
        '/pages-sf/src/riskAssess/index',
        '/pages-sf/src/myFollow/index',
        '/pages-sf/src/healthEducation/index',
        '/pages-sf/src/deviceControl/index',
        '/pages-sf/src/ownAnswer/index',
        '/pages-sf/src/followNotice/index',
        '/pages-sf/src/satisfaction/index',
      ]
      sfUrl.includes(item.url) && !uni.getStorageSync('sfToken') && loginSf()
      /* ****************end */

      /* ******院内导航--打开河豚引路小程序****** */
      if (item.url === '/pages-zy/navigation/inHosNavigate') {
        uni.navigateToMiniProgram({
          appId: 'wx83884e3a215b20f4',
          path:
            'pages/map/mapView?buildId=0AIP01&url=https%3A%2F%2Fhis.ipalmap.com%2Fnavigation%2Fdist%2Findex.html%23%2Fmap%3FappsId%3D2161%26deptId%3D医院科室ID',
          extraData: {
            data1: 'test',
          },
          success(res) {
            // 打开成功
          },
        })
        return
      }
      /* ************end */
      if (item.disabled) {
        uni.showToast({
          title: '该模块未开通，敬请期待…',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      //可跳转路径
      if (item.type == 'link') {
        console.log(this.memberId, '当前就诊人id--')
        //进入预约挂号需要验证是否可挂号
        if (
          //取消核酸预约【是】的限制 start
          /* (item.url === '/pages-zy/appointmentDoc/deptList' ||
            item.url ===
              '/pages-user/nucleicAcidAppointment/flowform/index?isform=0') &&
          this.memberId */
          item.url === '/pages-zy/appointmentDoc/deptList' &&
          this.memberId
          //end
        ) {
          console.log(this.memberId, '当前就诊人id--')
          uni.showLoading()
          const intoState = await findHasError({ memberId: this.memberId })
          uni.hideLoading()
          if (intoState) {
            return uni.showModal({
              title: '系统提醒',
              content:
                item.url === '/pages-zy/appointmentDoc/deptList'
                  ? '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下收费处挂号。'
                  : '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下预约。',
              showCancel: false,
            })
          }
        }

        //无就诊人时进入预约挂号或核酸
        if (
          (item.url === '/pages-zy/appointmentDoc/deptList' &&
            this.perList.length === 0) ||
          (item.url === '/pages-user/nucleicAcidAppointment/flowform/index' &&
            this.perList.length === 0)
        ) {
          return uni.showModal({
            title: '系统提醒',
            content: '还未添加健康卡，是否立即前往添加？',
            success: res => {
              res.confirm &&
                uni.navigateTo({
                  url: '/pages-user/patientManagement/add',
                })
            },
          })
        }

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
        this.hosType = 'LYDH'
        //获取院区
        uni.showLoading()
        await this.getHospInfo()
        uni.hideLoading()
        this.$refs.popselect.open()
        return
        // uni.openLocation({
        //   latitude: this.orgIntro.latitude,
        //   longitude: this.orgIntro.longitude,
        //   name: this.orgIntro.name,
        //   address: this.orgIntro.address,
        //   success: function() {
        //     console.log('success')
        //   },
        // })
      } else if (item.type == 'nucleicAcid') {
        this.hosType = 'HSJC'
        //首页核酸检测
        uni.showLoading()
        await this.getHospInfo()
        uni.hideLoading()
        this.$refs.popselect.open()
      }
    },
    toWeb(item) {
      if (item.linksType == 1 && item.skipLinks) {
        uni.navigateTo({
          url: '/pages/user/home/web-view?url=' + item.skipLinks,
        })
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
        pageSize: 999,
      })
      this.starList = list.data
    },
    // 就诊人
    async getpatientList() {
      this.perList = []
      this.perList = await patientList()

      //设置当前就诊人menberId
      if (!this.perList.length) return (this.memberId = '')
      const nowPatient = this.perList.filter(v => v.def) //筛选默认项
      if (nowPatient.length) {
        this.memberId = nowPatient[0].memberId
      } else {
        this.memberId = this.perList[0].memberId
      }
      this.handleAutoSyncUserCard(this.memberId)
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
    navigateTo(url) {
      //核酸记录带入memberId
      uni.navigateTo({
        url:
          url === '/pages-user/nucleicAcidAppointment/record/index'
            ? url + `?memberId=${this.memberId}`
            : url,
      })
    },
    details() {
      this.navigateTo('/pages-user/home/OrganizationInformation')
    },
    information() {
      this.navigateTo('/pages-user/home/information/HospitalInformation')
    },
    notice() {
      this.navigateTo('/pages-user/notice/list')
    },
    getOrgIntro() {
      orgIntro().then(data => {
        if (data) {
          data.latitude = data.latitude ? parseFloat(data.latitude) : ''
          data.longitude = data.longitude ? parseFloat(data.longitude) : ''
          this.orgIntro = data
        }
      })
    },
    //关闭温馨提示
    closeTips() {
      this.$refs.agreementPopup.close()
    },
    //温馨提示
    async getTjInsInfo() {
      this.tjNotice = await getTjIns({ type: 2 })
      if (this.tjNotice.content) {
        this.tjNotice.content = this.tjNotice.content.replace(/&nbsp;/g, '\xa0')
        //打开温馨提示 (暂时关闭弹窗不显示)
        // this.$nextTick(() => {
        //   this.$refs.agreementPopup.open()
        // })
      }
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
.state-test {
  position: fixed;
  top: 6rpx;
  right: -34rpx;
  background: red;
  padding: 0 30rpx;
  color: #fff;
  z-index: 999;
  transform: rotate(45deg);
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

.card {
  padding: 20rpx 20rpx;
  padding-top: 30rpx;
  margin: 10px 20rpx;
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
  margin: 0 20rpx 20rpx 20rpx;
  z-index: 20;
  position: relative;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 24px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20rpx;
  padding-top: 15px;
  .card-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    .card-icon {
      width: 20px;
      height: 20px;
      margin: 0 5px 0 15px;
    }
  }
  .icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 30rpx 6rpx 10rpx;
  }
  .tab_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 160rpx;
    text-align: center;
    margin-bottom: 20rpx;
    &.disabled {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: gray;
      filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    }

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
      white-space: nowrap;
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
  &:nth-child(1) {
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

.card-swiper-box {
  // margin: 0 10px;
  height: 80px;

  position: relative;
  .card-swiper-content {
    width: 100%;
    position: absolute;
    top: -10px;
    left: 0;
    z-index: 99;
  }
  .card-swiper {
    width: 100%;
    height: 90px;
    .swiper-item {
      height: 68px !important;
    }
    .swiper-perCard {
      margin: 0 2px;
      width: 100%;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      border-radius: 10px;
      background-image: url('@/assets/user/perBg.png');
      background-size: cover;
      .perBg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      > view {
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
        // position: relative;
        z-index: 3;
      }
    }
  }
}
.type-popup {
  width: 640rpx;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  .popup-title {
    font-size: 30rpx;
    text-align: center;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    padding: 41rpx;
  }
  .popup-content {
    max-height: 600rpx;
    width: auto;
    font-size: 26rpx;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    padding: 0rpx 29rpx;
    line-height: 46rpx;
  }
  .popup-confirm {
    margin-top: 30rpx;
    font-size: 30rpx;
    font-weight: 500;
    padding: 30rpx;
    color: rgba(10, 178, 193, 1);
    text-align: center;
  }
}
.btns-pop {
  background: #fff;
  margin: 0 30rpx;
  border-radius: 30rpx;
  overflow: hidden;
  .btn-title {
    display: flex;
    justify-content: center;
    margin: 20rpx 0;
    align-items: center;
    padding-top: 30rpx;
    font-size: 30rpx;
  }
  .btn-content {
    min-height: 150rpx;
    width: 640rpx;
    padding: 10rpx 30rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    .btn-mini {
      width: 580rpx;
      height: 164rpx;
      margin-bottom: 30rpx;
      overflow: hidden;
      position: relative;
      .btn-right {
        position: absolute;
        top: 54rpx;
        right: 30rpx;
        padding: 12rpx 22rpx;
        background: #0ab2c1;
        color: #fff;
        border-radius: 30rpx;
      }
    }
  }
}
</style>
