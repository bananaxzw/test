function Tip(){
    this.create();
    if(this.ie6)try{document.execCommand("BackgroundImageCache",false,true)}catch(e){};
    this.content.innerHTML = '<img src="tip_files/more.jpg" />'
};
Tip.prototype={
    offset:2,
    delay:500,
    _current:null,
    ie6:window.ActiveXObject&&!window.XMLHttpRequest,
    ismove:function (e,el){//测试是不是冒泡事件
        var f,e=e||window.event,map={'mouseout':'toElement','mouseover':'fromElement'};
        f=e[map[e.type]] || e.relatedTarget;
        if(f)while(f&&f.tagName){if(f==el)return true;f=f.parentNode};
        return false
    },
    bind:function (nodes){//添加tip
        var _Tip=this;
        for(var i=0,l=nodes.length;i<l;i++){
            nodes[i].onmouseover=function (e){
                if(this===_Tip._current)return;
                _Tip._current=this;
                var _node=this;
                _Tip.showTimer=setTimeout(function (){//延时显示
                    var html=_Tip.setHtml(_node);
                    if(html)
                        _Tip.content.innerHTML=html;
                    var r=_Tip.pos(_node),
                        doc=_Tip.view(),
                        tip=_Tip.tip,
                        h=tip.offsetHeight,
                        w=tip.offsetWidth,
                        tip_top=r.top;
                    if(r.top+h>doc.top+doc.height)
                        tip_top=doc.top+doc.height-h;
                    _Tip.tip.style.top=Math.max(tip_top,doc.top)+'px';
                    if(doc.width+doc.left<r.right+w){
                        _Tip.tip.style.left=r.left-w-_Tip.offset+'px';
                        _Tip.arrow.className='arrow_right';
                        if(_Tip.ie6)
                            _Tip.arrow.style.right=-(w%2)+'px';
                    }else{
                        _Tip.arrow.className='arrow_left';                  
                        _Tip.tip.style.left=r.left+_node.offsetWidth+_Tip.offset+'px'
                    };
                    _Tip.arrow.style.top=Math.min(h-25,Math.max(0,r.top-parseInt( tip.style.top)+_node.offsetHeight/2))+'px';
                    _Tip.fadeIn()
                },_Tip.delay)
            };
            nodes[i].onmouseout=hide
        };
        _Tip.tip.onmouseover=function (e){
            clearTimeout(_Tip.hideTimer);    
        };
        _Tip.tip.onmouseout=hide;
        function hide(e){
            clearTimeout( _Tip.showTimer);
            if(_Tip.ismove(e,this))return;
             _Tip.hideTimer=setTimeout(function (){
                 _Tip._current=null;
                  _Tip.tip.style.left='-99999px';
            },100);           
        }
    },
    setHtml:function (el){},//设置内容
    create:function (){//创建tip层
        this.tip=document.createElement('DIV');
        this.tip.className='tip_wrap';
        document.body.appendChild(this.tip);
        this.content=document.createElement('DIV');
        this.content.className='tip_content';
        this.tip.appendChild(this.content);
        this.arrow=document.createElement('SPAN');
        this.tip.appendChild(this.arrow);
    },
    pos:function(el){//计算位置
        var R=el.getBoundingClientRect(),r={};
        var d=document,dd=d.documentElement,db=d.body,X=Math.max;
        for(var k in R)r[k]=R[k];
        r.left+=X(dd.scrollLeft,db.scrollLeft)-(dd.clientLeft||db.clientLeft||0);
        r.top+=X(dd.scrollTop,db.scrollTop)-(dd.clientTop||db.clientTop||0);
        return r
    },
    doc:document.compatMode == "CSS1Compat"?document.documentElement:document.body,
    view:function (){//计算窗口尺寸
        var d=document,dd=d.documentElement,db=d.body;
        return {
            left:Math.max(dd.scrollLeft,db.scrollLeft),
            top:Math.max(dd.scrollTop,db.scrollTop),
            width:this.doc.clientWidth,
            height:this.doc.clientHeight
        }
    },
    fadeIn:function (){
        var tip=this.tip,_Tip=this;
        this.set(tip,0);
        this.fx(0,1,function (x){_Tip.set(tip,x)},function (){_Tip.set(tip,null)})
    },
    set:function (tip,x){
        tip.style.filter=x==null?x:"progid:DXImageTransform.Microsoft.Alpha(opacity="+(x*100)+")";
        tip.style.opacity=x==null?'auto':x        
    },
    fx:function (f,t,fn,end){
        var D=Date,d=new D,e,c=320;
        return e=setInterval(function (){
            var z=Math.min(1,(new D-d)/c);
            if(false===fn(+f+(t-f)*Math.pow(z,1.5),z)||z==1)end(clearTimeout(e))
        },10)
    }
};