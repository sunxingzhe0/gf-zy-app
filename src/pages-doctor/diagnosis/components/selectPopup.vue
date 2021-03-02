<template>
  <uni-popup ref="popup" type="bottom">
    <view class="container">
      <view class="keyword">
        <input class="input" type="text" v-model="name" confirm-type="search" placeholder="请输入诊断关键字查找"  @confirm="search"
          :focus="true" />
        <view class="iconfont icon-sousuo" @click="search"></view>
      </view>
      <scroll-view class="departments" scroll-y @scrolltolower="getMore">
        <uni-list>
          <uni-list-item v-for="item in departments" :key="item.id" :title="item.diagnosisName" :showArrow="false"
            clickable @click.stop="clickHandler(item)"></uni-list-item>
        </uni-list>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
  import {
    diagnosisKeywordSearch
  } from '@/common/request/doctorRoom'
  export default {
    components: {},
    data() {
      return {
        name: '',
        departments: [],
        currentNum: 1,
        pageSize: 10,
        pages: 1
      };
    },
    methods: {
      search() {
        this.departments = []
        this.currentNum = 1
        this.pages = 1
        this.getList()
      },
      clickHandler(val) {
        this.$emit('change', val);
      },
      // 获取诊断名
      async getList() {
        let data = await diagnosisKeywordSearch({
          searchKeywords: this.name,
          currentNum: this.currentNum,
          pageSize: this.pageSize,
        })
        this.departments = this.departments.concat(data.list)
        this.pages = data.pages
      },
      //加载更多
      getMore() {
        if (this.currentNum < this.pages) {
          this.currentNum = this.currentNum + 1
          this.getList()
        }
      },
      open() {
        this.$refs.popup.open()
        this.name = ''
        this.departments = []
        this.currentNum = 1
        this.pages = 1
        this.getList()
      },
      close() {
        this.$refs.popup.close()
      },
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    padding-top: 20rpx;
    border-top-left-radius: 12rpx;
    border-top-right-radius: 12rpx;
    background: #f2f2f2;
  }

  .keyword {
    width: 710rpx;
    height: 72rpx;
    display: flex;
    margin: 20rpx auto;
    align-items: center;
    border-radius: 36rpx;
    background: #ffffff;
    box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);

    .input {
      flex: 1;
      height: 72rpx;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 72rpx;
      margin-left: 30rpx;
      font-family: PingFang SC;
    }

    .icon-sousuo {
      width: 50rpx;
      height: 60rpx;
      margin: 0 20rpx;
      text-align: center;
      font-size: 40rpx;
      display: flex;
      align-items: center;
    }
  }

  .departments {
    flex: 1;
    background: #fff;
    height: 70vh;
  }

  .list-item {
    height: 90rpx;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    flex-direction: column;
    transition: all ease 0.3s;

    &.expand {
      height: auto;

      .item-row {
        border-bottom: none;
      }

      .icon-jiantou::before {
        transform: rotate(0);
      }
    }

    .item-row {
      height: 90rpx;
      display: flex;
      margin-left: 30rpx;
      box-sizing: border-box;
      justify-content: space-between;
      border-bottom: 1px solid #e5e5e5;
    }

    .item-children {
      background: #f2f2f2;
    }

    .item-child {
      height: 90rpx;
      margin-left: 30rpx;
      text-indent: 60rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #e5e5e5;
    }

    .item-text {
      color: #333333;
      font-size: 30rpx;
      font-weight: 500;
      line-height: 90rpx;
      font-family: PingFang SC;
    }

    .icon-jiantou {
      display: flex;
      align-items: center;
      padding-right: 28rpx;

      &::before {
        color: #656565;
        transform: rotate(-90deg);
        transition: all ease 0.3s;
      }
    }
  }
</style>
