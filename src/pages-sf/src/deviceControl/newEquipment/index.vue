<template>
  <view class="mini-page">
    <view class="app-card">
      <template v-for="(val, index) in itemList">
        <AppListItem
          :label="val.label"
          :styles="{
            ...appItemStyle,
            display: val.value === 'useName' && formData.type ? 'none' : '',
          }"
          :textStyle="'font-size:30rpx;'"
          :className="val.isquire ? 'required' : ''"
          :key="index"
        >
          <view v-if="val.value === 'equipmentType'">{{
            formData.type ? '多人' : '单人'
          }}</view>
          <view class="input-view" v-else @click="handelClcik(val)">
            <input
              v-model="formData[val.value]"
              :placeholder="val.placeholder"
              :disabled="true"
              class="flex_1"
              placeholder-class="input_pla"
              v-if="val.value !== 'name'"
            />
            <!-- picker -->
            <picker
              @change="bindPickerChange"
              :range="equipmentList"
              :value="0"
              range-key="name"
              v-if="val.value === 'name'"
              style="width:100%"
            >
              <view class="uni-input" style="width:100%;padding:0">{{
                equipmentList[activeIndex].name
              }}</view>
            </picker>

            <uni-icons
              v-if="val.value === 'name' || val.value === 'useName'"
              color="#ccc"
              type="arrowright"
            ></uni-icons>
          </view>
        </AppListItem>
      </template>
    </view>
    <view class="bind-btn comfirm-btn" @click="handelBind">绑定</view>

    <!-- pop -->
    <uni-popup type="bottom" ref="userPopup">
      <view class="pop-content">
        <view class="pop-title"
          >选择绑定对象
          <view class="img-box" @click="closePop">
            <image
              class="image-colse"
              :src="require('@/assets/del.png')"
            ></image>
          </view>
        </view>
        <view class="list-item">
          <view
            v-for="(val, index) in patientList"
            :key="index"
            style="width:33.3%"
            class="list-box"
          >
            <view
              class="mini-item"
              :class="activePatient.patientId === val.patientId ? 'active' : ''"
              @click="changeTab(val)"
              >{{ val.name }}</view
            >
          </view>
        </view>
        <view class="comfirm-btn" @click="comfirmUser">确认</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { addEquipment, deviceTypes } from '@/pages-sf/api/equipment'
import { patientList } from '@/common/request/userCenter.js'
import AppListItem from '@/components/app/app-list-item'
export default {
  components: {
    AppListItem,
  },
  data() {
    return {
      patientCard: '',
      appItemStyle: {
        padding: '20rpx',
        paddingLeft: 0,
        marginLeft: '20rpx',
        width: 'auto',
        alignItems: 'center',
      },
      formData: {
        id: uni.getStorageSync('sfUserInfo').userId,
        type: 0,
      },
      activeIndex: 0,
      itemList: [
        {
          label: '设备名称  ',
          value: 'name',
          valType: 'select',
          isquire: true,
          placeholder: '请选择设备名称',
        },
        {
          label: '设备类型  ',
          value: 'equipmentType',
          valType: '',
          isquire: false,
        },
        {
          label: '使用者  ',
          value: 'useName',
          valType: 'select',
          isquire: true,
          placeholder: '请选择绑定对象',
        },
        {
          label: '设备型号  ',
          value: 'imei',
          valType: 'input',
          isquire: true,
          placeholder: '请输入设备型号',
        },
      ],
      patientList: [],
      activePatient: '',
      //设备列表
      equipmentList: [
        {
          imei: '10802454949878847111',
          name: '心率脉搏监护仪11',
          type: '单人',
        },
      ],
    }
  },
  created() {
    this.deviceTypes()
    this.getPatientList()
  },
  methods: {
    //设备列表
    async deviceTypes() {
      const res = await deviceTypes()
      this.equipmentList = res
      Object.assign(this.formData, {
        name: res[0].name,
        imei: res[0].imei,
        type: res[0].type === '单人' ? 0 : 1,
        deviceType: res[0].deviceType,
      })
    },

    //就诊人列表（互联网医院的数据）
    async getPatientList() {
      this.patientList = await patientList()
    },

    //点击当前行
    handelClcik(val) {
      val.value === 'useName' && this.$refs.userPopup.open()
    },
    closePop() {
      this.$refs.userPopup.close()
    },

    //选择就诊人
    changeTab(val) {
      this.activePatient = val
    },
    //确认选择就诊人
    comfirmUser() {
      this.$refs.userPopup.close()
      this.$set(this.formData, 'useName', this.activePatient.name)
      this.$set(this.formData, 'patientCard', this.activePatient.patientCard)
      this.patientCard = this.activePatient.patientCard
    },

    //绑定确认
    async handelBind() {
      console.log(this.formData, 'params-------日志')
      //新增多人设备删除就诊人卡号
      this.formData.type === 1
        ? delete this.formData.patientCard
        : (this.formData.patientCard = this.patientCard)

      await addEquipment(this.formData)
      await uni.showToast({
        title: '新增成功！',
      })
      uni.navigateBack()
      uni.$emit('updateList')
    },

    //设备选择
    bindPickerChange(e) {
      this.activeIndex = e.detail.value
      Object.assign(this.formData, {
        name: this.equipmentList[e.detail.value].name,
        imei: this.equipmentList[e.detail.value].imei,
        type: this.equipmentList[e.detail.value].type === '单人' ? 0 : 1,
        deviceType: this.equipmentList[e.detail.value].deviceType,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  picker {
    width: 100%;
  }
  padding: 10px;
  ::v-deep .required {
    .list-item-label {
      position: relative;
      &::before {
        content: '*';
        color: #ea4444;
        font-size: 20rpx;
        position: absolute;
        top: 0;
        left: -10rpx;
      }
    }
  }
  ::v-deep.input_pla {
    color: #ccc;
  }
  .input-view {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .pop-content {
    background: #fff;
    border-radius: 10px 10px 0px 0px;
    .pop-title {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-size: 16px;
      padding: 15px 0;
      border-bottom: 1px solid #e6e6e6;
      color: #333;
      .img-box {
        width: 15px;
        height: 15px;
        position: absolute;
        right: 15px;
        top: 15px;
        .image-colse {
          width: 15px;
          height: 15px;
        }
      }
    }
    .list-item {
      padding: 15px;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      .list-box {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .mini-item {
        width: 105px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        background: #f2f2f2;
        color: #666666;
        font-size: 14px;
        margin-bottom: 15px;
      }
      .active {
        background: #0ab2c1;
        color: #fff;
      }
    }
  }
  .comfirm-btn {
    width: 100%;
    height: 44px;
    background: #0ab2c1;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }
  .bind-btn {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>
