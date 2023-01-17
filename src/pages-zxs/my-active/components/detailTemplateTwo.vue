<template>
  <view
    :style="{
      background: '#505360',
      paddingBottom: isInfo ? '40rpx' : '',
      paddingBottom: '100rpx',
    }"
  >
    <view class="title">
      <image class="title-bg" :src="FILE_URL_BUILT_IN('tp_two_bg.png')"></image>
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

    <view class="card">
      <view class="flex-between">
        <view class="nail"></view>
        <view class="nail"></view>
      </view>
      <view class="card-title">{{ detail.activityType }}</view>
      <view class="name">{{ detail.activityName }}</view>
      <text class="context"
        >开展关爱心灵活动。抑郁症已是人们自杀最大的凶手，特别是青年与中年人群，已经影响正常工作与学习，在当前社会情况下
        治疗心理疾病已迫在眉睫。</text
      >
    </view>

    <view class="card">
      <view class="flex-between">
        <view class="nail"></view>
        <view class="nail"></view>
      </view>
      <view class="card-title">活动详情</view>
      <view class="item" style="margin-top: 59rpx">
        <text class="item-name">报名开始时间:</text>
        <text class="item-centext">{{ detail.activityBeginTime }}</text>
      </view>
      <view class="item">
        <text class="item-name">报 名 费:</text>
        <text class="item-centext"
          ><text style="color: #ee4744">{{ detail.activityCost }}</text
          >元/人</text
        >
      </view>
      <view class="item">
        <text class="item-name"> 名 额:</text>
        <text class="item-centext">{{ detail.activityQuota }} 人</text>
      </view>
      <view class="item">
        <text class="item-name">负 责 人:</text>
        <text class="item-centext">{{
          `${detail.activityDirector} ${detail.directorTitle} ${detail.directorDept}`
        }}</text>
      </view>
      <view class="item">
        <text class="item-name">地 点:</text>
        <text class="item-centext">{{ detail.activityAddr }}</text>
      </view>
    </view>

    <view style="margin-top: 40rpx">
      <view class="justify-content">
        <view class="align-content">
          <view class="left-l"></view>
          <view class="round"></view>
        </view>
        <text class="instructions">活动须知</text>
        <view class="align-content">
          <view class="round"></view>
          <view class="right-l"></view>
        </view>
      </view>
      <view class="it-detail">
        <view
          >1、<text style="color: #fca62c"
            >购买须知：{{ detail.purchaseNote }}</text
          ></view
        >
        <view>2、联系电话：{{ detail.activityTell }}</view>
        <view>3、退款说明：{{ detail.refundDesc }}</view>
        <view>4、其他说明：{{ detail.otherDesc }}</view>
      </view>
    </view>

    <view class="signup-card">
      <view class="signup-name">报名信息</view>
      <template>
        <view class="input-item flex-between">
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
              v-model="formData.phone"
              disabled
              placeholder="请输入手机号"
            />
            <view class="send">发送验证码</view>
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
                  placeholder-class="input_pla"
                  placeholder="请输入"
                  disabled
                  auto-height
                />
                <radio-group v-if="item.fieldType == '单选框'" disabled>
                  <label
                    v-for="(radioItem, i) in item.optionValue"
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
                    disabled
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
        </template>
      </template>
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
import { mixins } from './minxns'
import footerBtn from './footerBtn'
export default {
  components: { footerBtn },
  mixins: [mixins],
  data() {
    return {
      indicatorStyle: `height: 80rpx;`,
      sexV: [0],
      memberInfo: {},
      patients: [],
      fromData: {},
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
.title {
  height: 599rpx;
  width: 100%;
  position: relative;
  .title-bg {
    position: absolute;
    width: 100%;
    height: 599rpx;
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
  .title-text {
    margin-top: 40rpx;
    position: absolute;
    width: 162rpx;
    height: 54rpx;
    line-height: 54rpx;
    text-align: center;
    background: linear-gradient(90deg, #f5d5c6 0%, #f8b68e 100%);
    border-radius: 0rpx 24rpx 24rpx 0rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #505360;
  }
}
.card {
  padding: 30rpx 30rpx 50rpx 30rpx;
  margin: 40rpx 40rpx 0rpx 40rpx;
  background: linear-gradient(0deg, #e5ad8d 0%, #f5d5c7 100%);
  box-shadow: -1rpx -1rpx 4rpx 0rpx #c87958;
  border-radius: 20rpx;
  .nail {
    width: 24rpx;
    height: 24rpx;
    background: #505360;
    border-radius: 12rpx;
  }
  .card-title {
    font-size: 50rpx;
    font-family: PingFang SC;
    font-weight: 800;
    text-align: center;
    color: #824725;
  }
  .name {
    margin: 30rpx 0rpx;
    text-align: center;
    font-size: 36rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #824725;
    line-height: 66rpx;
  }
  .context {
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .item {
    display: flex;
    .item-name {
      width: 172rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #824725;
      line-height: 56rpx;
    }
    .item-centext {
      margin-left: 39rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 56rpx;
    }
  }
}
.left-l {
  width: 230rpx;
  height: 2rpx;
  background: linear-gradient(-90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}
.right-l {
  width: 230rpx;
  height: 2rpx;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}
.round {
  width: 8rpx;
  height: 8rpx;
  background: #ffffff;
  border-radius: 50%;
}
.instructions {
  margin: 0rpx 45rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 56rpx;
}
.it-detail {
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 56rpx;
  margin: 20rpx 40rpx 40rpx 40rpx;
}
.input-item {
  height: 90rpx;
  padding: 0rpx 30rpx;
  background: #f2f2f2;
  border-radius: 45rpx;
  margin-bottom: 30rpx;
  color: #333333;
  font-size: 30rpx;
  width: 100%;
  box-sizing: border-box;
}
.submit {
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(0deg, #e3a987 0%, #f5d4c7 100%);
  box-shadow: 1px 10px 20px 0px rgba(149, 94, 63, 0.4);
  border-radius: 44rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #824725;
  text-align: center;
  margin: -40rpx 80rpx 0rpx 80rpx;
}
.send {
  width: 220rpx;
  margin-right: -20rpx;
  padding: 20rpx 19rpx;
  background: #f2f2f2;
  border-radius: 36rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #fd8300;
  text-align: center;
}
.signup-card {
  background: #464955;
  border-radius: 20rpx;
  padding: 40rpx;
  margin: 40rpx 40rpx 0rpx 40rpx;
  .signup-name {
    font-size: 50rpx;
    font-family: PingFang SC;
    font-weight: 800;
    color: #ffffff;
    height: 46rpx;
    line-height: 46rpx;
    text-align: center;
    margin-bottom: 36rpx;
  }
  ::v-deep.input_pla {
    font-size: 30rpx;
    color: #ccc;
    width: 100%;
  }
  .item-name {
    color: #fff;
    font-size: 26rpx;
    font-family: PingFang SC;
    width: 120rpx;
    display: inline-block;
  }
  .item-centext {
    color: #fff;
    font-size: 26rpx;
    font-family: PingFang SC;
  }
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
