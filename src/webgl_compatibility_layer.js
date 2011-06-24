var WebGLCompatibilityLayer = (function() {
  /**
   * new WebGLCompatibilityLayer(context)
   * context (CanvasRenderingContext2D): a 2D rendering context
   **/
  return function(canvas) {
    var c2d = canvas.getContext('2d');
    if (!c2d) throw new Error("Couldn't initialize 2D context!");
    
    var state = new WebGLState(c2d);
    var contextAttributes = new WebGLContextAttributes();

    // "readonly" attributes
    this.canvas = canvas;
    this.drawingBufferWidth = c2d.canvas.width;
    this.drawingBufferHeight = c2d.canvas.height;
    
    // special flag to check for compatibility mode
    this.isCompatibility = true;
    
    for (var konst in WEBGL_CONSTANTS)
      this[konst] = WEBGL_CONSTANTS[konst];
      
      
    this.getError = function() {
      return state.error;
    };
    
    this.getContextAttributes = function() {
      return contextAttributes;
    };
    
    this.viewport = function(x, y, w, h) {
      state.viewport[0] = x; state.viewport[1] = y;
      state.viewport[2] = w; state.viewport[3] = h;
    };
    
    this.scissor = function(x, y, w, h) {
      state.scissor_box[0] = x; state.scissor_box[1] = y;
      state.scissor_box[2] = w; state.scissor_box[3] = h;
    };
    
    this.get = function(glEnum) {
      switch(glEnum) {
        case this.VIEWPORT: return state.viewport;
        case this.MAX_VIEWPORT_DIMS: return state.viewport.subarray(2, 4);
        case this.SCISSOR_TEST: return state.scissor_test_enabled;
        case this.SCISSOR_BOX: return state.scissor_box;
        case this.VERSION: return "WebGL 1.0 Compatability Layer v1.0";
        case this.SHADING_LANGUAGE_VERSION: return "WebGL ES 1.0 Compatability Layer v1.0";
        case this.VENDOR: return "http://github.com/sinisterchipmunk/webgl-compat";
        case this.RENDERER: return "WebGL Compatability Layer";
        default: throw new Error("Unexpected enum: "+glEnum);
      };
    };
  };
})();
