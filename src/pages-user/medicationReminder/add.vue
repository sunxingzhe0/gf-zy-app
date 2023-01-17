<template>
  <view>
    <view class="app-card">
      <view class="item  flex-start-center cell">
        <view class="label">药品名称</view>
        <input
          v-model="form.drugName"
          class="input"
          placeholder-class="placeholder"
          placeholder="请输入"
        />
      </view>
      <view class="item  flex-start-center cell">
        <view class="label">服用剂量</view>
        <input
          v-model="form.dosage"
          class="input"
          placeholder-class="placeholder"
          placeholder="请输入"
        />
      </view>
      <view class="item  flex-start-center cell">
        <view class="label">用药频次</view>
        <input
          v-model="form.uesFreq"
          class="input"
          placeholder-class="placeholder"
          placeholder="请输入"
        />
      </view>

      <view
        class="item flex-start-center cell"
        style="padding: 5px 0px;"
        @click="drugcycle()"
      >
        <view class="label">用药周期</view>
        <view class="flex-between " style="width: 100vh;">
          <view
            class="input"
            :style="{ width: '330rpx', color: form.uesCycle ? '#333' : '#ccc' }"
          >
            {{
              form.uesCycle === 'MONTH'
                ? '每月'
                : form.uesCycle == 'DAY'
                ? '每天'
                : form.uesCycle == 'WEEK'
                ? '每周'
                : '请选择'
            }}
          </view>
          <view class="iconfont icon-jiantou"></view>
        </view>
      </view>
    </view>

    <view class="app-card">
      <view class="cell">用药时间</view>
      <view
        class="flex-between cell"
        v-for="(time, index) in selectTime"
        :key="index"
      >
        <view class="time flex-start-center">
          <image style="" :src="require('../../assets/shijian.png')"></image
          >{{ time }}
        </view>
        <view class="iconfont icon-shanchu" @click="delTime(time)"></view>
      </view>
      <picker
        mode="time"
        @change="e => this.selectTime.push(`${e.detail.value}`)"
      >
        <view class="cell text-add">+添加时间</view>
      </picker>
    </view>

    <view class="app-card">
      <view class="commonly-title"
        >常用药品
        <text>（长按药品可删除）</text>
      </view>

      <view class="tab">
        <view
          v-for="(item, index) in commonlyUseds"
          class="tab_item"
          :key="index"
          @longpress="delCommonly(item)"
          @click="form.drugName = item.drugName"
        >
          <text>{{ item.drugName }}</text>
        </view>
      </view>
    </view>

    <view class="app-card ">
      <view class="cell">备注信息</view>
      <textarea
        v-show="!isShowD"
        v-model="form.remark"
        class="textarea"
        placeholder="您可以填写相关药品信息"
      />
    </view>

    <view v-if="!form.id" class="button" @click="save">保存</view>
    <view v-if="form.id" class="updata-button flex">
      <view class="del" @click="del()">删除</view>
      <view class="sav" @click="save()">保存</view>
    </view>

    <drug-cycle ref="drugCyclev" @confirm="dataConfirm" @closeD="drugcycleC" />
  </view>
