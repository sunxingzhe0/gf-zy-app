<template>
  <view class="mini-page">
    <view class="app-card">
      <view class="title list-item">
        <view class="order-num">
          <view class="value" style="flex-shrink: 0;">随访单号：</view>
          <view class="value">{{ resultInfo.followSheet.id }} </view>
        </view>
        <view v-if="resultInfo.followSheet.state === 2" class="status"
          >已完成</view
        >
      </view>

      <view class="list-item">
        <view class="tags-msg">
          <text class="mini-tag">{{ resultInfo.followSheet.columnName }}</text>
          <view class="order-msg">{{ resultInfo.followSheet.title }} </view>
        </view>
      </view>

      <view class="list-item">
        <view>
          <view class="label">制定人： </view>
          <view>
            <text class="value" style="margin-right:5px"
              >{{ resultInfo.followSheet.docName||'-' }}
            </text>
            <!-- <text>主任医师 </text> -->
          </view>
        </view>
        <view>
          <view class="label">随访人： </view>
          <view class="value">{{
            resultInfo.patientCardInfo.patientName
          }}</view>
        </view>
        <view>
          <view class="label">计划随访时间： </view>
          <view class="value">{{ resultInfo.followSheet.createDate }} </view>
        </view>
      </view>

      <view class="list-item">
        <view>
          <text>随访说明： </text>
          <text>-</text>
        </view>
      </view>

      <view class="content-card">
        <view
          class="mini-content-list list-item"
          v-for="(val, indexa) in resultInfo.questionList"
          :key="val.id"
        >
          <view class="title">
            <view class="title-text">{{ indexa + 1 + '.  ' + val.title }}</view>
            <view v-if="val.remark" @click="handleSeeMsg(val)" class="title-msg"
              >?</view
            >
          </view>

          <view v-if="val.questionType === 'RADIO'">
            <radio-group @change="radioChange($event, val, indexa)">
              <view class="radio-group">
                <label
                  class="uni-list-cell uni-list-cell-pd"
                  v-for="(item, i) in val.content.split(',')"
                  :key="i"
                >
                  <view>
                    <radio
                      :value="i"
                      :checked="i == val.value"
                      color="#0AB2C1"
                    />
                  </view>
                  <view style="flex-shrink: 0;">{{ item }}</view>
                </label>
              </view>
            </radio-group>
          </view>
          <view v-else-if="val.questionType === 'CHECKBOX'">
            <checkbox-group @change="checkboxChange($event, val, indexa)">
              <label
                class="uni-list-cell uni-list-cell-pd"
                v-for="(item, i) in val.content.split(',')"
                :key="i"
              >
                <view>
                  <checkbox
                    :value="i"
                    color="#0AB2C1"
                    :checked="val.value ? val.value.indexOf(i) > -1 : false"
                    style="transform:scale(0.7)"
                  />{{ item }}
                </view>
              </label>
            </checkbox-group>
          </view>
          <view v-else style="padding-left:10px">
            <input
              v-model="val.value"
              class="flex_1 inputStyle"
              placeholder-class="input_pla"
              placeholder="请输入"
            />
          </view>
        </view>
      </view>
    </view>

    <view class="btns">
      <view
        class="mini-btn"
        :class="resultInfo === 'end' ? 'other-btn-class' : ''"
        @click="toAskFollow"
        >随访咨询</view
      >
      <view
        class="mini-btn"
        v-if="resultInfo.followSheet.state != 2"
        @click="submitForm(0)"
        >暂存</view
      >
      <view
        class="mini-btn submit"
        v-if="resultInfo.followSheet.state != 2"
        @click="submitForm(1)"
        >提交</view
      >
    </view>
  </view>
</template>

