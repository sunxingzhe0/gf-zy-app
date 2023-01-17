<template>
  <view style="padding:10px">
    <!-- top -->
    <view class="top-info">
      <view class="title">{{ resultInfo.title }} </view>
      <view class="time"
        >创建时间：{{ resultInfo.updateDate || resultInfo.createDate }}</view
      >
      <view class="msg">{{ resultInfo.remark }}</view>
    </view>
    <!-- content -->
    <view class="app-card mini-content">
      <view class="title">自评估结果</view>
      <view class="score">
        <text
          class="num"
          :style="{
            color:
              score <= 5
                ? '#46BF4B'
                : score <= 11
                ? '#4CAAE0'
                : score <= 14
                ? '#9B6FD8'
                : score <= 20
                ? '#E3922A'
                : '#F74A4A',
          }"
          >{{ resultInfo.score }}</text
        >
        <text>分</text>
      </view>
      <view class="msg">{{ resultInfo.content }} </view>
      <view class="line"></view>
      <!-- 指示标 -->
      <view class="instructions">
        <view class="mark" v-for="(val, index) in markList" :key="index">
          <view class="mark-line" :style="{ background: val.color }">
            <view
              class="float-mark"
              v-if="val.markLeft"
              :style="{ left: `${val.markLeft}%` }"
            >
              <view :style="{ fontSize: '12px', color: val.color }">{{
                resultInfo.score
              }}</view>
              <view class="mini-mark"></view>
            </view>
          </view>
          <view class="text">{{ val.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      aId: '',
      // topInfo: {
      //   title: '测一测，你离2型糖尿病有多远？  ',
      //   time: '2021-07-01 10:10:26',
      //   msg: '该自评估仅适用于对20~74岁的普通人群进行糖尿病风 险评估  ',
      // },
      // score: 18,
      markList: [
        {
          text: '低(0-6分)',
          color: '#46BF4B',
        },
        {
          text: '稍高(7-11分)',
          color: '#4CAAE0',
        },
        {
          text: '中(12-14分)',
          color: '#9B6FD8',
        },
        {
          text: '高(15-20分)',
          color: '#E3922A',
        },
        {
          text: '很高(20分以上)',
          color: '#F74A4A',
        },
      ],
      resultInfo: {},
    }
  },
  onLoad(options) {
    console.log(JSON.parse(options.val), '接收参数-------')
    this.resultInfo = JSON.parse(options.val)
    const score = this.resultInfo.score
    if (0 <= score && score <= 6) {
      this.markList[0].markLeft =
        parseFloat(this.resultInfo.score / 6).toFixed(2) * 100
      return
    }
    if (7 <= score && score <= 11) {
      this.markList[1].markLeft =
        parseFloat(this.resultInfo.score / 6).toFixed(2) * 100
      return
    }
    if (12 <= score && score <= 14) {
      this.markList[2].markLeft =
        parseFloat(this.resultInfo.score / 6).toFixed(2) * 100
      return
    }
    if (15 <= score && score <= 20) {
      this.markList[3].markLeft =
        parseFloat(this.resultInfo.score / 6).toFixed(2) * 100
      return
    }
    if (20 <= score) {
      console.log(this.resultInfo.score)
      this.markList[4].markLeft =
        parseFloat(this.resultInfo.score / 6).toFixed(2) * 100 > 90
          ? 100
          : parseFloat(this.resultInfo.score / 6).toFixed(2) * 100
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.top-info {
  // padding: 10px;
  // width: 100%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
  .title {
    width: 90%;
    text-align: center;
    font-size: 16px;
    color: #333;
    line-height: 20px;
  }
  .time {
    width: 90%;
    text-align: center;
    font-size: 12px;
    color: #666;
    margin-top: 6px;
  }
  .msg {
    margin-top: 15px;
    padding: 15px;
    background: #e0e0e0;
    font-size: 14px;
    color: #666;
    line-height: 18px;
    border-radius: 5px;
  }
}
.mini-content {
  margin-top: 15px;
  .title {
    font-size: 16px;
    color: #333;
    line-height: 20px;
  }
  .score {
    text-align: center;
    .num {
      font-size: 40px;
      color: #4caae0;
      letter-spacing: 4px;
    }
  }
  .msg {
    text-align: center;
    color: #666;
    font-size: 12px;
  }
  .line {
    height: 0;
    border-top: 1px solid #e6e6e6;
    margin: 12px 0;
  }
  .instructions {
    display: flex;
    margin-top: 32px;
    .mark {
      flex: 1;
      display: flex;
      flex-direction: column;
      .mark-line {
        height: 4px;
        border-radius: 2px;
        position: relative;
        .float-mark {
          position: absolute;
          top: -25px;
          right: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .mini-mark {
            width: 1px;
            height: 4px;
            background: #999;
          }
        }
      }
      .text {
        margin-top: 14px;
        color: #666;
        font-size: 9px;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
      }
    }
  }
}
</style>
