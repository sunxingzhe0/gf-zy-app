<template>
  <view>
    <view class="app-card">
      <view class="doctor-info">
        <view class="avatar">
          <image class="avatar-image" mode="scaleToFill" :src="avatar"></image>
        </view>
        <view class="app-card-right">
          <view>
            <text :style="{ fontSize: '30rpx', color: '#1a1a1a' }">{{
              info.name
            }}</text>
            <text :style="{ marginLeft: '40rpx' }">{{
              info.sex == 1 ? '男' : info.sex == 0 ? '女' : '未知'
            }}</text>
          </view>
          <view>{{ info.deptName }} {{ info.titleName }}</view>
          <view>{{ info.orgName }}</view>
        </view>
        <view class="button-mini button-change" @click="goChange">更换</view>
      </view>
      <view class="count">
        <view class="count-item">
          <view class="count-num">
            <text :style="{ fontSize: '40rpx', color: '#1a1a1a' }">
              {{ info.workHistory || '' }}
            </text>
            <text :style="{ fontSize: '24rpx' }">年</text>
          </view>
          <view class="count-text">从业年限</view>
        </view>
        <view class="count-item">
          <view class="count-num">
            <text :style="{ fontSize: '40rpx', color: '#1a1a1a' }">
              {{ info.diagNum || '' }}
            </text>
            <text :style="{ fontSize: '24rpx' }">次</text>
          </view>
          <view class="count-text">回答次数</view>
        </view>
        <view class="count-item">
          <view class="count-num">
            <text :style="{ fontSize: '40rpx', color: '#1a1a1a' }">
              {{ info.score || '' }}
            </text>
            <text :style="{ fontSize: '24rpx' }">分</text>
          </view>
          <view class="count-text">综合评分</view>
        </view>
      </view>
    </view>

    <!-- 擅长 -->
    <view class="app-card">
      <view v-show="!showIntro">
        <view class="title">擅长</view>
        <view class="content">{{ info.skilled }}</view>
      </view>
      <view
        v-for="(item, index) in doctoretails"
        :key="index"
        v-show="showIntro"
      >
        <view class="title">{{ item.name }}</view>
        <view class="content">{{ item.content }}</view>
      </view>
      <view
        :style="{ marginTop: '20rpx', textAlign: 'center' }"
        @click="showIntro = !showIntro"
      >
        <text class="primary">{{ showIntro ? '收起' : '更多医生详细信息' }}</text>
        <image
          class="icon"
          :class="{ reverse: showIntro }"
          :src="require('@/assets/zhankai@2x.png')"
          mode="widthFix"
        />
      </view>
    </view>

    <view class="app-card">
      <app-list-item label="选择就诊人" :value="order.memberName" />
      <app-list-item label="诊疗类型" :value="bizInfo.title" />
      <view class="biz-wrapper">
        <view
          class="biz-item"
          :class="{
            active: item.bizId == form.bizId && item.state,
            disabled: !item.state,
          }"
          v-for="item in bizInfo.business"
          :key="item.bizId"
          @click="onBizClick(item.bizId)"
        >
          <view :style="{ fontSize: '24rpx' }">{{ item.name }}</view>
          <view>
            <text :style="{ fontSize: '24rpx' }">￥</text>
            <text :style="{ fontSize: '40rpx' }">{{ item.content }}</text>
          </view>
        </view>
      </view>
      <view

        :style="{ marginTop: '28rpx', marginLeft: '20rpx' }"
      >
        <view :style="{ color: '#666' }">业务介绍</view>
        <view :class="showBiz?'':'text-clamp'">{{ bizIntro }}</view>
      </view>
      <view
        :style="{ marginTop: '20rpx', textAlign: 'center' }"
        v-show="bizIntro.length>45"
        @click="showBiz = !showBiz"
      >
        <text class="primary">{{ showBiz ? '收起' : '展开' }}</text>
        <image
          class="icon"
          :class="{ reverse: showBiz }"
          :src="require('@/assets/zhankai@2x.png')"
          mode="widthFix"
        />
      </view>
      <app-list-item label="历史就诊记录">
        <view
          class="flex-between"
          :style="{ width: '100%' }"
          @click="() => $refs.visitRecord.open()"
        >
          <view class="primary" v-if="checkedMedical.createTime"
            >{{ checkedMedical.createTime.split(' ')[0] }} 诊断结果…</view
          >
          <view v-else class="tipsColor">请选择</view>
          <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
        </view>
      </app-list-item>
      <app-list-item label="复诊时间" noBorder v-if="nameDesc == 'VIDEO'">
        <view
          class="flex-between"
          :style="{ width: '100%' }"
          @click="() => $refs.time.open()"
        >
          <view :class="form.date?'primary':'tipsColor'">
            {{ form.date || '请选择' }}  {{form.startTime || ''}}{{form.date?'~':''}}{{form.endTime || ''}}
          </view>
          <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
        </view>
      </app-list-item>
    </view>

    <view class="app-card">
      <view class="title">病情描述</view>
      <view>
        <textarea
          class="textarea"
          :maxlength="200"
          placeholder="请详细描述您的症状、疾病或身体状况，便于医生精准分析，最少10个字"
          placeholder-style="color: #ccc;"
          @input="e => (form.desc = e.target.value)"
        ></textarea>
      </view>
      <view :style="{ textAlign: 'right', color: '#999' }">
        {{ form.desc.length }}/200
      </view>
      <view class="flex-start-start">
        <view class="upload-wrapper" @click="chooseImage">
          <image
            :src="require('@/assets/jia.png')"
            :style="{ width: '48rpx', height: '48rpx' }"
          />
          <view :style="{ color: '#666' }">添加照片</view>
          <view :style="{ fontSize: '20rpx', color: '#ccc' }">
            {{ form.picIds.length }}/6
          </view>
        </view>
        <scroll-view class="scroll-view" scroll-x>
          <view class="flex-start-start" :style="{ paddingTop: '14rpx' }">
            <view
              class="upload-image-item"
              v-for="(item, index) in form.picIds"
              :key="item"
            >
              <image
                class="img-del"
                mode="widthFix"
                :src="require('@/assets/img_del.png')"
                @click="delImg(index)"
              />
              <image
                class="upload-image"
                :src="FILE_URL(item)"
                mode="scaleToFill"
              />
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="button-submit" @click="submit">提交</view>

    <VisitRecord
      ref="visitRecord"
      :userId="order.userId"
      :memberId="order.memberId"
      @change="onMedicalChange"
    />
    <Time ref="time" :doctorId="doctorId" @change="onTimeChange" />
  </view>
