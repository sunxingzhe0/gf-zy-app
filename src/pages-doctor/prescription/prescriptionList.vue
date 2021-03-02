<template>
 <view class="prescription-page">
    <!-- 基本信息 -->
  <view class="title-msg">
    <view class="name-type">
      <view class="name">
        <text>就诊人：</text>
        <text>{{orderInfo.patient.memberName}}</text>
      </view>
      <view class="type">
        <text>诊疗类型：</text>
        <text>{{bizType[orderInfo.bizType]}}</text>
      </view>
    </view>

    <view class="diagnosis-time">
      <view class="time">
        <text>就诊时间：</text>
        <text>{{orderInfo.paymentTime}}</text>
      </view>
      <view class="show"><button @click="showModal('痕迹查看')">痕迹查看</button></view>
    </view>
  </view>

  <view class="content">
    <!-- 诊断 -->
    <view class="diagnosis">
      <view>诊断：</view>
      <view class="text" v-if="isOpen">
        <view
          v-for="(dtoItem, index) in diagContent"
          :key="dtoItem.id"
        >
          <text>{{ index + 1 }}. {{ dtoItem.prefixName }} {{ dtoItem.diagnosisName }} {{ dtoItem.suffixName }} ({{dtoItem.mainDiagnosis === 1 ? '主诊断' : '诊断'}}) {{ !dtoItem.childDtos.length ? '；' : '，' }}</text>
          <text v-for="child in dtoItem.childDtos" :key="child.indexCode">{{ child.prefixName }} {{ child.diagnosisName }} {{ child.suffixName }} (子诊断)；
          </text>
        </view>
      </view>
      <view class="botton-icon" @click="OpenTo">{{isOpen?"收起":"展开"}}
        <image :src="require('@/assets/zhankaihui@2x.png')" :class="{openClass:isOpen}"></image>
      </view>
    </view>

    <!-- 处方列表 -->
    <view class="prescription-list">
      <view v-if="isShowMsg" class="msg">暂无数据</view>
      <Item ref="rpItem" v-for="(val,index) in prescriptionListData" :key="val.id" :itemData="val" :orderInfo="orderInfo" :isShowSelect="isShowSelect"  :isSelectCheckBox="isSelectCheckBox" @delprescription="delprescription" @delDrug="delDrug" @showModel="openModel" @withdraw="withdraw" @againGetData="againGetData" @copyPrescription="copyPrescription" @singleSubmit="singleSubmit" @updataData="updataData(index)"/>
    </view>
  </view>

  <!-- 尾部按钮 -->
  <view class="footer">
    <view class="button-box" v-if="!isShowSelect">
      <text @click="changeStatus">设为模板</text>
      <text @click="showModal('模板')">模板</text>
      <text @click="showModal('新增药品')">新增药品</text>
      <text @click="addPrescription">新增处方号</text>
      <text @click="submitBtn" class="submit">提交</text>
    </view>
    <view class="other-btn" v-if="isShowSelect">
      <view class="left">
        <checkbox-group @change="handleSlect">
          <label>
            <checkbox  :checked="isSelectAll" color="#08B4C8" style="transform:scale(0.7)"/>全选
          </label>
        </checkbox-group>
      </view>
      <view class="right">
        <text class="btnbox" @click="cancelGo">取消</text>
        <text class="btnbox" @click="settingModel">设为模板</text>
      </view>
    </view>
  </view>


 <!-- 弹出框 -->
 <dialog-pop v-if="isShowModal" @close="hideDialog" :title="modalTitle" :hideFooter="isHideModalFooter">
   <view v-if="isShowTemplate" class="templateModal">
    <Select
      :list="Templatelist"
      :clearable="false"
      :showItemNum="5"
      :style_Container="'width:200px;height: 40px; font-size: 16px;'"
      :placeholder = "'请选择模板'"
      :initValue="Templatelist[0]"
      :selectHideType="'hideAll'"
      @change="changeSelectModel"
    />
   </view>
   <view v-else-if="isShowHisTory" class="history">
     <view class="title">
       <view class="one">序号</view>
       <view class="two">操作人</view>
       <view class="three">提交处方号</view>
       <view class="fore">操作时间</view>
     </view>
     <view class="content">
       <view class="list" v-for="val in historyData" :key="val.id">
          <view class="one">{{val.index}}</view>
          <view class="two">{{val.doctorName}}</view>
          <view class="three">{{val.rpId}}</view>
          <view class="fore">{{val.submitTime}}</view>
       </view>
     </view>
   </view>
   <view v-else>
     <DrugsorList :prescriptionNumber="prescriptionNumber" :deptId="deptId" :edittorFormDatas="edittorFormDatas" :prescriptionListData="prescriptionListData" :newPharmacy="newPharmacy" ref="getPrams"/>
   </view>

 </dialog-pop>

