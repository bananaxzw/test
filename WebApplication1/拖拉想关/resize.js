var Resize = function (target, options) {
	this.init.apply(this, arguments);
};
Resize.prototype = {
	target	: null,	// 要Resize的元素
	parentOffset: {left:0,top:0}, // 最近一个定位的父对象(target.offsetParent)元素在当前视口的相对偏移
	info : { left:0, top:0,	width:0, height:0,
		pageLeft:0,	// 元素相对于当前视口left的偏移
		pageTop:0	// 元素相对于当前视口top的偏移
	},
	option : {
		direction :'',	// 调整的方向
		minWidth : 20,	// 限制最小宽度
		minHeight: 20,	// 限制最小高度
		boundLeft	: 0,// 左边界
		boundTop	: 0,// 上边界
		boundRight	: 9999,//右边界
		boundBottom : 9999,//下边界
		resizing : null,	//在调整大小时会调用的回调函数,参数为info
		complete : null		//在调整大小时结束时调用的回调函数,参数为info
	},
	// 初始化
    init : function(target, options) {
		this.target = target;
		// 默认以target.offsetParent的四边为边界
		this.parentOffset = $(this.target.offsetParent).offset();
		this.option.boundLeft	= this.parentOffset.left;
		this.option.boundTop	= this.parentOffset.top;
		this.option.boundRight	= this.parentOffset.left + $(target.offsetParent).width();
		this.option.boundBottom = this.parentOffset.top + $(target.offsetParent).height();
		// 设置选项
		$.extend(this.option, options);
		this.resizingHendler = this.eventMethod(this, 'onResizing');
		this.completeHendler = this.eventMethod(this, 'onComplete');
	},
	// 开始
	start:function(e, direction) {
		// 设置方向
		if(!this.setDirection(direction || this.option.direction)) {
			return false;
		}
		var o = $(this.target).offset();
		// oPos 始终表示左上角的那个点
		// iPos 始终表示右下角的那个点
		this.oPos = {x:o.left, y:o.top};
		this.iPos = {x:this.oPos.x + $(this.target).width(), y:this.oPos.y + $(this.target).height()};
		$(document).bind('mousemove', this.resizingHendler);
		$(document).bind('mouseup'	, this.completeHendler);
		// 阻止事件传播
		e.stopPropagation();
		e.preventDefault();
	},
	// 停止
	stop: function() {this.onComplete();},
	// 设置方向, 以向量this.vector保存方向.共八个方向
	setDirection : function(direction) {
		switch(direction) {
		case 'west'	:this.vector = {x:-1,y: 0};break;
		case 'east'	:this.vector = {x: 1,y: 0};break;
		case 'north':this.vector = {x: 0,y:-1};break;
		case 'south':this.vector = {x: 0,y: 1};break;
		case 'north-west':this.vector = {x:-1,y:-1};break; 
		case 'south-west':this.vector = {x:-1,y: 1};break; 
		case 'north-east':this.vector = {x: 1,y:-1};break; 
		case 'south-east':this.vector = {x: 1,y: 1};break;
		default:return false;
		}
		return true;
	},
	// left,top以parentOffset为原点
	resize: function(left, top, width, height) {
		this.info = {'left':left, 'top':top, 'width':width, 'height':height,pageLeft:this.oPos.x,pageTop:this.oPos.y};
		$(this.target).css({'left':left, 'top':top,	'width':width,'height':height});
		if($.isFunction(this.option.dragging)) this.option.dragging(this.info);
	},
	onResizing: function(e){
		// 修正X,Y
		var x = Math.max(Math.min(e.pageX, this.option.boundRight), this.option.boundLeft);
		var y = Math.max(Math.min(e.pageY, this.option.boundBottom), this.option.boundTop); 
		 // 依次为向西,东,北,南方向调整
		if(this.vector.x === -1) this.oPos.x = Math.min(x, this.iPos.x - this.option.minWidth);
		if(this.vector.x ===  1) this.iPos.x = Math.max(x, this.oPos.x + this.option.minWidth);
		if(this.vector.y === -1) this.oPos.y = Math.min(y, this.iPos.y - this.option.minHeight);
		if(this.vector.y ===  1) this.iPos.y = Math.max(y, this.oPos.y + this.option.minHeight);
		this.resize(this.oPos.x - this.parentOffset.left, this.oPos.y-this.parentOffset.top, this.iPos.x - this.oPos.x, this.iPos.y - this.oPos.y);
		return false;
	},
	onComplete: function() {
		$(document).unbind('mousemove', this.resizingHendler);
		$(document).unbind('mouseup'  , this.completeHendler);
		if($.isFunction(this.option.complete)) this.option.complete(this.info);
		return false;
	},
	eventMethod: function(instance, method) {return function(event) { return instance[method](event, this); };}
};
