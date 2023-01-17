<template>
  <view class="patient-leave-page">
    <view class="headerTop">
      <view class="item flex-between" @click="timeSelect">
        <view class="time-box"
          >{{ rangeData[0] || '开始时间' }} ~ {{ rangeData[1] || '结束时间' }}
          <image
            v-if="rangeData[1]"
            @click.stop="clearTime"
            class="pop-close"
            :src="require('@/assets/close-popup.png')"
            style="width: 30rpx; height: 30rpx"
          ></image>
          <text
            class="iconfont icon-xiala"
            style="font-size: 20rpx;color:#666666;margin-left:30rpx"
          ></text>
        </view>
        <text class="iconfont icon-xiangyou" style="font-size: 26rpx"></text>
      </view>
      <image
        @click="sortList"
        class="sort"
        src="@/pages-zxs/static/pd_sort.png"
      ></image>
    </view>
    <checkbox-group @change="checkChange">
      <label class="check">
        <checkbox
          value="1"
          :checked="checkde"
          color="#0ab2c1"
          style="transform: scale(0.7)"
        />仅看待审核的
      </label>
    </checkbox-group>
    <view class="patient-leave">
      <view v-for="item in listData" class="leave-item app-card" :key="item.id">
        <view class="top flex-between">
          <view>
            <text class="name">{{ item.patientName || '-' }}</text>
            <text>{{
              `${
                item.gender == 1 ? '男' : item.gender == 2 ? '女' : '-'
              } ${item.age || '-'}｜${item.cardNo || '-'}`
            }}</text>
          </view>
          <view
            :class="'state ' + (item.status === 2 ? 'noFinish' : 'finish')"
            >{{ showState(item.status) }}</view
          >
        </view>
        <view class="center flex-between">
          <view>
            <text style="font-size: 30rpx;">{{ item.itemName || '-' }}</text>
            <text v-if="item.sex && item.sex != 9" class="state-tag">{{
              item.sex == 9
                ? ''
                : item.sex == 1
                ? '男'
                : item.sex == 2
                ? '女'
                : ''
            }}</text>
            <text
              v-if="item.ageGroup && item.ageGroup != '1,2,3'"
              class="state-tag"
            >
              {{ ageGroupText(item.ageGroup) }}</text
            >
            <image
              class="plan_aloneAdd"
              v-if="item.video"
              :src="require('../static/video.png')"
            />
          </view>
          <text class="fee">¥ {{ item.price || '-' }}</text>
        </view>
        <view class="bottom flex-between">
          <view>{{
            `${item.scheduleDate.slice(0, 10)} ${item.scheduleTime}`
          }}</view>
          <view>{{
            `${item.doctor || '-'} ${item.title || '-'} ${item.dept || '-'}`
          }}</view>
        </view>
        <view class="slider">
          <view class="border"></view>
        </view>
        <view class="content-item reason">
          <view class="label">停诊理由:</view>
          <view class="value">{{ item.applyRemark || '-' }}</view>
        </view>
        <ContentItem label="申请时间" :value="item.applyTime || '-'" />
        <!-- 撤回-->
        <view class="footer-btn" v-if="item.status == 2 && !passTime(item)">
          <view class="agree" @click="withdraw(item)">撤回</view>
        </view>
        <!--  -->
        <view v-if="item.status != 2">
          <ContentItem
            label="审批结果"
            :value="item.auditResult ? '已同意' : '已拒绝'"
          />
          <view class="info-item">
            <ContentItem
              label="是否退费"
              :value="item.whetherRefund ? '是' : '否'"
              class="width50"
            />
            <ContentItem
              label="顺延时间"
              :value="
                item.postponeScheduleDate + item.postponeScheduleTime || '-'
              "
              class="width50"
            />
            <!-- <ContentItem
              label="申请时间"
              :value="item.applyTime"
              class="width50"
            /> -->
            <ContentItem
              label="审核时间"
              :value="item.auditTime || '-'"
              class="width50"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="submit_btn" @click="closeApply">停诊申请</view>
    <!-- <uni-load-more :status="more"></uni-load-more> -->
    <pop-select-date
      ref="timePop"
      :date="rangeData"
      @confirm="dateChange"
    ></pop-select-date>
  </view>
