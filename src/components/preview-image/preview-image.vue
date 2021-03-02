<template>
  <view class="swiper-container" v-show="show">
    <swiper class="swiper" :current="current" :circular="true" @click="show = false">
      <swiper-item v-for="item in items" :key="item">
        <image class="image" :src="FILE_URL(item)" mode="aspectFit"></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  export default {
    props: {
      items: Array,
      current: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        show: false
      }
    },
    methods: {
      open() {
        this.show = true
      }
    }
  }
</script>

<style lang="scss">
  .swiper-container {
    position: fixed;
    display: block;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    background-color: #000;
  }

  .swiper {
    height: 100%;
  }
  .image {
    width: 100%;
    height: 100%;
  }
</style>
