<template>
  <uni-popup ref="popup" type="bottom" @change="popChange">
    <view class="listWrap">
      <view>
        <view class="title">{{type == 1?'历史':'常用'}}诊断模板</view>
      </view>
      <view class="selceData flex-between" v-if="type ==1 ">
        <view class="dateTime flex-center">
          <picker mode="date" :value="startTime" :end="endTime" @change="bindDateChange($event,'startTime')">
            <view :class="startTime?'dateInput':'dateInput no'">{{startTime || '开始时间'}}</view>
          </picker>
          <text>~</text>
          <picker mode="date" :value="endTime" :start="startTime" @change="bindDateChange($event,'endTime')">
            <view :class="endTime?'dateInput':'dateInput no'">{{endTime || '结束时间'}}</view>
          </picker>
          <icon type="clear" @click="clearDate" size="12"/>
        </view>
        <view :class="isActive==1?'dateTime on':'dateTime'" @click="inputStart(1)">今日</view>
        <view :class="isActive==3?'dateTime on':'dateTime'" @click="inputStart(3)">近3日</view>
        <view :class="isActive==7?'dateTime on':'dateTime'" @click="inputStart(7)">近7日</view>
      </view>
      <scroll-view :scroll-top="scrollTop" scroll-y="true" class="tabWrap">
        <template v-if="type == 1">
          <view v-for="(item,index) in diagData.historyTemp" :key="index">
            <view class="listTime flex-between">
              <view>诊断时间：{{item.diagTime}}</view>
              <view>科室：{{item.deptName}}</view>
            </view>
            <checkbox-group @change="allCheckboxChange($event,item)">
              <view class="tableTh tableTd flex-start-center">
                <view><label class="flex-start-center">
                    <checkbox style="transform:scale(0.7)" color="#0AB2C1" :checked="item.isAll" value="all"></checkbox><text>全选</text>
                  </label></view>
                <view>类别</view>
                <view>诊断/病名</view>
              </view>

            </checkbox-group>
            <checkbox-group @change="checkboxChange($event,item)">
              <view class="tableTd flex-start-center" v-for="(t,d) in item.dtoList" :key="d">
                <view><label>
                    <checkbox :value="t.id" :checked="t.checked" color="#0AB2C1" style="transform:scale(0.7)"></checkbox>
                  </label></view>
                <view>{{getTypeName(t.diagnosisType)}}</view>
                <view>{{t.diagnosisName}}</view>
              </view>

            </checkbox-group>
          </view>

        </template>
        <view v-else>
          <checkbox-group @change="allCheckboxChange($event,item)">
            <view class="tableTh tableTd flex-start-center">
              <view><label class="flex-start-center">
                  <checkbox style="transform:scale(0.7)" color="#0AB2C1" :checked="commonTemp.isAll" value="all"></checkbox><text>全选</text>
                </label></view>
              <view>类别</view>
              <view>诊断/病名</view>
            </view>

          </checkbox-group>
          <checkbox-group @change="checkboxChange($event,commonTemp)">
            <view class="tableTd flex-start-center" v-for="(t,d) in diagData.commonTemp" :key="d">
              <view><label>
                  <checkbox :value="t.id" :checked="t.checked" color="#0AB2C1" style="transform:scale(0.7)"></checkbox>
                </label></view>
              <view>{{getTypeName(t.diagnosisType)}}</view>
              <view>{{t.diagnosisName}}</view>
            </view>

          </checkbox-group>
        </view>
        <view v-if="(type == 2 &&diagData.commonTemp.length == 0) || (type == 1 && diagData.historyTemp.length == 0)"
          class="nodata">暂无数据</view>

      </scroll-view>

      <view class="bottombtn flex-between">
        <view @click="close">取消</view>
        <view class="on" @click="submit">导入</view>
      </view>
    </view>


  </uni-popup>
</template>

