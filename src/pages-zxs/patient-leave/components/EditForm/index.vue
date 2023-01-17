<template>
  <view class="edit-form">
    <uni-forms
      ref="valiForm"
      :rules="rules"
      :modelValue="form"
      :label-width="80"
    >
      <view style="color:#999">
        {{
          `[${form.cardNo}]${form.patientName}｜${form.gender || '-'}｜${
            form.phone
          }`
        }}</view
      >
      <view style="color:#999">
        {{
          `${form.entryName}｜${form.reservationDate.slice(0, 10)} ${
            form.reservationDtime
          }｜¥${form.cost}`
        }}
      </view>
      <template v-if="type">
        <uni-forms-item label="退款方式" required name="refundWay">
          <uni-data-select
            @change="changeSelect"
            v-model="form.refundWay"
            :localdata="selectData"
          />
        </uni-forms-item>
        <!-- 顺延时间 -->
        <uni-forms-item
          v-if="selectVal == 1"
          label="顺延时间"
          required
          name="scheduleDate"
        >
          <uni-data-select
            @change="changeSelectDate"
            v-model="form.scheduleDate"
            :localdata="dateList"
          />
          <!-- 顺延时段 -->
        </uni-forms-item>
        <uni-forms-item
          v-if="selectVal == 1"
          label="顺延时段"
          name="scheduleId"
        >
          <!-- <uni-easyinput v-model="form.scheduleDate" placeholder="请输入" /> -->
          <uni-data-select v-model="form.scheduleId" :localdata="timeList" />
        </uni-forms-item>
      </template>
      <uni-forms-item label="操作理由" name="remark">
        <uni-easyinput
          type="textarea"
          v-model="form.remark"
          placeholder="请输入操作理由"
        />
      </uni-forms-item>
    </uni-forms>
  </view>
</template>
<script>
import uniForms from '@/pages-zxs/uni_modules/uni-forms/components/uni-forms/uni-forms'
import uniFormsItem from '@/pages-zxs/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item'
import uniDataSelect from '@/pages-zxs/uni_modules/uni-data-select/components/uni-data-select/uni-data-select'
import uniEasyinput from '@/pages-zxs/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput'
import { getScheduleListByDeptDoctorPeriod } from '@/pages-zxs/api/closeApply'
import dayjs from 'dayjs'
export default {
  components: {
    uniForms,
    uniFormsItem,
    uniDataSelect,
    uniEasyinput,
  },
  props: {
    type: {
      type: Boolean,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      selectVal: 1,
      selectData: [
        { value: 1, text: '不退费' },
        { value: 2, text: '原路退回' },
        { value: 3, text: '线下退款' },
      ],
      postDateList: [], //顺延数据
      dateList: [], //可选日期
      timeList: [], //可选时段
      form: {
        refundWay: 1,
        scheduleId: '',
        scheduleDate: '',
        remark: '',
      },
      rules: {
        refundWay: {
          rules: [{ required: true, errorMessage: '退款方式不能为空' }],
        },
        scheduleId: {
          rules: [{ required: true, errorMessage: '顺延时间不能为空' }],
        },
        remark: {
          rules: [{ required: true, errorMessage: '操作理由不能为空' }],
        },
      },
      scheduleId: '',
    }
  },
  watch: {
    data() {
      this.form = this.data
      this.getPostDateList()
    },
  },
  mounted() {
    // this.getPostDateList()
  },
  methods: {
    //获取顺延日期
    async getPostDateList() {
      const params = {
        deptId: this.data.deptId,
        doctorId: this.data.docId,
        itemId: this.data.entryId,
      }
      const res = await getScheduleListByDeptDoctorPeriod(params)
      console.log(this.data.reservationDate)
      this.postDateList = res //顺延数据
      const keys = []
      this.dateList = res
        .filter(item =>
          dayjs(item.scheduleDate).isAfter(this.data.reservationDate),
        )
        .reduce((pre, next) => {
          if (!keys.includes(next.scheduleDate)) {
            keys.push(next.scheduleDate)
            pre.push({
              value: next.scheduleDate,
              text: next.scheduleDate,
            })
          }
          return pre
        }, [])
      console.log(this.dateList, '----日期数据')
    },
    //选择退款方式
    changeSelect(val) {
      this.selectVal = val
    },
    //选择日期
    changeSelectDate(val) {
      //筛选时段
      this.timeList = this.postDateList
        .filter(v => v.scheduleDate === val)
        .map(v => {
          return {
            text: v.startTime + '-' + v.endTime,
            value: v.id,
          }
        })
      console.log(this.timeList, '时段数据-----')
    },
    submit() {
      this.$refs['valiForm']
        .validate()
        .then(res => {
          this.$emit('success', res)
          this.form = Object.assign(this.form, {
            refundWay: 1,
            scheduleId: '',
            scheduleDate: '',
            remark: '',
          })
        })
        .catch(err => {
          console.log('err', err)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .uni-forms {
  width: 600rpx !important;
}
.edit-form {
  width: 100%;
  padding: 20rpx 20rpx 0;
  box-sizing: border-box;
  ::v-deep .uni-select {
    width: 100%;
  }
  ::v-deep .uni-stat__select {
    padding: 0;
  }
  ::v-deep .uni-select__input-text {
    width: 100%;
    padding-left: 10rpx;
  }
  ::v-deep .uni-select__input-placeholder {
    font-size: 24rpx;
    color: #999999;
  }
}
</style>
