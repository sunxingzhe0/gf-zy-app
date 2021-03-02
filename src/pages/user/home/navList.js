const navList = [

        {
          title:'在线咨询',
          url:'/pages-user/home/online/Consultation?type=CONSULT',
          img:require('@/assets/user/user_main_1.png'),
          isOpen:true,
          type:'link'
        },
        {
          title:'在线复诊',
          url:'/pages-user/home/online/Consultation?type=REPEAT_CLINIC',
          img:require('@/assets/user/user_main_2.png'),
          isOpen:true,
          type:'link'
        },
        {
          title:'慢病续方',
          url:'/pages-user/home/online/Consultation?type=CARRYON_PRESC',
          img:require('@/assets/user/user_main_3.png'),
          isOpen:true,
          type:'link'
        },
        {
          title:'预约挂号',
          url:'/pages-zy/appointmentDoc/deptList',
          img:require('@/assets/user/user_main_5.png'),
          isOpen:true,
          type:'link'
        },{
          title:'挂号记录',
          url:'/pages-zy/registerRecord/list',
          img:require('@/assets/user/user_main_9.png'),
          isOpen:false,
          type:'link'
        },{
          title:'智能候诊',
          url:'/pages-zy/outpatientPayment/smartWait',
          img:require('@/assets/user/user_main_8.png'),
          isOpen:false,
          type:'link'
        },
        {
          title:'门诊缴费',
          url:'/pages-zy/outpatientPayment/list',
          img:require('@/assets/user/user_main_6.png'),
          isOpen:true,
          type:'link'
        },
        {
          title:'报告查询',
          url:'/pages-zy/reportQuery/list',
          img:require('@/assets/user/user_main_7.png'),
          isOpen:true,
          type:'link'
        },
        {
          title:'住院缴费记录',
          url:'/pages-zy/inpatientServices/paymentRecord',
          img:require('@/assets/user/user_main_10.png'),
          isOpen:false,
          type:'link'
        },{
          title:'住院一日清单',
          url:'/pages-zy/inpatientServices/detailedList',
          img:require('@/assets/user/user_main_11.png'),
          isOpen:false,
          type:'link'
        },{
          title:'住院押金',
          url:'/pages-zy/inpatientServices/deposit',
          img:require('@/assets/user/user_main_12.png'),
          isOpen:false,
          type:'link'
        },{
          title:'体检预约',
          url:'/pages-zy/physical/appointment/list',
          img:require('@/assets/user/user_main_13.png'),
          isOpen:false,
          type:'link'
        },{
          title:'体检记录',
          url:'/pages-zy/physical/record/list',
          img:require('@/assets/user/user_main_14.png'),
          isOpen:false,
          type:'link'
        },{
          title:'体检缴费',
          url:'/pages-zy/physical/payment/list',
          img:require('@/assets/user/user_main_15.png'),
          isOpen:false,
          type:'link'
        },{
          title:'体检报告',
          url:'/pages-zy/physical/report/list',
          img:require('@/assets/user/user_main_16.png'),
          isOpen:false,
          type:'link'
        },{
          title:'体检须知',
          url:'/pages-zy/physical/notice',
          img:require('@/assets/user/user_main_17.png'),
          isOpen:false,
          type:'link'
        },{
          title:'来院导航',
          url:'',
          img:require('@/assets/user/user_main_18.png'),
          isOpen:false,
          type:'navigation'
        },{
          title:'院内导航',
          url:'/pages-zy/navigation/inHosNavigate',
          img:require('@/assets/user/user_main_19.png'),
          isOpen:false,
          type:'link'
        },{
          title:'健康资讯',
          url:'/pages-user/home/information/HospitalInformation',
          img:require('@/assets/user/user_main_4.png'),
          isOpen:true,
          type:'link'
        },
        // {
        //   title:'全部',
        //   url:'',
        //   img:require('@/assets/user/user_main_20.png'),
        //   isOpen:true,
        //   type:'all'
        // },
        // {
        //   title:'收起',
        //   url:'',
        //   img:require('@/assets/user/user_main_21.png'),
        //   isOpen:false,
        //   type:'close'
        // }
      ]
 export default navList
