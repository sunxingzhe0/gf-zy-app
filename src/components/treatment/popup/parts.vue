<template>
  <select-popup
    :title="'选择' + (type == 'EXAMINE' ? '部位' : '标本')"
    :list="items"
    multiple
    @change="change"
  />
</template>

<script>
import SelectPopup from '../commons/selectPopup.vue'
export default {
  components: {
    SelectPopup,
  },
  props: {
    chooseList: Array,
    partId: String,
  },
  computed: {
    items() {
      return this.chooseList.map(item => ({
        value: item.specimenPartName,
      }))
    },
  },
  methods: {
    change(options) {
      this.$emit('change', options)
    },
  },
}
</script>
