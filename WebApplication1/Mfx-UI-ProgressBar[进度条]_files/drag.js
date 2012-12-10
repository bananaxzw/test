mfx.drag = function(hander, ini) {
	ini = mfx.copy({},
	mfx.drag.ini, ini || {});
	ini.title = mfx(hander)[0];
	ini.win = mfx(ini.win)[0] || ini.title;
	ini.box = ini.win;
	if (isNaN(ini.unit) || ini.unit < 1) ini.unit = 1;
	if (ini.zoom) ini.win.style.overflow = 'hidden';
	mfx.face(ini.title, {
		cursor: (ini.cursor || "move")
	});
	if (ini.owner === null) ini.owner = ini.win;
	ini.beginDrag = function(e) {
		ini.init.call(ini.owner, ini);
		mfx.fx.stop('left,top');
		if (ini.dir == 'none') return false;
		ini.win.draging = true;
		_e = mfx.event(e);
		var isRel=/relative/i.test(mfx.face(ini.win,'position'));
		ini.beginPos = mfx.pos(ini.win,true);
		ini.livePos = {
			x: ini.beginPos.x,
			y: ini.beginPos.y
		};
		ini.mousedownPos = {
			x: _e.pageX,
			y: _e.pageY
		};
		ini.offsetPos = {
			x: _e.pageX - (isRel?parseInt(mfx.face(ini.win,'left')):ini.beginPos.x),
			y: _e.pageY - (isRel?parseInt(mfx.face(ini.win,'top')):ini.beginPos.y)
		};
		ini.winInitSize = {
			w: ini.win.offsetWidth,
			h: ini.win.offsetHeight
		};
		ini.margin = {
			left: parseInt(mfx.style(ini.win).marginLeft),
			top: parseInt(mfx.style(ini.win).marginTop)
		};
		if (ini.fxBox) {
			ini.box = mfx.drag.box.call(ini);
		};
		ini.allowX = ini.dir.indexOf('x') != -1;
		ini.allowY = ini.dir.indexOf('y') != -1;
		if (ini.autoZIndex) ini.box.style.zIndex = (++ini.topZIndex) + ini.minZIndex + parseInt(mfx.face(ini.win, 'zIndex'));
		mfx.drag.lock.call(ini, _e.e);
		document.onmousemove = ini.doDrag;
		document.onmouseup = ini.endDrag;
	};
	ini.doDrag = function(e) {
		_e = mfx.event(e);
		var x = _e.pageX - ini.offsetPos.x,
		y = _e.pageY - ini.offsetPos.y; 
		x -= (x - ini.livePos.x) % ini.unit;// for Unit
		y -= (y - ini.livePos.y) % ini.unit; ;
		x = mfx.range(x, ini.left, ini.right);// Area check
		y = mfx.range(y, ini.top, ini.bottom); // bottom and right is x,y max-value, and not css's b-r;
		if (ini.zoom) {
			var w = ini.winInitSize.w + _e.pageX - ini.mousedownPos.x;
			var h = ini.winInitSize.h + _e.pageY - ini.mousedownPos.y;
			if (ini.allowX) mfx.face(ini.box, 'width', (w < ini.minWidth ? ini.minWidth: w) + 'px');
			if (ini.allowY) mfx.face(ini.box, 'height', (h < ini.minHeight ? ini.minHeight: h) + 'px');
		} else {
			if (ini.allowX) ini.box.style.left = x - ini.margin.left + 'px';
			if (ini.allowY) ini.box.style.top = y - ini.margin.top + 'px';
		};
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		ini.livePos = {
			'x': (ini.allowX ? x: ini.beginPos.x),
			'y': (ini.allowY ? y: ini.beginPos.y)
		};
		return !! ini.live.call(ini.owner, ini);
	};
	ini.endDrag = function(e) {
		mfx.drag.unlock.call(ini, mfx.event(e).e);
		ini.win.draging = false;
		if (ini.fxBox) {
			if (ini.zoom) {
				if (ini.fx) { // resize fx
					mfx.fx(ini.win, {
						'width': ini.box.style.width,
						'height': ini.box.style.height
					},
					{
						timeout: 200
					});
				} else {
					mfx.face(ini.win, {
						'width': ini.box.style.width,
						'height': ini.box.style.height
					});
				};
			} else if (ini.drop) {
				if (ini.fx) {
					mfx.fx(ini.win, {
						left: ini.livePos.x,
						top: ini.livePos.y
					},
					{
						timeout: 160
					});
				} else {
					mfx.face(ini.win, 'left', ini.livePos.x + 'px');
					mfx.face(ini.win, 'top', ini.livePos.y + 'px');
				};
			};
			ini.box.parentNode.removeChild(ini.box);
		};
		ini.die.call(ini.owner, ini);
	};
	ini.title.onmousedown = ini.beginDrag;
	return ini; // return ini for out ctrl this setting
};
mfx.drag.ini = { // all drag setting
	owner: null,
	unit: 1,
	autoZIndex: true,
	topZIndex: 1,
	win: false,
	dir: 'xy',
	minZIndex: 1,
	init: mfx.nodo,
	live: mfx.nodo,
	die: mfx.nodo,
	fxBox: false,
	fx: false,
	zoom: false,
	opacity: false,
	drop: true,
	minWidth: 10,
	minHeight: 10
};
mfx.drag.box = function() { // create a eff box;
	var box = this.copy ? this.win.cloneNode(true) : document.createElement('DIV');
	var win = this.win,
	pos = mfx.pos(win, true); // up a level (not rel to body)
	var css = {
		top: pos.y + 'px',
		left: pos.x + 'px',
		border: 'dashed 1px #666',
		height: win.offsetHeight - 2 + 'px',
		width: win.offsetWidth - 2 + 'px',
		overflow: 'hidden',
		position: 'absolute'
	};
	if (this.opacity) {
		css = mfx.copy(css, {
			border: 'solid 1px #175E9D',
			opacity: 0.2,
			backgroundColor: '#C5DDF3'
		});
	}
	if (this.copy) css = {};
	css = mfx.copy(css, this.style || {}); // allow defalut box style;
	mfx.face(box, css);
	return win.parentNode.appendChild(box);
};
mfx.drag.lock = function(e) { // the fn is in ini_folder
	if (mfx.isIE) {
		this.title.onlosecapture = this.endDrag;
		e.cancelBubble = true;
		this.title.setCapture();
	} else {
		window.onblur = this.endDrag;
		e.stopPropagation();
		e.preventDefault(); // for win is image;
	};
};
mfx.drag.unlock = function(e) { // the fn is in ini_folder
	document.onmousemove = document.onmouseup = null;
	if (mfx.isIE) {
		this.title.onlosecapture = null;
		this.title.releaseCapture();
	} else {
		window.onblur = null;
	};
};
mfx.resize = function(node, ini) {
	ini = mfx.copy({
		zoom: true,
		fxBox: true,
		resize: true,
		opacity: true,
		cursor: 'default'
	},
	ini || {});
	var OF = mfx.drag(node, ini); // get DragFn's CtrlFolder, and control it in onmousemove
	mfx(node).onmousemove = function(e) {
		if (this.draging) return;
		var _e = mfx.event(e);
		var pos = mfx.pos(this);
		var isR = _e.pageX > pos.x + this.offsetWidth - 5;
		var isB = _e.pageY > pos.y + this.offsetHeight - 5;
		var isRB = isR && isB;
		switch (true) {
		case isRB:
			OF.dir = 'xy';
			this.style.cursor = 'nw-resize';
			break;
		case isR:
			OF.dir = 'x';
			this.style.cursor = 'e-resize';
			break;
		case isB:
			OF.dir = 'y';
			this.style.cursor = 'n-resize';
			break;
		default:
			OF.dir = 'none';
			this.style.cursor = 'default';
		};
	};
};
mfx.drop = function(node, dropList) {
	ini = {
		box: true,
		fx: true,
		live: function(f) { // use live for query is allow drop on object ;
			f.drop = false;
			var w = f.box.offsetWidth,
			h = f.box.offsetHeight;
			for (var i = 0,
			o; i < dropList.length; ++i) {
				o = dropList[i];
				var x = o.offsetLeft - w,
				x2 = x + w + o.offsetWidth,
				y = o.offsetTop - h,
				y2 = y + h + o.offsetHeight;
				if (f.x2 > x && f.x2 < x2 && f.y2 > y && f.y2 < y2) {
					f.drop = true;
					break;
				};
			};
		}
	};
	mfx.drag(node, ini);
};