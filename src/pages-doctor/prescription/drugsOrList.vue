<template>
  <!-- 处方药品 -->
  <view class="drugs-list-page">
    <form @submit="formSubmit" @reset="formReset">
      <view class="list" v-if="codeId">
        <text>处方号：</text>
        <text>{{prescriptionNumber[0]}}</text>
      </view>

      <view class="list" v-else>
        <text>处方号：</text>
        <Select
          :list="prescriptionNumber"
          :clearable="false"
          :showItemNum="5" 
          :style_Container="'width: 200px ; height: 24px; font-size: 12px;'"
          :placeholder = "'请选择处方号'"
          :initValue="edittorFormDatas.prescriptionId?edittorFormDatas.prescriptionId:prescriptionNumber[0]"
          :selectHideType="'hideAll'"
          @change="getValueCode"
        />
      </view>
      
      <view class="list">
        <text>药品名称：</text>
        <ZzSelect
          width='188'
          :initValue='edittorFormDatas.drugMsg.name?edittorFormDatas.drugMsg.name:""'
          :datas="drugsLists"
          @changeValue="changeinpvalue"
          @input="inputEvent"
        />
      </view>
       <view class="list">
        <text>接收方：</text>
          <Select
            :list="PharmacyName"
            :clearable="false"
            :showItemNum="5" 
            :style_Container="'width: 200px ; height: 24px; font-size: 12px;'"
            :placeholder = "'请选择接收方'"
            :initValue="edittorFormDatas.drugMsg.receivePharmacy||PharmacyName[0]"
            :selectHideType="'hideAll'"
            @change="receivePharmacyChange"
          />
      </view>
      <!-- <view class="list">
        <text>药品类型：</text>
        <Select
          :list="drugsType"
          :clearable="false"
          :showItemNum="5" 
          :style_Container="'width: 200px ; height: 24px; font-size: 12px;'"
          :placeholder = "'请选择药品类型'"
          :initValue="edittorFormDatas.drugMsg.type?DrugTypes[edittorFormDatas.drugMsg.type]:drugsType[0]"
          :selectHideType="'hideAll'"
          :isCanInput="true"
          :focusShowList="true"
          @change="changeType"
        />
      </view> -->

      <view class="list">
        <text>剂型：</text>
        <view>{{editFormData.drugMsg.pharmaceuticalDosageText||'暂无'}}</view>
      </view>

      <view class="list">
        <text>用药途径：</text>
        <Select
          :list="channel"
          :clearable="false"
          :showItemNum="5" 
          :style_Container="'width: 200px ; height: 24px; font-size: 12px;'"
          :placeholder = "'请选择用药途径'"
          :initValue="edittorFormDatas.drugMsg.useWays?useAways[edittorFormDatas.drugMsg.useWays]:channel[0]"
          :selectHideType="'hideAll'"
          @change="changeChannel"
        />
      </view>

      <view class="list">
        <text>单次剂量：</text>
        <view class="otherbox">
          <input v-model="editFormData.drugMsg.singleDose" type="number" class="otherinp" maxlength=3 @change="inpchange" placeholder="请输入" placeholder-style="color:#999;font-size:12px"/>
          <text class="othertext">{{editFormData.drugMsg.basicUnitText}}</text>
        </view>
      </view>

      <view class="list">
        <text>用药频次：</text>
        <Select
          :list="frequency"
          :clearable="false"
          :showItemNum="5" 
          :style_Container="'width: 200px ; height: 24px; font-size: 12px;'"
          :placeholder = "'请选择用药频次'"
          :initValue="allfrequency[edittorFormDatas.drugMsg.useFrequency]||frequency[0]"
          :selectHideType="'hideAll'"
          @change="useFrequencyChange"
        />
      </view>

      <view class="list">
        <text>疗程：</text>
        <view class="otherbox"> 
          <input v-model="editFormData.drugMsg.treatment" class="otherinp" type="number" maxlength=2 @input="inpchangeTow" placeholder="请输入" placeholder-style="color:#999;font-size:12px"/>
          <Select
            :list="Company"
            :clearable="false"
            :showItemNum="5" 
            :style_Container="'width: 48px ; height: 22px; font-size: 12px;'"
            :placeholder = "'请选择疗程'"
            :initValue="edittorFormDatas.drugMsg.treatmentUnit?attrdate[edittorFormDatas.drugMsg.treatmentUnit]:Company[0]"
            :selectHideType="'hideAll'"
            @change="treatmentUnitChange"
          />
        </view>
      </view>

      <view class="list">
        <text>总量：</text>
        <view class="otherbox">
          <input @change="changeNum" v-model="editFormData.drugMsg.total" class="otherinp" type="number" maxlength=3 @input="inpchangethree" placeholder="请输入" placeholder-style="color:#999;font-size:12px"/>
          <Select
            :list="allcompanyName"
            :clearable="false"
            :showItemNum="5" 
            :style_Container="'width: 48px ; height: 22px; font-size: 12px;'"
            placeholder = " "
            :initValue="edittorFormDatas.drugMsg.regularUnitText||allcompanyName[0]"
            :selectHideType="'hideAll'"
            @change="changeTotalCompany"
          />
        </view>
      </view>

     

      <view class="list listOther">
        <text>医保：</text>
        <view>{{allTypeEnume[edittorFormDatas.drugMsg.medicare]||allTypeEnume[editFormData.drugMsg.medicare]}}</view>
      </view>

      <view class="list">
        <text>单价：</text>
        <view>{{editFormData.drugMsg.price?'￥'+editFormData.drugMsg.price:''}}</view>
      </view>

      <view class="list">
        <text>总价：</text>
        <view>{{getTotalPrice?'￥'+getTotalPrice:'--'}}</view>
      </view>

      <view class="list">
        <text>备注：</text>
        <textarea v-model="editFormData.drugMsg.remark" maxlength=20 type="text" placeholder="限20个字"/>
      </view>

    </form>
  </view>
