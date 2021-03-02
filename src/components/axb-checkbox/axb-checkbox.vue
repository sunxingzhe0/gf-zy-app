<template>
  <view class="radioWrap">
    <filter-radio-item
      v-for="(item, idx) in items"
      :key="idx"
      :name="item.name"
      :value="item.value"
      :checked="item.checked"
      @change="radioChange"
    ></filter-radio-item>
  </view>
</template>

<script>
import filterRadioItem from './axb-checkbox-item.vue'
export default {
  components: {
    filterRadioItem,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    multi: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: this.list,
      resMulti: [],
    }
  },
  watch: {
    list: {
      handler(value) {
        this.items = value.map(item => {
          if (this.multi && this.list?.[0].checked) {
            this.radioChange(item.value)
            return Object.assign(item, { checked: true })
          }
          return item
        })
      },
      deep: true,
    },
  },
  methods: {
    handleChange: function(val) {
      const arr = []
      // 是否为全部
      if (val === 'all') {
        let allr = this.items.find(n => n.value === val)
        this.items.forEach(function(item) {
          let re = {}
          re.name = item.name
          re.value = item.value
          re.checked = !allr.checked
          arr.push(re)
        })
      } else {
        for (let i = 0; i < this.items.length; i++) {
          let r = {}
          r.name = this.items[i].name
          r.value = this.items[i].value
          if (this.multi) {
            // 多选
            if (this.items[i].value === val) {
              // 选中项处理
              r.checked = !this.items[i].checked
            } else {
              r.checked = this.items[i].checked
            }
          } else {
            // 单选
            if (this.items[i].value === val) {
              // 选中项处理
              r.checked = !this.items[i].checked
            } else {
              r.checked = false
            }
          }
          arr.push(r)
        }
      }
      // 判断是否全选 全选按钮未全选
      if (this.multi) {
        const select = arr.slice(1)
        let r = select.every(function(val) {
          return val.checked
        })
        arr[0].checked = r
      }
      this.items = arr
    },
    radioChange: function(e) {
      console.log('radio发生change事件，携带value值为：' + e)
      // 改变单击项
      this.handleChange(e)

      const re = this.multi ? this.items.filter(item => item.checked).map(item => item.value) : []
      const r = this.items.find(val => val.value === e)
      const result = this.multi ? re : r.checked ? e : null
      // 返回选择项
      this.$emit('change', result)
    },
    reset: function() {
      this.items = this.list
    },
  },
}
</script>

<style>
.radioWrap {
  display: flex;
  flex-wrap: wrap;
  width: 590rpx;
}
.radioWrap:after {
  content: '';
  width: 173rpx;
  height: 60rpx;
  display: block;
}
</style>
