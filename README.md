# notime
A js lib,for date,time, format,timezone,etc , support for no limit time.i,hope

是一个小的js的时间处理工具库，可用来处理极大或极久远的时间，精确到毫秒。或可用来格式化时间，转化时间，初始化时间，获取时间，记录时间的间隔，进行时区的时间转换等

### Email: skylake0010@hotmail.com

----

## 使用：

详情参见utest.js

----
## 方法索引：


----
## 逻辑结构：

### 定义了4种时间模型，包括3种通用模型和1种自然语言模型,模型精确到毫秒

1.objts:

    {
      yy:num,
      mm:num,
      dd:num,
      hh:num,
      mi:num,
      ss:num,
      ms:num
    }


由于js使用53个2进制为存储整数部分，使用IEEE754双精度浮点数标准，所以num的范围为js最大的安全整数范围：即： Number.MAX_SAFE_INTEGER +-/9007199254740991   （ (2^53)-1 ）


2.strts

    "12312123123222222222222223334444..." 
一个字符串，存储从unix纪元1970年1月1日起的毫秒数，字符串的长度理论上不受限制，可用来表示和用于极大的数字时间，不受固定位长的数字类型的限制


3.numts
纯数字，同strts一样表示毫秒数时间戳，但有范围，即+-/9007199254740991  （285,616.414年+1970） 约28万年


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
    timeconv:  处理一段时间的计算 将一定毫秒数 转化为多少年多少月..几时几分几秒 返回 一个对象


5.一个角度
时区：对于自然语言时间模型的概念会有一个时区设置方法，以输出多角度的当前时间模型，有以下3个方式设置时区角度
默认时区： 东八区，北京，480

    tzset  E1-E12 W1-W12  24个时区范围东1到东12区，西1到西12区
    tzmiset 设置与GMT时间的偏移分钟数 +/-480
    tzcityset  设置以某个城市拼写所在的时区为准，
支持以下城市：

    beijing,...

此外还有一些透明的辅助工具方法，被以上这些暴露出去的使用方法所调用。
统一归纳在util对象下实现: 

    bnplus   大数加法
    bnminus  大数减法
    bnmultip 大数乘法
    bndivis  大数除法
    bnmod    大数取余
    bnisnega    判断是否是负数
    bnabscomp   比较两数的绝对值大小
 