</template>
<script>
import DrugCycle from './components/drug-cycle.vue'
import {
  saveDrugWarn,
  editDrugWarn,
  delDrugWarn,
  drugWarnCommonList,
  drugWarnCommonDel,
} from '@/common/request/drug'
export default {
  components: {
    DrugCycle,
  },
  data() {
    return {
      isShowD: false,
      commonlyUseds: [], //常用药品
      selectTime: [], //用药时间
      form: {
        id: '',
        dosage: '', //剂量
        uesFreq: '', //用药频次
        drugName: '', //名称
        drugSpec: '', //药品规格
        uesCycle: '', //用药周期
        days: '', //用药周期具体日期
        uesTime: '', //用药时间//selectTime转换而来
        remark: '', //备注信息
        warnState: '',
      },
    }
  },
  onLoad(option) {
    this.drugWarnCommonList()
    if (option.item) {
      //修改
      uni.setNavigationBarTitle({
        title: '修改提醒',
      })
      const item = JSON.parse(decodeURIComponent(option.item))
      this.form = item
      //拆分用药时间[]selectTime
      if (this.form.uesTime != '') {
        this.selectTime = this.form.uesTime.split(',')
      }
    }
  },
  methods: {
    save() {
      //必须选择用药周期和时间
      if (this.form.uesCycle == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择用药周期!',
        })
        return
      }
      //将用药时间转换
      this.form.uesTime = this.selectTime.join(',')
      if (this.form.uesTime == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择用药时间!',
        })
        return
      }
      saveDrugWarn(this.form).then(data => {
        uni.showToast({
          title: '保存成功!',
        })
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
    },
    del() {
      delDrugWarn({
        id: this.form.id,
      }).then(data => {
        uni.showToast({
          title: '删除成功！',
        })
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
    },
    // edit() {
    //   editDrugWarn(this.form).then(data => {
    //     uni.showToast({
    //       title: '修改成功！'
    //     });
    //     uni.navigateBack({
    //       delta: 1
    //     });
    //   })
    // },
    drugcycle() {
      this.isShowD = true
      let days = ''
      //拆分 用药周期的具体时间
      if (this.form.days != null) {
        days = this.form.days.split(',')
      }
      //传入数据
      this.$refs.drugCyclev.open(this.form.uesCycle, days)
    },
    dataConfirm(e) {
      this.$refs.drugCyclev.close()
      this.form.uesCycle = e.drugCycle
      this.form.days = e.days
    },
    delTime(time) {
      this.selectTime.some((item, i) => {
        if (item == time) {
          this.selectTime.splice(i, 1)
          //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          return true
        }
      })
    },
    delCommonly(item) {
      uni.showModal({
        title: '提示',
        content: '确定要删除常用药品吗？',
        success: async res => {
          if (res.confirm) {
            await drugWarnCommonDel({
              id: item.id,
            })
            uni.showToast({
              title: '删除成功！',
            })
            this.drugWarnCommonList()
          }
        },
      })
    },
    drugcycleC() {
      this.isShowD = false
    },
    drugWarnCommonList() {
      drugWarnCommonList().then(data => {
        this.commonlyUseds = data
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.icon-jiantou::before {
  display: block;
  transform: rotate(-90deg);
}

.app-card {
  margin-top: 20rpx;
  padding-left: 30rpx;
  font-size: 30rpx;

  &.padding {
    padding: 0 30rpx 30rpx;
  }
}

.item {
  font-size: 30rpx;
  color: #666666;
  padding: 5px 0px;
  border-bottom: 1px solid #e6e6e6;
}

.time {
  font-size: 15px;
  color: #333333;

  image {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}

.cell {
  font-size: 30rpx;
  padding-right: 20rpx;
}

.label {
  font-size: 30rpx;
  flex-shrink: 0;
  color: #666;
}

.input {
  font-size: 30rpx;
  color: #666666;
  margin-left: 40rpx;
  width: 100%;
}

.iconfont {
  &:before,
  &:after {
    color: #999;
  }

  .time {
    font-size: 15px;
    color: #333333;

    image {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .cell {
    font-size: 30rpx;
    padding-right: 20rpx;
  }

  .label {
    font-size: 30rpx;
    flex-shrink: 0;
    color: #666;
  }

  .input {
    font-size: 30rpx;
    color: #666666;
    margin-left: 40rpx;
    width: 100%;
  }
}

.tab {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .tab_item {
    background: #f2f2f2;
    border-radius: 12rpx;
    font-size: 26rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10rpx 20rpx;
    margin: 10rpx;

    image {
      width: 80rpx;
      height: 80rpx;
    }

    text {
      font-size: 26rpx;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
      line-height: 36rpx;
      margin-top: 10rpx;
    }
  }
}

.updata-button {
  margin-top: 20rpx;
  width: 100%;
  height: 88rpx;

  .del {
    line-height: 88rpx;
    text-align: center;
    width: 50vw;
    background: #ffffff;
    font-size: 30rpx;
    color: #666666;
  }

  .sav {
    line-height: 88rpx;
    text-align: center;
    width: 50vw;
    background: #0ab2c1;
    font-size: 30rpx;
    color: #ffffff;
  }
}
.button {
  margin-top: 20rpx;
  width: 100%;
  height: 88rpx;
  line-height: 86rpx;
  text-align: center;
  background-color: $uni-color-primary;
  font-size: 32rpx;
  color: #fff;
}

::v-deep .placeholder {
  color: #ccc;
  font-size: 14px;
}
</style>
