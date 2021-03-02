<style scoped>
  .tabbarMain {
    background: rgba(255, 255, 255, 1);
    height: 98upx;
    position: fixed;
    z-index: 50;
    width: 100%;
    flex: 1;
    bottom: 0;
  }

  .tabbarMainIphone {
    height: 256upx;
    padding-bottom: 64upx;
  }

  .tabBtnMina {
    width: 750upx;
    height: 88upx;
    position: absolute;
    z-index: 2;
    bottom: 0;
    flex-direction: row;
    /* #ifndef */
    padding-bottom: constant(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-top);
    /* #endif */
    display: flex;
  }

  .tabBtnMinaIphone {
    height: 156upx;
    padding-bottom: 64upx;
  }

  .imgse {
    width: 48upx;
    height: 48upx;
  }

  .txtBtn {
    font-size: 24upx;
    color: #666666;
  }

  .txtBtnSel {
    font-size: 24upx;
    color: #333333;
  }

  .itmMain {
    /* width: 250upx; */
    /* width: 150upx; */
    flex: 1;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .imgseTs {
    width: 150upx;
    height: 140upx;
    margin-bottom: 90upx;
    position: relative;
    z-index: 1;
    bottom: 0upx;
  }

  .btnfixMin {
    width: 750upx;
    height: 178upx;
    position: absolute;
    z-index: 1;
    bottom: 0;
  }

  .btnfixMinIphone {
    bottom: 64upx;
  }

  .fixTpm {
    width: 150upx;
    height: 140upx;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 0;
  }

  .imgseTsAnds {
    width: 150upx;
    height: 150upx;
    position: fixed;
    z-index: 1;
    bottom: 10upx;
    left: 50%;
    border-radius: 150upx;
    transform: translateX(-50%);
  }
</style>


<template>

  <view class="tabbarMain" :class="[flagTypeInfo? 'tabbarMainIphone':'']">
    <view class="tabBtnMina" :class="[flagTypeInfo? 'tabBtnMinaIphone':'']" mode="">
      <view class="itmMain" @click.stop="switchTabFunc(0)">
        <image class="imgse" :fade-show='false' v-if="active!=0" :src="require('@/assets/user/user_main.png')"></image>
        <image class="imgse" :fade-show='false' v-if="active===0" :src="require('@/assets/user/user_main_s.png')"></image>
        <text class="txtBtn" :class="{'txtBtnSel' :active==0}">首页</text>
      </view>
      <view class="itmMain" @click.stop="switchTabFunc(1)">
        <image class="imgse" :fade-show='false' v-if="active!=1" :src="require('@/assets/user/user_consultation.png')"></image>
        <image class="imgse" :fade-show='false' v-if="active===1" :src="require('@/assets/user/user_consultation_s.png')"></image>
        <text class="txtBtn" :class="{'txtBtnSel' :active==1}">诊室</text>
      </view>
      <view class="itmMain" @click.stop="switchTabFunc(2)">
        <image class="imgse" :fade-show='false' v-if="active!=2" :src="require('@/assets/user/user_mine.png')"></image>
        <image class="imgse" :fade-show='false' v-if="active===2" :src="require('@/assets/user/user_mine_s.png')"></image>
        <text class="txtBtn" :class="{'txtBtnSel' :active==2}">我的</text>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        active: Number, // 当亲选择那个按钮
        platforms: '', // 终端调整兼容
        leftWidth: 0, // 安卓 端使用
        flagTypeInfo: false, // 检测当前是否是IPHONE 异形屏幕
      }
    },
    mounted() {
      this.flagTypeInfo = this.$is_bang;
      let tempSystem = uni.getSystemInfoSync()
      this.platforms = tempSystem.platform

      this.$nextTick(() => {
        // #ifdef APP-NVUE || APP-PLUS || APP-PLUS-NVUE ||APP-VUE
        if (this.platforms == 'android') {
          let temp = this.$refs.leftWidth
          this.leftWidth = tempSystem.screenWidth / 2
        }
        // #endif
        this.active = this.actives
      })
    },
    props: {
      actives: {
        type: Number,
        default: 0
      }
    },
    inject: ['_mainFuncInit'], // 父级传递过来的函数
    methods: {
      /**
       * @name 初始化当前点击索引
       * 解决初始化闪烁图标问题
       * */
      getSetting(numbers) {
        this.active = numbers || 0
      },
      /**
       * @name tab点击事件
       * @param {number} index 当前点击的索引
       * @param {string} Urls 当前点击带进来的链接
       * */
      switchTabFunc(index, Urls) {
        // if (index != 2) {
        uni.setStorageSync('setStatusIndexFunc', index)
        this._mainFuncInit() // 回调父级函数
        this.active = index
        // }
        // if (index == 2) {
        //   console.log('弹出自定义')
        // }
      }
    }
  }
</script>
