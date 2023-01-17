<template>
  <view id="container">
    <!-- top -->
    <view class="top-bar" @click="handlePop">
      <view class="top-bar__title">
        <view class="flex-start-center">
          <view class="ml-50">
            <text>{{ userInfo.sex }}</text>
            <text style="margin:0 10rpx">|</text>
            <text>{{ userInfo.age }}岁</text>
          </view>
        </view>
        <view>
          <span class="doctor-name" style="margin-right:10rpx">变更</span>
        </view>
      </view>
      <view v-show="showExpand" class="top-bar__expand">
        <view class="flex-start-start" style="padding: 20rpx 0;">
          <view class="avatar-wrapper">
            <image
              class="avatar"
              :src="
                bizInfo.avatar
                  ? FILE_URL(bizInfo.avatar)
                  : require('@/assets/user/user_d_head.png')
              "
              mode="scaleToFill"
            ></image>
          </view>
          <view class="ml-30">
            <view>
              <text class="top-bar__expand_doctor">{{
                bizInfo.doctorName
              }}</text>
              <text>{{ bizInfo.biz.sex == 1 ? '男' : '女' }}</text>
            </view>
            <view class="">{{ '姓名' }} {{ 'xxx' }} {{ 'xxx' }}</view>
            <view class="">擅长：{{ 'xxx' }}</view>
          </view>
        </view>
        <!--  <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">就诊人</view>
          <view class="top-bar__expand_cell_value">{{
          'xxx'
          }}</view>
        </view>
        <view class="top-bar__expand_cell flex-start-center">
          <view class="top-bar__expand_cell_label">类型</view>
          <view class="top-bar__expand_cell_value">{{
            'xxx'
          }}</view>
        </view> -->
      </view>
    </view>
    <!-- body -->
    <view
      id="page-body"
      class="page-body"
      :style="{
        paddingBottom: !toolBarShow ? '160rpx' : '360rpx',
        minHeight: !toolBarShow
          ? 'calc(100vh - 260rpx)'
          : 'calc(100vh - 460rpx)',
      }"
      @click="
        toolBarShow = false
        showExpand = false
      "
    >
      <view class="question-tip">
        温馨提示：本导诊会根据您提供的患者信息为您推荐就诊科室，如有疑问请以院内分诊建议为最终结果。
      </view>
      <Messages :messageBox="messageBox" :avatar="bizInfo.avatar"></Messages>
    </view>
    <!-- bottom -->
    <view class="bottom-bar" v-if="!endState">
      <view class="flex-between">
        <!-- 语音输入 -->
        <!--  <image
          class="bottom-bar__icon"
          :src="require('@/assets/voice.png')"
          mode="aspectFit"
          style="width: 50rpx;"
          @click="voiceIn"
        ></image> -->
        <input
          class="bottom-bar__input"
          :value="inputValue"
          type="text"
          placeholder="疾病、病症输入"
          confirm-type="send"
          @input="inputChange"
          @confirm="sendMessage"
        />
        <view class="sendBtn">
          <span class="handleSend" @click="sendMessage">发送</span>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" :mask-click="false">
      <view class="popup-view">
        <view class="title">患者信息</view>
        <view class="msg">告诉我性别和年龄，导诊更准确</view>
        <picker-view
          indicator-style="height: 40px;"
          :value="value"
          @change="bindChange"
          class="picker-view"
        >
          <picker-view-column>
            <view class="item" v-for="(item, index) in sexs" :key="index">{{
              item
            }}</view>
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in ages" :key="index"
              >{{ item + 1 }}岁</view
            >
          </picker-view-column>
        </picker-view>
        <view class="btn-send" @click="pickerConfirm">发送</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
