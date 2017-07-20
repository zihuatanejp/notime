# notime
A js lib,for date,time, format,timezone,etc , support for no limit time.i,hope

是一个小的js的时间处理工具库，可用来处理极大或极久远的时间，精确到毫秒。或可用来格式化时间，转化时间，初始化时间，获取时间，记录时间的间隔，进行时区的时间转换等

### Email: skylake0010@hotmail.com

----

## 使用：
```javascript
    var nt = require('notime');  // node require进去
    
    //获取当前时间
    nt.getnowts();
    //得到一个json对象如下：
    /*
    { 
        strts: '1500017861106',
        numts: 1500017861106,
        objts:{ 
          yy: '2017',
          mm: '07',
          dd: '14',
          hh: '15',
          mi: '37',
          ss: '41',
          ms: '106'
        } 
    }
    */
```

详情参见utest.js

----
## 方法索引：

* [getnowts :获取当前时间](#getnowts)
* [resetnow ：重置当前时间](#resetnow)
* 时间模型转换方法
  * [convts :时间模型转换方法 自然语言转换为通用时间模型](#convts)
  * [strtstotext :时间模型转换方法 strts格式化为自然语言](#strtstotext)
  * [objtstotext :同上，模型转换方法之一](#objtstotext)
  * [numtstotext :同上](#numtstotext)
  * [objtostrts](#objtostrts)
  * [strtoobjts](#strtoobjts)
  * [numtostrts](#numtostrts)
* 时间的操作与运算
  * [timeplus :strts + 一定毫秒数](#timeplus)
  * [timeminus :strts - 一定毫秒数](#timeminus)
  * [timespace :得到两段strts之间相距的毫秒数](#timespace)
  * [msconv :将一定毫秒数转化为多少年多少月...的形式](#msconv)
  * [msconvto ：将一定毫秒数转化多少年或多少天之类的形式](#msconvto)
  * [rolltoms ：将多少年，多少月之类的形式转化为一定毫秒数](#rolltoms)
* 设置自然语言的时区角度
  * [tzset :用来设置24个时区中的某个](#tzset)
  * [tzmiset :用来设置与GMT时间的偏移分钟数](#tzmiset)
  * [tzcityset :用来设置当前采用全球某个主要城市的时区](#tzcityset)
* [util :辅助工具类对象](#util)
  * [bnplus ：大数加法](#bnplus)
  * [bnminus :大数减法](#bnminus)
  * [bnmultip :大数乘法](#bnmultip)
  * [bndivis :大数除法](#bndivis)
  * [bnmod :大数取余](#bnmod)
  * [bnisnega ：判断是否为负数](#bnisnega)
  * [bnabscomp ：比较两数绝对值大小](#bnabscomp)

----

## 逻辑结构：

### 定义了4种时间模型，包括3种通用模型和1种自然语言模型,模型精确到毫秒

1.objts:

    {
      yy:numstr,
      mm:numstr,
      dd:numstr,
      hh:numstr,
      mi:numstr,
      ss:numstr,
      ms:numstr
    }


由于js使用53个2进制为存储整数部分，使用IEEE754双精度浮点数标准，所以数字的范围为js最大的安全整数范围：即： Number.MAX_SAFE_INTEGER +-/9007199254740991   （ (2^53)-1 ）

但这里并没有这个限制，因为键值是数字的字符串形式 其中mm的范围是01-12  dd的范围是01-31


2.strts

    "12312123123222222222222223334444..." 
一个字符串，存储从unix纪元1970年1月1日起的毫秒数，字符串的长度理论上不受限制，可用来表示和用于极大的数字时间，不受固定位长的数字类型的限制


3.numts
纯数字，同strts一样表示毫秒数时间戳，但有范围，即+-/9007199254740991  （285,616.414年+1970） 约28万年
自1970年1月1日加上或减去273785年的时间


4.自然语言模型
包括以下几个例子

    2010-10-10
    2010-10-10 10:12 
    2010-10-10 10:12:12 
    2010-10-10 10:12:12:233



### 定义了几类方法和一个角度，来操作和处理上述的四种模型

1.获取和重置当前时间： 

    getnowts
    resetnow


2.自然语言时间模型和通用模型之间的转换

    convts
    strtstotext
    objtstotext
    numtstotext


3.通用时间模型之间的转换

    objtostrts
    strtoobjts
    numtostrts


4.时间的操作和运算

    timeplus: 处理一段时间的计算 strts + 一定毫秒数 返回strts对象
    timeminus: 处理一段时间的计算 strts - 一定毫秒数 返回strts对象
    timespace: 处理一段时间的计算 strts与strts 返回它们之间相距的时间距离毫秒数
    msconv:  处理一段时间的计算 将一定毫秒数 转化为多少年多少月..几时几分几秒 返回 一个对象
    msconvto: 处理一段时间的计算 将一定毫秒数 转化为xx天 或者 xx秒等
    rolltoms: 处理一段时间的计算 将多少天 多少小时 转化为多少毫秒数


5.一个角度
时区：对于自然语言时间模型的概念会有一个时区设置方法，以输出多角度的当前时间模型，有以下3个方式设置时区角度
默认时区： 东八区，北京，480

    tzset  E1-E12 W1-W12 WE0  25个时区范围东1到东12区，西1到西12区
    tzmiset 设置与GMT时间的偏移分钟数 +/-480
    tzcityset  设置以某个城市拼写所在的时区为准，
支持以下城市：

[tzcityset :查看支持城市](#tzcityset)

此外还有一些透明的辅助工具方法，被以上这些暴露出去的使用方法所调用。
统一归纳在util对象下实现: 

    bnplus   大数加法
    bnminus  大数减法
    bnmultip 大数乘法
    bndivis  大数除法
    bnmod    大数取余
    bnisnega    判断是否是负数
    bnabscomp   比较两数的绝对值大小
 
---

## API

### getnowts

方法描述：用来获取当前时间，返回1个json对象，里面有3种格式的当前时间（strts,numts,objts）

### resetnow

用来重置当前时间，一旦设定该项后，会启用内置的定时器，每隔500ms更新一次getnowts获取到的当前时间,默认getnowts获取当前时间使用的js的new Date();
若调用过该方法重置后，则会使用重置的时间为起点自动更新当前时间


### convts

用来将输入的，或者人类便于理解的自然语言格式的时间字符串转化为3种通用的时间模型（strts,numts,objts）
支持以下4种格式的字符串

        2010-10-10
        2010-10-10 10:12 
        2010-10-10 10:12:12 
        2010-10-10 10:12:12:233

### strtstotext

用来将给出的strts 转化为想要的便于人类理解的字符串时间格式，该方法接收2个参数，一个必填参数和一个可选的参数对象，用来定制输出字符串的格式

参数1: strts:  "2342432423423432432"

参数2： format: {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'}

yy:true/false 表示是否输出年份 //年份可能是4位或以上
ymdf: 表示年月日之间的分隔符采用什么
hmsf: 表示时分秒毫秒之间的分隔符采用什么

返回：形如： "2010-10-10 10:12:12:233" 之类的格式

### objtstotext

用来将给出的objts 转化为想要的便于人类理解的字符串时间格式，该方法接收2个参数，一个必填参数和一个可选的参数对象，用来定制输出字符串的格式

参数1: objts:  {yy:1995,mm:1,dd:20,hh:12,mi:30,ss:59,ms:0}

参数2： format: 默认值： {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'}

yy:true/false 表示是否输出年份 //年份可能是4位或以上
ymdf: 表示年月日之间的分隔符采用什么
hmsf: 表示时分秒毫秒之间的分隔符采用什么

返回：形如： "2010-10-10 10:12:12:233" 之类的格式

### numtstotext

同上的strtstotext方法，只是传的第一个参数是一个数字
该方法实现采用js原生的Date对象实现，理论上处理速度应该会更快一点

### objtostrts

将 objts 转换为 strts

### strtoobjts

objtostrts的反向转换

### numtostrts

将numts 转化为 strts

### timeplus

处理并得到在某时间点上增加多长时间后的时间，接收两个参数，

参数1： strts

参数2：一定时间的毫秒数String  如： '12312323'

返回:新的strts

### timeminus

参数1： strts

参数2：一定时间的毫秒数String  如： '12312323'

返回:新的strts


### timespace

得到时间轴上两个时间点之间相距的时间,返回以毫秒计数的字符串

参数1： strts

参数2： strts

返回： 这中间的这段时间的毫秒数 形如 '23433433332'


### msconv

将以毫秒计数的一段时间的字符串转化为 多少天多少小时 的形式，注意这里返回的按每月30天每年365天的形式计算返回，所以对于公历闰年，大小月而言是有小误差的

参数1： '234343333'

返回： 形如：{yy:'0000',mm:'00',dd:'12',hh:'03',mi:'30',ss:'01',ms:'000'}


### msconvto

按指定的时间单位来将一段毫秒数时间划分，余数不足的部分会被直接忽略


参数1： '123321313123123'  表示一段时间的毫秒数

参数2： 'yy' || 'mm' || 'dd' || 'hh' || 'mi' || 'ss'

返回： 如：{cnt:'50',ret:'xxx',code:'yes'}  // cnt 代表多少数量的该单位 ret代表该单位后的余数毫秒数  code:yes/no 是否成功


### rolltoms

将多少年，多少月之类的形式反过来转化为一定毫秒数，msconv的逆向方法

参数： {dd:123,...}  // dd,yy,mm,mi,hh,ss均为可选项

返回： '3453324343242' // 代表毫秒数


### tzset

设置转化为自然语言时，格式化输出的时间处于哪一个当前时区，默认时区：E8

7.5W-7.5E 中时区零时区经度每15度一个时区,东12区和西12区重合,中间180度经线为国际日期变更线

东12区为8日，西12区为7日

由西向东越过日期变更线即：东12->西12 -1日,

由东向西越过 即:西12->东12 +1日

参数: 'WE0/ E1'/'E2'.../'E12'/'W1'/.../'W12'    // 东西12个时区 和零时区（中时区WE0）


### tzmiset

设置与GMT时间的偏移分钟数

参数：  480/-30    //可为正数或负数


### tzcityset

设置当前采用全球某个主要城市的时区
实际上，世界上不少国家和地区都不严格按时区来计算时间。为了在全国范围内采用统一的时间，一般都把某一个时区的时间作为全国统一采用的时间。

例如，我国把首都北京所在的东8区的时间作为全国统一的时间，称为北京时间。

又例如，英国、法国、荷兰和比利时等国，虽地处中时区，但为了和欧洲大多数国家时间相一致，则采用东1区的时间。 

参数： 'beijing'/...  //主要城市的拼音或英文名
参数支持范围如下:

    beijing(中国-北京+8) 480,  hongkong(中国-香港+8) 480, Honolulu(美国-夏威夷檀香山-10) -600, alaska(美国-阿拉斯加-8) -480,
    sanfrancisco(美国-旧金山-8) -480,     henei(越南-河内+7)   420, huzhiming(越南-胡志明+7) 420, dubai(迪拜+4) 240, 
    kabul(阿富汗-卡布+4) 240, cairo(埃及-开罗+2) 120, seoul (韩国-首尔汉城+9) 540, moscow(俄罗斯-莫斯科+3) 180
