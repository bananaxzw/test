mfx.dll.progressBar = function(ini) {
	var f = this;
	f.showPos = ini.showPos == undefined ? true: ini.showPos;
	f.win = mfx(ini.shell)[0];
	f.line = mfx('span', f.win)[0];
	f.fx = ini.fx == undefined ? true: ini.fx;
	if (ini.bg) {
		f.win.style.backgroundImage = f.line.style.backgroundImage = 'url(' + ini.bg + ')';
	};
	f.pos = 0; // is 0-1;
	f.length = f.win.offsetWidth - 1;
};
mfx.dll.progressBar.prototype = {
	to: function(pos) {
		var n = parseFloat(pos),
		f = this;
		if (/%/.test(pos)) n /= 100;
		n = mfx.range(n, 0, 1);
		if (f.pos == n) return;
		f.pos = n;
		n *= f.length;
		if (f.fx) {
			mfx.fx(f.line, 'width', n, {
				owner: f,
				timeout: 500,
				live: f._live,
				die: f._die
			});
		} else {
			f.line.style.width = n + 'px';
			if (n > 24 && this.showPos) this.line.innerHTML = this._len2pos(n) + '%';
		}
		return f;
	},
	_len2pos: function(len) {
		return Math.round(len / this.length * 100);
	},
	_die: function() {
		if (this.pos == 1) this.onfull();
	},
	_live: function(o, val) {
		if (val > 24 && this.showPos) this.line.innerHTML = this._len2pos(val) + '%';
		this.onlive(o, val);
	},
	onfull: mfx.nodo,
	onlive: mfx.nodo
};
