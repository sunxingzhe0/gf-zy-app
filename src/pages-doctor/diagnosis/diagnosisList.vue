<template>
  <view
    class="clinic-diagnosisList"
    :style="ispop ? 'padding-left:0;padding-right:0' : ''"
  >
    <scroll-view
      class="departments"
      v-if="ispop"
      scroll-y
      style="height:70vh;background-color: #f2f2f2;"
    >
      <view style="margin:0 20rpx;">
        <app-card
          styles="padding: 0;"
          class="listWrap"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <view class="listItem">
            <app-list-item
              :label="`诊断${index + 1}`"
              :styles="{ paddingLeft: 0 }"
              textStyle="font-size:30rpx;color:#333"
            >
              <view class="list_right">
                设为主诊断
                <switch
                  :disabled="item.mainDiagnosis == 1 ? true : false"
                  :checked="item.mainDiagnosis == 1 ? true : false"
                  @change="changeMainDiagnosis($event, item, index)"
                  color="#0AB2C1"
                />
              </view>
            </app-list-item>
            <app-list-item
              label="类别"
              :styles="{
                paddingLeft: 0,
                paddingBottom: item.typeOpen ? 0 : '',
              }"
              textStyle="font-size:26rpx;color:#333"
            >
              <view class="list_right" @click="typeTop(item)">
                {{ getTypeName(item.diagnosisType) }}
                <uni-icons
                  :type="item.typeOpen ? 'arrowdown' : 'arrowright'"
                  size="14"
                  style="margin-left: 20rpx;"
                  color="#666"
                ></uni-icons>
              </view>
            </app-list-item>
            <view class="types" v-if="item.typeOpen">
              <view
                :class="
                  item.diagnosisType == type.value
                    ? 'typesItem on'
                    : 'typesItem'
                "
                v-for="type in types"
                @click="changeType(item, type.value)"
                :key="type.value"
                >{{ type.label }}</view
              >
            </view>
            <app-list-item
              label="诊断/病名"
              :styles="{
                height: auto,
                alignItems: 'flex-start',
                padding: '20rpx 20rpx 10rpx 0rpx',
              }"
              textStyle="font-size:26rpx;color:#333;line-height: 80rpx;"
            >
              <view class="list_right" style="text-align: left;">
                <view class="inputText">
                  <input
                    class="uni-input"
                    v-model="item.prefixName"
                    placeholder="前缀"
                  />
                </view>
                <view class="inputText" @click="selectDiaName(index + 1)">
                  <input
                    class="uni-input"
                    v-model="item.diagnosisName"
                    disabled
                    placeholder="请输入"
                  />
                </view>
                <view class="inputText" style="border: 0;">
                  <input
                    class="uni-input"
                    v-model="item.suffixName"
                    placeholder="后缀"
                  />
                </view>
              </view>
            </app-list-item>
            <view class="listBtn flex-justify-end">
              <view class="del" @click="del(index)">删除</view>
              <view @click="addChild(item, index)">新增子诊断</view>
              <view
                v-if="
                  index + 1 < tableData.length && index + 1 != tableData.length
                "
                @click="changeSort('down', index)"
                >下移</view
              >
              <view
                v-if="index < tableData.length && index != 0"
                @click="changeSort('up', index)"
                >上移</view
              >
              <picker
                class="item-picker"
                mode="multiSelector"
                range-key="name"
                @change="classifyChange($event, index)"
                @columnchange="columnchange"
                :value="classifyIndex"
                :range="classifyArr"
              >
                <view
                  v-if="
                    tableData.length > 1 &&
                      item.mainDiagnosis != 1 &&
                      item.childDtos.length == 0
                  "
                  >移动至</view
                >
              </picker>
            </view>
          </view>
          <view class="listItem" v-for="(child, d) in item.childDtos" :key="d">
            <app-list-item
              :label="`诊断${index + 1}-${d + 1}`"
              :styles="{ paddingLeft: 0 }"
              textStyle="font-size:30rpx;color:#333"
            >
              <view class="list_right">
                设为主诊断
                <switch
                  :disabled="child.mainDiagnosis == 1 ? true : false"
                  :checked="child.mainDiagnosis == 1 ? true : false"
                  @change="changeMainDiagnosis($event, child, index, d)"
                  color="#0AB2C1"
                />
              </view>
            </app-list-item>
            <app-list-item
              label="诊断/病名"
              :styles="{
                height: auto,
                alignItems: 'flex-start',
                padding: '20rpx 20rpx 10rpx 0rpx',
              }"
              textStyle="font-size:26rpx;color:#333;line-height: 80rpx;"
            >
              <view class="list_right" style="text-align: left;">
                <view class="inputText">
                  <input
                    class="uni-input"
                    v-model="child.prefixName"
                    placeholder="前缀"
                  />
                </view>
                <view
                  class="inputText"
                  @click="selectDiaName(index + 1, d + 1)"
                >
                  <input
                    class="uni-input"
                    v-model="child.diagnosisName"
                    disabled
                    placeholder="请输入"
                  />
                </view>
                <view class="inputText" style="border: 0;">
                  <input
                    class="uni-input"
                    v-model="child.suffixName"
                    placeholder="后缀"
                  />
                </view>
              </view>
            </app-list-item>
            <view class="listBtn flex-justify-end">
              <view class="del" @click="del(index, d + 1)">删除</view>
              <view @click="uplevel(child, d, index)">独立为诊断</view>
              <view
                v-if="
                  d + 1 < item.childDtos.length &&
                    d + 1 != item.childDtos.length
                "
                @click="changeSort('down', index, d)"
                >下移</view
              >
              <view
                v-if="d < item.childDtos.length && d != 0"
                @click="changeSort('up', index, d)"
                >上移</view
              >
            </view>
          </view>
        </app-card>
      </view>
    </scroll-view>
    <app-card
      v-else
      styles="padding: 0;"
      class="listWrap"
      v-for="(item, index) in tableData"
      :key="index"
    >
      <view class="listItem">
        <app-list-item
          :label="`诊断${index + 1}`"
          :styles="{ paddingLeft: 0 }"
          textStyle="font-size:30rpx;color:#333"
        >
          <view class="list_right">
            设为主诊断
            <switch
              :disabled="item.mainDiagnosis == 1 ? true : false"
              :checked="item.mainDiagnosis == 1 ? true : false"
              @change="changeMainDiagnosis($event, item, index)"
              color="#0AB2C1"
            />
          </view>
        </app-list-item>
        <app-list-item
          label="类别"
          :styles="{ paddingLeft: 0, paddingBottom: item.typeOpen ? 0 : '' }"
          textStyle="font-size:26rpx;color:#333"
        >
          <view class="list_right" @click="typeTop(item)">
            {{ getTypeName(item.diagnosisType) }}
            <uni-icons
              :type="item.typeOpen ? 'arrowdown' : 'arrowright'"
              size="14"
              style="margin-left: 20rpx;"
              color="#666"
            ></uni-icons>
          </view>
        </app-list-item>
        <view class="types" v-if="item.typeOpen">
          <view
            :class="
              item.diagnosisType == type.value ? 'typesItem on' : 'typesItem'
            "
            v-for="type in types"
            @click="changeType(item, type.value)"
            :key="type.value"
            >{{ type.label }}</view
          >
        </view>
        <app-list-item
          label="诊断/病名"
          :styles="{
            height: auto,
            alignItems: 'flex-start',
            padding: '20rpx 20rpx 10rpx 0rpx',
          }"
          textStyle="font-size:26rpx;color:#333;line-height: 80rpx;"
        >
          <view class="list_right" style="text-align: left;">
            <view class="inputText">
              <input
                class="uni-input"
                v-model="item.prefixName"
                placeholder="前缀"
              />
            </view>
            <view class="inputText" @click="selectDiaName(index + 1)">
              <input
                class="uni-input"
                v-model="item.diagnosisName"
                disabled
                placeholder="请输入"
              />
            </view>
            <view class="inputText" style="border: 0;">
              <input
                class="uni-input"
                v-model="item.suffixName"
                placeholder="后缀"
              />
            </view>
          </view>
        </app-list-item>
        <view class="listBtn flex-justify-end">
          <view class="del" @click="del(index)">删除</view>
          <view @click="addChild(item, index)">新增子诊断</view>
          <view
            v-if="index + 1 < tableData.length && index + 1 != tableData.length"
            @click="changeSort('down', index)"
            >下移</view
          >
          <view
            v-if="index < tableData.length && index != 0"
            @click="changeSort('up', index)"
            >上移</view
          >
          <picker
            class="item-picker"
            mode="multiSelector"
            range-key="name"
            @change="classifyChange($event, index)"
            @columnchange="columnchange"
            :value="classifyIndex"
            :range="classifyArr"
          >
            <view
              v-if="
                tableData.length > 1 &&
                  item.mainDiagnosis != 1 &&
                  item.childDtos.length == 0
              "
              >移动至</view
            >
          </picker>
        </view>
      </view>
      <view class="listItem" v-for="(child, d) in item.childDtos" :key="d">
        <app-list-item
          :label="`诊断${index + 1}-${d + 1}`"
          :styles="{ paddingLeft: 0 }"
          textStyle="font-size:30rpx;color:#333"
        >
          <view class="list_right">
            设为主诊断
            <switch
              :disabled="child.mainDiagnosis == 1 ? true : false"
              :checked="child.mainDiagnosis == 1 ? true : false"
              @change="changeMainDiagnosis($event, child, index, d)"
              color="#0AB2C1"
            />
          </view>
        </app-list-item>
        <app-list-item
          label="诊断/病名"
          :styles="{
            height: auto,
            alignItems: 'flex-start',
            padding: '20rpx 20rpx 10rpx 0rpx',
          }"
          textStyle="font-size:26rpx;color:#333;line-height: 80rpx;"
        >
          <view class="list_right" style="text-align: left;">
            <view class="inputText">
              <input
                class="uni-input"
                v-model="child.prefixName"
                placeholder="前缀"
              />
            </view>
            <view class="inputText" @click="selectDiaName(index + 1, d + 1)">
              <input
                class="uni-input"
                v-model="child.diagnosisName"
                disabled
                placeholder="请输入"
              />
            </view>
            <view class="inputText" style="border: 0;">
              <input
                class="uni-input"
                v-model="child.suffixName"
                placeholder="后缀"
              />
            </view>
          </view>
        </app-list-item>
        <view class="listBtn flex-justify-end">
          <view class="del" @click="del(index, d + 1)">删除</view>
          <view @click="uplevel(child, d, index)">独立为诊断</view>
          <view
            v-if="
              d + 1 < item.childDtos.length && d + 1 != item.childDtos.length
            "
            @click="changeSort('down', index, d)"
            >下移</view
          >
          <view
            v-if="d < item.childDtos.length && d != 0"
            @click="changeSort('up', index, d)"
            >上移</view
          >
        </view>
      </view>
    </app-card>
    <view class="bottomBtn">
      <view class="flex-between types">
        <view class="typesItem" @click="handleImport">常用模板</view>
        <view class="typesItem" @click="historyImport">历史模板</view>
        <view class="typesItem" @click="cancel">取消</view>
        <view class="typesItem on" @click="save">保存</view>
        <view class="typesItem on" @click="submit" v-if="!orderIdP">提交</view>
      </view>
      <view @click="add" class="addBtn">新增诊断</view>
    </view>

    <selectPopup ref="keyword" @change="onInspectNameChange" />

    <historyTem
      ref="historyTem"
      type="1"
      @submit="historyImportSubmit"
      :memberId="memberId"
      title="历史诊断模板"
    ></historyTem>
    <historyTem
      ref="commonTem"
      type="2"
      @submit="historyImportSubmit"
      :memberId="memberId"
      title="常用诊断模板"
    ></historyTem>
    <!--选择移动至-->
    <uni-popup type="bottom" ref="select">
      <view class="select_wrap">
        <view class="select_title">移动诊断</view>
        <view class="select_content">
          <picker-view :value="value" @change="bindChange">
            <picker-view-column>
              <view class="item" v-for="(item, index) in tableData" :key="index"
                >诊断{{ index + 1 }}</view
              >
            </picker-view-column>
            <picker-view-column>
              <view class="item" v-for="(item, index) in 6" :key="index">{{
                index
              }}</view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import selectPopup from './components/selectPopup.vue'
