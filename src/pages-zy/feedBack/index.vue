<template>
  <view class="feed-back">
    <view class="head-img">
      <image :src="FILE_URL_BUILT_IN('hospitalBg.png')"></image>
    </view>
    <view class="tabWrap flex-start-center">
      <view
        :class="tableActive == 0 ? 'tabItem on' : 'tabItem'"
        @click="tableActive = 0"
        >意见反馈</view
      >
      <view
        :class="tableActive == 1 ? 'tabItem on' : 'tabItem'"
        @click="tableActive = 1"
        class="tabItem"
        >历史记录</view
      >
    </view>
    <view class="wrap" v-if="tableActive == 0">
      <app-card class="choose-result" styles="padding: 30rpx;">
        <view class="title">请选择原因</view>
        <view class="body">
          <view
            :class="active == result ? 'active-item item' : 'item'"
            v-for="(item, result) in reasonList"
            :key="result"
            @click="active = result"
            >{{ item }}</view
          >
        </view>
      </app-card>
      <app-card styles="padding: 30rpx;">
        <view class="title">请输入意见反馈内容</view>
        <textarea
          class="text"
          placeholder-style="color:#999"
          v-model="formData.backContent"
          placeholder="请输入内容"
        />
      </app-card>
      <app-card styles="padding: 30rpx;">
        <view class="title">上传图片（最多5张，每张不超过5M）</view>
        <view class="addPtr">
          <view class="add" @click="upImg" v-if="uploadImags.length < 5">
            <uni-icons
              type="camera-filled"
              color="#999999"
              size="30"
            ></uni-icons>
          </view>
          <view
            v-for="(item, index) in uploadImags"
            :key="index"
            class="img-layout"
          >
            <image :src="FILE_URL(item)" class="img"></image>
            <image
              @click="delImg(index)"
              class="img-del"
              :src="require('@/assets/img_del.png')"
            ></image>
          </view>
        </view>
      </app-card>
      <app-card styles="padding: 20rpx 30rpx;">
        <app-list-item
          label="联系人"
          :styles="{ padding: '15rpx', paddingLeft: 0, fontSize: '28rpx' }"
          :value="''"
        >
          <input placeholder="请输入" v-model="formData.name" class="input" />
        </app-list-item>
        <app-list-item
          label="联系电话"
          :styles="{ padding: '15rpx', paddingLeft: 0, fontSize: '28rpx' }"
          :value="''"
          noBorder
          className="required"
        >
          <input
            placeholder="请输入"
            v-model="formData.phone"
            class="input"
            type="number"
            maxlength="11"
          />
        </app-list-item>
      </app-card>
      <view class="btn" @click="submit">提交</view>
    </view>
    <history-recods v-else></history-recods>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import HistoryRecods from './historyRecods'
import { upload } from '@/common/request/index.js'
import { patientList } from '@/common/request/userCenter'
import { submitFeedBack } from '../api/user.js'
export default {
  components: { AppCard, AppListItem, HistoryRecods },
  data() {
    return {
      tableActive: 0,
      active: null,
      isTap: true,
      uploadImags: [],
      reasonList: [
        '服务态度不好',
        '医生回答不及时',
        '建议',
        '系统不稳定',
        '价格不合理',
        '其他',
      ],
      formData: {
        backContent: '',
        name: '',
        phone: '',
      },
    }
  },
  created() {
    this.getPatientList()
  },
  onLoad(options) {
    if (options.bizId) {
      this.tableActive = 1
    }
  },
  methods: {
    delImg(index) {
      this.uploadImags.splice(index, 1)
    },
    async submit() {
      if (this.active == null) {
        uni.showToast({
          title: '请选择原因',
          icon: 'none',
        })
        return false
      }
      if (this.formData.backContent == '') {
        uni.showToast({
          title: '请输入意见反馈的内容',
          icon: 'none',
        })
        return false
      }
      if (this.formData.phone == '') {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none',
        })
        return false
      }
      if (this.isTap) {
        this.isTap = false
        await submitFeedBack({
          ...this.formData,
          picIds: this.uploadImags,
          reason: this.reasonList[this.active],
        }).finally(() => {
          this.isTap = true
        })
      } else {
        uni.showToast({
          title: '请勿重复点击',
          icon: 'none',
        })
      }
      uni.showToast({
        title: '提交成功',
        duration: 1500,
      })
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 1500)
    },
    //获取就诊人
    async getPatientList() {
      const list = await patientList()
      let res = list.find(item => item.def) ?? list?.[0]
      if (res) {
        this.formData.name = res.name
        this.formData.phone = res.phone
      }
    },
    upImg() {
      var _self = this
      uni.chooseImage({
        count: 5 - _self.uploadImags.length, //默认9 6 - _self.uploadImags.length
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function(res) {
          console.log(res)
          res.tempFiles.forEach(({ path, size }) => {
            //上传图片
            if (size < 5000000) {
              upload(path).then(data => {
                console.log(data)
                if (data.body) {
                  _self.uploadImags.push(data.body)
                }
              })
            } else {
              uni.showToast({
                title: '图片大小不能超过5M',
                icon: 'none',
              })
            }
          })
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.feed-back {
  .head-img {
    width: 100%;
    height: 260rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .tabWrap {
    height: 80rpx;
    padding: 0 30rpx;
    background: #fff;
    .tabItem {
      margin-right: 60rpx;
      font-size: 30rpx;
      color: #333;
      &.on {
        color: $uni-color-primary;
      }
    }
  }
  .wrap {
    padding: 20rpx;
    .title {
      font-size: 28rpx;
      margin-bottom: 20rpx;
      color: #333;
    }
    .body {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .item {
        height: 60rpx;
        border-radius: 40rpx;
        background: #e7e7e7;
        text-align: center;
        font-size: 26rpx;
        line-height: 60rpx;
        color: #666;
        margin-right: 35rpx;
        margin-bottom: 30rpx;
        padding: 0 25rpx;
      }
      .active-item {
        background: #9ee4eb;
        color: $uni-color-primary;
      }
    }
    .text {
      width: 100%;
      height: 400rpx;
      background: #f2f2f2;
      padding: 20rpx;
      box-sizing: border-box;
      border-radius: 10rpx;
    }
    .addPtr {
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .add {
        min-height: 180rpx;
        min-width: 180rpx;
        border: 2rpx dotted #cccccc;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .icon {
          width: 48rpx;
          height: 48rpx;
        }
        .text {
          margin-top: 21rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
        }
      }
      .textadd {
        margin-left: 30rpx;
        font-size: 20rpx;
        font-weight: 500;
        color: rgba(204, 204, 204, 1);
        margin-right: 20rpx;
      }
      .img-layout {
        position: relative;
        margin-left: 30rpx;
        .img {
          padding: 10rpx;
          height: 180rpx;
          width: 180rpx;
          display: block;
        }
        .img-del {
          width: 30rpx;
          height: 30rpx;
          position: absolute;
          right: 0rpx;
          display: block;
          top: 0;
        }
      }
    }
    .input {
      font-size: 28rpx;
    }
  }
}
.btn {
  height: 88rpx;
  border-radius: 40rpx;
  background: $uni-color-primary;
  line-height: 88rpx;
  text-align: center;
  font-size: 30rpx;
  color: #fff;
  width: 100%;
  margin-top: 20px;
}
::v-deep .required {
  .list-item-label {
    position: relative;
    &::before {
      content: '*';
      color: #ea4444;
      font-size: 20rpx;
      position: absolute;
      top: 0;
      left: -10rpx;
    }
  }
}
</style>
