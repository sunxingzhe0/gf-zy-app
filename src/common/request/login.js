import request from './request'
// 密码登录
export function accountLogin(data) {
	return request('/api/v1/wxLogin/accountLogin', data, 'POST')
}
// 医生账号登录
export function miniProgramLogin(data) {
	return request('/api/v1/wxLogin/miniProgramLogin', data, 'GET')
}
// 用户小程序授权登录
export function miniUserRegLogin(data) {
	return request('/api/v1/wxLogin/miniUserRegLogin', data, 'GET')
}
// 绑定微信公众号
export function bindingWxApp(data) {
	return request('/api/v1/wxLogin/bindingWxApp', data, 'GET')
}
// 绑定小程序
export function bindingMiniProgram(data) {
	return request('/api/v1/wxLogin/bindingMiniProgram', data, 'POST')
}
// 微信小程序核身回调
export function finMiniProgramAuth(data) {
	return request('/api/v1/wxLogin/finMiniProgramAuth', data, 'GET')
}
//推送用户信息
export function encryptedData(data) {
	return request('/api/v1/wxLogin/encryptedData', data, 'POST')
}
//获取用户信息
export function loginInfo(data) {
	return request('/api/v1/login/loginInfo', data, 'GET')
}
//获取验证码
export function verificationCode(data) {
	return request('/api/v1/login/verificationCode', data, 'POST')
}
// 注册
export function register(data) {
	return request('/api/v1/wxLogin/register', data, 'POST')
}
// 设置密码
export function setPwd(data) {
	return request('/api/v1/wxLogin/setPwd', data, 'POST')
}
// 移动端账号注册人脸回调
export function finRegisterAuth(data) {
	return request('/api/v1/wxLogin/finRegisterAuth', data, 'GET')
}
// 验证码登录
export function codeLogin(data) {
	return request('/api/v1/wxLogin/codeLogin', data, 'POST')
}

// 权限树
export function menuList(data) {
	return request('/api/v1/login/menuList', data, 'GET')
}
// 切换角色
export function changeRole(data) {
	return request('/api/v1/login/changeRole', data, 'GET')
}
// 更换手机号前置验证
export function validateOldPhone(data) {
	return request('/api/v1/wxLogin/validateOldPhone', data, 'POST')
}

// 更换手机号
export function resetPhone(data) {
	return request('/api/v1/wxLogin/resetPhone', data, 'POST')
}
// 绑定手机号
export function bindPhone(data) {
  return request('/api/v1/wxLogin/firstBindPhone', data, 'POST')
}
// 手机号绑定核身回调
export function finishFirstBindPhone(data) {
	return request('/api/v1/wxLogin/finishFirstBindPhone', data, 'GET')
}
// 手机号更换核身回调
export function finishResetPhone(data) {
	return request('/api/v1/wxLogin/finishResetPhone', data, 'GET')
}
// 重置密码
export function resetPwd(data) {
	return request('/api/v1/wxLogin/resetPwd', data, 'POST')
}
// 忘记密码
export function fgtPwd(data) {
	return request('/api/v1/wxLogin/fgtPwd', data, 'POST')
}

// 验证健康档案验证码
export function userArchiveCheck(data) {
	return request('/api/v1/account/userArchiveCheck', data, 'POST')
}


//APP更新用户信息
export function encryptedDataByApp(data) {
	return request('/api/v1/wxLogin/encryptedDataByApp', data, 'POST')
}

//获取掌医登录信息
export function simLoginZy(data) {
	// return new Promise((resolve)=>{
	// 	resolve({})
	// })
	return request('zyApi/api/v1/login/simLoginZy', data, 'POST')
}
