<template>
  <view>
    <health-card-users
      :type="type"
      hospitalId="100001"
      @select="selectCallback"
      @addCard="addCard"
      @back="back"
      bind:switchType="switchTypeCallback"
    />
  </view>
</template>

<script>
import { getInfoByHealthCode } from '@/common/request/userCenter'
export default {
  data() {
    return {
      type: 'auth',
    }
  },
  onLoad(options) {
    console.log(options.fromPage)
    this.fromPage = options.fromPage
    if (options.fromPage === 'addCard') {
      this.type = 'auth'
    } else {
      this.type = 'manage'
    }
  },
  methods: {
    addCard() {
      uni.navigateTo({
        url: '/pages-user/patientManagement/add?page=DoctorDetail',
      })
    },
    back() {
      uni.navigateBack({ delta: 2 })
    },
    async selectCallback(e) {
      if (this.fromPage === 'addCard') {
        uni.showLoading()
        const params = { healthCode: e.detail.healthCode }
        const res = await getInfoByHealthCode(params)
        uni.hideLoading()
        uni.navigateBack()
        uni.$emit('updateCardInfo', res)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
