<template>
<!-- 带搜索下拉框插件 -->
  <view class="slectOut">
    <view>
      <input class="inp" :class="{focus:isFocus}" v-model="inpValue" type="text" placeholder="请输入" :style="{width:width+'px'}" placeholder-style="color:#999" @focus="focusChagne" @blur="blurChange" @input="hadleInput">
      <!-- 小三角 -->
      <text class="iconfont iconarrowBottom-fill right-arrow" :class="{isRotate: isRotate}"></text>
    </view>
    <view class="content" v-if="isFocus">
      <view class="icon"></view>
      <view class="line"></view>
      <scroll-view  class="int" v-if="datas.length>0">
        <view class="list" v-for="item in datas" :key="item.id" :class="{active:num===item.id}" @touchmove="moved" @touchend="changeSelect(item)">
          <view>
            <text class="name">{{item.name}}</text>
            <text class="perce">（{{item.drugSpec||''}}）</text>
          </view>
        </view>
      </scroll-view >
      <view v-else class="otherNone">
        <view>无数据</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props:['width','initValue','datas'],
    data(){
      return{
        //聚焦状态
        isFocus:false,
        //选中项
        num:'',
        //小三角旋转
        isRotate:false,
        inpValue:'',
        ismoved:''
      }
    },
    methods:{
      //聚焦时
      focusChagne(){
        console.log('聚焦状态')
        this.isFocus=true;
        this.isRotate=true;
      },
      //失焦时
      blurChange(){
        
      },
      //点击选中
      changeSelect(val){
        if(this.ismoved!==1){
          this.num=val.id
          this.inpValue=val.name
          this.$emit('changeValue',val)
          this.isFocus=false;
          this.isRotate=false;
        }
        this.ismoved=''
      },
      hadleInput(){
        this.$emit('input',this.inpValue)
      },
      moved(){
        this.ismoved=1
      }
    },
    mounted(){
      this.inpValue=this.initValue
    }
    
  }
</script>

<style lang="scss" scoped>
	$hover-color: #c0c4cc;     
  $arrowWidth: 12%;
  .slectOut{
    position: relative;
    .inp{
      border:1px solid #ccc;
      padding-left: 10px;
      border-radius: 4px;
    }
    	.right-arrow{
			&.isRotate{
				transform: rotate(180deg);
			}
			transition: transform .2s cubic-bezier(.645,.045,.355,1);
			position: absolute; font-size: 1em; right: 0px; display: flex; 
			top: 0;
			align-items: center; color: $hover-color; height: 100%;
			font-weight: 100; width: $arrowWidth; justify-content: center;
		}
    .focus{
      border: 1px solid #1C8CF5;
      border-radius: 4px;
    }
    .content{
      position: absolute;
      top: 33px;
      left: 0;
      box-shadow: 1px 1px 10px #ccc;
      width: 100%;
      z-index: 9999;
      border-radius: 4px;
      background: #fff;
      .int{
        background: #fff;
        max-height: 200px;
        width: 100%;
        overflow-y: scroll;
        z-index: 2;
        border-radius: 4px;
        border: 1px solid #f2f2f2;
        padding: 5px 0;
        .list{
          padding: 5px 0 5px 5px;
          .name{
            font-size: 12px;
          }
          .perce{
            color: #666;
            font-size: 12px;
          }
          .pharmacy{
            font-size: 10px;
            color: #666;
          }
        }
        .active{
          background: #F5F7FA;
          >view.pharmacy{
            color: #1C8CF5;
          }
          >view{
            >text.name,>text.perce{
              color: #1C8CF5;
            }
          }
        }
      }
      .otherNone{
        background: #fff;
        border-radius: 4px;
        >view{
          text-indent: 10px;
          padding: 5px 0;
          color: #999;
        }
      }
      .icon{
        position: absolute;
        top: -3px;
        left: 10px;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        border: 1px solid #ccc;
        background: #fff;
        z-index: -1;
      }
      .line{
        width: 10px;
        height: 1px;
        background: #fff;
        position: absolute;
        top: 0px;
        left: 10px;
        z-index: 3;
      }
    }
  }



  //**************************************  以下为字体  ****************************************