</template>
<script>
// import dayjs from "dayjs";
import PopSelectDate from '@/pages-zxs/components/pop-select-date/index'
import PopupDialog from '@/pages-zxs/components/popup-dialog/index'
import ContentItem from '@/pages-zxs/components/ContentItem/index'
import { stopPageList, stopWithdraw } from '@/pages-zxs/api/closeApply'
import dayjs from 'dayjs'
export default {
  components: {
    PopSelectDate,
    PopupDialog,
    ContentItem,
  },
  data() {
    return {
      rangeData: [],
      isOpen: false,
      formType: true,
      // more: "loading",
      formData: null,
      listData: [],
      state: true,
      field: 'applyTime',
      sorted: '',
      param: {},
      currentNum: 1,
      pageSize: 99,
    }
  },
  onLoad(options) {
    if (options.type) {
      console.log(options.type)
    }
    this.getstopPageList()
  },
  onShow() {
    this.getstopPageList()
  },

  methods: {
    passTime(row) {
      return (
        //预约结束时间小于当前时间
        dayjs(
          row.scheduleDate +
            ' ' +
            (row.scheduleTime ? row.scheduleTime.split('-')[1] : '235959'),
        ) < dayjs()
      )
    },
    ageGroupText(ageGroup) {
      if (ageGroup.split(',').length === 3) return ''
      const types = {
        1: '儿童',
        2: '青少年',
        3: '成人',
      }
      return ageGroup
        .split(',')
        .map(v => types[v])
        .join('、')
    },
    clearTime() {
      this.rangeData = []
      this.param.beginTime = ''
      this.param.endTime = ''
      this.getstopPageList()
    },
    //停诊申请
    closeApply() {
      uni.navigateTo({
        url: '/pages-zxs/suspension-apply/edit',
      })
    },
    //撤回
    withdraw(item) {
      uni.showModal({
        title: '提示',
        content: '是否确认撤回？',
        success: async confirm => {
          if (confirm.confirm) {
            console.log('撤回！')
            await stopWithdraw({ stopId: item.id })
            uni.showToast({
              title: '撤回成功!',
              icon: 'none',
            })
            this.getstopPageList()
          }
        },
      })
    },
    async getstopPageList(type) {
      // this.listData = await leaveList({doctor:uni.getStorageSync('userId')}).list

      const params =
        typeof type == 'boolean'
          ? {
              doctor: '',
              status: type ? 2 : '',
              sorted: this.sorted,
              field: this.field,
              currentNum: this.currentNum,
              pageSize: this.pageSize,
              doctorId: this.$store.state.userInfo.userId,
              startTime: this.param.beginTime
                ? dayjs(this.param.beginTime).format('YYYYMMDD') + '000000'
                : '',
              endTime: this.param.endTime
                ? dayjs(this.param.endTime).format('YYYYMMDD') + '235959'
                : '',
            }
          : {
              doctor: '',
              sorted: this.sorted,
              field: this.field,
              currentNum: this.currentNum,
              pageSize: this.pageSize,
              doctorId: this.$store.state.userInfo.userId,
              startTime: this.param.beginTime
                ? dayjs(this.param.beginTime).format('YYYYMMDD') + '000000'
                : '',
              endTime: this.param.endTime
                ? dayjs(this.param.endTime).format('YYYYMMDD') + '235959'
                : '',
            }
      uni.showLoading()
      this.listData = (await stopPageList(params)).list
      uni.hideLoading()
      console.log(this.listData, '数据列表')
    },
    //仅看待审核的
    checkChange(e) {
      if (e.detail.value.length > 0) {
        this.getstopPageList(true)
      } else {
        this.getstopPageList(false)
      }
    },
    //排序
    sortList() {
      console.log('排序')
      this.state = !this.state
      this.sorted = this.state ? 'desc' : 'asc'
      this.getstopPageList()
    },
    // 打开编辑弹窗
    openEditDialog(item, type) {
      this.formType = type
      this.formData = item
      this.$refs.editDialog.open()
    },
    // 提交
    confrimForm() {
      this.$refs.editForm.submit()
    },
    // 关闭编辑弹窗
    async closeEditDialog(data) {
      this.$refs.editDialog.close()
      //同意拒绝
      const params = {
        approvalResult: data.refundWay ? 1 : 2, //1同意2拒绝,
        refundRel: data.refundWay == 1 ? 2 : 1, //是否退款(1.是 2.否)
        id: this.formData.id,
        ...data,
      }
      console.log(params, '参数---')
      try {
        uni.showLoading()
        await agreeOrRefuse(params)
        uni.hideLoading()
        uni.showToast({
          title: '操作成功！',
        })
        this.getstopPageList()
      } catch (error) {
        uni.hideLoading()
      }
    },
    // 时间选择
    timeSelect() {
      console.log(this.$refs.timePop)
      this.$refs.timePop.open()
    },
    // 显示状态
    showState(type) {
      // 状态 1:正常/2:停诊申请中/3：同意/4:驳回/0:已关闭
      const types = ['已关闭', '正常', '待审核', '已同意', '已驳回']
      return types[type]
    },
    // 仅看选中的
    checkLeave(e) {
      if (!e) return
      if (e.detail.value.length <= 0) return
      console.log(e.detail.value)
    },
    dateChange(e) {
      this.rangeData = e
      console.log(this.rangeData, '时间--')
      this.param.beginTime = this.rangeData[0]
      this.param.endTime = this.rangeData[1]
      this.getstopPageList()
    },
  },
}
</script>
<style lang="scss" scoped>
.headerTop {
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  display: flex;
  align-items: center;
  padding-right: 20rpx;
  justify-content: space-between;
  margin-bottom: 30rpx;
  .sort {
    width: 28rpx;
    height: 30rpx;
    margin: 0 30rpx;
  }
  .item {
    flex: 1;
    padding: 20rpx 0rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    margin: 0rpx 20rpx;
    -webkit-flex: none;
  }
  .check {
    font-size: 24rpx;
    margin-left: 30rpx;
    margin-top: 30rpx;
  }
}
.title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  padding: 20rpx 0rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333;
  .item {
    flex: 1;
    margin: 0rpx 20rpx;
  }
  .sort {
    width: 30rpx;
    height: 30rpx;
    margin-right: 30rpx;
  }
  .check {
    width: 220rpx;
  }
}
.patient-leave {
  padding: 0rpx 20rpx 140rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 400;
}
.leave-item {
  margin-top: 20rpx;
  padding: 20rpx 20rpx 0;
  box-sizing: border-box;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  .top {
    font-size: 24rpx;
    margin-bottom: 10rpx;
    color: #666;
    .name {
      font-size: 30rpx;
      color: #333;
      margin-right: 10rpx;
    }
    .state {
      padding: 2rpx 10rpx;
      box-sizing: border-box;
      font-size: 24rpx;
      border-radius: 5rpx;
    }
    .finish {
      background: #e7e7e7;
      color: #888;
    }
    .noFinish {
      background: #d9f2f5;
      color: #0ab2c1;
    }
  }
  .center {
    margin-bottom: 10rpx;
    .fee {
      color: #0ab2c1;
      font-size: 30rpx;
    }
  }
  .bottom {
    font-size: 24rpx;
    color: #666;
  }
  .open-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 30rpx;
    margin-bottom: 6rpx;
    .icon {
      width: 24rpx;
      height: 24rpx;
      transition: all 0.5s;
    }
    .open {
      transform: rotate(180deg);
    }
  }
  .reason {
    padding-top: 10rpx;
    box-sizing: border-box;
    color: #333;
  }
  .footer-btn {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    font-size: 24rpx;
    margin-bottom: 20rpx;
    .refuse,
    .agree {
      width: 136rpx;
      height: 60rpx;
      margin-left: 20rpx;
      box-sizing: border-box;
      border-radius: 30rpx;
      line-height: 60rpx;
      border: 2rpx solid;
    }
    .refuse {
      color: #333;
      border-color: #ccc;
    }
    .agree {
      color: #13b9c8;
      border-color: #13b9c8;
    }
  }
  .info-item {
    /* display: flex;
    flex-flow: wrap;
    justify-content: space-between; */
  }
}
.width50 {
  width: 50%;
}
.slider {
  display: flex;
  align-items: center;
  padding: 10rpx;
  box-sizing: border-box;
  .border {
    position: relative;
    width: 100%;
    height: 2rpx;
    background: #eee;
    &::before,
    &::after {
      width: 30rpx;
      height: 30rpx;
      border-radius: 50%;
      background: #eee;
    }
    &::before {
      content: '';
      position: absolute;
      top: -14rpx;
      left: -42rpx;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -14rpx;
      right: -42rpx;
    }
  }
}
.content-item {
  display: flex;
  color: #666;
  font-size: 20rpx;
  margin-bottom: 10rpx;
  flex-shrink: 0;
  .label {
    min-width: 110rpx;
    flex-shrink: 0;
  }
  .value {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
radio-group label,
checkbox-group label {
  margin-left: 20rpx;
}
.time-box {
  display: flex;
  align-items: center;
  .pop-close {
    margin-left: 8rpx;
  }
}
.state-tag {
  background-color: rgba(10, 178, 193, 0.1);
  padding: 3rpx 5rpx;
  color: #0ab2c1;
  margin-left: 20rpx;
}
.plan_aloneAdd {
  width: 32rpx;
  height: 32rpx;
  margin-left: 20rpx;
}
</style>
