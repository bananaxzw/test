
var Drag = function (target, options) {
	this.init.apply(this, arguments);
};
Drag.prototype = {
	target	: null,	// ҪDrag��Ԫ��
	parentOffset: {left:0,top:0}, // ���һ����λ�ĸ�����(target.offsetParent)Ԫ���ڵ�ǰ�ӿڵ����ƫ��
	info : { left:0, top:0,	width:0, height:0,
		pageLeft:0,	// Ԫ������ڵ�ǰ�ӿ�left��ƫ��
		pageTop:0	// Ԫ������ڵ�ǰ�ӿ�top��ƫ��
	},
	option : {
		boundLeft	: 0,// ��߽�
		boundTop	: 0,// �ϱ߽�
		boundRight	: 9999,//�ұ߽�
		boundBottom : 9999,//�±߽�
		dragging : null,	//���϶�ʱ���õĻص�����,����Ϊinfo
		complete : null		//���϶�����ʱ���õĻص�����,����Ϊinfo
	},
	// ��ʼ��
    init : function(target, options) {
		this.target = target;
		var o = $(this.target).offset();
		// ��ʼ��info
		this.info.pageLeft = o.left;
		this.info.pageTop  = o.top;
		this.info.width	   =  $(target).width();
		this.info.height   =  $(target).height();
		// Ĭ����target.offsetParent���ı�Ϊ�߽�
		this.parentOffset  = $(this.target.offsetParent).offset();
		this.option.boundLeft	= this.parentOffset.left;
		this.option.boundTop	= this.parentOffset.top;
		this.option.boundRight	= this.parentOffset.left + $(target.offsetParent).width();
		this.option.boundBottom = this.parentOffset.top + $(target.offsetParent).height();
		// ����ѡ��
		$.extend(this.option, options);
		this.draggingHendler = this.eventMethod(this, 'onDragging');
		this.completeHendler = this.eventMethod(this, 'onComplete');
	},
	// ��ʼ
	start:function(e) {
		// ���λ��
		this.oPos = {x : e.pageX||(this.info.pageLeft + parseInt(this.info.width / 2)),
					 y : e.pageY||(this.info.pageTop + parseInt(this.info.height / 2))};
		$(document).bind('mousemove', this.draggingHendler);
		$(document).bind('mouseup'	, this.completeHendler);
		// ��ֹ�¼�����
		e.stopPropagation();
		e.preventDefault();
	},
	// ֹͣ
	stop: function() {this.onComplete();},
	// left,top��parentOffsetΪԭ��
	drag: function(left, top) {
		this.info.left = left;
		this.info.top  = top;
		$(this.target).css({'left':left, 'top':top,	'width':this.info.width,'height':this.info.height});
		if($.isFunction(this.option.dragging)) this.option.dragging(this.info);
	},
	onDragging: function(e) {
		// ����Ԫ������ڵ�ǰ�ӿڵ�ƫ��
		// this.oPos Ϊ���ԭ�����ڵĵ�
		// e.page Ϊ����������ڵĵ�
		// ����������������(e.page - this.oPos) �͵õ���target���ƶ�������,
		// ��target���Ͻǵĵ�������͵õ���this.info.pageLeft �� this.info.pageTop
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
