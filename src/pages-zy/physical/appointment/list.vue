<template>
  <view class="container">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 筛选条件 -->
    <view class="flex-start-center filter">
      <view v-for="(item,index) in tabData" :key="index" :class="active == item.value ? 'colorprimary' : ''" @click="tab(item)">{{item.lable}}</view>
    </view>
    <view class="filterList">
      <view class="listItemBox flex-start-start box-shadow" v-for="(item, index) in orderList" :key="index" @click="goTo(item)">
        <!-- <view class="img">
          <image src="@/assets/user/doc-3.png" alt="" />
        </view> -->
        <view class="contentBox flex_1">
          <!-- 三甲及标题文案 -->
          <view class="title">
            <view class="titleName"><text>{{ item.hospLevel }}</text>{{ item.packageName }}</view>
          </view>
          <!-- 体检类型 -->
          <view class="type flex-start-center">
            <view class="type1">{{ item.intendedType }}</view>
            <view class="type2">{{ item.packageType }}</view>
          </view>
          <!-- 价格及销量 -->
          <view class="priceBox mt-10">
            <view class="price"><text>￥</text>{{ parseFloat(item.amount).toFixed(2) }}</view>
            <view class="sale">已售{{ item.saleNum }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import noData from '../../components/NoData.vue'
  import {
    tjPackageList
  } from '../../api/physical.js'
  export default {
    components: {
      noData
    },
    data() {
      return {
        active: 0,
        tabData: [{
            lable: '综合排序',
            value: 0
          },
          {
            lable: '销量',
            value: 1
          },
          {
            lable: '价格',
            value: 2
          }
        ],
        // 套餐列表
        orderList: [],
      }
    },
    onLoad() {
      this.gettjPackageList()
    },
    methods: {
      //排序
      compare(p, type) { //type1,升序，2降序
        return function(m, n) {
          var a = m[p];
          var b = n[p];
          return type == 1 ? a - b : b - a; //升序
        }
      },
      tab(item) {
        this.active = item.value
        this.$set(item, 'sortType', !item.sortType)
        if (this.active == 0) {
          this.gettjPackageList()
        } else if (this.active == 1) {
          if (item.sortType) {
            this.orderList.sort(this.compare("saleNum", 2));
          } else {
            this.orderList.sort(this.compare("saleNum", 1));
          }

        } else {
          if (item.sortType) {
            this.orderList.sort(this.compare("amount", 1));
          } else {
            this.orderList.sort(this.compare("amount", 2));
          }

        }
      },
      // 获取预约列表
      async gettjPackageList() {
        this.orderList = await tjPackageList({
          orgPlatCode: '450388620S'
        })
      },
      // 跳转到套餐详情页
      goTo(item) {
        uni.navigateTo({
          url: `/pages-zy/physical/appointment/detail?packageNo=${item.packageNo}&title=${item.packageName}&amount=${item.amount}`
        })
      },
    },
  }
</script>
<style scoped lang="scss">
  .filter {
    position: fixed;
    width: 100%;
    padding: 20rpx 30rpx;
    top: 0;
    font-size: 28rpx;
    color: #666;
    background: #fff;
    border-radius: 0 0 20rpx 20rpx;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
    z-index: 2;

    >view {
      margin-right: 60rpx;
    }

    .colorprimary {
      color: $uni-color-primary;
    }
  }

  .filterList {
    padding: 20rpx;
    padding-top: 110rpx;
  }

  .listItemBox {
    margin-bottom: 20rpx;
    background: #fff;
    padding: 20rpx;

    .img {
      width: 150rpx;
      height: 150rpx;
      margin-right: 30rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .contentBox {
      .title {
        position: relative;
        padding: 8rpx 0;
        .titleName {
          font-size: 30rpx;
          color: #333333;
          line-height: 50rpx;
          text{
            background: $uni-color-primary;
            padding: 4rpx 10rpx;
            color: #fff;
            border-radius: 4rpx;
            font-size: 24rpx;
            margin-right: 5rpx;
          }
        }
      }

      .type {
        padding: 5rpx 0;

        .type1,
        .type2 {
          font-size: 22rpx;
          border-radius: 4px;
          text-align: center;
          padding: 0 15rpx;
          line-height: 40rpx;
        }

        .type1 {
          margin-right: 20rpx;
          background: $uni-color-primary;
          color: #fff;
        }

        .type2 {
          background: #fff;
          color: $uni-color-primary;
          border: 1rpx solid $uni-color-primary;
        }
      }

      .priceBox {
        padding: 5rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          color: #ff4500;
          font-size: 28rpx;
          font-weight: 600;

          text {
            font-size: 20rpx;
          }
        }

        .sale {
          color: #646464;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
