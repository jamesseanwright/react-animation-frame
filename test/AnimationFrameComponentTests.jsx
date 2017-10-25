'use strict';

const enzyme = require('enzyme');
const React = require('react');
const { expect } = require('chai');
const sinon = require('sinon');

const AnimationFrameComponent = require('../src/AnimationFrameComponent');

class InnerComponent extends React.Component {
    onAnimationFrame() {}

    render() {
        return <p>Foo</p>;
    }
}

class NonAnimatable extends React.Component {
    render() {
        return <p>Can't be animated!</p>;
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

    it('should throw an error if the inner component doesn`t implement onAnimationFrame', function () {
        const WrappedComponent = AnimationFrameComponent(NonAnimatable);

        expect(() => enzyme.mount(<WrappedComponent />)).to.throw(
            'The component passed to AnimationFrameComponent does not implement onAnimationFrame'
        );
    });

    it('should pass all properties to the wrapped component', function () {
        const WrappedComponent = AnimationFrameComponent(InnerComponent);

        const renderedComponent = enzyme.mount(
            <WrappedComponent foo="bar" baz={1} />
        );

        const innerComponent = renderedComponent.find(InnerComponent);

        expect(renderedComponent.prop('foo')).to.deep.equal(innerComponent.prop('foo'));
        expect(renderedComponent.prop('baz')).to.deep.equal(innerComponent.prop('baz'));
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

    it('should pass the current and previous times to onAnimationFrame', function () {
        mockComponent.expects('onAnimationFrame')
            .withArgs(16.666666666666668, 0)
            .onFirstCall();

        mockComponent.expects('onAnimationFrame')
            .withArgs(33.333333333333336, 16.666666666666668)
            .onSecondCall();

        const WrappedComponent = AnimationFrameComponent(InnerComponent);

        enzyme.mount(<WrappedComponent />);
        mockRaf.step({ count: 2 });

        mockComponent.verify();
    });

    it('should stop looping when the endAnimation method is invoked', function () {
        mockComponent.expects('onAnimationFrame')
            .once()
            .withArgs(sinon.match.number);

        const WrappedComponent = AnimationFrameComponent(InnerComponent);
        const renderedComponent = enzyme.mount(<WrappedComponent />);
        const innerComponent = renderedComponent.find(InnerComponent);

        mockRaf.step({ count: 1 });

        innerComponent.prop('endAnimation')();

        mockRaf.step({ count: 3 });

        mockComponent.verify();
    });

    it('should restart looping when the startAnimation method is invoked', function () {
        mockComponent.expects('onAnimationFrame')
            .twice()
            .withArgs(sinon.match.number);

        const WrappedComponent = AnimationFrameComponent(InnerComponent);
        const renderedComponent = enzyme.mount(<WrappedComponent />);
        const innerComponent = renderedComponent.find(InnerComponent);

        mockRaf.step({ count: 1 });

        innerComponent.prop('endAnimation')();

        mockRaf.step({ count: 3 });

        innerComponent.prop('startAnimation')();

        mockRaf.step({ count: 1 });

        mockComponent.verify();
    });

    it('should throttle the invocation of the callback if specified', function (done) {
        this.timeout(4000);

        const rafIntervalMs = 16; // fixing rAF interval for predictable testing
        const throttleMs = 1000;
        const invocationCount = 3;
        const stepCount = Math.ceil(throttleMs / rafIntervalMs) * invocationCount;

        mockComponent.expects('onAnimationFrame')
            .exactly(invocationCount)
            .withArgs(sinon.match.number);

        const WrappedComponent = AnimationFrameComponent(InnerComponent, throttleMs);

        enzyme.mount(<WrappedComponent />);

        mockRaf.step({ count: stepCount, time: rafIntervalMs });

        /* While this is generally a bad practice,
         * fake timers can't be used as the component
         * is tracking elapsed time between each rAF
         * loop invocation. */
        setTimeout(() => {
            mockComponent.verify();
            done();
        }, throttleMs * invocationCount + 5);
    });

    describe('React Native unmount bug resolution', function () {
        it('should not call onAnimationFrame when the child unmounts', function () {
            mockComponent.expects('onAnimationFrame')
                .never();

            const WrappedComponent = AnimationFrameComponent(InnerComponent);
            const renderedComponent = enzyme.mount(<WrappedComponent />);

            renderedComponent.instance().innerComponent = null;
            mockRaf.step({ count: 2 });

            mockComponent.verify();
        });

        it('should not call onAnimationFrame it becomes unavailable', function () {
            mockComponent.expects('onAnimationFrame')
                .never();

            const WrappedComponent = AnimationFrameComponent(InnerComponent);
            const renderedComponent = enzyme.mount(<WrappedComponent />);

            renderedComponent.instance().innerComponent.onAnimationFrame = null;
            mockRaf.step({ count: 2 });

            mockComponent.verify();
        });
    });
});
