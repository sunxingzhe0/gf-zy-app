<template>
  <view>
    <!--主页按钮-->
    <homeIcom />
    <view class="orderWrap ">
      <view class="oerderMain paddtb box-shadow">
        <view class="flex-between" style="padding-right: 30rpx;">
          <view>
            <view class="orderItem border0 flex-between">
              <view class="title">就诊人</view>
              <view class="info width300">
                <view>{{dataList[0].memberName}}</view>
              </view>
              <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
            </view>
            <view class="orderItem border0 flex-between">
              <view class="title">诊疗类型</view>
              <view class="info width300">
                <view>{{switchBizType(dataList[0].serviceType)||''}}</view>
              </view>
              <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
            </view>
            <view class="orderItem border0 flex-between">
              <view class="title">就诊时间</view>
              <view class="info width300">
                <view>{{dataList[0].treatmentTime}}</view>
              </view>
              <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
            </view>
          </view>
          <button plain class="optBtn" @click="seeHistory">痕迹查看</button>
        </view>
      </view>
      <view class="oerderMain paddtb box-shadow">
        <view class="orderItem border0 flex-between">
          <view class="title">诊断</view>
          <view class="info">
            <view></view>
          </view>
          <uni-icons type="arrowright" class="rightIcon hide"></uni-icons>
        </view>
        <view class="info">{{dataList[0].diagnosis}}</view>
      </view>
      <view class="oerderMain paddtb box-shadow" v-for="(item, index) in dataList" :key="item.id">
        <view class="orderItem border0 flex-between">
          <view class="font-weight color333" @click="info('/pages-doctor/user/prescription/info')">处方号：{{item.id}}</view>
          <view class="type">
            {{item.status == 'ALL' ? '全部' : item.status == 'DRAFT' ? '草稿' : item.status == 'PENDING_REVIEW' ? '待审核' : item.status == 'REJECTED' ? '已驳回' : item.status == 'PASSED' ? '已通过' : ''}}
          </view>
        </view>
        <view>
          <view class="orderItem border0">
            <view class="flex-between">
              <view class="color666 font20">
                医生：
                <text class="colora1a1">{{item.doctorName}} {{item.title}}</text>
              </view>
              <view class="color666 font20">
                创建时间：
                <text class="colora1a1">{{item.createTime}}</text>
              </view>
            </view>
            <view class="flex-between">
              <view class="color333 font26">西药:￥{{item.westPrice}}</view>
              <view class="color333 font26">中成药:￥{{item.chPatentPrice}}</view>
              <view class="colorred font26">合计:￥{{item.prescriptionPrice}}</view>
            </view>
            <view class="flex-between">
              <view class="flex-start-center">
                <template v-if="item.status == 'DRAFT'">
                  <button plain class="optBtn listBtn">提交</button>
                  <button plain class="optBtn listBtn on">成组</button>
                </template>
                <text class="font24 color333">数量：{{item.rpDrugList.length}}</text>
              </view>
              <view class="font24 color999" @click="dataList[index].rpShow = !dataList[index].rpShow">
                {{ item.rpShow ? '收起' : '展开' }}
                <text :class="['iconfont', 'font24', 'color999', item.rpShow ? 'icon-expand-down' : 'icon-zhankai']"></text>
              </view>
            </view>
            <view class="recipelInfo" v-show="item.rpShow" v-for="(contentItem, contentIndex) in item.rpDrugList"
              :key="contentItem.id">
              <view class="recipelItem" style="margin-bottom: 0;">
                <view class="flex-between">
                  <view class="font26">{{contentIndex+1}}.{{contentItem.name}}（规格：{{contentItem.spec}}）</view>
                  <view class="font26 color666">{{swithMedicare(contentItem.medicare)}}</view>
                </view>
                <view class="colorred font26 paddingLeft16">{{ contentItem.useWays ||''}}
                  {{ contentItem.useFrequency||'' }} {{ contentItem.singleDose||'' }}{{ contentItem.singleDoseUnit+'/次'}}
                  {{contentItem.treatment||''}}{{contentItem.treatmentUnit||''}}
                  ￥{{ contentItem.price }}{{'/'+contentItem.totalUnit}}x{{ contentItem.total }}</view>
                <view class="price paddingLeft16">￥{{contentItem.totalPrice}}</view>
                <view class="font24 color666 paddingLeft16">备注：{{contentItem.remark}}</view>
                <view class="flex-between paddingLeft16" style="margin-top: 10rpx;" v-if="item.status != 'PASSED'">
                  <view>
                    <evan-checkbox v-model="checked" shape="square"
                      :primary-color="primaryColor"><text class="checkText"></text></evan-checkbox>
                  </view>
                  <view class="flex-start-center opt">
                    <view class="font24 color666">
                      <text class="iconfont icon-shanchu font24 color666"></text>
                      删除
                    </view>
                    <view class="font24 color666" style="margin-left: 30rpx;"
                      @click="info('/pages-doctor/user/prescription/add')">
                      <text class="iconfont icon-bianji font24 color666"></text>
                      编辑
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- <view class="fiexBtn flex-justify-end" style="text-align: right;"> -->
      <!-- <view class="chfBtn" @click="slectTemplet">模板</view>
      <view class="chfBtn" @click="info('/pages-doctor/user/prescription/add')">调方</view>
      <view class="chfBtn" @click="info('/pages-doctor/user/prescription/add')">新增药品</view>
      <view class="chfBtn" @click="info('/pages-doctor/user/prescription/add')">新增处方号</view> -->
      <!-- <view class="chfBtn on">提交</view> -->
    <!-- </view> -->
    <uni-popup ref="popup" type="center">
      <view class="selctTemplet box-shadow">
        <view class="title">选择处方模板</view>
        <picker-view style="height: 280rpx;" class="templetPicker"
          :indicator-style="indicatorStyle" :value="value" @change="bindChange">
          <picker-view-column>
            <view class="item" v-for="item in templetList" :key="item.id">{{ item.lable }}</view>
          </picker-view-column>
        </picker-view>
        <view class="flex-between popopt">
          <view class="popBtn" @click="templatechange">取消</view>
          <view class="popBtn" @click="templatechange">保存</view>
        </view>
      </view>
    </uni-popup>

    <!-- 痕迹查看弹窗 -->
    <dialog-pop v-if="isShowModel" :title="modelData.modalTitle" @close="hideDialog" :hideFooter="false">
      <!-- 内容 -->
      <view  class="history">
        <view class="title">
          <view class="one">序号</view>
          <view class="two">操作人</view>
          <view class="three">提交处方号</view>
          <view class="fore">操作时间</view>
        </view>
        <view class="content">
          <view class="list" v-for="val in modelData.historyData" :key="val.id">
              <view class="one">{{val.index}}</view>
              <view class="two">{{val.doctorName}}</view>
              <view class="three">{{val.rpId}}</view>
              <view class="fore">{{val.submitTime}}</view>
          </view>
        </view>
      </view>
    </dialog-pop>
  </view>
