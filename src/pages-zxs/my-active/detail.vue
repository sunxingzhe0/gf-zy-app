<template>
  <view>
    <detailTemplateBase
      :signId="signId"
      v-if="activityTemplateId === 'template_01.jpg'"
    ></detailTemplateBase>
    <detailTemplateOne
      :signId="signId"
      v-if="activityTemplateId === 'template_02.jpg'"
    ></detailTemplateOne>
    <detailTemplateTwo
      :signId="signId"
      v-if="activityTemplateId === 'template_03.jpg'"
    ></detailTemplateTwo>
    <detailTemplateThree
      :signId="signId"
      v-if="activityTemplateId === 'template_04.jpg'"
    ></detailTemplateThree>
    <detailTemplateFour
      :signId="signId"
      v-if="activityTemplateId === 'template_05.jpg'"
    ></detailTemplateFour>
  </view>
</template>
<script>
import detailTemplateBase from './components/detailTemplateBase'
import detailTemplateOne from './components/detailTemplateOne'
import detailTemplateTwo from './components/detailTemplateTwo'
import detailTemplateThree from './components/detailTemplateThree'
import detailTemplateFour from './components/detailTemplateFour'
export default {
  components: {
    detailTemplateBase,
    detailTemplateOne,
    detailTemplateTwo,
    detailTemplateThree,
    detailTemplateFour,
  },

  data() {
    return {
      signId: '',
      activityTemplateId: null,
    }
  },
  onLoad(options) {
    if (options.id) {
      this.activityTemplateId = options.templateId
      this.signId = options.id
    }
  },
}
</script>
