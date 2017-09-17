'use strict';

const React = require('react');

module.exports = function AnimationFrameComponent(InnerComponent, throttleMs) {
    return class AnimatedComponent extends React.Component {
        constructor() {
            super();

            this.loop = this.loop.bind(this);
            this.endAnimation = this.endAnimation.bind(this);
            this.startAnimation = this.startAnimation.bind(this);

            this.state = {
                isActive: true,
                rafId: 0,
                lastInvocationMs: 0
            };
        }

        loop(time) {
            const { lastInvocationMs, isActive } = this.state;

            if (!isActive) {
                return;
            }

            const shouldInvoke = !throttleMs || time - lastInvocationMs >= throttleMs;

            if (shouldInvoke) {
                this.setState({ lastInvocationMs: time });
                this.innerComponent.onAnimationFrame(time, lastInvocationMs);
            }

            this.setState({
                rafId: requestAnimationFrame(this.loop)
            });
        }

        endAnimation() {
            cancelAnimationFrame(this.state.rafId);

            this.setState({
                isActive: false
            });
        }

        startAnimation() {
            if (!this.state.isActive) {
                this.setState({
                    isActive: true,
                    rafId: requestAnimationFrame(this.loop)
                });
            }
        }

        componentDidMount() {
            if (!this.innerComponent.onAnimationFrame) {
                throw new Error('The component passed to AnimationFrameComponent does not implement onAnimationFrame');
            }

            this.setState({
                rafId: requestAnimationFrame(this.loop)
            });
        }

        render() {
            return (
                <InnerComponent ref={node => this.innerComponent = node}
                                endAnimation={this.endAnimation}
                                startAnimation={this.startAnimation}
                                {...this.props} />
            );
        }
    };
};