<template>
  <view class="main">
    <image
      class="img"
      mode="widthFix"
      :src="FILE_URL_BUILT_IN('tp_one_bg.png')"
    ></image>
    <text class="item-state">{{
      detail.activityStatus == 1
        ? '进行中'
        : detail.activityStatus == 1
        ? '已结束'
        : detail.activityStatus == 3
        ? '暂停'
        : '未开始'
    }}</text>
    <view class="card">
      <view class="card-title">
        <text class="card-bg">DETAILS</text>
        <text class="card-name">活动详情</text>
      </view>

      <view class="item">
        <text class="item-name">活 动 名 称:</text>
        <text class="item-centext"
          >【{{ detail.activityType }}】{{ detail.activityName }}</text
        >
      </view>
      <view class="item">
        <text class="item-name">报名开始时间:</text>
        <text class="item-centext">{{ detail.activityBeginTime }}</text>
      </view>
      <view class="item">
        <text class="item-name">报 名 费:</text>
        <text class="item-centext"
          ><text style="color: #ee4744">{{
            isInfo ? detail.cost : detail.activityCost
          }}</text
          >元/人</text
        >
      </view>
      <view class="item">
        <text class="item-name"> 名 额:</text>
        <text class="item-centext">{{ detail.activityQuota }} 人</text>
      </view>
      <view class="item">
        <text class="item-name">负 责 人:</text>
        <text class="item-centext"
          >{{ detail.activityDirector }} {{ detail.directorTitle }} |{{
            detail.directorDept
          }}</text
        >
      </view>
      <view class="item">
        <text class="item-name">地 点:</text>
        <text class="item-centext">{{ detail.activityAddr }}</text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">
        <text class="card-bg">INSTRUCTIONS</text>
        <text class="card-name">活动须知</text>
      </view>

      <view class="item">
        <text class="item-name">购 买 须 知:</text>
        <text class="item-centext">{{ detail.purchaseNote }}</text>
      </view>
      <view class="item">
        <text class="item-name">联 系 电 话:</text>
        <text class="item-centext">{{ detail.activityTell }}</text>
      </view>
      <view class="item" v-if="detail.refundDesc">
        <text class="item-name">退 款 说 明:</text>
        <text class="item-centext">{{ detail.refundDesc }}</text>
      </view>
      <view class="item">
        <text class="item-name">其 他 说 明:</text>
        <text class="item-centext"> {{ detail.otherDesc }}</text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">
        <text class="card-bg">SIGN UP</text>
        <text class="card-name">报名信息</text>
      </view>
      <template>
        <view class="input-item flex-between" @click="patientSelect">
          <input
            :value="memberInfo.name"
            disabled
            placeholder-class="input_pla"
            placeholder="请选择就诊人"
          />
          <text class="iconfont icon-xiangyou"></text>
        </view>
        <view class="input-layout">
          <view class="input-item flex-between">
            <input
              placeholder-class="input_pla"
              disabled
              v-model="formData.phone"
              placeholder="请输入手机号"
            />
            <view class="send" @click="getcode">发送验证码</view>
          </view>
        </view>
        <view class="input-layout no-border">
          <view class="input-item flex-between">
            <input
              v-model="formData.code"
              disabled
              placeholder-class="input_pla"
              placeholder="请输入手机中收到的验证码"
            />
          </view>
        </view>
        <template v-for="(item, index) in relList">
          <template
            v-if="item.fieldName !== '姓名' && item.fieldName !== '手机'"
          >
            <view class="input-layout" :key="index">
              <!-- <text class="input-name">{{ item.fieldName }}</text> -->
              <view class="input-item flex-between">
                <input
                  v-if="item.fieldType == '普通文本框'"
                  placeholder-class="input_pla"
                  disabled
                  v-model="item.fieldValue"
                  :placeholder="`请输入${item.fieldName}`"
                />
                <textarea
                  v-if="item.fieldType == '多行文本框'"
                  disabled
                  placeholder-class="input_pla"
                  placeholder="请输入"
                  auto-height
                />
                <radio-group
                  disabled
                  v-if="item.fieldType == '单选框'"
                  @change="radioChange(item, $event)"
                >
                  <label
                    v-for="(radioItem, i) in item.optionValue"
                    style="margin-right: 10rpx"
                    :key="i"
                    ><radio
                      style="transform: scale(0.7)"
                      :value="radioItem"
                      color="#0ab2c1"
                    />{{ radioItem }}</label
                  >
                </radio-group>
                <checkbox-group
                  disabled
                  v-show="item.fieldType == '复选框'"
                  @change="checkboxChange(item, $event)"
                >
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
                    disabled
                    :value="item.fieldValue"
                    placeholder-class="input_pla"
                  />
                  <text class="iconfont icon-xiangyou"></text>
                </view>
                <!-- 输入 -->
                <input
                  disabled
                  type="number"
                  placeholder="请输入"
                  v-model="item.fieldValue"
                  placeholder-class="input_pla"
                  v-if="item.fieldType == '数值'"
                />
                <!-- 时间 -->
                <view
                  class="input-item flex-between"
                  @click="popOpen(item, index)"
                  v-if="item.fieldType == '时间'"
                >
                  <input
                    disabled
                    placeholder="请选择时间"
                    :value="item.fieldValue"
                    placeholder-class="input_pla"
                  />
                  <text class="iconfont icon-xiangyou"></text>
                </view>
              </view>
            </view>
          </template>
        </template>

        <view
          class="submit"
          :class="optionHasToken ? 'disabled' : ''"
          @click="submit"
          >提交申请</view
        >
      </template>
    </view>
    <view class="bg">
      <image class="img1" src="../../static/tp_one_bottom.png"></image>
      <image class="img2" src="../../static/tp_one_h.png"></image>
    </view>
    <footerBtn
      :signId="signId"
      :actName="detail.activityName"
      :actType="detail.activityType"
      :actState="detail.activityStatus"
      v-if="detail.activityTemplateId"
      :activityTemplateId="detail.activityTemplateId"
    ></footerBtn>
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
import footerBtn from './footerBtn.vue'
import { mixins } from './minxns'
export default {
  components: { footerBtn },
  mixins: [mixins],
  data() {
    return {
      indicatorStyle: `height: 80rpx;`,
      sexV: [0],
      memberInfo: {},
      patients: [],
      fromData: {
        phone: '', //手机号
        phoneCode: '', //验证码
      },
      detail: {},
    }
  },
}
</script>
<style lang="scss" scoped>
.justify-content {
  display: flex;
  justify-content: center;
}
.main {
  background: #2a5cea;
  position: relative;
  padding-bottom: 100rpx;
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
.img {
  width: 100%;
}
.title {
  width: 100%;

  display: flex;
  align-items: flex-end;

  .title-l {
    min-height: 200rpx;
    padding: 60rpx 30rpx;
    width: 400rpx;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    /* background-image: url('@/static/tp_one_title_l.png'); */
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-left: 40rpx;
  }
  .title-r {
    width: 386rpx;
    height: 300rpx;
    margin-left: -90rpx;
  }
}
.card {
  padding: 10rpx 30rpx 30rpx 30rpx;
  margin: 30rpx 35rpx 0rpx 35rpx;
  background: #e0e7fb;
  border-radius: 20rpx;
  .card-title {
    height: 100rpx;
    position: relative;
    width: 100%;
    .card-bg {
      position: absolute;
      font-size: 60rpx;
      width: 100%;
      font-family: PingFang SC;
      font-weight: 600;
      color: #b9c9f5;
      line-height: 90rpx;
      text-align: center;
    }
    .card-name {
      width: 100%;
      position: absolute;
      font-size: 40rpx;
      font-family: PingFang SC;
      font-weight: 800;
      color: #2a5cea;
      line-height: 90rpx;
      text-align: center;
    }
  }
  .item {
    display: flex;
    .item-name {
      min-width: 172rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #2a5cea;
      line-height: 56rpx;
    }
    .item-centext {
      display: 1;
      margin-left: 24rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 56rpx;
    }
  }

  .input-item {
    height: 90rpx;
    padding: 0rpx 30rpx;
    background: #f2f2f2;
    border-radius: 45rpx;
    margin-bottom: 30rpx;
    color: #333333;
    font-size: 30rpx;
  }
  .submit {
    margin: 0rpx 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    background: #2a5cea;
    border-radius: 45rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
  }
  .send {
    margin-right: -20rpx;
    padding: 20rpx 19rpx;
    background: #e5ebfb;
    border-radius: 36rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #2a5cea;
    text-align: center;
  }
}
.bg {
  position: relative;
  height: 70rpx;
  /* bottom: 100rpx; */
  .img1 {
    position: absolute;
    width: 100%;
    height: 100rpx;
    top: -30rpx;
  }
  .img2 {
    position: absolute;
    left: 30rpx;
    width: 120rpx;
    height: 140rpx;
    top: -80rpx;
  }
}
::v-deep.input_pla {
  font-size: 30rpx;
  color: #ccc;
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
  background: #ccc !important;
}
</style>
