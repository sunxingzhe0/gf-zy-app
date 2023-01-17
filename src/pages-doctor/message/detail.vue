<template>
  <view class="content">
    <!--主页按钮-->
    <!-- <homeIcom /> -->
    <view class="title">{{ infoData.title }}</view>
    <view class="date">{{ infoData.createTime }}</view>
    <view class="main">{{ infoData.content }}</view>
    <button class="submit_btn" @click="toInfo" v-if="isShowXzInfobTn(infoData)">
      查看详情
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      infoData: {},
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad(options) {
    if (options.info) {
      this.infoData = JSON.parse(decodeURIComponent(options.info))
      console.log(this.infoData.notice)
    }
  },
  methods: {
    //心咨医生消息显示详情按钮条件(仅预约单可跳详情)
    isShowXzInfobTn(item) {
      const reg = new RegExp('XZ_DOCTOR')
      if (reg.test(item.notice) && item.notice === 'XZ_DOCTOR_04') {
        return true
      } else {
        return false
      }
    },
    //互联网医生消息显示详情按钮条件
    isShowHlwInfobTn() {
      /* 
      infoData.notice !== 'ALL_06' &&
          infoData.notice !== 'ALL_07' &&
          infoData.notice !== 'ALL_08' &&
          infoData.notice !== 'ALL_09' */
      const reg = new RegExp('xxxxx')
      if (reg.test(item.notice) && item.notice === 'xxx') {
        return true
      } else {
        return false
      }
    },
    toInfo() {
      //心咨消息跳转
      if (this.infoData.notice === 'XZ_DOCTOR_04') {
        return uni.navigateTo({
          url: '/pages-zxs/appoint-patient/detail?id=' + this.infoData.bizId,
        })
      }
      return
      //互联网医院消息跳转
      let { notice, bizId } = this.infoData
      let val = parseInt(notice.split('_')[1])
      if (notice.split('_')[0] != 'ALL') {
        if (val < 7 || (val > 9 && val < 13)) {
          uni.navigateTo({
            url: '/pages-doctor/user/order/detail?orderId=' + bizId,
          })
        }

        if (val > 6 && val < 10) {
          uni.navigateTo({
            url: '/pages-doctor/user/prescription/detail?id=' + bizId,
          })
        }
      } else {
        if (val > 5 && val < 9) {
          uni.navigateTo({
            url: this.userInfo.hasAuth
              ? '/pages-doctor/user/qualification'
              : '/pages-doctor/user/attestation/index',
          })
        }
        if (val == 4) {
          uni.navigateTo({
            url: this.userInfo.hasAuth
              ? '/pages-doctor/user/account'
              : '/pages-doctor/user/attestation/index',
          })
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  background: #fff;
  min-height: 100%;
  padding: 40rpx 30rpx;
  box-sizing: border-box;

  .title {
    font-size: 34rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .date {
    font-size: 24rpx;
    color: #666666;
    text-align: center;
    margin-top: 30rpx;
    margin-bottom: 50rpx;
  }

  .main {
    font-size: 26rpx;
    color: #666666;
    line-height: 46rpx;
  }
}
</style>
