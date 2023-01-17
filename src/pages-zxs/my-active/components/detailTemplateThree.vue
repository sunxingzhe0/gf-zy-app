<template>
  <view style="background: #4551d8; height: 100%;padding-bottom:100rpx;">
    <view class="title">
      <image
        mode="widthFix"
        class="bg"
        :src="FILE_URL_BUILT_IN('tp_three_bg.png')"
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
    </view>

    <view class="context-layout">
      <view class="card1">
        <view class="name"
          >【{{ detail.activityType }}】{{ detail.activityName }}</view
        >
        <view class="context"
          >本医院积极响应社会发展诉求，开展关爱心灵活动，抑郁症已是人们自杀最大的凶手特别是青年与中年人群，已经影响正常工作与学习，在当前社会情况下治疗心理疾病已迫在眉睫。</view
        >
        <view class="card-l"></view>
        <Connect class="card1-l"></Connect>
        <Connect class="card1-r"></Connect>
      </view>
      <view class="card">
        <view class="card-l"></view>

        <view class="name">活动详情</view>
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
            >{{ detail.activityDirector }} {{ detail.directorTitle }} |
            {{ detail.directorDept }}</text
          >
        </view>
        <view class="item">
          <text class="item-name">地 点:</text>
          <text class="item-centext">{{ detail.activityAddr }}</text>
        </view>
        <Connect class="card1-l"></Connect>
        <Connect class="card1-r"></Connect>
      </view>

      <view class="card">
        <view class="card-l"></view>
        <view class="name">活动须知</view>
        <view class="item">
          <text class="item-name">购买须知:</text>
          <view class="item-centext"
            ><text style="color: #e1a422">{{ detail.purchaseNote }}</text></view
          >
        </view>
        <view class="item">
          <text class="item-name">联系电话:</text>
          <text class="item-centext">{{ detail.activityTell }}</text>
        </view>
        <view class="item" v-if="detail.refundDesc">
          <text class="item-name">退款说明:</text>
          <text class="item-centext">{{ detail.refundDesc }}</text>
        </view>
        <view class="item">
          <text class="item-name">其他说明:</text>
          <text class="item-centext">{{ detail.otherDesc }}</text>
        </view>
        <Connect class="card1-l"></Connect>
        <Connect class="card1-r"></Connect>
      </view>

      <view class="card-end">
        <view class="card-l"></view>
        <view class="name">报名信息</view>
        <template>
          <view class="input-layout" @click="patientSelect">
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
              <view class="send" @click="getcode">发送验证码</view>
            </view>
          </view>
          <view class="input-layout no-border">
            <text class="input-name">验证码</text>
            <view class="input-item">
              <input
                disabled
                v-model="formData.code"
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
                    disabled
                    placeholder-class="input_pla"
                    v-model="item.fieldValue"
                    placeholder="请输入"
                  />
                  <textarea
                    v-if="item.fieldType == '多行文本框'"
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
                    >
                      <radio
                        style="transform: scale(0.7)"
                        :value="radioItem"
                        color="#0ab2c1"
                      />{{ radioItem }}
                    </label>
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
          </view>
        </template>
      </view>
      <view class="end">
        <image
          class="end-img"
          :src="FILE_URL_BUILT_IN('tp_three_end.png')"
        ></image>
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
import Connect from '../../components/connect/index.vue'
import footerBtn from './footerBtn'
import { mixins } from './minxns'
export default {
  components: { Connect, footerBtn },
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
.icon-xiangyou:after {
  color: #ff999999;
}
.title {
  position: relative;
  .bg {
    width: 100%;
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
  .title-layout {
    margin-left: 160rpx;
    position: absolute;
    top: 135rpx;
    .title {
      font-size: 56rpx;
      font-family: BDZongYi-A001;
      font-weight: normal;
      font-style: italic;
      color: #ffffff;
      line-height: 36rpx;
    }
    .describe {
      margin: 35rpx 0rpx 30rpx 0rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 36rpx;
    }
    .title_bt {
      width: 445rpx;
      height: 2rpx;
      background: linear-gradient(
        90deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }
}
.context-layout {
  margin-top: -230rpx;
}
.card1 {
  position: relative;
  margin: 0rpx 20rpx;
  background-size: 100% 100%;
  padding: 90rpx 40rpx 100rpx 40rpx;
  background-image: url('../../static/tp_three_card.png');
}
.card1-l {
  position: absolute;
  left: 100rpx;
  bottom: -90rpx;
}
.card1-r {
  right: 100rpx;
  bottom: -90rpx;
  position: absolute;
}
.card {
  position: relative;
  margin: 20rpx 20rpx 0rpx 20rpx;
  padding: 90rpx 40rpx 100rpx 40rpx;
  background: #ffffff;
}
.card-end {
  position: relative;
  margin: 20rpx 20rpx 0rpx 20rpx;
  padding: 90rpx 40rpx 0rpx 40rpx;
  background: #ffffff;
}
.name {
  font-size: 40rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3938d0;
  margin-bottom: 30rpx;
}
.context {
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 0.8);
  line-height: 46rpx;
}
.card-l {
  position: absolute;
  top: 100rpx;
  left: -5rpx;
  width: 22rpx;
  height: 40rpx;
  background: #eaaf22;
  border-radius: 0px 2rpx 4rpx 0px;
}
.item {
  display: flex;
  .item-name {
    width: 172rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #2a5cea;
    line-height: 56rpx;
  }
  .item-centext {
    flex: 1;
    margin-left: 24rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 56rpx;
  }
}
.input-layout {
  border-bottom: 1rpx solid #ffe6e6e6;
  .input-name {
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.input-item {
  margin: 20rpx 0rpx;
  color: #333333;
  font-size: 30rpx;
}
::v-deep.input_pla {
  font-size: 30rpx;
  color: #ccc;
}
.send {
  flex: 1;
  margin-right: -20rpx;
  padding: 20rpx 19rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #2a5cea;
  text-align: center;
}
.end {
  margin: 0rpx 20rpx;

  position: relative;
}
.end-img {
  width: 100%;
  height: 250rpx;
}
.submit {
  right: 40rpx;
  top: 40rpx;
  position: absolute;
  width: 330rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #5863e4;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;

  background-image: linear-gradient(to top, #4551d8 15%, #5863e4 30%); //4551D8
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
