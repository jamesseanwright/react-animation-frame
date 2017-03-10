'use strict';

const enzyme = require('enzyme');
const React = require('react');
const { expect } = require('chai');
const sinon = require('sinon');

const AnimationFrameComponent = require('../dist/AnimationFrameComponent');

class InnerComponent extends React.Component {
	onAnimationFrame() {}

	render() {
		return <p>Foo</p>;
	}
}

describe('the RequestAnimationFrame HOC', function () {
	let mockComponent;

	beforeEach(function () {
		mockComponent = sinon.mock(InnerComponent.prototype);
		createDom();
	});

	afterEach(function () {
		mockComponent.restore();
		destroyDom();
	});

	it('should pass all properties to the wrapped component', function () {
		const WrappedComponent = AnimationFrameComponent(InnerComponent);

		const renderedComponent = enzyme.mount(
			<WrappedComponent foo="bar" baz={1} />
		);

		const innerComponent = renderedComponent.find(InnerComponent);

		expect(renderedComponent.props()).to.deep.equal(innerComponent.props());
	});

	it('should call onAnimationFrame on each frame', function () {
		mockComponent.expects('onAnimationFrame')
			.thrice()
			.withArgs(sinon.match.number);

		const WrappedComponent = AnimationFrameComponent(InnerComponent);

		enzyme.mount(<WrappedComponent />);

		mockRaf.step({ count: 3 });

		mockComponent.verify();
	});
});