<template>
  <view class="mini-page">
    <view class="app-card" v-for="(val, index) in listData" :key="index">
      <view class="img-title">
        <view class="img-box"></view>
        <view class="title">
          <view class="name">{{ val.name }}</view>
          <view class="user">绑定对象：{{ val.equObject || '无' }}</view>
        </view>
      </view>
      <view class="rigth-btns">
        <view class="btns">
          <view
            @click="handleInput(val)"
            style="margin-right:10px"
            class="btn-mini"
            >我要录入</view
          >

          <view
            @click="handleTest(val)"
            class="btn-mini"
            style="margin-right:10px"
            >我要测量</view
          >
          <view @click="handleDelBind(val)" class="btn-mini">解绑</view>
        </view>
      </view>
    </view>
    <view class="add-btn"
      ><view @click="toAdd" class="addDevice">
        <view class="add-icon"></view>
        绑定设备</view
      ></view
    >
    <!-- pop -->
    <uni-popup type="bottom" ref="popup">
      <view class="pop-content">
        <view class="pop-title"
          >录入-{{ rowInfo.name }}
          <view class="img-box" @click="closePop">
            <image
              class="image-colse"
              :src="require('@/assets/del.png')"
            ></image>
          </view>
        </view>
        <view class="list-item">
          <AppListItem
            v-if="rowInfo.equObject"
            :label="`测量对象：${rowInfo.equObject || ''}`"
            :textStyle="'width:auto;'"
          >
          </AppListItem>
          <view class="objs" v-else>
            <view class="lable">测量对象</view>
            <view class="users">
              <view
                class="name"
                @click="handleClick(val)"
                v-for="val in patientList"
                :key="val.patientId"
                :class="val.patientCard === patientCard ? 'active' : ''"
                >{{ val.name || '' }}</view
              >
            </view>
          </view>
          <AppListItem
            :label="val.value"
            v-for="(val, i) in types[rowInfo.equipmentType]"
            :key="i"
          >
            <input
              placeholder="请输入"
              v-model="val.val"
              placeholder-style="color:#999"
              style="padding-left:10px"
            />
          </AppListItem>
        </view>
        <view class="comfirm-btn" @click="submitInfo">提交</view>
      </view>
    </uni-popup>

    <!-- pop -->
    <uni-popup type="bottom" ref="userPopup">
      <view class="pop-content">
        <view class="pop-title"
          >选择测量对象
          <view class="img-box" @click="closeuserPop">
            <image
              class="image-colse"
              :src="require('@/assets/del.png')"
            ></image>
          </view>
        </view>
        <view class="list-item" style="display:flex;flex-wrap: wrap;">
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
import {
  deviceList,
  delBind,
  entryDevice,
  devMeasure,
} from '@/pages-sf/api/equipment'
import { patientList } from '@/common/request/userCenter.js'
import uniPopup from '../../../components/uni-popup/uni-popup.vue'
import AppListItem from '@/components/app/app-list-item'
export default {
  components: { uniPopup, AppListItem },
  data() {
    return {
      patientList: [],
      patientCard: '',
      activePatient: {},
      listData: [{ title: '设备名称', user: 'xxxx', ismeasure: false }],
      rowInfo: {},
      types: {
        '1': [
          {
            key: 'arg0',
            value: '高压',
            val: '',
          },
          {
            key: 'arg1',
            value: '低压',
            val: '',
          },
        ],
        '2': [
          {
            key: 'arg0',
            value: '血糖',
            val: '',
          },
        ],
        '3': [
          {
            key: 'arg0',
            value: '血氧',
            val: '',
          },
        ],
        '4': [
          {
            key: 'arg0',
            value: '脉搏',
            val: '',
          },
          {
            key: 'arg1',
            value: '心率 ',
            val: '',
          },
          {
            key: 'arg2',
            value: '房颤',
            val: '',
          },
        ],
      },
    }
  },
  created() {
    this.deviceList()
    this.getPatientList()
  },
  mounted() {
    uni.$on('updateList', () => {
      this.deviceList()
    })
  },
  methods: {
    //确认选择就诊人
    comfirmUser() {
      this.closeuserPop()
      this.measuredData()
    },
    async measuredData() {
      const params = {
        deviceType: this.rowInfo.equipmentType,
        id: this.rowInfo.id,
        imei: this.rowInfo.imei,
        name: this.rowInfo.name,
        patientCard: this.activePatient.patientCard,
        state: 0,
        type: this.rowInfo.type,
      }
      uni.showLoading({ title: '数据获取中...' })
      await devMeasure(params)
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '测量成功',
        })
      }, 500)
    },
    closeuserPop() {
      this.$refs.userPopup.close()
    },
    handleTest(val) {
      this.rowInfo = val

      if (!val.type) {
        this.measuredData()
        return
      }
      this.$refs.userPopup.open()
    },
    handleClick(val) {
      this.patientCard = val.patientCard
      console.log(this.patientCard)
    },
    //就诊人列表（互联网医院的数据）
    async getPatientList() {
      this.patientList = await patientList()
    },
    //设备列表
    async deviceList() {
      this.listData = await deviceList({
        uid: uni.getStorageSync('sfUserInfo').userId,
      })
    },
    //解绑设备
    async handleDelBind(val) {
      await delBind({ id: val.id, imei: val.imei })
      uni.showToast({
        title: '解绑成功！',
      })
      this.deviceList()
    },
    //打开录入设备
    handleInput(val) {
      this.$refs.popup.open()
      this.rowInfo = val
    },
    closePop() {
      this.$refs.popup.close()
    },
    async submitInfo() {
      console.log('提交成功----')

      //指标集合
      let idents = {}
      this.types[this.rowInfo.equipmentType].forEach(val => {
        if (!idents[val.key]) {
          idents[val.key] = val.val
        }
      })
      const params = {
        id: this.rowInfo.id,
        pid: this.rowInfo.pcard || this.patientCard,
        type: this.rowInfo.equipmentType,
        ...idents,
      }
      const isValue = Object.values(idents).some(val => val) //是否输入测量值
      if (!isValue) {
        uni.showToast({
          title: '请输入测量值',
          icon: 'none',
        })
        return
      }
      console.log(params, isValue, '参数------')
      await entryDevice(params)

      uni.showToast({
        title: '提交成功',
      })
      this.$refs.popup.close()
    },
    toAdd() {
      uni.navigateTo({
        url: '/pages-sf/src/deviceControl/newEquipment/index',
      })
    },
    //选择就诊人
    changeTab(val) {
      this.activePatient = val
    },
  },
}
</script>

