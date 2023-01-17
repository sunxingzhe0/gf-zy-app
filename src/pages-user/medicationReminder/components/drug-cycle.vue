<template>
  <uni-popup ref="popup" type="bottom">
    <view class="container">
      <view class="app-card">
        <view class="flex-between item">
          <text class="title">用药周期选择</text>
          <image
            class="close"
            :src="require('../../../assets/close-popup.png')"
            @click="close()"
          ></image>
        </view>
        <radio-group @change="radioChange">
          <view class="flex-between item" @click="drugCycle = 'DAY'">
            <view>每天</view>
            <radio class="checkbox" value="DAY" :checked="drugCycle == 'DAY'" />
          </view>
          <view class="item">
            <view
              class="flex-between "
              style=" padding: 5px 0px;"
              @click="drugCycle = 'WEEK'"
            >
              <view>每周</view>
              <radio
                class="checkbox"
                value="WEEK"
                :checked="drugCycle == 'WEEK'"
              />
            </view>
            <view class="wrapper ">
              <!-- 星期天为1 -->
              <checkbox-group @change="e => (this.weekDays = e.detail.value)">
                <label v-for="(item, index) in weeks" class="date" :key="index">
                  <checkbox
                    :disabled="drugCycle != 'WEEK'"
                    :checked="isChecked('WEEK', index == 6 ? 1 : index + 2)"
                    class="checkbox"
                    :value="index == 6 ? 1 : index + 2"
                  /><text style="font-size: 24rpx;">周{{ item }}</text>
                </label>
              </checkbox-group>
            </view>
          </view>
          <view class="item">
            <view
              class="flex-between "
              style=" padding: 5px 0px;"
              @click="drugCycle = 'MONTH'"
            >
              <view>每月</view>
              <radio
                class="checkbox"
                value="MONTH"
                :checked="drugCycle == 'MONTH'"
              />
            </view>
            <view class="wrapper " style="  margin-bottom: 88rpx;">
              <checkbox-group @change="e => (this.monthDays = e.detail.value)">
                <label v-for="item in 31" class="date" :key="item">
                  <checkbox
                    :disabled="drugCycle != 'MONTH'"
                    :checked="isChecked('MONTH', item + 1)"
                    class="checkbox"
                    :value="item + 1"
                  ></checkbox
                  ><text style="font-size: 24rpx;">{{ item + 1 }}号</text>
                </label>
              </checkbox-group>
            </view>
          </view>
          <view class="bottom-btn" @click="submit">确定</view>
        </radio-group>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  data() {
    return {
      weeks: ['一', '二', '三', '四', '五', '六', '日'],
      weekDays: [],
      monthDays: [],
      drugCycle: 'DAY',
    }
  },
  computed: {
    days() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      return new Date(year, month, 0).getDate()
    },
  },
  methods: {
    open(drugCycle, days) {
      this.drugCycle = drugCycle
      if (drugCycle == 'WEEK') {
        this.weekDays = days
      }
      if (drugCycle == 'MONTH') {
        this.monthDays = days
      }
      this.$refs.popup.open()
    },
    close() {
      this.$emit('closeD')
      this.$refs.popup.close()
    },
    submit() {
      let days = ''
      switch (this.drugCycle) {
        case 'WEEK':
          if (this.weekDays.length == 0) {
            this.$tip('请选择具体日期！')
            return
          }
          days = this.weekDays.join(',')
          break
        case 'MONTH':
          if (this.monthDays.length == 0) {
            this.$tip('请选择具体日期!')
            return
          }
          days = this.monthDays.join(',')
          break
        case 'DAY':
          days = ''
          break
      }

      this.$emit('confirm', {
        drugCycle: this.drugCycle,
        days: days,
      })
    },
    radioChange(e) {
      this.drugCycle = e.detail.value
      if (this.drugCycle == 'WEEK') {
        this.monthDays = []
      } else if (this.drugCycle == 'MONTH') {
        this.weekDays = []
      } else {
        this.monthDays = []
        this.weekDays = []
      }
    },
    isChecked(type, value) {
      let t = ''
      if (type === 'WEEK') {
        t = this.weekDays.find(function(item) {
          return item == value
        })
      } else if (type === 'MONTH') {
        t = this.monthDays.find(function(item) {
          return item == value
        })
      }
      return t
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  // padding-top: 20px;
  // height: 100vh;
  background-color: #00ffff00;
}

.wrapper {
  padding: 10rpx;
  background-color: #f2f2f2;
}

.checkbox {
  transform: scale(0.6);
}

.bottom-btn {
  position: absolute;

  left: 0px;
  bottom: 0px;
  line-height: 88rpx;
  width: 100vw;
  height: 88rpx;
  text-align: center;
  background-color: $uni-color-primary;
  font-size: 32rpx;
  color: #fff;
}

.item {
  padding: 10px 0px;
  border-bottom: 1px solid #e6e6e6;

  view {
    font-weight: 500;
    font-size: 30rpx;
    color: #333333;
  }
}

.date {
  margin: 1rpx;
  width: 150rpx;
  display: inline-block;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title {
  width: 100vw;
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  color: #1a1a1a;
}

.close {
  width: 30rpx;
  height: 30rpx;
  padding: 15rpx;
}
</style>
