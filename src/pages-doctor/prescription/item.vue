<template>
  <view class="item-page">
    <!-- 基本信息 -->
    <view class="top-msg">
      <!-- 1 -->
      <view>
        <view class="code">
          <text>处方号：</text>
          <text>{{ itemData.id }}</text>
          <text
            :class="{
              draet: status.DRAFT == status[itemData.status],
              pass: status.PASSED == status[itemData.status],
              reject: status.REJECTED == status[itemData.status],
              pending: status.PENDING_REVIEW == status[itemData.status],
            }"
            >{{ status[itemData.status] }}</text
          >
        </view>
        <view class="btn-box" v-if="itemData.status !== 'DRAFT'">
          <text class="single-submit" @click="openPdf(itemData)"
            >处方签</text
          ></view
        >
        <view class="btn-box" v-if="itemData.status !== 'PASSED'">
          <!-- <view class="btn-box"> -->
          <text
            @click="isNext(autMap[itemData.status])"
            class="button"
            :class="{
              draet: autMap.DRAFT == autMap[itemData.status],
              pass: autMap.PASSED == autMap[itemData.status],
              reject: autMap.REJECTED == autMap[itemData.status],
              pending: autMap.PENDING_REVIEW == autMap[itemData.status],
            }"
            >{{ autMap[itemData.status] }}</text
          >
          <text
            v-if="status.DRAFT == status[itemData.status]"
            @click="singleSubmit"
            class="single-submit"
            >提交</text
          >
        </view>
      </view>
      <!-- 驳回原因 -->
      <view class="reason" v-if="status.REJECTED == status[itemData.status]">
        驳回原因：{{ itemData.reason }}
      </view>

      <!-- 2 -->
      <view>
        <view>
          <text class="num"
            >数量：{{
              itemData.rpDrugList.length ? itemData.rpDrugList.length : 0
            }}</text
          >
        </view>
        <view class="num-doctor">
          <text
            >医生：{{ orderInfo.doctorName + ' ' + orderInfo.titleName }}</text
          >
        </view>
        <view>
          <text class="time">{{ itemData.createTime }}</text>
        </view>
      </view>

      <!-- 3 -->
      <view>
        <view class="price">
          <text>西药：￥{{ itemData.westPrice }}</text>
          <text>中药：￥{{ itemData.chPatentPrice }}</text>
        </view>
        <view>
          <text class="total"
            >合计：￥{{
              itemData.prescriptionPrice ||
                Number(itemData.westPrice) + Number(itemData.chPatentPrice)
            }}</text
          >
        </view>
      </view>

      <!-- 4 -->
      <view class="group">
        <view class="pharmacy-name"
          >接收方：{{ itemData.rpDrugList[0].receivePharmacy || '' }}</view
        >
        <view v-if="itemData.rpDrugList.length > 1 && !isShowSelect">
          <button
            @click="delGrop(itemData.id)"
            v-if="isDelGroup"
            class="cancel"
          >
            取消成组
          </button>
          <button
            @click="setGrop(itemData.id)"
            v-if="isShowGroup"
            class="confirm"
          >
            成组
          </button>
        </view>
      </view>

      <!-- 5 -->
      <view
        class="trial-result"
        v-if="
          status.PASSED == status[itemData.status] ||
            status.REJECTED == status[itemData.status]
        "
      >
        <view>审方医生：{{ auditUserName || '无' }}</view>
        <view class="time">审方时间：{{ itemData.auditTime || '' }}</view>
      </view>
    </view>
    <!-- 药品列表 -->
    <view class="drugs-lists" :class="{ isHide: !isOpen }">
      <checkbox-group @change="checkChange">
        <view class="list" v-for="val in itemData.rpDrugList" :key="val.id">
          <!-- 1 -->
          <view>
            <text class="text-color">{{
              `${val.name}(规格：${val.spec})`
            }}</text>
            <view class="right-box">
              <text>医保：{{ Medicares[val.medicare] }}</text>
            </view>
          </view>
          <!-- 2 -->
          <!-- <view>
            <text class="num-day">{{
              `${allchannel[val.useWays]} ${allfrequency[val.useFrequency]} ${
                val.singleDose
              }${val.basicUnitText}/次 &nbsp; ${val.treatment}${attrdate[
                val.treatmentUnit
              ] || val.treatmentUnit}`
            }}</text>
            <text class="price-num">{{
              `￥${val.price}/${val.alltotalUnit[val.totalUnit]} x ${
                val.total
              } `
            }}</text>
            <text class="row-total">{{ `￥${val.totalPrice}` }}</text>
          </view> -->
          <view>
            <text class="num-day">{{
              `${val.useWays} ${allfrequency[val.useFrequency]} ${
                val.singleDose
              }${val.dosageUnitText}/次 &nbsp; ${val.treatment}${
                val.treatmentUnit
              }`
            }}</text>
            <text class="price-num">{{
              `￥${Number(val.price * val.regularPackVolume).toFixed(2)}/${
                val.totalUnit
              } x ${val.total} `
            }}</text>
            <text class="row-total">{{ `￥${val.totalPrice}` }}</text>
          </view>
          <view class="line"></view>
          <!-- 3 -->
          <view>
            <text>备注：{{ val.remark || '无' }}</text>
          </view>
          <!-- 4 -->
          <view v-if="itemData.status == 'DRAFT' || isShowSelect">
            <view>
              <checkbox
                :checked="val.checked"
                :disabled="val.isGetClass"
                :value="val.id"
                color="#08B4C8"
                style="transform:scale(0.7)"
              />
            </view>
            <view
              class="btn-box"
              v-if="status.DRAFT == status[itemData.status]"
            >
              <text @click="delDrug(val)">删除</text>
              <text @click="changeDrug(val)">修改</text>
            </view>
          </view>

          <!-- 成组标记 -->
          <view :class="{ flaoticon: val.isGetClass }"></view>
        </view>
      </checkbox-group>
    </view>
    <!-- 展开折叠 -->
    <view
      v-show="itemData.rpDrugList.length > 1"
      class="botton-icon"
      @click="OpenTo"
      >{{ isOpen ? '收起' : '更多' }}
      <image
        :src="require('@/assets/zhankaihui@2x.png')"
        :class="{ openClass: isOpen }"
      ></image>
    </view>
  </view>
