<template>
  <view style="padding-bottom:100rpx;">
    <view style="position: relative">
      <image class="img_bg" :src="FILE_URL_BUILT_IN('tp_bas_bg.png')"></image>
      <text class="item-state">{{
        detail.activityStatus == 1
          ? '进行中'
          : detail.activityStatus == 1
          ? '已结束'
          : detail.activityStatus == 3
          ? '暂停'
          : '未开始'
      }}</text>
    </view>

    <view>
      <view class="card card-padding">
        <view class="c-name"
          >【{{ detail.activityType }}】{{ detail.activityName }}</view
        >
        <view class="c-context" v-html="detail.activityInstruction">{{
          detail.activityInstruction
        }}</view>
      </view>
      <view class="card card-padding-tb">
        <view class="item">
          <text class="item-name">报名开始时间</text>
          <text class="item-centext">{{ detail.activityBeginTime }}</text>
        </view>
        <view class="item">
          <text class="item-name">报名费</text>
          <text class="item-centext"
            ><text style="color: #ee4744">{{
              isInfo ? detail.cost : detail.activityCost
            }}</text
            >元/人</text
          >
        </view>
        <view class="item">
          <text class="item-name">名额:</text>
          <text class="item-centext">{{ detail.activityQuota }} 人</text>
        </view>
        <view class="item">
          <text class="item-name">负责人</text>
          <text class="item-centext"
            >{{ detail.activityDirector }} {{ detail.directorTitle || '' }} |
            {{ detail.activityDept || '-' }}</text
          >
        </view>
        <view class="item">
          <text class="item-name">地点</text>
          <text class="item-centext">{{ detail.activityAddr }}</text>
        </view>
      </view>

      <view class="card card-padding-tb">
        <view class="item">
          <text class="item-name">购买须知</text>
          <view class="item-centext"
            ><text style="color: #e1a422">{{ detail.purchaseNote }}</text></view
          >
        </view>
        <view class="item">
          <text class="item-name">联系电话</text>
          <text class="item-centext">{{ detail.activityTell }}</text>
        </view>
        <view class="item" v-if="detail.refundDesc">
          <text class="item-name">退款说明</text>
          <text class="item-centext">{{ detail.refundDesc }}</text>
        </view>
        <view class="item no-border">
          <text class="item-name">其他说明</text>
          <text class="item-centext">{{ detail.otherDesc }}</text>
        </view>
      </view>

      <view class="card card-padding-tb">
        <view class="sing">
          <text class="name">报名信息</text>
        </view>
        <template>
          <view class="input-layout">
            <text class="input-name">姓名</text>
            <view class="input-item flex-between">
              <input
                :value="memberInfo.name"
                disabled
                placeholder-class="input_pla"
                placeholder="请选择就诊人"
              />
            </view>
          </view>

          <view class="input-layout">
            <text class="input-name">手机号</text>
            <view class="input-item flex-between">
              <input
                placeholder-class="input_pla"
                v-model="formData.phone"
                disabled
                placeholder="请输入"
              />
              <view class="send">发送验证码</view>
            </view>
          </view>
          <view class="input-layout no-border">
            <text class="input-name">验证码</text>
            <view class="input-item">
              <input
                v-model="formData.code"
                disabled
                placeholder-class="input_pla"
                placeholder="请输入手机中收到的验证码"
              />
            </view>
          </view>

          <view v-for="(item, index) in relList" :key="index">
            <template
              v-if="item.fieldName !== '姓名' && item.fieldName !== '手机'"
            >
              <view class="input-layout">
                <text class="input-name">{{ item.fieldName }}</text>
                <view class="input-item flex-between">
                  <input
                    v-if="item.fieldType == '普通文本框'"
                    placeholder-class="input_pla"
                    v-model="item.fieldValue"
                    disabled
                    placeholder="请输入"
                  />
                  <textarea
                    v-if="item.fieldType == '多行文本框'"
                    placeholder-class="input_pla"
                    placeholder="请输入"
                    disabled
                    auto-height
                  />
                  <radio-group v-if="item.fieldType == '单选框'" disabled>
                    <label
                      v-for="(radioItem, i) in item.optionValue.J"
                      style="margin-right: 10rpx"
                      :key="i"
                    >
                      <radio
                        style="transform: scale(0.7)"
                        :value="radioItem"
                        color="#0ab2c1"
                      />{{ radioItem }}
                    </label>
                  </radio-group>
                  <checkbox-group v-show="item.fieldType == '复选框'" disabled>
                    <label
                      v-for="(radioItem, i) in item.optionValue"
                      style="margin-right: 10rpx"
                      :key="i"
                    >
                      <checkbox
                        color="#0ab2c1"
                        :value="radioItem"
                        style="transform: scale(0.7)"
                      />{{ radioItem }}
                    </label>
                  </checkbox-group>
                  <!-- 选择 -->
                  <view
                    v-if="item.fieldType == '下拉选框'"
                    class="input-item flex-between"
                    @click="popOpen(item, index)"
                  >
                    <input
                      placeholder="请选择"
                      :value="item.fieldValue"
                      placeholder-class="input_pla"
                    />
                    <text class="iconfont icon-xiangyou"></text>
                  </view>
                  <!-- 输入 -->
                  <input
                    type="number"
                    placeholder="请输入"
                    v-model="item.fieldValue"
                    disabled
                    placeholder-class="input_pla"
                    v-if="item.fieldType == '数值'"
                  />
                  <!-- 时间 -->
                  <view
                    class="input-item flex-between"
                    v-if="item.fieldType == '时间'"
                  >
                    <input
                      placeholder="请选择时间"
                      :value="item.fieldValue"
                      disabled
                      placeholder-class="input_pla"
                    />
                    <text class="iconfont icon-xiangyou"></text>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </template>
      </view>
    </view>
    <footerBtn
      :signId="signId"
      :actName="detail.activityName"
      :actType="detail.activityType"
      :actState="detail.activityStatus"
      v-if="detail.activityTemplateId"
      :activityTemplateId="detail.activityTemplateId"
    ></footerBtn>
    <pop-select
      title="健康卡"
      ref="patientPop"
      textStyle="color:#666;"
      :isother="true"
      :list="patients"
      @change="patientChange"
      @submit="patientSubmit"
    >
    </pop-select>
    <uni-popup ref="selectPop" type="bottom">
      <view class="pop-view">
        <view class="p-title"
          >{{ popData.title }}
          <view class="p-icon" @click="cancelPop">
            <uni-icons :size="22" color="#e6e6e6" type="clear" />
          </view>
        </view>
        <picker-view
          style="height: 200px; text-align: center"
          :indicator-style="`indicatorStyle`"
          :value="popData.value"
          @change="popChange"
        >
          <picker-view-column>
            <view
              v-for="(item, index) in popData.option"
              class="p-item"
              :key="index"
              >{{ item }}</view
            >
          </picker-view-column>
        </picker-view>

        <view @click="popConfirm" class="p-confirm">确认</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import popSelect from '@/components/pop-select/index.vue'
