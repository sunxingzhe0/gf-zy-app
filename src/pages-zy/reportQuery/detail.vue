<template>
  <view style="padding: 20rpx;">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
      <app-list-item
        :label="type == 0 ? '检查项目' : '检验项目'"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      ></app-list-item>
      <view style="padding: 30rpx;padding-left: 0;">{{
        infoData.labItemName || infoData.reportTitle
      }}</view>
    </app-card>
    <app-card class="panWrap" styles="padding: 0;padding-left:30rpx;">
      <!-- <app-list-item
        :label="type == 0 ? '诊断报告' : '检验报告'"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      ></app-list-item> -->
      <app-list-item
        label="报告时间"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right">{{ infoData.reportDtime || '-' }}</view>
      </app-list-item>
      <app-list-item
        label="报告医生"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right">{{
          infoData.reportDocName || infoData.reportorName || '-'
        }}</view>
      </app-list-item>
      <app-list-item
        label="检查描述"
        v-if="type == 0"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view
          class="flex_1 text-right flex-end-start"
          @click="isexamDesc = !isexamDesc"
        >
          <view
            style="text-align:left;width: 235px;"
            :class="!isexamDesc ? 'text-overflow' : ''"
          >
            {{ infoData.examDesc || '-' }}
          </view>
          <uni-icons
            :type="!isexamDesc ? 'arrowright' : 'arrowdown'"
            color="#666"
            size="14"
          ></uni-icons>
        </view>
      </app-list-item>
      <app-list-item
        label="报告诊断"
        v-if="type == 0"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view
          class="flex_1 text-right flex-end-start"
          @click="isexamResult = !isexamResult"
        >
          <view
            style="text-align:left;width: 235px;"
            :class="!isexamResult ? 'text-overflow' : ''"
          >
            {{ infoData.examResult || '-' }}
          </view>
          <uni-icons
            :type="!isexamResult ? 'arrowright' : 'arrowdown'"
            color="#666"
            size="14"
          ></uni-icons>
        </view>
      </app-list-item>
    </app-card>
    <app-card
      class="panWrap"
      v-if="type == 0 && infoData.ctVideo"
      styles="padding: 0;padding-left:30rpx;"
    >
      <app-list-item
        label="检查影像"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      ></app-list-item>
      <app-list-item
        label="影像"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view
          class="flex_1 text-right"
          @click="goto('/pages-zy/reportQuery/ctImg')"
          >{{ infoData.ctVideo || '' }}
          <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
        </view>
      </app-list-item>
    </app-card>
    <app-card
      class="panWrap"
      v-if="type == 1"
      styles="padding: 0;padding-left:30rpx;"
    >
      <app-list-item
        label="检验信息"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right" @click="isOpen = !isOpen"
          >{{ isOpen ? '收起' : '展开' }}
          <uni-icons
            :type="!isOpen ? 'arrowright' : 'arrowdown'"
            color="#666"
            size="14"
          ></uni-icons>
        </view>
      </app-list-item>
      <block v-if="isOpen">
        <app-list-item
          label="患者姓名"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.name || '' }}</view>
        </app-list-item>
        <app-list-item
          label="性别"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.sex == 1
              ? '男'
              : infoData.sex == 0
              ? '女'
              : infoData.sex
              ? infoData.sex
              : '-'
          }}</view>
        </app-list-item>
        <app-list-item
          label="年龄"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.age || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="检验号"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.reportNo || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="检验时间"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.labDtime || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="标本类型"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.specType || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="申请科室"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.applyDeptName || '-'
          }}</view>
        </app-list-item>
        <app-list-item
          label="申请医生"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.applyDocName || '-'
          }}</view>
        </app-list-item>
        <app-list-item
          label="申请时间"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.applyDtime || '-'
          }}</view>
        </app-list-item>
      </block>
    </app-card>
    <app-card
      class="panWrap"
      v-if="type == 0"
      styles="padding: 0;padding-left:30rpx;"
    >
      <app-list-item
        label="检查信息"
        :styles="{ padding: '30rpx', paddingLeft: 0 }"
      >
        <view class="flex_1 text-right" @click="isOpen = !isOpen"
          >{{ isOpen ? '收起' : '展开' }}
          <uni-icons
            :type="!isOpen ? 'arrowright' : 'arrowdown'"
            color="#666"
            size="14"
          ></uni-icons>
        </view>
      </app-list-item>
      <block v-if="isOpen">
        <app-list-item
          label="患者姓名"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.name || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="性别"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.sex == 1
              ? '男'
              : infoData.sex == 0
              ? '女'
              : infoData.sex
              ? infoData.sex
              : '-'
          }}</view>
        </app-list-item>
        <app-list-item
          label="年龄"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.age || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="检查号"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.reportNo || '-' }}</view>
        </app-list-item>
        <app-list-item
          label="检查时间"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.examDtime || '-' }}</view>
        </app-list-item>
        <!-- <app-list-item
          label="设备类型"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.equipment || '-' }}</view>
        </app-list-item> -->
        <app-list-item
          label="申请科室"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.applyDeptName || '-'
          }}</view>
        </app-list-item>
        <app-list-item
          label="申请医生"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.applyDocName || '-'
          }}</view>
        </app-list-item>
        <app-list-item
          label="申请时间"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.applyDtime || '-'
          }}</view>
        </app-list-item>
        <!-- <app-list-item
          label="病人主诉"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{ infoData.patientcp || '-' }}</view>
        </app-list-item> -->
        <!-- <app-list-item
          label="临床诊断"
          :styles="{ padding: '30rpx', paddingLeft: 0 }"
        >
          <view class="flex_1 text-right">{{
            infoData.clinicDiag || '-'
          }}</view>
        </app-list-item> -->
      </block>
    </app-card>
    <app-card styles="padding: 30rpx;" class="detail" v-if="type == 1">
      <view class="table">
        <view class="thbody">
          <view class="th">NO</view>
          <view class="th">项目名称</view>
          <view class="th">结果值</view>
          <view class="th" style="width:18%;">参考值</view>
          <view class="th">单位</view>
        </view>
        <view v-for="(item, index) in examineList" :key="index" class="tdbody">
          <view class="td">{{ index + 1 }}</view>
          <view class="td">{{ item.itemName }}</view>
          <view class="td"
            ><text :class="item.prompt ? 'red' : ''">{{
              item.labResultNum || '-'
            }}</text>
            <text v-if="item.prompt" class="red">{{ item.prompt }}</text></view
          >
          <view class="td">{{ item.reference || '-' }}</view>
          <view class="td">{{ item.unit || '-' }}</view>
        </view>
      </view>
    </app-card>
  </view>
