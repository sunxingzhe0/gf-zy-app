<template>
  <view id="container">
    <!-- body -->
    <view
      id="page-body"
      class="page-body"
      :style="{
        paddingBottom: '160rpx',
        minHeight: 'calc(100vh - 260rpx)',
      }"
    >
      <view class="question-tip">{{ nowTime }}</view>
      <Messages :messageBox="messageBox" :avatar="bizInfo.avatar"></Messages>
    </view>
    <!-- bottom -->
    <view class="bottom-bar" v-if="!endState">
      <view class="flex-between">
        <input
          class="bottom-bar__input"
          :value="inputValue"
          type="text"
          placeholder="疾病、病症输入"
          confirm-type="send"
          @input="inputChange"
          @confirm="sendMessage"
        />
        <view @click="sendMessage" class="sendBtn"> </view>
      </view>
    </view>
  </view>
</template>

<script>
import Messages from '@/pages-sf/components/messages'
import { parseTime } from '@/pages-sf/util/parseTime'
import { consultList } from '@/pages-sf/api/ownAnswer'
export default {
  props: {
    pageType: String,
    orderId: String,
  },
  components: {
    Messages,
  },
  data() {
    return {
      nowTime: '',
      endState: false,
      inputMsg: {
        description: '',
        patientInformation: {
          name: '',
          sex: '',
          age: '',
        },
      },
      windowHeight: uni.getSystemInfoSync().windowHeight,
      inputValue: '',
      messageBox: [
        {
          body: '您好，请问您需要什么帮助呢？ 请选择下列相关问题：',
          isProblem: true, //是否显示问题
          problems: [
            '是否为高血压高发人群',
            '是否有拖延症',
            '高血压患者应该吃什么',
          ],
          chatType: 2, //1为用户输入内容，2为响应内容
        },
      ],
      bizInfo: {
        biz: {},
      },
    }
  },
  created() {
    this.nowTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
    console.log(this.pageType, '所属页面------')
  },
  mounted() {
    uni.$on('clickMsg', data => {
      console.log(data)
      this.inputValue = data
      this.sendMessage()
    })

    this.orderId && console.log(this.orderId, 'orderId------')

    //获取消息列表
    this.getConsultList()
  },
  methods: {
    //输入框值变化
    inputChange(event) {
      const value = event.detail.value
      if (!value) return
      this.inputValue = value
    },
    //发送消息
    sendMessage() {
      if (!this.inputValue) return
      const val = this.inputValue.trim()

      this.messageBox.push({
        body: val,
        chatType: 1,
      })

      //清空输入框
      this.inputValue = ''

      this.getConsultList(val)
      this.pageScroll()
    },

    //获取问题列表
    async getConsultList(val) {
      let defaultMsg = [
        {
          body: '您好，请问您需要什么帮助呢？ 请选择下列相关问题：',
          isProblem: true, //是否显示问题
          problems: [
            '是否为高血压高发人群',
            '是否有拖延症',
            '高血压患者应该吃什么',
          ],
          chatType: 2, //1为用户输入内容，2为响应内容
        },
      ]

      const res = await consultList({
        content: val || '',
        fid: this.orderId, //随访单id  自动问答页无
        type: this.pageType === 'ownAnswer' ? 1 : 0,
      })
      console.log(res, '消息列表------')
      //处理数据
      const listData = Array.isArray(res)
        ? res.reduce((pre, cur) => {
            console.log(Array.isArray(cur.content), '-------')
            let arr =
              cur.state == 1
                ? [
                    {
                      body: '您好，请问您需要什么帮助呢？ 请选择下列相关问题：',
                      isProblem: Array.isArray(JSON.parse(cur.content))
                        ? true
                        : false, //是否显示问题
                      problems: JSON.parse(cur.content) || [],
                      chatType: 2, //1为用户输入内容，2为响应内容
                    },
                  ]
                : [
                    {
                      body: cur.content || '',
                      chatType: 1,
                    },
                  ]

            return pre.concat(arr)
          }, [])
        : []
      if (listData.length === 0) return
      this.messageBox = defaultMsg.concat(listData)
      console.log(this.messageBox, '-----------')
      this.pageScroll()
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
<style lang="scss" scoped>
/* 提示 */
.question-tip {
  width: 50%;
  margin: 40rpx auto 0;
  padding: 12rpx 5rpx;
  border-radius: 40rpx;
  text-align: center;
  font-size: 24rpx;
  background-color: #e6e6e6;
  color: #999;
}

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

.page-body {
  padding: 2rpx 20rpx 0;
  min-height: 100%;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx 0 20rpx;
  box-sizing: border-box;
}

.bottom-bar__icon {
  flex-grow: 0;
  width: 50rpx;
  height: 50rpx;
  padding: 0 20rpx;
}

.bottom-bar__input {
  border-radius: 10px;
  flex-grow: 1;
  margin-left: 10px;
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
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
  margin: 12px;
  width: 25px;
  height: 25px;
  background: url(@/pages-sf/images/send-btn.png) no-repeat;
  background-size: cover;
}
</style>