//创建语音对象
const recorderManager = uni.getRecorderManager()
import Messages from './messages'
import { getRecommendDept, addMessage } from '@/common/request/chat'
import mpvuePicker from '@/pages-user/components/mpvue-picker/mpvuePicker'
export default {
  components: {
    Messages,
    mpvuePicker,
  },
  data() {
    return {
      selectIndex: '',
      themeColor: '#2FB2C1',
      sexs: ['男', '女'],
      ages: 99,
      index: 2,
      msgType: '',
      endState: false,
      userInfo: {
        name: '',
        sex: '女',
        age: 1,
      },
      inputMsg: {
        description: '',
        patientInformation: {
          name: '',
          sex: '',
          age: '',
        },
      },
      windowHeight: uni.getSystemInfoSync().windowHeight,
      userId: uni.getStorageSync('userId'),
      order: {},
      showExpand: false,
      inputValue: '',
      value: [1],
      messageBox: [
        {
          body:
            '您好，我是您的医生助手，需要了解您的情况以便为您推荐合适的科室。',
          chatType: 2,
          msgType: '',
        },
      ],
      toolBarShow: false, //聊天工具显示
      bizInfo: {
        biz: {},
      },
      diagnosContent: '',
      historicalShow: false,
      interval: null,
      newMessage: null,
      isAllRp: false,
    }
  },
  async onLoad(options) {
    this.order = options
    this.getPatientList()
  },
  mounted() {
    setTimeout(() => {
      this.$refs.popup.open()
    }, 2000)
  },
  methods: {
    handlePop() {
      this.$refs.popup.open()
    },
    pickerCancel() {
      this.$refs.popup.close()
    },
    //确认发送性别年龄
    pickerConfirm() {
      this.$refs.popup.close()
      this.messageBox.push({
        body: `性别：${this.userInfo.sex}，年龄：${this.userInfo.age}`,
        chatType: 1,
        msgType: 'one',
      })
      setTimeout(() => {
        this.messageBox.push({
          body: '请问您需要咨询什么问题？（描述症状、疾病或需要购买的药品）',
          chatType: 2,
          msgType: 'one',
        })
        this.pageScroll()
      }, 1000)
      this.pageScroll()
    },
    bindChange(data) {
      this.userInfo.sex = this.sexs[data.detail.value[0]]
      this.userInfo.age = data.detail.value[1] + 1
    },
    bindPickerChange: function(e) {
      this.index = e.detail.value
      this.userInfo = {
        name: this.patientList[e.detail.value].name,
        sex: this.patientList[e.detail.value].sex,
        age: this.patientList[e.detail.value].age,
      }
    },

    //输入框值变化
    inputChange(event) {
      const value = event.detail.value
      if (!value) return
      this.inputValue = value
    },

    //发送消息
    sendMessage(event) {
      if (!this.inputValue) return

      //最后一条信息类型
      this.msgType = this.messageBox[this.messageBox.length - 1]?.msgType
      const val = this.inputValue.trim()
      //保存请求参数
      this.inputMsg = {
        description: val,
        patientInformation: {
          sex: this.userInfo.sex,
          age: this.userInfo.age,
        },
      }
      this.messageBox.push({
        body: val,
        chatType: 1,
        msgType: '',
      })
      //清空
      this.inputValue = ''
      this.resMessage(val)
      this.pageScroll()
    },
    //语音输入
    voiceIn() {
      console.log('语音输入')
      recorderManager.start()
    },
    //响应消息
    async resMessage(val) {
      //是否输入正确的病情信息
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (!reg.test(val)) {
        return this.messageBox.push({
          body: '请详细描述【症状】或【药品名称】',
          chatType: 2,
          errorMsg: true,
          msgType: 'one',
        })
      }
      this.getRecommendDept()
      this.addMessage()
    },
    //获取推荐科室
    async getRecommendDept() {
      uni.showLoading({
        title: '请稍后...',
      })
      const res = await getRecommendDept(this.inputMsg)
      uni.hideLoading()
      console.log(res[0].deptName, '推荐科室')
      this.messageBox.push({
        body: `为您推荐的科室为：${res[0].deptName || '暂无'}`,
        chatType: 2,
        errorMsg: false,
        msgType: '',
      })
      this.pageScroll()
    },
    //添加导诊消息
    async addMessage() {
      await addMessage(this.inputMsg)
    },
    //聊天窗滚动
    pageScroll() {
      this.$nextTick(() => {
        const node = uni
          .createSelectorQuery()
          .in(this)
          .select('#container')

        node
          .boundingClientRect(({ height }) => {
            if (height >= this.windowHeight - 66) {
              uni.pageScrollTo({
                scrollTop: height,
                duration: 100,
              })
            }
          })
          .exec()
      })
    },
  },
}
</script>
<style>
page {
  height: auto;
}
</style>
<style lang="scss" scoped>
.popup-view {
  background: #fff;
  border-radius: 30rpx;
  .title {
    display: flex;
    justify-content: center;
    font-size: 16px;
  }
  .msg {
    font-size: 12px;
    display: flex;
    justify-content: center;
    color: #999;
  }
  .btn-send {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10rpx 0;
    font-size: 16px;
    color: #0ab2c1;
  }
}
/*  */
.picker-view {
  width: 650rpx;
  height: 300rpx;
  background: #fff;
}
.item {
  height: 50px;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}