<!-- 设置模板的弹窗 -->
<dialog-pop v-if="isShowSetModel" @close='hideSetModel' :hideFooter="true" >
  <view class="model-content">
    <view>
      <text>模板名称</text>
      <input v-model="modelSetData.name" type="text" placeholder="请输入模板名称">
    </view>
    <view>
      <text>病种</text>
      <Select
      :list="modelSetData.icSelectList"
      :clearable="false"
      :showItemNum="5"
      :style_Container="'width:232px;height: 30px; font-size: 16px;'"
      :placeholder = "'请选择病种'"
      :initValue="modelSetData.icSelectList[0]"
      :selectHideType="'hideAll'"
      :isCanInput="true"
      :focusShowList="true"
      @change="changicSelect"
      @input="inputSearch"
      />
    </view>
    <view>
      <text>描述</text>
      <textarea v-model="modelSetData.remark" placeholder="请输入相关描述"></textarea>
    </view>
  </view>
</dialog-pop>
 </view>

</template>


<script>
import Item from "./item"
import DialogPop from "../components/dialogPop"
import Select from "@/components/xfl-select/xfl-select"
import DrugsorList from "./drugsOrList"
import { BizType } from './enum'
import {
  getPrescriptionList,
  findDiseaseByOrderId,
  getOrderInfo,
  getHisTory,
  getTemplateList,
  addAndEdit,
  addPrescription,
  delPrescription,
  withdraw,
  submitRp,
  getModelInfo,
  drugInPharmacy,
  diagnosisKeywordSearch,
  saveRpTemplate,
  findDiagnosisInClinic
  } from '@/common/request/prescriptionList.js'
  export default {
    components:{
      Item,
      DialogPop,
      Select,
      DrugsorList
    },
    data(){
      return{
        //底部按钮组显示状态
        isShowSelect:false,
        //设为模板的弹窗状态
        isShowSetModel:false,
        //是否显示无数据标识
        isShowMsg:false,
        //是否显示诊断信息
        isOpen:true,
        //点击按钮显示模态框
        isShowModal:false,
        //显示模板
        isShowTemplate:false,
        //显示记录
        isShowHisTory:false,
        //显示模态框头部标题
        modalTitle:'',
        //所有草稿处方
        allDraftList:[],
        //是否隐藏模态框尾部
        isHideModalFooter:true,
        //请求数据的id
        orderId:"",
        //订单详情数据
        orderInfo:{},
        //诊疗类型
        bizType:{},
        //科室id
        deptId:'',
        //处方列表数据
        prescriptionListData:[],
        //处方提交痕迹
        historyData:[],
        //处方模板数据
        temlateDataAll:[],
        //处方模板名字
        Templatelist: [],
        //模板默认id
        templateId:[],
        //处方号
        prescriptionNumber:[],
        //新增药品表单数据
        addFormData:{},
        //新增处方接口参数
        addPrescriptionParams:{},
        //修改处方的数据
        edittorFormDatas:{},
        //提交时操作人的职称id
        titleId:'',
        //新增的处方单
        newPresciptionCode:'',
        //表单数据保存
        params:{},
        //药品数量小于5的草稿处方
        minfiveData:[],
        //设置模板需要录入的数据
        modelSetData:{
          name:'',
          remark:"",
          icdId:'',
          icdName:'',
          icSelectList:[],
          rpDrugList:[]
        },
        //控制是否选中
        isSelectCheckBox:false,
        //全选按钮状态
        isSelectAll:false,
        //列表中所有药品
        alldrugsList:[],
        //诊断数据列表
        options:[],
        //所哟选中项的id
        allSelectId:[],
        //诊断信息
        diagContent:[],
        //修改时传入编辑列表的处方数据
        oldpreData:{}
      }
    },
    async onLoad(option){
      // console.log(this.$store.state.rPType,'仓库拿的')
      //诊疗类型
      this.bizType = BizType
      //加载获取id请求数据
      this.orderId = option.orderId

      //获取订单详情数据
      let orderInfo =await getOrderInfo({orderId:this.orderId})
      this.orderInfo=orderInfo
      this.deptId=orderInfo.biz.deptId
      console.log('订单详情数据',orderInfo)
      //操作人职称id赋值
      this.titleId=orderInfo.biz.titleId
      //获取病例详情
      // this.findDisease=await findDiseaseByOrderId({orderId:this.orderId})
      //获取处方列表数据
      this.getListMsgs()

      //获取处方提交记录
      let historyData = await getHisTory({orderId:this.orderId})
      this.historyData=historyData.list.filter((item)=>{
        return item.submitTime
      });
      console.log('处方提交痕迹',this.historyData)

      //获取模板列表
      let tempListData = await getTemplateList()
      this.temlateDataAll=tempListData;
      //复制模板默认id
      this.templateId=tempListData.list[0].id?tempListData.list[0].id:''
      //赋值名字列表
      this.Templatelist=tempListData.list.map((item)=>{
        return item.name
      })

      //诊断信息
      let diagContent = await findDiagnosisInClinic({orderId:this.orderId})
      this.diagContent=diagContent
    },
    methods:{
      async getListMsgs(){
        //获取处方列表数据
        let data=await getPrescriptionList({orderId:this.orderId})||[];
        this.prescriptionListData=data;
        //筛选出草稿处方
        if(data.length>0){
          let lists = data.filter((item)=>{
            return item.status==="DRAFT"
          })
          this.prescriptionNumber=lists.map((item)=>{
            return item.id
          })
        }
        //没有数据显示暂无数据
        data&&(this.isShowMsg=true);
        data.length>0&&(this.isShowMsg=false);
        console.log('处方列表数据',data)

        //循环给药品添加选中项
        for(let i=0;i<this.prescriptionListData.length;i++){
          for(let j=0;j<this.prescriptionListData[i].rpDrugList.length;j++){
            if(this.prescriptionListData[i].rpDrugList[j+1]!==undefined){
                if((this.prescriptionListData[i].rpDrugList[j+1].groupId===this.prescriptionListData[i].rpDrugList[j].groupId)&&(this.prescriptionListData[i].rpDrugList[j].groupId!=='')){
                this.prescriptionListData[i].rpDrugList[j].isGetClass=true;
              }
            }
          }
        }
        //再次获取处方提交记录
        let historyData = await getHisTory({orderId:this.orderId})
        this.historyData=historyData.list.filter((item)=>{
          return item.submitTime
        });

        //分别计算中西药的总价格
        for(let itm of this.prescriptionListData){
          itm.westPrice=+itm.westPrice
          itm.chPatentPrice=+itm.chPatentPrice
          for(let vale of itm.rpDrugList){
            vale.drugTypeCode==="WESTERN_MEDICINE"?(itm.westPrice+=(+vale.totalPrice)):(itm.chPatentPrice+=(+vale.totalPrice))

            //总量单位枚举
            if(vale.split){
              vale.alltotalUnit={[vale.regularUnit]:vale.regularUnitText,[vale.basicUnit]:vale.basicUnitText}

            }else{
              vale.alltotalUnit={[vale.regularUnit]:vale.regularUnitText}
            }
          }
        }
      },
      //展开折叠诊断信息
      OpenTo(){
        this.isOpen=!this.isOpen
      },
      //显示模态框
      showModal(val){
        let _this=this;
        if(val==='模板'){
          this.isShowModal=true;
          this.isShowTemplate=true;
          this.isShowHisTory=false;
          this.isHideModalFooter=true;
          this.modalTitle='选择处方模板'
        }else if(val==='痕迹查看'){
          this.isShowModal=true;
          this.isHideModalFooter=false;
          this.isShowTemplate=false;
          this.isShowHisTory=true;
          this.modalTitle='处方提交记录'
        }else{
          //处方列表为空
          if(!this.prescriptionListData.length){
             uni.showModal({
                title: '提示',
                content: '暂无可新增药品的处方，是否新增处方？',
                success: function (res) {
                  if (res.confirm) {
                      _this.addPrescriptionFn()
                  }
                }
            });
            return
          }
          //处方列表不为空  筛选出所有草稿处方
          this.allDraftList = this.prescriptionListData.filter((item)=>{
              return item.status==="DRAFT"
          })
          //药品小于5的草稿处方
          let minfive = this.allDraftList.filter((item)=>{
            return item.rpDrugList.length<5
          })
          this.minfiveData=minfive;
          if(minfive.length<1){
            uni.showModal({
                title: '提示',
                content: '暂无可新增药品的处方，是否新增处方？',
                success: function (res) {
                  if (res.confirm) {
                      _this.addPrescriptionFn()
                  }
                }
            });
          }else{
            this.isShowModal=true;
            this.modalTitle=''
            this.edittorFormDatas={}
          }


        }
      },
      //新增处方
      async addPrescriptionFn(){
        this.addPrescriptionParams={
            memberId:this.orderInfo.memberId,
            memberName:this.orderInfo.memberName,
            memberSex:this.orderInfo.biz.sex,
            treatmentTime:this.orderInfo.createTime,
            serviceType:this.orderInfo.bizType,
            serviceMode:this.orderInfo.wayType,
            titleId:this.orderInfo.biz.titleId,
            orderId:this.orderInfo.orderId,
            userId:this.orderInfo.userId,
          }
          let res = await addPrescription({...this.addPrescriptionParams})
          if(res){
            this.newPresciptionCode=res;
            uni.showToast({
                title: '新增成功',
                duration: 1500,
                icon:"none"
            });
          }
          this.getListMsgs()
      },
      //模板选项改变
      changeSelectModel(val){
        this.temlateDataAll.list.forEach((item)=>{
          item.name===val.newVal&&(this.templateId=item.id)
        })
      },
      //拆分数组
      splitArr(arr,len){
        let index = 0;
        let newArray = [];
        while(index<arr.length){
          newArray.push(arr.slice(index,index+=len))
        }
        return newArray
      },
      //关闭模态框
      async hideDialog(data){
        this.isShowModal=false
        this.isShowModalTitle=false
        this.isHideModalFooter=true
        this.isShowHisTory=false
        if(data==='保存'){
          //导入模板
          if(this.isShowTemplate){
            let _this=this;
            uni.showModal({
              title: '提示',
              content: '是否以此模板创建新的处方？',
              async success(res) {
                  if (res.confirm) {
                    //查询模板详细信息
                     let resp = await getModelInfo({id:_this.templateId})
                     //计算总价
                     resp.rpDrugList.forEach((item)=>{
                       item.totalPrice=Number(item.price)*Number(item.total)
                     })
                     //小于五个药直接创建
                     if(resp.rpDrugList.length<=5){
                       //等待新处方创建
                       await _this.addPrescriptionFn()
                       //老处方的数据填到新处方
                       let response = await addAndEdit({id:_this.newPresciptionCode,rpDrugList:resp.rpDrugList})
                       _this.getListMsgs()
                     }else{
                       //大于五个药 分方
                      let newRplist = _this.splitArr(resp.rpDrugList,5)
                      for(let i=0;i<newRplist.length;i++){
                          await _this.addPrescriptionFn()
                          let response = await addAndEdit({id:_this.newPresciptionCode,rpDrugList:newRplist[i]})
                          _this.getListMsgs()
                        }
                      }
                  }
              }
            })
          }else if(this.edittorFormDatas.type==='edit'){

              //修改处方药品
              this.isShowModal=true;
              this.params = this.$refs.getPrams.editFormData;
                
              //检查输入内容
              const flag = this.params.drugMsg.type&&
                this.params.drugMsg.name&&
                this.params.drugMsg.useWays&&
                this.params.drugMsg.singleDose&&
                this.params.drugMsg.total&&
                this.params.drugMsg.receivePharmacy&&
                this.params.drugMsg.treatment
              if(!(flag&&
                this.params.drugMsg.totalUnit)
              ){
                uni.showToast({
                  title:flag&&!this.params.drugMsg.totalUnit?"请选择总量单位":'请检查输入内容',
                  icon:"none",
                  duration:1500
                })
                return
              }
              this.isShowModal=false

            //保存时候判断药房是否为和当前处方其他药品相同
            //通过药品id查询药房
            let resDatas = await drugInPharmacy({orgDrugId:this.params.drugMsg.id,deptId:this.deptId})
            //药房列表
            let receivePharmacyS=resDatas;

            //分方规则判断
            //当前处方数据
            let nowData = {}
            this.prescriptionListData.forEach((item)=>{
              this.params.id===item.id&&(nowData=item)
            })

            //判断原药房id和新id是否一致
            if(nowData.rpDrugList[0]?.receivePharmacyId!==this.params.drugMsg.receivePharmacyId&&nowData.rpDrugList[0]?.receivePharmacyId){
              let _this=this
              //不一致
              uni.showModal({
                title: '提示',
                content: '同一处方不能存在不同药房药品,是否添加到其他处方？',
                async success (res) {
                  if (res.confirm) {
                      //添加到其他处方
                      //筛选出所有草稿处方
                      _this.allDraftList = _this.prescriptionListData.filter((item)=>{
                          return item.status==="DRAFT"
                      })
                      //药品小于5的草稿处方
                      let minfive = _this.allDraftList.filter((item)=>{
                        return item.rpDrugList.length<5
                      })
                      _this.minfiveData=minfive;
                      let isExistencetow=false;
                      let pharmacyId=''
                      //判断是否存在
                      for(let i=0;i<_this.minfiveData.length;i++){
                        for(let j=0;j<_this.minfiveData[i].rpDrugList.length;j++){
                          _this.minfiveData[i].rpDrugList[j].receivePharmacyId===_this.params.drugMsg.receivePharmacyId&&(isExistencetow=true,pharmacyId=_this.minfiveData[i].id);
                          //有此药房的处方id

                        }
                      }
                      //其他处方有这个药房的时候将这个药添加进去
                      if(isExistencetow){
                        let rpDrugList=[];
                        //判断有此药房的处方
                        _this.prescriptionListData.forEach((item)=>{
                          pharmacyId===item.id&&(rpDrugList=item.rpDrugList)
                        })
                        rpDrugList.push(_this.params.drugMsg)
                        _this.getListMsgs()
                        let res = await addAndEdit({id:pharmacyId,rpDrugList:rpDrugList})
                        if(res){
                            uni.showToast({
                                title: '保存成功',
                                duration: 1500,
                                icon:"none"
                            });
                          }
                          //如果修改的处方和原来处方不一致删除原来处方的药//*********** */
                          if(_this.oldpreData.prescriptionId!=_this.params.id){
                            _this.deleteOldRp()
                            //保存新增药品
                            _this.addRpedit();
                          }
                        _this.getListMsgs()
                      }else{
                        //其他处方没有这个药房，新增处方再添加进去
                        await _this.addPrescriptionFn()
                        let rpDrugList=[];
                        rpDrugList.push(_this.params.drugMsg)
                        //数据填到新处方
                        let respq = await addAndEdit({id:_this.newPresciptionCode,rpDrugList:rpDrugList})
                        //如果修改的处方和原来处方不一致删除原来处方的药//*********** */
                          if(_this.oldpreData.prescriptionId!=_this.params.id){
                            _this.deleteOldRp()
                          }
                        _this.getListMsgs()
                      }

                  }
                }
              })
            }else{

              //和原来的一致
              //如果修改的处方和原来处方不一致删除原来处方的药//*********** */
              if(this.oldpreData.prescriptionId!=this.params.id){
                this.deleteOldRp()
                console.log('删了-----------------')
                //保存新增药品
                this.addRpedit();
              }else{
                //处方所有药品药房无冲突情况下
                let oldDatasList = JSON.parse(JSON.stringify(nowData.rpDrugList))
                //找到修改的一项重新赋值
                oldDatasList.forEach((item,index)=>{
                  item.id===this.preservationId&&(oldDatasList[index]=this.params.drugMsg)
                })
                this.getListMsgs()
                let res = await addAndEdit({id:this.params.id,rpDrugList:oldDatasList})
                if(res){
                  uni.showToast({
                    title:'修改成功',
                    icon:'none',
                    duration:1500
                  })
                }
              }
              this.getListMsgs()
            }

          }else{
            this.isShowModal=true;
            this.params = this.$refs.getPrams.editFormData;
            //保存新增药品
            this.addRpedit();
            // this.isShowModal=false
            // return
            }
        }
        this.isShowTemplate=false
      },

      //新增药品
      async addRpedit(){
            //检查输入内容
            const flag = this.params.drugMsg.type&&
                this.params.drugMsg.name&&
                this.params.drugMsg.useWays&&
                this.params.drugMsg.singleDose&&
                this.params.drugMsg.total&&
                this.params.drugMsg.receivePharmacy&&
                this.params.drugMsg.treatment
              if(!(flag&&
                this.params.drugMsg.totalUnit)
              ){
                uni.showToast({
                  title:flag&&!this.params.drugMsg.totalUnit?"请选择总量单位":'请检查输入内容',
                  icon:"none",
                  duration:1500
                })
                return
              }
              this.isShowModal=false
              //通过药品id查询药房
              let resDatas = await drugInPharmacy({orgDrugId:this.params.drugMsg.id,deptId:this.deptId})
              //药房列表
              let receivePharmacyS=resDatas;

              //分方规则判断
              let nowData = {}
              let nowId=''
              this.prescriptionListData.forEach((item)=>{
                this.params.id===item.id&&(nowData=item)
              })

              if(nowData.rpDrugList.length>0){
                nowId=nowData.rpDrugList[0].receivePharmacyId

                //不能添加到当前处方
                if(nowId!==this.params.drugMsg.receivePharmacyId){
                  let _this=this;
                  uni.showModal({
                      title: '提示',
                      content: '同一处方不能选择不同药房，将自动为您调整药房',
                      async success (res) {
                        if (res.confirm) {

                            //判断已有药品的药房存不存在当前药房列表中
                            let isExistence = receivePharmacyS.some((item)=>{
                              return item.mechanismId===nowId
                            })
                            //当前处方中其他药的药房id存在于当前药房列表中
                            if(isExistence){
                              //要重新赋值的药房
                              let newPharmacy = {};
                              receivePharmacyS.forEach((item)=>{
                                item.mechanismId===nowId&&(newPharmacy=item)
                              })
                              _this.newPharmacy=newPharmacy;
                              _this.params.drugMsg.receivePharmacyId=newPharmacy.k
                              _this.params.drugMsg.receivePharmacy=newPharmacy.v

                              let rpDrugList=[];
                              _this.prescriptionListData.forEach((item)=>{
                              _this.params.id==item.id&&(rpDrugList=item.rpDrugList)
                              });
                              if(rpDrugList.length>=5){
                                uni.showModal({
                                  title: '提示',
                                  content:'同一药方不能超过五种药品'
                                      })
                                return
                              }
                              //添加表单数据
                              rpDrugList.push(_this.params.drugMsg)
                              _this.getListMsgs()

                              let res = await addAndEdit({id:_this.params.id,rpDrugList:rpDrugList})
                              if(res){
                                  uni.showToast({
                                      title: '保存成功',
                                      duration: 1500,
                                      icon:"none"
                                  });
                                }
                              _this.getListMsgs()

                            }else{
                              uni.showModal({
                                title:"提示",
                                content:'无可选择的药房,是否添加到其他处方？',
                                async success(res){
                                  if(res.confirm){
                                    let isExistencetow=false;
                                    let pharmacyId=''
                                    //判断是否存在
                                    for(let i=0;i<_this.minfiveData.length;i++){
                                      for(let j=0;j<_this.minfiveData[i].rpDrugList.length;j++){
                                        _this.minfiveData[i].rpDrugList[j].receivePharmacyId===_this.params.drugMsg.receivePharmacyId&&(isExistencetow=true,pharmacyId=_this.minfiveData[i].id);
                                        //有此药房的处方id

                                      }
                                    }
                                    //其他处方有这个药房的时候将这个药添加进去
                                    if(isExistencetow){
                                      let rpDrugList=[];
                                      //判断有此药房的处方
                                      _this.prescriptionListData.forEach((item)=>{
                                        pharmacyId===item.id&&(rpDrugList=item.rpDrugList)
                                      })
                                      rpDrugList.push(_this.params.drugMsg)
                                      _this.getListMsgs()
                                      let res = await addAndEdit({id:pharmacyId,rpDrugList:rpDrugList})
                                      if(res){
                                          uni.showToast({
                                              title: '保存成功',
                                              duration: 1500,
                                              icon:"none"
                                          });
                                        }
                                      _this.getListMsgs()
                                    }else{
                                      //其他处方没有这个药房，新增处方再添加进去
                                      await _this.addPrescriptionFn()
                                      let rpDrugList=[];
                                      rpDrugList.push(_this.params.drugMsg)
                                      //数据填到新处方
                                      let respq = await addAndEdit({id:_this.newPresciptionCode,rpDrugList:rpDrugList})
                                      _this.getListMsgs()
                                    }
                                  }
                                }
                              })
                            }
                        }
                      }
                  });
                }else{
                  //能添加到当前处方
                  nowData.rpDrugList.push(this.params.drugMsg)
                  console.log(JSON.stringify({id:nowData.id,rpDrugList:nowData.rpDrugList}),'新增-----------------------')
                  //数据填到处方
                  let respq = await addAndEdit({id:nowData.id,rpDrugList:nowData.rpDrugList})
                  if(respq){
                    uni.showToast({
                      title:'添加成功',
                      icon:'none',
                      duration:1500
                    })
                  }
                  this.getListMsgs()
                }
              }else{
                //当前处方没有药品存在的时候
                nowData.rpDrugList.push(this.params.drugMsg)
                //删除无用key

                console.log(JSON.stringify({id:nowData.id,rpDrugList:nowData.rpDrugList}),'============')
                //数据填到处方
                let respq = await addAndEdit({id:nowData.id,rpDrugList:nowData.rpDrugList})
                if(respq){
                  uni.showToast({
                    title:'添加成功',
                    icon:'none',
                    duration:1500
                  })
                }
                this.getListMsgs()
            }
      },
      //新增处方
      addPrescription(){
        let _this=this;
        uni.showModal({
            title: '提示',
            content: '是否新增处方？',
            success(res){
                if (res.confirm) {
                  _this.addPrescriptionFn()
                }
            }
        });
      },
      //删除处方
      async delprescription(data){
        let res = await delPrescription({id : data})
        if(res){
          uni.showToast({
            title:"删除成功",
            icon:"none",
            duration:1500
          })
        }
        this.getListMsgs()
      },
      //删除处方药品
      async delDrug(data){
         //准备参数
         let rpDrugList=[];
         this.prescriptionListData.forEach((item)=>{
           data.prescriptionId===item.id&&(rpDrugList=item.rpDrugList)
         })
         //处理药品数量
        rpDrugList.forEach((item,index)=>{
          data.drugId===item.id&&(rpDrugList.splice(index,1))
        })
        this.getListMsgs()
        let res = await addAndEdit({id:data.prescriptionId,rpDrugList:rpDrugList})
        if(res){
            uni.showToast({
                title: '删除成功',
                duration: 1500,
                icon:"none"
            });
          }
        this.getListMsgs()
      },
      //修改处方药品
      openModel(data){
        console.log('传入处方的数据',data)
        //保存原药品数据
        this.oldpreData=JSON.parse(JSON.stringify(data))

        //当前处方状态
        let statusNow = '';
        this.prescriptionListData.forEach((item)=>{
          data.prescriptionId===item.id&&(statusNow=item.status)
        })
        if(statusNow==="DRAFT"){
          this.edittorFormDatas=data;
          this.isShowModal=true;
          this.modalTitle=''
          //保存当前项的id
          this.preservationId=data.drugMsg.id
        }else{
          uni.showToast({
            title:'只有草稿处方才能编辑',
            icon:'none',
            duration:1500
          })
        }

      },
      //调方成功后删除原处方的药品
      deleteOldRp(){
        //调用删除原来的药品
        this.delDrug(this.oldpreData)
      },
      //撤回当前处方
      async withdraw(data){
        let res = await withdraw({id:data})
        this.getListMsgs()
        if(res){
          uni.showToast({
            title:'撤回成功',
            icon:'none',
            duration:1500
          })
        }
      },
      //提交
       submitBtn(){
        // submitRp
        //筛选出所有草稿处方
        let draftList = this.prescriptionListData.filter((item)=>{
            return item.status==="DRAFT"
        })
        //筛选所有有药品的处方
        let draftListHasDrug = draftList.filter((item)=>{
          return item.rpDrugList.length>0
        })
        draftListHasDrug.forEach((item)=>{
          item.titleId=this.titleId
        })
        let _this = this;
        uni.showModal({
            title: '提示',
            content: '是否提交所有存在药品的处方？',
            async success(res) {
                if (res.confirm) {
                   let res = await submitRp({submit:draftListHasDrug})
                      _this.getListMsgs()
                      uni.showToast({
                        title:'提交成功',
                        icon:'none',
                        duration:1500
                      })
                }
            }
        })
      },
      //单独提交处方
      async singleSubmit(data){
        // console.log(JSON.stringify({submit:[data]}))

        let res = await submitRp({submit:[{id:data.id,rpDrugList:data.rpDrugList}]})
        this.getListMsgs()
        uni.showToast({
          title:'提交成功',
          icon:'none',
          duration:1500
        })
      },
      //成组后重新拉取数据
      againGetData(data){
        this.getListMsgs()

      },
      //复制驳回处方为新的处方
      async copyPrescription(data){
        //等待处方创建
        data.rpDrugList.forEach((item)=>{
          delete item.id
        })
        await this.addPrescriptionFn();
        //老处方的数据填到新处方
        let res = await addAndEdit({id:this.newPresciptionCode,rpDrugList:data.rpDrugList})
        this.getListMsgs()
      },
      //点击开始的设为模板
      changeStatus(){
        this.isShowSelect=!this.isShowSelect
        let lists = this.prescriptionListData
          for(let item of lists){
            for(let val of item.rpDrugList){
              this.alldrugsList.push(val)
            }
          }
      },
      //底部按钮取消
      cancelGo(){
        this.isShowSelect=false;
        this.isSelectCheckBox=false;
        this.isSelectAll=false;
        //清空所有药品
        this.alldrugsList=[]
      },
      //底部按钮设为模板
      settingModel(){
        this.isShowSetModel=true
      },
      //关闭设为模板弹窗
      async hideSetModel(data){
        this.isShowSetModel=false;
        if(data==='保存'){
          //全选时
          if(this.isSelectAll){
            this.modelSetData.rpDrugList=this.alldrugsList;
          }else{
            this.modelSetData.rpDrugList=this.alldrugsList.filter((item)=>{
              return this.allSelectId.includes(item.id)
            })
          }
          delete this.modelSetData.icSelectList;
          console.log('设置模板时的数据---------',JSON.stringify(this.modelSetData))

          let res = await saveRpTemplate({...this.modelSetData})
          if(res){
            uni.showToast({
              title:'新增成功',
              icon:'none',
              duration:1500
            })
          }
          //获取模板列表
          let tempListData = await getTemplateList()
          this.temlateDataAll=tempListData;
          //复制模板默认id
          this.templateId=tempListData.list[0].id?tempListData.list[0].id:''
          //赋值名字列表
          this.Templatelist=tempListData.list.map((item)=>{
            return item.name
          })
          this.isShowSelect=false;
          this.isSelectCheckBox=false;
          this.isSelectAll=false;
          //清空所有药品
          this.alldrugsList=[]
          //情况模板信息
          this.modelSetData={
            name:'',
            remark:"",
            icdId:'',
            icdName:'',
            icSelectList:[],
            rpDrugList:[]
          }
        }
      },
      //病种选项改变时
      changicSelect(val){
        this.options.forEach((item)=>{
          val.newVal===item.diagnosisName&&(this.modelSetData.icdName=item.diagnosisName,this.modelSetData.icdId=item.id)
        })
      },
      //诊断关键字查询
      async inputSearch(e){
        let res = await diagnosisKeywordSearch({
          searchKeywords:e.detail.value,
          currentNum:1,
          pageSize:99
        })
        //诊断数据列表
        this.options = res.list
        //名字取出来
        this.modelSetData.icSelectList=this.options.map((item)=>{
          return item.diagnosisName
        })
      },
      handleSlect(e){
        let lists = JSON.parse(JSON.stringify(this.prescriptionListData))
        for(let item of lists){
          for(let val of item.rpDrugList ){
           val=Object.assign(val,{checked:e.detail.value.length>0})
          }
        }
        this.prescriptionListData=lists;

        if(e.detail.value.length>0){
          this.modelSetData.rpDrugList=this.alldrugsList;
          //所有药品id赋值
          this.allSelectId=this.alldrugsList.map((item)=>{
            return item.id
          })
        }else{
          this.modelSetData.rpDrugList=[]
          this.allSelectId=[]
        }
      },

      //内部选中改变时
      updataData(index){
          this.getAllSelectid()
          console.log(this.alldrugsList.length,'所有数据长度')
          console.log(this.allSelectId.length,'选中数据长度')
          //子选择是否全部选中
          if(this.alldrugsList.length>this.allSelectId.length){
            this.isSelectAll=false
          }else if(this.alldrugsList.length===this.allSelectId.length){
            this.isSelectAll=true
          }
        },
      //拿到所有选中项的id集合
      getAllSelectid(){
        let lists=this.$refs.rpItem.map((item)=>{
          return item.checkedList
        })
        this.allSelectId=[].concat(...lists)
        console.log(this.allSelectId,'所有选中项的id')
      },
    }

  }
