mfx.fx = function(el, attr, to, opts) {
	if (el instanceof Array) return mfx.fx.queue(el, attr);
	el = mfx(el)[0];
	var t = 0;
	opts && opts.init && opts.init.call(opts.owner, el, attr);
	if (typeof attr != 'string') {
		to = to || {};
		to.group = {
			sum: 0
		};
		for (var Id in attr) {
			to.group.sum++;
			this.fx(el, Id, attr[Id], to);
		};
		return this;
	};
	mfx.stop(el['fxID_' + attr]);
	var px = /scroll|opacity/i.test(attr) ? '': 'px';
	var ini = mfx.copy({
		set: function(x) {
			mfx.face(el, attr, x + px);
			return x;
		},
		group: {
			sum: 1
		}
	},
	this.fx.ini, opts || {});
	if (/color/i.test(attr)) {
		ini.group.sum--; // not event in color fx;
		return mfx.fx.color(el, to, {
			style: attr,
			timeout: ini.timeout
		});
	};
	if (ini.owner === null) ini.owner = el; // if not find plug is owne event, fx object set owner;
	var fm = parseFloat(mfx.face(el, attr)) || 0,
	fq = 10;
	if (/opacity/i.test(attr)) {
		fq = 48;
		ini.curve = function(t, b, c, d, s, a, p) {
			return - c * (t /= d) * (t - 2) + b;
		};
	};
	ini.timeout = ini.timeout / fq;
	if (/^-=/.test(to)) to = fm - parseFloat(to.replace(/-=/, ''));
	if (/^\+=/.test(to)) to = fm + parseFloat(to.replace(/\+=/, ''));
	to = parseFloat(to, 10) || 0;
	var _fx = (function(from, to, timeout, s, a, p) {
		var c = to - from,
		d = timeout,
		b = from;
		return function(t) {
			return ini.curve(t, b, c, d, s, a, p)
		};
	})(fm, to, ini.timeout);
	el['fxID_' + attr] = setInterval(function() {
		if (t++<ini.timeout) {
			ini.live.call(ini.owner, el, ini.set(_fx(t)), t);
		} else {
			mfx.stop(el['fxID_' + attr]);
			if (--ini.group.sum == 0) {
				ini.die.call(ini.owner, el, ini.set(to));
				ini.next.call(ini.owner, el, ini.set(to));
			};
		};
	},
	fq);
	return this;
};
mfx.fx.ini = { // com setting
	owner: null,
	timeout: 480,
	init: mfx.nodo(),
	live: mfx.nodo(),
	die: mfx.nodo(),
	next: mfx.nodo(),
	curve: function(t, b, c, d, s, a, p) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	colorCurve: function(t, b, c, d, s, a, p) {
		return c * (t /= d) * t + b;
	}
};
mfx.fx.stop = function(el, attr) {
	mfx(el,
	function() {
		var fxs = attr.split(',');
		for (var i = 0; i < fxs.length; ++i) {
			mfx.stop(this['fxID_' + fxs[i]]);
		};
	});
};
mfx.fx.queue = function(queue, die, async) {
	for (var i = 0; i < queue.length; ++i) {
		var task = queue[i];
		var optsIdx = (typeof task[1] != 'string') ? 2 : 3;
		task[optsIdx] = task[optsIdx] || {};
		task[optsIdx].next = function(o) {
			if (queue.length) {
				mfx.fx.apply(mfx, queue.shift());
			} else {
				die && die(o);
			};
		};
	};
	mfx.fx.apply(mfx, queue.shift());
};
mfx.fx.list = function() {
	var list = arguments;
	for (var i = 0; i < list.length; ++i) {
		mfx.fx.apply(mfx, list[i]);
	};
};
mfx.align = function(o1, o2, offX, offY, die) {
	var pos = o2.nodeType ? mfx.pos(o2) : o2;
	o1.style.left = (pos.x + (offX || 0)) + 'px';
	o1.style.top = (pos.y + (offY || 0)) + 'px';
	die && die.call([o1, o2]);
};
mfx.ring = function(i, max, min, dir) {
	dir = dir || 1;
	min = min || 0;
	return function(x) {
		var tmp = i;
		i = isNaN(x) ? (i + dir) : x;
		if (i < min) i = max;
		if (i > max) i = min;
		return i;
	};
};
mfx.fx.scrollTo = function(el, el2, opts) {
	var pos = (el2 instanceof Array) ? {
		x: el2[0],
		y: el2[1]
	}: mfx.pos(el2, el != document.body);
	opts=opts||{};
	return mfx.fx(el, {
		scrollTop: pos.y + (opts.offY || 0),
		scrollLeft: pos.x + (opts.offX || 0)
	},
	opts);
};
mfx.fx.moveTo = function(el, el2, opts) {
	var pos = (el2 instanceof Array) ? {
		x: el2[0],
		y: el2[1]
	}: mfx.pos(el2);
	return mfx.fx(el, {
		left: pos.x + (opts.offX || 0),
		top: pos.y + (opts.offY || 0)
	},
	opts);
};
mfx.fx.color = function(el, to, opts) {
	var ini = mfx.copy({
		style: 'backgroundColor'
	},
	mfx.fx.ini, opts);
	var splitColor = function(color) {
		color = color.replace(/\s+/g, ''); // ff get color has splace;
		if (/(rgb\()?\d+,\d+,\d+(\))?/i.test(color)) { // rgb(1,2,3) or 1,2,3 to [1,2,3]
			var x = color.match(/\b\d+\b/g);
			return [parseInt(x[0]), parseInt(x[1]), parseInt(x[2])];
		};
		var x = color.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3');
		if (!/^#[0-9a-f]{6}$/i.test(x)) return [255, 255, 255];
		return [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)];
	};
	to = to || '#FF9900';
	mfx(el,
	function() {
		var el = this,
		c1 = splitColor(mfx.face(el, ini.style)),
		c2 = splitColor(to);
		var t = 0,
		R = c2[0] - c1[0],
		G = c2[1] - c1[1],
		B = c2[2] - c1[2],
		d = (ini.timeout || 200) / 10;
		var fx = ini.colorCurve;
		mfx.stop(el['fxID_' + ini.style]);
		el['fxID_' + ini.style] = setInterval(function() {
			if (t++<d) {
				mfx.face(el, ini.style, 'rgb(' + [Math.ceil(fx(t, c1[0], R, d)), Math.ceil(fx(t, c1[1], G, d)), Math.ceil(fx(t, c1[2], B, d))] + ')');
			} else {
				mfx.stop(el['fxID_' + ini.style]);
				mfx.face(el, ini.style, 'rgb(' + [c2] + ')');
				ini.die.call(el);
			}
		},
		10);
	});
	return this;
};
mfx.fx.highLight = function(el, to, opts) {
	if (el.doHightLigh) return; // only a hightLign fx;
	var from = mfx.face(el, 'backgroundColor'),
	old = from,
	to = to || '#FC0',
	i = 0;
	el.doHightLigh = true;
	var _run = function() {
		mfx.fx.color(el, to, {
			timeout: 75,
			die: function() {
				if (6 > ++i) {
					var tmp = from;
					from = to;
					to = tmp;
					_run();
				} else {
					mfx.face(el, 'backgroundColor', old); // reset;
					el.doHightLigh = false;
				};
			}
		});
	};
	_run();
};
mfx.fx.winding = function(el, size) {
	var el = mfx(el)[0];
	mfx.stop(el.fxID_left);
	var a = 0,
	size = size || 3,
	_x = parseInt(mfx.face(el, 'left')),
	_y = parseInt(mfx.face(el, 'top'));
	el.fxID_left = setInterval(function() {
		var A = a / 180 * Math.PI,
		x = Math.sin(A) * size,
		y = Math.cos(A) * size;
		mfx.face(el, {
			top: y + _y + 'px',
			left: x + _x + 'px'
		});
		if ((a += 36) > 1800) {
			mfx.face(el, {
				top: _y + 'px',
				left: _x + 'px'
			});
			mfx.stop(x.fxID_left);
		};
	},
	13);
};
mfx.fx.flex=function(el,fn){
	el=mfx(el)[0];
	if(!el)return;
	if(!el.fH){
		var free = mfx.freeHeight(el);
		mfx.face(el, 'overflow', 'hidden');
		el.fH=free.height;
		el.pB =  free.pb;
		el.pT =  free.pt;
	};
	var to = 0,
	pb = 0,
	pt =0;
	if (el.style.display == 'none') {
		to = el.fH;
		pb = el.pB;
		pt = el.pT;
	};
	mfx.fx(el, {
		'height': to,
		'paddingTop': pt,
		'paddingBottom': pb
	},
	{
		live: function(el,x) {
			el.scrollTop = el.scrollHeight;
		},
		die: function() {
			to==0?mfx.face(el,'display','none'):0;
		},
		init: function(el) {
			to!=0?mfx.face(el,'display','block'):0;
			mfx.isFn(fn)&&fn.call(el,to==0);//isUp,change ico;
		},
		timeout: 100
	});
};