function SelectGroup(wrap,json,title,sub){
    this.wrap=typeof wrap=="string"?document.getElementById(wrap):wrap;
    this.data=json;
    if(title)this.title=title;
    if(sub)this.sub=sub;
    this.value=this.create(this.data)
};
SelectGroup.prototype={
    title:'t',//标题
    sub:'s',//子内容
    group:[],
    create:function (json){//创建select
        var path=[],_sg=this,sel=document.createElement('SELECT');
        this.group.push(sel);
        this.wrap.appendChild(sel);
        sel.onchange=function (){_sg._change(this)};
        for(var i=0,l=json.length;i<l;i++)
            sel.options.add(new Option(json[i][this.title],i,0,0));
        path.push(json[0][this.title]);
        if(json[0][this.sub])
            path.push(this.create(json[0][this.sub]));//如果有子数据，递归创建
        return path
    },
    _change:function (sel){
        var g=this.group,data=this.data;
        this.value=[];
        for(var i=0,l=g.length;i<l;i++){
            this.value.push(data[g[i].value][this.title]);
            data=data[g[i].value][this.sub];//查找当前select对应的数据
            if(g[i]==sel)break
        };
        for(i++;i<l;i++){
            if(data){
                g[i].innerHTML='';//清掉旧数据
                g[i].style.display='';//显示
                for(var j=0,n=data.length;j<n;j++)
                    g[i].options.add(new Option(data[j][this.title],j,0,0));//添加新的选项
                this.value.push(data[0][this.title]);
                data=data[0][this.sub]//数据后移                
            }else{
                g[i].style.display='none'//如果数据过少,其它的select隐藏
            }
        };
        data&&this.value.push(this.create(data));//如果还有数据没有select可显示，再创建select
        this.onchange(this.value)
    },
    onchange:function (vals){}
};