@font-face {font-family: "iconfont";
  src: 
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB1gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCEIFsATYCJAMQCwoABCAFhG0HSxthBhEVlKdkPwvsmHgLNqmwEc2pDxvYjI1gkX0f4uFrv9dz3+772RAqQJV8FbKANj5RiB1f1q0ioyorK1THs2Qj0gAJVYn///3mxT27TKyJJ63gD/KkYhr/9woe4ghtLxKJk5AWd7icc+CiJuQLU5SVQ48+ST+l0H2/pM2sm89zOb2VZYHMb1luYy3a0496AWYLKLA9sQ0UaAEFxC2yi7gTF3GaQJtRTbFxcfcIRYYmBeKyjDJQCiFZNrJFaDSszOI11Ep1IQZeRd+P/zAXcip1gmbuHJ/nYeWX9redqtuqPU6AYj4vjHUkNJGJ08bUviQMXtL2m2wJRVHxS/sz/N1+2CZOdizDemP/eBXRgCo7wIKcTvzSUnlmGMoSgt/tChX8EEOBlNvCLsQdpgv8HuNG8wuia9YA1Tfni5TZR1QthTxh8ZM2VCAHtiBtzfWtz1RtObA8IXowr5rzRK4/sRYpfjm1FBA9nrPl/qNAJRZLKJNsUumMKdb3dkIlkqjEtt8VrbNjZgnB48fG1XqNHax98/uI4xs768DFXVceFql2do6594N/t9vl/tw+ZlhKP6ngFjorHQq/AOmpcAlI98L7Pz/KG7P0OqU7+SuqQ7d8OXhYRvZsnLHcTCD4zwpgXfZVyJGzq6byIJiNgyZUaNOGv5ujz885jIPgWkIxOCLYYiRDUkyTmdNErd0CGopltJm1vb5dv3tJ5DDjpYTQ4wMqXT4h6fGZzJwfqA2R/SGlDxGUnsO0o4onyuKUUDLWoDbodPCGuFjE1U9sJispr4r4X6Sxi0IRiZWzD/RIc8wZ56ZkNmAoOLhL56G1ASKFHjWnLXOssmix6UWpDm4nnCJIYqgGlA3oaIFneHMmKp9/Qo2JJVEHqyf9hcio6x0UUjmAfOg9iHUvl4xmjRJjBjBI4IC7NAxZVgBi87Ae0liqHZGIKhluZKD6dH2j+8Jd0AY9MUcVKXLU5I9a6XU7FUcUppMkCss5MAeXmM7a3Q4A') format('woff2'),
  url('data:application/x-font-woff;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB1gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCEIFsATYCJAMQCwoABCAFhG0HSxthBhEVlKdkPwvsmHgLNqmwEc2pDxvYjI1gkX0f4uFrv9dz3+772RAqQJV8FbKANj5RiB1f1q0ioyorK1THs2Qj0gAJVYn///3mxT27TKyJJ63gD/KkYhr/9woe4ghtLxKJk5AWd7icc+CiJuQLU5SVQ48+ST+l0H2/pM2sm89zOb2VZYHMb1luYy3a0496AWYLKLA9sQ0UaAEFxC2yi7gTF3GaQJtRTbFxcfcIRYYmBeKyjDJQCiFZNrJFaDSszOI11Ep1IQZeRd+P/zAXcip1gmbuHJ/nYeWX9redqtuqPU6AYj4vjHUkNJGJ08bUviQMXtL2m2wJRVHxS/sz/N1+2CZOdizDemP/eBXRgCo7wIKcTvzSUnlmGMoSgt/tChX8EEOBlNvCLsQdpgv8HuNG8wuia9YA1Tfni5TZR1QthTxh8ZM2VCAHtiBtzfWtz1RtObA8IXowr5rzRK4/sRYpfjm1FBA9nrPl/qNAJRZLKJNsUumMKdb3dkIlkqjEtt8VrbNjZgnB48fG1XqNHax98/uI4xs768DFXVceFql2do6594N/t9vl/tw+ZlhKP6ngFjorHQq/AOmpcAlI98L7Pz/KG7P0OqU7+SuqQ7d8OXhYRvZsnLHcTCD4zwpgXfZVyJGzq6byIJiNgyZUaNOGv5ujz885jIPgWkIxOCLYYiRDUkyTmdNErd0CGopltJm1vb5dv3tJ5DDjpYTQ4wMqXT4h6fGZzJwfqA2R/SGlDxGUnsO0o4onyuKUUDLWoDbodPCGuFjE1U9sJispr4r4X6Sxi0IRiZWzD/RIc8wZ56ZkNmAoOLhL56G1ASKFHjWnLXOssmix6UWpDm4nnCJIYqgGlA3oaIFneHMmKp9/Qo2JJVEHqyf9hcio6x0UUjmAfOg9iHUvl4xmjRJjBjBI4IC7NAxZVgBi87Ae0liqHZGIKhluZKD6dH2j+8Jd0AY9MUcVKXLU5I9a6XU7FUcUppMkCss5MAeXmM7a3Q4A') format('woff')
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconshanchu1:before {
  content: "\e68c";
}

.icongou:before {
  content: "\e786";
}

.iconarrowBottom-fill:before {
  content: "\e60e";
}
</style>