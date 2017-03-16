# datePicker
日期选择器

## 使用示意

1. 引入css和js文件，例如

``` html
<link rel="stylesheet" href="datePicker.css">
<script src="datePicker.js"></script>
```

2. 使用方法
``` javascript
  调用DatePicker(el, options)
  1.el:是需要绑定的元素(必须)
  2.options:配置选项，可以是回调方法(可选)
```

## 配置

以下默认配置
``` options
var update = DatePicker(app,//绑定元素(必须)
      {startDate: '2017-02-21',//开始日期(可选)
      endDate: '2017-04-15',//结束日期(可选)
      currentDate: '2017-03-15',//现在所选择的日期(可选)
      disabled: false,//是否禁用选择日期(默认false，可选)
      callback: function(date){}})//回调函数,参数date是一个包含year，month，date的时间对象(可选)
```
如果option是方法，赋值给options的callback方法

DatePicker方法返回的是一个update方法，用于更新currentDate属性，格式update('2017-03-15')

## 说明
有问题，欢迎提出
