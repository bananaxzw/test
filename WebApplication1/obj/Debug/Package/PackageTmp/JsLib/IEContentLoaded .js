function IEContentLoaded(w, fn) {
    var d = w.document, done = false,
    // only fire once
	init = function () {
	    if (!done) {
	        done = true;
	        fn();
	    }
	};
    // polling for no errors
    (function () {
        try {
            // throws errors until after ondocumentready
            d.documentElement.doScroll('left');
        } catch (e) {
            setTimeout(arguments.callee, 50);
            return;
        }
        // no errors, fire
        init();
    })();
    // trying to always fire before onload
    d.onreadystatechange = function () {
        if (d.readyState == 'complete') {
            d.onreadystatechange = null;
            init();
        }
    };
}