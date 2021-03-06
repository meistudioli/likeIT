function mk(c, Data) {
	if (!arguments.length) return document.createDocumentFragment();
	var getTag = (Data && Data.tag) ? Data.tag : 'div', e = document.createElement(getTag);
	if (c) e.className = c;
	if (Data) {
		for (i in Data.s) e.style[i] = Data.s[i];//style
		for (i in Data.att) e[i] = Data.att[i];//attribute
	}//end if
	return e;
}

function getStyle(e,property) {
	var v = '';
	if (typeof(e.style) != 'undefined' && e.style[property]) v = e.style[property];
	else if (e.currentStyle) v = e.currentStyle[camelCase(property)];
	else if (window.getComputedStyle) v = document.defaultView.getComputedStyle(e,null).getPropertyValue(property.replace(/([A-Z])/g,'-$1').toLowerCase());
	//if (property.toLowerCase() == 'opacity' && v == undefined) v = 1;
	if (v == undefined) v = 1;
	return v;
}

function detectMSB() {
	createCSSClass('.detect4MSB', 'position:relative;font-size:0px;left:-100px;top:-1px;height:1px;width:100px;width:10px\\9;*width:7px;_width:6px;');
	var dami = mk('detect4MSB'), r = 'others', w;
	document.body.appendChild(dami);
	w = getStyle(dami, 'width').toLowerCase();
	switch(w) {
		case '6px':
			r = 'msie6';
			break;
		case '7px':
			r = 'msie7';
			break;
		case '10px':
			w = true;
			try{createCSSClass(':root .detect4MSB', 'width:200px;');} catch(e) {w=false;}
			if (!w) r = 'msie8';
			else r = 'msie' + ((getStyle(dami, 'width').toLowerCase() == '10px') ? '8' : '');
			break;
		default:
			if (isCSSSupport('-ms-user-select')) r = 'msie';
	}//end switch
	document.body.removeChild(dami);
	createCSSClass('.detect4MSB', '');
	try{createCSSClass(':root .detect4MSB', '');} catch(e) {}
	return r;
}

function isEventSupported(eventName, element) {
	var e = mk(''), en = 'on' + eventName, isSupported;
	if (element) e = (element.tagName) ? element.cloneNode(true) : element;
	isSupported = (en in e);
	if (!isSupported && e.setAttribute) {
		if (eventName == 'focusin') {
			//https://gist.github.com/jonathantneal/7366668
			e = mk('', {tag:'a', att:{href:'#'}, s:{position:'fixed', top:'0'}});
			en = function() { isSupported = true; };
			(e.addEventListener) ? e.addEventListener('focusin', en) : e.onfocusin = en;
			document.body.appendChild(e).focus();
			document.body.removeChild(e);
			return isSupported;
		} else {
			e.setAttribute(en, '');
			isSupported = typeof e[en] == 'function';
			if (typeof e[en] != 'undefined') e[en] = null;
			e.removeAttribute(en);
		}//end if
	}//end if
	e = null;
	return isSupported;
}

function supportsWebComponents() {
	// https://drafts.csswg.org/css-scoping/#deep-combinator
	var r = {ShadowDOM: false, CustomElements: false}, b = ['', 'webkit', 'moz', 'o', 'ms'], api = 'createShadowRoot', e = mk('');
	//Shadow DOM
	for (var i=-1,l=b.length;++i<l;) {
		var s = b[i] + ((b[i]) ? capitalize(api) : api);
		if (e[s]) { r.ShadowDOM = s; break; }
	}//end for
	//template
	r.template = 'content' in document.createElement('template');
	//import
	r.imports = 'import' in document.createElement('link');
	//Custom Elements
	api = 'register';//this may change to registerElement
	for (var i=-1,l=b.length;++i<l;) {
		var s = b[i] + ((b[i]) ? capitalize(api) : api);
		if (document[s]) { r.CustomElements = s; break; }
	}//end for
	api = 'registerElement';
	for (var i=-1,l=b.length;++i<l;) {
		var s = b[i] + ((b[i]) ? capitalize(api) : api);
		if (document[s]) { r.CustomElements = s; break; }
	}//end for
	// ::shadow
	r.cssShadow = true;
	try { createCSSClass('div::shadow q', 'background:transparent;'); } catch(e) { r.cssShadow = false; }	
	// /deep/
	r.cssDeep = true;
	try { createCSSClass('div /deep/ q', 'background:transparent;'); } catch(e) { r.cssDeep = false; }
	//pseudo
	r.pseudo = true;
	try { createCSSClass('div::x-q', 'background:transparent;'); } catch(e) { r.pseudo = false; }
	//cat & hat(^^, ^)
	r.cssCat = true;
	try { createCSSClass('div^^q', 'background:transparent;'); } catch(e) { r.cssCat = false; }
	r.cssHat = true;
	try { createCSSClass('div^q', 'background:transparent;'); } catch(e) { r.cssHat = false; }
	return r;
}

