<template>
  <uni-popup ref="popup" type="center" :maskClick="false">
    <view class="selectWrap">
      <view class="title">{{ title }}</view>
      <scroll-view scroll-y="true" class="scroll">
        <view class="flex-between selectMain">
          <axb-checkbox
            ref="radio3"
            :multi="multi"
            :list="lists"
            @change="changeType"
          ></axb-checkbox>
        </view>
      </scroll-view>
      <view class="selectbtn" @click="selectSubmit"><text>确定</text></view>
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
    multi: {
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
    changeType(e) {
      const arr=Array.isArray(e) ? e.filter(item => item) : e
      this.$emit('change',arr)
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
</style>
