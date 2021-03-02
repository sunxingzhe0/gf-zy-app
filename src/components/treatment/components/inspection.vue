<template>
  <view>
    <app-card styles="padding: 0">
      <app-list-item label="类别">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.categoryName"
          @click="clickHandler('category')"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item label="名称">
        <input
          disabled
          class="list-input"
          placeholder="请输入检验名称关键字查找"
          :value="form.name"
          @click="clickHandler('keyword')"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item label="标本">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.specimenName"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <!-- <app-list-item label="是否加急">
        <switch
          color="#09B1C1"
          class="expedited"
          :checked="form.anxious"
          @change="switchChange"
        />
      </app-list-item> -->
      <app-list-item label="执行科室">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.deptName"
          @click="clickHandler('department')"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item
        label="费用"
        :value="'¥' + (form.price || '')"
      ></app-list-item>
      <app-list-item label="预约执行时间" noBorder>
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="formatDate"
          @click="clickHandler('time')"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item label="备注">
        <textarea
          placeholder="请输入"
          maxlength="250"
          confirm-type="done"
          :style="{
            width: '70vw',
            marginTop: '10rpx',
            padding: '20rpx',
            backgroundColor: '#f2f2f2',
          }"
          :value="form.remark"
          @input="e => (this.form.remark = e.detail.value)"
        ></textarea>
      </app-list-item>
    </app-card>
    <uni-popup ref="category" type="center">
      <category :chooseList="chooseList" @change="onCategoryChange" />
    </uni-popup>
    <uni-popup ref="keyword" type="bottom">
      <inspect-name
        :chooseList="
          form.categoryName
            ? chooseList.filter(_ => _.categoryName == form.categoryName)
            : chooseList
        "
        @change="onInspectNameChange"
      />
    </uni-popup>
    <!-- <uni-popup ref="specimen" type="center">
      <parts
        :auto="order.name ? false : true"
        :chooseList="
          form.name
            ? chooseList.filter(
                _ =>
                  _.categoryName == form.categoryName &&
                  _.itemName == form.name,
              )
            : []
        "
        @change="onSpecimenChange"
      />
    </uni-popup> -->
    <uni-popup ref="department" type="center">
      <department
        :auto="order.name ? false : true"
        :chooseList="
          form.specimenName
            ? chooseList.filter(
                _ =>
                  _.categoryName == form.categoryName &&
                  _.itemName == form.name &&
                  _.specimenPartName == form.specimenName,
              )
            : []
        "
        @change="onDepartmentChange"
      />
    </uni-popup>
    <uni-popup ref="time" type="bottom">
      <Time
        :dictDisposeId="form.name"
        :parts="form.specimenNames"
        :type="form.type"
        @confirm="timeConfirm"
      />
    </uni-popup>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import Category from '../popup/category'
import InspectName from '../popup/inspectName'
// import Parts from '../popup/parts'
import Department from '../popup/department'
import Time from '../popup/time'
import { chooseList, getPrice } from '@/common/request/advice'
export default {
  components: {
    AppCard,
    AppListItem,
    Category,
    InspectName,
    // Parts,
    Department,
    Time,
  },
  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      chooseList: [],
      form: {
        id: '',
        dictDisposeId: '',
        type: 'LAB',
        categoryName: '',
        name: '',
        specimenName: '',
        deptName: '',
        price: 0,
        anxious: false,
        remark: '',
        start: '',
        end: '',
      },
    }
  },
  computed: {
    formatDate() {
      return this.form.start
        ? this.FORMATDATE(this.form.start.replace(/-/g, '/'), 'yyyy-MM-dd')
        : ''
    },
  },
  watch: {
    order: {
      handler() {
        if (this.order.dictDisposeId) {
          const form = this.order.dictDisList.find(
            _ => _.id == this.order.dictDisposeId,
          )

          for (const key in this.form) {
            this.form[key] = this.order[key]
          }
          Object.assign(this.form, {
            deptName: form.execDeptName,
            categoryName: form.categoryName,
            specimenName: form.specimenPartName,
          })
        }
      },
      deep: true,
      immediate: true,
    },
    'form.deptName': {
      handler() {
        this.fetchPrice()
      },
    },
  },
  created() {
    this.fetchChooseList()
  },
  methods: {
    clickHandler(name) {
      if (['specimen', 'department'].includes(name) && !this.form.name) {
        uni.showToast({
          title: '请先填写名称',
          icon: 'none',
        })
        return
      }
      try {
        this.$refs[name].open()
      } catch (err) {
        console.error(err)
      }
    },
    closePopup(name) {
      try {
        this.$refs[name].close()
      } catch (err) {
        console.error(err)
      }
    },
    switchChange(event) {
      this.form.anxious = event.target.value
    },
    async fetchChooseList() {
      this.chooseList = await chooseList({
        type: this.form.type,
        pageSize: 999,
      })
    },
    onCategoryChange(option) {
      this.closePopup('category')
      if (!option?.value) return

      Object.assign(this.form, {
        categoryName: option.value,
        dictDisposeId: this.chooseList.filter(
          _ => option.value == _.categoryName,
        )[0].id,
      })
      this.onInspectNameChange({
        name: this.chooseList.filter(_ => option.value == _.categoryName)[0]
          .itemName,
      })
    },
    onInspectNameChange(option) {
      this.closePopup('keyword')

      const item = this.chooseList.filter(
        _ =>
          this.form.categoryName == _.categoryName && option.name == _.itemName,
      )[0]
      Object.assign(this.form, {
        name: option.name,
        dictDisposeId: item?.id,
      })
      this.onSpecimenChange({ value: item?.specimenPartName })
    },
    onSpecimenChange(option) {
      // this.closePopup('specimen')
      if (!option?.value) return

      const item = this.chooseList.filter(
        _ =>
          this.form.categoryName == _.categoryName &&
          this.form.name == _.itemName &&
          option.value == _.specimenPartName,
      )[0]
      Object.assign(this.form, {
        specimenName: option.value,
        dictDisposeId: item.id,
      })

      this.onDepartmentChange({ value: item.execDeptName })
    },
    onDepartmentChange(option) {
      this.closePopup('department')
      if (!option?.value) return

      Object.assign(this.form, {
        deptName: option.value,
        dictDisposeId: this.chooseList.filter(
          _ =>
            this.form.name == _.itemName &&
            this.form.specimenName == _.specimenPartName &&
            option.value == _.execDeptName,
        )[0].id,
      })
      this.fetchPrice()
    },
    timeConfirm(date) {
      this.closePopup('time')
      Object.assign(this.form, {
        start: date,
        end: date,
      })
    },
    fetchPrice() {
      const { dictDisposeId } = this.form

      if (!dictDisposeId) return
      getPrice({ id: dictDisposeId }).then(data => (this.form.price = data))
    },
  },
}
</script>

<style lang="scss" scoped>
@import './treatment.scss';
</style>
