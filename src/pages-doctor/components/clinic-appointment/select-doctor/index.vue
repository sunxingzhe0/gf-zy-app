<template>
  <view class="selct-doctor">
    <app-card styles="padding: 0">
      <view
        class="department-info"
        :style="{
          backgroundImage: `url(${FILE_URL_BUILT_IN('selectDoctorBg.png')})`,
        }"
      >
        <view class="info-left">
          <view class="department-name">
            <view class="department-name-text">{{ deptInfo.deptName }}</view>
            <view class="department-toogle" @click="changeDept">更换</view>
          </view>
          <view class="deparament-fullname" v-if="deptInfo.orgName">
            {{ deptInfo.orgName }} · {{ deptInfo.deptName }}
          </view>
        </view>
        <view class="info-right" @click.stop="introExpand = !introExpand"
          >科室介绍
          <image
            :class="['expand-icon', !introExpand ? 'down' : '']"
            :src="require('@/assets/icon61.png')"
          ></image>
        </view>
      </view>
      <view v-show="introExpand">
        <view class="department-desc">
          <view class="department-title">科室介绍</view>
          <view class="department-desc-text">
            {{ deptInfo.deptIntro || '' }}
          </view>
        </view>
      </view>
      <day-of-week
        showAll
        :value="activeDate"
        @change="onDateChange"
      ></day-of-week>
    </app-card>
    <template v-if="doctors && doctors.length">
      <app-card
        v-for="(item, index) in doctors"
        :key="item.docId"
        styles="padding: 0; margin: 20rpx;"
      >
        <template v-if="showDoctor(item.scheduleLists)">
          <view class="doctor-info">
            <view class="doctor-avtar">
              <default-img :url="FILE_URL(item.img)"></default-img>
            </view>
            <view class="doctor-infos">
              <view class="doctor-name">{{ item.docName }}</view>
              <view class="doctor-title">{{ item.docTitle || '' }}</view>
              <view class="doctor-goodat text-overflow">
                擅长：{{ item.good || '' }}
              </view>
            </view>
          </view>
          <template v-for="(work, idx) in item.scheduleLists">
            <view
              class="list-item"
              :key="idx"
              v-if="!activeDate || work.reverseDate == activeDate"
              @click="select([index, idx],item)"
            >
              <view style="display:flex;justify-content: space-between;">
                <view class="item-date">
                  {{ work.reverseDate }} ({{ formatDay(work.reverseDate) }})
                </view>

                <view class="remaining-numbers">
                  <view class="remain-text">{{
                    work.surplus > 0 ? `剩余${work.surplus}` : '约满'
                  }}</view>
                  <view class="iconfont icon-jiantou"></view>
                </view>
              </view>
              <view :key="idx"
                >{{ item.sbsj || '' }} {{ `  ${item.rangeTime || ''}` }}</view
              >
            </view>
          </template>
        </template>
      </app-card>
    </template>
    <empty-doctor v-else></empty-doctor>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card/index'
