JSON2Tree = function(ini) {
	for (var k in ini) this.ini[k] = ini[k];
	this.box = ini.shell.big ? document.getElementById(ini.shell) : ini.shell;
	this.json = [{text: ini.caption || 'Root',items: ini.json}];
    this.addStyle(this.style);
	this.addSub(this.json, this.box);
    this.box.className+=" JSONTreeBox";
	this.box.getElementsByTagName("DD")[0].style.display = '';
	this.toggle(this.box.getElementsByTagName("DT")[0], true);
};
JSON2Tree.prototype = {
	ini: {
		root: 'base.gif',
        url:'',
		folder: 'folder.gif',
		folderOpen: 'folderopen.gif',
		file: 'page.gif',
		empty: 'empty.gif',
		line: 'line.gif',
		join: 'join.gif',
		joinBottom: 'joinbottom.gif',
		plus: 'plus.gif',
		plusBottom: 'plusbottom.gif',
		minus: 'minus.gif',
		minusBottom: 'minusbottom.gif',
		nlPlus: 'nolines_plus.gif',
		nlMinus: 'nolines_minus.gif',
        show:'none',
	    onItemClick: function(){},
	    onFolderClick: function(){}
	},
	UI: function(_) {return document.createElement(_)},
	addSub: function(node, shell) {
		if (node == null) return;
		if (node instanceof Array) {
			for (var i = 0; i < node.length; i++) {
				var $ = this.ini;
				node[i].last = (i == (node.length - 1));
				this.addSub(node[i], shell);
			};
		} else {
			var caption = this.UI('DT'),_shell = this.UI('DL'),body = this.UI('DD'),$ = 'appendChild';
			_shell[$](caption);
			_shell[$](body);
			shell[$](_shell);
			_shell.last = node.last;
			body.style.display = this.ini.show;
			_tree = this;
			if (node.items)
				this.addSub(node.items, body);
			caption.innerHTML = this.getLineList(_shell) + this.getIcoList(node) + '<a href="javascript:void(0)" title="' + (node.title || node.text) + '"><span>' + node.text + '</span></a>';
			caption.onclick = function() {
				var $ = _tree.next(this),isOpen = $.style.display != 'none';
				if ($)
					$.style.display = isOpen ? 'none': '';
                if(_tree.focus)_tree.focus.className='';
                _tree.focus=this;
                _tree.focus.className='focus';
				if ($.innerHTML != '') {
					_tree.toggle(this, !isOpen);
					_tree.ini.onFolderClick.call(node);
				} else {
					_tree.ini.onItemClick.call(node);
				}
			};
            caption.ondblclick = function() {_tree.show(this)};
		};
	},
	getIcoList: function(node) {
        var off=this.ini.show=='none'?[this.ini.plusBottom, this.ini.plus]:[this.ini.minusBottom,this.ini.minus];
		with(this.ini) return '<img src="'+url + (node.items ? (node.last ? off[0]: off[1]): (node.last ? joinBottom: join)) + '" />' + '<img src="' + url+ (node.items ?(show=='none'?folder:folderOpen): (node.icon || file)) + '" />';
	},
	getLineList: function(node) {
		node = node.parentNode;
		var list = [],$ = this.ini;
		while (node != null && node !== this.box && node!=document.body) {
			if (node.tagName.toUpperCase() == 'DL') list.push('<img src="'+$.url + (node.last ? $.empty: $.line) + '" />');
			node = node.parentNode;
		};
		list.reverse();
		return list.join('');
	},
	show: function($) {
		var dls = this.box.getElementsByTagName("DD");
		var dts = this.box.getElementsByTagName("DT");
		for (var i = 0; i < dls.length; i++) {
			dls[i].style.display = $ === false ? 'none': '';
			if (dls[i].innerHTML != '') this.toggle(dts[i], $ !== false)
		}
		this.allOpen = $ === false;
	},
	next: function(node) {
		var $ = node,_ = 'nextSibling';
		for ($ = $[_]; $; $ = $[_])
			if ($.nodeType == 1)
				return $;
		return null;
	},
	toggle: function(node, isOpen) {
		var imgs = node.getElementsByTagName('IMG'),f = imgs.length - 1,$ = this.ini;
		imgs[f].src = $.url+( isOpen ? $.folderOpen: $.folder);
		if (this.next(node.parentNode))
			return imgs[f - 1].src =$.url+ (isOpen ? $.minus: $.plus);
		imgs[f - 1].src =$.url+ (isOpen ? $.minusBottom: $.plusBottom);
	},
    addStyle:function (cssText){
        var d=document,n = d.createElement("style");
        n.setAttribute("type", "text/css");
        if (n.styleSheet) {n.styleSheet.cssText = cssText} 
        else if (d.getBoxObjectFor) {n.innerHTML += cssText} 
        else {n.appendChild(d.createTextNode(cssText))}
        d.getElementsByTagName('head')[0].appendChild(n)
    },
    style:".JSONTreeBox dd,.JSONTreeBox dl,.JSONTreeBox dt{padding:0;margin:0;border:none;font-size:12px;}"
        +".JSONTreeBox dt img{vertical-align:middle;}"
        +".JSONTreeBox dt {width:18px;height:18px;}"
        +".JSONTreeBox dt{white-space:nowrap;}"
        +".JSONTreeBox a{color:#333;text-decoration:none;padding-left:4px;}"
        +".JSONTreeBox a:hover,.JSONTreeBox .focus a{background:#990000;color:#EEE;}"
};
;
/*
new JSON2Tree({
	url:'img_tree/',// 图标path 
	caption:'我的函数', // 根节点名 
	json:testJson, // json 变量
	shell:'dhooo_tree', // 树容器 
	onItemClick:function(){},// 文件点击事件 
	onFolderClick:function(){}// 文件夹点击事件 
});
*/