</template>

<script>
import { downloadRxToUrl } from '@/common/request/user'
import { host } from '@/urls.js'
import { addAndEdit } from '@/common/request/prescriptionList.js'
export default {
  props: ['itemData', 'orderInfo', 'aaaaa', 'isShowSelect', 'isSelectCheckBox'],
  data() {
    return {
      isOpen: true,
      prescriptionData: {},
      //处方状态枚举值
      status: {
        DRAFT: '草稿',
        PASSED: '已通过',
        REJECTED: '已驳回',
        PENDING_REVIEW: '待审核',
      },
      autMap: {
        DRAFT: '删除',
        PASSED: '',
        REJECTED: '复制',
        PENDING_REVIEW: '撤回',
      },
      //医保
      Medicares: {
        A: '甲',
        B: '乙',
        C: '丙',
        ME_FEE: '自费',
      },
      //处方选中的选项的药品id
      checkedList: [],
      //选中项的groupid
      checkedListGroupId: [],
      //处方选中项
      rpCheckData: [],
      //成组和取消成组显示
      isShowGroup: false,
      isDelGroup: false,
      attrdate: {},
      allchannel: {},
      allfrequency: {},
    }
  },

  created() {
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
      this.allfrequency[item.code] = item.name
    })
  },
  mounted() {},
  methods: {
    async openPdf(item) {
      const res = await downloadRxToUrl({ rxId: item.id })
      //打开处方签
      wx.downloadFile({
        // 示例 url，并非真实存在
        url: `${host}${res.group}/${res.path}`,
        success: function(re) {
          const filePath = re.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function(re) {
              console.log('打开文档成功')
            },
          })
        },
      })
      // uni.navigateTo({
      //   url:
      //     '/pages/web-view/web-view?title=处方签&src=' +
      //     encodeURIComponent(
      //       'https://miapp.chuntaoyisheng.com/gfms/' + res.path,
      //     ),
      // })
      // uni.navigateTo({
      //   url:
      //     '/pages/web-view/web-view?title=处方签&src=' +
      //     encodeURIComponent(
      //       'https://miapp.chuntaoyisheng.com/pdf/api/v1/rx/downloadRx?rxId=' +
      //         item.id,
      //     ),
      // })
    },
    OpenTo() {
      this.isOpen = !this.isOpen
    },
    //选中状态改变
    checkChange(e) {
      this.checkedList = e.detail.value
      //判断主groupid是否存在重新筛选选中项
      let groupIdNow = []
      this.itemData.rpDrugList.forEach(item => {
        if (this.checkedList.includes(item.id) && item.groupId !== '') {
          groupIdNow.push(item.groupId)
        }
      })
      this.itemData.rpDrugList.forEach(item => {
        if (groupIdNow.includes(item.groupId)) {
          this.checkedList.push(item.id)
        }
      })
      this.checkedList = [...new Set(this.checkedList)]
      //判断选中的项控制成组和取消成组显示
      if (this.checkedList.length < 1) {
        this.isShowGroup = false
        this.isDelGroup = false
      } else {
        //找到选中项
        let checkeds = this.itemData.rpDrugList.filter(item => {
          return this.checkedList.includes(item.id)
        })
        let status = checkeds.every(item => {
          return item.groupId && item.groupId === checkeds[0].groupId
        })
        if (status) {
          this.isShowGroup = false
          this.isDelGroup = true
        } else {
          this.isShowGroup = true
          this.isDelGroup = false
        }
      }

      this.$emit('updataData')
    },
    //点击删除、撤回、...处方
    isNext(val) {
      let _this = this
      if (val === '删除') {
        uni.showModal({
          title: '提示',
          content: '是否删除',
          success: function(res) {
            if (res.confirm) {
              _this.$emit('delprescription', _this.itemData.id)
            }
          },
        })
      }
      if (val === '撤回') {
        uni.showModal({
          title: '提示',
          content: '是否撤回待审核的处方',
          success: function(res) {
            if (res.confirm) {
              _this.$emit('withdraw', _this.itemData.id)
            }
          },
        })
      }
      if (val === '复制') {
        uni.showModal({
          title: '提示',
          content: '是否复制为新的处方',
          success: function(res) {
            if (res.confirm) {
              _this.$emit('copyPrescription', _this.itemData)
            }
          },
        })
      }
    },
    //单独提交
    singleSubmit() {
      let _this = this
      if (this.itemData.rpDrugList.length < 1) {
        uni.showToast({
          title: '空处方不可提交',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      uni.showModal({
        title: '提示',
        content: '是否提交审核当前处方？',
        success(res) {
          if (res.confirm) {
            _this.$emit('singleSubmit', _this.itemData)
          }
        },
      })
    },
    //删除药品
    delDrug(val) {
      let _this = this
      uni.showModal({
        title: '提示',
        content: '是否删除此药品',
        success: function(res) {
          if (res.confirm) {
            let data = {
              drugId: val.id,
              prescriptionId: _this.itemData.id,
            }
            _this.$emit('delDrug', data)
          }
        },
      })
    },
    //调方窗口
    changeDrug(val) {
      let data = {
        prescriptionId: this.itemData.id,
        drugMsg: val,
        type: 'edit',
        drugId: val.id,
      }
      this.$emit('showModel', data)
    },

    //成组
    async setGrop(val) {
      console.log(this.checkedList, '选中的选项')
      //创建随机数
      let rundomNum = this.randomNum(1, 999999999999)
      //给选中项添加groupId
      if (this.checkedList.length < 2) {
        uni.showToast({
          title: '请选择大于1项的数据',
          icon: 'none',
          duration: 1500,
        })
      } else {
        //添加成组标识并重排

        let arr1 = []
        let arr2 = []
        this.itemData.rpDrugList.forEach(item => {
          if (this.checkedList.includes(item.id)) {
            item.groupId = rundomNum
            arr1.push(item)
          } else {
            arr2.push(item)
          }
        })
        this.itemData.rpDrugList = arr1.concat(arr2)

        let res = await addAndEdit({
          id: val,
          rpDrugList: this.itemData.rpDrugList,
        })
        if (res) {
          uni.showToast({
            title: '成组成功',
            icon: 'none',
            duration: 1500,
          })
          this.$emit('againGetData', val)
          this.isShowGroup = false
          this.isDelGroup = false
        }
      }
    },
    //取消成组
    delGrop(val) {
      let _this = this
      console.log('选中项', this.checkedList)
      if (this.checkedList.length < 1) {
        uni.showToast({
          title: '请选择需要取消成组的药品',
          icon: 'none',
          duration: 1500,
        })
      } else {
        uni.showModal({
          title: '提示',
          content: '是否取消当前选中项的成组？',
          async success(res) {
            if (res.confirm) {
              //筛选出选中项的groupid
              for (let val of _this.itemData.rpDrugList) {
                for (let item of _this.checkedList) {
                  if (val.id === item) {
                    _this.checkedListGroupId.push(val.groupId)
                  }
                }
              }
              _this.itemData.rpDrugList.forEach(item => {
                if (_this.checkedListGroupId.includes(item.groupId)) {
                  item.groupId = ''
                }
              })
              let res = await addAndEdit({
                id: val,
                rpDrugList: _this.itemData.rpDrugList,
              })
              if (res) {
                _this.checkedListGroupId = []
                _this.$emit('againGetData', val)
                _this.isShowGroup = false
                _this.isDelGroup = false
              }
            }
          },
        })
      }
    },
    //随机数函数
    randomNum(min, max) {
      return parseInt(Math.random() * (max - min + 1)) + min
    },
  },
}
</script>

<style lang="scss" scoped>
.item-page {
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  /* 头部信息 */
  .top-msg {
    > view {
      display: flex;
      justify-content: space-between;
      line-height: 20px;
      font-size: 12px;
      .code {
        color: #666;
        .draet {
          color: #c57578;
          font-size: 10px;
          padding: 2px;
        }
        .pass {
          color: #4dcb5a;
          font-size: 10px;
          padding: 2px;
        }
        .reject {
          color: #c57578;
          font-size: 10px;
          padding: 2px;
        }
        .pending {
          color: #2bbfc8;
          font-size: 10px;
          padding: 2px;
        }
      }
      .btn-box {
        display: flex;
        justify-content: space-between;
        .button {
          width: 50px;
          height: 20px;
          color: red;
          border: 1px solid red;
          font-size: 12px;
          background: #fff;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .draet {
          color: #c57578;
          border: 1px solid #c57578;
        }
        .pass {
          color: #4dcb5a;
          border: 1px solid #4dcb5a;
        }
        .reject {
          color: #c57578;
          border: 1px solid #c57578;
        }
        .pending {
          color: #2bbfc8;
          border: 1px solid #2bbfc8;
        }
        //单独提交按钮
        .single-submit {
          width: 50px;
          height: 20px;
          border-radius: 10px;
          font-size: 12px;
          border: 1px solid #0ab2c0;
          color: #0ab2c0;
          margin-left: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .num-doctor {
        color: #666;
      }
      .num {
        margin-right: 20px;
      }
      .time {
        font-size: 10px;
        color: #666;
      }
      .price {
        text:first-child {
          margin-right: 20px;
        }
      }
      .total {
        color: red;
      }
    }

    .group {
      display: flex;
      > view {
        display: flex;
        .pharmacy-name {
          font-size: 12px;
        }
      }
      button {
        height: 24px;
        font-size: 12px;
        background: #fff;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
      }
      button.cancel {
        border: 1px solid #0ab2c0;
        color: #0ab2c0;
      }
      button.confirm {
        border: 1px solid #0ab2c0;
        color: #0ab2c0;
      }
    }
    .trial-result {
      margin-bottom: 5px;
      font-size: 12px;
      .tiem {
        color: #666;
        font-size: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .reason {
      font-size: 12px;
      color: red;
      margin: 5px 0;
    }
  }
  /* 药品列表 */
  .drugs-lists {
    margin-top: 5px;
    .list {
      background-color: rgba(22, 155, 213, 0.1);
      padding: 5px 0;
      border-radius: 5px;
      margin-bottom: 5px;
      position: relative;
      > view {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding: 0 10px;
        .text-color {
          color: #666;
        }

        .right-box {
          display: flex;
          justify-content: space-between;
        }
        .num-day {
          color: red;
        }
        .price-num {
          margin: 0 5px;
          color: #999;
        }
        .row-total {
          color: #999;
        }
      }

      .line {
        width: 100%;
        height: 1px;
        background: #fff;
        margin: 5px 0;
      }

      .btn-box {
        color: #169bd5;
        text {
          margin-left: 10px;
        }
      }

      /* 成组标记 */
      .flaoticon {
        position: absolute;
        top: 56px;
        left: -5px;
        width: 5px;
        padding: 0;
        height: 116px;
        border: 1px solid #2bbfc8;
        border-right: none;
      }
    }
  }
  .isHide {
    height: 88px;
    overflow: hidden;
  }
  .botton-icon {
    text-align: center;
    color: #666;
    margin-top: 5px;
    image {
      width: 12px;
      height: 8px;
      padding: 4px;
      margin-top: 6px;
    }
  }
  .openClass {
    transform: rotate(180deg);
  }
}
</style>
