'use strict';

const React = require('react');

module.exports = function AnimationFrameComponent(InnerComponent, throttleMs) {
    return class AnimatedComponent extends React.Component {
        constructor() {
            super();
            this.loop = this.loop.bind(this);

            this.state = {
                lastInvocationMs: 0
            };
        }

        loop(time) {
            const { lastInvocationMs } = this.state;
            const shouldInvoke = !throttleMs || time - lastInvocationMs >= throttleMs;

            if (shouldInvoke) {
                this.setState({ lastInvocationMs: time });
                this.innerComponent.onAnimationFrame(time);
            }

            requestAnimationFrame(this.loop);
        }

        componentDidMount() {
            if (!this.innerComponent.onAnimationFrame) {
                throw new Error('The component passed to AnimationFrameComponent does not implement onAnimationFrame');
            }

            requestAnimationFrame(this.loop);
        }

        render() {
            return (
                <InnerComponent ref={node => this.innerComponent = node}
                    {...this.props} />
            );
        }
    };
};