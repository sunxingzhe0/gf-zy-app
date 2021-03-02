<template>
  <view>
    <!-- 收到视频聊天邀请 -->
    <video-invitation />
    <!--主页按钮-->
    <homeIcom />
    <view class="headerTop box-shadow">
      <view class="visit flex-between" @click="selecvisit">
        <view class="title">就诊人</view>
        <view class="name" @click="selecvisit">
          {{ selectActive.length == selectList.length ? '全部' : selectName }}
          <uni-icons type="arrowright" color="#666" class="rightIcon" :size="12"></uni-icons>
        </view>
      </view>
      <scroll-view scroll-x class="tabList">
        <view class="tabWrap">
          <view :class="['tabItem', current == item.value ? 'on' : '']" @click="tabTap(item.value)" v-for="(item, index) in tabList" :key="index">
            {{ item.name }}
            <text>({{ item.num }})</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="listWrap">
      <view
        class="listItem box-shadow"
        :style="{ paddingBottom: current == 'UNPAID' ? '20rpx' : '' }"
        v-for="(item, index) in list"
        :key="index"
        @click="gotoInfo(`/pages-user/prescriptionOrder/detail?id=${item.orderId}`,item.orderStatus)"
      >
        <view class="list_a flex-between" v-if="current != 'UNPAID'">
          <text>订单号：{{ item.orderId }}</text>
          <text :class="item.orderStatus == 'FINISHED' || item.orderStatus == 'CLOSED' ? '' : 'state'">{{ getstate(item.orderStatus) }}</text>
        </view>
        <view v-else class="list_a flex-between">
          <text>服务订单号：{{ item.orderId }}</text>
        </view>
        <view v-if="current != 'UNPAID'">
          <view class="list_a flex-between" v-if="item.orderStatus == 'WAIT_RECEIVE'" @click="logisticsInfo">
            <image class="textIcon" :src="require('@/assets/receivedIcon.png')"></image>
            <view class="receivedInfo">
              <view class="text-overflow">【{{ item.expressInfo.province }}】{{ item.expressInfo.content }}</view>
              <text class="">{{ item.expressInfo.update_time }}</text>
            </view>
            <uni-icons type="arrowright" class="rightIcon"></uni-icons>
          </view>
          <view class="list_b flex-start-center">
            <text class="title">就诊人</text>
            <text class="value">{{ item.memberName }}</text>
          </view>
          <view class="list_b flex-start-center">
            <text class="title">开方医生</text>
            <text class="value">{{ item.doctorName }} {{ item.titleName }} {{ item.deptName }}</text>
          </view>
          <view class="list_b flex-start-center">
            <text class="title">关联处方</text>
            <text class="value">{{ item.rpNumber }}个</text>
          </view>
          <view class="list_b flex-start-center">
            <text class="title">数量</text>
            <text class="value">{{ item.drugNumber }}个</text>
          </view>
          <view class="list_b flex-start-center">
            <text class="title">开方时间</text>
            <text class="value">{{ item.rpTime }}</text>
          </view>
          <view class="flex-between list_c" >
            <view class="time"></view>
            <view class="flex-start-center" @click.stop>
              <button plain class="optBtn" v-if="item.option.pay" @click="pay(item.orderId)">付款</button>
              <button plain class="optBtn on" v-if="item.option.showExpress" @click="gotoInfo('/pages-user/logistics/logistics?id=' + item.expressInfo.id,item.orderStatus)">查看物流</button>
              <button plain class="optBtn" v-if="item.option.confirm" @click="operation(item.orderId, 'confirm')">确认收货</button>
              <button plain class="optBtn" v-if="item.option.take" @click="selfExtracting(item.orderId)">自提码</button>
              <button plain class="optBtn" v-if="item.option.cancel" @click="operation(item.orderId, 'cancel')">取消</button>
              <button plain class="optBtn" v-if="item.option.delete" @click="operation(item.orderId, 'delete')">删除</button>
            </view>
          </view>
        </view>
        <view v-else >
          <!-- <evan-checkbox-group :ref="`check`" v-model="item.ischeck" > -->
            <view
              class="orderItem"
              v-for="(r, p) in item.rpList"
              :key="r.id"
              style="padding-right: 30rpx;margin-bottom: 20rpx; border-bottom: 1px solid #e6e6e6; padding-bottom: 30rpx;"
            >
              <view class="prescription flex-between" >
                <view class="prescriptionTitle" @click.stop>
                  <evan-checkbox :label="r.id" :value="r.checked" shape="square" :primary-color="primaryColor" @change="checkboxChange(item, r)">
                    <text class="checkText">处方号：{{ r.id }}</text>
                  </evan-checkbox>
                </view>
                <!-- <view class="price">￥{{ r.rpFee }}</view> -->
              </view>
              <view class="prescribe color666">
                <text>数量:{{ r.number }}</text>
                <text>医生：{{ r.doctorName }} {{ r.title }}</text>
                <text>{{ r.createTime }}</text>
              </view>
              <view class="font24 color666">
                {{ countdown(index, p, r) }} 距离处方失效还剩&emsp;
                <uni-countdown
                  color="#E45B5B"
                  style="display: inline-block;"
                  splitor-color="#E45B5B"
                  background-color="#fff"
                  border-color="#fff"
                  :show-day="false"
                  :hour="r.hours || 0"
                  :minute="r.minutes || 0"
                  :second="r.seconds || 0"
                ></uni-countdown>
                ，请尽快支付！
              </view>

              <view class="prescribeInfo text-overflow">
                <text>诊断：</text>
                {{ r.diagnosis }}
              </view>
              <view class="flex-start-center">
                <view class="font24 color666">处方有效期截至：</view>
                <view class="font24 colorred">{{ r.expireDate }}</view>
              </view>
              <view class="flex-between">
                <view class="pricolor font30">￥{{ r.prescriptionPrice }}</view>
                <view @click.stop class="more color666 font24" @click="tapOpen(index, p)">
                  {{ !r.isOpen ? '查看' : '收起' }}详情
                  <image :class="!r.isOpen ? 'moreUp' : 'moreDown'" :src="require('@/assets/zhankaihui@2x.png')"></image>
                </view>
              </view>
              <view class="recipelInfo" v-show="r.isOpen">
                <view class="recipelItem" v-for="(f, i) in r.rpDrugList" :key="i">
                  <view class="flex-between">
                    <view class="font26">{{ i + 1 }}.{{ f.name }}（规格：{{ f.spec }}）</view>
                    <view class="font26 color666">医保：{{ swithMedicare(f.medicare) }}</view>
                  </view>
                  <view class=" font26 paddingLeft16 color666">
                    {{ f.useWaysText }} {{ f.useFrequencyText }} {{ f.singleDose }}{{ f.singleDoseUnitText }}/次 {{ f.treatment||'-' }}{{ f.treatmentUnitText }} x{{ f.total }}{{ f.totalUnitText }} ￥{{
                      f.price
                    }}/{{ f.singleDoseUnitText }}
                  </view>
                  <view class="font30 pricolor">￥{{ f.totalPrice }}</view>
                  <view class="font24 color666 paddingLeft16">备注：{{ f.remark }}</view>
                </view>
              </view>
            </view>
          <!-- </evan-checkbox-group> -->
          <view class="flex-between" style="padding-right: 30rpx; padding-top: 15rpx;" @click.stop  >
            <evan-checkbox :value="item.isAll" shape="square" :primary-color="primaryColor" @change="allChange(index,item)"><text class="checkText">全选</text></evan-checkbox>
            <view class="flex-start-center">
              <view class="font30 pricolor">￥{{ item.totalPrice || '0.00' }}</view>
              <button class="optBtn PayBtn" @click="pay(index)">支付</button>
            </view>
          </view>
        </view>
      </view>
      <uni-load-more v-show="pages > 1" :status="more"></uni-load-more>
    </view>
    <pop-select ref="popselect" @submit="selectSubmit" title="就诊人" :multi="true" :list="selectList" @change="radioChangeType"></pop-select>
    <uni-popup ref="selfExtracting" type="bottom">
      <view class="selfExtracting">
        <view class="close" @click="close"><uni-icons type="closeempty" class="closeIcon" color="#999"></uni-icons></view>
        <view class="title" style="margin-bottom: 60rpx;">自提码</view>
        <view class="store " v-for="(item, index) in codeInfo.takeInfo" :key="index">
          <view class="extract-address">
            <text class="iconfont icon-dianpu"></text>
            <view>{{ item.name }}</view>
          </view>

          <view class="phone">{{ item.phone }}</view>
        </view>
        <view>
          <image class="codeImg" :src="codeInfo.base64"></image>
          <view class="title" style="font-weight: normal;">{{ codeInfo.code }}</view>
        </view>
      </view>
    </uni-popup>

    <!--选择支付方式-->
    <popup-pay ref="pay" @success="paySuccess"></popup-pay>
  </view>
