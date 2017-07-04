'use strict';

var util = require('./util');

var ntstrts = ''; /* 时间源,如果它被设置了值的话，将会使用它作为源，每1s更新一次 */

module.exports = {
	getnowts:getnowts,   
	resetnow:resetnow,
	// timeplus:timeplus,
	timeconv:timeconv,
	getobjts:getobjts,
	util:util
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
	var tp1 = new Date().getTime().toString();
	var md = getnow() || tp1;
	var res = {};
	res.strts = md;
	res.numts = parseInt(md);
	return res;
}


function getobjts(strts) {
	
}


function timeconv(ts) {
    var res = {};
    if(ts <= 60){
        res = {yy:0,mm:0,d:0,h:'00',m:'00',s:ts};
    }
    if( (ts>60) && (ts <= 3600) ){
        res = {d:'00',h:'00'};
        res.m = parseInt(ts/60);                        
        res.s = parseInt(ts%60);
    }
    if( (ts>3600) && (ts<=86400) ){
        res = {d:'00'};
        res.h = parseInt(ts/3600);                        
        res.m = parseInt( (ts%3600)/60 );
        res.s = parseInt( (ts%3600)%60  );
    }
    if( (ts>86400) ){
        res.d =  parseInt(ts/86400);
        res.h =  parseInt( (ts%86400)/3600 );
        res.m = parseInt( ((ts%86400)%3600)/60 );
        res.s = parseInt( ((ts%86400)%3600 )%60 );
    }

    if(res.d<10){ res.d = '0'+res.d; }
    if(res.h<10){ res.h = '0'+res.h; }
    if(res.m<10){ res.m = '0'+res.m; }
    if(res.s<10){ res.s = '0'+res.s; }
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
			ntstrts = bnplus( getnow(),1000 );
		}
	}, 1000);
})();

