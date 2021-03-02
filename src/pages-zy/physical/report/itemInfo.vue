<template>
  <view class="eachItem">
    <app-card styles="padding:20rpx 30rpx;padding-right:0" >
      <app-list-item v-if :label="`${data.combName}（${data.details.length}）`" textStyle="font-size:30rpx;color:#333;width:300rpx;font-weight:600;" :styles="{padding:'10rpx',paddingLeft:0,paddingRight:'30rpx'}" :value="info.billData">
        <view class="flex_1 text-right">检查者：{{data.doctorName || '-'}}</view>
      </app-list-item>
      <app-list-item :label="item.itemName" textStyle="width:400rpx;" :styles="{padding:'10rpx',paddingLeft:0,paddingRight:'30rpx'}" noBorder v-for="(item,index) in data.details" :key="index">
        <view class="flex_1 text-right">{{item.resultNum}}{{item.resultUnit || ''}}<text class="red" style="margin-left: 5rpx;" v-if="item.resultPoint">{{item.resultPoint}}</text></view>
      </app-list-item>
    </app-card>
  </view>
</template>
<script>
  import AppCard from '@/components/app/app-card'
  import AppListItem from '@/components/app/app-list-item'
export default {
  components:{
    AppCard,
    AppListItem
  },
  data() {
    return {
      data:{}
    }
  },
  onLoad(option) {
    let data = JSON.parse(decodeURIComponent(option.data))
    uni.setNavigationBarTitle({
      title:data.combName
    })
    this.data = data
    console.log(data)
  }
}
</script>
<style scoped lang="scss">
.eachItem {
  padding: 20rpx;
}
.red{
  color: #EA2929;
}
</style>
