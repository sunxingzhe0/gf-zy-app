<template>
  <view class="edit-form">
    <template v-for="v in data.relList">
      <view class="content" :key="v.id">
        <view class="label">{{ v.fieldName }}：</view>
        <view class="value">{{ v.fieldValue || '-' }}</view>
      </view>
    </template>
    <view class="content">
      <view class="label">报名费：</view>
      <view class="value">¥ {{ data.cost }}</view>
    </view>
    <view class="content border-top" v-if="!type">
      <view class="label required">退款方式：</view>
      <view class="value flex-between" @click="$refs.typePop.open()">
        <text class="left">{{ typeRange[typeIndex].label || '请选择' }}</text>
        <text class="iconfont icon-xiala icons"></text>
      </view>
    </view>
    <view :class="'content ' + (type ? '' : 'border-top')">
      <view :class="'label ' + (type ? '' : 'required')">备注：</view>
      <view class="value">
        <view class="flex-between" @click="$refs.descPop.open()">
          <text class="left">{{ desc || '请选择' }}</text>
          <text class="iconfont icon-xiala icons"></text>
        </view>
        <view v-if="descIndex == 2" style="padding-top: 14rpx">
          <uni-easyinput type="textarea" v-model="remark" />
        </view>
      </view>
    </view>
    <view class="foot" v-if="type"
      >*温馨提示：审核同意后，患者将获得参加本次团体治疗的资格</view
    >
    <view class="btn-group">
      <view class="btns" @click="cancel">
        <text class="btn-text">取消</text>
      </view>
      <view class="btns left-border" @click="submit">
        <text class="btn-text btn-color">确定</text>
      </view>
    </view>
    <PickerPop title="退款方式" ref="typePop" @confrim="typeConfirm">
      <picker-view
        :value="actType"
        style="height: 200px; text-align: center"
        indicator-style="height:80rpx;"
        @change="typeChange"
      >
        <picker-view-column>
          <view v-for="v in typeRange" :key="v.value" class="picker-item">{{
            v.label
          }}</view>
        </picker-view-column>
      </picker-view>
    </PickerPop>
    <PickerPop title="选择备注" ref="descPop" @confrim="descConfirm">
      <picker-view
        :value="descVal"
        style="height: 200px; text-align: center"
        indicator-style="height:80rpx;"
        @change="descChange"
      >
        <picker-view-column>
          <view v-for="v in descRange" :key="v" class="picker-item">{{
            v
          }}</view>
        </picker-view-column>
      </picker-view>
    </PickerPop>
  </view>
</template>
<script>
import uniEasyinput from '@/pages-zxs/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput'
import PickerPop from '../../../my-active/components/PickerPop/index'
import { signAgree, signRefuse } from '../../../api/signupOrder'
export default {
  components: { PickerPop, uniEasyinput },
  props: {
    type: {
      type: Boolean,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      actType: [0],
      typeIndex: 0,
      typeRange: [
        { label: '原路退回', value: 2 },
        { label: '不退费', value: 1 },
        { label: '线下退款', value: 3 },
      ],
      refundWay: 2,
      remark: '',
      desc: '',
      descVal: [0],
      descIndex: 0,
      descRange: ['请选择', '已完成心理咨询', '其他'],
    }
  },
  methods: {
    async submit() {
      let param = {
        approvalResult: this.type ? 1 : 2,
        signId: this.data.id,
        remark: this.descIndex == 2 ? this.remark : this.desc,
        status: 2,
      }
      if (this.type) {
        await signAgree({ ...param })
      } else {
        if (!this.refundWay) {
          return this.noIconToast('请选择退款方式')
        }
        if (this.descIndex == 2) {
          if (!this.remark) {
            return this.noIconToast('请输入备注')
          }
        } else {
          if (!this.desc) {
            return this.noIconToast('请选择备注')
          }
        }
        await signRefuse({
          refundWay: this.refundWay,
          ...param,
        })
      }
      this.restForm()
      this.$emit('confrim')
    },
    cancel() {
      this.restForm()
      this.$emit('cancel')
    },
    restForm() {
      this.remark = ''
      this.descVal = [0]
      this.descIndex = 0
      this.desc = ''
      this.actType = [0]
      this.typeIndex = 0
      this.refundWay = 2
    },
    typeChange(e) {
      this.typeIndex = e.detail.value[0]
    },
    typeConfirm() {
      this.actType = [this.typeIndex]
      this.refundWay = this.typeRange[this.typeIndex].value
    },
    remarkChange() {
      this.remark = e.detail.value
    },
    descChange(e) {
      this.descIndex = e.detail.value[0]
    },
    descConfirm() {
      this.descVal = [this.descIndex]
      this.desc =
        this.descRange[this.descIndex] == '请选择'
          ? ''
          : this.descRange[this.descIndex]
    },
    noIconToast(text) {
      return uni.showToast({
        title: text,
        icon: 'none',
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .uni-forms {
  width: 600rpx !important;
}
.edit-form {
  width: 100%;
  padding-top: 10rpx;
  box-sizing: border-box;
}
.content {
  display: flex;
  position: relative;
  margin-bottom: 10rpx;
  flex-shrink: 0;
  .label {
    position: relative;
    width: 130rpx;
    margin-left: 10rpx;
    flex-shrink: 0;
    color: #666;
  }
  .value {
    flex: 1;
    text-align: right;
    color: #333;
    .left {
      margin-left: 24rpx;
    }
  }
}
.text-left {
  text-align: left !important;
}
.foot {
  font-size: 22rpx;
  color: orangered;
}
.btn-group {
  display: flex;
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

.btns {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 45px;
}

.btn-text {
  font-size: 14px;
}

.btn-color {
  color: $uni-color-primary;
}
.left-border {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}
.border-top {
  border-top: 1rpx solid #e7e7e7;
  padding-top: 10rpx;
}
.icons {
  font-size: 16rpx;
  color: #666;
}
.picker-item {
  line-height: 34px;
}
.required {
  &::before {
    content: '*';
    color: #ea4444;
    font-size: 22rpx;
    position: absolute;
    top: -5rpx;
    left: -10rpx;
  }
}
</style>
