
var Drag = function (target, options) {
	this.init.apply(this, arguments);
};
Drag.prototype = {
	target	: null,	// 要Drag的元素
	parentOffset: {left:0,top:0}, // 最近一个定位的父对象(target.offsetParent)元素在当前视口的相对偏移
	info : { left:0, top:0,	width:0, height:0,
		pageLeft:0,	// 元素相对于当前视口left的偏移
		pageTop:0	// 元素相对于当前视口top的偏移
	},
	option : {
		boundLeft	: 0,// 左边界
		boundTop	: 0,// 上边界
		boundRight	: 9999,//右边界
		boundBottom : 9999,//下边界
		dragging : null,	//在拖动时调用的回调函数,参数为info
		complete : null		//在拖动结束时调用的回调函数,参数为info
	},
	// 初始化
    init : function(target, options) {
		this.target = target;
		var o = $(this.target).offset();
		// 初始化info
		this.info.pageLeft = o.left;
		this.info.pageTop  = o.top;
		this.info.width	   =  $(target).width();
		this.info.height   =  $(target).height();
		// 默认以target.offsetParent的四边为边界
		this.parentOffset  = $(this.target.offsetParent).offset();
		this.option.boundLeft	= this.parentOffset.left;
		this.option.boundTop	= this.parentOffset.top;
		this.option.boundRight	= this.parentOffset.left + $(target.offsetParent).width();
		this.option.boundBottom = this.parentOffset.top + $(target.offsetParent).height();
		// 设置选项
		$.extend(this.option, options);
		this.draggingHendler = this.eventMethod(this, 'onDragging');
		this.completeHendler = this.eventMethod(this, 'onComplete');
	},
	// 开始
	start:function(e) {
		// 鼠标位置
		this.oPos = {x : e.pageX||(this.info.pageLeft + parseInt(this.info.width / 2)),
					 y : e.pageY||(this.info.pageTop + parseInt(this.info.height / 2))};
		$(document).bind('mousemove', this.draggingHendler);
		$(document).bind('mouseup'	, this.completeHendler);
		// 阻止事件传播
		e.stopPropagation();
		e.preventDefault();
	},
	// 停止
	stop: function() {this.onComplete();},
	// left,top以parentOffset为原点
	drag: function(left, top) {
		this.info.left = left;
		this.info.top  = top;
		$(this.target).css({'left':left, 'top':top,	'width':this.info.width,'height':this.info.height});
		if($.isFunction(this.option.dragging)) this.option.dragging(this.info);
	},
	onDragging: function(e) {
		// 调整元素相对于当前视口的偏移
		// this.oPos 为鼠标原来所在的点
		// e.page 为鼠标现在所在的点
		// 将它们作向量运算(e.page - this.oPos) 就得到了target的移动的向量,
		// 用target左上角的点加上它就得到了this.info.pageLeft 和 this.info.pageTop
		this.info.pageLeft = Math.max(Math.min(this.info.pageLeft + e.pageX - this.oPos.x, this.option.boundRight  - this.info.width), this.option.boundLeft);
		this.info.pageTop  = Math.max(Math.min(this.info.pageTop  + e.pageY - this.oPos.y, this.option.boundBottom - this.info.height), this.option.boundTop);
		this.oPos = {x : e.pageX,y : e.pageY};
		this.drag(this.info.pageLeft - this.parentOffset.left, this.info.pageTop - this.parentOffset.top);
		return false;
	},
	onComplete: function() {
		$(document).unbind('mousemove', this.draggingHendler);
		$(document).unbind('mouseup'  , this.completeHendler);
		if($.isFunction(this.option.complete)) this.option.complete(this.info);
		return false;
	},
	eventMethod: function(instance, method) {return function(event) { return instance[method](event, this); };}
};
