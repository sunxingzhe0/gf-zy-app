<template>
  <view class="popOut">
    <view class="pop-content">
      <view class="header"
        >{{ title || '' }}
        <text @click="hide">x</text>
      </view>
      <view class="content" :class="{ isborder: !hideFooter }"
        ><slot></slot
      ></view>
      <view class="footer" v-if="hideFooter">
        <view>
          <text @click="hide">取消</text>
          <text @click="submit">保存</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    hideFooter: {
      type: Boolean,
    },
  },
  methods: {
    hide() {
      this.$emit('close', '取消')
    },
    submit() {
      this.$emit('close', '保存')
    },
  },
}
</script>

<style lang="scss" scoped>
.popOut {
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  .pop-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90%;
  }
  .header {
    flex: 0 0 40px;
    width: 100%;
    text-align: center;
    background: #fff;
    line-height: 40px;
    position: relative;
    border-radius: 10px 10px 0 0;
    text {
      font-size: 14px;
      text-align: center;
      line-height: 12px;
      color: #999;
      padding: 4px;
      border: 1px solid #999;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }
  .content {
    background: #fff;
    width: 100%;
  }
  .isborder {
    border-radius: 0 0 10px 10px;
  }
  .footer {
    flex: 0 0 60px;
    background: #fff;
    border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 10px 10px;
    > view {
      display: flex;
      text:first-child {
        margin-right: 10px;
      }
      text:last-child {
        background: #09b1c1;
        color: #fff;
      }
      text {
        width: 200rpx;
        height: 66rpx;
        font-size: 12px;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>
