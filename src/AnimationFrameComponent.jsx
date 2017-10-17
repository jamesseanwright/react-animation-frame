'use strict';

const React = require('react');

module.exports = function AnimationFrameComponent(InnerComponent, throttleMs) {
    return class AnimatedComponent extends React.Component {
        constructor() {
            super();

            this.loop = this.loop.bind(this);
            this.endAnimation = this.endAnimation.bind(this);
            this.startAnimation = this.startAnimation.bind(this);
            this.rafId = 0;
            this.lastInvocationMs = 0;
            this.state = {
                isActive: true
            };
        }

        loop(time) {
            const { isActive } = this.state;
            const { lastInvocationMs } = this;
            const isAnimatable = !!(
                this.innerComponent && this.innerComponent.onAnimationFrame
            );

            // Latter const is defensive check for React Native unmount (issues/#3)
            if (!isActive || !isAnimatable) return;

            const hasTimeElapsed =
                !throttleMs || time - lastInvocationMs >= throttleMs;

            if (hasTimeElapsed) {
                this.lastInvocationMs = time;
                this.innerComponent.onAnimationFrame(time, lastInvocationMs);
            }

            this.rafId = requestAnimationFrame(this.loop);
        }

        endAnimation() {
            if (this.state.isActive) {
                cancelAnimationFrame(this.rafId);

                this.setState({
                    isActive: false
                });
            }
        }

        startAnimation() {
            if (!this.state.isActive) {
                this.setState({
                    isActive: true
                });
                this.rafId = requestAnimationFrame(this.loop);
            }
        }

        componentDidMount() {
            if (!this.innerComponent.onAnimationFrame) {
                throw new Error(
                    'The component passed to AnimationFrameComponent does not implement onAnimationFrame'
                );
            }
            this.rafId = requestAnimationFrame(this.loop);
        }

        componentWillUnmount() {
            this.endAnimation();
        }

        render() {
            return (
                <InnerComponent
                    ref={node => (this.innerComponent = node)}
                    endAnimation={this.endAnimation}
                    startAnimation={this.startAnimation}
                    {...this.props}
                />
            );
        }
    };
};
