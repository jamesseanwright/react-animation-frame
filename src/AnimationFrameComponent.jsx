'use strict';

const React = require('react');

module.exports = function AnimationFrameComponent(InnerComponent) {
	return class AnimatedComponent extends React.Component {
		constructor() {
			super();
			this.loop = this.loop.bind(this);
		}

		loop(time) {
			this.innerComponent.onAnimationFrame(time);
			requestAnimationFrame(this.loop);
		}

		componentDidMount() {
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