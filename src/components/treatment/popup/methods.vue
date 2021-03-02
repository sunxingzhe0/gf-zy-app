<template>
  <select-popup title="选择检查方法" :list="list" @change="change" />
</template>

<script>
import selectPopup from '../commons/selectPopup.vue'
export default {
  components: {
    selectPopup,
  },
  props: {
    chooseList: Array,
  },
  computed: {
    list() {
      return this.chooseList.map(_ => ({ value: _.methodName }))
    },
  },
  methods: {
    change(payload) {
      this.$emit('change', payload)
    },
  },
}
</script>