function isAniSupport() {
	// var b = ['', 'webkit', 'moz', 'o', 'ms'], anis;
	var b = ['webkit', '', 'moz', 'o', 'ms'], anis;
	for (var i=-1,l=b.length;++i<l;) {
		var prefix = (b[i]) ? '-' : '', t, t2, k, a, p, af;
		t = prefix + b[i] + prefix + 'transform';
		t2 = prefix + b[i] + prefix + 'transition';
		k = prefix + b[i] + prefix + 'keyframes';
		a = prefix + b[i] + prefix + 'animation';
		p = prefix + b[i] + prefix + 'perspective';
		af = prefix + b[i] + prefix + 'animate-timing-function';
		o = prefix + b[i] + prefix + 'transform-origin';
		s = prefix + b[i] + prefix + 'transform-style';
		d = prefix + b[i] + prefix + 'transition-delay';
		du = prefix + b[i] + prefix + 'transition-duration';
		if (isCSSSupport(t) && isCSSSupport(t2)) {
			anis = {};
			anis.transform = t;
			anis.transition = t2;
			anis.keyframes = k;
			anis.animation = a;
			anis.perspective = p;
			anis.aniTimeFunc = af;
			anis.origin = o;
			anis.transformStyle = s;
			anis.delay = d;
			anis.duration = du;
			break;
		}//end if
	}//end for
	if (anis) {
		anis.eventAnimationend = (anis.transform.match(/webkit/i)) ? 'webkitAnimationEnd' : 'animationend';
		anis.eventTransition = (anis.transform.match(/webkit/i)) ? 'webkitTransitionEnd' : 'transitionend';
	}//end if
	return anis;
}

function isCSSSupport(css, element) {
	var e = mk(''), css, isSupported;
	css = (/^-ms/.test(css)) ? ('ms' + camelCase(css.replace(/-ms/,''))) : camelCase(css);
	if (element && element.tagName) e = element.cloneNode(true);
	isSupported = (css in e.style);
	e = null;
	return isSupported;
}

function isAPISupport(api, element) {
	var e = element || window, b = ['', 'webkit', 'moz', 'o', 'ms'], isSupported = '';
	for (var i=-1,l=b.length;++i<l;) {
		var s = b[i] + ((b[i]) ? capitalize(api) : api);
		if (e[s]) { isSupported = e[s]; break; }
	}//end if
	//localStorage
	if (['localStorage', 'sessionStorage'].indexOf(api) != -1 && isSupported) {
		try {
			isSupported.setItem('isapisupport', 'dummy');
			isSupported.removeItem('isapisupport');
		} catch(err) { isSupported = ''; }
	}//end if
	return isSupported;
}

function fcamelCase(all, letter) {
	return letter.toUpperCase();
}

function camelCase(str) {
	return str.replace(/-([a-z])/ig, fcamelCase);
}

function capitalize(str){
    return str.replace(/^[a-z]{1}/,function($1){return $1.toLocaleUpperCase()});
}

function getRand(min, max) {
		return Math.floor(Math.random()*(max-min+1)+min);
}

function eTrack() {
	//arguments: [elment, request, type]
	var t = arguments[0], r = arguments[1], type = arguments[2] || 't', ft = '', p;
	if (type == 't') {
		r = r.toLowerCase();
		while(t != null) {
			if (t.tagName && (t.tagName.toLowerCase() == 'body' || t.tagName.toLowerCase() == r)) break;
			t = t.parentNode;
		}//end if
		if (t && t.tagName.toLowerCase() != 'body' && r != 'body') ft = t;
	} else {
		p = new RegExp("(^|\\s)" + r + "(\\s|$)");
		while(t != null) {
			if (typeof t.className != 'undefined' && (t.className == r || p.test(t.className))) break;
			t = t.parentNode;
		}//end if
		if (t != null && typeof t.className != 'undefined' && (t.className == r || p.test(t.className))) ft = t;
	}//end if
	return ft;
}

function getKeyCode(e) {
	var KeyCode;
	if (window.event && window.event.srcElement) KeyCode = window.event.keyCode;
	else if (e && e.target) KeyCode = e.keyCode;
	return KeyCode;
}

function purge(obj) {
	if (typeof obj == 'object') {
		for (var i in obj) {
			try { obj[i] = arguments.callee(obj[i]); } catch(e) { obj[i] = null; };
			if (obj[i] instanceof Array) obj[i] = null;
		}//end if
	} else obj = null;
	return obj;
}

function tNa(e) {
	var obj = {};//t:target, a:action
	e = e._event || e;
	if (window.event && window.event.srcElement) { obj.a = window.event.type.toLowerCase(); obj.t = window.event.srcElement; }
	else if (e && e.target) { obj.a = e.type.toLowerCase(); obj.t = e.target; }
	if (obj.t && arguments[1]) obj.t = eTrack(obj.t,arguments[1],arguments[2]);
	return obj;
}

function getIns(e, cid) {
	var c = e.Data ? e : eTrack(e, cid, 'c');
	return (!c || typeof(c.Data) == 'undefined' || typeof(c.Data.ClassID) == 'undefined') ? false : window['O'+cid][cid+c.Data.ClassID];
}

function isEmptyObject(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }//end for
    return true && JSON.stringify(obj) === JSON.stringify({});
}

// function empty(element) {
// 	while(element.childNodes.length) element.removeChild(element.firstChild);
// }