</template>

<script>
  import evanCheckbox from '@/components/evan-checkbox/evan-checkbox.vue';
  import noData from '../../components/noData.vue'
  import util from '../../../common/util.js'
  import DialogPop from "../../components/dialogPop"
  //接口：6.1.7.11
  import { rpListInOrderDetail , getHisTory } from '../../../common/request/userPrescription.js'

  export default {
    components: {
      evanCheckbox,
      noData,
      DialogPop
    },
    

    data() {
      return {
        dataList: [{}],
        orderId: '',
        primaryColor: '#0AB2C1',
        checked: false,
        isOpen: false,
        isList: false,
        takeType: 1, // 1.自提，2.邮寄
        value: [0],
        templetList: [{
          lable: '模板1',
          id: 1
        }, {
          lable: '模板2',
          id: 2
        }, {
          lable: '模板3',
          id: 3
        }, {
          lable: '模板4',
          id: 4
        }, {
          lable: '模板5',
          id: 5
        }],
        indicatorStyle: 'border:1px  solid #FFE6E6E6;border-left:0;border-right:0;color:#FF1A1A1A;',
        isShowModel:false,
        //痕迹查看弹窗数据
        modelData:{
          modalTitle:'处方提交记录',
          historyData:[]
        }
      };
    },
    async onLoad(option) {
      if (option.id) {
        this.orderId = option.id
      }
      
       //获取处方提交记录
      let historyData = await getHisTory({orderId:this.orderId})
      this.modelData.historyData=historyData.list.filter((item)=>{
        return item.submitTime
      });
      console.log('处方提交痕迹',this.historyData)
    },
    mounted() {
      this.getRpListInOrderDetail()
    },
    methods: {
      getRpListInOrderDetail() {
        rpListInOrderDetail({
          orderId: this.orderId
        }).then(data => {
          this.dataList = data.map(item => Object.assign(item, {rpShow: false}))
        })
      },
      slectTemplet() {
        this.$refs.popup.open();
      },
      templatechange() {
        this.$refs.popup.close();
      },
      info(url) {
        uni.navigateTo({
          url: url
        });
      },
      switchBizType(type) {
        return util.switchBizType(type)
      },
      cope(val) {
        //#ifndef H5
        uni.setClipboardData({
          data: val,
          success: function() {
            uni.showToast({
              title: '复制成功'
            });
          }
        });
        //#endif
        //#ifdef H5
        this.$copyText(val).then(res => {
          uni.showToast({
            title: '复制成功'
          });
        });
        //#endif
      },
      swithMedicare(medicare) {
        var str = '医保：'
        switch (medicare) {
          case 'A':
            str += '甲类'
            break
          case 'B':
            str += '乙类'
            break
          case 'C':
            str += '丙类'
            break
          case 'ME_FEE':
            str += '自费'
        }
        return str
      },
      //痕迹查看点击
      seeHistory(){
        this.isShowModel=true
      },
      hideDialog(){
        this.isShowModel=false
      }

    }
  };
