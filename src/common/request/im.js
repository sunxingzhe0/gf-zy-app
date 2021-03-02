import request from './request'
/**
 * 获取用户最新的服务器上Sequence序号
 * token:31A07975328A4D2ABE0D3F663928DF5A
 * userId:F9F961C17A954F0583FCB68730E70574
 */
export const userImSequence = params => request('/api/v1/im/userSyncVersion', params, 'GET');


/**
 * 3.5.获取最新用户同步数据
 * token:31A07975328A4D2ABE0D3F663928DF5A
 * userId:F9F961C17A954F0583FCB68730E70574
 * version:20201581771695037
 */
export const userSyncData = params => request('/api/v1/im/userSyncData', params, 'GET');
