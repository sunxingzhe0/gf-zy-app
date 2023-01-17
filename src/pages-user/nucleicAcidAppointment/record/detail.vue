<template>
  <view class="wrap">
    <!--主页按钮-->
    <homeIcom />
    <app-card
      class="appcard"
      styles="padding:20rpx 30rpx; padding-right:0; position:relative;"
    >
      <app-list-item
        label="姓名"
        class="appItem"
        :styles="itemStyle"
        :value="info.name"
      >
      </app-list-item>
      <app-list-item
        label="身份证"
        class="appItem"
        :styles="itemStyle"
        :value="
          info.idCard
            ? info.idCard.substr(0, 4) + '**********' + info.idCard.substr(-3)
            : ''
        "
      >
      </app-list-item>
      <app-list-item
        label="联系电话"
        :styles="itemStyle"
        :value="
          info.phone
            ? info.phone.substr(0, 3) + '****' + info.phone.substr(-4)
            : ''
        "
        class="appItem"
      >
      </app-list-item>
      <app-list-item
        label="预约项目"
        :styles="itemStyle"
        :value="info.orderItem"
        class="appItem"
      >
      </app-list-item>
      <app-list-item
        label="预约时间"
        :styles="itemStyle"
        :value="info.rangeTime"
        class="appItem"
      >
      </app-list-item>
      <app-list-item
        label="价格"
        :styles="itemStyle"
        :value="`￥${info.price}`"
        class="appItem"
        noBorder
      >
      </app-list-item>
    </app-card>
    <app-card
      class="appcard"
      styles="padding:20rpx 30rpx; padding-right:0; position:relative;"
    >
      <app-list-item
        label="预约单号"
        :styles="{ ...itemStyle, paddingBottom: 0 }"
        :value="info.name"
        class="appItem"
        noBorder
      >
        <view class="flex_1 flex-between">
          <view>{{ info.orderId }}</view>
          <view @click="onCopy" class="copy">复制</view>
        </view>
      </app-list-item>
      <app-list-item
        label="下单时间"
        :styles="{ ...itemStyle, paddingTop: 0 }"
        :value="info.createTime"
        class="appItem"
      >
      </app-list-item>
      <app-list-item
        v-if="info.payTime"
        label="支付时间"
        :styles="{ ...itemStyle, paddingBottom: 0 }"
        :value="info.payTime"
        class="appItem"
        noBorder
      >
      </app-list-item>
      <app-list-item
        v-if="getPaytype(info.payWay)"
        label="支付方式"
        :styles="{ ...itemStyle, paddingTop: 0 }"
        :value="getPaytype(info.payWay)"
        class="appItem"
      >
      </app-list-item>
      <!-- <app-list-item
        label="购买人"
        :styles="{ ...itemStyle, alignItems: 'center' }"
        :value="info.rangeTime"
        class="appItem"
        noBorder
      >
        <view class="flex_1 flex-start-center">
          <default-img
            style="
                width: 70rpx;
                height: 70rpx;
                border-radius: 50%;
                overflow: hidden;
                margin-right:10rpx;
              "
            :isPreview="false"
            :url="FILE_URL(info.picId)"
          ></default-img>
          <text>{{ info.userName }}</text>
        </view>
      </app-list-item> -->
    </app-card>
  </view>
</template>
<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import { userRegDetail } from '../api/index'
export default {
  components: {
    AppCard,
    AppListItem,
  },
  data() {
    return {
      info: {},
      itemStyle: {
        padding: '20rpx',
        paddingLeft: 0,
      },
    }
  },
  onLoad(options) {
    console.log(options)
    this.id = options.id
    options.bizId && (this.id = options.bizId)
    this.getuserRegDetail()
  },
  methods: {
    getPaytype(val) {
      let str = ''
      switch (val) {
        case 'WECHAT_PAY':
          str = '微信支付'
          break
        case 'ALI_PAY':
          str = '支付宝支付'
          break
        case 'OFFLINE_PAY':
          str = '线下支付'
        case 'ICBC_PAY':
          str = '微信支付'
          break
      }
      return str
    },
    onCopy() {
      // #ifdef MP-WEIXIN
      wx.setClipboardData({
        //准备复制的数据
        data: this.info.orderId,
        success: function(res) {
          wx.showToast({
            title: '复制成功',
          })
        },
      })
      // #endif

      // #ifdef H5
      this.$copyText(this.info.orderId).then(
        function(e) {
          uni.showToast({
            icon: 'success',
            title: '复制成功',
          })
        },
        function(e) {
          uni.showToast({
            icon: 'none',
            title: '复制失败',
          })
        },
      )
      // #endif
    },
    async getuserRegDetail() {
      this.info = await userRegDetail({ id: this.id })
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 20rpx;
  .copy {
    color: $uni-color-primary;
  }
}
</style>
