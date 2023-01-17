<template>
  <view class="container child_container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="main">
      <view class="erkeContatiner flex-between">
        <image :src="FILE_URL_BUILT_IN('selectDoctorBg.png')"></image>
        <view style="z-index: 1; position: relative;">
          <view class="title">{{ deptInfo.deptName }}</view>
          <view>{{ deptInfo.orgName }} · {{ deptInfo.deptName }}</view>
        </view>
        <view
          class="flex-start-center"
          style="z-index: 1;position: relative;"
          @click="isTrue = !isTrue"
        >
          <view>科室介绍</view>
          <uni-icons
            :type="isTrue ? 'arrowdown' : 'arrowright'"
            color="#fff"
            size="12"
          ></uni-icons>
        </view>
      </view>
      <!-- 儿童内科介绍 -->
      <view :class="isTrue ? 'jieshao' : 'jieshao jieshaoHide'">
        <view class="font32 jieshaoTitle">科室介绍</view>
        <view class="deptInfo">{{ deptInfo.deptIntro || '暂无科室介绍' }}</view>
      </view>
      <!-- 依据日期来选择 -->
      <view class="basisDate">
        <view class="box-shadow" style="background:#fff;padding-top: 10px;">
          <view class="search flex-between ">
            <input
              type="text"
              style="width: 100%; "
              placeholderClass="searchtext"
              @blur="getshearchList"
              v-model="keywords"
              placeholder="请输入医生进行搜索"
            />
            <uni-icons type="search" class="searchIcon" size="20"></uni-icons>
          </view>
          <OrderTime :deptId="id" @selectDay="selectDay"></OrderTime>
        </view>
        <!-- 列表区 -->
        <view class="docList">
          <block v-for="(item, index) in doctorsList" :key="index">
            <view class="docBox box-shadow">
              <view
                class="flex-start-start"
                style="padding: 30rpx;"
                @click="goTo(item)"
              >
                <view class="icon">
                  <default-img :url="FILE_URL(item.img)"></default-img>
                </view>
                <view class="flex1 infoText">
                  <view class="flex-between">
                    <view style="padding-right:20rpx" class="font-weight font32"
                      >{{ `${item.docName}`
                      }}<!-- <text style="margin-left:20rpx">{{
                        item.scheduleLists[0].itemName
                      }}</text> --></view
                    >
                    <view>
                      <text v-if="item.scheduleLists[0].noType == 3"
                        >核酸检测</text
                      >
                      <image
                        v-else
                        mode="widthFix"
                        style="width:51px;height:18px"
                        :src="
                          item.scheduleLists[0].noType == 1
                            ? require('@/pages-zy/images/putong.png')
                            : require('@/pages-zy/images/zhuanjia.png')
                        "
                      ></image
                    ></view>
                  </view>
                  <view class="font24 color666">{{ item.docTitle || '' }}</view>
                  <view class="font24 color666">{{
                    `${item.sbsj}  ${item.rangeTime}`
                  }}</view>
                  <view class="font24 color666 text-overflow" v-if="item.good"
                    >擅长：{{ item.good || '-' }}</view
                  >
                </view>
              </view>
              <view class="dateList">
                <view
                  :class="[
                    'flex-between dateLI',
                    parseInt(i.surplus) < 1 ? 'dis' : '',
                  ]"
                  v-for="(i, h) in item.scheduleLists"
                  :key="h"
                  @click.stop="goTo(item, i)"
                >
                  <view class="flex1"
                    >{{ i.reverseDate }}（{{
                      week[dayjs(i.reverseDate).format('d')]
                    }}）</view
                  >
                  <view class="flex-start-center">
                    <view v-if="parseInt(i.surplus) < 1">约满</view>
                    <view v-else>剩余 {{ parseInt(i.surplus) }}</view>
                    <uni-icons
                      type="arrowright"
                      color="#666"
                      size="12"
                    ></uni-icons>
                  </view>
                </view>
              </view>
            </view>
          </block>
          <uni-load-more
            v-if="doctorsList.length > 0"
            status="nomore"
            :contentText="{
              contentdown: '上拉显示更多',
              contentrefresh: '正在加载数据中',
              contentnomore: '没有更多数据了',
            }"
          ></uni-load-more>
          <NoData v-if="doctorsList.length == 0"></NoData>
        </view>
      </view>
    </view>
    <!--  -->
    <uni-popup ref="refTipsPopup" type="center" :maskClick="false">
      <view class="type-popup">
        <text class="popup-title">{{ '特别提醒' }}</text>
        <view class="popup-content">
          核酸混检项目仅适用于健康码“绿码”人员，“非绿码”人员请选择核酸单检进行检测。
        </view>
        <text class="popup-confirm" @click="closeTips">确定</text>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import OrderTime from '../components/OrderTime.vue'
