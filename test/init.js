'use strict';

const { jsdom } = require('jsdom');

global.createDom = function createDom() {
	const document = jsdom(`
		<html>
			<head></head>
			<body></body>
		</html>
	`);

	global.document = document;
	global.window = document.defaultView;
	global.requestAnimationFrame = mockRaf().raf;
};

global.destroyDom = function destroyDom() {
	global.window.close();
	delete global.window;
	delete global.document;
};