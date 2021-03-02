<template>
  <uni-popup ref="popup" type="center" @change="popChange">
    <view class="listWrap">
      <view>
        <view class="title">{{isSubmit?'提交记录':title+' - 修改记录'}} <view @click="close" class="closeIcon"><uni-icons type="close" color="#E6E6E6" size="20"></uni-icons></view></view>
      </view>
      <view class="tabWrap">
        <view>
          <view class="tableTh tableTd flex-start-center">
            <view>序号</view>
            <view>操作人</view>
            <view>操作时间</view>
          </view>

          <view class="tableTd flex-start-center" v-for="(t,d) in list" :key="d">
            <view>{{d+1}}</view>
            <view>{{t.operator}}</view>
            <view>{{t.operatorTime}}</view>
          </view>

        </view>
        <view v-if="list.length == 0"
          class="nodata">暂无数据</view>
      </view>
    </view>


  </uni-popup>
</template>

<script>
  import {
    findSubjectRecord
  } from '@/common/request/doctorRoom.js'
  export default {
    props: {
      orderId: String,
      title: String
    },
    data() {
      return {
        list: [],
        isSubmit:false,
        type:''
      }
    },

    created() {

    },
    methods: {
      // 获取记录
      async getfindSubjectRecord() {
        let list = await findSubjectRecord({
          changeType:this.isSubmit?'': this.type,
          orderId: this.orderId,
          currentNum: 1,
          pageSize: 999
        })
        this.list = list.data || []

      },
      open(i) {
        if(i){
          this.type = i.type
          this.isSubmit = false
        }else{
          this.isSubmit = true
        }
        this.$refs.popup.open()
        this.getfindSubjectRecord()
      },
      close() {
        this.$refs.popup.close()
        this.$emit('close')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .listWrap {

    background: #FFFFFF;
    border-radius: 20px;
    width: 680rpx;
    padding-bottom: 30rpx;
    .listTime {
      padding: 0 20rpx;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 4rpx;
    }

    .tabWrap {
      max-height: 68vh;
      overflow-x: auto;
      .nodata {
        height: 300rpx;
        line-height: 300rpx;
        text-align: center;
        color: #999;
        font-size: 28rpx;
      }
    }

    .tableTd {
      border-bottom: 1px solid #E6E6E6;
      padding: 0 30rpx;
      font-size: 26rpx;
      color: #333;
      // width: 100%;

      view {
        padding: 10rpx 0;
        &:nth-child(1) {
          width: 120rpx;
        }

        &:nth-child(2) {
          width: 220rpx;
        }
      }

      &.tableTh {
        background: #F2F2F2;
      }
    }
  }

  .title {
    height: 110rpx;
    font-size: 30rpx;
    color: #1A1A1A;
    line-height: 110rpx;
    text-align: center;
    font-weight: bold;
    position: relative;
    .closeIcon{
      position: absolute;
      right: 40rpx;
      top: 20rpx;
      color: #E6E6E6;
    }
  }
</style>
