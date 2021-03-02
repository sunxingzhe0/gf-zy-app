<template>
  <view>
    <app-card styles="padding: 0 0 60rpx 0">
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
          :value="form.name"
          @click="clickHandler('keyword')"
          placeholder="请输入检查名称关键字查找"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item label="检查方法">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.methodName"
          @click="clickHandler('method')"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item label="部位">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.partName.join()"
          @click="clickHandler('parts')"
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
      <app-list-item label="预约执行时间">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.start"
          @click="clickHandler('time')"
        />
        <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
      </app-list-item>
      <app-list-item label="要求" noBorder> </app-list-item>
      <textarea
        class="textarea"
        placeholder="请输入"
        maxlength="250"
        :value="form.remark"
        confirm-type="done"
        @input="e => (this.form.remark = e.detail.value)"
      ></textarea>
    </app-card>
    <uni-popup ref="category" type="center">
      <category :chooseList="chooseList" @change="onCategoryChange" />
    </uni-popup>
    <uni-popup ref="keyword" type="bottom">
      <inspectName
        :chooseList="
          chooseList.filter(_ => this.form.categoryName == _.categoryName)
        "
        @change="onInspectNameChange"
      />
    </uni-popup>
    <uni-popup ref="method" type="center">
      <methods
        :chooseList="
          chooseList.filter(
            _ =>
              this.form.categoryName == _.categoryName &&
              this.form.name == _.itemName,
          )
        "
        @change="onMethodChange"
      />
    </uni-popup>
    <uni-popup ref="parts" type="center">
      <parts
        :chooseList="
          chooseList.filter(
            _ =>
              this.form.categoryName == _.categoryName &&
              this.form.name == _.itemName &&
              this.form.methodName == _.methodName,
          )
        "
        @change="onPartChange"
      />
    </uni-popup>
    <uni-popup ref="department" type="center">
      <department
        :chooseList="
          chooseList.filter(
            _ =>
              this.form.categoryName == _.categoryName &&
              this.form.name == _.itemName &&
              this.form.methodName == _.methodName &&
              this.form.partName.includes(_.specimenPartName),
          )
        "
        @change="onDepartmentChange"
      />
    </uni-popup>
    <uni-popup ref="time" type="bottom">
      <Time
        :dictDisposeId="form.id"
        :type="form.type"
        mode="time"
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
import Parts from '../popup/parts'
import Methods from '../popup/methods'
import Department from '../popup/department'
import Time from '../popup/time'
import { chooseList, getPrice } from '@/common/request/advice'
export default {
  components: {
    AppCard,
    AppListItem,
    Category,
    InspectName,
    Parts,
    Methods,
    Department,
    Time,
  },
  props: {
    order: Object,
  },
  data() {
    return {
      chooseList: [],
      form: {
        type: 'EXAMINE',
        id: '',
        dictDisposeId: '',
        categoryName: '',
        name: '',
        deptName: '',
        partName: [],
        methodName: '',
        price: 0,
        start: '',
        end: '',
        anxious: false,
        remark: '',
      },
      partClickIndex: 0,
    }
  },
  created() {
    this.fetchChooseList()

    if (this.order.dictDisposeId) {
      for (const key in this.form) {
        this.form[key] = this.order[key]
      }

      const form = this.order.dictDisList.filter(
        _ => this.order.dictDisposeId.indexOf(_.id) > -1,
      )
      Object.assign(this.form, {
        categoryName: form[0].categoryName,
        methodName: form[0].methodName,
        partName: form.map(_ => _.specimenPartName),
      })
    }
  },
  methods: {
    switchChange(event) {
      this.form.anxious = event.target.value
    },
    clickHandler(name, index) {
      this.partClickIndex = index
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
    async fetchChooseList() {
      this.chooseList = await chooseList({
        type: this.form.type,
        pageSize: 999,
      })
    },
    onCategoryChange(option) {
      this.closePopup('category')
      if (!option?.value) return

      this.form.categoryName = option.value
      this.onInspectNameChange({
        name: this.chooseList.filter(_ => option.value == _.categoryName)[0]
          .itemName,
      })
    },
    onInspectNameChange({ name }) {
      this.closePopup('keyword')
      this.form.name = name
      this.onMethodChange({
        value: this.chooseList.filter(
          _ => this.form.categoryName == _.categoryName && name == _.itemName,
        )[0].methodName,
      })
    },
    onMethodChange(option) {
      this.closePopup('method')
      if (!option?.value) return

      this.form.methodName = option.value

      const list = this.chooseList
        .filter(
          _ =>
            this.form.categoryName == _.categoryName &&
            this.form.name == _.itemName &&
            option.value == _.methodName,
        )
        .map(_ => ({ value: _.specimenPartName }))

      this.onPartChange(list)
    },
    onPartChange(options) {
      this.closePopup('parts')
      this.form.partName = options.map(_ => _.value)
      this.onDepartmentChange({
        value: this.chooseList.filter(
          _ =>
            this.form.categoryName == _.categoryName &&
            this.form.name == _.itemName &&
            this.form.partName.includes(_.specimenPartName),
        )?.[0].execDeptName,
      })
    },
    onSonPartChange(options) {
      if (typeof this.form.sonPartName[this.partClickIndex] != 'undefined') {
        this.form.sonPartName.splice(
          this.partClickIndex,
          1,
          options.map(item => item.label).join(';'),
        )
      } else {
        this.form.sonPartName.push(options.map(item => item.label).join(';'))
      }
      this.closePopup('subPlace')
    },
    onDepartmentChange(option) {
      this.closePopup('department')
      if (!option?.value) return

      Object.assign(this.form, {
        deptName: option.value,
        dictDisposeId: this.chooseList
          .filter(
            _ =>
              this.form.categoryName == _.categoryName &&
              this.form.name == _.itemName &&
              this.form.methodName == _.methodName &&
              this.form.partName.includes(_.specimenPartName),
          )
          .map(_ => _.id)
          .join(),
      })

      this.fetchPrice()
    },
    timeConfirm(date) {
      this.$refs.time.close()

      const [d, t] = date.split(' ')
      const [t1, t2] = t.split('~')
      Object.assign(this.form, {
        start: `${d} ${t1}`,
        end: `${d} ${t2}`,
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
