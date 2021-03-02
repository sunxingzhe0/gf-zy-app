import tabConfig from './tab-config.js'
  export default {
    methods: {
      setTabBarIndex(index, type) {
        if (typeof this.$mp.page.getTabBar === 'function' &&
          this.$mp.page.getTabBar()) {
          this.$mp.page.getTabBar().setData({
            selected: index,
            list: type == 'doctor' ? tabConfig.doctorList : tabConfig.userList
          })
        }
      }
    }
  }