</template>
<script>
import UniIcons from '@/components/uni-icons/uni-icons'
import AppListItem from '@/components/app/app-list-item'
import VisitRecord from '../comp/visit-record'
import Time from '../comp/time'
import {
  doctorIntro,
  h5DocBizInfo,
  submit,
  upload,
} from '@/common/request/index'
export default {
  components: {
    UniIcons,
    AppListItem,
    VisitRecord,
    Time,
  },
  props: {
    order: Object,
    doctorId: String,
  },
  data() {
    return {
      doctorAvatar: this.$store.state.avatar,
      showIntro: false,
      showBiz: false,
      bizInfo: {},
      info: {},
      checkedMedical: {},
      form: {
        bizId: '',
        medicalId: '',
        date: '',
        startTime: '',
        endTime: '',
        desc: '',
        picIds: [],
      },
    }
  },
  watch: {
    bizInfo: {
      handler() {
        this.form.bizId = this.bizInfo.business[0].bizId
      },
      deep: true,
    },
    doctorId() {
      this.getDoctorIntro()
      this.geTh5DocBizInfo()
    },
  },
  computed: {
    avatar() {
      return this.info.avatar
        ? this.FILE_URL(this.info.avatar)
        : this.doctorAvatar
        ? this.FILE_URL(this.doctorAvatar)
        : require('@/assets/user/user_d_head.png')
    },
    doctoretails() {
      return [
        {
          name: '擅长',
          content: this.info.skilled,
        },
        {
          name: '个人简介',
          content: this.info.intro,
        },
        {
          name: '执业经历',
          content: this.info.practiceInfo,
        },
        {
          name: '学术经历',
          content: this.info.academicInfo,
        },
        {
          name: '执业范围',
          content: this.info.practiceArea,
        },
        {
          name: '执业证号',
          content: this.info.practiceCert,
        },
      ]
    },
    nameDesc() {
      return (
        this.bizInfo.business?.find(_ => _.bizId == this.form.bizId)
          ?.nameDesc || ''
      )
    },
    bizIntro() {
      return (
        this.bizInfo.business?.find(_ => _.bizId == this.form.bizId)?.bizIntr ||
        ''
      )
    },
  },
  created() {
    this.getDoctorIntro()
    this.geTh5DocBizInfo()
  },
  methods: {
    goChange() {
      uni.navigateTo({
        url:
          `/pages-user/home/online/Consultation?type=REPEAT_CLINIC&title=选择预约医生&deptId=${this.info.deptId}&isAppoint=1`,
      })
    },
    onBizClick(bizId) {
      this.form.bizId = bizId
    },
    chooseImage() {
      uni.chooseImage({
        count: 6 - this.form.picIds.length,
        success: ({ tempFilePaths }) =>
          tempFilePaths.forEach(path =>
            upload(path).then(data => {
              if (data.body) this.form.picIds.push(data.body)
            }),
          ),
      })
    },
    delImg(index) {
      this.form.picIds.splice(index, 1)
    },
    getDoctorIntro() {
      doctorIntro({
        id: this.doctorId,
      }).then(data => (this.info = data))
    },
    geTh5DocBizInfo() {
      h5DocBizInfo({
        doctorId: this.doctorId,
      }).then(data => {
        if (data) {
          this.bizInfo = data.find(_ => _.describe == 'REPEAT_CLINIC')
        }
      })
    },
    onMedicalChange(medical) {
      this.checkedMedical = { ...medical }
      this.form.medicalId = medical.id
    },
    onTimeChange(date) {
      Object.assign(this.form, {
        date: date.date,
        startTime: date.startTime,
        endTime: date.endTime,
      })
    },
    submit() {
      if (!this.form.bizId) {
        this.$tip('请选择业务')
        return
      } else if (!this.form.medicalId) {
        this.$tip('请选择历史就诊记录')
        return
      } else if (this.nameDesc == 'VIDEO' && !this.form.date) {
        this.$tip('请选择复诊时间')
        return
      } else if (!this.form.desc) {
        this.$tip('请填写病情描述')
        return
      }

      const form = Object.assign({}, this.form, {
        agreement: true,
        bizType: 'REPEAT_CLINIC',
        memberId: this.order.memberId,
        userId: this.order.userId,
      })
      submit(form).then(() =>
        uni.navigateBack({
          delta: 1,
        }),
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.app-card {
  margin: 20rpx 20rpx 0;
}
.doctor-info {
  display: flex;
  justify-content: flex-start;
}
.primary{
  color: $uni-color-primary;
}
.tipsColor{
  color: #999;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;

  .avatar-image {
    width: 100%;
    height: 100%;
  }
}
.app-card-right {
  width: 420rpx;
  margin-left: 28rpx;
  font-size: 24rpx;
  color: #666;
}
.count {
  display: flex;
  justify-content: space-between;
  margin-top: 28rpx;
  padding: 28rpx 0 12rpx;
  border-top: 2rpx solid #e6e6e6;
}
.count-item {
  width: 33%;
  height: 90rpx;
  text-align: center;
  color: #666;

  & + .count-item {
    border-left: 2rpx solid #e6e6e6;
  }

  .count-num {
    line-height: 38rpx;
  }
  .count-text {
    line-height: 68rpx;
  }
}
.title {
  margin: 32rpx 0 24rpx;
  padding-left: 12rpx;
  line-height: 28rpx;
  border-left: 4rpx solid $uni-color-primary;
  font-size: 32rpx;
  color: #333;
}
.content {
  font-size: 26rpx;
  color: #666;
}
.icon {
  width: 26rpx;

  .reverse {
    transform: 180deg;
  }
}
.biz-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-top: 20rpx;

  .biz-item {
    flex-shrink: 0;
    width: 200rpx;
    padding-top: 8rpx;
    border-radius: 10rpx;
    text-align: center;
    background-color: #f2f2f2;
    color: #333;

    & + .biz-item {
      margin-left: 20rpx;
    }

    &.active {
      background-color: #d0f2f5;
      color: $uni-color-primary;
    }
    &.disabled {
      color: #ccc;
    }
  }
}
.textarea {
  width: 100%;
}
.upload-wrapper {
  flex-shrink: 0;
  margin-top: 12rpx;
  width: 180rpx;
  padding: 18rpx 0;
  text-align: center;
  border: 2rpx solid #ccc;
  border-radius: 6rpx;
}
.scroll-view {
  margin-left: 20rpx;
  width: 100%;
  overflow-x: hidden;
}
.upload-image-item {
  position: relative;
  flex-shrink: 0;
  width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;

  .upload-image {
    width: 100%;
    height: 100%;
  }
  .img-del {
    position: absolute;
    top: -12rpx;
    right: -14rpx;
    width: 36rpx;
  }
}
.button-mini {
  width: 100rpx;
  height: 50rpx;
  line-height: 48rpx;
  text-align: center;
  border: 2rpx solid #ccc;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #333;

  &.button-change {
    margin-top: 50rpx;
  }
}
.button-submit {
  width: 90vw;
  margin: 40rpx auto 40rpx;
  height: 88rpx;
  line-height: 86rpx;
  border-radius: 44rpx;
  text-align: center;
  background-color: $uni-color-primary;
  color: #fff;
}
</style>
