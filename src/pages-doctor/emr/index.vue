<template>
  <view class="emrWrap">
    <app-card styles="padding: 40rpx 30rpx;">
      <view class="emrInfo">
        <view class="flex-start-center">
          <view class="title">病历编号</view>
          <view class="value">{{ emrData.diseId || '-' }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">就诊人</view>
          <view class="value">{{ emrData.medicalName }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">诊疗类型</view>
          <view class="value">{{ emrData.medicalType }}</view>
        </view>
        <view class="flex-start-center">
          <view class="title">就诊时间</view>
          <view class="value">{{ emrData.medicalTime || '-' }}</view>
        </view>
      </view>
    </app-card>
    <app-card
      v-for="(item, index) in tabs"
      :key="index"
      styles="padding: 40rpx 30rpx;"
    >
      <view class="title">
        <text style="color:red">*</text>{{ item.label }}</view
      >
      <view class="content">
        <block v-if="item.name == 'dtoList'">
          <view v-for="(dtoItem, index) in emrData.dtoList" :key="dtoItem.id">
            <text
              >{{ index + 1 }}. {{ dtoItem.prefixName || ''
              }}{{ dtoItem.diagnosisName || '' }}
              {{ dtoItem.suffixName || '' }} ({{
                dtoItem.mainDiagnosis === 1 ? '主诊断' : '诊断'
              }}){{ !dtoItem.childDtos.length ? '；' : '，' }}
            </text>
            <text v-for="child in dtoItem.childDtos" :key="child.indexCode">
              {{ child.prefixName }} {{ child.diagnosisName }}
              {{ child.suffixName }} (子诊断)；
            </text>
          </view>
        </block>
        <view v-else>
          <view v-if="emrData.diseId">{{ emrData[item.name] || '' }}</view>
          <textarea
            v-show="!emrData.diseId && isItemText"
            class="text"
            :maxlength="item.name == 'mainSuit' ? 20 : 3000"
            v-model="emrData[item.name]"
            placeholder="请输入"
          />
        </view>
      </view>
      <view class="editBtn flex-justify-end">
        <view @click="editRecordTap(item)" v-if="emrData.diseId">修改记录</view>
        <view class="on" @click="editTap(item)">{{
          emrData.diseId ? '修改' : item.name == 'dtoList' ? '编辑' : '保存'
        }}</view>
      </view>
    </app-card>
    <view class="emrBtn flex-justify-end">
      <view class="typesItem" @click="templateTap">导入模板</view>
      <view class="typesItem" v-if="emrData.diseId" @click="editRecordTap()"
        >提交记录</view
      >
      <view class="typesItem on" @click="submit">提交</view>
    </view>
    <uni-popup ref="edit">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">修改{{ thatInfo.label }}</view>
          <view class="popText">
            <textarea
              v-show="istextarea"
              :maxlength="thatInfo.name == 'mainSuit' ? 20 : 3000"
              class="textMain"
              placeholder="请输入"
              placeholder-style="font-size:26rpx; color:#666;"
              v-model="content"
            ></textarea>
            <!-- <view class="textNum">{{ content.length || 0 }}/200</view> -->
          </view>
        </view>
        <view class="pop-btn flex-between">
          <view
            class="close flex_1"
            @click="
              this.$refs.edit.close()
              istextarea = false
            "
            >取消</view
          >
          <view class="flex_1" @click="save()">保存</view>
        </view>
      </view>
    </uni-popup>
    <!--修改记录-->
    <edit-record
      ref="editRecord"
      :title="thatInfo.label"
      :orderId="orderId"
      :type="thatInfo.type"
      :diseaseId="emrData.diseaseId"
    ></edit-record>
    <!--导入模板-->
    <templet-list
      @popChange="popChange"
      ref="templetList"
      @importTem="importTem"
    ></templet-list>
    <!--修改诊断-->
    <diagnosis
      @popChange="popChange"
      ref="diagnosis"
      :orderIdP="orderId"
      :memberIdP="memberId"
      @diagnosisChange="diagnosisChange"
    ></diagnosis>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import EditRecord from './editRecord.vue'
import templetList from './templetList.vue'
import diagnosis from '../diagnosis/index.vue'
import {
  findDiseaseInClinic,
  importDiseaseTemp,
  saveDiseaseTemp,
  submitDisease,
  addChangeRecord,
  backDiseaseTempInfo,
  findDiagnosisInClinic,
} from '@/common/request/doctorRoom.js'
export default {
  components: {
    AppCard,
    EditRecord,
    templetList,
    diagnosis,
  },
  data() {
    return {
      orderId: '',
      memberId: '',
      createTime: '',
      sessionId: '',
      userId: '',
      wayType: '',
      emrData: {},
      content: '',
      thatInfo: {
        name: '',
        label: '',
        type: '',
      },
      isItemText: true,
      istextarea: false,
      tabs: [
        {
          name: 'dtoList',
          label: '诊断',
          type: 'DIAGNOSIS_INFO',
        },
        /* 病历修改前 */
        // {
        //   name: 'mainSuit',
        //   label: '主诉',
        //   type: 'MAIN_SUIT',
        // },
        // {
        //   name: 'nowDisease',
        //   label: '现病史',
        //   type: 'NOW_DISEASE',
        // },
        // {
        //   name: 'hisDisease',
        //   label: '既往史',
        //   type: 'HIS_DISEASE',
        // },
        // {
        //   name: 'phyCheck',
        //   label: '体格检查',
        //   type: 'PHYSICAL_CHECK',
        // },
        // {
        //   name: 'supCheck',
        //   label: '辅助检查',
        //   type: 'SUPPORT_CHECK',
        // },

        // {
        //   name: 'dealIdea',
        //   label: '处理意见',
        //   type: 'DEAL_IDEA',
        // },
        /* 病历修改后 */
        {
          name: 'seeWay',
          label: '就诊方式',
        },
        {
          name: 'illness',
          label: '病情',
        },
        {
          name: 'supCheck',
          label: '辅助检查',
        },
        {
          name: 'dealIdea',
          label: '处理意见',
          type: 'DEAL_IDEA',
        },
      ],
      isSubmit: false,
    }
  },
  onLoad(option) {
    this.orderId = option.orderId
    this.memberId = option.memberId
    this.createTime = option.createTime
    this.sessionId = option.sessionId
    this.wayType = option.wayType
    this.userId = option.userId
    this.getfindDiseaseInClinic()
  },
  onShow() {
    uni.$on('caBack', () => {
      this.isSubmit = true
    })
  },
  methods: {
    // 修改诊断
    async diagnosisChange(isInt) {
      if (isInt !== 1) {
        await addChangeRecord({
          orderId: this.orderId,
          changeType: this.thatInfo.type,
        })
      }
      let list = await findDiagnosisInClinic({
        orderId: this.orderId,
      })
      if (!list[0].childDtos) {
        list[0].childDtos = []
      }
      this.$set(this.emrData, 'dtoList', list)
      if (!isInt) {
        this.isItemText = false
      }
    },
    //导入模板
    async importTem(templateId) {
      let info = await backDiseaseTempInfo({
        templateId: templateId,
      })
      this.emrData.dealIdea = info.dealIdea
      this.emrData.mainSuit = info.mainSuit
      this.emrData.nowDisease = info.nowDisease
      this.emrData.hisDisease = info.hisDisease
      this.emrData.phyCheck = info.phyCheck
      this.emrData.supCheck = info.supCheck
      this.emrData.tempDesc = info.tempDesc
      this.emrData.seeWay = info.seeWay
      this.emrData.illness = info.illness
      uni.showToast({
        title: '导入成功！',
        icon: 'none',
      })
    },
    templateTap() {
      this.$refs.templetList.open()
      this.isItemText = false
    },
    //修改记录
    editRecordTap(item) {
      this.thatInfo = item
      this.$refs.editRecord.open(item)
    },
    // 获取病历信息
    async getfindDiseaseInClinic() {
      let data = await findDiseaseInClinic({
        orderId: this.orderId,
      })
      this.emrData = data
      this.diagnosisChange(1)
    },
    editTap(item) {
      this.thatInfo = item
      if (item.name == 'dtoList') {
        this.$refs.diagnosis.open()
      } else {
        if (this.emrData.diseId) {
          this.$refs.edit.open()
          this.content = this.emrData[item.name] || ''
          setTimeout(() => {
            this.istextarea = true
          }, 400)
        } else {
          this.save(item.name)
        }
      }
    },
    async save(title) {
      if (this.content == '' && !title) {
        uni.showToast({
          title: '内容不能为空',
          icon: 'none',
        })
        return false
      }
      if (this.emrData[title] == '' && !title) {
        uni.showToast({
          title: '内容不能为空',
          icon: 'none',
        })
        return false
      }
      if (!title) {
        this.emrData[this.thatInfo.name] = this.content
      }

      await saveDiseaseTemp({ ...this.emrData, orderId: this.orderId })

      await addChangeRecord({
        orderId: this.orderId,
        changeType: this.thatInfo.type,
      })

      uni.showToast({
        title: '修改成功',
        icon: 'none',
      })
      this.$refs.edit.close()
      this.getfindDiseaseInClinic()
    },
    popChange() {
      this.isItemText = true
    },
    async submit() {
      //病例提交
      // if (!this.isSubmit) {
      //   return uni.navigateTo({
      //     url: '/pages-doctor/autograph/autograph',
      //   })
      // }
      //检查必填项
      let canNext = true
      for (let val of this.tabs) {
        if (val.name === 'dtoList') {
          continue
        }
        if (!this.emrData[val.name]) {
          uni.showToast({
            title: `${val.label}不能为空`,
            icon: 'none',
          })
          canNext = false
          break
        }
      }
      if (!canNext) return
      await submitDisease({
        ...this.emrData,
        orderId: this.orderId,
        medicalTime: this.createTime,
        userId: this.memberId,
      })
      uni.showToast({
        title: '提交成功！',
        icon: 'none',
      })
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 2000)
    },
  },
}
</script>

<style lang="scss" scoped>
.popText {
  background: #f2f2f2;
  padding: 20rpx;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
  width: 100%;
  height: 300rpx;
  box-sizing: border-box;

  .textMain {
    width: 520rpx;
    height: 210rpx;
    font-size: 26rpx;
    line-height: 36rpx;
  }

  .textNum {
    text-align: right;
  }
}

.emrWrap {
  padding: 20rpx;
  padding-bottom: 120rpx;

  .title {
    font-size: 30rpx;
    color: #666666;
  }

  .emrInfo {
    .title {
      font-size: 26rpx;
      width: 200rpx;
    }
  }
  .content {
    font-size: 26rpx;
    line-height: 36rpx;
    min-height: 36rpx;
    margin: 40rpx 0;
    color: #1a1a1a;
    .text {
      height: 200rpx;
      border: 1px solid #e6e6e6;
      width: 100%;
      padding: 15rpx;
      border-radius: 10rpx;
      box-sizing: border-box;
    }
  }

  .editBtn {
    view {
      width: 152rpx;
      height: 60rpx;
      border-radius: 30rpx;
      border: 1px solid #999;
      margin-left: 20rpx;
      text-align: center;
      line-height: 58rpx;

      &.on {
        color: $uni-color-primary;
        border-color: $uni-color-primary;
      }
    }
  }

  .emrBtn {
    border-bottom: 1px solid #e5e5e5;
    height: 98rpx;
    width: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;

    .typesItem {
      padding: 8rpx 30rpx;
      border-radius: 20rpx;
      background: #f2f2f2;
      font-size: 24rpx;
      color: #666666;
      margin-left: 20rpx;

      &.on {
        background: $uni-color-primary;
        color: #fff;
      }
    }
  }
}
</style>
