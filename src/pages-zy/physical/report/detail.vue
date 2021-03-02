<template>
  <view style="padding: 20rpx;padding-bottom: 130rpx;">
    <!-- 背景图 -->
    <view class="backgroundImg box-shadow flex-start-center">
      <!-- <view class="headerImg">
          <default-img :url="require('@/assets/user/doc-3.png')"></default-img>
        </view> -->
      <view class="content flex_1">
        <view class="hospital">{{info.reportTitle || ''}}</view>
        <view class="flex-between">
          <view class="num">体检单号：{{info.bookingNo || '-'}}</view>
          <view class="date">体检时间：{{info.reportDate || '-'}}</view>
        </view>
      </view>
    </view>
    <view class="backgroundImg box-shadow mt-20">
      <view class="perTitle">患者信息</view>
      <view class="flex-between perInfo">
        <view>就诊人：<text>{{info.patientName}}</text></view>
        <view>性别：<text>{{info.gender}}</text></view>
        <view>年龄：<text>{{info.age}}</text></view>
      </view>
    </view>
    <!-- 体检结果 tab 列表 -->
    <view class="resultBox box-shadow">
      <view class="tab flex-between">
        <view :class="active == item.value?'on':''" v-for="(item,index) in tebleList" :key="index" @click="tabChange(item.value)">{{item.label}}</view>
      </view>
      <template v-if="active == 0">
        <view style="padding-left: 30rpx;">
          <view class="resultItem flex-between" v-for="(item, index) in objList" :key="index" @click="goTo(item)">
            <view class="abnormal flex-between flex_1">
              <view class="title flex_1">{{ item.combName }}</view>
              <view class="icon">
                <view v-if="item.errNum>0" class="text">{{ item.errNum }}项重点关注</view>
              </view>
            </view>
            <uni-icons type="arrowright" color="#666" size="13"></uni-icons>
          </view>
        </view>
      </template>
      <template v-if="active == 1">
        <view style="padding-left: 30rpx;">
          <template v-for="(item, index) in objList">
            <view class="abnormalData" v-if="item.errNum>0" :key="index">
              <view class="tabHead flex-between">
                <view class="objName">{{ item.combName }}</view>
                <view class="icon">
                  <view class="text">{{item.errNum}}项异常</view>
                </view>
              </view>
              <template v-for="(child,t) in item.details">
                <view class="abnormalItem" v-if="child.isErr" :key="index">
                  <view class="itenName">{{child.itemName}}（{{child.resultInterpre}}）</view>
                  <view class="flex-between">
                    <view class="percent">范围:{{child.resultRef}}{{child.resultUnit || ''}}</view>
                    <view>结果:{{child.resultNum}}{{child.resultUnit || ''}}</view>
                  </view>

                </view>
              </template>
            </view>

          </template>
        </view>
      </template>
      <template v-if="active == 2">
        <view class="sumAnalysis" v-html="analysisContent"></view>
      </template>
    </view>
    <!-- 报告深度解读 -->
    <view class="deepExplain">报告深度解读</view>

  </view>