</template>
<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import { examine, inspect, examineDetail } from '../api/outpatient'
export default {
  components: {
    AppCard,
    AppListItem,
  },
  data() {
    return {
      isOpen: false,
      labType: '',
      labNo: '',
      infoData: {},
      examineList: [],
      type: '',
      cardNo: '',
      endDate: '',
      beginDate: '',
      isexamDesc: true,
      isexamResult: true,
      visitNo: '',
    }
  },
  onLoad(option) {
    this.labType = option.labType
    this.labNo = option.labNo
    this.type = option.type
    this.cardNo = option.cardNo
    this.endDate = option.endDate
    this.beginDate = option.beginDate
    if (this.type == 1) {
      this.getexamine()
      this.getexamineDetail()
    } else {
      this.getinspectList()
    }
  },
  methods: {
    // 获取检查详情
    async getinspectList() {
      let infoData = await inspect({
        visitNo: this.labNo,
        cardNo: this.cardNo,
        beginDate: this.beginDate + ' 00:00:00',
        endDate: this.endDate + ' 23:59:59',
      })
      this.infoData = infoData
    },
    //获取检验明细
    async getexamine() {
      this.examineList = await examine({
        visitNo: this.visitNo,
        labNo: this.labNo,
      })
    },
    // 获取检验详情
    async getexamineDetail() {
      this.infoData = await examineDetail({
        labType: this.labType,
        reportNo: this.labNo,
        cardNo: this.cardNo,
      })
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      })
    },
    noOpen() {
      this.TIP('该功能暂未开放！')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/common/order.scss';
.title {
  flex: none;
  width: 170px;
}

.detail {
  .table {
    width: 100%;
    display: table;
    border: 1px solid #e6e6e6;
    border-right: 0;
    border-bottom: 0;
    text-align: center;
    font-size: 24rpx;
    .thbody {
      display: table-header-group;

      .th {
        display: table-cell;
        border: 1px solid #e6e6e6;
        color: #666;
        border-top: 0;
        border-left: 0;
        padding: 10rpx;
        vertical-align: middle;
      }
    }
    .tdbody {
      display: table-row-group;
      .td {
        padding: 10rpx;
        display: table-cell;
        border: 1px solid #e6e6e6;
        border-top: 0;
        border-left: 0;
        vertical-align: middle;
        .red {
          color: red;
        }
      }
    }
  }
}
</style>
