import { activityDetail } from '../../api/myActive'
export const mixins = {
  props: ['signId'],
  data() {
    return {
      againIntoPage: false,
      optionHasToken: false,
      hcOrderId: '',
      orderId: '', //订单id
      tradeId: '',
      tradeType: '',
      payFee: '',
      userId: uni.getStorageSync('userId'),
      popData: {
        title: '',
        index: '',
        value: [],
        option: [],
      },
      detail: {},
      patients: [],
      memberInfo: {},
      formData: {
        id: '',
        name: '',
        code: '',
        phone: '',
        orderId: '',
        signTime: '',
        memberId: '',
        activityId: '',
        relList: [],
      },
      relList: [],
    }
  },
  created() {
    if (this.signId) {
      this.activityDetail(this.signId)
    }
  },
  methods: {
    async activityDetail(activityId, token) {
      //options带token表示pc端访问此页面
      const params = token ? { activityId, token } : { activityId }
      this.detail = await activityDetail(params)
      this.relList = this.detail.signRelList.map(item => {
        return {
          ...item,
          optionValue: item.optionValue ? JSON.parse(item.optionValue) : null,
        }
      })
    },
  },
}
