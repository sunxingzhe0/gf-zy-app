<template>
  <view class="clinic-appointment">
    <preview
      v-if="step === 1"
      :order="order"
      :department="department"
      :doctorIndexArr="doctorIndex"
      @submit="submit"
      @change="step = 2"
    ></preview>
    <select-doctor
      v-else-if="step === 2"
      :department="department"
      :order="order"
      @change="selectDoctor"
      @changeDept="step = 3"
      @back="step = 1"
    ></select-doctor>
    <select-department
      v-else
      @change="selcetDepartment"
      @back="step = 2"
    ></select-department>
  </view>
</template>

<script>
import Preview from './preview'
import SelectDoctor from './select-doctor'
import SelectDepartment from './select-department'
export default {
  props: {
    order: Object,
  },
  components: {
    Preview,
    SelectDoctor,
    SelectDepartment,
  },
  data() {
    return {
      step: 1, // 1\2\2
      department: null,
      doctorIndex: null,
    }
  },
  methods: {
    selectDoctor(val) {
      this.doctorIndex = val
      this.step = 1
    },
    selcetDepartment(val) {
      this.department = val
      this.step = 2
    },
    submit() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.clinic-appointment {
  height: 97vh;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  background-color: #f2f2f2;
}
</style>
