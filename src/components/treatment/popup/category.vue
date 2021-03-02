<template>
  <select-popup title="选择类别" :list="list" @change="change" />
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
      return Array.from(
        new Set(this.chooseList.map(_ => _.categoryName)),
      ).map(value => ({ value }))
    },
  },
  methods: {
    change(payload) {
      this.$emit('change', payload)
    },
  },
}
</script>
