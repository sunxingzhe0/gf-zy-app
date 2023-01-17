<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <view class="visit flex-between">
        <view class="title">就诊人</view>
        <view class="name" style="color:#666" @click="selecvisit">
          {{ selectName }}
          <uni-icons
            type="arrowright"
            color="#666"
            class="rightIcon"
            :size="12"
          ></uni-icons>
        </view>
      </view>
      <view class="tabList flex-between">
        <view
          :class="['tabItem', current == item.value ? 'on' : '']"
          @click="tabTap(item.value)"
          v-for="(item, index) in items"
          :key="index"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <view class="listWrap">
      <view class=" tips font24 color666"
        >*单条就诊记录授权开启后，患者的所有接诊医生，可以默认已
        获得授权可查看就诊记录详情</view
      >
      <view
        class="listItem box-shadow"
        v-for="(item, index) in list"
        :key="index"
        @click="goto(item)"
      >
        <view class="list_a">
          <text
            >{{ item.medicalType == 'MZ' ? '门诊记录' : ''
            }}{{ item.medicalType == 'ZY' ? '住院记录' : ''
            }}<!-- {{ item.medicalType == 'TJ' ? '体检报告' : '' }} --></text
          >
          <text>{{ item.createTime }}</text>
        </view>
        <view class="name">{{ item.patientName || '' }}</view>
        <view class="list_b">
          <text>{{ item.deptName || '' }}</text>
          <text>{{ item.doctorName || '' }}</text>
          <text>{{ item.title || '' }}</text>
        </view>
        <view class="list_c" v-if="item.medicalType == 'MZ' && item.diagnose">
          <text>初步诊断：</text>
          {{ item.diagnose || '-' }}
        </view>
        <view
          class="list_c"
          v-if="item.medicalType == 'MZ' && item.disposeAdvise"
        >
          <text>治疗意见：</text>
          {{ item.disposeAdvise.replaceAll('\n', '') || '-' }}
        </view>
        <view class="list_c" v-if="item.medicalType == 'TJ'">
          <text>体检单号：</text>
          {{ item.visitNo || '-' }}
        </view>
        <view class="list_c" v-if="item.medicalType == 'TJ'">
          <text>体检内容：</text>
          {{ item.content || '-' }}
        </view>
        <view class="list_c" v-if="item.medicalType == 'TJ'">
          <text>体检时间：</text>
          {{ item.createTime || '-' }}
        </view>
        <view class="list_c" v-if="item.medicalType == 'ZY'">
          <text>入院诊断：</text>
          {{ item.inDiagnose || '-' }}
        </view>
        <view class="list_c" v-if="item.medicalType == 'ZY'">
          <text>出院诊断：</text>
          {{ item.outDiagnose || '-' }}
        </view>
        <!-- <view class="flex-between list_d" @click.stop>
          <view>授权所有接诊医生查看</view>
          <switch
            class="listswitch"
            :checked="item.open"
            @change="switchChange(item, index)"
            :color="themeColor"
          />
        </view> -->
        <view class="list_e" v-if="item.type == 'outer'"
          ><text>互联网</text></view
        >
      </view>
      <uni-load-more v-show="pages > 0" :status="more"></uni-load-more>
    </view>
    <pop-select
      ref="popselect"
      @submit="selectSubmit"
      title="就诊人"
      :multi="true"
      :list="selectList"
      @change="radioChangeType"
    ></pop-select>
  </view>
</template>

