<template>
  <view style="padding:20rpx;padding-bottom: 116rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view
      class="box-shadow listWrap"
      v-for="(item, index) in list"
      :key="index"
    >
      <view class="flex-between list">
        <view class="flex_1">
          <view class="name">{{ item.name }}</view>
          <view class="info">就诊卡：{{ item.patientCard || '' }}</view>
          <view class="info">电话号码：{{ item.phone }}</view>
          <view class="mt10">
            <view class="flex-start-center"
              ><evan-checkbox
                v-model="item.def"
                shape="square"
                :primary-color="primaryColor"
                :disabled="item.def"
                @change="defauChange($event, item)"
              ></evan-checkbox
              ><text class="checkText">默认就诊人</text></view
            >
          </view>
        </view>
        <uni-icons
          @click="gotoInfo(item.memberId)"
          type="arrowright"
          class="rightIcon"
          size="20"
        ></uni-icons>
      </view>
    </view>
    <button class="submit_btn" type="primary" @click="add">+ 添加就诊人</button>
  </view>
</template>

<script>
import { patientList, editPatientInfo } from '@/common/request/userCenter'
import util from '@/common/util'
export default {
  data() {
    return {
      primaryColor: '#0AB2C1',
      list: [],
      def: true,
    }
  },
  onShow() {
    this.getpatientList()
  },
  methods: {
    async getpatientList() {
      let data = await patientList()
      data.forEach(i => {
        i.phone = util.noPassByMobile(i.phone)
      })
      this.list = data
    },

    async defauChange(e, item) {
      let form = {
        allergies: null,
        pastHistory: null,
        def: true,
        memberId: item.memberId,
      }
      let res = await editPatientInfo(form)
      if (res) {
        uni.showToast({
          title: '设置成功',
        })
      }
      this.getpatientList()
    },
    gotoInfo(id) {
      uni.navigateTo({
        url: '/pages-user/patientManagement/detail?id=' + id,
      })
    },
    add() {
      uni.navigateTo({
        url: '/pages-user/patientManagement/add',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.listWrap {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
  &:nth-child(1) {
    margin-top: 0;
  }
}
.list {
  padding: 10rpx;
  padding-right: 0;
  .rightIcon {
    color: #666 !important;
  }
  .name {
    color: #1a1a1a;
    font-size: 34rpx;
    font-weight: bold;
  }
  .info {
    font-size: 28rpx;
    color: #666;
  }
  /deep/.evan-checkbox__label {
    font-size: 28rpx;
  }
  /deep/.evan-checkbox__inner {
    width: 16px !important;
    height: 16px !important;
  }
  .checkText {
    font-size: 26rpx;
    color: #666;
    margin-left: 10rpx;
  }
  .mt10 {
    margin-top: 10rpx;
  }
}
</style>
