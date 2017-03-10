# React Animation Frame

A React higher-order component for invoking component repeating logic using [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).


## Motivation

Say we have a `<Ball />` component that is rendered via, whose position should increase on every frame. Using `requestAnimationFrame` ensures that this is synchronised with the user's refresh rate, as well as benefiting from the various performance optimisations that are implemented as part of this API.

