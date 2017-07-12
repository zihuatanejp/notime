'use strict';

var nt = require('./notime');
var ut = nt.util;


console.log( nt.msconvto('1499854680007','dd') );
console.log( nt.msconv('1499854680007') );
// console.log( nt.msconv('7124123123600800') );
// console.time('a');
// console.log( nt.msconvto('64123123600800','dd') );
// console.timeEnd('a');

// var tp1 = nt.util.bnplus('11111111111111111','99999999999999988888888');
// console.log(tp1);

/*
var tp2 = ut.bnmultip('999','99');
// console.log(tp2);  //should 98901  ok

var tp3 = ut.bnmultip('111','11');
// console.log(tp3);  // should 1221 ok

var tp4 = ut.bnmultip('111','111');
// console.log(tp4);  // should 12321 ok

var tp5 = ut.bnmultip('9999','9999');
// console.log(tp5);  // should 99980001 ok

var tp6 = ut.bnmultip('234','6789');
// console.log(tp6);  // should 1588626 ok

var tp7 = ut.bnmultip('234','6289');
console.log(tp7);  // should 1471626 ok

*/

/*
var tp8 = ut.bndivis('999','99');
console.log(tp8);  // should 10 ok

var tp9 = ut.bndivis('100','99');
console.log(tp9);  // should 1 ok

var tp10 = ut.bndivis('1000','1');
console.log(tp10);  // should 1000 ok

var tp11 = ut.bndivis('1000','2');
console.log(tp11);  // should 500 ok

*/

/*

var tp12 = ut.bnmod('100','99');
console.log(tp12); // should 1 ok

var tp13 = ut.bnmod('1000','2');
console.log(tp13);  // should 0 ok

var tp14 = ut.bnmod('964','22');
console.log(tp14);  // should 18 ok

var tp15 = ut.bnminus('2','2');
console.log(tp15);  // should 0  res:''

var tp16 = ut.bnminus('999','999');
console.log(tp16); // should 0    res:00  
// / 已解决两数相等时不进行后续减法运算

var tp17 = ut.bnminus('100','99');
console.log(tp17);  // should 1  res:01

var tp17 = ut.bnminus('1000','99');
console.log(tp17);  // should 901  res:901 ok

var tp17 = ut.bnminus('1000','999');
console.log(tp17);  // should 1  res:001
///解决方案: 得到最终结果后处理前面全是0的情况,去掉前面的0 ok

*/

// 负数测试


// var tp19 = ut.bnplus('5','-5');
// console.log(tp19);  // should 0  ok

// var tp20 = ut.bnplus('-5','5');
// console.log(tp20);  // should 0  ok

// var tp18 = ut.bnplus('10','-5');
// console.log(tp18);  // should 5  

// var tp21 = ut.bnplus('-10','5');
// console.log(tp21);  // should -5  

// var tp22 = ut.bnplus('5','-10');
// console.log(tp22);  // should -5  

// var tp21 = ut.bnplus('-5','10');
// console.log(tp21);  // should 5  

// var tp22 = ut.bnplus('-5','-10');
// console.log(tp22);  // should -15  

// var tp23 = ut.bnplus('5','10');
// console.log(tp23);  // should 15  

// var tp24 = ut.bnminus('5','10');
// console.log(tp24);  // should -5  

// var tp25 = ut.bnminus('-5','10');
// console.log(tp25);  // should -15

// var tp26 = ut.bnminus('5','-10');
// console.log(tp26);  // should -15 

// var tp27 = ut.bnminus('5','-5');
// console.log(tp27);  // should -10  

// var tp28 = ut.bnminus('-10','-5');
// console.log(tp28);  // should -5  

// var tp29 = ut.bnminus('-5','-10');
// console.log(tp29);  // should 5 

// var tp30 = ut.bnminus('-5','-5');
// console.log(tp30);  // should 0   

// var tp31 = ut.bnplus('0','1');
// tp31 = ut.bnplus(tp31,'1');
// console.log(tp31);