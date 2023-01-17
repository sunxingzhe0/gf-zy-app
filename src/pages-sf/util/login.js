//登录随访系统：token授权随访系统code => code获取随访系统token => 保存
import { getSfCode, sfLogin, improveUserInfo } from '../api/user'
import store from '@/store'
export async function loginSf() {
  const token = uni.getStorageSync('token')
  if (!token) {
    return uni.showToast({
      title: '登录信息不存在，请检查',
      icon: 'none',
    })
  }
  // 登录
  uni.showLoading()
  const sfCode = await getSfCode({ token })
  const sfLoginRes = await sfLogin(sfCode)
  console.log(sfLoginRes.token, '_______________sftoken__________')
  uni.setStorageSync('sfUserInfo', sfLoginRes)
  uni.setStorageSync('sfToken', sfLoginRes.token)
  uni.hideLoading()

  console.log(store.state.userInfo)
  //补充用户信息
  await improveUserInfo({
    avatar: store.state.userInfo.avatar || '',
    birthday: store.state.userInfo.birthday || '',
    mobile: store.state.userInfo.bindPhone || '',
    nickname: store.state.userInfo.username || '',
    region: store.state.userInfo.region || '',
    sex: store.state.userInfo.sex || '',
    updateAll: true,
  })
}
