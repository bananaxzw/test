var Resize = function (target, options) {
	this.init.apply(this, arguments);
};
Resize.prototype = {
	target	: null,	// ҪResize��Ԫ��
	parentOffset: {left:0,top:0}, // ���һ����λ�ĸ�����(target.offsetParent)Ԫ���ڵ�ǰ�ӿڵ����ƫ��
	info : { left:0, top:0,	width:0, height:0,
		pageLeft:0,	// Ԫ������ڵ�ǰ�ӿ�left��ƫ��
		pageTop:0	// Ԫ������ڵ�ǰ�ӿ�top��ƫ��
	},
	option : {
		direction :'',	// �����ķ���
		minWidth : 20,	// ������С���
		minHeight: 20,	// ������С�߶�
		boundLeft	: 0,// ��߽�
		boundTop	: 0,// �ϱ߽�
		boundRight	: 9999,//�ұ߽�
		boundBottom : 9999,//�±߽�
		resizing : null,	//�ڵ�����Сʱ����õĻص�����,����Ϊinfo
		complete : null		//�ڵ�����Сʱ����ʱ���õĻص�����,����Ϊinfo
	},
	// ��ʼ��
    init : function(target, options) {
		this.target = target;
		// Ĭ����target.offsetParent���ı�Ϊ�߽�
		this.parentOffset = $(this.target.offsetParent).offset();
		this.option.boundLeft	= this.parentOffset.left;
		this.option.boundTop	= this.parentOffset.top;
		this.option.boundRight	= this.parentOffset.left + $(target.offsetParent).width();
		this.option.boundBottom = this.parentOffset.top + $(target.offsetParent).height();
		// ����ѡ��
		$.extend(this.option, options);
		this.resizingHendler = this.eventMethod(this, 'onResizing');
		this.completeHendler = this.eventMethod(this, 'onComplete');
	},
	// ��ʼ
	start:function(e, direction) {
		// ���÷���
		if(!this.setDirection(direction || this.option.direction)) {
			return false;
		}
		var o = $(this.target).offset();
		// oPos ʼ�ձ�ʾ���Ͻǵ��Ǹ���
		// iPos ʼ�ձ�ʾ���½ǵ��Ǹ���
		this.oPos = {x:o.left, y:o.top};
		this.iPos = {x:this.oPos.x + $(this.target).width(), y:this.oPos.y + $(this.target).height()};
		$(document).bind('mousemove', this.resizingHendler);
		$(document).bind('mouseup'	, this.completeHendler);
		// ��ֹ�¼�����
		e.stopPropagation();
		e.preventDefault();
	},
	// ֹͣ
	stop: function() {this.onComplete();},
	// ���÷���, ������this.vector���淽��.���˸�����
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
	// left,top��parentOffsetΪԭ��
	resize: function(left, top, width, height) {
		this.info = {'left':left, 'top':top, 'width':width, 'height':height,pageLeft:this.oPos.x,pageTop:this.oPos.y};
		$(this.target).css({'left':left, 'top':top,	'width':width,'height':height});
		if($.isFunction(this.option.dragging)) this.option.dragging(this.info);
	},
	onResizing: function(e){
		// ����X,Y
		var x = Math.max(Math.min(e.pageX, this.option.boundRight), this.option.boundLeft);
		var y = Math.max(Math.min(e.pageY, this.option.boundBottom), this.option.boundTop); 
		 // ����Ϊ����,��,��,�Ϸ������
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