<style lang="scss" scoped>
.mini-page {
  padding: 10px;
  .app-card {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    margin-top: 10px;
    .img-title {
      display: flex;
      align-items: center;
      .img-box {
        width: 37px;
        height: 37px;
        background: url(@/pages-sf/images/equipment.png) no-repeat;
        background-size: cover;
        margin-right: 10px;
      }
      .title {
        .name {
          font-size: 14px;
          color: #1a1a1a;
        }
        .user {
          font-size: 12px;
          color: #666;
          // margin-top: 10px;
        }
      }
    }
    .rigth-btns {
      display: flex;
      justify-content: flex-end;
    }
    .btns {
      display: flex;
      .btn-mini {
        padding: 4px 12px;
        border: 1px solid #0ab2c1;
        color: #0ab2c1;
        border-radius: 18px;
      }
    }
  }
  .add-btn {
    display: flex;
    justify-content: center;
  }
  .addDevice {
    margin-top: 15px;
    width: 345px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0ab2c1;
    color: #fff;
    border-radius: 22px;
    font-size: 16px;
    .add-icon {
      width: 15px;
      height: 15px;
      margin-right: 5px;
      background: url(@/pages-sf/images/jiahao.png);
      background-size: cover;
    }
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
      // padding-left: 10px;
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
  .objs {
    border-bottom: 1px solid #e6e6e6;
    padding-left: 10px;
    color: #666;
    .lable {
      margin: 10px 0;
    }
    .users {
      display: flex;
      justify-content: flex-start;
      margin-right: 10px;
      flex-wrap: wrap;
      .name {
        width: 77px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ededed;
        border-radius: 15px;
        margin-right: 9px;
        margin-bottom: 10px;
      }
      .active {
        color: #fff;
        background: #0ab2c1;
      }
    }
  }
  .list-box {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>
