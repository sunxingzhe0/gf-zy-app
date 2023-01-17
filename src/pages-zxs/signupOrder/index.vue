<template>
  <view>
    <view class="signup-header">
      <view class="title flex-between">
        <view>【{{ activityType }}】{{ activityName }} </view>
        <view :class="'state ' + (activityState == 2 ? '' : 'succ')">{{
          actState[activityState]
        }}</view>
      </view>
      <view style="margin:10rpx 0;"> 活动ID：{{ activityId }} </view>
      <view class="nums flex-between">
        <text>报名人数：{{ orderNum }}人</text>
        <text>报名成功人数：{{ orderSucNum }}人</text>
        <text>待审核人数：{{ toAuditNum }}人</text>
      </view>
    </view>
    <view class="signup-order">
      <template v-if="singData.length > 0">
        <view class="sign-item" v-for="v in singData" :key="v.id">
          <view @click="openDetailPop(v)">
            <view class="top flex-between">
              <view class="info">
                <text class="name">{{ v.name }}</text>
                <text>{{ v.phone }}</text>
              </view>
              <view
                :class="
                  'state ' +
                    (v.status == 1
                      ? 'succ'
                      : v.status == 2
                      ? 'error'
                      : v.status == 4
                      ? 'warn'
                      : '')
                "
                >{{ signState[v.status] }}</view
              >
            </view>
            <view class="body flex-between">
              <view class="filed">
                <template v-if="v.relList.length >= 0">
                  <view v-for="r in v.relList" :key="r.id">{{
                    `${r.fieldName}：${r.fieldValue}`
                  }}</view>
                </template>
                <view>报名时间：{{ v.signTime }}</view>
              </view>
              <view class="money">¥ {{ v.payCost }}</view>
            </view>
          </view>
          <view class="bottom" v-if="v.status == 2">
            <view class="refuse" @click="openEditPop(v, false)">拒绝</view>
            <view class="agree" @click="openEditPop(v, true)">同意</view>
          </view>
        </view>
      </template>
      <view class="noData" v-else>
        <image src="@/pages-zxs/static/noData.png" />
        <view>暂无数据</view>
      </view>
    </view>
    <PickerPop title="名单详情" ref="detailPop" :showSubmit="false">
      <scroll-view :scroll-top="0" scroll-y="true" style="height:730rpx;">
        <OrderDetail :signId="signId" :actType="activityType" />
      </scroll-view>
    </PickerPop>
    <PopupDialog :title="editTitle" ref="editPop" :width="350" :showBtn="false">
      <EditForm
        :type="editType"
        :data="formData"
        @cancel="$refs.editPop.close()"
        @confrim="editSubmit"
      />
    </PopupDialog>
  </view>
</template>
<script>
import { signList, getCount } from '../api/signupOrder'
import PickerPop from '../my-active/components/PickerPop/index'
import PopupDialog from '../components/popup-dialog/index'
import OrderDetail from './components/OrderDetail/index'
import EditForm from './components/EditForm/index'
export default {
  components: {
    PickerPop,
    OrderDetail,
    PopupDialog,
    EditForm,
  },
  data() {
    return {
      signId: null,
      activityId: null,
      activityName: null,
      activityType: null,
      activityState: null,
      editTitle: null,
      editType: null,
      orderNum: 0,
      orderSucNum: 0,
      toAuditNum: 0,
      signState: {
        1: '报名成功',
        2: '审核中',
        3: '报名失败',
        4: '活动费待支付',
      },
      singData: [],
      actState: {
        1: '进行中',
        2: '已结束',
        3: '暂停',
        4: '未开始',
      },
      formData: {
        id: null,
        cost: '',
        relList: [],
      },
    }
  },
  onLoad(options) {
    if (options.id) {
      this.activityId = options.id
      this.activityName = options.actName
      this.activityType = options.actType
      this.activityState = options.actState
    }
  },
  mounted() {
    this.getSingList()
    this.getCountNum()
  },
  onReachBottom() {
    // this.pageSize < this.total
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      //   this.getActiveList()
    }
  },
  methods: {
    //获取列表
    async getSingList() {
      let res = await signList({
        activityId: this.activityId,
        pageSize: 10,
        currentNum: 1,
      })
      this.singData = res.list
    },
    //获取统计人数
    async getCountNum() {
      let res = await getCount({ activityId: this.activityId })
      this.orderNum = res.orderNum || 0
      this.orderSucNum = res.orderSucNum || 0
      this.toAuditNum = res.toAuditNum || 0
    },
    //打开详情
    openDetailPop(item) {
      this.signId = item.id
      this.$refs.detailPop.open()
    },
    //打开编辑
    openEditPop(item, type) {
      this.editTitle = type ? '同意' : '拒绝'
      this.editType = type
      this.formData = {
        id: item.id,
        cost: item.cost,
        relList: item.relList,
      }
      console.log(this.formData)
      this.$refs.editPop.open()
    },
    //编辑提交
    editSubmit() {
      this.$refs.editPop.close()
      this.getSingList()
    },
  },
}
</script>
<style lang="scss" scoped>
.signup-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.15);
  font-family: PingFang SC;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #666;
  z-index: 1;
  .title {
    font-size: 30rpx;
    font-weight: 500;
    color: #1a1a1a;
  }
  .state {
    padding: 4rpx 10rpx;
    background: rgba(191, 196, 196, 0.15);
    border-radius: 6rpx;
    font-size: 22rpx;
  }
  .succ {
    background: rgba(10, 178, 193, 0.15);
    color: #0ab2c1;
  }
}
.signup-order {
  height: 100vh;
  padding: 200rpx 20rpx;
  box-sizing: border-box;
  font-family: PingFang SC;
  font-size: 24rpx;
  color: #666;
  .sign-item {
    padding: 20rpx;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0 5rpx 20rpx 0 rgba(0, 0, 0, 0.15);
    border-radius: 20rpx;
    margin-top: 20rpx;
    .top {
      margin-bottom: 10rpx;
      .info {
        flex: 1;
        .name {
          font-size: 28rpx;
          margin-right: 10rpx;
          font-weight: 500;
          color: #1a1a1a;
        }
      }
      .state {
        padding: 4rpx 10rpx;
        background: rgba(191, 196, 196, 0.15);
        border-radius: 6rpx;
        font-size: 22rpx;
      }
      .succ {
        background: rgba(10, 178, 193, 0.15);
        color: #0ab2c1;
      }
      .warn {
        background: rgba(248, 205, 96, 0.15);
        color: orange;
      }
      .error {
        background: rgba(247, 74, 74, 0.15);
        color: #f74a4a;
      }
    }
    .body {
      margin-bottom: 10rpx;
      .filed {
        flex: 1;
      }
      .money {
        flex-shrink: 0;
        color: #0ab2c1;
      }
    }
    .bottom {
      display: flex;
      justify-content: flex-end;
      text-align: center;
      font-size: 24rpx;
    }
  }
}
.refuse,
.agree {
  width: 136rpx;
  height: 60rpx;
  margin-left: 20rpx;
  box-sizing: border-box;
  border-radius: 30rpx;
  line-height: 60rpx;
  border: 2rpx solid;
}
.refuse {
  color: #f74a4a;
  border-color: #f74a4a;
}
.agree {
  color: #13b9c8;
  border-color: #13b9c8;
}
.noData {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  image {
    width: 129rpx;
    height: 124rpx;
    margin: 0 auto;
  }
}
</style>
