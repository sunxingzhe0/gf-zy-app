<template>
  <view>
    <app-card styles="padding: 0 0 60rpx 0">
      <app-list-item label="名称">
        <input
          disabled
          class="list-input"
          :value="form.name"
          @click="clickHandler('keyword')"
          placeholder="请输入治疗名称关键字查找"
        />
        <text class="iconfont icon-jiantou"></text>
      </app-list-item>
      <app-list-item label="部位">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          :value="form.partNames.join('，')"
          @click="clickHandler('parts')"
        />
        <text class="iconfont icon-jiantou"></text>
      </app-list-item>
      <app-list-item label="频次">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          @click="clickHandler('frequency')"
        />
        <text class="iconfont icon-jiantou"></text>
      </app-list-item>
      <app-list-item label="疗程">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          @click="clickHandler('course')"
        />
        <text class="iconfont icon-jiantou"></text>
      </app-list-item>
      <app-list-item label="是否加急">
        <switch color="#09B1C1" class="expedited" @change="switchChange" />
      </app-list-item>
      <app-list-item label="执行科室">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          @click="clickHandler('department')"
        />
        <text class="iconfont icon-jiantou"></text>
      </app-list-item>
      <app-list-item label="费用" :value="'¥' + form.price"></app-list-item>
      <!-- <app-list-item label="预约执行时间">
        <input
          disabled
          class="list-input"
          placeholder="请选择"
          @click="clickHandler('appointment')"
        />
        <text class="iconfont icon-jiantou"></text>
      </app-list-item> -->
      <app-list-item label="要求" noBorder> </app-list-item>
      <textarea
        class="textarea"
        placeholder="请输入"
        maxlength="250"
      ></textarea>
    </app-card>
    <uni-popup ref="keyword" type="bottom">
      <InspectName type="CURE" @change="onInspectNameChange" />
    </uni-popup>
    <uni-popup ref="parts" type="center">
      <parts
        v-if="form.dictDisposeId"
        type="EXAMINE"
        :dictDisposeId="form.dictDisposeId"
        @change="onPartChange"
      />
    </uni-popup>
    <uni-popup ref="frequency" type="bottom">选择频次</uni-popup>
    <uni-popup ref="course" type="bottom">选择疗程</uni-popup>
    <uni-popup ref="department" type="bottom">选择科室</uni-popup>
    <uni-popup ref="appointment" type="bottom">选择预约时间</uni-popup>
  </view>
</template>

<script>
import AppCard from '@/components/app/app-card'
import AppListItem from '@/components/app/app-list-item'
import InspectName from '../popup/inspectName'
import Parts from '../popup/parts'
export default {
  components: {
    AppCard,
    AppListItem,
    InspectName,
    Parts,
  },
  data() {
    return {
      form: {
        type: 'CURE',
        name: '',
        dictDisposeId: '',
        partIds: '',
        partNames: '',
        price: 0,
      },
    }
  },
  methods: {
    clickHandler(name) {
      try {
        this.$refs[name].open()
      } catch (err) {
        console.error(err)
      }
    },
    switchChange(evnet) {
      console.log(evnet.target.value)
    },
    closePopup(name) {
      try {
        this.$refs[name].close()
      } catch (err) {
        console.error(err)
      }
    },
    onInspectNameChange({ name, id }) {
      Object.assign(this.form, {
        name,
        dictDisposeId: id,
      })
      this.closePopup('keyword')
    },
    onPartChange(options) {
      Object.assign(this.form, {
        partIds: options.map(item => item.value),
        partNames: options.map(item => item.label),
      })

      this.closePopup('parts')
    },
  },
}
</script>

<style lang="scss" scoped>
@import './treatment.scss';
</style>