</script>

<style lang="scss" scoped>
  @import '@/common/order.scss';

  .orderTop {
    .stateIcon {
      font-size: 50rpx;
      color: #fff;
    }
  }

  .orderWrap {
    margin-top: 20rpx;

    .type {
      height: 30rpx;
      line-height: 30rpx;
      background: #f2f2f2;
      font-size: 22rpx;
      color: #333;
      padding: 0 15rpx;
    }

    .optBtn {
      &.listBtn {
        margin-left: 0;
        margin-right: 20rpx;
        width: 120rpx;
        height: 46rpx;
        line-height: 46rpx;
      }
    }

    .opt {
      text {
        margin-right: 10rpx;
      }
    }

    /deep/.evan-checkbox__label {
      font-size: 28rpx;
    }

    /deep/.evan-checkbox__inner {
      width: 16px !important;
      height: 16px !important;
    }
  }

  .width300 {
    width: 200rpx !important;
  }

  .chfBtn {
    background: #f2f2f2;
    height: 60rpx;
    border-radius: 30px;
    line-height: 60rpx;
    font-size: 24rpx;
    color: #333;
    padding: 0 30rpx;
    border: 0;
    display: inline-block;
    cursor: pointer;
    margin-left: 10rpx;

    &.on {
      background: $uni-color-primary;
      color: #fff;
    }

    &:nth-last-child(1) {
      margin-left: 0;
    }
  }

  .selctTemplet {
    width: 640rpx;
    margin: 0 auto;
    padding-top: 40rpx;
    background: #fff;

    .title {
      font-size: 30rpx;
      color: #1A1A1A;
      margin-bottom: 40rpx;
      text-align: center;
      font-weight: bold;
    }

    .templetPicker {
      height: 280rpx;
      text-align: center;
      font-size: 26rpx;
      // color: #999;

      .item {
        line-height: 36px;
      }
    }

    .popopt {
      height: 88rpx;
      border-top: 1px solid #FFE6E6E6;

      margin-top: 30rpx;

      .popBtn {
        flex: 1;
        text-align: center;
        font-size: 30rpx;
        height: 100%;
        line-height: 88rpx;
        color: #666;

        &:nth-last-child(1) {
          color: $uni-color-primary;
          border-left: 1px solid #FFE6E6E6;
        }
      }
    }
    
  }
  .history{
      height: 470px;
      border-radius: 10px;
      .title{
        display: flex;
        justify-content: space-between;
        background: #F2F2F2;
        padding: 10px 0;
        >view{
          text-align: center;
        }
        .one{
          width: 10%;
        }
        .two{
          width: 12%;
        }
        .three{
          width: 33%;
        }
        .fore{
          width: 45%;
        }
      }
      .content{
        height: 400px;
        overflow-y: scroll;
        .list{
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          color: #666;
          >view{
            text-align: center;
            font-size: 11px;
            }
            .one{
              width: 10%;
            }
            .two{
              width: 12%;
            }
            .three{
              width: 33%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .fore{
              width: 45%;
            }
        }
      }
      .list:not(:last-child){
        border-bottom: 1px solid #F7F7F7;
      }
    }
</style>
