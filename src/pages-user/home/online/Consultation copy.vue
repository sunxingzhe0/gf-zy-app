<template>
  <view :class="{ 'scroll-fixed': !pageScroll }">
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="title">
      <user-search
        placeholder="搜索姓名/职称/擅长"
        @search="search()"
      ></user-search>
      <view class="shaixuan">
        <view class="score" @click="sort('avg_score')">
          <text>评分</text>
          <image :src="updateImg('avg_score')"></image>
        </view>

        <view class="number" @click="sort('treat_number')">
          <text>诊疗次数</text>
          <image :src="updateImg('treat_number')"></image>
        </view>

        <view class="screen" @click="screenC()">
          <image :src="require('@/assets/shaixuan.png')"></image>
          <text>筛选</text>
        </view>
      </view>
    </view>
    <view class="scroll">
      <view
        v-for="(item, index) in datas"
        class="item"
        :key="index"
        @click="to(item.doctorId)"
      >
        <default-img
          class="item_image"
          :url="FILE_URL(item.picId)"
        ></default-img>
        <view style="flex: 1;">
          <view>
            <text class="name">{{ item.name }}</text>
            <text class="sex">{{ item.gender || '-' }}</text>
          </view>

          <view class="details">
            <text>{{ item.deptName }}</text>
            <text>{{ item.titleName }}</text>
            <text>{{ item.orgName }}</text>
          </view>

          <view class="good">
            <text>擅长：</text>
            <text
              class="text-overflow overflow-hidden "
              style="max-width: 480rpx; flex: 1; white-space: nowrap;"
              >{{ item.goodAt }}</text
            >
          </view>

          <view class="item-score">
            <text>评分：</text>
            <text class="score-number">{{ item.comment || '-' }}</text>
            <text class="frequency">{{ item.diagNum || '-' }} 次诊疗</text>
          </view>

          <view class="operation">
            <view
              class="open"
              :class="{ close: infoDto.state == 0 }"
              v-for="(infoDto, i) in item.infoDtos"
              :key="i"
              >{{ infoDto.bizWayDesc }}:{{ infoDto.bizInfo }}</view
            >
          </view>
        </view>
      </view>
      <uni-load-more
        :status="loading"
        :contentText="{
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载数据中',
          contentnomore: '没有更多数据了',
        }"
      ></uni-load-more>
    </view>
    <uni-drawer
      class="c-drawer-layout"
      ref="drawer"
      mode="right"
      @open="pageScroll = false"
      @close="pageScroll = true"
    >
      <view class="drawer-scroll">
        <view class="drawer-title">选择业务类型</view>
        <view class="drawer-type">
          <text
            class="select-text "
            v-if="!isAppoint"
            :class="{ s: temporary_type == 'CONSULT' }"
            @click="temporary_type = 'CONSULT'"
            >在线咨询</text
          >
          <!-- <text class="select-text " :class="{ s: temporary_type == 'REPEAT_CLINIC' }" @click="temporary_type = 'REPEAT_CLINIC'">在线复诊</text> -->
          <!-- <text class="select-text " v-if="!isAppoint" :class="{ s: temporary_type == 'CARRYON_PRESC' }" @click="temporary_type = 'CARRYON_PRESC'">慢病续方</text> -->
        </view>

        <view class="line"></view>

        <view class="drawer-title">选择医生职称</view>
        <view class="doctor-title">
          <view
            class="select-text"
            :class="{ s: temporary_titleAll }"
            @click="titleAllC()"
          >
            <text>全部</text>
          </view>
          <view
            v-for="(item, index) in temporary_titleData"
            class="select-text"
            :class="{ s: item.state }"
            :key="index"
            @click="titleC(item)"
          >
            <text>{{ item.name }}</text>
          </view>
        </view>

        <view class="line"></view>

        <view class="drawer-title">选择科室</view>
        <view
          class="select-text"
          style="width: 160rpx;"
          :class="{ s: temporary_departmentAll }"
          @click="departmentAllC()"
          >全部</view
        >

        <view class="line"></view>
        <DeptList
          v-if="temporary_departmentData.length > 0"
          :list="temporary_departmentData"
          @deptChange="deptChange"
        ></DeptList>
        <!-- <uni-collapse>
          <uni-collapse-item
            v-for="(titleItem, index) in temporary_departmentData"
            :title="titleItem.name"
            :key="index"
          >
            <view class="doctor-title">
              <view
                class="select-text"
                :class="{ s: titleItem.state }"
                @click="departmentTitleC(titleItem)"
              >
                <text>{{
                  titleItem.next && titleItem.next.length > 0
                    ? '全部'
                    : titleItem.name
                }}</text>
              </view>






              <view
                v-for="(data, dataindex) in titleItem.next"
                class="select-text"
                :class="{ s: data.state && !titleItem.state }"
                :key="dataindex"
                @click="departmentItemC(titleItem, data)"
              >
                <text>{{ data.name }}</text>
              </view>
            </view>
          </uni-collapse-item>
        </uni-collapse> -->
      </view>
      <view class="confirm" @click="confirm()">确认</view>
    </uni-drawer>
  </view>