</template>
<script>
  import {
    tjResultItem,
    tjReportInfo,
    getAnalysis
  } from '../../api/physical.js'
  export default {
    data() {
      return {
        // 切换激活
        active: 0,
        tebleList: [{
          label: '体检结果',
          value: 0
        }, {
          label: '异常数据',
          value: 1
        }, {
          label: '汇总分析',
          value: 2
        }],
        // 异常列表
        abList: ['检验化验', '血液分析'],
        // 检查项目列表
        checkupNo: '',
        patientId: '',
        objList: [],
        info: {},
        analysisContent: ''
      }
    },
    onLoad(option) {
      this.checkupNo = option.checkupNo
      this.patientId = option.patientId
      this.gettjReportInfo()
      this.gettjResultItem()
    },
    methods: {
      // 获取基本信息
      async gettjReportInfo() {
        this.info = await tjReportInfo({
          patientId: this.patientId,
          checkupNo: this.checkupNo
        })
      },
      // 获取体检项目
      async gettjResultItem() {
        //resultPoint 结果值包含↑、↓、＋三个符号,都为异常的
        let errList = ['↑', '↓', '+']
        let res = await tjResultItem({
          checkupNo: this.checkupNo
        })
        res.forEach(item => {
          item.errNum = 0
          item.details.forEach(ite => {
            if (errList.indexOf(ite.resultPoint) > -1) {
              ite.isErr = true
              item.errNum = item.errNum + 1
            }
          })
        })
        this.objList = res
      },
      // 获取汇总分析
      async getAnalysisInfo() {
        this.analysisContent = await getAnalysis({
          checkupNo: this.checkupNo,
          patientId: this.patientId
        })
      },
      //tab切换
      tabChange(e) {
        this.active = e
        if (this.active == 2) {
          this.getAnalysisInfo()
        }
      },
      goTo(item) {
        uni.navigateTo({
          url: `/pages-zy/physical/report/itemInfo?data=${encodeURIComponent(JSON.stringify(item))}`
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .main {
    padding-bottom: 120rpx;
  }

  .backgroundImg {
    padding: 30rpx;
    background: #fff;

    .headerImg {
      width: 100rpx;
      height: 100rpx;
      overflow: hidden;
      border-radius: 50%;
    }

    .content {
      line-height: 48rpx;
      // padding-left: 30rpx;

      .hospital {
        font-size: 32rpx;
        line-height: 48rpx;
      }

      .num,
      .date {
        font-size: 24rpx;
        color: #666;
      }
    }

    .perTitle {
      font-size: 32rpx;
      color: #333;
    }

    .perInfo {
      view {
        font-size: 28rpx;
      }

      color: #666;

      text {
        color: #333;
        font-size: 28rpx;
      }
    }
  }

  .resultBox {
    margin-top: 20rpx;
    background: #fff;
    overflow: hidden;
    .tab {
      padding: 30rpx;
      padding-bottom: 0;
      border-bottom: 1px solid #f6f6f6;

      view {
        width: 140rpx;
        padding-bottom: 20rpx;
        border-bottom: 4rpx solid #fff;
        text-align: center;
        font-size: 28rpx;
        color: #8C8C8C;

        &.on {
          border-color: $uni-color-primary;
          color: #333;
        }
      }
    }

    .resultItem {
      height: 75rpx;
      padding: 20rpx;
      border-top: 1px solid #f5f5f5;

      .abnormal {
        padding-right: 10rpx;

        .title {
          color: #646464;
          font-size: 28rpx;
          font-weight: 400;
        }

        view {
          color: #ff4500;
          font-size: 28rpx;
          font-weight: 400;
        }

        img {
          width: 28rpx;
          height: 28rpx;
          margin-left: 390rpx;
        }
      }

      .jiantou {
        width: 32rpx;
      }
    }
  }

  .abnormalData {
    margin-bottom: 20rpx;
    background: #fff;
    padding-bottom: 20rpx;

    .tabHead {
      padding: 20rpx 30rpx 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      margin-bottom: 20rpx;

      .objName {
        font-size: 28rpx;
        color: #646464;
        font-weight: 600;
      }

      .icon {
        .text {
          color: #ff4500;
          font-size: 28rpx;
          font-weight: 400;
        }
      }
    }
  }

  .normalItem,
  .abnormalItem {
    padding: 10rpx 20rpx;
    margin-right: 30rpx;

    .itenName {
      font-size: 28rpx;
      color: #646464;
      font-weight: 400;
    }

    view {
      color: #ff4500;
      font-size: 28rpx;
      font-weight: 400;
    }

    .percent {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(100, 100, 100, 1);
    }
  }

  .abnormalItem {
    background: rgb(253, 237, 241);
  }

  .sumAnalysis {
    height: 75rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #646464;
    font-weight: 400;
  }

  .deepExplain {
    position: fixed;
    bottom: 20rpx;
    width: 710rpx;
    line-height: 88rpx;
    background: $uni-color-primary;
    color: #fff;
    font-size: 30rpx;
    text-align: center;
    left: 50%;
    margin-left: -355rpx;
    border-radius: 40px;

  }
</style>
