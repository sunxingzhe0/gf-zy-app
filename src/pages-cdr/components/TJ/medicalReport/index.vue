<template>
  <view class="medical-report">
    <view class="head">
      <view class="line"></view>
      <view class="title">体检报告</view>
    </view>
    <template v-for="(one,menu) in menuList">
      <!-- 综述信息 -->
      <template v-if="one.tagType=='ZSXX'">
        <collapse-item :title="'【体检】'+one.tagName" :key="menu">
          <view class="item-one" v-for="(item,oneBox) in one.beanList" :key="oneBox">
            <view class="title">{{item.title}}</view>
            <view class="text">{{item.text}}</view>
          </view>
        </collapse-item>
      </template>
      <!-- 总检信息 -->
      <template v-if="one.tagType=='ZJXX'">
        <collapse-item :title="'【体检】'+one.tagName" :key="menu">
          <view class="item-one" v-for="(item,oneBox) in one.beanList" :key="oneBox">
            <view class="title">{{item.title}}</view>
            <view class="text">{{item.text}}</view>
          </view>
        </collapse-item>
      </template>
      <!-- 临床小结 -->
      <template v-if="one.tagType=='LCXJ'">
        <collapse-item :title="'【体检】'+one.tagName" :nums='tableList.length' :key="menu">
          <view class="table-box" v-for="(item,table) in one.beanList" :key="table">
            <view class="title">{{item.title}}</view>
            <table cellspacing="0">
              <thead>
                <tr><td v-for="(th,thead) in tableHead" :key="thead">{{th}}</td></tr>
              </thead>
              <tbody>
                <tr v-for="(son,child) in item.child" :key="child">
                  <td>{{child+1}}</td>
                  <td>{{son.name}}</td>
                  <td>{{son.result}}</td>
                  <td>{{son.itemResultUnit||'-'}}</td>
                  <td>{{son.itemResultReference||'-'}}</td>
                </tr>
              </tbody>
            </table>
            <view class="doctor-time">
              <view class="doctor">小结医生：王草书</view>
              <view class="time">小结时间：2020-06-25</view>
            </view>
            <view class="remark">小结内容：小结内容小结内容小结内容小结内容小结内 容小结内容小结内容小结内容小结内容</view>
          </view>
        </collapse-item>
      </template>
      <!-- 检验小结 -->
      <template v-if="one.tagType=='JYXJ'">
        <collapse-item :title="'【体检】'+one.tagName" :nums='tableList.length' :key="menu">
          <view class="table-box" v-for="(item,table) in tableList" :key="table">
            <view class="title">{{item.title}}</view>
            <table cellspacing="0">
              <thead>
                <tr>
                  <td v-for="(th,thead) in tableHead" :key="thead">{{th}}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(son,child) in item.child" :key="child">
                  <td>{{child+1}}</td>
                  <td>{{son.name}}</td>
                  <td>{{son.result}}</td>
                  <td>{{son.itemResultUnit||'-'}}</td>
                  <td>{{son.itemResultReference||'-'}}</td>
                </tr>
              </tbody>
            </table>
            <view class="doctor-time">
              <view class="doctor">小结医生：王草书</view>
              <view class="time">小结时间：2020-06-25</view>
            </view>
            <view class="remark">小结内容：小结内容小结内容小结内容小结内容小结内 容小结内容小结内容小结内容小结内容</view>
          </view>
        </collapse-item>
      </template>
      <!-- 检查小结 -->
      <template v-if="one.tagType=='JCXJ'">
        <collapse-item :title="'【体检】'+one.tagName" :key="menu">
          <view class="item-one" v-for="(one,oneBox) in one.beanList" :key="oneBox">
            <view class="title">{{one.title}}</view>
            <view class="text">{{one.text}}</view>
          </view>
        </collapse-item>
      </template>
    </template>
  </view>
</template>

