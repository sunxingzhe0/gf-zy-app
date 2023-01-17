<template>
  <view class="page-mini">
    <topbar :active="active" :tabs="tabs" @change="topBarChange"> </topbar>
    <view class="app-card flex-center" v-show="active === 0">
      <image
        :src="FILE_URL_BUILT_IN('jiuzhengonglve.png')"
        style="min-height:1180rpx;width:100%"
        @click="seeImg(FILE_URL_BUILT_IN('jiuzhengonglve.png'))"
      ></image>
      <!-- <image
        style="min-height:1180rpx;width:100%"
        :src="require('@/assets/xuzhi.png')"
      ></image> -->
    </view>
    <view class="app-card flex-center" v-show="active === 1">
      <image
        :src="FILE_URL_BUILT_IN('xuzhi.png')"
        style="min-height:1180rpx;width:100%"
        @click="seeImg(FILE_URL_BUILT_IN('xuzhi.png'))"
      ></image>
      <!-- <image
        style="min-height:1180rpx;width:100%"
        :src="require('@/assets/xuzhi.png')"
      ></image> -->
    </view>
    <view class="app-card content" v-show="active === 2">
      <view class="title">一、司法鉴定中心简介</view>
      <view class="list-item">
        1.司法鉴定中心的前身为重庆市人民政府指定的精神病鉴定专业机构，2004年6月28日经重庆市司法局批准为法医精神病鉴定专业机构，位于江北区金紫山102号、沙坪坝区歌乐山矿山坡51号,两个院区均在开展司法鉴定业务，现有法医精神病鉴定人四十余名。2017年11月成为重庆市公安局、重庆市卫计委指定吸毒成瘾认定医疗机构。
      </view>
      <view class="list-item">
        2.主要开展的鉴定业务范围包括：精神状态鉴定、刑事类行为能力鉴定、民事类行为能力鉴定、精神因果关系、精神伤残等级、劳动能力鉴定、强制医疗患者危险性评估、吸毒成瘾认定等，年鉴定量1500余人次，为司法机关处理刑事、民事、经济纠纷等案件提供了科学准确的依据，赢得了广大群众的信任和支持，在司法精神病鉴定领域享有较高的声誉。
      </view>
      <view class="list-item" style="text-indent:0;margin-bottom: 0;">
        联系电话：023-67377073（金紫山院区）
      </view>
      <view class="list-item" style="text-indent:5em;margin-bottom: 0;">
        023-65509715（歌乐山院区）
      </view>
      <view class="list-item" style="text-indent:0">
        工作时间：工作日8:30-12:00；14:00-17:00
      </view>
      <view class="title">
        二、司法鉴定所需资料
      </view>
      <view class="list-item">
        1.司法鉴定聘请书（一式两份（正本、副本，请在公安内网上下载）。
      </view>
      <view class="list-item">
        2.办案人员警官证复印件一份（1个或者2个）、单位税号（开发票用）。
      </view>
      <view class="list-item">
        3.受案登记表（含案发时间、简要案情）、立案决定书。
      </view>
      <view class="list-item">
        4.被鉴定人有照片的户籍页一份。
      </view>
      <view class="list-item">
        5.对案情经过询问比较详细的讯（询）问笔录2—3份左右，含被鉴定人基本信息的笔录必须提供（被鉴定人文化程度、婚姻状况、职业、身份证号码、现住址等）。
      </view>
      <view class="list-item">
        6.家人（监护人、亲属）、邻居（同事、朋友）、村（居）委会等三方面的旁证材料（精神方面）：案发前后被鉴定人言语、行为、个人生活料理、学习能力、劳动能力、人际关系等。
      </view>
      <view class="list-item">
        7.被鉴定人精神残疾证及精神科门诊、住院病历资料。（若无可不提供）
      </view>
      <view class="list-item">
        8.若被鉴定人之前处于羁押状态的，提供同监舍狱友或羁押警官提供的羁押期间表现。
      </view>
      <view class="list-item">
        9.有吸毒、酒依赖史的，提供血液、尿液提取和检查报告。
      </view>
    </view>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card/index'
export default {
  components: { AppCard },
  data() {
    return {
      active: 0,
      tabs: [
        {
          title: '就诊流程',
          key: 0,
        },
        {
          title: '残疾评定',
          key: 1,
        },
        {
          title: '司法鉴定',
          key: 2,
        },
      ],
    }
  },
  methods: {
    topBarChange(active) {
      this.active = active
    },
    //预览图片
    seeImg(url) {
      uni.previewImage({
        current: '',
        urls: [url],
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-card {
  padding: 30rpx;
}
.page-mini {
  width: 100%;
  padding: 110rpx 20rpx 30rpx;
  box-sizing: border-box;
}
.content {
  .title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    line-height: 84rpx;
  }
  .list-item {
    font-size: 28rpx;
    font-weight: 500;
    color: #4d4d4d;
    line-height: 48rpx;
    text-indent: 2em;
    text-align: justify;
    margin-bottom: 16rpx;
  }
}
</style>
