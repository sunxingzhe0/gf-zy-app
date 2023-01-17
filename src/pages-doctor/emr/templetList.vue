<template>
  <uni-popup ref="popup" type="bottom" @change="popChange">
    <view class="listWrap">
      <view>
        <view class="title">病历模板</view>
      </view>
      <scroll-view :scroll-top="scrollTop" scroll-y="true" class="tabWrap">
        <view>
          <!-- <radio-group @change="allCheckboxChange($event)"> -->
          <view class="tableTh tableTd flex-start-center">
            <!-- <view><label class="flex-start-center">
                  <radio style="transform:scale(0.7)" color="#0AB2C1" :checked="isAll" value="all"></radio><text>全选</text>
                </label></view> -->
            <view>单选</view>
            <view>序号</view>
            <view>模板名称</view>
            <view>描述</view>
            <view>创建时间</view>
          </view>

          <!-- </radio-group> -->
          <radio-group @change="checkboxChange($event, commonTemp)">
            <view
              class="tableTd flex-start-center"
              v-for="(t, d) in list"
              :key="d"
            >
              <view
                ><label>
                  <radio
                    :value="t.tempId"
                    :checked="t.checked"
                    color="#0AB2C1"
                    style="transform:scale(0.7)"
                  ></radio> </label
              ></view>
              <view>{{ d + 1 }}</view>
              <view>{{ t.templateName }}</view>
              <view>{{ t.tempDesc }}</view>
              <view>{{ t.createDate }}</view>
            </view>
          </radio-group>
        </view>
        <view v-if="list.length == 0" class="nodata">暂无数据</view>
      </scroll-view>
      <view class="bottombtn flex-between">
        <view @click="close">取消</view>
        <view class="on" @click="submit">导入</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { findDiseaseTemplateList } from '@/common/request/doctorRoom.js'
export default {
  data() {
    return {
      list: [],
      isAll: false,
      selectList: [],
      isSubmit: false,
      tempId: '',
    }
  },
  methods: {
    submit() {
      const select = this.list.filter(item => item.tempId === this.tempId)
      if (select.length == 0) {
        uni.showToast({
          title: '请选择导入的模板',
        })
        return false
      } else if (select.length > 1) {
        uni.showToast({
          title: '只能选择一个模板导入',
        })
        return false
      }
      this.$emit('importTem', select[0].tempId)
      this.close()
    },
    //全选
    allCheckboxChange(e) {
      const f = e.detail.value.length > 0
      this.list = this.list.map(item => Object.assign(item, { checked: f }))
      this.isAll = f
    },
    checkboxChange(e) {
      // const items = this.list
      // for (let i = 0, lenI = items.length; i < lenI; ++i) {
      //   this.$set(item, 'checked', !!items[i].tempId)
      // }
      // //  商品是否全部勾选，判断全选与否状态
      // this.isAll = items.every(item => item.checked)
      //选中项tempId
      this.tempId = e.detail.value
      console.log(e)
    },
    // 获取模板
    async getfindDiseaseTemplateList() {
      const list = await findDiseaseTemplateList({
        currentNum: 1,
        pageSize: 9999,
      })
      this.list = list.list || []
    },
    open() {
      this.$refs.popup.open()
      this.getfindDiseaseTemplateList()
    },
    close() {
      this.$refs.popup.close()
    },
    popChange(e) {
      !e.show && this.$emit('popChange')
    },
  },
}
</script>

<style lang="scss" scoped>
.listWrap {
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  padding-bottom: 150rpx;

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
    border-bottom: 1px solid #e6e6e6;
    padding: 10rpx 10rpx 10rpx 20rpx;
    font-size: 24rpx;
    color: #333;
    // width: 100%;
    text-align: left;

    view {
      word-wrap: break-word;
      &:nth-child(1) {
        width: 80rpx;
        text-align: left;
      }

      &:nth-child(2) {
        width: 70rpx;
        text-align: left;
      }

      &:nth-child(3) {
        width: 160rpx;
      }

      &:nth-child(4) {
        width: 200rpx;
      }

      &:nth-child(5) {
        width: 150rpx;
      }
    }

    &.tableTh {
      background: #f2f2f2;
    }
  }
}

.title {
  height: 90rpx;
  font-size: 30rpx;
  color: #1a1a1a;
  line-height: 90rpx;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  font-weight: bold;
}

.selceData {
  padding: 20rpx;

  .dateTime {
    padding: 4rpx 20rpx;
    background: #f2f2f2;
    font-size: 24rpx;
    color: #333;
    border-radius: 26rpx;

    .dateInput {
      width: 160rpx;
      text-align: center;

      &.no {
        color: #999;
      }
    }
  }
}

.bottombtn {
  position: fixed;
  height: 128rpx;
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e6e6e6;

  view {
    width: 345rpx;
    height: 88rpx;
    background: #f2f2f2;
    font-size: 30rpx;
    color: #333;
    text-align: center;
    line-height: 88rpx;
    border-radius: 44rpx;

    &.on {
      background: $uni-color-primary;
      color: #fff;
    }
  }
}
</style>