<script>
import collapseItem from '../../common/collapseItem/index'
import { caseDoc,tjCaseDoc } from '../../../api/index'
  export default {
    components:{
      collapseItem,
    },
    props:{
      mpiId:{
        type:String
      },
      ehrId:{
        type:String
      }
    },
    data(){
      return{
        menuList:[],
        tjInfoList:[],
        tableHead:['序号','项目名称','结果','单位','参考值'],
        oneList:[
          {title:'体检报告时间',text:'2020-06-05'},{title:'体检综述',text:'这里是体检综述这里是体检综述这里是体检综 述这里是体检综述'}
        ],
        twoList:[
          {title:'体检症状',text:'牙周炎，超重'},{title:'建议内容',text:'这里是建议内容这里是建议内容这里是建议内 容这里是建议内容'}
        ],
        tableList:[
          {
            title:'项目1',
            child:[
              {name:'四肢',result:'无特殊',itemResultUnit:'',itemResultReference:''},
            ]
          },
          {
            title:'项目2',
            child:[
              {name:'皮肤',result:'无特殊',itemResultUnit:'',itemResultReference:''},
            ]
          }
        ],
        summaryList:[
          {
            childen:[
              {title:'检查项目',text:'胸部'},{title:'检查所见',text:'三维重建轴位、冠状位及矢状位图像示:临床提 示:后纵隔病变;右肺中叶见条片状高密度影'},
              {title:'检查结论',text:'1.双下肺感染性病变; 度影，增强后有强化,余肺纹理清晰。两肺门区 未 2.腹水; 见异常。气管支气管影通畅，未见明显狭窄。 纵隔 3.胆囊炎并结石; 请结合临床建议必要时进一步检查'},
              {title:'小结内容',text:''}
            ]
          },
          {
            childen:[
              {title:'检查项目',text:'胸部'},{title:'检查所见',text:'三维重建轴位、冠状位及矢状位图像示:临床提 示:后纵隔病变;右肺中叶见条片状高密度影'},
              {title:'检查结论',text:'1.双下肺感染性病变; 度影，增强后有强化,余肺纹理清晰。两肺门区 未 2.腹水; 见异常。气管支气管影通畅，未见明显狭窄。 纵隔 3.胆囊炎并结石; 请结合临床建议必要时进一步检查'},
              {title:'小结内容',text:''}
            ]
          }
        ]
      }
    },
    methods:{
      async getCaseDoc(){
        let res = await caseDoc({
          mpiId:this.mpiId,
          ehrId:this.ehrId,
          type:'TJ'
        })
        res.forEach(v => {
          this.menuList=v.tjDisease.menuList
        });
        this.menuList.forEach(v=>{
          // this.tjInfoList = this.getTjCaseDoc(v.relValue,v.tagType)
          this.getTjCaseDoc(v.relValue,v.tagType)
        })
        console.log(this.tjInfoList);
      },
      async getTjCaseDoc(relValue,tagType){
        let res = await tjCaseDoc({
          relValue:relValue,
          tagType:tagType
        }) 
       return res.tjInfoDto
      }
    },
    mounted(){
      // this.getCaseDoc()
    }
  }
</script>

<style lang="scss" scoped>
.medical-report{
  .head{
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .line{
      width: 2rpx;
      height: 30rpx;
      background: #0AB2C1;
      margin-right: 10rpx;
    }
    .title{
      width: 150rpx;
      font-size: 30rpx;
      color: #333333;
    }
  }
  .item-one{
    width: 100%;
    margin-bottom: 30rpx;
    .title{
      font-size: 26rpx;
      font-weight: 500;
      color: #333333;
      margin-bottom: 20rpx;
    }
    .text{
      font-size: 24rpx;
      font-weight: 500;
      color: #666666;
    }
  }
  .table-box{
    width: 100%;
    .title{
      width: 100%;
      margin-bottom: 20rpx;
      font-size: 26rpx;
      line-height: 26rpx;
      font-weight: 500;
      color: #333333;
    }
    table{
      width: 100%;
      border: 0.5rpx solid #E6E6E6;
      text-align: center;
      margin-bottom: 20rpx;
      overflow: hidden;
      transition: all 0.3s;
      thead{
        width: 100%;
        background: #F2F2F2;
        font-size: 20rpx;
        color: #666666;
      }
      tbody{
        width: 100%;
        font-size: 20rpx;
        color: #666666;
      }
      tr td{
        border: 0.5rpx solid #E6E6E6;
      }
      tr{
        display: flex;
      }
      td{
        width: 20%;
      }
    }
    .doctor-time{
      display: flex;
      width: 100%;
      margin-bottom: 20rpx;
      align-items: center;
      color: #666666;
      .doctor{
        width: 40%;
        font-size: 20rpx;
      }
      .time{
        width: 60%;
        font-size: 20rpx;
      }
    }
    .remark{
      width: 100%;
      font-size: 20rpx;
      margin-bottom: 20rpx;
      color: #666666;
    }
  }
  .summary-box{
    width: 100%;
    .head{
      width: 100%;
      font-size: 26rpx;
      font-weight: 500;
      color: #333333;
      margin-bottom: 20rpx;
    }
    .body{
      font-size: 24rpx;
      font-weight: 500;
      color: #666666;
      line-height: 34rpx;
      margin-bottom: 30rpx;
    }
  }
}
</style>