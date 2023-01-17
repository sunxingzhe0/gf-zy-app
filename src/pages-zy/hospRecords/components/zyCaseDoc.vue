<template>
  <view class="zy-case-doc">
    <view class="head">
      <view class="line"></view>
      <view class="title">病历文书</view>
    </view>
    <template v-if="show">
    <template v-for="(one,menu) in menuList">
      <template v-if="one.tagType=='RYJL'">
        <collapse-item :title="one.tagName" :key="menu">
          <view class="item-one" v-for="(item,oneBox) in one.beanList" :key="oneBox">
            <view class="title">{{item.title}}</view>
            <view class="text">{{item.value}}</view>
          </view>
        </collapse-item>
      </template>
      <template v-if="one.tagType=='SCBC'">
        <collapse-item :title="one.tagName" :key="menu">
          <view class="item-one" v-for="(item,oneBox) in one.beanList" :key="oneBox">
            <view class="title">{{item.title}}</view>
            <view class="text">{{item.value}}</view>
          </view>
        </collapse-item>
      </template>
      <template v-if="one.tagType=='BCJL'">
        <collapse-item :title="one.tagName" :nums='one.list.length' :key="menu">
          <records-item :list="one.list" @change="openDetail"></records-item>
        </collapse-item>
      </template>
      <!-- <template v-if="one.tagType=='SSJL'">
        <collapse-item :title="one.tagName" :nums='one.list.length' :key="menu">
          <records-item :list="one.list" @change="openDetail"></records-item>
        </collapse-item>
      </template> -->
      <!-- <template v-if="one.tagType=='HZJL'">
        <collapse-item :title="one.tagName" :nums='one.list.length' :key="menu">
          <records-item :list="one.list" @change="openDetail"></records-item>
        </collapse-item>
      </template> -->
      <template v-if="one.tagType=='CYSWJL'">
        <collapse-item :title="one.tagName" :key="menu">
          <view class="coll-item-box">
            <view class="top-box">
              <view class="text" style="margin-bottom: 20rpx;display:flex;">
                <view class="names">医师签名：苏伊亚</view>
                <view class="time">入院日期：2020-06-25</view>
              </view>
            <view class="text">出院日期：2020-06-30</view>
          </view>
          <!-- <view class="bottom-box">
            <view class="title">入院情况</view>
            <view class="remark">入院情况入院情况入院情况入院情况入院情况 入院情况</view>
          </view>
          <view class="bottom-box">
            <view class="title">入院情况</view>
            <view class="remark">入院情况入院情况入院情况入院情况入院情况 入院情况</view>
          </view> -->
          </view>
        </collapse-item>
      </template>
    </template>
    </template>
    <no-data v-else></no-data>
  </view>
</template>

<script>
  import collapseItem from './common/collapseItem'
  import recordsItem from './common/recordsItem'
  import NoData from '../../components/NoData'
  // import { caseDoc } from '../../../api/index'
  export default {
    components:{
      collapseItem,
      recordsItem,
      NoData
    },
    props:{
      mpiId:{
        type:String
      },
      ehrId:{
        type:String
      }
    },
    data(){
      return{
        show:false,
        menuList:[],
        recordsItemList:[
          {time:'2020-06-25 09:11',text:'日常病程记录'},{time:'2020-06-25 09:11',text:'副主任医师查房'},{time:'2020-06-25 09:11',text:'主任查房'},{time:'2020-06-25 09:11',text:'主治医师查房'},{time:'2020-06-25 09:11',text:'日常病程记录'},
        ]
      }
    },
    methods:{
      openDetail(item){
        uni.showModal({
          title: item.tagName,
          content: item.value,
          showCancel: false,
        })
      },
      // async getCaseDoc(){
      //   let res= await caseDoc({
      //     mpiId:this.mpiId,
      //     ehrId:this.ehrId,
      //     type:'ZY'
      //   })
      //   res.forEach(one=>{
      //     this.menuList=one.zyDisease.menuList
      //   })
      // }
    },
  }
</script>

<style lang="scss" scoped>
.zy-case-doc{
  width: 100%;
  .head{
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .line{
      width: 2rpx;
      height: 30rpx;
      background: #0AB2C1;
      margin-right: 10rpx;
    }
    .title{
      width: 150rpx;
      font-size: 30rpx;
      color: #333333;
    }
  }
  .item-one{
    width: 100%;
    margin-bottom: 30rpx;
    .title{
      font-size: 26rpx;
      font-weight: 500;
      color: #333333;
      margin-bottom: 20rpx;
    }
    .text{
      font-size: 24rpx;
      font-weight: 500;
      color: #666666;
    }
  }
  .coll-item-box{
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 20rpx;
    .top-box{
      margin-bottom: 30rpx;
      .text{
        color: #666666;
        font-size: 20rpx;
        font-weight: 500;
        .names{
          width: 40%;
          font-size: 20rpx;
          font-weight: 500;
        }
        .time{
          width: 60%;
          font-size: 20rpx;
          font-weight: 500;
          text-align: right;
        }
      }
    }
    .bottom-box{
      width: 100%;
      margin-top: 30rpx;
      .title{
        margin-bottom: 20rpx;
        font-size: 26rpx;
        font-weight: 500;
        color: #333333;
      }
      .remark{
        font-size: 24rpx;
        font-weight: 500;
        color: #666666;
      }
    }
  }
}
</style>