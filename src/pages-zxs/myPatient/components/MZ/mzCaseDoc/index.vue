<template>
  <view class="case-doc">
    <view class="head">
      <view class="line"></view>
      <view class="title">病历文书</view>
    </view>
    <!-- 门诊病例文书 -->
    <view class="body" v-for="(one, caseDoc) in caseDocBox" :key="caseDoc">
      <template v-for="two in one.mzDisease">
        <view class="doc-item" v-for="(item, bean) in two.beanList" :key="bean">
          <view class="title">{{ item.title }}</view>
          <view class="text">{{ item.value || "-" }}</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
// import { caseDoc } from '../../../api/index'
export default {
  props: {
    ehrId: {
      type: String,
    },
    mpiId: {
      type: String,
    },
  },
  data() {
    return {
      caseDocBox: [
        {
          mzDisease: [
            {
              beanList: [
                { title: "主诉", value: "左肩疼痛" },
                { title: "既往史", value: "既往体健，否认家族遗传病史" },
                { title: "初步诊断", value: "正常" },
                {
                  title: "处理意见",
                  value:
                    "1.对症解痉、止痛治疗；2.多饮水，适当运动；医生签名：复诊时，请带上本病历记录！",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    async getCaseDoc() {
      // let res=await caseDoc({
      //   type:'MZ',
      //   // ehrId:this.ehrId,
      //   mpiId:this.mpiId
      // })
      // this.caseDocBox=res
    },
  },
  mounted() {
    this.getCaseDoc();
  },
};
</script>

<style lang="scss" scoped>
.case-doc {
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
      font-size: 30rpx;
      color: #333333;
    }
  }
  .body {
    width: 100%;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx 30rpx 0;
    box-sizing: border-box;
    .doc-item {
      width: 100%;
      padding-bottom: 30rpx;
      .title {
        height: 30rpx;
        margin-bottom: 20rpx;
        line-height: 30rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }
      .text {
        font-size: 26rpx;
        line-height: 26rpx;
        color: #666666;
        margin-bottom: 10rpx;
      }
    }
  }
}
</style>
