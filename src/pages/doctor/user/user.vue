<template>
  <view class="userWrap">
    <view class="headerTop">
      <image class="bg" :src="FILE_URL_BUILT_IN('headerBg.png')" mode="scaleToFill"></image>
      <view class="headerMain">
        <view class="flex-start-start" @click="!isDrugDoc ? goto('/pages-doctor/user/account') : ''">
          <image :src="avatar ? FILE_URL(avatar) : require('@/assets/user/user_d_head.png')"></image>
          <view class="headerInfo flex_1">
            <view class="flex-start-center">
              <view class="name">{{ userInfo.username }}</view>
              <view class="attestation" :class="!userInfo.hasAuth ? 'red-font' : ''">{{ userInfo.hasAuth ? '已实名' : '未实名' }}</view>
              <view class="attestation" :class="userInfo.examineState != 'SUCCESS' ? 'red-font' : ''">{{ authMap[userInfo.examineState] }}</view>
            </view>
            <view class="from">{{ userInfo.titleName }} {{ userInfo.orgName }} {{ userInfo.deptName }}</view>
            <view class="phone flex-between" style="margin-top: 10rpx;">
              <view>{{ util.noPassByMobile(userInfo.phone) }}</view>
              <view class="changerole" @click.stop="changeRole">
                <uni-icons type="loop" color="#0AB2C1" style="margin-top: 6rpx;margin-right: 17rpx;font-weight: bold;" :size="16"></uni-icons>
                {{ userInfo.roleName }}
              </view>
              <!-- <view v-else>{{ userInfo.roleName }}</view> -->
            </view>
          </view>
        </view>
        <view class="notice" @click="toQrcode" v-if="!isDrugDoc"><image :src="require('@/assets/user/erweima.png')"></image></view>
      </view>
    </view>
    <view class="pageWrap" v-if="!isDrugDoc">
      <view class="box-shadow pageItem">
        <view class="uni-center card flex-between">
          <view class="cardNum">
            <view v-if="dactorInfo.workHistory">
              <text>{{ dactorInfo.workHistory }}</text>
              <!-- 年 -->
            </view>
            <view v-else>-</view>
            <view>从业年限</view>
          </view>
          <view class="br"></view>
          <view class="cardNum">
            <view v-if="dactorInfo.diagNum">
              <text>{{ dactorInfo.diagNum }}</text>
              人
            </view>
            <view v-else>-</view>
            <view>服务人数</view>
          </view>
          <view class="br"></view>
          <view class="cardNum">
            <view v-if="dactorInfo.score">
              <text>{{ dactorInfo.score }}</text>
              分
            </view>
            <view v-else>-</view>
            <view>综合评分</view>
          </view>
        </view>
      </view>
      <view class="box-shadow pageItem function">
        <view class="flex-between">
          <view class="title">已开通业务</view>
          <view class="functionText flex_1" @click="isOpen = !isOpen">{{ bizTypeName }}</view>
          <text :class="['iconfont', isOpen ? 'icon-expand-down' : 'icon-zhankai']" @click="isOpen = !isOpen"></text>
        </view>
        <view v-show="isOpen">
          <view :class="['functionList', 'flex-between', item.totalState == 1 ? '' : 'disabled']" v-for="(item, index) in bizList" :key="index">
            <view class="functionName">
              <view>
                <text>{{ item.bizType == 'CONSULT' ? '在线\n咨询' : item.bizType == 'REPEAT_CLINIC' ? '在线\n复诊' : '慢病\n续方' }}</text>
                <switch class="switchAll" style="transform:scale(0.5);margin-left: -26rpx;" :checked="!!item.totalState" @change="bizTypeChange($event, item)" color="#0AB2C1" />
              </view>
            </view>
            <view class="functionMain flex_1">
              <view class="Item flex-between" v-for="(f, i) in item.bizWayList" :key="i">
                <template>
                  <view class="flex-start-center">
                    <view class="name">{{ f.bizWay == 'GRAPHIC' ? '图文' : f.bizWay == 'VIDEO' ? '视频' : '电话' }}</view>
                    <view :class="['num', f.bizWay == 'VIDEO' ? 'disabled' : '']">
                      <uni-number-box :disabled="f.bizWay == 'VIDEO'" :min="0" @change="numChange($event, item, f)" :value="f.peopleNum"></uni-number-box>
                    </view>
                  </view>
                  <view class="switch">
                    <switch
                      v-if="f.bizWay != 'VIDEO'"
                      :disabled="item.totalState == 0"
                      :checked="f.state == 1 ? true : false"
                      @change="bizWayChange($event, item, f)"
                      color="#0AB2C1"
                    />
                  </view>
                </template>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="linkList box-shadow">
        <view class="flex-between listItem" v-for="(item, index) in list" :key="index" @click="goto(item.url)">
          <image class="linkIcon" :src="item.icon"></image>
          <view class="flex_1 title">{{ item.title }}</view>
          <view class="flex-start-center">
            <view v-if="index == 0">{{ orderNum.waitTreat }}</view>
            <view v-if="index == 1">{{ orderNum.orderNum }}</view>
            <view v-if="index == 2">{{ orderNum.rpNumber }}</view>
            <view v-if="index == 3">{{ orderNum.disNumber }}</view>
            <view v-if="index == 4">{{ orderNum.evaluateNum }}</view>
            <view v-if="index == 5">{{ orderNum.systemMsgNum }}</view>
            <uni-icons type="arrowright" size="14" style="margin-left: 20rpx;" color="#666"></uni-icons>
          </view>
        </view>
      </view>
      <view class="box-shadow pageItem">
        <view :class="['main', isMeg ? 'mainAuto' : '']">
          <view class="messageItem" v-for="(item, index) in infoList" :key="index">
            <view class="flex-between">
              <view class="title">{{ item.title }}</view>
              <view class="edit" v-show="isMeg && item.isEdit">
                <view @click="textChange(item.key, index)" v-show="!item.isShow">
                  <uni-icons type="compose" size="18" color="#666"></uni-icons>
                  编辑
                </view>
                <view @click="editInfo(index)" v-show="item.isShow" class="wanc">
                  <text class="iconfont icon-wancheng"></text>
                  完成
                </view>
              </view>
            </view>
            <view :class="['textarea', isMeg ? '' : 'text-clamp']" v-if="!item.isShow">{{ dactorInfo[item.key] || '暂无' }}</view>
            <textarea
            v-if="item.isShow"
              maxlength="-1"
              class="textarea"
              :focus="isfocus"
              :cursor="dactorInfo[item.key].length"
              auto-height
              placeholder="请输入"
              v-model="form[item.key]"
            ></textarea>
          </view>
        </view>
        <view class="open" @click="isMeg = !isMeg"><image class="openIcon" :src="isMeg ? require('@/assets/hide.png') : require('@/assets/show.png')"></image></view>
      </view>
    </view>
    <view class="pageWrap orderWrap" style="z-index: 30;" v-if="isDrugDoc">
      <view class="oerderMain  box-shadow" style="margin-top: -50rpx;">
        <view class="orderItem flex-between" @click="goto('/pages-doctor/user/bindPhone')">
          <view class="title">{{ userInfo.phone ? '更换手机号' : '绑定手机号' }}</view>
          <view class="flex-start-center rightInfo">
            <view>{{ util.noPassByMobile(userInfo.phone) }}</view>
            <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
          </view>
        </view>
        <view
          class="orderItem flex-between"
          @click="userInfo.hasAuth ? this.$refs.popAuth.open() : goto('/pages-doctor/user/attestation/index')"
        >
          <view class="title">实名认证</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.hasAuth ? '已实名' : '未实名' }}</view>
            <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">资质认证</view>
          <view class="flex-start-center rightInfo" @click="goto('/pages-doctor/user/qualification')">
            <view>{{ authNameMap[userInfo.examineState] }}</view>
            <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
          </view>
        </view>
        <view class="orderItem flex-between" @click="goto(userInfo.phone ? '/pages-user/setting/resetPassword' : '/pages-doctor/user/bindPhone')">
          <view class="title">重置密码</view>
          <view class="flex-start-center rightInfo">
            <view></view>
            <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
          </view>
        </view>
      </view>
      <view class="oerderMain  box-shadow">
        <view class="orderItem flex-between">
          <view class="title">头像</view>
          <view class="flex-start-center rightInfo" @click="upImg">
            <image class="headerImg" :src="avatar ? FILE_URL(avatar) : require('@/assets/user/user_d_head.png')"></image>
            <uni-icons type="arrowright" size="14" class="rightIcon"></uni-icons>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">我的ID</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.userCode }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">姓名</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.username }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">性别</view>
          <view class="flex-start-center rightInfo"><view>女</view></view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">所在医院</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.orgName }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">科室</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.deptName }}</view>
          </view>
        </view>
        <view class="orderItem flex-between">
          <view class="title">职称</view>
          <view class="flex-start-center rightInfo">
            <view>{{ userInfo.titleName }}</view>
          </view>
        </view>
      </view>
      <button class="submit_btn" type="primary" @click="signOut">注销账号</button>
    </view>
    <pop-select ref="popselect" @submit="selectSubmit" title="用户身份" :list="roleList" @change="radioChangeType"></pop-select>
    <uni-popup ref="realName" :maskClick="false">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">{{ userInfo.hasAuth ? '资质' : '实名' }}认证提醒</view>
          <view class="realInfo">您的账号还未进行{{ userInfo.hasAuth ? '资质' : '实名' }}认证</view>
        </view>
        <view class="pop-btn flex-between">
          <view class="close flex_1" @click="this.$refs.realName.close()">跳过</view>
          <view
            class="flex_1"
            @click="goto(userInfo.hasAuth ? '/pages-doctor/user/qualification' :  '/pages-doctor/user/attestation/index')"
          >
            前往认证
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="popAuth">
      <view class="pop-wrap">
        <view class="pop-main">
          <view class="pop-title">实名信息</view>
          <view class="flex-start-center realInfo">
            <view class="name">姓名</view>
            <view class="flex_1">{{ userInfo.username }}</view>
          </view>
          <view class="flex-start-center realInfo">
            <view class="name">身份证</view>
            <view class="flex_1">{{ userInfo.idCard }}</view>
          </view>
        </view>
        <view class="pop-btn" @click="this.$refs.popAuth.close()"><text class="close" style="border: 0;">关闭</text></view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import util from '@/common/util';
