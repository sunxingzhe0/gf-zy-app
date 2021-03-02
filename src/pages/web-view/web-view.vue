<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="src"></web-view>
  </view>
</template>

<script>
  export default {
    onLoad(option) {
      this.src = decodeURIComponent(option.src)
    },
    data() {
      return {
        src: ''
      }
    },
    methods: {

    }
  }
</script>

<style>

</style>
