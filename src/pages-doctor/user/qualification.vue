<template>
  <view class="addWrap">
    <!--主页按钮-->
    <homeIcom />
    <view class="box-shadow" style="position: relative;">
      <image
        v-if="
          infoData.examineState != 'TO_CONFIRM' &&
            infoData.examineState != 'FAIL'
        "
        style="position: absolute; width: 144rpx; height: 114rpx; top: 40rpx; right: 60rpx; z-index: 2;"
        :src="
          infoData.examineState == 'TO_EXAMINE'
            ? require('@/assets/examineState1.png')
            : infoData.examineState == 'TO_DOWN'
            ? require('@/assets/examineState2.png')
            : require('@/assets/examineState3.png')
        "
      ></image>
      <uni-list class="inputWrap">
        <!-- style="padding-left: 0;" -->
        <uni-list-item :show-arrow="false">
          <picker
            @change="bindPickerChange($event, 'defDeptId')"
            :disabled="infoData.examineState != 'TO_CONFIRM'"
            :value="defDeptIdIndex"
            range-key="name"
            :range="departmentList"
          >
            <view class="flex-between">
              <view class="title">
                科室
                <text class="red">*</text>
              </view>
              <input
                :value="departmentList[defDeptIdIndex].name"
                disabled
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请选择"
              />
              <uni-icons
                type="arrowright"
                size="14"
                class="rightIcon"
                v-if="infoData.examineState == 'TO_CONFIRM'"
              ></uni-icons>
            </view>
          </picker>
        </uni-list-item>
      </uni-list>
      <uni-list class="inputWrap">
        <!-- style="padding-left: 0;" -->
        <uni-list-item :show-arrow="false">
          <picker
            @change="bindPickerChange($event, 'titleId')"
            :disabled="infoData.examineState != 'TO_CONFIRM'"
            :value="titleIdIndex"
            range-key="name"
            :range="titleList"
          >
            <view class="flex-between">
              <view class="title">
                职称
                <text class="red">*</text>
              </view>
              <input
                :value="titleList[titleIdIndex].name"
                class="flex_1"
                placeholder-class="input_pla"
                placeholder="请选择"
              />
              <uni-icons
                type="arrowright"
                size="14"
                class="rightIcon"
                v-if="infoData.examineState == 'TO_CONFIRM'"
              ></uni-icons>
            </view>
          </picker>
        </uni-list-item>
        <!-- style="padding-left: 0;" -->
        <uni-list-item :show-arrow="false">
          <view class="flex-between">
            <view class="title">
              执业范围
              <text class="red">*</text>
            </view>
            <textarea
              class="flex_1"
              v-model="form.practiceArea"
              :disabled="infoData.examineState != 'TO_CONFIRM'"
              maxlength="1000"
              auto-height
              placeholder="请输入，最多1000字"
              placeholder-class="input_pla"
            ></textarea>
          </view>
        </uni-list-item>
        <!-- style="padding-left: 0;" -->
        <uni-list-item
          :show-arrow="false"
          v-if="infoData.examineState == 'TO_DOWN'"
        >
          <view class="flex-between">
            <view class="title">驳回原因</view>
            <view class="" style="width: 440rpx;word-break: break-all">{{
              infoData.examineReason
            }}</view>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
    <view class="box-shadow" v-for="(item, index) in certs" :key="index">
      <template
        v-if="
          infoData.examineState == 'TO_CONFIRM' ||
            infoData.examineState == 'FAIL' ||
            (infoData.examineState != 'TO_CONFIRM' && item.certNo)
        "
      >
        <uni-list class="inputWrap">
          <!-- style="padding-left: 0;" -->
          <uni-list-item :show-arrow="false">
            <view class="fielUp">
              <view class="title">
                {{ item.typeName }}编号
                <text class="red">*</text>
              </view>
              <input
                type="text"
                v-model="item.certNo"
                :disabled="
                  infoData.examineState != 'TO_CONFIRM' &&
                    infoData.examineState != 'FAIL'
                "
                class="fielInput"
                placeholder-class="input_pla"
                :placeholder="`请输入${item.typeName}编号`"
              />
              <block v-for="(img, f) in item.fileId" :key="f">
                <view class="upImg" @click="del(item.type, f + 1)">
                  <image class="upBg" :src="FILE_URL(img)"></image>
                  <uni-icons
                    type="trash-filled"
                    style="position: absolute;"
                    v-if="
                      infoData.examineState == 'TO_CONFIRM' ||
                        infoData.examineState == 'FAIL'
                    "
                    :size="27"
                    color="#E45B5B"
                  ></uni-icons>
                </view>
              </block>

              <view
                class="upImg"
                @click="upImg(item.type)"
                v-if="
                  infoData.examineState == 'TO_CONFIRM' ||
                    infoData.examineState == 'FAIL'
                "
              >
                <image
                  class="upBg"
                  :src="require('@/assets/certificate.png')"
                ></image>
                <view class="upMain">
                  <image
                    class="upadd"
                    :src="require('@/assets/addIcon.png')"
                  ></image>
                  <view class="upName">{{ item.typeName }}</view>
                </view>
              </view>
            </view>
          </uni-list-item>
        </uni-list>
      </template>
    </view>
    <view
      class="fiexBtn flex-between"
      v-if="infoData.examineState != 'SUCCESS'"
    >
      <view
        class="addBtn withdraw"
        @click="withdraw"
        v-if="infoData.examineState == 'TO_EXAMINE'"
        >撤回</view
      >
      <view
        class="addBtn"
        @click="preservation"
        v-if="
          infoData.examineState == 'TO_CONFIRM' ||
            infoData.examineState == 'FAIL'
        "
        >保存</view
      >
      <view
        class="addBtn"
        @click="submit"
        v-if="
          infoData.examineState == 'TO_CONFIRM' ||
            infoData.examineState == 'FAIL'
        "
        >提交</view
      >
      <view
        class="addBtn"
        @click="changeState('TO_CONFIRM')"
        v-if="infoData.examineState == 'TO_DOWN'"
        style="border-radius: 40px;"
        >重新提交</view
      >
    </view>
  </view>
