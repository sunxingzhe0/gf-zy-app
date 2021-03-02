<template>
        <view class="list-item">
            <view class="item-name flex-between" v-if="item.next">
                <text>{{item.name}}</text>
                <!-- <uni-icons v-if="item.next" type="arrowright" color="#666" ></uni-icons> -->
            </view>
            <view class="itemText" v-else  @click="tabChange(item)">
                <text :class="item.active?'on text':'text'">{{item.name}}</text>

            </view>
            <view v-if="item.next" class="children-item">
                <List :list="item.next"  @deptChange="tabChange"></List>
            </view>
        </view>
</template>
<script>
import uniIcons from '../../../components/uni-icons/uni-icons.vue';
import List from './DeptList'
export default {
  components: { uniIcons,List },
  name: "List",
  props: {
    item: Object,

  },
  methods:{
    tabChange(item){
      this.$emit('deptChange',item)
    }
  }
};
</script>
<style lang="scss" scoped>
.list-item{
  line-height: 40rpx;
  padding-right:20rpx;
  box-sizing: border-box;
  margin-top: 16rpx;
  .item-name{
    font-size: 28rpx;
    color: #333;
  }
  .children-item{
    padding-left: 30rpx;
    line-height: 30rpx;
  }
  .itemText{
    display: inline-block;
    .text{
      color: #666;
      background: #f2f2f2;
      padding: 10rpx 30rpx;
      border-radius: 30rpx;
    }
    .on{
      color: #fff;
      background: $uni-color-primary;
    }
  }
}
</style>
