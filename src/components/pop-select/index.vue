<template>
  <uni-popup ref="popup" type="center" :maskClick="false">
    <view class="selectWrap">
      <view class="title">{{ title }}</view>
      <scroll-view scroll-y="true" class="scroll">
        <view class="flex-between selectMain">
          <axb-checkbox
            ref="radio3"
            class="radioItem"
            :multi="multi"
            :list="lists"
            @change="changeType"
          ></axb-checkbox>
          <view
            v-if="isAdd"
            class="add"
            :style="
              ynum > 0
                ? `top:-90rpx;left:${ynum * 200}rpx;`
                : ynum == 0
                ? 'top:-70rpx;'
                : ''
            "
            @click="add"
            >+新增</view
          >
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
    isAdd: {
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
    ynum() {
      console.log(this.lists)
      console.log(this.lists.length % 3)
      return this.lists.length % 3
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
    add() {
      this.$refs.popup.close()
      uni.navigateTo({
        url: '/pages-user/patientManagement/add',
      })
    },
    changeType(e) {
      const arr = Array.isArray(e) ? e.filter(item => item) : e
      this.$emit('change', arr)
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
  .add {
    min-width: 160rpx;
    height: 60rpx;
    padding: 0 24rpx;
    border-radius: 30rpx;
    background: $uni-color-primary;
    color: #fff;
    line-height: 60rpx;
    text-align: center;
    margin-right: 20rpx;
    box-sizing: border-box;
    position: relative;
  }
}
</style>
