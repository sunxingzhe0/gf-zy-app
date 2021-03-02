<template>
  <treatment-new v-if="order" :order="order" :roomOrderId="order.orderId" @submit="close"></treatment-new>
</template>
<script>
import treatmentNew from '@/components/treatment/new/index.vue'
import { clinicInfo } from '@/common/request/index.js'
export default {
  components: {
    treatmentNew,
  },
  data() {
    return {
      order: null,
    }
  },
  onLoad(options) {
    this.getData(options.orderId)
  },
  methods: {
    async getData(orderId) {
      this.order = await clinicInfo({ orderId })
    },
    close() {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>
