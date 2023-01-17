<template>
  <view>
    <topbar :tabs="tabs" :active="tabs[0].key" @change="topbarChange">
      <template v-slot:top>
        <view class="top-list-item">
        <app-list-item
            label="就诊人"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: '80rpx' ,position: 'relative'}"
          >
         <image :src="require('@/assets/user/userIcon1.png')"></image>
            <view class="flex_1 text-right color666">
              <select-patient
                textStyle="color:#666;"
                @patientLoad="changePatient"
              ></select-patient>
            </view>
          </app-list-item>
          <app-list-item
            label="日期"
            :styles="{ padding: '16rpx 30rpx', paddingLeft: '80rpx' ,position: 'relative'}"
          >
          <image :src="require('@/assets/user/userIcon9.png')"></image>
            <view class="flex_1 text-right color666">
             <select-date-range
              :date="rangeData"
              @confirm="dateChange"
            ></select-date-range>
            </view>
          </app-list-item>
        </view>
      </template>
    </topbar>
    <view class="page-body">
      <view v-if="totalList.length > 0">
        <all-list :list="totalList"></all-list>
      </view>
      <view v-else class="nothing-box">
        暂无记录
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import AppListItem from '@/components/app/app-list-item'
import selectPatient from '../components/selectPatient/index.vue'
import selectDateRange from '../components/selectDateRange/index.vue'
import allList from '../components/common/allList/index.vue'
import { recordsList } from '../api/index.js'
export default {
    components:{
      AppListItem,
      selectPatient,
      selectDateRange,
      allList
    },
    data(){
      return{
        active: 0,
        perId: '',
        cardNo: '',
        perName: '',
        // medicalType:'',
        mpiId:'',
        ehrId:'',
        totalList:[],
        pageNum:1,
        pages:0,
        rangeData: [
          dayjs()
            .subtract(1, 'months')
            .format('YYYY-MM-DD'),
          dayjs().format('YYYY-MM-DD'),
        ],
        tabs:[
          {
            title:'全部',
            key:0,
            // num:0,
          },
          {
            title:'门诊',
            key:1,
            // num:0,
            type:'MZ'
          },
          {
            title:'住院',
            key:2,
            // num:0,
            type:'ZY'
          },
          {
            title:'体检',
            key:3,
            // num:0,
            type:'TJ'
          }
        ]
      }
    },
    methods:{
      async getRecordsList(type,start,end,num){
        let res = await recordsList({
          memberIds:this.perId,
          medicalType:type||'',
          startDate:this.rangeData[0]||start,
          endDate:this.rangeData[1]||end,
          currentNum:num||1
        })
        this.totalList=res.data
        this.pages=res.pages
      },
      dateChange(e) {
        this.rangeData = e
        this.topbarChange(this.active)
        this.getRecordsList(null,e[0],e[1])
      },
      changePatient(item){
        this.perId = item.memberId
        this.cardNo = item.patientCard
        this.perName = item.name
        this.topbarChange(this.active)
      },
      topbarChange(state) {
        this.active = state
        this.pageNum = 1
        switch (state) {
          case 0:
            this.getRecordsList()
            return;
          case 1:
            this.getRecordsList('MZ')
            return;
          case 2:
            this.getRecordsList('ZY')
            return;
          case 3:
            this.getRecordsList('TJ')
            return;
        }
      },
      changeTime(time){
        return dayjs(time).format('YYYYMMDDHHmmss')
      }
    },
    onReachBottom() {
      if(this.pageNum >= this.pages){ 
        uni.showToast({
          title: '没有更多内容了',
          icon:'none',
          duration: 2000,
          mask:true
        })
      }else{
        uni.showToast({
        title: '正在进入下一页...',
        icon: 'loading',
        // icon:'none',
        duration: 1000
      });
      this.pageNum++
      switch (this.active) {
        case 0:
          return this.getRecordsList(null,null,null,this.pageNum)
        case 1:
          return this.getRecordsList('MZ',null,null,this.pageNum)
        case 2:
          return this.getRecordsList('ZY',null,null,this.pageNum)
        case 3:
          return this.getRecordsList('TJ',null,null,this.pageNum)
      }
      }
    }
  }
</script>

<style lang="scss" scoped>
.top-list-item{
  padding-left: 30rpx;
  image{
    position: absolute;
    top: 50%;
    left: 0;
    width: 60rpx;
    height: 60rpx;
    transform: translate(0,-50%);
  }
}
.page-body{
  padding: 280rpx 30rpx 0;
  .nothing-box{
    display: flex;
    width: 100%;
    height: 300rpx;
    align-items: center;
    justify-content: center;
    color: #999;
  }
}
</style>