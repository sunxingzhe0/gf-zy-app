var calendar = {
	debug: 2, // -1: disable; 0: all; N: show level N debug msg.

	//农历数据信息
	lunarInfo: [
		0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
		0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
		0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
		0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
		0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
		0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
		0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
		0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
		0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
		0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
		0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
		0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
		0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
		0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
		0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
	],

	//太阳历每月天数
	solarMonth: new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
	//天干
	Gan: new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"),
	//地支
	Zhi: new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"),
	//属相
	Animals: new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"),
	//节气
	solarTerm: new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑",
		"白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"),
	//Download by 
	sTermInfo: new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343,
		285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758),
	//
	nStr1: new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'),
	//
	nStr2: new Array('初', '十', '廿', '卅', '　'),
	//英语月份简写
	monthName: new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"),

	//国历节日 *表示节假日
	sFtv: new Array(
		"0101*元旦",
		"0214 情人节",
		"0308 妇女节",
		"0312 植树节",
		"0315 消费者权益日",
		"0321 世界森林日、世界儿歌日",
		"0322 世界水日",
		"0323 世界气象日",
		"0324 世界防治结核病日",

		"0401 愚人节",
		"0407 世界卫生日",
		"0422 世界地球日",

		"0501*劳动节",
		"0504 青年节",
		"0505 碘缺乏病防治日",
		"0508 世界红十字日",
		"0512 国际护士节",
		"0515 国际家庭日",
		"0517 世界电信日",
		"0518 国际博物馆日",
		"0520 全国学生营养日",
		"0523 国际牛奶日",
		"0531 世界无烟日",

		"0601 儿童节",
		"0605 世界环境日",
		"0606 全国爱眼日",
		"0616 防治荒漠化和干旱日",
		"0623 国际奥林匹克日",
		"0625 全国土地日",
		"0626 国际反毒品日",

		"0701 建党节 香港回归纪念 国际建筑日",
		"0707 中国人民抗日战争纪念日",
		"0711 世界人口日",

		"0801 建军节",
		"0808 父亲节",

		"0908 国际扫盲日",
		"0909 毛泽东逝世纪念",
		"0910 教师节",
		"0916 国际臭氧层保护日",
		"0920 国际爱牙日",
		"0927 世界旅游日",
		"0928 孔子诞辰",

		"1001*国庆节 国际音乐日",
		"1004 世界动物日",
		"1006 老人节",
		"1008 全国高血压日 世界视觉日",
		"1009 世界邮政日",
		"1015 国际盲人节",
		"1016 世界粮食日",
		"1017 世界消除贫困日",
		"1024 联合国日",

		"1108 中国记者日",
		"1109 消防宣传日",
		"1112 孙中山诞辰纪念",
		"1114 世界糖尿病日",
		"1117 国际大学生节",

		"1201 世界艾滋病日",
		"1203 世界残疾人日",
		"1209 世界足球日",
		"1220 澳门回归纪念",
		"1225 圣诞节",
		"1226 毛泽东诞辰纪念",
		"1229 国际生物多样性日"
	),

	//农历节日 *表示节假日
	lFtv: new Array(
		"0101*春节",
		"0115 元宵节",
		"0505 端午节",
		"0707 七夕情人节",
		"0715 中元节",
		"0815 中秋节",
		"0909 重阳节",
		"1208 腊八节",
		"1223 小年",
		"0100*除夕"
	),

	//按周计算 月周日
	wFtv: new Array(
		"0520 国际母亲节",
		"0530 全国助残日",
		"0630 国际父亲节",
		"0932 国际和平日",
		"0940 国际聋人节",
		"1013 国际减轻自然灾害日",
		"1011 国际住房日"
	),
	//输出bug
	log: function(level, msg) {
		if (this.debug == 0 || this.debug == level)
			//  if(window.console) {
			console.log("[DEBUG]" + msg);
		//}
	},
	//
	lYearDays: function(y) {
		var i, sum = 348;
		for (i = 0x8000; i > 0x8; i >>= 1) sum += (calendar.lunarInfo[y - 1900] & i) ? 1 : 0;
		return (sum + calendar.leapDays(y));
	},

	leapDays: function(y) {
		if (calendar.leapMonth(y)) return ((calendar.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
		else return (0);
	},

	leapMonth: function(y) {
		return (calendar.lunarInfo[y - 1900] & 0xf);
	},

	monthDays: function(y, m) {
		return ((calendar.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
	},

	Lunar: function(objDate) {
		var m = ""; // msg for log
		var i, leap = 0,
			temp = 0;
		var baseDate = new Date(1900, 0, 31);
		// changed by hmisty 2005/07/23
		//   var offset   = (objDate - baseDate)/86400000;
		var offset = Math.floor((objDate.getTime() + 2206425600000) / 86400000);
		m += "objDate=" + objDate.getTime() + ", new Date(1900,0,31)=" + baseDate.getTime();
		m += "offset=" + offset;

		this.dayCyl = offset + 40;
		this.monCyl = 14;

		for (i = 1900; i < 2050 && offset > 0; i++) {
			temp = calendar.lYearDays(i);
			offset -= temp;
			this.monCyl += 12;
		}

		if (offset < 0) {
			offset += temp;
			i--;
			this.monCyl -= 12;
		}

		this.year = i;
		this.yearCyl = i - 1864;

		leap = calendar.leapMonth(i);
		this.isLeap = false;

		for (i = 1; i < 13 && offset > 0; i++) {
			if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
				--i;
				this.isLeap = true;
				temp = calendar.leapDays(this.year);
			} else {
				temp = calendar.monthDays(this.year, i);
			}

			if (this.isLeap == true && i == (leap + 1)) this.isLeap = false;

			offset -= temp;
			if (this.isLeap == false) this.monCyl++;
		}

		if (offset == 0 && leap > 0 && i == leap + 1)
			if (this.isLeap) {
				this.isLeap = false;
			}
		else {
			this.isLeap = true;
			--i;
			--this.monCyl;
		}

		if (offset < 0) {
			offset += temp;
			--i;
			--this.monCyl;
		}

		this.month = i;
		this.day = offset + 1;

		m += "\noffset=" + offset + ", year=" + this.year + ", yearCyl=" + this.yearCyl + ", month=" + this.month +
			",\n monthCyl=" + this.monthCyl + ", day=" + this.day + ", dayCyl=" + this.dayCyl;
		// console.log(2, m);
	},

	solarDays: function(y, m) {
		if (m == 1)
			return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
		else
			return (this.solarMonth[m]);
	},

	cyclical: function(num) {
		return (this.Gan[num % 10] + this.Zhi[num % 12]);
	},

	calElement: function(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {

		this.isToday = false;
		this.sYear = sYear;
		this.sMonth = sMonth;
		this.sDay = sDay;
		this.week = week;
		this.lYear = lYear;
		this.lMonth = lMonth;
		this.lDay = lDay;
		this.isLeap = isLeap;
		this.cYear = cYear;
		this.cMonth = cMonth;
		this.cDay = cDay;

		this.color = '';

		this.lunarFestival = '';
		this.solarFestival = '';
		this.solarTerms = '';

	},

	sTerm: function(y, n) {
		//console.log(1,  "y="+y+" n="+n+" sTermInfo[n]="+calendar.sTermInfo[n]+" Date.UTC(1900,0,6,2,5)="+Date.UTC(1900,0,6,2,5)+" Date.UTC(1970,0,1,0,0)="+Date.UTC(1970,0,1,0,0) );
		// changed by hmisty 2005/07/23
		//   var offDate = new Date( ( 31556925974.7*(y-1900) + sTermInfo[n]*60000  ) + Date.UTC(1900,0,6,2,5) );
		var offDate = new Date((31556925974.7 * (y - 1900) + calendar.sTermInfo[n] * 60000) - 2208549300000);
		// Negative epoch (time_t) values are not officially supported by the
		// POSIX standards.  On some systems, they are known not to work.
		// -- perldoc Time::Local

		return (offDate.getUTCDate());
	},

	calendar: function(y, m) {
		// console.log(1,  "i am in calendar() now");
		var sDObj, lDObj, lY, lM, lD = 1,
			lL, lX = 0,
			tmp1, tmp2;
		var lDPOS = new Array(3);
		var n = 0;
		var firstLM = 0;

		sDObj = new Date(y, m, 1);

		this.length = calendar.solarDays(y, m);
		this.firstWeek = sDObj.getDay();

		//console.log(1,  "this.length: "+this.firstWeek);
		// console.log(1,  "begin loop for(var i=0;i<this.length;i++)");
		for (var i = 0; i < this.length; i++) {

			if (lD > lX) {
				sDObj = new Date(y, m, i + 1);
				lDObj = new calendar.Lunar(sDObj);
				lY = lDObj.year;
				lM = lDObj.month;
				lD = lDObj.day;
				lL = lDObj.isLeap;
				lX = lL ? calendar.leapDays(lY) : calendar.monthDays(lY, lM);

				if (n == 0) firstLM = lM;
				lDPOS[n++] = i - lD + 1;
			}

			//console.log(calendar.nStr1);
			this[i] = new calendar.calElement(y, m + 1, i + 1, calendar.nStr1[(i + this.firstWeek) % 7],
				lY, lM, lD++, lL,
				calendar.cyclical(lDObj.yearCyl), calendar.cyclical(lDObj.monCyl), calendar.cyclical(lDObj.dayCyl++));


			if ((i + this.firstWeek) % 7 == 0) this[i].color = '#ff5f07';
			if ((i + this.firstWeek) % 14 == 13) this[i].color = '#ff5f07';
		}
		//console.log(1,  "end loop for(var i=0;i<this.length;i++)");

		tmp1 = calendar.sTerm(y, m * 2) - 1;
		tmp2 = calendar.sTerm(y, m * 2 + 1) - 1;
		//console.log(1,  "m: "+m+" tmp1: "+tmp1+" "+calendar.solarTerm[m*2]+" tmp2: "+tmp2+" "+calendar.solarTerm[m*2+1]);
		this[tmp1].solarTerms = calendar.solarTerm[m * 2];
		this[tmp2].solarTerms = calendar.solarTerm[m * 2 + 1];
		if (m == 3) this[tmp1].color = '#ff5f07';

		//console.log(1,  "begin loop for(i in sFtv)");
		for (i in calendar.sFtv)
			if (calendar.sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
				if (Number(RegExp.$1) == (m + 1)) {
					this[Number(RegExp.$2) - 1].solarFestival += RegExp.$4 + ' ';
					if (RegExp.$3 == '*') this[Number(RegExp.$2) - 1].color = '#ff5f07';
				}

		//console.log(1,  "begin loop for(i in wFtv)");
		//console.log(calendar.wFtv[0]);
		for (i in calendar.wFtv)
			if (calendar.wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
				if (Number(RegExp.$1) == (m + 1)) {
					tmp1 = Number(RegExp.$2);
					tmp2 = Number(RegExp.$3);
					this[((this.firstWeek > tmp2) ? 7 : 0) + 7 * (tmp1 - 1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 +
						' ';
				}

		//console.log(1,  "begin loop for(i in lFtv)");
		//console.log(calendar.lFtv);
		for (i in calendar.lFtv)
			if (calendar.lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
				//console.log(1,  calendar.lFtv[i]);
				tmp1 = Number(RegExp.$1) - firstLM;
				if (tmp1 == -11) tmp1 = 1;
				if (tmp1 >= 0 && tmp1 < n) {
					tmp2 = lDPOS[tmp1] + Number(RegExp.$2) - 1;
					if (tmp2 >= 0 && tmp2 < this.length) {
						//console.log(1,  "tmp2 >= 0 && tmp2("+tmp2+")<this.length("+this.length+")");
						//console.log(1,  RegExp.$4);
						//console.log(1,  this[tmp2].lunarFestival);
						this[tmp2].lunarFestival += RegExp.$4 + ' ';
						// console.log(1,  RegExp.$3);
						if (RegExp.$3 == '*') this[tmp2].color = '#ff5f07';
					}
				}
			}

		//console.log(1,  "begin 黑色星期五");
		if ((this.firstWeek + 12) % 7 == 5)
			this[12].solarFestival += '黑色星期五 ';

		if (y == calendar.tY && m == calendar.tM) {
			//console.log(this[calendar.tD-1])
			if (this[calendar.tD - 1] != undefined) {
				this[calendar.tD - 1].isToday = true;
			}
		}
	},

	cDay: function(d) {
		var s;
		switch (d) {
			case 10:
				s = '初十';
				break;
			case 20:
				s = '二十';
				break;
			case 30:
				s = '三十';
				break;
			default:
				s = calendar.nStr2[Math.floor(d / 10)];
				s += calendar.nStr1[d % 10];
		}
		return (s);
	},

	cld: null,
	normalDateList: [],
	lunarDateList: [],
	showItemIndex: 0,
	drawCld: function(SY, SM) {
		//console.log(1,  "i am in drawCld() now");

		var i, sD, s, size;
		//console.log(1,  "begin to create calendar cld");
		calendar.cld = new calendar.calendar(SY, SM);
		//console.log(1,  "calendar cld creation finished");
		/*
		   if(SY>1874 && SY<1909) yDisplay = '光绪' + (((SY-1874)==1)?'元':SY-1874)
		   if(SY>1908 && SY<1912) yDisplay = '宣统' + (((SY-1908)==1)?'元':SY-1908)
		   if(SY>1911 && SY<1950) yDisplay = '民国' + (((SY-1911)==1)?'元':SY-1911)
		   if(SY>1949) yDisplay = '共和国' + (((SY-1949)==1)?'元':SY-1949)
		 */

		// console.log(1,  "innerHTML of gz is "+'&nbsp;&nbsp;农历'+ this.cyclical(SY-1900+36) + '年 &nbsp;&nbsp;【'+calendar.Animals[(SY-4)%12]+'】');
		//YMBG.innerHTML = "&nbsp;" + SY + "<BR>&nbsp;" + monthName[SM];
		let newsDate1 = [];
		let newsDate2 = [];
		//console.log(calendar.cld.firstWeek);
		for (i = 0; i < 42; i++) {

			//sObj = document.getElementById('sd'+ i);
			//lObj = document.getElementById('ld'+ i);

			//sObj.style.background = '';
			//lObj.style.background = '';
			let sObj = {};
			let lObj = {};
			sD = i - calendar.cld.firstWeek;

			if (sD > -1 && sD < calendar.cld.length) {
				sObj.text = sD + 1;
				sObj.isToday = calendar.cld[sD].isToday;
				lObj.days = sD + 1;
				lObj.isToday = calendar.cld[sD].isToday;
				//item.text = sD+1;
				if (calendar.cld[sD].isToday) {
					//设置今天的背景色
					sObj.background = '#defdfd';
					lObj.background = '#91dae3';
				}
				sObj.color = calendar.cld[sD].color;

				if (calendar.cld[sD].lDay == 1)
					lObj.text = (calendar.cld[sD].isLeap ? '闰' : '') +
					calendar.cld[sD].lMonth + '月' +
					(calendar.monthDays(calendar.cld[sD].lYear, calendar.cld[sD].lMonth) == 29 ? '小' : '大');
				else
					lObj.text = calendar.cDay(calendar.cld[sD].lDay);

				s = calendar.cld[sD].lunarFestival;
				if (s.length > 0) {
					//农历节日名称大于5个字截去
					//if(s.length>5) s = s.substr(0, 3)+'…';
					if (s.length > 7) s = s.substr(0, 5) + '…';
					//s = s.fontcolor('#ff5f07');
				} else {
					s = calendar.cld[sD].solarFestival;
					if (s.length > 0) {
						//阳历节日名称截去
						//size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;			
						size = (s.charCodeAt(0) > 0 && s.charCodeAt(0) < 128) ? 9 : 4;
						if (s.length > size + 1) s = s.substr(0, size - 1) + '…';
						//s = s.fontcolor('#0168ea');
					} else {
						s = calendar.cld[sD].solarTerms;
						//if(s.length>0) s = s.fontcolor('#44d7cf');
					}
				}
				if (s.length > 0) lObj.text = s;

			} else {
				sObj.text = ' ';
				lObj.text = ' ';
			}
			newsDate1.push(sObj);
			newsDate2.push(lObj);
		}
		let result1 = [];
		let result2 = [];
		for (var i = 0; i < newsDate1.length; i += 7) {
			result1.push(newsDate1.slice(i, i + 7));
		}
		for (var i = 0; i < newsDate2.length; i += 7) {
			result2.push(newsDate2.slice(i, i + 7));
		}
		calendar.normalDateList = delNull(result1);
		calendar.lunarDateList = delNull(result2);
		function delNull(arr){
			for (let i =0;i<arr.length;i++) {
				if(arr[i][0].text==" " && arr[i][6].text==" "){
					arr.splice(i,1);
				}
			}
			return arr;
		}
		for (var i = 0; i < result1.length; i++) {
			for (var j = 0; j < result1[i].length; j++) {

				if (result1[i][j].text == calendar.tD) {
					calendar.showItemIndex = i;
				}
			}
		}
		calendar.mOvr(this.tD);
	},


	changeCld: function() {
		this.drawCld(this.tY, this.tM);
	},

	pushBtm: function(K) {
		var day = new Date(this.tY, this.tM + 1, 0); //最后一个参数为0,意为获取2018年10月一共多少天
		var rday = new Date(this.tY, this.tM, 0); //最后一个参数为0,意为获取2018年10月一共多少天
		var bday = new Date(this.tY, this.tM + 2, 0); //最后一个参数为0,意为获取2018年10月一共多少天
		let dayNum = day.getDate();
		let rdayNum = rday.getDate();
		let bdayNum = bday.getDate();
		switch (K) {
			case 'YU':
				if (this.tY > 1901)
					this.tY--;
				break;
			case 'YD':
				if (this.tY < 2049)
					this.tY++;
				break;
			case 'MU':
				if (this.tM > 0) {
					this.tM--;
				} else {
					this.tM = 11;
					if (this.tY > 1901)
						this.tY--;
				}
				break;
			case 'MD':
			if(this.tD>bdayNum){
				this.tD = bdayNum;
			}
				if (this.tM < 11) {
					this.tM++;
				} else {
					this.tM = 0;
					if (this.tY < 2049)
						this.tY++;
				}
				break;
			case 'WD':
				
				
				//console.log(dayNum)
				if (this.tD + 7 < dayNum + 1) {
					this.tD += 7;
				} else {
					//console.log(this.ifNextDay(1));
					if(this.ifNextDay(1)){
						this.tD = dayNum;
					}else{
					this.tD = 1;
					if (this.tM < 11) {
						this.tM++;
					} else {
						this.tM = 0;
						if (this.tY < 2049)
							this.tY++;
					}	
					}
					
				}
				break;
			case 'WU':
				if (this.tD - 7 > 0) {
					this.tD -= 7;
				} else {
					if(this.ifNextDay(2)){
						this.tD = 1;
					}else{
					this.tD = rdayNum;
						if (this.tM > 0) {
							this.tM--;
						} else {
							this.tM = 11;
							if (this.tY > 1901)
								this.tY--;
						}
						
						
					}
					
				}
				break;
			default:
				this.getDay();
		}
		this.changeCld();
	},
	ifNextDay:function(type){
		let flag = false;
		if(type==1){
			if(calendar.showItemIndex!=calendar.normalDateList.length){
			let list = calendar.normalDateList[calendar.showItemIndex+1];
					if(list==undefined){
						flag = false;
					}else{
						if(list[0].text!=" "){
							flag = true;
						}
					}
			}	
		}else{
			if(calendar.showItemIndex==1){
				let list = calendar.normalDateList[0];
						if(list[6].text!=" "){
							//console.log(list[0].text)
							flag = true;
						}
			}
			}
		return flag;
	},
	Today: new Date(),
	tY: null,
	tM: null,
	tD: null,
	getDay: function() {

		this.tY = this.Today.getFullYear();
		this.tM = this.Today.getMonth();
		this.tD = this.Today.getDate();
	},

	width: "130", //detail层宽度
	offsetx: 2,
	offsety: 16,

	x: 0,
	y: 0,
	show: 0,
	sw: 0,
	cnt: 0,

	dStyle: {},
	//document.onmousemove = mEvn;
	festival: '',
	datedetail: '',
	//用detail层显示详细信息
	mOvr: function(v) {

		var festival = '';
		var datedetail = '';
		var d = v - 1;
		//var sObj = document.getElementById('sd'+ v);
		//alert(v);
		//sObj.style.cursor = 'move';
		// console.log(calendar.cld[d])
		// console.log(d)
		if (calendar.cld[d] == undefined) {
			return;
		}
		if (calendar.cld[d].solarTerms == '' &&
			calendar.cld[d].solarFestival == '' &&
			calendar.cld[d].lunarFestival == '') {
			festival = "";
		} else {

			festival = calendar.cld[d].solarTerms + ' ' + calendar.cld[d].solarFestival + ' ' + calendar.cld[d].lunarFestival;
			//festival.style.display = "block";
		}
		datedetail = calendar.cld[d].sYear + ' 年 ' + calendar.cld[d].sMonth +
			' 月 ' + calendar.cld[d].sDay + ' 日 星期' + calendar.cld[d].week + ' ' +
			'农历' + (calendar.cld[d].isLeap ? '闰 ' : ' ') +
			calendar.cld[d].lMonth + ' 月 ' + calendar.cld[d].lDay + ' 日 ' +
			calendar.cld[d].cYear + '年 ' + calendar.cld[d].cMonth +
			'月 ' + calendar.cld[d].cDay + '日';

		if (calendar.show == 0) {
			calendar.dStyle.left = (calendar.x + calendar.offsetx - (calendar.width / 2)) + "px";
			calendar.dStyle.top = (calendar.y + calendar.offsety) + "px";
			calendar.dStyle.visibility = "visible";
			calendar.show = 1;
		}
		calendar.festival = festival;
		calendar.datedetail = datedetail;

	},

	mOut: function() {
		if (cnt >= 1) {
			sw = 0
		}
		if (sw == 0) {
			calendar.show = 0;
			calendar.dStyle.visibility = "hidden";
		} else cnt++;
	},

	//获取鼠标坐标
	mEvn: function(e) {
		if (!show) return;
		if (window.event) {
			x = event.x;
			y = event.y;
			if (document.body.scrollLeft) {
				x += document.body.scrollLeft;
				y += document.body.scrollTop;
			}
			// changed by hmisty 2005/07/23
			dStyle.left = (x + offsetx - (width / 2)) + "px";
			dStyle.top = (y + offsety) + "px";
		} else {
			dStyle.left = (e.pageX + offsetx - (width / 2)) + "px";
			dStyle.top = (e.pageY + offsety) + "px";
		}
	},

	changeTZ: function() {
		document.getElementById("city").innerHTML = document.getElementById("tz").value.substr(6);
		setCookie("TZ", document.getElementById("tz").selectedIndex);
	},

	tick: function() {
		var today;
		today = new Date();
		document.getElementById("clock").innerHTML = today.getFullYear() + "年" +
			today.getMonth() + "月" + today.getDay() + "日" + today.getTime();
		/*
		   document.getElementById("clock").innerHTML = today.toLocaleString().replace(/(年|月)/g, "/").replace(/日/, ""); 
		   document.getElementById("clock").innerHTML = TimeAdd(today.toGMTString(), document.getElementById("tz").value);
		 */
		//alert(document.getElementById("clock").innerHTML);
		window.setTimeout("tick()", 1000);
	},

	setCookie: function(name, value) {
		var today = new Date()
		var expires = new Date()
		expires.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 365)
		document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString()
	},

	getCookie: function(Name) {
		var search = Name + "=";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) end = document.cookie.length;
				return unescape(document.cookie.substring(offset, end));
			} else return "";
		}
	},

	fillSelect: function() {
		syd = document.getElementById("sy");
		syd.innerHTML = "";
		for (i = 1900; i < 2050; i++) {
			ins = document.createElement("OPTION");
			ins.innerHTML = i;
			syd.appendChild(ins);
		}
		smd = document.getElementById("sm");
		smd.innerHTML = "";
		for (i = 1; i < 13; i++) {
			ins = document.createElement("OPTION");
			ins.innerHTML = i;
			smd.appendChild(ins);
		}
	},


	//界面初始化
	initial: function() {
		this.getDay();
		this.drawCld(this.tY, this.tM);

	},

	TimeAdd: function(UTC, T) {
		var PlusMinus, DST, y;
		//alert(T);
		alert(UTC);
		if (T.substr(0, 1) == "-") {
			PlusMinus = -1;
		} else {
			PlusMinus = 1;
		}
		//UTC = UTC.substr(1
	},
	setToday(td) {
		calendar.tD = td;
		calendar.drawCld(this.tY, this.tM);
	}
}
export default calendar