import popSelect from '@/components/pop-select';
import { changeRole, upload } from '@/common/request/index';
import dayjs from 'dayjs';
import { orderCount, docFindMyConfig, updateH5DocBiz, doctorIntro, changeSelfText, changeAvatar } from '@/common/request/userCenter';
export default {
  components: {
    popSelect
  },
  data() {
    return {
      authMap: {
        TO_DOWN: '资质已驳回',
        TO_EXAMINE: '资质待审核',
        TO_CONFIRM: '资质待确认',
        SUCCESS: '资质已认证',
        FAIL: '资质未认证'
      },
      authNameMap: {
        TO_DOWN: '已驳回',
        TO_EXAMINE: '待审核',
        TO_CONFIRM: '待确认',
        SUCCESS: '已认证',
        FAIL: '未认证'
      },
      isOpen: false,
      isMeg: false,
      num: 10,
      util: util,
      roleId: this.$store.state.userInfo.roleId,
      orderNum: {},
      list: [
        {
          title: '待接诊订单',
          icon: require('@/assets/user/userIcon4.png'),
          url: '/pages-doctor/user/order/list?current=1'
        },
        {
          title: '我的订单',
          icon: require('@/assets/user/userIcon9.png'),
          url: '/pages-doctor/user/order/list'
        },
        {
          title: '我的处方',
          icon: require('@/assets/user/userIcon5.png'),
          url: '/pages-doctor/user/prescription/list'
        },
        {
          title: '我的处置',
          icon: require('@/assets/user/userIcon12.png'),
          url: '/pages-doctor/treatment/history/index'
        },
        {
          title: '我的评价',
          icon: require('@/assets/user/userIcon6.png'),
          url: '/pages-doctor/myEvaluate/list'
        },
        {
          title: '我的消息',
          icon: require('@/assets/user/userIcon8.png'),
          url: '/pages-doctor/message/list'
        },
        {
          title: '账号管理',
          icon: require('@/assets/user/userIcon10.png'),
          url: '/pages-doctor/user/account'
        }
      ],
      bizList: [],
      bizTypeName: '',
      dactorInfo: {},
      isskilled: true,
      isintro: true,
      ispracticeInfo: true,
      isacademicInfo: true,
      form: {
        skilled: '',
        intro: '',
        practiceInfo: '',
        academicInfo: ''
      },
      infoList: [
        {
          title: '擅长',
          key: 'skilled',
          isEdit: true,
          isShow: false
        },
        {
          title: '个人简介',
          key: 'intro',
          isEdit: true,
          isShow: false
        },
        {
          title: '执业经历',
          key: 'practiceInfo',
          isEdit: true,
          isShow: false
        },
        {
          title: '学术经历',
          key: 'academicInfo',
          isEdit: true,
          isShow: false
        },
        {
          title: '执业范围',
          key: 'practiceArea',
          isEdit: false,
          isShow: false
        }
      ],
      isDrugDoc: false,
      isfocus: true
    };
  },
  computed: {
    userInfo: function() {
      return this.$store.state.userInfo;
    },
    roleList: function() {
      return this.$store.state.userInfo.roleList;
    },
    avatar: function() {
      return this.$store.state.avatar;
    },
    workYear: function() {
      return (
        dayjs()
          .diff(this.dactorInfo.workHistory, 'y', true)
          .toFixed(1) * 1
      );
    }
  },
  created() {
    uni.setNavigationBarTitle({
      title: '我的'
    });
    if (this.userInfo.clientType == 'DRUG_DOC') {
      uni.setStorageSync('setStatusIndexFunc', 1);
      this.isDrugDoc = true;
    } else {
      this.getorderCount();
      this.getdocFindMyConfig();
      this.getdoctorIntro();
    }
  },
  mounted() {
this.isexamineOpen()
  },
  methods: {
    isexamineOpen(){
      if (!this.userInfo.hasAuth) {
        this.$refs.realName.open();
      } else {
        if (this.userInfo.examineState != 'TO_EXAMINE' && this.userInfo.examineState != 'SUCCESS') {
          this.$refs.realName.open();
        }
      }
    },
    // 医生详情
    async getdoctorIntro() {
      this.dactorInfo = await doctorIntro({
        id: uni.getStorageSync('userId')
      });
      // if (this.dactorInfo.workHistory) {
      //   this.dactorInfo.workHistory = this.dactorInfo.workHistory.split('年')[0]
      // } else {
      //   this.dactorInfo.workHistory = 0
      // }
      this.form.skilled = this.dactorInfo.skilled || '';
      this.form.intro = this.dactorInfo.intro || '';
      this.form.practiceInfo = this.dactorInfo.practiceInfo || '';
      this.form.academicInfo = this.dactorInfo.academicInfo || '';
    },
    textChange(type, index) {
      this.infoList[index].isShow = !this.infoList[index].isShow;
      this.$nextTick(() => {
        setTimeout(()=>{
          this.isfocus = true;
        },100)
      });
    },
    // 修改医生详情
    async editInfo(index) {
      await changeSelfText(this.form);
      this.infoList[index].isShow = !this.infoList[index].isShow;
      await this.getdoctorIntro();
      uni.showToast({
        title: '保存成功！'
      });
    },
    changeRole() {
      console.log(this.userInfo.roleList);
      if (this.userInfo.roleList.length > 1) {
        this.$refs.popselect.open();
      }
    },
    radioChangeType(e) {
      console.log(e);
      this.roleId = e;
    },
    //切换角色
    selectSubmit() {
      if (this.roleId == this.userInfo.roleId) {
        this.$refs.popselect.close();
      } else {
        changeRole({
          roleId: this.roleId
        }).then(res => {
					this.webSocket.close();
          uni.setStorageSync('setStatusIndexFunc', 2);
          this.$store.dispatch('loginInfo');
          this.$refs.popselect.close();
        });
      }
    },
    // 获取订单数量
    getorderCount() {
      orderCount().then(res => {
        this.orderNum = res;
      });
    },
    // 获取已开通业务
    async getdocFindMyConfig() {
      let list = await docFindMyConfig({
        doctorId: uni.getStorageSync('userId')
      });
      let afterData = [];
      list.forEach(item => {
        let flag = afterData.find(item1 => item1.bizType === item.bizType);
        if (!flag) {
          afterData.push({
            bizType: item.bizType,
            bizWayList: [item],
            totalState: item.totalState
          });
        } else {
          flag.bizWayList.push(item);
        }
      });

      this.bizTypeName = afterData.map(item => (item.bizType == 'CONSULT' ? '在线咨询' : item.bizType == 'REPEAT_CLINIC' ? '在线复诊' : '慢病续方'));
      this.bizList = afterData;
    },
    // 修改业务
    async editupdateH5DocBiz(data) {
      await updateH5DocBiz(data);
      await this.getdocFindMyConfig();
    },
    //修改业务状态
    bizTypeChange(e, item) {
      this.editupdateH5DocBiz({
        doctorId: uni.getStorageSync('userId'),
        bizType: item.bizType,
        state: e.target.value ? 1 : 0
      });
    },
    //修改业务方式
    bizWayChange(e, item, f) {
      this.editupdateH5DocBiz({
        doctorId: uni.getStorageSync('userId'),
        bizType: item.bizType,
        bizWay: f.bizWay,
        state: e.target.value ? 1 : 0
      });
    },
    // 修改接诊人数
    numChange(e, item, f) {
      console.log(e);
      this.editupdateH5DocBiz({
        doctorId: uni.getStorageSync('userId'),
        bizType: item.bizType,
        bizWay: f.bizWay,
        num: e
      });
    },
    goto(url) {
      this.$refs.realName.close();
      uni.navigateTo({
        url: url
      });
    },
    toQrcode() {
      uni.navigateTo({
        url: '/pages-doctor/qrcode/qrcode'
      });
    },
    // 上传头像
    upImg() {
      let that = this;
      uni.chooseImage({
        count: 1,
        success: chooseImageRes => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          upload(tempFilePaths[0]).then(async res => {
            console.log(res.body);
            await changeAvatar({
              avatar: res.body
            });
            that.$store.commit('avatar', res.body);
          });
        }
      });
    },
    reload() {
      this.$store.dispatch('loginInfo');
    },
    signOut() {
      uni.showModal({
        title: '确认退出账号?',
        success: res => {
          if (res.confirm) {
            this.$store.dispatch('signOut')
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.submit_btn {
  background: #fff !important;
  color: #e45b5b;
  margin-top: 30rpx;
  position: relative;
  bottom: 0;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
}

.red-font {
  color: #e45b5b;
}

.userWrap {
  padding-bottom: 100rpx;
}

.pageWrap {
  padding: 0 20rpx;
  margin-top: -20rpx;
  position: relative;
  z-index: 30;
}

.pageItem {
  background: #fff;
  margin-bottom: 20rpx;
}

.headerTop {
  width: 100%;
  height: 304rpx;
  position: relative;
  padding: 40rpx;
  padding-top: 30rpx;
  box-sizing: border-box;
  border-top: none !important;

  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .headerMain {
    position: relative;
    z-index: 3;

    image {
      width: 110rpx;
      height: 110rpx;
      border-radius: 50%;
      margin-right: 30rpx;
    }

    .headerInfo {
      color: #fff;
      font-size: 24rpx;

      .name {
        font-size: 34rpx;
        margin-bottom: 4rpx;

        text {
          font-size: 24rpx;
          margin-left: 20rpx;
        }
      }

      .from {
        font-size: 24rpx;
      }

      .attestation {
        padding: 0 12rpx;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        font-size: 20rpx;
        margin-left: 10rpx;
        margin-top: 10rpx;
        margin-bottom: 10rpx;
      }

      .phone {
        font-size: 26rpx;

        text {
          font-size: 24rpx;
          border: 1px solid #fff;
          border-radius: 20rpx;
          padding: 0 10rpx;
          margin-left: 16rpx;
          cursor: pointer;
        }
      }

      .changerole {
        height: 60rpx;
        line-height: 60rpx;
        background: #fff;
        border-radius: 30rpx 0 0 30rpx;
        color: $uni-color-primary;
        padding-left: 20rpx;
        padding-right: 25rpx;
        position: relative;
        right: -40rpx;
      }
    }

    .notice {
      position: absolute;
      right: 0;
      top: 10rpx;

      image {
        width: 44rpx;
        height: 44rpx;
        border-radius: 0;
      }
    }
  }
}

.card {
  padding: 40rpx;
  font-size: 24rpx;
  color: #666;
  text-align: center;

  .cardNum {
    font-size: 20rpx;
    padding: 0 20rpx;

    view {
      line-height: 46rpx;
      font-size: 24rpx;
    }

    text {
      font-size: 40rpx;
      color: #1a1a1a;
      font-weight: bold;
    }

    .yello {
      color: #ffa200;

      text {
        color: #ffa200;
      }
    }
  }

  .br {
    width: 1px;
    height: 76rpx;
    background: #e6e6e6;
  }
}

.linkList {
  padding-left: 30rpx;
  background: #fff;
  margin-bottom: 20rpx;
  overflow: hidden;

  .listItem {
    padding: 30rpx;
    padding-left: 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 70rpx;
      height: 1px;
      background: #e6e6e6;
      width: 100%;
    }

    .title {
      font-size: 30rpx;
      color: #333;
    }
  }

  .linkIcon {
    width: 50rpx;
    height: 50rpx;
    margin-right: 20rpx;
  }
}

.function {
  padding: 40rpx 30rpx;

  .title {
    font-size: 30rpx;
    color: #666666;
  }

  .functionText {
    color: $uni-color-primary;
    font-size: 24rpx;
    text-align: right;
    padding: 0 10rpx;
  }

  .iconfont {
    color: #999;
    font-size: 24rpx;
  }

  .functionList {
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 4px;
    margin-top: 40rpx;

    .functionName {
      width: 137rpx;
      color: #1a1a1a;
      font-size: 30rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
      text-align: center;
      line-height: 40rpx;

      // view {
      //   line-height: 40rpx;
      // }

      .switchAll {
        display: inline-block;
      }
    }

    .functionMain {
      padding-left: 40rpx;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%);

      .Item {
        border-bottom: 1px dashed #cccccc;
        padding: 8rpx 0;
        padding-right: 30rpx;
      }

      .name {
        font-size: 26rpx;
        color: #1a1a1a;
        margin-right: 20rpx;
      }

      .switch {
        switch {
          transform: scale(0.55);
        }
      }

      .num {
        /deep/.uni-numbox {
          align-items: center;
        }

        /deep/.uni-numbox__value {
          border: 1px solid #ccc;
          border-radius: 4rpx;
          background: #fff;
          width: 57rpx;
          height: 52rpx;
          margin: 0 10rpx;
          font-size: 30rpx;
        }

        /deep/.uni-numbox__minus {
          background-color: $uni-color-primary;
          border: 0;
          border-radius: 50%;
          color: #fff;
          width: 32rpx;
          height: 32rpx;
          line-height: 28rpx;
          text-align: center;
          font-size: 24rpx;
          display: block;

          .uni-numbox--text {
            color: #fff;
            font-size: 24rpx;
          }
        }

        /deep/.uni-numbox__plus {
          background-color: $uni-color-primary;
          border: 0;
          border-radius: 50%;
          color: #fff;
          width: 32rpx;
          height: 32rpx;
          line-height: 28rpx;
          text-align: center;
          font-size: 24rpx;
          display: block;

          .uni-numbox--text {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }
    }

    .num.disabled {
      /deep/.uni-numbox__value {
        color: #ccc;
      }

      /deep/.uni-numbox__minus {
        background-color: #ccc;
      }

      /deep/.uni-numbox__plus {
        background-color: #ccc;
      }
    }

    &.disabled {
      .functionName {
        color: #cccccc;
      }

      .functionMain {
        .name {
          color: #cccccc;
        }
      }

      .num {
        /deep/.uni-numbox__value {
          color: #ccc;
        }

        /deep/.uni-numbox__minus {
          background-color: #ccc;
        }

        /deep/.uni-numbox__plus {
          background-color: #ccc;
        }
      }
    }
  }
}

.main {
  padding: 30rpx 40rpx;
  padding-bottom: 0;
  height: 140rpx;
  transition: height 0.8s;
  overflow: hidden;

  &.mainAuto {
    height: auto;
  }

  .messageItem {
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 40rpx;
    margin-bottom: 40rpx;

    .title {
      position: relative;
      padding-left: 13rpx;
      font-size: 30rpx;
      color: #333;

      &::before {
        content: '';
        position: absolute;
        width: 3rpx;
        height: 30rpx;
        background: $uni-color-primary;
        left: 0;
        top: 50%;
        margin-top: -15rpx;
      }
    }

    .edit {
      color: #666;
      font-size: 26rpx;

      .wanc {
        color: $uni-color-primary;

        .iconfont {
          font-size: 35rpx;
        }
      }
    }

    .textarea {
      width: 634rpx;
      font-size: 26rpx;
      color: #666;
      margin-top: 20rpx;
      line-height: 36rpx !important;
    }
  }
}

.open {
  padding: 30rpx;

  .openIcon {
    width: 26rpx;
    height: 20rpx;
    display: block;
    margin: 0 auto;
  }
}

.orderWrap {
  margin-top: 0;
  padding-top: 20rpx;
  padding-bottom: 30rpx;

  .title {
    color: #1a1a1a !important;
  }

  .rightInfo {
    font-size: 30rpx;
    color: #666;

    .rightIcon {
      color: #666;
      padding-top: 2rpx;
      margin-left: 8rpx;
    }

    .headerImg {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
}
.realInfo {
  font-size: 30rpx;
  color: #1a1a1a;
  margin-top: 30rpx;
  .name {
    width: 120rpx;
    color: #666;
  }
}
</style>
