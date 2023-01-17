<template>
  <ChatWindow pageType="askFollow" :orderId="orderId" />
</template>

<script>
import ChatWindow from '@/pages-sf/components/chatWindow'
export default {
  components: {
    ChatWindow,
  },
  data() {
    return {
      orderId: '',
    }
  },
  onLoad(option) {
    // console.log(option.id, '随访单id-----')
    this.orderId = option.id
  },
}
</script>

<style lang="scss" scoped></style>
