const navList = [
  {
    title: '掌上医院',
    imgurl: require('@/assets/zy-tab-icon.png'),
    iconList: [
      {
        title: '预约挂号',
        url: '/pages-zy/appointmentDoc/deptList',
        img: require('@/assets/user/user_main_5.png'),
        isOpen: true,
        type: 'link',
      },
      {
        title: '挂号记录',
        url: '/pages-zy/registerRecord/list',
        img: require('@/assets/user/user_main_9.png'),
        isOpen: false,
        type: 'link',
      },
      // {
      //   title: '智能导诊',
      //   url: '/pages-user/guidance/guidance',
      //   img: require('@/assets/user/user_main_23.png'),
      //   isOpen: false,
      //   type: 'link',
      // },
      {
        title: '智能候诊',
        url: '/pages-zy/outpatientPayment/smartWait',
        img: require('@/assets/user/user_main_8.png'),
        isOpen: false,
        type: 'link',
      },
      {
        title: '门诊缴费',
        url: `/pages-zy/outpatientPayment/list`,
        img: require('@/assets/user/user_main_6.png'),
        isOpen: true,
        type: 'link',
      },
      {
        title: '报告查询',
        url: '/pages-zy/reportQuery/list',
        img: require('@/assets/user/user_main_7.png'),
        isOpen: true,
        type: 'link',
      },
      {
        title: '住院缴费记录',
        url: '/pages-zy/inpatientServices/paymentRecord',
        img: require('@/assets/user/user_main_10.png'),
        isOpen: false,
        type: 'link',
      },
      {
        title: '住院一日清单',
        url: '/pages-zy/inpatientServices/detailedList',
        img: require('@/assets/user/user_main_11.png'),
        isOpen: false,
        type: 'link',
      },
      {
        title: '住院押金',
        url: '/pages-zy/inpatientServices/deposit',
        img: require('@/assets/user/user_main_12.png'),
        isOpen: false,
        type: 'link',
      },
      // {
      //   title:'体检预约',
      //   url:'/pages-zy/physical/appointment/list',
      //   img:require('@/assets/user/user_main_13.png'),
      //   isOpen:false,
      //   type:'link'
      // },{
      //   title:'体检记录',
      //   url:'/pages-zy/physical/record/list',
      //   img:require('@/assets/user/user_main_14.png'),
      //   isOpen:false,
      //   type:'link'
      // },{
      //   title:'体检缴费',
      //   url:'/pages-zy/physical/payment/list',
      //   img:require('@/assets/user/user_main_15.png'),
      //   isOpen:false,
      //   type:'link'
      // },{
      //   title:'体检报告',
      //   url:'/pages-zy/physical/report/list',
      //   img:require('@/assets/user/user_main_16.png'),
      //   isOpen:false,
      //   type:'link'
      // },{
      //   title:'体检须知',
      //   url:'/pages-zy/physical/notice',
      //   img:require('@/assets/user/user_main_17.png'),
      //   isOpen:false,
      //   type:'link'
      // },
      {
        title: '来院导航',
        url: '',
        img: require('@/assets/user/user_main_18.png'),
        isOpen: false,
        type: 'navigation',
      },
      {
        title: '院内导航(金)',
        url: '/pages-zy/navigation/inHosNavigate',
        img: require('@/assets/user/user_main_19.png'),
        isOpen: false,
        type: 'link',
      },
      {
        title: '核酸检测',
        url: '',
        img: require('@/assets/user/user_main_24.png'),
        isOpen: false,
        type: 'nucleicAcid',
      },
      // {
      //   title: '核酸检测记录',
      //   url: '/pages-user/nucleicAcidAppointment/record/index',
      //   img: require('@/assets/user/user_main_25.png'),
      //   isOpen: false,
      //   type: 'link',
      // },
      {
        title: '就诊攻略',
        url: '/pages-zy/Introduction/index',
        img: require('@/assets/user/Introduction.png'),
        isOpen: false,
        type: 'link',
      },
      // {
      //   title: '预约签到',
      //   url: '/pages-zy/sgin/index',
      //   img: require('@/assets/user/sgin-99.png'),
      //   isOpen: false,
      //   type: 'link',
      // },
      {
        title: '科室简介',
        url: '/pages-zy/deptList/index',
        img: require('@/assets/user/user_main_14.png'),
        isOpen: false,
        type: 'link',
      },
      {
        title: '流调表',
        url: '/pages-user/nucleicAcidAppointment/flowform/index?isform=2',
        img: require('@/assets/user/user_main_44.png'),
        isOpen: false,
        type: 'link',
      },
    ],
  },
  {
    title: '便民服务',
    imgurl: require('@/assets/user-tab-icon.png'),
    iconList: [
      // {
      //   title: '报告解读',
      //   url: '/pages-user/home/online/Consultation?type=REPORT_READ',
      //   img: require('@/assets/user/user_main_22.png'),
      //   isOpen: true,
      //   type: 'link',
      // },
      // {
      //   title: '医技预约',
      //   url: '/pages-user/appointment/list',
      //   img: require('@/assets/user/icon_appointment.png'),
      //   isOpen: true,
      //   type: 'link',
      // },
      {
        title: '用药提醒',
        url: '/pages-user/medicationReminder/list',
        img: require('@/assets/user/icon_medicationReminder.png'),
        isOpen: true,
        type: 'link',
      },
      {
        title: '健康资讯',
        url: '/pages-user/home/information/HospitalInformation',
        img: require('@/assets/user/user_main_4.png'),
        isOpen: true,
        type: 'link',
      },
      {
        title: '在线心理援助',
        url: '/pages-user/home/online/Consultation?type=CONSULT&status=video',
        img: require('@/assets/user/user_main_2.png'),
        // disabled: true,
        isOpen: true,
        type: 'link',
      },
      {
        title: '用药咨询 ',
        url: '/pages-user/home/online/Consultation?type=CONSULT&status=text',
        img: require('@/assets/user/user_main_1.png'),
        // disabled: true,
        isOpen: true,
        type: 'link',
      },
      {
        title: '在线复诊',
        url: '/pages-user/home/online/Consultation?type=REPEAT_CLINIC',
        img: require('@/assets/user/user_main_3.png'),
        isOpen: true,
        // disabled: true,
        type: 'link',
      },
      // {
      //   title: '慢病续方',
      //   url: '/pages-user/home/online/Consultation?type=CARRYON_PRESC',
      //   img: require('@/assets/user/user_main_3.png'),
      //   isOpen: true,
      //   // disabled: true,
      //   type: 'link',
      // },
      // {
      //   title: '就诊记录',
      //   url: '/pages-cdr/allRecords/index',
      //   img: require('@/assets/user/user_main_9.png'),
      //   isOpen: true,
      //   type: 'link',
      // },
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
    ],
  },
  // {
  //   title: '健康管理',
  //   imgurl: require('@/assets/sf-tab-icon.png'),
  //   iconList: [
  //     {
  //       title: '风险评估',
  //       url: '/pages-sf/src/riskAssess/index',
  //       img: require('@/assets/user/user_main_26.png'),
  //       isOpen: true,
  //       type: 'link',
  //     },
  //     {
  //       title: '我的随访',
  //       url: '/pages-sf/src/myFollow/index',
  //       img: require('@/assets/user/user_main_27.png'),
  //       isOpen: true,
  //       type: 'link',
  //     },
  //     {
  //       title: '健康宣教',
  //       url: '/pages-sf/src/healthEducation/index',
  //       img: require('@/assets/user/user_main_28.png'),
  //       isOpen: true,
  //       type: 'link',
  //     },
  //     {
  //       title: '健康监测',
  //       url: '/pages-sf/src/deviceControl/index',
  //       img: require('@/assets/user/user_main_29.png'),
  //       isOpen: true,
  //       type: 'link',
  //     },
  //     /*  {
  //       title: '咨询',
  //       url: '/pages-sf/src/ownAnswer/index',
  //       img: require('@/assets/user/user_main_30.png'),
  //       isOpen: true,
  //       type: 'link',
  //     }, */
  //     {
  //       title: '随访通知',
  //       url: '/pages-sf/src/followNotice/index',
  //       img: require('@/assets/user/user_main_31.png'),
  //       isOpen: true,
  //       type: 'link',
  //     },
  //     {
  //       title: '满意度调查',
  //       url: '/pages-sf/src/satisfaction/index',
  //       img: require('@/assets/user/user_main_32.png'),
  //       isOpen: true,
  //       type: 'link',
  //     },
  //   ],
  // },
  // {
  //   title: '报告解读',
  //   url: '/pages-user/home/online/Consultation?type=REPORT_READ',
  //   img: require('@/assets/user/user_main_22.png'),
  //   isOpen: true,
  //   type: 'link',
  // },
  // {
  //   title:'体检预约',
  //   url:'/pages-zy/physical/appointment/list',
  //   img:require('@/assets/user/user_main_13.png'),
  //   isOpen:false,
  //   type:'link'
  // },{
  //   title:'体检记录',
  //   url:'/pages-zy/physical/record/list',
  //   img:require('@/assets/user/user_main_14.png'),
  //   isOpen:false,
  //   type:'link'
  // },{
  //   title:'体检缴费',
  //   url:'/pages-zy/physical/payment/list',
  //   img:require('@/assets/user/user_main_15.png'),
  //   isOpen:false,
  //   type:'link'
  // },{
  //   title:'体检报告',
  //   url:'/pages-zy/physical/report/list',
  //   img:require('@/assets/user/user_main_16.png'),
  //   isOpen:false,
  //   type:'link'
  // },{
  //   title:'体检须知',
  //   url:'/pages-zy/physical/notice',
  //   img:require('@/assets/user/user_main_17.png'),
  //   isOpen:false,
  //   type:'link'
  // },
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
