import request from './request'
/**
 * payStatus {String} 处方支付状态 UNPAID("待付款未付钱"),UNPAID_ING("待付款进行中"),PAID("已支付"),EXPIRED("已失效")
 * orderId {String} 诊室订单ID
 * currentNum {Number} 分页页码
 * pageSize {Number} 分页页数
 */
export const userPageRp = params => request('/api/v1/prescription/userPageRp', params, 'GET');

/***
*处方下单详情页
* rpIds	处方id（逗号分隔）
*/
export const userRpDetail = params => request('/api/v1/prescription/userRpDetail', params, 'GET');

/**
 * 4.4.3.处方单提交
 * {
  "userId": "demoData",
  "bizType": "demoData",//PRESCRIPTION("处方")
  "prescIds": [
    "demoData"
  ],
  "express": true,
  "phone": "135.。。。。。。",
  "takeInfoList": {
    "orderId": "demoData",
    "pharmacyId": "demoData",
    "date": "demoData",
    "startTime": "demoData",
    "endTime": "demoData",
    "address": "demoData",
    "pharmacyName": "demoData"
  },
  "addressId": "demoData",
  "agreement": true
}
 */
export const orderSubmit = params => request('/api/v1/order/submit', params, 'POST');

/**
 * 4.2.4.订单预支付
 * orderId {String} 订单Id
 * payType {String} //支付类型OFFLINE_PAY, WECHAT_PAY(微信)
 */
export const prepay = params => request('/api/v1/order/prepay', params, 'POST');

/***
*6.1.7.11诊室订单id获取处方列表
*/
export const rpListInOrderDetail = params => request('/api/v1/prescription/rpList', params, 'GET');

//获取处方痕迹
export const getHisTory = params => request('/api/v1/prescription/rpTrace', params, 'GET');
