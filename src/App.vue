<script>
export default {
  onLaunch: function() {
    console.log('App Launch')

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
            content: res.data.note ? res.data.note : '是否选择更新',
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
  },
  onShow: function() {
    console.log('App Show')
    this.webSocket.connectSocket()
  },
  onHide: function() {
    console.log('App Hide')
  },
  globalData: {
    test: '',
  },
}
</script>

<style lang="scss">
@import './common/uni.css';
@import './common/app.scss';
@import './common/global.scss';
@import './common/index.scss';
@import './assets/iconfont/iconfont.css';

page {
  height: 100%;
  background-color: #eee;
  font-size: 26rpx;
}
</style>
