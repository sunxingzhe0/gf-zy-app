<template>
  <view class="img">
    <image style="width: 100%; height: 100%;" v-show="!load" :src="defaultImg"></image>
    <image style="width: 100%; height: 100%;" v-show="load" @load="loadEnd" @error="errorEnd" :src="url" @click="preview"></image>
  </view>
</template>

<script>
  export default {
    props: {
      defaultImg: {
        type: String,
        default: function() {
          return require('@/assets/user/user_d_head.png')
        },
      },
      isPreview: {
        type: Boolean,
        default: true
      },
      url: String,
    },
    data() {
      return {
        load: false,
      }
    },

    methods: {
      loadEnd(e) {
        this.load = true
      },
      errorEnd(e) {
        this.load = false
      },
      preview() {
        if (this.isPreview) {
          uni.previewImage({
            current: this.url,
            urls: [this.url]
          })
        }

      },
    },
  }
</script>

<style lang="scss" scoped>
  .img {
    width: 100%;
    height: 100%;
  }
</style>
