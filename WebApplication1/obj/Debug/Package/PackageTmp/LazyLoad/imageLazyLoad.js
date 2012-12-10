var LazyLoad = function(elems, options) {
	//��ʼ������
	this._initialize(elems, options);
	//���û��Ԫ�ؾ��˳�
	if ( this.isFinish() ) return;
	//��ʼ��ģʽ����
	this._initMode();
	//���е�һ�δ���
	this.resize(true);
};

LazyLoad.prototype = {
  //��ʼ������
  _initialize: function(elems, options) {
	this._elems = elems;//����Ԫ�ؼ���
	this._rect = {};//����λ�ò�������
	this._range = {};//���ط�Χ��������
	this._loadData = null;//���س���
	this._timer = null;//��ʱ��
	this._lock = false;//��ʱ����
	//��̬ʹ������
	this._index = 0;//��¼����
	this._direction = 0;//��¼����
	this._lastScroll = { "left": 0, "top": 0 };//��¼����ֵ
	this._setElems = function(){};//����Ԫ�ؼ��ϳ���
	
	var opt = this._setOptions(options);
	
	this.delay = opt.delay;
	this.threshold = opt.threshold;
	this.beforeLoad = opt.beforeLoad;
	
	this._onLoadData = opt.onLoadData;
	this._container = this._initContainer($$(this.options.container));//����
  },
  //����Ĭ������
  _setOptions: function(options) {
    this.options = {//Ĭ��ֵ
		container:	window,//����
		mode:		"dynamic",//ģʽ
		threshold:	0,//���ط�Χ��ֵ
		delay:		100,//��ʱʱ��
		beforeLoad:	function(){},//����ǰִ��
		onLoadData:	function(){}//��ʾ��������
    };
    return $$.extend(this.options, options || {});
  },
  //��ʼ����������
  _initContainer: function(container) {
	var doc = document,
		isWindow = container == window || container == doc
			|| !container.tagName || (/^(?:body|html)$/i).test( container.tagName );
	if ( isWindow ) {
		container = doc.compatMode == 'CSS1Compat' ? doc.documentElement : doc.body;
	}
	//����ִ�з���
	var oThis = this, width = 0, height = 0;
	this.load = $$F.bind( this._load, this );
	this.resize = $$F.bind( this._resize, this );
	this.delayLoad = function() { oThis._delay( oThis.load ); };
	this.delayResize = function(){//��ֹ�ظ�����bug
		var clientWidth = container.clientWidth,
			clientHeight = container.clientHeight;
		if( clientWidth != width || clientHeight != height ) {
			width = clientWidth; height = clientHeight;
			oThis._delay( oThis.resize );
		}
	};
	//��¼��Ԫ�ط����Ƴ�
	this._binder = isWindow ? window : container;
	//���¼�
	$$E.addEvent( this._binder, "scroll", this.delayLoad );
	isWindow && $$E.addEvent( this._binder, "resize", this.delayResize );
	//��ȡ����λ�ò�������
	this._getContainerRect = isWindow && ( "innerHeight" in window )
		? function(){ return {
				"left":	0, "right":	window.innerWidth,
				"top":	0, "bottom":window.innerHeight
			}}
		: function(){ return oThis._getRect(container); }	;
	//���û�ȡscrollֵ����
	this._getScroll = isWindow
		? function() { return {
				"left": $$D.getScrollLeft(), "top": $$D.getScrollTop()
			}}
		: function() { return {
				"left": container.scrollLeft, "top": container.scrollTop
			}};
	return container;
  },
  //��ʼ��ģʽ����
  _initMode: function() {
	switch ( this.options.mode.toLowerCase() ) {
		case "vertical" ://��ֱ����
			this._initStatic( "vertical", "vertical" );
			break;
		case "horizontal" ://ˮƽ����
			this._initStatic( "horizontal", "horizontal" );
			break;
		case "cross" :
		case "cross-vertical" ://��ֱ��������
			this._initStatic( "cross", "vertical" );
			break;
		case "cross-horizontal" ://ˮƽ��������
			this._initStatic( "cross", "horizontal" );
			break;
		case "dynamic" ://��̬����
		default :
			this._loadData = this._loadDynamic;
	}
  },
  //��ʼ����̬��������
  _initStatic: function(mode, direction) {
	//����ģʽ
	var isVertical = direction == "vertical";
	if ( mode == "cross" ) {
		this._crossDirection = $$F.bind( this._getCrossDirection, this,
			isVertical ? "_verticalDirection" : "_horizontalDirection",
			isVertical ? "_horizontalDirection" : "_verticalDirection" );
	}
	//����Ԫ��
	var pos = isVertical ? "top" : "left",
		sortFunction = function( x, y ) { return x._rect[ pos ] - y._rect[ pos ]; },
		getRect = function( elem ) { elem._rect = this._getRect(elem); return elem; };
	this._setElems = function() {//ת�����鲢����
		this._elems = $$A.map( this._elems, getRect, this ).sort( sortFunction );
	};
	//���ü��غ���
	this._loadData = $$F.bind( this._loadStatic, this,
		"_" + mode + "Direction",
		$$F.bind( this._outofRange, this, mode, "_" + direction + "BeforeRange" ),
		$$F.bind( this._outofRange, this, mode, "_" + direction + "AfterRange" ) );
  },
  //��ʱ����
  _delay: function(run) {
	clearTimeout(this._timer);
	if ( this.isFinish() ) return;
	var oThis = this, delay = this.delay;
	if ( this._lock ) {//��ֹ��������
		this._timer = setTimeout( function(){ oThis._delay(run); }, delay );
	} else {
		this._lock = true; run();
		setTimeout( function(){ oThis._lock = false; }, delay );
	}
  },
  //���÷�Χ��������������
  _resize: function(change) {
	if ( this.isFinish() ) return;
	this._rect = this._getContainerRect();
	//λ�øı�Ļ���Ҫ����Ԫ��λ��
	if ( change ) { this._setElems(); }
	this._load(true);
  },
  //���س���
  _load: function(force) {
	if ( this.isFinish() ) return;
	var rect = this._rect, scroll = this._getScroll(),
		left = scroll.left, top = scroll.top,
		threshold = Math.max( 0, this.threshold | 0 );
	//��¼ԭʼ���ط�Χ����
	this._range = {
		top:	rect.top + top - threshold,
		bottom:	rect.bottom + top + threshold,
		left:	rect.left + left - threshold,
		right:	rect.right + left + threshold
	}
	//��������
	this.beforeLoad();
	this._loadData(force);
  },
  //��̬���س���
  _loadDynamic: function() {
	this._elems = $$A.filter( this._elems, function( elem ) {
			return !this._insideRange( elem );
		}, this );
  },
  //��̬���س���
  _loadStatic: function(direction, beforeRange, afterRange, force) {
	//��ȡ����
	direction = this[ direction ]( force );
	if ( !direction ) return;
	//���ݷ�������ͼƬ����
	var elems = this._elems, i = this._index,
		begin = [], middle = [], end = [];
	if ( direction > 0 ) {//������
		begin = elems.slice( 0, i );
		for ( var len = elems.length ; i < len; i++ ) {
			if ( afterRange( middle, elems[i] ) ) {
				end = elems.slice( i + 1 ); break;
			}
		}
		i = begin.length + middle.length - 1;
	} else {//��ǰ����
		end = elems.slice( i + 1 );
		for ( ; i >= 0; i-- ) {
			if ( beforeRange( middle, elems[i] ) ) {
				begin = elems.slice( 0, i ); break;
			}
		}
		middle.reverse();
	}
	this._index = Math.max( 0, i );
	this._elems = begin.concat( middle, end );
  },
  //��ֱ��ˮƽ���������ȡ����
  _verticalDirection: function(force) {
	  return this._getDirection( force, "top" );
  }, 
  _horizontalDirection: function(force) {
	  return this._getDirection( force, "left" );
  },
  //���������ȡ����
  _getDirection: function(force, scroll) {
	var now = this._getScroll()[ scroll ], _scroll = this._lastScroll;
	if ( force ) { _scroll[ scroll ] = now; this._index = 0; return 1; }
	var old = _scroll[ scroll ]; _scroll[ scroll ] = now;
	return now - old;
  },
  //cross���������ȡ����
  _getCrossDirection: function(primary, secondary, force) {
	var direction;
	if ( !force ) {
		direction = this[ primary ]();
		secondary = this[ secondary ]();
		if ( !direction && !secondary ) {//�޹���
			return 0;
		} else if ( !direction ) {//�η������
			if ( this._direction ) {
				direction = -this._direction;//����һ�ε��෴����
			} else {
				force = true;//û�м�¼������
			}
		} else if ( secondary && direction * this._direction >= 0 ) {
			force = true;//ͬʱ�������ҷ������һ�ι�����ͬ
		}
	}
	if ( force ) {
		this._lastScroll = this._getScroll(); this._index = 0; direction = 1;
	}
	return ( this._direction = direction );
  },
  //�ж��Ƿ���ط�Χ��
  _insideRange: function(elem, mode) {
	var range = this._range, rect = elem._rect || this._getRect(elem),
		insideH = rect.right >= range.left && rect.left <= range.right,
		insideV = rect.bottom >= range.top && rect.top <= range.bottom,
		inside = {
				"horizontal":	insideH,
				"vertical":		insideV,
				"cross":		insideH && insideV
			}[ mode || "cross" ];
	//�ڼ��ط�Χ�ڼ�������
	if ( inside ) { this._onLoadData(elem); }
	return inside;
  },
  //�ж��Ƿ񳬹����ط�Χ
  _outofRange: function(mode, compare, middle, elem) {
	if ( !this._insideRange( elem, mode ) ) {
		middle.push(elem);
		return this[ compare ]( elem._rect );
	}
  },
  _horizontalBeforeRange: function(rect) { return rect.right < this._range.left; },
  _horizontalAfterRange: function(rect) { return rect.left > this._range.right; },
  _verticalBeforeRange: function(rect) { return rect.bottom < this._range.top; },
  _verticalAfterRange: function(rect) { return rect.top > this._range.bottom; },
  //��ȡλ�ò���
  _getRect: function(node) {
	var n = node, left = 0, top = 0;
	while (n) { left += n.offsetLeft; top += n.offsetTop; n = n.offsetParent; };
	return {
		"left": left, "right": left + node.offsetWidth,
		"top": top, "bottom": top + node.offsetHeight
	};
  },
  //�Ƿ���ɼ���
  isFinish: function() {
	if ( !this._elems || !this._elems.length ) {
		this.dispose(); return true;
	} else {
		return false;
	}
  },
  //���ٳ���
  dispose: function(load) {
	clearTimeout(this._timer);
	if ( this._elems || this._binder ) {
		//����ȫ��Ԫ��
		if ( load && this._elems ) {
			$$A.forEach( this._elems, this._onLoadData, this );
		}
		//�������
		$$E.removeEvent( this._binder, "scroll", this.delayLoad );
		$$E.removeEvent( this._binder, "resize", this.delayResize );
		this._elems = this._binder = null;
	}
  }
}