'use strict';

var nt = require('./notime');
var ut = nt.util;

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

