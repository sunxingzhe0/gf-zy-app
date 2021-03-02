<template>
  <view class="select-department">
    <view class="keyword">
      <input
        class="input"
        type="text"
        placeholder="请输入科室进行搜索"
        confirm-type="search"
        @input="e => (this.query = e.detail.value)"
        @confirm="getDept"
      />
      <view class="iconfont icon-sousuo" @click="getDept"></view>
    </view>
    <view class="departments">
      <scroll-view class="dept-left">
        <view
          v-for="(item, index) in orgList"
          :key="item.hospCode"
          class="org-item"
          :class="{ active: item.active }"
          @click="onOrgChange(index)"
        >
          {{ item.hospName }}
        </view>
      </scroll-view>
      <scroll-view class="dept-right" scroll-y>
        <view
          class="list-item"
          v-for="(item, index) in departments"
          :key="item.id"
        >
          <view
            class="item-row"
            :class="{ 'item__no-border ': item.expand }"
            @click="clickHandler(index)"
          >
            <view class="item-text">{{ item.name }}</view>
            <view
              class="iconfont icon-jiantou"
              :class="{ 'icon-jiantou__down': item.expand }"
              v-if="item.children && item.children.length"
            >
            </view>
          </view>
          <view
            class="item-children"
            v-if="item.children.length"
            v-show="item.expand"
          >
            <view
              v-for="it in item.children"
              @click="clickHandler(it)"
              class="item-child"
              :key="it.id"
            >
              <view class="item-text">{{ it.name }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {
  getHospInfo,
  getDeptList,
  getDeptByCondition,
} from '@/common/request/doctorAppointment'
export default {
  props: {
    orderId: String,
    doctorIndexArr: Array,
  },
  data() {
    return {
      orgList: [],
      list: [],
      query: '',
      departments: [],
    }
  },
  created() {
    this.getOrgList()
  },
  methods: {
    clickHandler(val) {
      let department = null
      if (typeof val === 'number') {
        if (this.departments[val].children?.length) {
          this.$set(
            this.departments[val],
            'expand',
            !this.departments[val].expand,
          )
        } else {
          department = this.departments[val]
        }
      } else {
        department = val
      }

      if (department) {
        const { hospName, hospCode } = this.orgList.find(_ => _.active)
        Object.assign(department, {
          orgName: hospName,
          orgCode: hospCode,
        })

        uni.navigateTo({
          url: `/pages-doctor/appointment/selectDoctor?orderId=${
            this.orderId
          }&department=${JSON.stringify(department)}&doctorIndexArr=${
            this.doctorIndexArr
          }`,
        })
      }
    },
    onOrgChange(index) {
      this.orgList = this.orgList.map((_, idx) =>
        Object.assign(_, { active: index === idx ? true : false }),
      )
      this.getDept()
    },
    async getOrgList() {
      const list = (await getHospInfo()).map(_ =>
        Object.assign(_, { active: false }),
      )

      list[0].active = true
      this.orgList = list
      this.getDeptList()
    },
    async getDeptList() {
      const departments = await getDeptList({
        orgId: this.orgList.find(_ => _.active)?.hospCode,
        resource: '2',
      })
      this.list = [...departments]
      this.departments = [...departments]
    },
    getDept() {
      if (!this.query.trim()) {
        this.getDeptList()
        return
      }
      const params = {
        resource: '2',
        orgId: this.orgList.find(_ => _.active)?.hospCode,
        name: this.query.trim(),
      }

      const ids = this.list.map(item => item.id)
      getDeptByCondition(params).then(data => {
        this.departments = []
        data.forEach(item => {
          const index = ids.indexOf(item.id)
          const pIndex = ids.indexOf(item.pid)

          if (index > -1) {
            this.departments.push(
              Object.assign(item, {
                children: this.list[index].children,
              }),
            )
          } else if (pIndex > -1) {
            const i = this.departments.map(_ => _.id).indexOf(item.pid)
            if (i > -1) {
              this.departments[i].children.push(item)
            } else {
              this.departments.push(
                Object.assign({}, this.list[pIndex], { children: [item] }),
              )
            }
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.select-department {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
}

.keyword {
  width: 710rpx;
  height: 72rpx;
  display: flex;
  margin: 20rpx auto;
  align-items: center;
  border-radius: 36rpx;
  background: #ffffff;
  box-shadow: 0px 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.15);

  .input {
    flex: 1;
    height: 72rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 72rpx;
    margin-left: 20rpx;
    font-family: PingFang SC;
  }

  .icon-sousuo {
    width: 30rpx;
    height: 30rpx;
    margin: 0 20rpx;
    display: flex;
    align-items: center;
  }
}

.departments {
  display: flex;
  justify-content: space-between;
  height: 90vh;
  background: #fff;

  .dept-left {
    width: 30vw;
  }
  .dept-right {
    width: 70vw;
    border-left: 2rpx solid #e5e5e5;
  }
  .org-item {
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 16rpx 0;
    padding: 6rpx 0 6rpx 12rpx;
    border-left: 6rpx solid transparent;
    color: #333;

    &.active {
      border-left-color: $uni-color-primary;
      color: $uni-color-primary;
    }
  }
}

.list-item {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  transition: all ease 0.3s;

  .item__no-border {
    border-bottom: none;
  }

  .icon-jiantou__down::before {
    transform: rotate(0);
  }
}

.item-row {
  height: 90rpx;
  display: flex;
  margin-left: 30rpx;
  box-sizing: border-box;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
}

.item-children {
  background: #f2f2f2;
}

.item-child {
  height: 90rpx;
  margin-left: 30rpx;
  text-indent: 60rpx;
  box-sizing: border-box;
  border-bottom: 1px solid #e5e5e5;
}

.item-text {
  color: #333333;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 90rpx;
  font-family: PingFang SC;
}

.icon-jiantou {
  display: flex;
  align-items: center;
  padding-right: 28rpx;

  &::before {
    color: #656565;
    transform: rotate(-90deg);
    transition: all ease 0.3s;
  }
}
</style>
