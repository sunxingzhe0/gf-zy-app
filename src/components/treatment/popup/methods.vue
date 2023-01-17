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
      console.log(this.chooseList, '方法')
      return this.chooseList.map(_ => ({ value: _.methodName || '暂无' }))
    },
  },
  methods: {
    change(payload) {
      this.$emit('change', payload)
    },
  },
}
</script>
