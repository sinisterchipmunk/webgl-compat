## Disclaimer

This project is under heavy development. Currently, it won't work -- period. I'm still working on framebuffer, renderbuffer and texture support; without these, nothing can be rendered at all. Just so you know: it's not usable yet. On the other hand, if you're here to help, welcome aboard! Please feel free to fork the project, commit some code and send me a pull request.

## About this project

This project is an attempt at writing a pure-JavaScript WebGL compatibility layer. The goal is to produce a library that emulates WebGL functionality by wrapping around a Canvas2D context.

The library is intended to be entirely standards compliant, and therefore compatible with any WebGL framework or usage. It attempts to implement the WebGL specification (http://www.khronos.org/registry/webgl/specs/latest) and produce results as closely as possible to a native WebGL context.

Usage is simple. Replace the normal WebGL context creation:

    var canvas = document.getElementById('my-canvas');
    var context = canvas.getContext("experimental-webgl");
    
with this:

    var canvas = document.getElementById('my-canvas');
    var context = canvas.getWebGLCompatibleContext();

The library will check for WebGL availability and, if present, use it; if the browser doesn't support WebGL, the library will wrap a 2D context, and the object returned can be used identically to any other WebGL context.

Alternatively, you can bypass "true" WebGL and use this library exclusively like so:

    var canvas = document.getElementById('my-canvas');
    var context = new WebGLCompatibilityLayer(canvas);
    
Though, outside of testing purposes, I don't know why you'd want to do this.
    
## A note on performance

My first proof of concept (which was just a bunch of hacked-together code which did NOT use this library; it's available at http://github.com/sinisterchipmunk/webgl-compat/tree/master/poc/poc.htm) showed that Internet Explorer can maintain 42 frames per second (on my box) rendering 25 rotating triangles to the canvas. I took this to mean that Canvas2D is fast enough under Internet Explorer to at least have a *chance* of making this library viable (or else I wouldn't have started writing it to begin with). Once more advanced features like depth testing and the like are implemented, framerate will likely drop precipitously; however, the drops that I'm expecting would likely correlate directly to the number of pixels being processed and the general speed of the JavaScript interpreter and the machine itself. I'm confident that framerates can be kept to acceptable levels.

This library is being developed exclusively for compatibility with Internet Explorer; it should _work_ on other browsers, but performance could be impacted considerably. For instance, the proof of concept mentioned in the above paragraph, which maintained a steady 42 frames per second on IE, averaged only 13-15 frames per second on Chrome. On the other hand, Chrome supports WebGL natively, so I consider this a non-issue.
