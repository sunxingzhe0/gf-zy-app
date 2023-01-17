<template>
  <view class="mini-page" style="padding: 20rpx; padding-top: 190rpx;">
    <!--主页按钮-->
    <homeIcom />
    <topbar :tabs="[]">
      <template v-slot:top>
        <view style="padding-left: 30rpx;">
          <app-list-item
            label="就诊人"
            :styles="{
              padding: '16rpx 30rpx',
              paddingLeft: 0,
              borderBottom: '1px solid #E6E6E6',
            }"
          >
            <view class="flex_1 text-right color666">
              <select-patient
                ref="patient"
                textStyle="color:#666;"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
          <!-- tab -->
          <view class="top-tabs">
            <view class="tab-list" @click="handleChangeTab(0)">
              <text class="font " :class="tabType === 0 ? 'active' : ''">{{
                `${'评估问卷'}(${questionnaires.length})`
              }}</text>
            </view>
            <view class="tab-list" @click="handleChangeTab(1)">
              <text class="font" :class="tabType === 1 ? 'active' : ''">{{
                `${'评估结果'}(${assessments.length})`
              }}</text>
            </view>
          </view>
        </view>
      </template>
    </topbar>
    <view
      class="app-card question-list"
      v-for="val in cardList"
      :key="val.id"
      @click="toInfo(val)"
    >
      <view class="title">{{ val.title }} </view>
      <view class="time">{{ val.updateDate || val.createDate }}</view>
      <view class="content" v-if="tabType === 1"
        >{{ val.score + '分  ，' + val.content }}
      </view>
    </view>
    <view class="bottom-msg">已经到底了，暂无更多数据</view>
  </view>
</template>

<script>
import selectPatient from '../../components/selectPatient.vue'
import AppListItem from '@/components/app/app-list-item'
import { rebackResult } from '@/pages-sf/api/assessment'
export default {
  components: {
    selectPatient,
    AppListItem,
  },
  data() {
    return {
      perName: '', //患者名
      perId: '', //患者id
      cardNo: '',
      tabType: 0, //当前tab
      questionnaires: [],
      assessments: [],
      cardList: [],
    }
  },
  onLoad(options) {
    console.log(options, 'url参数--------')
  },
  mounted() {
    uni.$on('updateList', () => {
      this.getQuestList(this.cardNo)
    })
  },
  methods: {
    //切换就诊人-初始化也会调用一次
    changePatient(item) {
      this.perId = item.memberId
      this.perName = item.name
      this.cardNo = item.patientCard
      this.getQuestList(item.patientCard)
    },
    //获取问卷列表-评估结果||记录列表
    async getQuestList(cardNo) {
      const params = { cardNo }
      const res = await rebackResult(params)
      console.log(res, '列表------')
      this.filterList(res)
    },
    //筛选列表
    filterList(res) {
      this.questionnaires = res.filter(val => !val.msgContent)
      this.assessments = res
        .filter(val => val.msgContent)
        .sort((a, b) => {
          return new Date(b.updateDate) - new Date(a.updateDate)
        })
      console.log(this.assessments, '已排序')
      this.cardList = this.tabType ? this.assessments : this.questionnaires
    },

    //切换tab
    handleChangeTab(type) {
      this.tabType = type
      uni.showLoading({
        title: '',
        mask: false,
      })
      setTimeout(() => {
        uni.hideLoading()
      }, 500)
      this.getQuestList(this.cardNo)
    },
    //查看详情
    toInfo(val) {
      uni.navigateTo({
        url: this.tabType
          ? `/pages-sf/src/riskAssess/assessInfo/index?val=${JSON.stringify(
              val,
            )}`
          : `/pages-sf/src/riskAssess/questionInfo/index?val=${JSON.stringify(
              val,
            )}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.top-tabs {
  height: 40px;
  display: flex;
  .tab-list {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    .font {
      display: inline-block;
      font-size: 14px;
      color: #666666;
      line-height: 36px;
    }
    .active {
      color: #0ab2c1;
      border-bottom: 1px solid #0ab2c1;
    }
  }
}
.question-list {
  margin-bottom: 10px;
  .title {
    font-size: 16px;
    // font-weight: 450;
    color: #333;
    line-height: 20px;
  }
  .time {
    font-size: 12px;
    color: #666;
    line-height: 20px;
    margin-top: 2px;
  }
  .content {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    margin-top: 4px;
    color: #333;
  }
}
.bottom-msg {
  color: #999999;
  font-size: 12px;
  text-align: center;
  width: 100%;
  position: fixed;
  bottom: 22px;
}
</style>
