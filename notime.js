'use strict';

var ut = require('./util');

var ntstrts = ''; /* 时间源,如果它被设置了值的话，将会使用它作为源，每1s更新一次 */
var ntgmt = '480'; /* 当前时区与GMT时区偏移的分钟数  */

module.exports = {
	getnowts:getnowts,   
	resetnow:resetnow,
	// timeplus:timeplus,

	strtoobjts:strtoobjts,

	msconv:msconv,
	msconvto:msconvto,
	rolltoms:rolltoms,
	util:ut
};


/*
getnowts: 用于获取当前时间
resetnow: 用于重置getnowts方法使用的当前的时间来源，getnowts的默认时间来源是new Date();

timeplus: 处理一段时间的计算 strts + 一定毫秒数 返回strts对象
timeminus: 处理一段时间的计算 strts - 一定毫秒数 返回strts对象
timespace: 处理一段时间的计算 strts与strts 返回它们之间相距的时间距离毫秒数
timeconv:  处理一段时间的计算 将一定毫秒数 转化为多少年多少月..几时几分几秒 返回 一个对象

getobjts: 通用时间模型之间的转换 strts -> objts
*/

/* 
获取当前的时间
不接收参数，返回3种通用时间模型的json对象
{
	strts:'...',
	numts:...,
	objts:{...}
}
*/
function getnowts() {
	var tp1 = getnow();
	var tp2;
	if(!tp1){
		tp1 = new Date().getTime().toString();
	}
	var md = tp1;
	var res = {};
	res.strts = md;
	res.numts = parseInt(md);

	//格式化时处理时区偏移
	if(ntgmt){
		var negaflag = false;
		if( ut.bnisnega(ntgmt) ){
			ntgmt = ntgmt.slice(1);
			negaflag = true;
		}
		tp2 = rolltoms({mi:ntgmt});
		if(negaflag){ tp2 = '-'+tp2; }
		tp2 = ut.bnplus(md,tp2);
	}
	else{ tp2 = md; }
	var obj = strtoobjts(tp2);
	res.objts = obj;

	return res;
}


