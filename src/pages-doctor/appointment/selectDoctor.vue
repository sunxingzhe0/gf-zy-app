<template>
  <SelectDoctor v-if="order" :order="order" :department="department" />
</template>
<script>
import SelectDoctor from '@/pages-doctor/components/clinic-appointment/select-doctor'
import { clinicInfo } from '@/common/request/index'
export default {
  components: {
    SelectDoctor,
  },
  data() {
    return {
      order: null,
      department: null,
    }
  },
  async onLoad({ orderId, department }) {
    this.department = department ? JSON.parse(department) : null
    this.order = await clinicInfo({ orderId })
  },
}
</script>
