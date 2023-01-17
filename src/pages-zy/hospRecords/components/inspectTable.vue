<template>
  <view class="inspect-table">
    <block v-if="inspenctList.length>0">
    <template v-for="(one,inspent) in inspenctList">
    <view class="head" :key="inspent">
      <view class="line"></view>
      <view class="title">检验</view>
      <view class="times">{{changeTime(one.reportDtime)}}</view>
      <!-- <view class="num">共计<span style="color:#f66666">{{' '+one.details.length+' '}}</span>条</view> -->
    </view>
    <view class="collapse" :style="one.isOpen?'max-height:8000rpx':'max-height:126rpx'" :key="inspent">
      <view class="number">
        <view class="no">{{one.labItemName}}</view>
        <view class="nums" @click="opentTable(one)">
          {{one.details.length||'-'}}项
            <image 
            :src="require('@/assets/right11@2x.png')" 
            :class="one.isOpen?'icon active':'icon'"
            ></image>
        </view>
      </view>
      <view class="texts">
        <view class="tips">
          科室：{{one.labDeptName||'-'}} | 
          标本：{{one.specType||'-'}}</view>
        <!-- <view class="checks">
          置顶异常值
          <checkbox :checked="two.checkState" @click="changeState(two)" style="transform:scale(0.7)" />
        </view> -->
      </view>
      <view class="result-table">
        <table cellspacing="0">
          <thead>
            <tr style="background: #F2F2F2;">
              <td>检验项目</td>
              <td>结果</td>
              <td>提示</td>
              <td>参考值</td>
              <td>单位</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,table) in one.details" :key="table">
              <td>{{item.itemName||'-'}}</td>
              <td>{{item.labResultNum||'-'}}</td>
              <td>
                <!-- <template v-if="item.urgentFlag==1"> -->
                  <template v-if="item.prompt">
                  <template v-if="item.prompt=='偏高'">
                      <image :src="require('@/assets/piangao.png')"></image>
                  </template>
                  <template v-else-if="item.prompt=='偏低'">
                      <image class="icon-down" :src="require('@/assets/piangao.png')"></image>
                  </template>
                  <template v-else>
                    <label style="color:red;">{{item.prompt}}</label>
                  </template>
                  </template>
                <!-- </template> -->
                <template v-else>-</template>
              </td>
              <td>{{item.reference||'-'}}</td>
              <td>{{item.unit||'-'}}</td>
            </tr>
          </tbody>
        </table>
        <view class="doctor-remark">
          <view class="doctor">申请医生：{{one.applyDocName||'-'}}</view>
          <view class="time">申请日期：{{changeTime(one.applyDtime)}}</view>
        </view>
        <!-- <view class="doctor-remark">
          <view class="doctor">审核医生：{{one.auditorName||'-'}}</view>
          <view class="time">审核时间：{{changeTime(one.auditDtime)}}</view>
        </view> -->
        <view class="doctor-remark" style="margin-bottom:0;">
          <view class="doctor">报告医生：{{one.reportDocName||'-'}}</view>
          <view class="time">报告时间：{{changeTime(one.reportDtime)}}</view>
        </view>
        <!-- <view class="do-time">采集时间：{{changeTime(one.labDtime)}}</view> -->
      </view>
    </view>
    </template>
    </block>
    <no-data v-else></no-data>
  </view>
</template>