<script>
import AppListItem from '@/components/app/app-list-item'
import formList from './questionList'
import { getSheetDetailById, saveSel } from '@/pages-sf/api/myFollow'
export default {
  components: {
    AppListItem,
  },
  data() {
    return {
      formList,
      resultInfo: {},
    }
  },
  onLoad(options) {
    console.log(options, '接收参数----日志')
    this.getSheetDetailById(options.id)
  },
  methods: {
    //获取随访单详情
    async getSheetDetailById(id) {
      const res = await getSheetDetailById({
        id,
        sign: 0,
      })
      this.resultInfo = res
      let result = res.result ? JSON.parse(res.result.result) : []
      this.resultInfo.questionList = res.questionList.map(item => {
        return {
          ...item,
          value:
            result.length > 0
              ? item.questionType == 'CHECKBOX'
                ? result
                    .filter(t => item.id == t.qsId)[0]
                    .csId.split(',')
                    .map(s => parseInt(s))
                : item.questionType == 'RADIO'
                ? parseInt(result.filter(t => item.id == t.qsId)[0].csId)
                : result.filter(t => item.id == t.qsId)[0].result
              : null,
        }
      })
    },
    //选项变化
    radioChange(e, val, i) {
      console.log(e, val)
      this.resultInfo.questionList[i].value = parseInt(e.detail.value)
      // val.value = parseInt(e.detail.value)
    },
    checkboxChange(e, val, i) {
      console.log(e, val)
      // val.value = e.detail.value
      this.resultInfo.questionList[i].value = e.detail.value
    },
    //查看问题说明
    handleSeeMsg(val) {
      console.log(val, '查看问题说明----日志')
      uni.showModal({
        title: '问题说明',
        content: val.remark,
        showCancel: false,
      })
    },
    toAskFollow(id) {
      console.log()
      uni.navigateTo({
        url: `/pages-sf/src/myFollow/folloOrder/askFollow?id=${this.resultInfo.followSheet.id}`,
      })
    },
    async submitForm(type) {
      console.log('0暂存1提交', type)
      const paramsArr = this.resultInfo.questionList.map(val => {
        return {
          result: val.questionType === 'TEXT' ? val.value : '',
          qsId: val.id,
          csId:
            val.questionType !== 'TEXT'
              ? val.questionType === 'CHECKBOX'
                ? val.value.join(',')
                : val.value
              : '',
        }
      })
      //查询是否所有答案都已填写
      const ischeckAll = paramsArr.some(val => {
        return (
          (val.result === '' || val.result === null) &&
          (val.csId === null || val.csId === '')
        )
      })
      if (ischeckAll) {
        uni.showToast({
          title: '请检查输入',
          icon: 'none',
        })
        return
      }
      const params = {
        fsId: this.resultInfo.followSheet.id,
        mId: this.resultInfo.followSheet.mId,
        opId: this.resultInfo.followSheet.opId,
        type: this.resultInfo.followSheet.type,
        result: JSON.stringify(paramsArr),
        sign: 0,
      }
      console.log(params, '请求参数------')
      await saveSel(params)
      uni.showToast({
        title: '保存成功！',
      })
      setTimeout(() => {
        uni.navigateBack()
        uni.$emit('updateList')
      }, 500)
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  padding: 10px;
}
.app-card {
  margin-top: 10px;
  margin-bottom: 40px;
  .list-item {
    padding: 10px 0;
    border-bottom: 1px solid #ededed;
    font-size: 16px;
    > view {
      display: flex;
      line-height: 28px;
    }
    .label {
      color: #666;
    }
    .value {
      color: #333;
    }
  }
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .order-num {
    font-size: 16px;
    color: #333;
    display: flex;
  }
  .status {
    width: 50px;
    height: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ededed;
    color: #666666;
  }
}
.tags-msg {
  display: flex;
  align-items: center;
  .mini-tag {
    display: inline-block;
    padding: 1px 4px;
    background: #cef0f3;
    color: #0ab2c1;
    margin-right: 6px;
    font-size: 12px;
  }
  .order-msg {
    font-size: 12px;
    color: #666;
  }
}
.content-card {
  background: #f2f2f2;
  // height: 400px;
  border-radius: 5px;
  padding: 10px;
}
.uni-list-cell-pd {
  justify-content: start;
  padding: 5px 10px;
  radio {
    transform: scale(0.8);
    color: $uni-color-primary;
  }
}
.uni-list-cell::after {
  height: 0;
}
.inputStyle {
  background: #fff;
  height: 36px;
  margin-top: 5px;
  text-indent: 10px;
}
.radio-group {
  display: flex;
}
.btns {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .mini-btn {
    padding: 4px 12px;
    border: 1px solid #0ab2c1;
    color: #0ab2c1;
    border-radius: 20px;
    min-width: 54px;
    text-align: center;
  }
  .other-btn-class {
    padding: 0;
    width: 100%;
    height: 44px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0ab2c1;
    color: #fff;
    border-radius: 0;
  }
  .submit {
    background: #0ab2c1;
    color: #fff;
  }
}
.title-msg {
  width: 15px;
  height: 15px;
  font-size: 10px;
  display: flex;
  border-radius: 50%;
  border: 1px solid #666;
  justify-content: center;
  align-items: center;
}
</style>
