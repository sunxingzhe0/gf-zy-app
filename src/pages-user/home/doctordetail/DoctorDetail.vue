<template>
  <view class="docDetail">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- 顶部背景图 -->
    <view class="bgtop"
      ><!-- <img :src="FILE_URL_BUILT_IN('bgtop.png')" alt="" mode="widthFix" /> --></view
    >
    <!-- 医生信息简介卡片视图 -->
    <view class="docCard">
      <!-- 医生简介 -->
      <view class="docinfoCard">
        <!-- 卡片内部上半部分 -->
        <view class="cardTop">
          <view class="touxiang"
            ><default-img
              class="touxiang-img"
              :url="FILE_URL(doctorInfo.avatar)"
            ></default-img
          ></view>
          <view class="content">
            <view class="nameBox">
              <view class="name">{{ doctorInfo.name || '-' }}</view>
              <view class="gender">{{
                doctorInfo.sex == 0 ? '女' : '男'
              }}</view>
            </view>
            <view class="type">
              <view class="keshi">{{ doctorInfo.deptName || '-' }}</view>
              <view class="position">{{ doctorInfo.titleName || '-' }}</view>
            </view>
            <view class="hospital">{{ doctorInfo.orgName || '-' }}</view>
          </view>
        </view>
        <!-- 卡片内部下半部分 -->
        <view class="cardbottom">
          <view class="item">
            <view class="numBox">
              <view class="num">{{ doctorInfo.workHistory || '-' }}</view>
              <!-- <span class="fontW">年</span> -->
            </view>
            <view class="describe">从业年限</view>
          </view>
          <view class="item">
            <view class="numBox">
              <view class="num">{{ doctorInfo.diagNum || '-' }}</view>
              <span class="fontW">人</span>
            </view>
            <view class="describe">服务人数</view>
          </view>
          <view class="item">
            <view class="numBox">
              <view class="num">{{ doctorInfo.score || '-' }}</view>
              <span class="fontW">分</span>
            </view>
            <view class="describe">综合评分</view>
          </view>
        </view>
      </view>
      <!-- 医生详情 -->
      <view :class="isShowMore ? 'docdetailCard open' : 'docdetailCard'">
        <view
          class="detailItem"
          v-for="(item, index) in doctoretails"
          :key="index"
        >
          <view class="title">{{ item.name }}</view>
          <view :class="isShowMore ? 'text' : 'text-clamp text'">{{
            item.content
          }}</view>
        </view>
        <view class="showBox" @click="isShowMore = !isShowMore">
          <view class="show" v-if="isShowMore">收起医生详细信息</view>
          <view class="show" v-else>查看医生详细信息</view>
          <img
            :src="
              isShowMore
                ? require('@/assets/hide.png')
                : require('@/assets/show.png')
            "
            alt=""
            mode="widthFix"
          />
        </view>
      </view>
      <!-- 就诊信息 -->
      <view class="jiuzhenInfo">
        <!-- 选择就诊人 -->
        <view class="titleBox" @click="showMemberPopup()">
          <view class="title">选择就诊人</view>
          <view class="changePerson">
            <view
              style="width: 350rpx; color: #cccccc;"
              v-if="!selectMember || !selectMember.name"
              >请选择就诊人</view
            >
            <view class="person">{{
              selectMember ? selectMember.name : ''
            }}</view>
            <img
              :src="require('@/assets/right11@2x.png')"
              alt=""
              mode="widthFix"
            />
          </view>
        </view>
        <!-- 就诊类型 -->
        <view class="typeBox" @click="open">
          <view class="title">诊疗类型</view>
          <view class="modeBox">
            <view class="mode">{{
              typeList[type] ? typeList[type].title : ''
            }}</view>
            <img
              :src="require('@/assets/right11@2x.png')"
              alt=""
              mode="widthFix"
            />
          </view>
        </view>
        <!-- 就诊类型弹框 -->
        <uni-popup ref="popup" type="center" :maskClick="false">
          <view class="jiuzhenType">
            <view class="close" @click="close"
              ><uni-icons
                type="closeempty"
                class="closeIcon"
                color="#999"
              ></uni-icons
            ></view>
            <view class="typeTitle">诊疗类型</view>
            <label
              class="typeItemBox"
              :class="{ s: type == index }"
              v-for="(item, index) in typeList"
              :key="index"
              @click="typeC(index)"
            >
              <view class="typeItemtitleBox">
                <view class="itemTitle">{{ item.title }}</view>
                <template v-for="(typeItem, typeIndex) in item.business">
                  <view
                    v-if="typeItem.bizId"
                    :key="typeIndex"
                    style="display: flex;margin-top: 20rpx;"
                  >
                    <view
                      class="title"
                      :class="{ video: typeItem.nameDesc == 'VIDEO' }"
                      >{{ typeItem.name }}</view
                    >
                    <view class="content">{{ typeItem.bizIntr }}</view>
                  </view>
                </template>
              </view>
            </label>
          </view>
        </uni-popup>
        <!-- 选择套餐 -->
        <view class="changeMode">
          <view
            class="typeItem"
            v-for="(item, index) in typeList[type]
              ? typeList[type].business
              : 0"
            :key="index"
            :class="{ invalid: !item.state, s: businessS == index }"
            @click="businessC(index)"
          >
            <view>{{ item.name }}</view>
            <view class="priceBox">
              <view class="rmb" v-show="item.state">￥</view>
              <view :class="{ num: item.state }">{{
                item.state ? item.content : '暂未开通'
              }}</view>
            </view>
          </view>
        </view>
        <view :style="{ fontSize: '32rpx', color: '#666' }">业务介绍</view>
        <view>
          <view id="bizintr" class="bizintr" :class="{ hide: !bizIntrShow }">
            {{ typeList[type].business[businessS].bizIntr }}
          </view>
          <view
            v-show="showExpandButton"
            :style="{ textAlign: 'center' }"
            @click="bizIntrShow = !bizIntrShow"
          >
            <text :style="{ lineHeight: '60rpx', color: '#0ab2c1' }">{{
              bizIntrShow ? '收起' : '展开'
            }}</text>
            <image
              :class="{ 'transform-reverse': bizIntrShow }"
              :src="require('@/assets/zhankai@2x.png')"
              :style="{ width: '26rpx', height: '18rpx' }"
            />
          </view>
        </view>
        <!-- 历史就诊记录 -->
        <view
          class="histroyBox"
          v-if="typeList[type] && typeList[type].describe != 'CONSULT'"
          @click="histroy()"
        >
          <view class="title">历史就诊记录</view>
          <view class="record">
            <view
              style="width: 350rpx; color: #cccccc;"
              v-if="!recordItem || !recordItem.createTime"
              >请选择历史就诊</view
            >
            <view class="date"
              >{{ (recordItem && recordItem.createTime) || '' }}
              {{ (recordItem && recordItem.diagnose) || '' }}</view
            >
            <img
              :src="require('@/assets/right11@2x.png')"
              alt=""
              mode="widthFix"
            />
          </view>
        </view>
        <!-- 历史处方 -->
        <view
          class="historyPrescription"
          v-if="typeList[type] && typeList[type].describe == 'CARRYON_PRESC'"
        >
          <view class="histitleBox">
            <view class="prescriptionTitle">历史处方</view>
            <view class="showBox" @click="prescriptionC()">
              <view class="showText">{{
                prescriptionShow ? '收起' : '展开'
              }}</view>
              <img :src="require('@/assets/right11@2x.png')" alt="" />
            </view>
          </view>
          <!-- 内容区 -->
          <prescription
            :prescriptionShow="prescriptionShow"
            :historyRpList="historyRpList"
            @prescIdC="prescIdC"
            @openRpList="openRpList"
          ></prescription>
        </view>
        <!-- 选择复诊时间 -->
        <view
          class="reSee"
          v-if="
            typeList[type] &&
              typeList[type].describe == 'REPEAT_CLINIC' &&
              typeList[type].business[businessS] &&
              typeList[type].business[businessS].nameDesc != 'GRAPHIC'
          "
        >
          <view class="title">复诊时间</view>
          <view class="selDate" @click="selectTime()">
            <view style="width: 350rpx; color: #cccccc;" v-if="!time"
              >请选择</view
            >
            <view class="date" style="color: #0ab2c1;"
              >{{ time || '' }} {{ timeSlot.rangeTime || '' }}</view
            >
            <img
              :src="require('@/assets/right11@2x.png')"
              alt=""
              mode="widthFix"
            />
          </view>
        </view>
      </view>
      <!-- 病情描述 -->
      <view class="illDescribe">
        <view class="title">病情描述</view>
        <textarea
          v-show="textareaS"
          name=""
          id=""
          cols="30"
          rows="10"
          maxlength="200"
          @input="inputText"
          placeholder-style="color:#cccccc"
          placeholder="请详细描述您的症状、疾病或身体状况，便于医生精准分析，最少10个字"
          placeholder-class="placeholder"
        ></textarea>
        <view class="surplus">{{ count }}/200</view>
        <scroll-view scroll-x="true" class="upload-scroll">
          <view class="addPtr">
            <view class="add" @click="upL" v-if="uploadImags.length < 6">
              <img :src="require('@/assets/jia.png')" alt="" class="icon" />
              <view class="text">添加照片</view>
            </view>
            <view v-if="uploadImags.length == 0" class="textadd"
              >你上传的照片仅对诊疗的医生可见可上传6张</view
            >
            <view
              v-for="(item, index) in uploadImags"
              :key="index"
              class="img-layout"
            >
              <image :src="FILE_URL(item)" class="img"
                ><image
                  @click="delImg(index)"
                  class="img-del"
                  :src="require('@/assets/img_del.png')"
                ></image
              ></image>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- 勾选是否同意 -->
    <view class="agree" @click="handleCheck">
      <!-- icon-size="12" -->
      <evan-checkBox
        v-model="confirmChecked"
        shape="square"
        primary-color="#0AB2C1"
      ></evan-checkBox>
      <view class="textBox">
        <view class="text">我同意</view>
        <view class="agreement" @click="agreementOpen()"
          >《互联网医院服务协议》</view
        >
      </view>
    </view>
    <!-- 订购服务按钮 -->
    <view class="orderButton" @click="payC()" :class="{ f: !payState }"
      >订购服务</view
    >
    <!-- 服务需知-->
    <uni-popup ref="typePopup" type="center" :maskClick="false">
      <view class="type-popup">
        <text class="popup-title" v-if="type == 0">{{
          onlineConsultingA.title
        }}</text>
        <text class="popup-title" v-if="type == 1">{{
          onlineAppointmentA.title
        }}</text>
        <text class="popup-title" v-if="type == 2">{{
          slowDiseaseA.title
        }}</text>
        <scroll-view class="popup-content" scroll-y="true">
          <view
            v-html="
              type == 0
                ? onlineConsultingA.content
                : type == 1
                ? onlineAppointmentA.content
                : slowDiseaseA.content
            "
          ></view>
        </scroll-view>
        <text class="popup-confirm" @click="informConfirm">
          {{ countdown > 0 ? countdown + '秒' : '我知道了' }}
        </text>
      </view>
    </uni-popup>
    <!--互联网医院协议-->
    <uni-popup ref="agreementPopup" type="center" :maskClick="false">
      <view class="type-popup">
        <text class="popup-title">{{ hospitalServiceA.title }}</text>
        <scroll-view class="popup-content" scroll-y="true"
          ><view v-html="hospitalServiceA.content"></view
        ></scroll-view>
        <text class="popup-confirm" @click="agreementConfirm()">我知道了</text>
      </view>
    </uni-popup>
    <!--选择就诊人-->
    <uni-popup ref="memberPopup" type="center" :maskClick="false">
      <view class="type-popup">
        <text class="popup-title">就诊人</text>
        <view class="member-layout">
          <view
            v-for="(item, index) in patientList"
            :key="index"
            @click="selectClick(item)"
          >
            <view
              class="select-member"
              :class="{ s: item.memberId == selectMember.memberId }"
            >
              <text>{{ item.name || '' }}</text>
            </view>
          </view>
          <view class="select-member add" @click="addC()"
            ><text>+ 新增</text></view
          >
        </view>
        <text class="popup-confirm" @click="closeMemberPopup()">确认</text>
      </view>
    </uni-popup>
    <uni-popup type="bottom" ref="timePopup" :maskClick="false">
      <view class="time-popup">
        <view class="close" @click="timeSelectClose"
          ><uni-icons
            type="closeempty"
            class="closeIcon"
            color="#999"
          ></uni-icons
        ></view>
        <view class="time-popup-title">选择复诊时间</view>
        <view class="line"></view>
        <picker-view
          class="picker-view"
          :indicator-style="indicatorStyle"
          :value="value"
          @change="timeChange"
        >
          <picker-view-column>
            <view class="item" v-for="(item, index) in times" :key="index"
              >{{ item.year }}年</view
            >
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in getMonth" :key="index"
              >{{ item.month }}月</view
            >
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in getDay" :key="index"
              >{{ item }}日</view
            >
          </picker-view-column>
        </picker-view>
        <view class="rest" v-if="getTimeS.length <= 0">休息</view>
        <scroll-view scroll-x="true" class="time-slot">
          <view style="display: flex">
            <template v-for="(item, index) in getTimeS">
              <view
                class="time-slot-item"
                :key="index"
                v-if="item.state === 2"
                :class="{ s: timeSlot.rangeTime == item.rangeTime }"
                :style="{ flexShrink: 0, marginLeft: '20rpx' }"
                @click="timeSlotC(item)"
              >
                <view
                  class="text"
                  :class="{ o: item.state === 0 || item.state === 1 }"
                  >{{ item.rangeTime }}</view
                >
                <view class="slot-not-optional" v-show="item.state == 1"
                  >满</view
                >
              </view>
            </template>
          </view>
        </scroll-view>
        <view class="time-confirm" @click="timeConfirm()">确定</view>
      </view>
    </uni-popup>
    <!--选择支付方式-->
    <popup-pay
      ref="pay"
      :type="true"
      @success="paySuccess"
      @payTap="orderPay"
      @cancel="payCancel"
    ></popup-pay>
    <uni-popup ref="visit_records" :maskClick="false">
      <view class="records-p">
        <view class="close" @click="recordsClose"
          ><uni-icons
            type="closeempty"
            class="closeIcon"
            color="#999"
          ></uni-icons
        ></view>
        <text class="text">历史就诊记录</text>
        <scroll-view scroll-x class="tabList">
          <view class="tab-layout">
            <view
              :key="index"
              v-for="(item, index) in tabs"
              @click="topBarChange(index)"
              class="tabWrap"
            >
              <view :class="['tabItem', active == index ? 'on' : '']">{{
                item.title
              }}</view>
            </view>
          </view>
        </scroll-view>
        <!--   <topbar :active="active" :tabs="tabs" @change="topBarChange">
        </topbar> -->
        <scroll-view scroll-y="true" class="content-slot">
          <radio-group class="content" @change="recordsChange">
            <view
              v-for="(item, index) in recordListBytype"
              :key="index"
              class="records-item"
            >
              <image
                class="item-img"
                :src="require('@/assets/internet_title.png')"
                v-show="active == 0"
              ></image>
              <view class="item-time">
                <text>{{
                  item.medicalType == 'MZ'
                    ? '门诊记录'
                    : item.medicalType == 'ZY'
                    ? '住院记录'
                    : '体检报告'
                }}</text>
                <text style="padding-left: 59rpx;">{{ item.visitDate }}</text>
              </view>
              <text class="item-user">{{ item.patientName }}</text>
              <view class="item-doctor">
                <text>{{ item.deptName }}</text>
                <text style="padding-left: 39rpx;">{{
                  item.doctorName || '-'
                }}</text>
                <text style="padding-left: 39rpx;">{{
                  item.title || '-'
                }}</text>
              </view>
              <!-- 在线就诊/门诊 -->
              <template v-if="active < 2">
                <view class="item-content">
                  <text style="color: #666666;">初步诊断：</text>
                  <text>{{ item.diagnose || '' }}</text>
                </view>
                <view class="item-content">
                  <text style="color: #666666;">治疗意见：</text>
                  <text>{{ item.disposeAdvise || '' }}</text>
                </view>
              </template>

              <!-- 住院记录 -->
              <template v-if="active == 2">
                <view class="item-content">
                  <text style="color: #666666;">入院诊断：</text>
                  <text>{{ item.inDiagnose || '' }}</text>
                </view>
                <view class="item-content">
                  <text style="color: #666666;">出院诊断：</text>
                  <text>{{ item.outDiagnose || '' }}</text>
                </view>
              </template>

              <!-- 体检报告 -->
              <template v-if="active == 3">
                <view class="item-content">
                  <text style="color: #666666;">体检单号：</text>
                  <text>{{ item.visitNo }}</text>
                </view>
                <view class="item-content">
                  <text style="color: #666666;">体检内容：</text>
                  <text>{{ item.content }}</text>
                </view>
                <view class="item-content">
                  <text style="color: #666666;">体检时间：</text>
                  <text>{{ item.exeTime }}</text>
                </view>
              </template>
              <radio
                style="position: absolute; right: 10rpx;bottom: 40rpx;"
                :value="item.id"
                :checked="item.id === recordS"
                color="#0AB2C1"
              ></radio>
            </view>
          </radio-group>
        </scroll-view>
        <view class="record-confirm" @click="recordConfirm">确定</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import uniRate from '@/components/uni-rate/uni-rate.vue'
