<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="basics">
      <image :src="FILE_URL(orgIntro.picList[0])"></image>
      <view class="hospital">
        <text class="name">{{ orgIntro.name }}</text>
        <view class="message">
          <text>等级等次</text>
          <text>{{ orgIntro.levelName }}</text>
        </view>
        <view class="message">
          <text>地址</text>
          <view class="adrees">
            <view v-for="(val, i) in orgIntro.address.split('、')" :key="i">
              <text v-if="i === 0">
                {{ orgIntro.province
                }}{{ orgIntro.province === '重庆市' ? '' : orgIntro.city
                }}{{ orgIntro.area }}{{ val }}
              </text>
              <text v-else>
                {{ val }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <user-hospital-item
      v-if="orgIntro.intro"
      title_name="医院介绍"
      :content="orgIntro.intro"
    ></user-hospital-item>

    <view class="practice-license">
      <view class="title">
        <view></view>
        <text>执业许可证：{{ orgIntro.cert }}</text>
      </view>
      <image :src="FILE_URL(orgIntro.certPic)" @click="previewImage"></image>
    </view>
    <user-hospital-item
      v-if="orgIntro.practiceArea"
      title_name="诊疗范围"
      :isOpen="1"
      :content="orgIntro.practiceArea"
    ></user-hospital-item>
    <user-hospital-item
      v-if="orgIntro.rewardMethod"
      title_name="奖惩办法公示"
      :content="orgIntro.rewardMethod"
    ></user-hospital-item>
    <user-hospital-item
      v-if="orgIntro.rewardInformation"
      title_name="奖惩信息公示"
      :content="orgIntro.rewardInformation"
    ></user-hospital-item>
  </view>
</template>

<script>
import { orgIntro } from '../../common/request/index.js'
export default {
  data() {
    return {
      orgIntro: {
        picList: [],
      },
    }
  },
  created() {
    this.getOrgIntro()
  },
  methods: {
    getOrgIntro() {
      orgIntro().then(data => {
        if (data) {
          this.orgIntro = data
        }
      })
    },
    previewImage() {
      uni.previewImage({
        urls: [this.FILE_URL(this.orgIntro.certPic)],
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.basics {
  width: 100%;
  height: 518upx;
  position: relative;

  image {
    width: 100%;
    height: 320upx;
  }

  .hospital {
    margin-left: 20upx;
    position: absolute;
    bottom: 0upx;
    width: 650upx;
    min-height: 218upx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
    border-radius: 20upx;
    padding: 40upx 30upx;

    .name {
      font-size: 30upx;
      font-weight: bold;
      color: rgba(26, 26, 26, 1);
    }
  }
}

.message {
  display: flex;
  margin-top: 30upx;

  text {
    &:first-child {
      width: 169upx;
      font-size: 24upx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
    }

    &:last-child {
      flex: 1;
      font-size: 24upx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
  .adrees {
    flex: 1;
    color: rgba(51, 51, 51, 1);
  }
}

.practice-license {
  padding: 40upx 30upx;
  margin: 20upx;
  width: 650upx;
  height: 540upx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0upx 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
  border-radius: 20upx;

  image {
    width: 650upx;
    height: 470upx;
    border-radius: 4upx;
    // margin: 30upx;
  }
}

.title {
  display: flex;
  align-items: center;

  view {
    width: 3upx;
    height: 30upx;
    background: rgba(10, 178, 193, 1);
  }

  text {
    margin-left: 10upx;
    font-size: 30upx;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
}
</style>
