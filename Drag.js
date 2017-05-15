/**
 * Created by Seattle on 2017/5/15.
 */
;(function () {
  var transform=getTransform();

  /* item  拖拽元素 object id class
    type  是否限制于父元素  true false(默认)
    */
  function Drag(item,type) {
      this.elem=getElement(item);
      this.startX=0;
      this.startY=0;
      this.sourceX=0;
      this.sourceY=0;
      this.minX=0;
      this.minY=0;
      this.maxX=0;
      this.maxY=0;
      this.type=type||false;
      this.parentDiv=this.elem.parentNode;
      if(this.elem){
          this.init();
      }
  }

  Drag.prototype={
      constructor:Drag,
      init:function () {
          this.setDrag();
      },
      setDrag:function () {
          var _this=this;
          if(this.type){
             this.maxX=parseFloat(this.getStyle(this.parentDiv,'width'))-parseFloat(this.getStyle(this.elem,'width'));
             this.maxY=parseFloat(this.getStyle(this.parentDiv,'height'))-parseFloat(this.getStyle(this.elem,'height'));
          }
          //按下监听
          this.elem.addEventListener('mousedown',start,false);
          function start(event) {
              _this.startX=event.pageX;
              _this.startY=event.pageY;

              var pos=_this.getPosition();

              _this.sourceX=pos.x;
              _this.sourceY=pos.y;

              document.addEventListener('mousemove',move,false);
              document.addEventListener('mouseup',end,false);
          }
          function move(event) {
              var currentX=event.pageX;
              var currentY=event.pageY;

              var distanceX=currentX-_this.startX;
              var distanceY=currentY-_this.startY;

              var setX=(_this.sourceX+distanceX).toFixed();
              var setY=(_this.sourceY+distanceY).toFixed();

              if(_this.type){
                  setX=setX<_this.minX?_this.minX:setX>_this.maxX?_this.maxX:setX;
                  setY=setY<_this.minY?_this.minY:setY>_this.maxY?_this.maxY:setY;
              }
              _this.setPosition({
                  x:setX,
                  y:setY
              });
          }
          function end() {
              document.removeEventListener('mousemove',move);
              document.removeEventListener('mouseup',end);
          }
      },
      //获取元素样式值
      getStyle:function (elem,property) {
          var value=document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(elem,false)[property]:elem.currentStyle[property];
          return value;
      },
      //获取当前元素位置
      getPosition:function () {
          var pos={x:0,y:0};
          if(transform){
             var transformValue=this.getStyle(this.elem,transform);
             if(transformValue=='none'){
                 this.elem.style[transform]='translate(0,0)';
             }else{
                 var temp=transformValue.match(/-?\d+/g);
                 pos={
                     x:parseInt(temp[4].trim()),
                     y:parseInt(temp[5].trim())
                 }
             }
          }else{
              if(this.getStyle(this.elem,'position')=='static'){
                  this.elem.style.position='relative';
              }else{
                  pos={
                      x:parseInt(this.getStyle(this.elem,'left')?this.getStyle(this.elem,'left'):0),
                      y:parseInt(this.getStyle(this.elem,'top')?this.getStyle(this.elem,'top'):0),
                  }
              }
          }
          return pos;
      },
      //设置元素位置
      setPosition:function (pos) {
          if(transform){
              this.elem.style[transform]='translate('+pos.x+'px,'+pos.y+'px)';
          }else{
              this.elem.style.left=pos.x+'px';
              this.elem.style.top=pos.y+'px';
          }
      }
  }

//获取页面样式中的transform
  function getTransform() {
      var transform="",
          style=document.documentElement.style,
          transformArr=['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
          i=0,
          length=transformArr.length;
      for(;i<length;i++){
          if(transformArr[i] in style){
              transform=transformArr[i];
              return transform;
          }
      }
      return transform;
  }
  function getElement(item){
    if(typeof item=='object'){
        return item;
    }else if(item.match(/^#\w{1,}/g)){
        item=item.split('#')[1];
        return document.getElementById(item);
    }else if(item.match(/^\.\w{1,}/g)){
        item=item.split('.')[1];
        return document.getElementsByClassName(item)[0];
    }else{
        console.error('找不到元素！');
        return null;
    }
  }

    window.Drag=function (item,type) {
        return new Drag(item,type);
    };
})();