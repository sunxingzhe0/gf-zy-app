<template>
  <view>
    <view class="patient text-right" @click="$refs.dateRange.open()">
      <text :style="range[0]?'color:#666;':'color:#999;'">{{range[0] || '开始时间'}} ~ {{range[1] || '结束时间'}}</text>
      <uni-icons type="arrowright" color="#666" size="14"></uni-icons>
    </view>
    <uni-popup ref="dateRange" type="bottom">

      <view class="dateWrap">
        <view class="title">选择时间<view class="close" @click="$refs.dateRange.close()">
            <uni-icons type="closeempty" class="closeIcon" color="#999"></uni-icons>
          </view>
        </view>
        <view class="shortcut flex-between">
          <view :class="shortcut==1?'on shortcutItem':'shortcutItem'" @click="shortcutTap(1)">一年内</view>
          <view :class="shortcut==2?'on shortcutItem':'shortcutItem'" @click="shortcutTap(2)">三月内</view>
          <view :class="shortcut==3?'on shortcutItem':'shortcutItem'" @click="shortcutTap(3)">半年内</view>
        </view>
        <mx-date-picker type="range" color="#0AB2C1" :showHoliday="false" format="yyyy-mm-dd" :value="range"
          :show-seconds="true" @dateClick="dateClick" @confirm="onSelected" @cancel="showPicker=false" />
        <!-- 确定按钮 -->
      </view>

    </uni-popup>

  </view>
</template>

<script>
  import MxDatePicker from "../mxDataPicker/index.vue";
  import dayjs from 'dayjs'
  export default {
    components: {
      MxDatePicker
    },
    props: {
      date: Array
    },
    data() {
      return {
        range: [],
        showPicker: false,
        shortcut:null
      }
    },
    watch: {
      date() {
        this.range = this.date
      },
    },
    created(){
      console.log(this.date)
      this.range = this.date
    },
    methods: {
      // 快捷
      shortcutTap(active){
        this.shortcut = active
         if(active == 1){
           this.range = [dayjs().subtract(1,'year').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
         }
         if(active == 2){
           this.range = [dayjs().subtract(3,'month').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
         }
         if(active == 3){
           this.range = [dayjs().subtract(6,'month').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
         }
      },
      dateClick(){
         this.shortcut = null
      },
      onSelected(e) { //选择
        console.log(e)
        this.range = e.value;
        this.$refs.dateRange.close()
        this.$emit('confirm', this.range)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tip{
    color: #999;
  }
  .dateWrap {
    background: #fff;
    border-radius: 20px 20px 0 0;
    overflow: hidden;
    padding-bottom: 20rpx;

    .title {
      position: relative;
      border-bottom: 1px solid #E6E6E6;
      height: 110rpx;
      line-height: 110rpx;
      text-align: center;
      margin-bottom: 30rpx;

      .close {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #f2f2f2;
        right: 40rpx;
        top: 40rpx;
        text-align: center;
        line-height: 40rpx;
        cursor: pointer;

        .closeIcon {
          font-size: 30rpx !important;
        }
      }
    }
    .shortcut{
      padding: 0 60rpx;
      margin-bottom: 20rpx;
      .shortcutItem{
        width: 160rpx;
        line-height: 54rpx;
        font-size: 26rpx;
        color: #444;
        background: #f2f2f2;
        border-radius: 30rpx;
        text-align: center;
        &.on{
          background:  $uni-color-primary;
          color: #fff;
        }
      }
    }
    .confirm {
      margin: 20rpx 20rpx 0rpx 20rpx;
      width: 710rpx;
      height: 88rpx;
      background: rgba(10, 178, 193, 1);
      border-radius: 44rpx;

      font-size: 30rpx;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 88rpx;
      text-align: center;
    }
  }
</style>
