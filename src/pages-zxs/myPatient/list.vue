<template>
  <view>
    <view class="layout">
      <view class="flex-between search">
        <!-- <view class="flex-between search-name" @click="searchProjectC">
          <text>全部</text>
          <text class="iconfont icon-xiangyou" style="font-size: 10rpx"></text>
        </view> -->
        <view class="flex-between search-wrapper">
          <input
            v-model="filterText"
            class="input"
            placeholder="关键字查找"
            placeholder-style="color:#999;"
          />
          <text class="iconfont icon-sousuo" @click="searchC"></text>
        </view>
      </view>
    </view>
    <view class="content-list">
      <view class="list-item" v-for="(item, index) in listData" :key="index">
        <view v-if="item.patientList.length" class="flex-between"
          ><view class="title">{{ item.groupName || '未分组' }}</view>
          <view>
            <text
              v-if="item.groupName"
              @click="editGroupName(item)"
              class="iconfont icon-bianji"
              style="color:#0AB2C1"
            ></text>
            <text
              @click="handleDelGroup(item)"
              style="color:#0AB2C1;margin-left: 20rpx;"
              v-if="item.groupName"
              class="iconfont icon-shanchu1"
            ></text>
          </view>
        </view>
        <view>
          <view
            class="patient app-card"
            v-for="(v, i) in item.patientList"
            :key="i"
          >
            <view class="left flex-between">
              <view style="color:#666">
                <text style="font-size:30rpx;color:#1A1A1A">{{
                  v.patientName
                }}</text>
                {{
                  `${v.sex == 1 ? '男' : '女'} ${GetAgeAndSexByIDNum(
                    v.idCard,
                  ) || '-'}｜${v.cardNo}`
                }}
                <text v-if="v.severePatient" class="color-red">重精</text>
              </view>
              <view style="color:#666">{{ '就诊次数：' + v.diagCount }}</view>
            </view>
            <view class="right" :class="!ismovemorre ? 'flex-end' : ''">
              <checkbox-group v-if="ismovemorre" @change="checkItem(v, $event)">
                <checkbox color="#0AB2C1" value="cb" :checked="false" />
              </checkbox-group>
              <view
                class="flex-between"
                :style="ismovemorre ? 'width: 100%' : ''"
              >
                <view class="mini_btn" @click="moveGroup(0, v)">移动</view>
                <view class="mini_btn primary_btn" @click="seeInfo(v)"
                  >查看</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="btns" v-if="!ismovemorre">
      <view class="mini_btn btn" @click="moveMore">批量移动</view>
      <view class="mini_btn btn primary" @click="addGroup">新增分组</view>
    </view>
    <view class="btns" v-else>
      <view class="mini_btn btn" @click="cancelMove">取消</view>
      <view class="mini_btn btn primary" @click="moveGroup(1)">移动到</view>
    </view>
    <uni-popup ref="projectP" type="bottom">
      <view v-if="popTitle === '选择项目'" class="pop-view">
        <view class="title"
          >{{ popTitle }}
          <view class="icon" @click="cancelPop">
            <uni-icons :size="22" color="#e6e6e6" type="clear" />
          </view>
        </view>
        <picker-view
          style="height: 200px; text-align: center"
          :indicator-style="indicatorStyle"
          :value="checkValue"
          @change="projectChange"
        >
          <picker-view-column>
            <view v-for="(v, index) in itemNames" :key="index" class="item">{{
              v
            }}</view>
          </picker-view-column>
        </picker-view>

        <view @click="confirm" class="confirm">确认</view>
      </view>
      <view
        v-if="popTitle === '新增分组' || popTitle === '编辑分组'"
        class="pop-view add-group"
      >
        <view class="title"
          >{{ popTitle }}
          <view class="icon" @click="cancelPop">
            <uni-icons :size="22" color="#e6e6e6" type="clear" />
          </view>
        </view>
        <view class="wrap">
          <view class="group-title">分组名称</view>
          <input
            v-model="inpVal"
            class="input"
            placeholder="请输入"
            placeholder-style="color:#999;"
          />
        </view>
        <view @click="confirm" class="confirm">确认</view>
      </view>
      <view v-if="popTitle === '移动分组'" class="pop-view">
        <view class="title"
          >{{ popTitle }}
          <view class="icon" @click="cancelPop">
            <uni-icons :size="22" color="#e6e6e6" type="clear" />
          </view>
        </view>
        <picker-view
          style="height: 200px; text-align: center"
          :indicator-style="indicatorStyle"
          :value="checkValue"
          @change="projectChange"
        >
          <picker-view-column>
            <view v-for="(v, index) in groupList" :key="index" class="item">{{
              v.name
            }}</view>
          </picker-view-column>
        </picker-view>

        <view @click="confirm" class="confirm">确认</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  myGroupList,
  addGroup,
  editGroup,
  moveGroup,
  patientGroupTree,
  delGroup,
} from '@/pages-zxs/api/myPatient'
import { GetAgeAndSexByIDNum } from '@/common/util'
export default {
  data() {
    return {
      ischecked: false,
      inpVal: '',
      popTitle: '',
      filterText: '',
      itemNames: ['全部'], //
      groupOptions: ['全部'], //
      checkValue: [0],
      indicatorStyle: `height: 80rpx;`, //height: 50rpx;
      listData: [],
      checkLists: [],
      ismovemorre: false,
      groupList: [],
      row: {},
      checkIndex: 0,
      isMoreMove: false,
      rowpatient: {},
    }
  },
  onLoad() {
    this.getListDate()
    this.getGroupList()
  },
  methods: {
    GetAgeAndSexByIDNum,
    editGroupName(item) {
      this.$refs.projectP.open()
      this.popTitle = '编辑分组'
      this.inpVal = item.groupName
      this.row = item
    },
    cancelMove() {
      this.ismovemorre = false
      this.checkLists = []
    },
    //moveMore
    moveMore() {
      this.ismovemorre = true
    },
    checkItem(item, event) {
      //选中一项
      if (event.detail.value.length) {
        this.checkLists.push(item)
        console.log(this.checkLists)
        return
      }
      this.checkLists = this.checkLists.filter(v => v.id != item.id)
      console.log(this.checkLists)
    },
    async getListDate() {
      console.log(this.filterText)
      this.listData = await patientGroupTree({ keyword: this.filterText })
    },
    async getGroupList() {
      const res = await myGroupList({
        doctorId: uni.getStorageSync('userInfo').userId,
      })

      this.groupList = res.reduce((pre, next) => {
        if (!pre.some(v => v.name === next.name)) {
          pre.push(next)
        }
        return pre
      }, [])
    },
    projectChange(event) {
      console.log('切换项目：', event.detail.value)
      this.checkValue = event.detail.value
      this.checkIndex = event.detail.value[0]
    },
    searchC() {
      console.log('搜索')
      this.getListDate()
    },
    searchProjectC() {
      this.$refs.projectP.open()
      this.popTitle = '选择项目'
    },
    cancelPop() {
      this.$refs.projectP.close()
    },
    //确认新增分组
    async handleAddGroup() {
      await addGroup({ name: this.inpVal })
      uni.showToast({
        title: '操作成功！',
        icon: 'none',
      })
      this.inpVal = ''
      this.getGroupList()
    },
    async confirmEditGroup() {
      console.log(this.row, this.inpVal)
      await editGroup({ id: this.row.groupId, name: this.inpVal })
      uni.showToast({
        title: '编辑成功！',
        icon: 'none',
      })
      this.getListDate()
    },
    async confirmMoveGroup() {
      const params = {
        id: this.groupList[this.checkIndex].id,
        patientIds: this.isMoreMove
          ? this.checkLists.map(v => v.patientId)
          : [this.rowpatient.patientId],
      }
      await moveGroup(params)
      uni.showToast({
        title: '操作成功！',
        icon: 'none',
      })
      this.getListDate()
      this.ismovemorre = false
      console.log('移动分组--参数', params)
    },
    confirm() {
      this.$refs.projectP.close()
      if (this.popTitle === '选择项目') return
      if (this.popTitle === '新增分组') return this.handleAddGroup()
      if (this.popTitle === '移动分组') return this.confirmMoveGroup()
      if (this.popTitle === '编辑分组') return this.confirmEditGroup()
    },
    addGroup() {
      this.$refs.projectP.open()
      this.popTitle = '新增分组'
    },
    moveGroup(type, item) {
      if (type) {
        if (!this.checkLists.length)
          return uni.showToast({
            title: '请选择',
            icon: 'none',
          })
        this.isMoreMove = true
      } else {
        this.isMoreMove = false
        this.rowpatient = item
      }

      this.$refs.projectP.open()
      this.popTitle = '移动分组'
    },
    seeInfo(row) {
      console.log('详情', row)
      uni.navigateTo({
        url: `/pages-zxs/myPatient/patientInfo?patientId=${
          row.patientId
        }&diagCount=${row.diagCount}&severePatient=${
          row.severePatient ? 1 : 0
        }`,
      })
    },
    handleDelGroup(item) {
      uni.showModal({
        title: '提示',
        content: '是否删除该分组？',
        success: async confirm => {
          if (confirm.confirm) {
            await delGroup({ ids: [item.groupId] })
            uni.showToast({
              title: '删除成功！',
              icon: 'none',
            })
            this.getListDate()
          }
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.pop-view {
  width: 100%;
  min-height: 700rpx;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .title {
    font-size: 32rpx;
    height: 110rpx;
    line-height: 110rpx;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    .icon {
      position: absolute;
      top: 0rpx;
      right: 32rpx;
    }
  }

  .confirm {
    position: absolute;
    width: 100%;
    bottom: 0rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: $uni-color-primary;
    color: #fff;
  }
}
.expand-icon {
  margin-left: 8rpx;
  width: 16rpx;
  height: 20rpx;

  &.down {
    transform: rotate(90deg);
  }
}
.dept-detail {
  /* background: url("../../static/select_doctor_bg.png"); */
  padding: 40rpx 30rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  background-size: 100% 100%;
}
.layout {
  background: #ffffff;
  /* border-radius: 0px 0px 20rpx 20rpx; */
}
.search {
  padding: 20rpx;
  border-bottom: 1rpx solid #e6e6e6;
}
.search-wrapper {
  // width: 45%;
  width: 100%;
  background: #f2f2f2;
  border-radius: 36rpx;
  padding: 10rpx 30rpx;
}
.search-name {
  width: 37%;
  background: #f2f2f2;
  border-radius: 36rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  padding: 10rpx 30rpx;
}
.input {
  width: 90%;
  background: #f2f2f2;
  font-size: 26rpx;
}
.date {
  padding: 30rpx 30rpx;
  display: flex;
  overflow: auto;
  white-space: nowrap;
  .date-item {
    /* 子元素宽度保持不变 */
    flex-shrink: 0;
    width: 100rpx;
    height: 100rpx;
    border-radius: 10rpx;
    align-items: center;
    justify-content: center;
    color: #333333;
    background: #f1f1f1;
    margin-right: 30rpx;
  }
  .select {
    color: #ffffff;
    background: #0ab2c1;
  }
}
.department-desc {
  display: flex;
  padding: 30rpx;
  background: white;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 1rpx solid #e5e5e5;

  .department-title {
    height: 28rpx;
    color: #333333;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 28rpx;
    margin-bottom: 30rpx;
    font-family: PingFang SC;
  }

  .department-desc-text {
    color: #999999;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 36rpx;
    text-align: justify;
    font-family: PingFang SC;
  }
}
.doctor-card {
  background: #ffffff;
  border-radius: 20rpx;
  margin: 20rpx 20rpx 0rpx 20rpx;
  .doctor-detail {
    padding: 30rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #666666;
    border-bottom: 1rpx solid #e6e6e6;
    .img {
      min-width: 76rpx;
      min-height: 76rpx;
      width: 76rpx;
      height: 76rpx;
      border-radius: 50%;
      background: #75d4dc;
      margin-right: 20rpx;
    }
  }
  .doctor-time {
    font-size: 26rpx;
    padding: 30rpx;
    font-weight: 500;
    color: #333333;
    border-bottom: 1rpx solid #e6e6e6;
    .name {
      max-width: 80%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.item {
  height: 80rpx;
  line-height: 80rpx;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.nodata {
  text-align: center;
  padding-top: 100px;
  font-size: 16px;
  color: #666;
}
.content-list {
  padding: 0 20rpx;
  font-size: 14px;
  .title {
    margin: 30rpx 0;
  }
  .patient {
    margin-bottom: 10rpx;
    .left {
      flex-wrap: wrap;
      border-right: 1px solid #f2f2f2;
      text {
        margin-right: 10rpx;
        margin-top: 5rpx;
      }
      padding: 20rpx;
    }
    .right {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #0ab2c1;
    }
    .flex-end {
      justify-content: flex-end;
    }
  }
}

.wrap {
  margin-top: 20px;
  .input {
    width: 100%;
    background: #f2f2f2;
    font-size: 26rpx;
    height: 35px;
    margin-top: 10px;
  }
  padding: 20rpx;
  font-size: 14px;
}
.mini_btn {
  padding: 10rpx 44rpx;
  border: 1px solid #b3b3b3;
  border-radius: 30px;
  background: #ffffff;
  color: #4d4d4d;
  margin-left: 20rpx;
}
.primary_btn {
  border: 1px solid #0ab2c1;
  color: #0ab2c1;
}
.btns {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: fixed;
  bottom: 50rpx;
  left: 0;
  .btn {
    width: 30%;
    text-align: center;
    padding: 10rpx 44rpx;
    border: 1px solid #0ab2c1;
    color: #0ab2c1;
  }
  .primary {
    background: #0ab2c1;
    color: #fff;
  }
}
.color-red {
  background: rgba(247, 74, 74, 0.15);
  color: #f74a4a;
  font-size: 24rpx;
  border-radius: 6rpx;
  padding: 0 10rpx;
  height: 34rpx;
  line-height: 34rpx;
}
</style>