</script>

<style lang="scss" scoped>
.prescription-page{
  height: 100%;
  display: flex;
  flex-direction: column;
}
/* 基本信息 */
.title-msg{
  padding: 10px 20px;
  background: #fff;
  .name-type{
    display: flex;
    justify-content: space-between;
    .name{
      text:first-child{
        color: #333;
      }
    }
    .type{
      text:first-child{
        color: #333;
      }
    }
  }
  .diagnosis-time{
    display: flex;
    justify-content: space-between;
    .time{
      text:first-child{
        color: #333;
      }
    }
    .show{
      button{
        width: 80px;
        height: 30px;
        font-size: 12px;
        border-radius: 30px;
        color: #6DD2D1;
        border: 1px solid #6DD2D1;
      }
    }
  }

}
/* 内容 */
.content{
  flex: 1;
  overflow-y: scroll;
  /* 诊断信息 */
  .diagnosis{
    margin-top: 5px;
    padding: 10px 20px 5px 20px;
    background: #fff;
    .text{
      margin: 8px 0;
      line-height: 20px;
      font-size: 12px;
    }
    .botton-icon{
      text-align: center;
      color: #666;
      margin-top: 10px;
      image{
        width: 12px;
        height: 8px;
        padding: 4px;
        margin-top: 6px;
      }
      .openClass{
        transform:rotate(180deg);
      }
    }
  }
  .openHeight{
    height: 55px;
    overflow: hidden;
  }
  /* 处方列表 */
  .prescription-list{
    padding: 8px;
    .msg{
      text-align: center;
      font-size: 30px;
      color: #ccc;
      margin-top: 50px;
    }
  }
}
/* 尾部 */
.footer{
  flex: 0 0 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #fff;
  .button-box{
    display: flex;
    margin-right: 10px;
    text{
      height: 20px;
      padding: 0 10px;;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin-left: 8px;
      border-radius: 12px;
      border: 1px solid #ccc;
    }
    text.submit{
      background: #0BB0C4;
      color: #fff;
      border: 1px solid #0BB0C4;
    }
  }
  .other-btn{
    padding: 0 20px;
    width: 100%;
    display: flex;
    margin-right: 10px;
    justify-content: space-between;
    font-size: 12px;
    .left{
      display: flex;
      .checktxt{
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .right{
      display: flex;
      justify-content: center;
      align-items: center;
      .btnbox{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        height: 20px;
        border-radius: 12px;
        border: 1px solid #ccc;
        margin-left: 5px;
      }
    }
  }
}
/* 模态框 */
.templateModal{
  height: 340px;
  padding-top: 50px;;
  display: flex;
  justify-content: center;
  .show-box{
    height: 40px;
  }
}
/* 设置模板的模态框 */
.model-content{
  height: 340px;
  padding: 20px;
  >view{
    display: flex;
    margin-top: 15px;
    text{
      width: 60px;
    }
    input{
      border: 1px solid #ccc;
      width: 230px;
      border-radius: 5px;
      text-indent: 10px;
    }
    textarea{
      border:1px solid #ccc;
      width: 230px;
      border-radius: 5px;
      text-indent: 10px;
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