import dayjs from 'dayjs'
import NoData from '../components/NoData'
import {
  getReverseDocInfo,
  getDeptDetail,
  checkNoPay,
} from '@/common/request/doctorAppointment'
export default {
  components: {
    OrderTime,
    NoData,
  },
  data() {
    return {
      keywords: '',
      // 是否展开

      isTrue: false,
      // 医生列表信息
      activeDate: '',
      dept: '',
      id: '',
      orgName: '',
      deptInfo: {},
      AllNumber: 0,
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      doctorsList: [],
      orgId: '',
      deptDate: [],
      inperId: '',
      hospId: '',
      selectState: uni.getStorageSync('selectState'),
    }
  },
  onLoad(option) {
    this.id = option.deptId
    this.orgId = option.orgId
    this.inperId = option.inperId
    this.hospId = option.hospId
    this.cardNo = option.cardNo
    this.getdeptInfo()
    this.getDocList()
    if (
      Number(option.deptId) === 8323 &&
      uni.getStorageSync('selectState') == 1
    ) {
      // selectState 1混检 0单检
      this.$refs.refTipsPopup.open()
    }
  },
  methods: {
    dayjs,
    // 切换日期

    selectDay(day) {
      this.activeDate = day.date
      this.getDocList()
    },
    //获取科室详情
    async getdeptInfo() {
      uni.showLoading()
      this.deptInfo = await getDeptDetail({
        deptId: this.id,
        orgId: this.orgId,
      })
      uni.hideLoading()
    },
    getshearchList() {
      this.getDocList()
    },
    //获取医生列表
    async getDocList() {
      uni.showLoading()
      let res = await getReverseDocInfo({
        orgId: this.orgId,
        deptId: this.id,
        beginDate: this.activeDate
          ? this.activeDate
          : dayjs().format('YYYY-MM-DD'),
        endDate: this.activeDate
          ? this.activeDate
          : dayjs().format('YYYY-MM-DD'),
        resource: 2,
        doctorName: this.keywords,
      })
      res.sort((a, b) => {
        return (
          new Date(`1970/01/01 ${a.rangeTime.split('-')[0]}`) -
          new Date(`1970/01/01 ${b.rangeTime.split('-')[0]}`)
        )
        // return Number(a.scheduleNo) - Number(b.scheduleNo)
      })
      console.log(res, '排序结果-----------')
      // 计算余号
      this.doctorsList = res.map(item => ({
        ...item,
        surplus: item.scheduleLists[0]?.surplus,
      }))
      //核酸挂号 单检或混检
      if (this.id == '8323') {
        this.doctorsList = this.doctorsList.filter(v =>
          this.selectState == 1 ? v.asRowId == 423 : v.asRowId == 455,
        )
      }
      uni.hideLoading()
    },
    async goTo(item, i) {
      //查询是否有未支付的订单
      const res = await checkNoPay({ cardNo: this.cardNo })
      if (res === true) {
        return uni.showModal({
          title: '系统提示',
          content: '您还有未支付的订单，请前往支付。',
          confirmColor: '#0AB2C1',
          showCancel: false,
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({
                url: '/pages-zy/myAppointment/list',
              })
            }
          },
        })
      }

      if (item.surplus < 1) {
        uni.showToast({
          uration: 2000,
          icon: 'none',
          title: '当前医生号源已满，请选择其他医生',
        })
        return false
      }
      console.log(item, i)

      //正常流程
      // uni.navigateTo({
      //   url: `/pages-zy/appointmentDoc/appointmentInfo?docId=${
      //     item.docId
      //   }&scheduleNo=${item.scheduleNo}&date=${
      //     i ? i.reverseDate : this.activeDate
      //   }&deptId=${this.id}&orgId=${this.orgId}&item=${JSON.stringify(
      //     item,
      //   )}&inperId=${this.inperId}`,
      // })

      //加入流调表流程
      const infoParams = {
        docId: item.docId,
        scheduleNo: item.scheduleNo,
        date: i ? i.reverseDate : this.activeDate,
        deptId: this.id,
        orgId: this.orgId,
        item: JSON.stringify(item),
        inperId: this.inperId,
        hospId: this.hospId,
      }
      console.log(infoParams.inperId, 'id---------------')
      uni.navigateTo({
        url: `/pages-user/nucleicAcidAppointment/flowform/index?infoParams=${JSON.stringify(
          infoParams,
        )}&isform=3`,
      })
    },
    closeTips() {
      this.$refs.refTipsPopup.close()
    },
  },
}
</script>
<style scoped lang="scss">
@import '~@/common/order.scss';

