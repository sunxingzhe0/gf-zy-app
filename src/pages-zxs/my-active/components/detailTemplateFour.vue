<template>
  <view class="context">
    <image
      class="title-img"
      :src="FILE_URL_BUILT_IN('hd_title_img.png')"
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
    <view class="title-name"
      >【{{ detail.activityType }}】{{ detail.activityName }}</view
    >
    <view class="title-context">
      本医院积极响应社会发展诉求，开展关爱心灵活动抑郁症已是人们自杀最大的凶手特别是青年与中年人群，已经影响正常工作与学习在当前社会情况下治疗心理疾病已迫在眉睫
    </view>
    <view class="message">
      <image class="message-img" src="../../static/bd_head.png"></image>
      <view class="message-context">
        <view class="flex">
          <text class="msg-name">报名开始时间</text>
          <text class="msg-centext">{{ detail.activityBeginTime }}</text>
        </view>
        <view class="flex">
          <text class="msg-name">报名费</text>
          <text class="msg-centext"
            >{{ isInfo ? detail.cost : detail.activityCost }} 元/人</text
          >
        </view>
        <view class="flex">
          <text class="msg-name">名额</text>
          <text class="msg-centext">{{ detail.activityQuota }}人</text>
        </view>
        <view class="flex">
          <text class="msg-name">负责人</text>
          <text class="msg-centext">{{
            `${detail.activityDirector} ${detail.directorTitle ||
              ''} | ${detail.activityDept || ''}`
          }}</text>
        </view>
        <view class="flex">
          <text class="msg-name">地点</text>
          <text class="msg-centext">{{ detail.activityAddr }}</text>
        </view>
      </view>
    </view>

    <view class="xz-title flex">
      <text class="left"></text>
      <text>活动须知</text>
      <text class="right"></text>
    </view>

    <view class="xz flex-column">
      <text>1、购买须知：{{ detail.purchaseNote }}</text>
      <text>2、联系电话：{{ detail.activityTell }}</text>
      <text>3、退款说明：{{ detail.refundDesc }} </text>
      <text>4、其他说明：{{ detail.otherDesc }}</text>
    </view>

    <!-- 需要报名的 -->
    <!-- v-if="false" -->
    <view class="sign-up-btn" @click="signUpC"> 我要报名 </view>
    <footerBtn
      :signId="signId"
      :actName="detail.activityName"
      :actType="detail.activityType"
      :actState="detail.activityStatus"
      v-if="detail.activityTemplateId"
      :activityTemplateId="detail.activityTemplateId"
    ></footerBtn>
    <uni-popup ref="popup" type="bottom">
      <view class="popup">
        <view class="flex-between title">
          <text></text>
          <text>报名信息</text>
          <view class="cancel" @click="$refs.popup.close()">
            <uni-icons
              type="closeempty"
              class="closeIcon"
              color="#999"
            ></uni-icons>
          </view>
        </view>
        <view class="item flex-between">
          <input
            :value="memberInfo.name"
            disabled
            placeholder-class="input_pla"
            placeholder="请选择就诊人"
          />
          <text class="iconfont icon-xiangyou"></text>
        </view>
        <view class="item flex-between">
          <input
            placeholder-class="input_pla"
            v-model="formData.phone"
            disabled
            placeholder="请输入"
          />
          <view class="send">发送验证码</view>
        </view>
        <view class="item flex-between">
          <input
            v-model="formData.code"
            disabled
            placeholder-class="input_pla"
            placeholder="请输入手机中收到的验证码"
          />
        </view>

        <view v-for="(item, index) in relList" :key="index">
          <template
            v-if="item.fieldName !== '姓名' && item.fieldName !== '手机'"
          >
            <view class="item flex-between">
              <input
                v-if="item.fieldType == '普通文本框'"
                placeholder-class="input_pla"
                v-model="item.fieldValue"
                disabled
                :placeholder="`请输入${item.fieldName}`"
              />
              <textarea
                v-if="item.fieldType == '多行文本框'"
                placeholder-class="input_pla"
                disabled
                :placeholder="`请输入${item.fieldName}`"
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
                  :placeholder="`请选择${item.fieldName}`"
                  :value="item.fieldValue"
                  placeholder-class="input_pla"
                />
                <text class="iconfont icon-xiangyou"></text>
              </view>
              <!-- 输入 -->
              <input
                type="number"
                :placeholder="`请输入${item.fieldName}`"
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
                  disabled
                  :value="item.fieldValue"
                  placeholder-class="input_pla"
                />
                <text class="iconfont icon-xiangyou"></text>
              </view>
            </view>
          </template>
        </view>
      </view>
    </uni-popup>
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
  components: {
    popSelect,
    footerBtn,
  },
  mixins: [mixins],

  data() {
    return {
      detail: {},
      fromData: {},
    }
  },
  methods: {
    signUpC() {
      this.$refs.popup.open()
    },
  },
}
</script>
<style lang="scss" scoped>
.justify-content {
  display: flex;
  justify-content: center;
}
.context {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #a6cbec;
  padding-bottom: 146rpx;
  position: relative;
  /* background: url('../../static/hd.jpg') ; */
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
.bg {
  height: 100vh;
  width: 100vw;
}
.title-img {
  width: 100vw;
  height: 326rpx;
}
.title-name {
  margin-top: 40rpx;
  width: 100vw;
  text-align: center;
  font-size: 34rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
}
.title-context {
  padding: 30rpx 84rpx 19rpx 84rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 46rpx;
}
.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  .message-img {
    width: 98rpx;
    height: 100rpx;
  }
  .message-context {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 17rpx;
    margin-top: -10rpx;
    width: 640rpx;
    /* height: 310rpx; */
    background: rgba(255, 255, 255, 0.6);
    border-radius: 20rpx;
  }
  .msg-name {
    width: 184rpx;
    height: 50rpx;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #1272b0;
    padding-left: 13rpx;
    /* text-align: center; */
    line-height: 50rpx;
  }
  .msg-centext {
    height: 50rpx;
    line-height: 50rpx;
    margin-left: 23rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.xz-title {
  padding: 40rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  align-items: center;
  .left {
    margin-right: 30rpx;
    width: 230rpx;
    height: 2rpx;
    background: linear-gradient(
      -90deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .right {
    margin-left: 30rpx;
    width: 230rpx;
    height: 2rpx;
    background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  }
}
.xz {
  width: 640rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 56rpx;
}

.sign-up-message {
  position: relative;
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .message-img {
    position: absolute;
    width: 169rpx;
    height: 49rpx;
  }
  .message-context {
    margin-top: 35rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 17rpx;
    width: 640rpx;
    /* height: 366rpx; */
    background: rgba(255, 255, 255, 0.6);
    border-radius: 20rpx;
  }
  .msg-name {
    width: 184rpx;
    height: 50rpx;
    padding-left: 13rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #1272b0;
    /* text-align: center; */
    line-height: 50rpx;
  }
  .msg-centext {
    height: 50rpx;
    line-height: 50rpx;
    margin-left: 23rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.sign-up-btn {
  width: 660rpx;
  height: 88rpx;
  background: #ddedf8;
  border: 3rpx solid #378bc2;
  box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(41, 126, 179, 0.3);
  border-radius: 44rpx;
  font-size: 34rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #378bc2;
  text-align: center;
  line-height: 88rpx;
  margin-top: 58rpx;
}
.popup {
  background: #ffffff;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  padding-bottom: 30rpx;
  .title {
    padding: 30rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
  }
  .cancel {
    width: 30rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    background: #e6e6e6;
    border-radius: 50%;
    .closeIcon {
      font-size: 20rpx !important;
    }
  }
  .item {
    height: 90rpx;
    padding: 0rpx 30rpx;
    background: #f2f2f2;
    border-radius: 45rpx;
    margin: 0rpx 30rpx 20rpx 30rpx;
    color: #999999;
    font-size: 30rpx;
  }
  .submit {
    margin: 0rpx 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    background: #0ab1c0;
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
    background: #ffffff;
    border-radius: 36rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #0ab1c0;
    text-align: center;
  }
}
</style>
