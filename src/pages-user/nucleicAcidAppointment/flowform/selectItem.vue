<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />

    <!-- <app-card styles="padding:20rpx 0"> -->
    <view class="box-shadow contentBox" style="background:#fff">
      <view
        :class="
          d.alldate == info.date ? 'dateItem active font30' : 'dateItem font30'
        "
        v-for="(d, t) in dateList"
        :key="t"
        @click="dateTap(d)"
      >
        <text style="line-height: 22px;">{{ d.week }}</text>
        <text style="line-height: 22px;">{{ d.date }}</text>
      </view>
    </view>
    <!-- </app-card> -->

    <!-- 列表区 -->
    <view class="docList" style="padding:20rpx">
      <block v-for="(item, index) in doctorsList" :key="index">
        <view class="docBox box-shadow">
          <view
            class="flex-start-start"
            style="padding: 30rpx;"
            @click="goToInfo(item)"
          >
            <view class="icon">
              <default-img :url="FILE_URL(item.img)"></default-img>
            </view>
            <view class="flex1 infoText">
              <view class="flex-between">
                <view class="font-weight font30">{{ item.docName }}</view>
                <view class="font30">
                  {{ item.numberCode || '' }}
                </view>
              </view>
              <view class="font24 color666">{{ item.docTitle || '' }}</view>
              <view class="font24 color666">{{
                item.shiftName + ' ' + item.rangeTime
              }}</view>
              <view class="font24 color666 text-overflow" v-if="item.good"
                >擅长：{{ item.good || '-' }}</view
              >
            </view>
          </view>
          <view
            class="dateList flex-between "
            style="padding: 0 30rpx 30rpx 30rpx;"
          >
            <view class="flex1 font30"
              >{{ info.date }}（{{ week[dayjs(info.date).format('d')] }}）</view
            >
            <view class="flex-start-center ">
              <view class="font30">{{
                item.surplus ? `剩余 ${item.surplus}` : '约满'
              }}</view>
              <view style="color:red;margin:0 10px" class="font30">{{
                item.price ? `¥${item.price}` : ''
              }}</view>
              <uni-icons type="arrowright" color="#666" size="12"></uni-icons>
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
</template>

<script>
import appCard from '@/components/app/app-card'
import dayjs from 'dayjs'
import { getNucleateDept, getPriceAndTime } from '../api/index'
import NoData from '@/pages-user/components/NoData'
export default {
  components: {
    appCard,
    NoData,
  },
  data() {
    return {
      deptId: '',
      doctorsList: [],
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dateList: [],
      info: {
        date: '',
      },
    }
  },

  async onLoad(option) {
    this.getdate()
    this.$set(this.info, 'date', dayjs().format('YYYY-MM-DD'))
    await this.getNucleateDept()
    this.getPriceAndTime(dayjs().format('YYYY-MM-DD'))
  },
  methods: {
    dayjs,
    //获取日期列表
    getdate() {
      let data = []
      for (let i = 0; i < 10; i++) {
        let fulldate = dayjs().add(i, 'day')
        data.push({
          date: fulldate.format('MM-DD'),
          alldate: fulldate.format('YYYY-MM-DD'),
          week:
            fulldate.format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')
              ? '当天'
              : fulldate.format('YYYY-MM-DD') ==
                dayjs()
                  .add(1, 'day')
                  .format('YYYY-MM-DD')
              ? '明天'
              : this.week[fulldate.day()],
        })
      }
      this.dateList = data
    },
    //获取科室
    async getNucleateDept() {
      const res = await getNucleateDept()
      console.log(res, '科室--------------')
      this.deptId = res.deptCode
    },
    //获取当日排班
    async getPriceAndTime(time) {
      uni.showLoading()
      this.selectTime = time
      const res = await getPriceAndTime({
        regDate: time,
        deptId: this.deptId || '',
      })
      // this.doctorsList = res.reverse()
      this.doctorsList = res.sort((a, b) => {
        return (
          new Date(`1970-01-01 ${a.rangeTime.split('-')[0]}`) -
          new Date(`1970-01-01 ${b.rangeTime.split('-')[0]}`)
        )
      })
      uni.hideLoading()
    },
    //选择日期
    dateTap(item) {
      this.info.date = item.alldate
      this.getPriceAndTime(item.alldate)
    },
    //查看详情
    goToInfo(item) {
      if (!item.surplus) {
        return uni.showToast({
          title: '号源已约满',
          icon: 'none',
        })
      }
      const params = JSON.parse(JSON.stringify(item))

      //随机号源
      // const radomIndex =
      //   Math.floor(Math.random() * item.docFsInfoList.length) || 0
      // const randomNo = item.docFsInfoList[radomIndex]
      // params.randomNo = randomNo
      params.date = this.info.date
      params.regDate = this.selectTime
      params.deptId = this.deptId
      // delete params.docFsInfoList
      uni.navigateTo({
        url: `/pages-user/nucleicAcidAppointment/flowform/detailpage?itemInfo=${JSON.stringify(
          params,
        )}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/common/order.scss';
.contentBox {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 20rpx 10rpx;
  border-radius: 0 0 20rpx 20rpx !important;
  .dateItem {
    width: 114rpx;
    height: 114rpx;
    margin: 15rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f2f2f2;
    justify-content: center;
    border-radius: 10rpx;
    &.active {
      color: $uni-color-primary;
      background: rgba(10, 178, 193, 0.1);
    }
  }
}
.docList {
  // padding: 20rpx;
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
.font30 {
  font-size: 30rpx;
}
</style>
