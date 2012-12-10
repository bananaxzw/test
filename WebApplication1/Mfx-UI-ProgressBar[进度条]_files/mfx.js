var mfx = function(query, owner, each) {
	query = arguments.length == 0 ? mfx.init.replace(mfx) : query;
	if (mfx.isFn(query)) {
		return mfx.windowIsLoad ? query() : mfx.on(window, 'load', query);
	};
	return mfx.find(query, owner, each);
};
mfx.find = function(query, owner, each) {
	if (!query) return [];
	owner = owner == undefined ? document: owner;
	if (typeof owner == 'function') {
		each = owner;
		owner = document;
	};
	if (typeof query != 'string') {
		var els = (query.nodeType || query == window) ? [query] : mfx.list2Arr(query);
		if (each) {
			for (var i = 0; i < els.length; ++i) {
				if (false === each.call(els[i], i, els)) {
					break;
				};
			};
		};
		return els;
	};
	query = query.replace(/^\s+|\s+$/, '') + ',';
	return mfx.findIn(query, owner, each);
};
mfx.findIn = function(query, owner, each) {
	if (owner instanceof Array && owner.length == 0) {
		return [];
	};
	if (/,/.test(query)) {
		var group = query.replace(/(^\s*,)|(,\s*,$)|^.*(?=#[^#]+$)/g, '').split(','),
		gs = [];
		for (var i = 0; i < group.length; ++i) {
			gs = gs.concat(mfx.findIn(group[i], owner));
		};
		if (each) {
			for (var i = 0; i < gs.length; ++i) {
				if (false === each.call(gs[i], i, gs)) {
					break;
				};
			};
		};
		return gs;
	};
	var flag = query.split(/\s+/),
	save = [];
	if (typeof owner == 'string') {
		owner = mfx.findIn(owner, document);
	};
	if (owner.nodeType) {
		owner = [owner];
	};
	for (var i = 0; i < owner.length; ++i) {
		var els = mfx.select(flag[0], owner[i]);
		save = save.concat(els);
	};
	if (flag[1]) {
		save = mfx.findIn(flag.slice(1).join(' '), save);
	};
	return save;
};
mfx.select = function(mark, owner, filter) {
	var tmp = [],
	isId = /#([^#]+)$/,
	isClass = /^\.([\w\-]+)$/,
	isFormElement = /^:([a-z]+)$/,
	isTag = /^\w+$/,
	isFilter = /^([\.\:]?[a-z-]+)([\.\:][a-z-]+)$/;
	if (isId.test(mark)) {
		tmp = document.getElementById(mark.match(isId)[1]);
		return tmp ? [tmp] : [];
	} else if (isClass.test(mark)) {
		var check = new RegExp('\\b' + mark.match(isClass)[1] + '\\b');
		var nodes = filter || owner.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; ++i) {
			check.test(nodes[i].className) && tmp.push(nodes[i])
		};
		return tmp;
	} else if (isFormElement.test(mark)) {
		var check = new RegExp('^' + mark.match(isFormElement)[1] + '$', 'i');
		var nodes = filter || owner.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; ++i) {
			check.test(nodes[i].type) && tmp.push(nodes[i])
		};
		return tmp;
	} else if (isTag.test(mark)) {
		return this.list2Arr(owner.getElementsByTagName(mark));
	} else if (isFilter.test(mark)) {
		mark = mark.match(isFilter);
		return this.select(mark[2], null, this.select(mark[1], owner));
	} else {
		return [];
	};
};
mfx.list2Arr = function(list) {
	var tmp = [];
	for (var i = 0; i < list.length; ++i) {
		tmp.push(list[i]);
	};
	return tmp;
};
mfx.$A = function() {
	return [].slice.call(arguments.callee.caller.arguments);
};
mfx.isFn = function(_) {
	return typeof _ == 'function';
};
mfx.nodo = function(fn) {
	return mfx.isFn(fn) ? fn: function() {
		return fn == undefined ? false: fn;
	};
};
mfx.GUID = (function() {
	var guid = 100100759;
	return function(x) {
		return (x || '') + (++guid);
	}
})();
mfx.getGuid = function(thing, type) {
	return thing.guid ? thing.guid: (thing.guid = mfx.GUID(type || 'guid'));
};
mfx.dll = {}; // extend plugin;
mfx.data = {}; // all user data;
mfx.fn = {}; // all user fn;
mfx.init = mfx.nodo(); // project begin on here, and mfx() is run it;
mfx.copy = function() {
	var x = mfx.$A(),
	To = x.length < 2 ? mfx: x.shift();
	for (var i = 0; i < x.length; ++i) {
		var from = x[i];
		for (var Id in from) {
			if (from[Id] !== undefined) {
				To[Id] = from[Id];
			};
		};
	};
	return To;
};
mfx.copy(Function.prototype, {
	replace: function() {
		var x = mfx.$A(),
		f = x.shift(),
		fn = this;
		return function() {
			return fn.apply(f, x);
		};
	},
	live: function(els, type) {
		var fn = this;
		mfx(els,
		function() {
			mfx.on(this, type, fn);
		});
	},
	die: function(els, type) {
		var fn = this;
		mfx(els,
		function() {
			mfx.die(this, type, fn);
		});
	}
});
mfx.each = function() {
	var x = mfx.$A(),
	arr = x.shift(),
	fn = x.shift();
	for (var i = 0; i < arr.length; ++i) {
		var _fn = fn.replace.apply(fn, [arr[i], i, arr].concat(x));
		if (_fn() === false) {
			break;
		};
	};
	return mfx;
};
mfx.on = function(el, type, fn) {
	mfx(el,
	function() {
		var name = mfx.getGuid(fn),
		el = this;
		if (el.addEventListener) {
			el[name] = fn;
			el.addEventListener(type, fn, false);
		} else if (el.attachEvent) {
			el['inner' + name] = fn;
			el[name] = function() {
				el['inner' + name](window.event);
			};
			el[name].guid = name;
			el.attachEvent('on' + type, el[name]);
		} else {
			el['on' + type] = fn;
		}
	});
	return this;
};
mfx.die = function(el, type, fn) {
	mfx(el,
	function() {
		if (mfx.isFn(fn)) return mfx.dieFn(this, type, fn);
		for (var Id in this) {
			if (/^guid/.test(Id)) {
				mfx.die_know(this, type, this[Id]);
			};
		};
	});
};
mfx.dieFn = function(el, type, fn) {
	var name = mfx.getGuid(fn);
	if (el.removeEventListener) {
		el.removeEventListener(type, fn, false);
		delete el[name];
	} else if (el.detachEvent) {
		el.detachEvent('on' + type, fn);
		el['inner' + name] = null;
		el[name] = null;
	} else {
		el['on' + type] = null;
	};
	return this;
};
mfx.on(window, 'load',
function() {
	mfx.windowIsLoad = true;
});
mfx.event = function(e) {
	var _e = e || window.event,
	d = document.documentElement,
	b = document.body || {
		scrollLeft: 0,
		scrollTop: 0
	};
	return {
		e: _e,
		x: _e.clientX,
		y: _e.clientY,
		key: _e.keyCode,
		pageX: _e.pageX || (_e.clientX + (d.scrollLeft || b.scrollLeft) - (d.clientLeft || 0)),
		pageY: _e.pageY || (_e.clientY + (d.scrollTop || b.scrollTop) - (d.clientTop || 0)),
		target: _e.srcElement || _e.target,
		stop: function() {
			if (_e.stopPropagation) {
				_e.stopPropagation();
				_e.preventDefault();
			} else {
				_e.cancelBubble = true;
				_e.returnValue = false;
			};
		}
	};
};
mfx.isIE = !!window.ActiveXObject;
mfx.isIE6 = window.ActiveXObject && (!window.XMLHttpRequest);
mfx.isFF = /Firefox/i.test(navigator.userAgent);
mfx.backCompat = /BackCompat/i.test(document.compatMode);
mfx.style = function(el) {
	return el.currentStyle || document.defaultView.getComputedStyle(el, null);
};
mfx.range = function(num, min, max) {
	num = parseFloat(num, 10);
	num = isNaN(min) ? num: Math.max(num, min);
	return isNaN(max) ? num: Math.min(num, max);
};
mfx.page = function() {
	var b = document.body,
	d = document.documentElement,
	M = Math.max;
	return {
		'width': M(d.scrollWidth, b.scrollWidth, b.clientWidth, d.clientWidth),
		'height': M(d.scrollHeight, b.scrollHeight, b.clientHeight, d.clientHeight) + (mfx.isIE ? 10 : 0),
		'vWidth': mfx.backCompat ? b.clientWidth: d.clientWidth,
		'vHeight': mfx.backCompat ? b.clientHeight: d.clientHeight,
		'left': M(b.scrollLeft, d.scrollLeft),
		'top': M(b.scrollTop, d.scrollTop)
	};
};
mfx.pos = function(o, first) {
	var p = mfx(o)[0],
	x = 0,
	y = 0;
	while (p && !(/html|body/i.test(p.tagName))) {
		x += p.offsetLeft;
		y += p.offsetTop;
		p = p.offsetParent;
		if (first && /absolute|relative/i.test(mfx.face(p, 'position'))) {
			if (mfx.isIE && !mfx.isIE6) {
				x -= p.clientLeft; // IE7 or IE8 offsetLeft add margin
				y -= p.clientTop;
			};
			break; // if only get first offset Pos
		};
	};
	return {
		'x': x,
		'y': y
	};
};
mfx.face = function(o, attr, val) {
	if (typeof attr != 'string') {
		for (var Id in attr) {
			mfx.face(o, Id, attr[Id]);
		};
		return this;
	};
	o = mfx(o)[0];
	if (/scroll/i.test(attr)) {
		if (val != undefined) {
			o[attr] = parseInt(val);
			return mfx;
		};
		return o[attr];
	};
	if (attr == 'opacity' && window.ActiveXObject) {
		if (val != undefined) {
			o.style.filter = "alpha(opacity=" + parseInt(val * 100) + ")";
			o._opacity_ = val;
			return mfx;
		};
		return o._opacity_ != undefined ? o._opacity_: o.filters.alpha ? (o.filters.alpha.opacity / 100) : 1;
	};
	if (val != undefined) {
		o.style[attr] = val;
		return mfx;
	};
	var x = o.style[attr] != '' ? o.style[attr] : mfx.style(o)[attr];
	if (/auto/i.test(x)) {
		var n = /^(width|height)$/.test(attr) || (/^(left|top)$/.test(attr) && !/relatvie/.test(mfx.face(o, 'position'))),
		hide;
		if (mfx.face(o, 'display') == 'none') {
			o.style.display = 'block';
			hide = true;
		};
		x = n ? o['offset' + attr.slice(0, 1).toUpperCase() + attr.slice(1)] : 0;
		if (hide) o.style.display = 'none';
		if (/^height$/.test(attr)) {
			x -= parseInt(mfx.face(o, 'paddingTop')) + parseInt(mfx.face(o, 'paddingBottom'));
		};
		if (/^width$/.test(attr)) {
			x -= parseInt(mfx.face(o, 'paddingLeft')) + parseInt(mfx.face(o, 'paddingRight'));
		};
	};
	return x;
};
mfx.freeHeight = function(o) {
	var old = {},
	o = mfx(o)[0],
	free = {
		visibility: 'hidden',
		height: 'auto',
		width: o.offsetWidth + 'px',
		overflow: '',
		display: 'block',
		position: 'absolute'
	};
	for (var Id in free) {
		old[Id] = o.style[Id];
		o.style[Id] = free[Id]
	};
	var h = o.offsetHeight;
	for (var Id in old) {
		o.style[Id] = old[Id];
	};
	var pt = parseInt(mfx.face(o, 'paddingTop')),
	pb = parseInt(mfx.face(o, 'paddingBottom'));
	return {
		height: h - pt - pb,
		pt: pt,
		pb: pb
	};
};
try {
	mfx.isIE6 && document.execCommand("BackgroundImageCache", false, true);
} catch(e) {};
mfx.stop = function(timer) {
	clearTimeout(timer);
	clearInterval(timer);
	return this;
};
mfx.xmlhttp = function() {
	if (window.ActiveXObject) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
	}
	return new XMLHttpRequest;
};
mfx.file = function(ini, die) {
	if (ini instanceof Array) return mfx.file.queue(ini, die);
	var XHR = new mfx.xmlhttp;
	var def = mfx.copy({
		from: location.pathname,
		load: mfx.nodo(),
		error: mfx.nodo(),
		out: mfx.nodo(),
		next: mfx.nodo(),
		timeout: -1,
		async: true,
		type: 'GET',
		header: {},
		encode: false,
		search: null
	},
	ini);
	if (def.search) {
		if (!/%/.test(def.search) || def.encode) def.search = encodeURI(def.search); // auto encodeURI
		if (def.type == 'GET') def.from += (/\?/.test(def.from) ? '&': '?') + def.search; // append params
	};
	def.from += (/\?/.test(def.from) ? '&': '?') + '_A=' + mfx.GUID(); // append random number
	XHR.open(def.type, def.from, def.async);
	if (def.type == 'POST') {
		def.header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	};
	for (var key in def.header) {
		XHR.setRequestHeader(key, def.header[key])
	};
	if (def.timeout > 0) def.timer = setTimeout(function() {
		XHR.abort();
		delete XHR.onreadystatechange;
		def.out();
		def.next({
			isOut: true
		});
	},
	def.timeout);
	XHR.onreadystatechange = function() {
		if (XHR.readyState == 4) {
			mfx.stop(def.timer);
			XHR.status == 200 ? def.load(XHR.responseText, XHR.responseXML) : def.error(XHR.status, XHR.statusText);
			def.next({
				isErr: XHR.status != 200
			});
		};
	};
	XHR.send(def.search);
	return def.async === false ? [XHR.responseText, XHR.responseXML] : XHR; // async or timeout user 
};
mfx.file.queue = function(queue, die) {
	for (var i = 0; i < queue.length; ++i) {
		var q = queue[i];
		q.next = function() {
			if (queue.length) {
				mfx.file.call(mfx, queue.shift());
			} else {
				mfx.isFn(die) && die();
			};
		};
	};
	mfx.file.call(mfx, queue.shift());
};
mfx.ui = function(ini, owner) {
	var ini = ini || {},
	node = ini.from && ini.from.cloneNode(ini.copyChild) || document.createElement(ini.type || 'DIV');
	for (var key in ini) {
		if (!/style|attr|from|copyChild/i.test(key)) node[key] = ini[key];
	};
	for (key in ini.style) {
		node.style[key] = ini.style[key];
	};
	for (key in ini.attr) {
		node.setAttribute(key, ini.attr[key]);
	};
	return (owner && mfx(owner)[0] || document.body).appendChild(node);
};
mfx.toggle = function(els, opts) {
	var ini = mfx.copy({
		css: 'mfx-toggle',
		timeout: 0,
		to: function() {
			return this;
		}
	},
	opts || {});
	var re = new RegExp('\\b' + ini.css + '\\b');
	var A = ini.odd ||
	function() {
		var c = this.className.replace(re, '');
		this.className = c + (c.length > 0 ? ' ': '') + ini.css;
	};
	var B = ini.even ||
	function() {
		this.className = this.className.replace(re, '');
	};
	mfx(els,
	function() {
		var el2 = ini.to.call(this);
		if (!el2) return;
		switch (ini.type) {
		case 'down-up':
			return mfx.on(this, 'mousedown', A.replace(el2)).on(this, 'mouseup', B.replace(el2));
		case 'focus-blur':
			return mfx.on(this, 'focus', A.replace(el2)).on(this, 'blur', B.replace(el2));
		case 'click':
			return mfx.on(this, 'click',
			function() {
				re.test(el2.className) ? B.call(el2) : A.call(el2);
			});
		default:
			return mfx.on(this, 'mouseover',
			function() {
				A.call(el2);
				mfx.stop(this.fixhoverTimer);
			}).on(this, 'mouseout',
			function() {
				this.fixhoverTimer = setTimeout(B.replace(el2), ini.timeout);
			});
		};
	});
};
mfx.domSearch = function(node, dir, each) {
	var o = mfx(node)[0],
	each = mfx.nodo(each);
	for (var i = 0;; ++i) {
		o = o[dir];
		if (o == null || o == document.body) {
			break;
		} else if (o.nodeType != 1) {
			continue;
		} else if (false === each.call(o, i)) {
			break;
		};
	};
	return o;
};
mfx.parents = function(node, each) {
	return mfx.domSearch(node, 'parentNode', each);
};
mfx.next = function(node, each) {
	return mfx.domSearch(node, 'nextSibling', each);
};
mfx.prev = function(node, each) {
	return mfx.domSearch(node, 'previousSibling', each);
};