<template>
  <view>
    <topbar>
      <template v-slot:top>
        <view class="top-box">
        <app-list-item
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0}"
          >
            <view class="header">
              <view class="msg">
                <view class="names">赵晓峰</view>
                <view class="sex-age">女 | 76岁</view>
                <view class="no">就诊号：</view>
              </view>
              <view class="addres">
                详细地址：重庆市渝北区光电园XXXX路XXXX XXXXXXXXX
              </view>
            </view>
          </app-list-item>
          <app-list-item
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0}"
          >
            <view class="tips">
              <view class="title">过敏史：</view>
              <view class="text">这是一个过敏史这是一个过敏史这是一个过敏史这是一个过敏史这是一个过敏史这是一个过敏史</view>
            </view>
          </app-list-item>
          <app-list-item
            :styles="{ padding: '16rpx 30rpx', paddingLeft: 0}"
          >
            <view class="type">
              <view class="head">
                <view class="title" style="color: #0071E3;">住院</view>
                <view class="time">日期：</view>
              </view>
              <view class="body">
                医师：王小妮 | 诊断：胸腔积液 | 科室：呼吸内科 | 总费用：12000 ¥
              </view>
            </view>
          </app-list-item>
          </view>
      </template>
    </topbar>
    <view class="surgical-detail">
      <view class="border">
        <view class="msg-item">
          <view class="left"></view>
          <view class="right"></view>
        </view>
      </view>
      <view class="footer">
          <view class="button">
            <view class="left" @click="backImg">
              上一条
              <image :src="require('../../../assets/right11@2x.png')"></image>
            </view>
            <view class="center"></view>
            <view class="right" @click="nextImg">
              下一条
              <image :src="require('../../../assets/right11@2x.png')"></image>
            </view>
          </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return{

      }
    }
  }
</script>

<style lang="scss" scoped>
.top-box{
  .header{
    width: 100%;
    padding: 30rpx;
    font-weight: 500;
    box-sizing: border-box;
    color: #666666;
    .msg{
      display: flex;
      width: 100%;
      height: 30px;
      align-items: center;
      margin-bottom: 10rpx;
      .names{
        width: 120rpx;     
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }
      .sex-age{
        width: 100rpx;
        font-size: 24rpx;
      }
      .no{
        flex: 1;
        font-size: 26rpx;
        text-align: right;
      }
    }
    .addres{
      font-size: 24rpx;
    }
  }
  .tips{
    display: flex;
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    font-weight: 500;
    color: #F74A4A;
    border: 0 solid #E6E6E6;
    border-width: 2rpx 0;
    .title{
      width: 110rpx;
    }
    .text{
      flex: 1;
    }
  }
  .type{
    width: 100%;
    box-sizing: border-box;
    padding: 30rpx;
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
        margin-top: 20rpx;
        font-size: 24rpx;
        color: #666666;
    }
  }
}
.surgical-detail{
  position: absolute;
  width: 100%;
  height: 63vh;
  bottom: 0;
  right: 0;
  z-index: 10;
  .border{
    width: 100%;
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    box-sizing: border-box;
    .msg-item{
      display: flex;
      width: 100%;
      align-items: center;
      margin-bottom: 30rpx;
      .left{
        width: 40%;
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }
      .right{
        width: 60%;
        font-size: 30rpx;
        font-weight: 500;
        color: #666666;
        text-align: right;
      }
    }
  }
  .footer{
    width: 100%;
    height: 110rpx;
    margin-top: 30rpx;
    background: #fff;
    .button{
      display: flex;
      width: 100%;
      height: 110rpx;
      justify-content: space-between;
      text-align: center;
      .left{
        position: relative;
        width: 100%;
        background: #fff;
        font-size: 30rpx;
        font-weight: 500;
        color: #666666;
        line-height: 90rpx;
        image{
          position: absolute;
          width: 10rpx;
          height: 20rpx;
          transform: translate(-115rpx,35rpx) rotateY(180deg);
        }
      }
      .center{
        width: 2rpx;
        height: 100%;
        background: #E6E6E6;
      }
      .right{
        position: relative;
        width: 100%;
        background: #fff;
        font-size: 30rpx;
        font-weight: 500;
        color: #666666;
        line-height: 90rpx;
        image{
          position: absolute;
          width: 10rpx;
          height: 20rpx;
          transform: translate(20rpx, 35rpx);
        }
      }
    }
  }
}
</style>