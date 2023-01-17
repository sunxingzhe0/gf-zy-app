<template>
  <view class="checkup">
    <view class="head">
      <view class="line"></view>
      <view class="title">检查</view>
      <view class="num"
        >共计<span style="color: #f66666">{{
          ' ' + examSnoBox.length + ' '
        }}</span
        >条</view
      >
    </view>
    <view class="border" v-for="(one, sno) in examSnoBox" :key="sno">
      <view class="body" :style="one.isOpen ? 'height:auto' : 'height:280rpx'">
        <template v-if="one.checkUpList">
          <view
            style="margin-bottom: 30rpx"
            v-for="(item, checkup) in one.checkUpList"
            :key="checkup"
          >
            <view class="title">{{ item.title || '-' }}</view>
            <view class="text">{{ item.value || '-' }}</view>
          </view>
        </template>
        <template v-else>
          <view class="title">检查项目名称</view>
          <view class="text" style="margin-bottom: 30rpx">{{
            one.itemCHName || '-'
          }}</view>
          <view class="title">检查时间</view>
          <view class="text" style="margin-bottom: 30rpx">{{
            one.examDtime || '-'
          }}</view>
        </template>
      </view>
      <view class="button" @click="openDetail(one)">
        {{ one.isOpen ? '收起' : '展开' }}
        <image
          :src="require('@/assets/right11@2x.png')"
          :class="one.isOpen ? 'icon active' : 'icon'"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
// import { examSnoList, examDetailList } from "../../../api/index";
export default {
  props: {
    mpiId: {
      type: String,
    },
    ehrId: {
      type: String,
    },
  },
  data() {
    return {
      examSnoBox: [
        {
          checkUpList: [
            { title: '检查项目名称', value: '彩超检查(门诊):泌尿系统(常规)' },
            { title: '检查部位', value: '肾脏' },
            { title: '检查方法', value: '平扫' },
            { title: '检查医生', value: '王业飞' },
            { title: '检查时间', value: '2020-06-25 09:34:12' },
            { title: '检查科室', value: '彩超室' },
            { title: '送检医院', value: '冠方演示医院四' },
            { title: '送检科室', value: '泌尿外科' },
            {
              title: '检查所见',
              value:
                '肾脏：轮廓清晰，包膜完整，形态规整，大小正常，实质回声未见明显异常，右肾肾盂分离12mm，于右肾中极可见5.9x5.5mm强回声；左肾集合系统未见明显异常。CDFI：肾内动脉血流信号显示尚可。右肾输尿管上段扩张6.7mm，下段内径增宽约6.0mm，膀胱壁开口处管腔内可见大小约7.0mmx3.0mm强回声；左侧输尿管未见明显扩张。膀胱：中度充盈，壁光滑，腔内未见明显异常。前列腺：轮廓清晰，包膜光整',
            },
            { title: '诊断建议', value: '-' },
            { title: '报告医生', value: '王业飞' },
            { title: '报告时间', value: '2020-06-25 09:34:12' },
            { title: '审核医生', value: '章宽静' },
            { title: '审核时间', value: '2020-06-25 09:34:12' },
          ],
        },
      ],
    }
  },
  methods: {
    async geteExamSnoList() {
      // let res = await examSnoList({
      //   mpiId: this.mpiId,
      //   ehrId: this.ehrId,
      // });
      // this.examSnoBox = res;
    },
    async getExamDetailList(item) {
      // let res = await examDetailList({
      //   mpiId: this.mpiId,
      //   ehrId: this.ehrId,
      //   examSno: item.examSno,
      // });
      // this.$set(item, "checkUpList", res.transBeanList);
    },
    openDetail(item) {
      this.$set(item, 'isOpen', !item.isOpen)
      if (item.isOpen) {
        this.getExamDetailList(item)
      }
    },
  },
  mounted() {
    this.geteExamSnoList()
  },
}
</script>

<style lang="scss" scoped>
.checkup {
  width: 100%;
  .head {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .line {
      width: 2rpx;
      height: 30rpx;
      background: #0ab2c1;
      margin-right: 10rpx;
    }
    .title {
      width: 150rpx;
      font-size: 30rpx;
      color: #333333;
    }
    .num {
      flex: 1;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .border {
    width: 100%;
    background: #ffffff;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
  }
  .body {
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.3s;
    .title {
      width: 100%;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-bottom: 20rpx;
    }
    .text {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
    }
  }
  .button {
    position: relative;
    width: 100%;
    height: 60rpx;
    border-top: 1rpx solid #e6e6e6;
    background: #fff;
    border-radius: 0 0 10rpx 10rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #666666;
    text-align: center;
    line-height: 60rpx;
    .icon {
      position: absolute;
      width: 10rpx;
      height: 20rpx;
      top: 50%;
      transform: translate(10rpx, -50%) rotate(90deg);
      transition: all 0.3s;
    }
    .active {
      transform: translate(10rpx, -50%) rotate(-90deg);
    }
  }
}
</style>
