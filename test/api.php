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
		$text = '#' . $callback . '::after { content: \'' . json_encode($response, JSON_HEX_APOS) . '\'; }';
	}
	echo $text;
}

jsoncssp();