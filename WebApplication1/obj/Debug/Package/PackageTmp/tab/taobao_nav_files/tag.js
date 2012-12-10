/*
Tag通用类
方法：focus(index)#焦点移动到第index个按钮
事件：onchange(prev,current)#在按钮焦点变换后发生,返回false将取消主体显隐动作
调用方法:
    var myTag=new Tag('head__tag__hotClass__blurClass');
    myTag.focus(3);
ID由参数合成: 头__按钮标签名__焦点类名__普通类名
默认主体ID由头__n构成，如: head__0
*/
var Tag=function(){
    this.init.apply(this,arguments)//把参数传给初始化函数init
};
Tag.prototype={
    current:0,//当前焦点索引
    get:function (el){//取得ID对应的对象
        return typeof el=="string"?document.getElementById(el):el;
    },
    init:function (nav,hover,time){//初始化
        var _=this.get(nav).id.split('__'),reg,test,tags,iscur,e=hover?'mouseover':'click',_this=this;
        tags=this.get(nav).getElementsByTagName(_[1]);
        reg='\\b'+_[2]+'\\b|'+(_[3]?'\\b'+_[3]+'\\b':'');
        test=RegExp(reg);
        this.del=RegExp(reg,'g');
        iscur=RegExp('\\b'+_[2]+'\\b');
        this.btns=[];
        this.opt=_.concat(['','']).slice(0,4);
        for(var i=0,n=0,l=tags.length;i<l;i++){
            el=tags[i];
            if(!test.test(el.className))continue;//过滤非类按钮
            if(iscur.test(el.className))this.current=n;
            el.radioIndex=n++;
            this.btns.push(el);
            if(e&&!isNaN(time)){//延时事件
                el.onmouseover=function(){
                    var __this=this;
                    this.tabTimer=setTimeout(function (){_this.focus(__this.radioIndex)},
                time)};
                el.onmouseout=function(){clearTimeout(this.tabTimer)}
            }else{
                el['on'+e]=function(){_this.focus(this.radioIndex)}
            }
        }
    },
    focus:function (next){//手动聚焦方法
        var a=this.current,b=next,c=this.opt;
        var b=b%this.btns.length,A=this.btns[a],B=this.btns[b];
        A.className=A.className.replace(this.del,'').replace(/\s+/g,' ')+' '+c[3];
        B.className=B.className.replace(this.del,'').replace(/\s+/g,' ')+' '+c[2];
        if(B.type=='radio'||B.type=='checkbox')B.checked=true;//为单复选框选中
        if(B.tagName=='options')B.selected=true;//为select对象选中
        this.current=b;
        if(false===this.onchange(a,b,A,B))return;//如果事件返回false，不再往下
        var cp=this.get(c[0]+'__'+a),np=this.get(c[0]+'__'+b);
        if(cp)cp.style.display='none';
        if(np)np.style.display=''
    },
    onchange:function(){}//聚焦事件，可以得到前后索引
};