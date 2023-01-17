<template>
  <uni-popup ref="popupDialog">
    <view class="uni-popup-dialog" :style="{ width: width + 'px' }">
      <view class="uni-dialog-title">
        <text
          class="uni-dialog-title-text"
          :class="['uni-popup__' + dialogType]"
          >{{ title }}</text
        >
      </view>
      <view :class="showBtn ? 'uni-dialog-content' : 'nobtn-content'">
        <slot />
      </view>
      <view class="uni-dialog-button-group" v-if="showBtn">
        <view class="uni-dialog-button" @click="cancel">
          <text class="uni-dialog-button-text">取消</text>
        </view>
        <view class="uni-dialog-button uni-border-left" @click="submit">
          <text class="uni-dialog-button-text uni-button-color">确定</text>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
/**
 * PopUp 弹出层-对话框样式
 * @description 弹出层-对话框样式
 * @property {String} type = [success|warning|info|error] 主题样式
 * @event {Function} confirm 点击确认按钮触发
 * @event {Function} close 点击取消按钮触发
 */

export default {
  name: 'formPopupDialog',
  props: {
    // 对话框主题 success/warning/info/error
    type: {
      type: String,
      default: 'info',
    },
    // 对话框标题
    title: {
      type: String,
      default: '提示',
    },
    width: {
      type: Number,
      default: 300,
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogType: 'info',
      focus: false,
    }
  },
  watch: {
    type(val) {
      this.dialogType = val
    },
  },
  created() {
    this.dialogType = this.type
  },
  mounted() {
    this.focus = true
  },
  methods: {
    // 点击确认按钮
    open() {
      this.$refs.popupDialog.open()
    },
    // 点击取消按钮
    close() {
      this.$refs.popupDialog.close()
    },
    submit() {
      this.$emit('confirm')
    },
    cancel() {
      this.close()
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
.uni-popup-dialog {
  border-radius: 15px;
  background-color: #fff;
}

.uni-dialog-title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  padding-top: 15px;
  padding-bottom: 5px;
}

.uni-dialog-title-text {
  font-size: 16px;
  font-weight: 500;
}

.uni-dialog-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 15px 15px 15px;
}
.nobtn-content {
  padding: 5px 15px 0;
}
.uni-dialog-content-text {
  font-size: 14px;
  color: #6e6e6e;
}

.uni-dialog-button-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-dialog-button {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */

  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 45px;
}

.uni-border-left {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-dialog-button-text {
  font-size: 14px;
}

.uni-button-color {
  color: $uni-color-primary;
}

.uni-dialog-input {
  flex: 1;
  font-size: 14px;
}

.uni-popup__success {
  color: $uni-color-success;
}

.uni-popup__warn {
  color: $uni-color-warning;
}

.uni-popup__error {
  color: $uni-color-error;
}

.uni-popup__info {
  color: #909399;
}

.uni-popup__wrapper-box {
  display: block;
  position: relative;
}
</style>
