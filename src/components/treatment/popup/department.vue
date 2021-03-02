<template>
  <select-popup title="选择科室" :list="list" @change="change" />
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
      return this.chooseList.map(_ => ({ value: _.execDeptName }))
    },
  },
  methods: {
    change(option) {
      this.$emit('change', option)
    },
  },
}
</script>