<script>
import popSelect from '@/components/pop-select'
import {
  archiveList,
  changeAuth,
  patientList,
} from '@/common/request/userCenter'
export default {
  components: {
    popSelect,
  },
  data() {
    return {
      current: 'outer',
      pageSize: 10,
      currentNum: 1,
      pages: 0,
      items: [
        {
          name: '在线就诊记录',
          value: 'outer',
        },
        {
          name: '门诊记录',
          value: 'MZ',
        },
        {
          name: '住院记录',
          value: 'ZY',
        },
        // {
        //   name: '体检报告',
        //   value: 'TJ',
        // },
      ],
      themeColor: '#0AB2C1',
      selectActive: [],
      selectName: '',
      selectList: [],
      more: 'more',
      list: [],
    }
  },
  onLoad() {
    this.getpatient()
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum += 1
      this.getarchiveList()
    } else {
      this.more = 'noMore'
    }
  },
  methods: {
    // 就诊人列表
    async getpatient() {
      let res = await patientList()
      this.selectList = res.map(item => {
        if (item.def) {
          this.selectActive = [item.memberId]
          this.selectName = item.name
        }
        return {
          name: item.name,
          value: item.memberId,
          checked: item.def,
        }
      })
      if (this.selectList.length > 0) {
        //默认选择第一个就诊人
        this.selectActive = [this.selectList[0]?.value]
        this.selectName = this.selectList[0]?.name
        this.selectList[0].checked = true
      }
      this.getarchiveList()
    },
    // 档案列表
    getarchiveList() {
      const data = {
        pageSize: this.pageSize,
        currentNum: this.currentNum,
        userId: uni.getStorageSync('userId'),
        orgId: uni.getStorageSync('orgId'),
        memberIds: this.selectActive
          .filter(item => {
            return item != 'all'
          })
          .join(','),
        type: this.current == 'outer' ? 'outer' : 'inner',
        medicalType: this.current == 'outer' ? '' : this.current,
      }
      this.more = 'loading'
      archiveList(data).then(res => {
        this.list = this.list.concat(res.data)
        this.pages = res.pages
        this.more = this.currentNum < this.pages ? 'more' : 'noMore'
      })
    },
    // 选择确诊人
    selecvisit() {
      this.$refs.popselect.open()
    },
    goto(item) {
      if (item.medicalType == 'TJ') {
        uni.navigateTo({
          url: `/pages-zy/physical/report/detail?checkupNo=${item.visitNo}&patientId=${item.memberId}`,
        })
      }
      if (item.medicalType == 'ZY') {
        uni.navigateTo({
          url: `/pages-zy/hospRecords/detail?inSno=${item.inSno}&times=${
            item.visitNo.match(/_(\S*)/)[1]
          }&beginTime=${item.admitDate}&endTime=${item.dischargeDate}&cardNo=${
            item.cardNo
          }`,
        })
      } else {
        uni.navigateTo({
          url: '/pages-user/healthRecords/detail?id=' + item.id,
        })
      }
      // uni.navigateTo({
      //   url: '/pages-user/healthRecords/detail?id=' + item.id,
      // })
    },
    radioChangeType(e) {
      console.log(e)
      this.selectActive = e
    },
    selectSubmit() {
      let list = []
      if (this.selectActive == '') {
        uni.showToast({
          title: '请选择就诊人',
        })
        return false
      }
      const newArr = []
      for (let i = 0; i < this.selectList.length; i++) {
        for (let j = 0; j < this.selectActive.length; j++) {
          if (
            this.selectActive[j] === this.selectList[i].value &&
            this.selectActive[j] != 'all'
          ) {
            newArr.push(this.selectList[i].name)
          }
        }
      }
      this.selectName = newArr.join(',')
      this.$refs.popselect.close()
      this.currentNum = 1
      this.list = []
      this.getarchiveList()
    },

    tabTap(e) {
      console.log(e)
      if (this.current !== e) {
        this.current = e
        this.currentNum = 1
        this.list = []
        this.getarchiveList()
      }
    },
    async switchChange(item, index) {
      await changeAuth({
        userId: uni.getStorageSync('userId'),
        memberId: item.memberId,
        medicalId: item.id,
      })
      this.list[index].open = !item.open
      uni.showToast({
        title: '操作成功',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.tabList {
  padding-right: 40rpx;

  .tabItem {
    margin-right: 0;
  }
}

.headerTop {
  padding-left: 30rpx;
  background: #fff;
  border-radius: 0 0 20rpx 20rpx !important;
  border-top: 1px solid #e6e6e6 !important;
  position: fixed;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 5;
}

.visit {
  font-size: 26rpx;
  padding-right: 30rpx;
  border-bottom: 1px solid #e6e6e6;
  height: 80rpx;

  .title {
    color: #666;
    width: 200rpx;
  }

  .name {
    color: #1a1a1a;
    font-weight: normal;
  }

  ::v-deep.rightIcon {
    color: #ccc !important;
  }
}

.tab {
  padding-right: 73rpx;
  padding-left: 43rpx;
  height: auto;
  padding-top: 26rpx;

  ::v-deep.segmented-control__item--text {
    border-bottom-width: 2px;
    -webkit-box-flex: initial;
    -webkit-flex: none;
    flex: none;
  }

  ::v-deep.segmented-control__text {
    font-size: 28rpx;
    padding-bottom: 16rpx;
  }
}

.listWrap {
  padding: 0 30rpx;
  padding-top: 190rpx;

  .tips {
    padding: 20rpx;
    background: #e6e6e6;
    margin-bottom: 10rpx;
    margin-bottom: 20rpx;
  }

  .listItem {
    background: #fff;
    padding: 40rpx 30rpx;
    position: relative;
    overflow: hidden;
    margin-bottom: 20rpx;

    .listswitch {
      transform: scale(0.6);
      -webkit-transform: scale(0.7);

      ::v-deep.uni-switch-input:before {
        background: #ccc;
      }
    }

    .list_a {
      font-size: 26rpx;
      color: #1a1a1a;
      border-bottom: 0;
      padding-bottom: 0;

      text {
        margin-right: 60rpx;
      }
    }

    .name {
      font-size: 32rpx;
      margin-top: 30rpx;
      font-weight: bold;
    }

    .list_b {
      font-size: 26rpx;
      color: #666;
      margin-top: 6rpx;

      text {
        margin-right: 20rpx;
      }
    }

    .list_c {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 28rpx;
      color: #333;

      text {
        color: #666;
      }
    }

    .list_d {
      font-size: 28rpx;
      color: #666;
      margin-top: 20rpx;
    }

    .list_e {
      font-size: 34rpx;
      text-align: center;
      color: #fff;
      position: absolute;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      height: 64rpx;
      line-height: 64rpx;
      background: $uni-color-primary;
      top: 30rpx;
      right: -100rpx;
      width: 340rpx;
    }
  }
}
</style>