import footerBtn from './footerBtn.vue'
import { mixins } from './minxns'
export default {
  components: { popSelect, footerBtn },
  mixins: [mixins],
  data() {
    return {
      popData: {
        title: '',
        index: '',
        value: [],
        option: [],
      },
      detail: {},
      patients: [],
      memberInfo: {},
      formData: {
        id: '',
        name: '',
        code: '',
        phone: '',
        orderId: '',
        signTime: '',
        memberId: '',
        activityId: '',
        relList: [],
      },
      relList: [],
    }
  },
}
</script>
<style lang="scss" scoped>
.justify-content {
  display: flex;
  justify-content: center;
}
.img_bg {
  width: 100%;
  height: 350rpx;
}
.item-state {
  position: absolute;
  top: 30rpx;
  right: 20rpx;
  background: #0ab2c1;
  color: #fff;
  padding: 4rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  &.end {
    background: #999999;
  }
}
.card-padding {
  padding: 30rpx;
}
.card-padding-tb {
  padding: 0rpx 30rpx;
}
.card {
  margin: 0rpx 20rpx 20rpx 20rpx;
  background: #ffffff;
  box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 20rpx;
  .c-name {
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 30rpx;
  }
  .c-context {
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(77, 77, 77, 0.8);
    line-height: 46rpx;
  }
}
.title {
  position: absolute;
  top: 60rpx;
  left: 64rpx;

  .t-e {
    font-size: 22rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
  .t-name {
    margin-top: 15rpx;
    font-size: 44rpx;
    font-family: JHRuHeiZhong;
    font-weight: 400;
    font-style: italic;
    color: #ffffff;
  }
  .t-describe {
    margin-left: 35rpx;
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffffff;
    border: 1rpx solid #ffffffff;
    border-radius: 6rpx;
    padding: 8rpx 20rpx;
  }
}
.item {
  display: flex;
  border-bottom: 1rpx solid #e6e6e6;
  padding: 30rpx 0rpx;
  align-items: center;
  .item-name {
    width: 172rpx;
    flex-shrink: 0;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 56rpx;
  }
  .item-centext {
    flex: 1;
    word-break: break-word;
    margin-left: 24rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.input-layout {
  display: flex;

  width: 100%;
  border-bottom: 1rpx solid #ffe6e6e6;
  padding: 30rpx 0rpx;
  .input-name {
    min-width: 180rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }
  .input-item {
    flex: 1;
    max-width: 450rpx;
    /* margin-left: 20rpx; */
    color: #333333;
    font-size: 30rpx;
  }
}
.no-border {
  border-bottom: 0rpx solid #ffe6e6e6;
}

::v-deep.input_pla {
  font-size: 30rpx;
  color: #ccc;
}
.send {
  width: 250rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #0ab2c1;
}
.sing {
  padding: 30rpx 0rpx;
  border-bottom: 1rpx solid #e6e6e6;
  .name {
    border-left: 1rpx solid #0ab2c1;
    padding-left: 10rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 50rpx;
  }
}
.submit {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  margin: 30rpx 20rpx 0rpx 20rpx;
  background: #0ab2c1;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
}
.pop-view {
  width: 100%;
  min-height: 700rpx;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .p-title {
    font-size: 32rpx;
    height: 110rpx;
    line-height: 110rpx;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    .p-icon {
      position: absolute;
      top: 0rpx;
      right: 32rpx;
    }
  }

  .p-confirm {
    position: absolute;
    width: 100%;
    bottom: 0rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: $uni-color-primary;
    color: #fff;
  }
  .p-item {
    height: 80rpx;
    line-height: 80rpx;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
.disabled {
  background: #ccc;
}
</style>
