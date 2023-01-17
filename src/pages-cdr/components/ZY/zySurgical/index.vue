<template>
  <view class="surgical-box">
    <view class="head">
      <view class="line"></view>
      <view class="title">手术信息</view>
      <view class="num">共计<span style="color:#f66666">{{' '+surgicalList.length+' '}}</span>条</view>
    </view>
    <view class="body">
      <records-item :list="surgicalList" @change="openDetail"></records-item>
    </view>
  </view>
</template>

<script>
  import recordsItem from '../../common/recordsItem/index'
  export default {
    components:{
      recordsItem
    },
    data(){
      return{
        surgicalList:[
          {time:'2020-06-25 09:11',text:'手术处理'},{time:'2020-06-25 09:11',text:'阑尾切除'},{time:'2020-06-25 09:11',text:'口腔手术'},{time:'2020-06-25 09:11',text:'手术'},{time:'2020-06-25 09:11',text:'手术记录'},
        ]
      }
    },
    methods:{
      openDetail(item){
        console.log(item.text);
      }
    }
  }
</script>

<style lang="scss" scoped>
.surgical-box{
  width: 100%;
  .head{
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .line{
      width: 2rpx;
      height: 30rpx;
      background: #0AB2C1;
      margin-right: 10rpx;
    }
    .title{
      width: 150rpx;
      font-size: 30rpx;
      color: #333333;
    }
    .num{
      flex: 1;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .body{
    width: 100%;
    padding: 20rpx 20rpx 1rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 10rpx;
  }
}
</style>