</template>

<script>
import Select from "@/components/xfl-select/xfl-select"
import ZzSelect from "@/components/zz-select/zzSelect"
import {  UseFrequencys ,Medicares,DrugTypes } from "./enum"
import { getQueryList , drugInPharmacy , getDrugInfo ,listUnit} from '@/common/request/prescriptionList.js'
  export default {
    components:{
      Select,
      ZzSelect
    },
    props:{
      prescriptionNumber:{
        type:Array
      },
      deptId:{
        type:String
      },
      edittorFormDatas:{
        type:Object
      },
      prescriptionListData:{
        type:Array
      },
      newPharmacy:{
        type:Object
      },
      codeId:{
        type:Boolean
      }
    },
    data(){
      return{
        //边框样式
        borderObj:'',
        //总量单位
        allcompanyName:[],
        //药品名称
        drugs:[],
        //药品类型
        drugsType:['草药','西药','中成药'],
        DrugTypes:{},
        //用药途径
        channel:[],
        //用药频次
        frequency:[],
        //疗程单位
        Company:['天','月'],
        //接收方-药房名称
        PharmacyName:[],
        //模糊查询的药品列表
        drugsLists:[],
        //医保类型枚举
        allTypeEnume:{},
        //总量
        total:'',
        //药房列表
        receivePharmacyS:[],
        //表单数据
        editFormData:{
          //处方号
          id:'',
          //药物信息
          drugMsg:{
             orgDrugId:'',//药品id
            name:'',//药品名
            medicare:'',//医保
            price:'',//单价
            split:'',//是否拆零
            spec:'',//药品规格
            regularPackVolume:'',//包装规格
            seq:0,
            type:'', //药品类型id

            receivePharmacyId:'',//药房id
            receivePharmacy:'',//药房名

            pharmaceuticalDosage:'',//剂型id
            pharmaceuticalDosageText:'',//剂型名

            singleDoseUnit:'',//剂量单位id
            singleDoseUnitText:'',//剂量单位名称

            basicDose:'',//默认剂量数

            // useWays:'',//用药途径id

            singleDose:'',//单次剂量数

            // useFrequency:'',//用药频次id

            treatment:'',//疗程数

            // treatmentUnit:'',//疗程单位id

            total:'',//总量
            totalUnit:'',//总量单位id

            totalPrice:'',//总价
            groupId:'',//组id
            remark:'',//备注
          }
        },
        //疗程单位枚举
        attrdate:{},
        //用药途径枚举
        useAways:{},
        //总量单位列表
        allCompany:[],
        //剂量单位暂存
        doseallCompany:[],
        //用药频次
        allfrequency:{},
        //默认总量单位
        basicUnit:"",
        //默认包装总量单位
        regularUnit:'',
        //默认药品规格
        regularPackVolume:''

      }

    },
    created(){
      //用药途径列表
      this.channel=this.$store.state.channel.map((item)=>{
        return item.name
      })
      console.log(this.$store.state.channel,'用药途径列表')
      //用药频次列表
      this.frequency=this.$store.state.frequency.map((item)=>{
        this.allfrequency[item.id]=item.name
        return item.name
      });
       this.editFormData.drugMsg.useFrequency=this.$store.state.frequency[0].id
      //医保枚举
      this.allTypeEnume=Medicares;

      //疗程单位列表
      this.Company=this.$store.state.course.map((item)=>{
        return item.attrName
      })
      this.editFormData.drugMsg.treatmentUnit=this.$store.state.course[0].attrId

      this.$store.state.course.forEach((item)=>{
        Object.assign(this.attrdate,{[item.attrId]:item.attrName})
      })
      //保存用药途径枚举项
      this.$store.state.channel.forEach((item)=>{
        Object.assign(this.useAways,{[item.id]:item.name})
      })
      this.editFormData.drugMsg.useWays=this.$store.state.channel[0].id

    },
    mounted(){
      if(this.edittorFormDatas.prescriptionId){
        this.editFormData=this.edittorFormDatas
        //模糊查询
        this.inputEvent(this.edittorFormDatas.drugMsg.name);
        console.log(this.edittorFormDatas,'******************************')
        if(this.edittorFormDatas.drugMsg.split){
          this.allcompanyName=[this.edittorFormDatas.drugMsg.basicUnitText,this.edittorFormDatas.drugMsg.regularUnitText]
        }else{
          this.allcompanyName=[this.edittorFormDatas.drugMsg.regularUnitText]
        }
      }
      this.editFormData.id=this.edittorFormDatas.prescriptionId||this.prescriptionNumber[0]
    },
    methods:{
      //限制输入
      inpchange(e){
        const v = e.detail.value
          this.editFormData.drugMsg.singleDose = '1'
          const zero = /^(0{2,})|[^0-9]/g
          let final = 0
          if (!v) {
            final = 0
          } else {
            final = v.toString().replace(zero, (v) => {
              return 0
            })
  
            if (final.split('')[0] * 1 === 0) {
              final = final.slice(1) - 0 || 0
            }
          }
          this.$nextTick(() => {
            this.editFormData.drugMsg.singleDose = final.toString()||'0'
            /* if(this.editFormData.drugMsg.singleDose%this.editFormData.drugMsg.basicDose!==0){
              this.editFormData.drugMsg.singleDose=Math.ceil(this.editFormData.drugMsg.singleDose/this.editFormData.drugMsg.basicDose)*this.editFormData.drugMsg.basicDose
            } */
          })
      },
      //疗程限制
      inpchangeTow(e){
        const v = e.detail.value
        this.editFormData.drugMsg.treatment = '1'
        const zero = /^(0{2,})|[^0-9]/g
        let final = 0
        if (!v) {
          final = 0
        } else {
          final = v.toString().replace(zero, (v) => {
            return 0
          })

          if (final.split('')[0] * 1 === 0) {
            final = final.slice(1) - 0 || 0
          }
        }
        this.$nextTick(() => {
          this.editFormData.drugMsg.treatment = final.toString() || '0'
        })
      },
      //总量限制
      inpchangethree(e){
        const v = e.detail.value
        this.editFormData.drugMsg.total = '1'
        const zero = /^(0{2,})|[^0-9]/g
        let final = 0
        if (!v) {
          final = 0
        } else {
          final = v.toString().replace(zero, (v) => {
            return 0
          })

          if (final.split('')[0] * 1 === 0) {
            final = final.slice(1) - 0 || 0
          }
        }
        this.$nextTick(() => {
          this.editFormData.drugMsg.total = final.toString() || '0'
        })
      },
     
      //处方号保存
      getValueCode(val){
        this.editFormData.id=val.newVal||this.prescriptionNumber[0]
        console.log(this.editFormData.id)
      },
      //用药途id保存
      changeChannel(val){
        this.$store.state.channel.forEach((item)=>{
          item.name==val.newVal&&(this.editFormData.drugMsg.useWays=item.id)
        })
      },
      //用药频次保存
      useFrequencyChange(val){
        this.$store.state.frequency.forEach((item)=>{
          if(item.name==val.newVal){
            this.editFormData.drugMsg.useFrequency=item.id
          }
        })
      },
  /*     //总价保存
      changeNum(val){
        this.editFormData.drugMsg.totalPrice=Number(this.editFormData.drugMsg.price)*Number(this.editFormData.drugMsg.total)
      }, */
     
      //疗程单位保存
      treatmentUnitChange(val){
        this.$store.state.course.forEach((item)=>{
          item.attrName===val.newVal&&(this.editFormData.drugMsg.treatmentUnit=item.attrId)
        })
      },
      //选中药品时
      changeinpvalue(e){
        //药品名
        console.log(e,'选中的药品--------------')
        this.basicUnit=e.basicUnit
        this.regularUnit=e.regularUnit
        this.regularPackVolume=e.regularPackVolume
          const drugeInfo={
            orgDrugId:e.id,//药品id
            name:e.name,//药品名
            medicare:e.healthAttr,//医保
            price:e.price,//单价
            split:e.split,//是否拆零
            spec:e.drugSpec,//药品规格
            regularPackVolume:e.regularPackVolume,//包装规格
            seq:0,
            type:this.getTypeId(e), //药品类型id
            basicUnitText:e.basicUnitText,

            receivePharmacyId:'',//药房id
            receivePharmacy:'',//药房名

            pharmaceuticalDosage:'',//剂型id
            pharmaceuticalDosageText:'',//剂型名

            singleDoseUnit:'',//剂量单位id
            singleDoseUnitText:e.basicUnitText,//剂量单位名称

            basicDose:'',//默认剂量数

            // useWays:'',//用药途径id

            singleDose:'',//单次剂量数

            // useFrequency:'',//用药频次id

            treatment:'',//疗程数

            // treatmentUnit:'',//疗程单位id

            total:'',//总量
            totalUnit:'',//总量单位id

            totalPrice:'',//总价
            groupId:'',//组id
            remark:'',//备注
          }
          Object.assign(this.editFormData.drugMsg,drugeInfo)
          console.log(this.editFormData.drugMsg,'999999999999999999999')

        //药品匹配药房
        this.getPharmacyList(e.id)
        //总量单位
        this.computedTotalUnit(e)

      },
      //药品模糊查询
      async inputEvent(e){
        let res = await getQueryList({name:e,deptId:this.deptId})
        this.drugsLists=res
      },
      //药房列表查询
      async getPharmacyList(e){
          //药品匹配药房
          this.receivePharmacyS= await drugInPharmacy({orgDrugId:e,deptId:this.deptId})
          //药房名列表
          this.PharmacyName=this.receivePharmacyS.map((item)=>{
            return item.pharmacyName
          })

      },

      //选中药房时,保存药品默认信息
      async receivePharmacyChange(val){
        this.receivePharmacyS.forEach((item)=>{
          if(item.pharmacyName===val.newVal){
            console.log(item,'选中的药房-------------------')
            //药房id保存
            this.editFormData.drugMsg.receivePharmacyId=item.mechanismId
            //药房名字保存
            this.editFormData.drugMsg.receivePharmacy=item.pharmacyName

            //剂型id保存
            this.editFormData.drugMsg.pharmaceuticalDosage=item.pharmaceuticalDosage;

            //剂量单位id保存
            this.editFormData.drugMsg.singleDoseUnit=item.dosageUnit

            //默认剂量数保存
            this.editFormData.drugMsg.basicDose=item.basicDose
           
          }
        })
        console.log(this.editFormData.drugMsg.pharmaceuticalDosage,'剂型id-------------------')
        //调用获取剂型名
        this.getName(this.editFormData.drugMsg.pharmaceuticalDosage);

        //剂量单位列表请求（参数：药房id）
        let res = await listUnit({mechanismId:this.editFormData.drugMsg.receivePharmacyId})
        this.doseComoany=res.filter(val => {
          return val.typeList.indexOf('DOSAGE_UNIT') > -1
        })

        //获取剂量单位名
        this.getDosageName(this.editFormData.drugMsg.singleDoseUnit)
      },

      //剂型id匹配剂型名
      getName(e){
        this.$store.state.pharmaceutical.forEach((val)=>{
          if(e==val.id){
            this.editFormData.drugMsg.pharmaceuticalDosageText=val.name
            console.log(this.editFormData.drugMsg,'111111111111111111111111')
          }
        })
      },
      //剂量单位id匹配剂量名
      getDosageName(e){
       this.doseComoany.forEach((item)=>{
         if(item.id==e){
           this.editFormData.drugMsg.singleDoseUnitText=item.unitName
         }
        
       })
      },
      //药品类型id匹配
      getTypeId(e){
        let id=''
        this.$store.state.rPType.forEach((item)=>{
          e.drugTypeCode===item.code&&(id=item.id)
        })
        return id
      },

      //总量单位
      computedTotalUnit(item) {
        let options = [
          {
            value: item.regularUnit,
            label: item.regularUnitText,
          },
        ]
        if (item.split) {
          options.unshift({
            value: item.basicUnit,
            label: item.basicUnitText,
          })
        }
        //总量单位名列表
        this.allcompanyName=options.map((item)=>{
          return item.label
        })
        this.allcompany=options
      },

      //总量单位选择改变时
      changeTotalCompany(e){
        this.allcompany.forEach((item)=>{
          if(item.label==e.newVal){
            this.editFormData.drugMsg.totalUnit=item.value
            this.editFormData.drugMsg.totalUnitText=item.label
          }
        })
      }
    },
    computed:{
      //如果可拆零并且选择了盒作为总量单位，那么总价就需要 单价*总量*每一盒的规格（多少粒） 其他条件直接总量*单价
      getTotalPrice(){
        if(this.editFormData.drugMsg.split&&this.editFormData.drugMsg.totalUnit&&this.editFormData.drugMsg.totalUnit==this.regularUnit){
            this.editFormData.drugMsg.totalPrice=this.editFormData.drugMsg.price*this.editFormData.drugMsg.total*this.regularPackVolume
            return this.editFormData.drugMsg.totalPrice
        }else{
           this.editFormData.drugMsg.totalPrice=this.editFormData.drugMsg.price*this.editFormData.drugMsg.total
            return this.editFormData.drugMsg.totalPrice
        }
      },
    }
    
  }
</script>

<style lang="scss" scoped>
  .drugs-list-page{
    height: 470px;
    overflow-y: scroll;
    form{
      .list{
        margin-left: 20px;
        display: flex;
        margin-bottom: 5px;
        >text{
          width: 80px;
          color: #666;
        }
        input{
          border: 1px solid #ccc;
          width: 198px;
          border-radius: 5px;
          text-indent: 9px;
        }
        .otherbox{
          display: flex;
          .otherinp{
          width: 150px;
          }
          .othertext{
            padding-left: 10px;
          }
        }
        textarea{
          border: 1px solid #ccc;
          width: 200px;
          height: 80px;
          text-indent: 2px;
          border-radius: 5px;
        }
      }
      .listOther{
        margin-top: 10px;
      }
    }
  }
</style>