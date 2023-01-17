<template>
  <view>
    <!-- 挂号付费页禁用就诊人选择 -->
    <view
      class="patient text-right"
      @click="!disabled ? $refs.popselect.open() : () => {}"
    >
      <text :style="textStyle">{{ patientName }}</text>
      <uni-icons
        v-if="!disabled"
        type="arrowright"
        color="#666"
        size="14"
      ></uni-icons>
    </view>
    <pop-select
      ref="popselect"
      title="健康卡"
      :list="patients"
      :isother="isother"
      :otherList="otherList"
      @change="patientChange"
      @submit="patientSubmit"
    ></pop-select>
  </view>
</template>

<script>
import { autoSyncUserCard } from '@/common/request/index.js'
import popSelect from './pop-select/index.vue'
import { otherPatient } from '../api/user.js'
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
    disabled: {
      type: Boolean,
      default: false,
    },
    isother: {
      type: Boolean,
      default: false,
    },
    inperId: {
      type: String,
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
  mounted() {
    uni.$on('updateCard', async () => {
      const list = await patientList()
      this.list = list
      this.patients = list.map(item =>
        Object.assign(item, {
          value: item.memberId,
          checked: this.inperId
            ? item.memberId === this.inperId
              ? true
              : false
            : item.def,
        }),
      )
    })

    //
    // uni.$on('changeType', data => {
    //   console.log(data, '收到的值')
    //   if (data) {
    //     this.otherList.forEach(v => {
    //       v.checked = false
    //     })
    //   } else {
    //     this.patients.forEach(v => {
    //       v.checked = false
    //     })
    //   }
    //   this.$forceUpdate()
    // })
  },
  methods: {
    //自动更新就诊卡
    async handleAutoSyncUserCard(memberId) {
      await autoSyncUserCard({ memberId })
    },
    patientChange(row) {
      if (row.type == 'other') {
        console.log(row, this.otherData, 'other=-=-')
        this.patientName = this.otherData
          .filter(item => item.id == row.data)
          .map(t => t.name)
          .join(',')
        this.memberInfo = this.otherData.filter(item => item.id == row.data)[0]
        if (this.memberInfo) {
          this.memberInfo = Object.assign(this.memberInfo, {
            otherPatient: 1,
          })
        }
        //取消勾选
        this.patients = this.patients.map(item =>
          Object.assign(item, {
            value: item.memberId,
            checked: false,
          }),
        )
        this.otherList = this.otherList.map(item =>
          Object.assign(item, {
            value: item.id,
            checked: false,
          }),
        )
        //gouxuan
        if (row.data) {
          this.otherList.forEach(v => {
            if (v.id == row.data) {
              v.checked = true
            }
          })
        }
      } else {
        this.patientName = this.list
          .filter(item => item.memberId == row.data)
          .map(t => t.name)
          .join(',')
        this.memberInfo = this.list.filter(item => item.memberId == row.data)[0]
        //取消勾选
        if (this.otherList.length) {
          this.otherList = this.otherList.map(item =>
            Object.assign(item, {
              value: item.id,
              checked: false,
            }),
          )
          this.patients = this.patients.map(item =>
            Object.assign(item, {
              value: item.memberId,
              checked: false,
            }),
          )
          //gouxuan
          if (row.data) {
            this.patients.forEach(v => {
              if (v.memberId == row.data) {
                v.checked = true
              }
            })
          }
        }
      }
    },
    patientSubmit() {
      this.$emit('patientLoad', this.memberInfo)
      this.handleAutoSyncUserCard(this.memberInfo.memberId)
      this.$refs.popselect.close()
    },
    async getPatientList() {
      console.log('>>>>>>>>>>>>')
      const list = await patientList()
      if (list.every(v => !v.def)) {
        list[0].def = true
      }
      this.list = list
      this.patients = list.map(item =>
        Object.assign(item, {
          value: item.memberId,
          checked: this.inperId
            ? item.memberId === this.inperId
              ? true
              : false
            : item.def,
        }),
      )
      console.log(this.patients, this.inperId)
      this.memberInfo = this.patients.find(item => item.checked) || list[0]
      console.log('>>>>结果>>>>>>>>', this.memberInfo)
      this.patientName = this.memberInfo.name
      if (this.isother) {
        this.getotherPatient()
      }
      this.$emit('patientLoad', this.memberInfo)
      this.handleAutoSyncUserCard(this.memberInfo.memberId)
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
