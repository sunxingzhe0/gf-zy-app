<template>
  <view v-show="prescriptionShow">
    <checkbox-group @change="checkboxChange">
      <view class="app-card" v-for="(item, index) in rpList" :key="index">
        <view class="flex-between">
          <view class="prescription-no"
            >处方号：{{ item.rpNo || item.prescriptionNo || item.id }}</view
          >
          <view class="prescription-price"
            >￥{{ item.rpFee || item.prescriptionPrice }}</view
          >
        </view>
        <view class="prescription-doctor"
          >{{ item.doctorName }} {{ item.title }}</view
        >
        <view class="flex-between">
          <text class="prescription-doctor">
            {{ item.orgName }} {{ item.deptName }}</text
          >
          <text class="prescription-doctor"> {{ item.createTime }}</text>
        </view>

        <view class="prescription-checkbox">
          <label>
            <checkbox
              v-if="checkboxShow"
              :value="item.rpNo || item.id || item.prescriptionNo"
              color="#0AB2C1"
            />
          </label>
          <view @click="openRpList(item, index)" class="prescription-desc">
            <text>{{ item.isOpenRpList ? '收起' : '查看' }}详情</text>
            <image
              :class="{ desc: item.isOpenRpList }"
              :src="require('@/assets/open@2x.png')"
              mode="aspectFit"
              style="width: 22rpx;height: 20rpx;"
            ></image>
          </view>
        </view>
        <view v-show="item.isOpenRpList">
          <view
            class="detail"
            v-for="(contentItem, contentIndex) in item.contentList ||
              item.rpDrugList"
            :key="contentIndex"
          >
            <view class="medicine">
              <view class="medicine-name"
                >{{ contentIndex + 1 }}.{{ contentItem.name }}（规格：{{
                  contentItem.spec
                }}）</view
              >
              <view class="medicare">￥{{ contentItem.totalPrice }}</view>
            </view>
            <view class="use"
              >{{ contentItem.useWaysText || '' }}
              {{ contentItem.useFrequencyText || '' }}
              {{ contentItem.singleDose || ''
              }}{{ contentItem.singleDoseUnitText || '' }}/次
              {{ contentItem.treatment || ''
              }}{{ contentItem.treatmentUnitText || '' }} ￥{{
                contentItem.price
              }}{{ '/' + contentItem.totalUnitText }}x{{
                contentItem.total
              }}</view
            >
          </view>
        </view>
      </view>
    </checkbox-group>
  </view>
</template>

<script>
export default {
  props: {
    prescriptionShow: {
      type: Boolean,
      default: function() {
        return false
      },
    },
    checkboxShow: {
      type: Boolean,
      default: function() {
        return true
      },
    },
    historyRpList: {
      type: Array,
      default: function() {
        return []
      },
    },
  },
  data() {
    return {
      rpList: [],
    }
  },
  watch: {
    historyRpList(value) {
      this.rpList = value.map(item => ({
        ...item,
        isOpenRpList: false,
      }))
    }
  },
  methods: {
    checkboxChange: function(e) {
      this.$emit('prescIdC', e.detail.value)
    },
    openRpList(item, index) {
      this.rpList[index].isOpenRpList = !item.isOpenRpList
      this.$emit('openRpList', index)
    },
  },
}
</script>

<style scoped lang="scss">
.app-card {
  margin-top: 20rpx;
}

.prescription-checkbox {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prescription-no {
  font-size: 30rpx;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prescription-price {
  color: #666666;
  font-size: 30rpx;
  font-weight: bold;
}

.prescription-doctor {
  font-size: 24rpx;
  line-height: 36rpx;
  margin-top: 21rpx;
}

.prescription-desc {
  margin-right: 12rpx;
  width: 100%;
  text-align: right;

  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);

  text {
    margin-right: 10rpx;
  }
}

.detail {
  padding: 20rpx;
  background-color: #eee;
}

.desc {
  transform: rotate(0.5turn);
}

.medicine {
  display: flex;
  justify-content: space-between;

  .medicine-name {
    font-size: 26rpx;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }

  .medicare {
    width: 130rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
  }
}

.use {
  color: #666666;
  margin: 20rpx 0rpx;
  font-size: 26rpx;
}
</style>
