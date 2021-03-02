<template>
    <view>
        <view v-for="(item, index) in list" :key="index">
            <!-- <view class="item-name flex-between" v-if="item.next">
                <text>{{item.name}}</text>
                <uni-icons v-if="item.next" type="arrowright" color="#666" ></uni-icons>
            </view>
            <view class="item-name" v-else>
                <text>{{item.name}}</text>

            </view> -->
            <!-- <view v-if="item.next" class="children-item"> -->

                <Item :item="item"  @deptChange="deptChange"></Item>
            <!-- </view> -->
        </view>
    </view>
</template>
<script>
import uniIcons from '../../../components/uni-icons/uni-icons.vue';
import Item from './item'
export default {
  components: { uniIcons,Item },
  name: "List",
  props: {
    list: Array,
  },

  methods:{
    deptChange(item){
      this.$emit('deptChange',item)
    }
  }
};
</script>
<style lang="scss" scoped>
.list-item{
  height: 40rpx;
  line-height: 40rpx;
  padding:0 20rpx ;
  box-sizing: border-box;
  .item-name{
    font-size: 26rpx;
    color: #333;
  }
}
</style>
