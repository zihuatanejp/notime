'use strict';

var ut = require('./util');

var ntstrts = ''; /* 时间源,如果它被设置了值的话，将会使用它作为源，每1s更新一次 */
var ntgmt = '0'; /* 当前时区与GMT时区偏移的分钟数  */

module.exports = {
	getnowts:getnowts,   
	resetnow:resetnow,
	// timeplus:timeplus,

	strtoobjts:strtoobjts,

	msconv:msconv,
	msconvto:msconvto,
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
	if(!tp1){
		tp1 = new Date().getTime().toString();
	}
	var md = tp1;
	var res = {};
	res.strts = md;
	res.numts = parseInt(md);
	var obj = msconvto(md,'dd');
	return res;
}


function strtoobjts(ts) {
	var obj = msconvto(ts,'dd');
	var cnt = obj.cnt;
	var ret = obj.ret;
	//不足1天
	if(cnt == '0'){

	}
	//小于1年 大小月
	if( ut.bnabscomp(cnt,'365')=='no' ){

	}
	//大于1年 四年一闰年 2月29日 第一次闰年在1972年
	//每3500年再减一日 第一次减日在4500年
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

