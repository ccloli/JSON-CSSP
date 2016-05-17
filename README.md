JSON-CSSP
=======================

Get JSON callback with CSS Padding, like JSONP. 

Inspired by Cody Lindley's _DOM Enlightenment_ and 王集鹄's [CSST (CSS Text Transformation) Project](https://github.com/zswang/csst).


## Background

Yesterday I read Cody Lindley's _DOM Enlightenment_ , and a [chapter](http://www.domenlightenment.com/#9) shows how to get CSS rules from a style sheet. Inspired from this, I have an idea -- use CSS to get cross origin content (thought `sheet` attribute is not fullly working with cross origin CSS, that means it doesn't work). Want to know my experience? I noted them [here](http://ccloli.com/201605/get-cross-origin-data-with-css/) (Chinese only).


## How it works

Just like JSONP, when using JSONP, we create a `<script>` element and expode a callback function to get response content.

```html
<script src="/api.json?callback=jsonp_callback"></script>

<script>
function jsonp_callback(data) {
	// do something with data...
}
</script>
```

And the content of script is:
```js
jsonp_callback({"foo": "foo", "bar": "bar" ...});
```

So when JSONP script is loaded, `jsonp_callback` function will be called with response JSON data.

JSON-CSSP (Hmmm... I think `JSONCP` is a better name) likes this, but just use `<link>` instead of `<script>`.

```html
<link rel="stylesheet" type="text/css" href="/api.json?jsoncssp=jsoncssp_callback">
```

And the content of CSS is:
```css
#jsoncssp_callback::after {
	content: '{"foo": "foo", "bar": "bar", ...}';
}
```

But how can we get the `content`? We can create an element whose `ID` attribute is `jsoncssp_callback`, then use `getComputedStyle(document.getElementById('jsoncssp_callback', '::after')).content` to get its content!

Thought `json-cssp.js` is a bit complex than this, this is the main idea of `json-cssp.js`. Source code is not so hard, I think you can understand it easily. =w=


## How to use

First add `json-cssp.js` into your page.

```html
<script src="json-cssp.js"></script>
```

Then call it with JavaScript.

```js
var url = "api.json";					// Request API

var config = {							// Config of this JSON-CSSP request, optional
	"params": "jsoncssp";				// GET params of ID, optional, default: `jsoncssp`
	"id": "jsoncssp_callback";			// Callback CSS ID selector, optional, default: `jsoncssp-${count}`
};

var callback = function(data, params){	// Callback function, optional
	console.log(data);					// Decoded response JSON data, if can't be decode, it will be decoded string or raw response string
	console.log(params);				// An Object with all decoded content. `params.res` is raw content; `params.finalRes` 
										//   is processed content; `params.data` is decoded JSON, the same as `data`
};

jsoncssp(url, config, callback);		// A JSON-CSSP request with url, config and callback function

jsoncssp(url, callback);				// Or a JSON-CSSP request only with url and callback function

jsoncssp(url);							// Or I just wanna to send a request
```


## Q & A

### Why not `JSON_string`, but `encodeURI(JSON_string)`?

That's because if your JSON string contains some special characters, especially `\`, JSON-CSSP can't get correct response content. e.g.

```css
#jsoncssp-65535::after {
	content: '{"foo": "\n", "bar": "\u86e4"}';
}
```

And with `getComputedStyle()`, you can only get a JSON like this:
```js
{"foo": "n", "bar": "u86e4"}
```

So to help these poor characters, you have to encode ALL JSON string to URI format. It's not too hard, e.g. in Node.js you can use `encodeURIComponent(JSONString)`, and in PHP you can use `rawurlencode($json_string)`.

If you are sure you want to get response like JSON and don't care about that characters, try the first commit of this work.

Or how about checking [CSST](https://github.com/zswang/csst)? JSON-CSSP is inspired from it, and it uses Base64 encode and decode to transfer content. As modern browses support `atob()` to decode Base64 content, it's also a good way to save the characters.

### It's more complex than JSONP, any advantages?

Well, I'm playing with it, just to show that we can use CSS to get cross origin content with a special way. I don't think it has any exciting advantages, because CORS (Cross-origin Resource Sharing) is good enough. 

However, [CSST](https://github.com/zswang/csst) mentioned that compare with JSONP, if API is hijacked, they can use XSS to get users' Cookie or so on. But with CSS, they can do nothing but only make a mess of page (Hmmm......Though `body { display: none !important }` is interesting, or how about `html::after { content: 'ギリギリ爱~~~'; }` ?).

### What's the difference with [CSST](https://github.com/zswang/csst)?

First of all, they are not developed by the same person =p=

Secondly, I'm zaza (newbie)......

Thirdly, [CSST](https://github.com/zswang/csst) is also a good name, I don't have any good idea in making names......

Okay, stop joking. We are using the same way to reach the goal, and this work is inspired from it. We are just different in how we get content. [CSST](https://github.com/zswang/csst) uses Animation event with CSS3 Animation to catch the Base64-encoded content, and JSON-CSSP uses onload event, then append the element to catch the URI-encoded content.

### Why all [CSST](https://github.com/zswang/csst) are linked?

Because [CSST](https://github.com/zswang/csst) is AWESOME! Why not have a check?

### Any example?

Here is an example in `test/` folder, and its sample API is writen by PHP......

Don't have a PHP environment? Try the online example: http://codepen.io/ccloli/pen/VaNjvq

Don't like PHP? Why not write an example by yourself and send a Pull Request?

~~Why PHP is ****? Go home, you are junk.~~

### npm? Bower? Or others?

Sorry I'm not familiar with them, if you want to help me with them, Pull Requests are welcome.

### Find a bug?

Open an issue and ask here, or if you have already fixed it, send a PR.

### Soooooo many English mistakes in your README.md!

Hmmm...... Well, issue or PR?

### License?

How about MIT? Or WTFPL? I don't care about it, because I'm having fun on it =w=