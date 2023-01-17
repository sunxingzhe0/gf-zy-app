<script>
import { updateUserOnlineState } from '@/common/request/chat'
// const innerAudioContext = uni.createInnerAudioContext()
// innerAudioContext.src =
//   'https://miapp.chuntaoyisheng.com/%E4%B8%9A%E5%8A%A1%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E8%AF%AD%E9%9F%B3.mp3'
export default {
  onLaunch: function() {
    console.log('App Launch')
    this.getIsUpDate() //检查版本更新
    this.getStatausAndWrite()
    // #ifdef APP-PLUS
    // 检测升级
    uni.request({
      url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
      data: {
        appid: plus.runtime.appid,
        version: plus.runtime.version,
        imei: plus.device.imei,
      },
      success: res => {
        if (res.statusCode == 200 && res.data.isUpdate) {
          let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android
          // 提醒用户更新
          uni.showModal({
            title: '更新提示',
            content: res.data.note || '是否选择更新',
            success: showResult => {
              if (showResult.confirm) {
                plus.runtime.openURL(openUrl)
              }
            },
          })
        }
      },
    })
    // #endif
    //设置ios静音模式可播放声音
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
    })
  },
  mounted() {
    //全局监听医生端同步指令 播放音频
    // uni.$on('sync', data => {
    //   if (
    //     uni.getStorageSync('clientType') != 'USER' &&
    //     data === 'SYNC_BIZ_NOTICE'
    //   ) {
    //     console.log(data, '播放音频的同步指令')
    //     this.playAudio()
    //   }
    // })
    // uni.$on('handelVideoPage', data => {
    //   console.log(data, '调整音量------------------------')
    //   innerAudioContext.volume = data ? 0.5 : 1
    // })
    //音频播放回调
    // innerAudioContext.onPlay(() => {
    //   console.log('开始播放')
    // })
    // innerAudioContext.onError(res => {
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    //   this.playAudio()
    // })
  },
  onShow: function(options) {
    this.webSocket.close()
    setTimeout(() => {
      this.webSocket.connectSocket()
    }, 1000)
    this.globalData.pageQuery = options.query //获取进入小程序的参数
    console.log(options.query, '进入小程序的参数------')
  },
  onHide: function() {
    console.log('App Hide')
  },
  globalData: {
    test: '',
    pageQuery: {},
  },
  methods: {
    //播放音频
    playAudio() {
      innerAudioContext.play()
    },
    //写入当前socket连接状态
    getStatausAndWrite() {
      setInterval(async () => {
        const socketStatus = this.webSocket.getSocketConnect() ? false : true
        const userId = uni.getStorageSync('userId')
        if (socketStatus) {
          await updateUserOnlineState({ userId })
        }
      }, 3000)
    },
    //检查更新
    getIsUpDate() {
      const updateManager = uni.getUpdateManager()

      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate, '======更新状态')
      })

      updateManager.onUpdateReady(function(res) {
        updateManager.applyUpdate()
      })

      updateManager.onUpdateFailed(function(res) {
        // 新的版本下载失败
        uni.showModal({
          title: '更新提示',
          content: '版本已更新，请删除当前小程序，重新搜索打开',
          showCancel: false,
        })
      })
    },
  },
}
</script>

<style lang="scss">
@import './common/uni.css';
@import './common/app.scss';
@import './common/global.scss';
@import './common/index.scss';
@import './assets/iconfont/iconfont.css';
@import url('@/components/u-parse/u-parse.css');
page {
  height: 100%;
  background-color: #eee;
  font-size: 26rpx;
}
</style>
