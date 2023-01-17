<template>
  <view style="padding: 20rpx;">
    <!--主页按钮-->
    <homeIcom />
    <app-card styles="padding:20rpx 0">
      <AppListItem
        v-for="(item, index) in itemList"
        :key="index"
        textStyle="font-size:15px"
        :label="item.label"
        :valStyle="
          item.value === 'price' ? 'color:red;font-size:15px' : 'font-size:15px'
        "
        :value="
          item.value === 'idCard'
            ? `${infoData.idCard.substr(
                0,
                3,
              )}*************${infoData.idCard.substr(16)}`
            : item.value === 'phone'
            ? `${infoData.phone.substr(0, 3)}******${infoData.phone.substr(9)}`
            : item.value === 'deptName'
            ? infoData.deptInfo.deptName
            : item.value === 'date'
            ? `${infoData.date} ${infoData.randomNo.shiftName} ${infoData.rangeTime}`
            : item.value === 'price'
            ? `¥${infoData.price}`
            : infoData[item.value] || '-'
        "
        className="preview"
        :noBorder="item.value === 'price'"
      ></AppListItem>
    </app-card>
    <view class="submit_btn" @click="submit">立即挂号 </view>

    <!-- 知情同意 -->
    <pop-notice
      ref="notice"
      title="新型冠状病毒核酸检测知情同意书"
      :content="noticeContent"
      btnText="同意"
      @isOk="agree"
    >
      <view class="no" @click="$refs.notice.close()">不同意</view>
    </pop-notice>
  </view>
</template>

<script>
import appCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item/index'
import popNotice from '../components/pop-notice.vue'
import {
  getNucleateDept,
  userNucleateReg,
  checkRegNum,
  getTimeRangeInfo,
} from '../api/index'
export default {
  components: {
    appCard,
    AppListItem,
    popNotice,
  },
  data() {
    return {
      canSubmit: true,
      infoData: {
        ...JSON.parse(uni.getStorageSync('memberInfo')),
      },
      itemList: [
        { label: '姓名', value: 'name' },
        { label: '身份证', value: 'idCard' },
        { label: '联系电话', value: 'phone' },
        { label: '预约项目', value: 'itemName' },
        { label: '预约科室', value: 'deptName' },
        { label: '预约医生', value: 'docName' },
        { label: '就诊时间', value: 'date' },
        { label: '价格', value: 'price' },
      ],
      noticeContent:
        '<p>请您务必仔细阅读以下内容:</p><p>◆体检人员必须如实填写个人信息和流行病学史调查问卷，如有隐瞒需承担相应的法律责任。</p><p>◆如有以下情况不得使用新型冠状病毒核酸检测自助服务并请向我院咨询，听从医务人员指引。</p><p>1、发热(T≥37.3)和/或有呼吸道症状;</p><p>2、14天内有境外和国内中高风险地区旅居史;</p><p>(疫情中高风险地区填写时以政府部门公布为准)</p><p>3、有其他流行病学史(包括高风险国家人员接触史、疫区发热或有呼吸道症状患者接触史、确诊病例/疑似病例/无症状感染者接触史、聚集性发病史)人员;</p><p>◆此次新型冠状病毒核酸检测费用为自费全额支付，不享受公医、医保等其它记账、减免待遇。</p><p>◆咨询电话：<br/>客服中心：023-63692253<br/>咨询时间：<br/>周一至周六上午9:00-11:30；下午14:30-17:00',
    }
  },
  async onLoad({ itemInfo }) {
    uni.showLoading()
    itemInfo && Object.assign(this.infoData, JSON.parse(itemInfo))
    await this.getNucleateDept()
    console.log(this.infoData, '详情数据')
    this.infoData = { ...this.infoData }
    this.getNoList(this.infoData)
  },
  methods: {
    //获取号源
    async getNoList({
      regDate,
      deptId,
      docId,
      scheduleNo,
      shiftCode,
      shiftName,
    }) {
      const res = await getTimeRangeInfo({
        regDate,
        deptId,
        docId,
        scheduleNo,
        shiftCode,
        shiftName,
      })
      //取随机号源
      const radomIndex = Math.floor(Math.random() * res.length) || 0
      const randomNo = res[radomIndex]
      this.infoData.randomNo = randomNo
      this.$forceUpdate()
      uni.hideLoading()
    },
    //获取科室
    async getNucleateDept() {
      const res = await getNucleateDept()
      this.infoData.deptInfo = res
    },
    //提交
    submit() {
      if (!this.canSubmit) return
      this.canSubmit = false
      setTimeout(() => {
        this.canSubmit = true
      }, 2000)
      // this.$refs.notice.open()
      this.agree()
    },
    async agree() {
      // this.$refs.notice.close()
      console.log(this.getParams(), '参数')

      try {
        //是否跳转待付款列表
        const result = await checkRegNum({
          patientId: this.infoData.patientId,
          date: this.infoData.date,
          timeName: this.infoData.randomNo.shiftName,
          rangeTime: this.infoData.rangeTime,
        })
        console.log(result, '======')
        if (result.canPay) {
          console.log('有未付款')
          uni.showModal({
            title: '提示',
            content: '您还有未付款订单，请先缴费。',
            showCancel: false,
            confirmColor: '#0ab2c1',
            success: re => {
              if (re.confirm) {
                console.log('确认123')
                uni.navigateTo({
                  url: `/pages-zy/outpatientPayment/detail?patientId=${
                    this.infoData.patientId
                  }&type=${0}&billNo=${result.billNo}&visitNo=${
                    result.visitNo
                  }`,
                })
                return
              }
              console.log('取消')
              this.submitData()
            },
          })
        } else {
          this.submitData()
        }
      } catch (error) {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages-zy/outpatientPayment/list',
          })
        }, 2000)
      }
    },
    //处理参数
    getParams() {
      const params = Object.assign(
        this.infoData,
        this.infoData.randomNo,
        this.infoData.deptInfo,
      )
      params.orderItem = params.itemName
      params.timeName = params.shiftName
      return params
    },

    async submitData() {
      //提交
      uni.showLoading({
        title: '正在提交...',
      })
      let res = await userNucleateReg(this.getParams())
      //成功页数据整理
      const sucessInfo = {
        name: this.infoData.name,
        phone: this.infoData.phone,
        docName: this.infoData.docName,
        deptName: this.infoData.deptInfo.deptName,
        time: `${this.infoData.date} ${this.infoData.randomNo.shiftName} ${this.infoData.rangeTime}`,
        itemName: this.infoData.itemName,
        price: res.fee || this.infoData.price,
        overdue: true,
      }
      uni.hideLoading()
      uni.navigateTo({
        url: `/pages-user/nucleicAcidAppointment/flowform/success?bizId=${
          res.id
        }&sucessInfo=${JSON.stringify(sucessInfo)}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.no {
  color: #666;
  width: 50%;
  text-align: center;
}
</style>
