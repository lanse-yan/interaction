(function($){
  /*
    PType subType:生成分类的数据。其中pType是一级数据，subType是二级数据
      当pType为空时，会没有任何分类可展示;当PType或subType中只有一条分类，则选
      择这条数据且不可滚动。
    itemHeight：行高，这里设置成40px.如果有变动，请修改这个变量。
    currentArr：当前选择的分类的index([parIndex, subIndex])，指的是画面上的序数而非id
    selectArr: 当前选择的分类的Id([parId, subId])，指的是数据中的id
    _dis: 当前选择分类的分别移动的距离
    _maxPar, _minPar, _minSub, _maxSub分别指分类的可以移动的最大值和最小值
  */
  $.fn.scrollerD = function(opts){
    if(!this.length){return};
    opts = $.extend({},$.scrollerD.defaults,opts);
    var obj = this, subObj = $(opts.selector),
    pType, subType,itemHeigth,currentArr=[1,1],selectArr=[],_dis=[0,0],
    _maxPar, _minPar, _minSub, _maxSub, scrollerD = {};

    scrollerD.init = function(){
      pType = opts.data[0];
      subType = opts.data[1];
      itemHeigth = opts.itemHeigth;
      _minPar =  _minSub = itemHeigth;
      scrollerD.createUI(pType, obj, true);
      scrollerD.createUI(subType[selectArr[0]], subObj);
      obj.add(subObj).on('touchmove', function(e){e.preventDefault();});
      obj.swipeUp(scrollerD.swipeUp);
      obj.swipeDown(scrollerD.swipeDown);
      subObj.swipeUp(scrollerD.swipeSubUp);
      subObj.swipeDown(scrollerD.swipeSubDown);
      $(opts.confirm).on('click', scrollerD.confirmHanlder);
    };
    scrollerD.animateTransform = function(obj, dis){
      var value = {'transform': 'translate3d(0, ' + dis
      + 'px, 0)','-webkit-transform': 'translate3d(0, '
      + dis + 'px, 0)'};
      obj.css(value);
    };
    scrollerD.createUI = function(data,el,isPar){
      var $el = el.find('.scroller');
      $el.empty();
      if(!data){return;}
      var $ul = $('<ul>');
      $.each(data, function(attr, valu){
        $ul.append('<li data-id='+ attr+ '>'+valu+'</li>');
      });
      $el.append($ul);
      if(isPar){
        scrollerD.getPboundary(obj.find('li').length);
      }else{
        scrollerD.getSboundary(subObj.find('li').length);
      }
    };
    scrollerD.swipeUp = function(e){
      var subId;
      if(_dis[0] === _maxPar){return;}//滚动到最底下，不用再滚动了。
      _dis[0] = _dis[0] - itemHeigth;
      if(_dis[0] < _maxPar){_dis[0] = _maxPar;}
      scrollerD.animateTransform($(this).find('.scroller'), _dis[0]);
      currentArr[0] = currentArr[0] + 1;
      subId = $(this).find('li').removeClass('active')
        .eq(currentArr[0]).addClass('active').attr('data-id');
      scrollerD.updateSubEle(subId);
    };
    scrollerD.swipeDown = function(e){
      if(_dis[0] === _minPar){return;}//滚动到最上面，不用再滚动了。
      _dis[0] = _dis[0] + itemHeigth;
      if(_dis[0] > _minPar){_dis[0] = _minPar;}
      scrollerD.animateTransform($(this).find('.scroller'), _dis[0]);
      currentArr[0] = currentArr[0] - 1;
      var subId = $(this).find('li').removeClass('active')
        .eq(currentArr[0]).addClass('active').attr('data-id');
      scrollerD.updateSubEle(subId);
    };
    scrollerD.swipeSubUp = function(e){
      if(_dis[1] === _maxSub){return;}//滚动到最底下，不用再滚动了。
      _dis[1] = _dis[1] - itemHeigth;
      if(_dis[1] < _maxSub){_dis[1] = _maxSub;}
      scrollerD.animateTransform($(this).find('.scroller'), _dis[1]);
      currentArr[1] = currentArr[1] + 1;
      var subId = $(this).find('li').removeClass('active')
        .eq(currentArr[1]).addClass('active').attr('data-id');
      selectArr[1] = subId;
    };
    scrollerD.swipeSubDown = function(e){
      if(_dis[1] === _minPar){return;}//滚动到最上面，不用再滚动了。
      _dis[1] = _dis[1] + itemHeigth;
      if(_dis[1] > _minSub){_dis[1] = _minSub;}
      scrollerD.animateTransform($(this).find('.scroller'), _dis[1]);
      currentArr[1] = currentArr[1] - 1;
      var subId = $(this).find('li').removeClass('active')
        .eq(currentArr[1]).addClass('active').attr('data-id');
      selectArr[1] = subId;
    };
    scrollerD.updateSubEle = function(subId){
      scrollerD.createUI(subType[subId], subObj);
      selectArr[0] = subId;
    };
    scrollerD.confirmHanlder = function(){
      var typeStr = '';
      if(!selectArr[0]){
        typeStr = '';
      }else if(!selectArr[1]){
        typeStr = pType[selectArr[0]] + '';
      }else{
        typeStr = pType[selectArr[0]] + ' '
        + subType[selectArr[0]][selectArr[1]];
      }
      $('#typeD').html(typeStr);
      $('body').removeClass('stshow');
    };
    scrollerD.getPboundary = function(subCount){
      switch(subCount){
        case 0:
          _maxPar = _minPar = _minSub = _maxSub = 0;
          selectArr = [];
          currentArr = [];
          break;
        case 1:
          _maxPar = itemHeigth;
          selectArr[0] = $('#wraPar').find('li').eq(0).attr('data-id');
          scrollerD.animateTransform(obj.find('.scroller'), itemHeigth);//只有一个的时候滚动到当前元素
          obj.find('li').addClass('active');
          _dis[0] = itemHeigth;
          currentArr[0] = 0;
          break;
        default:
          _maxPar = (-1)*itemHeigth * (obj.find('li').length-2);
          var index = 1, selectId = '';
          if(opts.initData && opts.initData[0]){
            index = obj.find('li[data-id="'+ opts.initData[0] +'"]')
              .addClass('active').index();
            selectId = opts.initData[0];
          }else{
            selectId = obj.find('li').eq(1).addClass('active').attr('data-id');
          }
          selectArr[0] = selectId;
          currentArr[0] = index;
          _dis[0] = (-1)*(index-1)*itemHeigth;
          scrollerD.animateTransform(obj.find('.scroller'), _dis[0]);
          opts.initData[0] = null;
      }
    };
    scrollerD.getSboundary = function(subCount){
      switch(subCount){
        case 0:
          _minSub = _maxSub = 0;
          selectArr[1] = undefined;
          currentArr[1] = undefined;
          break;
        case 1:
          _maxSub = itemHeigth;
          selectArr[1] = subObj.find('.scroller').eq(0).attr('data-id');
          scrollerD.animateTransform(subObj.find('.scroller'), itemHeigth);//只有一个的时候滚动到当前元素
          subObj.find('li').addClass('active');
          _dis[1] = itemHeigth;
          currentArr[1] = 0;
          break;
        default:
          _maxSub = (-1)*itemHeigth * (subObj.find('li').length-2);
          var index = 1, selectId = '';
          if(opts.initData && opts.initData[1]){
            index = subObj.find('li[data-id="'+ opts.initData[1] +'"]')
              .addClass('active').index();
            selectId = opts.initData[1];
          }else{
            selectId = subObj.find('li').eq(1).addClass('active').attr('data-id');
          }
          selectArr[1] = selectId;
          currentArr[1] = index;
          _dis[1] = (-1)*(index-1)*itemHeigth;
          scrollerD.animateTransform(subObj.find('.scroller'), _dis[1]);
          opts.initData = null;
      }
    };
    scrollerD.init();
  }

  $.scrollerD = {defaults:{
    selector: '#wraSub',//下一级
    itemHeigth: 40,//行高
    data: {},//一级数据
    subData: {},//二级数据
    confirm: '#confirm'//确定
  }};
})(Zepto);