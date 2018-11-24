'use strict';
 
var ut = require('./util');

var ntstrts = ''; /* 时间源,如果它被设置了值的话，将会使用它作为源，每1s更新一次 */
var ntgmt = '480'; /* 当前时区与GMT时区偏移的分钟数  */

module.exports = {
	getnowts:getnowts,   
	resetnow:resetnow,

	convts:convts,
	strtstotext:strtstotext,
	objtstotext:objtstotext,
	numtstotext:numtstotext,
	strtoobjts:strtoobjts,
	objtostrts:objtostrts,
	numtostrts:numtostrts,

	timeplus:timeplus,
	timeminus:timeminus,
	timespace:timespace,
	msconv:msconv,
	msconvto:msconvto,
	rolltoms:rolltoms,

	tzset:tzset,
	tzmiset:tzmiset,
	tzcityset:tzcityset,
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
	res.objts = strtoobjts(md);
	return res;
}


function strtoobjts(ts) { 
    if( ts == 'nil' ){ return; }
	//格式化时处理时区偏移
	ts = tzaddoffset(ts,ntgmt); 

	var res = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
	var tsnega = false;

	if( ut.bnisnega(ts) ){
		ts = ts.slice(1);
		tsnega = true;
	}

	var obj = msconvto(ts,'dd'); 
	var cnt = obj.cnt;
	var ret = obj.ret;
	var tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8,tp9,tp10,tp11,tp12;
	//不足1天
	if(cnt == '0'){ 
		if(!tsnega){ 
			res.yy = '1970';
			res.mm = '01';
			res.dd = '01';
			
			tp11 = shifenmiao(ret);			
		}
		else{
			// 负向时间
			res.yy = '1969';
			res.mm = '12';
			res.dd = '31';
			tp11 = shifenmiao( ut.bnminus('86400000',ret) );
		}
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}
	//小于1年 大小月
	if( (ut.bnabscomp(cnt,'365')=='no') && (ut.bnabscomp(cnt,'0')=='yes') ){
		if(tsnega){
			res.yy = '1969';
			obj = msconvto( ut.bnminus('31536000000',ts) ,'dd'); 
			cnt = obj.cnt;
			ret = obj.ret;
		}
		else{
			res.yy = '1970';
		}
		tp1 = daxiaoyueri(cnt,false,false);
		
		res.mm = tp1.mm;
		res.dd = tp1.dd;

		tp11 = shifenmiao(ret);
		
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}
	if( ut.bnabscomp(cnt,'365')=='eq' ){
		if(!tsnega){
			res.yy = '1971';
			res.mm = '01';
			res.dd = '01';

			tp11 = shifenmiao(ret);
		}
		if(tsnega){
			res.yy = '1968';
			res.mm = '12';
			res.dd = '31';
			tp11 = shifenmiao( ut.bnminus('86400000',ret) );
		}
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
		var xxtp ;//负向时间的当前年份
		while(flag){
			//每次进来重置为365天 //重置闰年 减日标识
			yyms = '31536000000';
			tp9 = false;//是否闰年
			tp10 = false;//是否减日
			
			if(!tsnega){
				//非整百数每四年闰一天
				if( iszhenbai(tp3)=='no' ){ 
					if( tp4=='4' ){ //console.log(tp3);
						yyms = '31622400000';
						tp9 = true;
					}
				}
				//整百数每400年闰1天
				if( iszhenbai(tp3)=='yes' ){ 
					if( ut.bnmod(tp3,'400')=='0' ){ //console.log(tp3)
						yyms = '31622400000'; 
						tp9 = true;
					}
				}
			}

			if(tsnega){
				xxtp = ut.bnminus(tp3,'1');// 当前的实际年份
				if( iszhenbai( xxtp )=='no' ){
					if( tp4=='4' ){ //console.log(tp3);
						yyms = '31622400000';
						tp9 = true;
					}
				}
				if( iszhenbai( xxtp )=='yes' ){ 
					if( ut.bnmod(xxtp,'400')=='0' ){ //console.log(tp3)
						yyms = '31622400000'; 
						tp9 = true;
					}
				}
			}
						
			//1972年闰1天
			if(!tsnega){
				if(tp2=='2'){
					yyms = '31622400000';  //console.log(tp3);
					tp4 ='0';
					tp9 = true;
				}
			}
			//1968年闰一天
			if(tsnega){
				if(tp2=='1'){
					tp4='0';
					yyms = '31622400000'; 
					tp9 = true;
				}
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
				if(tp4== '4'){
					tp4 = '0';
				} 
				tp2 = ut.bnplus(tp2,'1');
				if(tsnega){
					tp3 = ut.bnminus(tp3,'1');
				}
				else{
					tp3 = ut.bnplus(tp3,'1');
				}				
				tp4 = ut.bnplus(tp4,'1'); 
				
			}
			else{
				flag = false;
			}
		}

		// 正向时间年份
		if (!tsnega) {
			res.yy = tp3; // 年 
			tp5 = ut.bnminus(ts,tp8);// 不足1年的毫秒数
		}

		//负向时间年份
		if(tsnega){
			res.yy = ut.bnminus(tp3,'1');
			tp5 = ut.bnminus(tp1,ts);// 不足1年的毫秒数
		}

		if(tp5 == '0'){
			res.mm = '01';
			res.dd = '01';
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
		if(d<31){
			r.mm = '01';
			r.dd = (d+1).toString();
			if(r.dd.length<2){ r.dd = '0'+r.dd; }
		}
		// 2月
		if( (d>=31)&&(d<(59+leap)) ){
			r.mm = '02';
			r.dd = (d-31+1).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 3月
		if( (d>=(59+leap)) && (d<(90+leap)) ){
			r.mm = '03';
			r.dd = (1+d-(59+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 4月
		if( (d>=(90+leap)) && (d<(120+leap)) ){
			r.mm = '04';
			r.dd = (1+d-(90+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 5月
		if( (d>=(120+leap)) && (d<(151+leap)) ){
			r.mm = '05';
			r.dd = (1+d-(120+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 6月
		if( (d>=(151+leap)) && (d<(181+leap)) ){
			r.mm = '06';
			r.dd = (1+d-(151+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 7月
		if( (d>=(181+leap)) && (d<(212+leap)) ){
			r.mm = '07';
			r.dd = (1+d-(181+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 8月
		if( (d>=(212+leap)) && (d<(243+leap)) ){
			r.mm = '08';
			r.dd = (1+d-(212+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 9月
		if( (d>=(243+leap)) && (d<(273+leap)) ){
			r.mm = '09';
			r.dd = (1+d-(243+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 10月
		if( (d>=(273+leap)) && (d<(304+leap)) ){
			r.mm = '10';
			r.dd = (1+d-(273+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 11月
		if( (d>=(304+leap)) && (d<(334+leap)) ){
			r.mm = '11';
			r.dd = (1+d-(304+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		// 12月
		if( (d>=(334+leap)) && (d<(365+leap)) ){
			r.mm = '12';
			r.dd = (1+d-(334+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		return r;
	}
	return res;
}


function convts(units) {
    if( units=='nil' ) { return; }
	var ymd =     /^(\d{1,})\D(\d{1,2})\D(\d{1,2})$/i;
	var ymdhm=    /^(\d{1,})\D(\d{1,2})\D(\d{1,2})\s(\d{1,2})\D(\d{1,2})$/i;
	var ymdhms=   /^(\d{1,})\D(\d{1,2})\D(\d{1,2})\s(\d{1,2})\D(\d{1,2})\D(\d{1,2})$/i;
	var ymdhmsms= /^(\d{1,})\D(\d{1,2})\D(\d{1,2})\s(\d{1,2})\D(\d{1,2})\D(\d{1,2})\D(\d{1,3})$/i;

	var objts = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
	var arr = [];
	var strts = '';
	var res = {};
	var reok = false;

	if( ymd.test(units) ){
		arr = units.split(ymd); // [ '', '20161', '11', '12', '' ]
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		reok = true;		
	}
	if( ymdhm.test(units) ){
		arr = units.split(ymdhm); 
		//console.log(arr); // [ '', '20161', '11', '12', '12', '23', '' ]
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		objts.hh = arr[4];
		objts.mi = arr[5];
		reok = true;
	}
	if( ymdhms.test(units) ){
		arr = units.split(ymdhms); 
		// console.log(arr); // [ '', '20161', '11', '12', '12', '23', '35','' ]
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		objts.hh = arr[4];
		objts.mi = arr[5];
		objts.ss = arr[6];
		reok = true;
	}
	if( ymdhmsms.test(units) ){
		arr = units.split(ymdhmsms);
		// console.log(arr); // [ '', '20161', '11', '12', '12', '23', '35','800', '' ]
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		objts.hh = arr[4];
		objts.mi = arr[5];
		objts.ss = arr[6];
		objts.ms = arr[7];
		reok = true;
	}
	if(reok){ console.log(objts)
		strts = objtostrts(objts);
		if(strts=='no'){ return 'no';}
		res.objts= objts;
		res.strts = strts;
		res.numts = parseInt(strts);
		return res;
	}
	return 'no';
}

function strtstotext(ts,fmt) {
    if( (ts=='nil') || (fmt=='nil') ){ return ; }
	var dft = {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'};
	for(var kk in fmt){
		dft[kk] = fmt[kk];
	}
	var objts = strtoobjts(ts);
	var units = '';
	if(dft.yy){
		units = units+objts.yy+dft.ymdf;
	}
	if(dft.mm){
		units = units+objts.mm+dft.ymdf;
	}
	if(dft.dd){
		units = units+objts.dd;
	}
	if(dft.hh){
		if(dft.dd){
			units = units+' '+objts.hh;
		}
		else{
			units = units+objts.hh;
		}
	}
	if(dft.mi){
		units = units+dft.hmsf+objts.mi;
	}
	if(dft.ss){
		units = units+dft.hmsf+objts.ss;
	}
	if(dft.ms){
		units = units+dft.hmsf+objts.ms;
	}
	return units;
}

function objtstotext(objts,fmt) {
    if( (objts=='nil') || (fmt=='nil') ){ return ;}
	var dft = {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'};
	for(var kk in fmt){
		dft[kk] = fmt[kk];
	}
	var units = '';

	for(var cc in objts){

		if( (objts[cc]) || ( parseInt(objts[cc])==0) ){
			
			objts[cc] = objts[cc].toString();
			if( (cc =='mm')|| (cc=='dd')|| (cc=='hh')|| (cc=='mi')|| (cc=='ss') ){
				if( objts[cc].length<2 ){
					objts[cc] = '0'+objts[cc];
				}
			}
			if(cc=='ms'){
				if( objts[cc].length==0){
					objts[cc] = '000';
				}
				if( objts[cc].length==1){
					objts[cc] = '00'+objts[cc];
				}
				if( objts[cc].length==2){
					objts[cc] = '0'+objts[cc];
				}
			}
		}
	}

	if(dft.yy){
		units = units+objts.yy+dft.ymdf;
	}
	if(dft.mm){
		units = units+objts.mm+dft.ymdf;
	}
	if(dft.dd){
		units = units+objts.dd;
	}
	if(dft.hh){
		if(dft.dd){
			units = units+' '+objts.hh;
		}
		else{
			units = units+objts.hh;
		}
	}
	if(dft.mi){
		units = units+dft.hmsf+objts.mi;
	}
	if(dft.ss){
		units = units+dft.hmsf+objts.ss;
	}
	if(dft.ms){
		units = units+dft.hmsf+objts.ms;
	}
	return units;
}

function numtstotext(numts,fmt) {
    if( (numts=='nil') || (fmt=='nil') ){ return ; }
	var dft = {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'};
	for(var kk in fmt){
		dft[kk] = fmt[kk];
	}
	var units = '';
	var md = new Date(numts);

	if(dft.yy){
		units = units+md.getFullYear()+dft.ymdf;
	}
	if(dft.mm){
		var mdmm = (md.getMonth()+1).toString();
		if(mdmm.length<2){mdmm = '0'+mdmm; }
		units = units+mdmm+dft.ymdf;
	}
	if(dft.dd){
		var mddd = md.getDate().toString();
		if(mddd.length<2){
			mddd = '0'+mddd;
		}
		units = units+mddd;
	}
	if(dft.hh){
		var mdhh = md.getHours().toString();
		if(mdhh.length<2){
			mdhh = '0'+mdhh;
		}
		if(dft.dd){
			units = units+' '+mdhh;
		}
		else{
			units = units+mdhh;
		}
	}
	if(dft.mi){
		var mdmi = md.getMinutes().toString();
		if(mdmi.length<2){
			mdmi = '0'+mdmi;
		}
		units = units+dft.hmsf+mdmi;
	}
	if(dft.ss){
		var mdss = md.getSeconds().toString();
		if(mdss.length<2){
			mdss = '0'+mdss;
		}
		units = units+dft.hmsf+mdss;
	}
	if(dft.ms){
		var mdms = md.getMilliseconds().toString();
		if(mdms.length<2){
			mdms = '0'+mdms;
		}
		units = units+dft.hmsf+mdms;
	}
	return units;
}

function objtostrts(objts) { 
    if( objts=='nil' ){ return ; }
	var oyy = '1970';
	var omm = '01';
	var strts = '0';
	var tsnega = false;// 是否是1970年之前的时间

	var flag = true;//退出while
	var cuyy = '1970'; //当前已到的年份
	var cucnt = '0';//累加经过的年份
	var runcnt = 0;//每四年闰一天
	var yyms = '31536000000';//单前应该加的ms数 默认365天ms数
	var xxtp= '0';// 负向的当前时间年份
	var xxmm ='0';// 负向的月ms
	var xxdh = '0';// 负向的日时分ms
	var xxxmdh = '0';//负向月日时ms

	//处理年
	objts.yy = cutzero(objts.yy);

	//月日时分秒输入参数标准化不足两位的补零，大于范围的返回no
	if( (!parseInt(objts.mm)) || ( parseInt(objts.mm)>12 ) ){
		return 'no';
	}
	if(objts.mm.length<2){
		objts.mm = '0'+objts.mm;		
	}
	if( (!parseInt(objts.dd)) || ( parseInt(objts.dd)>31 ) ){
		return 'no';
	}
	if(objts.dd.length<2){
		objts.dd = '0'+objts.dd;		
	}
	if(  ( parseInt(objts.hh)>24 ) ){
		return 'no';
	}
	if(objts.hh.length<2){
		objts.hh = '0'+objts.hh;		
	}
	if(  ( parseInt(objts.mi)>60 ) ){
		return 'no';
	}
	if(objts.mi.length<2){
		objts.mi = '0'+objts.mi;		
	}
	if(  ( parseInt(objts.ss)>60 ) ){
		return 'no';
	}
	if(objts.ss.length<2){
		objts.ss = '0'+objts.ss;		
	}
	if(  ( parseInt(objts.ms)>1000 ) ){
		return 'no';
	}
	if(objts.ms.length==2){
		objts.ms = '0'+objts.ms;		
	}
	if(objts.ms.length==1){
		objts.ms = '00'+objts.ms;		
	}

	

	//先处理多少年的毫秒数 考虑闰年情况
	if(  ut.bnabscomp(objts.yy,oyy)=='yes'  ){
		
		while(flag){
			yyms = '31536000000';
			//1972年闰一天
			if(cucnt=='2'){ //console.log(cuyy);
				yyms = '31622400000';//闰年 
				runcnt = 0;
			}
			//非整百数每四年闰一天 
			if( iszhenbai(cuyy)=='no' ){ // console.log(cuyy); console.log(runcnt);
				if( runcnt == 4 ){ // console.log(cuyy); //console.log(runcnt);
					yyms = '31622400000';
				}
			}
			//整百数每400年闰1天
			if( iszhenbai(cuyy)=='yes' ){  
				if( ut.bnmod(cuyy,'400')=='0' ){ //console.log(cuyy);
					yyms = '31622400000'; 
				}
			}
			//3500年减1日
			if( ut.bnabscomp(cucnt,'3499')=='yes' ){
				if( ut.bnmod(cucnt,'3500') == '0' ){ 
					yyms = ut.bnminus(yyms,'86400000');
				}
			}
			if(runcnt==4){runcnt =0}
			++runcnt;
			// if(runcnt==5){runcnt =0}
			cucnt = ut.bnplus(cucnt,'1');
			cuyy = ut.bnplus(cuyy,'1'); 
			strts = ut.bnplus(strts,yyms); 
			if( ut.bnabscomp(cuyy,objts.yy)=='eq' ){
				flag = false;
			}
		}
	}

	//小于1970年的时间
	if( ut.bnabscomp(objts.yy,oyy)=='no' ){
		tsnega = true;

		while(flag){
			yyms = '31536000000';

			//1968-1969年
			if(cucnt=='1'){ //console.log(cuyy);
				yyms = '31622400000';//闰年 
				runcnt = 0;
			}

			//非整百数每四年闰一天 
			if( iszhenbai( xxtp )=='no' ){ 
				if( runcnt == 4 ){ 
					yyms = '31622400000';
				}
			}
			//整百数每400年闰1天
			if( iszhenbai(xxtp)=='yes' ){  
				if( ut.bnmod(xxtp,'400')=='0' ){ 
					yyms = '31622400000'; 
				}
			}
			//3500年减1日
			if( ut.bnabscomp(cucnt,'3499')=='yes' ){
				if( ut.bnmod(cucnt,'3500') == '0' ){ 
					yyms = ut.bnminus(yyms,'86400000');
				}
			}

			++runcnt;
			cucnt = ut.bnplus(cucnt,'1');
			cuyy = ut.bnminus(cuyy,'1');
			xxtp = ut.bnminus(cuyy,'1');
			strts = ut.bnplus(strts,yyms);
			if( ut.bnabscomp( xxtp, objts.yy )=='eq' ){
				flag = false;
			}
		}
	}


	//考虑月份的增加
	var mm02 = '2678400000';
	var mm03 = '5097600000';
	var mm04 = '7776000000';
	var mm05 = '10368000000';
	var mm06 = '13046400000';
	var mm07 = '15638400000';
	var mm08 = '18316800000';
	var mm09 = '20995200000';
	var mm10 = '23587200000';
	var mm11 = '26265600000';
	var mm12 = '28857600000';
	//考虑是否闰年月份
	var isrunxxyy = isrunyy(objts.yy);
	if( isrunxxyy ){
		mm03 = ut.bnplus(mm03,'86400000');
		mm04 = ut.bnplus(mm04,'86400000');
		mm05 = ut.bnplus(mm05,'86400000');
		mm06 = ut.bnplus(mm06,'86400000');
		mm07 = ut.bnplus(mm07,'86400000');
		mm08 = ut.bnplus(mm08,'86400000');
		mm09 = ut.bnplus(mm09,'86400000');
		mm10 = ut.bnplus(mm10,'86400000');
		mm11 = ut.bnplus(mm11,'86400000');
		mm12 = ut.bnplus(mm12,'86400000');
	}

	switch(objts.mm){
		case '02':
			xxmm = mm02;
			break;
		case '03':
			xxmm = mm03;
			break;
		case '04':
			xxmm = mm04;
			break;
		case '05':
			xxmm = mm05;
			break;
		case '06':
			xxmm = mm06;
			break;
		case '07':
			xxmm = mm07;
			break;
		case '08':
			xxmm = mm08;
			break;
		case '09':
			xxmm = mm09;
			break;
		case '10':
			xxmm = mm10;
			break;
		case '11':
			xxmm = mm11;
			break;
		case '12':
			xxmm = mm12;
			break;
	}

	//剩余的天数 小时 分钟 毫秒数
	if( (objts.dd) && (objts.dd!='00') ){
		objts.dd = ( parseInt(objts.dd)-1).toString();
		if(objts.dd.length==1){
			objts.dd = '0'+objts.dd; 
		}

		xxxmdh = { dd:objts.dd, hh:objts.hh, mi:objts.mi, ss:objts.ss, ms:objts.ms }; 
		// console.log(xxxmdh);
		xxdh = rolltoms(xxxmdh);
		xxxmdh = ut.bnplus(xxmm,xxdh); //console.log(xxxmdh);
		// 负向时间 超出1年的毫秒部分
		if(tsnega){
			if(isrunxxyy){
				xxxmdh = ut.bnminus('31622400000',xxxmdh);
			}
			else{
				xxxmdh = ut.bnminus('31536000000',xxxmdh);
			}
		}
		//无论正向或负向 都加上超出1年的毫秒部分
		strts = ut.bnplus(strts,xxxmdh);
	}
	if(tsnega){
		strts = '-'+strts;
	}
	//处理时区偏移
	if(ntgmt){
		strts = tzminoffset(strts,ntgmt);
	}	

	// 判断是否整百
	function iszhenbai(str) {
        if (str =='nil'){ return ; }
		if(str.length<3){
			return 'no';
		}
		if( str.slice(-2) == '00' ){
			return 'yes';
		}
		return 'no';
	}
	//判断是否是闰年
	function isrunyy(yy) {
        if(yy=='nil'){ return ; }
		var runyy = false;
		if ( iszhenbai(cuyy)=='no' ){
			if( ut.bnmod(yy,'4')=='0' ){
				runyy = true;
			}
		}
		else{
			if( ut.bnmod(cuyy,'400')=='0' ){
				runyy = true;
			}
		}
		return runyy;
	}

	//前面全是零的情况
	function cutzero(numtr) {
        if( numtr=='nil' ){ return ; }
		numtr = numtr.toString();		
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

function numtostrts(numts) {
    if( numts=='nil' ) { return ; }    
	return numts.toString();
}

//用于某时间点加上一段时间 ms数永远为正值的一段时间,不是正值会被转为正值
function timeplus(ts,ms) {
    if ( (ts=='nil') ||(ms=='nil') ) { return 'nil'; }
	if( ut.bnisnega(ms) ){
		ms = ms.slice(1);
	}
	var r = ut.bnplus(ts,ms);
	return r;
}

//用于某时间点减上一段时间 ms数永远为正值的一段时间,不是正值会被转为正值
function timeminus(ts,ms) {
    if ( (ts=='nil') ||(ms=='nil') ) { return 'nil'; }
	var r ;
	if( ut.bnisnega(ms) ){
		ms = ms.slice(1);
	}
	if( ut.bnisnega(ts) ){
		ts = ts.slice(1);
		r = '-'+ut.bnplus(ts,ms);
	}
	else{
		r = ut.bnminus(ts,ms);
	}
	return r; 
}

//用于得到两个时间点之间的毫秒数
function timespace(ts1,ts2) {
    if ( (ts1=='nil') ||(ts2=='nil') ) { return 'nil'; }
	var ts = '0';
	var negaflag = 0;
	
	if( ut.bnisnega(ts1) ){
		++negaflag;
		ts1 =ts1.slice(1);
	}
	if( ut.bnisnega(ts2) ){
		++negaflag;
		ts2 =ts2.slice(1);
	}

	//都为正数
	var res;
	if(negaflag ==0 || negaflag ==2){
		res = ut.bnabscomp(ts1,ts2);
		if( res=='yes' ){
			ts = ut.bnminus(ts1,ts2);
		}
		if(res =='no'){
			ts = ut.bnminus(ts2,ts1);
		}
	}
	//有1个数为负数
	if(negaflag ==1){
		ts = ut.bnplus(ts1,ts2);
	}
	return ts;
}

// 按每月30天 每年365天计 的多少年多少月
function msconv(ts) {
    if('ts'=='nil') { return 'nil'; }
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
    if( (ts=='nil')||(fmt=='nil') ){ return 'nil'; }
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
    if (o=='nil'){ return 'nil'; }
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

	strts = ut.bnplus(strts,yyms);  //console.log('yyms: '+yyms); console.log(strts);
	strts = ut.bnplus(strts,mmms);  //console.log('mmms: '+mmms); console.log(strts);
	strts = ut.bnplus(strts,ddms);  //console.log('ddms: '+ddms); console.log(strts);
	strts = ut.bnplus(strts,hhms);  //console.log('hhms: '+hhms); console.log(strts);
	strts = ut.bnplus(strts,mims);  //console.log('mims: '+mims); console.log(strts);
	strts = ut.bnplus(strts,ssms);  //console.log('ssms: '+ssms); console.log(strts);
	strts = ut.bnplus(strts,msms);  // console.log('msms: '+msms); console.log(strts);
	// console.log(strts);
	//前面全是零的情况
	function cutzero(numtr) {
        if(numtr=='nil'){ return 'nil'; }
		numtr = numtr.toString();		
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

//设置时区
function tzset(tz) {
    if(tzset=='nil'){ return 'nil'; }
	switch(tz){
		case 'WE0':
			ntgmt = '0';
			break;
		case 'E1':
			ntgmt = '60';
			break;
		case 'E2':
			ntgmt = '120';
			break;
		case 'E3':
			ntgmt = '180';
			break;
		case 'E4':
			ntgmt = '240';
			break;
		case 'E5':
			ntgmt = '300';
			break;
		case 'E6':
			ntgmt = '360';
			break;
		case 'E7':
			ntgmt = '420';
			break;
		case 'E8':
			ntgmt = '480';
			break;
		case 'E9':
			ntgmt = '540';
			break;
		case 'E10':
			ntgmt = '600';
			break;
		case 'E11':
			ntgmt = '660';
			break;
		case 'E12':
			ntgmt = '720';
			break;
		case 'W1':
			ntgmt = '-60';
			break;
		case 'W2':
			ntgmt = '-120';
			break;
		case 'W3':
			ntgmt = '-180';
			break;
		case 'W4':
			ntgmt = '-240';
			break;
		case 'W5':
			ntgmt = '-300';
			break;
		case 'W6':
			ntgmt = '-360';
			break;
		case 'W7':
			ntgmt = '-420';
			break;
		case 'W8':
			ntgmt = '-480';
			break;
		case 'W9':
			ntgmt = '-540';
			break;
		case 'W10':
			ntgmt = '-600';
			break;
		case 'W11':
			ntgmt = '-660';
			break;
		case 'W12':
			ntgmt = '-720';
			break;		
	}
}


function tzmiset(offset) {
    if(offset=='nil'){ return 'nil'; }
	ntgmt = offset;
}

function tzcityset(city) {
    if (city=='nil'){ return 'nil'; }
	var arr = [
		{city:'beijing',offset:'480'},
		{city:'hongkong',offset:'480'},
		{city:'honolulu',offset:'-600'},
		{city:'alaska',offset:'-480'},
		{city:'sanfrancisco',offset:'-480'},
		{city:'henei',offset:'420'},
		{city:'huzhiming',offset:'420'},
		{city:'dubai',offset:'240'},
		{city:'kabul',offset:'240'},
		{city:'cairo',offset:'120'},
		{city:'seoul',offset:'540'},
		{city:'moscow',offset:'180'}
	];

	for (var i = 0; i < arr.length; i++) {
		if(city == arr[i].city){
			ntgmt = arr[i].offset;
		}
	}
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

//处理加上应有的 gmt时区偏移
function tzaddoffset(ts,gmt) {
    if( (ts=='nil')|| (gmt=='nil') ){ return 'nil'; }
	var tp2;
	if(gmt){
		var negaflag = false;
		if( ut.bnisnega(gmt) ){
			gmt = gmt.slice(1);
			negaflag = true;
		}
		tp2 = rolltoms({mi:gmt});
		if(negaflag){ tp2 = '-'+tp2; }
		tp2 = ut.bnplus(ts,tp2);
	}
	else{ tp2 = ts; }
	return tp2;
}

//去掉gmt时区的影响
function tzminoffset(ts,gmt) {
     if( (ts=='nil')|| (gmt=='nil') ){ return 'nil'; }
	var res;
	var tp;
	if(gmt){
		var negaflag = false;
		if( ut.bnisnega(gmt) ){
			gmt = gmt.slice(1);
			negaflag = true;
		}
		tp = rolltoms({mi:gmt});
		if(negaflag){
			res = ut.bnplus(ts,tp);
		}
		else{
			res = ut.bnminus(ts,tp);
		}
	}
	else{ res = ts; }
	return res;
}

// 匿名函数 用来启用时间的记时器
;(function () {
	var interts = setInterval(function () {
		if( getnow() ){
			ntstrts = ut.bnplus( getnow(),'500' );
		}
	}, 500);
})();

