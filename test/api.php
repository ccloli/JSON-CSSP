<?php

function jsoncssp(){
	// callback param
	$param = 'jsoncssp';
	$callback = '';
	if ($_GET[$param]) {
		$callback = $_GET[$param];
	}

	$request = $_GET;

	$data = array(
		array(
			'foo' => 'foo',
			'bar' => 'bar'
		),
		array(
			'foo' => 'bar',
			'bar' => 'foo'
		),
		array(
			'foo' => 'f\'o\'o',
			'bar' => 'b"a"r'
		),
		array(
			'foo' => '佛哦哦',
			'bar' => '吧ＲＲ'
		),
		array(
			'foo' => '~!@#$%^&*()_+-={}[]|\\:;<>,.?/',
			'bar' => '      '
		)
	);

	$response = array(
		'request' => $request,
		'data' => $data,
		'timeStamp' => time(),
		'status' => 1,
		'message' => 'success'
	);

	if (empty($callback)) {
		header('Content-Type: text/plain; charset: utf-8');
		$text = json_encode($response);
	}
	else {
		header('Content-Type: text/css; charset: utf-8');
		$text = '#' . $callback . '::after { content: \'' . rawurlencode(json_encode($response)) . '\'; }';
	}
	echo $text;
}

jsoncssp();