import historyTem from './components/historyTem.vue'
import {
  saveTemporaryDiag,
  submitDiagnosis,
  findDiagnosisInClinic,
} from '@/common/request/doctorRoom.js'
import { getVideoStatus, sessionUserSpeak } from '@/common/request/chat.js'
export default {
  components: {
    AppCard,
    AppListItem,
    selectPopup,
    historyTem,
  },
  props: {
    orderIdP: {
      type: String,
      default: '',
    },
    memberIdP: {
      type: String,
      default: '',
    },
    ispop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      orderId: '',
      memberId: '',
      sessionId: '',
      userId: '',
      wayType: '',
      types: [
        {
          label: '西医',
          value: 'WEST_MEDICINE',
        },
        /* 调试修改001 */
        // {
        //   label: '中医证型',
        //   value: 'CH_MEDICINE_CARD',
        // },
        // {
        //   label: '中医病名',
        //   value: 'CH_MEDICINE_NAME',
        // },
      ],
      selectValue: '',
      tableData: [],
      mainDiagnosis: 0,
      loading: false,
      options: [],
      hasSubmit: false,
      selectIndex: [],
      moveList: [],
      classifyArr: [[], []], // picker - 数据源
      classifyIndex: [0, 0], // picker - 索引

      childArr: [], // 二级分类数据源
    }
  },
  onLoad(option) {
    if (option) {
      this.orderId = option.orderId
      this.memberId = option.memberId
      this.sessionId = option.sessionId
      this.wayType = option.wayType
      this.userId = option.userId
      this.loadDiagnosis()
    }
  },
  methods: {
    // 获取数据源并分出一级二级
    getAllClassify() {
      this.classifyArr = [[], []]
      this.classifyIndex = [0, 0] // picker - 索引
      this.childArr = [] // 二级分类数据源
      let dataLen = this.tableData.length

      for (let i = 0; i < dataLen; i++) {
        // 将数据源中的二级分类 push 进 childArr，作为二级分类的数据源
        let childList = this.tableData[i].childDtos.map((ite, index) => {
          return Object.assign(ite, {
            name: '诊断' + (i + 1) + '-' + (index + 1),
          })
        })
        childList.push({
          name: '诊断' + (i + 1) + '-' + (childList.length + 1),
        })
        this.childArr.push(childList)
      }
      // 一级分类的数据源
      this.classifyArr[0] = this.tableData.map((item, index) => {
        return Object.assign(item, {
          name: '诊断' + (index + 1),
        })
      })

      // 第一次打开时，默认给一级分类添加它的二级分类
      this.classifyArr[1] = this.childArr[0]
    },

    // 确定移动
    classifyChange(e, index) {
      let value = e.target.value
      if (value[0] == index) {
        uni.showToast({
          title: '不能移动到当前诊断',
          icon: 'none',
        })
      } else {
        this.classifyIndex = value
        this.tableData[value[0]].childDtos.splice(
          value[1],
          0,
          this.tableData[index],
        )
        this.tableData.splice(index, 1)
      }
      this.getAllClassify()
    },

    // 获取二级分类
    columnchange(e) {
      // 当滚动切换一级分类时，为当前的一级分类添加它的子类
      if (e.detail.column == 0) {
        // #ifdef H5
        // 在小程序中直接赋值无效  H5 可直接赋值
        this.classifyArr[1] = this.childArr[e.detail.value]
        // #endif

        // #ifdef MP-WEIXIN
        // 在 H5 环境下 $set 会导致一级分类无法滚动， 小程序正常运行
        this.$set(this.classifyArr, 1, this.childArr[e.detail.value])
        // #endif
      }
    },
    getTypeName(types) {
      if (types == 'WEST_MEDICINE') {
        return '西医'
      } else if (types == 'CH_MEDICINE_CARD') {
        return '中医证型'
      } else if (types == 'CH_MEDICINE_NAME') {
        return '中医病名'
      }
    },
    changeType(item, type) {
      this.$set(item, 'diagnosisType', type)
    },
    typeTop(item) {
      this.$set(item, 'typeOpen', !item.typeOpen)
    },
    selectDiaName(index, child) {
      if (child) {
        this.selectIndex = [index, child]
      } else {
        this.selectIndex = [index]
      }
      this.$refs.keyword.open()
    },
    // 获取indexcode
    getindexcode() {
      let data = this.tableData
        .map(item => {
          for (let i = 0; i < item.childDtos.length; i++) {
            item.childDtos[i].parent = item.indexCode
          }
          return [item, ...item.childDtos]
        })
        .flat()
      return Math.max.apply(
        Math,
        data.map(function(o) {
          return o.indexCode
        }),
      )
    },
    //选择诊断名
    onInspectNameChange(val) {
      if (this.selectIndex.length == 1) {
        this.tableData[this.selectIndex[0] - 1].diagnosisName =
          val.diagnosisName
        this.tableData[this.selectIndex[0] - 1].diagCode = val.diagnosisCode
        this.tableData[this.selectIndex[0] - 1].diagTypeCode = val.diagnosisType
      }
      if (this.selectIndex.length == 2) {
        this.tableData[this.selectIndex[0] - 1].childDtos[
          this.selectIndex[1] - 1
        ].diagnosisName = val.diagnosisName
        this.tableData[this.selectIndex[0] - 1].childDtos[
          this.selectIndex[1] - 1
        ].diagCode = val.diagnosisCode
        this.tableData[this.selectIndex[0] - 1].childDtos[
          this.selectIndex[1] - 1
        ].diagTypeCode = val.diagnosisType
      }
      this.$refs.keyword.close()
    },
    //历史诊断模板
    historyImport() {
      this.$refs.historyTem.open()
    },
    //导入模板
    historyImportSubmit(select) {
      console.log(select)
      this.$refs.historyTem.close()
      this.$refs.commonTem.close()

      let list = []
      select.forEach(item => {
        let data = {
          diagnosisType: item.diagnosisType,
          prefixName: item.prefixName,
          diagnosisName: item.diagnosisName,
          suffixName: item.suffixName,
          diagCode: item.diagCode,
          diagTypeCode: item.diagTypeCode,
          indexCode: this.getindexcode() + 1,
          mainDiagnosis: 0,
          childDtos: [],
        }
        list.push(data)
      })
      this.tableData = [...this.tableData, ...list]
      this.getAllClassify()
    },
    // 常用诊断模板
    handleImport() {
      this.$refs.commonTem.open()
    },
    // 获取诊断列表
    async loadDiagnosis() {
      if (this.orderIdP) {
        this.orderId = this.orderIdP
      }
      if (this.memberIdP) {
        this.memberId = this.memberIdP
      }
      const clinicList = await findDiagnosisInClinic({
        orderId: this.orderId,
      })
      this.tableData = clinicList
      this.mainDiagnosis = 0
      this.tableData.forEach(element => {
        if (element.mainDiagnosis == 1) {
          this.mainDiagnosis = element.indexCode
        }
        //初始化诊断默认信息修改
        if (element.indexCode == null) {
          element.indexCode = 0
        }
        if (element.childDtos == null) {
          element.childDtos = []
        }
      })
      if (this.tableData.length == 0) {
        this.add()
      } else {
        this.hasSubmit = true
      }
      this.getAllClassify()
    },
    add() {
      const data = {
        diagnosisType: this.types[0].value,
        prefixName: '',
        diagnosisName: '',
        diagCode: '',
        diagTypeCode: '',
        suffixName: '',
        indexCode: this.tableData.length == 0 ? 1 : this.getindexcode() + 1,
        mainDiagnosis: this.tableData.length == 0 ? 1 : 0,
        childDtos: [],
      }

      this.tableData.push(data)
      this.getAllClassify()
    },
    //数组元素互换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    //排序更改
    changeSort(type, index, d) {
      let childIndex = d + 1
      console.log(childIndex)
      if (type == 'up') {
        if (d) {
          this.swapArray(
            this.tableData[index].childDtos,
            childIndex - 1 - 1,
            childIndex - 1,
          )
        } else {
          this.swapArray(this.tableData, index - 1, index)
        }
      }
      if (type == 'down') {
        if (childIndex) {
          this.swapArray(
            this.tableData[index].childDtos,
            childIndex - 1,
            childIndex,
          )
        } else {
          this.swapArray(this.tableData, index, index + 1)
        }
      }
      this.getAllClassify()
    },
    //修改主诊断判断
    changeMainDiagnosis(e, scoped, index, d) {
      console.log(scoped)
      if (e.detail.value) {
        this.tableData.forEach(item => {
          this.$set(item, 'mainDiagnosis', 0)
          item.childDtos.forEach(s => {
            this.$set(s, 'mainDiagnosis', 0)
          })
        })
        if (!scoped.diagnosisType) {
          this.uplevel(scoped, d, index)
          this.$set(this.tableData[index + 1], 'mainDiagnosis', 1)
        } else {
          this.$set(scoped, 'mainDiagnosis', 1)
        }
      }
      this.getAllClassify()
    },
    //子诊断升级
    uplevel(scoped, d, index) {
      console.log(scoped, index)
      let item = Object.assign(scoped, {
        diagnosisType: this.types[0].value,
        childDtos: [],
        parent: false,
        mainDiagnosis: 0,
      })
      this.tableData[index].childDtos.splice(d, 1)
      this.tableData.splice(index + 1, 0, item)
      this.getAllClassify()
    },
    //新增子诊断
    addChild(row, $index) {
      console.log(row)
      const childDtos = {
        parent: row.indexCode,
        indexCode: this.getindexcode() + 1,
        prefixName: '',
        diagnosisName: '',
        suffixName: '',
        diagCode: '',
        diagTypeCode: '',
      }
      this.tableData[$index].childDtos = [
        ...this.tableData[$index].childDtos,
        childDtos,
      ]
      this.getAllClassify()
    },
    confirm() {
      const params = {
        orderId: this.orderId,
        memberId: this.memberId,
      }
      const data = this.tableData
      return {
        params,
        data,
      }
    },
    //取消
    cancel() {
      if (this.orderIdP) {
        this.$emit('close')
      } else {
        uni.navigateBack({
          delta: 1,
        })
      }
    },
    //保存
    async save() {
      const { params, data } = this.confirm()
      if (!data.some(item => item.diagnosisName)) {
        uni.showToast({
          title: '请填写至少一条诊断',
          icon: 'none',
        })
        return
      }
      if (this.hasSubmit) {
        uni.showModal({
          title: '提示',
          content: '该诊断将会覆盖已被应用的病历、处方，是否确认操作?',
          success: async res => {
            if (res.confirm) {
              await saveTemporaryDiag(data, params)
              uni.showToast({
                title: '已保存诊断内容',
              })
              if (this.orderIdP) {
                this.$emit('close', true)
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      } else {
        await saveTemporaryDiag(data, params)
        uni.showToast({
          title: '已保存诊断内容',
        })
        if (this.orderIdP) {
          this.$emit('close', true)
        }
      }
    },
    async submit() {
      const { wayType } = this.$attrs
      const has = await (wayType === 'VIDEO'
        ? getVideoStatus
        : sessionUserSpeak)({
        orderId: this.orderId,
        sessionId: this.sessionId,
        userId: this.userId,
      })
      if (!has) {
        uni.showToast({
          title: wayType === 'VIDEO' ? '请先与患者视频沟通' : '请先与患者沟通',
          icon: 'none',
        })
        return
      }

      const { data, params } = this.confirm()
      await submitDiagnosis(data, params)
      uni.showToast({
        title: '提交成功！',
        icon: 'none',
      })
      if (this.orderIdP) {
        this.$emit('close', true)
      } else {
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          })
        }, 2000)
      }
    },
    del(index, d) {
      if (d) {
        if (this.tableData[index].childDtos[d - 1].mainDiagnosis == 1) {
          this.tableData[0].mainDiagnosis = 1
        }
        this.tableData[index].childDtos.splice(d - 1, 1)
      } else {
        if (this.tableData[index].mainDiagnosis == 1) {
          if (index == 0 && this.tableData.length > 1) {
            this.tableData[1].mainDiagnosis = 1
          } else {
            this.tableData[0].mainDiagnosis = 1
          }
        }
        this.tableData.splice(index, 1)

        if (this.tableData.length == 1) {
          this.tableData[0].mainDiagnosis = 1
        }
      }
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.clinic-diagnosisList {
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  background-color: #f2f2f2;
  padding: 20rpx;
  padding-bottom: 200rpx;

  .listItem {
    border-bottom: 1px solid #e5e5e5;
    padding-left: 30rpx;
  }

  .list_right {
    text-align: right;
    width: 100%;
    color: #666;

    switch {
      transform: scale(0.7);
    }
  }

  .types {
    border-bottom: 1px solid #e5e5e5;
    padding: 30rpx 0;

    .typesItem {
      padding: 6rpx 34rpx;
      border-radius: 20rpx;
      background: #f2f2f2;
      font-size: 24rpx;
      color: #666666;
      margin-right: 20rpx;
      display: inline-block;

      &.on {
        background: $uni-color-primary;
        color: #fff;
      }
    }
  }

  .inputText {
    height: 100rpx;
    border-bottom: 1px solid #e5e5e5;

    input {
      height: 100%;
      color: #333;
      line-height: 100rpx;
      padding: 0;
    }
  }

  .listBtn {
    font-size: 26rpx;
    color: $uni-color-primary;
    padding: 30rpx 0;

    view {
      margin-right: 30rpx;
    }

    .del {
      color: #666;
    }
  }

  .bottomBtn {
    position: fixed;
    width: 100%;
    height: 178rpx;
    background: #fff;
    bottom: 0;
    left: 0;
    padding: 0 30rpx;
    box-sizing: border-box;
    z-index: 22;
    border-top: 1px solid #e5e5e5;

    .types {
      border: 0;
      padding-bottom: 0;
      padding-top: 20rpx;

      .typesItem {
        padding: 6rpx 30rpx;
        margin-right: 0;
      }
    }

    .addBtn {
      height: 60rpx;
      background: $uni-color-primary;
      border-radius: 30px;
      font-size: 24rpx;
      color: #fff;
      line-height: 60rpx;
      text-align: center;
      margin-top: 20rpx;
    }
  }
}

.select_wrap {
  background: #fff;
  border-radius: 40px 40px 0 0;
  padding-bottom: 20rpx;
  overflow: hidden;

  .select_content {
    text-align: center;

    picker-view {
      height: 400rpx;
    }

    .item {
      height: 70rpx;
      line-height: 70rpx;
    }
  }
}
</style>
