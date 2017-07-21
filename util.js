'use strict';

module.exports = {
	bnplus:bnplus,
	bnminus:bnminus,
	bnmultip:bnmultip,
	bndivis:bndivis,
	bnmod:bnmod,
	bnisnega:bnisnega,
	bnabscomp:bnabscomp
};

// 大数加法
function bnplus(a1,a2){

	//支持负数运算
	//若一个数为负数,则用大数减小数
	//若两数均为负数,则去掉负号正常运算,最后结果追加负号
	var negaflag = 0;
	var a1nega = false;
	var a2nega = false;
	if( bnisnega(a1) ){
		++negaflag;
		a1 = a1.slice(1);
		a1nega = true;
	}
	if( bnisnega(a2) ){
		++negaflag;
		a2 = a2.slice(1);
		a2nega = true;
	}

	if(negaflag == 1){
		if( bnabscomp(a1,a2) =='eq' ){
			return '0';
		}
		if (bnabscomp(a1,a2) =='yes'){
			//若a1大且a1是负数则结果加上负号
			if(a1nega){
				return '-'+bnminus(a1,a2);
			}
			else{
				return bnminus(a1,a2);
			}
		}
		if( bnabscomp(a1,a2)=='no' ){
			if(a1nega){
				return bnminus(a2,a1);
			}
			else{
				return '-'+bnminus(a2,a1);
			}
		}
	}

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

	//若两个皆为负数
	if(negaflag==2){
		return '-'+rstr;
	}
	else{
		return rstr;
	}	
}


//大数减法
function bnminus(a1,a2) {

	// //两数绝对值相等,则不用后续计算
	// if( bnabscomp(a1,a2) =='eq'){
	// 	return '0';
	// }
	
	var negaflag = 0;
	var a1nega = false;
	var a2nega = false;
	if( bnisnega(a1) ){
		++negaflag;
		a1 = a1.slice(1);
		a1nega = true;
	}
	if( bnisnega(a2) ){
		++negaflag;
		a2 = a2.slice(1);
		a2nega = true;
	}

	// 都为正数 有可能减出负数
	if(negaflag==0){
	 	if( bnabscomp(a1,a2)=='eq' ){
	 		return '0';
	 	}
	 	if( bnabscomp(a1,a2)=='no' ){
	 		return '-'+bnminus(a2,a1);
	 	}
	}

	// 有一个数为负数
	if(negaflag ==1){
		return '-'+bnplus(a1,a2);
	}

	// 都为负数 
	if( negaflag ==2 ){
		if( bnabscomp(a1,a2)=='eq' ){
			return '0';
		}
		if( bnabscomp(a1,a2)=='yes' ){
			return '-'+bnminus(a1,a2);
		}
		if( bnabscomp(a1,a2)=='no' ){
			return bnminus(a2,a1);
		}
	}
	
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
							secstr = secnum.toString(); //console.log(secstr);
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
	//  是否是前面全是零的情况
	if( (rstr.length>1)&&( rstr.charAt(0)=='0' ) ){
		var ind =0;
		for (var k = 0; k < rstr.length; k++) {
			if( rstr.charAt(k) != '0'){
				ind = k;
				break;
			}
		}
		rstr = rstr.substr(ind);
	}	
	return rstr;
}

// 大数乘法  //不支持乘以小数
function bnmultip(a1,a2){

	//有1数全是0的情况直接返回0
	var regexp = /^0+$/;
	if( regexp.test(a1) || regexp.test(a2) ){
		return '0';
	}

	// 大数在前 小数在后
	var comp = bnabscomp(a1,a2);
	if(comp == 'no'){
		var tp1 = a1;
		a1 = a2;
		a2 = tp1;
	}

	// 切割为数组
	var ar1 = a1.split('');
	var ar2 = a2.split('');

	var carryflag = 0; //进位后加的数
	var rstr = ''; //最终得到的结果
	var secstr = '';//每完成一段 1对n后最终得到的结果str
	var cellnum; // 每个1对1的乘积
	var cellstr; // 每个1对1的乘积的str
	var tp2 =0;//计数当前是小数的第几个数进行乘了,用来判断补零

	// 开始从小数的最后位乘起
	(function () {
		for (var i = (ar2.length-1);i>=0;i--) {
			++tp2;
			// 每次进来清掉重置上一次的片段值
			secstr = '';

			for(var j = (ar1.length-1);j>=0;j--){
				// 如果小数的该位数为0 ,则secstr的结果直接为0
				if( parseInt(ar2[i]) ==0 ){
					secstr = '0';
				}
				else{
					cellnum = parseInt(ar2[i])*parseInt(ar1[j])+parseInt(carryflag);
					cellstr = cellnum.toString();
					carryflag = 0;
					if(cellstr.length>1){
						//乘到大数的首位了，或者没有
						if(j==0){
							carryflag = 0;
						}
						else{
							carryflag = cellstr.substr(0,1);
							cellstr = cellstr.substr(-1);
						}
					}
					secstr = cellstr+secstr;
					//运行到该片段最后一次乘运算时，进行补零
					if(j==0){
						for (var k = 0; k < (tp2-1); k++) {
							secstr = secstr+'0';
						}
					}
				}
			}
			// 0就不用加了
			if(secstr!='0'){
				if(rstr){
					rstr = bnplus(rstr,secstr);					
				}
				else{
					rstr = secstr;
				}
				
			}
		}
	})();

	return rstr;
}

// 大数除法 //返回整数结果 不支持被除数小于除数
function bndivis(a1,a2) {
	var comp = bnabscomp(a1,a2); 
	if(comp=='no'){
		return '0';
	}
	if(comp =='eq'){
		return '1';
	}
	var flag = true; 
	var cnt = '0';
	var tp; // 减去后的结果值,临时变量
	while(flag){
		// 判断第一次 和以后的许多次
		if(!tp){
			tp = bnminus(a1,a2);
		}
		else{
			tp = bnminus(tp,a2);
		}
		
		cnt = bnplus(cnt,'1');
		//减去后比较是否已小于，小于则跳出，否则进下一次
		if( bnabscomp(tp,a2) == 'no' ){
			flag = false;
		}
	}
	return cnt;
}

// 大数取余 不支持被除数小于除数
function bnmod(a1,a2) {
	var comp = bnabscomp(a1,a2); 
	if(comp=='no'){
		return a1;
	}
	if(comp =='eq'){
		return '0';
	}
	var flag = true;
	var tp; // 减去后的结果值,临时变量
	while(flag){
		// 判断第一次 和以后的许多次
		if(!tp){
			tp = bnminus(a1,a2);
		}
		else{
			tp = bnminus(tp,a2);
		}
		// console.log(tp);
		//减去后比较是否已小于，小于则跳出，否则进下一次
		if( bnabscomp(tp,a2) == 'no' ){
			flag = false;
		}
		if( bnabscomp(tp,a2) == 'eq' ){
			tp = '0';
			flag = false;
		}
	}
	return tp;
}

// 判斷是否为负数
function bnisnega(str){
	var res = false;
	if( str.charAt(0) == '-' ){
		res = true;
	}
	return res;
}


// 比较两数的绝对值大小 //a1>a2 yes  //a1<a2  no  //两数相等 eq
function bnabscomp(a1,a2){
	var res;
	if( bnisnega(a1) ){
		a1 = a1.slice(1);
	}
	if( bnisnega(a2) ){
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