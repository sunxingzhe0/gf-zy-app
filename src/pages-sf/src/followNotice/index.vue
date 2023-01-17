<template>
  <view class="mini-page">
    <view
      class="app-card"
      v-for="val in msgList"
      :key="val.id"
      @click.stop="handlclick(val)"
    >
      <view class="left">
        <view class="img-box">
          <text class="iconfont icon-tongzhi"></text>
          <view v-if="val.state == 0" class="read-status"></view>
        </view>
      </view>
      <view class="right">
        <view class="title-box">
          <view class="title">{{ val.title }}</view>
          <view class="time">{{ val.followTime }}</view>
        </view>
        <view class="content " :class="val.isShow ? '' : 'text-overfollow'">{{
          val.content
        }}</view>
        <view class="btns-box" v-if="val.isShow">
          <!-- <view class="mini-btn">删除</view> -->
          <view
            v-if="urls[val.messageType]"
            class="mini-btn see"
            @click="toInfo(val)"
            >查看</view
          >
        </view>
      </view>
    </view>
    <NoData v-if="msgList.length == 0"></NoData>
    <view @click="readAll" class="read-all" v-if="msgList.length > 0"
      >一键已读</view
    >
  </view>
</template>

<script>
import { massageList, editMassage } from '@/pages-sf/api/followNotice'
import NoData from '@/pages-sf/components/NoData'
export default {
  components: {
    NoData,
  },
  data() {
    return {
      msgList: [
        {
          id: 1,
          title: '健康指标提醒      ',
          followTime: '01-20 13:30  ',
          state: 0,
          content:
            'XXXX医生申请查看【患者姓名】2020-04-01 的门诊 记录，是否授权？  ',
        },
      ],
      urls: {
        FOLLOW: '/pages-sf/src/myFollow/folloOrder/index', //随访提醒
        TIMEOUT: '/pages-sf/src/myFollow/folloOrder/index', //随访单超时提醒
        VISIT: '', //复诊提醒
        HEALTH: '/pages-sf/src/healthEducation/article/index', //健康指标提醒
        ASSESSMENT: '/pages-sf/src/riskAssess/index', //评估提醒
        QUESTIONNAIRE: '/pages-sf/src/riskAssess/index', //问卷提醒
        PHARMACY: '', //用药提醒
      },
    }
  },
  created() {
    // !uni.getStorageSync('sfToekn') && loginSf()
    // console.log(loginSf, '------------')
    this.getMassageList()
  },
  methods: {
    async getMassageList() {
      const res = await massageList()
      this.msgList = res
    },
    async handlclick(val) {
      this.$set(val, 'isShow', !val.isShow)
      if (val.state == 1) return
      await editMassage({ ids: val.id })
      this.getMassageList()
    },
    async readAll() {
      const ids = this.msgList.reduce((pre, cur) => {
        if (cur.state == 1) return pre
        return pre.concat(cur.id)
      }, [])
      console.log(ids, '=======')
      await editMassage({ ids: ids.join(',') })
      this.getMassageList()
    },
    toInfo(val) {
      console.log(
        'to---------',
        this.urls[val.messageType] + `?id=${val.busId}`,
      )
      uni.navigateTo({
        url: this.urls[val.messageType] + `?id=${val.busId}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  padding: 10px;
  height: 100%;
}
.app-card {
  margin-top: 10px;
  display: flex;
  .left {
    width: 15%;
    display: flex;
    align-items: center;
    .img-box {
      width: 37px;
      height: 37px;
      border-radius: 50%;
      background: #d0f2f5;
      color: #0ab2c1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .icon-tongzhi {
        font-size: 20px;
      }
      .read-status {
        position: absolute;
        right: 4px;
        top: 4px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #f74a4a;
      }
    }
  }
  .right {
    flex: 1;
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 14px;
        color: #333;
      }
      .time {
        font-size: 12px;
        color: #999;
      }
    }
    .content {
      font-size: 12px;
      color: #333;
    }
    .text-overfollow {
      width: 280px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .btns-box {
      display: flex;
      justify-content: flex-end;
      z-index: 99;
      .mini-btn {
        width: 60px;
        height: 30px;
        border-radius: 15px;
        border: 1px solid #999;
        color: #999;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
      }
      .see {
        border: 1px solid #0ab2c1;
        margin-right: 0;
        color: #0ab2c1;
      }
    }
  }
}
.read-all {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: #0ab2c1;
  background: #fff;
}
</style>
