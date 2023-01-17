<template>
	<view class="info">
		<view class="app-card">
      <view>患者信息</view>
      <view class="item">
        <text>{{ patentInfo.name }}</text>
        <text>{{ patentInfo.sex == 1 ? "男" : "女" }}</text>
        <text>{{ patentInfo.age }}</text>
        <text>{{ patentInfo.phone }}</text>
      </view>
      <view class="item">
        <text>患者ID：{{ patentInfo.id || "-" }}</text>
        <text>就诊卡号：{{ patentInfo.cardNo || "-" }}</text>
        <text>就诊次数：{{ patentInfo.visitNum || "-" }}</text>
      </view>
      <view class="item">
        <text>出生日期：{{ patentInfo.birthDay }}</text>
        <text>身份证号：{{ patentInfo.cardId }}</text>
      </view>
    </view>
		<view class="app-card">
			<view class="item">共2条</view>
			<view class="list-item">
         <view>
					<view>2022-07-28 08:00:24 周爽 门诊</view>
				 </view>
				 <view class="item-content">
            <textarea class="item-text" placeholder="请输入"></textarea>
						<view class="addPtr">
          <view class="add" @click="upImg" v-if="uploadImags.length < 5">
            <uni-icons
              type="camera-filled"
              color="#999999"
              size="30"
            ></uni-icons>
          </view>
          <view
            v-for="(item, index) in uploadImags"
            :key="index"
            class="img-layout"
          >
            <image :src="FILE_URL(item)" class="img"></image>
						<uni-icons type="clear" class="img-del" @click="delImg(index)"></uni-icons>
          </view>
        </view>
				 </view>
			</view>
		</view>
	</view>
</template>
<script>
import uniIcons from '../../../components/uni-icons/uni-icons.vue'
import { upload } from '@/common/upload.js'

export default {
  components: { uniIcons },
	data(){
		return {
			patentInfo: {
        name: "刘力菲",
        sex: "0",
        age: "65岁",
        phone: "15489875687",
        id: "21547",
        cardNo: "258796",
        visitNum: 10,
        birthDay: "1990-05-25",
        cardId: "512547895874125414",
      },
			uploadImags: [],
		}
	},
	methods:{
		delImg(index) {
      this.uploadImags.splice(index, 1)
    },
		
		upImg() {
      var _self = this
      uni.chooseImage({
        count: 5 - _self.uploadImags.length, //默认9 6 - _self.uploadImags.length
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function(res) {
          console.log(res)
          res.tempFiles.forEach(({ path, size }) => {
            //上传图片
            if (size < 5000000) {
              upload(path).then(data => {
                console.log(data)
                if (data.body) {
                  _self.uploadImags.push(data.body)
                }
              })
            } else {
              uni.showToast({
                title: '图片大小不能超过5M',
                icon: 'none',
              })
            }
          })
        },
      })
    },
	}
}
</script>
<style lang="scss" scoped>
.info{
	font-size: 26rpx;
	.app-card {
    padding: 20rpx;
    margin-top: 20rpx;
    .item {
      margin-top: 20rpx;
      text {
        margin-right: 15rpx;
      }
    }
		.list-item{
			/* display: flex; */
			border-left: 1px solid #cccccc;
			padding: 10rpx;
			padding-left: 20rpx;
			position: relative;
			margin-top: 20px;
			&::before{
        content: '';
				position: absolute;
				height: 26rpx;
				width: 26rpx;
				background: #666;
				top: 0;
				left: -15rpx;
				border-radius: 50%;
			}
			.item-content{
				flex: 1;
				.item-text{
					border: 1px solid #cccccc;
					padding: 20rpx;
					width: 100%;
					height: 250rpx;
					box-sizing: border-box;
					margin-top: 20rpx;
				}
			}
		}
		.addPtr {
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
			margin-top: 20rpx;
      .add {
        min-height: 180rpx;
        min-width: 180rpx;
        border: 2rpx dotted #cccccc;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .icon {
          width: 48rpx;
          height: 48rpx;
        }
        .text {
          margin-top: 21rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
        }
      }
      .textadd {
        margin-left: 30rpx;
        font-size: 20rpx;
        font-weight: 500;
        color: rgba(204, 204, 204, 1);
        margin-right: 20rpx;
      }
      .img-layout {
        position: relative;
        margin-left: 30rpx;
        .img {
          padding: 10rpx;
          height: 180rpx;
          width: 180rpx;
          display: block;
        }
        .img-del {
          width: 30rpx;
          height: 30rpx;
          position: absolute;
          right: 0rpx;
          display: block;
          top: 0;
        }
      }
    }
  }
}

</style>