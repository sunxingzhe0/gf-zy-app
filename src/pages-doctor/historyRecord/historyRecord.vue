<template>
  <view>
    <!--主页按钮-->
    <homeIcom />
    <view class="app-card">
      <view class="cell-label">患者信息</view>
      <view class="flex-between">
        <view class="">就诊人：{{ info.patientName || '' }}</view>
        <view class="">性别：{{ info.sexDesc || '' }}</view>
        <view class="">年龄：{{ info.patientAge || 0 }}岁</view>
      </view>
      <view class="">病情自述：</view>
      <view class="">{{ info.illnessDesc }}</view>
      <view class="flex-start-center">
        <image v-for="p in info.pic" :key="p" class="diagnosis-image" :src="FILE_URL(p)"
          mode="aspectFit"></image>
      </view>
    </view>
    <view class="app-card">
      <view class="flex-between cell">
        <view class="cell-label">2020-02-11</view>
        <view class="">{{ info.doctorName }} {{ info.deptName }}</view>
      </view>
      <view class="cell">
        <view class="cell-label">诊断</view>
        <view class="">{{ info.diagnose }}</view>
        <!-- <view class="flex-between">
          <view @click="showExpand = !showExpand">
            {{ showExpand ? '收回' : '更多' }}
            <image class="more__icon" :class="{ reverse: showExpand }" :src="require('@/assets/zhankaihui@2x.png')"
              mode="aspectFit"></image>
          </view>
        </view> -->
      </view>
      <view class="cell">
        <view class="flex-between">
          <view class="cell-label">医嘱记录：</view>
          <view @click="info.rpShow = !info.rpShow">
            {{ info.rpShow ? '收回' : '展开' }}
            <image class="more__icon" :class="{ reverse: info.rpShow }" :src="require('@/assets/zhankaihui@2x.png')"
              mode="aspectFit"></image>
          </view>
        </view>
        <view v-for="rp in info.rpList" :key="rp.rpNo">
          <view class="cell-label">处方记录：</view>
          <view class="prescription-item">
            <view class="flex-between">
              <view class="">处方号：{{ rp.rpNo }}</view>
              <view class="">已通过</view>
            </view>
            <view class="flex-between">
              <view class="">医生：{{ rp.doctorName }} {{ rp.title }}</view>
              <view class="">创建时间：{{ rp.submitTime }}</view>
            </view>
            <view class="flex-between">
              <view class="">审方医生：{{ rp.auditName }} {{ rp.auditTitle }}</view>
              <view class="">审方时间：{{ rp.auditTime }}</view>
            </view>
            <view class="flex-between">
              <view class="">西药：{{ rp.westFee }}</view>
              <view class="">中成药：{{ rp.chPatentFee }}</view>
              <view class="">
                合计：
                <text class="color-orange">{{ rp.rpFee }}</text>
              </view>
            </view>
            <view class="flex-between">
              <view class="">数量：{{ rp.drugNumber }}</view>
              <view @click="info.drugShow = !info.drugShow">
                {{ info.drugShow ? '收起处方' : '展开处方' }}
                <image class="more__icon" :class="{ reverse: info.drugShow }"
                  :src="require('@/assets/zhankaihui@2x.png')" mode="aspectFit"></image>
              </view>
            </view>
            <view class="drug-item" v-for="drug in rp" :key="drug.id">
              <view class="flex-between">
                <view class="">{{ drug.name }}(规格：{{ drug.spec }}) x{{ drug.total }}</view>
                <view class="">医保：{{ drug.medicare }}</view>
              </view>
              <view class="color-orange">{{ drug.useWays }} {{ drug.useFrequency }}，{{ drug.singleDose }}/次</view>
              <view class="">备注：{{ drug.remark }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="cell">
        <view class="flex-between">
          <view class="cell-label">检查报告</view>
          <view @click="info.examInfoShow = !info.examInfoShow">
            {{ info.examInfoShow ? '收回' : '展开' }}
            <image class="more__icon" :class="{ reverse: info.examInfoShow }"
              :src="require('@/assets/zhankaihui@2x.png')" mode="aspectFit"></image>
          </view>
        </view>
        <view class="drug-item" v-for="exam in info.examInfoList" :key="exam.reportNo">
          <view class="flex-between">
            <view class="">报告编号：{{exam.reportNo}}</view>
            <view class="color-primary">{{exam.name}}</view>
          </view>
          <view style="font-size: 32rpx;">{{exam.clinicDiag}}</view>
          <view class="flex-between">
            <view class="">申请医生：{{exam.applyDocName}}</view>
            <view class="">申请时间：{{exam.applyDtime}}</view>
          </view>
          <view class="flex-between">
            <view class="">报告医生：{{exam.examDoctorName}}</view>
            <view class="">报告时间：{{exam.reportDtime}}</view>
          </view>
        </view>
      </view>
      <view class="cell">
        <view class="flex-between">
          <view class="cell-label">检验报告</view>
          <view @click="info.labInfoShow = !info.labInfoShow">
            {{ info.labInfoShow ? '收回' : '展开' }}
            <image class="more__icon" :class="{ reverse: info.labInfoShow }"
              :src="require('@/assets/zhankaihui@2x.png')" mode="aspectFit"></image>
          </view>
        </view>
        <view class="drug-item" v-for="exam in info.labInfoList" :key="exam.reportNo">
          <view class="flex-between">
            <view class="">报告编号：{{exam.reportNo}}</view>
            <view class="color-primary">{{exam.name}}</view>
          </view>
          <view style="font-size: 32rpx;">{{exam.clinicDiag}}</view>
          <view class="flex-between">
            <view class="">申请医生：{{exam.applyDocName}}</view>
            <view class="">申请时间：{{exam.applyDtime}}</view>
          </view>
          <view class="flex-between">
            <view class="">报告医生：{{exam.examDoctorName}}</view>
            <view class="">报告时间：{{exam.reportDtime}}</view>
          </view>
        </view>
      </view>
      <view class="cell">
        <view class="flex-between">
          <view class="cell-label">患者病历</view>
          <view @click="info.medicalRecordShow = !info.medicalRecordShow">
            {{ info.medicalRecordShow ? '收起' : '展开' }}
            <image class="more__icon" :class="{ reverse: info.medicalRecordShow }"
              :src="require('@/assets/zhankaihui@2x.png')" mode="aspectFit"></image>
          </view>
        </view>
        <view>
          <text class="">病历编号</text>
          <text class="ml-50">{{info.medicalRecord.visitNo}}</text>
        </view>
        <view>
          <text class="">就诊人</text>
          <text class="ml-50">{{info.patientName}}</text>
        </view>
        <view>
          <text class="">诊疗类型</text>
          <text class="ml-50">{{info.medicalRecord.medicalType}}</text>
        </view>
        <view>
          <text class="">就诊时间</text>
          <text class="ml-50">{{info.medicalRecord.visitTime}}</text>
        </view>
        <template>
          <view class="mt-20" :key="item">主诉：</view>
          <view style="color: #666;">{{info.medicalRecord.chiefComplaint}}</view>
          <view class="mt-20" :key="item">现病史：</view>
          <view style="color: #666;">{{info.medicalRecord.currentDisease}}</view>
          <view class="mt-20" :key="item">体格检查：</view>
          <view style="color: #666;">{{info.medicalRecord.checkupExam}}</view>
          <view class="mt-20" :key="item">辅助检查：</view>
          <view style="color: #666;">{{info.medicalRecord.auxiliaryExam}}</view>
          <view class="mt-20" :key="item">诊断：</view>
          <view style="color: #666;">{{info.medicalRecord.diagDesc}}</view>
          <view class="mt-20" :key="item">处理意见：</view>
          <view style="color: #666;">{{info.medicalRecord.advice}}</view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    medicalDetail
  } from '@/common/request';
  export default {
    data() {
      return {
        showExpand: false,
        info: {
          medicalRecord: {}
        }
      };
    },
    onLoad(options) {
      this.getData(options.medicalId);
    },
    methods: {
      getData(medicalId) {
        medicalDetail({
          medicalId
        }).then(data => {
          this.info = {
            ...data,
            rpShow: false,
            drugShow: false,
            examInfoShow: false,
            labInfoShow: false,
            medicalRecordShow: false
          };
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .color-orange {
    color: #e45b5b;
  }

  .color-primary {
    color: $uni-color-primary;
  }

  .app-card {
    margin: 20rpx 20rpx 0;
  }

  .cell-label {
    font-size: 32rpx;
    color: #666;
  }

  .diagnosis-image {
    margin-right: 20rpx;
    width: 203rpx;
    height: 203rpx;
    border-radius: 8rpx;
  }

  .more__icon {
    width: 21rpx;
    height: 20rpx;
    margin-left: 8rpx;
  }

  .cell {
    padding: 32rpx 0;

    +.cell {
      border-top: 2rpx solid #eee;
    }
  }

  .drug-item {
    padding: 20rpx;
    background-color: #f1f1f1;
    font-size: 24rpx;
  }
</style>
