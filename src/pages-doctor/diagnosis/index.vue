<template>
  <uni-popup ref="popup" type="bottom" @change="popChange">
    <diagnosisList ref="diagnosisList" :orderIdP="orderIdP" :ispop="true" :memberIdP="memberIdP" @close="closelist"></diagnosisList>
  </uni-popup>
</template>

<script>
  import diagnosisList from './diagnosisList.vue'
  export default {
    props: {
      orderIdP:{
        type:String,
        default:''
      },
      memberIdP:{
        type:String,
        default:''
      }
    },
    components: {
      diagnosisList
    },
    data(){
      return{
        isShow:false
      }
    },
    methods: {
      open() {
        this.$refs.popup.open()
        this.$refs.diagnosisList.loadDiagnosis()
      },
      closelist(i) {
        this.$refs.popup.close()
        if(i){
          this.$emit('diagnosisChange')
        }
      },
      popChange(e){
        if(e.show){
          this.isShow = true
        }else{
          this.isShow = false
        }
      },
      popChange(e){
        if(!e.show){
          this.$emit('popChange')
        }

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
