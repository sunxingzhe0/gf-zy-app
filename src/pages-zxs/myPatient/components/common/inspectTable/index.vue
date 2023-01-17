<template>
  <view class="inspect-table">
    <template v-for="(one, inspent) in inspenctList">
      <view class="head" :key="inspent">
        <view class="line"></view>
        <view class="title">检验</view>
        <view class="times">{{ one.reportDtime }}</view>
        <view class="num"
          >共计<span style="color: #f66666">{{
            ' ' + one.list.length + ' '
          }}</span
          >条</view
        >
      </view>
      <view
        class="collapse"
        :style="two.isOpen ? 'height:auto' : 'height:140rpx'"
        v-for="(two, labSno) in one.list"
        :key="labSno"
      >
        <view class="number">
          <view class="no">{{ two.labCombName }}</view>
          <view class="nums" @click="opentTable(two)">
            {{ two.childNums || '-' }}项
            <image
              :src="require('@/assets/right11@2x.png')"
              :class="one.isOpen ? 'icon active' : 'icon'"
            ></image>
          </view>
        </view>
        <view class="texts">
          <view class="tips">
            科室：{{ '临床化学室' || two.transBeanList[0].value || '-' }} |
            标本：{{ '血液' || two.transBeanList[1].value || '-' }}</view
          >
          <view class="checks">
            置顶异常值
            <checkbox
              :checked="true || two.checkState"
              @click="changeState(two)"
              style="transform: scale(0.7)"
            />
          </view>
        </view>
        <view class="result-table">
          <table cellspacing="0">
            <thead>
              <tr style="background: #f2f2f2">
                <td>检验项目</td>
                <td>结果</td>
                <td>提示</td>
                <td>参考值</td>
                <td>单位</td>
                <!-- <td>趋势</td> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, table) in [5] || two.tableList" :key="table">
                <td>{{ '间接胆红素' || t.itemCHName || '-' }}</td>
                <td>{{ '14.300' || t.itemResultNum || '-' }}</td>
                <td>
                  <template v-if="two.result == 1">
                    <template v-if="t.itemResultPoint == '偏高'">
                      <view class="icon-up">
                        <image :src="require('@/assets/piangao.png')"></image>
                      </view>
                    </template>
                    <template v-if="t.itemResultPoint == '偏低'">
                      <view class="icon-down">
                        <image :src="require('@/assets/piangao.png')"></image>
                      </view>
                    </template>
                  </template>
                  <template v-else>-</template>
                </td>
                <td>{{ t.itemResultReference || '-' }}</td>
                <td>{{ t.itemResultUnit || '-' }}</td>
                <!-- <td class="button" @click="openChart(table)">
                <image :src="require('../../../../assets/qushi.png')"></image>
              </td> -->
              </tr>
            </tbody>
          </table>
          <view class="doctor-remark">
            <view class="doctor"
              >申请医生：{{ '赵星' || two.transBeanList[2].value || '-' }}</view
            >
            <view class="time"
              >申请日期：{{
                '2020-05-12 ' || two.transBeanList[5].value || '-'
              }}</view
            >
          </view>
          <view class="doctor-remark">
            <view class="doctor"
              >审核医生：{{ '刘小' || two.transBeanList[3].value || '-' }}</view
            >
            <view class="time"
              >审核时间：{{
                '2020-05-12 10:21' || two.transBeanList[7].value || '-'
              }}</view
            >
          </view>
          <view class="doctor-remark">
            <view class="doctor"
              >报告医生：{{ '赵星' || two.transBeanList[4].value || '-' }}</view
            >
            <view class="time"
              >报告时间：{{
                '2020-05-12 10:21' || two.transBeanList[8].value || '-'
              }}</view
            >
          </view>
          <view class="do-time"
            >采集时间：{{
              '2020-05-12 10:21' || two.transBeanList[6].value || '-'
            }}</view
          >
        </view>
      </view>
    </template>
  </view>
</template>

<script>
// import { labSnoList, labDetailList } from "../../../api/index";
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
      reportTime: '',
      upType: 0,
      childNums: 0,
      inspenctList: [
        {
          reportDtime: '2021-03-05',
          list: [
            {
              labCombName: 'AFP+CDA+CA125  ③',
              childNums: 5,
              isOpen: true,
            },
          ],
        },
      ],
      labSnoBox: [],
      transBeanList: [],
      tableList: [],
    }
  },
  methods: {
    async getLabSnoList() {
      // let res = await labSnoList({
      //   mpiId: this.mpiId,
      //   ehrId: this.ehrId,
      // });
      // this.inspenctList = res;
    },
    async getLabDetail(item) {
      // let res = await labDetailList({
      //   labSno: item.labSno,
      //   upAnomaly: this.upType,
      // });
      // item.transBeanList = res.transBeanList;
      // item.tableList = res.labDetailListDtoList;
      // item.childNums = res.labDetailListDtoList.length;
    },
    opentTable(item) {
      this.$set(item, 'isOpen', !item.isOpen)
      this.getLabDetail(item)
    },
    changeState(item) {
      item.checkState = !item.checkState
      if (item.checkState) {
        this.upType = 1
      } else {
        this.upType = 0
      }
      console.log(item)
      this.getLabDetail(item.labSno)
    },
    openChart(i) {
      console.log(i)
    },
  },
  mounted() {
    this.getLabSnoList()
  },
}
</script>

<style lang="scss" scoped>
.inspect-table {
  width: 100%;
  transform: scale();
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
      width: 100rpx;
      font-size: 30rpx;
      color: #333333;
    }
    .times {
      flex: 1;
      font-size: 30rpx;
      color: #666666;
    }
    .num {
      width: 150rpx;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .collapse {
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 10rpx;
    overflow: hidden;
    margin-bottom: 10rpx;
    .number {
      display: flex;
      align-items: center;
      font-weight: 500;
      margin-bottom: 20rpx;
      .no {
        width: 85%;
        font-size: 26rpx;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .nums {
        position: relative;
        width: 15%;
        font-size: 26rpx;
        color: #666666;
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
    .texts {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: #666666;
      margin-bottom: 20rpx;
      .tips {
        width: 69%;
        font-size: 22rpx;
        line-height: 22rpx;
      }
      .checks {
        width: 31%;
        white-space: nowrap;
        text-align: right;
        font-size: 22rpx;
        line-height: 22rpx;
      }
    }
    .result-table {
      width: 100%;
      table {
        width: 100%;
        border: 0.5rpx solid #e6e6e6;
        text-align: center;
        margin-bottom: 20rpx;
        thead {
          width: 100%;
          background: #f2f2f2;
          font-size: 20rpx;
          color: #666666;
        }
        tbody {
          width: 100%;
          font-size: 20rpx;
          color: #666666;
          .button {
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 35rpx;
              height: 35rpx;
            }
          }
        }
        tr td {
          border: 0.5rpx solid #e6e6e6;
        }
        tr {
          display: flex;
          .icon-up {
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 30rpx;
              height: 50rpx;
            }
          }
          .icon-down {
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 30rpx;
              height: 50rpx;
              transform: rotate(180deg);
            }
          }
        }
        td {
          // width: 16.6%;
          width: 20%;
        }
      }
      .doctor-remark {
        display: flex;
        align-items: center;
        color: #666666;
        font-weight: 500;
        margin-bottom: 20rpx;
        .doctor {
          width: 35%;
          font-size: 20rpx;
        }
        .time {
          width: 65%;
          font-size: 20rpx;
        }
      }
      .do-time {
        width: 100%;
        font-weight: 500;
        color: #666666;
        font-size: 20rpx;
      }
    }
  }
}
</style>
