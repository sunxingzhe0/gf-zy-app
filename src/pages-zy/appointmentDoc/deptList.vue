<template>
  <view class="doctorWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view style="padding-left: 30rpx;background:#fff;margin-bottom:10px">
      <app-list-item
        label="健康卡"
        :styles="{ padding: '16rpx 30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right color666">
          <select-patient
            textStyle="color:#666;"
            @patientLoad="changePatient"
          ></select-patient>
        </view>
      </app-list-item>
    </view>
    <view class="search flex-between box-shadow">
      <input
        type="text"
        style="width: 100%; "
        placeholderClass="searchtext"
        @blur="getdept"
        v-model="keywords"
        placeholder="请输入科室进行搜索"
      />
      <uni-icons type="search" class="searchIcon" size="20"></uni-icons>
    </view>

    <view class="listWrap" v-if="isShowContent">
      <!-- 隐藏左侧 -->
      <!-- <scroll-view class="dept-left">
        <view
          v-for="item in hosList"
          :key="item.hospCode"
          class="org-item"
          :class="{ active: active === item.hospCode }"
          @click="onOrgChange(item)"
        >
          {{ item.hospName || '' }}
        </view>
      </scroll-view> -->

      <scroll-view
        :scroll-y="true"
        class="listScroll dept-right"
        style="min-height: 90.8vh; background: #fff; overflow: hidden;"
      >
        <!-- <view class="list"> -->
        <view class="listItem" v-for="(item, t) in list" :key="t">
          <view class="listpdept flex-between" @click="deptTap(item)">
            <text>{{ item.name }}</text>
            <uni-icons
              :type="item.isOpen ? 'arrowdown' : 'arrowright'"
              color="#666"
              size="14"
            ></uni-icons>
          </view>
          <view
            class="childList"
            v-if="item.children.length > 0 && item.isOpen"
          >
            <view
              v-for="(child, index) in item.children"
              :key="index"
              @click="goto(child)"
            >
              {{ child.name }}
            </view>
          </view>
        </view>
        <!-- </view> -->
      </scroll-view>
    </view>
    <hosSelect
      ref="popselect"
      title="请选择院区"
      :list="hosList"
      @selecList="changeSelect"
    />
  </view>
</template>

