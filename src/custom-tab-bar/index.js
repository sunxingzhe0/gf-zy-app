Component({
  data: {
    selected: null,
    color: "#999999",
    selectedColor: "#0AB2C1",
    list: [],
    userList: [{
      "pagePath": "/pages/user/home/home",
      "iconPath": "/static/user_main.png",
      "selectedIconPath": "/static/user_main_s.png",
      "text": "首页"
    }, {
      "pagePath": "/pages/user/room/room",
      "iconPath": "/static/user_consultation.png",
      "selectedIconPath": "/static/user_consultation_s.png",
      "text": "诊室"
    }, {
      "pagePath": "/pages/user/me/me",
      "iconPath": "/static/user_mine.png",
      "selectedIconPath": "/static/user_mine_s.png",
      "text": "我的"
    }],
    doctorList: [{
      "pagePath": "/pages/doctor/home/home",
      "iconPath": "/static/user_main.png",
      "selectedIconPath": "/static/user_main_s.png",
      "text": "首页"
    }, {
      "pagePath": "/pages/doctor/user/user",
      "iconPath": "/static/user_mine.png",
      "selectedIconPath": "/static/user_mine_s.png",
      "text": "我的"
    }]
  },
  attached() {
    // const role = wx.getStorageSync('role')
    // let list = this.data.userList

    // if (role == 'doctor') {
    //   list = this.data.doctorList
    // }
    // this.setData({
    //   list:[]
    // })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    }
  }
})
