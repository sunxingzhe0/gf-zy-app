<template>
  <view @click="toloca">totoot</view>
</template>

<script>
  export default{
    onLoad() {

    },
    methods:{
      toloca(){
        console.log(777)
        uni.openLocation({
            latitude: 30.077217,
            longitude:106.592148,
            name:'重庆合川区第二人民医院',
            address:'重庆市合川区三汇镇汇兴西路197号',
            success: function () {
                console.log('success');
            }
        });
      }
    }
  }
</script>

<style>
</style>
