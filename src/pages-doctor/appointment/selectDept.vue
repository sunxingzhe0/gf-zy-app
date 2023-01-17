<template>
  <SelectDepartment :orderId="orderId" :doctorIndexArr="doctorIndexArr" />
</template>
<script>
import SelectDepartment from '@/pages-doctor/components/clinic-appointment/select-department'
import { clinicInfo } from '@/common/request/index'
export default {
  components: {
    SelectDepartment,
  },
  data() {
    return {
      orderId: '',
      doctorIndexArr: [],
    }
  },
  onLoad(options) {
    this.orderId = options.orderId
    this.doctorIndexArr = options.doctorIndexArr
  },
}
</script>
