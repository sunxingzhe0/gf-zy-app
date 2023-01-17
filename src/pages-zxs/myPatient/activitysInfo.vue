<template>
  <view>
    <detailTemplateBase
      isInfo
      :signId="signId"
      v-if="detail.activityTemplateId === 'template_01.jpg'"
    ></detailTemplateBase>
    <detailTemplateOne
      isInfo
      :signId="signId"
      v-if="detail.activityTemplateId === 'template_02.jpg'"
    ></detailTemplateOne>
    <detailTemplateTwo
      isInfo
      :signId="signId"
      v-if="detail.activityTemplateId === 'template_03.jpg'"
    ></detailTemplateTwo>
    <detailTemplateThree
      isInfo
      :signId="signId"
      v-if="detail.activityTemplateId === 'template_04.jpg'"
    ></detailTemplateThree>
    <detailTemplateFour
      isInfo
      :signId="signId"
      v-if="detail.activityTemplateId === 'template_05.jpg'"
    ></detailTemplateFour>
  </view>
</template>
<script>
import uniIcons from '@/pages-zxs/uni_modules/uni-icons/uni-icons.vue'
import { mySignDesc } from '@/api/activity'
import detailTemplateBase from '@/pages/recommend/detailTemplateBase'
import detailTemplateOne from '@/pages/recommend/detailTemplateOne'
import detailTemplateTwo from '@/pages/recommend/detailTemplateTwo'
import detailTemplateThree from '@/pages/recommend/detailTemplateThree'
import detailTemplateFour from '@/pages/recommend/detailTemplateFour'
export default {
  components: {
    uniIcons,
    detailTemplateBase,
    detailTemplateOne,
    detailTemplateTwo,
    detailTemplateThree,
    detailTemplateFour,
  },

  data() {
    return {
      detail: {},
      signId: 'fd67abf24ba54390aaf6dba3f261428a',
      fromData: {},
    }
  },
  onLoad(options) {
    // if (options.activityId) {
    // this.signId = options.activityId;
    this.mySignDesc(options.activityId)
    // }
  },
  methods: {
    signUpC() {
      this.$refs.popup.open()
    },
    async mySignDesc(id) {
      //   this.detail = await mySignDesc({ signId: id });
      this.detail = {
        activityAddr: '重庆市精神卫生中心（金紫山院区）',
        activityBeginTime: '2022-07-04 12:00:00',
        activityDept: '001',
        activityDirector: '彭莉',
        activityEndTime: null,
        activityId: '0013A3E2D6464E18A0CBB6369824B27A',
        activityImgId: 'header_01.png',
        activityInstruction:
          '<p>【团体性质】</p><p>封闭式、结构式、同质式、成长性</p><p>【团体目标】<br/>本团体希望通过“心理游戏”的形式，为组员营造一个&nbsp;真诚、尊重和温暖的小组氛围，引导他们思考自己的优缺点以及人际关系，通过与其他成员的沟通、探讨，使组员认识、了解自己在人际关系方面的优缺点,并勇于接纳自己的缺点。帮助组员在团体中培养一份归属感和被接纳的感觉，在体验与他人的亲密交流、彼此信任的同时，学会关心、倾听和体察他人，提高人际沟通技巧、建立互信互助关系。<br/>【团体对象】<br/>重庆市在校小学生，需有比较强烈的的认识自我的意愿，希望提高人际交往能力，能认真地对待小组活动。<br/>【团体规模】<br/>12~16人(团体人数为偶数)<br/>【团体时间】<br/>活动计划3次，每次2小时，在一周内完成。<br/>【团体地点】<br/></p><p>重庆市精神卫生中心（金紫山院区）</p><p>【团体领导者】<br/>领导者:丹婷，重庆师范学院。2013&nbsp;年获得国家三级心理咨询师资格证。现为新造镇家庭综合服务中心社工实习生。曾在三下乡活动中带过“人际交往”团队。<br/></p>',
        activityName: '“打开心扉交朋友”——小学生人际交往心理辅导',
        activityQuota: 16,
        activityStatus: 2,
        activityTell: '15125478692',
        activityTemplateId: 'template_01.jpg',
        activityType: '团体活动',
        cost: '600.00',
        directorTitle: '副主任医师',
        name: '孙传亮',
        otherDesc: '如有问题，可电话咨询。',
        phone: '1',
        picIds: null,
        purchaseNote: '具体活动时间，成团后再另行通知。',
        refundDesc: '报名成功后，不支持退款。',
        relList: [
          {
            fieldName: '性别',
            fieldType: '普通文本框',
            fieldValue: '1',
            id: '265E72A0200E45238A10632FBE1B4D14',
            optionValue: null,
            required: true,
            sign: true,
            signId: 'fd67abf24ba54390aaf6dba3f261428a',
          },
          {
            fieldName: '姓名',
            fieldType: '普通文本框',
            fieldValue: '孙传亮',
            id: '99EA2E6F884E4887A388E342DDC54DF0',
            optionValue: null,
            required: true,
            sign: true,
            signId: 'fd67abf24ba54390aaf6dba3f261428a',
          },
          {
            fieldName: '身份证号',
            fieldType: '普通文本框',
            fieldValue: '1',
            id: '98DF55DB9F73402CAD5584BCF2F22C68',
            optionValue: null,
            required: false,
            sign: true,
            signId: 'fd67abf24ba54390aaf6dba3f261428a',
          },
        ],
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.context {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #a6cbec;
  padding-bottom: 46rpx;
  /* background: url('../../static/hd.jpg') ; */
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
    padding: 24rpx 19rpx;
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
