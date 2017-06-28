'use strict';

var ntstrts = ''; /* 时间源,如果它被设置了值的话，将会使用它作为源，每1s更新一次 */

module.exports = {
	getnowts:getnowts,   
	resetnow:resetnow,
	// timeplus:timeplus,
	timeconv:timeconv,
	getobjts:getobjts
};

/*
getnowts: 用于获取当前时间
resetnow: 用于重置getnowts方法使用的当前的时间来源，getnowts的默认时间来源是new Date();

timeplus: 处理一段时间的计算 strts + 一定毫秒数 返回strts对象
timeminus: 处理一段时间的计算 strts - 一定毫秒数 返回strts对象
timespace: 处理一段时间的计算 strts与strts 返回它们之间相距的时间距离毫秒数
timeconv:  处理一段时间的计算 将一定毫秒数 转化为某年某月..几时几分几秒 返回 一个对象

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

// 大数加法
function bnplus(a1,a2){
	if ( a1.length > a2.length ){
		var tp1 = a1;
		a1 = a2;
		a2 = tp1;
	}
	var ar1 = a1.split('');
	var ar2 = a2.split('');
	var carryflag = 0; //进位标志
	var rstr = ''; //输出的计算结果str
	var secnum; //数组项的结果
	var secstr; //数组项结果的str
	(function () {
	var tp2 = 0; //当前计算的是倒数第几个数
	for(var i = (a1.length-1);i>=0;i-- ){
		++tp2;	
		(function () {
		var tp3 = 0;
		var tp4 = false; //a1是否已完
		var tp5 = false; // 是否已加过a1的最后一个
		for(var j = (a2.length-1);j>=0;j--){
			++tp3;
			//对应倒数位上的数计算
			if(tp2 == tp3){
				if(i==0){
					tp4 = true;
				}
				else{
					secnum = parseInt(ar1[i])+parseInt(ar2[j])+carryflag;
					secstr = secnum.toString();
					if(secstr.length>1){
						secstr = secstr.substr(-1);
						carryflag = 1;
					}
					else{
						carryflag = 0;
					}
					rstr = secstr+rstr;
				}
			}
			// 如果a1已完
			if(tp4){
				if(tp5){
					secnum = parseInt(ar2[j])+carryflag;
				}
				else{
					secnum = parseInt(ar1[i])+parseInt(ar2[j])+carryflag;
					tp5 = true;
				}
				secstr = secnum.toString();
				if(j == 0){ //如果a2也到了最后一位
					rstr = secstr+rstr;
				}
				else{
					if(secstr.length>1){
						secstr = secstr.substr(-1);
						carryflag = 1;
					}
					else{
						carryflag = 0;
					}
					rstr = secstr+rstr;
				}	
			}
		}
		})();
	}
	})();
	return rstr;
}


//大数减法
function bnminus(a1,a2) {
	var ar1 = a1.split('');
	var ar2 = a2.split('');
	var carryflag = 0; //退位标志
	var rstr = '';
	var secnum;
	var secstr;
	(function () {
		var tp2 = 0;
		for(var i = (a2.length-1);i>=0;i-- ){
			++tp2;
			(function () {
				var tp3 =0;
				var tp4 = false; //a2是否已完
				var tp5 = false; // 是否已减过a2 的最后一个
				var tpa1,tpa2; // a1的倒数位数 和a2的倒数位数
				for(var j = (a1.length-1);j>=0;j--){
					++tp3;
					if(tp3 == tp2){ 
						if(i==0){
							tp4 = true;
						}
						else{
							tpa1 = parseInt(ar1[j])-carryflag;
							tpa2 = parseInt(ar2[i]);
							if(tpa1>=tpa2){
								secnum = tpa1-tpa2;
								carryflag = 0;
							}
							else{
								secnum = tpa1+10-tpa2;
								carryflag = 1;
							}
							secstr = secnum.toString();
							rstr = secstr+rstr;
						}
					}
					if(tp4){	
						tpa1 = parseInt(ar1[j])-carryflag;					
						tpa2 = parseInt(ar2[i]); 
						if(tp5){
							if(tpa1<0){
								secnum = 9;
								carryflag = 1;
							}
							else{
								secnum = tpa1;
								carryflag = 0;
							}
						}
						else{							
							if(tpa1>=tpa2){
								secnum = tpa1-tpa2;
								carryflag = 0;
							}
							else{
								secnum = tpa1+10-tpa2;
								carryflag = 1;
							}
							tp5 = true;
						}

						secstr = secnum.toString();
						// 如果a1的最后一位为0
						if(j==0){
							if(secstr != '0'){
								rstr = secstr+rstr;
							}
						}
						else{
							rstr = secstr+rstr;
						}
					}
				}
			})();
		}
	})();
	return rstr;
}


// 判斷是否为负数
function isnega(str){
	var res = false;
	if( str.charAt(0) == '-' ){
		res = true;
	}
	return res;
}


// 比较两数的绝对值大小 //a1>a2 yes  //a1<a2  no  //两数相等 eq
function abscomp(a1,a2){
	var res;
	if( isnega(a1) ){
		a1 = a1.slice(1);
	}
	if( isnega(a2) ){
		a2 = a2.slice(1);
	} 
	if(a1.length>a2.length){
		res = 'yes';
	}
	if(a1.length<a2.length){
		res = 'no';
	}
	if(a1.length == a2.length){
		var ar1 = a1.split('');
		var ar2 = a2.split('');
		var tpa1,tpa2; 
		for(var i =0;i<(ar1.length);i++){
			tpa1 = parseInt(ar1[i]);
			tpa2 = parseInt(ar2[i])
			if( tpa1 > tpa2 ){
				res = 'yes';
				break;
			}
			if(tpa1 < tpa2){
				res = 'no';
				break;
			}
			if(tpa1 == tpa2){
				res = 'eq';
				continue;
			}
		}
	}
	return res;
}