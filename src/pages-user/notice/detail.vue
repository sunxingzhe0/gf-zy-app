<template>
	<view class="content">
    <!-- 收到视频聊天邀请 -->
    <video-invitation/>
    <!--主页按钮-->
    <homeIcom />
		<view class="title">{{infoData.title}}</view>
		<view class="date">{{infoData.releaseTime}}</view>
		<view class="main" v-html="infoData.content"></view>
	</view>
</template>

<script>
  import {queryAnnounce,readAnnounce} from '../../common/request/index.js'
  import htmlParser from '@/common/htmlParser.js'
  import {host} from '@/urls.js'
  export default{
  	data(){
  		return{
  			id:'',
  			infoData:''
  		}
  	},
  	onLoad(options) {
  		if(options.id){
  			this.id = options.id
  			this.setreadAnnounce()
  			this.getqueryAnnounce()
  		}
  	},
  	methods:{
  		// 获取详情
  		async getqueryAnnounce(){
         let data = await queryAnnounce({announceId:this.id})
         data.content = data.content.replace('&amp;','&').replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ').replace(/<figure/g, '<div').replace(/\/figure>/g, '\div>').replace(/<figcaption/g, '<div').replace(/\/figcaption>/g, '\div>');
            let nodes = htmlParser(data.content)
            nodes = this.nodesList(nodes)
            this.infoData = data
            this.infoData.content = nodes
      },
      nodesList(list){
        let arr = [...list]
        arr.forEach(item=>{
          if(item.children){
             this.nodesList(item.children)
          }else{
            if(item.name == 'img'){
              if(item.attrs.src.indexOf('http')<0){
                item.attrs.src = host+item.attrs.src
              }
            }
          }
        })
        return arr
      },
  		// 标记为已读
  		setreadAnnounce(){
  			readAnnounce({announceId:this.id})
  		}
  	}
  }
</script>

<style scoped lang="scss">
	.content{
		background: #fff;
		min-height: 100%;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		.title{
			font-size: 34rpx;
			color: #1A1A1A;
			text-align: center;
			font-weight: bold;
		}
		.date{
			font-size: 24rpx;
			color: #666666;
			text-align: center;
			margin-top: 30rpx;
			margin-bottom: 50rpx;
		}
		.main{
			font-size: 26rpx;
			color: #666666;
			line-height: 46rpx;
		}
	}
</style>