import EmptyDoctor from '@/components/app/empty-doctor/index.vue'
import DayOfWeek from '@/components/app/day-of-week/index'
import {
  getReverseDocInfo,
  getDeptDetail,
  getSyncCode,
} from '@/common/request/doctorAppointment'
export default {
  props: {
    order: {
      type: Object,
      default: {},
    },
    department: {
      type: Object,
      default: {},
    },
  },
  components: {
    AppCard,
    EmptyDoctor,
    DayOfWeek,
  },
  data() {
    return {
      activeDate: this.FORMATDATE(new Date(), 'yyyy-MM-dd'),
      org: {},
      info: [],
      deptInfo: {},
      introExpand: false,
    }
  },
  computed: {
    doctors() {
      const doctorId = this.department?.doctorId

      if (doctorId) {
        // 如果切换的科室是通过医生名字搜索的科室，将这个医生置顶
        const doctorIds = doctorId.split(',')
        return this.info.sort((a, b) => {
          const indexA = doctorIds.indexOf(a.docId)
          const indexB = doctorIds.indexOf(b.docId)

          if (indexA === indexB) {
            return 0
          } else if (indexA < 0 || indexB < 0) {
            return indexA < 0 ? 1 : -1
          }
          return indexA - indexB
        })
      }
      return this.info
    },
    orgId() {
      return this.department?.orgCode || this.org.orgCode
    },
    orgName() {
      return this.department?.orgName || this.org.orgName
    },
    deptId() {
      return this.department?.id || this.org.deptCode
    },
  },
  async created() {
    await this.getOrgCode()
    this.getDept()
    this.getInfo()
  },
  methods: {
    async getOrgCode() {
      if (this.department?.orgCode) return
      this.org = await getSyncCode({
        orgId: uni.getStorageSync('orgId'),
        deptId: this.order.deptId,
        doctorId: this.order.doctorId,
      })
      if (!this.org.orgCode) this.$tip('该医生或科室不具备挂号资格')
    },
    async getInfo() {
      if (!this.orgId || !this.deptId) return

      const params = {
        deptId: this.deptId,
        orgId: this.orgId,
        beginDate: this.FORMATDATE(new Date(), 'yyyy-MM-dd'),
        endDate: this.FORMATDATE(new Date(), 'yyyy-MM-dd'),
        resource: 2,
      }
      //  const params = {
      //   deptId: this.deptId,
      //   orgId: this.orgId,
      //   beginDate: this.FORMATDATE(new Date(), 'yyyy-MM-dd'),
      //   // 结束时间：当前时间往后推7天
      //   endDate: this.FORMATDATE(
      //     +new Date() + 6 * 24 * 60 * 60 * 1000,
      //     'yyyy-MM-dd',
      //   ),
      //   resource: 2,
      // }
      this.info = await getReverseDocInfo(params)
    },
    async getDept() {
      if (!this.orgId || !this.deptId) return

      this.deptInfo = await getDeptDetail({
        deptId: this.deptId,
        orgId: this.orgId,
      })
    },
    formatDay(date) {
      const week = [
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ]
      return week[new Date(date).getDay()]
    },
    async onDateChange(options) {
      console.log(options)

      if (options == 'all') {
        this.activeDate = null
      } else {
        this.activeDate = options.fullDate
      }

      const params = {
        deptId: this.deptId,
        orgId: this.orgId,
        beginDate:
          options == 'all'
            ? this.FORMATDATE(new Date(), 'yyyy-MM-dd')
            : options.fullDate,
        endDate:
          options == 'all'
            ? this.FORMATDATE(
                +new Date() + 6 * 24 * 60 * 60 * 1000,
                'yyyy-MM-dd',
              )
            : options.fullDate,
        resource: 2,
      }
      uni.showLoading()
      this.info = await getReverseDocInfo(params)
      uni.hideLoading()
    },
    showDoctor(scheduleLists) {
      return this.activeDate
        ? scheduleLists.filter(item => item.reverseDate == this.activeDate)
            .length > 0
        : scheduleLists
    },
    changeDept() {
      uni.navigateTo({
        url: `/pages-doctor/appointment/selectDept?orderId=${this.order.orderId}`,
      })
    },
    select(index,item) {
      const department = Object.assign(this.department, {
        docTitle: this.doctors[index[0]].docTitle,
        sbsj: this.doctors[index[0]].sbsj,
        surplus: this.doctors[index[0]].scheduleLists[0].surplus,
      })
      uni.navigateTo({
        url: `/pages-doctor/appointment/add?department=${JSON.stringify(
          department,
        )}&orderId=${this.order.orderId}&doctorIndexArr=${index}&docInfo=${JSON.stringify(item)}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.expand-icon {
  margin-left: 8rpx;
  width: 32rpx;
  height: 24rpx;

  &.down {
    transform: rotate(180deg);
  }
}
.department-info {
  display: flex;
  height: 168rpx;
  flex-direction: row;
  justify-content: space-between;
  background-size: contain;

  .info-left {
    z-index: 1;
    display: flex;
    flex-direction: column;
    padding: 40rpx 0 40rpx 30rpx;
    justify-content: space-between;
  }

  .department-name {
    display: flex;
    flex-direction: row;
  }

  .department-name-text {
    height: 31rpx;
    font-size: 32rpx;
    color: #ffffff;
    font-weight: bold;
    line-height: 32rpx;
    font-family: PingFang SC;
  }

  .department-toogle {
    width: 78rpx;
    height: 36rpx;
    color: #ffffff;
    font-size: 20rpx;
    font-weight: 500;
    text-align: center;
    line-height: 34rpx;
    margin-left: 30rpx;
    border-radius: 18rpx;
    background: #09b1c1;
    font-family: PingFang SC;
    border: 1rpx solid #ffffff;
  }

  .deparament-fullname {
    height: 25rpx;
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 25rpx;
    font-family: PingFang SC;
  }

  .info-right {
    z-index: 1;
    display: flex;
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 500;
    align-items: center;
    flex-direction: row;
    padding-right: 30rpx;
    font-family: PingFang SC;
  }
}

.department-desc {
  display: flex;
  padding: 30rpx;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 1rpx solid #e5e5e5;

  .department-title {
    height: 28rpx;
    color: #333333;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 28rpx;
    margin-bottom: 30rpx;
    font-family: PingFang SC;
  }

  .department-desc-text {
    color: #999999;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 36rpx;
    text-align: justify;
    font-family: PingFang SC;
  }
}

.doctor-info {
  display: flex;
  flex-direction: row;
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .doctor-avtar {
    width: 76rpx;
    height: 76rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    overflow: hidden;
  }

  .avtar-img {
    width: 76rpx;
    height: 76rpx;
  }

  .doctor-infos {
    // flex: 1;
    // display: flex;
    // flex-direction: column;
    width: 550rpx;
  }

  .doctor-name {
    height: 31rpx;
    color: #333333;
    font-size: 32rpx;
    font-weight: bold;
    line-height: 31rpx;
    font-family: PingFang SC;
  }

  .doctor-title {
    height: 23rpx;
    margin: 20rpx 0;
    color: #656565;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 23rpx;
    font-family: PingFang SC;
  }

  .doctor-goodat {
    color: #656565;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 32rpx;
    font-family: PingFang SC;
  }
}

.list-item {
  min-height: 90rpx;
  // display: flex;
  margin-left: 30rpx;
  // justify-content: space-between;
  border-bottom: 1rpx solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }

  .item-date {
    color: #333333;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 60rpx;
    font-family: PingFang SC;
  }

  .remaining-numbers {
    display: flex;
    align-items: center;
    padding-right: 30rpx;
  }

  .remain-text {
    color: #333333;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 60rpx;
    font-family: PingFang SC;
  }

  .icon-jiantou {
    display: flex;
    color: #656565;
    align-items: center;

    &::before {
      display: block;
      transform: rotate(-90deg);
    }
  }

  &.disabled {
    .item-date,
    .remain-text,
    .icon-jiantou {
      color: #999999;
    }
  }
}
</style>