<script>
  import {
    importDiagTemp
  } from '@/common/request/doctorRoom.js'
  import dayjs from 'dayjs'
  export default {
    props: {
      memberId: String,
      type: String // 1.历史 2.常用
    },
    data() {
      return {
        scrollTop: 0,
        isShow: false,
        startTime: '',
        isActive:null,
        endTime: '',
        diagData: {
          historyTemp: [],
          commonTemp: [],
        },
        commonTemp: {},
        selectionTables: {
          historyTemp: {},
          commonTemp: [],
        },
      }
    },
    methods: {
      confirm(list) {
        console.log(list)
        const data = list
          .filter(item => item.diagnosisType)
          .map(item => {
            return Object.assign(item, {
              mainDiagnosis: 0,
              childDtos: list.filter(
                ite => ite.parent === item.indexCode && item.checked,
              ).map(item => ({ ...item,
                mainDiagnosis: 0
              })),
            })
          })
        let elseDate = []
        list.forEach(item => {
          if (item.diagnosisType) {
            elseDate.push(Object.assign(item, {
              mainDiagnosis: 0,
              childDtos: list.filter(
                ite => ite.parent === item.indexCode && item.checked,
              ).map(item => ({ ...item,
                mainDiagnosis: 0
              })),
            }))
          } else {
            list.forEach(ite => {
              if (item.parent != ite.indexCode) {
                elseDate.push(Object.assign(item, {
                  mainDiagnosis: 0,
                  diagnosisType: item.diagnosisTypechild || 'CH_MEDICINE_NAME'
                }))
              }
            })
          }

        })
        return elseDate
      },

      //导入
      submit() {
        let selection = []
        if (this.type == 1) {
          this.diagData.historyTemp.forEach(item => {
            let list = this.confirm(item.dtoList.filter(item => item.checked))
            if (list.length > 0) {
              selection = [...selection, ...list]
            }
          })
        } else {
          selection = this.diagData.commonTemp.filter(item => item.checked).map(t => {
            return Object.assign(t, {
              mainDiagnosis: 0,
            })
          })
        }
        this.$emit('submit', selection)
      },
      //全选
      allCheckboxChange(e, item) {

        if (e.detail.value.length == 0) {
          if (this.type == 1) {
            item.dtoList.map(item => this.$set(item, 'checked', false))
          } else {
            this.diagData.commonTemp.map(item => this.$set(item, 'checked', false))
          }

          this.$set(item, 'isAll', false)

        } else {
          if (this.type == 1) {
            item.dtoList.map(item => this.$set(item, 'checked', true))
          } else {
            this.diagData.commonTemp.map(item => this.$set(item, 'checked', true))
          }

          this.$set(item, 'isAll', true)
        }
      },
      checkboxChange(e, row) {
        let items = this.type == 1 ? row.dtoList : this.diagData.commonTemp,
          values = e.detail.value;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          if (values.includes(item.id)) {
            this.$set(item, 'checked', true)
          } else {
            this.$set(item, 'checked', false)
          }
        }
        //  商品是否全部勾选，判断全选与否状态
        let offCarArr = []
        // row.dtoList.forEach(item => item.whether == true? offCarArr.push(item): '')
        let allChecks = items.every(item => item.checked == true)
        if (this.type == 1) {
          allChecks ? this.$set(row, 'isAll', true) : this.$set(row, 'isAll', false)
        } else {
          allChecks ? this.$set(this.commonTemp, 'isAll', true) : this.$set(this.commonTemp, 'isAll', false)
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
      async fetchDiagList() {
        let params = {
          memberId: this.memberId,
          currentNum: 1,
          pageSize: 999,
        }
        if (this.startTime && this.endTime) {
          params.startTime = dayjs(this.startTime).format('YYYYMMDD') + '000000'
          params.endTime = dayjs(this.endTime).format('YYYYMMDD') + '235959'
        }
        const {
          historyTemp,
          commonTemp
        } = await importDiagTemp(params)

        this.diagData = {
          historyTemp: historyTemp.map(({
            dtoList,
            ...temp
          }) => ({
            ...temp,
            dtoList: dtoList
              .map((item, indexCode) => [{ ...item,
                  indexCode
                },
                ...item.childDtos.map(child => ({ ...child,
                  parent: indexCode,
                  diagnosisTypechild: item.diagnosisType
                })),
              ])
              .flat(),
          })),
          commonTemp,
        }

        const selectedIds = this.selectedData.map(({
          id
        }) => id)
        this.$nextTick(() => {
          this.diagData.historyTemp.forEach(({
            diagnosisId,
            dtoList
          }) => {
            dtoList.forEach(
              dto =>
              selectedIds.includes(dto.id) &&
              this.$refs[`table_${diagnosisId}`][0].toggleRowSelection(
                dto,
                true,
              ),
            )
          })

          this.diagData.commonTemp.forEach(
            row =>
            selectedIds.includes(row.id) &&
            this.$refs.commonTable.toggleRowSelection(row, true),
          )
        })
      },
      open() {
        this.$refs.popup.open()
        this.startTime = this.type == 1?dayjs().subtract(6, 'day').format('YYYY-MM-DD'):''
        this.endTime = this.type == 1?dayjs().format('YYYY-MM-DD'):''
        this.isActive = this.type == 1?7:null
        this.fetchDiagList()
      },
      close() {
        this.$refs.popup.close()
      },
      bindDateChange(e, type) {
        this[type] = e.target.value
        this.isActive = null
        this.fetchDiagList()
      },
      // 快捷日期选择
      inputStart(day) {
        this.isActive = day
        if (day == 1) {
          this.startTime = dayjs().format('YYYY-MM-DD')

        } else {
          this.startTime = dayjs().subtract(day-1, 'day').format('YYYY-MM-DD')
        }
        this.endTime = dayjs().format('YYYY-MM-DD')
        this.fetchDiagList()
      },
      // 清空日期
      clearDate(){
         this.startTime = ''
         this.endTime = ''
         this.isActive = null
         this.fetchDiagList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .listWrap {

    background: #FFFFFF;
    border-radius: 20px 20px 0px 0px;
    padding-bottom: 150rpx;

    .listTime {
      padding: 0 20rpx;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 4rpx;
    }

    .tabWrap {
      max-height: 68vh;
      overflow-x: auto;

      .nodata {
        height: 300rpx;
        line-height: 300rpx;
        text-align: center;
        color: #999;
        font-size: 28rpx;
      }
    }

    .tableTd {
      height: 80rpx;
      border-bottom: 1px solid #E6E6E6;
      padding: 0 30rpx;
      font-size: 26rpx;
      color: #333;
      // width: 100%;

      view {
        &:nth-child(1) {
          width: 140rpx;
        }

        &:nth-child(2) {
          width: 160rpx;
        }
      }

      &.tableTh {
        background: #F2F2F2;
      }
    }
  }

  .title {
    height: 90rpx;
    font-size: 30rpx;
    color: #1A1A1A;
    line-height: 90rpx;
    text-align: center;
    border-bottom: 1px solid #E6E6E6;
    font-weight: bold;
  }

  .selceData {
    padding: 20rpx;

    .dateTime {
      padding: 4rpx 20rpx;
      background: #F2F2F2;
      font-size: 24rpx;
      color: #333;
      border-radius: 26rpx;

      .dateInput {
        width: 154rpx;
        text-align: center;

        &.no {
          color: #999;
        }
      }
      &.on{
        background: $uni-color-primary;
        color: #fff;
      }
    }
  }

  .bottombtn {
    position: fixed;
    height: 128rpx;
    width: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    border-top: 1px solid #E6E6E6;

    view {
      width: 345rpx;
      height: 88rpx;
      background: #F2F2F2;
      font-size: 30rpx;
      color: #333;
      text-align: center;
      line-height: 88rpx;
      border-radius: 44rpx;

      &.on {
        background: $uni-color-primary;
        color: #fff;
      }
    }
  }
</style>
