/*
纵向滚动
var g=new Marquee('myMqbox',{//滚动框
    panel:'myMarquee',//最外层容器,在有按钮的时候
    prev:'prev',//按钮ID
    next:'next',//按钮ID
    dir:-1,//滚动方向
    diff:20,//手动设置单元距离，自动取容器大小
    time:20,//移动一个单元耗费的时间
    pow:.5,//动画变速
    interval:1000//滚动间隔
});
横向滚动,默认
var w=new Marquee('xx',{hor:true});
//对横向设置 interval与pow可以创建停顿动画
*/
function Marquee(el,more){
    var el=this.get(el),_diff='offsetHeight',scrolldir='scrollTop',intervalSize='scrollHeight';
    var html=el.innerHTML.replace(/^\s+|\s+$|\n/mg,''),_Mq=this;//去掉内容前后空隙，防止跳动
    el.innerHTML=html+html;
    more=more||{};
    if(more.hor){//设置水平滚动
        _diff='offsetWidth';
        scrolldir='scrollLeft';
        intervalSize='scrollWidth';
        more.time=more.time||40;
        more.interval=more.interval||more.time
    };
    var state={panel:el,scrollbox:el,_n:0,interval:1800,
        diff:el[_diff],dir:1,timer:null,hover:false,time:20};
    for(var k in more)state[k]=more[k];
    for(var k in state)this[k]=state[k];
    this.fixDir=this.dir;//记录初始方向
    this.panel=this.get(this.panel);
    this.prev=this.get(this.prev);
    this.next=this.get(this.next);
    //悬浮停止
    this.panel.onmouseover=function(e){if(!_Mq.ishover(e,this)){_Mq.hover=true;_Mq.stop()}};
    this.panel.onmouseout=function(e){if(!_Mq.ishover(e,this)){_Mq.hover=false;_Mq.stop().scroll()}};
    //按钮添加事件
    if(this.prev)this.prev.onclick=function(){_Mq._to(-1)};
    if(this.next)this.next.onclick=function(){_Mq._to(1)};
    this.scrollDir=scrolldir;
    this.startTime=+new Date;
    setTimeout(function (){
        _Mq.f=parseInt(el[intervalSize]/2);//稍后获取最大高度
        _Mq.scrollbox[_Mq.scrollDir]=0;//滚动条复位
        _Mq.scroll();
    },200)
};
Marquee.prototype={
    get:function (el){//ID to Object
        return typeof el=="string"?document.getElementById(el):el
    },
    ishover:function (e,el){//测试是否是内部事件
        var f,e=e||window.event;
        f=e[{'mouseout':'toElement','mouseover':'fromElement'}[e.type]] || e.relatedTarget;
        if(f)while(f&&f.tagName){if(f==el)return true;f=f.parentNode};
        return false
    },
    scroll:function (x){
        var _Mq=this,box=_Mq.scrollbox,attr=_Mq.scrollDir,pow=this.pow?this.pow:(this.hor?1:2);
        if(arguments.length>0)x=((x-1)*this.diff)%this.f;//定位滚动
        function go(x){
            var target=x||box[attr]+_Mq.dir*_Mq.diff;
            _Mq.fxing=true;//移动中
            _Mq.curTimer=_Mq.fx(box[attr],target,function (i){
                 var to=i%_Mq.f;
                 box[attr]=to+(to<0?_Mq.f:0)
            },function (){
                _Mq.fxing=false;
                box[attr]%=_Mq.f;//超出1/2复位
                _Mq.dir=_Mq.fixDir;//临时方向复位
                if(!_Mq.hover)
                    _Mq.nextTimer=setTimeout(go,_Mq.interval);
            },_Mq.diff*_Mq.time,pow)
        };
        if(this.hor&&this.interval<=this.time||!_Mq.fxing)go(x)
    },
    stop:function (el){
        if(this.interval<=this.time)clearInterval(this.curTimer);
        clearTimeout(this.nextTimer);
        return this
    },
    fx:function (f,t,fn,ed,tm,pow){
        var D=Date,d=new D,e,ed=ed||D,c=tm||240,pow=pow||2;
        return e=setInterval(function (){
            var z=Math.min(1,(new D-d)/c);
            if(false===fn(+f+(t-f)*Math.pow(z,pow),z)||z==1)ed(clearInterval(e))
        },10)
    },
    //垂直滚动时移动一个单元
    _to:function (x){this.dir=x;this.stop().scroll()},
    to:function (x){this.stop().scroll(x)}
};