.erkeContatiner {
  padding: 40rpx 30rpx;
  color: #fff;
  position: relative;

  image {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 0;
  }

  .title {
    font-size: 34rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
}

.jieshao {
  max-height: 800rpx;
  overflow: hidden;
  background-color: #fff;
  transition: max-height 0.9s;

  .jieshaoTitle {
    padding: 30rpx;
    padding-bottom: 0;
  }

  .deptInfo {
    padding: 30rpx;
    padding-top: 20rpx;
    font-size: 28rpx;
    color: #646464;
    line-height: 50rpx;
  }
}

.showMore {
  padding: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #646464;
  font-size: 24rpx;
  background: #fff;
  font-weight: 600;
}

.jieshaoHide {
  max-height: 0;
  transition: max-height 0.5s;
}

.date {
  height: 168rpx;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .dateWeek {
    height: 68rpx;
    display: flex;
    border-bottom: 3rpx solid #f0f0f0;

    li {
      width: 12.5%;
      text-align: center;
      line-height: 68rpx;
      font-size: 28rpx;
      color: #646464;
    }
  }

  .isDate {
    height: 100rpx;
    display: flex;

    li {
      width: 12.5%;
      display: flex;
      justify-content: center;
      align-items: center;

      .activeNone {
        background: #fff;
        color: #333333;
      }

      .isActive {
        height: 68rpx;
        width: 68rpx;
        padding: 7rpx 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 50%;
        background: #0ab2c1;
        color: #fff;

        :nth-child(1) {
          font-size: 24rpx;
        }

        :nth-child(2) {
          font-size: 18rpx;
        }
      }
    }
  }
}

.docList {
  padding: 20rpx;
}

.docBox {
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 10rpx;

  .icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 30rpx;

    img {
      width: 100%;
    }
  }

  .infoText {
    width: 520rpx;
    font-size: 28rpx;
    color: #373737;
    line-height: 50rpx;

    span {
      color: #333;
      font-size: 32rpx;
      margin-right: 34rpx;
    }
  }
}

.dateList {
  font-size: 28rpx;
  color: #373737;
  padding-left: 30rpx;
  border-top: 1px solid #e6e6e6;

  .dateLI {
    height: 88rpx;
    padding-right: 30rpx;
    border-bottom: 1px solid #e6e6e6;
  }

  .dis {
    color: #999;
  }
}
.search {
  background: #f2f2f2;
  margin: 10px 0;
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
.type-popup {
  width: 640rpx;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  .popup-title {
    font-size: 32rpx;
    text-align: center;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    padding: 41rpx;
  }
  .popup-content {
    max-height: 600rpx;
    width: auto;
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    padding: 0rpx 29rpx;
    line-height: 46rpx;
    text-align: center;
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
</style>
