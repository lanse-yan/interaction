# interaction
支持两级联动，手机上滑动选择。依赖zepto.min.js和touch.js

数据的结构如下

`data = [{'01':"美食"}, {'01':{'0101': '小吃快餐'}}, {'0101': {'010101': '面包甜点','010102': '面食','010103': '盒饭'}}]`
data[n]是n-1级数据。

初始化使用
`$('.interaction').scrollerD({data: data, initData:['01', '0101'],
        trigger:'#type',confirmHandler: function(typeStr){$('#typeD').html(typeStr);}});`

initData分别是一级数据的id和二级数据的id。trigger表现触发的显示的元素。confirmHandler表示获取选择结果
后的处理函数。