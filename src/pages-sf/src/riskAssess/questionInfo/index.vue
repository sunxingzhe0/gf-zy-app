<template>
  <view style="padding:10px">
    <!-- top -->
    <view class="top-info">
      <view class="title">{{ resultInfo.title }} </view>
      <view class="time">创建时间：{{ resultInfo.createDate }}</view>
      <view class="msg">{{ resultInfo.remark }}</view>
    </view>
    <!-- list -->
    <view class="app-card list-box">
      <AppListItem
        v-for="val in quesTions"
        :key="val.id"
        :label="val.title"
        :styles="{ flexDirection: 'column' }"
        textStyle="width: 100% "
        className="list-calss"
        :noBorder="val.noBorder"
      >
        <!-- 单选 -->
        <view v-if="val.type === 0 && val.answerList">
          <radio-group @change="radioChange($event, val)">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="(item, i) in val.answerList"
              :key="i"
            >
              <view>
                <radio :value="i" color="#0AB2C1" />
              </view>
              <view>{{ item.title }}</view>
            </label>
          </radio-group>
        </view>
        <!-- 多选 -->
        <view v-else-if="val.type === 1">
          <checkbox-group @change="checkboxChange($event, val)">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="(item, i) in val.answerList"
              :key="i"
            >
              <view>
                <checkbox
                  :value="i"
                  color="#0AB2C1"
                  style="transform:scale(0.7)"
                />{{ item.title }}
              </view>
            </label>
          </checkbox-group>
        </view>
        <view v-else style="padding-left:20px">
          <input
            v-model="val.value"
            class="flex_1 inputStyle"
            placeholder-class="input_pla"
            placeholder="请输入"
          />
        </view>
      </AppListItem>
    </view>
    <button class="submit_btn" type="primary" @click="submitBtn">提交</button>
  </view>
</template>

<script>
import AppListItem from '@/components/app/app-list-item'
import formList from './formList'
import { rebackDetail, saveResult } from '@/pages-sf/api/assessment'
export default {
  components: {
    AppListItem,
  },
  data() {
    return {
      topInfo: {
        title: '测一测，你离2型糖尿病有多远？  ',
        time: '2021-07-01 10:10:26',
        msg: '该自评估仅适用于对20~74岁的普通人群进行糖尿病风 险评估  ',
      },
      formList,
      quesTions: [],
      resultInfo: {},
    }
  },
  onLoad(options) {
    this.resultInfo = JSON.parse(options.val)
    this.getQuesTions(this.resultInfo.articleId)
  },
  methods: {
    //获取问题列表
    async getQuesTions(id) {
      this.quesTions = await rebackDetail({ id })
      this.quesTions[this.quesTions.length - 1].noBorder = true
    },
    //选项变化
    radioChange(e, val) {
      console.log(e, val)
      val.value = parseInt(e.detail.value)
    },
    checkboxChange(e, val) {
      console.log(e, val)
      val.value = e.detail.value
    },
    //提交
    async submitBtn() {
      const paramsArr = this.quesTions.map(val => {
        return {
          result: val.type === 2 ? val.value : '',
          qsId: val.id,
          csId:
            val.type !== 2
              ? val.type === 1
                ? val.value.join(',')
                : val.value
              : '',
        }
      })
      const params = {
        id: this.resultInfo.id,
        msgContent: JSON.stringify(paramsArr),
      }
      console.log(params, '提交参数')
      uni.showLoading({
        title: '提交中',
      })
      await saveResult(params)
      uni.hideLoading()
      uni.showToast({
        title: '提交成功',
      })
      setTimeout(() => {
        uni.$emit('updateList')
        uni.navigateBack()
      }, 300)
    },
  },
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
.list-box {
  font-size: 14px;
  margin-top: 15px;
  .list-calss {
    display: flex;
    flex-direction: column !important;
  }
  .uni-list-cell-pd {
    justify-content: start;
    padding: 10rpx 30rpx;
    radio {
      transform: scale(0.8);
      color: $uni-color-primary;
    }
  }
  .uni-list-cell::after {
    height: 0;
  }
  .inputStyle {
    color: #333;
  }
  v-deep.input_pla {
    font-size: 30rpx;
    color: #ccc;
  }
}
.submit_btn {
  position: relative;
  margin-top: 20px;
}
</style>
