export default [
  {
    title: '1.请选择您的性别：',
    value: null,
    key: 'sex',
    options: [
      { lable: '男', value: 0 },
      { lable: '女', value: 1 },
    ],
  },
  {
    title: '2.您的年龄多大了？',
    value: null,
    key: 'age',
  },
  {
    title: '3.您的身高是多少厘米？',
    value: null,
    key: 'height',
  },
  {
    title: '4.您的体重是多少公斤？：',
    value: null,
    key: 'weight',
  },
  {
    title: '5.您的腰围是多少厘米？在肋骨下方测量（通常在肚脐部位的高度）',
    value: null,
    key: 'waist',
  },
  {
    title:
      '6.您是否经常在工作和/或闲暇时间进行至少30分钟 的日常体力活动？（包括正常的日常活动）',
    value: null,
    key: 'activity',
    options: [
      { lable: '是', value: 0 },
      { lable: '否', value: 1 },
    ],
  },
  {
    title: '7.您的心脏收缩压是多少mmHg？          ',
    value: null,
    key: 'heartRate',
  },
  {
    title: '8.您或您的直系亲属(父母、同胞、子女)是否被诊断 患有糖尿病？ ）',
    value: null,
    key: 'illness',
    noBorder: true,
    options: [
      { lable: '是', value: 0 },
      { lable: '否', value: 1 },
    ],
  },
]
