<template>
  <view>
    <web-view :src="src"></web-view>
  </view>
</template>

<script>
export default {
  onLoad(option) {
    this.src = decodeURIComponent(option.src)
    this.$nextTick(() => {
      uni.setNavigationBarTitle({
        title: option.title || '',
      })
    })
  },
  data() {
    return {
      src: '',
    }
  },
  methods: {},
}
</script>

<style></style>
