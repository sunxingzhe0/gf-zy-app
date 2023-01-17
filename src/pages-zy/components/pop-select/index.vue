<template>
  <uni-popup ref="popup" type="center" :maskClick="false">
    <view class="selectWrap">
      <view v-if="!isother" class="title">{{ title }}</view>
      <scroll-view scroll-y="true" class="scroll">
        <view v-if="isother" class="title">{{ title }}</view>
        <view class="flex-between selectMain">
          <axb-checkbox
            ref="radio3"
            :multi="multi"
            :list="lists"
            @change="changeType"
          ></axb-checkbox>
        </view>
        <!-- <view
          class="select-member add"
          style="margin-left:15px"
          v-if="lists.length === 0"
          @click="addC()"
          ><text>+ 新增</text></view
        > -->
        <view class="selectMain" v-if="lists.length === 0">
          <view class="no-card">
            <image
              :src="require('@/pages-zy/images/nocard.png')"
              style="width:70px;height:64px;margin-rigth:4px"
            ></image>
            <text class="msg">暂无健康卡</text>
          </view>
        </view>
        <view v-if="isother && otherList.length" class="other">其他</view>
        <view
          class="flex-between selectMain"
          v-if="isother && otherList.length"
        >
          <axb-checkbox
            ref="radio3"
            :multi="multi"
            :list="otherList"
            @change="changeType($event, 'other')"
          ></axb-checkbox>
        </view>
      </scroll-view>
      <view class="selectbtn" @click="addC()" v-if="lists.length === 0"
        ><text>添加健康卡</text></view
      >
      <view v-else class="selectbtn" @click="selectSubmit"
        ><text>确定</text></view
      >
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'popSelect',
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
    },
    otherList: {
      type: Array,
    },
    multi: {
      type: Boolean,
      default: false,
    },
    isother: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    lists() {
      return this.multi
        ? [{ name: '全部', value: 'all' }, ...this.list]
        : this.list
    },
  },
  methods: {
    open() {
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
    selectSubmit() {
      this.$emit('submit')
    },
    changeType(e, type) {
      // uni.$emit('changeType', type ? 'other' : 0)
      const arr = Array.isArray(e) ? e.filter(item => item) : e
      this.$emit('change', { data: arr, type })
    },
    addC() {
      uni.navigateTo({
        url: '/pages-user/patientManagement/add?page=DoctorDetail',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.selectWrap {
  width: 640rpx;
  border-radius: 20rpx;
  background: #fff;
  padding: 40rpx 0;
  padding-bottom: 0;
  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }

  .scroll {
    height: 400rpx;
    box-sizing: border-box;
    .selectMain {
      flex-wrap: wrap;
      padding: 30rpx;
      padding-bottom: 0;
    }
  }
  .selectbtn {
    border-top: 1px solid #e6e6e6;
    padding: 30rpx;
    color: $uni-color-primary;
    width: 100%;
    font-size: 32rpx;
    text-align: center;
    box-sizing: border-box;
  }
}
.other {
  margin: 0rpx 30rpx 0rpx 30rpx;
  position: relative;
  font-size: 30rpx;
  color: #1a1a1a;
  text-align: center;
  font-weight: bold;
  &::before {
    content: '';
    width: 4rpx;
    height: 28rpx;
    background: $uni-color-primary;
  }
}
.select-member {
  width: 173rpx;
  height: 60rpx;
  background: rgba(242, 242, 242, 1);
  border-radius: 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 60rpx;
  text-align: center;
  margin: 30rpx 30rpx 0rpx 0rpx;
  &.s {
    background: rgba(10, 178, 193, 1);
    color: rgba(255, 255, 255, 1);
  }
  &.add {
    color: rgba(10, 178, 193, 1);
  }
}
.no-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .msg {
    margin-top: 15px;
    font-size: 14px;
    color: #666;
  }
}
</style>