</template>

<script>
import util from '@/common/util.js'
import {
  selfQualAuth,
  sendQualAuth,
  recallAuth,
} from '@/common/request/userCenter'
import { deptChooseList, titleChooseList, upload } from '@/common/request/index'
export default {
  data() {
    return {
      themeColor: '#0AB2C1',
      departmentList: [],
      titleList: [],
      titleIdIndex: 0,
      defDeptIdIndex: 0,
      infoData: {},
      ismore: false,
      certs: [
        {
          fileId: [],
          type: 'DRUG',
          typeName: '药师资格证',
          certNo: '',
          practiceOrg: '',
        },
        {
          fileId: [],
          type: 'PHYS_QUAL',
          typeName: '医师资格证',
          certNo: '',
          practiceOrg: '',
        },
        {
          fileId: [],
          type: 'DOCTOR_QUAL',
          typeName: '医师执业证',
          certNo: '',
          practiceOrg: '',
        },
        {
          fileId: [],
          type: 'NURSE',
          typeName: '护士执业证',
          certNo: '',
          practiceOrg: '',
        },
        {
          fileId: [],
          type: 'TECH',
          typeName: '专业技术资格证',
          certNo: '',
          practiceOrg: '',
        },
      ],

      form: {
        defDeptId: '',
        titleId: '',
        practiceArea: '',
      },
    }
  },
  async onLoad() {
    //科室
    this.departmentList = await deptChooseList({
      tree: false,
    })
    // 职称
    this.titleList = await titleChooseList()
    this.getselfQualAuth()
  },
  methods: {
    changeState(type) {
      this.infoData.examineState = type
    },
    // 获取资质详情
    async getselfQualAuth() {
      let infodata = await selfQualAuth()

      if (infodata.certs == null) {
        infodata.certs = []
      }
      this.infoData = infodata
      let store = uni.getStorageSync('qualifications')
      console.log(store)
      if (this.infoData.examineState != 'SUCCESS' && store) {
        this.infoData.certs = store.certs
        this.infoData.defDeptId = store.form.defDeptId
        this.infoData.titleId = store.form.titleId
        this.infoData.practiceArea = store.form.practiceArea
      }
      this.form.defDeptId = this.infoData.defDeptId
      this.form.titleId = this.infoData.titleId
      this.form.practiceArea = this.infoData.practiceArea
      this.departmentList.forEach((f, h) => {
        if (f.id == this.infoData.defDeptId) {
          this.defDeptIdIndex = h
        }
      })
      this.titleList.forEach((f, h) => {
        if (f.id == this.infoData.titleId) {
          this.titleIdIndex = h
        }
      })
      let tempList = []
      this.certs.forEach(f => {
        this.infoData.certs.forEach(i => {
          if (f.type == i.type) {
            if (i.fileId.length && i.fileId[0]) {
              f.fileId = i.fileId
            }
            f.certNo = i.certNo
            f.practiceOrg = i.practiceOrg
            tempList.push(f)
          }
        })
      })
      this.certs = tempList
      console.log(tempList)
    },
    back() {
      uni.navigateBack({
        delta: 1,
      })
    },
    bindPickerChange(e, key) {
      console.log(e)
      this[key + 'Index'] = e.detail.value
      this.form[key] = this[key + 'List'][e.detail.value]
    },
    async submit() {
      if (this.form.defDeptId == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择科室',
        })
        return false
      }
      if (this.form.titleId == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择职称',
        })
        return false
      }
      if (this.form.practiceArea == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入执业范围',
        })
        return false
      }
      let certs = []
      let isfa = true
      this.certs.forEach((i, index) => {
        if (i.certNo == '' || i.fileId.length == 0) {
          uni.showToast({
            title: '请把相关的证书填写完整',
            icon: 'none',
          })
          isfa = false
        } else {
          certs.push(i)
        }
      })
      if (isfa) {
        if (certs.length == 0) {
          uni.showToast({
            title: '请把相关的证书填写完整',
            icon: 'none',
          })
          return false
        }
        this.form.certs = certs
        let res = await sendQualAuth(this.form)
        if (res) {
          uni.setStorageSync('qualifications', {
            certs: this.certs,
            form: this.form,
          })
          uni.removeStorageSync('qualifications')
          await this.$store.dispatch('loginInfo', true)
          uni.showToast({
            title: '提交成功',
          })
          setTimeout(() => {
            this.back()
          }, 1500)
        }
      }
    },
    // 撤回
    async withdraw() {
      await recallAuth()
      await this.$store.dispatch('loginInfo', true)
      this.getselfQualAuth()
    },
    // 保存
    preservation() {
      uni.setStorageSync('qualifications', {
        certs: this.certs,
        form: this.form,
      })
      uni.showToast({
        title: '保存成功',
      })
    },
    // 证书上传
    upImg(name, f) {
      uni.chooseImage({
        count: 1,
        success: chooseImageRes => {
          upload(chooseImageRes.tempFilePaths[0]).then(res => {
            this.certs.forEach(i => {
              if (i.type == name) {
                if (f) {
                  i.fileId[f - 1] = res.body
                } else {
                  i.fileId.push(res.body)
                }
              }
            })
          })
        },
      })
    },
    del(name, f) {
      if (
        ['TO_CONFIRM', 'FAIL', 'TO_DOWN'].includes(this.infoData.examineState)
      ) {
        this.certs.forEach((i, index) => {
          if (i.type == name) {
            i.fileId.splice(f - 1, 1)
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.addWrap {
  padding: 20rpx;
  padding-bottom: 140rpx;

  .box-shadow {
    background: #fff;
    overflow: hidden;
    margin-bottom: 20rpx;
  }
}

.inputWrap {
  .title {
    width: 210rpx;
    font-size: 30rpx;
    color: #666;

    .red {
      color: #ea4444;
      position: relative;
      top: -10rpx;
    }
  }

  .title2 {
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
  }

  .fielUp {
    .title {
      width: auto;
    }

    .fielInput {
      width: 100%;
      margin: 30rpx 0;
    }

    .upImg {
      height: 340rpx;
      border: 1px dashed #ccc;
      border-radius: 4px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 10rpx;
      margin-bottom: 20rpx;

      .upBg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .upMain {
        position: relative;
        z-index: 2;
        text-align: center;

        .upadd {
          width: 100rpx;
          height: 100rpx;
        }

        .upName {
          color: #1a1a1a;
          font-weight: bold;
          font-size: 26rpx;
          padding-top: 10rpx;
        }
      }
    }
  }

  .getcode {
    color: $uni-color-primary;
  }

  .tag {
    background: #f2f2f2;
    color: #333;

    &.on {
      background: $uni-color-primary;

      ::v-deep.uni-tag--default {
        color: #fff;
      }
    }

    &:nth-child(1) {
      margin-right: 30rpx;
    }
  }

  ::v-deep.uni-list-item--hover {
    background: none;
  }

  .input_pla {
    font-size: 30rpx;
    color: #ccc;
  }

  input {
    font-size: 30rpx;
  }
}

.next {
  margin-top: 30rpx;
  position: relative;
  left: 0;
  margin-left: 15px;
  width: auto;
  bottom: 0;
}

.tipWrap {
  padding: 0 15px;

  .tipText {
    font-size: 24rpx;
    color: #666;

    text {
      color: $uni-color-error;
    }
  }
}

.fiexBtn {
  position: fixed;
  width: 100%;
  z-index: 6;
  padding: 0 20rpx;
  height: 128rpx;
  background: #fff;
  border-top: 1px solid #e6e6e6;
  box-sizing: border-box;
  bottom: 0;
  left: 0;

  .addBtn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #f2f2f2;
    font-size: 30rpx;
    color: #333;
    cursor: pointer;
    border-radius: 44px 0 0 44px;

    &:nth-last-child(1) {
      background: $uni-color-primary;
      color: #fff;
      border-radius: 0 44px 44px 0;
    }
  }

  .withdraw {
    border-radius: 44px !important;
    background: rgba(10, 178, 193, 0.1) !important;
    color: $uni-color-primary !important;
  }
}
</style>
