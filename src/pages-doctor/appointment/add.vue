<template>
  <view class="container">
    <topbar :active="active" :tabs="tabs" @change="e => (active = e)" />
    <Preview
      v-if="active == 'Preview' && (department || order)"
      :order="order"
      :department="department"
      :doctorIndexArr="doctorIndexArr"
      :docInfo="docInfo"
    />
    <Repeat v-else-if="order" :order="order" :doctorId="doctorId" />
  </view>
</template>
<script>
import Preview from '@/pages-doctor/components/clinic-appointment/preview/index'
import Repeat from '@/pages-doctor/components/clinic-appointment/preview/repeat'
import { clinicInfo } from '@/common/request/index'
export default {
  components: {
    Preview,
    Repeat,
  },
  data() {
    return {
      tabs: [
        {
          title: '预约挂号',
          key: 'Preview',
        },
        // {
        //   title: '在线复诊',
        //   key: 'Repeat',
        // },
      ],
      active: 'Preview',
      order: null,
      department: null,
      doctorIndexArr: [],
      deptId: '',
      docInfo: null,
    }
  },
  computed: {
    doctorId() {
      return (
        this.$store.state.appointmentClinicDoctorId ||
        this.order?.doctorId ||
        ''
      )
    },
  },
  onLoad({ orderId, department, doctorIndexArr, deptId, docInfo }) {
    this.department = department ? JSON.parse(department) : null
    this.docInfo = docInfo ? JSON.parse(docInfo) : null
    this.deptId = deptId
      ? deptId
      : this.department
      ? this.department.syncCode
      : null
    this.doctorIndexArr = doctorIndexArr ? doctorIndexArr.split(',') : []
    clinicInfo({ orderId }).then(data => {
      this.order = data
    })
  },
}
</script>
<style lang="scss" scoped>
.container {
  padding-top: 84rpx;
}
</style>