</template>

<script>
import popSelect from '@/components/pop-select';
import dayjs from 'dayjs'
import { listRp, getRpStatusNumber, getQrcode, patientList, pageRp } from '@/common/request/userCenter';
import { orderCancel, orderDelete, orderConfirm } from '../../common/request/index.js';
export default {
  components: {
    popSelect
  },
  data() {
    return {
      primaryColor: '#0AB2C1',
      current: 'UNPAID',
      currentNum: 1,
      pageSize: 10,
      pages: 1,
      more: 'more',
      tabList: [
        // {
        //   name: '全部',
        //   value: '',
        //   num: 0,
        //   numKey: 'all'
        // },
        {
          name: '待付款',
          value: 'UNPAID',
          num: 0,
          numKey: 'unpaid'
        },
        {
          name: '待自提',
          value: 'WAIT_TAKE',
          num: 0,
          numKey: 'waitTake'
        },
        {
          name: '待发货',
          value: 'WAIT_SEND',
          num: 0,
          numKey: 'waitSend'
        },
        {
          name: '待收货',
          value: 'WAIT_RECEIVE',
          num: 0,
          numKey: 'waitReceive'
        },
        {
          name: '已完成',
          value: 'FINISHED',
          num: 0,
          numKey: 'finished'
        }
        // {
        //   name: '已关闭',
        //   value: 'CLOSED',
        //   num: 0,
        //   numKey: 'closed'
        // }
      ],
      themeColor: '#0AB2C1',
      selectActive: [],
      selectName: '',
      selectList: [],
      list: [],
      codeInfo: {}
    };
  },
  onReachBottom() {
    if (this.currentNum < this.pages) {
      this.currentNum += 1;
      if (this.current == 'UNPAID') {
        this.getpageRp();
      } else {
        this.getlistRp();
      }
    } else {
      this.more = 'noMore';
    }
  },

  onShow() {
    if (this.selectList && this.selectList.length > 0) {
      this.list = [];
      this.currentNum = 1;
      if (this.current == 'UNPAID') {
        this.getpageRp();
      } else {
        this.getlistRp();
      }
    } else {
      this.getpatient();
    }
  },

  methods: {
    // 选择处方
    checkboxChange(item, check) {
      this.$set(check,'checked',!check.checked)
      this.$set(item,'ischeck',item.rpList.filter(item=>item.checked).map(t=>t.id))
      this.$set(item, 'isAll', (item.ischeck.length == item.rpList.length && item.ischeck.length > 0))
      this.getPrice(item);
    },
    getPrice(item) {
      let allPrice = 0;
      item.rpList.forEach(s => {
        item.ischeck.forEach(i => {
          if (s.id == i) {
            allPrice = allPrice + parseFloat(s.prescriptionPrice);
          }
        });
      });
      this.$set(item, 'totalPrice', allPrice);
    },
    // 全选
    allChange(index,item) {
      if(item.isAll){
        item.rpList.forEach(i=>{
          this.$set(i, 'checked', false);
        })
        this.$set(item, 'ischeck', []);
        this.$set(item, 'isAll', false);
      }else{
        item.rpList.forEach(i=>{
          this.$set(i, 'checked', true);
        })
        this.$set(item, 'ischeck', item.rpList.filter(item=>item.checked).map(t=>t.id));
        this.$set(item, 'isAll', true);
      }
      this.getPrice(item);
      console.log(item.ischeck);
    },
    // 跳转支付
    pay(index) {
      if (!this.list[index].ischeck || this.list[index].ischeck.length <= 0) {
        uni.showToast({
          title: '选择要支付的处方!',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: '/pages-user/orderSubmit/orderSubmit?ids=' + this.list[index].ischeck + '&total=' + this.list[index].totalPrice
      });
    },
    // 展开药品
    tapOpen(index, p) {
      this.$set(this.list[index].rpList[p], 'isOpen', !this.list[index].rpList[p].isOpen);
    },
    /***
     *付款时间倒计时
     */
    countdown(index, p, item) {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateEnd = new Date((item.expireDate || '').replace('-', '/').replace('-', '/')); //到期时间
      var currentTime = new Date((item.now || '').replace('-', '/').replace('-', '/')); //当前系统时间
      var dateDiff = dateEnd.getTime() - currentTime.getTime(); //时间差的毫秒数
      if (!item.expireDate || dateDiff < 0) {
        return '';
      }
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      // var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
      let hour = dayjs(item.expireDate).diff(dayjs(item.now),'hour')
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);

      var leave4 = leave3 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var minseconds = Math.round(leave4 / 1000);

      this.$set(this.list[index].rpList[p], 'hours', hour);
      this.$set(this.list[index].rpList[p], 'minutes', minutes);
      this.$set(this.list[index].rpList[p], 'seconds', seconds);
      // item.hours = (dayDiff * 24 + hours);
      // item.minutes = minutes
      // item.seconds = seconds
      return '';
    },
    swithMedicare(medicare) {
      var str = '';
      switch (medicare) {
        case 'A':
          str = '甲类';
          break;
        case 'B':
          str = '乙类';
          break;
        case 'C':
          str = '丙类';
          break;
        case 'ME_FEE':
          str = '自费';
          break;
      }
      return str;
    },
    // 就诊人列表
    async getpatient() {
      let res = await patientList();
      let list = [];
      res.forEach(i => {
        if (i.def) {
          this.selectActive = [i.memberId];
          this.selectName = i.name;
        }
        list.push({
          name: i.name,
          value: i.memberId,
          checked: i.def
        });
      });
      this.selectList = list;
      console.log(this.selectList);
      this.currentNum = 1;
      this.list = [];
      if ((this.current = 'UNPAID')) {
        this.getpageRp();
      } else {
        this.getlistRp();
      }
    },
    // 获取各状态数量
    async getRpStatusNumber() {
      let state = await getRpStatusNumber({
        memberIds: this.selectActive.join(',')
      });
      this.tabList.forEach(i => {
        for (let key in state) {
          if (i.numKey == key) {
            i.num = state[key];
          }
        }
      });
    },
    //订单列表
    getlistRp() {
      this.getRpStatusNumber();
      const data = {
        userId: uni.getStorageSync('userId'),
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        orderStatus: this.current,
        memberIds: this.selectActive.join(',')
      };
      listRp(data).then(res => {
        // this.tabList.forEach(i => {
        //   for (let key in res.extend) {
        //     if (i.numKey == key) {
        //       i.num = res.extend[key];
        //     }
        //   }
        // });

        this.list = this.list.concat(res.data);
        this.pages = res.pages;
        this.more = this.currentNum < this.pages ? 'more' : 'noMore'
      });
    },
    //待支付列表
    getpageRp() {
      this.getRpStatusNumber();
      let data = {
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        payStatus: 'UNPAID',
        memberIds: this.selectActive.join(',')
      };
      pageRp(data).then(res => {
        res.data.forEach(i=>{
          i.rpList.forEach(f=>{
            this.$set(f,'ischeck',[])
          })
        })
        this.list = this.list.concat(res.data);
        this.pages = res.pages;
        this.more = this.currentNum < this.pages ? 'more' : 'noMore'
      });
    },
    // 状态
    getstate(value) {
      let name = '';
      this.tabList.forEach(i => {
        if (i.value == value) {
          name = i.name;
        }
      });
      return name;
    },
    // 自提
    async selfExtracting(key) {
      this.codeInfo = await getQrcode({
        key
      });
      this.$refs.selfExtracting.open();
    },
    close() {
      this.$refs.selfExtracting.close();
    },
    // 选择确诊人
    selecvisit() {
      this.$refs.popselect.open();
    },
    radioChangeType(e) {
      if(e.length > this.selectList.length) {
        e.shift()
      }
      this.selectActive = e;
    },
    selectSubmit() {
      let list = [];
      if (this.selectActive == '') {
        uni.showToast({
          title: '请选择就诊人'
        });
        return false;
      }
      let newArr = [];
      for (let i = 0; i < this.selectList.length; i++) {
        for (let j = 0; j < this.selectActive.length; j++) {
          if (this.selectActive[j] === this.selectList[i].value) {
            newArr.push(this.selectList[i].name);
          }
        }
      }
      this.selectName = newArr.join(',');
      this.$refs.popselect.close();
      this.currentNum = 1;
      this.list = [];
      this.current == 'UNPAID' ? this.getpageRp() : this.getlistRp()
    },
    tabTap(e) {
      if (this.current !== e) {
        this.current = e;
        this.currentNum = 1;
        this.list = [];
        e == 'UNPAID' ? this.getpageRp() : this.getlistRp()
      }
    },
    //拥有详情时跳转
    gotoInfo(url,status) {
      if(status!==undefined){
        uni.navigateTo({
          url
        });
      }
    },
    operation(id) {
      if (state == 'cancel') {
        orderCancel({
          orderId: id
        }).then(data => {
          if (!data) {
            return;
          }
        });
      } else if (state == 'delete') {
        orderDelete({
          orderId: id
        }).then(data => {
          if (!data) {
            return;
          }
        });
      } else {
        orderConfirm({
          orderId: id
        }).then(data => {
          if (!data) {
            return;
          }
        });
      }
      uni.showToast({
        title: '操作成功！'
      });
    },
    // pay(id) {
    //   this.$refs.pay.show(id);
    // },
    paySuccess() {
      uni.showToast({
        title: '支付成功'
      });
      //支付成功  刷新列表
      this.currentNum = 1;
      this.list = [];
      this.getlistRp();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/common/order.scss';

.selfExtracting {
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 40rpx;
  padding-bottom: 100rpx;
  position: relative;

  .close {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #f2f2f2;
    right: 40rpx;
    top: 40rpx;
    text-align: center;
    line-height: 40rpx;
    cursor: pointer;

    .closeIcon {
      font-size: 30rpx !important;
    }
  }

  .store {
    font-size: 26rpx;
    // width: 50%;
    margin: 0 auto;
    margin-top: 10rpx;
    text-align: center;

    .iconfont {
      font-size: 32rpx;
      color: $uni-color-primary;
      margin-right: 10rpx;
    }

    .extract-address {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .phone {
      color: #666;
    }
  }

  .codeImg {
    width: 260rpx;
    height: 260rpx;
    display: block;
    margin: 0 auto;
    margin-top: 30rpx;
    margin-bottom: 10rpx;
  }

  .title {
    font-size: 30rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: bold;
  }
}
.prescribe {
  text {
    margin-right: 20rpx;
  }
}
.more {
  image {
    width: 24rpx;
    height: 18rpx;
    margin-left: 6rpx;
    transition: all 0.3s;
    &.moreUp {
      transform: rotate(0deg);
    }
    &.moreDown {
      transform: rotate(180deg);
    }
  }
}
.PayBtn {
  background-color: $uni-color-primary;
  color: #fff !important;
}
</style>