</template>

<script>
import {
  bizTypeList,
  // deptChooseList,
  deptOuterChooseList,
  titleChooseList,
} from '../../../common/request/index.js'
import { DeptList } from './DeptList'
export default {
  components: {
    DeptList,
  },
  data() {
    return {
      pageScroll: true,
      datas: [],
      doctorTitleS: 0, //医生职称

      temporary_departmentAll: true, //临时数据（选择返回后未点击确认 使用前次生效数据）-选中所有科室
      temporary_titleAll: true, //临时数据-所有职称
      departmentAll: true,
      titleAll: true,

      loading: 'more', //more（loading前）、loading（loading中）、noMore（没有更多了）
      temporary_type: '',
      temporary_departmentData: [],
      temporary_titleData: [],
      departmentData: [],
      titleData: [],
      selctDept: [],
      parameter: {
        searchKeywords: null, //关键字内容
        currentNum: 0, //当前页
        pages: 1, //总页数
        field: null, //排序字段(评分:avg_score,诊疗次数:treat_number)
        sorted: null, //排序方向
        bizType: '', //业务类型(CONSULT:在线咨询,REPEAT_CLINIC:在线复诊,CARRYON_PRESC:慢病续方)
        titleIds: [], //职称id集合
        deptIds: [], //科室id集合
      },
      back: false,
      isAppoint: false,
    }
  },
  onLoad(option) {
    if (option.type) {
      this.parameter.bizType = option.type
      this.temporary_type = option.type
    }
    if (option.deptId) {
      this.parameter.deptIds = [option.deptId]
      this.selctDept = [option.deptId]
      this.temporary_departmentAll = false
      this.departmentAll = false
    }
    if (option.isAppoint) {
      this.isAppoint = true
    }
    this.$nextTick(() =>
      this.init({
        type: option.type,
        title: option.title,
      }),
    )

    this.getDeptChooseList()
    this.getTitleChooseList()
  },
  onShow() {
    this.getBizTypeList()
  },
  onReachBottom() {
    if (this.parameter.pages > this.parameter.currentNum) {
      this.loading = 'loading'
      this.getBizTypeList()
    }
  },
  methods: {
    init(params) {
      if (params.title) {
        this.back = true
        uni.setNavigationBarTitle({
          title: params.title,
        })
        return
      }
      let titleName = '我的医生'
      switch (params.type) {
        case 'CONSULT':
          titleName = '在线咨询'
          break
        case 'REPEAT_CLINIC':
          titleName = '在线复诊'
          break
        case 'CARRYON_PRESC':
          titleName = '慢病续方'
          break
        default:
      }
      uni.setNavigationBarTitle({
        title: titleName,
      })

      this.$refs.drawer.open()
    },
    getBizTypeList() {
      this.parameter.currentNum++
      bizTypeList(this.parameter).then(data => {
        if (data) {
          this.datas = this.datas.concat(data.data)
          this.parameter.pages = data.pages
          this.parameter.currentNum = data.pageNum
          if (data.pageNum < data.pages) {
            this.loading = 'more'
          } else {
            this.loading = 'noMore'
          }
        }
      })
    },
    depList(arr) {
      let list = [...arr]
      list.forEach(item => {
        if (item.deptInner && item.deptInner.length > 0) {
          item.next = item.deptInner
        } else {
          if (item.next && item.next.length > 0) {
            this.depList(item.next)
          }
        }
      })
      return list
    },
    //过滤禁用科室
    deptFilter(data) {
      let list = data
        .filter(item => {
          return item.state == true
        })
        .map(item => {
          item = Object.assign({}, item)
          if (item.next && item.next.length > 0) {
            item.next = this.deptFilter(item.next)
          }
          return item
        })
      return list.filter(item => {
        return (item.next && item.next.length > 0) || item.next == null
      })
    },
    getDeptChooseList() {
      deptOuterChooseList({
        tree: true,
      }).then(data => {
        if (data) {
          this.temporary_departmentAll = this.departmentAll
          let list = data
          let deptData = this.depList(list)
          let deptfilData = this.deptFilter(deptData)
          this.temporary_departmentData = list
          this.departmentData = this.temporary_departmentData
          console.log(this.temporary_departmentData)
        }
      })
    },
    getTitleChooseList() {
      titleChooseList().then(data => {
        if (data) {
          this.titleData = data
          this.temporary_titleAll = this.titleAll
          this.temporary_titleData = JSON.parse(JSON.stringify(this.titleData))
        }
      })
    },
    sort(field) {
      if (field == this.parameter.field) {
        if (this.parameter.sorted == 'desc') {
          this.parameter.sorted = 'asc'
        } else if (this.parameter.sorted == 'asc') {
          this.parameter.sorted = null
          this.parameter.field = null
        }
      } else {
        this.parameter.field = field
        this.parameter.sorted = 'desc'
      }
      this.parameter.currentNum = 0
      this.datas = []
      this.getBizTypeList()
    },
    updateImg(field) {
      let paixuImg = require('@/assets/paixu.png')

      if (this.parameter.field == field) {
        if (this.parameter.sorted == 'desc') {
          paixuImg = require('@/assets/paixu_desc.png')
        } else if (this.parameter.sorted == 'asc') {
          paixuImg = require('@/assets/paixu_asc.png')
        }
      }
      return paixuImg
    },
    search(value) {
      this.parameter.searchKeywords = value
      this.parameter.currentNum = 0
      this.datas = []
      this.getBizTypeList()
    },
    screenC() {
      //将筛选条件赋值给临时数据
      this.temporary_departmentAll = this.departmentAll
      // this.temporary_departmentData = JSON.parse(
      //   JSON.stringify(this.departmentData),
      // )
      this.temporary_departmentData = this.departmentData
      this.temporary_titleAll = this.titleAll
      this.temporary_titleData = JSON.parse(JSON.stringify(this.titleData))
      this.temporary_type = this.parameter.bizType
      this.$refs.drawer.open()
      this.pageScroll = false
    },
    departmentTitleC(item) {
      item.state = !item.state
      item.next.forEach(data => {
        data.state = false
      })
    },
    deptChange(item) {
      if (this.selctDept.indexOf(item.id) < 0) {
        this.selctDept.push(item.id)
      } else {
        this.selctDept.splice(this.selctDept.indexOf(item.id), 1)
      }

      this.temporary_departmentAll = this.selctDept.length <= 0
      let list = this.updateDept(this.temporary_departmentData)
      this.temporary_departmentData = list
      console.log(this.temporary_departmentData)
    },

    updateDept(arr) {
      return arr.map(item => {
        if (item.next) {
          this.updateDept(item.next)
        } else {
          item.active = this.selctDept.indexOf(item.id) > -1
        }
        return item
      })
    },

    departmentItemC(title, item) {
      if (title.state) {
        title.state = false
        if (this.temporary_departmentAll) {
          this.temporary_departmentAll = false
          //将所有选项取消选中
          this.temporary_departmentData.forEach(d => {
            d.state = false
            if (d.next) {
              d.next.forEach(data => {
                data.state = false
              })
            }
          })
        }
      }
      item.state = !item.state
    },
    departmentAllC() {
      this.temporary_departmentAll = !this.temporary_departmentAll
      if (this.temporary_departmentAll) {
        this.selctDept = []
        let list = this.updateDept(this.temporary_departmentData)
        this.temporary_departmentData = list
      }
    },

    titleAllC() {
      this.temporary_titleAll = !this.temporary_titleAll
      this.temporary_titleData.forEach(item => {
        item.state = false
      })
    },
    titleC(itemD) {
      if (this.temporary_titleAll) {
        this.temporary_titleAll = false
        this.temporary_titleData.forEach(item => {
          item.state = false
        })
      }
      itemD.state = !itemD.state
      this.$forceUpdate()
    },
    confirm() {
      //设置科室id集合
      this.parameter.deptIds = this.selctDept
      if (this.temporary_departmentAll) {
        this.selctDept = []
      }
      // this.temporary_departmentData.forEach(data => {
      //   if (this.temporary_departmentAll || data.state) {
      //     //防止无二级目录的情况下查询不了数据
      //     this.parameter.deptIds.push(data.id)
      //   }
      //   if (data.next) {
      //     data.next.forEach(itemD => {
      //       if (this.temporary_departmentAll || data.state || itemD.state) {
      //         this.parameter.deptIds.push(itemD.id)
      //       }
      //     })
      //   }
      // })
      //设置职称id集合
      this.parameter.titleIds = []
      this.temporary_titleData.forEach(data => {
        if (this.temporary_titleAll || data.state) {
          this.parameter.titleIds.push(data.id)
        }
      })
      //将临时数据赋值给正式筛选数据
      this.departmentAll = this.temporary_departmentAll
      this.departmentData = JSON.parse(
        JSON.stringify(this.temporary_departmentData),
      )
      this.titleAll = this.temporary_titleAll
      this.titleData = JSON.parse(JSON.stringify(this.temporary_titleData))
      this.parameter.bizType = this.temporary_type

      this.$refs.drawer.close()
      this.parameter.currentNum = 0
      this.datas = []
      this.getBizTypeList()
    },
    to(id) {
      if (this.back) {
        this.$store.dispatch('setAppointmentClinicDoctorId', id)
        // this.$store.dispatch('setAppointmentClinicDeptId', id)
        uni.navigateBack({
          delta: 1,
        })
        return
      }
      uni.navigateTo({
        url:
          '../doctordetail/DoctorDetail?type=' +
          this.parameter.bizType +
          '&doctorId=' +
          id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 2;
  padding-bottom: 20upx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0upx 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
  border-radius: 0upx 0upx 20upx 20upx;
}

.shaixuan {
  display: flex;
  justify-content: flex-end;
  margin-top: 38upx;

  .score {
    margin-right: 119upx;

    text {
      font-size: 26upx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    image {
      width: 12upx;
      height: 16upx;
      margin-left: 10upx;
    }
  }

  .number {
    margin-right: 193upx;

    text {
      font-size: 26upx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    image {
      width: 12upx;
      height: 16upx;
      margin-left: 10upx;
    }
  }

  .screen {
    margin-right: 30upx;

    text {
      font-size: 26upx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-left: 10upx;
    }

    image {
      width: 30upx;
      height: 30upx;
    }
  }
}

.scroll {
  padding: 234rpx 20rpx 20rpx;

  .item {
    padding: 20upx 15upx;
    width: 680upx;
    min-height: 280upx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0upx 5upx 20upx 0upx rgba(0, 0, 0, 0.15);
    border-radius: 20upx;
    margin-bottom: 20upx;
    display: flex;

    .item_image {
      margin-right: 15rpx;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
    }

    .name {
      font-size: 30upx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
    }

    .sex {
      margin-left: 44upx;
      font-size: 24upx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
    }

    .details {
      font-size: 24upx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);

      text {
        margin-right: 20upx;
      }
    }

    .good {
      display: flex;
      font-size: 24upx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
    }

    .item-score {
      font-size: 24upx;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      display: flex;
      align-items: center;

      .score-number {
        font-size: 34upx;
        font-weight: 500;
        color: #ffa200;
        line-height: 36px;
      }

      .frequency {
        font-size: 24upx;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        margin-left: 46upx;
      }
    }

    .operation {
      display: flex;

      .open {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 120rpx;
        max-width: 150rpx;
        height: 46upx;
        background: rgba(208, 242, 245, 1);
        border-radius: 6upx;
        font-size: 20upx;
        font-weight: 500;
        color: rgba(10, 178, 193, 1);
        text-align: center;
        line-height: 46upx;
        padding: 0upx 10upx;
        margin-right: 20upx;

        &.close {
          margin-right: 20upx;
          background: rgba(242, 242, 242, 1);
          color: rgba(153, 153, 153, 1);
        }
      }

      .close {
        margin-right: 20upx;
        // padding: 0upx 10upx;
        // height: 46upx;
        background: rgba(242, 242, 242, 1);
        // border-radius: 6upx;
        // font-size: 20upx;
        // font-weight: 500;
        color: rgba(153, 153, 153, 1);
        // text-align: center;
        // line-height: 46upx;
      }
    }
  }
}

.c-drawer-layout {
  .line {
    margin: 30rpx 0rpx;
    width: 600rpx;
    height: 1rpx;
    background: rgba(230, 230, 230, 1);
  }

  .drawer-title {
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(26, 26, 26, 1);
  }

  .drawer-type {
    display: flex;
    flex-wrap: wrap;
  }

  .select-text {
    min-width: 150rpx;
    padding: 0rpx 5rpx;
    height: 60rpx;
    background: rgba(242, 242, 242, 1);
    border-radius: 30rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    line-height: 60rpx;
    text-align: center;
    margin: 30rpx 30rpx 0rpx 0rpx;

    &.s {
      background: rgba(10, 178, 193, 1);
      color: rgba(255, 255, 255, 1);
    }
  }

  .doctor-title {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10rpx;
  }

  .drawer-scroll {
    padding-left: 29rpx;
    padding-top: 40rpx;
    height: 89%;
    overflow: hidden auto;
  }

  .confirm {
    position: absolute;
    bottom: 0rpx;
    width: 600rpx;
    height: 88rpx;
    background: rgba(10, 178, 193, 1);

    font-size: 30rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 88rpx;
  }
}
::v-deep .uni-drawer--right {
  -webkit-transform: translateX(600rpx) !important;
  transform: translateX(600rpx) !important;
}
::v-deep .uni-drawer {
  .uni-drawer__content {
    width: 600rpx !important;
  }
}
::v-deep .uni-drawer__content--visible {
  -webkit-transform: translateX(0rpx) !important;
  transform: translateX(0rpx) !important;
}
// .data-v-8f47561c
::v-deep.uni-collapse-cell--open {
  background-color: #ffffff !important;
}

::v-deep.uni-collapse-cell__title.data-v-05a53ffd {
  padding: 0rpx 30rpx 0rpx 0rpx;
}
.scroll-fixed {
  height: 100%;
  overflow: hidden;
}
</style>
