<template>
  <view style="padding:5px; ">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <!-- <view style="overflow-x: auto; height: 90vh;">
     -->
    <scroll-view
      class="orderlist"
      scroll-y="true"
      lower-threshold="30"
      @scrolltolower="scrollLower"
    >
      <view
        class="flex-between app-card"
        v-for="item in drugs"
        :key="item.id"
        @click="goAdd(item)"
      >
        <view>
          <view>
            <text class="name">{{ item.drugName || '-' }}</text>
            <text>{{ item.drugSpec || '' }}</text>
          </view>
          <view
            >{{
              item.uesCycle == 'DAY'
                ? '每天'
                : item.uesCycle == 'WEEK'
                ? '每周'
                : item.uesCycle == 'MONTH'
                ? '每月'
                : '-'
            }}{{daySet(item)}}：{{ item.uesTime || '-' }}
          </view>
          <view
            >剂量：<text style="color: #f74a4a">{{ item.dosage }}</text></view
          >
        </view>
        <switch
          @click.stop="!goAdd"
          @change="change(item.id, $event.detail.value)"
          :checked="item.warnState"
          class="switch"
          color="#0ab2c1"
        />
      </view>
      <uni-load-more
        :status="loading"
        :contentText="{
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载数据中',
          contentnomore: '没有更多数据了',
        }"
      ></uni-load-more>
    </scroll-view>
    <!-- </view> -->

    <view class="bottom-btn" @click="goAdd()">新增提醒</view>
  </view>
</template>

<script>
import { drugWarnList, editWarnState } from '@/common/request/drug'
export default {
  data() {
    return {
      loading: 'more', //more（loading前）、loading（loading中）、noMore（没有更多了）
      currentNum: 0,
      pages: 1,
      drugs: [],
      // daySet:'-',
    }
  },
  // onReachBottom() {
  //   if (this.currentNum < this.pages) {
  //     this.currentNum += 1
  //     this.getDrugs()
  //   } else {
  //     this.more = 'noMore'
  //   }
  // },

  onShow() {
    this.init()
  },
  computed:{
    daySet:function(){
      return item=>{
         let showDays='';
         if(!item.days || item.days==undefined  ){
          return '-'
         }
         if(item.uesCycle=='WEEK'){
           let ds= item.days.split(",")
           ds.forEach(data=>{
             showDays+=data==1?'7':data-1
           })
           return showDays
         }else{
           return item.days
         }
      }



    },
  },
  methods: {
    scrollLower() {
      if (this.currentNum < this.pages) {
        this.currentNum += 1
        this.getDrugs()
      } else {
        this.more = 'noMore'
      }
    },
    init() {
      this.currentNum = 0
      this.pages = 1
      this.drugs = []
      this.getDrugs()
    },
    getDrugs() {
      this.loading = 'loading'
      drugWarnList({
        currentNum: this.currentNum,
        pageSize: 10,
      }).then(data => {
        this.drugs = this.drugs.concat(data.list)
        this.pages = data.pages
        this.currentNum = data.pageNum
        this.loading = this.currentNum < this.pages ? 'more' : 'noMore'
      })
    },
    goAdd(item) {
      let str = '/pages-user/medicationReminder/add'
      if (item) {
        str += '?item=' + encodeURIComponent(JSON.stringify(item))
      }
      uni.navigateTo({
        url: str,
      })
    },
    change(id, state) {
      //添加接口更改提醒状态
      //刷新列表getDrugs
      editWarnState({
        id: id,
        state: state,
      }).then(data => {
        uni.showToast({
          title:"操作成功！",
          icon:"none"
        })
      }).catch(e => {
        this.init()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-card {
  line-height: 46rpx;
  margin-top: 10rpx;
  padding: 28rpx;
  font-size: 24rpx;
  color: #666;
}

.name {
  margin-right: 16rpx;
  font-size: 32rpx;
  color: $uni-text-color;
}

.switch {
  transform: scale(0.7);
}

.bottom-btn {
  text-align: center;
  background: #0ab2c1;
  height: 44px;
  line-height: 44px;
  width: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  font-size: 14px;
  color: #ffffff;
}

.orderlist {
  position: absolute;
  bottom: 44px;
  top: 0rpx;
  width: 100%;
}
</style>
