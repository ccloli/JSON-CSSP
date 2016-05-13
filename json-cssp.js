/* 
 * json-cssp - JSON with CSS Padding
 * Get JSON callback with CSS Padding, like JSONP
 * 
 * Version: 0.1 @ 2016-05-13
 * Author: ccloli (https://github.com/ccloli)
 */

(function(){
	'use strict';

	var count = 0;

	function jsoncssp(url, config, callback){
		// if config is a function, only url and callback are used
		if (typeof config === 'function') {
			callback = config;
			config = {};
		}

		// set default value if config is not defined
		config = config || {};

		// the GET param of callback, like `?${param}=${elemId}`
		// e.g. Request URL: http://example.com/api.json?jsoncssp=jsoncssp-1
		var param = config.param || 'jsoncssp'; 

		// the ID of callback css selector, like `#${elemId}`
		// if you are using custom ID, be sure that it doesn't repeat in current page
		// e.g. Request URL: http://example.com/api.json?jsoncssp=jsoncssp-1
		//     Response CSS: #jsoncssp-1::after { content: '...'; }
		var elemId = config.id || ('jsoncssp-' + count);
		count++; // make sure that default elemId won't repeat

		url += (url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(param) + '=' + encodeURIComponent(elemId);

		// create <link> element to get request
		var link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', url);
		link.addEventListener('load', function(event){
			if (typeof callback === 'function') {
				// create element to get response content in pseudo-elements
				var div = document.createElement('div');
				div.setAttribute('id', elemId);
				document.body.appendChild(div);

				var res = getComputedStyle(div, '::after').content;
				var finalRes, data;
				try {
					finalRes = res.substr(1, res.length - 2).replace(/\\"/g, '"');
					data = JSON.parse(finalRes);
				}
				catch (error) {
					console.error('Response content is not JSON format, rollback to plain text.');
					data = res;
				}
				//console.log(res, finalRes, data);
				callback.apply(this, [data, {
					res: res,
					finalRes: finalRes || res,
					data: data || res
				}]);

				document.body.removeChild(div);
			}

			document.head.removeChild(link);
		});
		document.head.appendChild(link);
	}

	window.jsoncssp = jsoncssp;
})();