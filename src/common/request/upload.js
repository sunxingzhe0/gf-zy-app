import {
  host
} from '@/urls.js';
export function upload(filePath) {
  const token = uni.getStorageSync('token')
  return new Promise(resolve => {
    uni.uploadFile({
      url: `${host}mi/api/v1/file/uploadFile?token=${token}`,
      filePath,
      name: 'file',
      formData: {
        upload: 'file'
      },
      success: function(uploadFileRes) {
        resolve(JSON.parse(uploadFileRes.data))
      },
      fail: function(e) {
        console.log('上传失败:', e)
        resolve(null)
      }
    })
  })
}