function strtoobjts(ts) {  
	var res = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
	var obj = msconvto(ts,'dd'); 
	var cnt = obj.cnt;
	var ret = obj.ret;
	var tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8,tp9,tp10,tp11,tp12;
	//不足1天
	if(cnt == '0'){
		res.yy = '1970';
		res.mm = '01';
		res.dd = '01';
		
		tp11 = shifenmiao(ret);
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}
	//小于1年 大小月
	if( ut.bnabscomp(cnt,'366')=='no' ){
		tp1 = daxiaoyueri(cnt,false,false);
		res.yy = '1970';
		res.mm = tp1.mm;
		res.dd = tp1.dd;
		
		tp11 = shifenmiao(ret);
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}

	//大于1年 四年一闰年 2月29日 第一次闰年在1972年
	//每3500年再减一日 第一次减日在4500年
	if( ut.bnabscomp(cnt,'365')=='yes' ){ 
		var flag = true;
		var yyms = '31536000000'; //加上的1年的毫秒数,有可能闰月
		tp1 = '0'; //累加的年份毫秒数
		tp2 = '0'; //累加的年数
		tp3 = '1970';//当前的年份
		tp4 = '0'; //每四年重置一次,检查是否闰年
		while(flag){
			//每次进来重置为365天 //重置闰年 减日标识
			yyms = '31536000000';
			tp9 = false;//是否闰年
			tp10 = false;//是否减日

			//非整百数每四年闰一天
			if( iszhenbai(tp3)=='no' ){ 
				if( tp4=='4' ){
					yyms = '31622400000';
					tp9 = true;
				}
			}
			//整百数每400年闰1天
			if( iszhenbai(tp3)=='yes' ){ 
				if( ut.bnmod(tp3,'400')=='0' ){
					yyms = '31622400000'; 
					tp9 = true;
				}
			}			
			//1972年闰1天
			if(tp2=='2'){
				yyms = '31622400000'; 
				tp4 ='0';
				tp9 = true;
			}
			//3500年减1日
			if( ut.bnabscomp(tp2,'3499')=='yes' ){
				if( ut.bnmod(tp1,'3500') == '0' ){
					yyms = ut.bnminus(yyms,'86400000');
					tp10 = true;
				}
			}
			tp8 = tp1;// 最后一次加前的整数年
			tp1 = ut.bnplus(tp1,yyms);

			if( ut.bnabscomp(tp1, ut.bnplus(ts,'1') ) =='no' ){
				tp2 = ut.bnplus(tp2,'1');
				tp3 = ut.bnplus(tp3,'1');
				tp4 = ut.bnplus(tp4,'1'); 
				if(tp4== '5'){
					tp4 = '0';
				} 
			}
			else{
				flag = false;
			}
		}

		res.yy = tp3; // 年 
		tp5 = ut.bnminus(ts,tp8);// 不足1年的毫秒数
		if(tp5 == '0'){
			res.mm = '12';
			res.dd = '31';
		}
		else{
			tp6 = msconvto(tp5,'dd'); //不足1年的部分有多少天
			tp7 = daxiaoyueri(tp6.cnt,tp9,tp10);
			res.mm = tp7.mm;
			res.dd = tp7.dd;

			tp11 = shifenmiao(tp6.ret);
			res.hh = tp11.hh;
			res.mi = tp11.mi;
			res.ss = tp11.ss;
			res.ms = tp11.ms;
		}
		
	}

	// 判断是否整百
	function iszhenbai(str) {
		if(str.length<3){
			return 'no';
		}
		if( str.slice(-2) == '00' ){
			return 'yes';
		}
		return 'no';
	}

	// 处理时分秒
	function shifenmiao(tss) {
		var r = {hh:'00',mi:'00',ss:'00',ms:'000'};
		var tp1,tp2,tp3,tp4,tp5;
		if(tss=='0'){
			return r;
		}
		tp1 = msconvto(tss,'hh');
		r.hh = tp1.cnt;
		if(r.hh.length<2){
			r.hh = '0'+r.hh;
		}
		tp2 = msconvto(tp1.ret,'mi');
		r.mi = tp2.cnt;
		if(r.mi.length<2){
			r.mi = '0'+r.mi;
		}
		tp3 = msconvto(tp2.ret,'ss');
		r.ss = tp3.cnt;
		if(r.ss.length<2){
			r.ss = '0'+r.ss;
		}
		r.ms = tp3.ret;
		if(r.ms.length==1){
			r.ms = '00'+r.ms;
		}
		if(r.ms.length==2){
			r.ms = '0'+r.ms;
		}
		return r;
	}

	// 处理月日
	function daxiaoyueri(day,isleapyear,isjianri) {
		var d = parseInt(day);
		var r = {mm:'00',dd:'00'};
		//每四年2月闰一日 28+1
		//每3500年2月减1日 28-1
		var leap = 0;
		if(isleapyear){ ++leap; }
		if(isjianri){ --leap; } 

		// 1月
		if(d<32){
			r.mm = '01';
			if(day.length<2){ day = '0'+day; }
			r.dd = day.toString();
		}
		// 2月
		if( (d>31)&&(d<(60+leap)) ){
			r.mm = '02';
			r.dd = (d-31).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 3月
		if( (d>(59+leap)) && (d<(91+leap)) ){
			r.mm = '03';
			r.dd = (d-(59+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 4月
		if( (d>(90+leap)) && (d<(121+leap)) ){
			r.mm = '04';
			r.dd = (d-(90+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 5月
		if( (d>(120+leap)) && (d<(152+leap)) ){
			r.mm = '05';
			r.dd = (d-(120+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 6月
		if( (d>(151+leap)) && (d<(182+leap)) ){
			r.mm = '06';
			r.dd = (d-(151+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 7月
		if( (d>(181+leap)) && (d<(213+leap)) ){
			r.mm = '07';
			r.dd = (d-(181+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 8月
		if( (d>(212+leap)) && (d<(244+leap)) ){
			r.mm = '08';
			r.dd = (d-(212+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 9月
		if( (d>(243+leap)) && (d<(274+leap)) ){
			r.mm = '09';
			r.dd = (d-(243+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 10月
		if( (d>(273+leap)) && (d<(305+leap)) ){
			r.mm = '10';
			r.dd = (d-(273+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 11月
		if( (d>(304+leap)) && (d<(335+leap)) ){
			r.mm = '11';
			r.dd = (d-(304+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 12月
		if( (d>(334+leap)) && (d<(366+leap)) ){
			r.mm = '12';
			r.dd = (d-(334+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		return r;
	}
	return res;
}



// 按每月30天 每年365天计 的多少年多少月
function msconv(ts) {
    var res = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
    var tsnega = false;
    var tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8,tp9,tp10,tp11,tp12;
    if( ut.bnisnega(ts) ){
    	ts = ts.slice(1);
    	tsnega = true;
    } 
    // 小于1秒
    if( ut.bnabscomp(ts,'1000') == 'no' ){
    	res.ms = ts;
    }
    // 小于1分
    if( (ut.bnabscomp(ts,'60000') == 'no') && (ut.bnabscomp(ts,'999')=='yes' ) ){
        res.ss = ut.bndivis(ts,'1000');
        res.ms = ut.bnmod(ts,'1000');
        
    }
    // 小于1小时
    if( (ut.bnabscomp(ts,'3600000')=='no') && (ut.bnabscomp(ts,'59999')=='yes') ){
    	res.mi = ut.bndivis(ts,'60000');
    	tp1 = ut.bnmod(ts,'60000'); //不足1分钟的部分
    	if( ut.bnabscomp(tp1,'999') =='yes'){
    		res.ss = ut.bndivis( tp1,'1000');
    	}
    	if( tp1!='0' ){
    		if( ut.bnabscomp(tp1,'999')=='yes'){
    			res.ms = ut.bnmod( tp1,'1000');
    		}
    		else{
    			res.ms = tp1;
    		}
    	}
    }
    // 小于1天
    if( (ut.bnabscomp(ts,'86400000')=='no') && (ut.bnabscomp(ts,'3599999')=='yes') ){
    	res.hh = ut.bndivis(ts,'3600000');
    	tp1 = ut.bnmod(ts,'3600000');//不到1小时的毫秒数 
    	tp2 = ut.bnmod(tp1,'60000'); //不到1分钟的毫秒数
    	res.mi = ut.bndivis( tp1,'60000');
    	res.ss = ut.bndivis(tp2,'1000');
    	res.ms = ut.bnmod(tp2,'1000');
    }
    // 小于1月 月按30天计
    if( (ut.bnabscomp(ts,'2592000000')=='no') && (ut.bnabscomp(ts,'86399999')=='yes') ){
    	res.dd = ut.bndivis(ts,'86400000');
    	tp1 = ut.bnmod(ts,'86400000');//小于1天的毫秒数
    	tp2 = ut.bnmod(tp1,'3600000');//小于1小时的毫秒数
    	tp3 = ut.bnmod(tp2,'60000'); //不到1分钟的毫秒数
    	res.hh = ut.bndivis(tp1,'3600000');
    	res.mi = ut.bndivis(tp2,'60000');
    	res.ss = ut.bndivis(tp3,'1000');
    	res.ms = ut.bnmod(tp3,'1000');

    }
    //小于1年
    if( (ut.bnabscomp(ts,'31104000000')=='no') && (ut.bnabscomp(ts,'2591999999')=='yes') ){
    	res.mm = ut.bndivis(ts,'2592000000');
    	tp1 = ut.bnmod(ts,'2592000000');//不足一月的毫秒数
    	tp2 = ut.bnmod(tp1,'86400000'); // 不足一天的毫秒数
    	tp3 = ut.bnmod(tp2,'3600000');// 不足1小时
    	tp4 = ut.bnmod(tp3,'60000'); //不到1分钟的毫秒数
    	res.dd = ut.bndivis(tp1,'86400000');
    	res.hh = ut.bndivis(tp2,'3600000');
    	res.mi = ut.bndivis(tp3,'60000');
    	res.ss = ut.bndivis(tp4,'1000');
    	res.ms = ut.bnmod(tp4,'1000');
    }
    // 1年以上
    if( (ut.bnabscomp(ts,'31536000000')=='yes') ){
    	res.yy = ut.bndivis(ts,'31536000000');
    	tp5 = ut.bnmod(ts,'31536000000');//不足1年的毫秒数
    	tp1 = ut.bnmod(tp5,'2592000000');//不足一月的毫秒数
    	tp2 = ut.bnmod(tp1,'86400000'); // 不足一天的毫秒数
    	tp3 = ut.bnmod(tp2,'3600000');// 不足1小时
    	tp4 = ut.bnmod(tp3,'60000'); //不到1分钟的毫秒数
    	res.mm = ut.bndivis(tp5,'2592000000');
    	res.dd = ut.bndivis(tp1,'86400000');
    	res.hh = ut.bndivis(tp2,'3600000');
    	res.mi = ut.bndivis(tp3,'60000');
    	res.ss = ut.bndivis(tp4,'1000');
    	res.ms = ut.bnmod(tp4,'1000');
    }
    if(res.yy.length==1){
    	res.yy = '000'+res.yy;
    }
    if(res.yy.length==2){
    	res.yy = '00'+res.yy;
    }
    if(res.yy.length==3){
    	res.yy = '0'+res.yy;
    }
    if(res.mm.length<2){
		res.mm = '0'+res.mm;
	}
    if(res.dd.length<2){
		res.dd = '0'+res.dd;
	}
    if(res.hh.length<2){
		res.hh = '0'+res.hh;
	}
    if(res.mi.length<2){
		res.mi = '0'+res.mi;
	}
    if(res.ss.length<2){
    	res.ss = '0'+res.ss;
    }
    if(res.ms.length==1){
    	res.ms = '00'+res.ms;
    }
    if(res.ms.length==2){
    	res.ms = '0'+res.ms;
    }
    return res;
}


function msconvto(ts,fmt) {
	var res = {cnt:'0',ret:'0',code:'yes'};

	if(fmt =='ss'){
		if( ut.bnabscomp(ts,'999') =='yes'){
    		res.cnt = ut.bndivis( ts,'1000');
    		res.ret = ut.bnmod(ts,'1000');
    	}
    	else{
    		res.ret = ts;
    	}
	}

	if(fmt == 'mi'){
		if( ut.bnabscomp(ts,'59999')=='yes' ){
			res.cnt = ut.bndivis( ts,'60000');
    		res.ret = ut.bnmod(ts,'60000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'hh'){
		if(ut.bnabscomp(ts,'3599999')=='yes'){
			res.cnt = ut.bndivis( ts,'3600000');
    		res.ret = ut.bnmod(ts,'3600000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'dd'){
		if( ut.bnabscomp(ts,'86399999')=='yes' ){
			res.cnt = ut.bndivis(ts,'86400000');
			res.ret = ut.bnmod(ts,'86400000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'mm'){
		if( ut.bnabscomp(ts,'2591999999')=='yes' ){
			res.cnt = ut.bndivis(ts,'2592000000');
			res.ret = ut.bnmod(ts,'2592000000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'yy'){
		if( ut.bnabscomp(ts,'31535999999')=='yes' ){
			res.cnt = ut.bndivis(ts,'31536000000');
			res.ret = ut.bnmod(ts,'31536000000');
		}
		else{
			res.ret = ts;
		}
	}
	return res;
}


function rolltoms(o) {
	var strts = '0';
	var yyms='0',mmms='0',ddms='0',hhms='0',mims='0',ssms='0',msms='0';
	if(o.yy){
		o.yy = cutzero(o.yy);
		yyms = ut.bnmultip(o.yy,'31536000000');
	}
	if(o.mm){
		o.mm = cutzero(o.mm);
		mmms = ut.bnmultip(o.mm,'2592000000');
	}
	if(o.dd){
		o.dd = cutzero(o.dd);
		ddms = ut.bnmultip(o.dd,'86400000');
	}
	if(o.hh){
		o.hh = cutzero(o.hh);
		hhms = ut.bnmultip(o.hh,'3600000');
	}
	if(o.mi){
		o.mi = cutzero(o.mi);
		mims = ut.bnmultip(o.mi,'60000');
	}
	if(o.ss){
		o.ss = cutzero(o.ss);
		ssms = ut.bnmultip(o.ss,'1000');
	}
	if(o.ms){
		o.ms = cutzero(o.ms);
		msms = o.ms;
	}

	strts = ut.bnplus(strts,yyms);
	strts = ut.bnplus(strts,mmms);
	strts = ut.bnplus(strts,ddms);
	strts = ut.bnplus(strts,hhms);
	strts = ut.bnplus(strts,mims);
	strts = ut.bnplus(strts,ssms);
	strts = ut.bnplus(strts,msms);

	//前面全是零的情况
	function cutzero(numtr) {		
		if( (numtr.length>1)&&( numtr.charAt(0)=='0' ) ){
			var ind =0;
			for (var k = 0; k < numtr.length; k++) {
				if( numtr.charAt(k) != '0'){
					ind = k;
					break;
				}
			}
			numtr = numtr.substr(ind);
		}
		return numtr;	
	}

	return strts;
}







/* 工具函数 */
// 自己设置时间源
function resetnow(strts) {
	ntstrts = strts;
}

// 被getnowts调用,用它返回的时间重写new Date()的默认值为当前时间
function getnow(){
	if(ntstrts){
		return false;
	}
	else{
		return ntstrts;
	}	
}


// 匿名函数 用来启用时间的记时器
;(function () {
	var interts = setInterval(function () {
		if( getnow() ){
			ntstrts = ut.bnplus( getnow(),'500' );
		}
	}, 500);
})();