function empty(element, selector) {
	if (typeof selector != 'undefined') {
		[].slice.call(element.querySelectorAll(selector)).forEach(
			function(node) {
				node.parentNode.removeChild(node);
			}
		);
	} else {
		while(element.childNodes.length) element.removeChild(element.firstChild);
	}//end if
}

function stopEvents(e, mode) {
	//mode:0/1/2 -> stopPropagation/preventDefault/both
	if (typeof(mode) == 'undefined' || [0,1].indexOf(mode) == -1) mode = 2;
	switch (mode) {
		case 0:
			(e.stopPropagation) ? e.stopPropagation() : window.event.cancelBubble = true;
			break;
		case 1:
			(e.preventDefault) ? e.preventDefault() : window.event.returnValue = false;
			break;
		default:
			if (e.stopPropagation) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				window.event.cancelBubble = true;
				window.event.returnValue = false;
			}//end if
	}//end if
	try {philosophor.reset();} catch(e) {};
}

//$H
function HO(object) {
	//hash object
	if (object instanceof HashObj) return object;
	return new HashObj(object);
};

function HashObj(object) {
	this.Constructor(object);
}

HashObj.prototype = {
	toQueryString: function() {
		var data = this;
		var parts = [];
		for (var i in data) {
			if (typeof(data[i]) == 'function') continue;
			var de = [data[i]], t = '';
			//if (typeof(data[i]) != 'string' && typeof(data[i].length) != 'undefined') {
			if (data[i] instanceof Array) {
				t = '[]';
				de = [];
				for (var j=0,len=data[i].length; j<len; j++) if (data[i][j]) de.push(data[i][j]);
				if (de.length == 0) de.push('');
			}//end if
			for (var j=0; j<de.length; j++) parts.push(encodeURIComponent(i)+t+'='+encodeURIComponent(de[j]));
		}//end for
		return parts.join('&');
	},
	Constructor: function(obj) {
		if (typeof(obj) == 'undefined') return;
		for (var i in obj) this[i] = obj[i];
	}
};

function createCSSClass(selector, style, brandNew) {
	if (!document.styleSheets || document.getElementsByTagName('head').length == 0) return;
    var styleSheet, mediaType, getSheet = false;
	if (typeof brandNew != 'undefined' && brandNew) {
		if (typeof brandNew.sheet != 'undefined') {
			styleSheet = brandNew.sheet;
			mediaType = typeof styleSheet.media;
			getSheet = true;
		} else {
			var s = document.createElement('style');
			s.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(s);
			s.usable = true;
			navigator.ssHost = document.styleSheets[document.styleSheets.length-1];
		}//end if
	}//end if
	if (!getSheet) {
		if (navigator.ssHost) {
			styleSheet = navigator.ssHost;
			mediaType = typeof styleSheet.media;
		} else {
			for (var i=-1,l=document.styleSheets.length;++i<l;) {
				var ss = document.styleSheets[i], media, isCrossDomain, mediaText;
				if (ss.disabled || (typeof ss.usable != 'undefined' && !ss.usable)) continue;
				media = ss.media;
				mediaType = typeof media;
				if (typeof ss.usable == 'undefined') ss.usable = false;
				if (mediaType == 'string') {
					try {
						isCrossDomain = (ss.rules == null) ? true : false;
					} catch(e) { isCrossDomain = true; }
					if ((media == '' || media.indexOf('screen') != -1) && !isCrossDomain) { styleSheet = ss; ss.usable = true; }
				} else if (mediaType == 'object') {
					try {
						isCrossDomain = (ss.cssRules == null) ? true : false;
						mediaText = media.mediaText;
					} catch(e) {isCrossDomain = true;}
					if (!isCrossDomain && (typeof mediaText != 'undefined' && (mediaText == '' || mediaText.indexOf('screen') != -1))) { styleSheet = ss; ss.usable = true; }
				}//end if
				if (typeof styleSheet != 'undefined') break;
			}//end for
			if (typeof styleSheet == 'undefined') {
				var s = document.createElement('style');
				s.type = 'text/css';
				document.getElementsByTagName('head')[0].appendChild(s);
				for (var i=-1,l=document.styleSheets.length;++i<l;) {
					var ss = document.styleSheets[i];
					if (ss.disabled || typeof ss.usable != 'undefined' && !ss.usable) continue;
					ss.usable = true;
					styleSheet = ss;
				}//end for
				mediaType = typeof styleSheet.media;
			}//end if
			navigator.ssHost = styleSheet;
		}//end if
	}//end if

    if (mediaType == 'string') {
		for (var i=-1,l=styleSheet.rules.length;++i<l;) if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) { styleSheet.rules[i].style.cssText = style; return; }
		styleSheet.addRule(selector, style);
    } else if (mediaType == 'object') {
		for (var i=-1,l=styleSheet.cssRules.length;++i<l;) if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) { styleSheet.cssRules[i].style.cssText = style; return; }
		styleSheet.insertRule(selector + '{' + style + '}', 0);
    }//end if
}
/*programed by mei(李維翰), http://www.facebook.com/mei.studio.li*/