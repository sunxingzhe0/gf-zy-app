function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function dateFtt(fmt, date) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
var dateUtils = {
  UNITS: {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000
  },
  humanize: function(milliseconds) {
    var humanize = '';
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },
  format: function(dateStr) {
    var date = this.parse(dateStr)
    var diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    var _format = function(number) {
      return (number < 10 ? ('0' + number) : number);
    };
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
      _format(date.getHours()) + ':' + _format(date.getMinutes());
  },
  parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  }
};

function noPassByMobile(str) {
  if (null != str && str != undefined) {
    var pat = /(\d{3})\d*(\d{4})/;
    return str.replace(pat, '$1****$2');
  } else {
    return "";
  }
}
function idcard(sId){
  // let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  // return reg.test(IdCardNO);
  const aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
  var iSum = 0;
  var info = "";
  if (!/^\d{17}(\d|X|x)$/i.test(sId)) return false;
  sId = sId.replace(/x$/i, "a");
  if (aCity[parseInt(sId.substr(0, 2))] == null) return false;
  var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, "/"));
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return false;
  for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  if (iSum % 11 != 1) return false;
  //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
  return true;
}
function GetAgeAndSexByIDNum (IdCardNO){

  let date = new Date();
  let yearfull = date.getFullYear();
  let ageNum = null
  if (IdCardNO.length == 18)//18位身份证号处理
  {
      let birthyear = IdCardNO.substring(6, 10);
      let age = yearfull - birthyear;
      ageNum= age;
  }
  if (IdCardNO.length == 15)//15位身份证号处理
  {
      let birthDay = "";
      birthDay = IdCardNO.substring(6, 12);
      birthDay = "19" + birthDay;
      birthDay = birthDay.substring(0, 4);// + "-" + birthDay.substring(4, 6) + "-" + birthDay.substring(6)
      let age = yearfull - birthDay;//年龄
      ageNum = age;
  }
  return ageNum
}
function noPassByIdcard(str) {
  if (null != str && str != undefined) {
    var pat = /^(.{4})(?:\w+)(.{3})$/;
    return str.replace(pat, "\$1**********\$2");
  } else {
    return "";
  }
}

function getUrlParam(name) { //封装方法
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}
let getTimeState = () => {
  // 获取当前时间
  let timeNow = new Date();
  // 获取当前小时
  let hours = timeNow.getHours();
  // 设置默认文字
  let text = ``;
  // 判断当前时间段
  if (hours >= 0 && hours <= 12) {
    text = `早上`;
  } else if (hours > 12 && hours <= 18) {
    text = `下午`;
  } else if (hours > 18 && hours <= 24) {
    text = `晚上`;
  }
  // 返回当前时间段对应的状态
  return text;
}

function changeTwoDecimal_f(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

function switchBizType(bizType) {
  var typeS = ""
  switch (bizType) {
    case 'CONSULT':
      typeS = '在线咨询'
      break
    case 'REPEAT_CLINIC':
      typeS = '在线复诊'
      break
    case 'CARRYON_PRESC':
      typeS = '慢病续方'
      break
  }
  return typeS

}

function switchBizWay(bizWay) {
  var typeS = ""
  switch (bizWay) {
    case 'GRAPHIC':
      typeS = '图文'
      break
    case 'VIDEO':
      typeS = '视频'
      break
    case 'PHONE':
      typeS = '电话'
      break
  }
  return typeS
}


module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  dateUtils: dateUtils,
  dateFtt: dateFtt,
  noPassByMobile: noPassByMobile,
  getUrlParam: getUrlParam,
  getTimeState: getTimeState,
  changeTwoDecimal_f: changeTwoDecimal_f,
  switchBizType: switchBizType,
  switchBizWay: switchBizWay,
  noPassByIdcard: noPassByIdcard,
  idcard:idcard,
  GetAgeAndSexByIDNum:GetAgeAndSexByIDNum
}
