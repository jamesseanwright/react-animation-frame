'use strict';

const { jsdom } = require('jsdom');
const createMockRaf = require('mock-raf');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const adapter = new Adapter();

enzyme.configure({ adapter });

global.createDom = function createDom() {
    const mockRaf = createMockRaf();

    const document = jsdom(`
        <html>
            <head></head>
            <body></body>
        </html>
    `);

    global.document = document;
    global.window = document.defaultView;
    global.mockRaf = mockRaf;
    global.requestAnimationFrame = mockRaf.raf;
    global.cancelAnimationFrame = () => {};
};

global.destroyDom = function destroyDom() {
    global.window.close();
    delete global.window;
    delete global.document;
};
