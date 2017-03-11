# React Animation Frame

[![Build Status](https://travis-ci.org/jamesseanwright/react-animation-frame.svg?branch=master)](https://travis-ci.org/jamesseanwright/react-animation-frame) [![Coverage Status](https://coveralls.io/repos/github/jamesseanwright/react-animation-frame/badge.svg?branch=master)](https://coveralls.io/github/jamesseanwright/react-animation-frame?branch=master)
[![npm version](https://badge.fury.io/js/react-animation-frame.svg)](https://www.npmjs.com/package/react-animation-frame)


A React higher-order component for invoking component repeating logic using [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

The module follows the CommonJS format, so it is compatible with Browserify and Webpack. It also supports ES5 and beyond.

## Motivation

Take a look at the [example project](https://github.com/jamesseanwright/react-animation-frame-example); this contains a `Timer` component that should animate a progress bar until the configured end time is surpassed:

```js
'use strict';

const React = require('react');
const ReactAnimationFrame = require('react-animation-frame');

class Timer extends React.Component {
	onAnimationFrame(time) {
		const progress = Math.round(time / this.props.durationMs * 100);
		this.bar.style.width = `${progress}%`;

		if (progress === 100) {
			this.props.endAnimation();
		}
	}

	render() {
		return (
			<div className="timer">
				<p>{this.props.message}</p>
				<div className="timer__bar" ref={node => this.bar = node}></div>
			</div>
		);
	}
}

module.exports = ReactAnimationFrame(Timer);
```

The `onAnimationFrame` method will be called on each repaint, via `requestAnimationFrame`, by the higher-order `ReactAnimationFrame` component. Once the progress of our animation reaches 100%, we can kill the underlying loop using the `endAnimation` method passed to the `props` of the wrapped component.

The loop can also be throttled by passing a second parameter to `ReactAnimationFrame`, which represents the number of milliseconds that should elapse between invocations of `onAnimationFrame`:

```js
module.exports = ReactAnimationFrame(Timer, 100);
```

## Installation

`npm i --save react-animation-frame`


## API

### `ReactAnimationFrame(Component[, throttleMs])`

Wraps `Component` and starts a `requestAnimationFrame` loop. `throttleMs` if specified, will throttle invocations of `onAnimationFrame` by any number of milliseconds.


### Inside a wrapped component

#### `onAnimationFrame(timestamp)`

Called on each iteration of the underlying `requestAnimationFrame` loop, or if the elapsed throttle time has been surpassed. `timestamp` is the same `DOMHighResTimeStamp` with which `requestAnimationFrame`'s callback is invoked.


#### `this.props.endAnimation()`

Cancels the current animation frame and ends the loop.


### Local development

Run `npm i` to install the dependencies.

* `npm run build` - transpile the library
* `npm test` - runs the tests
