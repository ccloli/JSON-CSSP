/* 
 * json-cssp - JSON with CSS Padding
 * Get JSON callback with CSS Padding, like JSONP
 * 
 * Version: 0.3 @ 2016-05-21
 * Author: ccloli (https://github.com/ccloli)
 */
'use strict';

(function (factory) {
	if ('function' === typeof define && define.amd) {
		define(factory);
	} else if ('object' === typeof module && module.exports) {
		module.exports = factory();
	} else {
		factory();
	}
})(function () {
	var nonce = new Date().getTime(),
		rurl = /(=)\?(?=&|$)|\?\?/,
		rquote = /"/g,
		wrapper = document.createElement('div');
	wrapper.setAttribute('id', 'jsoncssp');
	wrapper.setAttribute('style', 'visibility:hidden!important;height:0!important;width:0!important;position:absolute!important;left:-10000px!important;overflow:hidden!important;pointer-events:none!important');
	document.documentElement.appendChild(wrapper);

	function parseData(div) {
		var data = getComputedStyle(div, '::after').content;
		try {
			// most of time, decode content is enclosed with a double quote
			data = JSON.parse(decodeURIComponent(data.substr(1, data.length - 2)));
		} catch (error) {
			try {
				// but who knows sometime it doesn't have quote
				data = JSON.parse(decodeURIComponent(data));
			} catch (error) {
				// oh that's really bad...
				console.error('Response content is not URI-encoded JSON format, rollback to plain text.');
			}
		}
		return data
	}

	function createAddEvents(style, div, success, fail) {
		return function (res, rej) {
			style.addEventListener('load', function () {
				var data = parseData(div);
				res && res(data);
				if ('function' === typeof success) {
					setTimeout(success, 0, data); // will have a 4ms delay at least
				}
				wrapper.removeChild(div);
			});
			style.addEventListener('error', function (e) {
				rej && rej(e);
				if ('function' === typeof fail) {
					setTimeout(fail, 0, e);
				}
				wrapper.removeChild(div);
			});
		}
	}

	function jsoncssp(url, success, fail) {
		// the ID of callback css selector, like `#${elemId}`
		// e.g. Request URL: http://example.com/api.json?jsoncssp=jsoncssp-1
		//     Response CSS: #jsoncssp-1::after { content: "..."; }
		var elemId = 'jsoncssp-' + nonce;
		nonce++; // make sure that default elemId won't repeat

		var callbackName = encodeURIComponent(elemId);
		if (rurl.test(url)) { // jQuery-style url like 'http://example.com/api.json?jsoncssp=?'
			url = url.replace(rurl, '$1' + callbackName);
		} else {
			url += (url.indexOf('?') >= 0 ? '&' : '?') + 'jsoncssp=' + callbackName;
		}

		// create <style scoped> element to get request
		var style = document.createElement('style'),
			div = document.createElement('div');
		style.setAttribute('scoped', 'scoped');
		style.innerHTML = '@import url("' + url.replace(rquote, '\\"') + '")';
		div.setAttribute('id', elemId);
		div.appendChild(style);
		var addEvents = createAddEvents(style, div, success, fail),
			res = 'function' === typeof Promise ? new Promise(addEvents) : addEvents();
		wrapper.appendChild(div);
		return res;
	}

	return window.jsoncssp = jsoncssp;
});