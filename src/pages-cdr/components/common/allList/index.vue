<template>
  <view class="cdr-all-list">
    <view class="line"></view>
    <view class="box">
      <view class="card" v-for="(item,info) in list" :key="info">
        <view class="head">
          <view class="title" v-if="item.medicalType=='MZ'">门诊</view>
          <view class="title" v-if="item.medicalType=='ZY'" style="color:#0071E3">住院</view>
          <view class="title" v-if="item.medicalType=='TJ'" style="color:#42D36B">体检</view>
          <view class="time">日期：{{item.createTime||' - '}}</view>
        </view>
        <view class="body">
          <!-- 医师：王小妮 | 诊断：胸腔积液 | 科室：呼吸内科 | 门诊号：XXXXXX -->
          <template v-if="item.medicalType!='TJ'">
          医师：{{item.doctorName||' - '}} | {{' '}}
          </template>
          <template v-if="item.medicalType!='TJ'">
          诊断：{{item.diagnose||' - '}} | {{' '}}
          </template>
          科室：{{item.deptName||' - '}} | {{' '}}
          <span v-if="item.medicalType=='MZ'">门诊号：{{'-'}}</span>
          <span v-if="item.medicalType=='TJ'">
            体检：{{item.content||'-'}}
          </span>
        </view>
        <view class="footer">
          <button @click="detail(item)">查看</button>
        </view>
        <view class="point"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
    props:['list'],
    data(){
      return{
       
      }
    },
    methods:{
      detail(item){
        switch (item.type) {
          case 'outer':
            uni.navigateTo({
              url: '/pages-cdr/allRecords/detail?type='
              +item.medicalType
              +'&mpiId='+item.cardNo
              +'&orderId='+item.orderId
              +'&innerOuterType='+item.type
            });
            break;
          case 'inner':
            uni.navigateTo({
              url: '/pages-cdr/allRecords/detail?type='
              +item.medicalType
              +'&mpiId='+item.cardNo
              +'&ehrId='+item.visitNo
              +'&innerOuterType='+item.type
            });
            break;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.cdr-all-list{
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  .line{
    position: absolute;
    width: 2rpx;
    height: 100%;
    top: 0;
    left: 0;
    background: #CCCCCC;
  }
  .box{
    flex: 1;
    height: 100%;
    padding-left: 30rpx;
    .card{
      position: relative;
      display: flex;
      width: 100%;
      background: #fff;
      padding: 30rpx;
      margin-bottom: 20rpx;
      box-sizing: border-box;
      flex-direction: column;
      border-radius: 4rpx 20rpx 20rpx;
      box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.15);
      .head{
        display: flex;
        width: 100%;
        height: 30rpx;
        align-items: center;
        .title{
          width: 60rpx;
          font-size: 30rpx;
          color: #0AB2C1;
        }
        .time{
          flex: 1;
          font-size: 26rpx;
          text-align: right;
          color:#666666;
        }
      }
      .body{
        width: 100%;
        flex: 1;
        margin: 30rpx 0;
        font-size: 24rpx;
        color: #666666;
      }
      .footer{
        position: relative;
        width: 100%;
        height: 60rpx;
        button{
          position: absolute;
          top: 0;
          right: 0;
          width: 120rpx;
          height: 60rpx;
          border: 2rpx solid #0AB2C1;
          border-radius: 30rpx;
          background: #fff;
          font-size: 24rpx;
          color: #0AB2C1;
          transition: all 0.2s;
          &:hover,&:focus{
            color: #fff;
            background-color: $uni-color-primary;
          }
        }
      }
      .point{
        position: absolute;
        top: -18rpx;
        left: -40rpx;
        width: 16rpx;
        height: 16rpx;
        background: #FFFFFF;
        border: 4rpx solid #0AB2C1;
        border-radius: 50%;
        z-index: 1;
      }
    }
  }
  .disabled{
    position: absolute;
    top: 0;
    right: 0;
    width: 120rpx;
    height: 60rpx;
    border: 2rpx solid #e7e7e7;
    border-radius: 30rpx;
    background: #fff;
    font-size: 24rpx;
    color: #999;
    transition: all 0.2s;
  }
}
</style>