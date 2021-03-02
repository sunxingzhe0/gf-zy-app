<template>
  <web-view :src="url" :progress="false"></web-view>
</template>

<script>
  export default {
    data() {
      return {
        url: '',
        title: ''
      }
    },
    onLoad(res) {
      this.title = res.title;
      this.url = res.url;
    },
    onReady() {
      uni.setNavigationBarTitle({
        title: this.title
      })
    }
  }
</script>

<style>
</style>