import evanCheckBox from '@/components/evan-checkbox/evan-checkbox.vue'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import {
  doctorIntro,
  chooseOrderTime,
  h5DocBizInfo,
  patientList,
  showAgreement,
  submit,
  archiveList,
  userHistoryRp,
  upload,
  addBrowseNum,
} from '@/common/request/index.js'
export default {
  components: {
    uniRate,
    evanCheckBox,
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
  },
  data() {
    return {
      doctorId: '',
      bizIntrShow: true,
      showExpandButton: false,
      // 是否展示更多
      isShowMore: false,
      // 收起医生详情信息文字
      showTitle: '收起医生详情信息',
      // 收起 icon
      imgUrl: require('@/assets/show.png'),
      // 输入的字数
      count: 0,
      //病情描述
      desc: '',
      // 弹出层单选框
      current: 0,
      // 我同意协议单选框
      confirmChecked: false,
      // 选择诊疗类型弹出框数据
      typeList: [],
      type: 0, //当前诊疗类型
      selectMember: null, //当前选择就诊人
      show: false, //处方展开
      prescriptionShow: true,
      year: '',
      month: '',
      day: '',
      value: [0, 0, 0],
      indicatorStyle: `height: ${Math.round(
        uni.getSystemInfoSync().screenWidth / (750 / 100),
      )}px;`,
      timeSlot: '', //时间段选择
      time: '', //最终选择的复诊时间
      uploadImags: [], //上传图片
      payState: true, //订购按钮状态
      tabs: [
        {
          title: '在线就诊记录',
          key: 0,
        },
        {
          title: '门诊记录',
          key: 1,
        },
        {
          title: '住院记录',
          key: 2,
        },
        {
          title: '体检报告',
          key: 3,
        },
      ],
      active: 0, //就诊记录类型选择
      recordS: null, //就诊记录选择（item的id 临时选中表示）
      recordListBytype: [], //根据类型获取的记录集合
      recordItem: null, //最终确认选中就诊记录item
      doctorInfo: {},
      doctoretails: [
        {
          name: '擅长',
          content: '',
        },
        {
          name: '个人简介',
          content: '',
        },
        {
          name: '执业经历',
          content: '',
        },
        {
          name: '学术经历',
          content: '',
        },
        {
          name: '执业范围',
          content: '',
        },
        {
          name: '执业证号',
          content: '',
        },
      ],
      orderTimes: [], //患者可选复诊时间段
      times: [
        //   {
        //   year: "2019",
        //   m: [{
        //     month: "12",
        //     d: ['28', '29', '30', '31']
        //   }]
        // }, {
        //   year: "2021",
        //   m: [{
        //     month: "1",
        //     d: ['1', '2', '3', '4']
        //   }]
        // },
      ],
      timeSlots: [], //预约时间段
      patientList: [], //就诊人列表
      optionType: 'CONSULT', //传递的类型
      businessS: -1, //选中套餐0
      archiveData: {
        OUTER: [],
        MZ: [],
        ZY: [],
        TJ: [],
      }, //就诊记录
      medicalRecords: false, //当前就诊人是否有就诊记录（无不能购买复诊/续方）
      onlineConsultingA: {}, //在线咨询须知
      onlineAppointmentA: {}, //在线复诊须知
      slowDiseaseA: {}, //慢病续方须知
      hospitalServiceA: {}, //互联网医院服务协议
      historyRpList: [],
      prescIds: null, //选中处方id
      addMemberId: '', //添加新成员返回的id
      countdown: 5, //倒计时
      textareaS: true, //显示textarea（规避原生组件不会被弹出框遮盖问题）
      isPay: true, //防止重复生成订单
    }
  },
  watch: {
    type() {
      this.resolveBizIntrShow()
    },
    businessS() {
      this.resolveBizIntrShow()
    },
  },
  onShow() {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    if (currPage.data) {
      let res = currPage.data.memberId //添加成员返回的id
      if (res) {
        this.addMemberId = res
        this.getPatientList()
      } else {
        this.addMemberId = ''
      }
    }
  },
  onLoad(options) {
    if (options.type) {
      this.optionType = options.type
    }
    if (options.doctorId) {
      this.doctorId = options.doctorId
    }
    if (options.q) {
      this.doctorId = decodeURIComponent(options.q).split('=')[1]
    }
  },
  onReady() {
    this.typePopupShow()
    this.getShowAgreement()
    this.getDoctorIntro()
    this.geTh5DocBizInfo()
    this.getPatientList()
    this.getChooseOrderTime()
  },
  computed: {
    getMonth() {
      if (this.year) return this.times.find(item => item.year === this.year).m
      return []
    },
    getDay() {
      if (this.year && this.month)
        return this.times
          .find(item => item.year === this.year)
          .m.find(item => item.month === this.month).d
      return []
    },
    /***
     *获取时间段
     */
    getTimeS() {
      if (this.orderTimes && this.year && this.month && this.day) {
        let time = this.year + '-' + this.month + '-' + this.day
        return this.orderTimes.find(item => item.date === time).timeRange
      }
      return []
    },
  },
  methods: {
    resolveBizIntrShow() {
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('#bizintr')
          .boundingClientRect(data => {
            this.bizIntrShow = data.height < 60
            this.showExpandButton = data.height >= 60
          })
          .exec()
      })
    },
    timeSelectClose() {
      this.textareaS = true
      this.$refs.timePopup.close()
    },
    //获取处方
    getUserRpHospital() {
      const { hospCode, cardNo, id, visitNo } = this.recordItem
      // 查询一年
      userHistoryRp({
        hospCode,
        cardNo,
        beginDate: this.FORMATDATE(+new Date() - 31622400000, 'yyyy-MM-dd'),
        endDate: this.FORMATDATE(+new Date(), 'yyyy-MM-dd'),
        id, //就诊记录id
        visitNo, //就诊流水号
        serviceType: 'CARRYON_PRESC', //业务类型
        userId: uni.getStorageSync('userId'), // 患者编码
      }).then(data => {
        if (data) {
          data.forEach(item => {
            item.isOpenRpList = false
          })
          this.historyRpList = data
          console.log(historyRpList, '-----------')
        }
      })
    },
    openRpList(index) {
      this.historyRpList[index].isOpenRpList = !this.historyRpList[index]
        .isOpenRpList
    },
    getArchiveList(isChangMember) {
      if (!this.selectMember?.memberId) return

      this.payState = true
      this.archiveData = {
        OUTER: [],
        MZ: [],
        ZY: [],
        TJ: [],
      }
      archiveList({
        memberIds: this.selectMember.memberId,
        bizType: this.typeList[this.type]?.describe ?? '',
      }).then(data => {
        if (!data) return
        this.archiveData = data
        this.setRecordList()
        //（没有就诊记录只能购买在线咨询）
        if (
          !data.OUTER.length &&
          !data.MZ.length &&
          !data.ZY.length &&
          !data.TJ.length
        ) {
          this.medicalRecords = false
          if (this.typeList[this.type].describe != 'CONSULT') {
            this.showMedicalRecordsT(isChangMember)
          } else {
            this.payState = true
          }
        } else {
          //有就诊记录
          this.medicalRecords = true
        }
      })
    },
    /***
     *订单支付
     */
    orderPay() {
      let slots = []
      if (this.timeSlot.rangeTime) {
        slots = this.timeSlot.rangeTime?.split('-')
      }
      let payParameter = {
        bizId: this.typeList[this.type].business[this.businessS].bizId,
        bizType: this.typeList[this.type].describe,
        memberId: this.selectMember.memberId,
        medicalId: this.recordItem ? this.recordItem.id : null, //历史就诊记录
        date: this.time, //预约日期
        startTime: slots[0], //
        endTime: slots[1],
        desc: this.desc,
        picIds: this.uploadImags,
        prescIds: this.prescIds,
        agreement: true,
      }
      if (this.isPay) {
        //提交订单
        this.isPay = false
        submit(payParameter)
          .then(data => {
            if (data) {
              if (data.isPay) {
                //0元业务已支付
                this.showToast('支付成功')
                this.$refs.pay.closePop()
                //支付成功 跳转到诊室
                setTimeout(() => {
                  uni.redirectTo({
                    url: '../../chat/chat?orderId=' + data.orderId,
                  })
                  this.isPay = true
                }, 1000)
              } else {
                this.$refs.pay.payTypeC(data.orderId)
                this.isPay = true
              }
            }
          })
          .catch(() => {
            this.isPay = true
          })
      } else {
        uni.showToast({
          icon: 'none',
          title: '请勿重复点击',
        })
      }
    },
    //genre协议类型
    getShowAgreement() {
      for (let i = 4; i <= 7; i++) {
        showAgreement({
          genre: i,
        }).then(data => {
          if (!data) return
          if (i == 4) {
            this.hospitalServiceA = data
          } else if (i == 5) {
            this.onlineConsultingA = data
          } else if (i == 6) {
            this.onlineAppointmentA = data
          } else if (i == 7) {
            this.slowDiseaseA = data
          }
        })
      }
    },
    getPatientList() {
      patientList().then(data => {
        if (data) {
          this.patientList = data
          this.selectMember = this.patientList.find(item => {
            if (this.addMemberId) {
              return this.addMemberId == item.memberId
            } else {
              return item.def == true
            }
          })
          if (this.selectMember) {
            this.getArchiveList()
          }
        }
      })
    },
    geTh5DocBizInfo() {
      h5DocBizInfo({
        doctorId: this.doctorId,
      }).then(data => {
        if (data) {
          this.typeList = data
          this.typeList.forEach((item, index) => {
            if (item.describe == this.optionType) {
              this.type = index
              this.defaultBusinessS()
              this.getArchiveList()
              this.addBrowse()
              return
            }
          })
        }
      })
    },
    /***
     *切换业务时默认选中左开始选中第一个可选择的业务形式
     */
    defaultBusinessS() {
      for (let i = 0; i < this.typeList[this.type].business.length; i++) {
        if (this.typeList[this.type].business[i].state) {
          this.businessS = i
          return
        }
      }
    },
    getDoctorIntro() {
      doctorIntro({
        id: this.doctorId,
      }).then(data => {
        if (data) {
          this.doctorInfo = data
          this.doctoretails[0].content = this.doctorInfo.skilled
          this.doctoretails[1].content = this.doctorInfo.intro
          this.doctoretails[2].content = this.doctorInfo.practiceInfo
          this.doctoretails[3].content = this.doctorInfo.academicInfo
          this.doctoretails[4].content = this.doctorInfo.practiceArea
          this.doctoretails[5].content = this.doctorInfo.practiceCert
        }
      })
    },
    getChooseOrderTime() {
      chooseOrderTime({
        doctorId: this.doctorId,
      }).then(data => {
        if (data && data.length > 0) {
          this.orderTimes = data
          let dates = this.orderTimes[0].date?.split('-')
          this.year = dates[0]
          this.month = dates[1]
          this.day = dates[2]
          this.pingTime()
        }
      })
    },
    histroy() {
      //默认选中已选择的
      if (this.recordItem) {
        this.recordS = this.recordItem.id
      }
      this.textareaS = false
      this.$refs.visit_records.open()
    },
    recordConfirm() {
      this.recordItem = this.recordListBytype.find(
        item => item.id == this.recordS,
      )
      //为慢病续方时获取处方
      if (this.typeList[this.type].describe == 'CARRYON_PRESC') {
        this.getUserRpHospital()
      }
      this.textareaS = true
      this.$refs.visit_records.close()
    },
    /***
     *就诊记录类型切换
     */
    topBarChange(active) {
      this.active = active
      this.setRecordList()
    },
    /***
     *根据类型设置记录列表
     */
    setRecordList() {
      switch (this.active) {
        case 0:
          this.recordListBytype = this.archiveData.OUTER
          break
        case 1:
          this.recordListBytype = this.archiveData.MZ
          break
        case 2:
          this.recordListBytype = this.archiveData.ZY
          break
        case 3:
          this.recordListBytype = this.archiveData.TJ
          break
      }
    },
    informConfirm() {
      if (this.countdown <= 0) {
        this.textareaS = true
        this.$refs.typePopup.close()
      }
    },
    agreementOpen() {
      this.textareaS = false
      this.$refs.agreementPopup.open()
    },
    agreementConfirm() {
      this.textareaS = true
      this.$refs.agreementPopup.close()
    },
    // 监听输入字数事件
    inputText(e) {
      this.count = e.detail.cursor
      this.desc = e.detail.value
    },
    // 上传
    upL() {
      var _self = this
      uni.chooseImage({
        count: 6 - _self.uploadImags.length, //默认9 6 - _self.uploadImags.length
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function(res) {
          res.tempFilePaths.forEach(path => {
            //上传图片
            upload(path).then(data => {
              if (data.body) {
                _self.uploadImags.push(data.body)
              }
            })
          })
        },
      })
    },
    // 复选框
    handleCheck() {
      this.checked = !this.checked
    },
    //打开弹框
    open() {
      this.textareaS = false
      this.$refs.popup.open()
    },
    typePopupShow() {
      if (this.$refs.typePopup.showPopup) return
      this.countdown = 5
      this.textareaS = false
      this.$refs.typePopup.open()
      //倒计时5秒显示知道按钮
      const timer = setInterval(() => {
        //5s后停止定时器
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    typeC(index) {
      this.type = index
      this.addBrowse()
      this.defaultBusinessS()
      //关闭选项弹框
      this.textareaS = true
      this.$refs.popup.close()
      this.getArchiveList()
    },
    /***
     *提示无就诊记录提示
     */
    showMedicalRecordsT(isChangMember) {
      uni.showModal({
        title: '系统提示',
        content:
          '就诊人无线下就诊记录，不符合' +
          this.typeList[this.type].title +
          '条件，是否购买在线咨询业务？',
        cancelText: '否',
        confirmText: '是',
        confirmColor: '#0AB2C1',
        cancelColor: '#666666',
        success: res => {
          if (res.confirm) {
            this.payState = true
            this.type = 0
            //切换后判断在线咨询是否有可购买业务 （无：跳转到列表）
            if (!this.typeList[this.type].hasOpen) {
              let pages = getCurrentPages()
              let prevPage = pages[pages.length - 2] //上一个页面
              //返回列表页
              if (prevPage.route == 'pages-user/home/online/Consultation') {
                //#ifdef H5 || APP-PLUS
                prevPage.type = 'CONSULT'
                //#endif
                //#ifdef MP-WEIXIN
                prevPage.setData({
                  type: 'CONSULT',
                })
                //#endif
                uni.navigateBack()
              } else {
                uni.redirectTo({
                  url: '../online/Consultation?type=CONSULT',
                })
              }
            }
          } else if (res.cancel) {
            this.payState = false
          }
        },
      })
    },
    showMemberPopup() {
      this.textareaS = false
      this.$refs.memberPopup.open()
    },
    addC() {
      uni.navigateTo({
        url: '/pages-user/patientManagement/add?page=DoctorDetail',
      })
    },
    closeMemberPopup() {
      //获取当前就诊人下的就诊记录 （没有就诊记录只能购买在线咨询）
      this.getArchiveList(true)
      this.textareaS = true
      this.$refs.memberPopup.close()
    },
    selectClick(item) {
      this.selectMember = item
    },
    //处方历史查看
    prescriptionC() {
      this.prescriptionShow = !this.prescriptionShow
    },
    selectTime() {
      this.textareaS = false
      this.$refs.timePopup.open()
    },
    /***
     *拼接复诊时间数据
     */
    pingTime() {
      if (this.orderTimes) {
        this.orderTimes.forEach(item => {
          let dates = item.date?.split('-')
          let isYear = this.times.find(time => dates[0] === time.year)
          if (isYear) {
            let isMonth = this.times
              .find(time => dates[0] === time.year)
              .m.find(mTiem => dates[1] === mTiem.month)
            if (isMonth) {
              let isDay = this.times
                .find(time => dates[0] === time.year)
                .m.find(mTiem => dates[1] === mTiem.month)
                .d.find(day => dates[2] === day)
              if (!isDay) {
                //设置日
                this.times
                  .find(time => dates[0] === time.year)
                  .m.find(mTiem => dates[1] === mTiem.month)
                  .d.push(dates[2])
              }
            } else {
              //设置月
              this.times
                .find(time => dates[0] == time.year)
                .m.push({
                  month: dates[1],
                  d: [dates[2]],
                })
            }
          } else {
            //设置年
            this.times.push({
              year: dates[0],
              m: [
                {
                  month: dates[1],
                  d: [dates[2]],
                },
              ],
            })
          }
        })
      }
    },
    timeChange(e) {
      const val = e.detail.value
      this.year = this.times[val[0]].year
      this.month = this.times[val[0]].m[val[1]].month
      this.day = this.times[val[0]].m[val[1]].d[val[2]]
    },
    timeConfirm() {
      if (!this.timeSlot) {
        this.showToast('请选择时间段！')
        return
      }
      this.time = this.year + '-' + this.month + '-' + this.day
      this.textareaS = true
      this.$refs.timePopup.close()
    },
    timeSlotC(item) {
      this.timeSlot = item
    },
    payRadioChange(evt) {
      this.payType = parseInt(evt.target.value)
    },
    recordsChange(evt) {
      this.recordS = evt.target.value
    },
    payC() {
      if (!this.payState) {
        return
      }
      //必填：协议 就诊人 诊疗类型
      if (!this.selectMember) {
        this.showToast('请选择就诊人!')
        return
      }
      if (
        !this.typeList[this.type].business[this.businessS] ||
        !this.typeList[this.type].business[this.businessS].state
      ) {
        this.showToast('请选择诊疗业务!')
        return
      }
      switch (this.typeList[this.type].describe) {
        case 'REPEAT_CLINIC': //在线复诊  必填：历史就诊记录 复诊时间
          if (!this.recordItem) {
            this.showToast('请选择历史就诊记录!')
            return
          }
          if (
            !this.time &&
            this.typeList[this.type].business[this.businessS].nameDesc !=
              'GRAPHIC'
          ) {
            this.showToast('请选择复诊时间!')
            return
          }
          break
        case 'CARRYON_PRESC': //慢病续方  必填：历史就诊记录 历史处方
          if (!this.recordItem) {
            this.showToast('请选择历史就诊记录!')
            return
          }
          if (!this.prescIds) {
            this.showToast('请选择历史处方!')
            return
          }
          break
      }
      if (this.desc.length < 10) {
        this.showToast('请填入10个字符以上的病情描述!')
        return
      }
      if (!this.confirmChecked) {
        this.showToast('请先同意《互联网医院服务协议》!')
        return
      }
      this.$refs.pay.show()
    },
    showToast(message) {
      uni.showToast({
        title: message,
        icon: 'none',
      })
    },
    businessC(index) {
      if (this.typeList[this.type].business[index].state) {
        this.businessS = index
      }
    },
    prescIdC(value) {
      this.prescIds = value
    },
    delImg(index) {
      this.uploadImags.splice(index, 1)
    },
    close() {
      this.textareaS = true
      this.$refs.popup.close()
    },
    recordsClose() {
      this.textareaS = true
      this.$refs.visit_records.close()
    },
    paySuccess(value) {
      //支付成功 跳转到诊室
      //0元业务已支付
      this.showToast('支付成功')
      //支付成功 跳转到诊室
      setTimeout(() => {
        uni.redirectTo({
          url: '../../chat/chat?orderId=' + value,
        })
      }, 1000)
    },
    payCancel(value) {
      uni.redirectTo({
        url: '../../serviceOrder/detail?orderId=' + value,
      })
    },
    addBrowse() {
      addBrowseNum({
        doctorId: this.doctorId,
        bizType: this.typeList[this.type].describe,
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/common/order.scss';
.bgtop {
  width: 100%;
  height: 40rpx;
  background: $uni-color-primary;
  img {
    width: 100%;
    height: 100%;
  }
}
.docCard {
  padding: 20upx;
  position: relative;
  top: -40rpx;
  .docinfoCard {
    height: 335upx;
    padding: 30upx;
    background: #fff;
    box-shadow: 0px 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
    border-radius: 20upx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .cardTop {
      margin-top: 10upx;
      display: flex;
      justify-content: flex-start;
      padding-bottom: 30upx;
      border-bottom: 1px solid #e6e6e6;
      .touxiang {
        width: 100upx;
        height: 100upx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 29upx;
        .touxiang-img {
          width: 100%;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 117upx;
        .nameBox,
        .type {
          display: flex;
          justify-content: flex-start;
          align-items: baseline;
          font-size: 24upx;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
        }
        .nameBox {
          .name {
            font-size: 30upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(26, 26, 26, 1);
            margin-right: 20upx;
          }
        }
        .type {
          .keshi {
            margin-right: 20upx;
          }
        }
        .hospital {
          font-size: 24upx;
          color: #666666;
        }
      }
    }
    .cardbottom {
      width: 100%;
      height: 76upx;
      // padding: 10upx 0;
      box-sizing: border-box;
      // border-top: 1px solid #E6E6E6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item {
        width: 33.33%;
        border-right: 1px solid #e6e6e6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .numBox {
          display: flex;
          align-items: baseline;
          .num {
            font-size: 33upx;
            font-family: PingFang SC;
            font-weight: 600;
            color: rgba(26, 26, 26, 1);
            margin-right: 10upx;
          }
          .fontW {
            font-size: 20upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #666;
          }
        }
        .describe {
          font-size: 24upx;
          font-family: PingFang SC;
          font-weight: 400;
          color: #666;
        }
      }
      .rate {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .numBox {
          display: flex;
          align-items: baseline;
          justify-content: space-around;
          color: #ffa200;
          margin-bottom: 20upx;
          .num {
            font-size: 40upx;
            font-family: PingFang SC;
            font-weight: 600;
            margin-right: 10upx;
          }
          .fontW {
            font-size: 20upx;
            font-family: PingFang SC;
            font-weight: 500;
          }
        }
        .describe {
          height: 26upx;
        }
      }
    }
  }
  .docdetailCard {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 254rpx;
    padding: 30upx 0 110upx 30upx;
    box-sizing: border-box;
    margin-top: 20upx;
    background: #fff;
    box-shadow: 0px 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
    border-radius: 20upx;
    transition: height 0.8s;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    .detailItem {
      padding-bottom: 40upx;
      margin-bottom: 40upx;
      border-bottom: 1upx solid #e6e6e6;
      .title {
        width: 100%;
        // text-align: center;
        padding-left: 10rpx;
        line-height: 30upx;
        font-size: 30upx;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        border-left: 4upx solid #0ab2c1;
        margin-bottom: 42upx;
      }
      .text {
        font-size: 26upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        line-height: 36upx;
        padding-right: 30upx;
      }
    }
    .showBox {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      height: 80upx;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .show {
        font-size: 24upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(10, 178, 193, 1);
        margin-left: -81upx;
      }
      img {
        width: 22upx;
        height: 10upx;
        margin-left: 15upx;
      }
    }
  }
  .open {
    height: auto;
    transition: height 0.8s;
  }
  .jiuzhenInfo {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    margin-top: 20upx;
    box-shadow: 0px 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
    border-radius: 20upx;
    padding-left: 30upx;
    padding-bottom: 28rpx;
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40upx 30upx 40upx 0;
      border-bottom: 1upx solid #e6e6e6;
      .title {
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
      .changePerson {
        width: 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .person {
          font-size: 30upx;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(10, 178, 193, 1);
        }
        img {
          width: 8upx;
          height: 14upx;
        }
      }
    }
    .typeBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40upx 30upx 40upx 0;
      .title {
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
      .modeBox {
        width: 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mode {
          font-size: 30upx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #1a1a1a;
        }
        img {
          width: 8upx;
          height: 14upx;
        }
      }
    }
    .jiuzhenType {
      width: 640upx;
      border-radius: 20upx;
      padding: 40upx 0;
      background: #fff;
      .close {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #f2f2f2;
        right: 40rpx;
        top: 40rpx;
        text-align: center;
        line-height: 40rpx;
        cursor: pointer;
        .closeIcon {
          font-size: 30rpx !important;
        }
      }
      .typeTitle {
        width: 300upx;
        text-align: center;
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
        margin: 10upx auto 50upx;
      }
      .typeItemBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // width: 100%;
        padding: 30rpx 30upx;
        &.s {
          background: rgba(242, 242, 242, 1);
        }
        .typeItemtitleBox {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          min-height: 74upx;
          .itemTitle {
            font-size: 30rpx;
            font-weight: 500;
            color: rgba(26, 26, 26, 1);
          }
          .title {
            min-width: 56rpx;
            height: 24rpx;
            background: rgba(10, 178, 193, 0.1);
            font-size: 20rpx;
            font-weight: 500;
            color: rgba(10, 178, 193, 1);
            text-align: center;
            &.video {
              color: rgba(10, 96, 193, 1);
            }
          }
          .content {
            width: 500rpx;
            margin-left: 10rpx;
            flex: 1;
            font-size: 24rpx;
            font-weight: 500;
            color: rgba(102, 102, 102, 1);
            overflow: hidden;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            word-break: break-all;
          }
        }
      }
      .confirm {
        line-height: 88upx;
        width: 100%;
        font-size: 30upx;
        font-weight: 500;
        color: rgba(10, 178, 193, 1);
        text-align: center;
        border-top: 1px solid #e6e6e6;
      }
    }
    .changeMode {
      width: 100%;
      padding-bottom: 40upx;
      display: flex;
      .typeItem {
        width: 196upx;
        height: 116upx;
        border-radius: 10upx;
        background: #f2f2f2;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 20upx;
        margin-right: 25px;
        font-size: 24upx;
        font-weight: 500;
        &.s {
          color: rgba(10, 178, 193, 1);
          background: rgba(208, 242, 245, 1);
        }
        &.invalid {
          color: rgba(204, 204, 204, 1);
          background: rgba(242, 242, 242, 1);
        }
        .priceBox {
          margin-top: 10rpx;
          display: flex;
          align-items: baseline;
          .num {
            font-size: 40upx;
          }
        }
      }
    }
    .histroyBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 30upx 32rpx 0;
      .title {
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
      .record {
        width: 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .date {
          width: 365upx;
          font-size: 30upx;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(10, 178, 193, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        img {
          width: 8upx;
          height: 14upx;
        }
      }
    }
    .historyPrescription {
      padding: 40upx 30upx 40upx 0;
      .histitleBox {
        padding: 40upx 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .prescriptionTitle {
          font-size: 30upx;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
        }
        .showBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 75upx;
          .showText {
            font-size: 24upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
          }
          img {
            width: 8upx;
            height: 14upx;
          }
        }
      }
    }
    .cell-box {
      padding: 20rpx 0;
      border-top: 2rpx solid #e6e6e6;
    }
    .reSee {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40upx 30upx 40upx 0;
      .title {
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
      .selDate {
        width: 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .date {
          width: 365upx;
          font-size: 30upx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #cccccc;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        img {
          width: 8upx;
          height: 14upx;
        }
      }
    }
  }
  .illDescribe {
    background: #fff;
    margin-top: 20upx;
    box-shadow: 0px 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
    border-radius: 20upx;
    padding: 40upx;
    .title {
      padding-left: 6rpx;
      border-left: 4upx solid #0ab2c1;
      font-size: 30upx;
      font-family: PingFang SC;
      font-weight: bold;
      margin-bottom: 30upx;
    }
    textarea {
      height: 260upx;
      width: 100%;
      height: 230upx;
    }
    .surplus {
      text-align: right;
      font-size: 20upx;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(204, 204, 204, 1);
    }
    .placeholder {
      color: #cccccc;
      font-size: 26upx;
      font-weight: 500;
      line-height: 36upx;
    }
    .upload-scroll {
      width: 100%;
      .addPtr {
        width: 100%;
        display: flex;
        align-items: center;
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
            font-size: 24upx;
            font-weight: 500;
            color: rgba(102, 102, 102, 1);
          }
        }
        .textadd {
          margin-left: 30rpx;
          font-size: 20upx;
          font-weight: 500;
          color: rgba(204, 204, 204, 1);
          margin-right: 20upx;
        }
        .img-layout {
          position: relative;
          margin-left: 30rpx;
          .img {
            padding: 10rpx;
            height: 180rpx;
            width: 180rpx;
          }
          .img-del {
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            right: 0rpx;
          }
        }
      }
    }
  }
}
.agree {
  display: flex;
  align-items: center;
  padding: 0 40upx;
  margin-bottom: 30upx;
  .textBox {
    font-size: 24upx;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    display: flex;
    align-items: center;
    margin-left: 20upx;
    .agreement {
      color: #0ab2c1;
    }
  }
}
.orderButton {
  width: 90vw;
  line-height: 88upx;
  background: rgba(10, 178, 193, 1);
  border-radius: 44upx;
  font-size: 30upx;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin: 0 auto 60rpx;
  text-align: center;
  &.f {
    background: #f2f2f2;
    color: #cccccc;
  }
}
.time-popup {
  width: 100vw;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  padding-bottom: 20rpx;
  position: relative;
  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;
    .closeIcon {
      font-size: 30rpx !important;
    }
  }
  .time-popup-title {
    line-height: 80rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    text-align: center;
    padding: 20rpx 24rpx;
  }
  .line {
    width: 750rpx;
    height: 2rpx;
    background: #e6e6e6;
    margin-bottom: 42rpx;
  }
  .rest {
    height: 100rpx;
    text-align: center;
    color: rgba(204, 204, 204, 1);
  }
  .time-slot {
    width: 100%;
    .time-slot-item {
      min-width: 200rpx;
      height: 60rpx;
      margin: 40rpx 0rpx 40rpx 30rpx;
      background: rgba(242, 242, 242, 1);
      border-radius: 30rpx;
      position: relative;
      .text {
        line-height: 60rpx;
        text-align: center;
        font-size: 26rpx;
        font-weight: 500;
        padding: 0rpx 24rpx;
        &.o {
          color: rgba(204, 204, 204, 1);
        }
      }
      &.s {
        background: rgba(10, 178, 193, 1);
        color: rgba(255, 255, 255, 1);
      }
      .slot-not-optional {
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        width: 30rpx;
        height: 30rpx;
        background: rgba(228, 91, 91, 1);
        border-radius: 50%;
        line-height: 30rpx;
        text-align: center;
        font-size: 18rpx;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .time-confirm {
    margin: 20rpx 20rpx 0rpx 20rpx;
    width: 710rpx;
    height: 88rpx;
    background: rgba(10, 178, 193, 1);
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 88rpx;
    text-align: center;
  }
}
.type-popup {
  width: 640rpx;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  .popup-title {
    font-size: 30rpx;
    text-align: center;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    padding: 41rpx;
  }
  .popup-content {
    max-height: 500rpx;
    width: auto;
    font-size: 26rpx;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    padding: 0rpx 29rpx;
    line-height: 46rpx;
  }
  .popup-confirm {
    margin-top: 30rpx;
    font-size: 30rpx;
    font-weight: 500;
    padding: 30rpx;
    color: rgba(10, 178, 193, 1);
    text-align: center;
  }
}
.member-layout {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 10rpx;
  padding-left: 30rpx;
}
.select-member {
  width: 173rpx;
  height: 60rpx;
  background: rgba(242, 242, 242, 1);
  border-radius: 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 60rpx;
  text-align: center;
  margin: 30rpx 30rpx 0rpx 0rpx;
  &.s {
    background: rgba(10, 178, 193, 1);
    color: rgba(255, 255, 255, 1);
  }
  &.add {
    color: rgba(10, 178, 193, 1);
  }
}
.records-p {
  width: 640rpx;
  height: 860rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  border-radius: 20rpx;
  position: relative;
  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;
    .closeIcon {
      font-size: 30rpx !important;
    }
  }
  .text {
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
    padding: 41rpx 41rpx 0rpx 41rpx;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }
  .content-slot {
    max-height: 600rpx;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .records-item {
      padding-bottom: 40rpx;
      margin-top: 19rpx;
      width: 580rpx;
      min-height: 218rpx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);
      border-radius: 20rpx;
      position: relative;
      .item-img {
        width: 123rpx;
        position: absolute;
        right: 0rpx;
        height: 123rpx;
      }
      .item-time {
        padding: 41rpx 0rpx 41rpx 30rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
      }
      .item-user {
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(26, 26, 26, 1);
        padding-left: 30rpx;
      }
      .item-doctor {
        position: relative;
        padding-left: 30rpx;
        margin-top: 22rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
      .item-content {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding-left: 30rpx;
        margin-top: 21rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .record-confirm {
    position: absolute;
    bottom: 0rpx;
    text-align: center;
    width: 100%;
    line-height: 100rpx;
    font-size: 30rpx;
    font-weight: 500;
    background-color: #fff;
    color: rgba(10, 178, 193, 1);
    border-top: 1rpx solid rgba(230, 230, 230, 1);
  }
}
/deep/.picker-view {
  width: 98%;
  height: 500rpx;
  align-items: center;
  .item {
    text-align: center;
  }
}
.tabList {
  width: 100%;
}
.tab-layout {
  display: flex;
  flex-direction: row;
  padding: 0rpx 28rpx;
}
/deep/ .container.data-v-53ef67cf {
  width: 640rpx;
  border-radius: 0rpx;
  position: relative;
  box-shadow: 0px 0px 0px 0px #ffffff;
}
/deep/.top-bar.data-v-53ef67cf {
  box-shadow: 0px 0px 0px 0px #ffffff;
}
.bizintr {
  width: 98%;
  display: block;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 18rpx;
  &.hide {
    display: -webkit-box;
  }
}
.transform-reverse {
  transform: rotate(180deg);
}
</style>