<script>
import {
  getDeptList,
  checkFirst,
  getHospInfo,
  appointmentGetDeptList,
} from '../api/outpatient.js'
import { findHasError, patientList } from '@/common/request/index.js'
import AppListItem from '@/components/app/app-list-item'
import hosSelect from '@/pages-zy/components/hosSelect/hosSelect'
import selectPatient from '../components/selectPatient.vue'
// import { getHospInfo } from '../api/physical.js'
import leftTab from '@/components/leftTab/index.vue'
export default {
  components: {
    selectPatient,
    AppListItem,
    leftTab,
    hosSelect,
  },
  data() {
    return {
      patientList: [],
      intoNext: true, //是否阻断挂号流程
      platOrgId: this.$store.state.userInfo.platOrgId,
      active: '',
      tabs: [],
      isShowContent: false,
      primaryColor: '#0AB2C1',
      keywords: '',
      list: [],
      cardNo: '', //就诊人卡号
      memberId: '',
      hosList: [],
      hospInfo: null,
    }
  },
  onLoad(options) {
    if (options.hospInfo) {
      this.hospInfo = options.hospInfo
      //核酸混检带入院区信息
      this.changeSelect(JSON.parse(options.hospInfo))
    } else {
      this.getHospInfo()
    }
    //提示添加就诊卡
    this.$nextTick(() => {
      this.getPatientList()
    })
  },
  mounted() {
    uni.$on('updateCard', async () => {
      this.patientList = await patientList()
    })
  },
  methods: {
    //获取就诊人列表
    async getPatientList() {
      const list = await patientList()
      this.patientList = list
      if (!list.length) {
        uni.showModal({
          title: '提示',
          content: '还未添加健康卡，是否立即前往添加？',
          success: res => {
            res.confirm &&
              uni.navigateTo({
                url: '/pages-user/patientManagement/add',
              })
          },
        })
      }
    },
    async changePatient(item) {
      this.memberId = item.memberId
      // this.perName = item.name
      this.cardNo = item.patientCard
      //核算混检不提示
      if (!this.hospInfo) {
        const res = await checkFirst({ cardNo: item.patientCard })
        if (res) {
          uni.showToast({
            title: '非核酸检测初诊患者请到医院线下挂号',
            icon: 'none',
            duration: 3000,
          })
        }
      }

      ////是否阻断挂号流程
      const intoState = await findHasError({ memberId: this.memberId })
      if (intoState) {
        this.intoNext = false
        return uni.showModal({
          title: '系统提醒',
          content:
            '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下收费处挂号。',
          showCancel: false,
        })
      } else {
        this.intoNext = true
      }
    },

    onOrgChange(item) {
      this.selectHos = item
      this.active = item.hospCode
      this.getdept()
    },
    //获取院区
    async getHospInfo() {
      /*  GH("预约挂号"),
    LYDH("来院导航"),
    LDB("流调表")  */
      uni.showLoading()
      this.hosList = (await getHospInfo()).filter(item =>
        item.hospType?.split(',')?.includes('GH'),
      )
      //  this.hosList = (await getHospInfo()).filter(item => item.ghHosp)
      uni.hideLoading()
      //院区有了
      this.$nextTick(() => {
        this.hosList.length && this.$refs.popselect.open()
      })
    },
    //获取科室列表
    async getdept() {
      uni.showLoading()
      const res = await getDeptList({
        deptName: this.keywords,
        orgId: this.platOrgId,
        hospCode: this.selectHos.hospCode,
      })
      //筛选科室列表 --混检/挂号
      this.list = this.hospInfo
        ? res.filter(v => v.id == '8323')
        : res.filter(v => v.id != '8323')
      uni.hideLoading()

      //只有核算科室时跳过此页面
      if (this.list.length && this.list[0].id == '8323') {
        this.deptTap(this.list[0])
      }
    },
    //搜索科室
    // async getshearchList() {
    //   this.list = await appointmentGetDeptList({
    //     deptName: this.keywords,
    //     orgId: this.platOrgId,
    //     resource: 2,
    //     hospCode: this.selectHos.hospCode,
    //   })
    // },
    deptTap(item) {
      if (item.children && item.children.length > 0) {
        this.$set(item, 'isOpen', !item.isOpen)
      } else {
        this.goto(item)
      }
    },
    goto(item) {
      console.log(item)
      //是否阻断挂号流程
      if (!this.intoNext) {
        return uni.showModal({
          title: '系统提醒',
          content:
            '尊敬的用户，因疫情防控需要，您的流调表有选项为“是”，请到线下收费处挂号。',
          showCancel: false,
        })
      }
      //未添加就诊卡
      if (!this.patientList.length) {
        return uni.showModal({
          title: '提示',
          content: '还未添加健康卡，是否立即前往添加？',
          success: res => {
            res.confirm &&
              uni.navigateTo({
                url: '/pages-user/patientManagement/add',
              })
          },
        })
      }
      uni.navigateTo({
        url: `/pages-zy/appointmentDoc/docList?deptId=${item.id}&orgId=${this.platOrgId}&inperId=${this.memberId}&hospId=${this.selectHos.id}&cardNo=${this.cardNo}`,
      })
    },
    //选择院区
    changeSelect(row) {
      this.selectHos = row
      this.active = row.hospCode
      this.getdept()
      this.isShowContent = true
    },
  },
}
</script>

<style lang="scss" scoped>
.doctorWrap {
  // padding-top: 20rpx;
}
.listWrap {
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin-top: 10px;
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

.dept-left {
  width: 30vw;
  .org-item {
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 16rpx 0;
    padding: 6rpx 0 6rpx 12rpx;
    border-left: 6rpx solid transparent;
    color: #333;

    &.active {
      border-left-color: $uni-color-primary;
      color: $uni-color-primary;
    }
  }
}
.dept-right {
  // width: 70vw;  //宽度限制取消
  border-left: 2rpx solid #e5e5e5;
}

// .list {
//   background: #fff;
//   margin-top: 20rpx;
//   align-items: flex-start;
//   overflow: hidden;
//   color: #333;

.listItem {
  border-bottom: 1px solid #e6e6e6;

  .listpdept {
    font-size: 30rpx;
    color: #333;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0 30rpx;
  }
}

.childList {
  background: #f2f2f2;
  padding-left: 30rpx;

  view {
    height: 90rpx;
    line-height: 90rpx;
    padding-left: 58rpx;
    border-top: 1px solid #e6e6e6;
  }
}
// }
</style>
