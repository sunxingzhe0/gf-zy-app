<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="orderWrap ">
      <view
        class="oerderMain  box-shadow"
        style="overflow: hidden; position: relative;"
      >
        <view class="orderItem flex-between">
          <view class="title">门诊号</view>
          <view
            class="info"
            style="padding-right: 20rpx;word-wrap: break-word;"
            >{{ infoData.disease.visitNo || visitNo || '-' }}</view
          >
        </view>
        <view class="orderItem flex-between">
          <view class="title">接诊医生</view>
          <view class="info"
            >{{ infoData.disease.deptName || doctorName || '' }}
            {{ infoData.disease.docName || '' }}
            {{ infoData.title || '' }}</view
          >
        </view>

        <view class="orderItem flex-between">
          <view class="title">接诊时间</view>
          <view class="info">{{
            infoData.disease.visitDtime || regDate || '-'
          }}</view>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view
          class="orderItem flex-between"
          style="border: 0;padding-bottom: 20rpx;"
          ><view class="title">患者信息</view></view
        >
        <view class="flex-between" style="padding-right: 30rpx;">
          <view class="font26 color666">
            就诊人：
            <text class="title colora1a1">{{ infoData.patientName }}</text>
          </view>
          <view class="font26 color666">
            性别：
            <text class="title colora1a1">{{ infoData.sex }}</text>
          </view>
          <view class="font26 color666">
            年龄：
            <text class="title colora1a1">{{ infoData.age }}</text>
          </view>
        </view>
        <view class="orderItem" style="padding-top: 20rpx;">
          <view class="font26 color666">病情自述：</view>
          <view class="font26 colora1a1">{{
            infoData.complaint || infoData.illnessInfo || '-'
          }}</view>
          <view class="imgList flex-between">
            <image
              class="imgItem"
              v-for="(item, index) in infoData.pic"
              :key="index"
              @click="imgPreview(index)"
              :src="FILE_URL(item)"
            ></image>
            <view class="imgItem" style="height: 0;"></view>
            <view class="imgItem" style="height: 0;"></view>
          </view>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view class="orderItem">
          <view class="title">诊断</view>
          <view class="font26 colora1a1" style="margin-top: 20rpx;">{{
            infoData.disease.diagDesc || ''
          }}</view>
        </view>
        <view class="orderItem">
          <view class="flex-between">
            <view class="title">患者病历</view>
            <view class="more" @click="isrecipelhis = !isrecipelhis">
              {{ !isrecipelhis ? '展开' : '收起' }}
              <text
                :class="[
                  'iconfont',
                  !isrecipelhis ? 'icon-zhankai' : 'icon-expand-down',
                ]"
              ></text>
            </view>
          </view>
          <view class="" v-show="isrecipelhis">
            <view style="margin-top: 20rpx;">
              <!-- <view class="flex-start-center orderItem border0">
                <view class="title font26">病历编号</view>
                <view class="info font26">{{
                  infoData.disease.visitNo || '-'
                }}</view>
              </view> -->
              <view class="flex-start-center orderItem border0">
                <view class="title font26">就诊人</view>
                <view class="info font26">{{ infoData.patientName }}</view>
              </view>
              <!--    <view class="flex-start-center orderItem border0">
                <view class="title font26">诊疗类型</view>
                <view class="info font26">{{
                  infoData.disease.medicalType || '-'
                }}</view>
              </view> -->
              <view class="flex-start-center orderItem border0">
                <view class="title font26">就诊时间</view>
                <view class="info font26">{{
                  infoData.disease.visitDtime || '-'
                }}</view>
              </view>
            </view>
            <!-- 病历更改前 -->
            <!-- <view>
              <view class="font26 colora1a1">主诉：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.chiefComplaint || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">现病史：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.currentDisease || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">体格检查：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.checkupExam || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">辅助检查：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.auxiliaryExam || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">诊断：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.diagDesc || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">处理意见：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.advice || '-'
              }}</view>
            </view> -->
            <!-- 病历更改后 -->
            <view>
              <view class="font26 colora1a1">就诊方式：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.seeWay || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">病情：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.illness || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">辅助检查：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.supCheck || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">初次诊断：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.diagnosis || '-'
              }}</view>
            </view>
            <view>
              <view class="font26 colora1a1">处理意见：</view>
              <view class="font26 color666 mt10">{{
                infoData.disease.advice || '-'
              }}</view>
            </view>
          </view>
        </view>
        <!-- 暂时隐藏医嘱记录 2021 12 07-->
        <view class="orderItem flex-between" v-if="false">
          <view class="title">医嘱记录</view>
          <view class="more" @click="isOpen = !isOpen">
            {{ !isOpen ? '展开' : '收起' }}
            <text
              :class="[
                'iconfont',
                !isOpen ? 'icon-zhankai' : 'icon-expand-down',
              ]"
            ></text>
          </view>
        </view>
        <view v-show="isOpen">
          <view class="orderItem">
            <!-- <view class="font26 colora1a1">医嘱记录：</view> -->
            <view
              v-for="(f, i) in infoData.rpLists"
              :key="i"
              style="margin-top: 20rpx;"
            >
              <view class="prescription flex-between">
                <view class="prescriptionTitle">医嘱号：{{ f.prescNo }}</view>
                <view class="state default">
                  {{
                    f.status == 'DRAFT'
                      ? '草稿'
                      : f.status == 'PENDING_REVIEW'
                      ? '待审核'
                      : f.status == 'REJECTED'
                      ? '已驳回'
                      : f.status == 'REJECTED'
                      ? '已通过'
                      : ''
                  }}
                </view>
              </view>
              <view class="">
                <view class="font26 colora1a1">
                  <text class="color666">医生：</text>
                  {{ f.doctorName }} {{ f.title || '' }}
                </view>
                <view class="font26 colora1a1">
                  <text class="color666">创建时间：</text>
                  {{ f.createTime }}
                </view>
              </view>
              <view class="">
                <view class="font26 colora1a1" v-if="f.auditName">
                  <text class="color666">审方医生：</text>
                  {{ f.auditName }} {{ f.auditTitle }}
                </view>
                <view class="font26 colora1a1" v-if="f.auditTime">
                  <text class="color666">审方时间：</text>
                  {{ f.auditTime }}
                </view>
              </view>
              <view class="flex-between">
                <view class="">西药:￥{{ f.xcy }}</view>
                <view class="">中成药:￥{{ f.zcy }}</view>
                <view class="font-weight pricolor">合计:￥{{ f.fee }}</view>
              </view>
              <view class="flex-between" style="margin-top: 30rpx;">
                <view class="font24">数量：{{ f.items.length }}</view>
                <view
                  class="more"
                  style="font-size: 24rpx;"
                  @click="isrecipel = !isrecipel"
                >
                  {{ !isrecipel ? '查看' : '收起' }}处方
                  <text
                    :class="[
                      'iconfont',
                      !isrecipel ? 'icon-zhankai' : 'icon-expand-down',
                    ]"
                  ></text>
                </view>
              </view>
              <view v-show="isrecipel">
                <view
                  class="recipelInfo"
                  v-for="(item, index) in f.items"
                  :key="index"
                >
                  <view class="recipelItem">
                    <view class="flex-between">
                      <view class="font26">{{ item.body }}</view>
                      <view class="font26 color666"
                        >医保：{{ item.feeTypeName }}</view
                      >
                    </view>
                    <view class="color666 font26 paddingLeft16">
                      {{ item.usage }} x{{ item.num }}
                    </view>
                    <view class="font24 color666 paddingLeft16"
                      >备注：{{ item.summary || '-' }}</view
                    >
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 新增处方记录 -->
        <view class="orderItem flex-between">
          <view class="title">处方记录</view>
          <view class="more" @click="isOpenRp = !isOpenRp">
            {{ !isOpenRp ? '展开' : '收起' }}
            <text
              :class="[
                'iconfont',
                !isOpenRp ? 'icon-zhankai' : 'icon-expand-down',
              ]"
            ></text>
          </view>
        </view>
        <view v-show="isOpenRp">
          <view class="orderItem">
            <!-- <view class="font26 colora1a1">医嘱记录：</view> -->
            <view
              v-for="(f, i) in infoData.rpLists"
              :key="i"
              style="margin-top: 20rpx;"
            >
              <view class="prescription flex-between">
                <view class="prescriptionTitle">处方号：{{ f.billNo }}</view>
              </view>
              <view class="doc-time">
                <view class="font26 colora1a1">
                  <text class="color666">医生：</text>
                  {{ f.doctorName }} {{ f.title || '' }}
                </view>
                <view class="font26 colora1a1">
                  <text class="color666">创建时间：</text>
                  {{ f.createTime }}
                </view>
              </view>
              <view class="">
                <view class="font26 colora1a1" v-if="f.auditName">
                  <text class="color666">审方医生：</text>
                  {{ f.auditName }} {{ f.auditTitle }}
                </view>
                <view class="font26 colora1a1" v-if="f.auditTime">
                  <text class="color666">审方时间：</text>
                  {{ f.auditTime }}
                </view>
              </view>
              <view class="flex-between">
                <view class="">西药:￥{{ f.xcy }}</view>
                <view class="">中成药:￥{{ f.zcy }}</view>
                <view class="font-weight pricolor">合计:￥{{ f.fee }}</view>
              </view>
              <view class="flex-between" style="margin-top: 30rpx;">
                <view class="font24">数量：{{ f.items.length }}</view>
                <view
                  class="more"
                  style="font-size: 24rpx;"
                  @click="isrecipel = !isrecipel"
                >
                  {{ !isrecipel ? '查看' : '收起' }}药品
                  <text
                    :class="[
                      'iconfont',
                      !isrecipel ? 'icon-zhankai' : 'icon-expand-down',
                    ]"
                  ></text>
                </view>
              </view>
              <view v-show="isrecipel">
                <view
                  class="recipelInfo"
                  v-for="(item, index) in f.items"
                  :key="index"
                >
                  <view class="recipelItem">
                    <view class="flex-between">
                      <view class="font26">{{ item.body }}</view>
                      <view class="font26 color666"
                        >医保：{{ item.feeTypeName }}</view
                      >
                    </view>
                    <view class="color666 font26 paddingLeft16">
                      {{ item.usage }} x{{ item.num }}
                    </view>
                    <view class="font24 color666 paddingLeft16"
                      >备注：{{ item.summary || '-' }}</view
                    >
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import util from '@/common/util.js'
import { outpatientRecordInfo } from '../api/user.js'
export default {
  data() {
    return {
      isOpenRp: false,
      isOpen: false,
      regDate: '',
      doctorName: '',
      isrecipel: true,
      isrecipelhis: false,
      isOrdermore: false,
      index: 0,
      infoData: {},
      visitNo: '',
      patientId: '',
    }
  },
  onLoad: function(options) {
    if (options.visitNo && options.patientId) {
      this.visitNo = options.visitNo
      this.patientId = options.patientId
      this.regDate = options.regDate
      this.doctorName = options.doctorName
      this.getmedicalDetail()
    }
  },
  methods: {
    // 预览图片
    imgPreview(index) {
      let list = this.infoData.pic.map(item => {
        return this.FILE_URL(item)
      })
      console.log(list, index)
      uni.previewImage({
        current: list[index],
        urls: list,
      })
    },
    // 获取详情
    async getmedicalDetail() {
      this.infoData = await outpatientRecordInfo({
        cardType: 1,
        visitNo: this.visitNo,
        patientId: this.patientId,
      })
    },
    gotoInfo(url) {
      uni.navigateTo({
        url: url,
      })
    },
    swithMedicare(medicare) {
      var str = ''
      switch (medicare) {
        case 'A':
          str = '甲类'
          break
        case 'B':
          str = '乙类'
          break
        case 'C':
          str = '丙类'
          break
        case 'ME_FEE':
          str = '自费'
          break
      }
      return str
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.orderWrap {
  margin-top: 0;
  padding-top: 20rpx;
  padding-bottom: 0;

  .list_e {
    font-size: 30rpx;
    text-align: center;
    color: #fff;
    position: absolute;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    height: 50rpx;
    line-height: 50rpx;
    background: $uni-color-primary;
    top: 20rpx;
    right: -106rpx;
    width: 300rpx;
  }

  .font26 {
    font-size: 26rpx !important;
  }

  .mt10 {
    margin-bottom: 10rpx;
  }

  .state {
    padding: 3rpx 8rpx;
    font-size: 22rpx;

    &.default {
      background: rgba(153, 153, 153, 0.1);
      color: #999;
    }

    &.success {
      background: rgba(38, 181, 35, 0.1);
      color: #26b523;
    }

    &.primary {
      background: rgba(10, 178, 193, 0.1);
      color: $uni-color-primary;
    }
  }
}
.doc-time {
  display: flex;
  justify-content: space-between;
}
</style>
