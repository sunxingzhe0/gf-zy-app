<template>
  <topicon
    class="topicon"
    :iconWidth="120"
    :iconHeight="120"
    :iconPath="require('@/assets/homeIcon.png')"
    :marginBottom="60"
    :marginTop="45"
    :marginLeft="5"
    :marginRight="5"
    @tapIcon="tapIcon"
  ></topicon>
</template>

<script>
import topicon from '@/components/gwh-backTopIcon/gwh-backTopIcon.vue';
export default {
  components: {
    topicon
  },
  computed: {
    clientType() {
      return this.$store.state.userInfo.clientType;
    }
  },
  methods: {
    tapIcon() {
      uni.setStorageSync('setStatusIndexFunc', 0);
      if (this.clientType == 'USER') {
        uni.reLaunch({
          url: '/pages/index-user'
        });
      } else {
        if (this.clientType == 'DRUG_DOC') {
          uni.setStorageSync('setStatusIndexFunc', 1);
        }
        uni.reLaunch({
          url: '/pages/index-doctor'
        });
      }
    }
  }
};
</script>
