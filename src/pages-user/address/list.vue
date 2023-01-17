<template>
  <view class="doctorWrap">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="search flex-between box-shadow">
      <input
        type="text"
        style="width: 100%;"
        placeholderClass="searchtext"
        v-model="keywords"
        placeholder="按收货人/详细地址搜索"
      />
      <uni-icons
        type="search"
        class="searchIcon"
        size="20"
        @click="getaddressList"
      ></uni-icons>
    </view>
    <view>
      <view
        class="list box-shadow"
        :class="select == 'orderSubmit' ? 'pointer' : ''"
        v-for="(item, index) in list"
        :key="index"
        @click="selectDress(item)"
      >
        <view class="info">
          <view class="name flex-between">
            <view>{{ item.name }}</view>
            <text>{{ item.phone }}</text>
          </view>
          <view class="des"
            >{{ item.province }} {{ item.city }} {{ item.region }}
            {{ item.detailAddress }}</view
          >
          <view class="flex-between mt20">
            <view style="display:flex;align-items: center;">
              <evan-checkbox
                v-model="item.defaultStatus"
                shape="square"
                @change="defauChange($event, item)"
                :primary-color="primaryColor"
              >
              </evan-checkbox>
              <text style="margin-left:3px" class="checkText">默认地址</text>
            </view>
            <view class="flex-start-center opt">
              <view @click="del(item.id)">
                <text class="iconfont icon-shanchu"></text>
                删除
              </view>
              <view @click="add(item)">
                <text class="iconfont icon-bianji"></text>
                编辑
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <button class="submit_btn" type="primary" @click="add()">
      +新建收货地址
    </button>
  </view>
</template>

<script>
import evanCheckbox from '@/components/evan-checkbox/evan-checkbox.vue'
import {
  addressList,
  addressDel,
  addresssetDefault,
} from '@/common/request/userCenter'
export default {
  components: {
    evanCheckbox,
  },
  data() {
    return {
      more: 'loading',
      checked: false,
      primaryColor: '#0AB2C1',
      keywords: '',
      list: [],
      select: '',
    }
  },
  onLoad(options) {
    if (options.page == 'orderSubmit') {
      this.select = options.page
    }
  },
  onShow() {
    this.getaddressList()
  },
  methods: {
    //获取地址列表
    async getaddressList() {
      uni.showLoading()
      this.list = await addressList({
        keywords: this.keywords,
      })
      uni.hideLoading()
    },
    del(id) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该地址吗？',
        success: async res => {
          if (res.confirm) {
            await addressDel({
              addressId: id,
            })
            uni.showToast({
              title: '删除成功',
            })
            this.getaddressList()
          } else if (res.cancel) {
          }
        },
      })
    },
    async defauChange(e, item) {
      console.log(e)
      console.log(item)
      if (e) {
        await addresssetDefault({
          addressId: item.id,
        })
        uni.showToast({
          title: '设置成功',
        })
      }
      await this.getaddressList()
    },
    add(row) {
      console.log(row)
      let data = ''
      if (row) {
        data = encodeURIComponent(JSON.stringify(row))
      }
      wx.navigateTo({
        url: `/pages-user/address/add${data ? '?row=' + data : ''}`,
      })
    },
    selectDress(item) {
      if (this.select == 'orderSubmit') {
        let pages = getCurrentPages()
        let currPage = pages[pages.length - 1] //当前页面
        let prevPage = pages[pages.length - 2] //上一个页面
        //可以打印prevPage看看
        console.log(prevPage)
        //#ifdef H5
        prevPage.address = item
        //#endif
        //#ifdef MP-WEIXIN
        prevPage.setData({
          address: item,
        })
        //#endif
        uni.navigateBack()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.doctorWrap {
  padding: 20rpx 30rpx;
  padding-bottom: 120rpx;
}

.search {
  background: #fff;
  padding: 0 20rpx 0 32rpx;
  border-radius: 36rpx !important;
  height: 72rpx;
  line-height: 72rpx;

  .searchtext {
    font-size: 28rpx;
    color: #999;
  }

  .searchIcon {
    color: #888 !important;
  }
}

.pointer {
  cursor: pointer;
}

.list {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-top: 20rpx;
  align-items: flex-start;

  // cursor: pointer;
  .info {
    box-sizing: border-box;

    .name {
      color: #1a1a1a;
      font-size: 30rpx;
      font-weight: bolder;

      text {
        font-size: 24rpx;
        color: #666;
        font-weight: normal;
        margin-left: 44rpx;
      }
    }

    .des {
      font-size: 24rpx;
      color: #666;
      margin-top: 14rpx;
    }

    ::v-deep.evan-checkbox__label {
      font-size: 28rpx;
    }

    ::v-deep.evan-checkbox__inner {
      width: 16px !important;
      height: 16px !important;
    }

    .checkText {
      font-size: 28rpx;
      color: #666;
    }

    .mt20 {
      margin-top: 20rpx;
    }

    .opt {
      view {
        font-size: 26rpx;
        color: #666;
        margin-left: 30rpx;

        text {
          font-size: 26rpx;
          color: #666;
          margin-right: 6rpx;
        }
      }
    }
  }
}
</style>
