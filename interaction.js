(function($){
  $.fn.scrollerD = function(opts){
    if(!this.length){return};
    opts = $.extend({},$.scrollerD.defaults,opts);
    var $wrap = this, $subObj,
    pType, subType,itemHeigth,currentArr=[1,1],selectArr=[],_dis=[],
    _max=[], _min=[], scrollerD = {},level=1;

    scrollerD.init = function(){
      itemHeigth = opts.itemHeigth;
      level = opts.data.length;
      scrollerD.reset(_min, level, itemHeigth);//初始化向上滑动的最大距离
      scrollerD.createWrap();//生成选中行以及确认按钮
      $subObj = $wrap.find('.wrapper');
      $subObj.width(100/level + '%');
      scrollerD.createUI(opts.data[0], $subObj.eq(0), 0);//生成一级数据的dom结构
      for(var i = 1; i < level; i++){
        scrollerD.createUI(opts.data[i][selectArr[i-1]], $subObj.eq(i), i);
      }
      $wrap.on('touchmove', function(e){e.preventDefault();});
      $subObj.swipeUp(scrollerD.swipeUp);
      $subObj.swipeDown(scrollerD.swipeDown);
      $wrap.find('.confirm').on('click', scrollerD.confirmHanlder);
    };
    scrollerD.animateTransform = function(obj, dis){
      var value = {'transform': 'translate3d(0, ' + dis
      + 'px, 0)','-webkit-transform': 'translate3d(0, '
      + dis + 'px, 0)'};
      obj.css(value);
    };
    scrollerD.createWrap = function(){
      var htmlArr = ['<div class="selected bboth">'];
      htmlArr.push(opts.selectHtml, '</div><div class="header"><span class="confirm">确定</span></div>');
      for(var i = 0; i < level; i++){
        htmlArr.push('<div class="wrapper"><div class="scroller"></div></div>');
      }
      $wrap.append(htmlArr.join(''));
    }
    scrollerD.createUI = function(data, el, index){
      var $el = el.find('.scroller');
      $el.empty();
      if(!data){return;}
      var $ul = $('<ul>');
      $.each(data, function(attr, valu){
        $ul.append('<li data-id='+ attr+ '>'+valu+'</li>');
      });
      $el.append($ul);
      scrollerD.getBoundary($el.find('li').length, index);
    };
    scrollerD.swipeUp = function(e){
      var index = $subObj.index(this), subId;
      if(_dis[index] === _max[index]){return;}//滚动到最底下，不用再滚动了。
      _dis[index] = _dis[index] - itemHeigth;
      if(_dis[index] < _max[index]){_dis[index] = _max[index];}
      scrollerD.animateTransform($(this).find('.scroller'), _dis[index]);
      currentArr[index] = currentArr[index] + 1;
      subId = $(this).find('li').removeClass('active')
        .eq(currentArr[index]).addClass('active').attr('data-id');
      if((index+1) !== level){scrollerD.updateSubEle(subId, index);}
      selectArr[index] = subId;
    };
    scrollerD.swipeDown = function(e){
      var index = $subObj.index(this), subId;
      if(_dis[index] === _min[index]){return;}//滚动到最上面，不用再滚动了。
      _dis[index] = _dis[index] + itemHeigth;
      if(_dis[index] > _min[index]){_dis[index] = _min[index];}
      scrollerD.animateTransform($(this).find('.scroller'), _dis[index]);
      currentArr[index] = currentArr[index] - 1;
      subId = $(this).find('li').removeClass('active')
        .eq(currentArr[index]).addClass('active').attr('data-id');
      if((index+1) !== level){scrollerD.updateSubEle(subId, index);}
      selectArr[index] = subId;
    };
    scrollerD.updateSubEle = function(subId, index){
      scrollerD.createUI(opts.data[index+1][subId], $subObj.eq(index+1), index+1);
    };
    scrollerD.confirmHanlder = function(){
      var typeStr = '';
      for(var i = 0; i < level; i++){
        if(!selectArr[i]){
          return typeStr;
        }
        if(i === 0){
          typeStr += opts.data[i][selectArr[0]];
        }else{
          typeStr += ' ' + opts.data[i][selectArr[i-1]][selectArr[i]];
        }
      }
      scrollerD.selectVal = typeStr;
      opts.confirmHandler(typeStr);
      $wrap.add(opts.mask).hide();
      $(' body').removeClass('stshow');
    };
    scrollerD.getBoundary = function(subCount, index){
      switch(subCount){
        case 0:
          //从这一级开始到一级都不可滑动
          scrollerD.reset(_min, level, 0, index);
          scrollerD.reset(_max, level, 0, index);
          scrollerD.reset(_dis, level, 0, index);
          scrollerD.reset(selectArr, level, undefined, index);
          scrollerD.reset(currentArr, level, undefined, index);
          break;
        case 1:
          //当前级只有一个选项
          var subObjI = $subObj.eq(index);
          _max[index] = itemHeigth;
          selectArr[index] = subObjI.find('.scroller').eq(0).attr('data-id');
          scrollerD.animateTransform(subObjI.find('.scroller'), itemHeigth);//只有一个的时候滚动到当前元素
          subObjI.find('li').addClass('active');
          _dis[index] = itemHeigth;
          currentArr[index] = 0;
          break;
        default:
          var indexLi = 1, selectId = '',subObjI = $subObj.eq(index);
          _max[index] = (-1)*itemHeigth * (subObjI.find('li').length-2);
          if(opts.initData && opts.initData[index]){
            if($.isArray(opts.data[index])){//如果是array，则InitData是具体值，不是索引。
              opts.initData[index] = opts.data[index].indexOf(opts.initData[index]);
            }
            indexLi = subObjI.find('li[data-id="'+ opts.initData[index] +'"]')
              .addClass('active').index();
            selectId = opts.initData[index];
          }else{
            selectId = subObjI.find('li').eq(1).addClass('active').attr('data-id');
          }
          selectArr[index] = selectId;
          currentArr[index] = indexLi;
          _dis[index] = (-1)*(indexLi-1)*itemHeigth;
          scrollerD.animateTransform(subObjI.find('.scroller'), _dis[index]);
          opts.initData[index] = undefined;
      }
    };
    scrollerD.reset = function(arr, len, valu, start){
      start = start || 0;
      for(var i = start; i < len; i++){
        arr[i] = valu;
      }
    };
    scrollerD.init();
    if(opts.isShow){$wrap.add(opts.mask).show();}
    $(opts.trigger).on('click',function(){
      $wrap.add(opts.mask).show();
      return false;
    });
    $(opts.mask).on('click', function(){
      $wrap.add(opts.mask).hide();
    });
    return {
      selectArr: selectArr,//选择元素的id
      selectVal: scrollerD.selectVal
    }
  }

  $.scrollerD = {defaults:{
    selector: ['#wraSub'],//下一级
    itemHeigth: 40,//行高
    data: {},//一级数据
    subData: {},//二级数据
    isShow: true,
    trigger: '#inter',
    mask: '.mask',
    selectHtml: '',
    confirmHandler: function(){}
  }};
})(Zepto);