.mpvue-picker__hd {
  display: flex;
  padding: 9px 15px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17px;
}

.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}

.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #1aad19;
}

.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}

.mpvue-picker__action:last-child {
  text-align: right;
}

.picker-item {
  text-align: center;
  line-height: 40px;
  font-size: 16px;
}

.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 238px;
  background-color: rgba(255, 255, 255, 1);
}
/*  */

.container {
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.wait-container {
  z-index: 4;
}

.top-bar {
  /* #ifdef H5 */
  padding-top: 80rpx;
  /* #endif */
  z-index: 2;
  max-height: 80vh;
  overflow-y: auto;
  padding-bottom: 20rpx;
}

.doctor-name {
  color: $uni-color-primary;
}

.top-bar__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  color: #666;
}

.top-bar__expand {
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.avatar-wrapper {
  flex-shrink: 0;
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
}

.top-bar__expand_doctor {
  margin-right: 20rpx;
  font-size: 34rpx;
  font-weight: bolder;
  color: #1a1a1a;
}

.top-bar__expand_cell {
  padding: 20rpx 0;
  border-top: 2rpx solid #e6e6e6;
  color: #666;
}

.top-bar__expand_cell_label {
  width: 200rpx;
  font-size: 28rpx;
}

.top-bar__expand_cell_value {
  margin-left: 120rpx;
  font-size: 28rpx;
  color: #1a1a1a;
}

.page-body {
  margin-top: 100rpx;
  padding: 2rpx 20rpx 0;
  min-height: 100%;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx 0 40rpx;
  box-sizing: border-box;
}

.bottom-bar__icon {
  flex-grow: 0;
  width: 50rpx;
  height: 50rpx;
  padding: 0 20rpx;
}

.bottom-bar__input {
  border-radius: 20rpx;
  flex-grow: 1;
  margin-left: 20rpx;
  height: 70rpx;
  line-height: 70rpx;
  padding-left: 12rpx;
  background-color: #f2f2f2;
}

.bottom-bar__toolbar {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;

  .bottom-bar__tool_item {
    margin-left: 40rpx;

    + .bottom-bar__tool_item {
      margin-left: 80rpx;
    }
  }

  .app-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60rpx;
    height: 60rpx;
  }

  .tool-icon {
    width: 44rpx;
    height: 44rpx;
  }

  .tool-title {
    margin-top: 8rpx;
    font-size: 24rpx;
    text-align: center;
    color: #666;
  }
}

.arrow-expand {
  transform: rotate(90deg);

  &.desc {
    transform: rotate(-90deg);
  }
}

.prescription-no {
  font-size: 32rpx;
  color: #333;
}

.detail {
  margin-top: 32rpx;
  padding: 20rpx;
  background-color: #eee;
}

.medicine-name {
  color: #333;
}

.use {
  color: #e45b5b;
}

.price {
  font-size: 32rpx;
  color: #0ab2c1;
}

.dialog-body {
  width: 70vw;
  border-radius: 20rpx;
  background-color: #fff;
}

.dialog-title {
  padding: 20rpx 0;
  text-align: center;
  font-size: 32rpx;
}

.dialog-footer {
  margin-top: 20rpx;
  border-top: 2rpx solid #e6e6e6;
}

.dialog-footer_btn {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #0ab2c1;
}

.button {
  height: 68rpx;
  line-height: 66rpx;
  border-radius: 40rpx;
  font-size: 24rpx;

  &::after {
    border: none;
  }
}

.btn-small {
  margin-left: 0;
  margin-right: 20rpx;
  background-color: #f2f2f2;
  color: #333;
}

.btn-primary {
  background-color: $uni-color-primary;
  color: #fff;
}

.question-tip {
  width: 80%;
  margin: 40rpx auto 0;
  padding: 12rpx 5rpx;
  border-radius: 40rpx;
  text-align: center;
  font-size: 24rpx;
  background-color: #e6e6e6;
  color: #999;
}

.biaoshi {
  background-color: $uni-color-primary;
  font-size: 24rpx;
  color: #fff;
  padding: 4rpx 8rpx;
  border-radius: 5rpx;
  margin-right: -20rpx;
}

.desc {
  transform: rotate(180deg);
}
.sendBtn {
  padding: 0 18rpx;
  .handleSend {
    padding: 5rpx 18rpx;
    border: 1px solid #ccc;
    border-radius: 20rpx;
    color: #ccc;
  }
}
</style>
