# interaction
支持两级联动，手机上滑动选择。依赖zepto.min.js和touch.js

数据的结构如下

`data = [{'01':"美食"}, {'01':{'0101': '小吃快餐'}}]`
data[0]是一级数据，data[1]是二级数据。

初始化使用
`$('#wraPar').scrollerD({selector: '#wraSub', data: [pType, subType], initData:['01', '0101']});`

initData分别是一级数据的id和二级数据的id。selector是包含二级数据的dom元素selector,是zepto支持的selector即可。