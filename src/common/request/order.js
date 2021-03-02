import request from './request'

/**
 * 退款订单
 * @param {Object} data
 */
export function refund(data) {
  return request('/api/v1/order/refund', data, 'POST')
}
