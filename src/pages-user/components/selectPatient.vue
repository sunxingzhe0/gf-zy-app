<template>
  <view>
    <view class="patient text-right" @click="$refs.popselect.open()">
      <text :style="textStyle">{{ patientName }}</text>
      <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
    </view>
    <pop-select
      ref="popselect"
      title="就诊人"
      :list="patients"
      :isother="isother"
      :otherList="otherList"
      @change="patientChange"
      @submit="patientSubmit"
    ></pop-select>
  </view>
</template>

<script>
import popSelect from '@/components/pop-select/index.vue'
import { otherPatient } from '../../pages-zy/api/user.js'//互联网医院目前无
import { patientList } from '@/common/request/userCenter.js'
export default {
  components: {
    popSelect,
  },
  props: {
    textStyle: {
      type: String,
      default: '',
    },
    isother: {
      type: Boolean,
      default: false,
    },
    payType: Boolean,
  },
  data() {
    return {
      patients: [],
      patientName: '',
      memberInfo: {},
      list: [],
      otherData: [],
      otherList: [],
    }
  },
  created() {
    this.getPatientList()
  },
  methods: {
    patientChange(row) {
      // if (row.type == 'other') {
      //   this.patientName = this.otherData
      //     .filter(item => item.memberId == row.data)
      //     .map(t => t.name)
      //     .join(',')
      //   this.memberInfo = this.otherData.filter(
      //     item => item.memberId == row.data,
      //   )
      // } else {
        this.patientName = this.list
          .filter(item => item.memberId == row)
          .map(t => t.name)
          .join(',')


        this.memberInfo = this.list.filter(item => item.memberId == row)[0]
      // }
    },
    patientSubmit() {

      this.$emit('patientLoad', this.memberInfo)
      this.$refs.popselect.close()
    },
    async getPatientList() {
      const list = await patientList()
      this.list = list
      this.patients = list.map(item =>
        Object.assign(item, {
          value: item.memberId,
          checked: item.def,
        }),
      )

      this.memberInfo = list.find(item => item.checked) || list[0]
      this.patientName = this.memberInfo.name
      if (this.isother) {
        this.getotherPatient()
      }
      this.$emit('patientLoad', this.memberInfo)
    },
    async getotherPatient() {
      const data = await otherPatient({ payType: this.payType })
      this.otherData = [...data]
      this.otherList = data.map(item =>
        Object.assign(item, {
          value: item.id,
          checked: item.def,
        }),
      )
    },
  },
}
</script>

<style></style>