<script>
  import dayjs from 'dayjs'
  import { labInfoList } from '../../api/hospitalCdr'
  import NoData from '../../components/NoData'
  export default {
    props:{
      cardNo:{
        type:String
      },
      begin:{
        type:String
      },
      end:{
        type:String
      },
      times:{
        type:String
      }
    },
    components:{
      NoData
    },
    data(){
      return{
        reportTime:'',
        upType:0,
        inspenctList:[],
      }
    },
    methods:{
      async getLabInfoList(){
        uni.showLoading()
        let res = await labInfoList({
          cardNo:this.cardNo,
          beginDate:this.begin,
          endDate:this.end,
          times:this.times
        })
        this.inspenctList = res
          uni.hideLoading()
      },
      opentTable(item){
        this.$set(item,'isOpen',!item.isOpen)
        // this.getLabDetail(item)
      },
      changeState(item){
        item.checkState=!item.checkState
        if (item.checkState) {
          this.upType = 1
        } else {
          this.upType = 0
        }
        // this.getLabDetail(item.labSno)
      },
      openChart(i){
        console.log(i);
      },
      changeDay(times){
        if (times) {
          return dayjs(times).format('YYYY-MM-DD')
        }else{
          return '-'
        }
      },
      changeTime(times){
        if (times) {
          return dayjs(times).format('YYYY-MM-DD hh:mm')
        }else{
          return '-'
        }
      }
    },
    mounted(){
      this.getLabInfoList()
    },
  }
</script>

<style lang="scss" scoped>
.inspect-table{
  width: 100%;
  transform: scale();
  .head{
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
    .line{
      width: 2rpx;
      height: 30rpx;
      background: #0AB2C1;
      margin-right: 10rpx;
    }
    .title{
      width: 100rpx;
      font-size: 30rpx;
      color: #333333;
    }
    .times{
      flex: 1;
      font-size: 30rpx;
      color: #666666;
    }
    .num{
      width: 150rpx;
      font-size: 24rpx;
      color: #666666;
      text-align: right;
    }
  }
  .collapse{
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 10rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    transition: all .5s ease-in-out;
    .number{
      display: flex;
      align-items: center;
      font-weight: 500;
      margin-bottom: 20rpx;
      .no{
        width: 85%;
        font-size: 26rpx;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .nums{
        position: relative;
        width: 15%;
        font-size: 26rpx;
        color: #666666;
        .icon{
            position: absolute;
            width: 10rpx;
            height: 20rpx;
            top: 50%;
            transform: translate(10rpx,-50%) rotate(90deg);
            transition: all 0.5s ease-in-out;
        }
        .active{
            transform: translate(10rpx,-50%) rotate(-90deg);
        }
      }
    }
    .texts{
      display: flex;
      align-items: center;
      font-weight: 500;
      color: #666666;
      margin-bottom: 20rpx;
      .tips{
        width: 69%;
        font-size: 22rpx;
        line-height: 22rpx;
      }
      .checks{
        width: 31%;
        white-space: nowrap;
        text-align: right;
        font-size: 22rpx;
        line-height: 22rpx;
      }
    }
    .result-table{
      width: 100%;
      table{
        width: 100%;
        border: 0.5rpx solid #E6E6E6;
        text-align: center;
        margin-bottom: 20rpx;
        thead{
          width: 100%;
          background: #F2F2F2;
          font-size: 20rpx;
          color: #666666;
        }
        tbody{
          width: 100%;
          font-size: 20rpx;
          color: #666666;
          .button{
            display: flex;
            align-items: center;
            justify-content: center;
            image{
              width: 35rpx;
              height: 35rpx;
            }
          }
        }
        tr td{
          border: 0.5rpx solid #E6E6E6;
        }
        tr{
          display: flex;
          .icon-down{
              transform: rotate(180deg);
          }
        }
          td{
          // width: 16.6%;
            width: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
            image{
              width: 50rpx;
              height: 65rpx;
            }
          }
      }
      .doctor-remark{
        display: flex;
        align-items: center;
        color: #666666;
        font-weight: 500;
        margin-bottom: 20rpx;
        .doctor{
          width: 40%;
          font-size: 20rpx;
        }
        .time{
          width: 60%;
          font-size: 20rpx;
        }
      }
      .do-time{
        width: 100%;
        font-weight: 500;
        color: #666666;
        font-size: 20rpx;
      }
    }
  }
}
</style>