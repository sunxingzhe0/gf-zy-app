<template>
  <view>
    <!--主页按钮-->
    <homeIcom />
    <view class="orderTop flex-between">
      <image :src="FILE_URL_BUILT_IN('orderBg1.png')"></image>
      <text class="sate">{{ switchStatus(infoData.status) }}</text>
      <text class="sate">{{
        infoData.serviceType == 'CONSULT'
          ? '在线咨询'
          : infoData.serviceType == 'REPEAT_CLINIC'
          ? '在线复诊'
          : '慢病续方'
      }}</text>
    </view>
    <view
      class="orderWrap "
      :style="{
        paddingBottom:
          infoData.status == 'PENDING_REVIEW' ||
          infoData.status == 'REJECTED' ||
          infoData.status == 'DRAFT'
            ? ''
            : '40rpx',
      }"
    >
      <view class="oerderMain paddtb box-shadow">
        <view class="orderItem border0 flex-between">
          <view class="title">就诊人</view>
          <view class="info">
            <view>{{ infoData.memberName }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">诊疗类型</view>
          <view class="info">
            <view>{{
              infoData.serviceType == 'CONSULT'
                ? '在线咨询'
                : infoData.serviceType == 'REPEAT_CLINIC'
                ? '在线复诊'
                : '慢病续方'
            }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem border0 flex-between">
          <view class="title">就诊时间</view>
          <view class="info">
            <view>{{ infoData.treatmentTime }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>
      <view class="oerderMain paddtb box-shadow">
        <view class="orderItem border0 flex-between">
          <view class="title">诊断</view>
          <view class="info"><view></view></view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="orderItem border0 flex-start-start">
          <view :class="['info', isOpen ? '' : 'text-overflow']">{{
            infoData.diagnosis
          }}</view>
          <view class="font24 color999" @click="isOpen = !isOpen">
            {{ isOpen ? '收起' : '展开' }}
            <text
              :class="[
                'iconfont',
                isOpen ? 'icon-expand-down' : 'icon-zhankai',
                'font24',
                'color999',
              ]"
            ></text>
          </view>
        </view>
      </view>
      <view class="oerderMain paddtb box-shadow">
        <view class="orderItem border0 flex-between">
          <view class="title">药品清单</view>
          <view class="more">{{ infoData.number }}</view>
        </view>
        <view>
          <view class="orderItem border0">
            <view class="flex-between">
              <view class="color333 font26"
                >西药:￥{{ infoData.westPrice }}</view
              >
              <view class="color333 font26"
                >中药:￥{{ infoData.chPatentPrice }}</view
              >
              <view class="pricolor font26"
                >合计:￥{{ infoData.prescriptionPrice }}</view
              >
            </view>
            <view
              class="recipelInfo"
              v-for="(item, index) in infoData.rpDrugList"
              :key="index"
            >
              <view class="recipelItem" style="margin-bottom: 0;">
                <view class="flex-between">
                  <view class="font26"
                    >{{ index + 1 }}.{{ item.name }}（规格：{{
                      item.spec
                    }}）</view
                  >
                  <view class="font26 color666">{{
                    item.medicare == 'ME_FEE'
                      ? '自费'
                      : swithMedicare(item.medicare)
                  }}</view>
                </view>
                <view class="colorred font26 paddingLeft16 flex-start-start">
                  {{ allchannel[item.useWays] || '' }}
                  {{ allfrequency[item.useFrequency] || '' }}
                  {{ item.singleDose || ''
                  }}{{ item.singleDoseUnitText + '/次' }}
                  {{ item.treatment || ''
                  }}{{ attrdate[item.treatmentUnit] || '' }}
                  <view class="color666 ml-20"
                    >￥{{ item.price
                    }}{{ '/' + item.alltotalUnit[item.totalUnit] }}x{{
                      item.total
                    }}</view
                  >
                </view>
                <view class="cloum">
                  <view class=" paddingLeft16">￥{{ item.totalPrice }}</view>
                  <view class="btn-box" v-if="infoData.status == 'DRAFT'">
                    <text @click="editrp(item)">修改</text>
                    <text @click="delrp(item)">删除</text>
                  </view>
                </view>
                <view class="font24 color666 paddingLeft16"
                  >备注：{{ item.remark || '-' }}</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="oerderMain  box-shadow paddtb">
        <view class="orderItem paddtb">
          <view class="flex-between">
            <view class="title">处方号</view>
            <view class="info" style="word-wrap: break-word;">{{
              infoData.prescriptionNo || infoData.id
            }}</view>

            <view
              class="pricolor"
              @click="cope(infoData.prescriptionNo || infoData.id)"
              >复制</view
            >
          </view>
          <view class="flex-between">
            <view class="title">创建时间</view>
            <view class="info">
              <view>{{ infoData.createTime || '' }}</view>
            </view>
            <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
          </view>
        </view>
        <view class="orderItem  flex-between ">
          <view class="title">开方医生</view>
          <view class="info flex-start-center">
            <default-img
              class="headImg"
              :url="FILE_URL(infoData.doctorAvatar)"
            ></default-img>
            <view>
              {{ infoData.doctorName }}
              <text class="color666 paddingLeft16">{{ infoData.title }}</text>
            </view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>

        <view
          class="flex-between orderItem  border0"
          v-show="
            infoData.status != 'PENDING_REVIEW' && infoData.status != 'DRAFT'
          "
        >
          <view class="title">审方时间</view>
          <view class="info">
            <view>{{ infoData.auditTime }}</view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>

        <view
          class=" flex-between orderItem "
          v-show="
            infoData.status != 'PENDING_REVIEW' && infoData.status != 'DRAFT'
          "
        >
          <view class="title">审方医生</view>
          <view class="info flex-start-center">
            <default-img
              class="headImg"
              :url="FILE_URL(infoData.auditAvatar)"
            ></default-img>
            <view>
              {{ infoData.auditUserName }}
              <text class="color666 paddingLeft16">{{
                infoData.auditUserTitle
              }}</text>
            </view>
          </view>
        </view>

        <view
          class="flex-between orderItem border0"
          v-show="infoData.status == 'REJECTED'"
        >
          <view class="title">驳回原因</view>
          <view style="color: #E45B5B;flex: 1;">{{ infoData.reason }}</view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
      </view>

      <view
        v-for="(item, index) in infoData.relRpIds"
        class="oerderMain   paddtb"
        :key="index"
      >
        <view class="orderItem border0 flex-between">
          <view class="title">关联处方</view>
          <view class="info" style="word-wrap: break-word;">{{ item }}</view>
          <text class="pricolor otherCope font26" @click="copyOther(item)"
            >复制</text
          >
          <text class="pricolor font26" @click="seeRelation(item)">查看</text>
        </view>
      </view>
    </view>
    <view
      class="fiexBtn flex-justify-end"
      style="text-align: right;"
      v-if="
        infoData.status == 'PENDING_REVIEW' ||
          infoData.status == 'REJECTED' ||
          infoData.status == 'DRAFT'
      "
    >
      <view
        class="chfBtn on"
        v-if="infoData.status == 'PENDING_REVIEW'"
        @click="withdraw"
        >撤回</view
      >
      <!-- 驳回 状态时 点击复制相当于新增一个处方-->
      <view class="chfBtn on" v-if="infoData.status == 'REJECTED'" @click="copy"
        >复制</view
      >
      <view class="chfBtn on" v-if="infoData.status == 'DRAFT'" @click="del"
        >删除</view
      >
      <view
        class="chfBtn on"
        v-if="infoData.status == 'DRAFT'"
        @click="submit(infoData)"
        >提交</view
      >
    </view>

    <!-- 模态框 -->
    <dialog-pop v-if="isShowSetModel" @close="hideSetModel" :hideFooter="true">
      <DrugsorList
        :codeId="true"
        :prescriptionNumber="prescriptionNumber"
        :deptId="deptId"
        :edittorFormDatas="edittorFormDatas"
        :prescriptionListData="prescriptionListData"
        :newPharmacy="newPharmacy"
        ref="getPrams"
      />
    </dialog-pop>
  </view>
</template>

<script>
import { singleRp } from '@/common/request/userCenter'
import { addAndEdit, getOrderInfo } from '@/common/request/prescriptionList'
import {
  saveRp,
  delRp,
  withdrawRp,
  submitRp,
  orderList,
} from '../../../common/request/index.js'
import DialogPop from '../../components/dialogPop'
import DrugsorList from '../../../pages-doctor/prescription/drugsOrList'
// import { delete } from 'vue/types/umd';
export default {
  components: {
    DialogPop,
    DrugsorList,
  },
  data() {
    return {
      isOpen: false,
      takeType: 1, // 1.自提，2.邮寄
      id: '',
      infoData: {},
      isShowSetModel: false,
      //药品数据
      edittorFormDatas: {},
      //处方号
      prescriptionNumber: [],
      attrdate: {},
      allchannel: {},
      allfrequency: {},
    }
  },
  onLoad(options) {
    if (options) {
      this.id = options.id
      this.getsingleRp()
    }

    //日月
    this.$store.state.course.forEach(item => {
      this.attrdate[item.attrId] = item.attrName
    })
    //用药途径枚举
    this.$store.state.channel.forEach(item => {
      this.allchannel[item.id] = item.name
    })

    //用药频次枚举
    this.$store.state.frequency.forEach(item => {
      this.allfrequency[item.id] = item.name
    })
  },
  methods: {
    seeRelation(id) {
      this.id = id
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
      this.getsingleRp()
    },
    // 获取详情
    async getsingleRp() {
      this.infoData = await singleRp({
        rpId: this.id,
      })
      this.prescriptionNumber = [this.infoData.id]
      this.deptId = this.infoData.deptId
      console.log(this.infoData, '数据全部')
      //分别计算中西药总价 及总价格
      this.infoData.rpDrugList.forEach(item => {
        this.infoData.westPrice = +this.infoData.westPrice
        this.infoData.chPatentPrice = +this.infoData.chPatentPrice
        item.drugTypeCode === 'WESTERN_MEDICINE'
          ? (this.infoData.westPrice += +item.totalPrice)
          : (this.infoData.chPatentPrice += +item.totalPrice)

        ////总量单位枚举
        if (item.split) {
          item.alltotalUnit = {
            [item.regularUnit]: item.regularUnitText,
            [item.basicUnit]: item.basicUnitText,
          }
        } else {
          item.alltotalUnit = { [item.regularUnit]: item.regularUnitText }
        }
      })
    },
    switchStatus(status) {
      let str = ''
      switch (status) {
        case 'DRAFT':
          str = '草稿'
          break
        case 'PENDING_REVIEW':
          str = '待审核'
          break
        case 'REJECTED':
          str = '已驳回'
          break
        case 'PASSED':
          str = '已通过'
          break
      }
      return str
    },
    swithMedicare(medicare) {
      var str = '医保：'
      switch (medicare) {
        case 'A':
          str += '甲类'
          break
        case 'B':
          str += '乙类'
          break
        case 'C':
          str += '丙类'
          break
      }
      return str
    },
    cope(val) {
      //#ifndef H5
      uni.setClipboardData({
        data: val,
        success: function() {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
      //#endif
      //#ifdef H5
      this.$copyText(val).then(res => {
        uni.showToast({
          title: '复制成功',
          icon: 'none',
        })
      })
      //#endif
    },
    //复制关联处方号
    copyOther(val) {
      console.log(val)
      uni.setClipboardData({
        data: val,
        success: function() {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
    },
    withdraw() {
      withdrawRp({
        id: this.id,
      }).then(data => {
        uni.showToast({
          title: '已经成功撤回！',
          icon: 'none',
        })
        uni.navigateBack({
          delta: 1,
        })
      })
    },
    async copy() {
      //准备新增处方的参数
      let p = {
        memberId: this.infoData.memberId,
        memberName: this.infoData.memberName,
        memberSex: this.infoData.memberSex,
        treatmentTime: this.infoData.treatmentTime,
        serviceType: this.infoData.serviceType,
        serviceMode: this.infoData.serviceMode,
        titleId: this.infoData.titleId,
        orderId: this.infoData.orderId,
        userId: this.infoData.userId,
      }
      //新增处方 保存新处方的id
      this.newCode = await saveRp(p)
      //新增处方后将原来的药品赋给新处方
      //清空id
      this.infoData.rpDrugList.forEach(item => {
        delete item.id
      })
      let resp = await addAndEdit({
        id: this.newCode,
        rpDrugList: this.infoData.rpDrugList,
      })
      if (resp) {
        uni.showToast({
          title: '复制成功！',
          icon: 'none',
          duration: 1500,
        })

        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          })
        }, 500)
      }
    },
    del() {
      //提示
      uni.showModal({
        title: '系统提示',
        content: '是否确认操作?',
        cancelText: '否',
        confirmText: '是',
        confirmColor: '#0AB2C1',
        cancelColor: '#666666',
        success: res => {
          if (res.confirm) {
            delRp({
              id: this.id,
            }).then(data => {
              uni.showToast({
                title: '删除成功！',
                icon: 'none',
              })
              uni.navigateBack({
                delta: 1,
              })
            })
          } else if (res.cancel) {
          }
        },
      })
    },
    //提交
    async submit(val) {
      console.log(val)
      if (val.rpDrugList.length < 1) {
        uni.showToast({
          title: '空处方不可提交',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      let res = await submitRp({ submit: [val] })
      uni.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 1500,
      })
      this.getsingleRp()
    },
    //修改药品
    editrp(val) {
      console.log('修改药品', val)
      console.log(this.infoData)
      this.isShowSetModel = true
      let data = {
        prescriptionId: this.infoData.id,
        drugMsg: val,
      }
      this.edittorFormDatas = data
      this.editId = val.id
    },
    //删除药品
    delrp(val) {
      let _this = this
      uni.showModal({
        title: '提示',
        content: '是否删除此药品',
        async success(res) {
          if (res.confirm) {
            _this.infoData.rpDrugList.forEach((item, index) => {
              item.id === val.id && _this.infoData.rpDrugList.splice(index, 1)
            })
            let res = await addAndEdit({ ..._this.infoData })
            uni.showToast({
              title: '删除成功',
              icon: 'none',
            })
          }
        },
      })
    },
    async hideSetModel(data) {
      this.isShowSetModel = false
      if (data === '保存') {
        console.log('保存')
        this.params = this.$refs.getPrams.editFormData
        //检查输入内容
        if (
          !(
            this.params.drugMsg.type &&
            this.params.drugMsg.name &&
            this.params.drugMsg.useWays &&
            this.params.drugMsg.singleDose &&
            this.params.drugMsg.total &&
            this.params.drugMsg.receivePharmacy &&
            this.params.drugMsg.treatment
          )
        ) {
          uni.showToast({
            title: '请检查输入内容合理性',
            icon: 'none',
            duration: 1500,
          })
          return
        }
        /*  console.log( this.infoData)
        console.log(this.params) */
        console.log(this.params)
        let lists = JSON.parse(JSON.stringify(this.infoData))
        lists.rpDrugList.forEach((item, index) => {
          item.id === this.editId &&
            (lists.rpDrugList[index] = this.params.drugMsg)
        })
        console.log(lists)
        //保存编辑后的药品
        let res = await addAndEdit({ ...lists })
        uni.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 1500,
        })
        this.getsingleRp()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.orderTop {
  .stateIcon {
    font-size: 50rpx;
    color: #fff;
  }
}

.chfBtn {
  background: #f2f2f2;
  height: 60rpx;
  border-radius: 30px;
  line-height: 60rpx;
  font-size: 24rpx;
  color: #333;
  padding: 0 30rpx;
  border: 0;
  display: inline-block;
  cursor: pointer;
  margin-left: 20rpx;
}
.otherCope {
  margin-right: 5px;
}
.cloum {
  display: flex;
  justify-content: space-between;
}
.btn-box {
  color: #169bd5;
  text {
    margin-left: 10px;
  }
}
/* 模态框 */
.contentModel {
  height: 500px;
}
</style>
